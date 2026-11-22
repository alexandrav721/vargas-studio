/* Lumen front door: what's your fog → the fog lifts → punch a ticket → card with a spare ticket.
   Classic script (works from file:// and from Vite's public/). Nothing leaves the device;
   a friend's fog and answers travel only in the link (?f=perfect&a=210120&t=1). */
(function () {
  "use strict";

  /* The six obstacles are Lumen's own (print/streak-card.html, page 2). The games are the pocket cards. */
  var FOGS = [
    { id: "voice", name: "The Echo", fog: "An old voice says you can't", q: "“Who do you think you are?” plays in my head.", game: "Whose line is it?", mins: 2,
      steps: ["Write the sentence stopping you.", "Whose words were they first?", "Rewrite it in your own voice.", "Do one 2-minute move."],
      art: '<path d="M44 34h88a14 14 0 0 1 14 14v36a14 14 0 0 1-14 14H86l-22 20V98H44a14 14 0 0 1-14-14V48a14 14 0 0 1 14-14z"/><path class="soft" d="M54 58h64M54 74h42"/><path d="M160 50c9 10 9 30 0 40"/><path class="soft" d="M174 40c15 16 15 44 0 60"/>' },
    { id: "loyal", name: "The Loyal Heart", fog: "Everyone else comes first", q: "Everyone else comes first. My goal waits.", game: "Both, not either", mins: 10,
      steps: ["Name who you fear letting down.", "Write how your goal helps them too.", "Give them 10 minutes. Then 10 to you."],
      art: '<path d="M100 66c-8-16-34-16-34 6 0 18 22 30 34 40 12-10 34-22 34-40 0-22-26-22-34-6z"/><circle class="soft" cx="40" cy="128" r="10"/><circle class="soft" cx="100" cy="140" r="10"/><circle class="soft" cx="160" cy="128" r="10"/><path class="soft" d="M48 120l28-18M100 130v-16M152 120l-28-18"/>' },
    { id: "attention", name: "The Wanderer", fog: "Your phone ate the hour", q: "I open my phone. Forty minutes vanish.", game: "Other room, 10 minutes", mins: 10,
      steps: ["Phone goes in another room.", "Set a 10-minute timer.", "Count 3, 2, 1. Start the first line."],
      art: '<rect x="70" y="18" width="60" height="112" rx="12"/><path class="soft" d="M92 30h16"/><path d="M100 78c0-6 8-6 8 0 0 10-16 10-16 0 0-16 26-16 26 0 0 22-36 22-36 0"/><path class="soft" d="M150 40a40 40 0 0 1 0 60M162 30a54 54 0 0 1 0 80"/>' },
    { id: "nextstep", name: "The Dreamer", fog: "The next step is blurry", q: "I want it. I just don't know the next step.", game: "Film-able move", mins: 2,
      steps: ["Write the next step.", "Could someone film you doing it? If not, shrink it.", "Shrink until it takes 2 minutes. Do it."],
      art: '<ellipse cx="44" cy="128" rx="22" ry="8"/><ellipse cx="88" cy="104" rx="18" ry="7"/><ellipse class="soft" cx="124" cy="82" rx="14" ry="6"/><ellipse class="soft" cx="152" cy="64" rx="10" ry="4" opacity=".5"/><path d="M160 22c0-10 18-10 18 0 0 8-9 8-9 16"/><circle cx="169" cy="48" r="1.5"/>' },
    { id: "perfect", name: "The Perfectionist", fog: "If it can't be good, why start", q: "If it can't be good, I don't start.", game: "Ugly first draft", mins: 5,
      steps: ["Set 5 minutes.", "Make a deliberately bad version.", "Fix one thing. Stop there."],
      art: '<path d="M40 120c20-40 40 10 60-20s40 10 60-30"/><path d="M128 26l26 26-56 56H72V82z"/><path class="soft" d="M118 36l26 26"/><path class="soft" d="M40 140h120"/>' },
    { id: "energy", name: "The Low Battery", fog: "Nothing left by evening", q: "By evening, there's nothing left.", game: "Tiny or rest", mins: 2,
      steps: ["Pick one, out loud:", "Tiny: the 2-minute version, now.", "Rest: punch a return ticket. Sleep."],
      art: '<rect x="34" y="60" width="104" height="52" rx="10"/><path d="M138 76h10v20h-10"/><rect x="44" y="70" width="18" height="32" rx="3" fill="#c9a227"/><path class="soft" d="M172 28a22 22 0 1 0 14 38 26 26 0 0 1-14-38z"/>' }
  ];
  var BY = {};
  FOGS.forEach(function (f) { BY[f.id] = f; });
  var KEY = "lumen.front.v1";
  var SAMPLE = "120201"; /* screenshot mode only */

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, reduced ? Math.min(ms, 60) : ms); }); };
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* this visit only */ } }
  function svg(f, label) {
    return '<svg class="art" viewBox="0 0 200 160" ' + (label ? 'role="img" aria-label="' + label + '"' : 'aria-hidden="true"') + ">" + f.art + "</svg>";
  }

  /* ---- a friend's link ---- */
  var params = new URLSearchParams(location.search);
  var friend = BY[params.get("f")] ? { fog: BY[params.get("f")], a: (params.get("a") || "").replace(/[^012]/g, "").slice(0, 6) } : null;
  var gifted = params.get("t") === "1";
  var shot = Number(params.get("shot")) || 0;
  var saved = load();

  var answers = [];
  var i = 0;
  var mine = null;
  var punched = false;

  function show(id) {
    $$(".beat").forEach(function (b) { b.classList.toggle("is-on", b.id === id); });
    window.scrollTo(0, 0);
    document.body.dataset.beat = id;
  }
  function setFog(v) { document.documentElement.style.setProperty("--fog", String(v)); }

  /* ---------- 1. Ask ---------- */
  function paintStreak() {
    var g = $("#streak-dots");
    var out = "";
    for (var k = 0; k < 7; k += 1) {
      var x = 22 + k * 46;
      if (k === 4) {
        out += '<g transform="translate(' + (x - 17) + ',22)"><rect width="34" height="36" rx="6" fill="rgba(201,162,39,.18)" stroke="#c9a227" stroke-width="2" stroke-dasharray="4 3"/><circle cx="17" cy="18" r="4" fill="#12151c"/></g>';
      } else {
        out += '<rect x="' + (x - 17) + '" y="22" width="34" height="36" rx="8" fill="#c9a227"' + (k > 4 ? ' opacity=".35"' : "") + "/>";
      }
    }
    out = '<path d="M22 40H298" stroke="#c9a227" stroke-width="2" opacity=".5"/>' + out;
    g.innerHTML = out;
  }
  function paintAsk() {
    paintStreak();
    if (friend || gifted) {
      $("#gift").hidden = false;
      $("#gift-line").textContent = gifted ? "A friend sent you a spare ticket." : "A friend sent you their fog.";
      $("#ask-h").textContent = "What's your fog?";
    } else if (saved && saved.fog && BY[saved.fog]) {
      $("#ask-h").textContent = "Welcome back. Still in.";
      $("#my-game").hidden = false;
    }
  }
  $("#go").addEventListener("click", function () { startPlay(); });
  $("#my-game").addEventListener("click", function () { mine = BY[saved.fog]; showGame(); });

  /* ---------- 2. Play ---------- */
  function startPlay() {
    answers = [];
    i = 0;
    setFog(1);
    show("b-play");
    paintCard();
  }
  function paintCard() {
    var f = FOGS[i];
    $("#count").textContent = (i + 1) + " of " + FOGS.length;
    $("#deck").innerHTML = '<div class="card" tabindex="-1">' + svg(f) + "<blockquote>" + f.q + "</blockquote></div>" +
      (FOGS[i + 1] ? '<div class="card card--under" aria-hidden="true"></div>' : "");
    bindSwipe($("#deck .card"));
  }
  var busy = false;
  function answer(v) {
    if (busy || !$("#b-play").classList.contains("is-on")) return;
    busy = true;
    answers[i] = v;
    var c = $("#deck .card");
    if (c) { c.style.transform = ""; c.classList.add("out-" + v); }
    setFog(1 - (i + 1) / (FOGS.length + 1));
    wait(260).then(function () {
      busy = false;
      i += 1;
      if (i < FOGS.length) paintCard();
      else reveal();
    });
  }
  $$("[data-ans]").forEach(function (b) { b.addEventListener("click", function () { answer(Number(b.dataset.ans)); }); });
  document.addEventListener("keydown", function (e) {
    if (!$("#b-play").classList.contains("is-on")) return;
    if (e.key === "ArrowRight") answer(2);
    if (e.key === "ArrowLeft") answer(0);
    if (e.key === "ArrowUp") answer(1);
  });
  function bindSwipe(card) {
    var x0 = null, y0 = null;
    card.addEventListener("pointerdown", function (e) { x0 = e.clientX; y0 = e.clientY; card.setPointerCapture(e.pointerId); card.classList.add("is-drag"); });
    card.addEventListener("pointermove", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      card.style.transform = "translate(" + dx + "px," + Math.min(0, dy) + "px) rotate(" + dx / 18 + "deg)";
      card.dataset.lean = dx > 40 ? "2" : dx < -40 ? "0" : dy < -60 ? "1" : "";
    });
    card.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      x0 = null;
      card.classList.remove("is-drag");
      if (dx > 90) answer(2);
      else if (dx < -90) answer(0);
      else if (dy < -110) answer(1);
      else { card.style.transform = ""; card.dataset.lean = ""; }
    });
  }

  /* ---------- 3. Reveal ---------- */
  function pick(a) {
    var best = 0;
    for (var k = 1; k < FOGS.length; k += 1) if ((a[k] || 0) > (a[best] || 0)) best = k;
    return FOGS[best];
  }
  function reveal() {
    mine = pick(answers);
    var prev = load() || {};
    var tickets = typeof prev.tickets === "number" ? prev.tickets : 3;
    store({ fog: mine.id, a: answers.join(""), tickets: tickets, comebacks: prev.comebacks || 0, gift: prev.gift || gifted });
    var sec = $("#b-reveal");
    sec.classList.remove("is-clear");
    $("#lead").textContent = "Your fog is…";
    $("#name").textContent = mine.name;
    $("#reveal-art").innerHTML = svg(mine);
    $("#fogtag").textContent = mine.fog + ".";
    $("#move").innerHTML = "<span>Your game:</span> <b>" + mine.game + "</b> <span>· " + mine.mins + " min</span>";
    var c = $("#compare");
    c.hidden = !friend;
    if (friend) {
      var same = 0;
      for (var k = 0; k < 6; k += 1) if (friend.a[k] !== undefined && Number(friend.a[k]) === answers[k]) same += 1;
      c.textContent = friend.fog.id === mine.id ? "Same fog as your friend. " + same + " of 6 alike." : "Your friend: " + friend.fog.name + ". Swap games?";
    }
    show("b-reveal");
    wait(1100).then(function () { setFog(0); sec.classList.add("is-clear"); });
  }
  $("#to-ticket").addEventListener("click", function () { showTicket(); });

  /* ---------- 4. Ticket: the morning after a miss ---------- */
  var DAYS = ["M", "T", "W", "T", "F", "S", "S"];
  function showTicket() {
    punched = false;
    $("#week").innerHTML = DAYS.map(function (d, k) {
      var cls = k === 0 ? "done" : k === 1 ? "miss" : "";
      return '<div class="day"><span class="box ' + cls + '" id="d' + k + '"></span>' + d + "</div>";
    }).join("");
    var s = load() || {};
    var left = typeof s.tickets === "number" ? s.tickets : 3;
    if (left <= 0) { left = 3; s.tickets = 3; store(s); } /* demo: a fresh season, totals kept */
    $("#t-head").textContent = "Say you miss Tuesday.";
    $("#t-sub").innerHTML = "No zero. No reset.";
    $("#t-n").textContent = (4 - Math.max(1, left)) + " of 3";
    $("#ticket").classList.remove("is-punched");
    $("#punch").hidden = false;
    $("#to-card").hidden = true;
    show("b-ticket");
  }
  function punch() {
    if (punched) return;
    punched = true;
    $("#ticket").classList.add("is-punched");
    $("#punch").hidden = true;
    var s = load() || { tickets: 3, comebacks: 0 };
    s.tickets = Math.max(0, (typeof s.tickets === "number" ? s.tickets : 3) - 1);
    s.comebacks = (s.comebacks || 0) + 1;
    store(s);
    wait(500).then(function () {
      $("#d1").classList.remove("miss");
      $("#d1").innerHTML = '<i class="stub"></i>';
      $("#d2").classList.add("done");
      $("#t-head").textContent = "Still in.";
      var left = s.tickets + (s.gift || gifted ? 1 : 0);
      $("#t-sub").innerHTML = "Streak kept. <b>" + left + " ticket" + (left === 1 ? "" : "s") + "</b> left" + (s.gift || gifted ? ", one from a friend." : ".");
      $("#to-card").hidden = false;
      $("#to-card").focus();
    });
  }
  $("#ticket").addEventListener("click", punch);
  $("#punch").addEventListener("click", punch);
  $("#to-card").addEventListener("click", function () { showCard(); });

  /* ---------- 5. Card ---------- */
  function wrap(ctx, text, x, y, max, lh) {
    var words = text.split(" "), line = "", lines = [];
    words.forEach(function (w) {
      var t = line ? line + " " + w : w;
      if (ctx.measureText(t).width > max && line) { lines.push(line); line = w; } else line = t;
    });
    lines.push(line);
    lines.forEach(function (l, k) { ctx.fillText(l, x, y + k * lh); });
    return y + lines.length * lh;
  }
  function drawTicket(ctx, x, y, w, h, label, sub) {
    ctx.save();
    ctx.setLineDash([14, 10]);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#c9a227";
    ctx.fillStyle = "rgba(201,162,39,.12)";
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, w, h, 22) : ctx.rect(x, y, w, h);
    ctx.fill(); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#1a2030";
    [x, x + w].forEach(function (cx) { ctx.beginPath(); ctx.arc(cx, y + h / 2, 26, 0, Math.PI * 2); ctx.fill(); });
    ctx.textAlign = "center";
    ctx.fillStyle = "#c9a227";
    ctx.font = "700 30px 'DM Sans', sans-serif";
    ctx.fillText(label.split("").join(String.fromCharCode(8202)), x + w / 2, y + h / 2 - 10);
    ctx.fillStyle = "#f4f1ea";
    ctx.font = "600 44px Fraunces, Georgia, serif";
    ctx.fillText(sub, x + w / 2, y + h / 2 + 46);
    ctx.restore();
  }
  function makeCard() {
    var W = 1080, H = 1920;
    var cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    var ctx = cv.getContext("2d");
    var bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
    bg.addColorStop(0, "#12151c"); bg.addColorStop(0.6, "#1a2030"); bg.addColorStop(1, "#152018");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    var glow = ctx.createRadialGradient(220, 120, 0, 220, 120, 900);
    glow.addColorStop(0, "rgba(201,162,39,.28)"); glow.addColorStop(1, "rgba(201,162,39,0)");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center";
    ctx.fillStyle = "#c9a227";
    ctx.font = "700 40px 'DM Sans', sans-serif";
    ctx.fillText("M Y   F O G", W / 2, 230);
    /* the art */
    var img = new Image();
    var art = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="600" height="480"><g fill="none" stroke="#c9a227" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">' +
      mine.art.replace(/class="soft"/g, 'stroke="#f4f1ea" opacity=".55"') + "</g></svg>";
    return new Promise(function (resolve) {
      img.onload = function () { ctx.drawImage(img, (W - 600) / 2, 300, 600, 480); resolve(); };
      img.onerror = function () { resolve(); };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(art);
    }).then(function () {
      ctx.fillStyle = "#f4f1ea";
      ctx.font = "700 128px Fraunces, Georgia, serif";
      var y = wrap(ctx, mine.name, W / 2, 940, 940, 132);
      ctx.fillStyle = "rgba(244,241,234,.75)";
      ctx.font = "500 46px 'DM Sans', sans-serif";
      y = wrap(ctx, mine.fog + ".", W / 2, y + 20, 880, 60);
      ctx.fillStyle = "#c9a227";
      ctx.font = "700 48px 'DM Sans', sans-serif";
      ctx.fillText("My move: " + mine.game + " · " + mine.mins + " min", W / 2, y + 70);
      drawTicket(ctx, 250, 1420, 580, 200, "SPARE TICKET", "for whenever");
      ctx.fillStyle = "#f4f1ea";
      ctx.font = "600 56px Fraunces, Georgia, serif";
      ctx.fillText("What's your fog?", W / 2, 1760);
      ctx.fillStyle = "rgba(244,241,234,.6)";
      ctx.font = "700 32px 'DM Sans', sans-serif";
      ctx.fillText("LUMEN  ·  miss a day, you're still in", W / 2, 1830);
      return new Promise(function (r) { cv.toBlob(function (b) { r({ blob: b, url: cv.toDataURL("image/png") }); }, "image/png"); });
    });
  }
  var cardBlob = null;
  function showCard() {
    show("b-card");
    var wrapEl = $("#card-wrap");
    var ready = document.fonts && document.fonts.load ? Promise.all([document.fonts.load("700 64px Fraunces"), document.fonts.load("700 32px 'DM Sans'")]).catch(function () {}) : Promise.resolve();
    ready.then(makeCard).then(function (r) {
      cardBlob = r.blob;
      wrapEl.innerHTML = '<img src="' + r.url + '" alt="Your card: ' + mine.name + ", " + mine.game + ', with a spare ticket for a friend" />';
    });
  }
  function shareLink() {
    var u = new URL(location.href);
    u.search = "";
    u.hash = "";
    u.searchParams.set("f", mine.id);
    u.searchParams.set("a", answers.join(""));
    u.searchParams.set("t", "1");
    u.searchParams.set("via", "card");
    return u.href;
  }
  function download() {
    if (!cardBlob) return;
    var a = document.createElement("a");
    a.href = URL.createObjectURL(cardBlob);
    a.download = "my-fog-" + mine.id + ".png";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }
  $("#save").addEventListener("click", download);
  $("#send").addEventListener("click", function () {
    var btn = $("#send");
    var link = shareLink();
    var text = "My fog: " + mine.name + ". Here's a spare ticket, for whenever. What's yours?";
    var file = cardBlob && window.File ? new File([cardBlob], "my-fog.png", { type: "image/png" }) : null;
    var p;
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) p = navigator.share({ files: [file], text: text + " " + link });
    else if (navigator.share) p = navigator.share({ text: text, url: link });
    if (p) return void p.catch(function () { /* closed the sheet */ });
    (navigator.clipboard ? navigator.clipboard.writeText(text + " " + link) : Promise.reject()).then(function () {
      btn.textContent = "Link copied";
      setTimeout(function () { btn.textContent = "Send with a ticket"; }, 1800);
    }).catch(function () { window.prompt("Copy this link", link); });
  });
  $("#to-game").addEventListener("click", function () { showGame(); });

  /* ---------- 6. The 2-minute game (the reason to come back) ---------- */
  var timer = null, t0 = 0;
  function showGame() {
    $("#g-fog").textContent = mine.name;
    $("#g-name").textContent = mine.game;
    $("#g-steps").innerHTML = mine.steps.map(function (s) { return "<li>" + s + "</li>"; }).join("");
    $("#ring-t").textContent = "Start";
    $("#ring-fg").style.strokeDashoffset = "327";
    $("#done-line").hidden = true;
    $("#g-done").hidden = false;
    clearInterval(timer);
    timer = null;
    show("b-game");
  }
  /* counts up, never down: two minutes is a check-in */
  $("#ring").addEventListener("click", function () {
    if (timer) return;
    t0 = Date.now();
    timer = setInterval(function () {
      var s = Math.floor((Date.now() - t0) / 1000);
      $("#ring-t").textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
      $("#ring-fg").style.strokeDashoffset = String(327 * (1 - Math.min(1, s / 120)));
      if (s >= 120) checkedIn();
    }, 250);
  });
  function checkedIn() {
    clearInterval(timer);
    timer = null;
    $("#ring-fg").style.strokeDashoffset = "0";
    $("#ring-t").textContent = "✓";
    $("#done-line").hidden = false;
    $("#g-done").hidden = true;
  }
  $("#g-done").addEventListener("click", checkedIn);
  $("#restart").addEventListener("click", function () { setFog(1); saved = load(); paintAsk(); show("b-ask"); });

  /* ---------- go ---------- */
  paintAsk();

  /* ?shot=2..6 jumps to a beat with sample answers, for screenshots only */
  if (shot >= 2) {
    answers = SAMPLE.split("").map(Number);
    if (shot === 2) { i = 2; setFog(0.6); show("b-play"); paintCard(); }
    if (shot >= 3) { reveal(); }
    if (shot === 4) showTicket();
    if (shot === 45) { showTicket(); punch(); }
    if (shot === 5) { setFog(0); showCard(); }
    if (shot === 6) { setFog(0); showGame(); }
  }
  if (shot) {
    setTimeout(function () {
      var on = document.querySelector(".beat.is-on");
      var words = (on.innerText || "").split(/\s+/).filter(function (w) { return /[A-Za-z0-9]/.test(w); }).length;
      document.body.setAttribute("data-words", String(words)); document.body.setAttribute("data-vw", innerWidth + "x" + document.documentElement.scrollWidth);
    }, 3000);
  }
})();
