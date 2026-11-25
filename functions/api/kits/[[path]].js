// AI Made EZ kits API (Cloudflare Pages Function). D1 binding SMEZ, KV binding BUILDS for rate limits.
//
//   POST /api/kits/signup {email, kit, news?}  -> 201 {ok:true, sent:boolean}
//        Optional "Email me this kit". The kit is always free on the page; this only saves the request.
//        Sends the kit link by email ONLY when RESEND_API_KEY and FROM_EMAIL are both set (she adds them herself).
//        Until then: saved, sent:false, and the page says so honestly.
//   POST /api/kits/forget {email}  -> 200 {ok:true}   Deletes every row for that email.
//
// Same-origin only. Rate limit per hashed IP. Emails are never logged.

const ALLOWED_ORIGINS = [/^https:\/\/([a-z0-9-]+\.)?vargas-studio\.pages\.dev$/, /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/];
const KITS = {
  'sounds-like-me': 'Sounds like me',
  'first-website': 'Your first website',
  'first-app': 'Your first app',
  'automate-task': 'Automate one boring task',
  'month-of-posts': 'A month of posts',
  'memo-to-handbook': 'Voice memo to handbook',
};
const CONSENT_VER = 'kits-2026-11-25';
const MAX_BODY = 2 * 1024;
const LIMIT = 6; // requests per IP
const WINDOW = 3600; // per hour
const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

class Bad extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

function originOk(req) {
  const o = req.headers.get('origin');
  if (!o) return false;
  return o === new URL(req.url).origin || ALLOWED_ORIGINS.some((r) => r.test(o));
}

async function ipKey(req) {
  const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || 'local';
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('kits-ip:' + ip));
  return [...new Uint8Array(d)].slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('');
}

const memory = new Map();
async function take(env, req) {
  const key = `kits:${await ipKey(req)}:${Math.floor(Date.now() / 1000 / WINDOW)}`;
  const n = env.BUILDS ? Number((await env.BUILDS.get(key)) || 0) : memory.get(key) || 0;
  if (n >= LIMIT) throw new Bad('Too many tries. Try again in an hour.', 429);
  if (env.BUILDS) await env.BUILDS.put(key, String(n + 1), { expirationTtl: WINDOW + 60 });
  else {
    if (memory.size > 5000) memory.clear();
    memory.set(key, n + 1);
  }
}

async function readJson(req) {
  if (!/^application\/json\b/i.test(req.headers.get('content-type') || '')) throw new Bad('Send JSON.', 415);
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

// Transactional only: the kit link, nothing promotional.
async function sendKit(env, origin, email, kit) {
  if (!env.RESEND_API_KEY || !env.FROM_EMAIL) return false;
  const name = KITS[kit];
  const url = `${origin}/projects/skill-quest/kits/kit.html?k=${kit}`;
  const text = `Here's your free kit: ${name}\n\n${url}\n\nYou asked for this copy on AI Made EZ. To delete your email from our list: ${origin}/projects/skill-quest/kits/#forget`;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.FROM_EMAIL, to: [email], subject: `Your free kit: ${name}`, text }),
  });
  return r.ok;
}

async function handle({ request: req, env, params }) {
  const parts = Array.isArray(params?.path) ? params.path : params?.path ? [params.path] : [];
  const path = parts.join('/');
  if (req.method !== 'POST') return json({ error: 'That method is not allowed here.' }, 405);
  if (!originOk(req)) return json({ error: 'Not allowed.' }, 403);
  if (!env.SMEZ) return json({ open: false }, 503);

  if (path === 'signup') {
    const b = await readJson(req);
    if (typeof b.website === 'string' && b.website.trim()) return json({ ok: true, sent: false }, 201); // honeypot
    const email = cleanEmail(b.email);
    const kit = typeof b.kit === 'string' && KITS[b.kit] ? b.kit : null;
    if (!kit) throw new Bad('Unknown kit.');
    await take(env, req);
    const news = b.news === true ? 1 : 0;
    const now = Date.now();
    await env.SMEZ.prepare(
      'INSERT INTO kit_signups (email, kit, news, consent_ver, created_at) VALUES (?, ?, ?, ?, ?) ' +
      'ON CONFLICT(email, kit) DO UPDATE SET news = MAX(news, excluded.news), consent_ver = excluded.consent_ver'
    ).bind(email, kit, news, CONSENT_VER, now).run();
    let sent = false;
    try { sent = await sendKit(env, new URL(req.url).origin, email, kit); } catch { sent = false; }
    if (sent) await env.SMEZ.prepare('UPDATE kit_signups SET sent_at = ? WHERE email = ? AND kit = ?').bind(now, email, kit).run();
    return json({ ok: true, sent }, 201);
  }
  if (path === 'forget') {
    const b = await readJson(req);
    const email = cleanEmail(b.email);
    await take(env, req);
    await env.SMEZ.prepare('DELETE FROM kit_signups WHERE email = ?').bind(email).run();
    return json({ ok: true });
  }
  return json({ error: 'Not found.' }, 404);
}

export async function onRequest(ctx) {
  try {
    return await handle(ctx);
  } catch (e) {
    if (e instanceof Bad) return json({ error: e.message }, e.status);
    console.error('kits api error:', e && e.name); // never the email
    return json({ error: 'Something went wrong. Try again.' }, 500);
  }
}
