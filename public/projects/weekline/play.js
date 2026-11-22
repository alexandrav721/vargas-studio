/* Weekline front door: "idk you pick" → tear tabs off this week's NYC Parks flyers → the Sheet fills and gets stamped → send it.
   Rows come live from the NYC Parks "Upcoming 14 Days" Open Data feed (w3wp-dpdi, public, no key), the same feed the app uses.
   If it can't load, the page says so and shows a week built from the app's Sample rows, labeled Sample. Nothing is invented.
   A friend's picks travel in the link (?b=bk&t=<guid.guid>&n=Maya). No server, nothing stored except on this device. */
(function () {
  "use strict";

  var FEED = "https://data.cityofnewyork.us/resource/w3wp-dpdi.json";
  var PARKS = "https://www.nycgovparks.org/events";
  var ROUNDS = 8;
  var DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var NAME_KEY = "weekline.play.name.v1";
  var SIDES = { bk: "Brooklyn", mn: "Manhattan" };

  /* Crews are the app's own (weekline-app data/events.ts); lines shortened. */
  var CREWS = {
    "move-pack": { name: "Move Pack", line: "Bodies in motion.", color: "#c8f542" },
    "culture-circuit": { name: "Culture Circuit", line: "Rooms with something on.", color: "#f6f1e6" },
    "cheap-thrills": { name: "Cheap Thrills", line: "Maximum city, minimum spend.", color: "#3de0ff" },
    dateline: { name: "Dateline", line: "One good night, on purpose.", color: "#ff6b4a" },
    "table-hop": { name: "Table Hop", line: "The week tastes like somewhere.", color: "#f5b942" },
    wildcard: { name: "Wildcard", line: "One weird night, one free find.", color: "#f6f1e6" }
  };

  /* The app's own Sample rows (weekline-app data/events.ts), used only when the live feed fails. Always labeled Sample. */
  var SAMPLE = [
    { title: "Community yoga in McCarren", place: "Greenpoint", side: "bk", day: 1, time: "6:00 PM", kind: "move" },
    { title: "Underground comedy showcase", place: "East Village", side: "mn", day: 2, time: "8:00 PM", kind: "culture" },
    { title: "Chelsea gallery night crawl", place: "Chelsea", side: "mn", day: 3, time: "5:00 PM", kind: "culture" },
    { title: "Free Shakespeare lottery tips", place: "Upper West Side", side: "mn", day: 3, time: "8:00 PM", kind: "culture" },
    { title: "Sunset jazz on the pier", place: "Williamsburg", side: "bk", day: 4, time: "6:30 PM", kind: "date" },
    { title: "Sunrise run club + bagels", place: "Prospect Heights", side: "bk", day: 5, time: "7:00 AM", kind: "move" },
    { title: "Rooftop film: noir classics", place: "Lower East Side", side: "mn", day: 5, time: "8:30 PM", kind: "date" },
    { title: "Bushwick warehouse pop-up market", place: "Bushwick", side: "bk", day: 6, time: "12:00 PM", kind: "food" },
    { title: "DIY ceramics drop-in", place: "Gowanus", side: "bk", day: 0, time: "7:00 PM", kind: "culture" },
    { title: "Harlem soul brunch series", place: "Harlem", side: "mn", day: 6, time: "11:00 AM", kind: "food" }
  ];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, reduced ? Math.min(ms, 80) : ms); }); };
  var load = function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } };
  var store = function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* this visit only */ } };

  /* ---------- dates, in New York time ---------- */
  function nyNow() {
    var p = {};
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false, weekday: "short"
    }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour % 24, mi: +p.minute, wd: p.weekday };
  }
  function ymd(dt) { return dt.toISOString().slice(0, 10); }
  /* Sunday night plans the week ahead; any other day plans the rest of this week. */
  function weekRange() {
    var n = nyNow();
    var today = new Date(Date.UTC(n.y, n.m - 1, n.d));
    var dow = (today.getUTCDay() + 6) % 7; // Mon=0 … Sun=6
    var mon = new Date(today);
    if (dow === 6) mon.setUTCDate(today.getUTCDate() + 1);
    else mon.setUTCDate(today.getUTCDate() - dow);
    var end = new Date(mon); end.setUTCDate(mon.getUTCDate() + 7);
    var from = dow === 6 ? ymd(mon) + "T00:00:00"
      : ymd(today) + "T" + String(n.h).padStart(2, "0") + ":" + String(n.mi).padStart(2, "0") + ":00";
    return { mon: mon, from: from, to: ymd(end) + "T00:00:00" };
  }
  var WEEK = weekRange();
  function dayDate(i) { var d = new Date(WEEK.mon); d.setUTCDate(WEEK.mon.getUTCDate() + i); return d; }
  function monthDay(d) { return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }); }

  /* ---------- the Parks feed ---------- */
  function decode(s) {
    var t = document.createElement("textarea");
    t.innerHTML = String(s || "");
    return t.value.replace(/\s+/g, " ").trim();
  }
  function clock(iso) {
    var m = String(iso || "").match(/T(\d\d):(\d\d)/);
    if (!m) return "";
    var h = +m[1], mi = m[2], ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + (mi === "00" ? "" : ":" + mi) + " " + ap;
  }
  function kindOf(cats, title) {
    var c = (cats + " " + title).toLowerCase();
    if (/fitness|yoga|pilates|exercise|zumba|run|jog|swim|sport|dance|tennis|bike|cardio|hik/.test(c)) return "move";
    if (/film|movie|music|concert|jazz/.test(c)) return "date";
    if (/market|food|fair|harvest/.test(c)) return "food";
    if (/art|history|theater|theatre|museum|tour|talk|lecture|reading|education|exhibit/.test(c)) return "culture";
    if (/nature|bird|garden|wildlife|volunteer|forest|ranger/.test(c)) return "nature";
    return "other";
  }
  function sideOf(r) {
    var c = String(r.parkids || "").trim().charAt(0).toUpperCase();
    if (c === "B") return "bk";
    if (c === "M") return "mn";
    return null;
  }
  function mapRow(r) {
    if (!r || !r.title || !r.starttime || !r.guid) return null;
    var title = decode(r.title);
    var hay = (title + " " + (r.categories || "") + " " + (r.location || "")).toLowerCase();
    if (/cancel+ed|postponed/.test(hay)) return null;
    if (/virtual|online|zoom|webinar/.test(hay)) return null;
    if (/best for kids|tot time|toddler|teens only|older adults|golden age|seniors/.test(hay)) return null;
    var side = sideOf(r);
    if (!side) return null;
    var m = r.starttime.match(/^(\d{4})-(\d\d)-(\d\d)/);
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    var day = Math.round((d - WEEK.mon) / 864e5);
    if (day < 0 || day > 6) return null;
    var link = r.link && (typeof r.link === "string" ? r.link : r.link.url);
    return {
      id: String(r.guid), title: title, place: decode(r.parknames || "NYC Parks").split(",")[0],
      side: side, day: day, time: clock(r.starttime), start: r.starttime, end: r.endtime || "",
      kind: kindOf(r.categories || "", title), source: "live",
      url: /^https?:\/\/(www\.)?nycgovparks\.org\//.test(link || "") ? link.replace(/^http:/, "https:") : PARKS
    };
  }
  function fetchJson(url, ms) {
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, ms);
    return fetch(url, { headers: { Accept: "application/json" }, signal: ctl ? ctl.signal : undefined })
      .then(function (r) { clearTimeout(timer); if (!r.ok) throw new Error("feed " + r.status); return r.json(); });
  }
  function weekRows() {
    var where = "starttime >= '" + WEEK.from + "' AND starttime < '" + WEEK.to + "'";
    // only the fields the flyers use, so the slow public endpoint sends less
    var sel = "title,guid,link,parkids,parknames,starttime,endtime,categories,location";
    var url = FEED + "?$select=" + sel + "&$limit=600&$order=starttime&$where=" + encodeURIComponent(where);
    // the request starts on page load, so most of this wait hides behind the first question
    return fetchJson(url, 15000).then(function (rows) { return rows.map(mapRow).filter(Boolean); });
  }
  function rowsById(ids) {
    if (!ids.length) return Promise.resolve([]);
    var where = "guid in(" + ids.map(function (g) { return "'" + g + "'"; }).join(",") + ")";
    return fetchJson(FEED + "?$where=" + encodeURIComponent(where), 15000)
      .then(function (rows) { return rows.map(mapRow).filter(Boolean); });
  }

  /* ---------- state ---------- */
  var params = new URLSearchParams(location.search);
  var side = SIDES[params.get("b")] ? params.get("b") : "bk";
  var friendIds = (params.get("t") || "").split(".").filter(function (g) { return /^\d{1,12}$/.test(g); }).slice(0, 7);
  var friendName = (params.get("n") || "").replace(/[^\p{L}\p{M}' -]/gu, "").trim().slice(0, 20);
  var friendWho = friendName || "Your friend";
  var friendSet = {};
  var deck = [];
  var i = 0;
  var torn = [];
  var usingSample = false;
  var pool = null; // a promise of this week's rows

  function show(id) {
    $$(".beat").forEach(function (b) { b.classList.toggle("is-on", b.id === id); });
    window.scrollTo(0, 0);
    var h = $("#" + id + " h1, #" + id + " h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }

  /* ---------- 1. the ask ---------- */
  function paintSide() {
    $$(".side").forEach(function (b) {
      var on = b.dataset.side === side;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-checked", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    });
  }
  $$(".side").forEach(function (b) {
    b.addEventListener("click", function () { side = b.dataset.side; paintSide(); });
    b.addEventListener("keydown", function (e) {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].indexOf(e.key) < 0) return;
      e.preventDefault();
      side = side === "bk" ? "mn" : "bk";
      paintSide();
      $('.side[data-side="' + side + '"]').focus();
    });
  });
  // the chat keeps not deciding
  (function chatter() {
    var lines = ["idk you pick", "idk you pick", "whatever works", "idk you pick"];
    var k = 0;
    if (reduced) return;
    setInterval(function () {
      var b = $("#bubble");
      if (!b || !$("#beat-ask").classList.contains("is-on")) return;
      k = (k + 1) % lines.length;
      b.classList.remove("is-new"); void b.offsetWidth;
      b.textContent = lines[k];
      b.classList.add("is-new");
    }, 1800);
  })();
  $("#go").addEventListener("click", function () { start(); });

  /* ---------- 2. paste the wall ---------- */
  function sampleRows() {
    return SAMPLE.map(function (s, k) {
      return { id: "s" + k, title: s.title, place: s.place, side: s.side, day: s.day, time: s.time, kind: s.kind, source: "sample", url: "" };
    });
  }
  function pickDeck(rows, first) {
    var seen = {};
    var mine = rows.filter(function (r) {
      if (r.side !== side || seen[r.title.toLowerCase()]) return false;
      seen[r.title.toLowerCase()] = 1;
      return true;
    });
    var byDay = DAYS.map(function (_, d) { return mine.filter(function (r) { return r.day === d; }); });
    // vary the kinds inside each day, so the wall isn't five circuit classes
    byDay.forEach(function (list) {
      var kinds = {};
      list.sort(function (a, b) {
        var ka = kinds[a.kind] || 0, kb = kinds[b.kind] || 0;
        return ka - kb;
      });
      var out = [], used = {};
      list.forEach(function (r) { if (!used[r.kind]) { used[r.kind] = 1; out.push(r); } });
      list.forEach(function (r) { if (out.indexOf(r) < 0) out.push(r); });
      list.length = 0; Array.prototype.push.apply(list, out);
    });
    var picked = (first || []).filter(function (r) { return r.side === side; }).slice(0, ROUNDS);
    var have = {};
    picked.forEach(function (r) { have[r.id] = 1; seen[r.title.toLowerCase()] = 1; });
    var round = 0;
    while (picked.length < ROUNDS && round < 12) {
      byDay.forEach(function (list) {
        var r = list[round];
        if (r && picked.length < ROUNDS && !have[r.id]) { picked.push(r); have[r.id] = 1; }
      });
      round += 1;
    }
    return picked;
  }

  async function start(friendRows) {
    show("beat-load");
    var line = $("#load-line");
    line.textContent = "Pasting this week's flyers…";
    var rows = [];
    var slow = setTimeout(function () { line.textContent = "NYC Parks is slow tonight. Still pasting…"; }, 3500);
    try { rows = await pool; } catch (e) { rows = []; }
    clearTimeout(slow);
    var t0 = Date.now();
    deck = pickDeck(rows, friendRows);
    usingSample = deck.length < 3;
    if (usingSample) {
      line.textContent = "NYC Parks didn't load. Here's a Sample week.";
      deck = pickDeck(sampleRows());
      await wait(1400);
    }
    await wait(Math.max(0, 900 - (Date.now() - t0)));
    i = 0;
    torn = [];
    show("beat-wall");
    paintDays();
    paintFlyer();
  }

  /* ---------- 3. the wall ---------- */
  var GLYPH = {
    move: '<path d="M30 10a5 5 0 1 1 0 .1M22 52l7-15-6-6 4-12 11 6 7 1M27 19l-9 6-3 8M33 36l9 4 3 12" />',
    culture: '<path d="M12 20h36v8c0 10-8 18-18 18S12 38 12 28zM21 30h3M36 30h3M23 38c4 3 10 3 14 0" />',
    nature: '<path d="M30 52V28M30 28c-12 0-16-8-16-16 10 0 16 6 16 16zM30 34c10 0 15-7 15-14-9 0-15 5-15 14z" />',
    date: '<path d="M18 46a6 6 0 1 1 0-.1M42 40a6 6 0 1 1 0-.1M24 46V14l24-6v32" />',
    food: '<path d="M14 26h32l-4 22H18zM20 26c0-8 4-14 10-14s10 6 10 14M24 34v8M30 34v8M36 34v8" />',
    other: '<path d="M30 8l6 14 15 1-11 10 4 15-14-8-14 8 4-15-11-10 15-1z" />'
  };
  var PAPERS = ["paper--wheat", "paper--cyan", "paper--lime", "paper--coral", "paper--wheat", "paper--cream"];

  function paintDays() {
    $("#days").innerHTML = DAYS.map(function (d, k) {
      var on = torn.some(function (r) { return r.day === k; });
      return '<li class="dd' + (on ? " is-on" : "") + '" data-day="' + k + '"><b>' + d.charAt(0) + '</b><span class="sr">' + d + (on ? " planned" : " open") + "</span></li>";
    }).join("");
  }

  function flyerHtml(r, k) {
    var tab = DAYS[r.day] + " " + r.time.replace(":00", "").replace(" ", "");
    var tabs = "";
    for (var n = 0; n < 6; n += 1) tabs += '<span class="tab' + (n === 2 ? " tab--go" : "") + '">' + esc(tab) + "</span>";
    var chip = r.source === "live" ? '<b class="chip chip--live">Live Parks · Free</b>' : '<b class="chip chip--sample">Sample</b>';
    var fr = friendSet[r.id] ? '<b class="friend-tape">' + esc(friendWho) + " tore one</b>" : "";
    return '<article class="flyer ' + PAPERS[k % PAPERS.length] + '" style="--tilt:' + [-2.4, 1.8, -1.2, 2.6, -2.9, 1.1, -0.6, 2.2][k % 8] + 'deg">' +
      '<i class="tape tape--l"></i><i class="tape tape--r"></i>' + fr +
      '<p class="fl-day">' + DAYS[r.day] + ' <small>' + esc(monthDay(dayDate(r.day))) + "</small></p>" +
      '<svg class="fl-glyph" viewBox="0 0 60 60" aria-hidden="true">' + GLYPH[r.kind] + "</svg>" +
      '<h3 class="fl-title">' + esc(r.title) + "</h3>" +
      '<p class="fl-where">' + esc(r.time) + " · " + esc(r.place) + "</p>" + chip +
      '<div class="tabs" aria-hidden="true">' + tabs + "</div></article>";
  }

  function paintFlyer() {
    var r = deck[i];
    $("#count").textContent = (i + 1) + " of " + deck.length;
    var host = $("#deck");
    host.innerHTML = flyerHtml(r, i) + (deck[i + 1] ? '<div class="flyer flyer--under ' + PAPERS[(i + 1) % PAPERS.length] + '" aria-hidden="true"></div>' : "");
    bindSwipe($(".flyer", host));
  }

  async function answer(kind) {
    var r = deck[i];
    if (!r || answer.busy) return;
    answer.busy = true;
    var fl = $("#deck .flyer");
    if (kind === "tear") {
      torn.push(r);
      if (fl) {
        fl.classList.add("is-torn");
        await wait(380);
      }
      paintDays();
      var dot = $('#days .dd[data-day="' + r.day + '"]');
      if (dot) { dot.classList.add("is-pop"); }
      if (fl) fl.classList.add("out--tear");
    } else if (fl) {
      fl.classList.add("out--leave");
    }
    await wait(300);
    answer.busy = false;
    i += 1;
    if (i < deck.length) paintFlyer();
    else reveal();
  }
  $$("[data-ans]").forEach(function (b) { b.addEventListener("click", function () { answer(b.dataset.ans); }); });
  document.addEventListener("keydown", function (e) {
    if (!$("#beat-wall").classList.contains("is-on") || e.target.tagName === "INPUT") return;
    if (e.key === "ArrowDown" || e.key === "t" || e.key === "T") { e.preventDefault(); answer("tear"); }
    if (e.key === "ArrowLeft" || e.key === "l" || e.key === "L") { e.preventDefault(); answer("leave"); }
  });

  function bindSwipe(fl) {
    if (!fl) return;
    var x0 = null, y0 = null;
    fl.addEventListener("pointerdown", function (e) {
      x0 = e.clientX; y0 = e.clientY;
      try { fl.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
      fl.classList.add("is-drag");
    });
    fl.addEventListener("pointermove", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      fl.style.transform = "translate(" + Math.min(0, dx) + "px," + Math.max(0, dy) * 0.6 + "px) rotate(" + Math.min(0, dx) / 20 + "deg)";
      fl.dataset.lean = dy > 50 ? "tear" : dx < -50 ? "leave" : "";
    });
    fl.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      x0 = null;
      fl.classList.remove("is-drag");
      fl.style.transform = "";
      fl.dataset.lean = "";
      if (dy > 90) answer("tear");
      else if (dx < -90) answer("leave");
    });
  }

  /* ---------- 4. the Sheet ---------- */
  function crewFor(rows) {
    if (!rows.length) return "cheap-thrills";
    var n = {};
    rows.forEach(function (r) { n[r.kind] = (n[r.kind] || 0) + 1; });
    var top = Object.keys(n).sort(function (a, b) { return n[b] - n[a]; })[0];
    var share = n[top] / rows.length;
    if (rows.length >= 3 && share < 0.5) return "wildcard";
    return { move: "move-pack", culture: "culture-circuit", date: "dateline", food: "table-hop", nature: "cheap-thrills", other: "cheap-thrills" }[top];
  }
  function totalLine() {
    var days = {};
    torn.forEach(function (r) { days[r.day] = 1; });
    var open = 7 - Object.keys(days).length;
    var money = usingSample ? "Sample" : "$0";
    return { money: money, plans: torn.length, open: open };
  }
  function weekTitle() {
    var a = monthDay(dayDate(0)), b = monthDay(dayDate(6));
    if (a.split(" ")[0] === b.split(" ")[0]) b = b.split(" ")[1];
    return SIDES[side] + " · " + a + "–" + b;
  }

  async function reveal() {
    torn.sort(function (a, b) { return a.day - b.day || (a.start || "").localeCompare(b.start || ""); });
    show("beat-sheet");
    var crew = CREWS[crewFor(torn)];
    var nameEl = $("#crew-name");
    nameEl.classList.remove("is-in");
    nameEl.textContent = "";
    $("#crew-lead").textContent = torn.length ? "This week you're" : "Nothing torn.";
    $("#sheet-title").textContent = weekTitle();
    $("#sheet-tag").textContent = usingSample ? "Sample" : "Live Parks";
    $("#sheet-tag").className = "sheet-tag" + (usingSample ? " is-sample" : "");
    $("#stamp").classList.remove("is-down");
    $("#total").innerHTML = "";
    $("#after").classList.remove("is-in");
    var note = $("#note");
    note.hidden = !usingSample;
    note.textContent = usingSample ? "Sample week: the live NYC Parks feed didn't load." : "";
    $("#name").value = load(NAME_KEY, "");

    var common = torn.filter(function (r) { return friendSet[r.id]; }).length;
    var c = $("#common");
    c.hidden = !friendIds.length;
    c.textContent = common ? common + " in common with " + friendWho : "Nothing in common with " + friendWho + " yet";

    var rowsEl = $("#rows");
    rowsEl.innerHTML = DAYS.map(function (d, k) {
      return '<li class="row is-wait" data-day="' + k + '"><span class="r-day">' + d + "</span><span class=\"r-what\"></span></li>";
    }).join("");

    for (var k = 0; k < 7; k += 1) {
      await wait(260);
      var li = rowsEl.children[k];
      var mine = torn.filter(function (r) { return r.day === k; });
      li.classList.remove("is-wait");
      if (!mine.length) {
        li.classList.add("is-open");
        li.querySelector(".r-what").innerHTML = '<b class="open-stamp">Open</b>';
      } else {
        // the header tag says where every row came from; each title links to its NYC Parks page
        li.querySelector(".r-what").innerHTML = mine.slice(0, 2).map(function (r) {
          var t = r.source === "live" ? '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.title) + "</a>" : esc(r.title);
          var fr = friendSet[r.id] ? ' <b class="with">+ ' + esc(friendWho) + "</b>" : "";
          return '<span class="r-item"><strong>' + t + "</strong>" + fr + '<span class="r-when">' + esc(r.time) + " · " + esc(r.place) + "</span></span>";
        }).join("") + (mine.length > 2 ? '<span class="r-more">+' + (mine.length - 2) + " more</span>" : "");
      }
    }
    var t = totalLine();
    await wait(240);
    $("#total").innerHTML = (usingSample ? "" : "<b>" + esc(t.money) + "</b> · ") + "<b>" + t.plans + "</b> " + (t.plans === 1 ? "plan" : "plans") + " · <b>" + t.open + "</b> open";
    await wait(420);
    $("#stamp").textContent = torn.length ? "Sorted." : "Wide open.";
    $("#stamp").classList.add("is-down");
    await wait(380);
    nameEl.textContent = torn.length ? crew.name : "Your week is all yours";
    nameEl.style.setProperty("--crew", crew.color);
    void nameEl.offsetWidth;
    nameEl.classList.add("is-in");
    $("#after").classList.add("is-in");
    $("#ics").hidden = !torn.some(function (r) { return r.source === "live"; });
  }

  $("#name").addEventListener("input", function (e) { store(NAME_KEY, e.target.value.replace(/[^\p{L}\p{M}' -]/gu, "").slice(0, 20)); });

  function shareLink() {
    var u = new URL(location.href);
    u.search = "";
    u.hash = "";
    u.searchParams.set("b", side);
    var ids = torn.filter(function (r) { return r.source === "live"; }).map(function (r) { return r.id; });
    if (ids.length) u.searchParams.set("t", ids.join("."));
    var nm = $("#name").value.replace(/[^\p{L}\p{M}' -]/gu, "").trim().slice(0, 20);
    if (nm) u.searchParams.set("n", nm);
    u.searchParams.set("via", "card");
    return u.href;
  }

  /* ---------- the card (story size, drawn on a canvas) ---------- */
  async function makeCard() {
    try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (e) { /* fine */ }
    var W = 1080, H = 1920;
    var cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    var g = cv.getContext("2d");
    var D = "'Bricolage Grotesque', 'Arial Narrow', sans-serif";
    var B = "Outfit, system-ui, sans-serif";
    g.fillStyle = "#0a0a0b"; g.fillRect(0, 0, W, H);
    var crew = CREWS[crewFor(torn)];
    g.fillStyle = "#b7b0a4"; g.font = "600 40px " + B;
    g.fillText(torn.length ? "This week I'm" : "This week is", 80, 170);
    g.fillStyle = torn.length ? crew.color : "#f6f1e6"; g.font = "800 128px " + D;
    g.fillText(torn.length ? crew.name : "Wide open", 76, 300);
    // the sheet
    g.save(); g.translate(540, 1030); g.rotate(-0.012); g.translate(-470, -620);
    g.fillStyle = "rgba(0,0,0,.45)"; g.fillRect(14, 22, 940, 1240);
    g.fillStyle = "#f7f2e6"; g.fillRect(0, 0, 940, 1240);
    g.fillStyle = "rgba(200,245,66,.85)"; g.fillRect(380, -22, 180, 50);
    g.fillStyle = "#171410"; g.font = "800 54px " + D;
    g.fillText(weekTitle(), 50, 100);
    g.fillRect(50, 130, 840, 5);
    var y = 210;
    DAYS.forEach(function (d, k) {
      var mine = torn.filter(function (r) { return r.day === k; });
      g.fillStyle = "#171410"; g.font = "800 40px " + D; g.fillText(d.toUpperCase(), 50, y);
      if (!mine.length) {
        g.save(); g.strokeStyle = "#5c564e"; g.setLineDash([8, 7]); g.lineWidth = 3; g.strokeRect(200, y - 40, 170, 56); g.restore();
        g.fillStyle = "#5c564e"; g.font = "700 32px " + B; g.fillText("OPEN", 238, y);
      } else {
        var r = mine[0];
        var title = r.title.length > 30 ? r.title.slice(0, 29) + "…" : r.title;
        g.fillStyle = "#171410"; g.font = "700 38px " + B; g.fillText(title, 200, y - 6);
        g.fillStyle = "#5c564e"; g.font = "400 28px " + B;
        g.fillText(r.time + " · " + (r.place.length > 26 ? r.place.slice(0, 25) + "…" : r.place) + (mine.length > 1 ? "  +" + (mine.length - 1) + " more" : ""), 200, y + 32);
      }
      g.fillStyle = "rgba(23,20,16,.18)"; g.fillRect(50, y + 62, 840, 2);
      y += 140;
    });
    var t = totalLine();
    g.fillStyle = "#171410"; g.font = "800 48px " + D;
    g.fillText((usingSample ? "" : t.money + " · ") + t.plans + (t.plans === 1 ? " plan" : " plans") + " · " + t.open + " open", 50, 1190);
    g.restore();
    // the stamp
    g.save(); g.translate(800, 1530); g.rotate(-0.2);
    g.strokeStyle = "#1f6f58"; g.lineWidth = 8; g.strokeRect(-190, -70, 380, 120);
    g.fillStyle = "#1f6f58"; g.font = "800 84px " + D; g.textAlign = "center";
    g.fillText(torn.length ? "Sorted." : "Open.", 0, 22);
    g.restore();
    g.fillStyle = "#f6f1e6"; g.font = "800 64px " + D; g.fillText("Who's in?", 80, 1760);
    g.fillStyle = "#b7b0a4"; g.font = "500 32px " + B;
    g.fillText(usingSample ? "Weekline · Sample week" : "Weekline · rows from NYC Parks", 80, 1830);
    return new Promise(function (res) { cv.toBlob(function (b) { res(b); }, "image/png"); });
  }
  function download(blob, name) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }
  $("#save").addEventListener("click", async function () {
    var b = await makeCard();
    if (b) download(b, "my-week.png");
  });
  $("#send").addEventListener("click", async function () {
    var btn = $("#send");
    btn.disabled = true;
    btn.textContent = "Making your card…";
    var blob = null;
    try { blob = await makeCard(); } catch (e) { blob = null; }
    btn.disabled = false;
    btn.textContent = "Send to the chat";
    var link = shareLink();
    var text = torn.length ? "Sorted my week. Who's in?" : "My week is wide open. Pick one?";
    try {
      var file = blob && new File([blob], "my-week.png", { type: "image/png" });
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text: text + " " + link }); return; }
      if (navigator.share) { await navigator.share({ text: text, url: link }); return; }
    } catch (e) {
      return; // closed the share sheet
    }
    try {
      await navigator.clipboard.writeText(text + " " + link);
      btn.textContent = "Link copied";
      setTimeout(function () { btn.textContent = "Send to the chat"; }, 1800);
    } catch (e) { /* no clipboard */ }
    if (blob) download(blob, "my-week.png");
  });

  /* ---------- .ics of the live rows ---------- */
  $("#ics").addEventListener("click", function () {
    var stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
    var f = function (iso) { return String(iso).slice(0, 19).replace(/[-:]/g, ""); };
    var clean = function (s) { return String(s).replace(/[\\;,]/g, function (c) { return "\\" + c; }).replace(/\n/g, " "); };
    var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Weekline//Tear your week//EN", "CALSCALE:GREGORIAN"];
    torn.filter(function (r) { return r.source === "live"; }).forEach(function (r) {
      lines.push("BEGIN:VEVENT", "UID:nyc-parks-" + r.id + "@weekline", "DTSTAMP:" + stamp,
        "DTSTART;TZID=America/New_York:" + f(r.start));
      if (r.end) lines.push("DTEND;TZID=America/New_York:" + f(r.end));
      lines.push("SUMMARY:" + clean(r.title), "LOCATION:" + clean(r.place), "URL:" + r.url, "DESCRIPTION:From NYC Parks via Weekline", "END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    download(new Blob([lines.join("\r\n")], { type: "text/calendar" }), "my-week.ics");
  });

  $("#again").addEventListener("click", function () {
    torn = [];
    show("beat-ask");
  });

  /* ---------- go ---------- */
  paintSide();
  pool = weekRows();
  pool.catch(function () { /* handled in start() */ });

  if (friendIds.length) {
    friendIds.forEach(function (g) { friendSet[g] = 1; });
    $("#friend-q").textContent = friendWho + " tore " + friendIds.length + (friendIds.length === 1 ? " flyer" : " flyers") + ". Are you in?";
    $("#friend-sheet").innerHTML = DAYS.map(function (d) { return "<span>" + d.charAt(0) + "</span>"; }).join("");
    show("beat-friend");
    var friendRows = rowsById(friendIds).catch(function () { return []; });
    friendRows.then(function (rows) {
      var have = {};
      rows.forEach(function (r) { have[r.day] = 1; });
      $$("#friend-sheet span").forEach(function (s, k) { s.classList.toggle("is-on", !!have[k]); });
    });
    $("#friend-go").addEventListener("click", async function () { start(await friendRows); });
  }
})();
