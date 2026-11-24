/* AI Made EZ invitations.
   Journey: say it any way → Claude reads what it can → asks only what's missing (depth: 3 / 6 / 9 questions)
   → the card builds live, Claude's guesses dashed → 3 designs to vote on → change one thing → print, save, copy.
   Claude (POST /api/invite) reads the first message and writes the short lines; every fact stays real text on the page.
   With no AI switched on, the page reads and writes with its own built-in rules, so it always works. */
(function () {
  "use strict";
  var KEY = "smez-ez-invite";
  var Q = {
    who: { label: "Who it's for", ask: "Who is the party for, and how old are they turning?", chips: ["Mia, turning 6", "Dad, turning 50", "Sam and Leo, turning 3"], guess: "" },
    theme: { label: "Theme", ask: "Any theme?", chips: ["Unicorns", "Dinosaurs", "Outer space", "No theme"], guess: "Bright and fun" },
    when: { label: "Date and time", ask: "When is it?", chips: ["Sat, June 14 · 2–4 pm", "Sun, June 15 · 11 am", "Fri, June 20 · 6 pm"], guess: "Saturday · 2 pm" },
    where: { label: "Place", ask: "Where?", chips: ["Our place", "Sunny Park, Pavilion B", "Bounce Town"], guess: "Our place" },
    rsvp: { label: "How to reply", ask: "How should people reply?", chips: ["Text Mom", "Reply to this invite", "Call Dad"], guess: "Text to reply" },
    tone: { label: "Feeling", ask: "What should it feel like?", chips: ["Sweet", "Silly", "Fancy", "Surprise"], guess: "Happy" },
    gifts: { label: "Gifts", ask: "Anything about gifts?", chips: ["No gifts, please", "A book swap", "Skip"], guess: "" },
    dress: { label: "What to wear", ask: "Anything to wear or bring?", chips: ["Wear a costume", "Bring a swimsuit", "Skip"], guess: "" },
    extra: { label: "One more line", ask: "Anything else guests should know?", chips: ["Parents welcome to stay", "Pizza and cake", "Skip"], guess: "" }
  };
  var DEPTH = { quick: ["who", "when", "where"], good: ["who", "theme", "when", "where", "rsvp", "tone"], perfect: ["who", "theme", "when", "where", "rsvp", "tone", "gifts", "dress", "extra"] };
  /* palettes [paper, ink, accent, second accent] per theme and design */
  var PAL = {
    unicorn: { A: ["#fff3f9", "#4a1e5c", "#ff7fbe", "#b28cff"], B: ["#fdf6fb", "#3d2350", "#b9789f"], C: ["#3a1f63", "#ffffff", "#ff9fd0"] },
    dinosaur: { A: ["#f1faee", "#1f3d1a", "#4daa3a", "#f2b84b"], B: ["#f7f4e9", "#2c3a22", "#6f8f3f"], C: ["#183d2a", "#ffffff", "#9be15d"] },
    space: { A: ["#eef2ff", "#1b1f4d", "#4f6fff", "#f5b92e"], B: ["#f4f3fb", "#1d1f45", "#6b74c2"], C: ["#0f1238", "#ffffff", "#ffd34d"] },
    def: { A: ["#fff6ee", "#3a2412", "#f07a3c", "#f5be3a"], B: ["#fbf6ee", "#2b2340", "#b08d55"], C: ["#1f2a5c", "#ffffff", "#ff8a4c"] }
  };
  var COLORS = { pink: ["#fff1f7", "#4a1e3c", "#ff5fa2", "#ffb3d6"], blue: ["#eef5ff", "#132a4d", "#2f7ff0", "#9fd0ff"], green: ["#eefaf1", "#163a22", "#22a35e", "#bfe8a8"], gold: ["#fffaf0", "#3b2a0a", "#c99410", "#f3d27a"], purple: ["#f6f1ff", "#2b1550", "#7d4ff0", "#c9b3ff"], red: ["#fff2f0", "#4a1410", "#dc3b2c", "#ffb199"], black: ["#1b1b1f", "#ffffff", "#e8c26a", "#8a8a95"] };
  var NAMES = { A: "Confetti", B: "Storybook", C: "Big number" };

  var S, $ = function (id) { return document.getElementById(id); };
  function fresh() { return { depth: "good", ans: {}, guessed: {}, phase: "first", step: null, votes: {}, locks: { words: true, look: false }, pick: null, size: "card", over: {}, words: null, photo: null, log: [] }; }
  function save() { try { var c = Object.assign({}, S); delete c.photo; localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} }
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY) || "null"); return s && s.ans ? s : null; } catch (e) { return null; } }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function snd(n) { if (window.SQSound) window.SQSound.play(n); }
  function keys() { return DEPTH[S.depth]; }
  function val(k) { return S.ans[k] != null ? S.ans[k] : (S.guessed[k] ? Q[k].guess : null); }

  /* ---------- Claude, with a built-in fallback ---------- */
  var aiOff = false;
  function ai(body) {
    if (aiOff) return Promise.resolve(null);
    return fetch("/api/invite", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { if (!r.ok && r.status !== 502 && r.status !== 422 && r.status !== 400) aiOff = true; return r.ok ? r.json() : null; })
      .catch(function () { aiOff = true; return null; });
  }
  function readLocal(t) {
    var f = {}, low = t.toLowerCase();
    var STOP = /^(Party|My|Our|The|A|It|For|Birthday|Surprise|Happy|Its|It's|Please|Make|Hi|Hey)$/;
    var re = /\b([A-Z][a-z]+(?:\s+and\s+[A-Z][a-z]+)?|[Dd]ad|[Mm]om|[Gg]randma|[Gg]randpa)\b[^0-9]{0,24}?(\d{1,3})(?!\d)/g, m;
    while ((m = re.exec(t))) { if (!STOP.test(m[1])) { f.who = cap(m[1]); f.age = m[2]; break; } re.lastIndex = m.index + 1; }
    if (!f.who) { var n = t.match(/\b([A-Z][a-z]+)'s\b/); if (n && !STOP.test(n[1])) f.who = n[1]; }
    var at = t.match(/\b(?:at|in)\s+((?:the\s+)?[A-Za-z' ]{3,40}?)(?:[,.!]|$|\s+on\s)/i);
    if (at && !/^(the )?(morning|afternoon|evening|night)$/i.test(at[1].trim())) f.where = cap(at[1].trim());
    [["unicorn", "Unicorns"], ["dino", "Dinosaurs"], ["space", "Outer space"], ["princess", "Princesses"], ["pirate", "Pirates"], ["soccer", "Soccer"], ["mermaid", "Mermaids"], ["superhero", "Superheroes"], ["taylor", "Taylor Swift"]].forEach(function (p) { if (!f.theme && low.indexOf(p[0]) >= 0) f.theme = p[1]; });
    if (/surprise/.test(low)) f.tone = "Surprise";
    return f;
  }
  function themeWord() { var t = (val("theme") || "").replace(/s$/i, ""); return /^(no theme|bright and fun)$/i.test(val("theme") || "") ? "" : t.toLowerCase(); }
  function writeLocal() {
    var t = themeWord(), tone = (val("tone") || "").toLowerCase();
    var party = t ? t + " party" : "party";
    if (tone === "surprise") return [
      { kick: "Shh! It's a surprise for", line: "Come help us shout surprise", close: "Don't tell!" },
      { kick: "A secret celebration for", line: "Please arrive early and keep it quiet", close: "Keep it hush-hush" },
      { kick: "Surprise party", line: "Arrive early. Hide. Shout.", close: "Keep it secret" }];
    if (tone === "fancy") return [
      { kick: "Join the celebration for", line: "An afternoon of " + party + " fun", close: "Dress up a little" },
      { kick: "You are cordially invited to celebrate", line: "A " + party + " with cake and dancing", close: "With love" },
      { kick: "Celebrate with", line: "Cake. Music. Good company.", close: "See you there" }];
    if (tone === "silly") return [
      { kick: "Party alert! It's", line: "Games, giggles and a " + party, close: "Bring your best dance moves" },
      { kick: "Come be silly with", line: "Expect cake and plenty of nonsense", close: "No grown-ups allowed (kidding)" },
      { kick: "Party time", line: "Cake. Games. Chaos.", close: "Be there" }];
    return [
      { kick: "Come party with", line: t ? "Games, cake and lots of " + t + " fun" : "Games, cake and lots of fun", close: "Hope you can come" },
      { kick: "Please join us for", line: "A sweet afternoon " + (t ? "of " + t + "s and cake" : "of cake and smiles"), close: "With love" },
      { kick: "You're invited", line: t ? cap(t) + "s. Cake. Fun." : "Cake. Games. Fun.", close: "Be there" }];
  }

  /* ---------- chat ---------- */
  var chat;
  function say(who, html, chips, keep) {
    var m = document.createElement("div"); m.className = "msg " + (who === "me" ? "me" : "ai");
    m.innerHTML = (who === "me" ? "" : '<div class="who">Claude</div>') + html;
    if (chips && chips.length) {
      var c = document.createElement("div"); c.className = "chips";
      chips.forEach(function (t) { var b = document.createElement("button"); b.type = "button"; b.className = "chip" + (t === "Let Claude pick" || t === "Skip" ? " skip" : ""); b.textContent = t; b.onclick = function () { snd("pick"); answer(t); }; c.appendChild(b); });
      m.appendChild(c);
    }
    chat.appendChild(m); chat.scrollTop = chat.scrollHeight;
    if (keep !== false) { S.log.push([who, html, chips || null]); if (S.log.length > 40) S.log.shift(); }
    return m;
  }
  function typing() { var m = say("ai", "Reading…", null, false); m.classList.add("typing"); return m; }
  function nextQ() { return keys().find(function (k) { return S.ans[k] == null && !S.guessed[k]; }); }
  function ask() {
    var k = nextQ(); S.step = k || null;
    if (!k) { makeVersions(); return; }
    say("ai", esc(Q[k].ask), Q[k].chips.concat(k === "who" ? [] : ["Let Claude pick"]));
    draw(); save();
  }
  function setWho(t) {
    var m = t.match(/^(.*?)[,\s]+(?:turning|turns)?\s*(\d{1,3})\b/i);
    if (m && m[1].trim()) { S.ans.who = m[1].trim(); S.ans.age = m[2]; } else S.ans.who = t;
  }
  function answer(t) {
    t = (t || "").trim(); if (!t || busy) return;
    say("me", esc(t));
    if (S.phase === "first") return first(t);
    if (S.phase === "final") return change(t);
    var k = S.step; if (!k) return;
    if (t === "Let Claude pick") S.guessed[k] = true;
    else if (t === "Skip") S.ans[k] = "";
    else if (k === "who") setWho(t);
    else S.ans[k] = t;
    S.flash = k; snd("tick", Math.min(3, Object.keys(S.ans).length - 1));
    ask();
  }
  var busy = false;
  function lock(on) { busy = on; document.getElementById("app").classList.toggle("busy", on); }
  function first(t) {
    S.phase = "ask"; lock(true); var tm = typing();
    ai({ mode: "read", say: t }).then(function (r) {
      tm.remove(); lock(false);
      var f = (r && r.fields) || readLocal(t);
      var n = 0;
      ["who", "age", "theme", "when", "where", "rsvp", "tone"].forEach(function (k) { if (f[k]) { S.ans[k] = String(f[k]); if (k !== "age") n++; } });
      if (!S.ans.who && t.split(/\s+/).length <= 4) { setWho(t); n++; }
      var left = keys().filter(function (k) { return S.ans[k] == null; }).length;
      say("ai", n ? "Got it. I already know " + n + " thing" + (n > 1 ? "s" : "") + (left ? ". " + left + " quick question" + (left > 1 ? "s" : "") + " left." : ".") : "Let's start with the basics.");
      S.flash = "who"; ask();
    });
  }
  function makeVersions() {
    S.phase = "vote"; S.step = null; lock(true); draw();
    var tm = typing(); tm.lastChild.nodeValue = "Writing 3 versions…";
    ai({ mode: "write", answers: facts() }).then(function (r) {
      tm.remove(); lock(false);
      S.words = (r && r.versions && r.versions.length === 3) ? r.versions : writeLocal();
      var g = keys().filter(function (k) { return S.guessed[k] && S.ans[k] == null; }).length;
      say("ai", "Here are 3 versions" + (g ? ". I picked " + g + " thing" + (g > 1 ? "s" : "") + " for you, shown with a dashed line" : "") + ". Heart the ones you like, then pick one.");
      snd("deal"); draw(); save();
    });
  }
  function facts() {
    var o = {};
    keys().concat(["age"]).forEach(function (k) { var v = val(k); if (v) o[k] = v; });
    return o;
  }
  function change(t) {
    var low = t.toLowerCase(), col = null, sz = null;
    Object.keys(COLORS).forEach(function (c) { if (low.indexOf(c) >= 0) col = c; });
    if (/bigger|larger/.test(low)) sz = 1.12; if (/smaller/.test(low)) sz = 0.9;
    if (col && !/(word|say|line|text)/.test(low)) {
      var c = COLORS[col]; S.over[S.pick] = S.pick === "C" ? [c[1] === "#ffffff" ? c[0] : c[1], c[1] === "#ffffff" ? c[1] : "#ffffff", c[2]] : c;
      say("ai", "Done. Only the colors changed. Your words and layout stayed put."); snd("sticker"); draw(); save(); return;
    }
    if (sz) { S.scale = (S.scale || 1) * sz; say("ai", "Done. Only the size of the words changed."); draw(); save(); return; }
    var w = S.words[ix(S.pick)]; lock(true); var tm = typing(); tm.lastChild.nodeValue = "Changing just that…";
    ai({ mode: "change", answers: facts(), words: w, change: t }).then(function (r) {
      tm.remove(); lock(false);
      if (r && r.words) { S.words[ix(S.pick)] = r.words; say("ai", "Done. I changed only the words you asked about."); snd("sticker"); }
      else say("ai", aiOff ? "Right now I can change colors (\"make it gold\") and size (\"bigger\"). To change the facts, tap a line on the left to answer it again." : "I couldn't make that change just now. Try saying it a different way.");
      draw(); save();
    });
  }
  function ix(s) { return { A: 0, B: 1, C: 2 }[s]; }

  /* ---------- the card ---------- */
  function pal(style) {
    if (S.over[style]) return S.over[style];
    var t = (val("theme") || "").toLowerCase(), key = /unicorn/.test(t) ? "unicorn" : /dino/.test(t) ? "dinosaur" : /space|rocket|planet/.test(t) ? "space" : "def";
    return PAL[key][style];
  }
  function fld(k, cls, text) {
    var v = text != null ? text : val(k); if (!v) return "";
    var g = S.guessed[k] && S.ans[k] == null && S.phase !== "final";
    return '<div class="f ' + cls + (S.flash === k ? " pop" : "") + '"><span' + (g ? ' class="g" title="Claude picked this"' : "") + ">" + esc(v) + "</span></div>";
  }
  function card(style, size) {
    var p = pal(style), who = val("who") || "", age = S.ans.age || "";
    var w = S.words ? S.words[ix(style)] : null;
    var vars = "--p0:" + p[0] + ";--p1:" + p[1] + ";--p2:" + p[2] + ";--p3:" + (p[3] || p[2]) + (S.scale && style === S.pick ? ";font-size:" + (S.scale * 16) + "px" : "");
    var h = '<div class="card s' + style + (size === "sq" ? " sq" : size === "story" ? " story" : "") + '" style="' + vars + '" role="img" aria-label="' + esc(NAMES[style] + " invitation for " + (who || "your party")) + '">';
    if (style === "C" && age) h += '<div class="big" aria-hidden="true">' + esc(age) + "</div>";
    if (S.photo && S.phase === "final" && style === S.pick) h += '<img class="ph" src="' + S.photo + '" alt="">';
    h += '<div class="f k">' + esc(w ? w.kick : "You're invited") + "</div>";
    h += who ? fld("who", "n", style === "C" && age ? who + " turns " + age : who) : '<div class="f n empty">Name</div>';
    if (age && style !== "C") h += fld("age", "a", "turns " + age);
    if (w) h += '<div class="f l">' + esc(w.line) + "</div>";
    else if (themeWord()) h += fld("theme", "l", cap(themeWord()) + " party");
    var d = fld("when", "", null) + fld("where", "", null);
    h += d ? '<div class="f d">' + d.replace(/<div class="f /g, '<div class="') + "</div>" : '<div class="f d empty">Date · place</div>';
    var ex = ["gifts", "dress", "extra"].map(val).filter(function (x) { return x; });
    if (ex.length) h += '<div class="f r">' + esc(ex.join(" · ")) + "</div>";
    if (val("rsvp")) h += fld("rsvp", "r", "RSVP: " + val("rsvp"));
    if (w && w.close) h += '<div class="f r">' + esc(w.close) + "</div>";
    return h + "</div>";
  }

  /* ---------- draw ---------- */
  function draw() {
    var ks = keys(), qs = $("qs"); qs.innerHTML = "";
    ks.forEach(function (k) {
      var li = document.createElement("li");
      var st = S.ans[k] != null ? "done" : S.guessed[k] ? "guess" : S.step === k ? "now" : "";
      li.className = st;
      var v = S.ans[k] != null ? (k === "who" && S.ans.age ? S.ans.who + ", " + S.ans.age : (S.ans[k] || "skipped")) : S.guessed[k] ? "Claude picks" : "";
      li.innerHTML = '<span class="dot" aria-hidden="true"></span><span>' + Q[k].label + '</span><span class="val">' + esc(v) + "</span>";
      if ((st === "done" || st === "guess") && S.phase !== "first") { li.style.cursor = "pointer"; li.title = "Answer again"; li.tabIndex = 0; li.onclick = li.onkeydown = function (e) { if (e.type === "keydown" && e.key !== "Enter") return; redo(k); }; }
      qs.appendChild(li);
    });
    var open = ks.filter(function (k) { return S.ans[k] == null; }).length;
    $("meter").innerHTML = open ? "Without your answers, Claude would guess <b>" + open + "</b> thing" + (open > 1 ? "s" : "") + "." : "<b>0</b> guesses. Claude knows exactly what you want.";
    document.querySelectorAll(".seg button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.depth === S.depth)); });
    $("prompt").textContent = promptText();
    var v = $("view"), tools = $("rtools"); tools.innerHTML = "";
    if (S.phase === "first" || S.phase === "ask" || (S.phase === "vote" && !S.words)) {
      $("rtitle").textContent = "Your card, building live";
      v.innerHTML = '<div class="stage build">' + card("A") + '</div><p class="note">Each answer lands on the card. Dashed words are Claude\'s guesses.</p>';
    } else if (S.phase === "vote") {
      $("rtitle").textContent = "Pick your favorite";
      v.innerHTML = '<div class="versions">' + ["A", "B", "C"].map(function (s) {
        return '<div class="vcol">' + card(s) + '<div class="vbar"><button type="button" class="btn ghost heart" data-v="' + s + '" aria-pressed="' + !!S.votes[s] + '">' + (S.votes[s] ? "♥ Loved" : "♡ Love it") + '</button><button type="button" class="btn" data-pick="' + s + '">Use this</button></div></div>';
      }).join("") + '</div><div class="locks"><span>Remake them, keeping:</span><button type="button" class="chip" data-lock="words" aria-pressed="' + S.locks.words + '">The words</button><button type="button" class="chip" data-lock="look" aria-pressed="' + S.locks.look + '">The colors</button><button type="button" class="btn ghost" id="remake" style="min-height:42px">Make 3 more</button></div>';
    } else {
      $("rtitle").textContent = "Ready to send";
      tools.innerHTML = '<div class="chips" role="group" aria-label="Size">' + [["card", "5×7 print"], ["sq", "Square post"], ["story", "Phone story"]].map(function (z) { return '<button type="button" class="chip" data-size="' + z[0] + '" aria-pressed="' + (S.size === z[0]) + '">' + z[1] + "</button>"; }).join("") + "</div>";
      v.innerHTML = '<div class="stage" id="final">' + card(S.pick, S.size) + '</div><div class="actions"><button class="btn" type="button" id="dl">Save picture</button><button class="btn ghost" type="button" id="pr">Print 5×7</button><button class="btn ghost" type="button" id="cp">Copy the words</button><label class="btn ghost" for="photo">' + (S.photo ? "Change photo" : "Add a photo") + '</label><input type="file" id="photo" accept="image/*" class="sr"><button class="btn ghost" type="button" id="back">See all 3</button></div><p class="sharp"><b>Words stay sharp.</b> They are real text on a designed card, not letters drawn into a picture, so nothing comes out misspelled and it prints clean.</p>';
    }
    S.flash = null;
  }
  function promptText() {
    return "Write the words for a " + ((val("tone") || "friendly").toLowerCase()) + " birthday invitation.\n\n" +
      keys().map(function (k) { var a = S.ans[k]; return "- " + Q[k].label + ": " + (k === "who" && a && S.ans.age ? a + ", turning " + S.ans.age : a != null ? (a || "(leave out)") : S.guessed[k] ? "you choose" : "not asked yet"); }).join("\n") +
      "\n\nMake 3 versions: playful, warm, bold. Short lines only. Never change the name, date or place. The words go on the card as real text, not drawn into an image.";
  }
  function redo(k) {
    delete S.ans[k]; delete S.guessed[k]; if (k === "who") delete S.ans.age;
    S.words = null; S.phase = "ask"; S.pick = null; say("ai", "Sure, let's redo that one."); ask();
  }

  /* ---------- save / print / copy ---------- */
  function words() {
    var w = S.words[ix(S.pick)], who = val("who") || "", age = S.ans.age;
    return [w.kick, who + (age ? " turns " + age : ""), w.line, [val("when"), val("where")].filter(Boolean).join(" · "), ["gifts", "dress", "extra"].map(val).filter(Boolean).join(" · "), val("rsvp") ? "RSVP: " + val("rsvp") : "", w.close].filter(Boolean).join("\n");
  }
  function loadH2C() {
    if (window.html2canvas) return Promise.resolve();
    return new Promise(function (ok, no) { var s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  }
  function download() {
    var el = document.querySelector("#final .card"); if (!el) return;
    School.toast("Making your picture…");
    loadH2C().then(function () { return document.fonts ? document.fonts.ready : null; }).then(function () {
      return window.html2canvas(el, { scale: 1500 / el.offsetWidth, backgroundColor: null, useCORS: true });
    }).then(function (cv) {
      cv.toBlob(function (b) {
        var name = ((val("who") || "party").replace(/[^a-z0-9]+/gi, "-") + "-invitation.png").toLowerCase();
        var file = new File([b], name, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] }) && /Mobi|Android|iPhone/i.test(navigator.userAgent)) { navigator.share({ files: [file] }).catch(function () {}); return; }
        var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000); snd("share");
      }, "image/png");
    }).catch(function () { School.toast("Couldn't make the picture. Try Print instead."); });
  }

  /* ---------- events ---------- */
  function wire() {
    chat = $("chat");
    $("compose").addEventListener("submit", function (e) { e.preventDefault(); var i = $("say"); answer(i.value); i.value = ""; });
    document.querySelector(".seg").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b || busy) return; S.depth = b.dataset.depth; snd("pick");
      if (S.phase !== "first" && nextQ()) { if (S.phase !== "ask") { S.phase = "ask"; S.words = null; S.pick = null; say("ai", "More detail, nice. A few more questions."); } ask(); return; }
      draw(); save();
    });
    $("view").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b || busy) return;
      if (b.dataset.v) { S.votes[b.dataset.v] = !S.votes[b.dataset.v]; if (S.votes[b.dataset.v]) snd("sticker"); draw(); save(); }
      else if (b.dataset.pick) { S.pick = b.dataset.pick; S.phase = "final"; S.scale = 1; snd("stamp"); say("ai", "Great pick. Want to change one thing? Tell me, and only that part changes.", ["Make it gold", "Make it pink", "Make the words bigger"]); draw(); save(); }
      else if (b.dataset.lock) { S.locks[b.dataset.lock] = !S.locks[b.dataset.lock]; draw(); save(); }
      else if (b.id === "remake") remake();
      else if (b.id === "dl") download();
      else if (b.id === "pr") window.print();
      else if (b.id === "cp") { var t = words(); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { School.toast("Copied. Paste it into a text or email."); }, function () { School.toast("Couldn't copy here."); }); }
      else if (b.id === "back") { S.phase = "vote"; S.pick = null; draw(); save(); }
    });
    $("view").addEventListener("change", function (e) {
      if (e.target.id !== "photo" || !e.target.files[0]) return;
      var r = new FileReader(); r.onload = function () {
        var img = new Image(); img.onload = function () { var c = document.createElement("canvas"), s = 600 / Math.max(img.width, img.height); c.width = img.width * Math.min(1, s); c.height = img.height * Math.min(1, s); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); S.photo = c.toDataURL("image/jpeg", 0.85); snd("sticker"); draw(); };
        img.src = r.result;
      }; r.readAsDataURL(e.target.files[0]);
    });
    $("rtools").addEventListener("click", function (e) { var b = e.target.closest("[data-size]"); if (b) { S.size = b.dataset.size; snd("pick"); draw(); save(); } });
    $("restart").addEventListener("click", function () { try { localStorage.removeItem(KEY); } catch (e) {} S = fresh(); chat.innerHTML = ""; start(); });
  }
  function remake() {
    if (!S.locks.look) ["A", "B", "C"].forEach(function (s) { var names = Object.keys(COLORS).filter(function (c) { return c !== "black"; }); var c = COLORS[names[Math.floor(Math.random() * names.length)]]; S.over[s] = s === "C" ? [c[1], "#ffffff", c[3]] : c; });
    if (S.locks.words) { say("ai", "3 more, same words" + (S.locks.look ? " and colors" : ", new colors") + "."); snd("deal"); draw(); save(); return; }
    lock(true); var tm = typing(); tm.lastChild.nodeValue = "Writing 3 new versions…";
    ai({ mode: "write", answers: facts() }).then(function (r) {
      tm.remove(); lock(false);
      if (r && r.versions && r.versions.length === 3) S.words = r.versions;
      else { var l = writeLocal(); S.words = [l[1], l[2], l[0]]; }
      say("ai", "3 more" + (S.locks.look ? ", same colors" : "") + "."); snd("deal"); draw(); save();
    });
  }
  function start() {
    say("ai", "What are we celebrating? Say it any way you like.", ["Mia turns 6, unicorn party", "Dad's 50th, surprise party", "Sam and Leo turn 3, dinosaurs"]);
    draw();
  }
  document.addEventListener("DOMContentLoaded", function () {
    wire();
    var s = load();
    if (s) {
      S = Object.assign(fresh(), s);
      S.log.forEach(function (m) { say(m[0], m[1], null, false); });
      if (S.phase === "vote" && !S.words) S.words = writeLocal();
      say("ai", "Welcome back. Your invitation is right where you left it.", null, false);
      if (S.phase === "ask") ask(); else draw();
    } else { S = fresh(); start(); }
  });
})();
