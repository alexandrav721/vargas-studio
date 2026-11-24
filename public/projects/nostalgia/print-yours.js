/* "Your Year at 15" print designer. Show-first: nothing is sold or charged here.
 * Reads the result from the link, like the share link:
 *   solo   ?year=2004&had=a.b.c          (item ids, base 36, catalog order)
 *   gift   ?year=2002&for=gift           (no picks yet: tick what they had)
 *   group  ?y=2004&p=Maya.t.1a.2b&p=...  (the group link, see group.js)
 * The away message comes from this browser only (never the link). */
import { count } from "./count.js";
count("print_open");
import { ITEMS } from "./catalog-data.js";
import { primaryEra } from "./data.js";
import { personaFor, personaFromKey, personaKey, signatureFor } from "./moments.js";
import { decodeGroup, displayName, inCommon, whoHad } from "./group.js";
import { LOOK, drawPoster, UNIT_W, UNIT_H } from "./poster.js";

const FIRST = 1995;
const LAST = 2016;
const MAX = 10;
const AWAY_KEY = "scrollback.away.v1";

const $ = (s) => document.querySelector(s);
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const short = (n) => String(n || "").replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim();
function load(k, d) {
  try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; }
}
function save(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* this visit only */ }
}

const ALL_ITEMS = Object.entries(ITEMS).flatMap(([era, l]) => l.map((it) => ({ ...it, era })));
const ITEM_NAMES = ALL_ITEMS.map((i) => i.name);
const ITEM_BY_NAME = new Map(ALL_ITEMS.map((i) => [i.name, i]));

function span(years) {
  const n = String(years || "").match(/19\d\d|20\d\d/g)?.map(Number) || [];
  return n.length ? [Math.min(...n), Math.max(...n)] : null;
}
function near(it, y) {
  const p = span(it.years);
  if (!p) return 99;
  if (y >= p[0] && y <= p[1]) return 0;
  return Math.min(Math.abs(y - p[0]), Math.abs(y - p[1]));
}

/* ---------- read the result ---------- */
const q = new URLSearchParams(location.search);
const group = q.getAll("p").length ? decodeGroup(location.search, ITEM_NAMES, { first: FIRST, last: LAST }) : null;
const isGroup = !!group;
const isGift = q.get("for") === "gift";
const clampYear = (v) => Math.min(LAST, Math.max(FIRST, Math.round(Number(v)) || 2004));
const year = isGroup ? group.year : clampYear(q.get("year"));
const era = primaryEra(year - 2, year + 2);
const look = LOOK[era.id] || LOOK.dialup;

const picked = new Set();
if (!isGroup && q.get("had")) {
  q.get("had").split(".").forEach((x) => {
    const n = parseInt(x, 36);
    if (/^[0-9a-z]{1,3}$/.test(x) && n >= 0 && n < ITEM_NAMES.length && picked.size < MAX) picked.add(ITEM_NAMES[n]);
  });
}

// the page wears the year's colours
const root = document.documentElement.style;
root.setProperty("--bg0", look.bg0);
root.setProperty("--bg1", look.bg1);
root.setProperty("--ink", look.ink);
root.setProperty("--muted", look.muted);
root.setProperty("--brand", look.brand);
root.setProperty("--brand-2", look.brand2);
document.querySelector('meta[name="theme-color"]')?.setAttribute("content", look.bg0);

/* ---------- what the poster says ---------- */
function soloData() {
  const had = [...picked].map((n) => ITEM_BY_NAME.get(n)).filter(Boolean);
  const persona = had.length ? personaFor(had, year - 2, year + 2) : "";
  const sig = had.length ? signatureFor(had, year - 2, year + 2) : null;
  return {
    mode: "solo",
    year,
    era: era.id,
    label: "Fifteen in",
    persona,
    tag: sig?.tag || "",
    eraName: persona ? "" : era.label,
    listLabel: isGift ? "What they had" : "What I had",
    items: had.map((it) => short(it.name)),
    away: $("#away").value,
  };
}

function groupData() {
  const all = group.players;
  const n = all.length;
  const common = inCommon(all);
  const people = all.map((p, k) => {
    const items = p.had.map((x) => ITEM_BY_NAME.get(x)).filter(Boolean);
    const key = p.key || personaKey(items);
    return { name: displayName(p, k, n) + (p.year !== year ? ` (${p.year})` : ""), persona: personaFromKey(key, p.year - 2, p.year + 2) };
  });
  // what we shared, most shared first; then what one of us had, to fill up to 10
  const counts = whoHad(all);
  const rest = [...counts.entries()].filter(([, ks]) => ks.length < 2).map(([x]) => x);
  const items = [...common.map((c) => c.name), ...rest].slice(0, MAX).map(short);
  const c = common.length;
  return {
    mode: "group",
    year,
    era: era.id,
    label: "Our year at 15",
    groupLine: n === 1 ? "Just one of us so far" : `${n} of us, ${c} thing${c === 1 ? "" : "s"} in common`,
    people,
    listLabel: c ? "What we had" : "What we had between us",
    items,
    away: "",
  };
}

const data = () => (isGroup ? groupData() : soloData());

/* ---------- the preview ---------- */
const canvas = $("#poster");
let fontsReady = false;
async function fonts() {
  if (fontsReady) return;
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load("800 100px Syne"),
        document.fonts.load("500 40px 'IBM Plex Mono'"),
        document.fonts.load("italic 500 40px 'IBM Plex Sans'"),
      ]),
      new Promise((ok) => setTimeout(ok, 1500)),
    ]);
  } catch { /* draw with fallbacks */ }
  fontsReady = true;
}

function describe(d) {
  const who = d.mode === "group" ? `${d.groupLine}.` : d.persona ? `${d.persona}${d.tag ? `, ${d.tag}` : ""}.` : "";
  const list = d.items.length ? ` ${d.listLabel}: ${d.items.join(", ")}.` : "";
  return `Poster preview. ${d.label} ${d.year}. ${who}${list}`;
}

let raf = 0;
function paint() {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    // the hint shows on screen only, never in the downloaded file
    const d = { ...data(), hint: isGift ? "Tap what they had" : "Tap what you had" };
    drawPoster(canvas, d);
    canvas.setAttribute("aria-label", describe(d));
  });
}

/* ---------- controls ---------- */
function paintChips() {
  // the year's things (the same pool the game deals from), plus anything already ticked
  const pool = ALL_ITEMS.filter((it) => near(it, year) <= 2).sort((a, b) => near(a, year) - near(b, year)).slice(0, 14);
  picked.forEach((n) => { if (!pool.some((it) => it.name === n)) pool.unshift(ITEM_BY_NAME.get(n)); });
  $("#chips").innerHTML = pool
    .map((it) => `<button type="button" class="chip" data-name="${esc(it.name)}" aria-pressed="${picked.has(it.name)}">${esc(short(it.name))}</button>`)
    .join("");
  paintCount();
}
function paintCount() {
  $("#things-count").textContent = picked.size ? `${picked.size} of ${MAX}` : `pick up to ${MAX}`;
  document.querySelectorAll(".chip").forEach((b) => {
    const on = picked.has(b.dataset.name);
    b.setAttribute("aria-pressed", String(on));
    b.disabled = !on && picked.size >= MAX;
  });
}
$("#chips").addEventListener("click", (e) => {
  const b = e.target.closest(".chip");
  if (!b || b.disabled) return;
  const n = b.dataset.name;
  if (picked.has(n)) picked.delete(n);
  else if (picked.size < MAX) picked.add(n);
  paintCount();
  paint();
});

if (isGroup) {
  $("#py-title").textContent = `Our ${year}, as a print`;
  $("#things").hidden = true;
  $("#away-field").hidden = true;
  $("#back").href = `./${location.search}`;
} else {
  $("#py-title").textContent = isGift ? `Their ${year}, as a print` : "Make it a print";
  $("#things-legend").firstChild.textContent = isGift ? "What they had " : "What you had ";
  $("#away").value = isGift ? "" : String(load(AWAY_KEY, "") || "").slice(0, 60);
  $("#away").addEventListener("input", () => {
    if (!isGift) save(AWAY_KEY, $("#away").value.slice(0, 60));
    paint();
  });
  $("#back").href = `./?year=${year}`;
  paintChips();
}
document.title = `${isGroup ? `Our ${year}` : `${year}`}, as a print · Scrollback`;

/* ---------- download: the print-size file ---------- */
function toBlob(c) {
  return new Promise((ok) => {
    try { c.toBlob((b) => ok(b), "image/png"); } catch { ok(null); }
  });
}
async function renderAt(w) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = Math.round((w * UNIT_H) / UNIT_W);
  if (!drawPoster(c, data())) return null;
  const blob = await toBlob(c);
  c.width = 1; // free the memory
  c.height = 1;
  return blob;
}
$("#download").addEventListener("click", async () => {
  const btn = $("#download");
  const note = $("#download-note");
  btn.disabled = true;
  btn.textContent = "Making the file…";
  await fonts();
  // phones cap canvas size: try print size, then smaller
  let size = 3600;
  let blob = await renderAt(3600);
  if (!blob) { size = 2400; blob = await renderAt(2400); }
  btn.disabled = false;
  btn.textContent = "Download preview";
  if (!blob) {
    note.textContent = "This browser couldn't make the file. Try a computer.";
    return;
  }
  note.textContent = size === 3600
    ? "PNG, 3600 × 5400 px: print size at 300 dpi."
    : "PNG, 2400 × 3600 px (this phone's limit). Full size works on a computer.";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `scrollback-${isGroup ? "our-" : ""}${year}-print-preview.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
});

/* ---------- "Tell me when prints open" (switched off until she says yes) ---------- */
$("#notify").addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = $("#notify-status");
  const input = $("#email");
  const email = input.value.trim();
  status.dataset.tone = "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    status.textContent = "Enter a real email.";
    status.dataset.tone = "bad";
    input.focus();
    return;
  }
  const btn = $("#notify-go");
  btn.disabled = true;
  status.textContent = "Sending…";
  let res = null;
  let body = {};
  try {
    res = await fetch("/api/sb/notify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, year, source: isGroup ? "group" : isGift ? "gift" : "print", website: $("#website").value }),
    });
    body = await res.json().catch(() => ({}));
  } catch {
    res = null;
  }
  btn.disabled = false;
  // only a real yes from the server counts as saved
  if (res && res.ok && body.ok === true) {
    status.textContent = "Saved. One email when prints open.";
    status.dataset.tone = "good";
    input.value = "";
  } else if (res && res.status === 503) {
    status.textContent = "Sign-ups aren't switched on yet. Check back soon.";
  } else if (res && (res.status === 400 || res.status === 429) && body.error) {
    status.textContent = body.error;
    status.dataset.tone = "bad";
  } else {
    status.textContent = "Couldn't save that right now. Nothing was stored. Try again later.";
    status.dataset.tone = "bad";
  }
});

/* ---------- go ---------- */
paint();
fonts().then(paint);
