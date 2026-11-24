/* The site bar for static pages (games and project pieces):
     <link rel="stylesheet" href="/site-bar.css" />
     <script src="/site-bar.js" data-project="<project id>" data-kind="game|piece" defer></script>
   game  → "← Vargas Studio" (home, Play section)          · "How I built it →" (the project page)
   piece → "← <Project name>" (project page) · "Vargas Studio" (home)
   It replaces the page's own back-to-studio link. Same look as src/SiteBar.tsx. */
(function () {
  "use strict";
  var NAMES = {
    weekline: "Weekline", restitch: "Restitch", nostalgia: "Scrollback", scrolll: "Get Paid to Scroll",
    loop: "Loop", "planner-book": "Planners", "habit-game": "Lumen", "skill-quest": "Skills Made EZ"
  };
  var me = document.currentScript;
  var pid = me && me.getAttribute("data-project");
  var kind = (me && me.getAttribute("data-kind")) || "piece";
  if (!pid || !NAMES[pid]) return;

  function build() {
    if (document.querySelector(".site-bar")) return;
    var bar = document.createElement("nav");
    bar.className = "site-bar";
    bar.setAttribute("aria-label", "Vargas Studio");
    var page = "/#/p/" + pid;
    bar.innerHTML = kind === "game"
      ? '<a href="/#ideas">← Vargas Studio</a><a class="site-home" href="' + page + '">How I built it →</a>'
      : '<a href="' + page + '">← ' + NAMES[pid] + '</a><a class="site-home" href="/">Vargas Studio</a>';
    document.body.insertBefore(bar, document.body.firstChild);

    // hide the page's own "back to studio" link(s), including ones an app draws a moment later
    function hideOwn() {
      Array.prototype.forEach.call(document.querySelectorAll("a"), function (a) {
        if (bar.contains(a) || a.style.display === "none") return;
        var h = a.getAttribute("href") || "";
        var t = (a.textContent || "").trim();
        if (a.classList.contains("studio-back") || ((h === "/" || h === "/#/" || h === "/index.html" || h === "index.html" || h === "./index.html") && (/studio/i.test(t) || t === "←"))) {
          a.hidden = true;
          a.style.display = "none";
        }
      });
    }
    hideOwn();
    if (window.MutationObserver) {
      var mo = new MutationObserver(hideOwn);
      mo.observe(document.body, { childList: true, subtree: true });
      setTimeout(function () { mo.disconnect(); }, 6000);
    }
    // small fixed controls pinned to the very top move below the bar
    Array.prototype.forEach.call(document.body.querySelectorAll("*"), function (el) {
      if (bar.contains(el)) return;
      var cs = getComputedStyle(el);
      if (cs.position !== "fixed") return;
      var top = parseFloat(cs.top);
      var r = el.getBoundingClientRect();
      if (!isNaN(top) && top < 48 && r.height > 0 && r.height < 120) el.style.top = top + 48 + "px";
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
