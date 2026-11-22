/* Scrollback play: boot → "Was this yours?" → who you were → share. */
import { WEBSITES, ITEMS } from "./catalog-data.js";
import { ITEM_MEDIA, SITE_MEDIA } from "./media.js";
import { primaryEra } from "./data.js";
import { iconFor, personaFor, makeCard } from "./moments.js";

const OWN_KEY = "scrollback.own.v1";
const SITE_KEY = "scrollback.sites.v1";
const AWAY_KEY = "scrollback.away.v1";
const FIRST = 1995;
const LAST = 2012;
const ROUNDS = 10;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const short = (n) => String(n || "").replace(/\s*\(.*?\)\s*/g, " ").trim();
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 120) : ms));

function load(k, d) {
  try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; }
}
function save(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* this visit only */ }
}

const ALL_ITEMS = Object.entries(ITEMS).flatMap(([era, l]) => l.map((it) => ({ ...it, era, kind: "item" })));
const ALL_SITES = Object.entries(WEBSITES).flatMap(([era, l]) => l.map((s) => ({ ...s, era, kind: "site" })));
const ITEM_NAMES = ALL_ITEMS.map((i) => i.name);

function peak(years) {
  const n = String(years || "").match(/19\d\d|20\d\d/g)?.map(Number) || [];
  return n.length ? [Math.min(...n), Math.max(...n)] : null;
}
function near(row, y) {
  const p = peak(row.years);
  if (!p) return 99;
  if (y >= p[0] && y <= p[1]) return 0;
  return Math.min(Math.abs(y - p[0]), Math.abs(y - p[1]));
}

/* A friend's picks arrive in the link (?year=2006&had=a.b.c). */
const params = new URLSearchParams(location.search);
const friendHad = new Set(
  (params.get("had") || "").split(".").filter(Boolean).map((x) => ITEM_NAMES[parseInt(x, 36)]).filter(Boolean)
);
let year = Number(params.get("year")) || 2004;
year = Math.min(LAST, Math.max(FIRST, year));

/* ---------- 1. Boot: the year wheel ---------- */
function paintWheel() {
  const strip = $("#wheel");
  strip.innerHTML = [year - 1, year, year + 1]
    .map((y) => (y < FIRST || y > LAST ? `<span class="wy wy--blank"></span>` : `<span class="wy${y === year ? " is-now" : ""}">${y}</span>`))
    .join("");
  strip.setAttribute("aria-label", `Year ${year}`);
}
function step(d) {
  year = Math.min(LAST, Math.max(FIRST, year + d));
  paintWheel();
}
$$("[data-step]").forEach((b) => b.addEventListener("click", () => step(Number(b.dataset.step))));
$("#wheel").addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); step(-1); }
  if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); step(1); }
  if (e.key === "Enter") start();
});
let wheelX = null;
$("#wheel").addEventListener("pointerdown", (e) => { wheelX = e.clientX; });
window.addEventListener("pointerup", (e) => {
  if (wheelX === null) return;
  const dx = e.clientX - wheelX;
  wheelX = null;
  if (Math.abs(dx) > 24) step(dx < 0 ? 1 : -1);
});
$("#wheel").addEventListener("wheel", (e) => { e.preventDefault(); step(e.deltaY > 0 || e.deltaX > 0 ? 1 : -1); }, { passive: false });
$("#go").addEventListener("click", () => start());

function show(id) {
  $$(".beat").forEach((b) => b.classList.toggle("is-on", b.id === id));
  window.scrollTo(0, 0);
}

/* ---------- 2. Dial in ---------- */
async function start() {
  const era = primaryEra(year - 2, year + 2);
  show("beat-dial");
  const t = $("#dial-text");
  t.textContent = "";
  for (const line of [`dialing ${year}…`, "connected"]) {
    t.insertAdjacentHTML("beforeend", `<p>${esc(line)}</p>`);
    await wait(650);
  }
  document.body.dataset.era = era.id;
  await wait(350);
  buildDeck();
  show("beat-play");
  paintCard();
}

/* ---------- 3. Play: "Was this yours?" ---------- */
let deck = [];
let i = 0;
const answers = {};

function buildDeck() {
  const items = ALL_ITEMS.filter((it) => near(it, year) <= 2)
    .sort((a, b) => near(a, year) - near(b, year) + (ITEM_MEDIA[b.name] ? 0.5 : 0) - (ITEM_MEDIA[a.name] ? 0.5 : 0));
  const sites = ALL_SITES.filter((s) => SITE_MEDIA[s.name] && near(s, year) <= 1).sort((a, b) => near(a, year) - near(b, year));
  // friend's picks first, so the comparison means something
  const fromFriend = items.filter((it) => friendHad.has(it.name));
  const rest = items.filter((it) => !friendHad.has(it.name));
  const pickItems = [...fromFriend, ...rest].slice(0, 7);
  const pickSites = sites.slice(0, ROUNDS - pickItems.length);
  deck = [];
  let si = 0;
  pickItems.forEach((it, k) => {
    deck.push(it);
    if ((k === 1 || k === 3 || k === 5) && pickSites[si]) deck.push(pickSites[si++]);
  });
  while (deck.length < ROUNDS && pickSites[si]) deck.push(pickSites[si++]);
  // shuffle lightly so it doesn't feel like a list
  for (let k = deck.length - 1; k > 0; k -= 1) {
    const j = Math.floor(Math.random() * (k + 1));
    if (Math.abs(j - k) < 3) [deck[k], deck[j]] = [deck[j], deck[k]];
  }
  i = 0;
}

function cardHtml(row) {
  if (row.kind === "site") {
    const m = SITE_MEDIA[row.name];
    const host = (m?.source || "").replace(/^.*\/https?:\/\//, "").split("/")[0].replace(/^www\./, "");
    return `<div class="card card--site">
      <div class="win"><div class="win-bar"><i></i><i></i><i></i><span>${esc(host)}</span></div><img src="./${esc(m.file)}" alt="${esc(row.name)} in ${m.year}" draggable="false" /></div>
      <p class="card-name">${esc(short(row.name))}</p><p class="card-sub">${m.year}</p>
    </div>`;
  }
  const m = ITEM_MEDIA[row.name];
  const pic = m?.file
    ? `<img src="./${esc(m.file)}" alt="${esc(row.name)}" draggable="false" />`
    : `<svg viewBox="0 0 50 50" role="img" aria-label="${esc(row.name)}">${iconFor(row)}</svg>`;
  return `<div class="card card--thing">
    <div class="snap">${pic}${friendHad.has(row.name) ? `<b class="friend-sticker">your friend had it</b>` : ""}</div>
    <p class="card-name">${esc(short(row.name))}</p><p class="card-sub">${esc(row.sensory || row.years || "")}</p>
  </div>`;
}

function paintCard() {
  const row = deck[i];
  $("#play-count").textContent = `${i + 1} of ${deck.length}`;
  const host = $("#deck");
  host.innerHTML = cardHtml(row) + (deck[i + 1] ? `<div class="card card--under" aria-hidden="true"></div>` : "");
  // preload the next picture
  const nx = deck[i + 1];
  const nm = nx && (nx.kind === "site" ? SITE_MEDIA[nx.name] : ITEM_MEDIA[nx.name]);
  if (nm?.file) new Image().src = `./${nm.file}`;
  bindSwipe($(".card", host));
}

async function answer(kind) {
  const row = deck[i];
  if (!row) return;
  answers[row.name] = { kind, row };
  const card = $("#deck .card");
  if (card) {
    card.classList.add(`out--${kind}`);
    await wait(260);
  }
  i += 1;
  if (i < deck.length) paintCard();
  else reveal();
}
$$("[data-ans]").forEach((b) => b.addEventListener("click", () => answer(b.dataset.ans)));
document.addEventListener("keydown", (e) => {
  if (!$("#beat-play").classList.contains("is-on")) return;
  if (e.key === "ArrowRight") answer("had");
  if (e.key === "ArrowLeft") answer("nope");
  if (e.key === "ArrowUp") answer("wanted");
});

function bindSwipe(card) {
  if (!card) return;
  let x0 = null;
  let y0 = null;
  card.addEventListener("pointerdown", (e) => {
    x0 = e.clientX;
    y0 = e.clientY;
    card.setPointerCapture(e.pointerId);
    card.classList.add("is-drag");
  });
  card.addEventListener("pointermove", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    const dy = e.clientY - y0;
    card.style.transform = `translate(${dx}px, ${Math.min(0, dy)}px) rotate(${dx / 18}deg)`;
    card.dataset.lean = dx > 40 ? "had" : dx < -40 ? "nope" : dy < -60 ? "wanted" : "";
  });
  card.addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    const dy = e.clientY - y0;
    x0 = null;
    card.classList.remove("is-drag");
    if (dx > 90) answer("had");
    else if (dx < -90) answer("nope");
    else if (dy < -110) answer("wanted");
    else { card.style.transform = ""; card.dataset.lean = ""; }
  });
}

/* ---------- 4. Reveal ---------- */
function hadItems() {
  return Object.values(answers).filter((a) => a.kind === "had" && a.row.kind === "item").map((a) => a.row);
}

async function reveal() {
  // keep the answers: they fill the room in the explorer
  const own = load(OWN_KEY, {});
  const sites = load(SITE_KEY, {});
  Object.values(answers).forEach(({ kind, row }) => {
    const store = row.kind === "item" ? own : sites;
    if (kind === "nope") delete store[row.name];
    else store[row.name] = kind;
  });
  save(OWN_KEY, own);
  save(SITE_KEY, sites);

  const had = hadItems();
  const sitesHad = Object.values(answers).filter((a) => a.kind === "had" && a.row.kind === "site").length;
  show("beat-reveal");
  const lead = $("#reveal-lead");
  const name = $("#reveal-name");
  const pile = $("#pile");
  name.textContent = "";
  pile.innerHTML = "";
  $("#away").value = load(AWAY_KEY, "");
  $("#room-link").href = `./index.html?gen=millennial&mode=range&from=${year - 2}&to=${year + 2}&lens=room`;

  if (!had.length && !sitesHad) {
    lead.textContent = `None of ${year} rang a bell.`;
    name.textContent = "Try another year";
    $(".reveal-away").hidden = true;
    $(".reveal-actions").hidden = true;
    return;
  }
  $(".reveal-away").hidden = false;
  $(".reveal-actions").hidden = false;
  lead.textContent = `In ${year} you were`;
  name.classList.remove("is-in");
  await wait(700);
  name.textContent = personaFor(had.length ? had : [{ category: "tech" }], year - 2, year + 2);
  void name.offsetWidth;
  name.classList.add("is-in");

  const common = had.filter((it) => friendHad.has(it.name)).length;
  const c = $("#reveal-common");
  c.hidden = !friendHad.size;
  if (friendHad.size) c.textContent = `${common} in common with your friend`;

  await wait(400);
  had.slice(0, 5).forEach((it, k) => {
    const m = ITEM_MEDIA[it.name];
    const pic = m?.file ? `<img src="./${esc(m.file)}" alt="" />` : `<svg viewBox="0 0 50 50">${iconFor(it)}</svg>`;
    pile.insertAdjacentHTML(
      "beforeend",
      `<span class="pile-snap" style="--k:${k};--r:${[-8, 6, -3, 9, -5][k]}deg">${pic}<b>${esc(short(it.name))}</b></span>`
    );
  });
}

$("#away").addEventListener("input", (e) => save(AWAY_KEY, e.target.value.slice(0, 60)));

function shareLink() {
  const ids = hadItems().map((it) => ITEM_NAMES.indexOf(it.name)).filter((n) => n >= 0);
  const u = new URL(location.href);
  u.search = "";
  u.searchParams.set("year", String(year));
  if (ids.length) u.searchParams.set("had", ids.map((n) => n.toString(36)).join("."));
  u.searchParams.set("via", "card");
  return u.href;
}
async function card() {
  return makeCard({ had: hadItems(), from: year, to: year, away: $("#away").value });
}
function download(blob) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `who-i-was-${year}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
$("#save").addEventListener("click", async () => {
  const b = await card();
  if (b) download(b);
});
$("#send").addEventListener("click", async () => {
  const btn = $("#send");
  btn.disabled = true;
  btn.textContent = "Making your card…";
  const blob = await card();
  btn.disabled = false;
  btn.textContent = "Send to a friend";
  const link = shareLink();
  const text = `In ${year} I was ${$("#reveal-name").textContent}. Who were you?`;
  try {
    const file = blob && new File([blob], `who-i-was-${year}.png`, { type: "image/png" });
    if (file && navigator.canShare?.({ files: [file] })) return void (await navigator.share({ files: [file], text: `${text} ${link}` }));
    if (navigator.share) return void (await navigator.share({ text, url: link }));
  } catch {
    return; /* closed the share sheet */
  }
  try {
    await navigator.clipboard.writeText(`${text} ${link}`);
    btn.textContent = "Link copied";
    setTimeout(() => { btn.textContent = "Send to a friend"; }, 1800);
  } catch { /* no clipboard */ }
  if (blob) download(blob);
});
$("#again").addEventListener("click", () => {
  Object.keys(answers).forEach((k) => delete answers[k]);
  document.body.dataset.era = "dialup";
  paintWheel();
  show("beat-boot");
});

/* ---------- go ---------- */
paintWheel();
if (friendHad.size && params.get("year")) start();
