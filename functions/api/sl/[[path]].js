// Skills Made EZ community library API (Cloudflare Pages Function, D1 binding SMEZ, KV binding BUILDS for rate limits).
// Every route lives under /api/sl/. JSON in, JSON out, errors are { error: "plain words" }.
//
// Accounts  POST signup {email, password, handle} · POST signin {email, password} · POST signout · GET me · DELETE me
// Library   GET taxonomy · GET skills?q&cat&sub&for&works&tested&sort&page · GET skills/<id>
//           POST skills {skill_md, name, one_line, category, sub, for_tag, works_in, examples, parent_id?, submit?, ask_test?}
//           PUT skills/<id> (same body; a live skill gets a pending version, the old one stays live until approved)
//           POST skills/<id>/use {kind} · POST skills/<id>/rate {helped, line} · GET skills/<id>/ratings
//           POST skills/<id>/report {reason, note} · POST check {skill_md, examples, name?, category?, sub?}
// Admin     GET review · POST review/<id> {action: approve|changes|hide|drop_ratings, note} · POST review/<id>/test {...}
//           Admins = emails in the secret SMEZ_ADMIN_EMAILS (comma-separated). None set means nobody is admin.
//
// Passwords and tokens are never logged. Session tokens are stored only as SHA-256 hashes.
// Other people are only ever shown by handle: never their email, id or password hash.
// Test clock: only when env SL_TEST_CLOCK is set AND the request is to localhost, header x-sl-test-age-hours
// overrides the caller's account age (for local tests of the 24 h / 7 day rules). Never active otherwise.

const COOKIE = 'sl_session';
const SESSION_DAYS = 30;
const ITER = 100000; // PBKDF2-SHA256 (Workers' max)
const MAX_BODY = 256 * 1024;
const MAX_SKILL_BYTES = 40 * 1024;
const PAGE = 12;
const HOUR = 3600e3;
const DAY = 864e5;
const ALLOWED_ORIGINS = [/^https:\/\/([a-z0-9-]+\.)?vargas-studio\.pages\.dev$/, /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/];

// ---------- taxonomy ----------

const CATEGORIES = [
  ['writing', 'Writing & email', [['fix-writing', 'Fix my writing'], ['hard-messages', 'Hard messages'], ['social-posts', 'Social posts'], ['letters', 'Letters & cards']]],
  ['work', 'Work & career', [['job-hunt', 'Job hunt'], ['meetings', 'Meetings'], ['getting-ahead', 'Getting ahead'], ['docs', 'Spreadsheets & docs']]],
  ['study', 'Study & learning', [['study-tools', 'Study tools'], ['explain', 'Explain it'], ['languages', 'Languages'], ['homework', "Kids' homework help"]]],
  ['money', 'Money', [['budgets', 'Budgets'], ['bills', 'Bills'], ['saving', 'Saving'], ['paperwork', 'Paperwork']]],
  ['home', 'Home & family', [['meals', 'Meals'], ['chores', 'Chores'], ['kids', 'Kids'], ['pets', 'Pets'], ['fix-it', 'Fix-it']]],
  ['health', 'Health & fitness', [['workouts', 'Workouts'], ['habits', 'Habits'], ['doctor', 'Doctor visits prep'], ['calm', 'Calm']]],
  ['travel', 'Travel & going out', [['trips', 'Trips'], ['weekends', 'Weekends & dates'], ['events', 'Events']]],
  ['build', 'Make a website or app', [['personal-site', 'Personal site'], ['small-apps', 'Small apps'], ['fix-change', 'Fix or change'], ['games', 'Games']]],
  ['business', 'Business & selling', [['start', 'Start'], ['sell-online', 'Sell online'], ['customers', 'Customers'], ['marketing', 'Marketing']]],
  ['fun', 'Fun & creative', [['stories', 'Stories'], ['games-puzzles', 'Games & puzzles'], ['art-design', 'Art & design'], ['hobbies', 'Hobbies']]],
];
const CAT = new Map(CATEGORIES.map(([id, name, subs]) => [id, { name, subs: new Map(subs) }]));
const FOR = new Map([['anyone', 'Anyone'], ['student', 'Student'], ['parent', 'Parent'], ['small-business', 'Small business'], ['job-seeker', 'Job seeker'], ['creator', 'Creator']]);
const WORKS = new Map([['claude-ai', 'Claude.ai'], ['claude-code', 'Claude Code']]);
const REPORT_REASONS = new Set(['unsafe', 'broken', 'copied', 'spam']);
const SORTS = new Set(['tested', 'helpful', 'new', 'remixed']);
const TAXONOMY = {
  categories: CATEGORIES.map(([id, name, subs]) => ({ id, name, subs: subs.map(([sid, sname]) => ({ id: sid, name: sname })) })),
  for: [...FOR].map(([id, name]) => ({ id, name })),
  works_in: [...WORKS].map(([id, name]) => ({ id, name })),
  report_reasons: [...REPORT_REASONS],
  sorts: [...SORTS],
};

// ---------- basics ----------

const enc = new TextEncoder();
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const randHex = (n) => hex(crypto.getRandomValues(new Uint8Array(n)));
const sha = async (s) => hex(await crypto.subtle.digest('SHA-256', enc.encode(s)));
function newId() {
  const a = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return [...crypto.getRandomValues(new Uint8Array(10))].map((b) => a[b % 36]).join('');
}

class Bad extends Error {
  constructor(message, status = 400, extra = null) { super(message); this.status = status; this.extra = extra; }
}

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers },
  });
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const plainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const parse = (s, fallback) => { try { return s ? JSON.parse(s) : fallback; } catch { return fallback; } };

// ---------- input checks ----------

const CONTROL_ALL = /[\u0000-\u001F\u007F-\u009F\u2028\u2029]/g;
const CONTROL_KEEP_LINES = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;

/** One-line text: strip control characters, collapse spaces, trim; reject when too long or required and empty. */
function text(v, max, label, required = false, min = 0) {
  if (v === undefined || v === null || v === '') {
    if (required) throw new Bad(`Add ${label}.`);
    return null;
  }
  if (typeof v !== 'string') throw new Bad(`${cap(label)} should be text.`);
  const s = v.normalize('NFC').replace(CONTROL_ALL, ' ').replace(/\s+/g, ' ').trim();
  if (!s) { if (required) throw new Bad(`Add ${label}.`); return null; }
  if (s.length > max) throw new Bad(`${cap(label)} is too long (${max} characters max).`);
  if (s.length < min) throw new Bad(`${cap(label)} is too short (${min} characters min).`);
  return s;
}
/** Multi-line text: keep newlines and tabs, drop other control characters (hidden Unicode is left for the checks to flag). */
function longText(v, max, label, required = false) {
  if (v === undefined || v === null || v === '') {
    if (required) throw new Bad(`Add ${label}.`);
    return null;
  }
  if (typeof v !== 'string') throw new Bad(`${cap(label)} should be text.`);
  const s = v.replace(/\r\n?/g, '\n').replace(CONTROL_KEEP_LINES, '').replace(/[ \t]+$/gm, '').trim();
  if (!s) { if (required) throw new Bad(`Add ${label}.`); return null; }
  if (s.length > max) throw new Bad(`${cap(label)} is too long (${max.toLocaleString('en-US')} characters max).`);
  return s;
}
function email(v) {
  const s = typeof v === 'string' ? v.trim().toLowerCase() : '';
  if (s.length > 254 || !/^[^\s@<>()[\]\\,;:"]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/.test(s))
    throw new Bad('Enter a real email.');
  return s;
}
const RESERVED_HANDLES = new Set(['skillsmadeez', 'skills-made-ez', 'admin', 'admins', 'moderator', 'mod', 'support', 'system', 'claude', 'anthropic', 'official', 'staff', 'help', 'root']);
function cleanHandle(v) {
  const s = typeof v === 'string' ? v.trim() : '';
  if (!/^[A-Za-z0-9-]{3,24}$/.test(s)) throw new Bad('Pick a maker name of 3 to 24 letters, numbers or dashes.');
  if (/^-|-$|--/.test(s)) throw new Bad("Maker names can't start or end with a dash, or have two in a row.");
  if (RESERVED_HANDLES.has(s.toLowerCase())) throw new Bad('That maker name is taken. Try another.', 409);
  return s;
}
const ID = /^[a-z0-9][a-z0-9-]{2,63}$/;
function skillId(v) {
  if (typeof v !== 'string' || !ID.test(v)) throw new Bad('That skill was not found.', 404);
  return v;
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

function originOk(req) {
  const o = req.headers.get('origin');
  const readOnly = req.method === 'GET' || req.method === 'HEAD';
  if (!o) return readOnly; // browsers always send Origin on POST/PUT/DELETE
  return ALLOWED_ORIGINS.some((r) => r.test(o));
}
async function ipKey(req) {
  const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || 'local';
  return (await sha('sl-ip:' + ip)).slice(0, 24); // no raw IPs in KV
}
function bucket(name, who, windowSec) {
  return { key: `sl:${name}:${who}:${Math.floor(Date.now() / 1000 / windowSec)}`, ttl: windowSec + 60 };
}
async function used(env, b) {
  if (!env.BUILDS) return 0;
  return Number((await env.BUILDS.get(b.key)) || 0);
}
async function bump(env, b, n) {
  if (env.BUILDS) await env.BUILDS.put(b.key, String(n + 1), { expirationTtl: b.ttl });
}
/** Count this call against `who` (an IP hash or 'u:<id>') and refuse once `max` is reached in the window. */
async function take(env, who, name, max, windowSec, why) {
  const b = bucket(name, who, windowSec);
  const n = await used(env, b);
  if (n >= max) throw new Bad(why, 429);
  await bump(env, b, n);
}
const TOO_MANY_AUTH = 'Too many tries. Wait 10 minutes and try again.';

// ---------- passwords + sessions ----------

async function pbkdf2(password, saltHex) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const salt = new Uint8Array((saltHex.match(/[0-9a-f]{2}/g) || ['00']).map((h) => parseInt(h, 16)));
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
  const m = (req.headers.get('cookie') || '').match(/(?:^|;\s*)sl_session=([a-f0-9]{64})(?:;|$)/);
  return m ? m[1] : null;
}
async function newSession(env, req, userId) {
  const token = randHex(32);
  const now = Date.now();
  await env.SMEZ.batch([
    env.SMEZ.prepare('DELETE FROM sessions WHERE user_id = ? AND expires_at < ?').bind(userId, now),
    env.SMEZ.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').bind(await sha(token), userId, now + SESSION_DAYS * DAY),
  ]);
  return cookie(req, token, SESSION_DAYS * 86400);
}
function adminSet(env) {
  return new Set(String(env.SMEZ_ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter((s) => s.includes('@')));
}
async function currentUser(env, req) {
  const token = readCookie(req);
  if (!token) return null;
  const u = await env.SMEZ.prepare('SELECT u.id, u.email, u.handle, u.created_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ? AND u.is_system = 0')
    .bind(await sha(token), Date.now()).first();
  if (u) u.is_admin = adminSet(env).has(u.email);
  return u;
}
async function needUser(env, req) {
  const u = await currentUser(env, req);
  if (!u) throw new Bad('Sign in first.', 401);
  return u;
}
async function needAdmin(env, req) {
  const u = await needUser(env, req);
  if (!u.is_admin) throw new Bad('Only reviewers can see this.', 403);
  return u;
}
const publicMe = (u) => ({ id: u.id, email: u.email, handle: u.handle, created_at: u.created_at, is_admin: !!u.is_admin });

/** Account age in ms. Local test clock: SL_TEST_CLOCK set AND request to localhost AND header present. */
function accountAge(env, req, u) {
  const host = new URL(req.url).hostname;
  const h = req.headers.get('x-sl-test-age-hours');
  if (env.SL_TEST_CLOCK && (host === '127.0.0.1' || host === 'localhost') && h !== null && /^\d{1,6}(\.\d+)?$/.test(h)) return Number(h) * HOUR;
  return Date.now() - u.created_at;
}

// ---------- automatic checks ----------

const HIDDEN_UNICODE = /[\u00AD\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uDB40[\uDC00-\uDC7F]/g;
const SAFE_HOSTS = new Set(['localhost', '127.0.0.1', 'api.anthropic.com', 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'unpkg.com', 'fonts.googleapis.com', 'fonts.gstatic.com']);
const URL_RE = /\bhttps?:\/\/[^\s<>"'`)\]]+/gi;
const IMPERATIVE = new Set(('ask make write keep use give start return check read turn build list add cut do don\'t never always put show find pick match mark flag offer plan create include avoid follow stay treat tell lead end open note save quote count split sort group name explain answer work assume repeat remove replace swap ground leave let set fill rewrite draft format respond reply look compare map pull copy translate summarize prefer skip be ' +
  'stop limit cover suggest point bold highlight label link spell sum total scale design style lay add ship test run fix clean shorten tighten cite').split(' '));

function lineAt(s, idx) {
  let n = 1;
  for (let i = 0; i < idx && i < s.length; i++) if (s.charCodeAt(i) === 10) n++;
  return n;
}
/** Replace code spans and fenced blocks with spaces (same length, newlines kept) so line numbers still match. */
function maskCode(s) {
  const blank = (m) => m.replace(/[^\n]/g, ' ');
  return s.replace(/```[\s\S]*?(```|$)/g, blank).replace(/`[^`\n]*`/g, blank);
}
function hostOf(u) {
  try { return new URL(u).hostname.toLowerCase(); } catch { return ''; }
}

/** Scan one piece of text. Adds blocks and warnings with `where` (e.g. "SKILL.md", "example 1 output"). */
function scan(src, where, blocks, warnings, urls) {
  if (!src) return;
  const add = (rule, idx, fix) => blocks.push({ rule, where, line: lineAt(src, idx), fix });
  let m;

  // Hidden Unicode: zero-width, bidi controls, tag characters.
  HIDDEN_UNICODE.lastIndex = 0;
  const seenHidden = new Set();
  while ((m = HIDDEN_UNICODE.exec(src))) {
    const ln = lineAt(src, m.index);
    if (seenHidden.has(ln)) continue;
    seenHidden.add(ln);
    const cp = m[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
    add('hidden-unicode', m.index, `Line ${ln} has an invisible character (U+${cp}). Delete it: retype the line by hand.`);
  }

  const lines = src.split('\n');
  let offset = 0;
  for (const line of lines) {
    const L = line.replace(HIDDEN_UNICODE, '');
    if (/\b(ignore|disregard|forget|override|bypass)\b[^.\n]{0,40}\b(previous|prior|above|earlier|system|all|any|other|your)\b[^.\n]{0,30}\b(instructions?|prompts?|rules|messages?|guidelines|directions)\b/i.test(L) ||
        /\b(you are no longer|new system prompt|jailbreak|developer mode)\b/i.test(L))
      add('ignore-instructions', offset, 'Remove the line that tells Claude to ignore earlier or system instructions. A skill can only add steps, never switch off the rules.');

    const secretPath = /(~\/\.ssh|\.ssh\/|\bid_(rsa|ed25519|ecdsa)\b|\.aws\/credentials|\/etc\/(passwd|shadow)|\bkeychain\b|\.npmrc|\.netrc|\.git-credentials|\bwallet\.dat\b)/i;
    const secretWord = /(\.env\b|\bapi[ _-]?keys?\b|\bprivate keys?\b|\bsecret keys?\b|\bpasswords?\b|\bcookies\b|\b(access|auth|session|bearer)[ _-]?tokens?\b|\btokens\b|\bcredentials\b|\bseed phrase\b)/i;
    const grabVerb = /\b(read|open|cat|copy|send|collect|print|show|upload|grab|get|find|look (in|at|for)|list|extract|access|include|paste|dump|harvest|steal|scan)\b/i;
    if (secretPath.test(L) || (secretWord.test(L) && grabVerb.test(L) && !/\b(never|don't|do not|no)\b[^.]{0,30}(ask|share|store|include|collect|read|request)/i.test(L)))
      add('secrets', offset, 'Remove the part that has Claude read or share secrets (SSH keys, .env files, passwords, cookies, tokens). A skill should never touch them.');

    if (/\b(send|post|upload|transmit|forward|submit|exfiltrate|beacon|report back|phone home|pipe)\b.{0,80}(https?:\/\/|\bwebhook\b|\bwww\.|\bendpoint\b|\bserver\b)/i.test(L))
      add('send-data', offset, 'Remove the step that sends, posts or uploads data to a web address. Skills answer in the chat; they never ship data off somewhere.');

    if (/(\bcurl\b|\bwget\b|Invoke-WebRequest|\bfetch\s*\(|\brequests\.(get|post|put)\b|\bnetcat\b|\bnc\s+-|\bscp\b|\brsync\b)/i.test(L)) {
      const hosts = (L.match(URL_RE) || []).map(hostOf);
      if (!hosts.length || hosts.some((h) => !SAFE_HOSTS.has(h)))
        add('network-command', offset, 'Remove the curl / wget / fetch command, or point it at a well-known public library host. Unknown downloads are not allowed.');
    }

    if (/\b(don'?t|do not|never|without)\s+(tell|telling|inform|informing|let|letting|show|showing|mention|mentioning|reveal|revealing|alert|alerting|notify|notifying)\s+(the\s+|your\s+)?(user|users|them|person|people|anyone|human|owner)\b/i.test(L) ||
        /\b(hide|conceal|keep)\b[^.\n]{0,30}\b(from|secret from)\s+(the\s+)?(user|person|human|them)\b/i.test(L) ||
        /\b(secretly|silently|quietly|covertly)\s+(send|run|upload|delete|change|install|collect|read|copy)\b/i.test(L))
      add('hide-from-user', offset, 'Remove the part that tells Claude to keep something from the person. Everything a skill does has to be visible to them.');

    const b64 = L.match(/[A-Za-z0-9+/]{120,}={0,2}/);
    if (b64) add('encoded-blob', offset + b64.index, 'Remove the long encoded string (base64 or similar). Write instructions in plain words people can read.');

    if (/<\s*(script|iframe|object|embed)\b|\bjavascript:|\bon(load|error|click)\s*=/i.test(maskCode(L)))
      add('scripts', offset, 'Remove the script or embed tag. Skills are text only for now (no scripts).');

    for (const u of L.match(URL_RE) || []) urls.add(u.replace(/[.,;:!?]+$/, ''));
    offset += line.length + 1;
  }

  // HTML comments with words in them (outside code), where hidden instructions like to live.
  const masked = maskCode(src);
  const cre = /<!--([\s\S]*?)(-->|$)/g;
  while ((m = cre.exec(masked))) {
    if ((m[1].match(/[A-Za-z]{2,}/g) || []).length >= 2)
      add('html-comment', m.index, 'Remove the hidden HTML comment (<!-- ... -->). If it is an instruction, write it in plain sight.');
  }

  if (/\b(diagnos(e|is|ing)|prescri(be|ption)|dosage|dose of|medication|medical advice|treat(ment)? (for|of) (your|the|a)|cure)\b/i.test(src))
    warnings.push({ rule: 'advice', where, kind: 'medical', note: 'Mentions medical topics. It must not give medical advice: organizing and preparing only.' });
  if (/\b(invest(ing|ments?|or)?\b|stock (market|picks?|tips?)|crypto|bitcoin|shares to buy|buy (stocks|shares)|investment portfolio|financial advice|returns? of \d)/i.test(src))
    warnings.push({ rule: 'advice', where, kind: 'investment', note: 'Mentions investing. It must not give investment advice: organizing money only.' });
  if (/\b(legal advice|lawsuit|sue (them|him|her|your)|attorney|lawyer|court case|contract law)\b/i.test(src))
    warnings.push({ rule: 'advice', where, kind: 'legal', note: 'Mentions legal topics. It must not give legal advice.' });
}

function frontmatter(md) {
  const m = md.match(/^---[ \t]*\n([\s\S]*?)\n---[ \t]*(\n|$)/);
  if (!m) return null;
  const out = {};
  const lines = m[1].split('\n');
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v === '|' || v === '>' || v === '|-' || v === '>-' || v === '') {
      const more = [];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) more.push(lines[++i].trim());
      v = more.join(' ');
    }
    out[kv[1].toLowerCase()] = v.replace(/^["']|["']$/g, '').trim();
  }
  return { data: out, end: m[0].length };
}

/** Plain-words "What this skill asks Claude to do": first 3 imperative lines + the output section heading. */
function summarize(md, fm) {
  const body = fm ? md.slice(fm.end) : md;
  const out = [];
  let inFence = false;
  const headings = [];
  for (const raw of body.split('\n')) {
    if (/^\s*```/.test(raw)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const h = raw.match(/^#{1,6}\s+(.+)/);
    if (h) { headings.push(h[1].replace(/[*_`#]/g, '').trim()); continue; }
    if (out.length >= 3) continue;
    const line = raw.replace(/^\s*([-*+]|\d+[.)])\s+/, '').replace(/\*\*|__|`/g, '').replace(HIDDEN_UNICODE, '').trim();
    const first = (line.match(/^[A-Za-z']+/) || [''])[0].toLowerCase();
    if (first && IMPERATIVE.has(first) && line.length >= 8) out.push(line.length > 160 ? line.slice(0, 157).trimEnd() + '...' : line);
  }
  const outHead = headings.find((h) => /\b(output|what you (give|return|make|send)|deliver|format|result|return|the answer|what to give)\b/i.test(h)) || headings[headings.length - 1];
  if (outHead) out.push(`It answers with: ${outHead.slice(0, 120)}`);
  return out;
}

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
function close(a, b) {
  if (!a || !b) return false;
  if (a === b || (a.length >= 5 && b.includes(a)) || (b.length >= 5 && a.includes(b))) return true;
  if (Math.abs(a.length - b.length) > 3) return false;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length] <= Math.min(3, Math.floor(Math.max(a.length, b.length) / 4));
}

/** Runs every automatic check. `raw` fields may still hold hidden Unicode; they're scanned as sent. */
async function runChecks(env, { skill_md, examples, name, category, sub, selfId }) {
  const blocks = [], warnings = [], urls = new Set();
  const md = typeof skill_md === 'string' ? skill_md : '';
  if (!md.trim()) blocks.push({ rule: 'frontmatter', where: 'SKILL.md', line: 1, fix: 'Paste your SKILL.md. It starts with --- then name: and description: lines, then ---.' });
  const bytes = enc.encode(md).length;
  if (bytes > MAX_SKILL_BYTES) blocks.push({ rule: 'size', where: 'SKILL.md', line: 1, fix: `Make SKILL.md shorter: it is ${Math.ceil(bytes / 1024)} KB and the limit is 40 KB.` });
  if (/[\u0000-\u0008\u000E-\u001F]/.test(md)) blocks.push({ rule: 'text-only', where: 'SKILL.md', line: 1, fix: 'This looks like a binary file. Paste plain text only.' });
  const fm = md.trim() ? frontmatter(md) : null;
  if (md.trim() && !fm) blocks.push({ rule: 'frontmatter', where: 'SKILL.md', line: 1, fix: 'Start the file with a frontmatter block: a line with ---, then name: and description:, then ---.' });
  else if (fm) {
    if (!fm.data.name) blocks.push({ rule: 'frontmatter', where: 'SKILL.md', line: 2, fix: 'Add a name: line to the frontmatter, like name: polish-email.' });
    if (!fm.data.description) blocks.push({ rule: 'frontmatter', where: 'SKILL.md', line: 2, fix: 'Add a description: line to the frontmatter saying what it does and when to use it.' });
    else if (fm.data.description.length > 1024) blocks.push({ rule: 'frontmatter', where: 'SKILL.md', line: 2, fix: 'Shorten the description to 1,024 characters or fewer.' });
  }
  scan(md, 'SKILL.md', blocks, warnings, urls);

  const ex = Array.isArray(examples) ? examples : [];
  if (examples !== undefined) {
    if (!ex.length) blocks.push({ rule: 'examples', where: 'examples', line: 1, fix: 'Add at least one example: what someone asked and what the skill answered.' });
    if (ex.length > 3) blocks.push({ rule: 'examples', where: 'examples', line: 1, fix: 'Keep it to 3 examples or fewer.' });
    ex.slice(0, 3).forEach((e, i) => {
      const w = `example ${i + 1}`;
      if (!plainObject(e)) { blocks.push({ rule: 'examples', where: w, line: 1, fix: 'Each example needs an input and an output.' }); return; }
      const lim = { input: 4000, output: 8000, plain_output: 8000 };
      for (const [k, max] of Object.entries(lim)) {
        const v = e[k];
        if (v !== undefined && v !== null && typeof v !== 'string') { blocks.push({ rule: 'examples', where: `${w} ${k.replace('_', ' ')}`, line: 1, fix: 'Write it as text.' }); continue; }
        if ((k === 'input' || k === 'output') && !(v || '').trim()) blocks.push({ rule: 'examples', where: `${w} ${k}`, line: 1, fix: k === 'input' ? 'Add what someone asked.' : 'Add what the skill answered.' });
        if ((v || '').length > max) blocks.push({ rule: 'examples', where: `${w} ${k.replace('_', ' ')}`, line: 1, fix: `Shorten it to ${max.toLocaleString('en-US')} characters.` });
        if (v) scan(v, `${w} ${k.replace('_', ' ')}`, blocks, warnings, urls);
      }
    });
  }

  if (urls.size) warnings.unshift({ rule: 'links', where: 'all', note: 'It mentions web addresses. Check each one.', urls: [...urls].slice(0, 30) });

  if (env && name && category && sub) {
    const rows = await env.SMEZ.prepare("SELECT s.id, s.name, u.handle FROM skills s JOIN users u ON u.id = s.maker_id WHERE s.status = 'live' AND s.category = ? AND s.sub = ? AND s.id != ? LIMIT 200")
      .bind(category, sub, selfId || '').all();
    const n = norm(name);
    const hit = rows.results.find((r) => close(n, norm(r.name)));
    if (hit) warnings.push({ rule: 'near-duplicate', where: 'name', note: `Looks a lot like "${hit.name}" by ${hit.handle}. Remix it instead?`, skill_id: hit.id });
  }

  // Merge duplicate warnings of the same kind (e.g. medical in SKILL.md and an example).
  const seen = new Set();
  const warn = warnings.filter((w) => { const k = w.rule + '|' + (w.kind || '') + '|' + (w.skill_id || ''); if (seen.has(k)) return false; seen.add(k); return true; });
  return { ok: blocks.length === 0, blocks: blocks.slice(0, 50), warnings: warn, summary: md.trim() ? summarize(md, fm) : [] };
}

// ---------- skill input ----------

function cleanExamples(v) {
  if (!Array.isArray(v) || v.length < 1 || v.length > 3) throw new Bad('Add 1 to 3 examples.');
  return v.map((e, i) => {
    if (!plainObject(e)) throw new Bad(`Example ${i + 1} needs an input and an output.`);
    const out = {
      input: longText(e.input, 4000, `example ${i + 1}'s input`, true),
      output: longText(e.output, 8000, `example ${i + 1}'s output`, true),
    };
    const p = longText(e.plain_output, 8000, `example ${i + 1}'s plain Claude answer`);
    if (p) { out.plain_output = p; out.plain_source = 'maker'; }
    return out;
  });
}

/** Validate a submit/edit body. Returns cleaned fields (skill_md keeps hidden Unicode so the checks can flag it). */
function cleanSkill(b) {
  if (typeof b.skill_md !== 'string' || !b.skill_md.trim()) throw new Bad('Paste your SKILL.md.');
  if (b.skill_md.length > MAX_SKILL_BYTES * 2) throw new Bad('SKILL.md is too big (40 KB max).', 413);
  const skill_md = b.skill_md.replace(/\r\n?/g, '\n').replace(CONTROL_KEEP_LINES, '');
  if (enc.encode(skill_md).length > MAX_SKILL_BYTES) throw new Bad('SKILL.md is too big (40 KB max).', 413);
  const name = text(b.name, 40, 'a name', true, 3);
  const one_line = text(b.one_line, 90, 'a one-line description', true, 10);
  const category = typeof b.category === 'string' ? b.category : '';
  if (!CAT.has(category)) throw new Bad('Pick a category.');
  const sub = typeof b.sub === 'string' ? b.sub : '';
  if (!CAT.get(category).subs.has(sub)) throw new Bad('Pick a subcategory.');
  const for_tag = b.for_tag === undefined || b.for_tag === null ? 'anyone' : b.for_tag;
  if (!FOR.has(for_tag)) throw new Bad('Pick who it is for.');
  let works_in = b.works_in === undefined ? ['claude-ai', 'claude-code'] : b.works_in;
  if (!Array.isArray(works_in) || !works_in.length || works_in.some((w) => !WORKS.has(w))) throw new Bad('Pick where it works: Claude.ai, Claude Code or both.');
  works_in = [...WORKS.keys()].filter((w) => works_in.includes(w));
  const examples = cleanExamples(b.examples);
  const fm = frontmatter(skill_md);
  const slug = (norm(fm && fm.data.name) || norm(name)).replace(/ /g, '-').slice(0, 64) || 'skill';
  return { skill_md, name, one_line, category, sub, for_tag, works_in, examples, slug, ask_test: b.ask_test === true ? 1 : 0, example_inputs: examples.map((e) => e.input).join('\n\n') };
}

// ---------- reading skills ----------

const LIST_COLS = `s.id, s.slug, s.name, s.one_line, s.category, s.sub, s.for_tag, s.works_in, s.parent_id, s.version, s.status, s.test, s.test_skill, s.test_plain,
  s.rate_n, s.rate_yes, s.wilson, s.uses, s.created_at, s.updated_at, s.live_at, u.handle AS maker_handle, u.is_system AS maker_system,
  (SELECT COUNT(*) FROM skills r WHERE r.parent_id = s.id AND r.status = 'live') AS remix_count`;

function helped(n, yes) {
  const pct = n >= 5 ? Math.round((100 * yes) / n) : null;
  return { n, yes: n >= 5 ? yes : null, pct, label: n >= 5 ? `${pct}% helped (${n})` : 'New' };
}
function wilson(n, yes) {
  if (!n) return 0;
  const z = 1.96, p = yes / n, z2 = z * z;
  return (p + z2 / (2 * n) - z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n)) / (1 + z2 / n);
}
function verdict(h, lift) {
  if (h.pct === null || lift === null) return null;
  if (h.pct >= 75 && lift < 0.3) return 'Popular, but barely beats plain Claude';
  if (h.pct < 50 && lift >= 1) return 'Wins blind tests, but people are mixed';
  if (h.pct >= 75 && lift >= 1) return 'People love it and it wins blind tests';
  return null;
}
function listItem(r) {
  const test = parse(r.test, null);
  const lift = test && r.test_skill !== null && r.test_plain !== null ? Math.round((r.test_skill - r.test_plain) * 10) / 10 : null;
  const h = helped(r.rate_n, r.rate_yes);
  const cat = CAT.get(r.category);
  return {
    id: r.id, slug: r.slug, name: r.name, one_line: r.one_line,
    category: r.category, category_name: cat ? cat.name : r.category,
    sub: r.sub, sub_name: cat && cat.subs.get(r.sub) || r.sub,
    for_tag: r.for_tag, for_name: FOR.get(r.for_tag) || r.for_tag,
    works_in: parse(r.works_in, []),
    maker: { handle: r.maker_handle || 'former-maker', official: !!r.maker_system },
    parent_id: r.parent_id || null, version: r.version, status: r.status,
    test: test ? { skill_score: test.skill_score, plain_score: test.plain_score, winner: test.winner, tested_at: test.tested_at || null } : null,
    lift, tested: !!test, helped: h, verdict: verdict(h, lift),
    remix_count: r.remix_count || 0, uses: r.uses || 0,
    created_at: r.created_at, updated_at: r.updated_at, live_at: r.live_at || null,
  };
}
async function getSkillRow(env, id) {
  return env.SMEZ.prepare(`SELECT ${LIST_COLS}, s.maker_id, s.skill_md, s.examples, s.checks, s.review_note, s.hidden_by, s.ask_test, s.burst_flag
    FROM skills s LEFT JOIN users u ON u.id = s.maker_id WHERE s.id = ?`).bind(id).first();
}
async function ensureChecks(env, row) {
  let checks = parse(row.checks, null);
  if (!checks) {
    checks = await runChecks(null, { skill_md: row.skill_md, examples: parse(row.examples, []) });
    await env.SMEZ.prepare('UPDATE skills SET checks = ? WHERE id = ?').bind(JSON.stringify(checks), row.id).run();
  }
  return checks;
}
/** Full skill view. `who` = { me, owner, admin }. Blocks and review notes only for owner/admin. */
async function detail(env, row, { me, owner, admin }) {
  const base = listItem(row);
  const checks = await ensureChecks(env, row);
  const [parent, remixes, mineRate, mineUse, version] = await Promise.all([
    row.parent_id ? env.SMEZ.prepare("SELECT s.id, s.name, s.test_skill, s.test_plain, s.status, u.handle FROM skills s LEFT JOIN users u ON u.id = s.maker_id WHERE s.id = ?").bind(row.parent_id).first() : null,
    env.SMEZ.prepare("SELECT s.id, s.name, s.test_skill, s.test_plain, u.handle FROM skills s LEFT JOIN users u ON u.id = s.maker_id WHERE s.parent_id = ? AND s.status = 'live' ORDER BY s.live_at DESC LIMIT 50").bind(row.id).all(),
    me ? env.SMEZ.prepare('SELECT helped, line, counted, updated_at FROM ratings WHERE skill_id = ? AND user_id = ?').bind(row.id, me.id).first() : null,
    me ? env.SMEZ.prepare('SELECT kind, at FROM uses WHERE skill_id = ? AND user_id = ?').bind(row.id, me.id).first() : null,
    owner || admin ? env.SMEZ.prepare('SELECT * FROM skill_versions WHERE skill_id = ?').bind(row.id).first() : null,
  ]);
  const myLift = row.test_skill !== null && row.test_plain !== null ? row.test_skill - row.test_plain : null;
  const lift = (r) => (r.test_skill !== null && r.test_plain !== null ? r.test_skill - r.test_plain : null);
  const out = {
    ...base,
    skill_md: row.skill_md,
    examples: parse(row.examples, []),
    test: parse(row.test, null),
    safety: { summary: checks.summary || [], warnings: checks.warnings || [] },
    parent: parent && (parent.status === 'live' || owner || admin) ? { id: parent.id, name: parent.name, maker: { handle: parent.handle || 'former-maker' }, lift: lift(parent) === null ? null : Math.round(lift(parent) * 10) / 10 } : null,
    remixes: remixes.results.map((r) => {
      const l = lift(r);
      return { id: r.id, name: r.name, maker: { handle: r.handle || 'former-maker' }, lift: l === null ? null : Math.round(l * 10) / 10, beats_parent: l !== null && myLift !== null && l > myLift };
    }),
    mine: me ? {
      is_owner: !!owner, used: !!mineUse,
      rating: mineRate ? { helped: !!mineRate.helped, line: mineRate.line, counted: !!mineRate.counted, updated_at: mineRate.updated_at } : null,
    } : null,
  };
  if (owner || admin) {
    out.checks = checks;
    out.review_note = row.review_note || null;
    out.hidden_by = row.hidden_by || null;
    out.ask_test = !!row.ask_test;
    out.pending_version = version ? versionView(version) : null;
  }
  if (admin) out.burst_flag = !!row.burst_flag;
  return out;
}
function versionView(v) {
  return {
    version: v.version, status: v.status, review_note: v.review_note || null, name: v.name, one_line: v.one_line,
    category: v.category, sub: v.sub, for_tag: v.for_tag, works_in: parse(v.works_in, []), slug: v.slug,
    skill_md: v.skill_md, examples: parse(v.examples, []), checks: parse(v.checks, null), ask_test: !!v.ask_test,
    created_at: v.created_at, updated_at: v.updated_at,
  };
}

const likeEsc = (s) => s.replace(/[\\%_]/g, (c) => '\\' + c);

async function listSkills(env, sp) {
  const where = ["s.status = 'live'"];
  const args = [];
  const q = text(sp.get('q'), 100, 'the search');
  if (q) {
    const like = '%' + likeEsc(q.toLowerCase()) + '%';
    const subHits = [];
    const ql = q.toLowerCase();
    for (const [, c] of CAT) for (const [sid, sname] of c.subs) if (sname.toLowerCase().includes(ql) || ql.includes(sname.toLowerCase())) subHits.push(sid);
    const parts = ["LOWER(s.name) LIKE ? ESCAPE '\\'", "LOWER(s.one_line) LIKE ? ESCAPE '\\'", "LOWER(s.example_inputs) LIKE ? ESCAPE '\\'"];
    args.push(like, like, like);
    if (subHits.length) { parts.push(`s.sub IN (${subHits.map(() => '?').join(',')})`); args.push(...subHits); }
    where.push('(' + parts.join(' OR ') + ')');
  }
  const cat = sp.get('cat');
  if (cat) {
    if (!CAT.has(cat)) throw new Bad('Unknown category.');
    where.push('s.category = ?'); args.push(cat);
    const sub = sp.get('sub');
    if (sub) {
      if (!CAT.get(cat).subs.has(sub)) throw new Bad('Unknown subcategory.');
      where.push('s.sub = ?'); args.push(sub);
    }
  } else if (sp.get('sub')) throw new Bad('Pick a category with the subcategory.');
  const f = sp.get('for');
  if (f) { if (!FOR.has(f)) throw new Bad('Unknown "for" filter.'); where.push('s.for_tag = ?'); args.push(f); }
  const w = sp.get('works');
  if (w) { if (!WORKS.has(w)) throw new Bad('Unknown "works in" filter.'); where.push('s.works_in LIKE ?'); args.push(`%"${w}"%`); }
  const t = sp.get('tested');
  if (t === 'yes' || t === '1' || t === 'true') where.push('s.test IS NOT NULL');
  else if (t === 'no' || t === '0' || t === 'false') where.push('s.test IS NULL');
  else if (t) throw new Bad('"tested" should be yes or no.');
  const sort = sp.get('sort') || 'tested';
  if (!SORTS.has(sort)) throw new Bad('Sort by tested, helpful, new or remixed.');
  const order = {
    tested: '(s.test_skill IS NULL OR s.test_plain IS NULL) ASC, (s.test_skill - s.test_plain) DESC, s.wilson DESC, s.live_at DESC',
    helpful: 's.wilson DESC, s.rate_n DESC, s.live_at DESC',
    new: 's.live_at DESC, s.created_at DESC',
    remixed: 'remix_count DESC, s.wilson DESC, s.live_at DESC',
  }[sort];
  let page = parseInt(sp.get('page') || '1', 10);
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (page > 1000) page = 1000;
  const W = where.join(' AND ');
  const [total, rows] = await Promise.all([
    env.SMEZ.prepare(`SELECT COUNT(*) AS n FROM skills s WHERE ${W}`).bind(...args).first(),
    env.SMEZ.prepare(`SELECT ${LIST_COLS} FROM skills s LEFT JOIN users u ON u.id = s.maker_id WHERE ${W} ORDER BY ${order}, s.id LIMIT ? OFFSET ?`)
      .bind(...args, PAGE, (page - 1) * PAGE).all(),
  ]);
  const items = rows.results.map(listItem);
  const out = { items, page, per_page: PAGE, total: total.n, pages: Math.max(1, Math.ceil(total.n / PAGE)), sort };
  // Category champion: highest tested lift in the category (pinned with a gold frame).
  if (cat && page === 1) {
    const champ = await env.SMEZ.prepare(`SELECT ${LIST_COLS} FROM skills s LEFT JOIN users u ON u.id = s.maker_id
      WHERE s.status = 'live' AND s.category = ? AND s.test_skill IS NOT NULL AND s.test_plain IS NOT NULL ORDER BY (s.test_skill - s.test_plain) DESC, s.test_skill DESC LIMIT 1`).bind(cat).first();
    out.champion = champ ? listItem(champ) : null;
  }
  return out;
}

async function refreshRatings(env, skillIdV) {
  const r = await env.SMEZ.prepare('SELECT COUNT(*) AS n, COALESCE(SUM(helped), 0) AS yes FROM ratings WHERE skill_id = ? AND counted = 1').bind(skillIdV).first();
  await env.SMEZ.prepare('UPDATE skills SET rate_n = ?, rate_yes = ?, wilson = ? WHERE id = ?').bind(r.n, r.yes, wilson(r.n, r.yes), skillIdV).run();
}

// ---------- routes ----------

async function handle({ request: req, env, params }) {
  const parts = Array.isArray(params.path) ? params.path : params.path ? [params.path] : [];
  const path = parts.join('/');
  const m = req.method;
  if (!originOk(req)) return json({ error: 'Not allowed.' }, 403);
  if (!env.SMEZ) return json({ error: 'The library is not switched on yet.' }, 503);
  const sp = new URL(req.url).searchParams;
  const ip = await ipKey(req);

  // ----- accounts -----
  if (path === 'signup' && m === 'POST') {
    await take(env, ip, 'auth-signup', 10, 600, TOO_MANY_AUTH);
    const b = await readJson(req);
    const em = email(b.email);
    const password = typeof b.password === 'string' ? b.password : '';
    if (password.length < 10) throw new Bad('Use a password with at least 10 characters.');
    if (password.length > 200) throw new Bad('That password is too long (200 characters max).');
    const h = cleanHandle(b.handle);
    if (await env.SMEZ.prepare('SELECT 1 FROM users WHERE email = ?').bind(em).first())
      throw new Bad('That email already has an account. Sign in instead.', 409);
    if (await env.SMEZ.prepare('SELECT 1 FROM users WHERE handle = ? COLLATE NOCASE').bind(h).first())
      throw new Bad('That maker name is taken. Try another.', 409);
    const id = crypto.randomUUID(), salt = randHex(16), now = Date.now();
    await env.SMEZ.prepare('INSERT INTO users (id, email, handle, pw_hash, pw_salt, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(id, em, h, await pbkdf2(password, salt), salt, now).run();
    const u = { id, email: em, handle: h, created_at: now, is_admin: adminSet(env).has(em) };
    return json({ user: publicMe(u) }, 201, { 'set-cookie': await newSession(env, req, id) });
  }

  if (path === 'signin' && m === 'POST') {
    const b0 = bucket('auth-signin', ip, 600);
    const fails = await used(env, b0);
    if (fails >= 10) throw new Bad(TOO_MANY_AUTH, 429);
    const b = await readJson(req);
    const em = typeof b.email === 'string' ? b.email.trim().toLowerCase().slice(0, 254) : '';
    const password = typeof b.password === 'string' ? b.password.slice(0, 200) : '';
    const u = em ? await env.SMEZ.prepare('SELECT id, email, handle, created_at, pw_hash, pw_salt FROM users WHERE email = ? AND is_system = 0').bind(em).first() : null;
    // Always hash so the response time doesn't reveal which emails have accounts.
    const h = await pbkdf2(password, u ? u.pw_salt : '00000000000000000000000000000000');
    if (!u || !password || !same(h, u.pw_hash)) {
      await bump(env, b0, fails);
      throw new Bad('Email or password is wrong.', 401);
    }
    u.is_admin = adminSet(env).has(u.email);
    return json({ user: publicMe(u) }, 200, { 'set-cookie': await newSession(env, req, u.id) });
  }

  if (path === 'signout' && m === 'POST') {
    const token = readCookie(req);
    if (token) await env.SMEZ.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha(token)).run();
    return json({ ok: true }, 200, { 'set-cookie': cookie(req, '', 0) });
  }

  if (path === 'me' && m === 'GET') {
    const u = await needUser(env, req);
    const [mine, binder] = await Promise.all([
      env.SMEZ.prepare(`SELECT ${LIST_COLS}, s.review_note, s.hidden_by, v.status AS v_status, v.version AS v_version, v.review_note AS v_note
        FROM skills s LEFT JOIN users u ON u.id = s.maker_id LEFT JOIN skill_versions v ON v.skill_id = s.id
        WHERE s.maker_id = ? ORDER BY s.updated_at DESC LIMIT 200`).bind(u.id).all(),
      env.SMEZ.prepare(`SELECT ${LIST_COLS}, us.at AS used_at, r.helped AS my_helped, r.updated_at AS rated_at
        FROM skills s LEFT JOIN users u ON u.id = s.maker_id
        LEFT JOIN uses us ON us.skill_id = s.id AND us.user_id = ?1
        LEFT JOIN ratings r ON r.skill_id = s.id AND r.user_id = ?1
        WHERE s.status = 'live' AND (us.user_id IS NOT NULL OR r.user_id IS NOT NULL)
        ORDER BY COALESCE(r.updated_at, us.at) DESC LIMIT 300`).bind(u.id).all(),
    ]);
    return json({
      user: publicMe(u),
      skills: mine.results.map((r) => ({
        ...listItem(r), review_note: r.review_note || null, hidden_by: r.hidden_by || null,
        pending_version: r.v_status ? { version: r.v_version, status: r.v_status, review_note: r.v_note || null } : null,
      })),
      binder: binder.results.map((r) => ({ ...listItem(r), used: !!r.used_at, rated: r.my_helped !== null, my_helped: r.my_helped === null ? null : !!r.my_helped })),
    });
  }

  if (path === 'me' && m === 'DELETE') {
    const u = await needUser(env, req);
    const id = u.id;
    const q = (sql, ...a) => env.SMEZ.prepare(sql).bind(...a);
    const rated = await env.SMEZ.prepare('SELECT skill_id FROM ratings WHERE user_id = ?').bind(id).all();
    await env.SMEZ.batch([
      q('UPDATE skills SET parent_id = NULL WHERE parent_id IN (SELECT id FROM skills WHERE maker_id = ?)', id),
      q('DELETE FROM ratings WHERE user_id = ? OR skill_id IN (SELECT id FROM skills WHERE maker_id = ?)', id, id),
      q('DELETE FROM reports WHERE user_id = ? OR skill_id IN (SELECT id FROM skills WHERE maker_id = ?)', id, id),
      q('DELETE FROM uses WHERE user_id = ? OR skill_id IN (SELECT id FROM skills WHERE maker_id = ?)', id, id),
      q('DELETE FROM skill_versions WHERE skill_id IN (SELECT id FROM skills WHERE maker_id = ?)', id),
      q('DELETE FROM skills WHERE maker_id = ?', id),
      q('DELETE FROM sessions WHERE user_id = ?', id),
      q('DELETE FROM users WHERE id = ?', id),
    ]);
    for (const r of rated.results) {
      if (await env.SMEZ.prepare('SELECT 1 FROM skills WHERE id = ?').bind(r.skill_id).first()) await refreshRatings(env, r.skill_id);
    }
    return json({ deleted: true }, 200, { 'set-cookie': cookie(req, '', 0) });
  }

  // ----- library -----
  if (path === 'taxonomy' && m === 'GET') return json(TAXONOMY, 200, { 'cache-control': 'public, max-age=300' });

  if (path === 'check' && m === 'POST') {
    await take(env, ip, 'check', 60, 3600, 'Too many checks for now. Try again in an hour.');
    const b = await readJson(req);
    if (b.skill_md !== undefined && typeof b.skill_md !== 'string') throw new Bad('SKILL.md should be text.');
    const md = (b.skill_md || '').replace(/\r\n?/g, '\n');
    const cat = typeof b.category === 'string' && CAT.has(b.category) ? b.category : null;
    const sub = cat && typeof b.sub === 'string' && CAT.get(cat).subs.has(b.sub) ? b.sub : null;
    const name = typeof b.name === 'string' ? b.name.slice(0, 40) : null;
    return json(await runChecks(env, { skill_md: md, examples: b.examples, name, category: cat, sub, selfId: typeof b.id === 'string' ? b.id : null }));
  }

  if (path === 'skills' && m === 'GET') return json(await listSkills(env, sp));

  if (path === 'skills' && m === 'POST') {
    const u = await needUser(env, req);
    const b = await readJson(req);
    const f = cleanSkill(b);
    let parent_id = null;
    if (b.parent_id !== undefined && b.parent_id !== null && b.parent_id !== '') {
      const pid = skillId(b.parent_id);
      const p = await env.SMEZ.prepare('SELECT id, status, maker_id FROM skills WHERE id = ?').bind(pid).first();
      if (!p || (p.status !== 'live' && p.maker_id !== u.id)) throw new Bad('The skill you are remixing was not found.', 404);
      parent_id = p.id;
    }
    const submit = b.submit !== false;
    await take(env, 'u:' + u.id, 'submit', 10, 86400, 'You can send 10 skills a day. Try again tomorrow.');
    const drafts = await env.SMEZ.prepare("SELECT COUNT(*) AS n FROM skills WHERE maker_id = ? AND status IN ('draft','review','changes')").bind(u.id).first();
    if (drafts.n >= 30) throw new Bad('You have 30 skills waiting. Finish or delete some first.', 409);
    const checks = await runChecks(env, { ...f, selfId: null });
    if (submit && !checks.ok) throw new Bad('Fix the red flags first.', 422, { checks });
    const id = newId(), now = Date.now();
    await env.SMEZ.prepare(`INSERT INTO skills (id, slug, name, one_line, category, sub, for_tag, works_in, skill_md, examples, example_inputs, maker_id, parent_id, version, status, checks, ask_test, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)`)
      .bind(id, f.slug, f.name, f.one_line, f.category, f.sub, f.for_tag, JSON.stringify(f.works_in), f.skill_md, JSON.stringify(f.examples), f.example_inputs,
        u.id, parent_id, submit ? 'review' : 'draft', JSON.stringify(checks), f.ask_test, now, now).run();
    const row = await getSkillRow(env, id);
    return json({ skill: await detail(env, row, { me: u, owner: true, admin: u.is_admin }), checks }, 201);
  }

  let mm = path.match(/^skills\/([^/]+)$/);
  if (mm && m === 'GET') {
    const id = skillId(mm[1]);
    const me = await currentUser(env, req);
    const row = await getSkillRow(env, id);
    const owner = !!(me && row && row.maker_id === me.id);
    const admin = !!(me && me.is_admin);
    if (!row || (row.status !== 'live' && !owner && !admin)) throw new Bad('That skill was not found.', 404);
    return json({ skill: await detail(env, row, { me, owner, admin }) });
  }

  if (mm && m === 'PUT') {
    const u = await needUser(env, req);
    const id = skillId(mm[1]);
    const row = await env.SMEZ.prepare('SELECT id, maker_id, status, version FROM skills WHERE id = ?').bind(id).first();
    if (!row || row.maker_id !== u.id) throw new Bad('That skill was not found.', 404);
    const b = await readJson(req);
    const f = cleanSkill(b);
    await take(env, 'u:' + u.id, 'submit', 10, 86400, 'You can send 10 skills a day. Try again tomorrow.');
    const checks = await runChecks(env, { ...f, selfId: id });
    const now = Date.now();
    if (row.status === 'live' || row.status === 'hidden') {
      // No rug pulls: the change waits in review; the current version stays as it is.
      if (!checks.ok) throw new Bad('Fix the red flags first.', 422, { checks });
      await env.SMEZ.prepare(`INSERT INTO skill_versions (skill_id, version, name, one_line, category, sub, for_tag, works_in, slug, skill_md, examples, example_inputs, checks, ask_test, status, review_note, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'review', NULL, ?, ?)
        ON CONFLICT(skill_id) DO UPDATE SET name = excluded.name, one_line = excluded.one_line, category = excluded.category, sub = excluded.sub,
          for_tag = excluded.for_tag, works_in = excluded.works_in, slug = excluded.slug, skill_md = excluded.skill_md, examples = excluded.examples,
          example_inputs = excluded.example_inputs, checks = excluded.checks, ask_test = excluded.ask_test, status = 'review', review_note = NULL, updated_at = excluded.updated_at`)
        .bind(id, row.version + 1, f.name, f.one_line, f.category, f.sub, f.for_tag, JSON.stringify(f.works_in), f.slug, f.skill_md, JSON.stringify(f.examples), f.example_inputs,
          JSON.stringify(checks), f.ask_test, now, now).run();
    } else {
      const submit = b.submit !== false;
      if (submit && !checks.ok) throw new Bad('Fix the red flags first.', 422, { checks });
      const status = submit ? 'review' : row.status === 'review' ? 'review' : row.status === 'changes' ? 'changes' : 'draft';
      if (row.status === 'review' && !checks.ok) throw new Bad('Fix the red flags first.', 422, { checks });
      await env.SMEZ.prepare(`UPDATE skills SET slug = ?, name = ?, one_line = ?, category = ?, sub = ?, for_tag = ?, works_in = ?, skill_md = ?, examples = ?, example_inputs = ?,
        checks = ?, ask_test = ?, status = ?, updated_at = ? WHERE id = ?`)
        .bind(f.slug, f.name, f.one_line, f.category, f.sub, f.for_tag, JSON.stringify(f.works_in), f.skill_md, JSON.stringify(f.examples), f.example_inputs,
          JSON.stringify(checks), f.ask_test, status, now, id).run();
    }
    const fresh = await getSkillRow(env, id);
    return json({ skill: await detail(env, fresh, { me: u, owner: true, admin: u.is_admin }), checks });
  }

  mm = path.match(/^skills\/([^/]+)\/(use|rate|ratings|report)$/);
  if (mm) {
    const id = skillId(mm[1]);
    const action = mm[2];

    if (action === 'use' && m === 'POST') {
      const b = await readJson(req);
      const kind = b.kind === 'copy' ? 'copy' : b.kind === 'download' || b.kind === undefined ? 'download' : null;
      if (!kind) throw new Bad('Kind should be download or copy.');
      await take(env, ip, 'use', 120, 3600, 'Too many downloads for now. Try again in an hour.');
      const row = await env.SMEZ.prepare("SELECT id FROM skills WHERE id = ? AND status = 'live'").bind(id).first();
      if (!row) throw new Bad('That skill was not found.', 404);
      const me = await currentUser(env, req);
      if (me) {
        const r = await env.SMEZ.prepare('INSERT OR IGNORE INTO uses (skill_id, user_id, kind, at) VALUES (?, ?, ?, ?)').bind(id, me.id, kind, Date.now()).run();
        if (r.meta && r.meta.changes) await env.SMEZ.prepare('UPDATE skills SET uses = uses + 1 WHERE id = ?').bind(id).run();
      } else if (env.BUILDS) {
        // Signed-out: count once per IP per skill per day; never unlocks rating.
        const key = `sl:use1:${ip}:${id}:${Math.floor(Date.now() / DAY)}`;
        if (!(await env.BUILDS.get(key))) {
          await env.BUILDS.put(key, '1', { expirationTtl: 2 * 86400 });
          await env.SMEZ.prepare('UPDATE skills SET uses = uses + 1 WHERE id = ?').bind(id).run();
        }
      }
      return json({ ok: true, counted_for_rating: !!me });
    }

    if (action === 'rate' && m === 'POST') {
      const u = await needUser(env, req);
      const b = await readJson(req);
      if (typeof b.helped !== 'boolean') throw new Bad('Say if it helped: yes or no.');
      const line = text(b.line, 140, 'what you used it for', true, 10);
      const s = await env.SMEZ.prepare('SELECT id, maker_id, status, burst_flag FROM skills WHERE id = ?').bind(id).first();
      if (!s || s.status !== 'live') throw new Bad('That skill was not found.', 404);
      if (s.maker_id === u.id) throw new Bad("You can't rate your own skill.", 403);
      if (!(await env.SMEZ.prepare('SELECT 1 FROM uses WHERE skill_id = ? AND user_id = ?').bind(id, u.id).first()))
        throw new Bad('Add it to Claude or copy it first, then come back and rate it.', 403);
      const age = accountAge(env, req, u);
      if (age < DAY) throw new Bad('New accounts can rate after 24 hours. Come back tomorrow.', 403);
      await take(env, 'u:' + u.id, 'rate', 60, 86400, 'You can rate 60 times a day. Try again tomorrow.');
      const now = Date.now();
      const had = await env.SMEZ.prepare('SELECT young, counted FROM ratings WHERE skill_id = ? AND user_id = ?').bind(id, u.id).first();
      if (had) {
        await env.SMEZ.prepare('UPDATE ratings SET helped = ?, line = ?, updated_at = ? WHERE skill_id = ? AND user_id = ?').bind(b.helped ? 1 : 0, line, now, id, u.id).run();
      } else {
        const young = age < 7 * DAY ? 1 : 0;
        const counted = young && s.burst_flag ? 0 : 1;
        await env.SMEZ.prepare('INSERT INTO ratings (skill_id, user_id, helped, line, young, counted, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
          .bind(id, u.id, b.helped ? 1 : 0, line, young, counted, now, now).run();
        if (young && !s.burst_flag) {
          const burst = await env.SMEZ.prepare('SELECT COUNT(*) AS n FROM ratings WHERE skill_id = ? AND young = 1 AND created_at > ?').bind(id, now - HOUR).first();
          if (burst.n > 10) {
            await env.SMEZ.batch([
              env.SMEZ.prepare('UPDATE skills SET burst_flag = 1 WHERE id = ?').bind(id),
              env.SMEZ.prepare('UPDATE ratings SET counted = 0 WHERE skill_id = ? AND young = 1 AND created_at > ?').bind(id, now - HOUR),
            ]);
          }
        }
      }
      await refreshRatings(env, id);
      const r = await env.SMEZ.prepare('SELECT rate_n, rate_yes FROM skills WHERE id = ?').bind(id).first();
      const mine = await env.SMEZ.prepare('SELECT helped, line, counted, updated_at FROM ratings WHERE skill_id = ? AND user_id = ?').bind(id, u.id).first();
      return json({ ok: true, edited: !!had, rating: { helped: !!mine.helped, line: mine.line, counted: !!mine.counted, updated_at: mine.updated_at }, helped: helped(r.rate_n, r.rate_yes) }, had ? 200 : 201);
    }

    if (action === 'ratings' && m === 'GET') {
      const me = await currentUser(env, req);
      const s = await env.SMEZ.prepare('SELECT id, maker_id, status, rate_n, rate_yes FROM skills WHERE id = ?').bind(id).first();
      if (!s || (s.status !== 'live' && !(me && (me.is_admin || me.id === s.maker_id)))) throw new Bad('That skill was not found.', 404);
      let page = parseInt(sp.get('page') || '1', 10);
      if (!Number.isFinite(page) || page < 1) page = 1;
      const rows = await env.SMEZ.prepare(`SELECT r.helped, r.line, r.updated_at, u.handle FROM ratings r JOIN users u ON u.id = r.user_id
        WHERE r.skill_id = ? AND r.counted = 1 ORDER BY r.updated_at DESC LIMIT 20 OFFSET ?`).bind(id, (page - 1) * 20).all();
      const mine = me ? await env.SMEZ.prepare('SELECT helped, line, counted, updated_at FROM ratings WHERE skill_id = ? AND user_id = ?').bind(id, me.id).first() : null;
      return json({
        helped: helped(s.rate_n, s.rate_yes),
        items: rows.results.map((r) => ({ handle: r.handle, helped: !!r.helped, line: r.line, at: r.updated_at })),
        page,
        mine: mine ? { helped: !!mine.helped, line: mine.line, counted: !!mine.counted, updated_at: mine.updated_at } : null,
      });
    }

    if (action === 'report' && m === 'POST') {
      const u = await needUser(env, req);
      const b = await readJson(req);
      if (!REPORT_REASONS.has(b.reason)) throw new Bad('Pick a reason: unsafe, broken, copied or spam.');
      const note = text(b.note, 500, 'the note');
      const s = await env.SMEZ.prepare('SELECT id, maker_id, status FROM skills WHERE id = ?').bind(id).first();
      if (!s || s.status !== 'live') throw new Bad('That skill was not found.', 404);
      if (s.maker_id === u.id) throw new Bad("You can't report your own skill.", 403);
      await take(env, 'u:' + u.id, 'report', 20, 86400, 'You can send 20 reports a day. Try again tomorrow.');
      await env.SMEZ.prepare(`INSERT INTO reports (skill_id, user_id, reason, note, resolved, created_at) VALUES (?, ?, ?, ?, 0, ?)
        ON CONFLICT(skill_id, user_id) DO UPDATE SET reason = excluded.reason, note = excluded.note, resolved = 0, created_at = excluded.created_at`)
        .bind(id, u.id, b.reason, note, Date.now()).run();
      const n = await env.SMEZ.prepare('SELECT COUNT(DISTINCT user_id) AS n FROM reports WHERE skill_id = ? AND resolved = 0').bind(id).first();
      let hidden = false;
      if (n.n >= 2) {
        const r = await env.SMEZ.prepare("UPDATE skills SET status = 'hidden', hidden_by = 'reports', updated_at = ? WHERE id = ? AND status = 'live'").bind(Date.now(), id).run();
        hidden = !!(r.meta && r.meta.changes);
      }
      return json({ ok: true, hidden }, 201);
    }
    return json({ error: 'That method is not allowed here.' }, 405);
  }

  // ----- admin -----
  if (path === 'review' && m === 'GET') {
    const a = await needAdmin(env, req);
    const rows = await env.SMEZ.prepare(`SELECT ${LIST_COLS}, s.maker_id, s.skill_md, s.examples, s.checks, s.review_note, s.hidden_by, s.ask_test, s.burst_flag,
        (SELECT status FROM skill_versions v WHERE v.skill_id = s.id) AS v_status
      FROM skills s LEFT JOIN users u ON u.id = s.maker_id
      WHERE s.status = 'review' OR (s.status = 'hidden' AND s.hidden_by = 'reports') OR s.burst_flag = 1
        OR EXISTS (SELECT 1 FROM skill_versions v WHERE v.skill_id = s.id AND v.status = 'review')
      ORDER BY s.updated_at ASC LIMIT 100`).all();
    const items = [];
    for (const r of rows.results) {
      const kind = r.status === 'review' ? 'new' : r.v_status === 'review' ? 'version' : r.status === 'hidden' && r.hidden_by === 'reports' ? 'reported' : 'burst';
      const [reports, flagged] = await Promise.all([
        env.SMEZ.prepare('SELECT p.reason, p.note, p.created_at, u.handle FROM reports p JOIN users u ON u.id = p.user_id WHERE p.skill_id = ? AND p.resolved = 0 ORDER BY p.created_at').bind(r.id).all(),
        env.SMEZ.prepare('SELECT COUNT(*) AS n FROM ratings WHERE skill_id = ? AND counted = 0').bind(r.id).first(),
      ]);
      items.push({ kind, skill: await detail(env, r, { me: a, owner: false, admin: true }), reports: reports.results, flagged_ratings: flagged.n });
    }
    return json({ items });
  }

  mm = path.match(/^review\/([^/]+)(\/test)?$/);
  if (mm && m === 'POST') {
    const a = await needAdmin(env, req);
    const id = skillId(mm[1]);
    const s = await env.SMEZ.prepare('SELECT id, status, version, hidden_by, burst_flag FROM skills WHERE id = ?').bind(id).first();
    if (!s) throw new Bad('That skill was not found.', 404);
    const b = await readJson(req);
    const now = Date.now();

    if (mm[2]) {
      const score = (v, label) => {
        if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 5) throw new Bad(`${label} should be a number from 0 to 5.`);
        return Math.round(v * 10) / 10;
      };
      const skill_score = score(b.skill_score, 'The skill score');
      const plain_score = score(b.plain_score, 'The plain score');
      if (!['skill', 'plain', 'tie'].includes(b.winner)) throw new Bad('Winner should be skill, plain or tie.');
      const reason = text(b.reason, 600, 'the reason', true);
      const test = { skill_score, plain_score, winner: b.winner, reason, tested_at: new Date(now).toISOString().slice(0, 10) };
      await env.SMEZ.prepare('UPDATE skills SET test = ?, test_skill = ?, test_plain = ?, ask_test = 0, updated_at = ? WHERE id = ?')
        .bind(JSON.stringify(test), skill_score, plain_score, now, id).run();
      return json({ ok: true, test });
    }

    const action = b.action;
    if (!['approve', 'changes', 'hide', 'drop_ratings'].includes(action)) throw new Bad('Action should be approve, changes, hide or drop_ratings.');
    const note = text(b.note, 600, 'a note for the maker', action === 'changes');
    const v = await env.SMEZ.prepare('SELECT * FROM skill_versions WHERE skill_id = ?').bind(id).first();
    const stmts = [];
    const q = (sql, ...args) => stmts.push(env.SMEZ.prepare(sql).bind(...args));
    let did;

    if (action === 'approve') {
      if (s.status === 'review') {
        q("UPDATE skills SET status = 'live', review_note = ?, hidden_by = NULL, live_at = COALESCE(live_at, ?), updated_at = ? WHERE id = ?", note, now, now, id);
        did = 'live';
      } else if (v && v.status === 'review') {
        q(`UPDATE skills SET name = ?, one_line = ?, category = ?, sub = ?, for_tag = ?, works_in = ?, slug = ?, skill_md = ?, examples = ?, example_inputs = ?, checks = ?,
            ask_test = ?, version = ?, status = 'live', hidden_by = NULL, review_note = ?, live_at = ?, updated_at = ?, test = NULL, test_skill = NULL, test_plain = NULL WHERE id = ?`,
          v.name, v.one_line, v.category, v.sub, v.for_tag, v.works_in, v.slug, v.skill_md, v.examples, v.example_inputs, v.checks, v.ask_test, v.version, note, now, now, id);
        q('DELETE FROM skill_versions WHERE skill_id = ?', id);
        q('UPDATE reports SET resolved = 1 WHERE skill_id = ?', id);
        did = 'version-live';
      } else if (s.status === 'hidden' || s.status === 'changes') {
        q("UPDATE skills SET status = 'live', hidden_by = NULL, review_note = ?, live_at = COALESCE(live_at, ?), updated_at = ? WHERE id = ?", note, now, now, id);
        q('UPDATE reports SET resolved = 1 WHERE skill_id = ?', id);
        did = 'restored';
      } else did = 'unchanged';
      if (s.burst_flag) {
        q('UPDATE ratings SET counted = 1 WHERE skill_id = ?', id);
        q('UPDATE skills SET burst_flag = 0 WHERE id = ?', id);
        did += '+ratings-counted';
      }
    } else if (action === 'changes') {
      if (s.status === 'review') {
        q("UPDATE skills SET status = 'changes', review_note = ?, updated_at = ? WHERE id = ?", note, now, id);
        did = 'changes';
      } else if (v && v.status === 'review') {
        q("UPDATE skill_versions SET status = 'changes', review_note = ?, updated_at = ? WHERE skill_id = ?", note, now, id);
        did = 'version-changes';
      } else {
        q("UPDATE skills SET status = 'changes', review_note = ?, hidden_by = NULL, updated_at = ? WHERE id = ?", note, now, id);
        q('UPDATE reports SET resolved = 1 WHERE skill_id = ?', id);
        did = 'changes';
      }
    } else if (action === 'hide') {
      q("UPDATE skills SET status = 'hidden', hidden_by = 'admin', review_note = COALESCE(?, review_note), updated_at = ? WHERE id = ?", note, now, id);
      q('UPDATE reports SET resolved = 1 WHERE skill_id = ?', id);
      did = 'hidden';
    } else {
      q('DELETE FROM ratings WHERE skill_id = ? AND counted = 0', id);
      q('UPDATE skills SET burst_flag = 0 WHERE id = ?', id);
      did = 'ratings-dropped';
    }
    await env.SMEZ.batch(stmts);
    await refreshRatings(env, id);
    const row = await getSkillRow(env, id);
    return json({ ok: true, did, skill: await detail(env, row, { me: a, owner: false, admin: true }) });
  }

  const known = /^(signup|signin|signout|me|taxonomy|check|skills|review)$|^skills\/[^/]+(\/(use|rate|ratings|report))?$|^review\/[^/]+(\/test)?$/;
  if (known.test(path)) return json({ error: 'That method is not allowed here.' }, 405);
  return json({ error: 'Not found.' }, 404);
}

export async function onRequest(ctx) {
  try {
    return await handle(ctx);
  } catch (e) {
    if (e instanceof Bad) return json({ error: e.message, ...(e.extra || {}) }, e.status);
    // Log only the error type and message (never request bodies, passwords, cookies or tokens).
    console.error('smez library api error:', e && e.name, e && e.message);
    return json({ error: 'Something went wrong. Try again.' }, 500);
  }
}
