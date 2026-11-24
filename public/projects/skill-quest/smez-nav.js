/* Skills Made EZ top bar + search, shared by every page. Add:
   <script src="/projects/skill-quest/smez-index.js" defer></script>
   <script src="/projects/skill-quest/smez-nav.js" data-section="ready" defer></script>
   data-section: start | ready | make | school | community (highlights the current place). */
(function () {
  "use strict";
  var me = document.currentScript, section = me && me.dataset.section || "";
  var BASE = "/projects/skill-quest/";
  var LINKS = [["start", "Start here", BASE + "start/"], ["ready", "Ready-made", BASE + "templates/"], ["make", "Make a skill", BASE + "prototype/v2.html"], ["school", "AI Made EZ", BASE + "school/"], ["community", "Community", BASE + "library/"]];
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function css() { if (document.getElementById("smez-nav-css")) return; var l = document.createElement("link"); l.id = "smez-nav-css"; l.rel = "stylesheet"; l.href = BASE + "smez-nav.css"; document.head.appendChild(l); }

  /* ---------- search ---------- */
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim(); }
  function near(a, b) { /* one typo allowed for words of 4+ letters */
    if (Math.abs(a.length - b.length) > 1 || a.length < 4) return false;
    var i = 0, j = 0, e = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++e > 1) return false;
      if (a.length === b.length && a[i] === b[j + 1] && a[i + 1] === b[j]) { i += 2; j += 2; continue; } /* swapped letters */
      if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
    }
    return e + (a.length - i) + (b.length - j) <= 1;
  }
  function search(q) {
    var words = norm(q).split(" ").filter(function (w) { return w.length > 1; });
    if (!words.length) return [];
    return (window.SMEZ_INDEX || []).map(function (it) {
      var title = norm(it.t), kw = norm(it.k + " " + it.y), line = norm(it.d), score = 0, all = true;
      words.forEach(function (w) {
        var s = 0;
        if (title.indexOf(w) === 0) s = 6; else if ((" " + title).indexOf(" " + w) >= 0) s = 5; else if (title.indexOf(w) >= 0) s = 3;
        else if ((" " + kw).indexOf(" " + w) >= 0) s = 3; else if (line.indexOf(w) >= 0) s = 1.5;
        else if ((title + " " + kw).split(" ").some(function (t) { return near(w, t) || (w.length >= 4 && t.indexOf(w.slice(0, -1)) === 0); })) s = 1;
        if (!s) all = false; score += s;
      });
      return { it: it, score: all ? score + (it.y === "Tool" || it.y === "Course" ? 0.5 : 0) : 0 };
    }).filter(function (x) { return x.score > 0; }).sort(function (a, b) { return b.score - a.score; }).slice(0, 12).map(function (x) { return x.it; });
  }
  function resultsHTML(list) {
    return list.map(function (it, i) {
      return '<li><a href="' + esc(it.u) + '" data-i="' + i + '"><span class="ty ' + esc(it.y.split(" ")[0]) + '">' + esc(it.y) + "</span><b>" + esc(it.t) + '</b><span class="dl">' + esc(it.d) + "</span></a></li>";
    }).join("");
  }
  function doorsHTML() {
    return '<div class="smez-doors">' + LINKS.map(function (l) { return '<a href="' + l[2] + '">' + l[1] + "</a>"; }).join("") +
      '<a href="' + BASE + 'play.html">Play a game</a><a href="' + BASE + 'library/#/how">How we test</a></div>';
  }
  /* wire any search box: input, results list, empty slot */
  function wire(input, list, emptyEl, hintEl) {
    var sel = -1, current = [];
    function draw() {
      var q = input.value.trim();
      sel = -1;
      if (q.length < 2) {
        var pop = (window.SMEZ_POPULAR || []).map(function (p) { return search(p)[0]; }).filter(Boolean);
        current = pop; list.innerHTML = resultsHTML(pop);
        if (hintEl) hintEl.hidden = false; if (emptyEl) emptyEl.hidden = true; return;
      }
      current = search(q);
      list.innerHTML = resultsHTML(current);
      if (hintEl) hintEl.hidden = true;
      if (emptyEl) {
        emptyEl.hidden = !!current.length;
        if (!current.length) emptyEl.innerHTML = "<p>No matches for “" + esc(q) + "”. Try a shorter word, or go straight to:</p>" + doorsHTML() +
          '<p style="margin-top:10px">Can\'t find it? <a href="' + BASE + 'library/#/requests">Ask the community to make it</a>.</p>';
      }
    }
    function mark() { list.querySelectorAll("a").forEach(function (a, i) { a.setAttribute("aria-selected", String(i === sel)); if (i === sel) a.scrollIntoView({ block: "nearest" }); }); }
    input.addEventListener("input", draw);
    input.addEventListener("keydown", function (e) {
      var n = list.querySelectorAll("a").length;
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(n - 1, sel + 1); mark(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(-1, sel - 1); mark(); }
      else if (e.key === "Enter") { var a = list.querySelectorAll("a")[sel < 0 ? 0 : sel]; if (a) { e.preventDefault(); location.href = a.href; } }
    });
    draw();
    return draw;
  }
  var panel;
  function openSearch(prefill) {
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "smez-search"; panel.hidden = true;
      panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "true"); panel.setAttribute("aria-label", "Search Skills Made EZ");
      panel.innerHTML = '<div class="smez-panel"><div class="smez-box"><input type="search" id="smez-q" placeholder="Search skills, lessons, tools…" aria-label="Search Skills Made EZ" autocomplete="off"><button type="button" data-close>Close</button></div>' +
        '<p class="smez-hint" id="smez-hint">Popular right now</p><ul class="smez-res" id="smez-res"></ul><div class="smez-empty" id="smez-empty" hidden></div></div>';
      document.body.appendChild(panel);
      panel.addEventListener("click", function (e) { if (e.target === panel || e.target.closest("[data-close]")) closeSearch(); });
      panel.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSearch(); });
      wire(panel.querySelector("#smez-q"), panel.querySelector("#smez-res"), panel.querySelector("#smez-empty"), panel.querySelector("#smez-hint"));
    }
    panel.hidden = false;
    var q = panel.querySelector("#smez-q");
    if (prefill != null) { q.value = prefill; q.dispatchEvent(new Event("input")); }
    setTimeout(function () { q.focus(); }, 20);
    document.documentElement.style.overflow = "hidden";
  }
  function closeSearch() { if (panel) panel.hidden = true; document.documentElement.style.overflow = ""; var b = document.querySelector(".smez-sbtn"); if (b) b.focus(); }

  /* ---------- bar ---------- */
  function bar() {
    if (document.querySelector(".smez-bar")) return;
    var skipTarget = document.querySelector("main,#app,[role=main]");
    if (skipTarget && !skipTarget.id) skipTarget.id = "smez-main";
    var skip = document.createElement("a"); skip.className = "smez-skip"; skip.href = "#" + (skipTarget ? skipTarget.id : ""); skip.textContent = "Skip to content";
    var nav = document.createElement("nav");
    nav.className = "smez-bar"; nav.setAttribute("aria-label", "Skills Made EZ");
    nav.innerHTML = '<div class="smez-in"><a class="smez-logo" href="' + BASE + 'start/">Skills Made <b>EZ</b></a>' +
      '<ul class="smez-links">' + LINKS.map(function (l) { return '<li><a href="' + l[2] + '"' + (l[0] === section ? ' aria-current="page"' : "") + ">" + l[1] + "</a></li>"; }).join("") + "</ul>" +
      '<button type="button" class="smez-sbtn"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/></svg>Search<kbd>/</kbd></button>' +
      '<button type="button" class="smez-mbtn" aria-expanded="false">Menu</button></div>';
    document.body.insertBefore(nav, document.body.firstChild);
    document.body.insertBefore(skip, nav);
    /* the Vargas Studio bar stays on top; ours sits right under it */
    function place() { var sb = document.querySelector(".site-bar"); if (sb && sb.nextElementSibling !== nav) sb.parentNode.insertBefore(nav, sb.nextSibling); }
    place(); window.addEventListener("load", place); setTimeout(place, 600);
    nav.querySelector(".smez-sbtn").onclick = function () { openSearch(); };
    var mb = nav.querySelector(".smez-mbtn");
    mb.onclick = function () { var o = !nav.classList.contains("open"); nav.classList.toggle("open", o); mb.setAttribute("aria-expanded", String(o)); mb.textContent = o ? "Close" : "Menu"; };
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && !/input|textarea|select/i.test((document.activeElement || {}).tagName || "") && !(document.activeElement || {}).isContentEditable) { e.preventDefault(); openSearch(); }
  });
  window.SMEZNav = { search: search, wire: wire, open: openSearch, doors: doorsHTML };
  function boot() { css(); if (!(me && me.dataset.bar === "off")) bar(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
