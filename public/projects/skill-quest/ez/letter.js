/* AI Made EZ holiday letter, made for people who love to print.
   Journey: one big question at a time (tap, type or speak) → the letter writes itself on a real 8.5 x 11 page as you answer
   → 3 letters to choose from (warm, short and sweet, a little funny) → pick a look, add up to 3 photos, change one thing
   or edit the words yourself → print one page (with print tips) or copy the words for email.
   Claude (POST /api/letter) writes the 3 letters; with no AI switched on, the page writes them with built-in rules.
   Everything autosaves on this device, and Undo steps back. */
(function () {
  "use strict";
  var KEY = "smez-ez-letter";
  var YEAR = new Date().getMonth() < 6 ? new Date().getFullYear() - 1 : new Date().getFullYear();
  var Q = {
    from: { label: "Who it's from", q: "Who is this letter from?", opts: ["The Garcia family", "Linda and Tom", "Grandma and Grandpa"], ph: "Your names" },
    holiday: { label: "Greeting", q: "Which greeting?", opts: ["Merry Christmas", "Happy Holidays", "Happy Hanukkah", "Happy New Year"], one: true },
    news: { label: "Big news", q: "What was big this year?", hint: "Tap all that fit, then add anything in your own words.", opts: ["A new grandbaby", "A wedding", "We moved", "We retired", "A big trip", "A new job", "A quiet, happy year"], multi: true, ph: "Tell me more (optional)" },
    people: { label: "Each person", q: "Any news about each person?", hint: "One line each is plenty. For example: Sam started first grade. Emma got her driver's license.", ph: "Type or tap the microphone", text: true },
    trips: { label: "Trips and visits", q: "Any trips or visits?", opts: ["Visited the grandkids", "A week at the beach", "A road trip", "Stayed home and loved it"], multi: true, ph: "Where did you go? (optional)" },
    thanks: { label: "Thankful for", q: "What are you thankful for?", opts: ["Good health", "Family close by", "Old friends", "Our church", "Our garden"], multi: true, ph: "Anything else (optional)" },
    hard: { label: "Anything hard", q: "Was anything hard this year?", hint: "You can skip this one. If you share it, the letter mentions it gently, once.", opts: ["We lost a loved one", "Health troubles", "A hard move"], multi: true, ph: "In your own words (optional)" },
    wish: { label: "Wish for next year", q: "What do you wish everyone for next year?", opts: ["Health and happiness", "Peace", "More time together", "Lots of laughter"], multi: true, ph: "Your own wish (optional)" },
    sign: { label: "Signature", q: "How should we sign it?", opts: ["Love, Linda and Tom", "With love, the Garcias", "Love, Grandma and Grandpa"], ph: "Your sign-off" }
  };
  var DEPTH = { short: ["from", "holiday", "news", "sign"], full: ["from", "holiday", "news", "people", "trips", "thanks", "sign"], all: ["from", "holiday", "news", "people", "trips", "thanks", "hard", "wish", "sign"] };
  var TONES = ["Warm", "Short and sweet", "A little funny"];
  var LOOKS = [["classic", "Classic"], ["cozy", "Cozy"], ["modern", "Modern"]];

  var S, hist = [], $ = function (id) { return document.getElementById(id); };
  function fresh() { return { depth: "full", ans: {}, sel: {}, skipped: {}, at: 0, phase: "ask", versions: null, pick: null, look: "classic", photos: [], big: false, edit: false }; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { try { var c = JSON.parse(JSON.stringify(S)); c.photos = []; localStorage.setItem(KEY, JSON.stringify(c)); } catch (e2) {} } }
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY) || "null"); return s && s.ans ? s : null; } catch (e) { return null; } }
  function snap() { hist.push(JSON.stringify(S)); if (hist.length > 30) hist.shift(); $("undo").disabled = false; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var tapped = false; ["pointerdown", "keydown"].forEach(function (e) { window.addEventListener(e, function () { tapped = true; }, true); });
  function snd(n, x) { if (tapped && window.SQSound) window.SQSound.play(n, x); }
  function keys() { return DEPTH[S.depth]; }
  function sentence(s) { s = String(s || "").trim(); if (!s) return ""; s = s.charAt(0).toUpperCase() + s.slice(1); return /[.!?]$/.test(s) ? s : s + "."; }
  function list(a) { return a.length < 2 ? (a[0] || "") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
  function lower(s) { return s.charAt(0).toLowerCase() + s.slice(1); }

  /* ---------- built-in writer (used when Claude isn't switched on) ---------- */
  var NEWS = { "A new grandbaby": "we welcomed a new grandbaby", "A wedding": "we celebrated a wedding", "We moved": "we moved to a new home", "We retired": "we retired", "A big trip": "we took a big trip", "A new job": "the family celebrated a new job", "A quiet, happy year": "it was a quiet, happy year" };
  var TRIPS = { "Visited the grandkids": "visited the grandkids", "A week at the beach": "spent a week at the beach", "A road trip": "took a road trip", "Stayed home and loved it": "stayed close to home and loved it" };
  var HARD = { "We lost a loved one": "we lost someone we love, and we miss them every day", "Health troubles": "we had some health troubles", "A hard move": "a move was harder than we expected" };
  function greet(h, tone) {
    h = h || "Happy Holidays";
    if (tone === 1) return h + "!";
    if (tone === 2) return h + " from the busiest " + (/grand/i.test(one("from")) ? "grandparents" : "family") + " we know!";
    return h + " from our house to yours!";
  }
  function one(k) { return S.ans[k] || (S.sel[k] || [])[0] || ""; }
  function writeLocal() {
    var a = { holiday: one("holiday"), from: one("from"), people: S.ans.people }, sel = S.sel;
    var news = (sel.news || []).map(function (x) { return NEWS[x]; }).filter(Boolean).map(function (x, i) { return i && /^we /.test(x) && /^we /.test(NEWS[sel.news[0]] || "") ? x.slice(3) : x; });
    var trips = (sel.trips || []).map(function (x) { return TRIPS[x]; }).filter(Boolean);
    var thanks = (sel.thanks || []).map(lower);
    var hard = (sel.hard || []).map(function (x) { return HARD[x]; }).filter(Boolean);
    var wish = (sel.wish || []).map(lower);
    var extra = function (k) { return sentence(S.ans[k + "_more"]); };
    var p = function (arr) { return arr.filter(Boolean).join(" "); };
    var newsS = news.length ? sentence("This year " + list(news)) : "";
    var tripS = trips.length ? sentence("We " + list(trips)) : "";
    var thankS = thanks.length ? "We are so thankful for " + list(thanks) + "." : "";
    var wishS = wish.length ? "We wish you " + list(wish) + " in the new year." : "We wish you a happy and healthy new year.";
    var warm = { hello: greet(a.holiday, 0), paras: [
      p([newsS, extra("news")]) || "We wanted to send a little note to say we are thinking of you.",
      p([sentence(a.people), tripS, extra("trips")]),
      p([hard.length ? "Not every day was easy. " + sentence(hard.join(", and ")) : "", extra("hard")]),
      p([thankS, extra("thanks"), "Most of all, we are thankful for friends and family like you."])
    ].filter(Boolean), bye: p([wishS, extra("wish")]) };
    var short = { hello: greet(a.holiday, 1), paras: [
      p([newsS || "We had a good year.", sentence(a.people).split(". ")[0] ? sentence(sentence(a.people).split(". ")[0]) : ""]),
      thankS || "We are thankful for all of you."
    ].filter(Boolean), bye: wishS };
    var funny = { hello: greet(a.holiday, 2), paras: [
      p([newsS ? newsS.replace(/\.$/, ", and somehow we still found time for naps.") : "Our big news is that we have no big news, and we liked it that way.", extra("news")]),
      p([sentence(a.people), tripS ? tripS.replace(/\.$/, ", and only got a little lost.") : "", extra("trips")]),
      p([hard.length ? "It wasn't all fun and games. " + sentence(hard.join(", and ")) + " We leaned on each other, and on you." : "", thankS, extra("thanks")])
    ].filter(Boolean), bye: p([wishS, "And fewer phone updates. (We can't promise that.)"]) };
    return [warm, short, funny];
  }
  var aiOff = false;
  function ai(body) {
    if (aiOff) return Promise.resolve(null);
    return fetch("/api/letter", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { if (!r.ok && [400, 422, 502].indexOf(r.status) < 0) aiOff = true; return r.ok ? r.json() : null; })
      .catch(function () { aiOff = true; return null; });
  }
  function facts() {
    var o = {};
    keys().forEach(function (k) { var v = [].concat(S.sel[k] || []); if (S.ans[k]) v.push(S.ans[k]); if (S.ans[k + "_more"]) v.push(S.ans[k + "_more"]); if (v.length) o[k] = v.join("; "); });
    return o;
  }

  /* ---------- the question card ---------- */
  var MIC = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>';
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition, rec = null;
  function drawAsk() {
    var box = $("ask"), ks = keys();
    if (S.phase !== "ask") {
      box.innerHTML = '<div class="done-msg"><h1>' + (S.pick == null ? "Pick your favorite letter" : "Your letter is ready") + '</h1><p>' + (S.pick == null ? "I wrote 3 letters from your answers. Tap the one you like best." : "Choose a look, add photos, then print. Tap any answer on the list to change it.") + '</p></div>';
      return;
    }
    var k = ks[S.at], c = Q[k], n = S.at + 1;
    var sel = S.sel[k] || [];
    var h = '<div class="prog"><span>Question ' + n + " of " + ks.length + '</span><span class="bar"><i style="width:' + Math.round((S.at / ks.length) * 100) + '%"></i></span></div>';
    h += "<h1>" + esc(c.q) + "</h1>" + (c.hint ? '<p class="hint">' + esc(c.hint) + "</p>" : "");
    if (c.opts) h += '<div class="opts" role="group" aria-label="Choices">' + c.opts.map(function (o) { return '<button type="button" class="opt" data-o="' + esc(o) + '" aria-pressed="' + (sel.indexOf(o) >= 0) + '">' + esc(o) + "</button>"; }).join("") + "</div>";
    if (!c.one) {
      var fieldKey = c.multi ? k + "_more" : k;
      h += '<div class="say"><label class="sr" for="tx">' + esc(c.ph || "Your answer") + '</label><textarea id="tx" maxlength="500" placeholder="' + esc(c.ph || "") + '">' + esc(S.ans[fieldKey] || "") + "</textarea>" + (SR ? '<button type="button" class="mic" id="mic" aria-pressed="false" aria-label="Speak your answer">' + MIC + "</button>" : "") + "</div>";
    }
    h += '<div class="nav">' + (S.at ? '<button type="button" class="btn ghost" id="back">Back</button>' : "") + '<button type="button" class="btn next" id="next">' + (n === ks.length ? "Write my letter" : "Next") + '</button><button type="button" class="skipb" id="skip">Skip</button></div>';
    box.innerHTML = h;
  }
  function readField() {
    var k = keys()[S.at], c = Q[k], t = $("tx"); if (!t) return;
    var v = t.value.trim(), fk = c.multi ? k + "_more" : k;
    if (v) S.ans[fk] = v; else delete S.ans[fk];
  }
  function answered(k) { return !!((S.sel[k] && S.sel[k].length) || S.ans[k] || S.ans[k + "_more"]); }
  function go(d) {
    readField(); snap();
    var ks = keys(), k = ks[S.at];
    if (d > 0) { if (answered(k)) delete S.skipped[k]; snd("tick", Math.min(3, S.at)); }
    S.at = Math.max(0, S.at + d);
    if (S.at >= ks.length) return finish();
    drawAll(); save(); var f = document.querySelector(".ask h1"); if (f) { f.tabIndex = -1; f.focus({ preventScroll: true }); }
  }
  function finish() {
    S.phase = "pick"; S.pick = null; lock(true); drawAll();
    ai({ mode: "write", answers: facts() }).then(function (r) {
      lock(false);
      S.versions = (r && r.versions && r.versions.length === 3) ? r.versions : writeLocal();
      snd("deal"); drawAll(); save();
    });
  }
  function lock(on) { $("app").classList.toggle("busy", on); if (on) { $("otitle").textContent = "Writing 3 letters…"; } }

  /* ---------- the letter page ---------- */
  function sig() { var s = S.ans.sign || (S.sel.sign || [])[0]; if (s) return s; var f = S.ans.from || (S.sel.from || [])[0]; return f ? "Love, " + f : "Love,"; }
  function page(L, look, opts) {
    opts = opts || {};
    var ph = S.photos || [];
    var h = '<div class="page d-' + look + '" style="font-size:' + (S.big ? 19 : 16) + 'px">';
    if (look === "modern") h += '<div class="bignum" aria-hidden="true">' + YEAR + "</div>";
    h += '<div class="yr">' + YEAR + (S.ans.from || (S.sel.from || [])[0] ? " · " + esc(S.ans.from || S.sel.from[0]) : "") + "</div>";
    if (!L) { h += '<div class="hello" style="opacity:.35">Your letter appears here</div><div class="body"><p style="opacity:.35">Answer the questions and watch it fill in.</p></div></div>'; return h; }
    var ed = opts.edit ? ' contenteditable="true" spellcheck="true"' : "";
    h += '<div class="hello" data-f="hello"' + ed + ">" + esc(L.hello) + "</div>";
    if (opts.photos && ph.length) h += '<div class="photos n' + ph.length + '">' + ph.map(function (src) { return '<img src="' + src + '" alt="">'; }).join("") + "</div>";
    h += '<div class="body">' + L.paras.map(function (p, i) { return '<p data-f="p' + i + '"' + ed + ">" + esc(p) + "</p>"; }).join("") + '<p class="bye" data-f="bye"' + ed + ">" + esc(L.bye) + "</p></div>";
    h += '<div class="sign">' + esc(sig()) + "</div></div>";
    return h;
  }
  /* scale the 816 x 1056 page to its box, and shrink the words until they fit on one sheet */
  function fitAll() {
    document.querySelectorAll(".fit").forEach(function (box) {
      var pg = box.querySelector(".page"); if (!pg) return;
      var s = box.clientWidth / 816; pg.style.transform = "scale(" + s + ")"; box.style.height = (1056 * s) + "px";
      var fs = parseFloat(pg.style.fontSize) || 16, guard = 0;
      while (pg.scrollHeight > pg.clientHeight + 1 && fs > 11 && guard++ < 20) { fs -= 0.5; pg.style.fontSize = fs + "px"; }
    });
  }
  function liveLetter() { var any = keys().some(answered); if (!any) return null; return writeLocal()[0]; }

  function drawOut() {
    var v = $("view"), tools = $("otools"); tools.innerHTML = "";
    if (S.phase === "ask") {
      $("otitle").textContent = "Your letter, writing itself";
      v.innerHTML = '<div class="fit">' + page(liveLetter(), S.look, { photos: false }) + '</div><p class="note">This is a first draft. When you finish, I write 3 versions for you to pick from.</p>';
    } else if (S.pick == null) {
      $("otitle").textContent = S.versions ? "Pick your favorite" : "Writing 3 letters…";
      if (!S.versions) { v.innerHTML = ""; return; }
      v.innerHTML = '<div class="picks">' + S.versions.map(function (L, i) { return '<div class="pick"><h3>' + TONES[i] + '</h3><div class="fit">' + page(L, S.look, {}) + '</div><button type="button" class="btn" data-pick="' + i + '">Use this one</button></div>'; }).join("") + "</div>";
    } else {
      $("otitle").textContent = "Ready to print";
      var L = S.versions[S.pick];
      v.innerHTML =
        '<div class="row" role="group" aria-label="Look"><span class="label">Look</span>' + LOOKS.map(function (l) { return '<button type="button" class="choice" data-look="' + l[0] + '" aria-pressed="' + (S.look === l[0]) + '">' + l[1] + "</button>"; }).join("") +
        '<button type="button" class="choice" id="big" aria-pressed="' + S.big + '">Bigger print</button></div>' +
        '<div class="fit" id="final">' + page(L, S.look, { photos: true, edit: S.edit }) + "</div>" +
        '<div class="row"><button type="button" class="btn" id="print">Print my letter</button><label class="btn ghost" for="ph">' + (S.photos.length ? "Change photos" : "Add photos") + '</label><input type="file" id="ph" accept="image/*" multiple class="sr"><button type="button" class="btn ghost" id="edit" aria-pressed="' + S.edit + '">' + (S.edit ? "Done editing" : "Edit the words myself") + '</button><button type="button" class="btn ghost" id="copy">Copy for email</button><button type="button" class="btn ghost" id="others">See all 3</button></div>' +
        '<div class="changebox"><label class="sr" for="chg">Change one thing</label><input id="chg" maxlength="200" placeholder="Change one thing, like: mention the garden"><button type="button" class="btn" id="chgb">Change it</button></div>' +
        '<div class="row">' + ["Make it shorter", "Make it warmer", "Say more about the grandkids"].map(function (t) { return '<button type="button" class="choice" data-chg="' + t + '">' + t + "</button>"; }).join("") + "</div>" +
        '<div class="tips"><b>Printing tips</b><ol><li>Use plain letter paper (8.5 × 11).</li><li>Print one copy first and check it.</li><li>In the print window, choose "Actual size" or 100%, not "Fit".</li><li>For many copies, change the number of copies in the print window.</li></ol></div>';
    }
    requestAnimationFrame(fitAll);
  }
  function drawPlan() {
    var ks = keys(), ol = $("qs"); ol.innerHTML = "";
    ks.forEach(function (k, i) {
      var li = document.createElement("li"), done = answered(k);
      li.className = (S.phase === "ask" && i === S.at ? "now " : "") + (done ? "done" : S.skipped[k] ? "skip" : "");
      li.innerHTML = '<span class="tick" aria-hidden="true"></span><button type="button" data-q="' + i + '">' + esc(Q[k].label) + (done ? "" : S.skipped[k] ? " (skipped)" : "") + "</button>";
      ol.appendChild(li);
    });
    document.querySelectorAll(".seg button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.depth === S.depth)); });
    var f = facts();
    $("prompt").textContent = "Write a holiday letter from this family, to print on one page.\n\n" + ks.map(function (k) { return "- " + Q[k].label + ": " + (f[k] || (S.skipped[k] ? "(skipped)" : "not asked yet")); }).join("\n") + "\n\nWrite 3 versions: warm, short and sweet, a little funny. Use only these facts. Never invent events, names or places.";
  }
  function drawAll() { drawAsk(); drawOut(); drawPlan(); }

  /* ---------- changes ---------- */
  function change(t) {
    t = (t || "").trim(); if (!t) return;
    var L = S.versions[S.pick]; snap();
    if (/shorter/i.test(t) && aiOff) { var sh = writeLocal()[1]; S.versions[S.pick] = { hello: L.hello, paras: sh.paras, bye: L.bye }; drawAll(); save(); School.toast("Shorter now."); return; }
    lock(true);
    ai({ mode: "change", answers: facts(), letter: L, change: t }).then(function (r) {
      lock(false);
      if (r && r.letter) { S.versions[S.pick] = r.letter; snd("sticker"); School.toast("Done. Only that part changed."); }
      else School.toast(aiOff ? "Tap \"Edit the words myself\" to change any words." : "That didn't work. Try saying it another way.");
      drawAll(); save();
    });
  }
  function readEdits() {
    var pg = document.querySelector("#final .page"); if (!pg || !S.edit) return;
    var L = S.versions[S.pick], paras = [];
    pg.querySelectorAll("[data-f]").forEach(function (el) { var f = el.dataset.f, t = el.innerText.trim(); if (f === "hello") L.hello = t; else if (f === "bye") L.bye = t; else if (t) paras.push(t); });
    L.paras = paras; save();
  }
  function plain() { var L = S.versions[S.pick]; return [L.hello, ""].concat(L.paras.map(function (p) { return p + "\n"; })).concat([L.bye, "", sig()]).join("\n"); }

  /* ---------- events ---------- */
  function wire() {
    $("ask").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      var k = keys()[S.at], c = Q[k];
      if (b.dataset.o) {
        var o = b.dataset.o; snd("pick"); readField(); snap();
        var sel = S.sel[k] || [];
        if (c.multi) { sel = sel.indexOf(o) >= 0 ? sel.filter(function (x) { return x !== o; }) : sel.concat([o]); S.sel[k] = sel; drawAll(); save(); }
        else { S.sel[k] = [o]; if (!c.one) delete S.ans[k]; go(1); }
      } else if (b.id === "next") go(1);
      else if (b.id === "back") go(-1);
      else if (b.id === "skip") { readField(); S.skipped[k] = true; go(1); }
      else if (b.id === "mic") listen(b);
    });
    $("ask").addEventListener("input", function (e) { if (e.target.id === "tx") { var k = keys()[S.at]; if (!Q[k].multi && e.target.value.trim()) S.sel[k] = []; readField(); drawOut(); drawPlan(); save(); } });
    $("qs").addEventListener("click", function (e) {
      var b = e.target.closest("[data-q]"); if (!b) return; snap();
      if (S.phase === "ask") readField();
      S.phase = "ask"; S.at = +b.dataset.q; drawAll(); save(); window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.querySelector(".seg").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return; snap();
      if (S.phase === "ask") readField();
      var cur = keys()[S.at]; S.depth = b.dataset.depth;
      var ix = keys().indexOf(cur); S.at = ix >= 0 ? ix : Math.min(S.at, keys().length - 1);
      if (S.phase !== "ask" && keys().some(function (k) { return !answered(k) && !S.skipped[k]; })) { S.phase = "ask"; S.at = keys().findIndex(function (k) { return !answered(k) && !S.skipped[k]; }); }
      snd("pick"); drawAll(); save();
    });
    $("view").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.pick != null) { snap(); S.pick = +b.dataset.pick; S.edit = false; snd("stamp"); drawAll(); save(); window.scrollTo({ top: 0, behavior: "smooth" }); }
      else if (b.dataset.look) { snap(); S.look = b.dataset.look; snd("pick"); drawOut(); save(); }
      else if (b.id === "big") { snap(); S.big = !S.big; drawOut(); save(); }
      else if (b.id === "edit") { if (S.edit) readEdits(); snap(); S.edit = !S.edit; drawOut(); save(); if (S.edit) School.toast("Tap any line on the letter to change it."); }
      else if (b.id === "print") { readEdits(); snd("share"); window.print(); }
      else if (b.id === "copy") { readEdits(); (navigator.clipboard ? navigator.clipboard.writeText(plain()) : Promise.reject()).then(function () { School.toast("Copied. Paste it into an email."); }, function () { School.toast("Couldn't copy here."); }); }
      else if (b.id === "others") { readEdits(); snap(); S.pick = null; drawAll(); save(); }
      else if (b.id === "chgb") { change($("chg").value); }
      else if (b.dataset.chg) change(b.dataset.chg);
    });
    $("view").addEventListener("input", function (e) { if (e.target.closest && e.target.closest("[contenteditable]")) { clearTimeout(readEdits.t); readEdits.t = setTimeout(function () { readEdits(); fitAll(); }, 400); } });
    $("view").addEventListener("keydown", function (e) { if (e.target.id === "chg" && e.key === "Enter") change(e.target.value); });
    $("view").addEventListener("change", function (e) {
      if (e.target.id !== "ph") return;
      var files = [].slice.call(e.target.files || [], 0, 3); if (!files.length) return; snap();
      Promise.all(files.map(shrink)).then(function (urls) { S.photos = urls; snd("sticker"); drawOut(); save(); });
    });
    $("undo").addEventListener("click", function () {
      if (!hist.length) return; S = JSON.parse(hist.pop()); $("undo").disabled = !hist.length; drawAll(); save(); School.toast("Undone.");
    });
    $("restart").addEventListener("click", function () { snap(); S = fresh(); drawAll(); save(); School.toast("New letter. Tap Undo to get the old one back."); });
    window.addEventListener("resize", function () { clearTimeout(fitAll.t); fitAll.t = setTimeout(fitAll, 120); });
    window.addEventListener("beforeprint", function () { document.querySelectorAll(".page").forEach(function (p) { p.dataset.t = p.style.transform; p.style.transform = "none"; }); });
    window.addEventListener("afterprint", function () { fitAll(); });
  }
  function shrink(file) {
    return new Promise(function (ok) {
      var r = new FileReader(); r.onload = function () {
        var img = new Image(); img.onload = function () { var s = Math.min(1, 900 / Math.max(img.width, img.height)), c = document.createElement("canvas"); c.width = img.width * s; c.height = img.height * s; c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); ok(c.toDataURL("image/jpeg", 0.82)); };
        img.onerror = function () { ok(""); }; img.src = r.result;
      }; r.readAsDataURL(file);
    }).then(function (u) { return u; });
  }
  function listen(b) {
    if (!SR) return;
    if (rec) { rec.stop(); return; }
    var t = $("tx"); rec = new SR(); rec.lang = navigator.language || "en-US"; rec.interimResults = true; rec.continuous = false;
    var base = t.value ? t.value.trim() + " " : "";
    rec.onresult = function (ev) { var s = ""; for (var i = 0; i < ev.results.length; i++) s += ev.results[i][0].transcript; t.value = base + s; readField(); drawOut(); };
    rec.onend = function () { rec = null; b.setAttribute("aria-pressed", "false"); save(); };
    rec.onerror = function () { School.toast("I couldn't hear that. You can type instead."); };
    b.setAttribute("aria-pressed", "true"); rec.start();
  }
  document.addEventListener("DOMContentLoaded", function () {
    wire();
    var s = load();
    S = s ? Object.assign(fresh(), s) : fresh();
    if (S.phase !== "ask" && !S.versions) S.phase = "ask";
    drawAll();
    if (s) School.toast("Welcome back. Your letter is right where you left it.");
  });
})();
