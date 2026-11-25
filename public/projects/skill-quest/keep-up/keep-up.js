/* Keep up: renders one week from window.EZ_WEEKS (weeks.js). The latest week on keep-up/, a past week on keep-up/<slug>/
   (that page sets window.EZ_KU_SLUG). Nothing leaves the phone: "Did this help?", the last-visit marker and big text
   live in localStorage only. (25 Nov 2026) */
(function () {
  "use strict";
  var WEEKS = window.EZ_WEEKS || [], BASE = "/projects/skill-quest/keep-up/";
  if (!WEEKS.length) return;
  var slug = window.EZ_KU_SLUG || WEEKS[0].slug;
  var W = WEEKS.filter(function (w) { return w.slug === slug; })[0] || WEEKS[0];
  var latest = W === WEEKS[0];
  var CATS = { Tools: "tools", Safety: "safety", Money: "money", Rules: "rules" };
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  function stories(w) { return [w.top].concat(w.items || []); }
  function short(w) { return w.week.replace(/^Week of /, "").replace(/, \d{4}$/, ""); }
  function words(w) { return stories(w).map(function (s) { return [s.headline, s.what, s.you].join(" "); }).join(" ").split(/\s+/).length; }
  function chip(cat) { return '<span class="ku-cat" data-c="' + (CATS[cat] || "tools") + '">' + esc(cat) + "</span>"; }
  function tryIt(s, big) {
    if (!s.try) return '<p class="ku-none">Nothing to do</p>';
    return '<a class="' + (big ? "btn" : "ku-try") + '" href="' + esc(s.try.url) + '">' + esc(s.try.label) + " →</a>";
  }
  function src(s) { return '<p class="ku-src"><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.source) + "</a> · " + esc(s.date) + "</p>"; }

  /* header */
  var n = stories(W).length, mins = Math.max(1, Math.round(words(W) / 200));
  $("ku-meta").textContent = short(W) + " · " + n + " stories · " + mins + " min";
  if (!latest) { var back = $("ku-latest"); back.hidden = false; back.href = BASE; }

  /* top story */
  var T = W.top;
  $("ku-top").innerHTML =
    (T.img ? '<figure class="ku-pic"><img src="' + esc(T.img) + '" alt="' + esc(T.alt || "") + '" width="1200" height="630"><figcaption>' + esc(T.credit || "") + "</figcaption></figure>" : "") +
    '<div class="ku-body">' + chip(T.cat) + "<h2>" + esc(T.headline) + "</h2>" +
    '<dl class="ku-lines"><dt>What changed</dt><dd>' + esc(T.what) + '</dd><dt>For you</dt><dd class="ku-you">' + esc(T.you) + "</dd></dl>" +
    '<div class="btns">' + tryIt(T, true) + "</div>" + src(T) + "</div>";

  /* two smaller cards */
  $("ku-more").innerHTML = (W.items || []).map(function (s) {
    return '<article class="ku-card">' + chip(s.cat) + "<h3>" + esc(s.headline) + "</h3>" +
      '<dl class="ku-lines"><dt>What changed</dt><dd>' + esc(s.what) + '</dd><dt>For you</dt><dd class="ku-you">' + esc(s.you) + "</dd></dl>" +
      tryIt(s, false) + src(s) + "</article>";
  }).join("");

  /* categories: tap one to see every story in it, this week and past weeks */
  var all = [];
  WEEKS.forEach(function (w) { stories(w).forEach(function (s) { all.push({ s: s, w: w }); }); });
  var cbox = $("ku-cats"), list = $("ku-catlist"), on = "";
  cbox.innerHTML = Object.keys(CATS).map(function (c) {
    var k = all.filter(function (x) { return x.s.cat === c; }).length;
    return '<button type="button" class="ku-cbtn" data-c="' + CATS[c] + '" data-cat="' + c + '" aria-pressed="false">' + c + " <small>" + k + "</small></button>";
  }).join("");
  cbox.onclick = function (e) {
    var b = e.target.closest("button"); if (!b) return;
    on = on === b.dataset.cat ? "" : b.dataset.cat;
    cbox.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x.dataset.cat === on)); });
    if (!on) { list.hidden = true; return; }
    var hits = all.filter(function (x) { return x.s.cat === on; });
    list.hidden = false;
    list.innerHTML = hits.length ? hits.map(function (x) {
      return '<li><a href="' + BASE + x.w.slug + '/"><b>' + esc(x.s.headline) + "</b><small>" + esc(short(x.w)) + " · " + esc(x.s.source) + "</small></a></li>";
    }).join("") : '<li class="ku-empty">No ' + esc(on) + " stories yet.</li>";
  };

  /* did this help? one tap, this phone only */
  var HK = "ez-keepup-help-" + W.slug, help = $("ku-help");
  function markHelp(v) { help.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.v === v)); }); $("ku-thanks").hidden = !v; }
  markHelp(store(HK) || "");
  help.onclick = function (e) { var b = e.target.closest("button"); if (!b) return; store(HK, b.dataset.v); markHelp(b.dataset.v); };

  /* past weeks */
  $("ku-past").innerHTML = WEEKS.map(function (w) {
    var dots = stories(w).map(function (s) { return '<i data-c="' + (CATS[s.cat] || "tools") + '" title="' + esc(s.cat) + '"></i>'; }).join("");
    var here = w === W;
    return '<li><a href="' + BASE + w.slug + '/"' + (here ? ' aria-current="page"' : "") + "><small>" + esc(short(w)) + (here ? " · you're here" : "") + "</small><b>" + esc(w.top.headline) + '</b><span class="ku-dots">' + dots + "</span></a></li>";
  }).join("");

  /* new since your last visit (latest week only) */
  if (latest) {
    var KEY = "ez-keepup-seen", last = store(KEY) || "";
    if (last && last !== W.week) $("ku-new").hidden = false;
    store(KEY, W.week);
  }

  /* listen: the phone's own voice reads the stories */
  var say = $("ku-listen");
  if (!("speechSynthesis" in window)) say.hidden = true;
  else say.onclick = function () {
    if (speechSynthesis.speaking) { speechSynthesis.cancel(); say.textContent = "Listen"; return; }
    var text = stories(W).map(function (s) { return s.headline + ". " + s.what + " For you: " + s.you; }).join(" Next. ");
    var u = new SpeechSynthesisUtterance(text); u.rate = 0.95;
    u.onend = u.onerror = function () { say.textContent = "Listen"; };
    speechSynthesis.speak(u); say.textContent = "Stop";
  };

  /* send this week: a square picture of the top story, drawn on the phone */
  var pageUrl = location.origin + BASE + W.slug + "/";
  function rr(x, px, py, w, h, r) { x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath(); }
  function wrap(x, text, max) {
    var out = [], line = "";
    String(text).split(" ").forEach(function (w) { var t = line ? line + " " + w : w; if (line && x.measureText(t).width > max) { out.push(line); line = w; } else line = t; });
    if (line) out.push(line); return out;
  }
  function draw(img) {
    var S = 1080, c = document.createElement("canvas"); c.width = S; c.height = S;
    var x = c.getContext("2d"), D = '"Bricolage Grotesque", system-ui, sans-serif', F = '"Schibsted Grotesk", system-ui, sans-serif';
    x.fillStyle = "#FBFAF7"; x.fillRect(0, 0, S, S);
    rr(x, 56, 56, 968, 968, 40); x.fillStyle = "#151411"; x.fill();
    rr(x, 40, 40, 968, 968, 40); x.fillStyle = "#fff"; x.fill(); x.lineWidth = 6; x.strokeStyle = "#151411"; x.stroke();
    x.save(); rr(x, 43, 43, 962, 505, 37); x.clip();
    if (img) { var h = 962 * 630 / 1200; x.drawImage(img, 43, 43, 962, h); } else { x.fillStyle = "#F1EEE7"; x.fillRect(43, 43, 962, 505); }
    x.restore();
    x.fillStyle = "#151411"; x.fillRect(40, 548, 968, 6);
    x.textBaseline = "alphabetic"; x.textAlign = "left";
    x.fillStyle = "#C7391F"; x.font = "700 28px " + F; x.fillText((W.top.cat + " · " + short(W)).toUpperCase(), 92, 612);
    x.fillStyle = "#151411"; x.font = "800 64px " + D;
    var hl = wrap(x, W.top.headline, 900).slice(0, 2); hl.forEach(function (l, i) { x.fillText(l, 92, 686 + i * 68); });
    x.fillStyle = "#5d5952"; x.font = "500 32px " + F;
    wrap(x, "For you: " + W.top.you, 900).slice(0, 2).forEach(function (l, i) { x.fillText(l, 92, 704 + hl.length * 68 + i * 42); });
    x.fillStyle = "#151411"; x.font = "800 36px " + D; x.fillText("AI Made EZ · Keep up", 92, 968);
    return c;
  }
  function shareText() { return "This week in AI, in plain words: " + W.top.headline + ". " + pageUrl + "?from=keepup"; }
  $("ku-send").onclick = function () {
    var btn = this, im = new Image();
    var go = function (ok) {
      draw(ok ? im : null).toBlob(function (blob) {
        var file = null; try { file = new File([blob], "ai-this-week.png", { type: "image/png" }); } catch (e) {}
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], text: shareText() }).catch(function () {});
        else {
          var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "ai-this-week.png"; document.body.appendChild(a); a.click(); a.remove();
          if (navigator.clipboard) navigator.clipboard.writeText(shareText()).then(function () { btn.textContent = "Picture saved, link copied"; }, function () {});
        }
      }, "image/png");
    };
    var f = document.fonts && document.fonts.load ? Promise.all([document.fonts.load('800 64px "Bricolage Grotesque"'), document.fonts.load('700 28px "Schibsted Grotesk"')]).catch(function () {}) : Promise.resolve();
    f.then(function () { if (!W.top.img) return go(false); im.onload = function () { go(true); }; im.onerror = function () { go(false); }; im.src = W.top.img; });
  };

  /* send to a friend (link only) and the Friday reminder: unchanged */
  var url = location.origin + BASE;
  $("remind").onclick = function () {
    var d = new Date(), add = (5 - d.getDay() + 7) % 7 || 7; d.setDate(d.getDate() + add);
    var ymd = d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AI Made EZ//Keep up//EN", "BEGIN:VEVENT", "UID:keepup-" + ymd + "@aimadeez",
      "DTSTAMP:" + ymd + "T090000", "DTSTART:" + ymd + "T090000", "DURATION:PT10M", "RRULE:FREQ=WEEKLY;BYDAY=FR",
      "SUMMARY:This week in AI, in plain words", "DESCRIPTION:5 minutes of AI news that matters for you: " + url, "URL:" + url, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "ai-news-fridays.ics"; a.click();
  };
  $("sharepage").onclick = function () {
    var t = "AI news in plain words, free every Friday: " + url + "?from=keepup";
    if (navigator.share) navigator.share({ title: "This week in AI, in plain words", text: t }).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { $("sharepage").textContent = "Link copied"; });
  };
})();
