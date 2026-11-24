/* Scrollback moments: Open the Real Page · Your Room · The One You Never Got.
   Adds to the explorer; the catalog and lenses are unchanged.
   Saved state (had / wanted / away message) lives only in this browser. */

import { ITEM_MEDIA } from "./media.js";
import { ITEMS as CATALOG_ITEMS } from "./catalog-data.js";

const OWN_KEY = "scrollback.own.v1";
const AWAY_KEY = "scrollback.away.v1";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode: works for this visit only */
  }
}

const own = load(OWN_KEY, {}); // { "Tamagotchi": "had" | "wanted" }
let away = load(AWAY_KEY, "");
let view = { from: 2001, to: 2004, sites: [], items: [] };

/* ---------- 1. Open the Real Page ---------- */

/** The site's own address, from the catalog's archive link. */
export function originalUrl(archive) {
  const href = String(archive || "");
  const wb = href.match(/web\.archive\.org\/web\/[^/]+\/(https?:\/\/.+)$/i);
  if (wb) return wb[1];
  if (/restorativland/i.test(href)) return "http://www.geocities.com/";
  return href;
}

function yearsFor(site) {
  const nums = String(site.years || "").match(/19\d{2}|20\d{2}/g)?.map(Number) || [];
  const a = nums.length ? Math.min(...nums) : view.from;
  const b = nums.length ? Math.max(...nums) : view.to;
  let lo = Math.max(a, view.from);
  let hi = Math.min(b, view.to);
  if (lo > hi) [lo, hi] = [a, b];
  const out = [];
  for (let y = lo; y <= hi; y += 1) out.push(y);
  return out;
}

export function realYearFor(site) {
  const ys = yearsFor(site);
  return ys[Math.floor((ys.length - 1) / 2)];
}

function waybackFrameUrl(orig, year) {
  return `https://web.archive.org/web/${year}0701000000if_/${orig}`;
}
function waybackPageUrl(orig, year) {
  return `https://web.archive.org/web/${year}0701000000/${orig}`;
}

let realSite = null;
let realToken = 0;

function ensureRealDialog() {
  let dlg = $("#real-page");
  if (dlg) return dlg;
  document.body.insertAdjacentHTML(
    "beforeend",
    `<dialog id="real-page" class="real" aria-labelledby="real-title">
      <div class="real-top">
        <div><h2 id="real-title"></h2><p class="real-vibe" id="real-vibe"></p></div>
        <button class="real-x" type="button" data-real-close aria-label="Close">×</button>
      </div>
      <div class="real-crt">
        <div class="real-glass">
          <div class="real-status" id="real-status" aria-live="polite"></div>
          <iframe id="real-frame" title="Archived page" referrerpolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
        </div>
      </div>
      <div class="real-years" id="real-years" role="group" aria-label="Pick a year"></div>
      <div class="real-actions">
        <button class="btn btn-ghost" type="button" id="real-sound">▶ Dial-up sound</button>
        <a class="btn btn-ghost" id="real-out" target="_blank" rel="noopener noreferrer">Open full size</a>
      </div>
      <p class="real-note">Saved copies from the Internet Archive's Wayback Machine. Some pages load slowly or are missing pieces.</p>
    </dialog>`
  );
  dlg = $("#real-page");
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg || e.target.closest("[data-real-close]")) dlg.close();
  });
  dlg.addEventListener("close", () => {
    if (dlg.open) return; // already reopened for another site
    realToken += 1;
    $("#real-frame").src = "about:blank";
  });
  $("#real-sound").addEventListener("click", playDialUp);
  return dlg;
}

async function showYear(year) {
  const token = ++realToken;
  const orig = originalUrl(realSite.archive);
  const frame = $("#real-frame");
  const status = $("#real-status");
  $$("#real-years button").forEach((b) => b.classList.toggle("is-active", Number(b.dataset.year) === year));
  $("#real-title").textContent = `${realSite.name} · ${year}`;
  $("#real-out").href = waybackPageUrl(orig, year);
  frame.classList.remove("is-on");
  frame.src = "about:blank";
  status.innerHTML = `<span>dialing ${esc(year)}…</span>`;
  status.hidden = false;

  // Ask the archive first, so hidden sites get a kind message instead of an error page.
  let target = waybackFrameUrl(orig, year);
  try {
    const host = orig.replace(/^https?:\/\//, "");
    const res = await fetch(
      `https://archive.org/wayback/available?url=${encodeURIComponent(host)}&timestamp=${year}0701`
    );
    const data = await res.json();
    const snap = data?.archived_snapshots?.closest;
    if (token !== realToken) return;
    if (!snap?.available) {
      status.innerHTML = `<span>${esc(realSite.name)} asked the archive to hide its old pages.</span>
        <a href="${esc(orig)}" target="_blank" rel="noopener noreferrer">See it today →</a>`;
      $("#real-out").href = orig;
      return;
    }
    const ts = snap.timestamp;
    const snapYear = Number(String(ts).slice(0, 4));
    target = `https://web.archive.org/web/${ts}if_/${orig}`;
    $("#real-out").href = `https://web.archive.org/web/${ts}/${orig}`;
    if (snapYear !== year) {
      $("#real-title").textContent = `${realSite.name} · ${snapYear} (closest saved)`;
      status.innerHTML = `<span>dialing ${esc(snapYear)}…</span>`;
      $$("#real-years button").forEach((b) => b.classList.toggle("is-active", Number(b.dataset.year) === snapYear));
    }
  } catch {
    /* lookup failed: load the page directly */
  }
  if (token !== realToken) return;
  frame.onload = () => {
    if (token !== realToken || frame.src === "about:blank") return;
    status.hidden = true;
    frame.classList.add("is-on");
  };
  frame.src = target;
}

export function openRealPage(name) {
  realSite = view.sites.find((s) => s.name === name);
  if (!realSite) return;
  const dlg = ensureRealDialog();
  $("#real-vibe").textContent = realSite.vibe || "";
  const years = yearsFor(realSite);
  $("#real-years").innerHTML = years
    .map((y) => `<button type="button" class="chip" data-year="${y}">${y}</button>`)
    .join("");
  $$("#real-years button").forEach((b) => b.addEventListener("click", () => showYear(Number(b.dataset.year))));
  dlg.showModal();
  showYear(realYearFor(realSite));
}

/* An original dial-up-style handshake, synthesized (no recording used). */
let audio = null;
function playDialUp() {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audio;
    const out = ctx.createGain();
    out.gain.value = 0.12;
    out.connect(ctx.destination);
    let t = ctx.currentTime + 0.05;
    const tone = (freqs, dur, type = "sine") => {
      freqs.forEach((f) => {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.setValueAtTime(f, t);
        o.connect(out);
        o.start(t);
        o.stop(t + dur);
      });
      t += dur;
    };
    tone([350, 440], 0.7); // dial tone
    const dtmf = [[697, 1209], [770, 1336], [852, 1477], [941, 1336], [697, 1336], [770, 1209], [852, 1336]];
    dtmf.forEach((p) => { tone(p, 0.09); t += 0.05; });
    t += 0.4;
    tone([2100], 0.6); // answer tone
    tone([1650, 980], 0.35, "square");
    for (let i = 0; i < 14; i += 1) tone([600 + Math.random() * 2400], 0.07, "square");
    // a burst of hiss to finish the handshake
    const len = ctx.sampleRate * 1.2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) ch[i] = (Math.random() * 2 - 1) * 0.6;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(out);
    src.start(t);
  } catch {
    /* no audio available */
  }
}

/* ---------- 2. Your Room ---------- */

const PALETTE = ["#ff6fb5", "#7fdbff", "#b8ff00", "#ffd36a", "#a98bff", "#ff8a5c", "#5be3b0", "#f4f0e6"];
function colorFor(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

/** Simple original drawings in a 50×50 box, picked by what the item is. */
export function iconFor(item) {
  const n = item.name.toLowerCase();
  const c = colorFor(item.name);
  const has = (...w) => w.some((x) => n.includes(x));
  if (has("tamagotchi")) return `<ellipse cx="25" cy="27" rx="17" ry="20" fill="${c}"/><rect x="15" y="18" width="20" height="14" rx="2" fill="#cfe8c8"/><circle cx="18" cy="39" r="2.5" fill="#222"/><circle cx="25" cy="41" r="2.5" fill="#222"/><circle cx="32" cy="39" r="2.5" fill="#222"/>`;
  if (has("game boy", " ds", "dsi", "ds lite")) return `<rect x="12" y="4" width="26" height="42" rx="4" fill="${c}"/><rect x="16" y="9" width="18" height="14" fill="#9bbc0f"/><path d="M17 32h6M20 29v6" stroke="#222" stroke-width="2.5"/><circle cx="31" cy="31" r="2.5" fill="#222"/><circle cx="35" cy="28" r="2.5" fill="#222"/>`;
  if (has("ipod")) return `<rect x="14" y="4" width="22" height="40" rx="4" fill="#f2f2f2"/><rect x="17" y="8" width="16" height="12" fill="#8fb3d9"/><circle cx="25" cy="32" r="7" fill="#ddd" stroke="#bbb"/><circle cx="25" cy="32" r="2.5" fill="#fff"/>`;
  if (has("phone", "razr", "nokia", "blackberry", "sidekick", "hiptop", "bbm"))
    return `<rect x="15" y="4" width="20" height="42" rx="5" fill="${c}"/><rect x="18" y="8" width="14" height="13" fill="#bfe3ff"/><g fill="#222">${[0, 1, 2].map((r) => [0, 1, 2].map((k) => `<circle cx="${20 + k * 5}" cy="${28 + r * 5}" r="1.4"/>`).join("")).join("")}</g>`;
  if (has("scooter")) return `<line x1="34" y1="4" x2="38" y2="40" stroke="#c9ced6" stroke-width="3"/><line x1="28" y1="5" x2="40" y2="5" stroke="#c9ced6" stroke-width="3"/><rect x="6" y="38" width="34" height="4" rx="2" fill="#c9ced6"/><circle cx="9" cy="44" r="4" fill="${c}"/><circle cx="38" cy="44" r="4" fill="${c}"/>`;
  if (has("heelys", "converse", "chuck", "shoe", "sneaker")) return `<path d="M5 34 L5 22 L22 22 L30 30 L45 32 Q47 40 42 40 L5 40Z" fill="${c}"/><rect x="5" y="38" width="40" height="4" fill="#f4f0e6"/><circle cx="38" cy="44" r="3" fill="#555"/>`;
  if (has("walkman", "discman", "cd", "mix", "guitar hero", "rock band")) return `<circle cx="25" cy="25" r="19" fill="#d9dde3"/><circle cx="25" cy="25" r="17" fill="${c}" opacity=".55"/><circle cx="25" cy="25" r="5" fill="#d9dde3"/><circle cx="25" cy="25" r="2" fill="#333"/>`;
  if (has("pokémon", "pokemon", "card", "trading")) return `<rect x="8" y="10" width="22" height="32" rx="2" fill="#ffd36a" transform="rotate(-10 19 26)"/><rect x="20" y="8" width="22" height="32" rx="2" fill="${c}" stroke="#ffd36a" stroke-width="2"/><circle cx="31" cy="20" r="5" fill="#fff"/>`;
  if (has("beanie", "furby", "webkinz", "plush", "moshi", "bratz", "doll"))
    return `<circle cx="25" cy="29" r="15" fill="${c}"/><circle cx="14" cy="15" r="6" fill="${c}"/><circle cx="36" cy="15" r="6" fill="${c}"/><circle cx="20" cy="27" r="2.5" fill="#222"/><circle cx="30" cy="27" r="2.5" fill="#222"/><ellipse cx="25" cy="34" rx="3" ry="2" fill="#222"/>`;
  if (has("bracelet", "bandz", "livestrong", "scrunch", "slap"))
    return `<ellipse cx="25" cy="30" rx="18" ry="9" fill="none" stroke="${c}" stroke-width="5"/><ellipse cx="25" cy="22" rx="15" ry="7" fill="none" stroke="#ffd36a" stroke-width="4"/>`;
  if (has("camera", "polaroid", "instax", "disposable")) return `<rect x="6" y="14" width="38" height="26" rx="4" fill="${c}"/><circle cx="25" cy="27" r="8" fill="#222"/><circle cx="25" cy="27" r="4" fill="#5a6b80"/><rect x="34" y="17" width="6" height="4" fill="#fff"/>`;
  if (has("imac", "ibook", "computer", "wallpaper", "bliss")) return `<rect x="6" y="8" width="38" height="28" rx="6" fill="${c}" opacity=".85"/><rect x="11" y="12" width="28" height="19" fill="#6fb2ff"/><path d="M11 27 Q24 20 39 25 L39 31 L11 31Z" fill="#5cb85c"/><rect x="20" y="36" width="10" height="7" fill="${c}"/>`;
  if (has("vhs", "dvd", "tv", "netflix", "blockbuster")) return `<rect x="8" y="10" width="34" height="30" rx="2" fill="#222"/><rect x="12" y="16" width="26" height="12" fill="${c}"/><circle cx="18" cy="34" r="3" fill="#555"/><circle cx="32" cy="34" r="3" fill="#555"/>`;
  if (has("wii", "kinect", "dance", "controller")) return `<rect x="19" y="4" width="12" height="42" rx="5" fill="#f2f2f2"/><circle cx="25" cy="13" r="3" fill="${c}"/><rect x="22" y="22" width="6" height="3" fill="#aaa"/>`;
  if (has("hat", "trucker")) return `<path d="M8 30 Q10 10 28 10 Q44 12 42 30Z" fill="${c}"/><path d="M8 30 L48 30 L46 34 L8 34Z" fill="#222"/>`;
  if (has("bag", "abercrombie", "hollister")) return `<path d="M14 18 Q14 6 25 6 Q36 6 36 18" fill="none" stroke="#222" stroke-width="2.5"/><rect x="8" y="16" width="34" height="30" rx="2" fill="${c}"/>`;
  if (has("lisa frank", "notebook", "school")) return `<rect x="10" y="6" width="30" height="38" rx="2" fill="${c}"/><path d="M14 36 Q25 12 36 36" fill="none" stroke="#ffd36a" stroke-width="3"/><circle cx="25" cy="18" r="4" fill="#7fdbff"/>`;
  if (has("tracksuit", "juicy", "velour", "tips", "gel")) return `<path d="M15 8 L35 8 L44 18 L38 22 L35 18 L35 44 L15 44 L15 18 L12 22 L6 18Z" fill="${c}"/><line x1="25" y1="8" x2="25" y2="44" stroke="#fff" stroke-width="1.5"/>`;
  // anything else: a gift-box shape in its color
  return `<rect x="8" y="16" width="34" height="28" rx="3" fill="${c}"/><rect x="6" y="12" width="38" height="8" rx="2" fill="${c}"/><rect x="23" y="12" width="4" height="32" fill="#fff" opacity=".7"/>`;
}

const SLOTS = {
  desk: [[66, 196], [232, 196], [290, 196]],
  shelf: [[392, 108], [452, 108], [512, 108], [392, 188], [452, 188], [512, 188]],
  floor: [[40, 330], [138, 350], [236, 330], [334, 350], [432, 330], [524, 350]],
};
function zonesFor(item) {
  const c = (item.category || "").toLowerCase();
  if (/scooter|heelys|dance|guitar|chuck|converse|kinect/i.test(item.name)) return ["floor", "shelf", "desk"];
  if (c.includes("toy") || c.includes("media")) return ["shelf", "floor", "desk"];
  if (c.includes("fashion")) return ["floor", "shelf", "desk"];
  return ["desk", "shelf", "floor"];
}

function roomSvg(hadItems) {
  const used = { desk: 0, shelf: 0, floor: 0 };
  const placed = [];
  const hasBliss = hadItems.some((it) => /bliss|wallpaper/i.test(it.name));
  for (const it of hadItems) {
    if (/bliss|wallpaper/i.test(it.name)) continue;
    const zone = zonesFor(it).find((z) => used[z] < SLOTS[z].length);
    if (!zone) break;
    const [x, y] = SLOTS[zone][used[zone]++];
    placed.push(`<g transform="translate(${x - 6} ${y - 12}) scale(1.3)" class="room-item"><title>${esc(it.name)}</title>${iconFor(it)}</g>`);
  }
  const screen = hasBliss
    ? `<rect x="138" y="160" width="84" height="58" fill="#6fb2ff"/><path d="M138 202 Q175 178 222 196 L222 218 L138 218Z" fill="#5cb85c"/>`
    : `<rect x="138" y="160" width="84" height="58" fill="#0f1a14"/><text x="146" y="182" fill="#7dffb3" font-family="monospace" font-size="10">C:\\&gt; ${view.from}_</text>`;
  return `<svg class="room-svg" viewBox="0 0 600 420" role="img" aria-label="Your bedroom with ${hadItems.length} things you had" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="280" fill="#3b2f4a"/><rect y="280" width="600" height="140" fill="#5a4230"/>
    <rect x="420" y="18" width="130" height="70" rx="3" fill="#7fb6e6"/><path d="M485 18v70M420 53h130" stroke="#3b2f4a" stroke-width="5"/>
    <rect x="24" y="30" width="72" height="96" rx="3" fill="#ff7ac6"/><circle cx="60" cy="68" r="18" fill="#ffd36a"/><rect x="36" y="100" width="48" height="7" fill="#3b2f4a"/>
    <rect x="380" y="160" width="190" height="8" fill="#8a5a3a"/><rect x="380" y="240" width="190" height="8" fill="#8a5a3a"/>
    <rect x="40" y="246" width="300" height="12" fill="#8a5a3a"/><rect x="52" y="258" width="10" height="70" fill="#6e4730"/><rect x="318" y="258" width="10" height="70" fill="#6e4730"/>
    <rect x="128" y="150" width="104" height="80" rx="9" fill="#cfc6b4"/>${screen}<rect x="162" y="230" width="36" height="16" fill="#b0a690"/>
    ${placed.join("")}
  </svg>`;
}

function ownedItems(kind) {
  const all = new Map();
  // items from the current view first, then anything saved from other years
  for (const it of view.items) all.set(it.name, it);
  return Object.entries(own)
    .filter(([, v]) => v === kind)
    .map(([name]) => all.get(name) || { name, category: "", years: "" });
}

function renderRoom() {
  const host = $("#lens-room");
  if (!host) return;
  const had = ownedItems("had");
  const wanted = ownedItems("wanted");
  const label = view.from === view.to ? `${view.from}` : `${view.from}–${view.to}`;
  const more = Math.max(0, had.length - 15);
  host.innerHTML = `
    <div class="room-wrap">
      <div class="room-head">
        <h3>${had.length >= 3 ? `You were ${esc(personaFor(had, view.from, view.to))}` : `My room, ${esc(label)}`}</h3>
        <span class="meta">${had.length ? `${had.length} thing${had.length === 1 ? "" : "s"} you had` : "Empty for now"}</span>
      </div>
      <div class="room-stage">${roomSvg(had)}
        ${had.length ? "" : `<div class="room-empty"><p>Tap <strong>had it</strong> on your old stuff. It moves in here.</p><button class="btn btn-primary" type="button" data-room-go="items">Pick my stuff</button></div>`}
      </div>
      ${more ? `<p class="room-more">+${more} more on your card</p>` : ""}
      <label class="away">
        <span>Away message to ${esc(view.from)} you</span>
        <input id="away-input" maxlength="80" placeholder="brb, growing up" value="${esc(away)}" />
      </label>
      <div class="room-actions">
        <button class="btn btn-primary" type="button" id="room-send" ${had.length ? "" : "disabled"}>Send to a friend</button>
        <button class="btn btn-ghost" type="button" id="room-save" ${had.length ? "" : "disabled"}>Save my card</button>
      </div>
    </div>
    <div class="wish-wrap">
      <h3>The ones you never got</h3>
      ${
        wanted.length
          ? `<div class="card-list">${wanted
              .map(
                (it) => `<article class="item wish">
            <div class="item-head"><h4>${esc(it.name)}</h4><span class="meta">${esc(it.years || "")}</span></div>
            ${it.sensory ? `<p class="vibe">${esc(it.sensory)}</p>` : ""}
            <div class="wish-actions">
              <a class="btn btn-primary" href="https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(it.name.replace(/\(.*?\)/g, "").trim())}" target="_blank" rel="noopener noreferrer">Finally get it</a>
              <button class="btn btn-ghost" type="button" data-own-set="had" data-own-name="${esc(it.name)}">Got it now</button>
            </div>
          </article>`
              )
              .join("")}</div>
          <p class="wish-note">“Finally get it” opens an eBay search for used ones. Scrollback doesn't earn from it yet.</p>`
          : `<p class="lede">Mark <strong>Wanted it</strong> on the thing you begged for and never got. It waits here.</p>`
      }
    </div>`;
  $("[data-room-go]", host)?.addEventListener("click", () => $(`.tab[data-lens="items"]`)?.click());
  paintFriend();
  $("#away-input", host)?.addEventListener("input", (e) => {
    away = e.target.value.slice(0, 80);
    save(AWAY_KEY, away);
  });
  $("#room-save", host)?.addEventListener("click", () => makeCard().then((b) => b && download(b)));
  $("#room-send", host)?.addEventListener("click", sendCard);
}

/* ---------- The share: your persona card + a link to compare ---------- */

const ERA_WORD = [
  [1995, 1999, "Dial-up"],
  [2000, 2003, "Chrome"],
  [2004, 2007, "Top 8"],
  [2008, 2012, "Dashboard"],
];
const TYPE_WORD = { tech: "Early Adopter", toy: "Collector", fashion: "Trendsetter", media: "Mixtape Maker" };

function bucket(category) {
  const c = String(category || "").toLowerCase();
  if (c.includes("fashion")) return "fashion";
  if (c.includes("toy")) return "toy";
  if (c.includes("media") || c.includes("music")) return "media";
  return "tech";
}

/** "The Top 8 Trendsetter": era of your years + what you ticked most. Built only from your own ticks. */
export function personaFor(had, from, to) {
  const mid = Math.round((from + to) / 2);
  const era = (ERA_WORD.find(([a, b]) => mid >= a && mid <= b) || ERA_WORD[1])[2];
  const counts = {};
  had.forEach((it) => { const k = bucket(it.category); counts[k] = (counts[k] || 0) + 1; });
  const sorted = Object.entries(counts).sort((x, y) => y[1] - x[1]);
  let type = "Main Character";
  if (sorted.length && (sorted.length === 1 || sorted[0][1] > sorted[1][1])) type = TYPE_WORD[sorted[0][0]];
  return `The ${era} ${type}`;
}

function loadImg(src) {
  return new Promise((ok) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => ok(null);
    img.src = src;
  });
}

function fitText(g, text, maxW, start, weight, family) {
  let size = start;
  g.font = `${weight} ${size}px ${family}`;
  while (g.measureText(text).width > maxW && size > 28) {
    size -= 4;
    g.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

export async function makeCard(opts = {}) {
  const had = opts.had || ownedItems("had");
  const from = opts.from ?? view.from;
  const to = opts.to ?? view.to;
  const awayMsg = opts.away ?? away;
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext("2d");
  try {
    await Promise.race([document.fonts.ready, new Promise((ok) => setTimeout(ok, 800))]);
  } catch {
    /* ignore */
  }
  const label = from === to ? `${from}` : `${from}–${to}`;
  const persona = personaFor(had, from, to);
  const css = getComputedStyle(document.body);
  const brand = css.getPropertyValue("--brand").trim() || "#b8ff00";
  const bg0 = css.getPropertyValue("--bg0").trim() || "#0a0a0a";
  const bg1 = css.getPropertyValue("--bg1").trim() || "#121018";

  const grad = g.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, bg1);
  grad.addColorStop(1, bg0);
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);

  g.fillStyle = brand;
  g.font = "500 40px 'IBM Plex Mono', monospace";
  g.fillText(`In ${label} I was`, 72, 170);
  g.fillStyle = "#f6f2ea";
  // "The Top 8" / "Trendsetter": keep the era words together
  const type = Object.values(TYPE_WORD).concat("Main Character").find((t) => persona.endsWith(t)) || "";
  const l1 = persona.slice(0, persona.length - type.length).trim();
  const l2 = type;
  const size = Math.min(fitText(g, l1, 936, 150, 800, "Syne, sans-serif"), fitText(g, l2, 936, 150, 800, "Syne, sans-serif"));
  g.font = `800 ${size}px Syne, sans-serif`;
  g.fillText(l1, 72, 170 + size + 20);
  g.fillText(l2, 72, 170 + size * 2 + 30);

  // a pile of up to 5 snapshots of what you had
  const picks = had.slice(0, 5);
  const spots = [[92, 640, -6], [560, 600, 5], [300, 930, -2], [640, 1010, 7], [90, 1180, 4]];
  for (let i = 0; i < picks.length; i += 1) {
    const it = picks[i];
    const [x, y, rot] = spots[i];
    const media = ITEM_MEDIA[it.name];
    let img = media?.file ? await loadImg(`./${media.file}`) : null;
    if (!img) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 50 50"><rect width="50" height="50" fill="#e4ddd0"/>${iconFor(it)}</svg>`;
      const u = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      img = await loadImg(u);
      URL.revokeObjectURL(u);
    }
    g.save();
    g.translate(x + 190, y + 210);
    g.rotate((rot * Math.PI) / 180);
    g.shadowColor = "rgba(0,0,0,0.45)";
    g.shadowBlur = 30;
    g.shadowOffsetY = 14;
    g.fillStyle = "#f6f2ea";
    g.fillRect(-190, -210, 380, 440);
    g.shadowColor = "transparent";
    if (img) {
      const s2 = Math.max(340 / img.width, 340 / img.height);
      const sw = 340 / s2;
      const sh = 340 / s2;
      g.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, -170, -190, 340, 340);
    }
    g.fillStyle = "#1d1a16";
    g.font = "700 30px Syne, sans-serif";
    let nm = it.name.replace(/\s*\(.*?\)/g, "").split(/\s*[\/+&]\s*/)[0];
    g.font = "700 28px Syne, sans-serif";
    while (g.measureText(nm).width > 340 && nm.length > 4) nm = `${nm.slice(0, -2).trim()}…`.replace(/……$/, "…");
    g.fillText(nm, -170, 196);
    g.restore();
  }
  const more = had.length - picks.length;
  if (more > 0) {
    g.fillStyle = brand;
    g.font = "700 44px Syne, sans-serif";
    g.fillText(`+${more} more`, 620, 1560);
  }
  if (awayMsg.trim()) {
    g.fillStyle = "#f6f2ea";
    g.font = "italic 500 40px 'IBM Plex Sans', sans-serif";
    fitText(g, `away msg: “${awayMsg.trim()}”`, 936, 40, "italic 500", "'IBM Plex Sans', sans-serif");
    g.fillText(`away msg: “${awayMsg.trim()}”`, 72, 1680);
  }
  g.fillStyle = brand;
  g.font = "800 58px Syne, sans-serif";
  g.fillText("Who were you?", 72, 1772);
  // photo credits: who took each picture on the card, then where the full list lives
  const who = picks.map((it) => ITEM_MEDIA[it.name]).filter((m) => m?.file).map((m) => `${String(m.author).replace(/\s*\(.*?\)/g, "").slice(0, 30)} (${m.license})`);
  const lines = [];
  let line = who.length ? "Photos, Wikimedia Commons: " : "";
  g.font = "500 20px 'IBM Plex Mono', monospace";
  who.forEach((w, k) => {
    const next = `${w}${k < who.length - 1 ? ", " : "."}`;
    if (g.measureText(line + next).width > 936 && line) { lines.push(line.trimEnd()); line = ""; }
    line += next;
  });
  if (line) lines.push(line);
  lines.push("All credits: Scrollback credits page");
  g.fillStyle = "rgba(246,242,234,0.7)";
  lines.slice(-4).forEach((t, k, arr) => g.fillText(t, 72, 1900 - (arr.length - 1 - k) * 26));
  return new Promise((ok) => canvas.toBlob(ok, "image/png"));
}

function download(blob) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `who-i-was-${view.from}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* Your picks travel in the link itself (no server, nothing stored). */
function allItemNames() {
  return Object.values(CATALOG_ITEMS).flat().map((it) => it.name);
}
function compareLink() {
  const names = allItemNames();
  const ids = ownedItems("had").map((it) => names.indexOf(it.name)).filter((i) => i >= 0);
  const u = new URL(location.href);
  u.search = "";
  u.hash = "";
  u.searchParams.set("gen", "millennial");
  u.searchParams.set("mode", "range");
  u.searchParams.set("from", String(view.from));
  u.searchParams.set("to", String(view.to));
  u.searchParams.set("lens", "items");
  u.searchParams.set("had", ids.map((i) => i.toString(36)).join("."));
  u.searchParams.set("via", "card");
  return u.href;
}
function readFriendPicks() {
  const raw = new URLSearchParams(location.search).get("had");
  if (!raw) return null;
  const names = allItemNames();
  return new Set(raw.split(".").map((x) => names[parseInt(x, 36)]).filter(Boolean));
}
const friend = readFriendPicks();

async function sendCard() {
  const blob = await makeCard();
  if (!blob) return;
  const link = compareLink();
  const persona = personaFor(ownedItems("had"), view.from, view.to);
  const file = new File([blob], `who-i-was-${view.from}.png`, { type: "image/png" });
  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text: `I was ${persona}. Who were you? ${link}` });
      return;
    }
    if (navigator.share) {
      await navigator.share({ text: `I was ${persona}. Who were you?`, url: link });
      return;
    }
  } catch {
    return; /* closed the share sheet */
  }
  try {
    await navigator.clipboard.writeText(link);
    const btn = $("#room-send");
    if (btn) {
      btn.textContent = "Link copied";
      setTimeout(() => { btn.textContent = "Send to a friend"; }, 1800);
    }
  } catch {
    /* no clipboard */
  }
  download(blob);
}

function paintFriend() {
  if (!friend) return;
  $$("[data-own-item]").forEach((row) => row.classList.toggle("friend-had", friend.has(row.dataset.ownItem)));
  const host = $("#lens-items");
  if (!host) return;
  let strip = $("#friend-strip");
  if (!strip) {
    host.insertAdjacentHTML("afterbegin", `<div class="friend-strip" id="friend-strip" role="status"></div>`);
    strip = $("#friend-strip");
  }
  const mine = new Set(Object.entries(own).filter(([, v]) => v === "had").map(([k]) => k));
  const common = [...friend].filter((n) => mine.has(n)).length;
  strip.innerHTML = mine.size
    ? `<strong>${common} in common</strong> with your friend's ${friend.size}. <button type="button" class="btn btn-primary" data-room-go="room">Make my card</button>`
    : `<strong>Your friend had ${friend.size} of these.</strong> Tap <em>had it</em> on yours to compare.`;
}

/* ---------- Had it / Wanted it ---------- */

function setOwn(name, kind) {
  if (own[name] === kind) delete own[name];
  else own[name] = kind;
  save(OWN_KEY, own);
  paintOwnButtons();
  renderRoom();
  const tab = $(`.tab[data-lens="room"]`);
  if (tab && own[name] === "had") {
    tab.classList.remove("is-bumped");
    void tab.offsetWidth;
    tab.classList.add("is-bumped");
  }
  const count = $("#room-count");
  if (count) count.textContent = String(Object.values(own).filter((v) => v === "had").length || "");
}

function paintOwnButtons() {
  $$("[data-own-item]").forEach((row) => {
    const state = own[row.dataset.ownItem];
    $$("[data-own]", row).forEach((b) => {
      const on = b.dataset.own === state;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  });
}

/** Called by app.js after each results render. */
export function renderMoments(next) {
  view = next;
  paintOwnButtons();
  renderRoom();
  paintFriend();
  const count = $("#room-count");
  if (count) count.textContent = String(Object.values(own).filter((v) => v === "had").length || "");
}

/* ---------- Tap a thing: the photo big, its story, had / wanted ---------- */

function ensureThingDialog() {
  let dlg = $("#thing");
  if (dlg) return dlg;
  document.body.insertAdjacentHTML(
    "beforeend",
    `<dialog id="thing" class="thing" aria-labelledby="thing-name">
      <button class="real-x thing-x" type="button" data-thing-close aria-label="Close">×</button>
      <div class="thing-body" id="thing-body"></div>
    </dialog>`
  );
  dlg = $("#thing");
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg || e.target.closest("[data-thing-close]")) dlg.close();
  });
  return dlg;
}

function firstSentences(text, n = 2) {
  const parts = String(text || "").match(/[^.!?]+[.!?]+(\s|$)/g) || [String(text || "")];
  return parts.slice(0, n).join("").trim();
}

export function openThing(name) {
  const it = view.items.find((x) => x.name === name);
  if (!it) return;
  const media = ITEM_MEDIA[name];
  const dlg = ensureThingDialog();
  $("#thing-body").innerHTML = `
    <figure class="thing-pic">
      ${media?.file ? `<img src="./${esc(media.file)}" alt="${esc(it.name)}" />` : `<svg viewBox="0 0 50 50" role="img" aria-label="${esc(it.name)}">${iconFor(it)}</svg>`}
    </figure>
    <div class="thing-text" data-own-item="${esc(it.name)}">
      <h2 id="thing-name">${esc(it.name)}</h2>
      <p class="thing-years">${esc(it.years)}</p>
      ${it.sensory ? `<p class="thing-sense">${esc(it.sensory)}</p>` : ""}
      <p class="thing-why">${esc(firstSentences(it.why))}</p>
      <div class="own-row">
        <button type="button" class="own-btn" data-own="had" aria-pressed="false">I had this</button>
        <button type="button" class="own-btn own-btn--want" data-own="wanted" aria-pressed="false">Wanted it, never got it</button>
      </div>
      ${media?.file ? `<p class="thing-credit">Photo: <a href="${esc(media.source)}" target="_blank" rel="noopener noreferrer">${esc(media.author || "Wikimedia Commons")}</a>, ${esc(media.license || "")}</p>` : ""}
    </div>`;
  paintOwnButtons();
  dlg.showModal();
}

/* One listener for every button these moments add. */
document.addEventListener("click", (e) => {
  const thing = e.target.closest("[data-thing]");
  if (thing) {
    openThing(thing.dataset.thing);
    return;
  }
  const real = e.target.closest("[data-real]");
  if (real) {
    e.preventDefault();
    openRealPage(real.dataset.real);
    return;
  }
  const ownBtn = e.target.closest("[data-own]");
  if (ownBtn) {
    const row = ownBtn.closest("[data-own-item]");
    if (row) setOwn(row.dataset.ownItem, ownBtn.dataset.own);
    return;
  }
  const go = e.target.closest("#friend-strip [data-room-go]");
  if (go) {
    $(`.tab[data-lens="room"]`)?.click();
    return;
  }
  const set = e.target.closest("[data-own-set]");
  if (set) setOwn(set.dataset.ownName, set.dataset.ownSet);
});
