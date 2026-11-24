// Scrollback API (Cloudflare Pages Function). One route, switched off until the D1 binding SB exists.
//
//   POST /api/sb/notify {email, year?, source?}  -> 201 {ok:true}
//        "Tell me when prints open". Stores only the email (lowercased), the year and the page.
//   POST /api/sb/event {step}  -> 202 {ok:true}
//        Anonymous game counts: +1 to today's number for that step. Nothing about the person.
//
// No SB binding -> every route answers 503 {"open":false}, and the page says sign-ups aren't on yet.
// Same-origin only. Rate limit: per hashed IP, in the BUILDS KV when bound, else per isolate.
// Emails are never logged.

const ALLOWED_ORIGINS = [/^https:\/\/([a-z0-9-]+\.)?vargas-studio\.pages\.dev$/, /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/];
const SOURCES = new Set(['print', 'group', 'gift']);
const MAX_BODY = 2 * 1024;
const LIMIT = 5; // sign-ups per IP
const WINDOW = 3600; // per hour
const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

class Bad extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

function originOk(req) {
  const o = req.headers.get('origin');
  if (!o) return false; // browsers always send Origin on POST
  return o === new URL(req.url).origin || ALLOWED_ORIGINS.some((r) => r.test(o));
}

async function ipKey(req) {
  const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || 'local';
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('sb-ip:' + ip));
  return [...new Uint8Array(d)].slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join(''); // no raw IPs
}

const memory = new Map(); // fallback when no KV: per isolate, good enough to slow a script
async function take(env, req) {
  const key = `sb:notify:${await ipKey(req)}:${Math.floor(Date.now() / 1000 / WINDOW)}`;
  let n;
  if (env.BUILDS) n = Number((await env.BUILDS.get(key)) || 0);
  else n = memory.get(key) || 0;
  if (n >= LIMIT) throw new Bad('Too many tries. Try again in an hour.', 429);
  if (env.BUILDS) await env.BUILDS.put(key, String(n + 1), { expirationTtl: WINDOW + 60 });
  else {
    if (memory.size > 5000) memory.clear();
    memory.set(key, n + 1);
  }
}

// Anonymous game counts: POST /api/sb/event {step}. Adds 1 to today's count for that step.
const STEPS = new Set(['start', 'join', 'finish', 'share', 'save', 'group_share', 'print_open']);
const EVENT_LIMIT = 120; // per hashed IP per hour, so one script can't fake the numbers
async function takeEvent(env, req) {
  const key = `sb:event:${await ipKey(req)}:${Math.floor(Date.now() / 1000 / WINDOW)}`;
  let n;
  if (env.BUILDS) n = Number((await env.BUILDS.get(key)) || 0);
  else n = memory.get(key) || 0;
  if (n >= EVENT_LIMIT) throw new Bad('Too many.', 429);
  if (env.BUILDS) await env.BUILDS.put(key, String(n + 1), { expirationTtl: WINDOW + 60 });
  else {
    if (memory.size > 5000) memory.clear();
    memory.set(key, n + 1);
  }
}

async function readJson(req) {
  if (!/^application\/json\b/i.test(req.headers.get('content-type') || '')) throw new Bad('Send JSON.', 415);
  const len = Number(req.headers.get('content-length') || 0);
  if (len > MAX_BODY) throw new Bad('That request is too big.', 413);
  const raw = await req.text();
  if (raw.length > MAX_BODY) throw new Bad('That request is too big.', 413);
  let b;
  try { b = JSON.parse(raw || '{}'); } catch { throw new Bad('Send JSON.'); }
  if (!b || typeof b !== 'object' || Array.isArray(b)) throw new Bad('Send a JSON object.');
  return b;
}

function cleanEmail(v) {
  const s = typeof v === 'string' ? v.trim().toLowerCase() : '';
  if (!s || s.length > 254 || !EMAIL.test(s)) throw new Bad('Enter a real email.');
  return s;
}
function cleanYear(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isInteger(n) && n >= 1995 && n <= 2016 ? n : null;
}

async function handle({ request: req, env, params }) {
  const parts = Array.isArray(params?.path) ? params.path : params?.path ? [params.path] : [];
  const path = parts.join('/');
  if (req.method !== 'GET' && req.method !== 'HEAD' && !originOk(req)) return json({ error: 'Not allowed.' }, 403);
  if (!env.SB) return json({ open: false }, 503);

  if (path === 'notify') {
    if (req.method !== 'POST') return json({ error: 'That method is not allowed here.' }, 405);
    const b = await readJson(req);
    if (typeof b.website === 'string' && b.website.trim()) return json({ ok: true }, 201); // honeypot: bots get a quiet yes, nothing stored
    const email = cleanEmail(b.email);
    await take(env, req);
    const year = cleanYear(b.year);
    const source = SOURCES.has(b.source) ? b.source : 'print';
    // same answer whether or not the email was already on the list
    await env.SB.prepare('INSERT INTO notify (email, year, source, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO NOTHING')
      .bind(email, year, source, Date.now())
      .run();
    return json({ ok: true }, 201);
  }
  if (path === 'event') {
    if (req.method !== 'POST') return json({ error: 'That method is not allowed here.' }, 405);
    const b = await readJson(req);
    const step = typeof b.step === 'string' ? b.step : '';
    if (!STEPS.has(step)) throw new Bad('Unknown step.');
    await takeEvent(env, req);
    const day = new Date().toISOString().slice(0, 10); // UTC day; counts only, nothing about the person
    await env.SB.prepare('INSERT INTO events (day, step, n) VALUES (?, ?, 1) ON CONFLICT(day, step) DO UPDATE SET n = n + 1')
      .bind(day, step)
      .run();
    return json({ ok: true }, 202);
  }
  return json({ error: 'Not found.' }, 404);
}

export async function onRequest(ctx) {
  try {
    return await handle(ctx);
  } catch (e) {
    if (e instanceof Bad) return json({ error: e.message }, e.status);
    console.error('scrollback api error:', e && e.name); // never the email
    return json({ error: 'Something went wrong. Try again.' }, 500);
  }
}
