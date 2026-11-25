/* Project template engine: covers checklist, fill-in fields (example + talk), live brief, .md download, kit steps, proof.
   Data: window.EZ_TPL (tpl-data.js). Page id: window.EZ_TPL_ID (baked by review/pages.py) or ?t=. */
(function () {
  var D = window.EZ_TPL, U = window.KITUI; if (!D || !U) return;
  var esc = U.esc, hl = U.hl, KEY = "ez-tpl-v1";
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } }
  function store(st) { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function byId(id) { return D.templates.filter(function (t) { return t.id === id; })[0]; }
  function has(v) { return v != null && String(v).trim() !== ""; }
  function filledN(t, a) { return t.fields.filter(function (f) { return has(a[f.key]); }).length; }
  function coversOn(t, a) {
    return t.covers.map(function (c) {
      var fs = t.fields.filter(function (f) { return f.covers === c[0]; });
      return fs.length > 0 && fs.every(function (f) { return has(a[f.key]); });
    });
  }
  function brief(t, a) {
    var lab = {}; t.fields.forEach(function (f) { lab[f.key] = f.label; });
    return t.brief.map(function (b) {
      var v = b[1].replace(/\{(\w+)\}/g, function (_, k, at, all) {
        if (!has(a[k])) return "[" + (lab[k] || k).toLowerCase() + "]";
        var x = String(a[k]).trim(), pre = all.slice(0, at).replace(/\s+$/, "");
        /* mid-sentence: "should Order a cake" -> "should order a cake" (keeps names and acronyms) */
        if (/\b(should|to|can|will|must|please)$/i.test(pre) && /^[A-Z][a-z]/.test(x) && !/^(I|I'm|I’m)\b/.test(x)) x = x.charAt(0).toLowerCase() + x.slice(1);
        return x;
      });
      return "<" + b[0] + ">" + v + "</" + b[0] + ">";
    }).join("\n");
  }
  function whereTo(t, a) { return t.where && has(a[t.where]) ? String(a[t.where]).trim() : (t.lead || "Claude, ChatGPT, Lovable or Bolt"); }
  function md(t, a) {
    var L = ["# " + t.name + ": my brief", "", t.promise + " Paste the brief below into " + whereTo(t, a) + ".", "", "## The brief", "", brief(t, a), "", "## Next steps", ""];
    t.steps.forEach(function (s, i) {
      L.push((i + 1) + ". **" + s.t + ".** " + s.d);
      if (s.p) { L.push(""); s.p.split("\n").forEach(function (x) { L.push("   > " + x); }); L.push(""); }
      if (s.ok) L.push("   Check: " + s.ok);
    });
    if (t.stuck && t.stuck.length) { L.push("", "## Stuck?", ""); t.stuck.forEach(function (s) { L.push("- **" + s[0] + ":** " + s[1]); }); }
    L.push("", "From AI Made EZ (free): " + D.base + t.id + "?from=download", "");
    return L.join("\n");
  }
  window.EZTPL = { brief: function (id, a) { return brief(byId(id), a || {}); }, md: function (id, a) { var t = byId(id); return md(t, a || load()[id] || {}); }, filledN: function (id) { var t = byId(id); return t && t.fields ? filledN(t, load()[id] || {}) : 0; }, load: load };

  /* The Templates home only needs the cards. */
  var home = document.getElementById("tpllist");
  if (home) {
    var st0 = load();
    home.innerHTML = D.templates.map(function (t) {
      var href = t.href || t.id + ".html", chips = "";
      if (t.href) chips = '<span>Opens the App planner</span>';
      else {
        var n = filledN(t, st0[t.id] || {}), m = t.fields.length;
        chips = (n ? '<span class="go">' + n + " of " + m + " filled</span>" : '<span>' + t.covers.length + " things covered</span>") + (t.time ? "<span>" + esc(t.time) + "</span>" : "");
      }
      return '<a class="tcard" href="' + href + '"><span class="ic">' + U.icon(t.icon) + "</span><span><b>" + esc(t.name) + "</b><p>" + esc(t.promise) + '</p><span class="chips">' + chips + "</span></span></a>";
    }).join("");
  }
  var root = document.getElementById("tpl"); if (!root) return;
  var id = window.EZ_TPL_ID || new URLSearchParams(location.search).get("t"), T = byId(id);
  if (!T) { location.replace("./"); return; }
  if (T.href) { location.replace(T.href); return; }
  if (!window.EZ_TPL_ID) { location.replace(T.id + ".html"); return; }
  var ST = load(), A = ST[T.id] = ST[T.id] || {};
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  var h = "";
  h += '<section class="hero tpl-hero"><span class="ic">' + U.icon(T.icon) + '</span><p class="label">Template</p><h1>' + esc(T.name) + '</h1><p class="muted">' + esc(T.promise) + "</p>" +
    '<div class="meta"><span class="free">' + esc(T.cost || "Free") + "</span>" + (T.time ? "<span>About " + esc(T.time) + "</span>" : "") + "<span>Works in any AI</span></div>";
  h += '<div class="covers" id="covers"></div></section>';

  h += '<section class="sec" id="fill"><p class="label">Step 1</p><h2>Fill in your parts.</h2><p class="muted">Short is fine. Stuck? Tap Show me an example.</p>' +
    '<div class="fillbar"><button class="mini" type="button" id="fillall">Fill it all with the sample</button><button class="mini" type="button" id="clearall">Clear</button></div><div class="fills">';
  T.fields.forEach(function (f) {
    var ctl = f.multi ? '<textarea id="f-' + f.key + '" data-k="' + f.key + '" rows="4"></textarea>' : '<input type="text" id="f-' + f.key + '" data-k="' + f.key + '" autocomplete="off">';
    h += '<div class="fld" data-f="' + f.key + '"><label for="f-' + f.key + '">' + esc(f.label) + "</label>" + (f.hint ? '<p class="hint">' + esc(f.hint) + "</p>" : "") + ctl +
      '<div class="acts"><button class="mini" type="button" data-ex="' + f.key + '">Show me an example</button>' + (SR ? '<button class="mini talk" type="button" data-talk="' + f.key + '" aria-pressed="false">🎤 Talk</button>' : "") + "</div>" +
      '<div class="exbox" id="ex-' + f.key + '" hidden></div></div>';
  });
  h += '</div><p class="small2">' + esc(T.sample || D.sample) + " Saved on this phone only.</p></section>";

  h += '<section class="sec brief" id="brief"><p class="label">Step 2</p><h2>Your brief.</h2><p class="muted" id="where"></p><pre class="tpl" id="preview"></pre>' +
    '<div class="dl"><button class="btn" type="button" id="dlmd">Download the file</button><button class="copy ghost" type="button" data-copy="brief">Copy the brief</button></div>' +
    '<p class="small2">One text file: your brief plus the next steps. Opens on any phone.</p></section>';

  h += '<section class="sec" id="then"><p class="label">Step 3</p><h2>Then do this.</h2>';
  h += '<details class="ex"><summary>Pick a tool (free works)</summary><div class="toollist">' + T.tools.map(function (t) {
    return '<div class="tool"><b>' + esc(t[0]) + '</b><span class="badge' + (/^free/i.test(t[1]) ? " free" : "") + '">' + esc(t[1]) + '</span><span class="d">' + esc(t[2]) + "</span></div>";
  }).join("") + '</div><p class="checked">Plans checked on official pages, ' + esc(D.checked) + ".</p></details>";
  h += '<div class="steps">' + T.steps.map(function (s, j) {
    var body = "<p>" + esc(s.d) + "</p>";
    if (s.p) { U.COPY["s" + j] = s.p; body += '<pre class="tpl">' + hl(s.p) + '</pre><div class="copyrow"><button class="copy" type="button" data-copy="s' + j + '">Copy</button></div>'; }
    if (s.ok) body += '<p class="ok"><b>Check:</b> ' + esc(s.ok) + "</p>";
    return '<details class="step"><summary>' + esc(s.t) + '</summary><div class="body">' + body + "</div></details>";
  }).join("") + "</div>";
  if (T.stuck && T.stuck.length) h += '<details class="ex"><summary>Stuck?</summary><div class="stuck">' + T.stuck.map(function (s) { return "<details><summary>" + esc(s[0]) + "</summary><p>" + esc(s[1]) + "</p></details>"; }).join("") + "</div></details>";
  if (T.privacy) h += '<p class="note"><b>Keep it private:</b> ' + esc(T.privacy) + "</p>";
  if (T.pdf) h += '<p style="margin-top:14px"><a class="btn ghost" href="' + T.pdf + '">Printable version (PDF)</a></p>';
  h += "</section>";

  var P = T.proof;
  if (P) {
    var bar = function (label, v, cls) { return '<div class="score"><span>' + label + '</span><span class="bar ' + cls + '"><i style="width:' + Math.round(v / 5 * 100) + '%"></i></span><b>' + Number(v).toFixed(1) + "</b></div>"; };
    var w = P.winner === "template" ? '<span class="w">Template won</span>' : P.winner === "tie" ? '<span class="w tie">Tie</span>' : '<span class="w tie">Plain won</span>';
    var both = P.kitImg
      ? '<div class="pair"><div class="pane"><p class="k">Plain ask: “' + esc(P.plainAsk) + '”</p><img src="' + P.plainImg + '" alt="Phone screenshot of the plain-ask result" loading="lazy"></div><div class="pane"><p class="k">With this template</p><img src="' + P.kitImg + '" alt="Phone screenshot of the template result" loading="lazy"></div></div>'
      : '<details class="ex"><summary>Read both answers</summary><div class="pair"><div class="pane"><p class="k">Plain ask: “' + esc(P.plainAsk) + '”</p><div class="out">' + esc(P.plainOut) + '</div></div><div class="pane"><p class="k">With this template</p><div class="out">' + esc(P.kitOut) + "</div></div></div></details>";
    h += '<section class="sec" id="proof"><p class="label">Does it work?</p><h2>Same job, asked two ways.</h2><p class="muted">Scored 1 to 5 by a separate AI that didn’t know which was which.</p><div class="proof">' +
      bar("Plain ask", P.plainScore, "p") + bar("With this", P.kitScore, "t") + '<p class="verdict">' + w + esc(P.reason) + "</p>" + (P.note ? '<p class="small2">' + esc(P.note) + "</p>" : "") + both + '</div><p class="small2">' + esc(T.sample || D.sample) + " Run " + esc(D.checked) + ".</p></section>";
  }
  h += '<section class="sec"><p class="label">More templates</p><div class="more">' + D.templates.filter(function (t) { return t.id !== T.id; }).map(function (t) {
    return '<a class="chip" href="' + (t.href || t.id + ".html") + '">' + esc(t.name) + "</a>";
  }).join("") + '<a class="chip" href="./#quick">Quick templates</a></div></section>';
  root.innerHTML = h;

  var pv = document.getElementById("preview"), cv = document.getElementById("covers"), wh = document.getElementById("where");
  function paint() {
    var on = coversOn(T, A), n = filledN(T, A), m = T.fields.length;
    var part = T.covers.map(function (c) { return T.fields.some(function (f) { return f.covers === c[0] && has(A[f.key]); }); });
    cv.innerHTML = '<div class="top2"><b>What this covers</b><span class="n">' + n + " of " + m + ' answered</span></div><div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="' + m + '" aria-valuenow="' + n + '" aria-label="Answered"><i style="width:' + Math.round(n / m * 100) + '%"></i></div><ul>' +
      T.covers.map(function (c, i) { return '<li class="' + (on[i] ? "on" : part[i] ? "part" : "") + '">' + esc(c[1]) + "</li>"; }).join("") + "</ul>";
    var b = brief(T, A); U.COPY.brief = b;
    pv.innerHTML = b.split("\n").map(function (line) { var m = line.match(/^<(\w+)>([\s\S]*)<\/\1>$/); if (!m) return esc(line); var t = ({ who_its_for: "Who it’s for" })[m[1]] || m[1].replace(/_/g, " "); return "<b>" + esc(t.charAt(0).toUpperCase() + t.slice(1)) + "</b>\n" + esc(m[2]).replace(/\[([^\]]+)\]/g, '<span class="gap">[$1]</span>'); }).join("\n\n");
    wh.textContent = "Paste it into " + whereTo(T, A) + ".";
    document.querySelectorAll(".fld").forEach(function (el) { el.classList.toggle("done", has(A[el.dataset.f])); });
  }
  function set(k, v) { A[k] = v; ST[T.id] = A; store(ST); paint(); }
  document.querySelectorAll("[data-k]").forEach(function (el) {
    el.value = A[el.dataset.k] || "";
    el.addEventListener("input", function () { set(el.dataset.k, el.value); });
  });
  function field(k) { return T.fields.filter(function (f) { return f.key === k; })[0]; }
  function put(k, v) { var el = document.getElementById("f-" + k); el.value = v; set(k, v); }
  root.addEventListener("click", function (e) {
    var b = e.target.closest("[data-ex]");
    if (b) {
      var k = b.dataset.ex, f = field(k), box = document.getElementById("ex-" + k);
      if (!has(A[k])) { put(k, f.ex); box.hidden = true; return; }
      if (!box.hidden) { box.hidden = true; return; }
      box.innerHTML = esc(f.ex) + '<br><button class="mini" type="button" data-use="' + k + '">Use this instead</button>'; box.hidden = false; return;
    }
    var u = e.target.closest("[data-use]");
    if (u) { put(u.dataset.use, field(u.dataset.use).ex); document.getElementById("ex-" + u.dataset.use).hidden = true; }
  });
  document.getElementById("fillall").onclick = function () { T.fields.forEach(function (f) { if (!has(A[f.key])) put(f.key, f.ex); }); };
  document.getElementById("clearall").onclick = function () { if (!confirm("Clear everything you typed here?")) return; T.fields.forEach(function (f) { put(f.key, ""); }); };
  document.getElementById("dlmd").onclick = function () {
    var blob = new Blob([md(T, A)], { type: "text/plain;charset=utf-8" }), a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = T.id + "-brief.txt"; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };
  /* Talk: speech to text, added to the end of the field. Only shown where the browser supports it. */
  var rec = null, recBtn = null;
  function stop() { if (rec) { try { rec.stop(); } catch (e) {} } }
  root.addEventListener("click", function (e) {
    var b = e.target.closest("[data-talk]"); if (!b) return;
    if (rec) { var same = recBtn === b; stop(); if (same) return; }
    var k = b.dataset.talk, el = document.getElementById("f-" + k);
    var r = new SR(); rec = r; recBtn = b; r.lang = navigator.language || "en-US"; r.continuous = true; r.interimResults = false;
    r.onresult = function (ev) {
      for (var i = ev.resultIndex; i < ev.results.length; i++) if (ev.results[i].isFinal) {
        var said = ev.results[i][0].transcript.trim(); if (!said) continue;
        el.value = (el.value && !/\s$/.test(el.value) ? el.value + " " : el.value) + said; set(k, el.value);
      }
    };
    r.onend = r.onerror = function () { b.classList.remove("on"); b.setAttribute("aria-pressed", "false"); b.textContent = "🎤 Talk"; if (rec === r) { rec = null; recBtn = null; } };
    try { r.start(); b.classList.add("on"); b.setAttribute("aria-pressed", "true"); b.textContent = "Stop"; } catch (err) { rec = null; recBtn = null; }
  });
  paint();
})();
