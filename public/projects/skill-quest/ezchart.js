/* AI Made EZ paired-bar chart: plain ask vs kit/template, per job. Scores 0-5 from blind judges.
   Palette validated with the dataviz validator (light): plain #3f73b8, ours #C7391F, both PASS.
   EZChart.pair(el, rows, {a:"Plain ask", b:"With the kit"}) ; rows = [{name, a, b, tie?, href?}] */
(function () {
  var CSS = ".ezc{margin-top:14px}.ezc-leg{display:flex;gap:14px;flex-wrap:wrap;font-size:.85rem;color:var(--muted,#5d5952);margin-bottom:8px}" +
    ".ezc-leg i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:6px;vertical-align:-1px}" +
    ".ezc-row{display:grid;grid-template-columns:minmax(0,1fr);gap:4px;padding:10px 0;border-top:1px solid var(--track,#F1EEE7)}" +
    ".ezc-row:first-of-type{border-top:0}.ezc-name{font-weight:700;font-size:.95rem;color:var(--ink,#151411);text-decoration:none}" +
    ".ezc-name .t{font:700 10px/1 var(--text,inherit);letter-spacing:.08em;text-transform:uppercase;padding:3px 6px;border-radius:99px;background:var(--track,#F1EEE7);margin-left:6px;vertical-align:2px}" +
    ".ezc-bar{display:grid;grid-template-columns:1fr 34px;align-items:center;gap:8px}" +
    ".ezc-bar span.tr{position:relative;height:12px}.ezc-bar span.tr::before{content:'';position:absolute;inset:5px 0;height:1px;background:var(--track,#F1EEE7)}" +
    ".ezc-bar b{position:relative;display:block;height:12px;border-radius:0 4px 4px 0}" +
    ".ezc-bar em{font:700 13px/1 var(--mono,monospace);font-style:normal;text-align:right;color:var(--ink,#151411)}" +
    ".ezc-tbl{margin-top:8px;font-size:.85rem}.ezc-tbl table{border-collapse:collapse;width:100%}.ezc-tbl td,.ezc-tbl th{text-align:left;padding:4px 6px;border-top:1px solid var(--track,#F1EEE7)}";
  var A = "#3f73b8", B = "#C7391F";
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function bar(v, color, label) {
    return '<div class="ezc-bar" title="' + esc(label + ": " + Number(v).toFixed(1) + " out of 5") + '"><span class="tr"><b style="width:' + (v / 5 * 100) + '%;background:' + color + '"></b></span><em>' + Number(v).toFixed(1) + "</em></div>";
  }
  function pair(el, rows, o) {
    if (!el) return;
    if (!document.getElementById("ezc-css")) { var s = document.createElement("style"); s.id = "ezc-css"; s.textContent = CSS; document.head.appendChild(s); }
    rows = rows.slice().sort(function (x, y) { return (y.b - y.a) - (x.b - x.a); });
    var h = '<div class="ezc" role="group" aria-label="' + esc(o.title || "Scores") + '"><div class="ezc-leg"><span><i style="background:' + A + '"></i>' + esc(o.a) + '</span><span><i style="background:' + B + '"></i>' + esc(o.b) + "</span><span>Scored 1 to 5</span></div>";
    h += rows.map(function (r) {
      var name = r.href ? '<a class="ezc-name" href="' + esc(r.href) + '">' + esc(r.name) + "</a>" : '<span class="ezc-name">' + esc(r.name) + "</span>";
      if (r.tie) name = name.replace(/<\/(a|span)>$/, '<span class="t">Tie</span></$1>');
      return '<div class="ezc-row">' + name + bar(r.a, A, o.a) + bar(r.b, B, o.b) + "</div>";
    }).join("");
    h += '<details class="ezc-tbl"><summary>See as a table</summary><table><tr><th>Job</th><th>' + esc(o.a) + "</th><th>" + esc(o.b) + "</th></tr>" +
      rows.map(function (r) { return "<tr><td>" + esc(r.name) + "</td><td>" + r.a.toFixed(1) + "</td><td>" + r.b.toFixed(1) + "</td></tr>"; }).join("") + "</table></details></div>";
    el.innerHTML = h;
  }
  window.EZChart = { pair: pair };
})();
