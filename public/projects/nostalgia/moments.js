/* Scrollback moments: Open the Real Page · Your Room · The One You Never Got.
   Adds to the explorer; the catalog and lenses are unchanged.
   Saved state (had / wanted / away message) lives only in this browser. */

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
        <h2 id="real-title"></h2>
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
function iconFor(item) {
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
        <h3>My room, ${esc(label)}</h3>
        <span class="meta">${had.length ? `${had.length} thing${had.length === 1 ? "" : "s"} you had` : "Empty for now"}</span>
      </div>
      <div class="room-stage">${roomSvg(had)}
        ${had.length ? "" : `<div class="room-empty"><p>Tick <strong>I had this</strong> on things in Items. Your room fills up.</p><button class="btn btn-primary" type="button" data-room-go="items">Go to Items</button></div>`}
      </div>
      ${more ? `<p class="room-more">+${more} more on your card</p>` : ""}
      <label class="away">
        <span>Away message to ${esc(view.from)} you</span>
        <input id="away-input" maxlength="80" placeholder="brb, growing up" value="${esc(away)}" />
      </label>
      <div class="room-actions">
        <button class="btn btn-primary" type="button" id="room-save" ${had.length ? "" : "disabled"}>Save my ${esc(label)} card</button>
        <button class="btn btn-ghost" type="button" id="room-send" ${had.length ? "" : "disabled"}>Send it to a friend</button>
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
  $("#away-input", host)?.addEventListener("input", (e) => {
    away = e.target.value.slice(0, 80);
    save(AWAY_KEY, away);
  });
  $("#room-save", host)?.addEventListener("click", () => makeCard().then((b) => b && download(b)));
  $("#room-send", host)?.addEventListener("click", sendCard);
}

async function makeCard() {
  const had = ownedItems("had");
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext("2d");
  try {
    await Promise.race([document.fonts.ready, new Promise((ok) => setTimeout(ok, 800))]);
  } catch {
    /* ignore */
  }
  const label = view.from === view.to ? `${view.from}` : `${view.from}–${view.to}`;
  g.fillStyle = "#0a0a0a";
  g.fillRect(0, 0, W, H);
  g.fillStyle = "#f4f0e6";
  let size = 92;
  g.font = `800 ${size}px Syne, sans-serif`;
  while (g.measureText(`My ${label}`).width > 952 && size > 40) {
    size -= 4;
    g.font = `800 ${size}px Syne, sans-serif`;
  }
  g.fillText(`My ${label}`, 64, 140);
  const svg = roomSvg(had);
  const img = new Image();
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  await new Promise((ok) => { img.onload = ok; img.onerror = ok; img.src = url; });
  g.drawImage(img, 64, 190, 952, 666);
  URL.revokeObjectURL(url);
  g.font = "500 30px 'IBM Plex Sans', sans-serif";
  g.fillStyle = "#b7ae9a";
  const names = had.map((it) => it.name.replace(/\s*\(.*?\)/g, ""));
  let line = "";
  let y = 920;
  for (const n of names) {
    const next = line ? `${line} · ${n}` : n;
    if (g.measureText(next).width > 952) {
      g.fillText(line, 64, y);
      y += 44;
      line = n;
      if (y > 1150) break;
    } else line = next;
  }
  if (line && y <= 1150) g.fillText(line, 64, y);
  if (away.trim()) {
    g.fillStyle = "#ffd36a";
    g.font = "italic 500 32px 'IBM Plex Sans', sans-serif";
    g.fillText(`away msg: “${away.trim()}”`, 64, 1230);
  }
  g.fillStyle = "#7dffb3";
  g.font = "500 26px 'IBM Plex Mono', monospace";
  g.fillText("SCROLLBACK · what did your room have?", 64, 1300);
  return new Promise((ok) => canvas.toBlob(ok, "image/png"));
}

function download(blob) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `my-${view.from}-room.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

async function sendCard() {
  const blob = await makeCard();
  if (!blob) return;
  const file = new File([blob], `my-${view.from}-room.png`, { type: "image/png" });
  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text: "Did you have any of these?" });
      return;
    }
  } catch {
    return; /* closed the share sheet */
  }
  download(blob);
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
  const count = $("#room-count");
  if (count) count.textContent = String(Object.values(own).filter((v) => v === "had").length || "");
}

/* One listener for every button these moments add. */
document.addEventListener("click", (e) => {
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
  const set = e.target.closest("[data-own-set]");
  if (set) setOwn(set.dataset.ownName, set.dataset.ownSet);
});
