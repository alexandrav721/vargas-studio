/* AI Made EZ one-tap planners: Tell me (voice or tap) → Make it better (skippable questions) → Watch it build (live NDJSON) → Keep it.
   One file for all four planners; the page says which with <body data-ez="meals|week|party|trip">.
   Test flags (harmless, nothing saved): ?demo=1 fills sample answers and builds; ?demo=q opens the first question; &stop=N pauses the drawing after N pieces. */
(function () {
  "use strict";
  var TYPE = document.body.getAttribute("data-ez");
  var app = document.getElementById("app");
  var QS = new URLSearchParams(location.search);
  var DEMO = QS.get("demo"), STOP = Math.max(0, Number(QS.get("stop") || 0));
  var KEY = "smez-ez-" + TYPE;
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  /* sound only after the person has tapped something */
  var tapped = false;
  ["pointerdown", "keydown"].forEach(function (ev) { window.addEventListener(ev, function () { tapped = true; }, true); });
  function snd(name, n) { if (tapped && window.SQSound) window.SQSound.play(name, n); }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function h(tag, cls, html) { var el = document.createElement(tag); if (cls) el.className = cls; if (html != null) el.innerHTML = html; return el; }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* this visit only */ } }
  var MIC = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>';

  /* ---------- the four planners ---------- */
  var CFG = {
    meals: {
      name: "meal plan and grocery list", h1: "Plan my meals",
      groups: [
        { key: "people", label: "People", opts: ["1", "2", "3", "4", "5+"] },
        { key: "nights", label: "Nights", opts: ["3", "5", "7"] },
        { key: "minutes", label: "Minutes", opts: ["15", "30", "45", "60"] }
      ],
      qs: [
        { key: "fridge", q: "What's in your fridge?", opts: ["Chicken", "Eggs", "Rice", "Pasta", "Veggies"], multi: true, text: "Anything else" },
        { key: "never", q: "Any allergies or never-foods?", opts: ["Nuts", "Dairy", "Gluten", "Fish", "Pork"], multi: true, text: "Others" },
        { key: "budget", q: "Budget for the week?", opts: ["Tight", "Normal", "Treat us"] },
        { key: "picky", q: "Any picky eaters?", opts: ["Kids", "A picky adult", "No"], text: "What they won't eat" },
        { key: "leftovers", q: "Leftovers okay?", opts: ["Yes, love them", "No, fresh each night"] }
      ],
      sections: "a card for each night with the dinner and cooking time, then one grocery checklist grouped by aisle",
      safety: "Leave out anything I'm allergic to or never eat, and say so at the top.",
      demo: { a: { say: "Easy dinners for the four of us, nothing too fancy", people: ["4"], nights: ["7"], minutes: ["30"] }, d: { fridge: ["Chicken", "Eggs", "Rice"], never: ["Nuts"], leftovers: ["Yes, love them"] } }
    },
    week: {
      name: "plan for my week", h1: "Plan my week",
      groups: [
        { key: "busy", label: "Busy days", opts: DAYS, multi: true },
        { key: "goals", label: "Goals", opts: ["Work", "Health", "Home", "Family", "Rest"], multi: true },
        { key: "energy", label: "Energy", opts: ["Low", "OK", "High"] }
      ],
      qs: [
        { key: "musts", q: "Must-dos with times?", text: "Team call Thu 10 am" },
        { key: "calls", q: "Anyone to call or see?", opts: ["Mom", "A friend", "My partner"], multi: true, text: "Who" },
        { key: "foryou", q: "One thing just for you?", opts: ["Walk", "Read", "Gym", "Nap", "A hobby"], text: "Something else" },
        { key: "best", q: "When do you work best?", opts: ["Morning", "Afternoon", "Evening"] }
      ],
      sections: "a color-blocked Monday to Sunday grid of time blocks labeled work, life, you and people, plus my top 3 for the week",
      safety: "Leave gaps; don't fill every hour.",
      demo: { a: { say: "Big report due Wednesday and Mom's birthday is coming up", busy: ["Tue", "Wed"], goals: ["Work", "Health"], energy: ["OK"] }, d: { calls: ["Mom"], foryou: ["Walk"], best: ["Morning"] } }
    },
    party: {
      name: "party plan", h1: "Plan a party",
      groups: [
        { key: "occasion", label: "What", opts: ["Birthday", "Holiday", "Shower", "Game night", "Other"] },
        { key: "guests", label: "Guests", opts: ["Under 10", "10 to 25", "25+"] },
        { key: "when", label: "When", opts: ["This week", "In 2 weeks", "A month+"] },
        { key: "budget", label: "Budget", opts: ["$", "$$", "$$$"] }
      ],
      qs: [
        { key: "who", q: "Kids, adults, or both?", opts: ["Kids", "Adults", "Both"] },
        { key: "theme", q: "A theme?", opts: ["No theme", "Colors", "Movie", "Decade"], text: "Your idea" },
        { key: "food", q: "What kind of food?", opts: ["Snacks", "Buffet", "Sit-down", "Potluck", "BBQ"] },
        { key: "place", q: "Inside or outside?", opts: ["Inside", "Outside", "Both"] },
        { key: "helpers", q: "Who's helping?", opts: ["Just me", "My partner", "Family", "Friends"], multi: true, text: "Names" }
      ],
      sections: "a countdown timeline from 2 weeks before to the day of, a shopping checklist, and a day-of run sheet with times",
      safety: "If it's a kids' party, no alcohol.",
      demo: { a: { say: "My daughter Maya turns 7, dinosaurs, in the backyard", occasion: ["Birthday"], guests: ["10 to 25"], when: ["In 2 weeks"], budget: ["$$"] }, d: { who: ["Kids"], theme: ["Dinosaurs"], place: ["Outside"] } }
    },
    trip: {
      name: "trip itinerary", h1: "Plan a trip",
      groups: [
        { key: "where", label: "Where", text: "City" },
        { key: "days", label: "Days", opts: ["2", "3", "5", "7"] },
        { key: "who", label: "Who", opts: ["Just me", "Couple", "Family", "Friends"] },
        { key: "pace", label: "Pace", opts: ["Slow", "Easy", "Full"] }
      ],
      qs: [
        { key: "musts", q: "Anything you must see?", text: "Places or things" },
        { key: "budget", q: "Budget per day, each?", opts: ["$50", "$100", "$200", "$300+"] },
        { key: "area", q: "Where are you staying?", text: "Hotel or area" },
        { key: "food", q: "Food you love?", opts: ["Local", "Seafood", "Vegetarian", "Street food", "Sweets"], multi: true, text: "Something else" },
        { key: "mobility", q: "How much walking is okay?", opts: ["Lots", "Some", "Little", "Step-free please"] }
      ],
      sections: "day-by-day timeline cards (morning, afternoon, evening, the area, and a tip), a packing checklist, and a 'check before you go' list",
      safety: "One area per day. Mark opening hours and prices as 'check before you go'.",
      demo: { a: { say: "First time in Portugal, we love good food and views", where: "Lisbon", days: ["3"], who: ["Couple"], pace: ["Easy"] }, d: { food: ["Seafood", "Sweets"], mobility: ["Some"] } }
    }
  }[TYPE];
  if (!CFG || !app) return;

  /* answers: { key: { c: [chips], t: "text" } } */
  var S = { a: {}, d: {}, lines: [], sample: false };
  function slot(store, key) { return store[key] || (store[key] = { c: [], t: "" }); }
  function val(v) { if (!v) return ""; return v.c.concat(v.t ? [v.t.trim()] : []).filter(Boolean).join(", "); }
  function flat(store) { var o = {}; Object.keys(store).forEach(function (k) { var s = val(store[k]); if (s) o[k] = s; }); return o; }
  function setDemo() {
    S.a = {}; S.d = {};
    [["a", CFG.demo.a], ["d", CFG.demo.d]].forEach(function (p) {
      Object.keys(p[1]).forEach(function (k) { var v = p[1][k]; S[p[0]][k] = Array.isArray(v) ? { c: v.slice(), t: "" } : { c: [], t: v }; });
    });
  }

  var samples = fetch("samples.json").then(function (r) { return r.json(); }).catch(function () { return null; });

  /* ---------- voice: the browser's own speech-to-text ---------- */
  var active = null;
  function wireMic(btn, field, labelEl, noteEl) {
    var idle = labelEl ? labelEl.textContent : "";
    function say(t) { if (noteEl) noteEl.textContent = t; }
    function off() { btn.setAttribute("aria-pressed", "false"); if (labelEl) labelEl.textContent = idle; }
    btn.addEventListener("click", function () {
      if (!SR) { field.focus(); if (labelEl) labelEl.textContent = "Type it here"; else say("Type it here"); return; }
      if (active && active.btn === btn) { active.rec.stop(); return; }
      if (active) active.rec.stop();
      var rec = new SR(), base = field.value.trim() ? field.value.trim() + " " : "", max = Number(field.getAttribute("maxlength")) || 600;
      rec.lang = navigator.language || "en-US"; rec.interimResults = true; rec.continuous = true;
      rec.onresult = function (e) {
        var heard = "";
        for (var i = 0; i < e.results.length; i++) heard += e.results[i][0].transcript;
        field.value = (base + heard.trim()).slice(0, max);
        field.dispatchEvent(new Event("input", { bubbles: true }));
      };
      rec.onerror = function (e) {
        if (e.error === "not-allowed" || e.error === "service-not-allowed") { say("The mic is off for this page. Type it here."); field.focus(); }
        else if (e.error === "no-speech") say("I didn't hear anything. Tap and try again.");
        else if (e.error !== "aborted") say("Voice stopped. You can type too.");
      };
      rec.onend = function () { off(); if (active && active.rec === rec) active = null; };
      try { rec.start(); } catch (err) { field.focus(); say("Type it here"); return; }
      active = { rec: rec, btn: btn };
      btn.setAttribute("aria-pressed", "true"); say("");
      if (labelEl) labelEl.textContent = "Listening. Tap to stop.";
      snd("pick");
    });
  }
  function stopMic() { if (active) { try { active.rec.stop(); } catch (e) {} active = null; } }

  /* chips: single or multi choice, stored in a slot */
  function chipsHTML(opts, chosen) {
    return opts.map(function (o) { return '<button type="button" class="chip" aria-pressed="' + (chosen.indexOf(o) >= 0) + '" data-v="' + esc(o) + '">' + esc(o) + "</button>"; }).join("");
  }
  function wireChips(box, v, multi, onchange) {
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-v]"); if (!b) return;
      var x = b.getAttribute("data-v"), i = v.c.indexOf(x);
      if (multi) { if (i >= 0) v.c.splice(i, 1); else v.c.push(x); }
      else v.c = i >= 0 ? [] : [x];
      box.querySelectorAll("button[data-v]").forEach(function (c) { c.setAttribute("aria-pressed", String(v.c.indexOf(c.getAttribute("data-v")) >= 0)); });
      snd("pick"); if (onchange) onchange();
    });
  }
  function focusTop() { var t = app.querySelector("h1,h2"); if (t) { t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); } window.scrollTo(0, 0); }

  /* ---------- beat 2: tell me ---------- */
  function tell() {
    stopMic();
    var say = slot(S.a, "say");
    app.innerHTML = '<h1 class="step">' + CFG.h1 + "</h1>" +
      '<div class="talk"><button type="button" class="mic" id="mic" aria-pressed="false" aria-labelledby="mic-l">' + MIC + '</button><span class="mic-l" id="mic-l">Tap to talk</span>' +
      '<textarea class="say" id="say" maxlength="600" placeholder="Or type here" aria-label="What do you need?">' + esc(say.t) + "</textarea>" +
      '<p class="note" id="note" role="status" aria-live="polite"></p></div>' +
      '<div class="groups">' + CFG.groups.map(function (g) {
        var v = slot(S.a, g.key);
        return '<div class="group" role="group" aria-labelledby="g-' + g.key + '"><p class="label" id="g-' + g.key + '">' + g.label + '</p><div class="chips" data-k="' + g.key + '">' +
          (g.opts ? chipsHTML(g.opts, v.c) : '<input type="text" maxlength="120" id="t-' + g.key + '" placeholder="' + esc(g.text) + '" aria-labelledby="g-' + g.key + '" value="' + esc(v.t) + '">') + "</div></div>";
      }).join("") + "</div>" +
      '<div class="btns"><button type="button" class="btn" id="next" style="width:100%">Next</button></div>';
    var field = app.querySelector("#say");
    field.addEventListener("input", function () { say.t = field.value; });
    wireMic(app.querySelector("#mic"), field, app.querySelector("#mic-l"), app.querySelector("#note"));
    CFG.groups.forEach(function (g) {
      var box = app.querySelector('.chips[data-k="' + g.key + '"]'), v = slot(S.a, g.key);
      if (g.opts) wireChips(box, v, g.multi);
      else box.querySelector("input").addEventListener("input", function (e) { v.t = e.target.value; });
    });
    app.querySelector("#next").onclick = function () {
      if (!Object.keys(flat(S.a)).length) { app.querySelector("#note").textContent = "Tell me one thing first."; field.focus(); return; }
      stopMic(); snd("pick"); question(0);
    };
  }

  /* ---------- beat 3: make it better ---------- */
  function answered() { return CFG.qs.filter(function (q) { return val(S.d[q.key]); }).length; }
  function meterHTML() {
    var n = answered(), tot = CFG.qs.length, word = n <= 1 ? "Good" : n < tot - 1 ? "Great" : "Perfect";
    var segs = ""; for (var i = 0; i < tot; i++) segs += "<i" + (i < n ? ' class="on"' : "") + "></i>";
    return '<span>Detail</span><span class="segs" aria-hidden="true">' + segs + '</span><output aria-live="polite">' + word + "</output>";
  }
  function question(i) {
    stopMic();
    var q = CFG.qs[i], v = slot(S.d, q.key), last = i === CFG.qs.length - 1;
    app.innerHTML = '<p class="muted">You don\'t have to. The more you tell me, the better it gets.</p>' +
      '<div class="meter" id="meter">' + meterHTML() + "</div>" +
      '<div class="qcard step"><p class="count">' + (i + 1) + " of " + CFG.qs.length + "</p><h2>" + esc(q.q) + "</h2>" +
      (q.opts ? '<div class="chips" id="qc">' + chipsHTML(q.opts, v.c) + "</div>" : "") +
      (q.text ? '<div class="say-row"><input type="text" id="qt" maxlength="200" placeholder="' + esc(q.text) + '" aria-label="' + esc(q.q) + '" value="' + esc(v.t) + '"><button type="button" class="mic small" id="qm" aria-pressed="false" aria-label="Say it">' + MIC + "</button></div>" : "") +
      '<p class="note" id="qn" role="status" aria-live="polite"></p>' +
      '<div class="qnav"><button type="button" class="btn ghost" id="skip">Skip</button><button type="button" class="btn" id="go">' + (last ? "Make my plan" : "Next") + "</button></div></div>" +
      '<button type="button" class="skipall" id="all">Skip all, make it</button>';
    function meter() { app.querySelector("#meter").innerHTML = meterHTML(); }
    if (q.opts) wireChips(app.querySelector("#qc"), v, q.multi, meter);
    var t = app.querySelector("#qt");
    if (t) { t.addEventListener("input", function () { v.t = t.value; meter(); }); wireMic(app.querySelector("#qm"), t, null, app.querySelector("#qn")); }
    function next() { stopMic(); if (last) build(); else question(i + 1); }
    app.querySelector("#skip").onclick = function () { if (!q.multi && !q.text) v.c = []; next(); };
    app.querySelector("#go").onclick = function () { snd("pick"); next(); };
    app.querySelector("#all").onclick = function () { stopMic(); build(); };
    if (i > 0 || tapped) focusTop();
  }

  /* ---------- the renderer: draws one piece at a time ---------- */
  var uid = 0;
  function check(item) { var id = "ck" + (++uid); return '<li><label for="' + id + '"><input type="checkbox" id="' + id + '"><span>' + esc(item) + "</span></label></li>"; }
  function Painter(root, opts) {
    var n = 0, secs = {};
    function sec(id, title, extra) {
      if (secs[id]) return secs[id];
      var s = h("section", "psec drop", "<h2>" + title + "</h2>" + (extra || ""));
      root.appendChild(s); secs[id] = s; return s;
    }
    function put(parent, el, line) {
      if (!opts.instant) el.classList.add("drop");
      if (opts.prev && !opts.prev[JSON.stringify(line)]) el.classList.add("changed");
      parent.appendChild(el);
    }
    function list(cls) { return h("ul", "checks" + (cls ? " " + cls : "")); }
    var R = {
      title: function (l) { var t = root.querySelector("h1") || root.insertBefore(h("h1"), root.firstChild); t.textContent = l.text; },
      why: function (l) { var w = root.querySelector(".why") || h("p", "why"); w.innerHTML = "<b>Why this works</b>" + esc(l.text); var t = root.querySelector("h1"); root.insertBefore(w, t ? t.nextSibling : root.firstChild); },
      meals: {
        day: function (l) { var s = sec("days", "Dinners", '<div class="days"></div>'); put(s.querySelector(".days"), h("div", "dcard", '<div class="dn">' + esc(l.day) + (l.mins ? "<span>" + esc(l.mins) + " min</span>" : "") + '</div><div class="dish">' + esc(l.dish) + "</div>" + ((l.uses || []).length ? '<div class="tags">' + l.uses.map(function (u) { return "<i>uses " + esc(u) + "</i>"; }).join("") + "</div>" : "")), l); },
        shop: function (l) { var s = sec("shop", "Grocery list"); var a = h("div", "aisle", "<h3>" + esc(l.aisle) + "</h3>"); var ul = list(); ul.innerHTML = (l.items || []).map(check).join(""); a.appendChild(ul); put(s, a, l); }
      },
      week: {
        top3: function (l) { var s = sec("top3", "Top 3 this week"); var ol = h("ol", "top3", (l.items || []).slice(0, 3).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("")); put(s, ol, l); },
        block: function (l) {
          var s = sec("week", "Your week", '<p class="legend"><span class="k-work">Work</span><span class="k-life">Life</span><span class="k-you">You</span><span class="k-people">People</span></p><div class="wgrid"></div>');
          var grid = s.querySelector(".wgrid"), di = DAYS.indexOf(String(l.day).slice(0, 3)), col = grid.querySelector('[data-d="' + di + '"]');
          if (!col) {
            col = h("div", "wday", "<b>" + esc(DAYS[di] || l.day) + '</b><div class="wblocks"></div>'); col.setAttribute("data-d", di);
            var after = Array.prototype.find.call(grid.children, function (c) { return Number(c.getAttribute("data-d")) > di; });
            if (!opts.instant) col.classList.add("drop");
            grid.insertBefore(col, after || null);
          }
          var kind = ["work", "life", "you", "people"].indexOf(l.kind) >= 0 ? l.kind : "life";
          put(col.querySelector(".wblocks"), h("div", "blk k-" + kind, "<small><span>" + esc(l.start) + "–" + esc(l.end) + "</span><span>" + kind[0].toUpperCase() + kind.slice(1) + "</span></small>" + esc(l.what)), l);
        }
      },
      party: {
        when: function (l) { var s = sec("count", "Countdown", '<ul class="tl"></ul>'); var li = h("li", "", "<h3>" + esc(l.when) + "</h3>"); var ul = list(); ul.innerHTML = (l.todo || []).map(check).join(""); li.appendChild(ul); put(s.querySelector(".tl"), li, l); },
        shop: function (l) { var s = sec("shop", "Shopping list"); var a = h("div", "aisle", "<h3>" + esc(l.aisle) + "</h3>"); var ul = list(); ul.innerHTML = (l.items || []).map(check).join(""); a.appendChild(ul); put(s, a, l); },
        run: function (l) { var s = sec("run", "On the day", '<ul class="run"></ul>'); put(s.querySelector(".run"), h("li", "", "<b>" + esc(l.time) + "</b><span>" + esc(l.what) + "</span>"), l); }
      },
      trip: {
        day: function (l) {
          var s = sec("days", "Day by day");
          put(s, h("article", "tcard", "<header><b>Day " + esc(l.n) + "</b><span>" + esc(l.area) + "</span></header>" +
            [["Morning", l.morning], ["Afternoon", l.afternoon], ["Evening", l.evening]].filter(function (p) { return p[1]; }).map(function (p) { return '<div class="tod"><b>' + p[0] + "</b><span>" + esc(p[1]) + "</span></div>"; }).join("") +
            (l.tip ? '<p class="tip"><b>Tip</b>' + esc(l.tip) + "</p>" : "")), l);
        },
        pack: function (l) { var s = sec("pack", "Packing list"); var ul = list(); ul.innerHTML = (l.items || []).map(check).join(""); put(s, ul, l); },
        check: function (l) { var s = sec("check", "Check before you go"); var ul = list("warn"); ul.innerHTML = (l.items || []).map(check).join(""); put(s, ul, l); }
      }
    };
    return function draw(l) {
      var f = l.k === "title" || l.k === "why" ? R[l.k] : R[TYPE][l.k];
      if (!f) return false;
      f(l); n++;
      if (!opts.instant && l.k !== "title") snd("tick", n % 4);
      return true;
    };
  }

  /* plain-text checklist for copy */
  function asText(lines) {
    var out = [], last = "";
    function head(t) { if (last !== t) { out.push("", t.toUpperCase()); last = t; } }
    lines.forEach(function (l) {
      if (l.k === "title") out.push(l.text);
      else if (l.k === "why") out.push("Why this works: " + l.text);
      else if (TYPE === "meals" && l.k === "day") { head("Dinners"); out.push("[ ] " + l.day + ": " + l.dish + (l.mins ? " (" + l.mins + " min)" : "")); }
      else if (l.k === "shop") { head(TYPE === "meals" ? "Grocery list" : "Shopping list"); out.push(l.aisle + ":"); (l.items || []).forEach(function (x) { out.push("[ ] " + x); }); }
      else if (l.k === "top3") { head("Top 3 this week"); (l.items || []).forEach(function (x, i) { out.push("[ ] " + (i + 1) + ". " + x); }); }
      else if (l.k === "block") { head("Your week"); out.push("[ ] " + l.day + " " + l.start + "-" + l.end + ": " + l.what + " (" + l.kind + ")"); }
      else if (l.k === "when") { head("Countdown"); out.push(l.when + ":"); (l.todo || []).forEach(function (x) { out.push("[ ] " + x); }); }
      else if (l.k === "run") { head("On the day"); out.push("[ ] " + l.time + ": " + l.what); }
      else if (TYPE === "trip" && l.k === "day") { head("Day by day"); out.push("Day " + l.n + ", " + l.area); ["morning", "afternoon", "evening"].forEach(function (p) { if (l[p]) out.push("[ ] " + p[0].toUpperCase() + p.slice(1) + ": " + l[p]); }); if (l.tip) out.push("Tip: " + l.tip); }
      else if (l.k === "pack") { head("Packing list"); (l.items || []).forEach(function (x) { out.push("[ ] " + x); }); }
      else if (l.k === "check") { head("Check before you go"); (l.items || []).forEach(function (x) { out.push("[ ] " + x); }); }
    });
    return out.join("\n").trim() + "\n";
  }

  /* the same order, written for Claude to make as a visual */
  function claudeURL() {
    var labels = {}; CFG.groups.forEach(function (g) { labels[g.key] = g.label; }); CFG.qs.forEach(function (q) { labels[q.key] = q.q.replace(/\?$/, ""); });
    var facts = [], a = flat(S.a), d = flat(S.d);
    if (a.say) facts.push("In my words: " + a.say);
    Object.keys(a).forEach(function (k) { if (k !== "say") facts.push(labels[k] + ": " + a[k]); });
    Object.keys(d).forEach(function (k) { facts.push(labels[k] + ": " + d[k]); });
    var order = "Please make me a " + CFG.name + " as a visual (an artifact) I can print, with " + CFG.sections + ". Start with one line on why the plan works. " + CFG.safety + " Use plain, short words.\n\nAbout me:\n- " + facts.join("\n- ");
    return "https://claude.ai/new?q=" + encodeURIComponent(order.slice(0, 1800));
  }

  /* ---------- beat 4: watch it build ---------- */
  function planShell(opts) {
    app.innerHTML = (opts.again ? '<div class="again"><span class="muted">Your last plan</span><button type="button" class="btn" id="new">Make a new one</button></div>' : "") +
      '<p class="status" id="status" role="status" aria-live="polite"' + (opts.instant ? " hidden" : "") + '><span class="dot" aria-hidden="true"></span><span id="st">Building your plan…</span></p>' +
      '<div class="plan" id="plan"><div id="pbody"></div></div><div id="after"></div>';
    if (opts.again) app.querySelector("#new").onclick = function () { snd("pick"); S.a = {}; S.d = {}; tell(); focusTop(); };
    var plan = app.querySelector("#pbody");
    if (opts.sample) plan.parentNode.insertBefore(h("div", "samplebar", 'Sample plan. Live plans switch on soon.<a class="btn" target="_blank" rel="noopener" href="' + esc(claudeURL()) + '">Open in Claude</a>'), plan);
    return plan;
  }
  function status(t, done) { var s = app.querySelector("#status"); if (!s) return; s.hidden = false; app.querySelector("#st").textContent = t; var d = s.querySelector(".dot"); if (d) d.hidden = !!done; }
  function fail(t, retry) {
    var a = app.querySelector("#after") || app;
    var e = h("div", "err", esc(t)); a.appendChild(e);
    if (retry) { var b = h("button", "btn ghost", "Try again"); b.type = "button"; b.style.marginTop = "10px"; b.onclick = retry; e.appendChild(h("br")); e.appendChild(b); }
    status("", true); var s = app.querySelector("#status"); if (s) s.hidden = true;
  }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function playSample(change) {
    return samples.then(function (all) {
      var lines = all && all[TYPE];
      if (!lines) { fail("I can't reach the planner. Check your connection and try again.", function () { build(change); }); return; }
      S.sample = true; S.lines = [];
      var draw = Painter(planShell({ sample: true }), {}), i = 0;
      function step() {
        if (i >= lines.length || (STOP && i >= STOP)) { if (!STOP || i < STOP) finish(); return; }
        var l = lines[i++];
        if (l.k !== "done") { S.lines.push(l); draw(l); }
        wait(110).then(step);
      }
      step();
    });
  }

  function build(change) {
    stopMic();
    var prevLines = S.lines.slice(), prev = null;
    if (change) { prev = {}; prevLines.forEach(function (l) { prev[JSON.stringify(l)] = 1; }); }
    var body = { type: TYPE, answers: flat(S.a), details: flat(S.d) };
    if (change) { body.change = change; body.plan = { lines: prevLines }; }
    var root = planShell({}), draw = Painter(root, { prev: prev }), got = [], ended = false;
    if (tapped) focusTop();
    function restore(msg) {
      S.lines = prevLines; var r = planShell({ instant: true }); var d = Painter(r, { instant: true }); prevLines.forEach(d);
      if (S.sample) r.parentNode.insertBefore(h("div", "samplebar", 'Sample plan. Live plans switch on soon.<a class="btn" target="_blank" rel="noopener" href="' + esc(claudeURL()) + '">Open in Claude</a>'), r);
      keep(); fail(msg);
    }
    fetch("/api/ez", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then(function (res) {
      if (res.status === 503 || res.status === 404 || res.status === 405) {
        if (change) return restore("Changes switch on with live plans. Open in Claude to change it there.");
        return playSample();
      }
      if (!res.ok || !res.body) {
        return res.json().catch(function () { return {}; }).then(function (j) {
          var msg = j.error || "Something went wrong. Try again in a moment.";
          if (change) return restore(msg);
          fail(msg, res.status === 429 ? null : function () { build(); });
        });
      }
      S.sample = false;
      var reader = res.body.getReader(), dec = new TextDecoder(), buf = "";
      function line(t) {
        t = t.trim(); if (!t || ended) return;
        var l; try { l = JSON.parse(t); } catch (e) { return; }
        if (!l || typeof l.k !== "string") return;
        if (l.k === "done") { ended = true; return; }
        if (l.k === "error") { ended = true; var why = { refused: "I can't make that plan. Try different words.", too_long: "That plan got too long. Try fewer days or nights.", busy: "The planner is busy. Try again in a minute." }[l.why] || "Something went wrong. Try again."; if (change) restore(why); else fail(why, function () { build(); }); return; }
        if (draw(l)) got.push(l);
        if (STOP && got.length >= STOP) { ended = true; reader.cancel().catch(function () {}); }
      }
      function pump() {
        return reader.read().then(function (r) {
          if (r.value) { buf += dec.decode(r.value, { stream: true }); var parts = buf.split("\n"); buf = parts.pop(); parts.forEach(line); }
          if (r.done) { line(buf); buf = ""; }
          if (r.done || ended) {
            if (STOP && got.length >= STOP) return;
            if (app.querySelector(".err")) return;
            if (!got.length) return change ? restore("Nothing came back. Try again.") : fail("Nothing came back. Try again.", function () { build(); });
            S.lines = got; finish(change);
            return;
          }
          return pump();
        });
      }
      return pump();
    }).catch(function () {
      if (got.length) { S.lines = got; finish(change); return; }
      if (change) return restore("I can't reach the planner right now. Check your connection.");
      return playSample();
    });
  }

  /* ---------- beat 5: keep it ---------- */
  function finish(changed) {
    status(changed ? "Changed. The new parts are marked." : "Your plan is ready.", true);
    if (!DEMO) save({ lines: S.lines, sample: S.sample, at: Date.now(), a: S.a, d: S.d });
    snd(changed ? "stamp" : "win");
    keep();
  }
  function keep() {
    var a = app.querySelector("#after"); if (!a) return;
    a.innerHTML = '<div class="keep no-print"><button type="button" class="btn ghost" id="print">Print</button><button type="button" class="btn ghost" id="copy">Copy checklist</button>' +
      '<button type="button" class="btn" id="chg" aria-expanded="false" aria-controls="chgbox">Change something</button><button type="button" class="btn ghost" id="over">Start over</button></div>' +
      '<div class="change no-print" id="chgbox" hidden><h2>What should change?</h2><div class="say-row"><textarea id="ct" maxlength="300" placeholder="Make Tuesday vegetarian" aria-label="What should change?"></textarea><button type="button" class="mic small" id="cm" aria-pressed="false" aria-label="Say it">' + MIC + '</button></div><p class="note" id="cn" role="status" aria-live="polite"></p><button type="button" class="btn" id="cgo">Change it</button></div>';
    if (TYPE !== "meals") a.querySelector("#ct").placeholder = { week: "Move the walk to mornings", party: "Make it a pizza party", trip: "Add a beach day" }[TYPE];
    a.querySelector("#print").onclick = function () { snd("pick"); window.print(); };
    a.querySelector("#copy").onclick = function () {
      var t = asText(S.lines), done = function () { snd("share"); toast("Copied. Paste it anywhere."); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, fallback); else fallback();
      function fallback() { var x = h("textarea"); x.value = t; x.style.position = "fixed"; x.style.opacity = "0"; document.body.appendChild(x); x.select(); try { document.execCommand("copy"); done(); } catch (e) { toast("Couldn't copy. Try Print instead."); } x.remove(); }
    };
    var box = a.querySelector("#chgbox"), ct = a.querySelector("#ct");
    a.querySelector("#chg").onclick = function () { var o = box.hidden; box.hidden = !o; this.setAttribute("aria-expanded", String(o)); if (o) { snd("pick"); ct.focus(); box.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); } };
    wireMic(a.querySelector("#cm"), ct, null, a.querySelector("#cn"));
    a.querySelector("#cgo").onclick = function () {
      var t = ct.value.trim(); if (!t) { a.querySelector("#cn").textContent = "Say or type one change."; ct.focus(); return; }
      if (S.sample) { a.querySelector("#cn").innerHTML = 'Changes switch on with live plans. <a href="' + esc(claudeURL()) + '" target="_blank" rel="noopener">Open in Claude</a> to change it there.'; return; }
      snd("pick"); build(t);
    };
    a.querySelector("#over").onclick = function () { snd("pick"); S.a = {}; S.d = {}; S.lines = []; tell(); focusTop(); };
  }
  function toast(t) { if (window.School && window.School.toast) return window.School.toast(t); var el = document.getElementById("toast"); if (el) el.textContent = t; }

  /* ---------- start ---------- */
  var saved = DEMO ? null : load();
  if (DEMO === "1") { setDemo(); build(); }
  else if (DEMO === "q") { setDemo(); question(0); }
  else if (saved && saved.lines && saved.lines.length) {
    S.lines = saved.lines; S.sample = !!saved.sample; S.a = saved.a || {}; S.d = saved.d || {};
    var root = planShell({ again: true, instant: true, sample: S.sample }), draw = Painter(root, { instant: true });
    S.lines.forEach(draw); keep();
  } else tell();
})();
