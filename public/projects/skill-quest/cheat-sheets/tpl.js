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

  /* The brief IS the form: every {gap} in the brief is a blank you type (or talk) into. A helper sits next to the blank you're in. */
  var CE = "true"; try { var t0 = document.createElement("span"); t0.contentEditable = "plaintext-only"; if (t0.contentEditable === "plaintext-only") CE = "plaintext-only"; } catch (e) {}
  var F = {}; T.fields.forEach(function (f) { F[f.key] = f; });
  var LBL = { goal: "Goal", who_its_for: "Who it’s for", context: "Details", example: "The feel", format: "Format", rules: "Rules" };
  function blank(k) {
    var f = F[k]; if (!f) return "{" + esc(k) + "}";
    return '<span class="blank" role="textbox" tabindex="0" spellcheck="true" contenteditable="' + CE + '" data-k="' + k + '" data-ph="' + esc(f.label.charAt(0).toLowerCase() + f.label.slice(1)) + '" aria-label="' + esc(f.label) + '"' + (f.multi ? ' aria-multiline="true"' : "") + "></span>";
  }
  function fill(s) { return esc(s).replace(/ (\d\)) /g, "<br>$1 ").replace(/ (Photos:) /, "<br>$1 ").replace(/\{(\w+)\}/g, function (_, k) { return blank(k); }); }
  var used = T.brief.map(function (b) { return b[1]; }).join(" ");
  var extra = T.fields.filter(function (f) { return used.indexOf("{" + f.key + "}") < 0; });

  var h = "";
  h += '<section class="hero tpl-hero"><span class="ic">' + U.icon(T.icon) + '</span><p class="label">Template</p><h1>' + esc(T.name) + '</h1><p class="muted">' + esc(T.promise) + "</p>" +
    '<div class="meta"><span class="free">' + esc(T.cost || "Free") + "</span>" + (T.time ? "<span>About " + esc(T.time) + "</span>" : "") + "<span>Works in any AI</span></div>" +
    '<div class="covers" id="covers"></div></section>';

  h += '<section class="work"><div class="docwrap">' +
    '<div class="dochead"><h2>Fill in the blanks.</h2><span class="cnt" id="cnt"></span></div>' +
    '<p class="how">Tap a blank and type' + (SR ? " or talk" : "") + '. <button class="linkbtn" type="button" id="fillall">Fill with the sample</button> · <button class="linkbtn" type="button" id="clearall">Start over</button></p>' +
    '<article class="doc" id="doc">' +
    T.brief.map(function (b) { return '<p class="sec"><b>' + esc(LBL[b[0]] || b[0].replace(/_/g, " ")) + "</b>" + fill(b[1]) + "</p>"; }).join("") +
    extra.map(function (f) { return '<p class="sec"><b>' + esc(f.label) + "</b>" + blank(f.key) + "</p>"; }).join("") +
    '</article><p class="small2">' + esc(T.sample || D.sample) + " Saved on this phone only.</p></div>" +
    '<aside class="side" id="side">' +
    '<div class="helper" id="helper" aria-live="polite"></div>' +
    '<div class="dl" id="dl"><button class="btn" type="button" id="dlmd">Download the file</button><button class="copy ghost" type="button" data-copy="brief">Copy</button>' +
    '<p class="small2" id="where"></p></div></aside></section>';

  h += '<section class="sec" id="then"><p class="label">Next</p><h2>Then do this.</h2>';
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
    h += '<section class="sec" id="proof"><p class="label">Does it work?</p><h2>Same job, asked two ways.</h2><div class="proof">' +
      bar("Plain ask", P.plainScore, "p") + bar("With this", P.kitScore, "t") + '<p class="verdict">' + w + esc(P.reason) + "</p>" + (P.note ? '<p class="small2">' + esc(P.note) + "</p>" : "") + both +
      '</div><p class="small2">Scored 1 to 5 by a separate AI that didn’t know which was which. ' + esc(T.sample || D.sample) + " Run " + esc(D.checked) + ".</p></section>";
  }
  h += '<section class="sec"><p class="label">More templates</p><div class="more">' + D.templates.filter(function (t) { return t.id !== T.id; }).map(function (t) {
    return '<a class="chip" href="' + (t.href || t.id + ".html") + '">' + esc(t.name) + "</a>";
  }).join("") + '<a class="chip" href="./#quick">Quick templates</a></div></section>';
  root.innerHTML = h;

  var doc = document.getElementById("doc"), side = document.getElementById("side"), helper = document.getElementById("helper");
  var cv = document.getElementById("covers"), cnt = document.getElementById("cnt"), wh = document.getElementById("where");
  var blanks = [].slice.call(doc.querySelectorAll(".blank")), cur = null;
  var wide = window.matchMedia("(min-width:900px)");
  function val(el) { return (el.innerText || el.textContent || "").replace(/ /g, " ").replace(/\n{3,}/g, "\n\n"); }
  function paint() {
    var on = coversOn(T, A), n = filledN(T, A), m = T.fields.length;
    var part = T.covers.map(function (c) { return T.fields.some(function (f) { return f.covers === c[0] && has(A[f.key]); }); });
    cv.innerHTML = '<div class="top2"><b>What this covers</b></div><ul>' +
      T.covers.map(function (c, i) { return '<li class="' + (on[i] ? "on" : part[i] ? "part" : "") + '">' + esc(c[1]) + "</li>"; }).join("") + "</ul>";
    cnt.innerHTML = n + " of " + m + ' filled<span class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="' + m + '" aria-valuenow="' + n + '" aria-label="Filled"><i style="width:' + Math.round(n / m * 100) + '%"></i></span>';
    U.COPY.brief = brief(T, A);
    wh.textContent = "One text file: your brief plus the steps. Paste it into " + whereTo(T, A) + ".";
    blanks.forEach(function (el) { el.classList.toggle("has", has(A[el.dataset.k])); });
  }
  function set(k, v, from) {
    A[k] = v; ST[T.id] = A; store(ST);
    blanks.forEach(function (el) { if (el.dataset.k === k && el !== from) el.textContent = v || ""; });
    paint(); if (cur && cur.dataset.k === k) drawHelper();
  }
  blanks.forEach(function (el) { el.textContent = A[el.dataset.k] || ""; });

  /* helper: what to write, an example, talk, next */
  var exOpen = false;
  function drawHelper() {
    if (!cur) {
      var n = filledN(T, A), m = T.fields.length;
      helper.className = "helper idle";
      helper.innerHTML = n >= m ? "<b>All filled in.</b><p>Download the file and paste it into " + esc(whereTo(T, A)) + ".</p>" : "<b>Tap any blank to start.</b><p>Short is fine. Each blank shows an example.</p>";
      return;
    }
    var f = F[cur.dataset.k], full = has(A[f.key]);
    helper.className = "helper";
    helper.innerHTML = "<b>" + esc(f.label) + "</b>" + (f.hint ? "<p>" + esc(f.hint) + "</p>" : "") +
      (exOpen && full ? '<p class="exq">“' + esc(f.ex) + '”</p>' : "") +
      '<div class="acts">' +
      (full ? (exOpen ? '<button class="mini" type="button" data-h="use">Use this example</button>' : '<button class="mini" type="button" data-h="see">See an example</button>') : '<button class="mini" type="button" data-h="use">Use an example</button>') +
      (SR ? '<button class="mini talk' + (rec ? " on" : "") + '" type="button" data-h="talk" aria-pressed="' + (!!rec) + '">' + (rec ? "Stop" : "🎤 Talk") + "</button>" : "") +
      '<button class="mini go" type="button" data-h="next">Next blank →</button></div>';
  }
  function place() {
    if (cur && !wide.matches) { var sec = cur.closest(".sec"); if (sec.nextSibling !== helper) sec.parentNode.insertBefore(helper, sec.nextSibling); }
    else if (helper.parentNode !== side) side.insertBefore(helper, side.firstChild);
  }
  function focusBlank(el) { el.focus(); var r = document.createRange(); r.selectNodeContents(el); r.collapse(false); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  doc.addEventListener("focusin", function (e) { var el = e.target.closest(".blank"); if (!el) return; if (cur !== el) { stop(); exOpen = false; } cur = el; place(); drawHelper(); });
  doc.addEventListener("click", function (e) { var el = e.target.closest(".blank"); if (el && document.activeElement !== el) focusBlank(el); });
  doc.addEventListener("input", function (e) { var el = e.target.closest(".blank"); if (el) set(el.dataset.k, val(el), el); });
  doc.addEventListener("keydown", function (e) {
    var el = e.target.closest(".blank"); if (!el || e.key !== "Enter") return;
    if (!F[el.dataset.k].multi || e.metaKey || e.ctrlKey) { e.preventDefault(); next(); }
    else if (CE !== "plaintext-only") { e.preventDefault(); document.execCommand("insertText", false, "\n"); }
  });
  doc.addEventListener("paste", function (e) {
    if (CE === "plaintext-only" || !e.target.closest(".blank")) return;
    e.preventDefault(); document.execCommand("insertText", false, (e.clipboardData || window.clipboardData).getData("text"));
  });
  function next() {
    stop();
    var i = blanks.indexOf(cur), rest = blanks.slice(i + 1).concat(blanks.slice(0, i + 1));
    var nx = rest.filter(function (b) { return !has(A[b.dataset.k]); })[0];
    if (nx && nx !== cur) focusBlank(nx);
    else { if (cur) cur.blur(); cur = null; place(); drawHelper(); document.getElementById("dl").scrollIntoView({ behavior: "smooth", block: "center" }); }
  }
  /* keep the blank focused while using the helper */
  helper.addEventListener("mousedown", function (e) { if (e.target.closest("[data-h]")) e.preventDefault(); });
  helper.addEventListener("click", function (e) {
    var b = e.target.closest("[data-h]"); if (!b || !cur) return;
    var k = cur.dataset.k, f = F[k], a = b.dataset.h;
    if (a === "see") { exOpen = true; drawHelper(); return; }
    if (a === "use") { cur.textContent = f.ex; set(k, f.ex, cur); exOpen = false; focusBlank(cur); drawHelper(); return; }
    if (a === "next") return next();
    if (a === "talk") return talk(k);
  });
  document.addEventListener("focusout", function () {
    setTimeout(function () { var a = document.activeElement; if (a && (a.closest && (a.closest(".blank") || a.closest("#helper")))) return; if (rec) return; cur = null; place(); drawHelper(); }, 150);
  });
  wide.addEventListener && wide.addEventListener("change", place);

  document.getElementById("fillall").onclick = function () { T.fields.forEach(function (f) { if (!has(A[f.key])) set(f.key, f.ex); }); };
  document.getElementById("clearall").onclick = function () { if (!confirm("Clear everything you typed here?")) return; T.fields.forEach(function (f) { set(f.key, ""); }); };
  document.getElementById("dlmd").onclick = function () {
    var blob = new Blob([md(T, A)], { type: "text/plain;charset=utf-8" }), a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = T.id + "-brief.txt"; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };
  /* Talk: speech to text, added to the end of the blank you're in. Only shown where the browser supports it. */
  var rec = null;
  function stop() { if (rec) { try { rec.stop(); } catch (e) {} } }
  function talk(k) {
    if (rec) { stop(); return; }
    var el = cur, r = new SR(); rec = r; r.lang = navigator.language || "en-US"; r.continuous = true; r.interimResults = false;
    r.onresult = function (ev) {
      for (var i = ev.resultIndex; i < ev.results.length; i++) if (ev.results[i].isFinal) {
        var said = ev.results[i][0].transcript.trim(); if (!said) continue;
        var v = A[k] || ""; v = (v && !/\s$/.test(v) ? v + " " : v) + said; el.textContent = v; set(k, v, el);
      }
    };
    r.onend = r.onerror = function () { if (rec === r) rec = null; drawHelper(); };
    try { r.start(); } catch (err) { rec = null; }
    drawHelper();
  }
  paint(); drawHelper();
})();
