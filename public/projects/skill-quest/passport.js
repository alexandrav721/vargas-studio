/* Maker passport: six stamps you collect across Skills Made EZ, saved on this device only.
   Pages call SMEZ.stamp("id") when you earn one; any element with data-passport shows the strip. */
(function () {
  "use strict";
  var KEY = "smez-passport-v1";
  var STAMPS = [
    { id: "spot", name: "Spotted a skill", how: "Judge 3 rounds", href: "/projects/skill-quest/play.html" },
    { id: "open", name: "Opened a ready-made skill", how: "Open any skill", href: "/projects/skill-quest/templates/" },
    { id: "home", name: "Took a skill home", how: "Download one", href: "/projects/skill-quest/templates/" },
    { id: "own", name: "Made my own recipe", how: "Start from scratch", href: "/projects/skill-quest/prototype/v2.html" },
    { id: "plan", name: "Planned an app", how: "Finish a Build Kit plan", href: "/projects/skill-quest/build-kit/" },
    { id: "kit", name: "Got my app kit", how: "Download your plan", href: "/projects/skill-quest/build-kit/" }
  ];
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } }
  function store(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  var css = ".pp{margin:18px 0 0}.pp-top{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:8px}" +
    ".pp-top b{font:800 18px/1.1 var(--display,system-ui)}.pp-top span{font:700 12px var(--mono,monospace);opacity:.78}" +
    ".pp-row{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}" +
    "@media (max-width:520px){.pp-row{grid-template-columns:repeat(3,minmax(0,1fr))}}" +
    ".pp-row a{display:flex;flex-direction:column;align-items:center;gap:4px;text-decoration:none;color:inherit;text-align:center}" +
    ".pp-row svg{width:58px;height:58px}.pp-row .nm{font:700 11.5px/1.2 var(--display,system-ui)}.pp-row .hw{font:500 11px/1.2 var(--mono,monospace);opacity:.78}" +
    ".pp-row .got svg{animation:ppIn .5s cubic-bezier(.3,1.5,.5,1)}@keyframes ppIn{from{transform:scale(1.5) rotate(-20deg)}}" +
    "@media (prefers-reduced-motion:reduce){.pp-row .got svg{animation:none}}";
  function stampSvg(n, got) {
    var ink = got ? "#C7391F" : "#B9AFA2";
    return '<svg viewBox="0 0 64 64" aria-hidden="true"><g transform="rotate(' + (got ? (n % 2 ? -8 : 6) : 0) + ' 32 32)">' +
      '<circle cx="32" cy="32" r="28" fill="' + (got ? "#FFF4E8" : "none") + '" stroke="' + ink + '" stroke-width="3"' + (got ? "" : ' stroke-dasharray="5 5"') + "/>" +
      '<circle cx="32" cy="32" r="21" fill="none" stroke="' + ink + '" stroke-width="1.5"/>' +
      '<text x="32" y="39" text-anchor="middle" font-family="Bricolage Grotesque,system-ui" font-weight="800" font-size="20" fill="' + ink + '">' + (got ? "✓" : n) + "</text></g></svg>";
  }
  function render() {
    var s = load(), els = document.querySelectorAll("[data-passport]");
    if (!els.length) return;
    if (!document.getElementById("pp-css")) { var st = document.createElement("style"); st.id = "pp-css"; st.textContent = css; document.head.appendChild(st); }
    var n = STAMPS.filter(function (x) { return s[x.id]; }).length;
    var html = '<div class="pp"><div class="pp-top"><b>Maker passport</b><span>' + n + " of " + STAMPS.length + " stamps</span></div><ul class=\"pp-row\">" +
      STAMPS.map(function (x, i) {
        var got = !!s[x.id];
        return '<li><a href="' + x.href + '" class="' + (got ? "got" : "") + '" aria-label="' + x.name + (got ? ", stamped" : ", not yet: " + x.how) + '">' +
          stampSvg(i + 1, got) + '<span class="nm">' + x.name + '</span><span class="hw">' + (got ? "Stamped" : x.how) + "</span></a></li>";
      }).join("") + "</ul></div>";
    els.forEach(function (el) { el.innerHTML = html; });
  }
  window.SMEZ = window.SMEZ || {};
  window.SMEZ.stamp = function (id) {
    var s = load(); if (s[id]) return false;
    s[id] = new Date().toISOString().slice(0, 10); store(s); render(); return true;
  };
  window.SMEZ.passport = render;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render); else render();
})();
