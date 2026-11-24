/* Scrollback play: boot → "Was this yours?" → who you were → share. */
import { WEBSITES, ITEMS } from "./catalog-data.js";
import { ITEM_MEDIA, SITE_MEDIA } from "./media.js";
import { primaryEra } from "./data.js";
import { iconFor, personaFor, signatureFor, personaLine, makeCard, personaKey, personaFromKey, makeGroupCard } from "./moments.js";
import { MAX_PLAYERS, cleanName, displayName, decodeGroup, encodeGroup, whoHad, inCommon, funLine } from "./group.js";
import { dialUp, click, blip, chime, fanfare, bindMute } from "./sound.js";
import { count } from "./count.js";

const OWN_KEY = "scrollback.own.v1";
const SITE_KEY = "scrollback.sites.v1";
const AWAY_KEY = "scrollback.away.v1";
const FIRST = 1995;
const LAST = 2016;
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
const ITEM_BY_NAME = new Map(ALL_ITEMS.map((i) => [i.name, i]));

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

/* A group arrives in the link: up to 9 players' names, personas and picks (see group.js).
 * Old links (?year=2006&had=a.b.c) read as a group of one. No link: the solo game, unchanged. */
const params = new URLSearchParams(location.search);
const group = decodeGroup(location.search, ITEM_NAMES, { first: FIRST, last: LAST });
// solo · join (adding yourself) · new (the link was full, so you start your own group)
let mode = !group ? "solo" : group.players.length >= MAX_PLAYERS ? "full" : "join";
let players = group ? group.players : []; // everyone before you
let names = players.map((p, k) => displayName(p, k, players.length));
let groupHad = whoHad(players); // item name → [player index]
let myName = "";
let year = group ? group.year : Number(params.get("year")) || 2004;
year = Math.min(LAST, Math.max(FIRST, year));
const groupYear = year;
const inGroup = () => mode === "join" || mode === "new";

/* "your friend had it" · "Maya had it" · "Maya, Jo had it" · "Maya, Jo +2 had it" */
function stickerText(name) {
  const ks = groupHad.get(name);
  if (!ks?.length) return "";
  if (players.length === 1 && !players[0].name) return "your friend had it";
  const who = ks.map((k) => names[k]);
  return `${who.slice(0, 2).join(", ")}${who.length > 2 ? ` +${who.length - 2}` : ""} had it`;
}

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
async function start(fromTap = true) {
  count(mode === "join" ? "join" : "start");
  const era = primaryEra(year - 2, year + 2);
  if (fromTap) dialUp();
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
  // the group's picks first (most shared first), so the comparison means something
  const fromFriend = items.filter((it) => groupHad.has(it.name)).sort((a, b) => groupHad.get(b.name).length - groupHad.get(a.name).length);
  const rest = items.filter((it) => !groupHad.has(it.name));
  // up to 3 old websites; when a year has fewer, more things fill the deck
  const pickItems = [...fromFriend, ...rest].slice(0, ROUNDS - Math.min(3, sites.length));
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
      <p class="card-credit">Wayback Machine capture</p>
    </div>`;
  }
  const m = ITEM_MEDIA[row.name];
  const pic = m?.file
    ? `<img src="./${esc(m.file)}" alt="${esc(row.name)}" draggable="false" />`
    : `<svg viewBox="0 0 50 50" role="img" aria-label="${esc(row.name)}">${iconFor(row)}</svg>`;
  return `<div class="card card--thing">
    <div class="snap">${pic}${groupHad.has(row.name) ? `<b class="friend-sticker">${esc(stickerText(row.name))}</b>` : ""}</div>
    <p class="card-name">${esc(short(row.name))}</p><p class="card-sub">${esc(row.sensory || row.years || "")}</p>
    ${m?.file ? `<p class="card-credit">Photo: ${esc(m.author)} · ${esc(m.license)}</p>` : ""}
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
  if (kind === "had") chime();
  else if (kind === "wanted") blip();
  else click();
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
  count("finish");
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
  const tag = $("#reveal-tag");
  name.textContent = "";
  tag.textContent = "";
  tag.hidden = true;
  pile.innerHTML = "";
  $("#away").value = load(AWAY_KEY, "");
  $("#room-link").href = `./explore.html?gen=millennial&mode=range&from=${year - 2}&to=${year + 2}&lens=room`;

  $("#group").hidden = true;
  $("#save-mine").hidden = true;
  $("#reveal-common").hidden = true;
  if (!had.length && !sitesHad) {
    lead.textContent = `None of ${year} rang a bell.`;
    name.textContent = "Try another year";
    name.classList.add("is-in");
    $(".reveal-away").hidden = true;
    $(".reveal-actions").hidden = true;
    // in a group you still count: you join with nothing ticked
    if (inGroup()) paintGroup(had);
    return;
  }
  $(".reveal-away").hidden = inGroup();
  $(".reveal-actions").hidden = inGroup();
  $("#save-mine").hidden = !inGroup();
  lead.textContent = `In ${year} you were`;
  name.classList.remove("is-in");
  await wait(700);
  name.textContent = personaFor(had.length ? had : [{ category: "tech" }], year - 2, year + 2);
  fitName(name);
  void name.offsetWidth;
  name.classList.add("is-in");
  fanfare();
  // v2: the name carries one real thing you tapped "Had it"
  const sig = signatureFor(had, year - 2, year + 2);
  if (sig) {
    tag.textContent = sig.tag;
    tag.hidden = false;
  }

  $("#print").href = printLink();
  await wait(400);
  if (inGroup()) return void paintGroup(had);
  paintPile(had.slice(0, 5));
}

function paintPile(list, counts) {
  const pile = $("#pile");
  pile.innerHTML = "";
  list.forEach((it, k) => {
    const m = ITEM_MEDIA[it.name];
    const pic = m?.file ? `<img src="./${esc(m.file)}" alt="" />` : `<svg viewBox="0 0 50 50">${iconFor(it)}</svg>`;
    pile.insertAdjacentHTML(
      "beforeend",
      `<span class="pile-snap" style="--k:${k};--r:${[-8, 6, -3, 9, -5][k]}deg">${pic}<b>${esc(short(it.name))}${counts ? ` ×${counts[k]}` : ""}</b></span>`
    );
  });
}

/* ---------- 4b. The group: "Our 2004: 4 of us, 6 things in common" ---------- */
let lastGroup = null; // { all, meIndex } as last painted, for sharing and the card

function meFrom(had) {
  return { name: myName, key: personaKey(had), year, had: [...new Set(had.map((it) => it.name))] };
}
function personaOf(p) {
  const items = p.had.map((n) => ITEM_BY_NAME.get(n)).filter(Boolean);
  const key = p.key || personaKey(items);
  const sig = signatureFor(items, p.year - 2, p.year + 2);
  return { persona: personaFromKey(key, p.year - 2, p.year + 2), tag: sig?.tag || "" };
}
function groupRows(all, meIndex, forCard) {
  return all.map((p, k) => {
    const nm = k === meIndex ? (forCard ? myName || "Me" : "You") : names[k];
    const yr = p.year !== groupYear ? ` (${p.year})` : "";
    return { name: `${nm}${yr}`, ...personaOf(p), you: k === meIndex };
  });
}

/** Paint the group under your persona (meHad = your items), or the group alone (meHad = null, a full link). */
function paintGroup(meHad) {
  const all = meHad ? [...players, meFrom(meHad)] : [...players];
  const meIndex = meHad ? all.length - 1 : -1;
  lastGroup = { all, meIndex };
  const common = inCommon(all);
  const n = all.length;
  const c = common.length;
  $("#group").hidden = false;
  $("#group-head").textContent =
    n === 1 ? `Our ${groupYear}: just you so far` : `Our ${groupYear}: ${n} of us, ${c} thing${c === 1 ? "" : "s"} in common`;
  const callNames = all.map((p, k) => (k === meIndex ? "you" : names[k]));
  const fun = funLine(all, callNames, meIndex, (nm) => short(nm));
  $("#group-fun").textContent = fun;
  $("#group-fun").hidden = !fun;
  $("#roster").innerHTML = groupRows(all, meIndex, false)
    .map((r) => `<li${r.you ? ` class="is-you"` : ""}><b>${esc(r.name)}</b><span>${esc(r.persona)}${r.tag ? `, ${esc(r.tag)}` : ""}</span></li>`)
    .join("");
  // the photo pile: what most of you had; with nothing shared yet, your own things
  const shared = common.map((x) => ITEM_BY_NAME.get(x.name)).filter(Boolean);
  if (shared.length) paintPile(shared.slice(0, 5), common.map((x) => x.count));
  else paintPile((meHad || []).slice(0, 5));
  $("#print-group").href = `./print-yours.html${encodeGroup(groupYear, withKeys(all), ITEM_NAMES)}`;
  const add = $("#add-friends");
  const note = $("#group-note");
  if (!meHad) {
    add.textContent = "Start a new group";
    note.textContent = "This link is full: 9 of you. Start a new one.";
  } else if (n >= MAX_PLAYERS) {
    add.textContent = "Share the group";
    note.textContent = "That's 9: this link is full. No live room, it all lives in the link.";
  } else {
    add.textContent = n === 1 ? "Start your group" : "Add your friends";
    note.textContent = "No live room: the group lives in the link. Pass it on.";
  }
}

// old one-person links carry no persona key: work it out from their picks
const withKeys = (all) => all.map((p) => ({ ...p, key: p.key || personaKey(p.had.map((n) => ITEM_BY_NAME.get(n)).filter(Boolean)) }));
function groupLink() {
  const u = new URL(location.href);
  return `${u.origin}${u.pathname}${encodeGroup(groupYear, withKeys(lastGroup.all), ITEM_NAMES)}`;
}
function groupCard() {
  const { all, meIndex } = lastGroup;
  const common = inCommon(all);
  const callNames = all.map((p, k) => (k === meIndex ? "you" : names[k]));
  // on the card, "you" is whoever posts it
  const fun = funLine(all, callNames, meIndex, (nm) => short(nm))
    .replace(/^Only you /, `Only ${myName || "I"} `)
    .replace(/ of you had /, " of us had ")
    .replace(/^You both /, "We both ");
  return makeGroupCard({
    year: groupYear,
    rows: groupRows(all, meIndex, true),
    common: common.map((x) => ({ item: ITEM_BY_NAME.get(x.name), count: x.count })).filter((x) => x.item),
    fun,
  });
}

async function shareGroup() {
  const btn = $("#add-friends");
  const label = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Making the card…";
  const blob = await groupCard();
  btn.disabled = false;
  btn.textContent = label;
  const link = groupLink();
  const n = lastGroup.all.length;
  const text = n >= MAX_PLAYERS ? `Our ${groupYear}: all 9 of us.` : `Our ${groupYear}: ${n} of us so far. Your turn?`;
  try {
    const file = blob && new File([blob], `our-${groupYear}.png`, { type: "image/png" });
    if (file && navigator.canShare?.({ files: [file] })) return void (await navigator.share({ files: [file], text: `${text} ${link}` }));
    if (navigator.share) return void (await navigator.share({ text, url: link }));
  } catch {
    return; /* closed the share sheet */
  }
  try {
    await navigator.clipboard.writeText(`${text} ${link}`);
    btn.textContent = "Link copied";
    setTimeout(() => { btn.textContent = label; }, 1800);
  } catch {
    $("#group-note").textContent = link; /* no clipboard: show the link to copy by hand */
  }
}
$("#add-friends").addEventListener("click", () => {
  if (mode === "full") return void showJoin();
  count("group_share");
  shareGroup();
});
$("#save-group").addEventListener("click", async () => {
  count("save");
  const b = await groupCard();
  if (b) download(b, `our-${groupYear}.png`);
});
$("#save-mine").addEventListener("click", async () => {
  count("save");
  const b = await card();
  if (b) download(b);
});

/* ---------- 1b. Join: "Maya and 2 others played 2004. Your turn?" ---------- */
function joinLead() {
  const named = players.findIndex((p) => p.name);
  const first = names[named >= 0 ? named : 0];
  const others = players.length - 1;
  if (!others) return first;
  if (others === 1) {
    const other = players[named === 1 ? 0 : 1];
    return `${first} and ${other.name || "a friend"}`;
  }
  return `${first} and ${others} others`;
}
function showJoin() {
  const full = mode === "full";
  $("#join-ask").textContent = `${joinLead()} played ${groupYear}. ${full ? "This link is full." : "Your turn?"}`;
  $("#join-go").textContent = full ? "Start a new group" : "Go";
  $("#join-see").hidden = !full;
  $("#join-year").hidden = full;
  // pictures first: what they had, most shared first
  const top = [...groupHad.entries()].sort((a, b) => b[1].length - a[1].length).map(([nm]) => ITEM_BY_NAME.get(nm)).filter(Boolean).slice(0, 3);
  $("#join-faces").innerHTML = top
    .map((it, k) => {
      const m = ITEM_MEDIA[it.name];
      const pic = m?.file ? `<img src="./${esc(m.file)}" alt="" />` : `<svg viewBox="0 0 50 50">${iconFor(it)}</svg>`;
      return `<li style="--r:${[-7, 4, -2][k]}deg">${pic}</li>`;
    })
    .join("");
  show("beat-join");
  $("#join-ask").focus({ preventScroll: true });
}
$("#join-form").addEventListener("submit", (e) => {
  e.preventDefault();
  myName = cleanName($("#join-name").value);
  if (mode === "full") {
    // a fresh group, seeded with you
    mode = "new";
    players = [];
    names = [];
    groupHad = new Map();
  }
  start();
});
$("#join-year").addEventListener("click", () => {
  myName = cleanName($("#join-name").value);
  paintWheel();
  show("beat-boot");
});
$("#join-see").addEventListener("click", () => {
  show("beat-reveal");
  $("#reveal-lead").textContent = `${players.length} of you played`;
  const nm = $("#reveal-name");
  nm.textContent = `Our ${groupYear}`;
  nm.classList.add("is-in");
  $("#reveal-tag").hidden = true;
  $("#reveal-common").hidden = true;
  $(".reveal-away").hidden = true;
  $(".reveal-actions").hidden = true;
  $("#save-mine").hidden = true;
  paintGroup(null);
});

/* Long names ("The Front-Camera Early Adopter") shrink until they fit the phone. */
function fitName(el) {
  el.style.fontSize = "";
  let size = parseFloat(getComputedStyle(el).fontSize);
  // fit the width, and keep it to three lines so the photos stay on screen
  const tooBig = () => el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > size * 0.95 * 3.3;
  while (tooBig() && size > 22) {
    size -= 2;
    el.style.fontSize = `${size}px`;
  }
}
window.addEventListener("resize", () => { if ($("#beat-reveal").classList.contains("is-on")) fitName($("#reveal-name")); });

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
/* The print designer reads the same picks as the share link (the away message stays in this browser). */
function printLink() {
  const ids = hadItems().map((it) => ITEM_NAMES.indexOf(it.name)).filter((n) => n >= 0);
  return `./print-yours.html?year=${year}${ids.length ? `&had=${ids.map((n) => n.toString(36)).join(".")}` : ""}`;
}
async function card() {
  return makeCard({ had: hadItems(), from: year, to: year, away: $("#away").value });
}
function download(blob, file = `who-i-was-${year}.png`) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = file;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
$("#save").addEventListener("click", async () => {
  count("save");
  const b = await card();
  if (b) download(b);
});
$("#send").addEventListener("click", async () => {
  count("share");
  const btn = $("#send");
  btn.disabled = true;
  btn.textContent = "Making your card…";
  const blob = await card();
  btn.disabled = false;
  btn.textContent = "Send to a friend";
  const link = shareLink();
  const text = `In ${year} I was ${personaLine(hadItems(), year - 2, year + 2)}. Who were you?`;
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
bindMute($("#mute"));
paintWheel();
if (group) showJoin();
