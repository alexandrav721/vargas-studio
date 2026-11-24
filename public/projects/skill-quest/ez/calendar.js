/* AI Made EZ family birthday calendar, made for people who print.
   Journey: one big question at a time → type or say the birthdays any way you like ("Mia March 3 2019, Sam 6/12")
   → Claude (POST /api/dates) or the built-in reader turns that into a clean list you can fix → add photos
   → 3 looks to pick from → flip through the months → print 14 pages (cover, 12 months, a birthday list for the fridge).
   Ages and years married are worked out for you. Everything autosaves on this device, and Undo steps back. */
(function () {
  "use strict";
  var KEY = "smez-ez-calendar";
  var NOW = new Date(), NEXT = NOW.getMonth() >= 8 ? NOW.getFullYear() + 1 : NOW.getFullYear();
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var MCOL = { classic: ["#2f5d7c", "#8e1d1d", "#2f6b4f", "#6b4fa0", "#b0572a", "#1f6f8b", "#b03a48", "#3e7a3a", "#a0662f", "#9a4a1f", "#6b3d1e", "#8e1d1d"], bright: ["#3d6fd9", "#e0457b", "#2aa17a", "#9a5ae0", "#f08a24", "#1ea0c8", "#e2483c", "#3fa34d", "#d99a1e", "#e0662a", "#a0662f", "#d33b3b"] };
  var Q = {
    title: { label: "Whose calendar", q: "Whose calendar is this?", opts: ["The Garcia Family", "Grandma and Grandpa", "Our family"], ph: "Type a name" },
    year: { label: "Year", q: "Which year?", opts: [String(NEXT), String(NEXT + 1)], one: true },
    bdays: { label: "Birthdays", q: "Add the birthdays", hint: "Type or say them any way you like. For example: Mia March 3 2019, Sam 6/12, Grandpa Joe September 30 1948. Add the year to show ages.", dates: "birthday" },
    others: { label: "Anniversaries", q: "Any anniversaries or other dates?", hint: "For example: Tom and Linda wedding June 20 1986. You can skip this.", dates: "anniversary" },
    hols: { label: "Holidays", q: "Show holidays?", opts: ["Yes, US holidays", "No holidays"], one: true },
    photos: { label: "Photos", q: "Add family photos?", hint: "Pick up to 12, one for each month. You can skip this and the calendar uses colors instead.", photos: true },
    week: { label: "Week starts", q: "Start the week on…", opts: ["Sunday", "Monday"], one: true }
  };
  var DEPTH = { short: ["title", "bdays", "photos"], full: ["title", "year", "bdays", "others", "hols", "photos"], all: ["title", "year", "bdays", "others", "hols", "photos", "week"] };
  var LOOKS = [["classic", "Classic"], ["bright", "Bright"], ["modern", "Modern"]];
  var CAKE = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1c.9 1 .9 2 0 2.6C7.1 3 7.1 2 8 1zM7.4 4h1.2v2H7.4zM2 7h12v3H2zM1 11h14v4H1z"/></svg>';
  var RING = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 4a6 6 0 1 0 0 12A6 6 0 0 0 8 4zm0 2.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6zM6 0h4l1 3H5z"/></svg>';

  var S, hist = [], $ = function (id) { return document.getElementById(id); };
  function fresh() { return { depth: "full", ans: {}, sel: {}, skipped: {}, at: 0, phase: "ask", dates: [], drafts: {}, photos: [], look: null, big: false, month: 0 }; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { try { var c = JSON.parse(JSON.stringify(S)); c.photos = []; localStorage.setItem(KEY, JSON.stringify(c)); School.toast("Photos are too big to save on this device; the rest is saved."); } catch (e2) {} } }
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY) || "null"); return s && s.ans ? s : null; } catch (e) { return null; } }
  function snap() { hist.push(JSON.stringify(S)); if (hist.length > 30) hist.shift(); $("undo").disabled = false; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var tapped = false; ["pointerdown", "keydown"].forEach(function (e) { window.addEventListener(e, function () { tapped = true; }, true); });
  function snd(n, x) { if (tapped && window.SQSound) window.SQSound.play(n, x); }
  function keys() { return DEPTH[S.depth]; }
  function one(k) { return S.ans[k] || (S.sel[k] || [])[0] || ""; }
  function year() { return +(one("year") || NEXT); }
  function title() { return one("title") || "Our family"; }
  function answered(k) {
    if (Q[k].dates) return S.dates.some(function (d) { return d.kind === Q[k].dates || (Q[k].dates === "anniversary" && d.kind === "other"); });
    if (Q[k].photos) return S.photos.length > 0;
    return !!one(k);
  }

  /* ---------- reading a messy list of dates ---------- */
  var MN = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12 };
  function readLocal(text, kind) {
    var out = [];
    var mword = "(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\\.?";
    var re1 = new RegExp(mword + "\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(\\d{4}))?", "i");
    var re2 = new RegExp("(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:of\\s+)?" + mword + "(?:,?\\s+(\\d{4}))?", "i");
    var re3 = /(\d{1,2})[\/\-.](\d{1,2})(?:[\/\-.](\d{2,4}))?/;
    var raw = String(text).split(/\n|;|,(?=\s*[A-Za-z])/), parts = [], carry = "";
    raw.forEach(function (p) { p = (carry ? carry + " " : "") + p.trim(); if (re1.test(p) || re2.test(p) || re3.test(p)) { parts.push(p); carry = ""; } else carry = p; });
    parts.forEach(function (p) {
      p = p.trim(); if (!p) return;
      var m, mo, dy, yr, rest;
      var a1 = p.match(re1), a2 = p.match(re2);
      if (a1 && a2 && a2.index < a1.index) a1 = null;
      if ((m = a1)) { mo = MN[m[1].toLowerCase().slice(0, 3)]; dy = +m[2]; yr = m[3]; }
      else if ((m = a2)) { mo = MN[m[2].toLowerCase().slice(0, 3)]; dy = +m[1]; yr = m[3]; }
      else if ((m = p.match(re3))) { mo = +m[1]; dy = +m[2]; yr = m[3]; if (yr && yr.length === 2) yr = (+yr > 30 ? "19" : "20") + yr; }
      if (!m || !(mo >= 1 && mo <= 12) || !(dy >= 1 && dy <= 31)) return;
      rest = p.replace(m[0], " ").replace(/\b(birthday|bday|b-day|born|on|is|was|the|anniversary|wedding|married|'s)\b/gi, " ").replace(/[:\-–(),.]+/g, " ").replace(/\s+/g, " ").trim();
      if (!rest) return;
      var k = /anniv|wedding|married/i.test(p) ? "anniversary" : kind;
      var d = { name: rest.charAt(0).toUpperCase() + rest.slice(1), month: mo, day: dy, kind: k };
      if (yr && +yr > 1890 && +yr < 2100) d.year = +yr;
      out.push(d);
    });
    return out;
  }
  var aiOff = false;
  function readDates(text, kind) {
    if (aiOff) return Promise.resolve(readLocal(text, kind));
    return fetch("/api/dates", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: text }) })
      .then(function (r) { if (!r.ok && [400, 413, 422, 502].indexOf(r.status) < 0) aiOff = true; return r.ok ? r.json() : null; })
      .then(function (j) { if (j && j.dates) return j.dates.map(function (d) { if (kind === "anniversary" && d.kind === "birthday") d.kind = "anniversary"; return d; }); return readLocal(text, kind); })
      .catch(function () { aiOff = true; return readLocal(text, kind); });
  }
  function addDates(list) {
    var n = 0;
    list.forEach(function (d) {
      if (S.dates.some(function (x) { return x.name.toLowerCase() === d.name.toLowerCase() && x.month === d.month && x.day === d.day; })) return;
      S.dates.push(d); n++;
    });
    S.dates.sort(function (a, b) { return a.month - b.month || a.day - b.day; });
    return n;
  }

  /* ---------- holidays (US) ---------- */
  function nth(y, m, dow, n) { var d = new Date(y, m, 1), c = 0; while (true) { if (d.getDay() === dow && ++c === n) return d.getDate(); d.setDate(d.getDate() + 1); } }
  function last(y, m, dow) { var d = new Date(y, m + 1, 0); while (d.getDay() !== dow) d.setDate(d.getDate() - 1); return d.getDate(); }
  function easter(y) { var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), mo = Math.floor((h + l - 7 * m + 114) / 31), dy = ((h + l - 7 * m + 114) % 31) + 1; return [mo - 1, dy]; }
  function holidays(y) {
    var e = easter(y), H = {};
    function add(m, d, n) { (H[m + "-" + d] = H[m + "-" + d] || []).push(n); }
    add(0, 1, "New Year's Day"); add(0, nth(y, 0, 1, 3), "Martin Luther King Jr. Day"); add(1, 14, "Valentine's Day"); add(1, nth(y, 1, 1, 3), "Presidents' Day");
    add(2, 17, "St. Patrick's Day"); add(e[0], e[1], "Easter"); add(4, nth(y, 4, 0, 2), "Mother's Day"); add(4, last(y, 4, 1), "Memorial Day");
    add(5, 19, "Juneteenth"); add(5, nth(y, 5, 0, 3), "Father's Day"); add(6, 4, "Independence Day"); add(8, nth(y, 8, 1, 1), "Labor Day");
    add(8, nth(y, 8, 0, 2), "Grandparents Day"); add(9, 31, "Halloween"); add(10, 11, "Veterans Day"); add(10, nth(y, 10, 4, 4), "Thanksgiving");
    add(11, 24, "Christmas Eve"); add(11, 25, "Christmas"); add(11, 31, "New Year's Eve");
    return H;
  }

  /* ---------- the question card ---------- */
  var MIC = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>';
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition, rec = null;
  function when(d) { return MONTHS[d.month - 1].slice(0, 3) + " " + d.day + (d.year ? ", " + d.year : ""); }
  function drawAsk() {
    var box = $("ask"), ks = keys();
    if (S.phase !== "ask") {
      box.innerHTML = '<div class="done-msg"><h1>' + (S.look ? "Your calendar is ready" : "Pick a look") + "</h1><p>" + (S.look ? "Flip through the months, then print. Tap any answer on the list to change it." : "Here is one month in 3 looks. Tap the one you like.") + "</p></div>";
      return;
    }
    var k = ks[S.at], c = Q[k], n = S.at + 1, sel = S.sel[k] || [];
    var h = '<div class="prog"><span>Question ' + n + " of " + ks.length + '</span><span class="bar"><i style="width:' + Math.round((S.at / ks.length) * 100) + '%"></i></span></div>';
    h += "<h1>" + esc(c.q) + "</h1>" + (c.hint ? '<p class="hint">' + esc(c.hint) + "</p>" : "");
    if (c.opts) h += '<div class="opts" role="group" aria-label="Choices">' + c.opts.map(function (o) { return '<button type="button" class="opt" data-o="' + esc(o) + '" aria-pressed="' + (sel.indexOf(o) >= 0) + '">' + esc(o) + "</button>"; }).join("") + "</div>";
    if (c.ph) h += '<div class="say"><label class="sr" for="tx">' + esc(c.ph) + '</label><textarea id="tx" maxlength="80" style="min-height:60px" placeholder="' + esc(c.ph) + '">' + esc(S.ans[k] || "") + "</textarea></div>";
    if (c.dates) {
      var mine = S.dates.filter(function (d) { return c.dates === "birthday" ? d.kind === "birthday" : d.kind !== "birthday"; });
      h += '<div class="say"><label class="sr" for="tx">Type or say the dates</label><textarea id="tx" maxlength="3000" placeholder="Type or tap the microphone">' + esc(S.drafts[k] || "") + "</textarea>" + (SR ? '<button type="button" class="mic" id="mic" aria-pressed="false" aria-label="Speak the dates">' + MIC + "</button>" : "") + "</div>";
      h += '<button type="button" class="btn ghost readb" id="read">Add these</button>';
      if (mine.length) h += '<p class="found">' + mine.length + (c.dates === "birthday" ? " birthday" : " date") + (mine.length > 1 ? "s" : "") + ' on your calendar</p><ul class="dlist">' + mine.map(function (d) { var i = S.dates.indexOf(d); return "<li><span>" + esc(d.name) + (d.kind !== "birthday" ? '<span class="k">' + (d.kind === "anniversary" ? "anniversary" : "date") + "</span>" : "") + '</span><span class="when">' + esc(when(d)) + '</span><button type="button" data-del="' + i + '" aria-label="Remove ' + esc(d.name) + '">Remove</button></li>'; }).join("") + "</ul>";
      h += '<div class="addrow" aria-label="Add one by hand"><input id="an" placeholder="Name" maxlength="50"><select id="am" aria-label="Month">' + MONTHS.map(function (m, i) { return '<option value="' + (i + 1) + '">' + m + "</option>"; }).join("") + '</select><input id="ad" inputmode="numeric" placeholder="Day" maxlength="2" aria-label="Day"><button type="button" class="btn ghost" id="add1">Add</button></div>';
    }
    if (c.photos) h += '<div class="phs">' + S.photos.map(function (p) { return '<img src="' + p + '" alt="">'; }).join("") + '</div><label class="btn ghost" for="ph" style="min-height:58px;font-size:19px">' + (S.photos.length ? "Choose different photos" : "Choose photos") + '</label><input type="file" id="ph" accept="image/*" multiple class="sr">';
    h += '<div class="nav">' + (S.at ? '<button type="button" class="btn ghost" id="back">Back</button>' : "") + '<button type="button" class="btn next" id="next">' + (n === ks.length ? "Make my calendar" : "Next") + '</button><button type="button" class="skipb" id="skip">Skip</button></div>';
    box.innerHTML = h;
  }
  function readField() {
    var k = keys()[S.at], t = $("tx"); if (!t) return;
    if (Q[k].dates) { S.drafts[k] = t.value; return; }
    var v = t.value.trim(); if (v) { S.ans[k] = v; S.sel[k] = []; } else delete S.ans[k];
  }
  function go(d) {
    var k = keys()[S.at];
    if (d > 0 && Q[k].dates && (S.drafts[k] || "").trim()) { readAndAdd(function () { go(d); }); return; }
    readField(); snap();
    if (d > 0) { if (answered(k)) delete S.skipped[k]; snd("tick", Math.min(3, S.at)); }
    S.at = Math.max(0, S.at + d);
    if (S.at >= keys().length) { S.phase = "pick"; S.look = null; S.month = busiest(); snd("deal"); }
    drawAll(); save(); var f = document.querySelector(".ask h1"); if (f) { f.tabIndex = -1; f.focus({ preventScroll: true }); }
  }
  function readAndAdd(then) {
    var k = keys()[S.at], t = $("tx"), text = (t ? t.value : S.drafts[k] || "").trim();
    if (!text) { if (then) then(); return; }
    $("app").classList.add("busy");
    readDates(text, Q[k].dates).then(function (list) {
      $("app").classList.remove("busy"); snap();
      var n = addDates(list);
      if (n) { S.drafts[k] = ""; snd("sticker"); School.toast("Added " + n + ". Check the list below."); }
      else School.toast("I couldn't find a date in that. Try: Mia March 3, or use the boxes below.");
      drawAll(); save();
      if (then && n) then();
    });
  }
  function busiest() { var c = new Array(12).fill(0); S.dates.forEach(function (d) { c[d.month - 1]++; }); var m = 0; c.forEach(function (v, i) { if (v > c[m]) m = i; }); return m; }

  /* ---------- the calendar sheets ---------- */
  function color(look, m) { return look === "modern" ? "#1f1d1a" : MCOL[look][m]; }
  function tint(hex) { var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; return "rgba(" + r + "," + g + "," + b + ",.08)"; }
  function entryText(d, y) {
    if (d.kind === "birthday") return d.year && y - d.year > 0 && y - d.year < 120 ? d.name + " turns " + (y - d.year) : d.name + "'s birthday";
    if (d.kind === "anniversary") return d.year && y > d.year ? d.name + " · " + (y - d.year) + " yrs" : d.name;
    return d.name;
  }
  function monthPage(m, look) {
    var y = year(), col = color(look, m), H = one("hols") === "No holidays" ? {} : holidays(y), mon = one("week") === "Monday";
    var photo = S.photos.length ? S.photos[m % S.photos.length] : "";
    var h = '<div class="cpage l-' + look + (S.big ? " big" : "") + '" style="--m:' + col + ";--t:" + tint(col) + '">';
    h += '<div class="pic">' + (photo ? '<img src="' + photo + '" alt="">' : '<span class="mbig">' + MONTHS[m] + "</span>") + "</div>";
    h += '<div class="mh"><b>' + MONTHS[m] + "</b><span>" + y + "</span></div>";
    var wd = mon ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    h += '<div class="grid">' + wd.map(function (w) { return '<div class="wd">' + w + "</div>"; }).join("");
    var first = new Date(y, m, 1).getDay(), lead = mon ? (first + 6) % 7 : first, dim = new Date(y, m + 1, 0).getDate();
    var cells = Math.ceil((lead + dim) / 7) * 7;
    for (var i = 0; i < cells; i++) {
      var day = i - lead + 1;
      if (day < 1 || day > dim) { h += '<div class="c o"></div>'; continue; }
      var es = S.dates.filter(function (d) { return d.month === m + 1 && (d.day === day || (d.month === 2 && d.day === 29 && day === 28 && dim === 28)); });
      var hs = H[m + "-" + day] || [];
      h += '<div class="c' + (es.length ? " has" : "") + '"><span class="n">' + day + "</span>" + es.map(function (d) { return '<span class="e">' + (d.kind === "birthday" ? CAKE : d.kind === "anniversary" ? RING : "") + esc(entryText(d, y)) + "</span>"; }).join("") + hs.map(function (x) { return '<span class="h">' + esc(x) + "</span>"; }).join("") + "</div>";
    }
    return h + "</div></div>";
  }
  function coverPage(look) {
    var col = color(look, 0), ph = S.photos.slice(0, 4);
    return '<div class="cpage cover l-' + look + '" style="--m:' + col + ";--t:" + tint(col) + '">' + (ph.length ? '<div class="coll n' + ph.length + '">' + ph.map(function (p) { return '<img src="' + p + '" alt="">'; }).join("") + "</div>" : "") + '<div class="yr">' + year() + "</div><h1>" + esc(title()) + "</h1><p>" + (S.dates.length ? S.dates.length + " birthdays and special days" : "Our year together") + "</p></div>";
  }
  function listPage(look) {
    var col = color(look, 0), y = year(), by = {};
    S.dates.forEach(function (d) { (by[d.month] = by[d.month] || []).push(d); });
    return '<div class="cpage list l-' + look + '" style="--m:' + col + ";--t:" + tint(col) + '"><h1>Family birthdays</h1><div class="cols">' + MONTHS.map(function (mn, i) { var l = by[i + 1]; return l ? '<div class="mo"><b>' + mn + "</b>" + l.map(function (d) { return "<div><span>" + d.day + "</span><span>" + esc(entryText(d, y)) + "</span></div>"; }).join("") + "</div>" : ""; }).join("") + "</div></div>";
  }
  function fitAll() {
    document.querySelectorAll(".fit").forEach(function (box) {
      var pg = box.querySelector(".cpage"); if (!pg) return;
      var s = box.clientWidth / 816; pg.style.transform = "scale(" + s + ")"; box.style.height = (1056 * s) + "px";
    });
  }
  function sheet(i, look) { return i === 0 ? coverPage(look) : i === 13 ? listPage(look) : monthPage(i - 1, look); }
  function sheetName(i) { return i === 0 ? "Cover" : i === 13 ? "Birthday list" : MONTHS[i - 1]; }

  function drawOut() {
    var v = $("view"); $("otools").innerHTML = "";
    if (S.phase === "ask") {
      $("otitle").textContent = "Your calendar, filling in";
      v.innerHTML = '<div class="fit">' + monthPage(S.dates.length ? busiest() : NOW.getMonth(), "classic") + '</div><p class="note">Every birthday you add shows up here.</p>';
    } else if (!S.look) {
      $("otitle").textContent = "Pick a look";
      v.innerHTML = '<div class="picks">' + LOOKS.map(function (l) { return '<div class="pick"><h3>' + l[1] + '</h3><div class="fit">' + monthPage(S.month, l[0]) + '</div><button type="button" class="btn" data-look="' + l[0] + '">Use this look</button></div>'; }).join("") + "</div>";
    } else {
      $("otitle").textContent = "Ready to print";
      var i = S.month + 1;
      if (S.sheet != null) i = S.sheet;
      v.innerHTML =
        '<div class="row" role="group" aria-label="Look"><span class="label">Look</span>' + LOOKS.map(function (l) { return '<button type="button" class="choice" data-look2="' + l[0] + '" aria-pressed="' + (S.look === l[0]) + '">' + l[1] + "</button>"; }).join("") + '<button type="button" class="choice" id="big" aria-pressed="' + S.big + '">Bigger print</button></div>' +
        '<div class="flip"><button type="button" class="btn ghost" id="prev" aria-label="Previous page"' + (i === 0 ? " disabled" : "") + '>‹ Back</button><b>' + sheetName(i) + '</b><button type="button" class="btn ghost" id="nextp" aria-label="Next page"' + (i === 13 ? " disabled" : "") + ">Next ›</button></div>" +
        '<div class="fit">' + sheet(i, S.look) + "</div>" +
        '<div class="row"><button type="button" class="btn" id="print">Print all 14 pages</button><button type="button" class="btn ghost" id="others">See all 3 looks</button></div>' +
        '<div class="tips"><b>Printing tips</b><ol><li>Use letter paper (8.5 × 11). Thicker paper or card stock looks best.</li><li>Print one page first: in the print window, set Pages to 2 and check it.</li><li>Choose "Actual size" or 100%, not "Fit".</li><li>Punch two holes at the top, or staple the top edge, to hang it.</li></ol></div>';
    }
    requestAnimationFrame(fitAll);
  }
  function drawPrint() { var p = $("printall"); p.innerHTML = S.look ? Array.apply(null, Array(14)).map(function (_, i) { return sheet(i, S.look); }).join("") : ""; }
  function drawPlan() {
    var ks = keys(), ol = $("qs"); ol.innerHTML = "";
    ks.forEach(function (k, i) {
      var li = document.createElement("li"), done = answered(k);
      li.className = (S.phase === "ask" && i === S.at ? "now " : "") + (done ? "done" : S.skipped[k] ? "skip" : "");
      li.innerHTML = '<span class="tick" aria-hidden="true"></span><button type="button" data-q="' + i + '">' + esc(Q[k].label) + (Q[k].dates && done ? " (" + S.dates.filter(function (d) { return Q[k].dates === "birthday" ? d.kind === "birthday" : d.kind !== "birthday"; }).length + ")" : "") + (done ? "" : S.skipped[k] ? " (skipped)" : "") + "</button>";
      ol.appendChild(li);
    });
    document.querySelectorAll(".seg button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.depth === S.depth)); });
    $("prompt").textContent = "Read this list of family dates and return each one as name, month, day, year (only if given) and kind.\n\n" + (Object.keys(S.drafts).map(function (k) { return S.drafts[k]; }).filter(Boolean).join("\n") || "(Claude only reads the list you type. The calendar itself is drawn on this page, so every date prints exactly as you see it.)");
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
      else if (b.dataset.del != null) { snap(); S.dates.splice(+b.dataset.del, 1); drawAll(); save(); School.toast("Removed. Tap Undo to bring it back."); }
      else if (b.id === "add1") {
        var nm = $("an").value.trim(), mo = +$("am").value, dy = +$("ad").value;
        if (!nm || !(dy >= 1 && dy <= 31)) { School.toast("Add a name and a day number."); return; }
        readField(); snap(); addDates([{ name: nm, month: mo, day: dy, kind: Q[k].dates }]); snd("sticker"); drawAll(); save();
      }
    });
    $("ask").addEventListener("input", function (e) { if (e.target.id === "tx") { readField(); drawPlan(); save(); } });
    $("ask").addEventListener("change", function (e) {
      if (e.target.id !== "ph") return;
      var files = [].slice.call(e.target.files || [], 0, 12); if (!files.length) return; snap();
      $("app").classList.add("busy");
      Promise.all(files.map(shrink)).then(function (urls) { $("app").classList.remove("busy"); S.photos = urls.filter(Boolean); snd("sticker"); drawAll(); save(); });
    });
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
      var open = keys().findIndex(function (k) { return !answered(k) && !S.skipped[k]; });
      if (S.phase !== "ask" && open >= 0) { S.phase = "ask"; S.at = open; }
      snd("pick"); drawAll(); save();
    });
    $("view").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.look) { snap(); S.look = b.dataset.look; S.sheet = S.month + 1; snd("stamp"); drawAll(); save(); window.scrollTo({ top: 0, behavior: "smooth" }); }
      else if (b.dataset.look2) { snap(); S.look = b.dataset.look2; snd("pick"); drawOut(); drawPrint(); save(); }
      else if (b.id === "big") { snap(); S.big = !S.big; drawOut(); drawPrint(); save(); }
      else if (b.id === "prev" || b.id === "nextp") { var i = S.sheet == null ? S.month + 1 : S.sheet; S.sheet = Math.max(0, Math.min(13, i + (b.id === "prev" ? -1 : 1))); snd("pick"); drawOut(); save(); }
      else if (b.id === "print") { snd("share"); drawPrint(); setTimeout(function () { window.print(); }, 50); }
      else if (b.id === "others") { snap(); S.look = null; drawAll(); save(); }
    });
    $("undo").addEventListener("click", function () { if (!hist.length) return; S = JSON.parse(hist.pop()); $("undo").disabled = !hist.length; drawAll(); save(); School.toast("Undone."); });
    $("restart").addEventListener("click", function () { snap(); S = fresh(); drawAll(); save(); School.toast("New calendar. Tap Undo to get the old one back."); });
    window.addEventListener("resize", function () { clearTimeout(fitAll.t); fitAll.t = setTimeout(fitAll, 120); });
  }
  function shrink(file) {
    return new Promise(function (ok) {
      var r = new FileReader(); r.onload = function () {
        var img = new Image(); img.onload = function () { var s = Math.min(1, 1000 / Math.max(img.width, img.height)), c = document.createElement("canvas"); c.width = img.width * s; c.height = img.height * s; c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); ok(c.toDataURL("image/jpeg", 0.8)); };
        img.onerror = function () { ok(""); }; img.src = r.result;
      }; r.onerror = function () { ok(""); }; r.readAsDataURL(file);
    });
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
    var s = load();
    S = s ? Object.assign(fresh(), s) : fresh();
    drawAll();
    if (s) School.toast("Welcome back. Your calendar is right where you left it.");
  });
})();
