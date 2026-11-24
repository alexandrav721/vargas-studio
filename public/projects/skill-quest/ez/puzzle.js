/* AI Made EZ family puzzle book, made for people who print.
   Journey: one big question at a time → who it's for → family names and favorite places (type or say them;
   add "Rosie: our newest granddaughter" for a crossword hint) → optional "tell me about the family" for Claude to write clues
   → easy / medium / hard → 3 looks → flip through the pages → print a large-print book with an answer key.
   Puzzles are built on this page (puzzlegen.js), so every letter prints exactly. Autosave and Undo on every step. */
(function () {
  "use strict";
  var KEY = "smez-ez-puzzle", P = window.PuzzleGen;
  var Q = {
    forwho: { label: "Who it's for", q: "Who is this puzzle book for?", opts: ["Grandma", "Grandpa", "Mom", "Dad"], ph: "Or type a name" },
    from: { label: "Who it's from", q: "Who is it from?", opts: ["Love, Mia and Sam", "From all of us"], ph: "Or type your names" },
    names: { label: "Family names", q: "Family names", hint: "Type or say them, one per line or with commas. Pets count too. Add a hint after a colon for the crossword, like: Rosie: our newest granddaughter", words: "family" },
    places: { label: "Places and favorites", q: "Places and favorite things", hint: "Places you love, foods, hobbies, traditions. Like: Tahoe: where we go every summer", words: "places" },
    about: { label: "About the family", q: "Tell me about the family", hint: "A few sentences is plenty. I'll pick puzzle words and write kind clues from it. For example: Linda bakes the best apple pie. Tom spends Saturdays in the garden.", about: true },
    level: { label: "How hard", q: "How hard should the puzzles be?", opts: ["Easy", "Medium", "Hard"], one: true },
    photo: { label: "Cover photo", q: "Add a photo for the cover?", hint: "A favorite family photo. You can skip this.", photo: true }
  };
  var DEPTH = { short: ["forwho", "names", "level"], full: ["forwho", "from", "names", "places", "level", "photo"], all: ["forwho", "from", "names", "places", "about", "level", "photo"] };
  var LOOKS = [["classic", "Classic"], ["garden", "Garden"], ["bold", "Bold"]];
  var LEVEL = { Easy: { size: 11, dirs: [[0, 1], [1, 0]] }, Medium: { size: 13, dirs: [[0, 1], [1, 0], [1, 1]] }, Hard: { size: 14, dirs: [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [1, -1], [-1, -1]] } };

  var S, hist = [], $ = function (id) { return document.getElementById(id); };
  function fresh() { return { depth: "full", ans: {}, sel: {}, skipped: {}, at: 0, phase: "ask", words: [], drafts: {}, photo: "", look: null, seed: Math.floor(Math.random() * 1e9), sheet: 0 }; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { try { var c = JSON.parse(JSON.stringify(S)); c.photo = ""; localStorage.setItem(KEY, JSON.stringify(c)); } catch (e2) {} } }
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY) || "null"); return s && s.ans ? s : null; } catch (e) { return null; } }
  function snap() { hist.push(JSON.stringify(S)); if (hist.length > 30) hist.shift(); $("undo").disabled = false; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var tapped = false; ["pointerdown", "keydown"].forEach(function (e) { window.addEventListener(e, function () { tapped = true; }, true); });
  function snd(n, x) { if (tapped && window.SQSound) window.SQSound.play(n, x); }
  function keys() { return DEPTH[S.depth]; }
  function one(k) { return S.ans[k] || (S.sel[k] || [])[0] || ""; }
  function level() { return LEVEL[one("level")] || LEVEL.Easy; }
  function answered(k) {
    var c = Q[k];
    if (c.words) return S.words.some(function (w) { return c.words === "family" ? w.group === "family" : w.group !== "family"; });
    if (c.about) return S.words.some(function (w) { return w.fromAbout; });
    if (c.photo) return !!S.photo;
    return !!one(k);
  }

  /* ---------- words ---------- */
  function toWord(label) { return label.toUpperCase().replace(/[^A-Z]/g, ""); }
  function parseLines(text, group) {
    var out = [];
    var parts = [];
    String(text).split(/\n|;/).forEach(function (line) {
      var ci = line.indexOf(":");
      if (ci < 0) { parts = parts.concat(line.split(/,|\band\b(?=\s+[A-Z])/)); return; }
      var heads = line.slice(0, ci).split(/,|\band\b(?=\s+[A-Z])/), lastHead = heads.pop();
      parts = parts.concat(heads); parts.push(lastHead + ":" + line.slice(ci + 1));
    });
    parts.forEach(function (p) {
      p = p.trim(); if (!p) return;
      var m = p.match(/^([^:\-–]+?)\s*(?:[:\-–]\s*(.+))?$/); if (!m) return;
      var label = m[1].trim(), w = toWord(label);
      if (w.length < 2 || w.length > 14) return;
      var clue = (m[2] || "").trim().slice(0, 80); clue = clue.charAt(0).toUpperCase() + clue.slice(1);
      out.push({ label: label, word: w, clue: clue, group: group });
    });
    return out;
  }
  function addWords(list) {
    var n = 0;
    list.forEach(function (w) { if (S.words.some(function (x) { return x.word === w.word; })) return; S.words.push(w); n++; });
    return n;
  }
  var aiOff = false;
  function readAbout(text) {
    if (aiOff) return Promise.resolve(null);
    return fetch("/api/puzzle", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: text }) })
      .then(function (r) { if (!r.ok && [400, 413, 422, 502].indexOf(r.status) < 0) aiOff = true; return r.ok ? r.json() : null; })
      .catch(function () { aiOff = true; return null; });
  }
  function clueFor(w) {
    if (w.clue) return w.clue;
    return (w.group === "family" ? "Someone in our family" : w.group === "favorites" ? "One of our favorite things" : "A place we love") + " (" + w.word.length + " letters)";
  }

  /* ---------- the question card ---------- */
  var MIC = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>';
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition, rec = null;
  function drawAsk() {
    var box = $("ask"), ks = keys();
    if (S.phase !== "ask") {
      box.innerHTML = '<div class="done-msg"><h1>' + (S.look ? "Your puzzle book is ready" : "Pick a look") + "</h1><p>" + (S.look ? "Flip through the pages, then print. Tap any answer on the list to change it." : "Here is the first puzzle in 3 looks. Tap the one you like.") + "</p></div>";
      return;
    }
    var k = ks[S.at], c = Q[k], n = S.at + 1, sel = S.sel[k] || [];
    var h = '<div class="prog"><span>Question ' + n + " of " + ks.length + '</span><span class="bar"><i style="width:' + Math.round((S.at / ks.length) * 100) + '%"></i></span></div>';
    h += "<h1>" + esc(c.q) + "</h1>" + (c.hint ? '<p class="hint">' + esc(c.hint) + "</p>" : "");
    if (c.opts) h += '<div class="opts" role="group" aria-label="Choices">' + c.opts.map(function (o) { return '<button type="button" class="opt" data-o="' + esc(o) + '" aria-pressed="' + (sel.indexOf(o) >= 0) + '">' + esc(o) + "</button>"; }).join("") + "</div>";
    if (c.ph) h += '<div class="say"><label class="sr" for="tx">' + esc(c.ph) + '</label><textarea id="tx" maxlength="60" style="min-height:60px" placeholder="' + esc(c.ph) + '">' + esc(S.ans[k] || "") + "</textarea></div>";
    if (c.words || c.about) {
      h += '<div class="say"><label class="sr" for="tx">Type or say them</label><textarea id="tx" maxlength="2500" placeholder="Type or tap the microphone">' + esc(S.drafts[k] || "") + "</textarea>" + (SR ? '<button type="button" class="mic" id="mic" aria-pressed="false" aria-label="Speak">' + MIC + "</button>" : "") + "</div>";
      h += '<button type="button" class="btn ghost readb" id="read">' + (c.about ? "Make puzzle words from this" : "Add these") + "</button>";
      var mine = S.words.filter(function (w) { return c.about ? w.fromAbout : c.words === "family" ? w.group === "family" && !w.fromAbout : w.group !== "family" && !w.fromAbout; });
      if (mine.length) h += '<p class="found">' + mine.length + " word" + (mine.length > 1 ? "s" : "") + ' in your puzzles</p><ul class="dlist">' + mine.map(function (w) { var i = S.words.indexOf(w); return "<li><span>" + esc(w.label) + '</span><span class="when">' + esc(w.clue || "") + '</span><button type="button" data-del="' + i + '" aria-label="Remove ' + esc(w.label) + '">Remove</button></li>'; }).join("") + "</ul>";
    }
    if (c.photo) h += (S.photo ? '<div class="phs"><img src="' + S.photo + '" alt=""></div>' : "") + '<label class="btn ghost" for="ph" style="min-height:58px;font-size:19px">' + (S.photo ? "Choose a different photo" : "Choose a photo") + '</label><input type="file" id="ph" accept="image/*" class="sr">';
    h += '<div class="nav">' + (S.at ? '<button type="button" class="btn ghost" id="back">Back</button>' : "") + '<button type="button" class="btn next" id="next">' + (n === ks.length ? "Make my puzzle book" : "Next") + '</button><button type="button" class="skipb" id="skip">Skip</button></div>';
    box.innerHTML = h;
  }
  function readField() {
    var k = keys()[S.at], t = $("tx"); if (!t) return;
    if (Q[k].words || Q[k].about) { S.drafts[k] = t.value; return; }
    var v = t.value.trim(); if (v) { S.ans[k] = v; S.sel[k] = []; } else delete S.ans[k];
  }
  function readAndAdd(then) {
    var k = keys()[S.at], c = Q[k], t = $("tx"), text = (t ? t.value : S.drafts[k] || "").trim();
    if (!text) { if (then) then(); return; }
    if (c.words) {
      snap(); var n = addWords(parseLines(text, c.words));
      if (n) { S.drafts[k] = ""; snd("sticker"); School.toast("Added " + n + "."); } else School.toast("Those are already in, or too long. Words can have up to 14 letters.");
      drawAll(); save(); if (then && n) then(); return;
    }
    $("app").classList.add("busy");
    readAbout(text).then(function (r) {
      $("app").classList.remove("busy"); snap();
      var list = r && r.words ? r.words.map(function (w) { return { label: w.word.charAt(0) + w.word.slice(1).toLowerCase(), word: w.word, clue: w.clue, group: w.group, fromAbout: true }; }) : parseLines(text, "favorites").filter(function (w) { return w.clue; }).map(function (w) { w.fromAbout = true; return w; });
      var n = addWords(list);
      if (n) { S.drafts[k] = ""; snd("sticker"); School.toast("Added " + n + " words with clues."); }
      else School.toast(aiOff ? "Write it like: Pie: Grandma's best dessert, one per line." : "I couldn't find puzzle words in that. Try a few more details.");
      drawAll(); save(); if (then && n) then();
    });
  }
  function go(d) {
    var k = keys()[S.at];
    if (d > 0 && (Q[k].words || Q[k].about) && (S.drafts[k] || "").trim()) { readAndAdd(function () { go(d); }); return; }
    readField(); snap();
    if (d > 0) { if (answered(k)) delete S.skipped[k]; snd("tick", Math.min(3, S.at)); }
    S.at = Math.max(0, S.at + d);
    if (S.at >= keys().length) {
      if (S.words.length < 3) { S.at = keys().indexOf("names"); School.toast("Add at least 3 words so I can make the puzzles."); }
      else { S.phase = "pick"; S.look = null; S.sheet = 1; snd("deal"); }
    }
    drawAll(); save(); var f = document.querySelector(".ask h1"); if (f) { f.tabIndex = -1; f.focus({ preventScroll: true }); }
  }

  /* ---------- the book ---------- */
  function wsHtml(ws, key) {
    var cs = Math.floor(Math.min(52, (key ? 300 : 640) / ws.size)), hl = {};
    if (key) ws.placed.forEach(function (p) { for (var k = 0; k < p.word.length; k++) hl[(p.r + p.dr * k) + "," + (p.c + p.dc * k)] = 1; });
    var h = '<div class="ws" style="grid-template-columns:repeat(' + ws.size + "," + cs + "px);--cs:" + cs + "px;--fs:" + Math.round(cs * 0.62) + 'px">';
    for (var i = 0; i < ws.size; i++) for (var j = 0; j < ws.size; j++) h += "<span" + (hl[i + "," + j] ? ' class="hl"' : "") + ">" + ws.grid[i][j] + "</span>";
    return h + "</div>";
  }
  function cwHtml(cw, key) {
    var cs = Math.floor(Math.min(46, (key ? 300 : 640) / Math.max(cw.cols, cw.rows * 0.9)));
    var h = '<div class="cw" style="grid-template-columns:repeat(' + cw.cols + "," + cs + "px);--cs:" + cs + 'px">';
    cw.cells.forEach(function (row) { row.forEach(function (c) { h += c.ch ? '<i class="w">' + (c.n ? "<b>" + c.n + "</b>" : "") + (key ? "<em>" + c.ch + "</em>" : "") + "</i>" : "<i></i>"; }); });
    return h + "</div>";
  }
  var book = null;
  function build() {
    var L = level(), fam = S.words.filter(function (w) { return w.group === "family"; }), rest = S.words.filter(function (w) { return w.group !== "family"; });
    var searches = [];
    if (fam.length >= 3 && rest.length >= 3) { searches.push({ title: "Find the family", list: fam }); searches.push({ title: "Places and favorites", list: rest }); }
    else searches.push({ title: "Find the family", list: S.words });
    searches.forEach(function (s, i) { s.list = s.list.slice(0, 16); s.ws = P.wordSearch(s.list.map(function (w) { return w.word; }), L.size, L.dirs, S.seed + i); });
    var cw = P.crossword(S.words.filter(function (w) { return w.word.length <= 13; }).slice(0, 16).map(function (w) { return { word: w.word, clue: clueFor(w) }; }), S.seed + 11);
    if (cw && cw.across.length + cw.down.length < 3) cw = null;
    var scr = S.words.filter(function (w) { return w.word.length >= 3 && w.word.length <= 9; }).slice(0, 10).map(function (w, i) { return { w: w, s: P.scramble(w.word, S.seed + 31 + i) }; });
    book = { searches: searches, cw: cw, scr: scr.length >= 3 ? scr : null };
    var pages = [{ k: "cover" }];
    searches.forEach(function (s, i) { pages.push({ k: "ws", i: i }); });
    if (book.cw) pages.push({ k: "cw" });
    if (book.scr) pages.push({ k: "scr" });
    pages.push({ k: "key" });
    book.pages = pages;
  }
  function pageHtml(p, look, num) {
    var h = '<div class="ppage l-' + look + (p.k === "cover" ? " cover" : p.k === "key" ? " key" : "") + '">';
    if (p.k === "cover") {
      h += (S.photo ? '<img src="' + S.photo + '" alt="">' : "") + '<div class="kind">A large-print puzzle book</div><div class="big">Made for ' + esc(one("forwho") || "you") + "</div>" + (one("from") ? '<div class="from">' + esc(one("from")) + "</div>" : "");
    } else if (p.k === "ws") {
      var s = book.searches[p.i];
      h += "<h1>" + esc(s.title) + '</h1><div class="sub">Find each word. They go ' + (one("level") === "Hard" ? "in every direction, even backwards." : one("level") === "Medium" ? "across, down and diagonally." : "across and down.") + "</div>" + wsHtml(s.ws) + '<div class="wlist">' + s.ws.placed.map(function (pl) { var w = s.list.find(function (x) { return x.word === pl.word; }); return "<span>" + esc(w ? w.label : pl.word) + "</span>"; }).join("") + "</div>";
    } else if (p.k === "cw") {
      var cw = book.cw, clue = function (pl) { return "<p><b>" + pl.n + ".</b> " + esc(pl.clue) + "</p>"; };
      h += "<h1>Family crossword</h1>" + cwHtml(cw) + '<div class="clues"><div><h2>Across</h2>' + cw.across.map(clue).join("") + "</div><div><h2>Down</h2>" + cw.down.map(clue).join("") + "</div></div>";
    } else if (p.k === "scr") {
      h += '<h1>Unscramble the words</h1><div class="sub">Each one is a name or a favorite of ours.</div><div class="scr">' + book.scr.map(function (x) { return "<div><b>" + x.s + "</b><span>" + esc(x.w.clue ? "Hint: " + x.w.clue : "") + "</span></div>"; }).join("") + "</div>";
    } else {
      h += '<h1>Answers</h1><div class="keys">' + book.searches.map(function (s) { return "<div><h2>" + esc(s.title) + "</h2>" + wsHtml(s.ws, true) + "</div>"; }).join("") + (book.cw ? "<div><h2>Crossword</h2>" + cwHtml(book.cw, true) + "</div>" : "") + (book.scr ? '<div><h2>Unscrambled</h2><div class="scr">' + book.scr.map(function (x) { return "<p>" + x.s + " = <b>" + esc(x.w.label) + "</b></p>"; }).join("") + "</div></div>" : "") + "</div>";
    }
    if (num) h += '<div class="pn">' + num + "</div>";
    return h + "</div>";
  }
  function pageName(p) { return p.k === "cover" ? "Cover" : p.k === "ws" ? book.searches[p.i].title : p.k === "cw" ? "Crossword" : p.k === "scr" ? "Scramble" : "Answers"; }
  function fitAll() { document.querySelectorAll(".fit").forEach(function (box) { var pg = box.querySelector(".ppage"); if (!pg) return; var s = box.clientWidth / 816; pg.style.transform = "scale(" + s + ")"; box.style.height = (1056 * s) + "px"; }); }

  function drawOut() {
    var v = $("view");
    if (S.phase === "ask") {
      $("otitle").textContent = "Your puzzle, filling in";
      if (S.words.length >= 2) { build(); v.innerHTML = '<div class="fit">' + pageHtml({ k: "ws", i: 0 }, "classic") + '</div><p class="note">Every word you add goes into the puzzle.</p>'; }
      else v.innerHTML = '<div class="fit">' + pageHtml({ k: "cover" }, "classic") + '</div><p class="note">Add a few family names and the first puzzle appears here.</p>';
    } else if (!S.look) {
      build(); $("otitle").textContent = "Pick a look";
      v.innerHTML = '<div class="picks">' + LOOKS.map(function (l) { return '<div class="pick"><h3>' + l[1] + '</h3><div class="fit">' + pageHtml({ k: "ws", i: 0 }, l[0]) + '</div><button type="button" class="btn" data-look="' + l[0] + '">Use this look</button></div>'; }).join("") + "</div>";
    } else {
      build(); $("otitle").textContent = "Ready to print";
      var n = book.pages.length, i = Math.min(S.sheet || 0, n - 1);
      v.innerHTML =
        '<div class="row" role="group" aria-label="Look"><span class="label">Look</span>' + LOOKS.map(function (l) { return '<button type="button" class="choice" data-look2="' + l[0] + '" aria-pressed="' + (S.look === l[0]) + '">' + l[1] + "</button>"; }).join("") + '<button type="button" class="choice" id="reshuffle">New puzzles</button></div>' +
        '<div class="flip"><button type="button" class="btn ghost" id="prev"' + (i === 0 ? " disabled" : "") + '>‹ Back</button><b>' + esc(pageName(book.pages[i])) + " · " + (i + 1) + " of " + n + '</b><button type="button" class="btn ghost" id="nextp"' + (i === n - 1 ? " disabled" : "") + ">Next ›</button></div>" +
        '<div class="fit">' + pageHtml(book.pages[i], S.look, i ? i + 1 : 0) + "</div>" +
        '<div class="row"><button type="button" class="btn" id="print">Print all ' + n + ' pages</button><button type="button" class="btn ghost" id="others">See all 3 looks</button></div>' +
        '<div class="tips"><b>Printing tips</b><ol><li>Use plain letter paper (8.5 × 11).</li><li>Print one page first to check: in the print window, set Pages to 2.</li><li>Choose "Actual size" or 100%, not "Fit".</li><li>Staple the left side, or keep the pages in a folder with a pencil.</li></ol></div>';
    }
    requestAnimationFrame(fitAll);
  }
  function drawPrint() { var p = $("printall"); if (!S.look || S.words.length < 3) { p.innerHTML = ""; return; } build(); p.innerHTML = book.pages.map(function (pg, i) { return pageHtml(pg, S.look, i ? i + 1 : 0); }).join(""); }
  function drawPlan() {
    var ks = keys(), ol = $("qs"); ol.innerHTML = "";
    ks.forEach(function (k, i) {
      var li = document.createElement("li"), done = answered(k);
      li.className = (S.phase === "ask" && i === S.at ? "now " : "") + (done ? "done" : S.skipped[k] ? "skip" : "");
      li.innerHTML = '<span class="tick" aria-hidden="true"></span><button type="button" data-q="' + i + '">' + esc(Q[k].label) + (done ? "" : S.skipped[k] ? " (skipped)" : "") + "</button>";
      ol.appendChild(li);
    });
    document.querySelectorAll(".seg button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.depth === S.depth)); });
    $("prompt").textContent = "Pick 8 to 20 puzzle words (names, places, favorites) from what this person wrote, and write a short, kind crossword clue for each, using only their facts.\n\n" + (S.drafts.about || "(Claude only reads the \"Tell me about the family\" answer. The puzzles themselves are built on this page, so every letter prints exactly.)");
  }
  function drawAll() { drawAsk(); drawOut(); drawPlan(); drawPrint(); }

  /* ---------- events ---------- */
  function wire() {
    $("ask").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      var k = keys()[S.at];
      if (b.dataset.o) { snd("pick"); snap(); S.sel[k] = [b.dataset.o]; delete S.ans[k]; go(1); }
      else if (b.id === "next") go(1);
      else if (b.id === "back") go(-1);
      else if (b.id === "skip") { readField(); S.skipped[k] = true; S.drafts[k] = ""; go(1); }
      else if (b.id === "mic") listen(b);
      else if (b.id === "read") readAndAdd();
      else if (b.dataset.del != null) { snap(); S.words.splice(+b.dataset.del, 1); drawAll(); save(); School.toast("Removed. Tap Undo to bring it back."); }
    });
    $("ask").addEventListener("input", function (e) { if (e.target.id === "tx") { readField(); drawPlan(); save(); } });
    $("ask").addEventListener("change", function (e) {
      if (e.target.id !== "ph" || !e.target.files[0]) return; snap();
      var r = new FileReader(); r.onload = function () { var img = new Image(); img.onload = function () { var s = Math.min(1, 1000 / Math.max(img.width, img.height)), c = document.createElement("canvas"); c.width = img.width * s; c.height = img.height * s; c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); S.photo = c.toDataURL("image/jpeg", 0.82); snd("sticker"); drawAll(); save(); }; img.src = r.result; }; r.readAsDataURL(e.target.files[0]);
    });
    $("qs").addEventListener("click", function (e) { var b = e.target.closest("[data-q]"); if (!b) return; snap(); if (S.phase === "ask") readField(); S.phase = "ask"; S.at = +b.dataset.q; drawAll(); save(); window.scrollTo({ top: 0, behavior: "smooth" }); });
    document.querySelector(".seg").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return; snap(); if (S.phase === "ask") readField();
      var cur = keys()[S.at]; S.depth = b.dataset.depth; var ix = keys().indexOf(cur); S.at = ix >= 0 ? ix : Math.min(S.at, keys().length - 1);
      var open = keys().findIndex(function (k) { return !answered(k) && !S.skipped[k]; });
      if (S.phase !== "ask" && open >= 0) { S.phase = "ask"; S.at = open; }
      snd("pick"); drawAll(); save();
    });
    $("view").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.look) { snap(); S.look = b.dataset.look; S.sheet = 0; snd("stamp"); drawAll(); save(); window.scrollTo({ top: 0, behavior: "smooth" }); }
      else if (b.dataset.look2) { snap(); S.look = b.dataset.look2; snd("pick"); drawOut(); drawPrint(); save(); }
      else if (b.id === "reshuffle") { snap(); S.seed = Math.floor(Math.random() * 1e9); snd("deal"); drawOut(); drawPrint(); save(); School.toast("New puzzles, same words. Tap Undo to go back."); }
      else if (b.id === "prev" || b.id === "nextp") { S.sheet = Math.max(0, (S.sheet || 0) + (b.id === "prev" ? -1 : 1)); snd("pick"); drawOut(); save(); }
      else if (b.id === "print") { snd("share"); drawPrint(); setTimeout(function () { window.print(); }, 50); }
      else if (b.id === "others") { snap(); S.look = null; drawAll(); save(); }
    });
    $("undo").addEventListener("click", function () { if (!hist.length) return; S = JSON.parse(hist.pop()); $("undo").disabled = !hist.length; drawAll(); save(); School.toast("Undone."); });
    $("restart").addEventListener("click", function () { snap(); S = fresh(); drawAll(); save(); School.toast("New puzzle book. Tap Undo to get the old one back."); });
    window.addEventListener("resize", function () { clearTimeout(fitAll.t); fitAll.t = setTimeout(fitAll, 120); });
  }
  function listen(b) {
    if (!SR) return;
    if (rec) { rec.stop(); return; }
    var t = $("tx"); rec = new SR(); rec.lang = navigator.language || "en-US"; rec.interimResults = true; rec.continuous = false;
    var base = t.value ? t.value.trim() + "\n" : "";
    rec.onresult = function (ev) { var s = ""; for (var i = 0; i < ev.results.length; i++) s += ev.results[i][0].transcript; t.value = base + s; readField(); };
    rec.onend = function () { rec = null; b.setAttribute("aria-pressed", "false"); save(); };
    rec.onerror = function () { School.toast("I couldn't hear that. You can type instead."); };
    b.setAttribute("aria-pressed", "true"); rec.start();
  }
  document.addEventListener("DOMContentLoaded", function () {
    wire();
    var s = load(); S = s ? Object.assign(fresh(), s) : fresh();
    drawAll();
    if (s) School.toast("Welcome back. Your puzzle book is right where you left it.");
  });
})();
