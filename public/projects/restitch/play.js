/* Restitch front door: find → kit → the read → your pattern envelope → pick a view → ask a friend.
   Classic script (works from file:// and from Vite's public/). Uses RestitchEngine (play/engine.js),
   the same read and recipes as the full planner (/restitch.html). Nothing leaves the browser:
   a friend's link carries the find id or the read numbers, never the photo. */
(function () {
  "use strict";
  var E = window.RestitchEngine;
  var FINDS = window.RESTITCH_FINDS || [];
  var PICKS_KEY = "restitch.play.picks.v1";
  var INK = "#2A211A", RED = "#B23A22", BLUE = "#2F5D8A", SHEET = "#FBF5EA", TISSUE = "#EFE3CF", MUTED = "#6B5644", LINE = "#D8C7AA";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, reduced ? Math.min(ms, 80) : ms); }); };
  function load(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* this visit only */ } }

  /* ---------- Drawings: flat sketches per shape, in the find's own color ---------- */
  var FAM = {
    column: {
      name: "Long column",
      path: "M45 12Q60 22 75 12L84 16 82 40Q78 56 80 70L96 150H24L40 70Q42 56 38 40L36 16Z",
      waist: [40, 80, 68], hem: [24, 96, 150], neck: [46, 74, 15], shoulder: [[39, 15], [81, 15]], cuff: [[39, 15], [81, 15]]
    },
    "wide-layer": {
      name: "Wide layer",
      path: "M48 30Q60 38 72 30L88 34 114 74 102 84 84 62V124H36V62L18 84 6 74 32 34Z",
      waist: [36, 84, 96], hem: [36, 84, 124], neck: [48, 72, 32], shoulder: [[34, 34], [86, 34]], cuff: [[12, 79], [108, 79]]
    },
    "square-knit": {
      name: "Square top",
      path: "M46 18Q60 28 74 18L94 26 106 50 92 56 86 46V136H34V46L28 56 14 50 26 26Z",
      waist: [34, 86, 96], hem: [34, 86, 136], neck: [46, 74, 20], shoulder: [[30, 24], [90, 24]], cuff: [[21, 53], [99, 53]]
    },
    "dark-structured": {
      name: "Dark boxy piece",
      path: "M44 14L60 40 76 14 92 20 104 120 90 122 86 60V132H34V60L30 122 16 120 28 20Z",
      extra: "M44 14L52 62 60 40 68 62 76 14M60 62V132",
      waist: [34, 86, 88], hem: [34, 86, 132], neck: [44, 76, 14], shoulder: [[30, 19], [90, 19]], cuff: [[23, 121], [97, 121]]
    },
    "soft-mid": {
      name: "Everyday piece",
      path: "M46 14L60 22 74 14 90 20 104 110 92 112 84 56V132H36V56L28 112 16 110 30 20Z",
      extra: "M46 14L53 28 60 22 67 28 74 14M60 22V132",
      waist: [36, 84, 86], hem: [36, 84, 132], neck: [46, 74, 16], shoulder: [[32, 19], [88, 19]], cuff: [[22, 111], [98, 111]]
    }
  };
  var MOTIF = {
    "wide-cool-snaps": "cuff", "wide-warm-knot": "knot", "wide-fringe-hand": "fringe", "wide-channel": "channel",
    "wide-bartack": "bartack", "wide-peplum": "peplum", "wide-hand-roll": "hemline",
    "column-warm-tie": "shoulderknots", "column-cool-drape": "drape", "column-blind-hem": "shorten", "column-vent": "vent",
    "column-stay": "waist", "column-pick-facing": "neck",
    "knit-warm-knot": "hemknot", "knit-cool-flash": "drape", "knit-gather": "neck", "knit-boat": "neck", "knit-dart": "dart",
    "knit-hand-stay": "shoulderline",
    "dark-roll": "cuff", "dark-sashiko": "sashiko", "dark-bartack-hand": "bartack", "dark-nip": "waist", "dark-machine-hem": "hemline",
    "soft-belt": "belt", "soft-side-hand": "waist", "soft-hem-machine": "hemline", "soft-gore": "gore", "soft-pick-hem": "hemline"
  };
  function bow(x, y, s) {
    return '<path d="M' + (x - 1.5) + " " + y + "q" + -10 * s + " " + -8 * s + " " + -10 * s + " 0q0 " + 8 * s + " " + 10 * s + " 0M" + (x + 1.5) + " " + y +
      "q" + 10 * s + " " + -8 * s + " " + 10 * s + " 0q0 " + 8 * s + " " + -10 * s + " 0M" + (x - 1) + " " + (y + 1) + "l" + -5 * s + " " + 14 * s +
      "M" + (x + 1) + " " + (y + 1) + "l" + 5 * s + " " + 14 * s + '"/><circle cx="' + x + '" cy="' + y + '" r="' + 2.2 * s + '" fill="' + RED + '"/>';
  }
  function motif(kind, F) {
    var cx = 60, wy = F.waist[2], hy = F.hem[2], w0 = F.waist[0], w1 = F.waist[1], h0 = F.hem[0], h1 = F.hem[1];
    var at = function (t) { return [w0 + (h0 - w0) * t, w1 + (h1 - w1) * t, wy + (hy - wy) * t]; };
    var dash = ' stroke-dasharray="4 3"';
    var o = "";
    switch (kind) {
      case "shorten": {
        var p = at(0.5);
        o = '<path d="M' + (p[0] - 3) + " " + p[2] + "H" + (p[1] + 3) + '"' + dash + ' stroke-width="2"/>' +
          '<path d="M' + p[0] + " " + p[2] + "L" + h0 + " " + hy + "H" + h1 + "L" + p[1] + " " + p[2] + 'Z" fill="' + TISSUE + '" fill-opacity=".72" stroke="none"/>' +
          '<path d="M60 ' + (hy - 6) + "V" + (p[2] + 6) + "M56 " + (p[2] + 11) + "l4 -5 4 5" + '"/>';
        break;
      }
      case "hemline":
        o = '<path d="M' + (h0 + 2) + " " + (hy - 5) + "H" + (h1 - 2) + '" stroke-dasharray="2.5 2.5" stroke-width="2"/>';
        break;
      case "vent":
        o = '<path d="M60 ' + hy + "V" + (hy - 30) + '" stroke-width="2"/><path d="M53 ' + hy + "L60 " + (hy - 12) + " 67 " + hy + '" fill="' + TISSUE + '"/>' +
          '<path d="M57 ' + (hy - 30) + "h6" + '" stroke-width="3"/>';
        break;
      case "knot":
        o = '<path d="M' + w0 + " " + (wy + 4) + "H" + w1 + '"' + dash + "/>" + bow(cx, wy + 4, 1);
        break;
      case "belt":
        o = '<path d="M' + w0 + " " + (wy - 3) + "H" + w1 + "M" + w0 + " " + (wy + 4) + "H" + w1 + '" stroke-width="1.6"/><rect x="54" y="' + (wy - 5) +
          '" width="12" height="11" fill="' + SHEET + '" stroke-width="1.8"/>';
        break;
      case "shoulderknots":
        o = bow(F.shoulder[0][0], F.shoulder[0][1] + 2, 0.7) + bow(F.shoulder[1][0], F.shoulder[1][1] + 2, 0.7);
        break;
      case "hemknot":
        o = bow(h1 - 10, hy - 4, 0.8);
        break;
      case "drape":
        o = '<path d="M' + (F.neck[0] - 6) + " " + (F.neck[2] + 2) + "Q" + cx + " " + (wy - 30) + " " + (w1 + 2) + " " + (wy - 4) + '"' + dash + ' stroke-width="2"/>' +
          '<circle cx="' + (F.neck[0] - 6) + '" cy="' + (F.neck[2] + 3) + '" r="2.6" fill="' + RED + '"/>';
        break;
      case "waist":
        o = '<path d="M' + (w0 + 1) + " " + (wy - 26) + "Q" + (w0 + 9) + " " + wy + " " + (w0 + 1) + " " + (wy + 26) + "M" + (w1 - 1) + " " + (wy - 26) + "Q" + (w1 - 9) + " " + wy + " " + (w1 - 1) + " " + (wy + 26) + '"' + dash + ' stroke-width="2"/>';
        break;
      case "dart":
        o = '<path d="M44 ' + (wy - 30) + "L48 " + (wy - 10) + " 52 " + (wy - 30) + "M68 " + (wy - 30) + "L72 " + (wy - 10) + " 76 " + (wy - 30) + '"' + dash + ' stroke-width="1.8"/>';
        break;
      case "fringe": {
        for (var x = h0 + 3; x <= h1 - 2; x += 4) o += '<path d="M' + x + " " + hy + "v9" + '" stroke-width="1.4"/>';
        break;
      }
      case "channel":
        o = '<path d="M' + h0 + " " + (hy - 4) + "H" + h1 + "M" + h0 + " " + (hy - 11) + "H" + h1 + '" stroke-dasharray="2.5 2" stroke-width="1.6"/>' +
          '<path d="M' + (h0 + 8) + " " + (hy - 7) + "q-5 10 -2 20M" + (h1 - 8) + " " + (hy - 7) + 'q5 10 2 20" stroke-width="1.8"/>';
        break;
      case "bartack":
        [[cx - 15, wy + 6], [cx - 15, wy + 20], [cx + 15, wy + 6], [cx + 15, wy + 20]].forEach(function (q) {
          o += '<path d="M' + (q[0] - 3) + " " + (q[1] - 3) + "l6 6M" + (q[0] + 3) + " " + (q[1] - 3) + 'l-6 6" stroke-width="2"/>';
        });
        break;
      case "peplum":
        o = '<path d="M' + w0 + " " + wy + "H" + w1 + '" stroke-width="2"/>';
        for (var k = -2; k <= 2; k += 1) o += '<path d="M' + (cx + k * 9) + " " + wy + "L" + (cx + k * 12) + " " + hy + '"' + dash + "/>";
        break;
      case "neck":
        o = '<path d="M' + (F.neck[0] - 7) + " " + (F.neck[2] + 1) + "Q60 " + (F.neck[2] + 22) + " " + (F.neck[1] + 7) + " " + (F.neck[2] + 1) + '"' + dash + ' stroke-width="2"/>';
        break;
      case "shoulderline":
        o = '<path d="M' + F.neck[0] + " " + F.neck[2] + "L" + F.shoulder[0][0] + " " + F.shoulder[0][1] + "M" + F.neck[1] + " " + F.neck[2] + "L" + F.shoulder[1][0] + " " + F.shoulder[1][1] + '" stroke-dasharray="2 2" stroke-width="2.4"/>';
        break;
      case "cuff":
        F.cuff.forEach(function (c) { o += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="6" stroke-width="2.2" fill="none"/>'; });
        break;
      case "sashiko": {
        for (var sx = 0; sx < 3; sx += 1) for (var sy = 0; sy < 3; sy += 1) {
          var px = 64 + sx * 7, py = wy - 22 + sy * 7;
          o += '<path d="M' + (px - 2.5) + " " + py + "h5M" + px + " " + (py - 2.5) + 'v5" stroke-width="1.5"/>';
        }
        break;
      }
      case "gore":
        o = '<path d="M' + (h1 - 1) + " " + (hy - 30) + "L" + (h1 + 9) + " " + hy + "H" + (h1 - 7) + 'Z" fill="' + RED + '" fill-opacity=".18"' + dash + "/>";
        break;
      default:
        o = "";
    }
    return '<g fill="none" stroke="' + RED + '" stroke-linecap="round" stroke-linejoin="round">' + o + "</g>";
  }
  function flatSvg(family, color, recipeId, opts) {
    var F = FAM[family] || FAM["soft-mid"];
    opts = opts || {};
    var body = '<path d="' + F.path + '" fill="' + color + '" stroke="' + INK + '" stroke-width="1.5" stroke-linejoin="round"/>' +
      (F.extra ? '<path d="' + F.extra + '" fill="none" stroke="' + INK + '" stroke-width="1" stroke-opacity=".7"/>' : "");
    var grain = opts.grain ? '<path d="M60 ' + (F.neck[2] + 26) + "V" + (F.hem[2] - 14) + "M56 " + (F.neck[2] + 31) + "l4 -5 4 5M56 " + (F.hem[2] - 19) + 'l4 5 4 -5" fill="none" stroke="' + BLUE + '" stroke-width="1.2"/>' : "";
    var m = recipeId ? motif(MOTIF[recipeId], F) : "";
    var attrs = opts.attrs || 'aria-hidden="true"';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 162" ' + attrs + ">" + body + grain + m + "</svg>";
  }

  /* ---------- State ---------- */
  var state = { find: null, kit: null, views: null, pick: null, friendPick: null, friendMode: false };
  var KITS = {
    pins: { skill: "beginner", view: "A", label: "Safety pins" },
    needle: { skill: "intermediate", view: "B", label: "Needle & thread" },
    machine: { skill: "advanced", view: "C", label: "Sewing machine" }
  };
  var METHOD = { A: "no-sew", B: "hand", C: "machine" };
  var METHOD_LABEL = { A: "No-sew", B: "Hand", C: "Machine" };

  function show(id) {
    $$(".beat").forEach(function (b) { b.classList.toggle("is-on", b.id === id); });
    window.scrollTo(0, 0);
    var h = $("#" + id + " h1, #" + id + " h2");
    if (h) { h.setAttribute("tabindex", "-1"); try { h.focus({ preventScroll: true }); } catch (e) { /* old browser */ } }
  }
  function pctNum(n) { return Math.round(n * 100); }
  function patternNo(hex) { return hex.replace("#", "").slice(0, 4).toUpperCase(); }
  function findKey(f) { return f.own ? "own-" + f.stats.hex.slice(1) : f.id; }

  /* ---------- 1. Arrive: the rack ---------- */
  function paintRack() {
    $("#rack").innerHTML = FINDS.map(function (f) {
      return '<button class="hanger" type="button" data-find="' + esc(f.id) + '" aria-label="' + esc(f.name) + ' (sample)">' +
        '<img src="' + esc(f.file) + '" alt="" loading="eager" draggable="false" /></button>';
    }).join("");
    $$("#rack [data-find]").forEach(function (b) {
      b.addEventListener("click", function () {
        var f = FINDS.filter(function (x) { return x.id === b.dataset.find; })[0];
        pickFind({ id: f.id, name: f.name, src: f.file, credit: f.credit, stats: f.stats, own: false });
      });
    });
  }
  function pickFind(find) {
    state.find = find;
    $("#kit-find").innerHTML = find.src ? '<img src="' + esc(find.src) + '" alt="" />' : flatSvg(familyOf(find.stats), find.stats.hex);
    show("beat-kit");
  }

  /* Your own photo: read in the browser, never uploaded. */
  $("#own").addEventListener("change", function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var note = $("#find-note");
    var canvas = $("#work");
    E.analyzeOntoCanvas(file, canvas).then(function (stats) {
      var box = null;
      try { box = boxFrom(canvas); } catch (err) { box = null; }
      pickFind({ id: "own", name: "Your find", src: URL.createObjectURL(file), credit: null, stats: stats, box: box, own: true, live: true, photoAspect: canvas.width / canvas.height });
    }).catch(function () {
      note.textContent = "That file didn't open. Try a JPG or PNG.";
      note.classList.add("is-err");
    });
    e.target.value = "";
  });

  /* The same subject box the engine uses (pixels far from the corner color). */
  function boxFrom(canvas) {
    var w = canvas.width, h = canvas.height;
    var d = canvas.getContext("2d").getImageData(0, 0, w, h).data;
    var c = [[2, 2], [w - 3, 2], [2, h - 3], [w - 3, h - 3]].map(function (p) {
      var i = (Math.max(0, Math.min(h - 1, p[1])) * w + Math.max(0, Math.min(w - 1, p[0]))) * 4;
      return [d[i], d[i + 1], d[i + 2]];
    });
    var cr = 0, cg = 0, cb = 0;
    c.forEach(function (q) { cr += q[0] / 4; cg += q[1] / 4; cb += q[2] / 4; });
    var minX = w, minY = h, maxX = 0, maxY = 0, n = 0, all = 0;
    for (var y = 0; y < h; y += 1) for (var x = 0; x < w; x += 1) {
      var i = (y * w + x) * 4;
      if (d[i + 3] < 16) continue;
      all += 1;
      if (Math.hypot(d[i] - cr, d[i + 1] - cg, d[i + 2] - cb) < 28) continue;
      n += 1;
      if (x < minX) minX = x; if (y < minY) minY = y; if (x > maxX) maxX = x; if (y > maxY) maxY = y;
    }
    var fill = n / all;
    if (!(fill > 0.08 && fill < 0.97 && maxX > minX && maxY > minY)) return null;
    return { x: minX / w, y: minY / h, w: (maxX - minX + 1) / w, h: (maxY - minY + 1) / h };
  }
  function readSample(find) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        find.photoAspect = img.naturalWidth / img.naturalHeight;
        try {
          var canvas = $("#work");
          var sc = Math.min(1, 360 / Math.max(img.naturalWidth, img.naturalHeight));
          canvas.width = Math.max(1, Math.round(img.naturalWidth * sc));
          canvas.height = Math.max(1, Math.round(img.naturalHeight * sc));
          var ctx = canvas.getContext("2d", { willReadFrequently: true });
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          var px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          find.stats = E.statsFromPixels(find.id + ".jpg", canvas.width, canvas.height, px);
          find.box = boxFrom(canvas);
          find.live = true;
        } catch (e) { /* file:// blocks pixel reads: keep the stored read */ }
        resolve(find);
      };
      img.onerror = function () { resolve(find); };
      img.src = find.src;
    });
  }
  function familyOf(stats) { return E.familyOf({ aspectUsed: stats.aspectUsed, brightness: stats.brightness, saturation: stats.saturation }); }

  /* ---------- 2. Kit ---------- */
  $$("[data-kit]").forEach(function (b) {
    b.addEventListener("click", function () { state.kit = b.dataset.kit; runRead(); });
  });

  /* ---------- 3. The read (a little suspense) ---------- */
  function runRead() {
    var f = state.find;
    show("beat-read");
    var photo = $("#read-photo");
    var chips = $("#read-chips");
    chips.innerHTML = '<li class="chip chip--muted">Reading the photo…</li>';
    photo.innerHTML = f.src
      ? '<img src="' + esc(f.src) + '" alt="' + esc(f.name) + '" />'
      : flatSvg(familyOf(f.stats), f.stats.hex, null, { attrs: 'role="img" aria-label="Sketch of your friend\'s find"' });
    var ready = f.own || !f.src ? Promise.resolve(f) : readSample(f);
    ready.then(function () {
      var b = f.box || { x: 0.05, y: 0.04, w: 0.9, h: 0.92 };
      photo.insertAdjacentHTML("beforeend",
        '<i class="trace" aria-hidden="true" style="left:' + (b.x * 100).toFixed(1) + "%;top:" + (b.y * 100).toFixed(1) + "%;width:" + (b.w * 100).toFixed(1) +
        "%;height:" + (b.h * 100).toFixed(1) + '%"></i>');
      var s = f.stats;
      var fam = familyOf(s);
      var a = s.aspectUsed;
      var lines = [
        '<li class="chip"><i class="sw" style="background:' + esc(s.hex) + '"></i>' + esc(s.hex.toUpperCase()) + "</li>",
        '<li class="chip">' + pctNum(s.brightness) + "% bright</li>",
        '<li class="chip">' + (a >= 1 ? "Wide " : "Tall ") + a.toFixed(2) + "</li>",
        '<li class="chip chip--ink">' + esc(FAM[fam].name) + "</li>",
        '<li class="chip chip--muted">Can\'t see: fiber, size, the back</li>'
      ];
      var seq = Promise.resolve(wait(700));
      lines.forEach(function (html, i) {
        seq = seq.then(function () {
          if (i === 0) chips.innerHTML = "";
          chips.insertAdjacentHTML("beforeend", html);
          return wait(i === 3 ? 700 : 420);
        });
      });
      return seq.then(function () { return wait(900); });
    }).then(function () { buildViews(); paintEnvelope(); });
  }

  /* ---------- 4. Payoff: the envelope ---------- */
  function buildViews() {
    var f = state.find;
    var skill = KITS[state.kit].skill;
    var recs = E.recipesFor(statsForEngine(f.stats), skill);
    state.views = {};
    ["A", "B", "C"].forEach(function (L) {
      state.views[L] = recs.filter(function (r) { return r.method === METHOD[L]; })[0] ||
        E.RECIPES.filter(function (r) { return r.method === METHOD[L] && r.families.indexOf(familyOf(f.stats)) >= 0; })[0];
    });
  }
  function statsForEngine(s) {
    return { hue: s.hue, saturation: s.saturation, brightness: s.brightness, aspectUsed: s.aspectUsed, hex: s.hex };
  }
  function envelopeHtml(opts) {
    var f = state.find, s = f.stats, fam = familyOf(s);
    opts = opts || {};
    var cover = f.src
      ? '<img src="' + esc(f.src) + '" alt="' + esc(f.name) + '" />'
      : flatSvg(fam, s.hex, null, { grain: true, attrs: 'role="img" aria-label="Sketch in the find\'s color"' });
    var minis = ["A", "B", "C"].map(function (L) {
      var r = state.views[L];
      return '<div class="mini' + (state.pick === L ? " is-picked" : "") + '"><span class="mini-l">' + L + "</span>" + flatSvg(fam, s.hex, r && r.id) + "</div>";
    }).join("");
    var credit = f.credit ? "Photo: " + f.credit.author + " · " + f.credit.license : f.src ? "Your photo stays on this phone" : "Their photo stayed on their phone";
    return '<article class="env' + (opts.landing ? " is-landing" : "") + (f.src && f.photoAspect > 1.05 ? " env--wide" : "") + '" aria-label="Pattern envelope for ' + esc(f.name) + '">' +
      '<header class="env-top"><span class="env-brand">Restitch</span><span class="env-no" title="From its color ' + esc(s.hex.toUpperCase()) + '">No.&nbsp;' + patternNo(s.hex) + "</span></header>" +
      '<h3 class="env-title">' + esc(FAM[fam].name) + "</h3>" +
      '<div class="env-cover"><div class="env-photo">' + cover + '</div><div class="env-minis">' + minis + "</div></div>" +
      '<footer class="env-foot"><span>Size: your tape</span><span class="env-credit">' + (f.credit ? '<a href="' + esc(f.credit.source) + '" target="_blank" rel="noopener">' + esc(credit) + "</a>" : esc(credit)) + "</span></footer>" +
      '<b class="stamp">No-sew inside</b></article>';
  }
  function paintEnvelope() {
    state.pick = null;
    $("#env-wrap").innerHTML = envelopeHtml({ landing: true });
    var rec = KITS[state.kit].view;
    $("#views").innerHTML = ["A", "B", "C"].map(function (L) {
      var r = state.views[L];
      if (!r) return "";
      var mark = state.friendMode && state.friendPick === L ? '<em class="v-mark">their pick</em>' : !state.friendMode && rec === L ? '<em class="v-mark">your kit</em>' : "";
      return '<button class="view" type="button" data-view="' + L + '"><span class="v-l">' + L + '</span><span class="v-t"><b>' + METHOD_LABEL[L] + "</b> " + esc(r.title) + "</span>" + mark + "</button>";
    }).join("");
    $$("#views [data-view]").forEach(function (b) { b.addEventListener("click", function () { pickView(b.dataset.view); }); });
    var note = $("#friend-note");
    note.hidden = !state.friendMode;
    $("#env-ask").textContent = state.friendMode ? "Which would you make?" : "Which view?";
    if (state.friendMode) note.textContent = "A friend's find.";
    show("beat-env");
  }

  /* ---------- 5. Make it yours ---------- */
  function pickView(L) {
    state.pick = L;
    var picks = load(PICKS_KEY, {});
    picks[findKey(state.find) + ":" + state.kit] = L;
    save(PICKS_KEY, picks);
    var r = state.views[L];
    var fam = familyOf(state.find.stats);
    var skill = KITS[state.kit].skill;
    $("#view-big").innerHTML = flatSvg(fam, state.find.stats.hex, r.id);
    $("#view-tag").textContent = "View " + L + " · " + METHOD_LABEL[L];
    $("#view-title").textContent = r.title;
    var labels = {};
    (E.MEASURE_FIELDS || []).forEach(function (m) { labels[m.id] = m.label; });
    var ms = [];
    r.checklist.forEach(function (c) { if (c.measureId && ms.indexOf(labels[c.measureId]) < 0) ms.push(labels[c.measureId]); });
    $("#measure").innerHTML = '<span class="m-k">Tape</span> ' + esc(ms.concat(["the edge you'll change"]).join(" · "));
    $("#notions").innerHTML = "<b>You'll need:</b> " + esc(r.notions.join("; "));
    var steps = E.stepsFor(r, skill);
    $("#steps-sum").textContent = steps.length + " steps";
    $("#steps").innerHTML = steps.map(function (s) {
      return "<li>" + esc(s.text) + (s.href ? ' <a href="' + esc(s.href) + '" target="_blank" rel="noopener">' + esc(s.linkLabel || "How-to") + "</a>" : "") + "</li>";
    }).join("");
    $(".steps").open = false;
    var cmp = $("#compare");
    cmp.hidden = !state.friendPick;
    if (state.friendPick) {
      cmp.textContent = state.friendPick === L ? "You both picked " + L + "." : "They picked " + state.friendPick + ". You picked " + L + ".";
    }
    $("#send").textContent = state.friendMode ? "Send your pick" : "Ask a friend";
    $("#save").textContent = state.friendMode ? "Flip your own find" : "Save envelope";
    show("beat-view");
  }

  /* ---------- Share: link + card ---------- */
  function shareLink() {
    var u = new URL(location.href);
    u.search = "";
    u.hash = "";
    var f = state.find;
    if (f.own) {
      var s = f.stats;
      u.searchParams.set("c", s.hex.replace("#", ""));
      u.searchParams.set("a", s.aspectUsed.toFixed(2));
      u.searchParams.set("b", s.brightness.toFixed(2));
      u.searchParams.set("s", s.saturation.toFixed(2));
      u.searchParams.set("h", String(Math.round(s.hue)));
    } else {
      u.searchParams.set("f", f.id);
    }
    u.searchParams.set("k", state.kit);
    if (state.pick) u.searchParams.set("v", state.pick);
    u.searchParams.set("via", "card");
    return u.href;
  }
  function svgImage(svg) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { resolve(null); };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    });
  }
  function photoImage(src) {
    return new Promise(function (resolve) {
      if (!src) return resolve(null);
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { resolve(null); };
      img.src = src;
    });
  }
  function drawGrid(ctx, W, H) {
    ctx.fillStyle = TISSUE; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(47,93,138,.09)"; ctx.lineWidth = 2;
    for (var x = 0; x <= W; x += 54) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (var y = 0; y <= H; y += 54) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  }
  function contain(ctx, img, x, y, w, h) {
    var r = Math.min(w / img.naturalWidth, h / img.naturalHeight);
    var dw = img.naturalWidth * r, dh = img.naturalHeight * r;
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  }
  /* 1080×1350 card: the envelope, with your circled view and one question. */
  function makeCard() {
    var f = state.find, s = f.stats, fam = familyOf(s);
    var W = 1080, H = 1350;
    var c = document.createElement("canvas");
    c.width = W; c.height = H;
    var ctx = c.getContext("2d");
    var fonts = document.fonts ? Promise.all([
      document.fonts.load('400 80px "Young Serif"'), document.fonts.load('600 30px "IBM Plex Mono"'), document.fonts.load('600 30px "Instrument Sans"')
    ]).catch(function () {}) : Promise.resolve();
    var minis = Promise.all(["A", "B", "C"].map(function (L) { return svgImage(flatSvg(fam, s.hex, state.views[L] && state.views[L].id)); }));
    var cover = f.src ? photoImage(f.src) : svgImage(flatSvg(fam, s.hex, null, { grain: true }));
    return Promise.all([fonts, minis, cover]).then(function (r) {
      var mini = r[1], photo = r[2];
      drawGrid(ctx, W, H);
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-0.012); ctx.translate(-W / 2, -H / 2);
      ctx.fillStyle = "rgba(42,33,26,.16)"; ctx.fillRect(78, 82, 930, 1150);
      ctx.fillStyle = SHEET; ctx.fillRect(70, 70, 930, 1150);
      ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.strokeRect(70, 70, 930, 1150);
      ctx.fillStyle = INK; ctx.fillRect(70, 70, 930, 96);
      ctx.fillStyle = TISSUE; ctx.font = '600 30px "IBM Plex Mono", monospace'; ctx.textBaseline = "middle";
      ctx.fillText("RESTITCH", 110, 118);
      ctx.textAlign = "right"; ctx.font = '400 54px "Young Serif", Georgia, serif';
      ctx.fillText("No. " + patternNo(s.hex), 960, 120);
      ctx.textAlign = "left"; ctx.fillStyle = INK; ctx.font = '400 78px "Young Serif", Georgia, serif'; ctx.textBaseline = "alphabetic";
      ctx.fillText(FAM[fam].name, 110, 262);
      ctx.setLineDash([16, 10]); ctx.strokeStyle = RED; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(110, 300); ctx.lineTo(960, 300); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#fff"; ctx.fillRect(110, 330, 540, 700);
      ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.strokeRect(110, 330, 540, 700);
      if (photo) contain(ctx, photo, 120, 340, 520, 680);
      ["A", "B", "C"].forEach(function (L, i) {
        var y = 330 + i * 236;
        ctx.fillStyle = "#fff"; ctx.fillRect(680, y, 280, 228);
        ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.strokeRect(680, y, 280, 228);
        if (mini[i]) ctx.drawImage(mini[i], 760, y + 12, 160, 216);
        ctx.fillStyle = BLUE; ctx.font = '600 30px "IBM Plex Mono", monospace'; ctx.fillText(L, 700, y + 46);
        ctx.font = '600 20px "IBM Plex Mono", monospace'; ctx.fillStyle = MUTED;
        ctx.fillText(METHOD_LABEL[L].toUpperCase(), 700, y + 214);
        if (state.pick === L) {
          ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.strokeRect(676, y - 4, 288, 236);
          ctx.fillStyle = RED; ctx.fillRect(850, y - 4, 114, 40);
          ctx.fillStyle = "#fff"; ctx.font = '600 20px "IBM Plex Mono", monospace'; ctx.fillText("PICKED", 866, y + 23);
        }
      });
      ctx.fillStyle = RED; ctx.font = '400 60px "Young Serif", Georgia, serif';
      var q = state.pick ? "Leaning View " + state.pick + ". You?" : "Which view should I make?";
      ctx.fillText(q, 110, 1110);
      ctx.fillStyle = MUTED; ctx.font = '600 24px "IBM Plex Mono", monospace';
      ctx.fillText("SIZE: YOUR TAPE · RESTITCH", 110, 1170);
      ctx.restore();
      ctx.fillStyle = MUTED; ctx.font = '500 22px "Instrument Sans", sans-serif';
      var cr = f.credit ? "Photo: " + f.credit.author + ", " + f.credit.license + " (Wikimedia Commons). Views are sketches." : "Views are sketches, not photos of a finished flip.";
      ctx.fillText(cr, 80, 1300);
      return new Promise(function (resolve) {
        try { c.toBlob(function (b) { resolve(b); }, "image/png"); } catch (e) { resolve(null); }
      });
    });
  }
  function download(blob) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "restitch-no-" + patternNo(state.find.stats.hex).toLowerCase() + ".png";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }
  $("#save").addEventListener("click", function () {
    if (state.friendMode) return void $("#again").click();
    makeCard().then(function (b) { if (b) download(b); });
  });
  $("#send").addEventListener("click", function () {
    var btn = $("#send");
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Making it…";
    var link = shareLink();
    var text = state.friendMode ? "I'd make View " + state.pick + ". Your turn:" : "Which view should I make? A, B or C:";
    makeCard().then(function (blob) {
      btn.disabled = false;
      btn.textContent = label;
      var file = null;
      try { file = blob && new File([blob], "restitch-envelope.png", { type: "image/png" }); } catch (e) { file = null; }
      var share = null;
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) share = navigator.share({ files: [file], text: text + " " + link });
      else if (navigator.share) share = navigator.share({ text: text, url: link });
      if (share) return share.catch(function () { /* closed the sheet */ });
      var copy = navigator.clipboard ? navigator.clipboard.writeText(text + " " + link) : Promise.reject();
      return copy.then(function () {
        btn.textContent = "Link copied";
        setTimeout(function () { btn.textContent = label; }, 1800);
      }).catch(function () { window.prompt("Copy this link", link); });
    });
  });
  $("#again").addEventListener("click", function () {
    state = { find: null, kit: null, views: null, pick: null, friendPick: null, friendMode: false };
    history.replaceState(null, "", location.pathname);
    show("beat-find");
  });

  /* ---------- A friend's link: straight to their envelope ---------- */
  function fromLink() {
    var q = new URLSearchParams(location.search);
    var kit = q.get("k");
    if (!KITS[kit]) return false;
    var find = null;
    var id = q.get("f");
    if (id) {
      var f = FINDS.filter(function (x) { return x.id === id; })[0];
      if (f) find = { id: f.id, name: f.name, src: f.file, credit: f.credit, stats: f.stats, own: false };
    } else if (/^[0-9a-f]{6}$/i.test(q.get("c") || "")) {
      var num = function (k, lo, hi, d) { var v = parseFloat(q.get(k)); return isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d; };
      find = {
        id: "friend", name: "A friend's find", src: null, credit: null, own: true,
        stats: { hex: "#" + q.get("c").toLowerCase(), aspectUsed: num("a", 0.1, 10, 1), brightness: num("b", 0, 1, 0.5), saturation: num("s", 0, 1, 0.2), hue: num("h", 0, 360, 0) }
      };
    }
    if (!find) return false;
    state.find = find;
    state.kit = kit;
    var v = (q.get("v") || "").toUpperCase();
    state.friendPick = METHOD[v] ? v : null;
    state.friendMode = true;
    var go = find.src ? readSample(find) : Promise.resolve(find);
    go.then(function () { buildViews(); paintEnvelope(); });
    return true;
  }

  paintRack();
  fromLink();
})();
