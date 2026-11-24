// Weekline v2: state, API client, live events, learning and the week planner.
import {
  GOALS, HOODS, PLACES, DAYS, MON3, SAMPLE_EVENTS, EDITORIAL_EVENTS, LEARN_EVENTS, DATED_EVENTS,
  HOLIDAYS, TAG_WORDS, SLOT_WORDS, DAYS_LONG, photoFor, goalsForTags,
} from "./data.js";
import { ALGO_V1 } from "./algo.js";

/* ---------- the algorithm settings (live version from the server; v1 built in) ---------- */
export let A = ALGO_V1;
export function setAlgo(a) { if (a && a.learn && a.fit && a.week) A = a; }

/* ---------- dates (America/New_York) ---------- */
const qs = new URLSearchParams(location.search);
export function nyToday() {
  const forced = qs.get("today");
  if (forced && /^\d{4}-\d{2}-\d{2}$/.test(forced)) return forced;
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
const toUTC = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const fromUTC = (dt) => dt.toISOString().slice(0, 10);
export const addDays = (iso, n) => { const d = toUTC(iso); d.setUTCDate(d.getUTCDate() + n); return fromUTC(d); };
export const dow = (iso) => (toUTC(iso).getUTCDay() + 6) % 7; // 0 = Mon
export const weekStart = (iso) => addDays(iso, -dow(iso));
export const dayNum = (iso) => Number(iso.slice(8, 10));
export const monthIdx = (iso) => Number(iso.slice(5, 7)) - 1;
export const yearOf = (iso) => Number(iso.slice(0, 4));
export const daysBetween = (a, b) => Math.round((toUTC(b) - toUTC(a)) / 86400000);
export function daypart(h) { return h < 12 ? "morning" : h < 17 ? "afternoon" : h < 21 ? "evening" : "night"; }
export function parseTime(t) {
  const m = String(t || "").match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return { h: 18, mi: 0 };
  let h = Number(m[1]) % 12; if (/pm/i.test(m[3])) h += 12;
  return { h, mi: Number(m[2]) };
}
export function fmtTime(h, mi) { return `${h % 12 || 12}:${String(mi).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`; }

/* ---------- local state ---------- */
const KEY = "weekline.v2";
const blank = () => ({
  v: 1, device: rid(16), profile: null, signals: [], locks: {}, skips: {}, checkins: {}, kept: {},
  invites: [], polls: [], local: { rsvps: {}, votes: {} }, myRsvp: {}, myVote: {}, uploadedFor: null, friendCounts: {}, calOk: {},
});
function rid(n) { const a = new Uint8Array(n); crypto.getRandomValues(a); return Array.from(a, (b) => (b % 36).toString(36)).join(""); }
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...blank(), ...JSON.parse(raw) }; } catch (e) { /* storage blocked */ }
  return blank();
}
export const S = load();
export const session = { mode: "unknown", user: null, liveStatus: "idle", liveCount: 0, note: "", google: { loaded: false, configured: false, connected: false } };
export function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage blocked: keeps working in memory */ } }
export function resetLocal() { const d = S.device; Object.keys(S).forEach((k) => delete S[k]); Object.assign(S, blank(), { device: d }); save(); }

/* ---------- API client: falls back to "device only" when the API isn't there ---------- */
class Offline extends Error {}
export async function api(method, path, body) {
  let res;
  try {
    res = await fetch("/api/wl/" + path, {
      method, credentials: "same-origin", headers: body === undefined ? {} : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (e) { session.mode = "device"; throw new Offline("unreachable"); }
  const isJson = (res.headers.get("content-type") || "").includes("json");
  if (!isJson) { session.mode = "device"; throw new Offline("no api"); }
  const data = await res.json().catch(() => ({}));
  if (res.status === 503) { session.mode = "device"; throw new Offline("db"); }
  if (session.mode !== "server") session.mode = "server";
  if (!res.ok) { const err = new Error(data.error || "Something went wrong. Try again."); err.status = res.status; throw err; }
  return data;
}
export const isOffline = (e) => e instanceof Offline;

export async function boot() {
  try {
    const me = await api("GET", "me");
    session.user = me.user || null;
    adoptServer(me);
  } catch (e) {
    if (isOffline(e)) { session.mode = "device"; return; }
    if (e.status === 401) { session.mode = "server"; session.user = null; return; }
    session.mode = "device";
  }
}
function adoptServer(me) {
  const data = me.profile && (me.profile.data || me.profile);
  if (data && typeof data === "object" && Object.keys(data).length) {
    const { locks, app, ...profile } = data;
    if (profile.goals) S.profile = { ...profile, guest: false };
    if (Array.isArray(locks)) { S.locks = {}; locks.forEach((l) => { if (l && l.event_id && l.start) S.locks[l.event_id] = fromServerLock(l, me.signals || []); }); }
    if (app && typeof app === "object") ["skips", "checkins", "kept", "invites", "polls", "myRsvp", "myVote"].forEach((k) => { if (app[k]) S[k] = app[k]; });
  }
  if (Array.isArray(me.signals)) S.signals = me.signals.map((s) => ({ ...s, tags: typeof s.tags === "string" ? safeJson(s.tags, String(s.tags).split(",")) : s.tags || [] }));
  save();
}
// Server keeps a slim lock {event_id,title,start,end,place,url,source}; rebuild the rest from the lock signal.
function fromServerLock(l, signals) {
  const date = l.start.slice(0, 10);
  const tm = l.start.match(/T(\d{2}):(\d{2})/);
  const h = tm ? Number(tm[1]) : 18, mi = tm ? Number(tm[2]) : 0;
  const sig = signals.find((s) => s.event_id === l.event_id && s.kind === "lock");
  const all = (sig && sig.tags) || [];
  const costTag = all.find((t) => String(t).startsWith("cost:"));
  const cost = costTag ? Number(String(costTag).slice(5)) : undefined;
  const tags = all.filter((t) => !/^(slot|cost):/.test(String(t)));
  const [hood, borough] = String(l.place || "").split(", ");
  const kind = l.source === "Live NYC Parks" ? "live" : l.source === "Editorial" ? "editorial" : "sample";
  return { ...l, start: l.start.length === 16 ? l.start + ":00" : l.start, end: l.end || l.start, date, h, mi, time: fmtTime(h, mi), hood: hood || "", borough: borough || "", tags, goals: goalsForTags(tags), kind, photo: photoFor(tags), ...(Number.isFinite(cost) ? { cost } : { costUnknown: true }) };
}
function safeJson(s, fb) { try { return JSON.parse(s); } catch (e) { return fb; } }

export async function signUp(email, password, name) {
  const r = await api("POST", "signup", { email, password, name });
  session.user = r.user; await uploadOnce(); return r.user;
}
export async function signIn(email, password) {
  const r = await api("POST", "signin", { email, password });
  session.user = r.user;
  const me = await api("GET", "me").catch(() => null);
  const serverEmpty = !me || !me.profile || !(me.profile.data || me.profile).goals;
  if (me && !serverEmpty) adoptServer(me); else await uploadOnce();
  return r.user;
}
export async function signOut() {
  try { await api("POST", "signout"); } catch (e) { /* fine */ }
  session.user = null; resetLocal(); forgetBusy();
}
export async function deleteAccount() {
  if (session.user) await api("DELETE", "me");
  session.user = null; resetLocal(); forgetBusy();
}

/* ---------- Google Calendar: busy times only, never what they are ---------- */
const busyMem = new Map(); // range key -> [[startWall, endWall], ...] in New York wall clock
function forgetBusy() { busyMem.clear(); session.google.connected = false; }
export async function googleStatus() {
  try {
    const r = await api("GET", "google/status");
    session.google = { loaded: true, configured: !!r.configured, connected: !!r.connected };
  } catch (e) { session.google = { loaded: true, configured: false, connected: false }; }
  if (!session.google.connected) busyMem.clear();
  return session.google;
}
export async function disconnectGoogle() {
  await api("POST", "google/disconnect");
  forgetBusy();
}
const NYW = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
/** An instant -> "YYYY-MM-DDTHH:MM" on New York's clock, so it compares as text with row times. */
export function nyWall(iso) {
  const p = Object.fromEntries(NYW.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
/** Busy blocks for New York dates first..last (inclusive). Cached in memory per range. null = not connected. */
export async function fetchBusy(first, last) {
  const key = first + "_" + last;
  if (busyMem.has(key)) return busyMem.get(key);
  // Pad a day each side in UTC so the whole New York range is covered; extra blocks never match a row.
  const from = addDays(first, -1) + "T00:00:00Z", to = addDays(last, 2) + "T00:00:00Z";
  const r = await api("GET", `google/busy?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  if (r.connected === false) { forgetBusy(); return null; }
  const list = (r.busy || []).map((b) => [nyWall(b.start), nyWall(b.end)]);
  busyMem.set(key, list);
  return list;
}
export const overlaps = (busy, a, b) => !!busy && busy.some(([s, e]) => s < b && e > a);
const hm = (h) => { const hh = Math.min(23, Math.floor(h)), mm = h >= 24 ? 59 : Math.round((h % 1) * 60); return `${String(hh).padStart(2, "0")}:${String(Math.min(59, mm)).padStart(2, "0")}`; };
/** The evening window (5 to 11 pm) on a date. */
export const eveningBusy = (busy, date) => overlaps(busy, `${date}T17:00`, `${date}T23:00`);
/** Does a row's own time (start to end, or 2 hours) hit a busy block? */
export function rowBusy(busy, ev) {
  const start = ev.h + (ev.mi || 0) / 60;
  const end = ev.endH && ev.endH > start ? ev.endH : start + 2;
  return overlaps(busy, `${ev.date}T${hm(start)}`, `${ev.date}T${hm(Math.min(24, end))}`);
}
export function lockBusy(busy, l) {
  const s = String(l.start || "").slice(0, 16), e0 = String(l.end || "").slice(0, 16);
  if (!s) return false;
  return overlaps(busy, s, e0 > s ? e0 : `${l.date}T${hm(Math.min(24, (l.h ?? 18) + (l.mi || 0) / 60 + 2))}`);
}
async function uploadOnce() {
  if (!session.user || S.uploadedFor === session.user.id) return;
  if (S.profile) { S.profile.guest = false; if (!S.profile.name && session.user.name) S.profile.name = session.user.name; }
  await pushProfile();
  for (let i = 0; i < S.signals.length; i += 200) {
    await api("POST", "signals", { items: S.signals.slice(i, i + 200).map(sigOut) }).catch(() => {});
  }
  await pushLocks();
  S.uploadedFor = session.user.id; save();
}
const sigOut = (s) => ({ event_id: s.event_id, kind: s.kind, reason: s.reason || undefined, tags: s.tags || [], at: s.at });
function profilePayload() {
  return {
    ...(S.profile || {}), locks: Object.values(S.locks),
    app: { skips: Object.fromEntries(Object.entries(S.skips).slice(-150)), checkins: S.checkins, kept: S.kept, invites: S.invites, polls: S.polls, myRsvp: S.myRsvp, myVote: S.myVote },
  };
}
let pushT = 0;
export function pushProfile() {
  save();
  if (!session.user) return Promise.resolve();
  clearTimeout(pushT);
  return new Promise((res) => { pushT = setTimeout(() => api("PUT", "profile", { data: profilePayload(), name: (S.profile && S.profile.name) || undefined }).catch(() => {}).finally(res), 300); });
}
function pushLocks() {
  if (!session.user) return Promise.resolve();
  const items = Object.values(S.locks).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 100)
    .map((l) => ({ event_id: l.event_id, title: l.title, start: l.start.slice(0, 16), end: l.end && l.end.slice(0, 16), place: l.place, url: l.url, source: sourceLabel(l.kind) }));
  return api("PUT", "locks", { items }).catch(() => {});
}
export function subscribeFeed() { return api("POST", "feed"); }
export function exportData() {
  if (session.user) return api("GET", "export");
  return Promise.resolve({ saved_on: "this device", profile: S.profile, signals: S.signals, locks: Object.values(S.locks), checkins: S.checkins, skips: S.skips, invites: S.invites, polls: S.polls });
}

/* ---------- signals and learning ---------- */
export function signal(kind, ev, reason, extraTags = []) {
  const tags = [...(ev.tags || []), "slot:" + slotOf(ev), ...(kind === "lock" && typeof ev.cost === "number" ? ["cost:" + ev.cost] : []), ...extraTags];
  const s = { event_id: ev.id, kind, reason: reason || null, tags, at: Date.now() };
  S.signals.push(s); save();
  if (session.user) api("POST", "signals", { items: [sigOut(s)] }).catch(() => {});
}
export const slotOf = (ev) => `${DAYS[dow(ev.date)].toLowerCase()}-${daypart(ev.h ?? 18)}`;

export function model() {
  const tag = {}, slot = {};
  let far = 0, pricey = 0;
  const now = Date.now();
  const add = (o, k, v) => { o[k] = (o[k] || 0) + v; };
  for (const s of S.signals) {
    const at = typeof s.at === "number" ? (s.at < 1e12 ? s.at * 1000 : s.at) : Date.parse(s.at) || now;
    const d = Math.pow(0.5, (now - at) / (A.learn.halfLifeDays * 86400000)); // older choices fade
    const tags = (s.tags || []).filter((t) => !String(t).startsWith("slot:"));
    const sl = (s.tags || []).find((t) => String(t).startsWith("slot:"));
    const w = A.learn.weights[s.kind];
    if (w) tags.forEach((t) => add(tag, t, w * d));
    if (s.kind === "skip") {
      if (s.reason === "far") far += d;
      else if (s.reason === "pricey") pricey += d;
      else if (s.reason === "notme") tags.forEach((t) => add(tag, t, A.learn.skip.notme * d));
      else if (s.reason === "busy" && sl) add(slot, sl.slice(5), A.learn.skip.busy * d);
      else if (s.reason === "missed" && sl) add(slot, sl.slice(5), A.learn.skip.missed * d);
    }
  }
  return { tag, slot, far, pricey };
}

const GENERIC = new Set(["free", "parks", "class", "learn"]);
export function learned() {
  const m = model();
  const likes = Object.entries(m.tag).filter(([t, v]) => v >= 2 && TAG_WORDS[t] && !GENERIC.has(t)).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => TAG_WORDS[t]);
  const goodSlots = {};
  S.signals.filter((s) => ["went", "lock", "loved"].includes(s.kind)).forEach((s) => {
    const sl = (s.tags || []).find((t) => String(t).startsWith("slot:")); if (sl) { const p = sl.split("-")[1]; goodSlots[p] = (goodSlots[p] || 0) + 1; }
  });
  const topPart = Object.entries(goodSlots).sort((a, b) => b[1] - a[1])[0];
  if (topPart && topPart[1] >= 2) likes.push(SLOT_WORDS[topPart[0]]);
  const skips = [];
  if (m.far >= 0.5) skips.push("far-away");
  if (m.pricey >= 0.5) skips.push("pricey");
  Object.entries(m.tag).filter(([t, v]) => v <= -0.5 && TAG_WORDS[t] && !GENERIC.has(t)).sort((a, b) => a[1] - b[1]).slice(0, 2).forEach(([t]) => skips.push(TAG_WORDS[t]));
  Object.entries(m.slot).filter(([, v]) => v <= -0.5).sort((a, b) => a[1] - b[1]).slice(0, 1).forEach(([k]) => {
    const [d, p] = k.split("-"); const i = DAYS.findIndex((x) => x.toLowerCase() === d);
    skips.push(`${DAYS_LONG[i]} ${SLOT_WORDS[p]}`);
  });
  const counts = {};
  S.signals.forEach((s) => { const k = s.kind === "skip" && s.reason === "missed" ? "missed" : s.kind; counts[k] = (counts[k] || 0) + 1; });
  return { likes, skips, counts, total: S.signals.length };
}

/* ---------- events ---------- */
const MANHATTAN = [40.758, -73.985], BROOKLYN = [40.678, -73.944];
function travelMin(a, b) {
  const R = 3958.8, r = (x) => (x * Math.PI) / 180;
  const dLat = r(b[0] - a[0]), dLng = r(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(h))) * 2.2 + 12);
}
export function homeGeo(p) {
  if (!p) return BROOKLYN;
  const z = HOODS[p.zone] || HOODS.brooklyn;
  return z[p.hood] || (p.zone === "manhattan" ? MANHATTAN : BROOKLYN);
}
function placeGeo(name, borough) {
  return HOODS.brooklyn[name] || HOODS.manhattan[name] || PLACES[name] || (borough === "Manhattan" ? MANHATTAN : BROOKLYN);
}
export const sourceLabel = (k) => (k === "live" ? "Live NYC Parks" : k === "editorial" ? "Editorial" : "Sample");

function norm(e, date) {
  const { h, mi } = e.h !== undefined ? e : parseTime(e.time);
  const ev = {
    id: e.date ? e.id : `${e.id}@${date}`, title: e.title, hood: e.hood, borough: e.borough, date: e.date || date,
    h, mi, time: fmtTime(h, mi), cost: e.cost, tags: e.tags, kind: e.kind, url: e.url, geo: e.geo || placeGeo(e.hood, e.borough),
    endH: e.endH,
  };
  ev.goals = goalsForTags(ev.tags);
  ev.photo = photoFor(ev.tags);
  return ev;
}

// NYC Parks "Upcoming 14 Days" (SODA, no key). Times are New York wall clock.
const PARKS_URL = "https://data.cityofnewyork.us/resource/w3wp-dpdi.json";
function parksTags(cat, title) {
  const s = `${cat} ${title}`.toLowerCase();
  const t = new Set(["free", "parks"]);
  const add = (...x) => x.forEach((y) => t.add(y));
  if (/fitness|exercise|zumba|shape up|sport|workout|bootcamp|strength/.test(s)) add("active", "fitness");
  if (/yoga|pilates|tai chi/.test(s)) add("active", "yoga");
  if (/\brun|running/.test(s)) add("active", "run");
  if (/walk|hike|stroll/.test(s)) add("walk", "outdoors");
  if (/outdoor|nature|garden|waterfront|bird|forest|tree/.test(s)) add("outdoors");
  if (/art|exhibit|museum|gallery/.test(s)) add("art", "culture");
  if (/film|movie/.test(s)) add("film", "culture");
  if (/music|concert|jazz/.test(s)) add("music");
  if (/dance/.test(s)) add("dance", "active");
  if (/market|fair|festival|holiday/.test(s)) add("market", "culture");
  if (/tour|history|lecture|talk/.test(s)) add("talks", "culture", "history");
  if (/class|workshop|lesson|education|learn/.test(s)) add("learn", "class");
  if (/volunteer|clean|community/.test(s)) add("community", "social");
  if (/photo/.test(s)) add("photography");
  if (/meditat|mindful|relax|tai chi/.test(s)) add("calm");
  return [...t];
}
export async function fetchLive(from, toExclusive) {
  const ck = `wl.parks.${from}.${toExclusive}`;
  try { const c = JSON.parse(sessionStorage.getItem(ck) || "null"); if (c && Date.now() - c.at < 30 * 60000) return c.rows; } catch (e) { /* ignore */ }
  const params = new URLSearchParams({ $where: `starttime >= '${from}T00:00:00' AND starttime < '${toExclusive}T00:00:00'`, $order: "starttime", $limit: "600" });
  const ctrl = new AbortController(); const tm = setTimeout(() => ctrl.abort(), 8000);
  const res = await fetch(`${PARKS_URL}?${params}`, { headers: { accept: "application/json" }, signal: ctrl.signal });
  clearTimeout(tm);
  if (!res.ok) throw new Error("parks " + res.status);
  const rows = await res.json();
  const out = [], seen = new Set();
  for (const r of rows) {
    if (!r.title || !r.starttime || !r.guid) continue;
    const cat = r.categories || "";
    if (/kids|children|toddler|tots|teen|family|seniors|youth/i.test(`${cat} ${r.title}`)) continue;
    if (/^\s*(cancel+ed|postponed|rescheduled)\b/i.test(r.title) || /cancel+ed|postponed/i.test(r.status || "")) continue;
    if (/virtual|online|zoom/i.test(`${r.title} ${r.location || ""}`)) continue;
    const code = (r.parkids || "").trim().charAt(0).toUpperCase();
    const borough = code === "M" ? "Manhattan" : code === "B" ? "Brooklyn" : null;
    if (!borough) continue;
    const m = r.starttime.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/); if (!m) continue;
    const em = (r.endtime || "").match(/T(\d{2}):(\d{2})/);
    const title = decode(r.title);
    const key = title.toLowerCase().slice(0, 40) + m[1];
    if (seen.has(key)) continue; seen.add(key);
    const geo = (r.coordinates || "").split(",").map(Number);
    out.push({
      id: `nyc_parks:${r.guid}`, title, hood: decode(r.parknames || "NYC Parks"), borough, date: m[1], h: Number(m[2]), mi: Number(m[3]),
      endH: em ? Number(em[1]) + Number(em[2]) / 60 : undefined, cost: 0, tags: parksTags(cat, title), kind: "live",
      url: (r.link && (r.link.url || r.link)) || "https://www.nycgovparks.org/events",
      geo: geo.length === 2 && !geo.some(isNaN) ? geo : null,
    });
  }
  try { sessionStorage.setItem(ck, JSON.stringify({ at: Date.now(), rows: out })); } catch (e) { /* ignore */ }
  return out;
}
function decode(s) {
  return String(s).replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/<[^>]+>/g, "").trim();
}

// All candidate events for a list of dates.
export function catalog(dates, live) {
  const out = [];
  const useSample = !live || live.length < 3;
  const templates = [...(useSample ? SAMPLE_EVENTS : []), ...EDITORIAL_EVENTS, ...LEARN_EVENTS];
  for (const date of dates) {
    const d = DAYS[dow(date)];
    if (HOLIDAYS[date]) continue; // weekly templates don't run on holidays; only dated rows and live listings
    templates.filter((t) => t.day === d).forEach((t) => out.push(norm(t, date)));
  }
  DATED_EVENTS.filter((e) => dates.includes(e.date)).forEach((e) => out.push(norm(e)));
  (live || []).filter((e) => dates.includes(e.date)).forEach((e) => out.push(norm({ ...e, geo: e.geo || placeGeo(e.hood, e.borough) })));
  return out;
}

/* ---------- scoring (spec "Learning") ---------- */
export function scoreEvent(ev, p, m, opts = {}) {
  const goals = p.goals || [];
  let goalFit = ev.goals.some((g) => goals.includes(g)) ? 1 : 0;
  if (goals.includes("learn") && ev.tags.includes("learn")) {
    const chips = (p.learn && p.learn.chips || []).map((c) => c.toLowerCase());
    const text = (p.learn && p.learn.text || "").toLowerCase();
    if (chips.some((c) => ev.tags.includes(c)) || (text && ev.tags.some((t) => text.includes(t)))) goalFit = A.fit.learnMatch;
    else if (chips.length || text) goalFit = A.fit.learnMiss;
  }
  if (goals.includes("calm") && ev.tags.includes("calm")) goalFit = Math.max(goalFit, 1);
  let aff = 0;
  ev.tags.forEach((t) => { aff += Math.max(A.fit.tagMin, Math.min(A.fit.tagMax, m.tag[t] || 0)); });
  aff += m.slot[slotOf(ev)] || 0;
  aff = Math.max(-A.fit.tasteCap, Math.min(A.fit.tasteCap, aff));
  const friends = S.friendCounts[ev.id] || 0;
  const mins = travelMin(homeGeo(p), ev.geo);
  const tol = Math.max(A.fit.minTolerance, (p.minutes || 30) - A.fit.farStep * m.far);
  if (mins > tol + A.fit.tooFarSlack) return null;
  const distPen = mins > tol ? (mins - tol) / A.fit.minutesPerPoint : 0;
  const budget = p.budget ?? 25;
  if (budget === 0 && ev.cost > 0) return null;
  const ptol = budget >= 100 ? 200 : budget * Math.pow(A.fit.priceDecay, m.pricey);
  const pricePen = ev.cost > ptol ? 1 + (ev.cost - ptol) / A.fit.pricePerPoint : 0;
  const novelty = S.signals.some((s) => s.event_id === ev.id) ? 0 : 1;
  let score = A.fit.goal * goalFit + aff + A.fit.friends * friends - distPen - pricePen + A.fit.novelty * novelty;
  if (opts.jitter) score += (hash(ev.id + opts.jitter) % 100) / 40;
  return { score, mins, goalFit, why: why(ev, p, goalFit, mins), because: because(ev, m, friends, goalFit, p) };
}
/* "Why this?": the plain reasons behind a pick, strongest first. */
function because(ev, m, friends, goalFit, p) {
  const out = [];
  const g = GOALS.find((x) => ev.goals.includes(x.id) && (p.goals || []).includes(x.id));
  if (g && goalFit >= 1) out.push(`Fits your goal: ${g.label.toLowerCase()}`);
  const liked = ev.tags.filter((t) => (m.tag[t] || 0) >= 2 && TAG_WORDS[t]).sort((a, b) => m.tag[b] - m.tag[a])[0];
  if (liked) out.push(`You've liked ${TAG_WORDS[liked]} before`);
  const sl = m.slot[slotOf(ev)] || 0;
  if (sl < -0.5) out.push(`You often skip this time, but it fit best`);
  if (friends) out.push(`${friends} ${friends === 1 ? "friend is" : "friends are"} going`);
  if (!S.signals.some((s) => s.event_id === ev.id)) out.push("Something new for you");
  return out.slice(0, 3);
}
function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
function why(ev, p, goalFit, mins) {
  const bits = [];
  const g = GOALS.find((x) => ev.goals.includes(x.id) && (p.goals || []).includes(x.id));
  if (g && goalFit >= 1) bits.push(g.short);
  bits.push(`${mins} min`);
  bits.push(ev.costUnknown ? "Price not saved" : ev.cost ? `$${ev.cost}` : "Free");
  return bits.join(" · ");
}

/* ---------- the week plan ---------- */
export function planDates(p, today) {
  if (p && p.visit && p.visit.from && p.visit.to) {
    const out = []; let d = p.visit.from;
    while (d <= p.visit.to && out.length < 10) { out.push(d); d = addDays(d, 1); }
    if (out.length) return out;
  }
  const ws = weekStart(today);
  return DAYS.map((_, i) => addDays(ws, i));
}

export function buildWeek(p, events, today, busy = null) {
  const dates = planDates(p, today);
  const m = model();
  const visiting = !!(p.visit && p.visit.from);
  const free = visiting ? [0, 1, 2, 3, 4, 5, 6] : (p.free_days || []);
  const jitter = p.guest ? (p.seed || "x") : null;
  const scored = events.map((ev) => {
    if (S.skips[ev.id]) return null;
    const isHol = !!HOLIDAYS[ev.date];
    const weekend = dow(ev.date) >= 5;
    if (!visiting && !weekend && !isHol && ev.h < 17) return null; // weekday free *nights*
    if (ev.h >= 23) return null;
    const s = scoreEvent(ev, p, m, { jitter }); if (!s) return null;
    return { ev, ...s };
  }).filter(Boolean);

  const days = dates.map((date) => {
    const lock = Object.values(S.locks).find((l) => l.date === date);
    let cands = scored.filter((c) => c.ev.date === date).sort((a, b) => b.score - a.score);
    const isFree = free.includes(dow(date));
    // Google Calendar: weeknights are busy if anything overlaps 5 to 11 pm; weekends drop only the rows that clash.
    let calBusy = false;
    if (busy && !lock && isFree && !HOLIDAYS[date] && date >= today && !S.calOk[date]) {
      if (dow(date) < 5) calBusy = eveningBusy(busy, date);
      else {
        const ok = cands.filter((c) => !rowBusy(busy, c.ev));
        calBusy = cands.length > 0 && ok.length === 0;
        cands = ok;
      }
      if (calBusy) cands = [];
    }
    const clash = !!(busy && lock && date >= today && lockBusy(busy, lock));
    return { date, d: dow(date), holiday: HOLIDAYS[date] || null, isFree, lock, cands, past: date < today, calBusy, clash };
  });

  const goalsSet = p.goals || [];
  const targetSum = goalsSet.reduce((a, g) => a + (GOALS.find((x) => x.id === g)?.target || 0), 0);
  const usable = days.filter((d) => d.isFree && !d.holiday && !d.calBusy && (!d.past || d.lock));
  const y = goalsSet.length ? Math.min(targetSum, usable.length) : usable.length;
  const keepOpen = goalsSet.includes("calm") ? Math.min(2, usable.length) : 0;
  const lockedCount = usable.filter((d) => d.lock).length;
  let need = Math.max(0, (visiting ? usable.length : Math.min(usable.length - keepOpen, goalsSet.length ? targetSum - (goalsSet.includes("calm") ? 2 : 0) : usable.length)) - lockedCount);
  const fillable = usable.filter((d) => !d.lock && !d.past && !S.kept[d.date] && d.cands.length).sort((a, b) => b.cands[0].score - a.cands[0].score);
  const used = new Set(Object.keys(S.locks));
  // Spread nights across goals: once a goal has its weekly target, its rows lose 4 points.
  const quota = {}; goalsSet.forEach((g) => { quota[g] = GOALS.find((x) => x.id === g)?.target || 1; });
  const have = {};
  days.filter((d) => d.lock).forEach((d) => (d.lock.goals || []).forEach((g) => { have[g] = (have[g] || 0) + 1; }));
  const adj = (c) => {
    const gs = c.ev.goals.filter((g) => quota[g] !== undefined && g !== "calm");
    if (!gs.length) return c.score;
    return gs.every((g) => (have[g] || 0) >= quota[g]) ? c.score - A.week.goalQuotaPenalty : c.score;
  };
  const open = new Set(fillable);
  while (need > 0 && open.size) {
    let best = null;
    for (const d of open) for (const c of d.cands) {
      if (used.has(c.ev.id) || c.score <= A.week.minScore) continue;
      const a = adj(c); if (!best || a > best.a) best = { d, c, a };
    }
    if (!best) break;
    best.d.plan = best.c; used.add(best.c.ev.id); open.delete(best.d); need--;
    best.c.ev.goals.forEach((g) => { have[g] = (have[g] || 0) + 1; });
  }
  for (const d of days) {
    d.suggest = d.cands.filter((c) => !used.has(c.ev.id) && (!d.plan || c.ev.id !== d.plan.ev.id));
    if (d.holiday) d.suggest = d.suggest.filter((c) => c.ev.cost === 0 && !c.ev.tags.includes("nightlife") && c.ev.h < 18)
      .sort((a, b) => (b.ev.tags.includes("calm") || b.ev.tags.includes("walk") ? 1 : 0) - (a.ev.tags.includes("calm") || a.ev.tags.includes("walk") ? 1 : 0)).slice(0, 2);
    else d.suggest = d.suggest.slice(0, A.week.suggestions);
    d.kind = d.lock ? "lock" : d.holiday ? "holiday" : !d.isFree ? "busy" : d.calBusy ? "cal" : d.plan ? "plan" : "free";
  }
  // goal nights: planned or locked rows that fit a goal, plus nights kept free for "Feel less busy"
  let x = days.filter((d) => (d.kind === "lock" && fitsGoal(d.lock, goalsSet)) || (d.kind === "plan" && d.plan.goalFit >= 1)).length;
  if (keepOpen) x += Math.min(keepOpen, days.filter((d) => d.kind === "free" && !d.holiday).length);
  if (!goalsSet.length) x = days.filter((d) => d.kind === "lock" || d.kind === "plan").length;
  return { days, x: Math.min(x, y), y, dates };
}
const fitsGoal = (lock, goals) => (lock.goals || goalsForTags(lock.tags || [])).some((g) => goals.includes(g));

export function snap(ev) {
  const start = `${ev.date}T${String(ev.h).padStart(2, "0")}:${String(ev.mi).padStart(2, "0")}:00`;
  const endH = ev.endH && ev.endH > ev.h ? ev.endH : ev.h + 2;
  const eh = Math.min(23, Math.floor(endH)), emi = Math.round((endH % 1) * 60);
  return {
    event_id: ev.id, title: ev.title, start, end: `${ev.date}T${String(eh).padStart(2, "0")}:${String(emi).padStart(2, "0")}:00`,
    place: `${ev.hood}, ${ev.borough}`, url: ev.url, date: ev.date, time: ev.time, h: ev.h, mi: ev.mi, hood: ev.hood, borough: ev.borough,
    tags: ev.tags, goals: ev.goals, kind: ev.kind, cost: ev.cost, photo: ev.photo, geo: ev.geo,
  };
}
export function lock(ev) { S.locks[ev.id] = snap(ev); signal("lock", ev); pushProfile(); pushLocks(); }
export function dropLock(id) { const l = S.locks[id]; if (!l) return; delete S.locks[id]; signal("unlock", { ...l, id }); pushProfile(); pushLocks(); }
export function skip(ev, reason) { S.skips[ev.id] = reason; signal("skip", ev, reason); pushProfile(); }
export function checkin(l, v) {
  S.checkins[l.event_id] = v;
  const ev = { ...l, id: l.event_id };
  if (v === "went" || v === "loved") signal("went", ev);
  if (v === "loved") signal("loved", ev);
  if (v === "didnt") signal("skip", ev, "missed");
  pushProfile();
}
export function pendingCheckins(today) {
  return Object.values(S.locks).filter((l) => l.date < today && !S.checkins[l.event_id]).sort((a, b) => a.date.localeCompare(b.date));
}

/* ---------- .ics ---------- */
export function icsFor(locks) {
  const esc = (s) => String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const f = (iso) => iso.replace(/[-:]/g, "").slice(0, 15);
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Weekline//v2//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:Weekline", "X-WR-TIMEZONE:America/New_York"];
  for (const l of locks) {
    lines.push("BEGIN:VEVENT", `UID:${esc(l.event_id)}@weekline`, `DTSTAMP:${stamp}`, `DTSTART;TZID=America/New_York:${f(l.start)}`, `DTEND;TZID=America/New_York:${f(l.end)}`,
      `SUMMARY:${esc(l.title)}`, `LOCATION:${esc(l.place)}`, `DESCRIPTION:${esc(`${sourceLabel(l.kind)}. ${l.url || ""}`)}`, `URL:${l.url || ""}`, "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

/* ---------- invites and polls ---------- */
const b64 = (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64 = (s) => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/")))));
export const isLocalToken = (t) => t.startsWith("l.");

export async function createInvite(l) {
  const when = `${DAYS[dow(l.date)]} ${dayNum(l.date)} ${MON3[monthIdx(l.date)]} · ${l.time}`;
  const event = { title: l.title, start: l.start.slice(0, 16), end: l.end && l.end.slice(0, 16), when, place: l.place, source: sourceLabel(l.kind), goal: l.photo, url: l.url, event_id: l.event_id };
  const from = (S.profile && S.profile.name) || (session.user && session.user.name) || "";
  let token;
  try { token = (await api("POST", "invites", { event })).token; }
  catch (e) { if (!isOffline(e)) throw e; token = "l." + b64({ ...event, from, n: rid(4) }); }
  S.invites.unshift({ token, event_id: l.event_id, title: l.title, date: l.date, at: Date.now() }); pushProfile();
  return token;
}
export async function getInvite(token) {
  if (isLocalToken(token)) {
    const ev = unb64(token.slice(2));
    const list = S.local.rsvps[token] || [];
    const mine = list.find((r) => r.device === S.device);
    return { event: ev, host: ev.from, you: mine ? { name: mine.name, status: mine.status } : null, counts: { in: list.filter((r) => r.status === "in").length, maybe: list.filter((r) => r.status === "maybe").length }, names: list.filter((r) => r.status === "in").map((r) => r.name), local: true };
  }
  return api("GET", "invites/" + encodeURIComponent(token) + "?device=" + S.device);
}
export async function rsvp(token, name, status) {
  const first = String(name || "").trim().split(/\s+/)[0].slice(0, 24);
  if (isLocalToken(token)) {
    const list = (S.local.rsvps[token] = (S.local.rsvps[token] || []).filter((r) => r.device !== S.device));
    if (status !== "out") list.push({ name: first, status, device: S.device });
  } else {
    await api("POST", `invites/${encodeURIComponent(token)}/rsvp`, { name: first, status, device: S.device });
  }
  if (status === "out") delete S.myRsvp[token]; else S.myRsvp[token] = { name: first, status };
  save();
}
export async function createPoll(question, options) {
  let token;
  try { token = (await api("POST", "polls", { question, options })).token; }
  catch (e) { if (!isOffline(e)) throw e; token = "l." + b64({ q: question, o: options, n: rid(4) }); }
  S.polls.unshift({ token, question, options, at: Date.now() }); pushProfile();
  return token;
}
export async function getPoll(token) {
  if (isLocalToken(token)) {
    const p = unb64(token.slice(2));
    const v = S.local.votes[token] || {};
    const votes = p.o.map((_, i) => Object.values(v).filter((x) => x === i).length);
    return { question: p.q, options: p.o, votes, you: v[S.device] ?? null, local: true };
  }
  return api("GET", "polls/" + encodeURIComponent(token) + "?device=" + S.device);
}
export async function vote(token, option) {
  if (isLocalToken(token)) { (S.local.votes[token] = S.local.votes[token] || {})[S.device] = option; }
  else await api("POST", `polls/${encodeURIComponent(token)}/vote`, { option, device: S.device });
  S.myVote[token] = option; save();
}
export async function refreshFriendCounts() {
  for (const inv of S.invites.slice(0, 12)) {
    try {
      const r = await getInvite(inv.token);
      // Your own "I'm in" is not a friend: drop one copy of your name and your count.
      const meIn = r.you === "in";
      const myName = ((session.user && session.user.name) || (S.profile && S.profile.name) || "").split(" ")[0];
      const names = (r.names || []).slice();
      if (meIn) { const at = names.indexOf(myName); names.splice(at >= 0 ? at : 0, 1); }
      S.friendCounts[inv.event_id] = Math.max(0, ((r.counts && r.counts.in) || 0) - (meIn ? 1 : 0));
      inv.names = names; inv.counts = r.counts;
    } catch (e) { /* keep last known */ }
  }
  save();
}

/* ---------- demo (only with ?demo=1) ---------- */
export function seedDemo(today) {
  resetLocal();
  const ws = weekStart(today), last = addDays(ws, -7);
  S.profile = {
    demo: true, name: "Alex", goals: ["fit", "learn"], learn: { text: "", chips: ["Pottery"] }, zone: "brooklyn", hood: "Greenpoint",
    minutes: 30, budget: 60, free_days: [0, 1, 2, 3, 4, 5], crew: "move-pack", onboarded: true,
  };
  const mk = (id, title, hood, date, time, tags, kind, cost = 0) => {
    const { h, mi } = parseTime(time);
    return snap({ id, title, hood, borough: "Brooklyn", date, h, mi, time, tags, kind, cost, url: "https://www.nycgovparks.org/events", goals: goalsForTags(tags), photo: photoFor(tags), geo: placeGeo(hood, "Brooklyn") });
  };
  const a = mk("l1@" + addDays(last, 1), "Intro to wheel throwing", "Greenpoint", addDays(last, 1), "7:00 PM", ["learn", "class", "pottery", "art"], "sample", 45);
  const b = mk("s17@" + addDays(last, 5), "Prospect Park run club", "Grand Army Plaza", addDays(last, 5), "10:00 AM", ["active", "run", "outdoors", "social", "free", "parks"], "sample");
  const c = mk("s19@" + addDays(last, 0), "Bodyweight intervals", "Williamsburg", addDays(last, 0), "6:00 PM", ["active", "fitness", "outdoors", "free", "parks"], "sample");
  const sat0 = addDays(ws, 5);
  const f = mk("s17@" + sat0, "Prospect Park run club", "Grand Army Plaza", sat0, "10:00 AM", ["active", "run", "outdoors", "social", "free", "parks"], "sample");
  S.locks[f.event_id] = f;
  const e = mk("s20@" + addDays(last, -4), "Hatha flow on the lawn", "Lower East Side", addDays(last, -4), "6:30 PM", ["active", "yoga", "free", "parks"], "sample");
  [a, b, c, e].forEach((l) => { S.locks[l.event_id] = l; });
  S.checkins[c.event_id] = "went"; S.checkins[e.event_id] = "didnt";
  const t0 = Date.now() - 9 * 86400000;
  const sig = (kind, l, reason) => S.signals.push({ event_id: l.event_id, kind, reason: reason || null, tags: [...l.tags, "slot:" + slotOf({ date: l.date, h: l.h })], at: t0 });
  [a, b, c, e].forEach((l) => sig("lock", l)); sig("went", c); sig("skip", e, "missed");
  sig("skip", { event_id: "s15@x", tags: ["music", "nightlife"], date: addDays(last, 5), h: 21 }, "notme");
  sig("skip", { event_id: "s8@x", tags: ["food", "music", "date"], date: addDays(last, 6), h: 11 }, "pricey");
  sig("skip", { event_id: "s1@x", tags: ["music", "outdoors"], date: addDays(last, 4), h: 18 }, "far");
  // one sample invite with replies saved on this device, clearly marked as demo data
  const sat = addDays(ws, 5);
  const tok = "l." + b64({ title: "Prospect Park run club", start: sat + "T10:00", when: `Sat ${dayNum(sat)} ${MON3[monthIdx(sat)]} · 10:00 AM`, place: "Grand Army Plaza, Brooklyn", source: "Sample", goal: "prospect-park", event_id: "s17@" + sat, from: "Alex", n: "demo" });
  S.invites.push({ token: tok, event_id: "s17@" + addDays(ws, 5), title: "Prospect Park run club", date: addDays(ws, 5), at: Date.now() });
  S.local.rsvps[tok] = [{ name: "Maya", status: "in", device: "d1" }, { name: "Jordan", status: "in", device: "d2" }, { name: "Sam", status: "maybe", device: "d3" }];
  save();
}
