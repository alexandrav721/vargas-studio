/* The Pass: orders come in, you serve the right AI word.
   Learning design (ideas/skill-quest/ai-words-game/research-games.md): retrieval on every ticket, a new word is shown first
   and tested later in the same service, look-alike words from the same station as the other tiles, misses name the
   difference and come back 3 tickets later, progress is saved in the same memory as the Plain words dictionary (mem.js).
   No clock, no lives, nothing taken away. Sound off by default. Motion numbers from research-motion.md. */
(function () {
  "use strict";
  var M = window.EZMAP, B = window.BKM;
  if (!M || !B) return;
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function slug(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, "-"); }
  function lessonHref(w) { var lv = w[6] || 2; return lv === 2 ? "../school/kitchen/lesson-" + w[4] + ".html" : "../school/level-" + lv + "/lesson-" + w[4] + ".html"; }

  /* ---------- sound (Web Audio only, off until you turn it on) ---------- */
  var SKEY = "ez.pass.sound", sndOn = false, ac = null, master = null;
  try { sndOn = localStorage.getItem(SKEY) === "on"; } catch (e) {}
  function audio() { if (!ac) { var A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ac = new A(); master = ac.createGain(); master.gain.value = 0.25; master.connect(ac.destination); } if (ac.state === "suspended") ac.resume(); return ac; }
  function tone(type, f0, f1, at, a, d, g, t0, lp) {
    var o = ac.createOscillator(), v = ac.createGain(), t = ac.currentTime + (t0 || 0) + 0.01, out = v;
    o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + at);
    v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(g, t + a / 1000); v.gain.exponentialRampToValueAtTime(0.001, t + (a + d) / 1000);
    o.connect(v);
    if (lp) { var f = ac.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = lp; v.connect(f); out = f; }
    out.connect(master); o.start(t); o.stop(t + (a + d) / 1000 + 0.05);
  }
  var PENTA = [0, 2, 4, 7, 9, 12];
  var SND = {
    tap: function () { tone("sine", 880, 660, 0.03, 2, 40, 0.3); },
    lift: function () { tone("triangle", 440, 520, 0.06, 5, 70, 0.2); },
    right: function () { tone("triangle", 660, 0, 0, 5, 120, 0.35); tone("triangle", 990, 0, 0, 5, 120, 0.35, 0.07); },
    wrong: function () { tone("triangle", 220, 165, 0.18, 10, 200, 0.25, 0, 900); },
    step: function (n) { var f = 523 * Math.pow(2, PENTA[Math.min(n, PENTA.length - 1)] / 12); tone("sine", f, 0, 0, 3, 110, 0.3, 0.16); tone("square", f * 2, 0, 0, 3, 110, 0.05, 0.16); },
    end: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone("sine", f, 0, 0, 5, i === 3 ? 600 : 250, 0.3, i * 0.09); }); }
  };
  function play(n, x) { if (!sndOn) return; try { if (audio()) SND[n](x); } catch (e) {} }
  function setSnd(v) { sndOn = v; try { localStorage.setItem(SKEY, v ? "on" : "off"); } catch (e) {} var b = $("snd"); b.setAttribute("aria-pressed", String(v)); b.setAttribute("aria-label", v ? "Sound on. Turn sound off" : "Sound off. Turn sound on"); if (v) play("tap"); }
  $("snd").onclick = function () { setSnd(!sndOn); };
  setSnd(sndOn);
  function buzz(ms) { try { if (navigator.vibrate && navigator.userActivation && navigator.userActivation.hasBeenActive) navigator.vibrate(ms); } catch (e) {} }

  /* ---------- building a service ---------- */
  var POOL = M.all(), N_WORDS = 6, MAX_NEW = 3;
  function mask(text, term) {
    var out = String(text), parts = [term].concat(term === "LLM" ? ["Large language model"] : []);
    parts.forEach(function (p) { out = out.replace(new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "s?", "gi"), "\u0000"); });
    return out;
  }
  function render(text) { return esc(text).replace(/\u0000/g, '<span class="blank" aria-label="blank"></span>'); }
  function kinds(w) {
    var k = ["meaning", "kitchen"];
    if (w[5] && mask(w[5], w[0]).indexOf("\u0000") >= 0) k.push("blank");
    return k;
  }
  var BEGIN = ["Model", "Prompt", "Token", "Context window", "Hallucination", "LLM", "System prompt", "Tool use", "Agent", "RAG", "Temperature", "Examples"];
  function roundRobin() { var Z = M.zones, out = [], i = 0, more = true; while (more) { more = false; Z.forEach(function (z) { if (z.words[i]) { out.push(z.words[i]); more = true; } }); i++; } return out; }
  function pickWords() {
    var all = B.all(), due = B.due(POOL), missFirst = due.filter(function (t) { return (all[t] || {}).res === "miss"; });
    var learning = shuffle(POOL.filter(function (t) { return B.seen(t) && !B.known(t) && due.indexOf(t) < 0; }));
    var fresh = BEGIN.concat(roundRobin()).filter(function (t, i, a) { return a.indexOf(t) === i && POOL.indexOf(t) >= 0 && !B.seen(t); });
    fresh = shuffle(fresh.slice(0, 4)).concat(fresh.slice(4)); /* basics first, from different stations */
    var pick = [], add = function (t) { if (pick.length < N_WORDS && pick.indexOf(t) < 0) pick.push(t); };
    missFirst.forEach(add); shuffle(due).forEach(add);
    var nNew = 0; fresh.forEach(function (t) { if (nNew < MAX_NEW && pick.length < N_WORDS - 1) { add(t); nNew++; } });
    learning.forEach(add);
    shuffle(POOL.filter(function (t) { return B.known(t); })).forEach(add);
    fresh.forEach(add);
    return pick;
  }
  function buildQueue(words) {
    var first = [], second = [];
    words.forEach(function (t) {
      var w = M.get(t), ks = shuffle(kinds(w));
      if (!B.seen(t)) { first.push({ t: t, kind: "new" }); second.push({ t: t, kind: ks[0] }); }
      else { first.push({ t: t, kind: ks[0] }); second.push({ t: t, kind: ks[1] || ks[0] }); }
    });
    first = shuffle(first); second = shuffle(second);
    if (second[0] && first[first.length - 1] && second[0].t === first[first.length - 1].t) second.push(second.shift());
    return first.concat(second);
  }

  /* ---------- state ---------- */
  var S = null;
  function newService() {
    var words = pickWords();
    S = { words: words, q: buildQueue(words), i: 0, served: 0, tips: 0, combo: 0, best: 0, missed: {}, requeued: {}, total: 0, busy: false, cur: null, tries: 0, before: {} };
    words.forEach(function (t) { S.before[t] = M.state(t); });
    S.total = S.q.length;
  }

  /* ---------- screens ---------- */
  function show(id) {
    ["s-start", "s-play", "s-end"].forEach(function (s) { $(s).classList.toggle("on", s === id); });
    document.body.classList.toggle("playing", id === "s-play");
    window.scrollTo(0, 0);
  }
  function mapLine() {
    var k = POOL.filter(B.known).length, l = POOL.filter(function (t) { return B.seen(t) && !B.known(t); }).length;
    $("mapline").textContent = "Your map: " + k + " of " + POOL.length + " words known" + (l ? " · " + l + " learning" : "");
    $("start").textContent = k || l ? "Start service" : "Start your first service";
  }

  /* ---------- tickets ---------- */
  var rail = $("rail"), tray = $("tray"), say = $("say");
  var LABEL = { meaning: "What it means", kitchen: "In the kitchen", blank: "Fill the blank", "new": "New on the menu" };
  function ticketHTML(tk, n) {
    var w = M.get(tk.t), q;
    if (tk.kind === "new") q = '<span class="term">' + esc(tk.t) + '</span>' + esc(w[2]);
    else if (tk.kind === "kitchen") q = "“" + render(mask(w[1], tk.t)) + "”";
    else if (tk.kind === "blank") q = "“" + render(mask(w[5], tk.t)) + "”";
    else q = render(mask(w[2], tk.t));
    return '<div class="tk"><span>Order ' + n + '</span><span class="ty">' + LABEL[tk.kind] + '</span></div><p class="q">' + q + "</p>" +
      (tk.kind === "new" ? '<p class="hint">Serve it to add it to your map. It comes back later in this service.</p>' : "") + '<span class="stamp">SERVED</span>';
  }
  function drawRail(enter) {
    rail.querySelectorAll(".ticket").forEach(function (t) { if (!t.classList.contains("leave")) t.remove(); });
    [2, 1, 0].forEach(function (k) {
      var tk = S.q[S.i + k]; if (!tk) return;
      var el = document.createElement("div");
      el.className = "ticket " + (k === 0 ? "front" : k === 1 ? "back" : "back2") + (tk.kind === "new" ? " new" : "") + (k === 0 && enter && !reduce ? " enter" : "");
      el.innerHTML = ticketHTML(tk, S.i + k + 1);
      if (k === 0) { el.id = "front"; el.setAttribute("aria-label", "Order " + (S.i + 1) + " of " + S.total); }
      rail.appendChild(el);
    });
    var tk = S.q[S.i], w = M.get(tk.t);
    say.textContent = "Order " + (S.i + 1) + ". " + LABEL[tk.kind] + ": " + (tk.kind === "new" ? tk.t + ". " + w[2] : $("front").querySelector(".q").textContent.replace(/\s+/g, " "));
    $("clock").style.width = Math.round(S.i / S.total * 100) + "%";
  }
  function distractors(t) {
    var z = M.zoneOf(t), same = z ? z.words.filter(function (x) { return x !== t && M.get(x); }) : [];
    var known = POOL.filter(function (x) { return x !== t && same.indexOf(x) < 0 && (B.seen(x) || S.words.indexOf(x) >= 0); });
    var rest = POOL.filter(function (x) { return x !== t && same.indexOf(x) < 0 && known.indexOf(x) < 0; });
    var out = shuffle(same).slice(0, 2).concat(shuffle(known)).concat(shuffle(rest));
    return out.filter(function (x, i) { return out.indexOf(x) === i; }).slice(0, 3);
  }
  function drawTray() {
    var tk = S.q[S.i], opts = shuffle([tk.t].concat(distractors(tk.t)));
    tray.innerHTML = opts.map(function (t, i) {
      return '<button type="button" class="tile' + (reduce ? "" : " deal") + (tk.kind === "new" && t === tk.t ? " glow" : "") + '" style="--d:' + i * 40 + 'ms" data-t="' + esc(t) + '"><span class="k" aria-hidden="true">' + (i + 1) + "</span>" + esc(t) + "</button>";
    }).join("");
    S.tries = 0; S.busy = false;
  }
  function start() {
    newService(); show("s-play"); play("tap");
    $("tips").querySelector("b").textContent = "0"; setCombo(0);
    drawRail(true); drawTray();
  }

  /* ---------- serving ---------- */
  function setCombo(n) {
    S.combo = n; S.best = Math.max(S.best, n);
    var c = $("combo");
    if (n >= 2) { c.innerHTML = "Rush <b>×" + Math.min(n, 9) + "</b>"; c.classList.add("on"); if (!reduce) { c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); } }
    else c.classList.remove("on");
    document.body.classList.toggle("rush", n >= 3);
  }
  function addTips(n, x, y) {
    S.tips += n; var b = $("tips").querySelector("b"); b.textContent = S.tips;
    if (!reduce) { b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); }
    var f = document.createElement("span"); f.className = "float"; f.textContent = "+" + n; f.style.left = x + "px"; f.style.top = y + "px";
    $("fx").appendChild(f); setTimeout(function () { f.remove(); }, 750);
  }
  function burst(x, y, color, n) {
    if (reduce) return;
    var fx = $("fx"), ps = [];
    for (var i = 0; i < n; i++) {
      var p = document.createElement("i"), a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, v = 2.2 + Math.random() * 2.6;
      p.style.background = i % 3 ? color : "#151411"; p.style.left = x + "px"; p.style.top = y + "px";
      fx.appendChild(p); ps.push({ el: p, x: 0, y: 0, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: Math.random() * 360 });
    }
    var t0 = performance.now(), life = 620;
    (function step(now) {
      var k = (now - t0) / life;
      ps.forEach(function (p) { p.vy += 0.16; p.x += p.vx; p.y += p.vy; p.r += 9; p.el.style.transform = "translate(" + p.x + "px," + p.y + "px) rotate(" + p.r + "deg)"; p.el.style.opacity = k < 0.6 ? 1 : Math.max(0, 1 - (k - 0.6) / 0.4); });
      if (k < 1) requestAnimationFrame(step); else ps.forEach(function (p) { p.el.remove(); });
    })(t0);
  }
  function shakeRail() {
    if (reduce || !rail.animate) return;
    rail.animate([{ transform: "translateX(0)" }, { transform: "translateX(4px)" }, { transform: "translateX(-2.4px)" }, { transform: "translateX(1.4px)" }, { transform: "translateX(0)" }], { duration: 180, easing: "ease-out" });
  }
  function serve(tile) {
    if (!S || S.busy || !tile || tile.classList.contains("miss")) return;
    var tk = S.q[S.i], front = $("front"), ok = tile.dataset.t === tk.t;
    S.busy = true;
    if (ok) {
      var first = S.tries === 0;
      if (tk.kind === "new") B.touch([tk.t]); else if (first) B.record(tk.t, true);
      setCombo(first ? S.combo + 1 : 0);
      var fr = front.getBoundingClientRect(), tr = tile.getBoundingClientRect(), cx = fr.left + fr.width / 2, cy = fr.top + fr.height * 0.55;
      var zone = M.zoneOf(tk.t), hue = zone ? zone.hue : "#C7391F";
      var land = function () {
        front.classList.add("served"); play("right"); if (S.combo >= 2) play("step", S.combo - 1); buzz(12);
        burst(cx, cy, hue, S.combo >= 5 ? 10 : 7);
        var mult = 1 + Math.min(Math.floor(S.combo / 3), 4) * 0.5;
        addTips(first ? Math.round(10 * mult) : 4, cx, fr.top + 20);
        if (S.combo && S.combo % 5 === 0) shakeRail();
        S.served++;
        say.textContent = "Served: " + tk.t + (S.combo >= 3 ? ". Rush times " + S.combo + "." : ".");
        setTimeout(next, reduce ? 300 : 460);
      };
      if (reduce) { tile.classList.add("glow"); land(); return; }
      setTimeout(function () { /* 40 ms hit pause, then the tile flies onto the ticket */
        tile.classList.remove("lift"); tile.classList.add("fly");
        var dx = cx - (tr.left + tr.width / 2), dy = cy - (tr.top + tr.height / 2);
        tile.style.transform = "translate(" + dx + "px," + dy + "px) scale(.55)"; tile.style.opacity = "0";
        setTimeout(land, 230);
      }, S.combo > 4 ? 0 : 40);
    } else {
      S.tries++;
      if (tk.kind !== "new" && S.tries === 1) { B.record(tk.t, false); S.missed[tk.t] = (S.missed[tk.t] || 0) + 1; requeue(tk); }
      setCombo(0); play("wrong");
      tile.classList.remove("lift"); tile.style.transform = "";
      if (!reduce) { tile.classList.add("shake"); front.classList.remove("wob"); void front.offsetWidth; front.classList.add("wob"); }
      setTimeout(function () { tile.classList.remove("shake"); tile.classList.add("miss"); }, reduce ? 0 : 320);
      var w = M.get(tk.t), pw = M.get(tile.dataset.t), h = front.querySelector(".hint");
      var look = tk.kind === "kitchen" ? w[2] : w[1].charAt(0).toLowerCase() + w[1].slice(1);
      var msg = "<b>That’s " + esc(tile.dataset.t) + "</b>" + (pw ? ": " + esc(pw[1].charAt(0).toLowerCase() + pw[1].slice(1)) : "") + ". Look for: " + esc(mask(look, tk.t).replace(/\u0000/g, "…")) + ".";
      if (!h) { h = document.createElement("p"); h.className = "hint"; front.insertBefore(h, front.querySelector(".stamp")); }
      h.innerHTML = msg;
      if (S.tries >= 2) tray.querySelectorAll(".tile").forEach(function (b) { if (b.dataset.t === tk.t) b.classList.add("glow"); });
      say.textContent = "That's " + tile.dataset.t + ". Try again.";
      S.busy = false;
    }
  }
  function requeue(tk) {
    if (S.requeued[tk.t]) return; S.requeued[tk.t] = 1;
    var w = M.get(tk.t), ks = kinds(w).filter(function (k) { return k !== tk.kind; });
    S.q.splice(Math.min(S.i + 3, S.q.length), 0, { t: tk.t, kind: shuffle(ks)[0] || tk.kind });
    S.total = S.q.length;
  }
  function next() {
    var front = $("front"); if (front) { front.id = ""; front.classList.add("leave"); setTimeout(function () { front.remove(); }, 320); }
    S.i++;
    if (S.i >= S.q.length) { $("clock").style.width = "100%"; setTimeout(end, reduce ? 200 : 420); return; }
    drawRail(true); drawTray();
  }

  /* ---------- drag (tap still works) ---------- */
  var drag = null;
  tray.addEventListener("pointerdown", function (e) {
    var t = e.target.closest(".tile"); if (!t || S.busy || t.classList.contains("miss")) return;
    drag = { t: t, x: e.clientX, y: e.clientY, lx: e.clientX, moved: false, id: e.pointerId };
    t.classList.add("press");
    try { t.setPointerCapture(e.pointerId); } catch (er) {}
  });
  tray.addEventListener("pointermove", function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 8) { drag.moved = true; drag.t.classList.remove("press"); drag.t.classList.add("lift"); play("lift"); }
    if (drag.moved) {
      var tilt = Math.max(-6, Math.min(6, (e.clientX - drag.lx) * 0.6)); drag.lx = e.clientX;
      drag.t.style.setProperty("--tilt", tilt + "deg");
      drag.t.style.transform = "translate(" + dx + "px," + dy + "px) scale(1.06) rotate(" + tilt + "deg)";
      var f = $("front"), r = f && f.getBoundingClientRect();
      if (f) f.classList.toggle("target", e.clientY < r.bottom + 10 && e.clientY > r.top - 20);
    }
  });
  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var d = drag; drag = null; d.t.classList.remove("press");
    var f = $("front"); if (f) f.classList.remove("target");
    if (!d.moved) { serve(d.t); return; }
    var r = f && f.getBoundingClientRect();
    if (f && e.type === "pointerup" && e.clientY < r.bottom + 10 && e.clientY > r.top - 20) serve(d.t);
    else { d.t.classList.remove("lift"); d.t.style.transform = ""; }
  }
  tray.addEventListener("pointerup", endDrag);
  tray.addEventListener("pointercancel", endDrag);
  tray.addEventListener("click", function (e) { if (e.detail === 0) serve(e.target.closest(".tile")); }); /* keyboard Enter/Space */
  document.addEventListener("keydown", function (e) {
    if (!$("s-play").classList.contains("on")) return;
    var n = +e.key; if (n >= 1 && n <= 4) { var b = tray.querySelectorAll(".tile")[n - 1]; if (b) { b.classList.add("press"); setTimeout(function () { b.classList.remove("press"); }, 90); serve(b); } }
  });

  /* ---------- end of service ---------- */
  function countUp(el, to) {
    if (reduce) { el.textContent = to; return; }
    var t0 = performance.now(); (function s(now) { var k = Math.min(1, (now - t0) / 600); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(s); })(t0);
  }
  function end() {
    show("s-end"); play("end");
    var missN = Object.keys(S.missed).length;
    $("endTitle").textContent = !missN ? "Clean service, chef." : S.served >= S.total - 2 ? "Nice work, chef." : "Good service.";
    countUp($("eServed"), S.served); countUp($("eTips"), S.tips); $("eBest").textContent = "×" + S.best;
    var up = S.words.filter(function (t) { return M.state(t) > S.before[t]; });
    var onMap = S.words.filter(function (t) { return M.state(t) > 0; });
    $("eLit").className = "lit up";
    $("eLit").innerHTML = "<h2>" + (up.length ? "New on your map" : "On your map") + '</h2><div class="chips">' + (up.length ? up : onMap).map(chip).join("") + "</div>" +
      "<p>A word turns solid on your map after you get it right on 2 different days.</p>";
    var miss = Object.keys(S.missed).sort(function (a, b) { return S.missed[b] - S.missed[a]; }).slice(0, 3);
    $("eMiss").className = "lit";
    $("eMiss").innerHTML = miss.length ? "<h2>Worth another look</h2><div class=\"chips\">" + miss.map(chip).join("") + "</div><p>These come first in your next service.</p>" : "";
    var ends = document.querySelector(".ends"), old = ends.querySelector(".learn"); if (old) old.remove();
    if (miss.length) { var w = M.get(miss[0]), a = document.createElement("a"); a.className = "go ghost learn"; a.href = lessonHref(w); a.textContent = "Learn “" + miss[0] + "” in its lesson"; ends.insertBefore(a, ends.children[1]); }
    try { localStorage.setItem("ez.pass.last", JSON.stringify({ d: B.today(), served: S.served })); } catch (e) {}
    setTimeout(function () { $("again").focus(); }, 50);
  }
  function chip(t) { return '<button type="button" data-peek="' + esc(t) + '">' + esc(t) + "</button>"; }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-peek]"), pk = $("peek");
    if (b) {
      var t = b.dataset.peek, w = M.get(t);
      pk.innerHTML = '<button type="button" class="x" aria-label="Close">×</button><h3>' + esc(t) + '</h3><p class="kk">In the kitchen: ' + esc(w[1]) + "</p><p>" + esc(w[2]) + "</p>" + (w[3] ? '<p><b>Not:</b> ' + esc(w[3].replace(/^not /i, "")) + "</p>" : "") +
        '<p><a href="../school/kitchen/glossary.html#' + slug(t) + '">Open in Plain words →</a></p>';
      pk.hidden = false; pk.querySelector(".x").focus(); return;
    }
    if (e.target.closest("#peek .x") || (!e.target.closest("#peek") && !pk.hidden)) pk.hidden = true;
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") $("peek").hidden = true; });

  $("start").onclick = start;
  $("again").onclick = start;
  mapLine();
})();
