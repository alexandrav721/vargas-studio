// Weekline v2: screens and the hash router.
import {
  GOALS, LEARN_CHIPS, ZONES, HOODS, MINUTES, BUDGETS, DAYS, DAYS_LONG, MONTHS, MON3, CREWS, SKIP_REASONS,
  PHOTOS, photoUrl, HOLIDAYS, YEAR_IDEAS, SUNSET, photoFor,
} from "./data.js";
import * as W from "./store.js";
import { S, session } from "./store.js";
import { fontsReady, loadImage, drawStory, drawRecap, saveCanvas, shareCanvas } from "./share.js";

const app = document.getElementById("app");
const tabsEl = document.getElementById("tabs");
const TODAY = W.nyToday();
const qs = new URLSearchParams(location.search);
const BASE = location.origin + location.pathname;

const ui = {
  auth: null, authErr: "", authBusy: false, guestZone: "brooklyn", draft: null, editing: false, skipOpen: null, justLit: null,
  monthOff: 0, own: null, ownUrl: null, feed: null, activeInvite: null, inv: {}, polls: {}, page: null, pageErr: "", busy: false,
};
let liveRows = null;
let evById = new Map();
let lastWeek = null;

/* ---------- helpers ---------- */
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const icon = (id, cls = "ic s") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const goal = (id) => GOALS.find((g) => g.id === id);
const shortDate = (iso) => `${DAYS[W.dow(iso)]} ${W.dayNum(iso)} ${MON3[W.monthIdx(iso)]}`;
function range(dates) {
  const a = dates[0], b = dates[dates.length - 1];
  const sameM = W.monthIdx(a) === W.monthIdx(b);
  return `${DAYS[W.dow(a)]} ${W.dayNum(a)}${sameM ? "" : " " + MON3[W.monthIdx(a)]} – ${DAYS[W.dow(b)]} ${W.dayNum(b)} ${MON3[W.monthIdx(b)]}`;
}
const zoneLabel = (p) => (p && p.zone === "manhattan" ? "Manhattan" : "Brooklyn");
const P = () => S.profile;
function toast(msg) {
  document.querySelector(".toast")?.remove();
  const t = document.createElement("div");
  t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}
function devNote() {
  if (session.user) return "";
  const tail = session.mode === "device" ? ". Sign-in is off while the server can't be reached." : ". Sign in to keep it.";
  return `<p class="devnote"><i aria-hidden="true"></i>Saved on this device${tail}</p>`;
}
const srcLabel = (kind) => `${kind === "live" ? '<span class="dot-live" aria-hidden="true"></span>' : ""}${W.sourceLabel(kind)}`;
function sendLinks(url, text) {
  const body = `${text} ${url}`;
  return `<span class="via">
    <a class="linkbtn" href="sms:?&body=${encodeURIComponent(body)}">${icon("msg")}Text</a>
    <a class="linkbtn" href="https://wa.me/?text=${encodeURIComponent(body)}" target="_blank" rel="noopener">${icon("chat")}WhatsApp</a>
    <button class="linkbtn" data-act="copy" data-url="${esc(url)}">${icon("link")}Copy link</button>
    ${navigator.share ? `<button class="linkbtn" data-act="webshare" data-url="${esc(url)}" data-text="${esc(text)}">${icon("share")}Share</button>` : ""}
  </span>`;
}
const inviteUrl = (t) => `${BASE}#/e/${t}`;
const pollUrl = (t) => `${BASE}#/p/${t}`;
function photoCredit(id) { return PHOTOS[id] ? PHOTOS[id].short : ""; }

/* ---------- router ---------- */
function route() {
  const h = location.hash.replace(/^#\/?/, "");
  const [path, query] = h.split("?");
  const parts = path.split("/").filter(Boolean);
  return { name: parts[0] || "", arg: parts[1] || "", q: new URLSearchParams(query || "") };
}
const go = (h) => { if (location.hash === h) render(); else location.hash = h; };
const TABS = [["week", "Week", "week"], ["month", "Month", "month"], ["crew", "Crew", "crew"], ["you", "You", "you"]];

function render(opts = {}) {
  const r = route();
  const has = !!P();
  if (!r.name) return go(has ? "#/week" : "#/welcome");
  if (["week", "month", "crew", "you", "share"].includes(r.name) && !has) return go("#/welcome");
  const view = {
    welcome: welcomeView, visit: visitView, onboard: onboardView, week: weekView, month: monthView,
    crew: crewView, you: youView, share: shareView, e: invitePage, p: pollPage,
  }[r.name];
  if (!view) return go("#/week");
  const focusKey = opts.keepFocus ? focusSelector() : null;
  const bare = ["welcome", "visit", "onboard", "e", "p"].includes(r.name);
  app.className = (bare ? "bare" : "") + (["week", "month", "share"].includes(r.name) ? " wide" : "");
  app.innerHTML = view(r);
  tabsEl.hidden = bare;
  tabsEl.classList.toggle("wide", ["week", "month", "share"].includes(r.name));
  tabsEl.innerHTML = TABS.map(([id, label, ic]) => `<a class="tab" href="#/${id}" ${r.name === id || (id === "week" && r.name === "share") ? 'aria-current="page"' : ""}>${icon(ic, "ic")}${label}</a>`).join("");
  if (focusKey) { const el = app.querySelector(focusKey); if (el) el.focus({ preventScroll: true }); }
  after(r);
}
function focusSelector() {
  const a = document.activeElement;
  if (!a || !app.contains(a)) return null;
  if (a.id) return "#" + CSS.escape(a.id);
  const act = a.getAttribute("data-act"); if (!act) return null;
  let sel = `[data-act="${act}"]`;
  ["data-id", "data-date", "data-v", "data-i"].forEach((k) => { const v = a.getAttribute(k); if (v !== null) sel += `[${k}="${CSS.escape(v)}"]`; });
  return sel;
}
function after(r) {
  if (ui.justLit) setTimeout(() => { ui.justLit = null; }, 50);
  if (r.name === "share") drawShares();
  if (r.name === "crew") loadCrew();
  if (r.name === "e" || r.name === "p") loadPage(r);
}
window.addEventListener("hashchange", () => {
  ui.skipOpen = null; ui.page = null; ui.pageErr = "";
  render(); window.scrollTo(0, 0);
  const h = app.querySelector("h1"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
});

/* ---------- live events ---------- */
async function ensureLive() {
  if (!P() || session.liveStatus === "loading" || session.liveStatus === "live" || session.liveStatus === "failed") return;
  const dates = W.planDates(P(), TODAY);
  session.liveStatus = "loading";
  try {
    liveRows = await W.fetchLive(dates[0], W.addDays(dates[dates.length - 1], 1));
    const inZone = liveRows.length;
    session.liveStatus = inZone >= 3 ? "live" : "failed";
    session.liveCount = inZone;
  } catch (e) { liveRows = null; session.liveStatus = "failed"; }
  const r = route().name;
  if (["week", "month", "crew", "share"].includes(r)) render({ keepFocus: true });
}
function week() {
  const p = P();
  const dates = W.planDates(p, TODAY);
  const evs = W.catalog(dates, session.liveStatus === "live" ? liveRows : null);
  evById = new Map(evs.map((e) => [e.id, e]));
  lastWeek = W.buildWeek(p, evs, TODAY);
  return lastWeek;
}

/* ---------- Welcome ---------- */
function welcomeView() {
  const z = ui.guestZone;
  const body = ui.auth ? authSheet() : `
    <p class="cap">Brooklyn Bridge Park, sunset 4:31 pm</p>
    <h1>Your NYC week, built around <em>what you want.</em></h1>
    <button class="btn sun" data-act="guest">Show me a week<small>No account. A surprise week for ${z === "manhattan" ? "Manhattan" : "Brooklyn"}.</small></button>
    <div class="zonepick" role="group" aria-label="Surprise week for">
      ${ZONES.map((x) => `<button data-act="gzone" data-v="${x.id}" aria-pressed="${z === x.id}">${x.label}</button>`).join("")}
      <a class="linkbtn visit" href="#/visit">Visiting NYC?</a>
    </div>
    <p class="keep">Sign in to keep it</p>
    <div class="two-out">
      <button data-act="auth" data-v="signup">${icon("mail")}Create account</button>
      <button data-act="auth" data-v="signin">Sign in</button>
    </div>
    <p class="fine">Signed in, it remembers your goals and learns what you like.</p>
    ${P() ? `<p class="fine"><a class="visit" href="#/week">Back to my week</a></p>` : ""}`;
  return `<section class="welcome on-photo" aria-label="Welcome">
    <img class="photo" src="${photoUrl("bridge")}" alt="${esc(PHOTOS.bridge.alt)}">
    <div class="henge" aria-hidden="true"></div><div class="shade"></div>
    <div class="top"><span class="wm">Weekline<i></i></span></div>
    <div class="body">${body}</div>
    <p class="credit">Photo: ${esc(PHOTOS.bridge.short)}</p>
  </section>`;
}
function authSheet() {
  const up = ui.auth === "signup";
  const device = session.mode === "device";
  return `<form class="sheet" data-form="auth" novalidate>
    <h2>${up ? "Keep your week" : "Welcome back"}</h2>
    <p class="fine">${up ? "Email and a password. Your goals, locks and what it learns follow you." : "Sign in with your email."}</p>
    ${up ? `<div class="field"><label for="a-name">First name</label><input id="a-name" name="name" autocomplete="given-name" maxlength="40" value="${esc(P()?.name || "")}"></div>` : ""}
    <div class="field"><label for="a-email">Email</label><input id="a-email" name="email" type="email" autocomplete="email" required></div>
    <div class="field"><label for="a-pw">Password${up ? " (10 characters or more)" : ""}</label><input id="a-pw" name="password" type="password" minlength="${up ? 10 : 1}" autocomplete="${up ? "new-password" : "current-password"}" required></div>
    <p class="err" role="alert">${esc(ui.authErr)}</p>
    ${device ? `<p class="fine">Sign-in can't reach the server right now. You can keep going on this device and sign in later.</p>` : ""}
    <div class="row2" style="margin-top:12px">
      <button type="button" class="btn line" data-act="authclose">Back</button>
      <button class="btn ink" ${ui.authBusy ? "disabled" : ""}>${ui.authBusy ? "One moment…" : up ? "Create account" : "Sign in"}</button>
    </div>
    <button type="button" class="linkbtn" data-act="auth" data-v="${up ? "signin" : "signup"}">${up ? "I have an account" : "New here? Create an account"}</button>
    ${device ? `<button type="button" class="linkbtn" data-act="devicego">Keep going on this device</button>` : ""}
  </form>`;
}
async function submitAuth(form) {
  const f = new FormData(form);
  const email = String(f.get("email") || "").trim(), password = String(f.get("password") || ""), name = String(f.get("name") || "").trim();
  if (!/^\S+@\S+\.\S+$/.test(email)) { ui.authErr = "That email doesn't look right."; return render(); }
  if (ui.auth === "signup" && password.length < 10) { ui.authErr = "Use 10 characters or more for the password."; return render(); }
  ui.authBusy = true; ui.authErr = ""; render();
  try {
    if (ui.auth === "signup") { await W.signUp(email, password, name); if (name && S.profile) { S.profile.name = name; W.pushProfile(); } }
    else await W.signIn(email, password);
    const was = ui.auth;
    ui.authBusy = false; ui.auth = null;
    toast(was === "signup" ? "Account made. Your week is saved." : "Signed in.");
    go(P() && P().onboarded ? "#/week" : "#/onboard/1");
  } catch (e) {
    ui.authBusy = false;
    ui.authErr = W.isOffline(e) ? "Can't reach Weekline's server right now, so nothing was sent." : e.message;
    render();
  }
}
function startGuest() {
  const z = ui.guestZone;
  const days = [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5).slice(0, 4).sort();
  S.profile = {
    guest: true, onboarded: false, goals: [], zone: z, hood: z === "manhattan" ? "East Village" : "Williamsburg",
    minutes: 30, budget: 25, free_days: days, seed: Math.random().toString(36).slice(2, 7), learn: { text: "", chips: [] },
  };
  W.save(); session.liveStatus = "idle"; go("#/week"); ensureLive();
}

/* ---------- Visiting NYC ---------- */
function visitView() {
  const v = ui.visit || (ui.visit = { from: TODAY, to: W.addDays(TODAY, 3), zone: "manhattan" });
  return `<div class="prog"><a class="back" href="#/welcome" aria-label="Back">${icon("back", "ic")}</a><span>Visiting NYC</span></div>
  <form class="wrap onb" data-form="visit">
    <h1>A short stay, <em>well spent.</em></h1>
    <p class="hint"><span>Pick your dates and where you're staying. No goals, no account.</span></p>
    <div class="row2">
      <div class="field"><label for="v-from">Arriving</label><input id="v-from" name="from" type="date" value="${v.from}" min="${TODAY}" required></div>
      <div class="field"><label for="v-to">Leaving</label><input id="v-to" name="to" type="date" value="${v.to}" min="${TODAY}" required></div>
    </div>
    <p class="sub-h">Staying in</p>
    <div class="seg" role="group" aria-label="Staying in" style="margin-top:0">
      ${ZONES.map((x) => `<button type="button" data-act="vzone" data-v="${x.id}" aria-pressed="${v.zone === x.id}">${x.label}</button>`).join("")}
    </div>
    <p class="fine" style="margin-top:12px">Up to 10 days. Live NYC Parks listings cover the next 14 days.</p>
    <p class="err" role="alert">${esc(ui.visitErr || "")}</p>
    <div style="padding:12px 0 32px"><button class="btn ink">Show my days</button></div>
  </form>`;
}

/* ---------- Onboarding (5 steps) ---------- */
const STEP_NAMES = ["goals", "neighborhood", "travel time", "budget", "free nights"];
function draft() {
  if (!ui.draft) {
    const p = P() || {};
    ui.draft = {
      goals: [...(p.goals || [])], learn: { text: p.learn?.text || "", chips: [...(p.learn?.chips || [])] }, zone: p.zone || "brooklyn",
      hood: p.hood || "", minutes: p.minutes || 30, budget: p.budget ?? 25, free_days: [...(p.free_days || [1, 2, 3, 5])], crew: p.crew || "",
    };
  }
  return ui.draft;
}
function onboardView(r) {
  const step = Math.min(5, Math.max(1, Number(r.arg) || 1));
  ui.editing = r.q.get("edit") === "1";
  const d = draft();
  const back = step === 1 ? (ui.editing ? "#/you" : P()?.onboarded ? "#/week" : "#/welcome") : `#/onboard/${step - 1}${ui.editing ? "?edit=1" : ""}`;
  const bars = [1, 2, 3, 4, 5].map((i) => `<i class="${i <= step ? "on" : ""}"></i>`).join("");
  let body = "", ok = true;
  if (step === 1) {
    ok = d.goals.length > 0;
    body = `<h1>What do you want <em>more of?</em></h1>
      <p class="hint"><span>Pick up to 2</span><span>${d.goals.length} picked</span></p>
      <div class="list">${GOALS.map((g) => {
        const on = d.goals.includes(g.id);
        const row = `<button class="opt-row" data-act="goal" data-v="${g.id}" aria-pressed="${on}">
          <span class="fr" aria-hidden="true">${on ? `<img src="${photoUrl(g.photo)}" alt="" style="object-position:${g.pos}">` : ""}</span>
          <span><span class="nm">${g.label}</span>${g.id === "learn" ? `<span class="sub" style="display:block">Pottery, Spanish, photography…</span>` : ""}</span>
          <span class="ck">${on ? icon("check") : ""}</span></button>`;
        if (g.id !== "learn" || !on) return row;
        return row + `<div class="learnbox">
          <div class="field"><label for="learn-text">What do you want to learn?</label>
          <input id="learn-text" data-input="learn" value="${esc(d.learn.text)}" maxlength="60" placeholder="Bread baking, chess, Italian"></div>
          <div class="chips" role="group" aria-label="Or pick">${LEARN_CHIPS.map((c) => `<button class="chip" data-act="learnchip" data-v="${c}" aria-pressed="${d.learn.chips.includes(c)}">${c}</button>`).join("")}</div>
        </div>`;
      }).join("")}</div>`;
  } else if (step === 2) {
    ok = !!d.hood;
    body = `<h1>Where's <em>home base?</em></h1>
      <p class="hint"><span>Only used to guess travel time. It stays rough.</span></p>
      <div class="seg" role="group" aria-label="Borough">${ZONES.map((z) => `<button data-act="zone" data-v="${z.id}" aria-pressed="${d.zone === z.id}">${z.label}</button>`).join("")}</div>
      <p class="sub-h">Neighborhood</p>
      <div class="chips" role="group" aria-label="Neighborhood">${Object.keys(HOODS[d.zone]).map((h) => `<button class="chip" data-act="hood" data-v="${esc(h)}" aria-pressed="${d.hood === h}">${esc(h)}</button>`).join("")}</div>`;
  } else if (step === 3) {
    const subs = { 15: "Your neighborhood", 30: "A neighborhood or two over", 45: "Across the river is fine" };
    body = `<h1>How far on <em>a weeknight?</em></h1>
      <p class="hint"><span>Door to door, by subway or on foot</span></p>
      <div class="list" role="radiogroup" aria-label="Travel time">${MINUTES.map((m) => `<button class="opt-row nofr" role="radio" data-act="minutes" data-v="${m}" aria-checked="${d.minutes === m}"><span><span class="nm">${m} minutes</span><span class="sub" style="display:block">${subs[m]}</span></span><span class="ck">${d.minutes === m ? icon("check") : ""}</span></button>`).join("")}</div>`;
  } else if (step === 4) {
    body = `<h1>What can a week <em>cost?</em></h1>
      <p class="hint"><span>For everything you go to, all week</span></p>
      <div class="list" role="radiogroup" aria-label="Weekly budget">${BUDGETS.map((b) => `<button class="opt-row nofr" role="radio" data-act="budget" data-v="${b.id}" aria-checked="${d.budget === b.id}"><span><span class="nm">${b.label}</span><span class="sub" style="display:block">${b.sub}</span></span><span class="ck">${d.budget === b.id ? icon("check") : ""}</span></button>`).join("")}</div>`;
  } else {
    ok = d.free_days.length > 0;
    body = `<h1>Which nights <em>are free?</em></h1>
      <p class="hint"><span>Tap the nights you usually have</span><span>${d.free_days.length} free</span></p>
      <div class="daygrid" role="group" aria-label="Free nights">${DAYS.map((x, i) => `<button data-act="day" data-v="${i}" aria-pressed="${d.free_days.includes(i)}" aria-label="${DAYS_LONG[i]}"><b>${x.slice(0, 2)}</b><span>${d.free_days.includes(i) ? "free" : "busy"}</span></button>`).join("")}</div>
      <p class="sub-h">Your crew tag <span class="muted small">(optional)</span></p>
      <div class="chips" role="group" aria-label="Crew tag">${CREWS.map((c) => `<button class="chip" data-act="crew" data-v="${c.id}" aria-pressed="${d.crew === c.id}">${c.name}</button>`).join("")}</div>
      <p class="fine" style="margin-top:8px">${esc(CREWS.find((c) => c.id === d.crew)?.line || "A small tag on your invites. Change it any time.")}</p>`;
  }
  const rest = STEP_NAMES.slice(step).join(", ");
  return `<div class="prog"><a class="back" href="${back}" aria-label="Back">${icon("back", "ic")}</a><span>${step} of 5</span><div class="bars" aria-hidden="true">${bars}</div></div>
    <div class="wrap onb">${body}</div>
    <div class="foot">
      ${rest && !ui.editing ? `<p class="next">Next: ${rest}</p>` : ""}
      <button class="btn ink" data-act="${step === 5 || ui.editing ? "finish" : "next"}" data-v="${step}" ${ok ? "" : 'aria-disabled="true"'}>${ui.editing ? "Save" : step === 5 ? "See my week" : "Continue"}</button>
    </div>`;
}
function finishOnboard() {
  const d = draft();
  const prev = P() || {};
  S.profile = { ...prev, ...d, guest: !session.user, onboarded: true, visit: undefined, name: prev.name || session.user?.name || "" };
  delete S.profile.seed;
  ui.draft = null; session.liveStatus = "idle";
  W.pushProfile();
  go(ui.editing ? "#/you" : "#/week");
  ensureLive();
}

/* ---------- Week ---------- */
function weekView() {
  const p = P();
  const wk = week();
  const visiting = !!(p.visit && p.visit.from);
  const goalsOn = (p.goals || []).length > 0;
  const suns = Array.from({ length: Math.min(wk.y, 7) }, (_, i) => `<i class="${i < wk.x ? "on" : ""}"></i>`).join("");
  const pending = visiting ? [] : W.pendingCheckins(TODAY).slice(0, 4);
  const lastWeekStart = W.addDays(W.weekStart(TODAY), -7);
  const sample = session.liveStatus !== "live";
  const status = session.liveStatus === "loading" || session.liveStatus === "idle"
    ? `<span>Checking NYC Parks for this week…</span>`
    : session.liveStatus === "live"
      ? `<span><span class="dot-live" aria-hidden="true"></span> Live NYC Parks, plus Editorial and Sample ideas. Each row says which.</span>`
      : `<span><b>Sample week.</b> NYC Parks didn't load, so these rows are examples.</span><button class="linkbtn" data-act="retry">Try again</button>`;
  const locked = wk.days.filter((d) => d.lock).map((d) => d.lock);
  return `<section class="hero on-photo">
      <img class="photo" src="${photoUrl("bbp-sunset")}" alt="${esc(PHOTOS["bbp-sunset"].alt)}" style="object-position:50% 72%">
      <div class="henge" aria-hidden="true"></div><div class="shade"></div>
      <div class="topline"><span class="wm" style="font-size:19px">Weekline<i></i></span><span class="tag">${p.demo ? "Demo data" : sample ? "Sample" : ""}</span></div>
      <div class="txt">
        <div><h1>Your <em>${visiting ? "trip" : "week"}</em></h1><p class="meta">${range(wk.dates)} · ${zoneLabel(p)}</p></div>
        <div class="goalsun">${wk.y ? `<div class="suns" aria-hidden="true">${suns}</div>` : ""}${goalsOn ? `${wk.x} of ${wk.y} goal<br>nights planned` : `${wk.x} ${wk.x === 1 ? "night" : "nights"}<br>planned`}</div>
      </div>
    </section>
    <div class="srcline">${status}</div>
    ${p.guest && !goalsOn && !visiting ? `<div class="banner"><p>A surprise week. Want it built around your goals?</p><a class="btn sm ink" href="#/onboard/1">Tell it your goals</a></div>` : ""}
    ${pending.length ? `<section class="check" aria-labelledby="ci-h">
      <h2 id="ci-h">${pending.every((l) => l.date >= lastWeekStart) ? "Last week: did you go?" : "Did you go?"}</h2>
      ${pending.map((l) => `<div class="ci"><p class="t">${esc(l.title)}</p><p class="s">${shortDate(l.date)} · ${esc(l.time)} · ${esc(l.hood)}</p>
        <div class="segs" role="group" aria-label="Did you go to ${esc(l.title)}?">
          <button data-act="ci" data-id="${esc(l.event_id)}" data-v="went">Went</button>
          <button data-act="ci" data-id="${esc(l.event_id)}" data-v="didnt">Didn't go</button>
          <button data-act="ci" data-id="${esc(l.event_id)}" data-v="loved">Loved it</button>
        </div></div>`).join("")}
    </section>` : ""}
    <section class="days" aria-label="Days">${wk.days.map(dayRow).join("")}</section>
    <div class="weekacts">
      <button class="btn line" data-act="ics" ${locked.length ? "" : 'aria-disabled="true"'}>${icon("down")}Add to calendar</button>
      <button class="btn line" data-act="subscribe">${icon("feed")}Subscribe</button>
      <a class="btn sun full" href="#/share">${icon("share")}Share my week</a>
    </div>
    ${!locked.length ? `<p class="fine wrap" style="margin-top:8px">Add to calendar saves your locked nights. Lock one first.</p>` : ""}
    ${feedBox()}
    ${devNote()}`;
}
function feedBox() {
  if (!ui.feed) return "";
  if (ui.feed.error) return `<div class="feedbox" role="status">${esc(ui.feed.error)}</div>`;
  return `<div class="feedbox" role="status"><p>Your live calendar feed. Locked nights show up on their own.</p>
    <code>${esc(ui.feed.url)}</code>
    <div class="row2"><a class="btn sm ink" href="${esc(ui.feed.webcal || ui.feed.url)}">Open in my calendar</a><button class="btn sm line" data-act="copy" data-url="${esc(ui.feed.url)}">Copy link</button></div></div>`;
}
function dayCell(d) { return `<div class="d">${DAYS[d.d]}<small>${W.dayNum(d.date)}${W.dayNum(d.date) === 1 || d === lastWeek?.days[0] ? " " + MON3[W.monthIdx(d.date)] : ""}</small></div>`; }
function friendsText(id) {
  const inv = S.invites.find((i) => i.event_id === id);
  const names = (inv && inv.names) || [];
  if (!names.length) return "";
  if (names.length === 1) return `${esc(names[0])} is in`;
  return `${names.length} friends going`;
}
function dayRow(d) {
  if (d.kind === "lock" || d.kind === "plan") {
    const ev = d.kind === "lock" ? d.lock : d.plan.ev;
    const id = d.kind === "lock" ? d.lock.event_id : ev.id;
    const fr = friendsText(id);
    const why = d.kind === "plan" ? d.plan.why : `${esc(ev.hood)}${ev.costUnknown ? "" : ev.cost ? ` · $${ev.cost}` : " · Free"}`;
    const lit = ui.justLit === id;
    const missed = S.checkins[id] === "didnt";
    const acts = d.kind === "lock"
      ? `${d.past ? "" : `<button data-act="invite" data-id="${esc(id)}">${icon("crew")}${S.invites.some((i) => i.event_id === id) ? "Invited" : "Invite"}</button>`}<button class="locked" data-act="droplock" data-id="${esc(id)}" aria-pressed="true" aria-label="Locked. Tap to remove the lock on ${esc(ev.title)}">${icon("lock")}Locked</button>`
      : `<button data-act="lock" data-id="${esc(id)}">${icon("lock")}Lock</button><button data-act="skipopen" data-id="${esc(id)}" aria-expanded="${ui.skipOpen === id}">${icon("skip")}Skip</button>`;
    return `<article class="day ${d.kind === "lock" ? "lit" : ""} ${d.past ? "past" : ""}" id="d-${d.date}">
      ${lit ? `<span class="henge row-henge" aria-hidden="true"></span>` : ""}
      ${dayCell(d)}<div class="t">${esc(ev.time)}</div>
      <div>
        ${d.holiday ? `<p class="hol-name">${d.holiday.name}</p>` : ""}
        <h3 class="ti" style="font-family:inherit;letter-spacing:0">${esc(ev.title)}</h3>
        <p class="pl">${d.kind === "plan" ? `${esc(ev.hood)} · ${why}` : why}${missed ? " · Missed" : ""}</p>
        <div class="act"><a class="src" href="${esc(ev.url)}" target="_blank" rel="noopener">${srcLabel(ev.kind)}${fr ? ` · <em>${fr}</em>` : ""}</a>
          <span class="acts">${acts}</span></div>
        ${ui.skipOpen === id ? `<div class="reasons" role="group" aria-label="Skip because">Skip because ${SKIP_REASONS.map((r) => `<button class="chip" data-act="skip" data-id="${esc(id)}" data-v="${r.id}">${r.label}</button>`).join("")}<button class="linkbtn" data-act="skipclose">Cancel</button></div>` : ""}
      </div></article>`;
  }
  if (d.kind === "holiday") {
    return `<article class="day hol ${d.past ? "past" : ""}" id="d-${d.date}">${dayCell(d)}<div class="t">${d.holiday.name === "Thanksgiving" ? "all day" : ""}</div><div>
      <p class="hol-name">${d.holiday.name}</p><p class="ti">${esc(d.holiday.line)}</p>
      ${d.suggest.length && !d.past ? `<p class="pl" style="margin-top:6px">If you want some air:</p>${sugg(d)}` : `<p class="pl">Enjoy the table.</p>`}
    </div></article>`;
  }
  if (d.kind === "busy") {
    return `<article class="day busy ${d.past ? "past" : ""}">${dayCell(d)}<div class="t"></div><div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <p class="ti">Not a free night</p>${d.past ? "" : `<button class="linkbtn" data-act="freeup" data-v="${d.d}">Free it up</button>`}</div></article>`;
  }
  // free night
  const kept = !!S.kept[d.date];
  if (d.past) return `<article class="day free past">${dayCell(d)}<div class="t">open</div><div><p class="ti">${kept ? "Kept open, on purpose." : "An open night."}</p></div></article>`;
  return `<article class="day free" id="d-${d.date}">${dayCell(d)}<div class="t">open</div><div>
    <p class="ti">${kept ? "Kept open, on purpose." : "Free night. Keep it open or pick one."}</p>
    ${kept ? `<button class="linkbtn" data-act="keep" data-date="${d.date}" aria-pressed="true">Show me ideas instead</button>` : `${sugg(d)}
      <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="linkbtn keepbtn" data-act="keep" data-date="${d.date}" aria-pressed="false">Keep it open</button>
      ${d.suggest.length >= 2 ? `<button class="linkbtn keepbtn" data-act="poll" data-date="${d.date}">Ask the crew to pick</button>` : ""}</div>`}
  </div></article>`;
}
function sugg(d) {
  if (!d.suggest.length) return `<p class="pl">Nothing fits your budget and travel time that night.</p>`;
  return `<div class="sugg">${d.suggest.map((c) => `<div class="sg"><div><p class="tt">${esc(c.ev.title)}</p>
    <p class="mm">${esc(c.ev.time)} · ${esc(c.ev.hood)} · ${c.ev.costUnknown ? "Price not saved" : c.ev.cost ? "$" + c.ev.cost : "Free"} · <span class="src">${srcLabel(c.ev.kind)}</span></p></div>
    <button class="chip" data-act="pick" data-id="${esc(c.ev.id)}" aria-label="Pick ${esc(c.ev.title)}">Pick</button></div>`).join("")}</div>`;
}

/* ---------- Month and year ---------- */
function monthView() {
  const p = P();
  const wk = week();
  const base = W.monthIdx(TODAY) + ui.monthOff;
  const y = W.yearOf(TODAY) + Math.floor(base / 12), mIdx = ((base % 12) + 12) % 12;
  const first = `${y}-${String(mIdx + 1).padStart(2, "0")}-01`;
  const nextFirst = mIdx === 11 ? `${y + 1}-01-01` : `${y}-${String(mIdx + 2).padStart(2, "0")}-01`;
  const weeks = [];
  for (let ws = W.weekStart(first); ws < nextFirst; ws = W.addDays(ws, 7)) weeks.push(ws);
  const goals = (p.goals || []).length ? p.goals.map(goal) : [{ id: "_any", short: "Nights out", target: Math.max(1, (p.free_days || []).length), unit: "a week" }];
  const thisWs = W.weekStart(TODAY);
  const cb = comeback(p);
  const locks = Object.values(S.locks);
  const fits = (l, g) => g.id === "_any" || (l.goals || []).includes(g.id);
  const rows = goals.map((g) => {
    const cells = weeks.map((ws) => {
      const we = W.addDays(ws, 6);
      const t = Math.min(4, g.target);
      let gold = 0, filled = 0;
      if (g.id === "calm") {
        filled = Object.keys(S.kept).filter((k) => k >= ws && k <= we).length;
        if (ws === thisWs) filled = Math.max(filled, wk.days.filter((d) => d.kind === "free" && !d.past).length);
      } else {
        locks.filter((l) => l.date >= ws && l.date <= we && fits(l, g) && S.checkins[l.event_id] !== "didnt").forEach((l) => {
          if (S.checkins[l.event_id] === "went" || S.checkins[l.event_id] === "loved") gold++; else filled++;
        });
        if (ws === thisWs) filled += wk.days.filter((d) => d.kind === "plan" && (g.id === "_any" || d.plan.ev.goals.includes(g.id))).length;
      }
      const dots = [];
      for (let i = 0; i < t; i++) dots.push(i < gold ? "g" : i < gold + filled ? "f" : "");
      if (cb && cb.date >= ws && cb.date <= we && (cb.goal === g.id || (g === goals[0] && !goals.some((x) => x.id === cb.goal)))) {
        const k = dots.indexOf(""); if (k >= 0) dots[k] = "cb";
      }
      const label = `${g.short}, week of ${W.dayNum(ws)} ${MON3[W.monthIdx(ws)]}: ${gold} went, ${filled} planned, target ${t}`;
      return `<div class="dots" role="img" aria-label="${esc(label)}">${dots.map((c) => `<i class="${c}"></i>`).join("")}</div>`;
    }).join("");
    return `<div class="mg r" style="--w:${weeks.length}"><div class="gn">${esc(g.short)}<small>${g.target} ${g.unit}</small></div>${cells}</div>`;
  }).join("");
  const nLocked = locks.filter((l) => l.date >= first && l.date < nextFirst).length;
  const fresh = ui.monthOff > 0 || W.dayNum(TODAY) <= 7;
  const mName = MONTHS[mIdx];
  return `<section class="mhero on-photo">
      <img class="photo" src="${photoUrl("gazebo")}" alt="${esc(PHOTOS.gazebo.alt)}">
      <div class="shade"></div>
      <div class="txt"><h1>${mName}</h1><p>${fresh ? "New month. Same goals, fresh start." : `${nLocked} ${nLocked === 1 ? "night" : "nights"} locked so far.`}</p></div>
    </section>
    <div class="mtabs" role="group" aria-label="Month">
      ${[0, 1].map((o) => { const mi = (W.monthIdx(TODAY) + o) % 12; return `<button class="chip" data-act="moff" data-v="${o}" aria-pressed="${ui.monthOff === o}">${MONTHS[mi]}</button>`; }).join("")}
    </div>
    <div class="monthyear"><div>
    <section class="mgrid" aria-label="${mName} goals by week">
      <div class="mg hd" style="--w:${weeks.length}"><span style="text-align:left">Goal</span>${weeks.map((ws, i) => `<span>${W.dayNum(ws)}${i === 0 || W.monthIdx(ws) !== W.monthIdx(weeks[i - 1]) ? `<small>${MON3[W.monthIdx(ws)]}</small>` : ""}</span>`).join("")}</div>
      ${rows}
      <div class="legend"><span><i class="g"></i>Went</span><span><i class="f"></i>Planned</span><span><i></i>Open</span>${cb ? `<span><i class="cb"></i>Comeback night, ${shortDate(cb.date)}</span>` : ""}</div>
    </section>
    ${cb ? `<section class="comeback"><h3><em>Comeback night,</em> ${shortDate(cb.date)}</h3>
      <p>You missed ${esc(cb.title)}. Don't miss twice: one easy plan on your next free night.</p>
      ${cb.date <= W.addDays(thisWs, 6) ? `<a class="linkbtn" href="#/week">Plan it in my week</a>` : ""}</section>` : ""}
    <div class="wrap" style="padding-top:18px"><a class="btn line" href="#/share?k=recap">${icon("share")}Share my ${MONTHS[W.monthIdx(TODAY)]} recap</a></div>
    </div>
    ${yearView()}
    </div>
    ${devNote()}`;
}
function comeback(p) {
  const missed = Object.values(S.locks).filter((l) => S.checkins[l.event_id] === "didnt").sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!missed) return null;
  let d = W.addDays(missed.date, 1); if (d < TODAY) d = TODAY;
  const free = p.free_days || [];
  for (let i = 0; i < 28; i++, d = W.addDays(d, 1)) {
    if (free.includes(W.dow(d)) && !HOLIDAYS[d]) {
      const lockedThatDay = Object.values(S.locks).some((l) => l.date === d && S.checkins[l.event_id] !== "didnt");
      if (!lockedThatDay || i > 0) return { date: d, title: missed.title, goal: (missed.goals || [])[0] };
    }
  }
  return null;
}
function yearView() {
  const m0 = W.monthIdx(TODAY), y0 = W.yearOf(TODAY);
  const months = Array.from({ length: 12 }, (_, i) => ({ m: (m0 + i) % 12, y: y0 + Math.floor((m0 + i) / 12), i }));
  const items = months.map(({ m, y, i }) => {
    const pre = `${y}-${String(m + 1).padStart(2, "0")}`;
    const locks = Object.values(S.locks).filter((l) => l.date.startsWith(pre));
    if (i === 0) return { m, y, i, text: `${locks.length} ${locks.length === 1 ? "night" : "nights"} locked · ${YEAR_IDEAS[m]}`, label: "Now" };
    if (i <= 2) {
      const dated = [...locks.map((l) => l.title), ...Object.entries(HOLIDAYS).filter(([k]) => k.startsWith(pre)).map(([, h]) => h.name)];
      const liveN = (liveRows || []).filter((e) => e.date.startsWith(pre)).length;
      if (liveN) dated.push(`${liveN} NYC Parks listings`);
      if (dated.length) return { m, y, i, text: dated.slice(0, 3).join(", "), label: "Dated" };
    }
    return { m, y, i, text: YEAR_IDEAS[m], label: "Ideas" };
  });
  const lo = Math.min(...SUNSET), hi = Math.max(...SUNSET);
  const bars = items.map((it) => `<i class="${it.i === 0 ? "now" : it.label === "Dated" ? "dt" : ""}" style="height:${Math.round(12 + ((SUNSET[it.m] - lo) / (hi - lo)) * 50)}px"></i>`).join("");
  return `<section class="year" aria-labelledby="yr-h">
    <h2 id="yr-h">The year ahead <small>Bars: sunset on the 15th</small></h2>
    <div class="ybars" aria-hidden="true">${bars}</div>
    <div class="ylab" aria-hidden="true">${items.map((it) => `<span>${MONTHS[it.m][0]}</span>`).join("")}</div>
    <div class="ylist">${items.map((it) => `<div class="yrow ${it.i === 0 ? "now" : ""}"><b>${MON3[it.m]}</b><span>${esc(it.text)}</span><small>${it.label}</small></div>`).join("")}</div>
    <p class="fine" style="margin-top:8px">Ideas are seasons to look out for, not dated listings.</p>
  </section>`;
}

/* ---------- Crew ---------- */
function crewView() {
  const p = P();
  const wk = week();
  const active = ui.activeInvite || (S.invites[0] && S.invites[0].token);
  const inv = active ? ui.inv[active] : null;
  const crew = CREWS.find((c) => c.id === p.crew);
  const upcoming = Object.values(S.locks).filter((l) => l.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date));
  const freeNights = wk.days.filter((d) => d.kind === "free" && !d.past && d.suggest.length >= 2 && !S.kept[d.date]);
  let top;
  if (active && inv && inv.event) {
    const e = inv.event;
    const ph = PHOTOS[e.goal] ? e.goal : photoFor([]);
    const names = inv.names || [];
    const nIn = (inv.counts && inv.counts.in) || 0, nMaybe = (inv.counts && inv.counts.maybe) || 0;
    top = `<section class="photo-card on-photo" aria-label="Invite">
        <img class="photo" src="${photoUrl(ph)}" alt="${esc(PHOTOS[ph].alt)}" style="object-position:50% 60%">
        <div class="shade"></div>
        <div class="from"><span>Invite from ${esc(inv.host || p.name || "you")}</span><span class="tag">${esc(e.source || "")}</span></div>
        <div class="txt"><h1>${esc(e.title)}</h1><p class="when">${esc(e.when || "")}${e.place ? " · " + esc(e.place) : ""}</p></div>
      </section>
      <div class="who">
        <div class="av" aria-hidden="true">${names.slice(0, 4).map((n) => `<span>${esc(n[0] || "?")}</span>`).join("")}</div>
        <p class="names">${nIn ? esc(names.join(", ")) : "Be the first. Send it to someone."}${nMaybe ? ` <span class="muted">· ${nMaybe} maybe</span>` : ""}</p>
        <p class="cnt">${nIn}<small>going</small></p>
      </div>
      <div class="send"><span>Send to the group</span>${sendLinks(inviteUrl(active), `Come with me: ${e.title}, ${e.when || ""}.`)}</div>
      ${inv.local ? `<p class="fine wrap" style="margin-top:8px">Made without the server, so replies only count on the phone they're tapped on.</p>` : ""}`;
  } else if (active && !inv) {
    top = `<p class="wrap empty">Loading your invite…</p>`;
  } else {
    top = `<section class="photo-card on-photo"><img class="photo" src="${photoUrl("prospect-park")}" alt="${esc(PHOTOS["prospect-park"].alt)}" style="object-position:50% 60%"><div class="shade"></div>
      <div class="txt"><h1>Bring <em>someone.</em></h1><p class="when">Lock a night, then send the link. Nobody needs the app to say they're in.</p></div></section>`;
  }
  return `${top}
    <section class="sec" aria-labelledby="ln-h"><h2 id="ln-h">Your locked nights <small>${upcoming.length}</small></h2>
      ${upcoming.length ? upcoming.map((l) => {
        const has = S.invites.find((i) => i.event_id === l.event_id);
        return `<div class="lrow"><div><p class="tt">${esc(l.title)}</p><p class="mm">${shortDate(l.date)} · ${esc(l.time)} · ${W.sourceLabel(l.kind)}</p></div>
          ${has ? `<button class="chip" data-act="showinv" data-v="${esc(has.token)}" aria-pressed="${active === has.token}">Invite sent</button>` : `<button class="chip" data-act="invite" data-id="${esc(l.event_id)}">Invite</button>`}</div>`;
      }).join("") : `<p class="empty">Nothing locked yet. <a href="#/week">Pick from your week</a>.</p>`}
    </section>
    <section class="sec" aria-labelledby="poll-h"><h2 id="poll-h">Let them pick a night</h2>
      ${freeNights.length ? `<div class="chips">${freeNights.map((d) => `<button class="chip" data-act="poll" data-date="${d.date}">Poll for ${DAYS_LONG[d.d]}</button>`).join("")}</div>` : `<p class="fine">No open nights with ideas left this week.</p>`}
      ${S.polls.slice(0, 3).map(pollCard).join("")}
    </section>
    ${crew ? `<p class="safe">Your crew tag: <b style="color:var(--ink);font-weight:500">${crew.name}</b> · <a href="#/you">change</a></p>` : ""}
    <p class="safe">${icon("shield")}First names only until someone says they're in.</p>
    ${devNote()}`;
}
function pollCard(pl) {
  const data = ui.polls[pl.token];
  const votes = (data && data.votes) || pl.options.map(() => 0);
  const total = votes.reduce((a, b) => a + b, 0);
  const lead = Math.max(...votes);
  return `<div style="margin-top:18px">
    <h3 class="serif" style="font-size:22px;display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:8px">${esc(pl.question)} <small class="small muted" style="font-family:var(--sans)">${total} ${total === 1 ? "vote" : "votes"}</small></h3>
    ${pl.options.map((o, i) => `<div class="opt ${total && votes[i] === lead ? "lead" : ""}" style="--w:${total ? Math.round((votes[i] / total) * 100) : 0}%"><span>${esc(o)}</span><small>${votes[i]} ${votes[i] === 1 ? "vote" : "votes"}</small></div>`).join("")}
    <div class="send" style="padding:0;border:0">${sendLinks(pollUrl(pl.token), `Help me pick: ${pl.question}`)}</div>
  </div>`;
}
async function loadCrew() {
  if (ui.busy) return;
  ui.busy = true;
  const toLoad = [];
  const active = ui.activeInvite || (S.invites[0] && S.invites[0].token);
  if (active && !ui.inv[active]) toLoad.push(W.getInvite(active).then((r) => { ui.inv[active] = r; }).catch(() => { ui.inv[active] = { event: { title: S.invites[0]?.title || "Invite" }, counts: { in: 0, maybe: 0 }, names: [] }; }));
  S.polls.slice(0, 3).forEach((pl) => { if (!ui.polls[pl.token]) toLoad.push(W.getPoll(pl.token).then((r) => { ui.polls[pl.token] = r; }).catch(() => { ui.polls[pl.token] = { votes: pl.options.map(() => 0) }; })); });
  if (toLoad.length) { await Promise.all(toLoad); ui.busy = false; if (route().name === "crew") render({ keepFocus: true }); }
  else ui.busy = false;
}

/* ---------- invite and poll pages (open to anyone) ---------- */
function invitePage(r) {
  const tok = r.arg;
  if (ui.pageErr) return pageShell(`<p class="wrap empty" style="padding-top:40px">${esc(ui.pageErr)}</p>`);
  const inv = ui.page;
  if (!inv) return pageShell(`<p class="wrap empty" style="padding-top:40px">Opening the invite…</p>`);
  const e = inv.event || {};
  const ph = PHOTOS[e.goal] ? e.goal : "prospect-park";
  const names = inv.names || [];
  const nIn = (inv.counts && inv.counts.in) || 0, nMaybe = (inv.counts && inv.counts.maybe) || 0;
  const you = inv.you || S.myRsvp[tok];
  const myName = (you && you.name) || P()?.name || session.user?.name || "";
  return pageShell(`<section class="photo-card on-photo" aria-label="Invite">
      <img class="photo" src="${photoUrl(ph)}" alt="${esc(PHOTOS[ph].alt)}" style="object-position:50% 60%"><div class="henge" aria-hidden="true"></div><div class="shade"></div>
      <div class="from"><span>${inv.host || e.from ? `Invite from ${esc(inv.host || e.from)}` : "An invite"}</span><span class="tag">${esc(e.source || "")}</span></div>
      <div class="txt"><h1>${esc(e.title)}</h1><p class="when">${esc(e.when || "")}${e.place ? " · " + esc(e.place) : ""}</p></div>
    </section>
    <div class="who"><div class="av" aria-hidden="true">${names.slice(0, 4).map((n) => `<span>${esc(n[0] || "?")}</span>`).join("")}${you && you.status === "in" ? "" : ""}</div>
      <p class="names">${nIn ? esc(names.join(", ")) : "Be the first."}${nMaybe ? ` <span class="muted">· ${nMaybe} maybe</span>` : ""}</p><p class="cnt">${nIn}<small>going</small></p></div>
    <form class="wrap" data-form="rsvp" data-token="${esc(tok)}" style="padding-top:14px">
      ${you ? `<p class="ok" role="status" style="margin:0 0 8px">${you.status === "in" ? `You're in, ${esc(you.name)}. See you there.` : `Marked as maybe, ${esc(you.name)}.`}</p>` : ""}
      <div class="field" style="margin-top:0"><label for="r-name">Your first name</label><input id="r-name" name="name" maxlength="24" autocomplete="given-name" value="${esc(myName)}" required></div>
      <p class="err" role="alert">${esc(ui.rsvpErr || "")}</p>
      <div class="row2" style="grid-template-columns:1.4fr 1fr">
        <button class="btn sun" name="status" value="in">${icon("check")}I'm in</button>
        <button class="btn line" name="status" value="maybe">Maybe</button>
      </div>
      ${you ? `<button class="linkbtn" name="status" value="out">I can't make it</button>` : ""}
    </form>
    ${e.start ? `<div class="wrap" style="padding-top:8px"><button class="linkbtn" data-act="inv-ics">${icon("down")}Add to my calendar</button></div>` : ""}
    ${inv.local ? `<p class="fine wrap" style="margin-top:8px">This invite was made without the server, so replies only count on this phone.</p>` : ""}
    <p class="safe">${icon("shield")}First names only until someone says they're in.</p>
    <div class="wrap" style="padding:22px 24px 36px"><a class="btn line" href="#/welcome">Make my own week</a></div>`);
}
function pollPage(r) {
  const tok = r.arg;
  if (ui.pageErr) return pageShell(`<p class="wrap empty" style="padding-top:40px">${esc(ui.pageErr)}</p>`);
  const pl = ui.page;
  if (!pl) return pageShell(`<p class="wrap empty" style="padding-top:40px">Opening the poll…</p>`);
  const mine = pl.you ?? S.myVote[tok];
  const voted = mine !== undefined && mine !== null;
  const total = pl.votes.reduce((a, b) => a + b, 0), lead = Math.max(...pl.votes);
  return pageShell(`<section class="wrap" style="padding-top:28px">
    <h1 style="font-size:40px;line-height:1.04">${esc(pl.question)}</h1>
    <p class="hint" style="margin:8px 0 18px"><span>${voted ? "Thanks. Here's how it stands." : "Tap one. One vote per phone."}</span><span>${total} ${total === 1 ? "vote" : "votes"}</span></p>
    ${pl.options.map((o, i) => `<button class="opt ${voted && total && pl.votes[i] === lead ? "lead" : ""}" style="--w:${voted && total ? Math.round((pl.votes[i] / total) * 100) : 0}%" data-act="vote" data-v="${i}" data-token="${esc(tok)}" aria-pressed="${mine === i}">
      <span>${esc(o)}${mine === i ? " · your pick" : ""}</span><small>${voted ? `${pl.votes[i]} ${pl.votes[i] === 1 ? "vote" : "votes"}` : ""}</small></button>`).join("")}
    ${pl.local ? `<p class="fine" style="margin-top:8px">Made without the server, so votes only count on this phone.</p>` : ""}
    <div class="send" style="padding:8px 0;border:0">${sendLinks(pollUrl(tok), `Help pick: ${pl.question}`)}</div>
    </section>
    <p class="safe">${icon("shield")}First names only until someone says they're in.</p>
    <div class="wrap" style="padding:22px 24px 36px"><a class="btn line" href="#/welcome">Make my own week</a></div>`);
}
function pageShell(inner) {
  return `<div class="wrap" style="padding-top:18px;display:flex;justify-content:space-between;align-items:baseline"><a href="#/welcome" class="wm" style="text-decoration:none">Weekline<i></i></a></div>${inner}`;
}
async function loadPage(r) {
  if (ui.page || ui.pageErr) return;
  try {
    ui.page = r.name === "e" ? await W.getInvite(r.arg) : await W.getPoll(r.arg);
    if (r.name === "e" && ui.page && ui.page.you) S.myRsvp[r.arg] = ui.page.you;
  } catch (e) {
    ui.pageErr = W.isOffline(e) ? "Can't reach Weekline right now. Try the link again in a minute." : e.status === 404 ? "This link doesn't open anything anymore. Ask for a fresh one." : e.message;
  }
  if (route().name === r.name && route().arg === r.arg) render({ keepFocus: true });
}

/* ---------- Share ---------- */
function shareView(r) {
  const k = r.q.get("k") === "recap" ? "recap" : "story";
  return `<div class="wrap" style="padding-top:26px"><h1 style="font-size:44px;line-height:1">Post <em>your ${k === "recap" ? "month" : "week"}</em></h1>
    <p class="hint" style="margin-top:8px"><span>1080 × ${k === "recap" ? "1350" : "1920"} PNG. Drawn on this phone.</span></p>
    <div class="mtabs" style="padding:12px 0 0" role="group" aria-label="Poster">
      <a class="chip ${k === "story" ? "on" : ""}" href="#/share" aria-current="${k === "story"}">My week, 9:16</a>
      <a class="chip ${k === "recap" ? "on" : ""}" href="#/share?k=recap" aria-current="${k === "recap"}">Month recap, 4:5</a>
    </div></div>
    <div class="shares">
      <figure><canvas id="poster" class="${k === "recap" ? "recap-c" : "story-c"}" role="img" aria-label="${k === "recap" ? "Month recap poster" : "My week story poster"}"></canvas>
      <figcaption>${ui.own ? "Your photo. It stays on this device." : `Photo: ${esc(PHOTOS[k === "recap" ? "manhattan-gold" : "domino"].credit)}`}</figcaption></figure>
      <div>
        <div class="filepick"><input id="ownphoto" type="file" accept="image/*" aria-label="Use my own photo">
          <span class="btn line" aria-hidden="true">${icon("photo")}${ui.own ? "Pick another photo" : "Use my own photo"}</span></div>
        ${ui.own ? `<button class="linkbtn" data-act="ownclear">Back to the city photo</button>` : ""}
        <p class="fine" style="margin:8px 0 16px">Your photo never leaves this phone unless you share the poster.</p>
        <div class="row2"><button class="btn line" data-act="save" data-v="${k}">${icon("down")}Save</button><button class="btn sun" data-act="share" data-v="${k}">${icon("share")}Share</button></div>
      </div>
    </div>`;
}
async function drawShares() {
  const cv = document.getElementById("poster"); if (!cv) return;
  const k = route().q.get("k") === "recap" ? "recap" : "story";
  await fontsReady();
  const img = ui.own || (await loadImage(photoUrl(k === "recap" ? "manhattan-gold" : "domino")));
  const credit = ui.own ? "" : photoCredit(k === "recap" ? "manhattan-gold" : "domino");
  const p = P(); const wk = lastWeek || week();
  const friendsAll = new Set();
  if (k === "story") {
    const rows = wk.days.filter((d) => !(d.kind === "busy")).map((d) => {
      if (d.kind === "lock" || d.kind === "plan") {
        const ev = d.kind === "lock" ? d.lock : d.plan.ev; const id = d.kind === "lock" ? d.lock.event_id : ev.id;
        const inv = S.invites.find((i) => i.event_id === id); const names = (inv && inv.names) || [];
        names.forEach((n) => friendsAll.add(n));
        return { day: DAYS[d.d], title: ev.title, with: names.length === 1 ? names[0] : names.length > 1 ? `${names.length} friends` : "" };
      }
      if (d.kind === "holiday") return { day: DAYS[d.d], title: d.holiday.name + ", at the table", free: true };
      return { day: DAYS[d.d], title: S.kept[d.date] ? "Kept free, on purpose" : "Free night", free: true };
    });
    const a = wk.dates[0], b = wk.dates[wk.dates.length - 1];
    const sub = `${W.dayNum(a)}–${W.dayNum(b)} ${MONTHS[W.monthIdx(b)]} · ${zoneLabel(p)}`;
    const sample = p.demo || wk.days.some((d) => (d.lock && d.lock.kind !== "live") || (d.plan && d.plan.ev.kind !== "live"));
    drawStory(cv, { img, own: !!ui.own, credit, subline: sub, rows, friends: [...friendsAll], score: (p.goals || []).length ? `${wk.x} of ${wk.y} goal nights` : `${wk.x} nights planned`, sample, title: p.visit && p.visit.from ? "My trip" : "My week" });
  } else {
    const mi = W.monthIdx(TODAY), y = W.yearOf(TODAY);
    const pre = `${y}-${String(mi + 1).padStart(2, "0")}`;
    const n = new Date(Date.UTC(y, mi + 1, 0)).getUTCDate();
    const locks = Object.values(S.locks).filter((l) => l.date.startsWith(pre) && S.checkins[l.event_id] !== "didnt");
    const days = Array.from({ length: n }, () => ({}));
    let nights = 0, runs = 0, cls = 0;
    locks.forEach((l) => {
      const i = W.dayNum(l.date) - 1; const t = l.tags || [];
      if (t.includes("learn") || t.includes("class")) { days[i].cls = true; cls++; }
      else if (t.includes("active") || t.includes("fitness") || t.includes("run")) { days[i].run = true; runs++; }
      else { days[i].night = true; nights++; }
    });
    const line = [];
    const part = (num, one, many) => { if (num) { if (line.length) line.push({ t: ", " }); line.push({ t: String(num), n: true }, { t: " " + (num === 1 ? one : many) }); } };
    part(nights, "night out", "nights out"); part(runs, "workout", "workouts"); part(cls, "class", "classes");
    if (!line.length) line.push({ t: "A fresh month. Nothing locked yet." }); else line.push({ t: "." });
    drawRecap(cv, { img, own: !!ui.own, credit, month: MONTHS[mi], line, days, zone: zoneLabel(p), sample: p.demo || locks.some((l) => l.kind !== "live") });
  }
}

/* ---------- You ---------- */
function youView() {
  const p = P();
  const L = W.learned();
  const goalsTxt = (p.goals || []).map((g) => goal(g).label).join(", ") || "None yet";
  const learnTxt = p.learn && (p.learn.text || (p.learn.chips || []).length) ? [p.learn.text, ...(p.learn.chips || [])].filter(Boolean).join(", ") : "";
  const freeTxt = (p.free_days || []).map((i) => DAYS[i]).join(" ") || "None";
  const crew = CREWS.find((c) => c.id === p.crew);
  const c = L.counts;
  const countBits = [["lock", "locks"], ["went", "went"], ["loved", "loved"], ["skip", "skips"], ["missed", "missed"], ["rsvp", "replies"], ["ics", "calendar saves"]].filter(([k]) => c[k]).map(([k, w]) => `${c[k]} ${w}`);
  const row = (k, v, step) => `<div class="ans"><div><p class="k">${k}</p><p class="v">${esc(v)}</p></div><a class="linkbtn" href="#/onboard/${step}?edit=1" aria-label="Edit ${k}">Edit</a></div>`;
  return `<header class="you-head"><h1>${p.name ? esc(p.name) : "<em>You</em>"}</h1>
      <p>${session.user ? `Signed in as ${esc(session.user.email)}` : p.visit ? "Visiting NYC, on this device" : "Guest on this device"}</p>
      ${!session.user ? `<div class="row2" style="margin-top:14px"><a class="btn sm ink" href="#/welcome" data-act="authgo" data-v="signup">Create account</a><a class="btn sm line" href="#/welcome" data-act="authgo" data-v="signin">Sign in</a></div>` : ""}
    </header>
    <section class="sec" aria-labelledby="ans-h"><h2 id="ans-h">Your answers</h2>
      <div class="field" style="margin-top:0"><label for="y-name">First name, shown on invites</label><input id="y-name" data-input="name" maxlength="40" autocomplete="given-name" value="${esc(p.name || "")}"></div>
      <div style="margin-top:10px;border-top:1px solid var(--rule)">
      ${row("Goals", goalsTxt, 1)}${learnTxt ? row("Want to learn", learnTxt, 1) : ""}
      ${row("Home base", `${p.hood || "Not set"}, ${zoneLabel(p)}`, 2)}
      ${row("Travel time", `Up to ${p.minutes || 30} minutes`, 3)}
      ${row("Budget", p.budget === 0 ? "Free only" : p.budget >= 100 ? "$100+ a week" : `$${p.budget ?? 25} a week`, 4)}
      ${row("Free nights", freeTxt, 5)}
      </div>
    </section>
    <section class="sec" aria-labelledby="crew-h"><h2 id="crew-h">Crew tag <small>${crew ? esc(crew.line) : "optional"}</small></h2>
      <div class="chips" role="group" aria-label="Crew tag">${CREWS.map((x) => `<button class="chip" data-act="crewtag" data-v="${x.id}" aria-pressed="${p.crew === x.id}">${x.name}</button>`).join("")}</div>
    </section>
    <section class="sec learned" aria-labelledby="ln-h"><h2 id="ln-h">What it has learned</h2>
      ${L.total ? `<p>You like: <em>${esc(L.likes.join(", ") || "still finding out")}</em>.</p><p>You skip: <em>${esc(L.skips.join(", ") || "nothing yet")}</em>.</p>
      <p class="fine">From ${L.total} things you did: ${countBits.join(", ")}. Went counts most, then locks and calendar saves; a skip only moves the reason you gave. Older taps fade over 8 weeks.</p>`
      : `<p>Nothing yet.</p><p class="fine">Lock, skip with a reason, or tell it whether you went. It only learns from what you do here.</p>`}
    </section>
    <section class="sec" aria-labelledby="data-h"><h2 id="data-h">Your data</h2>
      <div class="row2"><button class="btn line" data-act="export">${icon("down")}Export my data</button>${session.user ? `<button class="btn line" data-act="signout">Sign out</button>` : `<button class="btn line" data-act="startover">Start over</button>`}</div>
      <button class="linkbtn danger" data-act="delete">${session.user ? "Delete my account" : "Clear everything on this device"}</button>
    </section>
    <section class="sec" aria-labelledby="nx-h"><h2 id="nx-h">Coming next</h2>
      <p class="fine">Working today: live NYC Parks listings, .ics download, a calendar feed you can subscribe to, and invite links by text, WhatsApp or copy.</p>
      <ul class="next-list" style="margin-top:8px">
        <li>Google Calendar busy times<small>Next</small></li>
        <li>NYC Events Calendar listings<small>Next</small></li>
        <li>Ticketmaster and SeatGeek shows<small>Next</small></li>
        <li>Subway times to each place<small>Next</small></li>
        <li>Weather on outdoor nights<small>Next</small></li>
      </ul>
    </section>
    <p class="credits"><b>Photo credits</b> (Wikimedia Commons, resized): ${Object.values(PHOTOS).map((x) => esc(x.credit)).join(" · ")}. Licenses: <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener">CC BY 2.0</a>.</p>
    ${devNote()}
    <dialog id="del-dlg" aria-labelledby="del-h"><h2 id="del-h">Delete everything?</h2>
      <p>${session.user ? "This removes your account, answers, locked nights, invites and what it learned. It can't be undone." : "This clears your answers, locked nights and what it learned from this device. It can't be undone."}</p>
      <div class="row2"><button class="btn line" data-act="delcancel">Keep it</button><button class="btn ink" data-act="delyes">Delete</button></div></dialog>`;
}

/* ---------- events ---------- */
const actions = {
  gzone: (b) => { ui.guestZone = b.dataset.v; render({ keepFocus: true }); },
  guest: () => startGuest(),
  auth: (b) => { ui.auth = b.dataset.v; ui.authErr = ""; render(); app.querySelector("input")?.focus(); },
  authgo: (b, e) => { e.preventDefault(); ui.auth = b.dataset.v; go("#/welcome"); },
  authclose: () => { ui.auth = null; render(); },
  devicego: () => { ui.auth = null; if (!P()) startGuestOnboard(); else go("#/week"); },
  vzone: (b) => { ui.visit.zone = b.dataset.v; render({ keepFocus: true }); },
  goal: (b) => {
    const d = draft(); const v = b.dataset.v;
    if (d.goals.includes(v)) d.goals = d.goals.filter((x) => x !== v);
    else { d.goals.push(v); if (d.goals.length > 2) d.goals.shift(); }
    render({ keepFocus: true });
  },
  learnchip: (b) => { const d = draft(); const v = b.dataset.v; d.learn.chips = d.learn.chips.includes(v) ? d.learn.chips.filter((x) => x !== v) : [...d.learn.chips, v]; render({ keepFocus: true }); },
  zone: (b) => { const d = draft(); if (d.zone !== b.dataset.v) { d.zone = b.dataset.v; d.hood = ""; } render({ keepFocus: true }); },
  hood: (b) => { draft().hood = b.dataset.v; render({ keepFocus: true }); },
  minutes: (b) => { draft().minutes = Number(b.dataset.v); render({ keepFocus: true }); },
  budget: (b) => { draft().budget = Number(b.dataset.v); render({ keepFocus: true }); },
  day: (b) => { const d = draft(); const i = Number(b.dataset.v); d.free_days = d.free_days.includes(i) ? d.free_days.filter((x) => x !== i) : [...d.free_days, i].sort(); render({ keepFocus: true }); },
  crew: (b) => { const d = draft(); d.crew = d.crew === b.dataset.v ? "" : b.dataset.v; render({ keepFocus: true }); },
  next: (b) => { if (b.getAttribute("aria-disabled") === "true") return toast(stepNeed(Number(b.dataset.v))); go(`#/onboard/${Number(b.dataset.v) + 1}`); },
  finish: (b) => { if (b.getAttribute("aria-disabled") === "true") return toast(stepNeed(Number(b.dataset.v))); finishOnboard(); },
  retry: () => { session.liveStatus = "idle"; try { sessionStorage.clear(); } catch (e) { /* ignore */ } render(); ensureLive(); },
  ci: (b) => { const l = S.locks[b.dataset.id]; if (!l) return; W.checkin(l, b.dataset.v); toast(b.dataset.v === "didnt" ? "Noted. Next free night is your comeback night." : b.dataset.v === "loved" ? "Loved it. You'll see more like it." : "Nice. Noted."); render(); },
  lock: (b) => { const ev = evById.get(b.dataset.id); if (!ev) return; W.lock(ev); ui.justLit = ev.id; ui.skipOpen = null; render(); app.querySelector(`[data-act="droplock"][data-id="${CSS.escape(ev.id)}"]`)?.focus({ preventScroll: true }); toast("Locked. It's on your week."); },
  pick: (b) => { const ev = evById.get(b.dataset.id); if (!ev) return; delete S.kept[ev.date]; W.lock(ev); ui.justLit = ev.id; render(); app.querySelector(`[data-act="droplock"][data-id="${CSS.escape(ev.id)}"]`)?.focus({ preventScroll: true }); toast("Picked and locked."); },
  droplock: (b) => { W.dropLock(b.dataset.id); render(); toast("Lock removed."); },
  skipopen: (b) => { ui.skipOpen = ui.skipOpen === b.dataset.id ? null : b.dataset.id; render({ keepFocus: true }); app.querySelector(`[data-act="skip"][data-id="${CSS.escape(b.dataset.id)}"]`)?.focus(); },
  skipclose: () => { const id = ui.skipOpen; ui.skipOpen = null; render(); app.querySelector(`[data-act="skipopen"][data-id="${CSS.escape(id)}"]`)?.focus(); },
  skip: (b) => { const ev = evById.get(b.dataset.id); if (!ev) return; W.skip(ev, b.dataset.v); ui.skipOpen = null; render(); toast(`Skipped. It will weigh "${SKIP_REASONS.find((r) => r.id === b.dataset.v).label}" next time.`); },
  keep: (b) => { const dt = b.dataset.date; if (S.kept[dt]) delete S.kept[dt]; else S.kept[dt] = true; W.pushProfile(); render({ keepFocus: true }); },
  freeup: (b) => { const i = Number(b.dataset.v); P().free_days = [...new Set([...(P().free_days || []), i])].sort(); W.pushProfile(); render(); },
  ics: (b) => {
    if (b.getAttribute("aria-disabled") === "true") return toast("Lock a night first.");
    const locks = (lastWeek || week()).days.filter((d) => d.lock).map((d) => d.lock);
    download(`weekline-${lastWeek.dates[0]}.ics`, W.icsFor(locks), "text/calendar");
    locks.forEach((l) => W.signal("ics", { ...l, id: l.event_id }));
    toast(`${locks.length} ${locks.length === 1 ? "night" : "nights"} saved as a calendar file.`);
  },
  subscribe: async () => {
    if (!session.user) { ui.feed = { error: session.mode === "device" ? "Subscribing needs Weekline's server, and it isn't reachable right now. Add to calendar works offline." : "Sign in to get a calendar feed that updates itself. Add to calendar works without an account." }; return render(); }
    try { const r = await W.subscribeFeed(); ui.feed = r; Object.values(S.locks).forEach((l) => l.date >= TODAY && W.signal("ics", { ...l, id: l.event_id })); }
    catch (e) { ui.feed = { error: W.isOffline(e) ? "Can't reach the server right now." : e.message }; }
    render();
  },
  invite: async (b) => {
    const l = S.locks[b.dataset.id]; if (!l) return;
    const had = S.invites.find((i) => i.event_id === l.event_id);
    if (had) { ui.activeInvite = had.token; return go("#/crew"); }
    try { const t = await W.createInvite(l); ui.activeInvite = t; delete ui.inv[t]; go("#/crew"); }
    catch (e) { toast(e.message || "Couldn't make the invite."); }
  },
  showinv: (b) => { ui.activeInvite = b.dataset.v; render({ keepFocus: true }); loadCrew(); window.scrollTo({ top: 0, behavior: "smooth" }); },
  poll: async (b) => {
    const d = (lastWeek || week()).days.find((x) => x.date === b.dataset.date); if (!d) return;
    const opts = d.suggest.slice(0, 3).map((c) => `${c.ev.title}, ${c.ev.time}`);
    try { const t = await W.createPoll(`${DAYS_LONG[d.d]} ${W.dayNum(d.date)} ${MON3[W.monthIdx(d.date)]}: pick one`, opts); delete ui.polls[t]; go("#/crew"); toast("Poll ready. Send it below."); }
    catch (e) { toast(e.message || "Couldn't make the poll."); }
  },
  vote: async (b) => {
    const t = b.dataset.token, i = Number(b.dataset.v);
    try { await W.vote(t, i); ui.page = await W.getPoll(t); render({ keepFocus: true }); }
    catch (e) { toast(W.isOffline(e) ? "Can't reach Weekline right now." : e.message); }
  },
  copy: async (b) => { try { await navigator.clipboard.writeText(b.dataset.url); toast("Link copied."); } catch (e) { prompt("Copy this link", b.dataset.url); } },
  webshare: async (b) => { try { await navigator.share({ text: b.dataset.text, url: b.dataset.url }); } catch (e) { /* dismissed */ } },
  moff: (b) => { ui.monthOff = Number(b.dataset.v); render({ keepFocus: true }); },
  ownclear: () => { if (ui.ownUrl) URL.revokeObjectURL(ui.ownUrl); ui.own = null; ui.ownUrl = null; render(); },
  save: async (b) => { const cv = document.getElementById("poster"); await saveCanvas(cv, b.dataset.v === "recap" ? "weekline-month.png" : "weekline-my-week.png"); toast("Saved."); },
  share: async (b) => {
    const cv = document.getElementById("poster");
    try { const r = await shareCanvas(cv, b.dataset.v === "recap" ? "weekline-month.png" : "weekline-my-week.png", "My week, made with Weekline"); toast(r === "shared" ? "Shared." : "This browser can't share files, so it saved instead."); }
    catch (e) { /* dismissed */ }
  },
  "inv-ics": () => {
    const e = ui.page.event; const s = e.start.length === 10 ? e.start + "T18:00" : e.start;
    const end = e.end || s.slice(0, 11) + String(Math.min(23, Number(s.slice(11, 13)) + 2)).padStart(2, "0") + s.slice(13, 16);
    download("weekline-invite.ics", W.icsFor([{ event_id: route().arg.slice(0, 40), title: e.title, start: s + ":00", end: end.slice(0, 16) + ":00", place: e.place, url: e.url || "", kind: e.source === "Live NYC Parks" ? "live" : e.source === "Editorial" ? "editorial" : "sample" }]), "text/calendar");
  },
  crewtag: (b) => { P().crew = P().crew === b.dataset.v ? "" : b.dataset.v; W.pushProfile(); render({ keepFocus: true }); },
  export: async () => {
    try { const data = await W.exportData(); download("weekline-my-data.json", JSON.stringify(data, null, 2), "application/json"); toast("Exported."); }
    catch (e) { toast(W.isOffline(e) ? "Can't reach the server right now." : e.message); }
  },
  signout: async () => { await W.signOut(); toast("Signed out."); go("#/welcome"); },
  startover: () => { document.getElementById("del-dlg").showModal(); },
  delete: () => { document.getElementById("del-dlg").showModal(); },
  delcancel: () => document.getElementById("del-dlg").close(),
  delyes: async () => {
    try { await W.deleteAccount(); document.getElementById("del-dlg").close(); toast("Deleted."); go("#/welcome"); }
    catch (e) { toast(W.isOffline(e) ? "Can't reach the server, so nothing was deleted." : e.message); }
  },
};
function stepNeed(step) { return step === 1 ? "Pick at least one goal." : step === 2 ? "Pick a neighborhood." : "Pick at least one free night."; }
function startGuestOnboard() { ui.draft = null; go("#/onboard/1"); }
function download(name, text, type) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: type + ";charset=utf-8" })); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

app.addEventListener("click", (e) => {
  const b = e.target.closest("[data-act]");
  if (!b || !app.contains(b)) return;
  const fn = actions[b.dataset.act]; if (!fn) return;
  if (b.tagName === "BUTTON" || b.dataset.act === "authgo") e.preventDefault();
  fn(b, e);
});
app.addEventListener("submit", async (e) => {
  const f = e.target; e.preventDefault();
  if (f.dataset.form === "auth") return submitAuth(f);
  if (f.dataset.form === "visit") {
    const fd = new FormData(f); const from = String(fd.get("from")), to = String(fd.get("to"));
    if (!from || !to || to < from) { ui.visitErr = "Leaving has to be on or after arriving."; return render(); }
    ui.visitErr = "";
    S.profile = { guest: true, onboarded: true, visit: { from, to }, goals: [], zone: ui.visit.zone, hood: ui.visit.zone === "manhattan" ? "Midtown" : "Dumbo", minutes: 30, budget: 60, free_days: [0, 1, 2, 3, 4, 5, 6], learn: { text: "", chips: [] } };
    W.save(); session.liveStatus = "idle"; go("#/week"); ensureLive(); return;
  }
  if (f.dataset.form === "rsvp") {
    const status = (e.submitter && e.submitter.value) || "in";
    const name = String(new FormData(f).get("name") || "").trim();
    if (!name && status !== "out") { ui.rsvpErr = "Add your first name so they know who's coming."; return render(); }
    ui.rsvpErr = "";
    try {
      await W.rsvp(f.dataset.token, name || S.myRsvp[f.dataset.token]?.name || "", status);
      ui.page = await W.getInvite(f.dataset.token);
      if (status === "out") ui.page.you = null;
      render(); toast(status === "in" ? "You're in." : status === "maybe" ? "Marked as maybe." : "Okay, you're off the list.");
    } catch (err) { ui.rsvpErr = W.isOffline(err) ? "Can't reach Weekline right now." : err.message; render(); }
  }
});
app.addEventListener("input", (e) => {
  const t = e.target;
  if (t.dataset.input === "learn") draft().learn.text = t.value;
  if (t.dataset.input === "name") { P().name = t.value.trim().slice(0, 40); W.pushProfile(); }
});
app.addEventListener("change", (e) => {
  if (e.target.id === "ownphoto" && e.target.files && e.target.files[0]) {
    const f = e.target.files[0];
    if (ui.ownUrl) URL.revokeObjectURL(ui.ownUrl);
    ui.ownUrl = URL.createObjectURL(f);
    loadImage(ui.ownUrl).then((img) => { if (img) { ui.own = img; render(); } else toast("That photo didn't open. Try another."); });
  }
});

/* ---------- boot ---------- */
(async function boot() {
  if (qs.get("demo") === "1" && !(S.profile && S.profile.demo)) W.seedDemo(TODAY);
  await W.boot();
  if (S.invites.length) W.refreshFriendCounts().then(() => { if (["week", "share"].includes(route().name)) render({ keepFocus: true }); });
  render();
  ensureLive();
})();
