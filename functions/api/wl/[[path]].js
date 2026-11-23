// Weekline v2 API (Cloudflare Pages Function, D1 binding WL, KV binding BUILDS for rate limits).
// Every route lives under /api/wl/. JSON in, JSON out, errors are { error: "plain words" }.
//
// Accounts   POST signup {email, password, name} · POST signin {email, password} · POST signout
//            GET me · DELETE me · GET export
// Memory     PUT profile {data, name?} · PUT locks {items} · POST signals {items}
// Calendar   POST feed {reset?} -> {url, webcal} · GET ics/<token>.ics
// Crew       POST invites {event} · GET invites/<token> · POST invites/<token>/rsvp {name, status, device}
//            POST polls {question, options} · GET polls/<token> · POST polls/<token>/vote {option, device}
// Google     GET google/status · GET google/start (302 to Google) · GET google/callback (302 back to #/you)
//            GET google/busy?from=<RFC3339>&to=<RFC3339> -> {busy:[{start,end}]} · POST google/disconnect
//            Scope is calendar.freebusy only: busy blocks, never event names. Secrets: GOOGLE_CLIENT_ID,
//            GOOGLE_CLIENT_SECRET, WL_TOKEN_KEY (base64, 32 bytes, AES-GCM for refresh tokens at rest).
//            GOOGLE_MOCK=1 (localhost only) fakes Google for local tests.
//
// Passwords and tokens are never logged. Session tokens are stored only as SHA-256 hashes.

const COOKIE = 'wl_session';
const SESSION_DAYS = 30;
const ITER = 100000; // PBKDF2-SHA256 (Workers' max)
const MAX_BODY = 100 * 1024;
const MAX_PROFILE = 20 * 1024;
const MAX_SIGNALS_PER_CALL = 200;
const MAX_SIGNALS_KEPT = 5000;
const MAX_LOCKS = 100;
const MAX_RSVPS = 500;
const MAX_VOTES = 500;
const KINDS = new Set(['went', 'loved', 'lock', 'unlock', 'skip', 'ics', 'rsvp']);
const ALLOWED_ORIGINS = [/^https:\/\/([a-z0-9-]+\.)?vargas-studio\.pages\.dev$/, /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/];
const APP_PATH = '/projects/weekline/v2/';

const enc = new TextEncoder();
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const randHex = (n) => hex(crypto.getRandomValues(new Uint8Array(n)));
const randToken = (n) =>
  btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(n)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const sha = async (s) => hex(await crypto.subtle.digest('SHA-256', enc.encode(s)));

class Bad extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });

// ---------- input checks ----------

const CONTROL = /[\u0000-\u001F\u007F-\u009F\u2028\u2029]/g;

/** Clean text: strip control characters, trim; reject (400) when too long or required and empty. */
function text(v, max, label, required = false) {
  if (v === undefined || v === null || v === '') {
    if (required) throw new Bad(`Add ${label}.`);
    return null;
  }
  if (typeof v !== 'string') throw new Bad(`${cap(label)} should be text.`);
  const s = v.normalize('NFC').replace(CONTROL, ' ').replace(/\s+/g, ' ').trim();
  if (!s) { if (required) throw new Bad(`Add ${label}.`); return null; }
  if (s.length > max) throw new Bad(`${cap(label)} is too long (${max} characters max).`);
  return s;
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function email(v) {
  const s = typeof v === 'string' ? v.trim().toLowerCase() : '';
  if (s.length > 254 || !/^[^\s@<>()[\]\\,;:"]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/.test(s))
    throw new Bad('Enter a real email.');
  return s;
}

/** First name only (first word), letters plus ' . - , max 40. */
function firstName(v, required = true) {
  const s = text(v, 200, 'a first name', required);
  if (!s) return null;
  const first = s.split(' ')[0];
  if (first.length > 40 || !/^[\p{L}\p{M}][\p{L}\p{M}'’.-]*$/u.test(first)) throw new Bad('Use just your first name, in letters.');
  return first;
}
const displayFirst = (name) => (name || '').split(' ')[0].slice(0, 40) || 'Friend';

function device(v) {
  if (typeof v !== 'string' || !/^[A-Za-z0-9_-]{8,64}$/.test(v)) throw new Bad('Missing device id.');
  return v;
}
function url(v) {
  const s = text(v, 500, 'the link');
  if (!s) return null;
  let u;
  try { u = new URL(s); } catch { throw new Bad('That link is not valid.'); }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new Bad('Links must start with http or https.');
  return u.toString();
}
function plainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

/** Parse a date or time the client sends.
 *  "2026-11-24"               -> all-day
 *  "2026-11-24T19:00[:00]"    -> New York local time (written with TZID=America/New_York)
 *  "2026-11-25T00:00:00Z" / "+hh:mm" offset -> exact instant (written in UTC) */
function when(v, label, required) {
  const s = text(v, 40, label, required);
  if (!s) return null;
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m && validParts(+m[1], +m[2], +m[3], 0, 0, 0)) return { kind: 'date', raw: s, ics: m[1] + m[2] + m[3] };
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (m && validParts(+m[1], +m[2], +m[3], +m[4], +m[5], +(m[6] || 0)))
    return { kind: 'local', raw: s, ics: `${m[1]}${m[2]}${m[3]}T${m[4]}${m[5]}${m[6] || '00'}` };
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/.test(s)) {
    const d = new Date(s);
    if (!isNaN(d.getTime()) && d.getUTCFullYear() >= 2000 && d.getUTCFullYear() <= 2100) return { kind: 'utc', raw: s, ics: icsUtc(d) };
  }
  throw new Bad(`${cap(label)} should look like 2026-11-24T19:00.`);
}
function validParts(y, mo, d, h, mi, se) {
  if (y < 2000 || y > 2100) return false;
  const t = new Date(Date.UTC(y, mo - 1, d, h, mi, se));
  return t.getUTCFullYear() === y && t.getUTCMonth() === mo - 1 && t.getUTCDate() === d && t.getUTCHours() === h && t.getUTCMinutes() === mi && t.getUTCSeconds() === se;
}
const icsUtc = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** Event snapshot shared on invites and locks. */
function cleanEvent(e, { needId = false, needStart = false } = {}) {
  if (!plainObject(e)) throw new Bad('Missing event.');
  const out = {};
  if (needId || e.event_id !== undefined) out.event_id = text(e.event_id, 120, 'the event id', needId);
  out.title = text(e.title, 120, 'a title', true);
  const start = when(e.start, 'the start time', needStart);
  const end = when(e.end, 'the end time', false);
  if (start) out.start = start.raw;
  if (end) out.end = end.raw;
  const opt = { when: [60, 'the time'], place: [120, 'the place'], source: [40, 'the source'], goal: [40, 'the goal'] };
  for (const [k, [max, label]] of Object.entries(opt)) {
    const v = text(e[k], max, label);
    if (v) out[k] = v;
  }
  const u = url(e.url);
  if (u) out.url = u;
  return out;
}

async function readJson(req) {
  const len = Number(req.headers.get('content-length') || 0);
  if (len > MAX_BODY) throw new Bad('That request is too big.', 413);
  const raw = await req.text();
  if (raw.length > MAX_BODY) throw new Bad('That request is too big.', 413);
  if (!raw) return {};
  let b;
  try { b = JSON.parse(raw); } catch { throw new Bad('Send JSON.'); }
  if (!plainObject(b)) throw new Bad('Send a JSON object.');
  return b;
}

// ---------- origin + rate limits ----------

function originOk(req, path) {
  const o = req.headers.get('origin');
  const readOnly = req.method === 'GET' || req.method === 'HEAD';
  if (readOnly && path.startsWith('ics/')) return true; // calendar apps fetch the feed from anywhere
  if (readOnly && (path === 'google/start' || path === 'google/callback')) return true; // top-level navigations; state + session protect them
  if (!o) return readOnly; // browsers always send Origin on POST/PUT/DELETE
  return ALLOWED_ORIGINS.some((r) => r.test(o));
}

async function ipKey(req) {
  const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || 'local';
  return (await sha('wl-ip:' + ip)).slice(0, 24); // no raw IPs in KV
}
function bucket(name, ip, windowSec) {
  return { key: `wl:${name}:${ip}:${Math.floor(Date.now() / 1000 / windowSec)}`, ttl: windowSec + 60 };
}
async function used(env, b) {
  if (!env.BUILDS) return 0;
  return Number((await env.BUILDS.get(b.key)) || 0);
}
async function bump(env, b, n) {
  if (env.BUILDS) await env.BUILDS.put(b.key, String(n + 1), { expirationTtl: b.ttl });
}
/** Count this call and refuse once `max` is reached in the window. */
async function take(env, req, name, max, windowSec, why) {
  const b = bucket(name, await ipKey(req), windowSec);
  const n = await used(env, b);
  if (n >= max) throw new Bad(why, 429);
  await bump(env, b, n);
}
const TOO_MANY_AUTH = 'Too many tries. Wait 10 minutes and try again.';
const TOO_MANY_CREW = 'Too many taps for now. Try again in an hour.';

// ---------- passwords + sessions ----------

async function pbkdf2(password, saltHex) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const salt = new Uint8Array(saltHex.match(/../g).map((h) => parseInt(h, 16)));
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITER }, key, 256));
}
function same(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
function cookie(req, token, maxAge) {
  const secure = new URL(req.url).protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}
function readCookie(req) {
  const m = (req.headers.get('cookie') || '').match(/(?:^|;\s*)wl_session=([a-f0-9]{64})(?:;|$)/);
  return m ? m[1] : null;
}
async function newSession(env, req, userId) {
  const token = randHex(32);
  const now = Date.now();
  await env.WL.batch([
    env.WL.prepare('DELETE FROM sessions WHERE user_id = ? AND expires_at < ?').bind(userId, now),
    env.WL.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').bind(await sha(token), userId, now + SESSION_DAYS * 864e5),
  ]);
  return cookie(req, token, SESSION_DAYS * 86400);
}
async function currentUser(env, req) {
  const token = readCookie(req);
  if (!token) return null;
  return env.WL.prepare('SELECT u.id, u.email, u.name, u.created_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?')
    .bind(await sha(token), Date.now()).first();
}
async function needUser(env, req) {
  const u = await currentUser(env, req);
  if (!u) throw new Bad('Sign in first.', 401);
  return u;
}
const publicUser = (u) => ({ id: u.id, email: u.email, name: u.name, created_at: u.created_at });

async function loadProfile(env, userId) {
  const row = await env.WL.prepare('SELECT data FROM profiles WHERE user_id = ?').bind(userId).first();
  try { return row ? JSON.parse(row.data) : {}; } catch { return {}; }
}
async function saveProfile(env, userId, data) {
  await env.WL.prepare(
    'INSERT INTO profiles (user_id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at'
  ).bind(userId, JSON.stringify(data), Date.now()).run();
}
const signalRow = (r) => ({ event_id: r.event_id, kind: r.kind, reason: r.reason || null, tags: r.tags ? JSON.parse(r.tags) : [], at: r.at });

// ---------- .ics ----------

const VTIMEZONE = [
  'BEGIN:VTIMEZONE', 'TZID:America/New_York', 'X-LIC-LOCATION:America/New_York',
  'BEGIN:DAYLIGHT', 'TZOFFSETFROM:-0500', 'TZOFFSETTO:-0400', 'TZNAME:EDT', 'DTSTART:19700308T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU', 'END:DAYLIGHT',
  'BEGIN:STANDARD', 'TZOFFSETFROM:-0400', 'TZOFFSETTO:-0500', 'TZNAME:EST', 'DTSTART:19701101T020000', 'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU', 'END:STANDARD',
  'END:VTIMEZONE',
];
const icsText = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** Fold to 75 octets per line (RFC 5545 3.1), never splitting a UTF-8 character. */
function fold(line) {
  const out = [];
  let cur = '', bytes = 0;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    if (bytes + b > 75) { out.push(cur); cur = ' '; bytes = 1; }
    cur += ch;
    bytes += b;
  }
  out.push(cur);
  return out.join('\r\n');
}
function dtLine(name, w) {
  if (w.kind === 'date') return `${name};VALUE=DATE:${w.ics}`;
  if (w.kind === 'local') return `${name};TZID=America/New_York:${w.ics}`;
  return `${name}:${w.ics}`;
}
function nextDay(ymd) {
  const d = new Date(Date.UTC(+ymd.slice(0, 4), +ymd.slice(4, 6) - 1, +ymd.slice(6, 8) + 1));
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}
async function buildIcs(userId, locks) {
  const stamp = icsUtc(new Date());
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Vargas Studio//Weekline 2//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'X-WR-CALNAME:Weekline', 'X-WR-TIMEZONE:America/New_York', 'REFRESH-INTERVAL;VALUE=DURATION:PT6H', 'X-PUBLISHED-TTL:PT6H',
    ...VTIMEZONE,
  ];
  for (const l of locks) {
    let start, end;
    try { start = when(l.start, 'start', true); end = l.end ? when(l.end, 'end', false) : null; } catch { continue; }
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${(await sha(userId + '|' + l.event_id)).slice(0, 32)}@weekline.vargas-studio.pages.dev`);
    lines.push(`DTSTAMP:${stamp}`);
    lines.push(dtLine('DTSTART', start));
    if (end && end.kind === start.kind && end.ics > start.ics) lines.push(dtLine('DTEND', end));
    else if (start.kind === 'date') lines.push(`DTEND;VALUE=DATE:${nextDay(start.ics)}`);
    else lines.push('DURATION:PT2H');
    lines.push(`SUMMARY:${icsText(l.title)}`);
    if (l.place) lines.push(`LOCATION:${icsText(l.place)}`);
    const desc = [l.source ? `Source: ${l.source}` : '', 'Planned with Weekline'].filter(Boolean).join('\n');
    lines.push(`DESCRIPTION:${icsText(desc)}`);
    if (l.url) lines.push(`URL:${l.url}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}

// ---------- crew helpers ----------

async function inviteView(env, token, me) {
  const inv = await env.WL.prepare('SELECT i.event, u.name AS host FROM invites i LEFT JOIN users u ON u.id = i.owner_id WHERE i.token = ?').bind(token).first();
  if (!inv) throw new Bad('That invite link is not valid.', 404);
  const [counts, names, mine] = await Promise.all([
    env.WL.prepare('SELECT status, COUNT(*) AS n FROM rsvps WHERE invite_token = ? GROUP BY status').bind(token).all(),
    env.WL.prepare("SELECT name FROM rsvps WHERE invite_token = ? AND status = 'in' ORDER BY at LIMIT 50").bind(token).all(),
    me ? env.WL.prepare('SELECT status FROM rsvps WHERE invite_token = ? AND device = ?').bind(token, me).first() : null,
  ]);
  const c = { in: 0, maybe: 0 };
  for (const r of counts.results) c[r.status] = r.n;
  return { event: JSON.parse(inv.event), host: inv.host ? displayFirst(inv.host) : null, counts: c, names: names.results.map((r) => r.name), you: mine ? mine.status : null };
}
async function pollView(env, token, me) {
  const p = await env.WL.prepare('SELECT question, options FROM polls WHERE token = ?').bind(token).first();
  if (!p) throw new Bad('That poll link is not valid.', 404);
  const options = JSON.parse(p.options);
  const [rows, mine] = await Promise.all([
    env.WL.prepare('SELECT option, COUNT(*) AS n FROM votes WHERE poll_token = ? GROUP BY option').bind(token).all(),
    me ? env.WL.prepare('SELECT option FROM votes WHERE poll_token = ? AND device = ?').bind(token, me).first() : null,
  ]);
  const votes = options.map(() => 0);
  for (const r of rows.results) if (r.option >= 0 && r.option < votes.length) votes[r.option] = r.n;
  return { question: p.question, options, votes, you: mine ? mine.option : null };
}
/** Who is acting on a crew link: signed-in people count once across devices. */
function actor(user, v) {
  return user ? 'u:' + user.id : device(v);
}
function optionalActor(user, v) {
  if (user) return 'u:' + user.id;
  return typeof v === 'string' && /^[A-Za-z0-9_-]{8,64}$/.test(v) ? v : null;
}
const TOKEN = /^[A-Za-z0-9_-]{16,64}$/;

// ---------- Google Calendar (busy times only) ----------

const G_SCOPE = 'https://www.googleapis.com/auth/calendar.freebusy';
const G_AUTH = 'https://accounts.google.com/o/oauth2/v2/auth';
const G_TOKEN = 'https://oauth2.googleapis.com/token';
const G_REVOKE = 'https://oauth2.googleapis.com/revoke';
const G_FREEBUSY = 'https://www.googleapis.com/calendar/v3/freeBusy';
const G_MAX_DAYS = 62;
const YOU_URL = APP_PATH + '#/you';
const G_DOWN = "Google Calendar didn't answer. Try again soon.";

const b64e = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const b64d = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const b64url = (buf) => b64e(buf).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/** All three secrets present (and the key really is 32 bytes), plus KV for the one-time state. */
function gConfigured(env) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.WL_TOKEN_KEY || !env.BUILDS) return false;
  try { return b64d(String(env.WL_TOKEN_KEY).trim()).length === 32; } catch { return false; }
}
/** Fake Google for local tests. Only when GOOGLE_MOCK is exactly "1" AND the request is to localhost. */
function gMock(env, req) {
  return env.GOOGLE_MOCK === '1' && ['127.0.0.1', 'localhost'].includes(new URL(req.url).hostname);
}
async function aesKey(env) {
  return crypto.subtle.importKey('raw', b64d(String(env.WL_TOKEN_KEY).trim()), 'AES-GCM', false, ['encrypt', 'decrypt']);
}
/** Encrypt a token for one user (user id bound as additional data, so rows can't be swapped). */
async function seal(env, userId, plain) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: enc.encode('wl-google:' + userId) }, await aesKey(env), enc.encode(plain));
  return { enc: b64e(ct), iv: b64e(iv) };
}
async function unseal(env, userId, encB64, ivB64) {
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64d(ivB64), additionalData: enc.encode('wl-google:' + userId) }, await aesKey(env), b64d(encB64));
  return new TextDecoder().decode(pt);
}
function redirect(location) {
  return new Response(null, { status: 302, headers: { location, 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' } });
}
/** POST a form to Google. Returns {ok, status, data}; never throws on a Google error body. */
async function gForm(url, params) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
    signal: AbortSignal.timeout(8000),
  });
  let data = {};
  try { data = await res.json(); } catch { /* revoke answers with an empty body */ }
  return { ok: res.ok, status: res.status, data };
}
const gatKey = (userId) => `wl:gat:${userId}`;
const gRow = (env, userId) => env.WL.prepare('SELECT enc_refresh, iv, scope, connected_at FROM google_tokens WHERE user_id = ?').bind(userId).first();

async function cacheAccess(env, userId, token, expiresIn) {
  const secs = Math.max(0, Math.floor(Number(expiresIn) || 3600) - 60);
  if (secs < 60 || !token) return; // KV's shortest TTL is 60 s
  const sealed = await seal(env, userId, token);
  await env.BUILDS.put(gatKey(userId), JSON.stringify({ ...sealed, exp: Date.now() + secs * 1000 }), { expirationTtl: secs });
}
/** A fresh access token, from the KV cache or by refreshing. Returns null when Google says the grant is gone. */
async function gAccess(env, userId, row, { mock, force = false } = {}) {
  if (mock) return 'mock-access';
  if (!force) {
    const c = await env.BUILDS.get(gatKey(userId), 'json');
    if (c && c.exp > Date.now()) {
      try { return await unseal(env, userId, c.enc, c.iv); } catch { /* key changed: refresh below */ }
    }
  }
  const refresh = await unseal(env, userId, row.enc_refresh, row.iv);
  const r = await gForm(G_TOKEN, { client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET, refresh_token: refresh, grant_type: 'refresh_token' });
  if (!r.ok) {
    if (r.data && r.data.error === 'invalid_grant') return null;
    throw new Bad(G_DOWN, 502);
  }
  await cacheAccess(env, userId, r.data.access_token, r.data.expires_in);
  return r.data.access_token;
}
async function gForget(env, userId) {
  await env.WL.prepare('DELETE FROM google_tokens WHERE user_id = ?').bind(userId).run();
  if (env.BUILDS) await env.BUILDS.delete(gatKey(userId));
}
/** Tell Google to drop the grant. Best effort: never blocks a disconnect or account delete. */
async function gRevoke(env, req, userId, row) {
  if (!row || gMock(env, req) || !gConfigured(env)) return;
  try {
    const refresh = await unseal(env, userId, row.enc_refresh, row.iv);
    await gForm(G_REVOKE, { token: refresh });
  } catch { /* already revoked, network, or old key */ }
}
const RFC3339 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,9})?)?(Z|[+-]\d{2}:\d{2})$/;
function instant(v, label) {
  const s = typeof v === 'string' ? v.trim() : '';
  const t = RFC3339.test(s) ? Date.parse(s) : NaN;
  if (!Number.isFinite(t)) throw new Bad(`${cap(label)} should look like 2026-11-23T00:00:00Z.`);
  return t;
}

// New York wall clock -> UTC, for the mock's fake blocks.
function nyOffsetMin(ms) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
      .formatToParts(new Date(ms)).map((x) => [x.type, x.value])
  );
  return Math.round((Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - ms) / 60000);
}
function nyToUtc(y, mo, d, h) {
  const guess = Date.UTC(y, mo, d, h);
  return guess - nyOffsetMin(guess) * 60000;
}
/** Deterministic fake week: Mon and Thu 6 to 9 pm, Sat 1 to 4 pm (New York). */
function mockBusy(fromMs, toMs) {
  const out = [];
  const plan = { 1: [18, 21], 4: [18, 21], 6: [13, 16] };
  for (let t = fromMs - 864e5; t < toMs + 864e5; t += 864e5) {
    const d = new Date(t);
    const hours = plan[d.getUTCDay()];
    if (!hours) continue;
    const s = nyToUtc(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), hours[0]);
    const e = nyToUtc(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), hours[1]);
    if (s < toMs && e > fromMs) out.push({ start: new Date(s).toISOString(), end: new Date(e).toISOString() });
  }
  return out;
}

async function googleRoutes(env, req, path, m, origin) {
  const mock = gMock(env, req);
  const configured = gConfigured(env);

  if (path === 'google/status' && m === 'GET') {
    const u = await currentUser(env, req);
    const row = u && configured ? await gRow(env, u.id) : null;
    return json({ configured, connected: !!row, ...(row ? { connected_at: row.connected_at } : {}) });
  }

  if (path === 'google/start' && m === 'GET') {
    const nav = req.headers.get('sec-fetch-mode') === 'navigate';
    const fail = (why, status) => (nav ? redirect(`${origin}${YOU_URL}?google=error`) : json({ error: why }, status));
    if (!configured) return fail("Google Calendar isn't set up on Weekline yet.", 409);
    const u = await currentUser(env, req);
    if (!u) return fail('Sign in first.', 401);
    await take(env, req, 'g-start', 20, 600, 'Too many tries. Wait 10 minutes and try again.');
    const state = randToken(24);
    const verifier = randToken(48);
    const challenge = b64url(await crypto.subtle.digest('SHA-256', enc.encode(verifier)));
    await env.BUILDS.put(`wl:gstate:${state}`, JSON.stringify({ u: u.id, v: verifier }), { expirationTtl: 600 });
    const redirectUri = `${origin}/api/wl/google/callback`;
    if (mock) return redirect(`${redirectUri}?${new URLSearchParams({ code: 'mock-code', state })}`);
    const q = new URLSearchParams({
      response_type: 'code', client_id: env.GOOGLE_CLIENT_ID, redirect_uri: redirectUri, scope: G_SCOPE,
      access_type: 'offline', prompt: 'consent', include_granted_scopes: 'false', state,
      code_challenge: challenge, code_challenge_method: 'S256',
    });
    return redirect(`${G_AUTH}?${q}`);
  }

  if (path === 'google/callback' && m === 'GET') {
    const done = (result) => redirect(`${origin}${YOU_URL}?google=${result}`);
    try {
      if (!configured) return done('error');
      const sp = new URL(req.url).searchParams;
      const state = sp.get('state') || '';
      if (!/^[A-Za-z0-9_-]{16,64}$/.test(state)) return done('error');
      const key = `wl:gstate:${state}`;
      const saved = await env.BUILDS.get(key, 'json');
      if (!saved) return done('error');
      await env.BUILDS.delete(key); // one time only
      const u = await currentUser(env, req);
      if (!u || u.id !== saved.u) return done('error');
      if (sp.get('error')) return done(sp.get('error') === 'access_denied' ? 'denied' : 'error');
      const code = sp.get('code') || '';
      if (!code || code.length > 2048) return done('error');
      let refresh, scope;
      if (mock) {
        refresh = 'mock-refresh-' + randHex(16);
        scope = G_SCOPE;
      } else {
        const r = await gForm(G_TOKEN, {
          code, client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET,
          redirect_uri: `${origin}/api/wl/google/callback`, grant_type: 'authorization_code', code_verifier: saved.v,
        });
        if (!r.ok || !r.data.refresh_token) return done('error');
        scope = String(r.data.scope || '');
        if (!scope.split(/\s+/).includes(G_SCOPE)) {
          // They unticked the calendar box on Google's screen: nothing useful was shared.
          await gForm(G_REVOKE, { token: r.data.refresh_token }).catch(() => {});
          return done('denied');
        }
        refresh = r.data.refresh_token;
        await cacheAccess(env, u.id, r.data.access_token, r.data.expires_in);
      }
      const sealed = await seal(env, u.id, refresh);
      await env.WL.prepare(
        'INSERT INTO google_tokens (user_id, enc_refresh, iv, scope, connected_at) VALUES (?, ?, ?, ?, ?) ' +
          'ON CONFLICT(user_id) DO UPDATE SET enc_refresh = excluded.enc_refresh, iv = excluded.iv, scope = excluded.scope, connected_at = excluded.connected_at'
      ).bind(u.id, sealed.enc, sealed.iv, scope.slice(0, 500), Date.now()).run();
      return done('connected');
    } catch (e) {
      console.error('weekline google callback:', e && e.name, e && e.message);
      return done('error');
    }
  }

  if (path === 'google/busy' && m === 'GET') {
    const u = await needUser(env, req);
    if (!configured) throw new Bad("Google Calendar isn't set up on Weekline yet.", 409);
    const sp = new URL(req.url).searchParams;
    const from = instant(sp.get('from'), 'from');
    const to = instant(sp.get('to'), 'to');
    if (to <= from) throw new Bad('"to" has to be after "from".');
    if (to - from > G_MAX_DAYS * 864e5) throw new Bad(`Ask for ${G_MAX_DAYS} days or fewer.`);
    await take(env, req, 'g-busy', 120, 3600, 'Too many calendar checks. Try again in an hour.');
    const row = await gRow(env, u.id);
    if (!row) return json({ connected: false, busy: [] });
    if (mock) return json({ connected: true, busy: mockBusy(from, to) });
    let token = await gAccess(env, u.id, row);
    if (!token) { await gForget(env, u.id); return json({ connected: false, busy: [] }); }
    const body = JSON.stringify({ timeMin: new Date(from).toISOString(), timeMax: new Date(to).toISOString(), timeZone: 'America/New_York', items: [{ id: 'primary' }] });
    const ask = (t) => fetch(G_FREEBUSY, { method: 'POST', headers: { authorization: `Bearer ${t}`, 'content-type': 'application/json' }, body, signal: AbortSignal.timeout(8000) });
    let res = await ask(token);
    if (res.status === 401) {
      token = await gAccess(env, u.id, row, { force: true });
      if (!token) { await gForget(env, u.id); return json({ connected: false, busy: [] }); }
      res = await ask(token);
    }
    if (!res.ok) throw new Bad(G_DOWN, 502);
    const data = await res.json().catch(() => ({}));
    const cal = data.calendars && data.calendars.primary;
    if (!cal || (Array.isArray(cal.errors) && cal.errors.length)) throw new Bad(G_DOWN, 502);
    const busy = [];
    for (const b of Array.isArray(cal.busy) ? cal.busy.slice(0, 1000) : []) {
      const s = Date.parse(b && b.start), e = Date.parse(b && b.end);
      if (Number.isFinite(s) && Number.isFinite(e) && e > s) busy.push({ start: new Date(s).toISOString(), end: new Date(e).toISOString() });
    }
    return json({ connected: true, busy });
  }

  if (path === 'google/disconnect' && m === 'POST') {
    const u = await needUser(env, req);
    const row = await gRow(env, u.id);
    await gRevoke(env, req, u.id, row);
    await gForget(env, u.id);
    return json({ connected: false });
  }

  return null;
}

// ---------- routes ----------

async function handle({ request: req, env, params }) {
  const parts = Array.isArray(params.path) ? params.path : params.path ? [params.path] : [];
  const path = parts.join('/');
  const m = req.method;
  const origin = new URL(req.url).origin;
  if (!originOk(req, path)) return json({ error: 'Not allowed.' }, 403);
  if (!env.WL) return json({ error: 'Weekline accounts are not switched on yet.' }, 503);

  if (path.startsWith('google/')) {
    const g = await googleRoutes(env, req, path, m, origin);
    if (g) return g;
  }

  // ----- accounts -----
  if (path === 'signup' && m === 'POST') {
    await take(env, req, 'auth-signup', 10, 600, TOO_MANY_AUTH);
    const b = await readJson(req);
    const em = email(b.email);
    const password = typeof b.password === 'string' ? b.password : '';
    if (password.length < 10) throw new Bad('Use a password with at least 10 characters.');
    if (password.length > 200) throw new Bad('That password is too long (200 characters max).');
    const name = text(b.name, 40, 'your name', true);
    if (await env.WL.prepare('SELECT 1 FROM users WHERE email = ?').bind(em).first())
      throw new Bad('That email already has an account. Sign in instead.', 409);
    const id = crypto.randomUUID(), salt = randHex(16), now = Date.now();
    await env.WL.prepare('INSERT INTO users (id, email, name, pw_hash, pw_salt, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(id, em, name, await pbkdf2(password, salt), salt, now).run();
    return json({ user: { id, email: em, name, created_at: now } }, 201, { 'set-cookie': await newSession(env, req, id) });
  }

  if (path === 'signin' && m === 'POST') {
    const b0 = bucket('auth-signin', await ipKey(req), 600);
    const fails = await used(env, b0);
    if (fails >= 10) throw new Bad(TOO_MANY_AUTH, 429);
    const b = await readJson(req);
    const em = typeof b.email === 'string' ? b.email.trim().toLowerCase().slice(0, 254) : '';
    const password = typeof b.password === 'string' ? b.password.slice(0, 200) : '';
    const u = em ? await env.WL.prepare('SELECT id, email, name, created_at, pw_hash, pw_salt FROM users WHERE email = ?').bind(em).first() : null;
    // Always hash so the response time doesn't reveal which emails have accounts.
    const h = await pbkdf2(password, u ? u.pw_salt : '00000000000000000000000000000000');
    if (!u || !password || !same(h, u.pw_hash)) {
      await bump(env, b0, fails);
      throw new Bad('Email or password is wrong.', 401);
    }
    return json({ user: publicUser(u) }, 200, { 'set-cookie': await newSession(env, req, u.id) });
  }

  if (path === 'signout' && m === 'POST') {
    const token = readCookie(req);
    if (token) await env.WL.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha(token)).run();
    return json({ ok: true }, 200, { 'set-cookie': cookie(req, '', 0) });
  }

  if (path === 'me' && m === 'GET') {
    const u = await needUser(env, req);
    const [profile, sig] = await Promise.all([
      loadProfile(env, u.id),
      env.WL.prepare('SELECT event_id, kind, reason, tags, at FROM signals WHERE user_id = ? ORDER BY at DESC, id DESC LIMIT 2000').bind(u.id).all(),
    ]);
    return json({ user: publicUser(u), profile, signals: sig.results.map(signalRow) });
  }

  if (path === 'me' && m === 'DELETE') {
    const u = await needUser(env, req);
    const id = u.id;
    const q = (sql, ...a) => env.WL.prepare(sql).bind(...a);
    await gRevoke(env, req, id, await gRow(env, id));
    if (env.BUILDS) await env.BUILDS.delete(gatKey(id));
    await env.WL.batch([
      q('DELETE FROM google_tokens WHERE user_id = ?', id),
      q('DELETE FROM votes WHERE user_id = ? OR device = ? OR poll_token IN (SELECT token FROM polls WHERE owner_id = ?)', id, 'u:' + id, id),
      q('DELETE FROM polls WHERE owner_id = ?', id),
      q('DELETE FROM rsvps WHERE user_id = ? OR device = ? OR invite_token IN (SELECT token FROM invites WHERE owner_id = ?)', id, 'u:' + id, id),
      q('DELETE FROM invites WHERE owner_id = ?', id),
      q('DELETE FROM feeds WHERE user_id = ?', id),
      q('DELETE FROM signals WHERE user_id = ?', id),
      q('DELETE FROM profiles WHERE user_id = ?', id),
      q('DELETE FROM sessions WHERE user_id = ?', id),
      q('DELETE FROM users WHERE id = ?', id),
    ]);
    return json({ deleted: true }, 200, { 'set-cookie': cookie(req, '', 0) });
  }

  if (path === 'export' && m === 'GET') {
    const u = await needUser(env, req);
    const id = u.id;
    const all = (sql, ...a) => env.WL.prepare(sql).bind(...a).all().then((r) => r.results);
    const [profile, signals, feeds, invites, polls, myRsvps, myVotes, google] = await Promise.all([
      loadProfile(env, id),
      all('SELECT event_id, kind, reason, tags, at FROM signals WHERE user_id = ? ORDER BY at, id', id),
      all('SELECT token, created_at FROM feeds WHERE user_id = ?', id),
      all('SELECT token, event, created_at FROM invites WHERE owner_id = ? ORDER BY created_at', id),
      all('SELECT token, question, options, created_at FROM polls WHERE owner_id = ? ORDER BY created_at', id),
      all('SELECT invite_token, name, status, at FROM rsvps WHERE user_id = ? OR device = ?', id, 'u:' + id),
      all('SELECT poll_token, option, at FROM votes WHERE user_id = ? OR device = ?', id, 'u:' + id),
      gRow(env, id),
    ]);
    const inviteOut = [];
    for (const i of invites) {
      const r = await all('SELECT name, status, at FROM rsvps WHERE invite_token = ? ORDER BY at', i.token);
      inviteOut.push({ token: i.token, event: JSON.parse(i.event), created_at: i.created_at, rsvps: r });
    }
    const pollOut = [];
    for (const p of polls) pollOut.push({ token: p.token, created_at: p.created_at, ...(await pollView(env, p.token, null)) });
    for (const p of pollOut) delete p.you;
    const data = {
      exported_at: new Date().toISOString(),
      user: publicUser(u),
      profile,
      signals: signals.map(signalRow),
      feeds: feeds.map((f) => ({ url: `${origin}/api/wl/ics/${f.token}.ics`, created_at: f.created_at })),
      invites: inviteOut,
      polls: pollOut,
      my_rsvps: myRsvps,
      my_votes: myVotes,
      // Never the token: just whether it's connected, when, and the one scope it asked for.
      google: google ? { connected: true, connected_at: google.connected_at, scope: google.scope } : { connected: false },
    };
    return json(data, 200, { 'content-disposition': 'attachment; filename="weekline-export.json"' });
  }

  // ----- memory -----
  if (path === 'profile' && m === 'PUT') {
    const u = await needUser(env, req);
    const b = await readJson(req);
    if (!plainObject(b.data)) throw new Bad('Send your profile as {"data": {...}}.');
    const data = { ...b.data };
    delete data.locks; // locks are saved with PUT locks
    if (enc.encode(JSON.stringify(data)).length > MAX_PROFILE) throw new Bad('Your profile is too big (20 KB max).', 413);
    const name = b.name !== undefined ? text(b.name, 40, 'your name', true) : null;
    const existing = await loadProfile(env, u.id);
    const merged = existing.locks ? { ...data, locks: existing.locks } : data;
    await saveProfile(env, u.id, merged);
    if (name) await env.WL.prepare('UPDATE users SET name = ? WHERE id = ?').bind(name, u.id).run();
    return json({ ok: true, profile: merged });
  }

  if (path === 'locks' && m === 'PUT') {
    const u = await needUser(env, req);
    const b = await readJson(req);
    if (!Array.isArray(b.items)) throw new Bad('Send {"items": [...]}.');
    if (b.items.length > MAX_LOCKS) throw new Bad(`Up to ${MAX_LOCKS} locked plans at a time.`, 413);
    const seen = new Set();
    const items = [];
    for (const it of b.items) {
      const e = cleanEvent(it, { needId: true, needStart: true });
      if (seen.has(e.event_id)) continue;
      seen.add(e.event_id);
      items.push(e);
    }
    const profile = await loadProfile(env, u.id);
    profile.locks = items;
    await saveProfile(env, u.id, profile);
    return json({ ok: true, count: items.length });
  }

  if (path === 'signals' && m === 'POST') {
    const u = await needUser(env, req);
    const b = await readJson(req);
    if (!Array.isArray(b.items) || b.items.length === 0) throw new Bad('Send {"items": [...]}.');
    if (b.items.length > MAX_SIGNALS_PER_CALL) throw new Bad(`Up to ${MAX_SIGNALS_PER_CALL} signals per call.`, 413);
    const now = Date.now();
    const stmts = [];
    for (const it of b.items) {
      if (!plainObject(it)) throw new Bad('Each signal needs event_id and kind.');
      const eventId = text(it.event_id, 120, 'the event id', true);
      if (!KINDS.has(it.kind)) throw new Bad('Signal kind must be went, loved, lock, unlock, skip, ics or rsvp.');
      const reason = text(it.reason, 40, 'the reason');
      let tags = null;
      if (it.tags !== undefined && it.tags !== null) {
        if (!Array.isArray(it.tags) || it.tags.length > 12) throw new Bad('Tags should be a list of up to 12.');
        tags = JSON.stringify(it.tags.map((t) => text(t, 30, 'a tag', true)));
      }
      // Guests upload their local history once after sign-up, so keep their times when sensible.
      const at = Number.isFinite(it.at) && it.at > now - 400 * 864e5 && it.at < now + 864e5 ? Math.floor(it.at) : now;
      stmts.push(env.WL.prepare('INSERT INTO signals (user_id, event_id, kind, reason, tags, at) VALUES (?, ?, ?, ?, ?, ?)').bind(u.id, eventId, it.kind, reason, tags, at));
    }
    stmts.push(
      env.WL.prepare('DELETE FROM signals WHERE user_id = ? AND id NOT IN (SELECT id FROM signals WHERE user_id = ? ORDER BY at DESC, id DESC LIMIT ?)').bind(u.id, u.id, MAX_SIGNALS_KEPT)
    );
    await env.WL.batch(stmts);
    return json({ ok: true, saved: stmts.length - 1 });
  }

  // ----- calendar feed -----
  if (path === 'feed' && m === 'POST') {
    const u = await needUser(env, req);
    const b = await readJson(req);
    let row = await env.WL.prepare('SELECT token FROM feeds WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').bind(u.id).first();
    if (b.reset === true || !row) {
      const token = randToken(24);
      await env.WL.batch([
        env.WL.prepare('DELETE FROM feeds WHERE user_id = ?').bind(u.id),
        env.WL.prepare('INSERT INTO feeds (token, user_id, created_at) VALUES (?, ?, ?)').bind(token, u.id, Date.now()),
      ]);
      row = { token };
    }
    const feedUrl = `${origin}/api/wl/ics/${row.token}.ics`;
    return json({ url: feedUrl, webcal: feedUrl.replace(/^https?:/, 'webcal:') });
  }

  const ics = path.match(/^ics\/([A-Za-z0-9_-]{16,64})\.ics$/);
  if (ics && (m === 'GET' || m === 'HEAD')) {
    const f = await env.WL.prepare('SELECT user_id FROM feeds WHERE token = ?').bind(ics[1]).first();
    if (!f) return new Response('Not found\r\n', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
    const profile = await loadProfile(env, f.user_id);
    const body = await buildIcs(f.user_id, Array.isArray(profile.locks) ? profile.locks : []);
    return new Response(m === 'HEAD' ? null : body, {
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        'content-disposition': 'inline; filename="weekline.ics"',
        'cache-control': 'private, max-age=300',
        'x-robots-tag': 'noindex',
      },
    });
  }

  // ----- crew: invites -----
  if (path === 'invites' && m === 'POST') {
    await take(env, req, 'crew-create', 30, 3600, TOO_MANY_CREW);
    const user = await currentUser(env, req);
    const b = await readJson(req);
    const event = cleanEvent(b.event);
    const token = randToken(12);
    await env.WL.prepare('INSERT INTO invites (token, owner_id, event, created_at) VALUES (?, ?, ?, ?)')
      .bind(token, user ? user.id : null, JSON.stringify(event), Date.now()).run();
    return json({ token, url: `${origin}${APP_PATH}#/e/${token}` }, 201);
  }

  let mm = path.match(/^invites\/([^/]+)$/);
  if (mm && m === 'GET') {
    if (!TOKEN.test(mm[1])) throw new Bad('That invite link is not valid.', 404);
    const user = await currentUser(env, req);
    return json(await inviteView(env, mm[1], optionalActor(user, new URL(req.url).searchParams.get('device'))));
  }

  mm = path.match(/^invites\/([^/]+)\/rsvp$/);
  if (mm && m === 'POST') {
    if (!TOKEN.test(mm[1])) throw new Bad('That invite link is not valid.', 404);
    await take(env, req, 'crew-tap', 30, 3600, TOO_MANY_CREW);
    const token = mm[1];
    const user = await currentUser(env, req);
    const b = await readJson(req);
    const status = b.status;
    if (status !== 'in' && status !== 'maybe' && status !== 'out') throw new Bad('Status must be in, maybe or out.');
    const dev = actor(user, b.device);
    const name = user ? displayFirst(user.name) : status === 'out' ? null : firstName(b.name);
    if (!(await env.WL.prepare('SELECT 1 FROM invites WHERE token = ?').bind(token).first())) throw new Bad('That invite link is not valid.', 404);
    if (status === 'out') {
      await env.WL.prepare('DELETE FROM rsvps WHERE invite_token = ? AND device = ?').bind(token, dev).run();
    } else {
      const had = await env.WL.prepare('SELECT 1 FROM rsvps WHERE invite_token = ? AND device = ?').bind(token, dev).first();
      if (!had) {
        const n = await env.WL.prepare('SELECT COUNT(*) AS n FROM rsvps WHERE invite_token = ?').bind(token).first();
        if (n.n >= MAX_RSVPS) throw new Bad('This invite is full.', 409);
      }
      await env.WL.prepare(
        'INSERT INTO rsvps (invite_token, name, status, device, user_id, at) VALUES (?, ?, ?, ?, ?, ?) ' +
          'ON CONFLICT(invite_token, device) DO UPDATE SET name = excluded.name, status = excluded.status, user_id = excluded.user_id, at = excluded.at'
      ).bind(token, name, status, dev, user ? user.id : null, Date.now()).run();
    }
    return json(await inviteView(env, token, dev));
  }

  // ----- crew: polls -----
  if (path === 'polls' && m === 'POST') {
    await take(env, req, 'crew-create', 30, 3600, TOO_MANY_CREW);
    const user = await currentUser(env, req);
    const b = await readJson(req);
    const question = text(b.question, 120, 'a question', true);
    if (!Array.isArray(b.options) || b.options.length < 2 || b.options.length > 3) throw new Bad('Give 2 or 3 options.');
    const options = b.options.map((o) => text(o, 60, 'each option', true));
    if (new Set(options.map((o) => o.toLowerCase())).size !== options.length) throw new Bad('Options need to be different.');
    const token = randToken(12);
    await env.WL.prepare('INSERT INTO polls (token, owner_id, question, options, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(token, user ? user.id : null, question, JSON.stringify(options), Date.now()).run();
    return json({ token, url: `${origin}${APP_PATH}#/p/${token}` }, 201);
  }

  mm = path.match(/^polls\/([^/]+)$/);
  if (mm && m === 'GET') {
    if (!TOKEN.test(mm[1])) throw new Bad('That poll link is not valid.', 404);
    const user = await currentUser(env, req);
    return json(await pollView(env, mm[1], optionalActor(user, new URL(req.url).searchParams.get('device'))));
  }

  mm = path.match(/^polls\/([^/]+)\/vote$/);
  if (mm && m === 'POST') {
    if (!TOKEN.test(mm[1])) throw new Bad('That poll link is not valid.', 404);
    await take(env, req, 'crew-tap', 30, 3600, TOO_MANY_CREW);
    const token = mm[1];
    const user = await currentUser(env, req);
    const b = await readJson(req);
    const dev = actor(user, b.device);
    const p = await env.WL.prepare('SELECT options FROM polls WHERE token = ?').bind(token).first();
    if (!p) throw new Bad('That poll link is not valid.', 404);
    const count = JSON.parse(p.options).length;
    if (!Number.isInteger(b.option) || b.option < 0 || b.option >= count) throw new Bad('Pick one of the options.');
    const had = await env.WL.prepare('SELECT 1 FROM votes WHERE poll_token = ? AND device = ?').bind(token, dev).first();
    if (!had) {
      const n = await env.WL.prepare('SELECT COUNT(*) AS n FROM votes WHERE poll_token = ?').bind(token).first();
      if (n.n >= MAX_VOTES) throw new Bad('This poll is full.', 409);
    }
    await env.WL.prepare(
      'INSERT INTO votes (poll_token, device, option, user_id, at) VALUES (?, ?, ?, ?, ?) ' +
        'ON CONFLICT(poll_token, device) DO UPDATE SET option = excluded.option, user_id = excluded.user_id, at = excluded.at'
    ).bind(token, dev, b.option, user ? user.id : null, Date.now()).run();
    return json(await pollView(env, token, dev));
  }

  const known = /^(signup|signin|signout|me|export|profile|locks|signals|feed|invites|polls)$|^(invites|polls)\/[^/]+(\/(rsvp|vote))?$|^ics\/|^google\/(status|start|callback|busy|disconnect)$/;
  if (known.test(path)) return json({ error: 'That method is not allowed here.' }, 405);
  return json({ error: 'Not found.' }, 404);
}

export async function onRequest(ctx) {
  try {
    return await handle(ctx);
  } catch (e) {
    if (e instanceof Bad) return json({ error: e.message }, e.status);
    // Log only the error type and message (never request bodies, passwords, cookies or tokens).
    console.error('weekline api error:', e && e.name, e && e.message);
    return json({ error: 'Something went wrong. Try again.' }, 500);
  }
}
