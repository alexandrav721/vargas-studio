/* Renders the AI kitchen map (window.EZMAP) into #kmap: the flow strip, 8 stations of word chips,
   a definition popover (hover on a mouse, tap on a phone), and a print-only word list. */
(function () {
  var M = window.EZMAP, root = document.getElementById("kmap");
  if (!M || !root) return;
  var GLOSS = "/projects/skill-quest/school/kitchen/glossary.html";
  var GAME = "/projects/skill-quest/the-pass/";
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function slug(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, "-"); }
  function svg(p) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + "</svg>"; }
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function draw() {
    var all = M.all(), known = all.filter(function (t) { return M.state(t) === 2; }).length, lrn = all.filter(function (t) { return M.state(t) === 1; }).length;
    var h = '<ol class="kflow" aria-label="How one answer gets made">' + M.flow.map(function (f, i) {
      return '<li style="--i:' + i + '"><b>' + esc(f[0]) + "</b><span>" + esc(f[1]) + "</span></li>";
    }).join("") + '<i class="kdot" aria-hidden="true"></i></ol>';
    h += '<div class="kbar"><p class="klegend"><span class="s0">new</span><span class="s1">learning</span><span class="s2">known</span></p>' +
      '<p class="kcount"><b>' + known + "</b> of " + all.length + " words known" + (lrn ? " · " + lrn + " learning" : "") + "</p><a class="btn kplay" href="' + GAME + '">' + (known || lrn ? "Keep playing The Pass →" : "Play The Pass →") + '</a></div>';
    h += '<div class="kgrid">' + M.zones.map(function (z) {
      return '<section class="kst" style="--hue:' + z.hue + '"><header><span class="kic">' + svg(z.icon) + "</span><div><h2>" + esc(z.name) + "</h2><p>" + esc(z.sub) + '</p></div></header><div class="kchips">' +
        z.words.filter(M.get).map(function (t) {
          return '<button type="button" class="kw s' + M.state(t) + '" data-t="' + esc(t) + '" aria-haspopup="dialog">' + esc(t) + "</button>";
        }).join("") + '</div><dl class="kprint">' + z.words.filter(M.get).map(function (t) { var w = M.get(t); return "<dt>" + esc(t) + "</dt><dd>" + esc(w[2]) + "</dd>"; }).join("") + "</dl></section>";
    }).join("") + "</div>";
    h += '<div class="kpop" id="kpop" role="dialog" aria-modal="false" hidden></div>';
    root.innerHTML = h;
    if (!reduce && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: 0.15 });
      root.querySelectorAll(".kst").forEach(function (s, i) { s.style.setProperty("--d", (i % 4) * 60 + "ms"); io.observe(s); });
      root.querySelector(".kflow").classList.add("go");
    } else root.querySelectorAll(".kst").forEach(function (s) { s.classList.add("in"); });
  }

  var pop, cur = null, hoverT = null;
  function open(btn, pinned) {
    var t = btn.dataset.t, w = M.get(t), z = M.zoneOf(t); if (!w) return;
    if (cur) cur.classList.remove("on");
    cur = btn; btn.classList.add("on"); btn.setAttribute("aria-expanded", "true");
    pop.style.setProperty("--hue", z ? z.hue : "var(--ink)");
    pop.innerHTML = '<button type="button" class="kx" aria-label="Close">×</button><p class="kz">' + esc(z ? z.name : "") + "</p><h3>" + esc(t) + '</h3><p class="kk">In the kitchen: ' + esc(w[1]) + "</p><p>" + esc(w[2]) + "</p>" +
      (w[3] ? '<p class="kn"><b>Not:</b> ' + esc(w[3].replace(/^Not /, "").replace(/^not /, "")) + "</p>" : "") +
      (w[5] ? '<p class="ke">“' + esc(w[5]) + "”</p>" : "") +
      '<a href="' + GLOSS + "#" + slug(t) + '">More in Plain words →</a>';
    pop.hidden = false; pop.dataset.pinned = pinned ? "1" : "";
    place(btn);
    if (!reduce) { pop.classList.remove("show"); void pop.offsetWidth; pop.classList.add("show"); }
  }
  function close() { if (!pop || pop.hidden) return; pop.hidden = true; if (cur) { cur.classList.remove("on"); cur.setAttribute("aria-expanded", "false"); } cur = null; }
  function place(btn) {
    if (window.innerWidth < 640) { pop.className = "kpop sheet" + (reduce ? "" : " show"); pop.style.left = pop.style.top = ""; return; }
    pop.className = "kpop" + (reduce ? "" : " show");
    var r = btn.getBoundingClientRect(), rr = root.getBoundingClientRect(), pw = 320;
    var left = Math.min(Math.max(r.left - rr.left + r.width / 2 - pw / 2, 0), rr.width - pw);
    pop.style.left = left + "px"; pop.style.top = (r.bottom - rr.top + 10) + "px";
    pop.style.setProperty("--ax", (r.left - rr.left + r.width / 2 - left) + "px");
  }

  draw();
  pop = document.getElementById("kpop");
  var fine = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  root.addEventListener("click", function (e) {
    if (e.target.closest(".kx")) { var c = cur; close(); if (c) c.focus(); return; }
    var b = e.target.closest(".kw"); if (!b) return;
    if (cur === b && pop.dataset.pinned) { close(); return; }
    open(b, true);
  });
  if (fine) {
    root.addEventListener("mouseover", function (e) { var b = e.target.closest(".kw"); if (!b || pop.dataset.pinned) return; clearTimeout(hoverT); hoverT = setTimeout(function () { open(b, false); }, 90); });
    root.addEventListener("mouseout", function (e) { var b = e.target.closest(".kw"); if (!b || pop.dataset.pinned) return; var to = e.relatedTarget; if (to && (to.closest && to.closest("#kpop"))) return; clearTimeout(hoverT); hoverT = setTimeout(close, 120); });
    root.addEventListener("mouseover", function (e) { if (e.target.closest("#kpop")) clearTimeout(hoverT); });
  }
  document.addEventListener("click", function (e) { if (!e.target.closest("#kmap .kw") && !e.target.closest("#kpop")) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && cur) { var c = cur; close(); c.focus(); } });
  window.addEventListener("resize", function () { if (cur && !pop.hidden) place(cur); });
})();
