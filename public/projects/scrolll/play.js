/* Scrolll front door: name your price → scroll (brands knock, the rope decides) → done for now → receipt → share.
   Every price, bid and split here is SAMPLE data from the prototype (app.html / notes.md). The real split is TBD. */
(function () {
  "use strict";

  /* ---------- sample data ---------- */
  const PRICES = [0.5, 1, 2, 3]; // your floor per counted look, in cents (sample)
  const NAMES = ["Open House", "Fair Trade", "Velvet Rope", "Members Only"];
  const SPLIT = { you: 0.5, host: 0.2, scrolll: 0.3 }; // placeholder, same as app.html
  const NEED = { pic: 1000, vid: 2000 }; // ms at ≥50% on screen (MRC viewable bar)
  const CAP = 3; // demo cap: ads per hour

  // the project's own illustrations, from app.html
  const ART = {
    noodles: '<rect width="400" height="500" fill="#2a1a10"/><circle cx="200" cy="270" r="150" fill="#f1e4cf"/><circle cx="200" cy="270" r="120" fill="#d98a3a"/><path d="M110 250q40-30 90 0t90 0M100 285q50-30 100 0t100 0M115 320q40-25 85 0t85 0" stroke="#f6d37a" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="160" cy="230" r="14" fill="#6aa84f"/><circle cx="245" cy="300" r="12" fill="#6aa84f"/><path d="M300 90l-60 150M330 100l-70 145" stroke="#a66a3a" stroke-width="8" stroke-linecap="round"/>',
    bike: '<rect width="400" height="500" fill="#10283a"/><rect y="330" width="400" height="170" fill="#1e3d2a"/><circle cx="320" cy="110" r="44" fill="#ffcf6b"/><circle cx="120" cy="330" r="62" fill="none" stroke="#e7eef5" stroke-width="9"/><circle cx="290" cy="330" r="62" fill="none" stroke="#e7eef5" stroke-width="9"/><path d="M120 330l60-100h90l20 100M180 230l40 100 70-100M170 215h40M270 230l-10-30h30" stroke="#ff6b45" stroke-width="9" fill="none" stroke-linejoin="round" stroke-linecap="round"/>',
    thrift: '<rect width="400" height="500" fill="#2b2033"/><path d="M40 110h320" stroke="#c9b8d8" stroke-width="8" stroke-linecap="round"/><g fill="none" stroke="#c9b8d8" stroke-width="5"><path d="M100 110v24M200 110v24M300 110v24"/></g><path d="M60 140l40-10 40 10 10 220H50z" fill="#b5523b"/><path d="M160 140l40-10 40 10 15 260H145z" fill="#3c6e8f"/><path d="M200 140v260" stroke="#2c5370" stroke-width="4"/><path d="M260 140l40-10 40 10 8 190H252z" fill="#d9b44a"/>',
    sunset: '<defs><linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a5c"/><stop offset=".6" stop-color="#ffcf6b"/></linearGradient></defs><rect width="400" height="500" fill="url(#gs)"/><circle cx="200" cy="300" r="70" fill="#fff2c4"/><rect y="300" width="400" height="200" fill="#1f4a63"/><path d="M0 340q50-12 100 0t100 0 100 0 100 0M0 380q50-12 100 0t100 0 100 0 100 0" stroke="#7fb6cf" stroke-width="5" fill="none"/>',
    plant: '<rect width="400" height="500" fill="#e8e1d3"/><rect x="0" y="380" width="400" height="120" fill="#c8b89a"/><path d="M150 300h100l-12 110h-76z" fill="#b5523b"/><path d="M200 300c0-80-60-120-90-150 40 10 80 50 90 100 5-70 40-120 90-140-30 40-70 100-90 190z" fill="#3f7d4a"/><path d="M200 300c-20-40-70-60-100-60 30 20 70 40 100 60z" fill="#5a9e5f"/>',
    shoe: '<rect width="400" height="500" fill="#0f2a22"/><path d="M50 330q20-90 90-110l40 30q40 20 100 25 70 8 80 55v20H50z" fill="#c6ff4a"/><path d="M50 350h310v22H50z" fill="#e7eef5"/><path d="M150 240l20 18M170 228l20 18M190 220l20 18" stroke="#0f2a22" stroke-width="6" stroke-linecap="round"/>',
    coffee: '<rect width="400" height="500" fill="#1c1410"/><ellipse cx="200" cy="360" rx="140" ry="22" fill="#2e221b"/><path d="M110 220h180l-20 140H130z" fill="#e7eef5"/><path d="M290 245q50 0 45 40t-55 35" fill="none" stroke="#e7eef5" stroke-width="12"/><ellipse cx="200" cy="222" rx="90" ry="14" fill="#6b3f22"/><path d="M170 190q-15-25 0-50t0-50M215 190q-15-25 0-50t0-50" stroke="#8a7a6e" stroke-width="5" fill="none" stroke-linecap="round"/>',
    tent: '<rect width="400" height="500" fill="#16233a"/><circle cx="90" cy="90" r="3" fill="#fff"/><circle cx="300" cy="60" r="2" fill="#fff"/><circle cx="220" cy="120" r="2.5" fill="#fff"/><path d="M0 360l120-120 90 80 80-110 110 150v140H0z" fill="#2c4a3a"/><path d="M120 400l80-130 80 130z" fill="#ff6b45"/><path d="M200 270v130" stroke="#16233a" stroke-width="5"/>'
  };

  // sample brands and creators (fictional)
  const POSTS = [
    { who: "marisol.cooks", av: "#ffcf6b", art: "noodles", cap: "12-minute noodles." },
    { ad: true, who: "Pellum Running", av: "#c6ff4a", art: "shoe", type: "pic", bid: 1.2, host: "marisol.cooks" },
    { who: "ana.on.balconies", av: "#5a9e5f", art: "plant", cap: "Day 40. Still alive." },
    { ad: true, who: "Brisk & Bean", av: "#e7eef5", art: "coffee", type: "vid", bid: 0.8, host: "ana.on.balconies" },
    { ad: true, who: "Loft & Ledger", av: "#d9b44a", art: "thrift", type: "pic", bid: 1.5, host: "ana.on.balconies" },
    { who: "teo.rides", av: "#3ad7ff", art: "tent", cap: "Cold. Loved it." },
    { ad: true, who: "Tidewater Trips", av: "#ff8a5c", art: "sunset", type: "pic", bid: 2.4, host: "teo.rides" },
    { ad: true, who: "Spoke & Pine", av: "#3ad7ff", art: "bike", type: "pic", bid: 3.2, host: "teo.rides" }
  ];
  const ADS = POSTS.filter((p) => p.ad);

  /* ---------- helpers ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (c) => String(Math.round(c * 100) / 100) + "¢";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 80) : ms));

  /* ---------- state + link ---------- */
  const params = new URLSearchParams(location.search);
  const friendRaw = params.get("f");
  const friend = friendRaw !== null && PRICES[+friendRaw] !== undefined ? +friendRaw : null;
  let pi = 1; // price index
  try { const s = localStorage.getItem("scrolll.price.v1"); if (s !== null && PRICES[+s] !== undefined) pi = +s; } catch (e) { /* no storage */ }
  const run = { kept: 0, counted: [], bounced: [], over: false };

  function show(id) {
    $$(".beat").forEach((b) => b.classList.toggle("is-on", b.id === id));
    window.scrollTo(0, 0);
  }

  /* ---------- 1. Door ---------- */
  function paintDial(bump) {
    const d = $("#dial");
    d.textContent = fmt(PRICES[pi]);
    d.setAttribute("aria-label", "Your price " + fmt(PRICES[pi]) + " per look");
    $$("[data-step]").forEach((b) => { b.disabled = (+b.dataset.step < 0 && pi === 0) || (+b.dataset.step > 0 && pi === PRICES.length - 1); });
    if (bump && !reduced) { d.classList.remove("bump"); void d.offsetWidth; d.classList.add("bump"); }
  }
  $$("[data-step]").forEach((b) => b.addEventListener("click", () => {
    pi = Math.max(0, Math.min(PRICES.length - 1, pi + +b.dataset.step));
    paintDial(true);
  }));
  document.addEventListener("keydown", (e) => {
    if (!$("#beat-door").classList.contains("is-on")) return;
    if (e.target.closest && e.target.closest("button") && e.key === "Enter") return;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") { e.preventDefault(); $('[data-step="1"]').click(); }
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") { e.preventDefault(); $('[data-step="-1"]').click(); }
  });
  $("#go").addEventListener("click", startFeed);

  if (friend !== null) {
    const fl = $("#friend-line");
    fl.hidden = false;
    fl.textContent = "Friend: " + fmt(PRICES[friend]);
    $("#door-ask").textContent = "What do you charge?";
  }

  /* ---------- 2. Feed ---------- */
  const timers = new Map();
  let loop = null;

  function postHtml(p, i) {
    const pic = '<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + esc(p.ad ? p.who + " ad" : "Post by " + p.who) + '">' + ART[p.art] + "</svg>";
    if (!p.ad) {
      return '<article class="post" data-i="' + i + '"><header><span class="av" style="background:' + p.av + '">' + p.who[0].toUpperCase() + '</span><div><div class="who">@' + esc(p.who) + '</div><div class="cap">' + esc(p.cap) + "</div></div></header>" +
        '<div class="media">' + pic + "</div></article>";
    }
    const rope = '<div class="rope" aria-hidden="true"><svg viewBox="0 0 400 60" preserveAspectRatio="none"><path d="M0 10 Q200 70 400 10" stroke="#ff6b45" stroke-width="12" fill="none" stroke-linecap="round"/></svg><span class="stamp">Bounced<small>Below your price</small></span></div>';
    return '<article class="post sp" data-i="' + i + '"><header><span class="av" style="background:' + p.av + '">' + p.who[0].toUpperCase() + '</span><div><div class="who">' + esc(p.who) + '</div><div class="bid">Offers ' + fmt(p.bid) + '</div></div><span class="tag-sp">Sponsored</span></header>' +
      '<div class="media">' + pic + (p.type === "vid" ? '<span class="vid">▶ 0:15</span>' : "") + rope + "</div>" +
      '<div class="strip"><span class="st">At the door</span><span class="bar"><i></i></span></div></article>';
  }

  function startFeed() {
    try { localStorage.setItem("scrolll.price.v1", String(pi)); } catch (e) { /* this visit only */ }
    run.kept = 0; run.counted = []; run.bounced = []; run.over = false;
    POSTS.forEach((p) => { delete p.state; });
    timers.clear();
    $("#done").hidden = true;
    $("#feed").innerHTML = POSTS.map(postHtml).join("");
    $("#my-price").textContent = "Your price " + fmt(PRICES[pi]);
    paintMeter(false);
    show("beat-feed");
    $("#next").hidden = false;
    watch();
  }

  function paintMeter(tick) {
    $("#amt").textContent = fmt(run.kept);
    $("#cnt").textContent = run.counted.length + " of " + CAP + " ads";
    const m = $("#meter");
    if (tick && !reduced) { m.classList.remove("tick"); void m.offsetWidth; m.classList.add("tick"); }
  }

  // every 100 ms: an ad at least half on screen (below the header) knocks, then accrues time; drop below half and its timer resets
  function watch() {
    clearInterval(loop);
    let endSeen = false;
    let last = performance.now();
    loop = setInterval(() => {
      const now = performance.now();
      const dt = Math.min(250, now - last);
      last = now;
      if (!$("#beat-feed").classList.contains("is-on")) return;
      const top = $(".feed-head").getBoundingClientRect().bottom;
      const bottom = window.innerHeight;
      const endAt = $("#feed-end").getBoundingClientRect().top;
      if (endAt < bottom && !endSeen) {
        endSeen = true;
        setTimeout(() => { if (run.over) $("#done").hidden = false; else finish("end"); }, 600);
      } else if (endAt >= bottom) endSeen = false;
      if (run.over || run.counted.length >= CAP) return;
      ADS.forEach((p) => {
        const i = POSTS.indexOf(p);
        const r = el(i).getBoundingClientRect();
        const vis = Math.max(0, Math.min(r.bottom, bottom) - Math.max(r.top, top)) / r.height;
        if (vis >= 0.5) knock(i);
        if (p.state !== "in") return;
        const t = timers.get(i);
        if (vis >= 0.5) { t.ms += dt; if (t.ms >= NEED[p.type]) count(i); else paintStrip(i); }
        else if (t.ms) { t.ms = 0; paintStrip(i); }
      });
    }, 100);
  }

  function el(i) { return $('#feed .post[data-i="' + i + '"]'); }

  // a brand reaches the door: the rope lets it in or bounces it
  function knock(i) {
    const p = POSTS[i];
    if (p.state) return;
    const e = el(i);
    if (run.over || run.counted.length >= CAP) { p.state = "off"; e.classList.add("is-off"); $(".st", e).textContent = "Ads off for now"; return; }
    if (p.bid >= PRICES[pi]) {
      p.state = "in";
      timers.set(i, { ms: 0 });
      e.classList.add("is-in");
      paintStrip(i);
    } else {
      p.state = "out";
      run.bounced.push(p);
      e.classList.add("is-out");
      $(".st", e).textContent = "Not tonight";
    }
  }

  function paintStrip(i) {
    const p = POSTS[i];
    const e = el(i);
    if (!e || p.state !== "in") return;
    const t = timers.get(i);
    const frac = Math.min(1, t.ms / NEED[p.type]);
    $(".bar i", e).style.width = frac * 100 + "%";
    $(".st", e).textContent = frac > 0 ? "Seeing… " + (frac * NEED[p.type] / 1000).toFixed(1) + " s" : "Let in";
  }

  function count(i) {
    const p = POSTS[i];
    p.state = "counted";
    const e = el(i);
    e.classList.add("is-counted");
    const mine = p.bid * SPLIT.you;
    $(".st", e).textContent = "Counted · +" + fmt(mine);
    run.kept += mine;
    run.counted.push(p);
    paintMeter(true);
    if (run.counted.length >= CAP) setTimeout(() => finish("cap"), 700);
  }

  // Done for now: the cap ends the ads, and the feed lets you go
  function finish(why) {
    if (run.over || !$("#beat-feed").classList.contains("is-on")) return;
    run.over = true;
    $("#next").hidden = true;
    const n = run.counted.length;
    $("#done-title").textContent = why === "cap" ? "Done for now." : n ? "That's the feed." : "Nobody met your price.";
    $("#done-sub").textContent = why === "cap" ? "Ads off. Feed stays open." : n ? n + " brand" + (n === 1 ? "" : "s") + " paid. " + run.bounced.length + " bounced." : "Picky. Respect.";
    $("#stay").hidden = why !== "cap";
    $("#done").hidden = false;
    $("#print").focus({ preventScroll: true });
  }
  $("#stay").addEventListener("click", () => { $("#done").hidden = true; });
  $("#print").addEventListener("click", receipt);
  $("#next").addEventListener("click", () => {
    const posts = $$("#feed .post");
    const head = $(".feed-head").getBoundingClientRect().bottom;
    const nx = posts.find((p) => p.getBoundingClientRect().top > head + 8);
    const to = nx ? window.scrollY + nx.getBoundingClientRect().top - head - 4 : document.body.scrollHeight;
    const from = window.scrollY;
    window.scrollTo({ top: to, behavior: reduced ? "auto" : "smooth" });
    // if smooth scrolling is unavailable, jump
    setTimeout(() => { if (window.scrollY === from) window.scrollTo(0, to); }, 450);
  });

  /* ---------- 3. Receipt ---------- */
  async function receipt() {
    $("#done").hidden = true;
    show("beat-receipt");
    const paper = $("#paper");
    $$(".on", paper).forEach((x) => x.classList.remove("on"));
    $("#r-total").textContent = "0¢";
    $("#r-stamp").innerHTML = esc(NAMES[pi]) + "<small>" + fmt(PRICES[pi]) + "</small>";
    const lines = run.counted.map((p) => '<li><span>' + esc(p.who) + '</span><b>' + fmt(p.bid) + " → " + fmt(p.bid * SPLIT.you) + "</b></li>")
      .concat(run.bounced.map((p) => '<li class="out"><span>' + esc(p.who) + "</span><b>✕</b></li>"));
    $("#r-lines").innerHTML = lines.join("") || "<li><span>No ads</span><b>0¢</b></li>";
    const rf = $("#r-friend");
    rf.hidden = true;
    $("#r-actions").style.visibility = "hidden";

    const seq = [$(".r-head", paper), $("#r-lines")].concat($$("#r-lines li"), [$(".r-total", paper)]);
    for (const x of seq) { x.classList.add("on"); await wait(x.tagName === "LI" ? 300 : 200); }
    // count up the total, slowly at the end
    const steps = reduced ? 1 : 12;
    for (let k = 1; k <= steps; k += 1) {
      $("#r-total").textContent = fmt(run.kept * (1 - Math.pow(1 - k / steps, 3)));
      await wait(30 + k * 7);
    }
    $("#r-total").textContent = fmt(run.kept);
    await wait(300);
    $("#r-stamp").classList.add("on");
    await wait(500);
    $(".r-foot", paper).classList.add("on");
    if (friend !== null) {
      rf.hidden = false;
      rf.textContent = friend === pi ? "Same price as your friend" : "Friend: " + NAMES[friend] + ", " + fmt(PRICES[friend]);
      $("#send").textContent = "Send back";
    }
    $("#r-actions").style.visibility = "";
  }

  /* ---------- share card (canvas, 1080×1920) ---------- */
  async function makeCard() {
    try { await document.fonts.ready; } catch (e) { /* fine */ }
    const W = 1080, H = 1920;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d");
    g.fillStyle = "#070b10"; g.fillRect(0, 0, W, H);
    const glow = g.createRadialGradient(220, 0, 0, 220, 0, 1100);
    glow.addColorStop(0, "rgba(198,255,74,.20)"); glow.addColorStop(1, "rgba(198,255,74,0)");
    g.fillStyle = glow; g.fillRect(0, 0, W, H);
    // shrink a line until it fits
    const fit = (txt, x, y, maxW, size, family) => {
      let s = size;
      do { g.font = family.replace("SIZE", s + "px"); s -= 2; } while (g.measureText(txt).width > maxW && s > 20);
      g.fillText(txt, x, y);
    };
    g.fillStyle = "#e7eef5"; g.textAlign = "left";
    fit("One look at me", 90, 250, W - 180, 96, "800 SIZE Syne, sans-serif");
    fit("costs " + fmt(PRICES[pi]) + ".", 90, 360, W - 180, 96, "800 SIZE Syne, sans-serif");
    g.fillStyle = "#c6ff4a"; g.font = "600 44px 'IBM Plex Sans', sans-serif";
    g.fillText("Brands below that get bounced.", 90, 450);
    // paper
    const px = 140, py = 560, pw = 800;
    const rows = run.counted.length + run.bounced.length || 1;
    const ph = 560 + rows * 74;
    g.fillStyle = "#f4f1e8";
    g.beginPath(); g.moveTo(px, py); g.lineTo(px + pw, py); g.lineTo(px + pw, py + ph);
    for (let x = px + pw; x > px; x -= 40) { g.lineTo(x - 20, py + ph - 20); g.lineTo(x - 40, py + ph); }
    g.closePath(); g.fill();
    g.fillStyle = "#1a1a17"; g.font = "700 34px 'IBM Plex Mono', monospace"; g.textAlign = "center";
    g.fillText("RECEIPT FOR MY EYES", W / 2, py + 90);
    g.textAlign = "left"; g.font = "600 38px 'IBM Plex Mono', monospace";
    let y = py + 190;
    const row = (l, r, col, strike) => {
      g.fillStyle = col; g.textAlign = "left"; g.fillText(l, px + 60, y);
      g.textAlign = "right"; g.fillText(r, px + pw - 60, y);
      if (strike) { const w = g.measureText(l).width; g.fillRect(px + 60, y - 13, Math.min(w + 0, 520), 4); }
      y += 74;
    };
    run.counted.forEach((p) => row(p.who, fmt(p.bid) + " → " + fmt(p.bid * SPLIT.you), "#1a1a17"));
    run.bounced.forEach((p) => row(p.who, "✕", "#a2412a", true));
    if (!rows) row("No ads", "0¢", "#1a1a17");
    y += 10;
    g.fillStyle = "#1a1a17"; g.font = "700 50px 'IBM Plex Mono', monospace";
    row("I kept", fmt(run.kept), "#1a1a17");
    // stamp
    g.save(); g.translate(W / 2, y + 90); g.rotate(-0.1);
    g.textAlign = "center"; g.fillStyle = "#2f6b12";
    let fs = 66;
    do { g.font = "800 " + fs + "px Syne, sans-serif"; fs -= 2; } while (g.measureText(NAMES[pi].toUpperCase()).width > pw - 160);
    const sw = g.measureText(NAMES[pi].toUpperCase()).width + 70;
    g.strokeStyle = "#2f6b12"; g.lineWidth = 9; g.strokeRect(-sw / 2, -70, sw, 100);
    g.fillText(NAMES[pi].toUpperCase(), 0, 2);
    g.restore();
    g.fillStyle = "#77725f"; g.font = "700 28px 'IBM Plex Sans', sans-serif"; g.textAlign = "center";
    g.fillText("SAMPLE · REAL SPLIT TBD", W / 2, py + ph - 60);
    g.fillStyle = "#e7eef5";
    fit("What do you charge?", W / 2, H - 230, W - 160, 64, "800 SIZE Syne, sans-serif");
    g.fillStyle = "rgba(231,238,245,.62)"; g.font = "600 36px 'IBM Plex Sans', sans-serif";
    g.fillText("Scrolll · a Vargas Studio prototype", W / 2, H - 150);
    return new Promise((r) => c.toBlob(r, "image/png"));
  }

  function shareLink() {
    const u = new URL(location.href);
    u.search = "";
    u.hash = "";
    u.searchParams.set("f", String(pi));
    u.searchParams.set("via", "card");
    return u.href;
  }
  function download(blob) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "scrolll-receipt.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  $("#send").addEventListener("click", async () => {
    const btn = $("#send");
    btn.disabled = true;
    btn.textContent = "Making your card…";
    const blob = await makeCard();
    btn.disabled = false;
    btn.textContent = friend !== null ? "Send back" : "Send to a friend";
    const link = shareLink();
    const text = "One look at me costs " + fmt(PRICES[pi]) + " (sample). What do you charge?";
    try {
      const file = blob && new File([blob], "scrolll-receipt.png", { type: "image/png" });
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text: text + " " + link }); return; }
      if (navigator.share) { await navigator.share({ text: text, url: link }); return; }
    } catch (e) { return; /* closed the share sheet */ }
    try {
      await navigator.clipboard.writeText(text + " " + link);
      btn.textContent = "Link copied";
      setTimeout(() => { btn.textContent = friend !== null ? "Send back" : "Send to a friend"; }, 1800);
    } catch (e) { /* no clipboard */ }
    if (blob) download(blob);
  });
  $("#again").addEventListener("click", () => { paintDial(false); show("beat-door"); });

  /* ---------- go ---------- */
  paintDial(false);

  // screenshot helper: ?beat=feed|done|receipt (simulates a run at the chosen price)
  const beat = params.get("beat");
  if (params.get("p") !== null && PRICES[+params.get("p")] !== undefined) { pi = +params.get("p"); paintDial(false); }
  if (beat) {
    startFeed();
    const sim = () => {
      ADS.forEach((p) => {
        const i = POSTS.indexOf(p);
        if (run.over || p.state || run.counted.length >= CAP) return;
        knock(i);
        if (p.state === "in" && beat !== "feed") count(i);
      });
    };
    if (beat === "feed") {
      // scroll, then settle every ad that is at least half on screen
      setTimeout(() => {
        window.scrollTo(0, +(params.get("scroll") || 0));
        ADS.forEach((p) => {
          const i = POSTS.indexOf(p);
          const r = el(i).getBoundingClientRect();
          const vis = (Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / r.height;
          if (vis >= 0.5 && !p.state) { knock(i); if (p.state === "in") count(i); }
        });
      }, 50);
    } else {
      sim();
      if (beat === "done") finish(run.counted.length >= CAP ? "cap" : "end");
      if (beat === "receipt") receipt();
      if (beat === "card") makeCard().then((b) => {
        document.body.innerHTML = "";
        const im = new Image();
        im.alt = "Share card";
        im.style.cssText = "display:block;width:100%;height:auto";
        im.src = URL.createObjectURL(b);
        document.body.appendChild(im);
      });
    }
  }
})();
