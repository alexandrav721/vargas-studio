/* Planner and Book front door: flip 10 real pages → scratch to see your planner → print only your pages.
   Classic script (works from file:// too). Picks travel in the link: ?from=Sam&k=<base36 bitmask>&p=<letter>. */
(function () {
  "use strict";

  var PLANNERS = {
    S: { name: "The Stuck Starter", tag: "Games for when you just can't start.", color: "#e0583b", ink: "#e0583b", file: "01-stuck-starter" },
    G: { name: "The Goal Getter", tag: "Big goal. Small weekly moves.", color: "#1f3a8a", ink: "#2f5bd3", file: "02-goal-getter" },
    H: { name: "The Habit Builder", tag: "Small marks. Real change.", color: "#2f5d46", ink: "#3f7f5f", file: "03-habit-builder" },
    R: { name: "The Gentle Reset", tag: "Do less, on purpose.", color: "#43347a", ink: "#7353c0", file: "04-gentle-reset" },
    M: { name: "Move More", tag: "Every bit of movement counts.", color: "#0b5e60", ink: "#0d8587", file: "05-move-more" }
  };
  var ORDER = ["S", "G", "H", "R", "M"];
  // Same order as my-pages.html (generated from her planner builder). 0–9 are the game, 10–14 tiebreakers.
  var PAGES = [
    ["task-spinner", "S", "Task Spinner"], ["energy-dial", "R", "Energy dial"], ["habit-bingo", "H", "Habit bingo"],
    ["milestone-map", "G", "Milestone map"], ["workout-die", "M", "Workout die"], ["permission-slips", "R", "Permission slips"],
    ["dare-cards", "S", "Dare cards"], ["punch-cards", "H", "Punch cards"], ["personal-bests", "M", "Personal bests"],
    ["pull-tab", "G", "Progress pull-tab"], ["scratch-start", "S", "Scratch & Start"], ["worry-envelope", "R", "Worry envelope"],
    ["reward-ladder", "H", "Reward ladder"], ["week-view", "G", "12-week view"], ["session-meter", "M", "Session meter"]
  ].map(function (r, i) { return { i: i, id: r[0], p: r[1], title: r[2], img: "./play/pages/" + r[0] + ".jpg" }; });
  var ROUNDS = 10;
  var NAME_KEY = "plannerbook.name.v1";

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, reduced ? Math.min(ms, 60) : ms); }); };
  var coverSrc = function (L) { return "./downloads/" + PLANNERS[L].file + "-cover.png"; };
  function load(k) { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* this visit only */ } }
  function bits(m, n) { var c = 0; for (var i = 0; i < n; i += 1) if (m & (1 << i)) c += 1; return c; }

  /* A friend's picks arrive in the link. */
  var q = new URLSearchParams(location.search);
  var friend = (q.get("from") || "").replace(/[^\p{L}\p{N} .'-]/gu, "").trim().slice(0, 24);
  var friendMask = parseInt(q.get("k") || "", 36);
  if (isNaN(friendMask)) friendMask = 0;
  var friendPlanner = PLANNERS[(q.get("p") || "").toUpperCase()] ? q.get("p").toUpperCase() : "";
  var hasFriend = !!(q.get("k") && (friend || friendPlanner));
  var friendLabel = friend || "Your friend";

  /* ---------- 1. Arrive ---------- */
  var fan = $("#fan");
  ["G", "R", "S", "H", "M"].forEach(function (L, k) {
    var img = new Image();
    img.src = coverSrc(L);
    img.alt = "";
    img.width = 816; img.height = 1056;
    img.style.setProperty("--r", "0deg");
    img.style.zIndex = String(k === 2 ? 5 : 3 - Math.abs(2 - k));
    fan.appendChild(img);
  });
  setTimeout(function () {
    $$("#fan img").forEach(function (img, k) { img.style.setProperty("--r", (k - 2) * 11 + "deg"); });
  }, reduced ? 0 : 250);
  if (hasFriend) {
    $("#boot-ask").textContent = friendLabel + " kept " + bits(friendMask, ROUNDS) + " pages.";
    $("#boot-sub").textContent = "Which would you keep?";
    $("#go").textContent = "Play";
  }

  function show(id) {
    $$(".beat").forEach(function (b) { b.classList.toggle("is-on", b.id === id); });
    window.scrollTo(0, 0);
  }

  /* ---------- 2. Flip: keep or skip ---------- */
  var mask = 0;
  var at = 0;
  var busy = false;

  function start() {
    mask = 0; at = 0; busy = false;
    $("#kept").innerHTML = "";
    document.body.classList.remove("is-scratched");
    show("beat-play");
    paint();
    var first = $(".ans--keep");
    if (first) first.focus({ preventScroll: true });
  }
  $("#go").addEventListener("click", start);

  function cardHtml(pg) {
    var sticker = hasFriend && (friendMask & (1 << pg.i)) ? '<b class="sticker">' + esc(friendLabel) + " kept this</b>" : "";
    return '<div class="pcard"><img src="' + pg.img + '" alt="' + esc(pg.title) + ' page, from ' + esc(PLANNERS[pg.p].name) +
      '" draggable="false" />' + sticker + "</div>";
  }
  function esc(v) {
    return String(v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function paint() {
    var pg = PAGES[at];
    $("#play-count").textContent = at + 1 + " of " + ROUNDS;
    var under = at + 1 < ROUNDS ? '<div class="pcard pcard--under" aria-hidden="true"><img src="' + PAGES[at + 1].img + '" alt="" /></div>' : "";
    $("#deck").innerHTML = under + cardHtml(pg);
    if (PAGES[at + 2] && at + 2 < ROUNDS) new Image().src = PAGES[at + 2].img;
    bindSwipe($("#deck .pcard:last-child"));
  }

  function answer(kind) {
    if (busy || at >= ROUNDS) return;
    busy = true;
    var pg = PAGES[at];
    if (kind === "keep") {
      mask |= 1 << pg.i;
      var t = new Image();
      t.src = pg.img; t.alt = "";
      $("#kept").appendChild(t);
    }
    var card = $("#deck .pcard:last-child");
    if (card) { card.style.transform = ""; card.classList.add("out--" + kind); }
    wait(260).then(function () {
      at += 1;
      busy = false;
      if (at < ROUNDS) paint(); else tally();
    });
  }
  $$("[data-ans]").forEach(function (b) { b.addEventListener("click", function () { answer(b.dataset.ans); }); });
  document.addEventListener("keydown", function (e) {
    if (!$("#beat-play").classList.contains("is-on")) return;
    if (e.key === "ArrowRight" || e.key === "k" || e.key === "K") { e.preventDefault(); answer("keep"); }
    if (e.key === "ArrowLeft" || e.key === "s" || e.key === "S") { e.preventDefault(); answer("skip"); }
  });

  function bindSwipe(card) {
    if (!card) return;
    var x0 = null;
    card.addEventListener("pointerdown", function (e) {
      x0 = e.clientX;
      card.setPointerCapture(e.pointerId);
      card.classList.add("is-drag");
    });
    card.addEventListener("pointermove", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0;
      card.style.transform = "translateX(" + dx + "px) rotate(" + dx / 20 + "deg)";
      card.dataset.lean = dx > 40 ? "keep" : dx < -40 ? "skip" : "";
    });
    function end(e) {
      if (x0 === null) return;
      var dx = e.clientX - x0;
      x0 = null;
      card.classList.remove("is-drag");
      if (dx > 90) answer("keep");
      else if (dx < -90) answer("skip");
      else { card.style.transform = ""; card.dataset.lean = ""; }
    }
    card.addEventListener("pointerup", end);
    card.addEventListener("pointercancel", end);
  }

  /* ---------- 2b. Score, maybe a tiebreaker ---------- */
  var result = "R";
  function tally() {
    var score = {};
    ORDER.forEach(function (L) { score[L] = 0; });
    PAGES.slice(0, ROUNDS).forEach(function (pg) { if (mask & (1 << pg.i)) score[pg.p] += 1; });
    var top = Math.max.apply(null, ORDER.map(function (L) { return score[L]; }));
    var tied = ORDER.filter(function (L) { return score[L] === top; });
    if (top === 0) { result = "R"; reveal(); return; }
    if (tied.length === 1) { result = tied[0]; reveal(); return; }
    var pair = tied.slice(0, 2).map(function (L) {
      return PAGES.filter(function (pg) { return pg.i >= ROUNDS && pg.p === L; })[0];
    });
    $("#tie").innerHTML = pair.map(function (pg) {
      return '<button type="button" data-tie="' + pg.i + '"><img src="' + pg.img + '" alt="" />' + esc(pg.title) + "</button>";
    }).join("");
    $$("[data-tie]").forEach(function (b) {
      b.addEventListener("click", function () {
        var pg = PAGES[Number(b.dataset.tie)];
        mask |= 1 << pg.i;
        result = pg.p;
        reveal();
      });
    });
    show("beat-tie");
    $("[data-tie]").focus({ preventScroll: true });
  }

  /* ---------- 3. Reveal: scratch the foil ---------- */
  var foil = $("#foil");
  var ctx = null;
  var scratched = false;
  var moves = 0;

  function reveal() {
    var P = PLANNERS[result];
    var kept = bits(mask, PAGES.length);
    show("beat-reveal");
    scratched = false;
    document.body.classList.remove("is-scratched");
    $("#after").hidden = true;
    $("#scratch").hidden = false;
    document.documentElement.style.setProperty("--accent", P.ink);
    $("#cover").src = coverSrc(result);
    $("#cover").alt = P.name + " cover";
    $("#reveal-lead").textContent = kept ? "Your " + kept + (kept === 1 ? " page belongs to…" : " pages belong to…") : "You skipped every page. Fair.";
    $("#reveal-name").textContent = P.name;
    $("#reveal-tag").textContent = P.tag;
    $("#pdf").href = "./downloads/" + P.file + ".pdf";
    var who = $("#who");
    who.value = load(NAME_KEY);
    paintName();
    var fr = $("#reveal-friend");
    if (hasFriend) {
      var same = bits(mask & friendMask & ((1 << ROUNDS) - 1), ROUNDS);
      fr.textContent = "You and " + friendLabel + ": " + same + " same " + (same === 1 ? "page" : "pages") + "." +
        (friendPlanner ? " " + friendLabel + " got " + PLANNERS[friendPlanner].name.replace(/^The /, "") + "." : "");
      fr.hidden = false;
    } else fr.hidden = true;
    requestAnimationFrame(paintFoil);
  }

  function paintFoil() {
    var r = foil.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    foil.width = Math.max(1, Math.round(r.width * dpr));
    foil.height = Math.max(1, Math.round(r.height * dpr));
    foil.classList.remove("is-gone");
    ctx = foil.getContext("2d");
    var w = foil.width, h = foil.height;
    ctx.globalCompositeOperation = "source-over";
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#e4e6e8"); g.addColorStop(0.45, "#a9afb4"); g.addColorStop(0.55, "#c9cdd1"); g.addColorStop(1, "#8e959b");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    for (var k = 0; k < 900; k += 1) { // flecks
      ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,.35)" : "rgba(60,64,68,.18)";
      ctx.fillRect(Math.random() * w, Math.random() * h, 2 * dpr, 2 * dpr);
    }
    ctx.fillStyle = "rgba(38,35,31,.55)";
    ctx.textAlign = "center";
    ctx.font = "700 " + Math.round(w * 0.13) + "px Fredoka, system-ui, sans-serif";
    ctx.fillText("SCRATCH", w / 2, h * 0.47);
    ctx.font = "600 " + Math.round(w * 0.1) + "px Caveat, cursive";
    ctx.fillText("with your finger", w / 2, h * 0.58);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.lineWidth = w * 0.14;
  }

  var last = null;
  function pt(e) {
    var r = foil.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (foil.width / r.width), y: (e.clientY - r.top) * (foil.height / r.height) };
  }
  function line(a, b) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x + 0.1, b.y); ctx.stroke(); }
  foil.addEventListener("pointerdown", function (e) {
    if (scratched || !ctx) return;
    foil.setPointerCapture(e.pointerId);
    last = pt(e);
    line(last, last);
  });
  foil.addEventListener("pointermove", function (e) {
    if (!last || scratched) return;
    var p = pt(e);
    line(last, p);
    last = p;
    moves += 1;
    if (moves % 8 === 0 && cleared() > 0.45) done();
  });
  ["pointerup", "pointercancel"].forEach(function (t) {
    foil.addEventListener(t, function () { last = null; if (!scratched && ctx && cleared() > 0.45) done(); });
  });
  function cleared() {
    var w = foil.width, h = foil.height, clear = 0, n = 0;
    var data = ctx.getImageData(0, 0, w, h).data;
    for (var y = h * 0.05; y < h; y += h / 24) {
      for (var x = w * 0.05; x < w; x += w / 18) {
        n += 1;
        if (data[(Math.floor(y) * w + Math.floor(x)) * 4 + 3] < 40) clear += 1;
      }
    }
    return clear / n;
  }

  $("#scratch").addEventListener("click", function () {
    if (scratched) return;
    if (reduced || !ctx) { done(); return; }
    // the button scratches for you, in zigzags
    var w = foil.width, h = foil.height, rows = 7, k = 0;
    var path = [];
    for (var r = 0; r <= rows; r += 1) {
      var y = (h * r) / rows;
      path.push({ x: r % 2 ? w * 1.05 : -w * 0.05, y: y });
    }
    var prev = { x: -w * 0.05, y: 0 };
    (function step() {
      if (k >= path.length || scratched) { done(); return; }
      line(prev, path[k]); prev = path[k]; k += 1;
      setTimeout(step, 90);
    })();
  });

  function done() {
    if (scratched) return;
    scratched = true;
    foil.classList.add("is-gone");
    $("#reveal-lead").textContent = "It's you:";
    document.body.classList.add("is-scratched");
    $("#scratch").hidden = true;
    $("#after").hidden = false;
    updateLinks();
    var nm = $("#reveal-name");
    nm.setAttribute("tabindex", "-1");
    nm.focus({ preventScroll: true });
  }

  /* ---------- Make it theirs: the cover's "belongs to" line ---------- */
  function cleanName() { return $("#who").value.replace(/[<>]/g, "").trim().slice(0, 24); }
  function paintName() { $("#ticket-name").textContent = cleanName(); }
  $("#who").addEventListener("input", function () { paintName(); store(NAME_KEY, cleanName()); updateLinks(); });

  function updateLinks() {
    var n = cleanName();
    var u = "./my-pages.html?k=" + mask.toString(36) + "&p=" + result + (n ? "&n=" + encodeURIComponent(n) : "");
    $("#print").href = u;
  }
  function friendLink() {
    var n = cleanName();
    var u = new URL("play.html", location.href);
    u.search = "";
    if (n) u.searchParams.set("from", n);
    u.searchParams.set("k", (mask & ((1 << ROUNDS) - 1)).toString(36));
    u.searchParams.set("p", result);
    return u.toString();
  }
  function toast(t) {
    var el = $("#toast");
    el.textContent = t;
    setTimeout(function () { if (el.textContent === t) el.textContent = ""; }, 3500);
  }

  /* ---------- Share: friend link + card ---------- */
  $("#send").addEventListener("click", function () {
    var url = friendLink();
    var text = "I'm " + PLANNERS[result].name + ". Which planner are you?";
    if (navigator.share) {
      navigator.share({ title: "Which planner are you?", text: text, url: url }).catch(function () {});
      return;
    }
    var copy = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(url) : Promise.reject();
    copy.then(function () { toast("Link copied. Send it to a friend."); }, function () { window.prompt("Copy this link:", url); });
  });

  function loadImg(src) {
    return new Promise(function (res) {
      var i = new Image();
      i.onload = function () { res(i); };
      i.onerror = function () { res(null); };
      i.src = src;
    });
  }
  function roundRect(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  function makeCard() {
    var P = PLANNERS[result];
    var keptPages = PAGES.filter(function (pg) { return mask & (1 << pg.i); }).slice(0, 4);
    var fontsReady = document.fonts && document.fonts.load ? Promise.all([
      document.fonts.load("600 80px Caveat"), document.fonts.load("700 80px Fredoka"), document.fonts.load("500 30px 'DM Sans'")
    ]).catch(function () {}) : Promise.resolve();
    return fontsReady.then(function () {
      return Promise.all([loadImg(coverSrc(result))].concat(keptPages.map(function (pg) { return loadImg(pg.img); })));
    }).then(function (imgs) {
      var cv = document.createElement("canvas");
      cv.width = 1080; cv.height = 1920;
      var c = cv.getContext("2d");
      c.fillStyle = P.color; c.fillRect(0, 0, 1080, 1920);
      c.fillStyle = "rgba(255,255,255,.08)";
      for (var y = 0; y < 1920; y += 36) for (var x = 0; x < 1080; x += 36) c.fillRect(x, y, 4, 4);
      c.fillStyle = "#fff"; c.textAlign = "center";
      c.font = "700 44px 'DM Sans', sans-serif";
      c.fillText("MY PLANNER", 540, 150);
      var cw = 640, ch = Math.round(cw * 1056 / 816), cx = 220, cy = 200;
      c.save(); c.shadowColor = "rgba(0,0,0,.35)"; c.shadowBlur = 40; c.shadowOffsetY = 16;
      roundRect(c, cx, cy, cw, ch, 14); c.fillStyle = "#fff"; c.fill(); c.restore();
      if (imgs[0]) { c.save(); roundRect(c, cx, cy, cw, ch, 14); c.clip(); c.drawImage(imgs[0], cx, cy, cw, ch); c.restore(); }
      c.save(); c.strokeStyle = "rgba(255,255,255,.7)"; c.lineWidth = 4; roundRect(c, cx, cy, cw, ch, 14); c.stroke(); c.restore();
      var n = cleanName();
      if (n) {
        c.textAlign = "left"; c.fillStyle = "#fff"; c.font = "600 46px Caveat, cursive";
        c.fillText(n, cx + cw * 0.37, cy + ch * 0.948, cw * 0.56);
      }
      var tw = 190, th = Math.round(tw * 1056 / 816), ty = 1110, n4 = imgs.length - 1;
      var startX = 540 - (n4 * tw + (n4 - 1) * 24) / 2;
      imgs.slice(1).forEach(function (im, k) {
        if (!im) return;
        var x = startX + k * (tw + 24);
        c.save(); c.translate(x + tw / 2, ty + th / 2); c.rotate(((k % 2 ? 1 : -1) * 3 * Math.PI) / 180);
        c.shadowColor = "rgba(0,0,0,.3)"; c.shadowBlur = 18; c.drawImage(im, -tw / 2, -th / 2, tw, th); c.restore();
      });
      c.textAlign = "center"; c.fillStyle = "#fff";
      if (n4 > 0) { c.font = "600 54px Caveat, cursive"; c.fillText("the pages I kept", 540, ty + th + 80); }
      c.font = "700 84px Fredoka, sans-serif";
      c.fillText("Which planner", 540, 1660);
      c.fillText("are you?", 540, 1755);
      c.font = "500 34px 'DM Sans', sans-serif"; c.fillStyle = "rgba(255,255,255,.8)";
      c.fillText("Planner and Book · Vargas Studio", 540, 1850);
      return new Promise(function (res) { cv.toBlob(function (b) { res(b); }, "image/png"); });
    });
  }
  $("#save").addEventListener("click", function () {
    makeCard().then(function (blob) {
      if (!blob) { toast("Couldn't make the card here."); return; }
      var file = typeof File === "function" ? new File([blob], "my-planner.png", { type: "image/png" }) : null;
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: "My planner" }).catch(function () {});
        return;
      }
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "my-planner.png";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      toast("Card saved.");
    }).catch(function () { toast("Couldn't make the card here."); });
  });
  // exposed for the share-card mock and checks
  window.__plannerCard = { makeCard: makeCard, set: function (m, r) { mask = m; result = r; } };

  $("#again").addEventListener("click", start);
})();
