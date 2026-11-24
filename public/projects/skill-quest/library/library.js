/* AI Made EZ community library.
   Hash routes: #/ browse · #/c/<cat>?sub= · #/s/<id> · #/submit(?remix=|edit=) · #/me · #/review · #/signin
   Talks to /api/sl/ (same origin, JSON, errors as {error}). ?mock=1 swaps in a local mock for testing.
   Every user-supplied string goes in with textContent; SKILL.md is shown in a <pre>. */
(function () {
  "use strict";
  var D = window.SL_DATA;
  var PARAMS = new URLSearchParams(location.search);
  var MOCK = PARAMS.get("mock") === "1";
  var API = "/api/sl/";
  var PER_PAGE = 12;
  var DRAFT_KEY = "sl-draft-v2", USED_KEY = "sl-used-v1";
  var app = document.getElementById("app"), nav = document.getElementById("nav");
  var ME = null, SETUP = false, RT = 0;
  var SVGNS = "http://www.w3.org/2000/svg";

  /* ---------- tiny DOM kit (text only, never HTML from data) ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k === "value") el.value = v;
      else if (k === "checked") el.checked = !!v;
      else if (k.slice(0, 2) === "on" && typeof v === "function") el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : String(v));
    });
    add(el, Array.prototype.slice.call(arguments, 2));
    return el;
  }
  function add(el, kids) {
    (function walk(list) {
      list.forEach(function (k) {
        if (k == null || k === false) return;
        if (Array.isArray(k)) return walk(k);
        el.appendChild(typeof k === "object" ? k : document.createTextNode(String(k)));
      });
    })(kids);
    return el;
  }
  function icon(name, cls) {
    var s = document.createElementNS(SVGNS, "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("class", "ic" + (cls ? " " + cls : ""));
    s.setAttribute("aria-hidden", "true");
    s.innerHTML = D.icons[name] || ""; // static, trusted markup from data.js
    return s;
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }
  function mount() { clear(app); add(app, Array.prototype.slice.call(arguments)); }
  function safeLink(url, text) {
    var ok = /^https?:\/\//i.test(String(url || ""));
    return ok ? h("a", { href: url, rel: "noopener nofollow ugc", target: "_blank", class: "link" }, text || url) : h("span", { text: text || String(url || "") });
  }
  function toast(t) {
    var el = document.getElementById("toast");
    el.textContent = t; el.classList.add("on");
    clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove("on"); }, 2400);
  }
  function fmtDate(iso) {
    if (!iso) return "";
    var ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso));
    var d = ymd ? new Date(+ymd[1], ymd[2] - 1, +ymd[3]) : new Date(ts(iso));
    if (isNaN(d)) return "";
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  function fmtWhen(ms) {
    var d = new Date(ms);
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) + " at " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }
  function ts(v) { if (typeof v === "number") return v; if (/^\d{10,}$/.test(String(v || ""))) return Number(v); var t = Date.parse(String(v || "").replace(" ", "T")); return isNaN(t) ? 0 : t; }
  function jparse(s, dflt) { if (typeof s !== "string") return s == null ? dflt : s; try { return JSON.parse(s); } catch (e) { return dflt; } }
  function num(v) { v = Number(v); return isFinite(v) ? v : 0; }
  function debounce(fn, ms) { var t; return function () { var a = arguments, me = this; clearTimeout(t); t = setTimeout(function () { fn.apply(me, a); }, ms); }; }
  function tagName(list, id) { var t = list.find(function (x) { return x.id === id || x.name === id; }); return t ? t.name : String(id || ""); }
  function catOf(id) { return D.cats.find(function (c) { return c.id === id; }) || null; }
  function subOf(cat, id) { var c = catOf(cat); return c && c.subs.find(function (s) { return s.id === id; }) || null; }
  function hashFor(path, q) {
    var qs = q ? Object.keys(q).filter(function (k) { return q[k] !== "" && q[k] != null && q[k] !== false; }).map(function (k) { return k + "=" + encodeURIComponent(q[k]); }).join("&") : "";
    return "#" + path + (qs ? "?" + qs : "");
  }
  function go(path, q) { location.hash = hashFor(path, q); }

  /* ---------- local memory: draft + what you used on this device ---------- */
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function usedHere(id) { return !!lsGet(USED_KEY, {})[id]; }

  /* ---------- API ---------- */
  function SetupError() { var e = new Error("The library is being set up."); e.setup = true; return e; }
  function api(method, path, body) {
    if (MOCK) return Mock.call(method, path, body);
    var opt = { method: method, credentials: "same-origin", headers: { accept: "application/json" } };
    if (body !== undefined) { opt.headers["content-type"] = "application/json"; opt.body = JSON.stringify(body); }
    return fetch(API + path, opt).then(function (r) {
      var type = r.headers.get("content-type") || "";
      if (type.indexOf("json") < 0) throw SetupError(); // no API behind this path yet
      return r.json().then(function (j) {
        if (r.status === 503) throw SetupError(); // database not switched on yet
        if (!r.ok) { var e = new Error((j && j.error) || "Something went wrong. Try again."); e.status = r.status; e.body = j; throw e; }
        return j;
      });
    }, function () { throw SetupError(); });
  }

  /* one shape for list items and full skills (API: helped{n,pct,label}, maker{handle,official}, lift, mine{…}) */
  function norm(s) {
    if (!s) return s;
    var t = jparse(s.test, null);
    var hp = s.helped && typeof s.helped === "object" ? s.helped : null;
    var n = hp ? num(hp.n) : num(s.helped_n);
    var yes = hp ? (hp.yes != null ? num(hp.yes) : null) : num(s.helped_yes);
    var p = hp && hp.pct != null ? num(hp.pct) : (n >= 5 && yes != null ? Math.round(100 * yes / n) : null);
    var mine = s.mine && typeof s.mine === "object" ? s.mine : null;
    return Object.assign({}, s, {
      id: String(s.id),
      kind: s.kind === "prompt" || s.kind === "kit" ? s.kind : "skill",
      parts: Array.isArray(s.parts) ? s.parts : jparse(s.parts, null),
      one_line: s.one_line != null ? s.one_line : "",
      works_in: Array.isArray(s.works_in) ? s.works_in : jparse(s.works_in, []),
      examples: Array.isArray(s.examples) ? s.examples : jparse(s.examples, []),
      test: t && t.skill_score != null ? t : null,
      checks: jparse(s.checks, null),
      maker_handle: (s.maker && s.maker.handle) || s.maker_handle || "",
      official: !!(s.maker && s.maker.official),
      helped_n: n, helped_pct: n >= 5 ? p : null, helped_label: hp && hp.label ? hp.label : null,
      lift_v: typeof s.lift === "number" ? s.lift : (t && t.skill_score != null ? Math.round((num(t.skill_score) - num(t.plain_score)) * 10) / 10 : null),
      remix_count: num(s.remix_count != null ? s.remix_count : (Array.isArray(s.remixes) ? s.remixes.length : 0)),
      version: num(s.version) || 1,
      is_owner: !!(mine && mine.is_owner),
      used_by_me: !!(mine && mine.used),
      my_rating: mine && mine.rating ? mine.rating : null
    });
  }
  function lift(s) { return s.lift_v; }
  function pct(s) { return s.helped_pct == null ? 0 : s.helped_pct; }
  function sc(n) { return num(n).toFixed(1); }
  function peopleShort(s) { return s.helped_label || (s.helped_n >= 5 ? pct(s) + "% helped (" + s.helped_n + ")" : "New"); }
  function testShort(s) {
    var l = lift(s);
    if (l == null) return "Not tested yet";
    if (s.test.winner === "tie" || l === 0) return "Tied plain Claude";
    return (l > 0 ? "+" : "") + sc(l) + " over plain";
  }
  function testLong(s) {
    if (!s.test) return "Not tested yet";
    var t = s.test, a = sc(t.skill_score), b = sc(t.plain_score);
    if (t.winner === "skill") return "Beat plain Claude " + a + " vs " + b;
    if (t.winner === "plain") return "Plain Claude won " + b + " vs " + a;
    return "Tied plain Claude " + a + " vs " + b;
  }
  /* when people and the blind test disagree, say it plainly */
  function verdict(s) {
    if (s.verdict) return s.verdict + ".";
    var n = s.helped_n, p = pct(s), l = lift(s);
    if (l == null && n >= 5) return "Not blind-tested yet, so this is people's word only.";
    if (l == null) return "";
    if (n < 5) return s.test.winner === "plain" ? "Plain Claude did better in the blind test." : "Too few ratings yet to compare with the blind test.";
    if (p >= 70 && l < 0.4) return "Popular, but barely beats plain Claude.";
    if (p < 55 && l >= 0.8) return "Wins the blind test, but fewer people say it helped.";
    if (p >= 70 && l >= 0.8) return "People and the blind test agree: it helps.";
    if (p < 55 && l < 0.4) return "People and the blind test agree: it adds little.";
    return "People and the blind test roughly agree.";
  }
  function makerName(s) { return s.official ? "AI Made EZ" : (s.maker_handle || "someone"); }
  function kindOf(id) { return D.kinds.find(function (k) { return k.id === id; }) || D.kinds[0]; }
  function word(s) { return kindOf(s.kind).name.toLowerCase(); } /* "skill" | "prompt" | "kit" */
  function licenseOf(id) { return D.licenses.find(function (l) { return l.id === id; }) || null; }
  function fmName(md) { var m = /^﻿?---[ \t]*\n[\s\S]*?^name:[ \t]*["']?([^\n"']+)/m.exec(String(md || "")); return m ? m[1].trim() : ""; }
  function fileSlug(v, dflt) { return String(v || "").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || dflt; }
  /* a kit's files in order: the start-here skill, then each part */
  function kitFiles(s) {
    var list = [{ md: String(s.skill_md || ""), start: true }].concat((s.parts || []).map(function (p) { return { md: String(p && p.skill_md || "") }; }));
    var seen = {};
    return list.map(function (f, i) {
      var n = fileSlug(fmName(f.md), "skill-" + (i + 1));
      while (seen[n]) n += "-" + (i + 1);
      seen[n] = 1;
      return { name: n, md: f.md, start: !!f.start };
    });
  }
  function frameCls(s, champ) {
    if (champ) return "fr-champ";
    if (!s.test) return "fr-none";
    return s.test.winner === "skill" ? "fr-win" : "fr-even";
  }
  function subName(s) { var sub = subOf(s.category, s.sub), c = catOf(s.category); return s.sub_name || (sub ? sub.name : (c ? c.name : "")); }

  /* ---------- shared pieces ---------- */
  /* every tested item, across pages (capped at 10 pages) */
  function allTested() {
    var out = [];
    function page(n) {
      return api("GET", "skills?tested=yes&sort=tested&page=" + n).then(function (j) {
        out = out.concat(j.items || []);
        return n < Math.min(num(j.pages) || 1, 10) ? page(n + 1) : { items: out };
      });
    }
    return page(1);
  }
  /* our own tested skills have real screenshots of their output */
  function thumbOf(s) { return s.official && D.seedMap[s.slug || s.id] ? "../templates/" + (s.slug || s.id) + "/thumb.jpg" : null; }
  /* one scoreboard row: rank · picture · name · blind test · people */
  function miniCard(s, champ, rank) {
    var c = catOf(s.category) || { id: "fun" }, th = thumbOf(s), l = lift(s);
    var testCell = s.test
      ? h("span", { class: "mc-test" },
          h("strong", null, sc(s.test.skill_score), h("em", { text: " vs " + sc(s.test.plain_score) })),
          h("span", { class: "mc-bar", "aria-hidden": "true" }, h("i", { style: "width:" + Math.round(num(s.test.skill_score) / 5 * 100) + "%" })),
          h("small", { class: l > 0 ? "up" : "", text: l === 0 || s.test.winner === "tie" ? "Tied plain Claude" : (l > 0 ? "+" : "") + sc(l) + " over plain" }))
      : h("span", { class: "mc-test none" }, h("strong", { text: "Not tested" }), h("small", { text: "No blind test yet" }));
    return h("a", { class: "mc" + (champ ? " is-champ" : ""), href: "#/s/" + encodeURIComponent(s.id) },
      rank ? h("span", { class: "mc-rank", text: String(rank) }) : null,
      h("span", { class: "mc-pic" }, th ? h("img", { src: th, alt: "", loading: "lazy" }) : icon(c.id)),
      h("span", { class: "mc-main" },
        h("b", { class: "mc-name", text: s.name }),
        h("span", { class: "mc-line", text: s.one_line }),
        h("span", { class: "mc-meta" }, champ ? h("span", { class: "champ-tag" }, icon("trophy"), "Champion") : null,
          h("span", { text: subName(s) + " · by " + makerName(s) }), badges(s))),
      testCell,
      h("span", { class: "mc-people" }, h("strong", { text: s.helped_n >= 5 ? pct(s) + "%" : "New" }), h("small", { text: s.helped_n >= 5 ? "helped (" + s.helped_n + ")" : s.helped_n + " of 5 ratings" })));
  }
  function badges(s) {
    var b = [];
    if (s.kind !== "skill") b.push(h("span", { class: "bdg kind-" + s.kind }, icon(s.kind), kindOf(s.kind).name));
    if (s.parent_id) b.push(h("span", { class: "bdg" }, icon("remix"), "Remix"));
    if (s.remix_count) b.push(h("span", { class: "bdg", text: s.remix_count + (s.remix_count === 1 ? " remix" : " remixes") }));
    return b.length ? h("span", { class: "mc-bdgs" }, b) : null;
  }
  function errorBox(msg, retry) {
    return h("div", { class: "box err", role: "alert" }, h("p", { text: msg }), retry ? h("button", { class: "btn ghost", type: "button", onclick: retry, text: "Try again" }) : null);
  }
  function loading(t) { return h("p", { class: "loading", text: t || "Loading…" }); }
  function setupState() {
    return h("section", { class: "setup" },
      h("div", { class: "setup-card" },
        icon("slot", "big"),
        h("h1", { text: "The library is being set up." }),
        h("p", { class: "sub", text: "Soon: skills people made, each with real examples, ratings and a blind test against plain Claude. Nothing to show until it's ready." }),
        h("p", null, h("a", { class: "btn", href: "../templates/", text: "Use a ready-made skill" }))));
  }
  function fail(err, retry) {
    if (err && err.setup) { SETUP = true; renderNav(); return setupState(); }
    return errorBox(err && err.message || "Something went wrong.", retry);
  }
  function needSignIn(what, next) {
    return h("div", { class: "box" },
      h("p", { text: what }),
      h("a", { class: "btn", href: hashFor("/signin", { next: next || "" }), text: "Sign in" }), " ",
      h("a", { class: "link", href: hashFor("/signin", { mode: "new", next: next || "" }), text: "Create an account" }));
  }
  function statusChip(st) { return h("span", { class: "chip st-" + (st || "draft"), text: D.statuses[st] || st || "Draft" }); }
  function backLink(href, text) { return h("a", { class: "back", href: href }, icon("back"), text); }

  /* example flip: tap to turn between the skill's answer and plain Claude's */
  /* only our own tested result pages may be framed, and only with scripts (no same-origin) */
  function frameSrc(u) { return /^\/projects\/skill-quest\/templates\/[a-z0-9-]+\/[A-Za-z0-9._-]+\.html$/.test(String(u || "")) ? u : null; }
  function outBody(text, link, title, tab) {
    var src = frameSrc(link);
    if (src) return h("div", { class: "xf-out xf-frame", tabindex: tab }, h("iframe", { src: src, title: title, sandbox: "allow-scripts allow-same-origin", loading: "lazy", referrerpolicy: "no-referrer" }));
    return h("div", { class: "xf-out", tabindex: tab, text: text || "" });
  }
  function exampleFlip(ex, i, total) {
    var plain = (ex.plain_output && String(ex.plain_output).trim()) || frameSrc(ex.plain_link);
    var fromTest = ex.plain_source === "test" || ex.from_test;
    var label = fromTest ? "From our blind test" : "Maker's comparison";
    var front = h("div", { class: "xf-face xf-front" },
      h("div", { class: "xf-head" }, h("b", { text: "With this skill" }), plain ? h("small", { text: "Tap to flip" }) : null),
      outBody(ex.output, ex.output_link, "The skill's answer", "0"));
    var back = plain ? h("div", { class: "xf-face xf-back", "aria-hidden": "true" },
      h("div", { class: "xf-head" }, h("b", { text: "Plain Claude" }), h("small", { text: label })),
      outBody(ex.plain_output, ex.plain_link, "Plain Claude's answer", "-1")) : null;
    var card = h("div", { class: "xf-card" }, front, back);
    var btn = plain ? h("button", { class: "flip-btn", type: "button", "aria-pressed": "false" }, icon("flip"), h("span", { text: "Show plain Claude" })) : null;
    function flip() {
      var on = !card.classList.contains("on");
      card.classList.toggle("on", on);
      front.setAttribute("aria-hidden", on ? "true" : "false");
      back.setAttribute("aria-hidden", on ? "false" : "true");
      front.querySelector(".xf-out").tabIndex = on ? -1 : 0;
      back.querySelector(".xf-out").tabIndex = on ? 0 : -1;
      btn.setAttribute("aria-pressed", String(on));
      btn.querySelector("span").textContent = on ? "Show the skill's answer" : "Show plain Claude";
    }
    if (plain) {
      btn.addEventListener("click", flip);
      card.addEventListener("click", function (e) { if (String(getSelection() || "")) return; if (e.target.closest("a")) return; flip(); });
    }
    return h("figure", { class: "xf" },
      h("figcaption", { class: "xf-ask" },
        h("small", { text: total > 1 ? "Example " + (i + 1) + " of " + total + " · someone asked" : "Someone asked" }),
        h("p", { class: "xf-in", text: ex.input || "" })),
      card,
      plain ? btn : h("p", { class: "note", text: "No plain-Claude answer to compare for this one." }));
  }

  /* checks: the API returns {ok, blocks:[{rule, where, line, fix}], warnings:[{rule, note, urls?, kind?, skill_id?}], summary:[…]}.
     Passed rules are the ones with no block, shown as green ticks. */
  var RULES = [
    ["frontmatter", "Has a name and a description", "The header (name and description) needs work"],
    ["size", "Under 40 KB", "Too long"],
    ["text-only", "Plain text", "Not plain text"],
    ["ignore-instructions", "Doesn't tell Claude to ignore its rules", "Tells Claude to ignore its other instructions"],
    ["secrets", "Doesn't touch secrets", "Asks for secrets (keys, passwords, cookies)"],
    ["send-data", "Doesn't send your data anywhere", "Sends data to a web address"],
    ["network-command", "No download commands", "Has a download command (curl, wget, fetch)"],
    ["hide-from-user", "Keeps nothing from the person", "Tells Claude to keep something from the person"],
    ["encoded-blob", "No encoded blobs", "Has a long encoded string"],
    ["scripts", "No scripts", "Has a script or embed tag"],
    ["html-comment", "No hidden comments", "Has a hidden HTML comment"],
    ["hidden-unicode", "No invisible characters", "Has invisible characters"],
    ["examples", "Has 1 to 3 examples", "Examples need work"]
  ];
  function normChecks(j, withExamples) {
    var out = { passed: [], errors: [], warnings: [], summary: null };
    if (!j) return out;
    var c = j.checks && typeof j.checks === "object" && !Array.isArray(j.checks) ? j.checks : j;
    var blocks = c.blocks || c.errors || [];
    blocks.forEach(function (b) {
      var r = RULES.find(function (x) { return x[0] === b.rule; });
      var where = b.where ? b.where + (b.line ? ", line " + b.line : "") : "";
      out.errors.push({ message: (r ? r[2] : (b.message || b.rule || "Needs a fix")) + (where ? " (" + where + ")" : ""), fix: b.fix || "" });
    });
    out.warnings = (c.warnings || []).map(function (w) { return { message: w.note || w.message || w.rule, urls: w.urls, skill_id: w.skill_id, rule: w.rule }; });
    RULES.forEach(function (r) {
      if (r[0] === "examples" && !withExamples) return;
      if (!blocks.some(function (b) { return b.rule === r[0]; })) out.passed.push({ message: r[1] });
    });
    out.summary = c.summary || j.summary || null;
    return out;
  }
  function msgOf(x) { return typeof x === "string" ? x : (x && (x.message || x.label || x.msg || x.title)) || ""; }
  function fixOf(x) { return typeof x === "string" ? "" : (x && (x.fix || x.how)) || ""; }
  function detailOf(x) { var d = x && typeof x === "object" ? (x.urls || x.detail || x.items) : null; return Array.isArray(d) ? d : (d ? [String(d)] : []); }
  function checkList(ch) {
    var items = [];
    ch.errors.forEach(function (x) {
      items.push(h("li", { class: "ck bad" }, icon("x"), h("span", null, h("b", { text: msgOf(x) }), fixOf(x) ? h("span", { class: "fix", text: fixOf(x) }) : null)));
    });
    ch.warnings.forEach(function (x) {
      var det = detailOf(x);
      items.push(h("li", { class: "ck warn" }, icon("alert"), h("span", null, h("b", { text: msgOf(x) }),
        det.length ? h("span", { class: "urls" }, det.map(function (u) { return h("code", { text: u }); })) : null,
        fixOf(x) ? h("span", { class: "fix", text: fixOf(x) }) : null,
        x.skill_id ? h("a", { class: "link", href: hashFor("/submit", { remix: x.skill_id }), text: "Remix that one instead" }) : null)));
    });
    var ok = ch.passed.map(function (x) { return h("li", { class: "ck ok" }, icon("check"), h("span", { text: msgOf(x) })); });
    return h("div", null, items.length ? h("ul", { class: "checks" }, items) : null, ok.length ? h("ul", { class: "checks passed", "aria-label": "Passed" }, ok) : null);
  }
  /* "What this skill asks Claude to do": first 3 instruction lines + the output heading (no AI) */
  function summarize(md) {
    var body = String(md || "").replace(/^﻿?---[\s\S]*?\n---[ \t]*\n?/, "");
    var verbs = /^(write|make|keep|use|ask|find|put|cut|start|end|give|list|check|turn|add|remove|never|don't|do not|always|show|build|plan|pick|read|return|explain|answer|follow|create|sort|mark|tell|stick|say|open|include|avoid|move|swap|fix|calm|flag|offer|leave|match|reuse|quiz|work|assume|count|group|label|draw|save|copy|lead|name|note|be)\b/i;
    var lines = body.split("\n").map(function (l) { return l.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, "").replace(/\*\*|__|`/g, "").trim(); })
      .filter(function (l) { return l && l[0] !== "#" && l[0] !== "|" && l.indexOf("<!--") < 0 && l.indexOf("---") !== 0; });
    var asks = lines.filter(function (l) { return verbs.test(l); }).slice(0, 3).map(function (l) { return l.length > 160 ? l.slice(0, 157) + "…" : l; });
    var m = body.match(/^#{1,4}[ \t]*(.*\b(output|answer|result|format|deliver|return|you give|what to send)\w*\b.*)$/im);
    return { asks: asks, output: m ? m[1].replace(/[*_`]/g, "").trim() : "" };
  }
  function fromList(list) {
    var asks = [], output = "";
    (list || []).forEach(function (l) { l = String(l); var m = l.match(/^It answers with:\s*(.*)$/); if (m) output = m[1]; else asks.push(l); });
    return { asks: asks.slice(0, 3), output: output };
  }
  function summaryOf(s) {
    if (s.safety && Array.isArray(s.safety.summary) && s.safety.summary.length) return fromList(s.safety.summary);
    var sm = s.checks && s.checks.summary;
    if (Array.isArray(sm) && sm.length) return fromList(sm);
    return summarize(s.skill_md);
  }
  function summaryBlock(sm) {
    return h("div", { class: "asks" },
      sm.asks.length ? h("ol", null, sm.asks.map(function (a) { return h("li", { text: a }); })) : h("p", { class: "note", text: "No clear instructions found in the file." }),
      sm.output ? h("p", null, h("span", { class: "muted", text: "Answer section: " }), h("b", { text: sm.output })) : null);
  }

  /* ---------- nav ---------- */
  function renderNav() {
    clear(nav);
    var cur = (location.hash.slice(1).split("?")[0] || "/").split("/")[1] || "";
    function a(href, label, key, cls) { return h("a", { href: href, class: cls || null, "aria-current": cur === key ? "page" : null, text: label }); }
    if (SETUP) return;
    add(nav, [
      a("#/", "Browse", ""),
      a("#/requests", "Requests", "requests"),
      a("#/how", "How we test", "how", "nav-how"),
      ME && (ME.is_admin || ME.admin) ? a("#/review", "Review", "review") : null,
      ME ? a("#/me", "Me", "me") : a("#/signin", "Sign in", "signin"),
      a("#/submit", "Share", "submit", "nav-cta")
    ]);
  }

  /* ---------- Browse ---------- */
  function pageBrowse(q, tok) {
    var st = { type: q.get("type") || "", q: q.get("q") || "", for: q.get("for") || "", works: q.get("works") || "", tested: q.get("tested") === "1", sort: q.get("sort") || "tested", page: 1 };
    var search = h("input", { id: "q", type: "search", value: st.q, placeholder: "Try “landlord email” or “meal plan”", autocomplete: "off", enterkeyhint: "search" });
    var rowsBox = h("div", { class: "rows" }), grid = h("div", { class: "grid" }), more = h("div", { class: "more" }), count = h("p", { class: "count" });
    function sel(label, key, opts) {
      var s = h("select", { "aria-label": label, onchange: function () { st[key] = s.value; refresh(); } },
        opts.map(function (o) { return h("option", { value: o[0], selected: st[key] === o[0] ? true : null, text: o[1] }); }));
      return h("label", { class: "fl" }, h("span", { text: label }), s);
    }
    var tested = h("input", { type: "checkbox", checked: st.tested, onchange: function () { st.tested = tested.checked; refresh(); } });
    var filters = h("div", { class: "filters" },
      sel("For", "for", [["", "Everyone"]].concat(D.forTags.map(function (t) { return [t.id, t.name]; }))),
      sel("Works in", "works", [["", "Anywhere"]].concat(D.worksIn.map(function (t) { return [t.id, t.name]; }))),
      h("label", { class: "fl tog" }, tested, h("span", { text: "Tested only" })),
      sel("Sort", "sort", [["tested", "Best tested"], ["helpful", "Most helpful"], ["new", "New"], ["remixed", "Most remixed"]]));

    function active() { return st.type || st.q || st.for || st.works || st.tested; }
    function things(n) { var k = st.type ? kindOf(st.type) : null; return n + " " + (k ? (n === 1 ? k.name.toLowerCase() : k.plural.toLowerCase()) : (n === 1 ? "item" : "items")); }
    function qsFor(page) {
      return "skills?" + new URLSearchParams({ type: st.type, q: st.q, for: st.for, works: st.works, tested: st.tested ? "yes" : "", sort: st.sort, page: String(page) }).toString().replace(/[^&?]+=(&|$)/g, "").replace(/&$/, "");
    }
    function load(page) {
      if (page === 1) { clear(grid); add(grid, [loading()]); clear(more); }
      return api("GET", qsFor(page)).then(function (j) {
        if (tok !== RT) return;
        var list = (j.skills || j.items || []).map(norm), total = num(j.total) || list.length;
        if (page === 1) clear(grid);
        list.forEach(function (s, i) { grid.appendChild(miniCard(s, false, (page - 1) * PER_PAGE + i + 1)); });
        count.textContent = st.q ? things(total) + " for “" + st.q + "”" : things(total);
        if (!total) add(grid, [h("div", { class: "box empty" },
          h("p", { text: st.q ? "Nothing matches “" + st.q + "” yet." : "Nothing matches those filters." }),
          h("div", { class: "btns" }, h("a", { class: "btn", href: "#/submit", text: "Make one" }),
            h("a", { class: "link", href: "../build-kit/", text: "or plan it in Build Kit" })))]);
        clear(more);
        if (page * PER_PAGE < total) add(more, [h("button", { class: "btn ghost", type: "button", text: "Show more", onclick: function () { load(page + 1); } })]);
      }).catch(function (e) { if (tok !== RT) return; if (e.setup) return mount(setupState()); clear(grid); add(grid, [fail(e, function () { load(page); })]); });
    }
    function rows() {
      clear(rowsBox);
      var defs = [
        ["Beats plain Claude by the most", "tested", function (s) { return lift(s) > 0; }],
        ["New this week", "new", function (s) { return Date.now() - ts(s.live_at || s.created_at) < 7 * 864e5; }],
        ["Most remixed", "remixed", function (s) { return s.remix_count > 0; }],
        ["Most helpful", "helpful", function (s) { return s.helped_n >= 5; }]
      ];
      defs.forEach(function (d) {
        var track = h("div", { class: "track" }, loading());
        var row = h("section", { class: "row" }, h("h2", { class: "row-h", text: d[0] }), track);
        rowsBox.appendChild(row);
        api("GET", "skills?sort=" + d[1] + "&page=1").then(function (j) {
          if (tok !== RT) return;
          var list = (j.skills || j.items || []).map(norm).filter(d[2]).slice(0, 8);
          if (!list.length) return row.remove();
          clear(track); list.slice(0, 5).forEach(function (s, i) { track.appendChild(miniCard(s, false, i + 1)); });
        }).catch(function () { row.remove(); });
      });
    }
    function refresh() {
      history.replaceState(null, "", location.pathname + location.search + hashFor("/", { type: st.type, q: st.q, for: st.for, works: st.works, tested: st.tested ? "1" : "", sort: st.sort === "tested" ? "" : st.sort }));
      rowsBox.hidden = !!active();
      allH.textContent = active() ? (st.type && !st.q ? kindOf(st.type).plural : "Results") : "Everything";
      drawTypes();
      if (!active() && !rowsBox.firstChild) rows();
      load(1);
    }
    var allH = h("h2", { class: "row-h", text: "Everything" });
    var types = h("div", { class: "types", role: "group", "aria-label": "Show" });
    function drawTypes() {
      clear(types);
      [{ id: "", plural: "All", what: "Skills, prompts and kits." }].concat(D.kinds).forEach(function (k) {
        add(types, [h("button", { type: "button", class: "type-b", "aria-pressed": st.type === k.id ? "true" : "false", onclick: function () { st.type = k.id; refresh(); } },
          k.id ? icon(k.id) : null, h("b", { text: k.plural }), h("small", { text: k.what }))]);
      });
    }
    drawTypes();
    search.addEventListener("input", debounce(function () { st.q = search.value.trim().slice(0, 80); refresh(); }, 300));
    var form = h("form", { class: "search", role: "search", onsubmit: function (e) { e.preventDefault(); st.q = search.value.trim().slice(0, 80); refresh(); search.blur(); } },
      h("label", { for: "q", text: "What do you want help with?" }),
      h("span", { class: "search-box" }, icon("search"), search));

    var record = h("aside", { class: "record", "aria-label": "Our blind-test record" }, h("small", { text: "Our blind-test record" }), loading(""));
    allTested().then(function (j) {
      var list = (j.items || []).map(norm), w = 0, t = 0, lo = 0, sum = 0;
      list.forEach(function (x) { if (x.test.winner === "skill") w++; else if (x.test.winner === "plain") lo++; else t++; sum += num(lift(x)); });
      if (!list.length) return record.remove();
      clear(record);
      add(record, [h("small", { text: "Our blind-test record" }),
        h("div", { class: "wl" },
          h("div", null, h("b", { text: w + "–" + lo + (t ? "–" + t : "") }), h("span", { text: t ? "wins–losses–ties vs plain Claude" : "wins–losses vs plain Claude" })),
          h("div", null, h("b", { text: (sum / list.length >= 0 ? "+" : "") + (sum / list.length).toFixed(1) }), h("span", { text: "average lead, on a 1–5 score" }))),
        h("p", null, list.length + (list.length === 1 ? " item tested" : " items tested") + ", losses included. ", h("a", { class: "link", href: "#/how", text: "How we test" }))]);
    }).catch(function () { record.remove(); });
    mount(
      h("section", { class: "hero" },
        h("div", { class: "hero-l" },
          h("h1", { text: "Claude skills that win blind tests." }),
          h("p", { class: "sub", text: "Skills, prompts and kits made by people. Each one is checked by a person and scored against plain Claude." }),
          form,
          h("p", { class: "ask-line" }, "Can't find it? ", h("a", { class: "link", href: "#/requests", text: "Ask for it" }), ".")),
        record),
      types,
      h("nav", { class: "tiles", "aria-label": "Categories" }, D.cats.map(function (c) {
        return h("a", { class: "tile", href: "#/c/" + c.id }, h("span", { class: "tile-ic" }, icon(c.id)), h("span", { text: c.short }));
      })),
      rowsBox,
      h("section", { class: "all" }, h("div", { class: "all-top" }, allH, count), filters, grid, more),
      h("section", { class: "make" },
        h("div", null, h("h2", { text: "Made something that works?" }), h("p", { class: "sub" }, "Share a skill, a prompt or a kit with an example. A person checks it before it goes live. ", h("a", { class: "link", href: "#/rules", text: "How we review" }))),
        h("a", { class: "btn", href: "#/submit", text: "Share yours" })),
      h("p", { class: "made-by" }, "AI Made EZ is made by ", h("b", { text: "Alexandra Vargas" }), ". ", h("a", { class: "link", href: "/", text: "See her other work" })));
    rowsBox.hidden = !!active();
    allH.textContent = active() ? (st.type && !st.q ? kindOf(st.type).plural : "Results") : "Everything";
    if (!active()) rows();
    load(1);
  }

  /* ---------- Category ---------- */
  function pageCategory(id, q, tok) {
    var c = catOf(id);
    if (!c) return mount(backLink("#/", "All categories"), errorBox("No category called that."));
    var sub = q.get("sub") || "", sort = q.get("sort") || "tested", page = Math.max(1, parseInt(q.get("page"), 10) || 1);
    var champBox = h("div", { class: "champ-wrap" }), grid = h("div", { class: "grid" }, loading()), pager = h("nav", { class: "pager", "aria-label": "Pages" });
    var sortSel = h("select", { "aria-label": "Sort", onchange: function () { go("/c/" + id, { sub: sub, sort: sortSel.value === "tested" ? "" : sortSel.value }); } },
      [["tested", "Best tested"], ["helpful", "Most helpful"], ["new", "New"], ["remixed", "Most remixed"]].map(function (o) { return h("option", { value: o[0], selected: o[0] === sort ? true : null, text: o[1] }); }));
    var subNow = subOf(id, sub);
    mount(
      backLink("#/", "All categories"),
      h("header", { class: "cat-head" },
        h("span", { class: "cat-ic" }, icon(c.id)),
        h("div", null, h("h1", { text: c.name }), c.note ? h("p", { class: "note", text: c.note }) : null)),
      h("nav", { class: "chips", "aria-label": "Subcategories" },
        h("a", { class: "chip-l", href: "#/c/" + id, "aria-current": sub ? null : "page", text: "All" }),
        c.subs.map(function (s) { return h("a", { class: "chip-l", href: hashFor("/c/" + id, { sub: s.id }), "aria-current": sub === s.id ? "page" : null, text: s.name }); })),
      champBox,
      h("div", { class: "all-top" }, h("h2", { class: "row-h", text: subNow ? subNow.name : "Everything in " + c.short.toLowerCase() }), h("label", { class: "fl" }, h("span", { text: "Sort" }), sortSel)),
      grid, pager);

    var qs = new URLSearchParams({ cat: id, sort: sort, page: String(page) });
    if (sub) qs.set("sub", sub);
    var champP = page === 1 ? Promise.resolve(null) : api("GET", "skills?cat=" + id + "&page=1").then(function (k) { return k.champion; }).catch(function () { return null; });
    Promise.all([api("GET", "skills?" + qs.toString()), champP]).then(function (res) {
      if (tok !== RT) return;
      var j = res[0], champ = j.champion || res[1] ? norm(j.champion || res[1]) : null;
      var list = (j.skills || j.items || []).map(norm), total = num(j.total) || list.length;
      clear(champBox);
      if (champ && (!sub || champ.sub === sub)) add(champBox, [h("div", { class: "champ" },
        h("p", { class: "champ-why" }, icon("trophy"), h("span", { text: "Category champion: the highest blind-test score in " + c.short.toLowerCase() + "." })),
        miniCard(champ, true))]);
      clear(grid);
      if (!list.length) {
        var where = subNow ? subNow.name.toLowerCase() : c.name.toLowerCase();
        add(grid, [h("div", { class: "box empty first" },
          icon("plus", "big"),
          h("h3", { text: "Be the first: make one" }),
          h("p", { class: "sub", text: "No skills for " + where + " yet." }),
          h("div", { class: "btns" }, h("a", { class: "btn", href: hashFor("/submit", { cat: id, sub: sub }), text: "Make one" }),
            h("a", { class: "link", href: "../build-kit/", text: "or plan it in Build Kit" })))]);
        return;
      }
      var pinned = champ && champBox.firstChild;
      var rk = (page - 1) * PER_PAGE;
      list.forEach(function (s) { rk++; if (pinned && champ.id === s.id) return; grid.appendChild(miniCard(s, champ && champ.id === s.id, rk)); });
      var pages = Math.ceil(total / PER_PAGE);
      clear(pager);
      if (pages > 1) {
        if (page > 1) add(pager, [h("a", { class: "btn ghost", href: hashFor("/c/" + id, { sub: sub, sort: sort === "tested" ? "" : sort, page: page - 1 }), text: "Back" })]);
        add(pager, [h("span", { class: "note", text: "Page " + page + " of " + pages })]);
        if (page < pages) add(pager, [h("a", { class: "btn ghost", href: hashFor("/c/" + id, { sub: sub, sort: sort === "tested" ? "" : sort, page: page + 1 }), text: "Next" })]);
      }
    }).catch(function (e) { if (tok !== RT) return; clear(grid); add(grid, [fail(e, route)]); });
  }

  /* ---------- Skill page ---------- */
  function pageSkill(id, tok) {
    mount(loading("Opening the skill…"));
    api("GET", "skills/" + encodeURIComponent(id)).then(function (j) {
      if (tok !== RT) return;
      var s = norm(j.skill || j);
      var champP = s.test && s.test.winner === "skill" && s.status === "live"
        ? api("GET", "skills?cat=" + encodeURIComponent(s.category) + "&page=1").then(function (k) { return !!(k.champion && String(k.champion.id) === s.id); }).catch(function () { return false; })
        : Promise.resolve(false);
      champP.then(function (champ) { if (tok === RT) drawSkill(s, champ || !!s.champion, tok); });
    }).catch(function (e) {
      if (tok !== RT) return;
      mount(backLink("#/", "Browse"), e.status === 404 ? errorBox("This skill isn't here. It may be in review or hidden.") : fail(e, route));
    });
  }
  function drawSkill(s, champ, tok) {
    var c = catOf(s.category) || D.cats[0];
    var own = s.is_owner || (ME && s.maker_handle && s.maker_handle === ME.handle);
    document.title = s.name + " · Community library";

    var big = h("article", { class: "big " + frameCls(s, champ) },
      h("div", { class: "big-band" }, icon(c.id), h("span", { text: c.short + " · " + subName(s) }), champ ? h("span", { class: "champ-tag" }, icon("trophy"), "Champion") : null),
      thumbOf(s) ? h("div", { class: "big-pic" }, h("img", { src: thumbOf(s), alt: "What " + s.name + " made in our blind test" })) : null,
      h("div", { class: "big-body" },
        h("h1", { text: s.name }),
        h("p", { class: "big-line", text: s.one_line }),
        h("p", { class: "big-by" }, "by ", h("b", { text: makerName(s) }), s.for_tag ? " · for " + (s.for_name || tagName(D.forTags, s.for_tag)).toLowerCase() : null)),
      h("div", { class: "big-scores" },
        h("div", { class: "sc" }, h("small", { text: "People say" }), h("strong", { text: s.helped_n >= 5 ? pct(s) + "% helped" : "New" }), h("span", { text: s.helped_n >= 5 ? s.helped_n + " ratings" : s.helped_n + " of 5 ratings" })),
        h("div", { class: "sc" + (s.test ? "" : " none") }, h("small", { text: "Blind test" }), h("strong", { text: s.test ? (lift(s) > 0 ? "+" : "") + sc(lift(s)) : "Not yet" }), h("span", { text: s.test ? sc(s.test.skill_score) + " vs " + sc(s.test.plain_score) + " plain" : "Not tested yet" }))),
      h("div", { class: "big-foot" }, s.kind !== "skill" ? h("span", { class: "bdg kind-" + s.kind }, icon(s.kind), kindOf(s.kind).name) : null, (s.works_in || []).map(function (w) { return h("span", { class: "bdg", text: tagName(D.worksIn, w) }); }), h("span", { class: "bdg", text: "v" + s.version })));

    var banner = null;
    if (s.status === "live" && s.pending_version) {
      banner = h("div", { class: "box status-box" }, statusChip("review"), h("p", { text: "Your version " + s.pending_version.version + " is waiting for review. Everyone still sees version " + s.version + " until it's approved." }));
    } else if (s.status && s.status !== "live") {
      banner = h("div", { class: "box status-box" }, statusChip(s.status),
        h("p", { text: s.status === "review" ? "Waiting for a person to check it. Only you and reviewers can see this." : s.status === "changes" ? "A reviewer asked for changes." : s.status === "hidden" ? "Hidden from the library." : "Not sent yet." }),
        s.pending_version ? h("p", { class: "note", text: "Version " + s.pending_version.version + " is waiting for review. People still see version " + s.version + "." }) : null,
        s.review_note ? h("p", { class: "rnote" }, h("b", { text: "Reviewer's note: " }), h("span", { text: s.review_note })) : null,
        own ? h("a", { class: "btn ghost", href: hashFor("/submit", { edit: s.id }), text: "Edit it" }) : null);
    }

    /* examples first */
    var exs = (s.examples || []).filter(function (e) { return e && (e.input || e.output); });
    var exSec = h("section", { class: "sec" }, h("h2", { text: "See it work" }),
      exs.length ? exs.map(function (e, i) { return exampleFlip(e, i, exs.length); }) : h("p", { class: "note", text: "No examples yet." }));

    /* two scores, side by side, plus the plain-words disagreement line */
    var v = verdict(s);
    var strip = h("section", { class: "sec" }, h("h2", { text: "Two scores" }),
      h("div", { class: "strip" },
        h("div", { class: "strip-c" }, h("small", { text: "People say" }),
          h("b", { text: s.helped_n >= 5 ? pct(s) + "% helped (" + s.helped_n + ")" : "New" }),
          h("span", { text: s.helped_n >= 5 ? "From people who used it, then said if it helped." : "Shows after 5 ratings. " + s.helped_n + " so far." })),
        h("div", { class: "strip-c" + (s.test ? "" : " none") }, h("small", { text: "Blind test" }),
          h("b", { text: testLong(s) }),
          h("span", { text: s.test ? "Same request, both answers scored 1 to 5 by a judge who didn't know which was which." + (s.test.tested_at ? " Tested " + fmtDate(s.test.tested_at) + "." : "") : "We haven't run this one against plain Claude yet." }))),
      v ? h("p", { class: "verdict", text: v }) : null,
      s.test && s.test.reason ? h("details", { class: "why" }, h("summary", { text: "What the judge said" }), h("p", { text: s.test.reason })) : null);

    /* add to Claude: a skill is a .zip, a prompt is copy / open in Claude, a kit is a plugin .zip */
    var kind = s.kind, W = word(s);
    var files = kind === "kit" ? kitFiles(s) : null;
    var rateSlot = h("div", { class: "rate-slot" });
    function used(kind2) {
      var u = lsGet(USED_KEY, {});
      u[s.id] = { name: s.name, category: s.category, sub: s.sub, at: Date.now() };
      lsSet(USED_KEY, u);
      if (window.SMEZ && kind2 === "download" && SMEZ.stamp("home")) setTimeout(function () { toast("Stamped: Took a skill home"); }, 900);
      drawRate();
    }
    function record(kind2) { /* the server notes the use first, so a rating is allowed after */
      return api("POST", "skills/" + encodeURIComponent(s.id) + "/use", { kind: kind2 }).catch(function () {});
    }
    function saveBlob(blob, name) {
      var url = URL.createObjectURL(blob), a = h("a", { href: url, download: name });
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
    }
    function zipOf(build, name, btn) {
      if (!window.JSZip) { toast("The zip maker didn't load. Use Copy instead."); return; }
      btn.disabled = true;
      record("download").then(function () {
        var z = new window.JSZip();
        build(z);
        return z.generateAsync({ type: "blob" }).then(function (blob) { saveBlob(blob, name); toast("Downloaded " + name); used("download"); });
      }).catch(function () { toast("Couldn't make the zip. Use Copy instead."); }).then(function () { btn.disabled = false; });
    }
    var mdPre = h("pre", { class: "md", tabindex: "0", text: String(s.skill_md || "") });
    function copyText(txt, what) {
      record("copy");
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { toast("Copied the " + what); used("copy"); }, function () {
        details.open = true;
        var r = document.createRange(); r.selectNodeContents(mdPre); var sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
        toast("Selected. Press copy."); used("copy");
      });
    }
    var details, addSec;
    if (kind === "prompt") {
      var copyP = h("button", { class: "btn", type: "button", onclick: function () { copyText(String(s.skill_md || ""), "prompt"); } }, icon("copy"), "Copy the prompt");
      var openC = h("a", { class: "btn ghost", href: "https://claude.ai/new?q=" + encodeURIComponent(String(s.skill_md || "").slice(0, 6000)), target: "_blank", rel: "noopener", onclick: function () { record("copy"); used("copy"); } }, icon("arrow"), "Open in Claude");
      details = h("details", { class: "file", open: true }, h("summary", { text: "The prompt" }), mdPre);
      addSec = h("section", { class: "sec addto" }, h("h2", { text: "Use it" }),
        details,
        h("div", { class: "btns" }, copyP, openC),
        h("ol", { class: "steps" },
          h("li", null, "Copy it, or tap ", h("b", { text: "Open in Claude" }), "."),
          h("li", null, "Swap each ", h("code", { text: "[part in brackets]" }), " for your own words."),
          h("li", { text: "Send. Nothing to install." })));
    } else if (kind === "kit") {
      var slug = fileSlug(s.name || s.slug, "kit");
      var zipK = h("button", { class: "btn", type: "button" }, icon("download"), "Add the kit to Claude");
      zipK.addEventListener("click", function () {
        zipOf(function (z) {
          var root = z.folder(slug);
          root.folder(".claude-plugin").file("plugin.json", JSON.stringify({ name: slug, description: String(s.one_line || "").slice(0, 200), version: String(s.version || 1) + ".0.0", author: { name: makerName(s) } }, null, 2) + "\n");
          files.forEach(function (f) { root.folder("skills").folder(f.name).file("SKILL.md", f.md); });
        }, slug + ".zip", zipK);
      });
      var one = files.map(function (f) {
        var b = h("button", { class: "link-btn", type: "button" }, icon("download"), f.name + (f.start ? " (start here)" : ""));
        b.addEventListener("click", function () { zipOf(function (z) { z.folder(f.name).file("SKILL.md", f.md); }, f.name + ".zip", b); });
        return h("li", null, b);
      });
      details = h("details", { class: "file" }, h("summary", { text: "Read every file in the kit" }),
        files.map(function (f) { return h("div", null, h("p", { class: "note", text: "skills/" + f.name + "/SKILL.md" + (f.start ? " · start here" : "") }), h("pre", { class: "md", tabindex: "0", text: f.md })); }));
      addSec = h("section", { class: "sec addto" }, h("h2", { text: "Add it to Claude" }),
        h("p", { class: "kit-count" }, icon("kit"), h("b", { text: files.length + " skills, one upload" })),
        h("div", { class: "btns" }, zipK),
        h("ol", { class: "steps" },
          h("li", null, "Tap ", h("b", { text: "Add the kit to Claude" }), " to download ", h("code", { text: slug + ".zip" }), "."),
          h("li", null, "In Claude, go to ", h("b", { text: "Customize → Plugins" }), ", tap ", h("b", { text: "Upload plugin" }), " and pick the .zip."),
          h("li", null, "Start a chat and ask for the job. Claude begins with ", h("b", { text: files[0].name }), ".")),
        h("details", { class: "why" }, h("summary", { text: "No Plugins menu? Add the skills one by one" }),
          h("p", { class: "note", text: "Download each one, then Customize → Skills → + → Upload a skill." }), h("ul", { class: "one-by-one" }, one),
          (s.works_in || []).indexOf("claude-code") >= 0 ? h("p", { class: "note" }, "Claude Code: unzip the kit and copy each folder in ", h("code", { text: "skills/" }), " into ", h("code", { text: "~/.claude/skills/" }), ".") : null),
        details);
    } else {
      var slug1 = fileSlug(s.slug || s.name, "skill");
      var zipBtn = h("button", { class: "btn", type: "button" }, icon("download"), "Add to Claude");
      var copyBtn = h("button", { class: "btn ghost", type: "button", onclick: function () { copyText(String(s.skill_md || ""), "skill"); } }, icon("copy"), "Copy the skill");
      zipBtn.addEventListener("click", function () { zipOf(function (z) { z.folder(slug1).file("SKILL.md", String(s.skill_md || "")); }, slug1 + ".zip", zipBtn); });
      details = h("details", { class: "file" }, h("summary", { text: "Read the whole skill file" }), mdPre);
      addSec = h("section", { class: "sec addto" }, h("h2", { text: "Add it to Claude" }),
        h("div", { class: "btns" }, zipBtn, copyBtn),
        h("ol", { class: "steps" },
          h("li", null, "Tap ", h("b", { text: "Add to Claude" }), " to download ", h("code", { text: slug1 + ".zip" }), "."),
          h("li", null, "In Claude, open ", h("b", { text: "Settings → Capabilities" }), " and turn on code execution and file creation."),
          h("li", null, "Go to ", h("b", { text: "Customize → Skills" }), ", tap ", h("b", { text: "+" }), ", then ", h("b", { text: "Upload a skill" }), " and pick the .zip."),
          h("li", { text: "Start a chat and ask for what it does." })),
        (s.works_in || []).indexOf("claude-code") >= 0 ? h("p", { class: "note" }, "Claude Code: unzip it into ", h("code", { text: "~/.claude/skills/" }), ".") : null,
        details);
    }
    /* license + thank the maker (the link goes straight to their own page; we take nothing) */
    var lic = licenseOf(s.license);
    var tipOk = /^https:\/\//i.test(String(s.tip_url || ""));
    add(addSec, [h("div", { class: "lic-tip" },
      h("p", { class: "lic" }, h("span", { class: "muted", text: "License: " }), h("b", { text: lic ? lic.name : "Not picked yet. Ask the maker before sharing it." })),
      tipOk && !s.official ? h("div", { class: "tip" },
        h("a", { class: "btn ghost tip-btn", href: s.tip_url, target: "_blank", rel: "noopener nofollow ugc" }, icon("heart"), "Thank " + makerName(s)),
        h("p", { class: "note", text: "Opens their own tip page. AI Made EZ takes nothing." })) : null)]);

    /* safety box */
    var ch = normChecks({ blocks: [], warnings: (s.safety && s.safety.warnings) || (s.checks && s.checks.warnings) || [] });
    var sm = summaryOf(s);
    var safety = h("section", { class: "sec" }, h("div", { class: "safety" },
      h("h2", null, icon("shield"), "What this " + W + " asks Claude to do"),
      summaryBlock(sm),
      ch.warnings.length ? h("div", { class: "warns" }, h("p", { class: "muted", text: "Worth knowing:" }), checkList({ passed: [], errors: [], warnings: ch.warnings })) : null,
      h("p", { class: "note", text: "Passed our automatic checks (no hidden instructions, no secrets, no sending your data anywhere) and a person read it before it went live." })));

    /* reviews */
    var bubbles = h("div", { class: "bubbles" }, loading("Loading reviews…"));
    var revSec = h("section", { class: "sec" }, h("h2", { text: "What people used it for" }), bubbles, rateSlot);
    function drawBubbles() {
      api("GET", "skills/" + encodeURIComponent(s.id) + "/ratings").then(function (j) {
        if (tok !== RT) return;
        var rs = (j.items || j.ratings || []).filter(function (r) { return r && r.line; });
        if (j.mine && !s.my_rating) s.my_rating = j.mine;
        clear(bubbles);
        if (!rs.length) return add(bubbles, [h("p", { class: "note", text: "No reviews yet. Try it, then say if it helped." })]);
        rs.slice(0, 12).forEach(function (r) {
          var yes = r.helped === true || r.helped === 1 || r.helped === "1";
          bubbles.appendChild(h("figure", { class: "bub " + (yes ? "yes" : "no") },
            h("blockquote", { text: r.line }),
            h("figcaption", null, icon(yes ? "thumbUp" : "thumbDown"), h("span", { text: (yes ? "Helped" : "Didn't help") + " · " + (r.handle || r.maker_handle || "someone") + (r.staff ? " (AI Made EZ reviewer)" : "") }))));
        });
      }).catch(function () { clear(bubbles); add(bubbles, [h("p", { class: "note", text: "Couldn't load reviews." })]); });
    }
    function drawRate() {
      clear(rateSlot);
      var didUse = s.used_by_me || s.used || usedHere(s.id);
      if (!didUse) return add(rateSlot, [h("p", { class: "note rate-hint", text: "Tried it? Add or copy it first, then you can say if it helped." })]);
      if (!ME) return add(rateSlot, [needSignIn("Sign in to say if it helped. One rating per person keeps it honest.", "/s/" + s.id)]);
      if (own) return add(rateSlot, [h("div", { class: "box quiet" }, h("p", { text: "You made this one, so you can't rate it. Ask a friend to try it." }))]);
      var age = ME.created_at ? Date.now() - ts(ME.created_at) : Infinity;
      if (age < 864e5) return add(rateSlot, [h("div", { class: "box quiet" }, icon("lock"),
        h("p", { text: "New accounts can rate after 24 hours, so nobody can make accounts just to vote. You can rate from " + fmtWhen(ts(ME.created_at) + 864e5) + "." }))]);
      var mine = s.my_rating || null, helped = mine ? !!(mine.helped === true || mine.helped === 1) : null;
      var yesB = h("button", { type: "button", class: "yn", "aria-pressed": helped === true ? "true" : "false" }, icon("thumbUp"), "Yes");
      var noB = h("button", { type: "button", class: "yn", "aria-pressed": helped === false ? "true" : "false" }, icon("thumbDown"), "No");
      var line = h("input", { id: "rline", maxlength: "140", value: mine ? mine.line : "", placeholder: "Used it for my landlord email", autocomplete: "off" });
      var cnt = h("span", { class: "cnt", text: (mine ? mine.line.length : 0) + "/140" });
      var msg = h("p", { class: "form-msg", role: "alert" });
      var save = h("button", { class: "btn", type: "submit", text: mine ? "Update my rating" : "Save my rating" });
      function pick(v) { helped = v; yesB.setAttribute("aria-pressed", String(v === true)); noB.setAttribute("aria-pressed", String(v === false)); }
      yesB.addEventListener("click", function () { pick(true); });
      noB.addEventListener("click", function () { pick(false); });
      line.addEventListener("input", function () { cnt.textContent = line.value.length + "/140"; });
      var form = h("form", { class: "rate", onsubmit: function (e) {
        e.preventDefault(); msg.textContent = "";
        var l = line.value.trim();
        if (helped == null) { msg.textContent = "Pick Yes or No first."; return; }
        if (l.length < 10) { msg.textContent = "Say what you used it for, in at least 10 characters."; line.focus(); return; }
        save.disabled = true;
        api("POST", "skills/" + encodeURIComponent(s.id) + "/rate", { helped: helped, line: l }).then(function (j) {
          s.my_rating = { helped: helped, line: l };
          var held = j && j.rating && j.rating.counted === false;
          toast(held ? "Saved. It counts after a quick check." : "Thanks. Your rating is saved.");
          if (held) { msg.textContent = "Lots of new ratings came in on this skill at once, so new ones count after a reviewer looks."; }
          drawBubbles(); save.textContent = "Update my rating";
        }).catch(function (e2) { msg.textContent = e2.setup ? "Ratings aren't open yet." : e2.message; }).then(function () { save.disabled = false; });
      } },
        h("p", { class: "rate-q", text: "Did it help?" }),
        h("div", { class: "yn-row" }, yesB, noB),
        h("label", { for: "rline", text: "What did you use it for?" }),
        h("div", { class: "inline" }, line, cnt),
        msg,
        h("div", null, save, mine ? h("span", { class: "note", text: " You can change it anytime." }) : null));
      add(rateSlot, [form]);
    }

    /* family tree */
    var tree = h("section", { class: "sec" }, h("h2", { text: "Family tree" }));
    var parent = s.parent ? norm(s.parent) : null;
    var kids = (s.remixes || []).map(norm);
    function node(x, cls, tag) {
      var l = x.lift_v;
      return h(x.id === s.id ? "div" : "a", { class: "node " + (cls || ""), href: x.id === s.id ? null : "#/s/" + encodeURIComponent(x.id) },
        h("small", { text: tag }),
        h("b", { text: x.name }),
        h("span", { text: (x.maker_handle ? "by " + makerName(x) + " · " : "") + (l == null ? "not tested" : (l > 0 ? "+" : "") + sc(l) + " over plain") }));
    }
    var treeKids = h("div", { class: "tree" },
      parent ? node(parent, "up", "Remixed from") : null,
      node(s, "me", "This skill"),
      kids.length ? h("div", { class: "kids" }, kids.map(function (k) {
        var beats = k.beats_parent != null ? !!k.beats_parent : (k.lift_v != null && s.lift_v != null && k.lift_v > s.lift_v);
        var n = node(k, "kid" + (beats ? " beats" : ""), beats ? "Remix · beats this one" : "Remix");
        return n;
      })) : null);
    add(tree, [treeKids,
      !parent && !kids.length ? h("p", { class: "note", text: "No remixes yet." }) : null,
      s.license === "all-rights" && !own ? h("p", { class: "note", text: makerName(s) + " keeps all rights to this one, so remixes are off." }) : h("a", { class: "btn ghost", href: hashFor("/submit", { remix: s.id }) }, icon("remix"), "Remix this"),
      s.license === "all-rights" && !own ? null : h("p", { class: "note", text: "A remix starts from this " + W + " and credits " + makerName(s) + "." })]);

    /* version + report */
    var reportSlot = h("div");
    var meta = h("section", { class: "sec meta" },
      h("p", { class: "note", text: "Version " + s.version + (s.uses ? " · used " + s.uses + (s.uses === 1 ? " time" : " times") : "") + (s.live_at ? " · live since " + fmtDate(s.live_at) : "") + (s.updated_at ? " · updated " + fmtDate(s.updated_at) : "") + ". Changes go through review before they show here." }),
      s.status === "live" && !own ? h("button", { class: "link-btn", type: "button", onclick: function () { drawReport(); } }, icon("flag"), "Report this " + W) : null,
      reportSlot);
    function drawReport() {
      clear(reportSlot);
      if (!ME) return add(reportSlot, [needSignIn("Sign in to report a skill.", "/s/" + s.id)]);
      var msg = h("p", { class: "form-msg", role: "alert" });
      var note = h("textarea", { id: "rnote", maxlength: "500", rows: "3", placeholder: "Optional: what did you see?" });
      var form = h("form", { class: "box report", onsubmit: function (e) {
        e.preventDefault();
        var r = form.querySelector("input[name=reason]:checked");
        if (!r) { msg.textContent = "Pick a reason."; return; }
        api("POST", "skills/" + encodeURIComponent(s.id) + "/report", { reason: r.value, note: note.value.trim() }).then(function () {
          clear(reportSlot); add(reportSlot, [h("p", { class: "box quiet", text: "Thanks. A reviewer will look. Two reports from different people hide it until then." })]);
        }).catch(function (e2) { msg.textContent = e2.message; });
      } },
        h("fieldset", null, h("legend", { text: "What's wrong?" }),
          D.reportReasons.map(function (r) { return h("label", { class: "radio" }, h("input", { type: "radio", name: "reason", value: r[0] }), h("span", { text: r[1] })); })),
        h("label", { for: "rnote", text: "Anything else (optional)" }), note, msg,
        h("div", { class: "btns" }, h("button", { class: "btn", type: "submit", text: "Send report" }), h("button", { class: "btn ghost", type: "button", text: "Cancel", onclick: function () { clear(reportSlot); } })));
      add(reportSlot, [form]);
    }

    mount(
      backLink("#/c/" + c.id + (s.sub ? "?sub=" + encodeURIComponent(s.sub) : ""), c.short),
      h("div", { class: "skill" },
        h("div", { class: "skill-l" }, big),
        h("div", { class: "skill-r" }, banner, exSec, strip, addSec, safety, revSec, tree, meta)));
    drawRate(); drawBubbles();
  }

  /* ---------- Submit (4 steps, saved on this device until sent) ---------- */
  var TEMPLATE = "---\nname: my-skill\ndescription: What it does and when to use it. Use the words people type, like \"fix my email\" or \"make this shorter\".\n---\n\n# My skill\n\n## What to do\n1. Read what the person gave you.\n2. Do the one thing this skill is for.\n3. Keep their words where you can.\n\n## Never\n- Never invent facts, names or numbers.\n\n## Output\nWhat the answer looks like, in order.\n";
  var PROMPT_TEMPLATE = "Rewrite my [type of message] so it sounds [how you want it to sound].\n\nKeep it under [number] words. Keep my facts and names. Don't add anything I didn't say.\n\nHere it is:\n[paste your message]\n";
  var KIT_TEMPLATE = "---\nname: start-here\ndescription: The first step of this kit. Use when someone asks for [the big job], like \"[what they'd type]\".\n---\n\n# Start here\n\n## What to do\n1. Ask the person the 3 things you need: [thing 1], [thing 2], [thing 3].\n2. Use the [second skill's name] skill for [step].\n3. Use the [third skill's name] skill for [step].\n4. End with a short list of what they have now.\n\n## Output\nWhat they get at the end, in order.\n";
  function blankDraft() { return { step: 1, kind: "skill", parts: [], license: "", tip_url: "", skill_md: "", name: "", one_line: "", category: "", sub: "", for_tag: "anyone", works_in: ["claude-ai", "claude-code"], examples: [{ input: "", output: "", plain_output: "" }], parent_id: null, parent_name: "", parent_handle: "", edit_id: null, ask_test: false }; }
  function pageSubmit(q, tok) {
    var d = Object.assign(blankDraft(), lsGet(DRAFT_KEY, {}));
    if (!Array.isArray(d.examples) || !d.examples.length) d.examples = [{ input: "", output: "", plain_output: "" }];
    if (!Array.isArray(d.parts)) d.parts = [];
    if (["skill", "prompt", "kit"].indexOf(d.kind) < 0) d.kind = "skill";
    function save() { lsSet(DRAFT_KEY, d); }
    function W() { return kindOf(d.kind).name.toLowerCase(); }
    var hasWork = !!(d.skill_md.trim() || d.name.trim());
    var remix = q.get("remix"), edit = q.get("edit");
    if (q.get("cat") && catOf(q.get("cat")) && !d.category) { d.category = q.get("cat"); d.sub = subOf(d.category, q.get("sub")) ? q.get("sub") : ""; save(); }

    function loadFrom(id, mode) {
      mount(loading(mode === "edit" ? "Opening your skill…" : "Copying the skill…"));
      api("GET", "skills/" + encodeURIComponent(id)).then(function (j) {
        if (tok !== RT) return;
        var s = norm(j.skill || j), n = blankDraft();
        n.skill_md = String(s.skill_md || "");
        if (mode === "edit") {
          var pv = s.pending_version || {};
          n.skill_md = String(pv.skill_md || s.skill_md || "");
          Object.assign(n, { kind: pv.kind || s.kind, parts: (pv.parts || s.parts || []).map(function (x) { return { skill_md: String(x && x.skill_md || "") }; }), license: (pv.license !== undefined ? pv.license : s.license) || "", tip_url: (pv.tip_url !== undefined ? pv.tip_url : s.tip_url) || "", name: pv.name || s.name, one_line: pv.one_line || s.one_line, category: pv.category || s.category, sub: pv.sub || s.sub, for_tag: pv.for_tag || s.for_tag || "anyone", works_in: (pv.works_in || s.works_in || []).length ? (pv.works_in || s.works_in) : ["claude-ai"], edit_id: s.id, parent_id: s.parent_id || null, ask_test: !!s.ask_test });
          n.examples = (jparse(pv.examples, null) || s.examples || []).map(function (e) { return { input: e.input || "", output: e.output || "", plain_output: e.plain_source === "test" ? "" : (e.plain_output || "") }; });
          if (!n.examples.length) n.examples = [{ input: "", output: "", plain_output: "" }];
        } else {
          Object.assign(n, { kind: s.kind, parts: (s.parts || []).map(function (x) { return { skill_md: String(x && x.skill_md || "") }; }), name: (s.name + " remix").slice(0, 40), category: s.category, sub: s.sub, for_tag: s.for_tag || "anyone", works_in: s.works_in.length ? s.works_in : ["claude-ai"], parent_id: s.id, parent_name: s.name, parent_handle: makerName(s) });
        }
        d = n; save();
        history.replaceState(null, "", location.pathname + location.search + "#/submit");
        draw();
      }).catch(function (e) { if (tok === RT) mount(backLink("#/submit", "Back"), fail(e, route)); });
    }
    if (edit && d.edit_id !== edit) {
      if (!hasWork) return loadFrom(edit, "edit");
      return mount(h("div", { class: "box" }, h("p", { text: "You have an unsent draft on this device. Open your skill for editing instead? The draft will be replaced." }),
        h("div", { class: "btns" }, h("button", { class: "btn", type: "button", text: "Edit my skill", onclick: function () { loadFrom(edit, "edit"); } }), h("a", { class: "btn ghost", href: "#/submit", text: "Keep my draft" }))));
    }
    if (remix && d.parent_id !== remix) {
      if (!hasWork) return loadFrom(remix, "remix");
      return mount(h("div", { class: "box" }, h("p", { text: "You have an unsent draft on this device. Start the remix instead? The draft will be replaced." }),
        h("div", { class: "btns" }, h("button", { class: "btn", type: "button", text: "Start the remix", onclick: function () { loadFrom(remix, "remix"); } }), h("a", { class: "btn ghost", href: "#/submit", text: "Keep my draft" }))));
    }

    var lastCheck = null, checkSeq = 0;
    function runCheck(withEx) {
      var my = ++checkSeq;
      var exs = d.examples.filter(function (e) { return e.input.trim() || e.output.trim(); }).map(function (e) { var o = { input: e.input, output: e.output }; if (e.plain_output.trim()) o.plain_output = e.plain_output; return o; });
      var body = { skill_md: d.skill_md, kind: d.kind };
      if (d.kind === "kit") body.parts = d.parts;
      if (withEx) body.examples = exs;
      if (d.name.trim() && d.category && d.sub) { body.name = d.name.trim(); body.category = d.category; body.sub = d.sub; }
      if (d.edit_id) body.id = d.edit_id;
      return api("POST", "check", body)
        .then(function (j) { if (my === checkSeq) lastCheck = normChecks(j, withEx); return my === checkSeq ? lastCheck : null; });
    }

    function draw() {
      if (tok !== RT) return;
      var steps = [d.kind === "prompt" ? "Prompt" : d.kind === "kit" ? "Kit files" : "Skill file", "About it", "Examples", "Checks"];
      var prog = h("ol", { class: "prog", "aria-label": "Steps" }, steps.map(function (t, i) {
        var n = i + 1;
        return h("li", { class: n < d.step ? "done" : n === d.step ? "now" : "", "aria-current": n === d.step ? "step" : null },
          h("button", { type: "button", disabled: n > d.step ? true : null, onclick: function () { d.step = n; save(); draw(); } }, h("span", { class: "pn", text: String(n) }), h("span", { class: "pt", text: t })));
      }));
      var body = [stepOne, stepTwo, stepThree, stepFour][d.step - 1]();
      mount(
        h("header", { class: "sub-head" },
          h("h1", { text: d.edit_id ? "Edit your " + W() : "Share yours" }),
          h("p", { class: "note", text: "Saved on this device as you go. Nothing is sent until step 4." })),
        prog,
        d.parent_id ? h("p", { class: "box quiet credit" }, icon("remix"), h("span", null, "Remix of ", h("a", { class: "link", href: "#/s/" + encodeURIComponent(d.parent_id), text: d.parent_name || "the original" }), d.parent_handle ? " by " : "", d.parent_handle ? h("b", { text: d.parent_handle }) : null, ". They get credit on your page.")) : null,
        body);
      window.scrollTo(0, 0);
    }
    function nav2(prevOk, next) {
      var msg = h("p", { class: "form-msg", role: "alert" });
      return h("div", null, msg, h("div", { class: "btns step-nav" },
        d.step > 1 ? h("button", { class: "btn ghost", type: "button", text: "Back", onclick: function () { d.step--; save(); draw(); } }) : null,
        next ? h("button", { class: "btn", type: "button", text: "Next", onclick: function () {
          var problem = prevOk();
          if (problem) { msg.textContent = problem; return; }
          d.step++; save(); draw();
        } }) : null));
    }
    function counter(input, max) {
      var c = h("span", { class: "cnt", text: input.value.length + "/" + max });
      input.addEventListener("input", function () { c.textContent = input.value.length + "/" + max; });
      return c;
    }

    function stepOne() {
      var isP = d.kind === "prompt", isK = d.kind === "kit";
      var picker = h("div", { class: "kind-pick", role: "radiogroup", "aria-label": "What are you sharing?" }, D.kinds.map(function (k) {
        return h("button", { type: "button", role: "radio", class: "kind-card", "aria-checked": d.kind === k.id ? "true" : "false", disabled: d.edit_id && d.kind !== k.id ? true : null, onclick: function () {
          if (d.kind === k.id) return;
          d.kind = k.id; if (k.id === "kit" && !d.parts.length) d.parts = [{ skill_md: "" }]; save(); draw();
        } }, icon(k.id), h("b", { text: k.name }), h("small", { text: k.what }));
      }));
      var max = isP ? 8000 : 40960;
      var ta = h("textarea", { id: "md", class: "mono", rows: isP ? "10" : isK ? "12" : "16", spellcheck: isP ? "true" : "false", value: d.skill_md,
        placeholder: isP ? "Rewrite my [type of message] so it sounds [friendly]…" : "---\nname: my-skill\ndescription: …\n---" });
      var live = h("p", { class: "live", "aria-live": "polite" });
      var size = h("span", { class: "cnt" });
      function sz() {
        if (isP) { size.textContent = ta.value.length + " of 8,000"; size.classList.toggle("over", ta.value.length > 8000); return; }
        var kb = new Blob([ta.value]).size / 1024; size.textContent = kb.toFixed(1) + " KB of 40"; size.classList.toggle("over", kb > 40);
      }
      var check = debounce(function () {
        if (!d.skill_md.trim()) { live.textContent = ""; return; }
        live.textContent = "Checking…";
        runCheck(false).then(function (ch) {
          if (!ch) return;
          clear(live);
          var n = ch.errors.length;
          add(live, n ? [icon("x", "bad"), n + (n === 1 ? " thing to fix. See step 4 for how." : " things to fix. See step 4 for how.")] : [icon("check", "ok"), "Looks fine so far."]);
        }).catch(function (e) { live.textContent = e.setup ? "Checks aren't available yet." : "Couldn't check right now."; });
      }, 700);
      ta.addEventListener("input", function () { d.skill_md = ta.value; save(); sz(); check(); });
      var file = h("input", { type: "file", accept: ".md,text/markdown,text/plain", class: "vh", id: "mdfile" });
      file.addEventListener("change", function () {
        var f = file.files && file.files[0]; if (!f) return;
        if (f.size > 40960) { toast("That file is over 40 KB."); return; }
        f.text().then(function (t) { ta.value = t; d.skill_md = t; save(); sz(); check(); });
      });
      sz(); if (d.skill_md.trim()) check();
      var tpl = isP ? PROMPT_TEMPLATE : isK ? KIT_TEMPLATE : TEMPLATE;
      var tools = h("div", { class: "btns small" },
        isP ? null : h("label", { class: "btn ghost", for: "mdfile" }, icon("download"), "Pick a file"), isP ? null : file,
        h("button", { class: "btn ghost", type: "button", onclick: function () {
          if (ta.value.trim() && !confirm("Replace what's in the box with the template?")) return;
          ta.value = tpl; d.skill_md = tpl; save(); sz(); check(); ta.focus();
        } }, icon("plus"), "Start from a template"),
        h("a", { class: "link", href: "#/", text: "or remix one from the library" }));

      /* kit parts: 1 to 5 more skills */
      var partsBox = null;
      if (isK) {
        partsBox = h("div", { class: "parts" });
        (function drawParts() {
          clear(partsBox);
          d.parts.forEach(function (p, i) {
            var t = h("textarea", { id: "part" + i, class: "mono", rows: "8", spellcheck: "false", value: p.skill_md || "", placeholder: "---\nname: second-step\ndescription: …\n---" });
            t.addEventListener("input", function () { p.skill_md = t.value; save(); check(); });
            partsBox.appendChild(h("div", { class: "part box" },
              h("div", { class: "ex-top" }, h("h3", null, h("label", { for: "part" + i, text: "Skill " + (i + 2) + (fmName(p.skill_md) ? ": " + fmName(p.skill_md) : "") })),
                h("button", { class: "link-btn", type: "button", onclick: function () { d.parts.splice(i, 1); save(); drawParts(); check(); } }, icon("x"), "Remove")),
              t));
          });
          if (d.parts.length < 5) partsBox.appendChild(h("button", { class: "btn ghost", type: "button", onclick: function () { d.parts.push({ skill_md: "" }); save(); drawParts(); } }, icon("plus"), "Add a skill to the kit"));
        })();
      }
      return h("section", { class: "step" },
        h("h2", { text: "What are you sharing?" }),
        picker,
        h("h2", { class: "step-h2", text: isP ? "Paste your prompt" : isK ? "Skill 1: start here" : "Paste your SKILL.md" }),
        h("p", { class: "sub", text: isP ? "Put the parts people change in [square brackets]. Up to 8,000 characters." : isK ? "Claude starts with this one. It says which of the other skills to use, and when." : "The file Claude reads. Text only, up to 40 KB." }),
        tools,
        h("label", { for: "md", class: "vh", text: isP ? "Prompt" : "SKILL.md" }),
        ta, h("div", { class: "under" }, live, size),
        partsBox,
        nav2(function () {
          if (!d.skill_md.trim()) return isP ? "Paste your prompt first, or start from the template." : "Paste your SKILL.md first, or start from the template.";
          if (isP ? d.skill_md.length > 8000 : new Blob([d.skill_md]).size > max) return isP ? "The prompt is over 8,000 characters. Cut it down first." : "The file is over 40 KB. Cut it down first.";
          if (isK) {
            var filled = d.parts.filter(function (p) { return String(p.skill_md || "").trim(); });
            if (!filled.length) return "A kit needs at least one more skill. Paste it in Skill 2.";
            if (filled.length < d.parts.length) return "One of the kit's skills is empty. Fill it in or remove it.";
          }
          return "";
        }, true));
    }

    function stepTwo() {
      var name = h("input", { id: "f-name", maxlength: "40", value: d.name, autocomplete: "off", placeholder: "Polish my email" });
      var line = h("input", { id: "f-line", maxlength: "90", value: d.one_line, autocomplete: "off", placeholder: "Your rough draft, shorter and clearer, still you." });
      name.addEventListener("input", function () { d.name = name.value; save(); });
      line.addEventListener("input", function () { d.one_line = line.value; save(); });
      var subBox = h("div", { class: "chips pick", role: "radiogroup", "aria-label": "Subcategory" });
      var catSel = h("select", { id: "f-cat", onchange: function () { d.category = catSel.value; d.sub = ""; save(); drawSubs(); } },
        h("option", { value: "", text: "Pick one" }),
        D.cats.map(function (c) { return h("option", { value: c.id, selected: d.category === c.id ? true : null, text: c.name }); }));
      var catNote = h("p", { class: "note" });
      function drawSubs() {
        clear(subBox);
        var c = catOf(d.category);
        catNote.textContent = c && c.note ? c.note : "";
        if (!c) return add(subBox, [h("span", { class: "note", text: "Pick a category first." })]);
        c.subs.forEach(function (s) {
          add(subBox, [h("button", { type: "button", role: "radio", class: "chip-l", "aria-checked": d.sub === s.id ? "true" : "false", text: s.name, onclick: function () { d.sub = s.id; save(); drawSubs(); } })]);
        });
      }
      drawSubs();
      var forSel = h("select", { id: "f-for", onchange: function () { d.for_tag = forSel.value; save(); } },
        D.forTags.map(function (t) { return h("option", { value: t.id, selected: d.for_tag === t.id ? true : null, text: t.name }); }));
      var works = D.worksIn.map(function (w) {
        var cb = h("input", { type: "checkbox", checked: d.works_in.indexOf(w.id) >= 0, onchange: function () {
          d.works_in = D.worksIn.map(function (x) { return x.id; }).filter(function (x) { return x === w.id ? cb.checked : d.works_in.indexOf(x) >= 0; }); save();
        } });
        return h("label", { class: "check" }, cb, h("span", { text: w.name }));
      });
      var licSel = h("select", { id: "f-lic", onchange: function () { d.license = licSel.value; save(); } },
        h("option", { value: "", text: "Pick one" }),
        D.licenses.map(function (l) { return h("option", { value: l.id, selected: d.license === l.id ? true : null, text: l.name }); }));
      var tip = h("input", { id: "f-tip", type: "url", inputmode: "url", maxlength: "300", value: d.tip_url, autocomplete: "off", placeholder: "https://ko-fi.com/yourname" });
      tip.addEventListener("input", function () { d.tip_url = tip.value; save(); });
      return h("section", { class: "step" },
        h("h2", { text: "Name it and file it" }),
        h("div", { class: "field" }, h("label", { for: "f-name", text: "Name" }), h("div", { class: "inline" }, name, counter(name, 40))),
        h("div", { class: "field" }, h("label", { for: "f-line", text: "One line: what you get" }), h("div", { class: "inline" }, line, counter(line, 90))),
        h("div", { class: "field" }, h("label", { for: "f-cat", text: "Category" }), catSel, catNote),
        h("div", { class: "field" }, h("span", { class: "lbl", text: "Subcategory" }), subBox),
        h("div", { class: "field two" },
          h("div", null, h("label", { for: "f-for", text: "Mostly for" }), forSel),
          h("fieldset", null, h("legend", { text: "Works in" }), works)),
        h("div", { class: "field" }, h("label", { for: "f-lic", text: "License: what others may do with it" }), licSel,
          h("p", { class: "note" }, "Not sure? Share with credit is the usual pick. ", h("a", { class: "link", href: "#/rules", target: "_blank", text: "What these mean" }))),
        h("div", { class: "field" }, h("label", { for: "f-tip", text: "Thank-you link (optional)" }), tip,
          h("p", { class: "note", text: "Your Ko-fi, Buy Me a Coffee, Gumroad, PayPal.me, Patreon, Venmo, Cash App, Stripe link, Liberapay or GitHub Sponsors page. People tip you there; we take nothing." })),
        nav2(function () {
          if (d.name.trim().length < 3) return "Give it a name of at least 3 characters.";
          if (d.one_line.trim().length < 10) return "Write one line (at least 10 characters) that says what someone gets.";
          if (!d.category) return "Pick a category.";
          if (!d.sub) return "Pick a subcategory.";
          if (!d.works_in.length) return "Tick where it works: Claude.ai, Claude Code or both.";
          if (!d.license) return "Pick a license so people know what they may do with it.";
          if (d.tip_url.trim() && !/^https:\/\/\S+$/i.test(d.tip_url.trim())) return "The thank-you link should start with https://";
          return "";
        }, true));
    }

    function stepThree() {
      var list = h("div", { class: "exlist" });
      function drawList() {
        clear(list);
        d.examples.forEach(function (ex, i) {
          var prev = h("div", { class: "preview" });
          function pv() { clear(prev); if (ex.input.trim() || ex.output.trim()) add(prev, [h("p", { class: "muted", text: "Preview" }), exampleFlip({ input: ex.input, output: ex.output, plain_output: ex.plain_output }, 0, 1)]); }
          var pvD = debounce(pv, 400);
          function ta(key, label, max, ph, rows) {
            var t = h("textarea", { id: "ex" + i + key, maxlength: String(max), rows: String(rows || 4), value: ex[key] || "", placeholder: ph });
            t.addEventListener("input", function () { ex[key] = t.value; save(); pvD(); });
            return h("div", { class: "field" }, h("label", { for: "ex" + i + key, text: label }), t, counter(t, max));
          }
          pv();
          list.appendChild(h("div", { class: "ex box" },
            h("div", { class: "ex-top" }, h("h3", { text: "Example " + (i + 1) }),
              d.examples.length > 1 ? h("button", { class: "link-btn", type: "button", onclick: function () { d.examples.splice(i, 1); save(); drawList(); } }, icon("x"), "Remove") : null),
            ta("input", "What someone asked", 4000, "can you make this sound better before I send it? …", 4),
            ta("output", "What Claude answered with your " + W(), 8000, "Paste the whole answer.", 7),
            ta("plain_output", "Plain Claude's answer (optional)", 8000, d.kind === "prompt" ? "Same request in your own words, without the prompt." : "Same request, new chat, " + W() + " turned off.", 5),
            h("p", { class: "note", text: "The plain answer shows as “Maker's comparison”. Use real answers, not edited ones." }),
            prev));
        });
        if (d.examples.length < 3) list.appendChild(h("button", { class: "btn ghost", type: "button", onclick: function () { d.examples.push({ input: "", output: "", plain_output: "" }); save(); drawList(); } }, icon("plus"), "Add another example"));
      }
      drawList();
      return h("section", { class: "step" },
        h("h2", { text: "Show it working" }),
        h("p", { class: "sub", text: "One to three real requests and what Claude said. People decide from these." }),
        list,
        nav2(function () {
          var good = d.examples.filter(function (e) { return e.input.trim() && e.output.trim(); });
          if (!good.length) return "Add at least one example with both the request and the answer.";
          var half = d.examples.filter(function (e) { return (e.input.trim() || e.plain_output.trim()) && !e.output.trim(); });
          if (half.length) return "An example has no answer from your skill. Fill it in or remove it.";
          return "";
        }, true));
    }

    function stepFour() {
      var box = h("div", { class: "checkbox" }, loading("Running the checks…"));
      var sendMsg = h("p", { class: "form-msg", role: "alert" });
      var want = h("input", { type: "checkbox", checked: d.ask_test, onchange: function () { d.ask_test = want.checked; save(); } });
      var send = h("button", { class: "btn", type: "button", disabled: true }, d.edit_id ? "Send the new version" : "Send for review");
      var W1 = W();
      var asks = h("div");
      var local = [];
      if (d.name.trim().length < 3) local.push({ message: "No name yet.", fix: "Go back to step 2 and name it." });
      if (!d.category || !d.sub) local.push({ message: "No category yet.", fix: "Go back to step 2 and pick where it goes." });
      function showChecks(ch) {
        var all = { passed: ch.passed, errors: local.concat(ch.errors), warnings: ch.warnings, summary: ch.summary };
        clear(box);
        add(box, [
          h("p", { class: "tally" }, all.errors.length ? [icon("x", "bad"), all.errors.length + (all.errors.length === 1 ? " thing to fix before sending" : " things to fix before sending")] : [icon("check", "ok"), "Everything passes."]),
          checkList(all)]);
        var sm = Array.isArray(ch.summary) && ch.summary.length ? fromList(ch.summary) : summarize(d.skill_md);
        clear(asks); add(asks, [h("h3", { text: "What your " + W1 + " asks Claude to do" }), h("p", { class: "note", text: "People see this on your page. If it reads wrong, change the first lines of your file." }), summaryBlock(sm)]);
        send.disabled = !!all.errors.length || !ME;
      }
      runCheck(true).then(function (ch) { if (ch) showChecks(ch); }).catch(function (e) {
        clear(box); add(box, [e.setup ? h("p", { class: "box quiet", text: "The checks aren't available yet, so sending is closed for now. Your draft is saved on this device." }) : errorBox(e.message, function () { draw(); })]);
      });
      send.addEventListener("click", function () {
        sendMsg.textContent = ""; send.disabled = true;
        var body = { kind: d.kind, parts: d.kind === "kit" ? d.parts.filter(function (p) { return String(p.skill_md || "").trim(); }) : undefined, license: d.license || null, tip_url: d.tip_url.trim() || null, name: d.name.trim(), one_line: d.one_line.trim(), category: d.category, sub: d.sub, for_tag: d.for_tag, works_in: d.works_in, skill_md: d.skill_md,
          examples: d.examples.filter(function (e) { return e.input.trim() && e.output.trim(); }).map(function (e) { var o = { input: e.input, output: e.output }; if (e.plain_output.trim()) o.plain_output = e.plain_output; return o; }),
          parent_id: d.parent_id || undefined, ask_test: !!d.ask_test, submit: true };
        (d.edit_id ? api("PUT", "skills/" + encodeURIComponent(d.edit_id), body) : api("POST", "skills", body)).then(function () {
          lsSet(DRAFT_KEY, null);
          if (window.SMEZ) SMEZ.stamp("own");
          toast("Sent. A person will check it soon.");
          go("/me");
        }).catch(function (e) {
          sendMsg.textContent = e.setup ? "Sending isn't open yet. Your draft is saved." : e.message;
          if (e.status === 422 && e.body && e.body.checks) showChecks(normChecks(e.body.checks, true));
          else send.disabled = false;
        });
      });
      return h("section", { class: "step" },
        h("h2", { text: "Checks" }),
        h("p", { class: "sub" }, "We look for hidden instructions, secrets and anything that sends your data away. Red ones block sending; each says how to fix it. ", h("a", { class: "link", href: "#/rules", target: "_blank", text: "How we review" })),
        box, asks,
        h("label", { class: "check big-check" }, want, h("span", null, h("b", { text: "Ask for a blind test" }), h("span", { class: "muted", text: "We run your example request with your " + W1 + " and with plain Claude, and a judge who can't tell them apart scores both. The result shows on your card." }))),
        ME ? null : needSignIn("Sign in to send it. Your draft stays on this device.", "/submit"),
        sendMsg,
        h("div", { class: "btns step-nav" }, h("button", { class: "btn ghost", type: "button", text: "Back", onclick: function () { d.step--; save(); draw(); } }), send),
        h("p", { class: "note" }, h("button", { class: "link-btn", type: "button", text: "Throw away this draft", onclick: function () {
          if (!confirm("Throw away this draft? It can't be brought back.")) return;
          lsSet(DRAFT_KEY, null); d = blankDraft(); draw();
        } })));
    }
    draw();
  }

  /* ---------- Me: my skills, my binder, account ---------- */
  function pageMe(tok) {
    if (!ME) return mount(h("h1", { text: "Your skills and binder" }), needSignIn("Sign in to see the skills you shared and the ones you collected.", "/me"));
    mount(loading());
    api("GET", "me").then(function (j) {
      var mine = j.skills, binder = j.binder || j.used;
      var need = Array.isArray(mine) ? Promise.resolve(mine) : api("GET", "skills?mine=1").then(function (k) { return k.skills || []; }).catch(function () { return []; });
      return need.then(function (m) { return { user: j.user || ME, mine: m.map(norm), binder: (binder || []).map(norm) }; });
    }).then(function (r) {
      if (tok !== RT) return;
      var u = r.user;
      var mineList = r.mine.length ? h("ul", { class: "mine" }, r.mine.map(function (s) {
        return h("li", { class: "mine-row box" },
          h("div", { class: "mine-top" },
            h("a", { class: "mine-name", href: "#/s/" + encodeURIComponent(s.id), text: s.name }), statusChip(s.status),
            s.kind !== "skill" ? h("span", { class: "chip", text: kindOf(s.kind).name }) : null,
            h("span", { class: "note", text: "v" + s.version + (s.updated_at ? " · " + fmtDate(s.updated_at) : "") })),
          s.status === "live" ? h("p", { class: "mine-scores", text: "People: " + peopleShort(s) + " · Blind test: " + testShort(s) }) : null,
          s.review_note && (s.status === "changes" || s.status === "hidden") ? h("p", { class: "rnote" }, h("b", { text: "Reviewer's note: " }), h("span", { text: s.review_note })) : null,
          s.status === "review" ? h("p", { class: "note", text: "A person checks every skill before it goes live." }) : null,
          s.pending_version ? h("p", { class: "note", text: "Version " + s.pending_version.version + " is in review. People see version " + s.version + " until then." }) : null,
          h("div", { class: "btns small" },
            h("a", { class: "btn ghost", href: hashFor("/submit", { edit: s.id }) }, icon("edit"), s.status === "live" ? "Edit (goes back to review)" : "Edit"),
            h("a", { class: "link", href: "#/s/" + encodeURIComponent(s.id), text: "View" })));
      })) : h("div", { class: "box empty" }, h("p", { text: "You haven't shared anything yet." }), h("a", { class: "btn", href: "#/submit", text: "Share your first" }));

      /* binder: one slot per category, filled by skills you used or rated */
      var local = lsGet(USED_KEY, {}), byCat = {};
      r.binder.forEach(function (s) { (byCat[s.category] = byCat[s.category] || {})[s.id] = s.name; });
      Object.keys(local).forEach(function (id) { var x = local[id]; if (x && x.category) (byCat[x.category] = byCat[x.category] || {})[id] = x.name; });
      var filled = D.cats.filter(function (c) { return byCat[c.id]; }).length;
      var binder = h("div", { class: "binder" }, D.cats.map(function (c) {
        var got = byCat[c.id];
        if (!got) return h("a", { class: "slot empty", href: "#/c/" + c.id },
          h("span", { class: "slot-ic" }, icon(c.id)), h("b", { text: c.short }), h("span", { class: "hint", text: "Try: " + c.subs[0].name }));
        var ids = Object.keys(got);
        return h("div", { class: "slot full" },
          h("span", { class: "slot-ic" }, icon(c.id)), h("b", { text: c.short }),
          h("ul", null, ids.slice(0, 3).map(function (id) { return h("li", null, h("a", { href: "#/s/" + encodeURIComponent(id), text: got[id] })); })),
          ids.length > 3 ? h("span", { class: "hint", text: "+" + (ids.length - 3) + " more" }) : null);
      }));

      var delBox = h("div");
      function drawDel() {
        clear(delBox);
        var ok = h("input", { type: "checkbox" });
        var btn = h("button", { class: "btn danger", type: "button", disabled: true, text: "Delete my account" });
        var msg = h("p", { class: "form-msg", role: "alert" });
        ok.addEventListener("change", function () { btn.disabled = !ok.checked; });
        btn.addEventListener("click", function () {
          btn.disabled = true;
          api("DELETE", "me").then(function () { ME = null; lsSet(USED_KEY, null); toast("Your account is deleted."); renderNav(); go("/"); })
            .catch(function (e) { msg.textContent = e.message; btn.disabled = false; });
        });
        add(delBox, [h("div", { class: "box danger-box" },
          h("p", { text: "This deletes your account, the skills you shared and your ratings. It can't be undone." }),
          h("label", { class: "check" }, ok, h("span", { text: "I understand" })), msg,
          h("div", { class: "btns" }, btn, h("button", { class: "btn ghost", type: "button", text: "Keep my account", onclick: function () { clear(delBox); } })))]);
      }
      mount(
        h("header", { class: "me-head" },
          h("h1", null, "Hi, ", h("span", { text: u.handle || "you" })),
          h("p", { class: "note", text: (u.email ? u.email + " · " : "") + (u.created_at ? "joined " + fmtDate(u.created_at) : "") })),
        h("section", { class: "sec" }, h("div", { class: "all-top" }, h("h2", { text: "What I shared" }), h("a", { class: "btn small-btn", href: "#/submit" }, icon("plus"), "Share yours")), mineList),
        h("section", { class: "sec" },
          h("div", { class: "all-top" }, h("h2", { text: "My binder" }), h("span", { class: "count", text: filled + " of 10 slots filled" })),
          h("p", { class: "sub", text: "Every skill you add, copy or rate goes in its slot. Empty slots show what to try next." }),
          binder),
        h("section", { class: "sec account" }, h("h2", { text: "Account" }),
          h("div", { class: "btns" },
            h("button", { class: "btn ghost", type: "button", text: "Sign out", onclick: function () {
              api("POST", "signout", {}).catch(function () {}).then(function () { ME = null; renderNav(); toast("Signed out"); go("/"); });
            } }),
            h("button", { class: "btn ghost danger-t", type: "button", text: "Delete account", onclick: drawDel })),
          delBox));
    }).catch(function (e) { if (tok === RT) mount(fail(e, route)); });
  }

  /* ---------- Review (admin queue) ---------- */
  function pageReview(tok) {
    if (!ME) return mount(h("h1", { text: "Review queue" }), needSignIn("Sign in as a reviewer.", "/review"));
    if (!(ME.is_admin || ME.admin)) return mount(h("h1", { text: "Review queue" }), h("div", { class: "box quiet" }, h("p", { text: "This page is for reviewers. If you should be one, ask the owner to add your email." })));
    mount(loading("Loading the queue…"));
    api("GET", "review").then(function (j) {
      if (tok !== RT) return;
      var items = (j.items || []).map(function (it) {
        var sk = norm(it.skill || it);
        return Object.assign(sk, { kind: it.kind || "new", reports: it.reports || [], flagged_ratings: num(it.flagged_ratings) });
      });
      var list = h("div", { class: "queue" });
      var count = h("span", { class: "count", text: items.length + " waiting" });
      function left() { var n = list.querySelectorAll(".q-item").length; count.textContent = n + " waiting"; if (!n) add(list, [h("div", { class: "box empty" }, h("p", { text: "Nothing waiting. All checked." }))]); }
      items.forEach(function (s) { list.appendChild(reviewItem(s, left)); });
      mount(h("div", { class: "all-top" }, h("h1", { text: "Review queue" }), count),
        h("p", { class: "sub", text: "Read the whole file. Approve only what you'd install yourself." }), list);
      left();
    }).catch(function (e) { if (tok === RT) mount(h("h1", { text: "Review queue" }), e.status === 403 ? errorBox("This page is for reviewers.") : fail(e, route)); });
  }
  var KINDS = { "new": "New skill", version: "New version", reported: "Hidden by reports", burst: "Rating burst" };
  function reviewItem(s0, onDone) {
    /* a new version under review: show what's waiting, not what's live */
    var pv = s0.kind === "version" && s0.pending_version ? s0.pending_version : null;
    var s = pv ? Object.assign({}, s0, { kind: pv.kind || s0.kind, parts: pv.parts || null, license: pv.license, tip_url: pv.tip_url, name: pv.name, one_line: pv.one_line, category: pv.category, sub: pv.sub, skill_md: pv.skill_md, examples: jparse(pv.examples, []), checks: jparse(pv.checks, s0.checks), version: pv.version }) : s0;
    var ch = normChecks(s.checks, true);
    var reports = Array.isArray(s.reports) ? s.reports : [];
    var nReports = reports.length;
    var c = catOf(s.category);
    var note = h("textarea", { rows: "3", maxlength: "600", placeholder: "Plain words: what to change and why. The maker sees this." });
    var noteId = "note-" + s.id; note.id = noteId;
    var msg = h("p", { class: "form-msg", role: "alert" });
    var item;
    function act(action) {
      msg.textContent = "";
      if (action === "changes" && note.value.trim().length < 5) { msg.textContent = "Write what to change first. The maker sees this note."; note.focus(); return; }
      api("POST", "review/" + encodeURIComponent(s.id), { action: action, note: note.value.trim() }).then(function () {
        toast(action === "approve" ? "Approved: it's live." : action === "changes" ? "Sent back with your note." : action === "drop_ratings" ? "Held ratings dropped." : "Hidden.");
        item.remove(); onDone();
      }).catch(function (e) { msg.textContent = e.message; });
    }
    /* blind-test result form */
    var tMsg = h("p", { class: "form-msg", role: "alert" });
    var ss = h("input", { type: "number", min: "0", max: "5", step: "0.1", inputmode: "decimal", id: "ts-" + s.id });
    var ps = h("input", { type: "number", min: "0", max: "5", step: "0.1", inputmode: "decimal", id: "tp-" + s.id });
    var win = h("select", { id: "tw-" + s.id }, [["skill", "The skill"], ["plain", "Plain Claude"], ["tie", "Tie"]].map(function (o) { return h("option", { value: o[0], text: o[1] }); }));
    var why = h("input", { id: "tr-" + s.id, maxlength: "400", placeholder: "Why it won, in one sentence" });
    if (s.test) { ss.value = s.test.skill_score; ps.value = s.test.plain_score; win.value = s.test.winner; why.value = s.test.reason || ""; }
    var testForm = h("form", { class: "test-form", onsubmit: function (e) {
      e.preventDefault(); tMsg.textContent = "";
      var a = parseFloat(ss.value), b = parseFloat(ps.value);
      if (!(a >= 0 && a <= 5 && b >= 0 && b <= 5)) { tMsg.textContent = "Scores go from 0 to 5."; return; }
      if (why.value.trim().length < 5) { tMsg.textContent = "Add the judge's reason."; return; }
      api("POST", "review/" + encodeURIComponent(s.id) + "/test", { skill_score: a, plain_score: b, winner: win.value, reason: why.value.trim() })
        .then(function () { toast("Blind-test result attached."); tMsg.textContent = "Attached: " + a.toFixed(1) + " vs " + b.toFixed(1) + "."; })
        .catch(function (e2) { tMsg.textContent = e2.message; });
    } },
      h("div", { class: "test-grid" },
        h("div", null, h("label", { for: "ts-" + s.id, text: "Skill score" }), ss),
        h("div", null, h("label", { for: "tp-" + s.id, text: "Plain score" }), ps),
        h("div", null, h("label", { for: "tw-" + s.id, text: "Winner" }), win)),
      h("label", { for: "tr-" + s.id, text: "Reason" }), why, tMsg,
      h("button", { class: "btn ghost", type: "submit", text: "Attach result" }));

    item = h("article", { class: "q-item box" },
      h("header", { class: "q-head" },
        h("div", null,
          h("h2", { text: s.name }),
          h("p", { class: "note", text: "by " + (s.maker_handle || "someone") + " · " + (c ? c.name : s.category) + " · " + subName(s) + " · v" + s.version + (s.updated_at || s.created_at ? " · sent " + fmtDate(s.updated_at || s.created_at) : "") })),
        h("div", { class: "q-chips" }, statusChip(s.status),
          h("span", { class: "chip st-kind", text: KINDS[s.kind] || s.kind }),
          h("span", { class: "chip", text: kindOf(s.kind).name }),
          s.ask_test ? h("span", { class: "chip st-test", text: "Wants a blind test" }) : null,
          s.flagged_ratings ? h("span", { class: "chip st-hidden", text: s.flagged_ratings + " ratings on hold" }) : null,
          s.parent_id ? h("span", { class: "chip", text: "Remix" }) : null,
          nReports ? h("span", { class: "chip st-hidden", text: nReports + (nReports === 1 ? " report" : " reports") }) : null)),
      h("p", { class: "q-line", text: s.one_line }),
      reports.length ? h("ul", { class: "reports" }, reports.map(function (r) {
        var lbl = (D.reportReasons.find(function (x) { return x[0] === r.reason; }) || [0, r.reason])[1];
        return h("li", null, icon("flag"), h("b", { text: lbl }), r.note ? h("span", { text: ": " + r.note }) : null, r.handle ? h("span", { class: "muted", text: " · " + r.handle + (r.created_at ? ", " + fmtDate(r.created_at) : "") }) : null);
      })) : null,
      h("h3", { text: "Automatic checks" }),
      ch.errors.length || ch.warnings.length || ch.passed.length ? checkList(ch) : h("p", { class: "note", text: "No check results saved." }),
      h("h3", { text: "What it asks Claude to do" }), summaryBlock(summaryOf(s)),
      h("h3", { text: "Examples" }),
      (s.examples || []).length ? (s.examples || []).map(function (e, i) { return exampleFlip(e, i, s.examples.length); }) : h("p", { class: "note", text: "No examples." }),
      s.kind === "kit"
        ? h("details", { class: "file", open: true }, h("summary", { text: "Every file in the kit (" + kitFiles(s).length + ")" }),
          kitFiles(s).map(function (f) { return h("div", null, h("p", { class: "note", text: "skills/" + f.name + "/SKILL.md" + (f.start ? " · start here" : "") }), h("pre", { class: "md", tabindex: "0", text: f.md })); }))
        : h("details", { class: "file", open: true }, h("summary", { text: s.kind === "prompt" ? "Full prompt" : "Full SKILL.md" }), h("pre", { class: "md", tabindex: "0", text: String(s.skill_md || "") })),
      h("p", { class: "note" }, "License: ", h("b", { text: licenseOf(s.license) ? licenseOf(s.license).name : "not picked" }), s.tip_url ? " · Thank-you link: " : null, s.tip_url ? h("code", { text: s.tip_url }) : null),
      h("h3", { text: "Decision" }),
      h("label", { for: noteId, text: "Note to the maker (needed for Needs changes)" }), note, msg,
      h("div", { class: "btns" },
        h("button", { class: "btn ok-btn", type: "button", onclick: function () { act("approve"); } }, icon("check"), "Approve"),
        h("button", { class: "btn", type: "button", onclick: function () { act("changes"); } }, icon("edit"), "Needs changes"),
        h("button", { class: "btn ghost", type: "button", onclick: function () { act("hide"); } }, icon("eye"), "Hide"),
        s.flagged_ratings ? h("button", { class: "btn ghost", type: "button", onclick: function () { act("drop_ratings"); } }, icon("x"), "Drop held ratings") : null),
      h("details", { class: "why" }, h("summary", { text: s.test ? "Blind-test result (attached)" : "Attach a blind-test result" }), testForm));
    return item;
  }

  /* ---------- Requests: ask for something, upvote, makers answer ---------- */
  function pageRequests(q, tok) {
    var status = q.get("status") === "made" ? "made" : "open", sort = q.get("sort") === "new" ? "new" : "top";
    var list = h("div", { class: "reqs" }, loading());
    var myItems = null; /* my live items, loaded once for "I made it" */
    function mineLive() {
      if (myItems) return Promise.resolve(myItems);
      return api("GET", "me").then(function (j) { myItems = (j.skills || []).map(norm).filter(function (x) { return x.status === "live"; }); return myItems; });
    }
    /* ask form */
    var formSlot = h("div");
    if (!ME) add(formSlot, [needSignIn("Sign in to ask for something or to vote.", "/requests")]);
    else {
      var title = h("input", { id: "rq-t", maxlength: "80", autocomplete: "off", placeholder: "Turn my class notes into flashcards" });
      var cat = h("select", { id: "rq-c" }, h("option", { value: "", text: "Pick one" }), D.cats.map(function (c) { return h("option", { value: c.id, text: c.name }); }));
      var det = h("textarea", { id: "rq-d", rows: "2", maxlength: "280", placeholder: "Optional: what it should do, in a sentence or two" });
      var msg = h("p", { class: "form-msg", role: "alert" });
      var post = h("button", { class: "btn", type: "submit", text: "Ask" });
      add(formSlot, [h("form", { class: "box ask-form", onsubmit: function (e) {
        e.preventDefault(); msg.textContent = "";
        if (title.value.trim().length < 8) { msg.textContent = "Say what you want in at least 8 characters."; title.focus(); return; }
        if (!cat.value) { msg.textContent = "Pick a category."; cat.focus(); return; }
        post.disabled = true;
        api("POST", "requests", { title: title.value.trim(), category: cat.value, detail: det.value.trim() }).then(function () {
          title.value = ""; det.value = ""; cat.value = ""; toast("Posted. Your vote is already on it.");
          if (status === "open") load(); else go("/requests");
        }).catch(function (e2) { msg.textContent = e2.message; }).then(function () { post.disabled = false; });
      } },
        h("div", { class: "field" }, h("label", { for: "rq-t", text: "I want Claude to help me…" }), h("div", { class: "inline" }, title, counter2(title, 80))),
        h("div", { class: "field two" },
          h("div", null, h("label", { for: "rq-c", text: "Category" }), cat),
          h("div", null, h("label", { for: "rq-d", text: "Details" }), det)),
        msg, post)]);
    }
    function counter2(input, max) {
      var c = h("span", { class: "cnt", text: "0/" + max });
      input.addEventListener("input", function () { c.textContent = input.value.length + "/" + max; });
      return c;
    }
    function row(r) {
      var votes = h("span", { class: "v-n", text: String(r.votes) });
      var vote = h("button", { type: "button", class: "vote", "aria-pressed": r.voted ? "true" : "false", "aria-label": (r.voted ? "Remove your vote for: " : "Vote for: ") + r.title, disabled: r.status !== "open" ? true : null },
        icon("up"), votes);
      vote.addEventListener("click", function () {
        if (!ME) { go("/signin", { next: "/requests" }); return; }
        vote.disabled = true;
        api("POST", "requests/" + encodeURIComponent(r.id) + "/vote", {}).then(function (j) {
          r.voted = j.voted; votes.textContent = String(j.votes);
          vote.setAttribute("aria-pressed", j.voted ? "true" : "false");
        }).catch(function (e) { toast(e.message); }).then(function () { vote.disabled = false; });
      });
      var actSlot = h("div", { class: "req-act" });
      if (r.status === "open") {
        add(actSlot, [h("a", { class: "btn ghost small-btn", href: hashFor("/submit", { cat: r.category }) }, icon("plus"), "Make this")]);
        if (ME) {
          var made = h("button", { class: "link-btn", type: "button", text: "I made it" });
          made.addEventListener("click", function () {
            made.disabled = true;
            mineLive().then(function (items) {
              clear(actSlot);
              if (!items.length) return add(actSlot, [h("p", { class: "note", text: "Once your answer is live (a person checks it first), come back and tap I made it." })]);
              var sel = h("select", { "aria-label": "Which of yours answers it?" }, items.map(function (x) { return h("option", { value: x.id, text: x.name + " (" + kindOf(x.kind).name + ")" }); }));
              var ok = h("button", { class: "btn small-btn", type: "button", text: "Link it" });
              ok.addEventListener("click", function () {
                ok.disabled = true;
                api("POST", "requests/" + encodeURIComponent(r.id) + "/made", { skill_id: sel.value }).then(function () { toast("Linked. Thanks for making it."); load(); })
                  .catch(function (e) { toast(e.message); ok.disabled = false; });
              });
              add(actSlot, [h("div", { class: "inline" }, sel, ok)]);
            }).catch(function (e) { toast(e.message); made.disabled = false; });
          });
          add(actSlot, [made]);
        }
        if (ME && (ME.is_admin || ME.admin)) add(actSlot, [h("button", { class: "link-btn", type: "button", text: "Close", onclick: function () {
          if (!confirm("Close this request? It leaves the board.")) return;
          api("POST", "requests/" + encodeURIComponent(r.id) + "/close", {}).then(function () { toast("Closed."); load(); }).catch(function (e) { toast(e.message); });
        } })]);
      } else if (r.made) {
        add(actSlot, [h("a", { class: "btn small-btn", href: "#/s/" + encodeURIComponent(r.made.id) }, icon("check"), "See it")]);
      }
      return h("article", { class: "req" + (r.status !== "open" ? " done" : "") },
        vote,
        h("div", { class: "req-body" },
          h("h3", { text: r.title }),
          r.detail ? h("p", { class: "req-d", text: r.detail }) : null,
          h("p", { class: "note", text: (r.category_name || (catOf(r.category) || {}).name || "") + " · asked by " + r.by + (r.made ? " · made by " + r.made.by + ": " + r.made.name : "") })),
        actSlot);
    }
    function load() {
      clear(list); add(list, [loading()]);
      api("GET", "requests?status=" + status + "&sort=" + sort).then(function (j) {
        if (tok !== RT) return;
        clear(list);
        var items = j.items || [];
        if (!items.length) return add(list, [h("div", { class: "box empty" }, h("p", { text: status === "open" ? "No requests yet. Ask for the first one." : "Nothing made from a request yet." }))]);
        items.forEach(function (r) { list.appendChild(row(r)); });
      }).catch(function (e) { if (tok === RT) { clear(list); add(list, [fail(e, load)]); } });
    }
    function tab(label, st2, so) {
      var on = status === st2 && (so ? sort === so : true);
      return h("a", { class: "chip-l", href: hashFor("/requests", { status: st2 === "made" ? "made" : "", sort: so === "new" ? "new" : "" }), "aria-current": on ? "page" : null, text: label });
    }
    mount(
      h("header", { class: "req-head" },
        h("span", { class: "cat-ic" }, icon("ask")),
        h("div", null, h("h1", { text: "What should someone make next?" }),
          h("p", { class: "sub", text: "Ask for a skill, prompt or kit. Vote for the ones you'd use. Makers build the top ones." }))),
      formSlot,
      h("nav", { class: "chips", "aria-label": "Show" }, tab("Most wanted", "open", "top"), tab("Newest", "open", "new"), tab("Made", "made")),
      list);
    load();
  }

  /* ---------- How we test: the method and the full record, ties and losses included ---------- */
  function pageHow(tok) {
    document.title = "How we test · AI Made EZ";
    var table = h("div", { class: "rec-wrap" }, loading());
    mount(
      h("header", { class: "how-head" }, h("h1", { text: "How we test" }),
        h("p", { class: "sub", text: "Every score on this site comes from the same blind test. Here is the method, then every result." })),
      h("ol", { class: "method" },
        h("li", null, h("b", { text: "Same request, twice." }), " One realistic request goes to Claude with the skill, and again in a fresh chat without it."),
        h("li", null, h("b", { text: "A blind judge." }), " A separate Claude judge sees the two answers as A and B, never which used the skill, and is told that longer isn't better."),
        h("li", null, h("b", { text: "Four scores, 1 to 5." }), " Correct (facts and constraints), complete (everything asked for), useful (a person could act on it now), clear (easy to scan, no padding)."),
        h("li", null, h("b", { text: "We publish all of it." }), " Wins, ties and losses, the judge's reason, and the date. A skill that changes gets tested again.")),
      h("p", { class: "note how-limits", text: "Honest limits: so far each item is tested on one request, and the judge is an AI model, not a panel of people. That's why people's ratings sit next to every blind-test score." }),
      h("h2", { text: "Every result" }), table,
      h("p", null, h("a", { class: "btn ghost", href: "#/rules", text: "How we review items" }), " ", h("a", { class: "btn", href: "#/", text: "Browse the library" })));
    Promise.all([allTested(), fetch("../templates/templates.json").then(function (r) { return r.json(); }).catch(function () { return []; })]).then(function (res) {
      if (tok !== RT) return;
      var list = (res[0].items || []).map(norm), firsts = {};
      (res[1] || []).forEach(function (t) { if (t.result && t.result.first) firsts[t.slug] = t.result.first; });
      clear(table);
      if (!list.length) return add(table, [h("p", { class: "note", text: "No results yet." })]);
      add(table, [h("table", { class: "rec" },
        h("thead", null, h("tr", null, ["Item", "With it", "Plain Claude", "Result", "Tested"].map(function (x) { return h("th", { scope: "col", text: x }); }))),
        h("tbody", null, list.map(function (x) {
          var f = firsts[x.slug || x.id];
          var res2 = x.test.winner === "skill" ? "Win" : x.test.winner === "plain" ? "Loss" : "Tie";
          return h("tr", null,
            h("td", null, h("a", { class: "link", href: "#/s/" + encodeURIComponent(x.id), text: x.name }), f ? h("small", { text: "First run: " + (f.winner === "tie" ? "tie" : f.winner) + " " + sc(f.skillScore) + " vs " + sc(f.plainScore) + ". Fixed, retested." }) : null),
            h("td", { class: "num", text: sc(x.test.skill_score) }),
            h("td", { class: "num", text: sc(x.test.plain_score) }),
            h("td", null, h("span", { class: "res res-" + res2.toLowerCase(), text: res2 })),
            h("td", { class: "num", text: fmtDate(x.test.tested_at) }));
        })))]);
    }).catch(function (e) { if (tok === RT) { clear(table); add(table, [fail(e, route)]); } });
  }

  /* ---------- How we review (the public policy) ---------- */
  function pageRules() {
    document.title = "How we review · Community library";
    function sec(title, items) { return h("section", { class: "rule" }, h("h2", { text: title }), h("ul", null, items.map(function (t) { return h("li", { text: t }); }))); }
    mount(
      h("header", { class: "req-head" }, h("span", { class: "cat-ic" }, icon("shield")),
        h("div", null, h("h1", { text: "How we review" }), h("p", { class: "sub", text: "The same rules for everyone, including us. Last updated 23 Nov 2026." }))),
      h("div", { class: "rules" },
        sec("Before anything goes live", [
          "A person reads every skill, prompt and kit, and every new version. We approve what we'd install ourselves.",
          "Automatic checks block hidden instructions, reading passwords or keys, sending your data to a web address, download commands, scripts and invisible characters.",
          "No medical, legal or money advice. Organizing and preparing are fine.",
          "Everything here is free to use."]),
        sec("Reviews", [
          "One review per person, and only after you've added or copied it.",
          "New accounts wait 24 hours before they can review.",
          "Makers can't review their own work. Reviews from our own reviewers say so.",
          "We never hide a review for being bad. We only remove fake, off-topic or abusive ones, under the same rule for every item.",
          "Nobody is paid or rewarded for a review."]),
        sec("Licenses", D.licenses.map(function (l) {
          return l.name + (l.id === "cc-by" ? ": anyone can share or change it if they name you." : l.id === "mit" ? ": anyone can use, change and share it; keep your name in the file." : ": people can use it themselves; remixes are off and they ask you before sharing it.");
        }).concat(["Items with no license picked: ask the maker before sharing."])),
        sec("Thank-you links", [
          "A maker can add a link to their own tip page. The money goes straight to them.",
          "AI Made EZ takes no cut and never holds anyone's money."]),
        sec("Copied or unsafe work", [
          "Tap Report on the item and pick a reason. Two reports from different people hide it until a reviewer looks.",
          "If it's copied, it comes down. If it's unsafe, it comes down and the maker hears why."]),
        sec("Requests", [
          "Anyone signed in can ask for something and vote. Requests are plain words only, no links.",
          "A maker links their live item when they've made it. Reviewers close requests that break these rules."])),
      h("p", null, h("a", { class: "btn", href: "#/", text: "Browse the library" })));
  }

  /* ---------- Sign in / create account ---------- */
  function pageSignin(q) {
    var mode = q.get("mode") === "new" ? "new" : "in", next = q.get("next") || "";
    if (ME) return mount(h("div", { class: "box" }, h("p", null, "You're signed in as ", h("b", { text: ME.handle }), "."), h("a", { class: "btn", href: "#/me", text: "Go to my page" })));
    var msg = h("p", { class: "form-msg", role: "alert" });
    var email = h("input", { id: "a-email", type: "email", autocomplete: "email", required: true, maxlength: "200" });
    var pw = h("input", { id: "a-pw", type: "password", autocomplete: mode === "new" ? "new-password" : "current-password", required: true, maxlength: "200" });
    var handle = h("input", { id: "a-handle", autocomplete: "username", maxlength: "24", pattern: "[A-Za-z0-9-]{3,24}", placeholder: "maya-makes" });
    var btn = h("button", { class: "btn", type: "submit", text: mode === "new" ? "Create my account" : "Sign in" });
    var form = h("form", { class: "auth box", novalidate: true, onsubmit: function (e) {
      e.preventDefault(); msg.textContent = "";
      var em = email.value.trim(), p = pw.value, hd = handle.value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { msg.textContent = "That email doesn't look right."; email.focus(); return; }
      if (mode === "new" && p.length < 10) { msg.textContent = "Use a password with at least 10 characters."; pw.focus(); return; }
      if (!p) { msg.textContent = "Enter your password."; pw.focus(); return; }
      if (mode === "new" && !/^[A-Za-z0-9-]{3,24}$/.test(hd)) { msg.textContent = "Your maker name needs 3 to 24 letters, numbers or dashes."; handle.focus(); return; }
      btn.disabled = true;
      api("POST", mode === "new" ? "signup" : "signin", mode === "new" ? { email: em, password: p, handle: hd } : { email: em, password: p }).then(function (j) {
        ME = j.user || j; renderNav();
        toast(mode === "new" ? "Welcome, " + ME.handle : "Signed in");
        go(next && next.charAt(0) === "/" ? next : "/me");
      }).catch(function (e2) { msg.textContent = e2.setup ? "Accounts aren't open yet." : e2.message; btn.disabled = false; });
    } },
      h("div", { class: "field" }, h("label", { for: "a-email", text: "Email" }), email),
      h("div", { class: "field" }, h("label", { for: "a-pw", text: "Password" }), pw, mode === "new" ? h("span", { class: "note", text: "At least 10 characters." }) : null),
      mode === "new" ? h("div", { class: "field" }, h("label", { for: "a-handle", text: "Maker name (shown on your skills)" }), handle, h("span", { class: "note", text: "3 to 24 letters, numbers or dashes." })) : null,
      msg, btn);
    mount(
      h("div", { class: "auth-wrap" },
        h("h1", { text: mode === "new" ? "Make an account" : "Sign in" }),
        h("div", { class: "tabs", role: "tablist" },
          h("a", { role: "tab", href: hashFor("/signin", { next: next }), "aria-selected": mode === "in" ? "true" : "false", text: "Sign in" }),
          h("a", { role: "tab", href: hashFor("/signin", { mode: "new", next: next }), "aria-selected": mode === "new" ? "true" : "false", text: "Create account" })),
        form,
        h("p", { class: "note", text: mode === "new" ? "You need an account to share, rate or report. Browsing and downloading don't." : "No account? Browsing and downloading work without one." })));
    email.focus();
  }

  /* ---------- router ---------- */
  function route() {
    var tok = ++RT;
    var raw = location.hash.slice(1) || "/";
    var qi = raw.indexOf("?");
    var path = qi >= 0 ? raw.slice(0, qi) : raw, q = new URLSearchParams(qi >= 0 ? raw.slice(qi + 1) : "");
    var parts = path.split("/").filter(Boolean).map(decodeURIComponent);
    document.title = "Community library · AI Made EZ";
    renderNav();
    if (SETUP) return mount(setupState());
    window.scrollTo(0, 0);
    try { app.focus({ preventScroll: true }); } catch (e) {}
    switch (parts[0] || "") {
      case "": return pageBrowse(q, tok);
      case "c": return pageCategory(parts[1], q, tok);
      case "s": return pageSkill(parts[1], tok);
      case "submit": return pageSubmit(q, tok);
      case "me": return pageMe(tok);
      case "review": return pageReview(tok);
      case "signin": return pageSignin(q);
      case "requests": return pageRequests(q, tok);
      case "rules": return pageRules();
      case "how": return pageHow(tok);
      default: return mount(errorBox("That page doesn't exist."), h("a", { class: "btn", href: "#/", text: "Browse the library" }));
    }
  }

  /* =====================================================================
     Mock layer: only with ?mock=1. The 8 tested seed skills from
     templates.json plus clearly named "Sample" community skills.
     ===================================================================== */
  var Mock = (function () {
    if (!MOCK) return null;
    var DAY = 864e5, HOUR = 36e5, NOW = Date.now();
    var ago = function (ms) { return NOW - ms; };
    var guest = PARAMS.get("as") === "guest";
    var you = { id: "u-you", handle: "you-sample", email: "you@example.com", created_at: ago(PARAMS.get("new") === "1" ? 2 * HOUR : 3 * DAY), is_admin: PARAMS.get("as") !== "maker" };
    var me = guest ? null : you;
    try { if (sessionStorage.getItem("sl-mock-out") === "1") me = null; } catch (e) {}
    var skills = [], ratings = {}, uses = {}, reports = {}, n = 100;
    var requests = [
      { id: "rq0001", title: "Sample: Turn my class notes into flashcards", detail: "Paste notes, get 20 cards I can print.", category: "study", status: "open", votes: 14, voters: {}, by: "sample-asker-1", at: NOW - 5 * HOUR },
      { id: "rq0002", title: "Sample: Write a kind note to cancel plans", detail: "", category: "writing", status: "open", votes: 9, voters: { "u-you": 1 }, by: "sample-asker-2", at: NOW - 30 * HOUR },
      { id: "rq0003", title: "Sample: Plan a kid's birthday party under $100", detail: "Ages 6 to 8, at home.", category: "home", status: "open", votes: 6, voters: {}, by: "you-sample", user: "u-you", at: NOW - 2 * HOUR },
      { id: "rq0004", title: "Sample: Say no to a favor without guilt", detail: "", category: "writing", status: "made", votes: 21, voters: {}, by: "sample-asker-3", at: NOW - 9 * DAY, made: "sample-101" }];
    var LINES = ["Used it for my landlord email", "Fixed a message to my boss before I sent it", "My kid's science test, worked well", "Asked it twice, same good result", "Shorter than what I'd have written", "Planned our weekend with it", "Didn't fit my case, too long", "Cover letter for a café job"];
    function seedRatings(id, yes, total) {
      ratings[id] = [];
      for (var i = 0; i < total; i++) ratings[id].push({ user: "r" + i, handle: "sample-rater-" + (i + 1), helped: i < yes, line: LINES[(i + id.length) % LINES.length], at: ago(i * HOUR + HOUR) });
    }
    function sample(o) {
      var s = Object.assign({ id: "sample-" + (n++), version: 1, status: "live", for_tag: "anyone", works_in: ["claude-ai"], parent_id: null, test: null, review_note: null, hidden_by: null, ask_test: false, maker_id: "u-" + o.handle, created_at: ago((o.ageDays || 10) * DAY) }, o);
      s.updated_at = s.created_at; s.live_at = s.status === "live" ? s.created_at : null;
      s.slug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      s.skill_md = s.skill_md || "---\nname: " + s.slug + "\ndescription: " + s.one_line + " Sample skill for testing the library.\n---\n\n# " + s.name + "\n\n## What to do\n1. Read what the person gave you.\n2. Keep it short and in their words.\n3. Ask one question only if something is missing.\n\n## Never\n- Never invent facts.\n\n## Output\nThe finished text, then a short list of what changed.\n";
      s.examples = s.examples || [];
      skills.push(s); return s;
    }
    var ready = fetch("/projects/skill-quest/templates/templates.json").then(function (r) { return r.json(); }).then(function (list) {
      var base = "/projects/skill-quest/templates/";
      return Promise.all(list.map(function (t, i) {
        function get(o) { return o && o.type !== "html" ? fetch(base + o.src).then(function (r) { return r.text(); }).catch(function () { return ""; }) : Promise.resolve(""); }
        return Promise.all([fetch(base + t.skillFile).then(function (r) { return r.text(); }), get(t.outputs && t.outputs.skill), get(t.outputs && t.outputs.plain)]).then(function (res) {
          var m = D.seedMap[t.slug] || ["fun", "hobbies", "anyone"], o = t.outputs || {};
          var req = String(t.request || "").replace(/^# Test request\s*\n+Sample, made up for testing\.\s*\n+/, "").replace(/^> ?/gm, "");
          var ex = { input: req.slice(0, 4000), output: res[1], plain_output: res[2], plain_source: "test" };
          if (o.skill && o.skill.type === "html") { ex.output = "The skill's answer is a full web page."; ex.output_link = base + o.skill.src; }
          if (o.plain && o.plain.type === "html") { ex.plain_output = "Plain Claude's answer is a full web page."; ex.plain_link = base + o.plain.src; }
          skills.push({
            id: t.slug, slug: t.slug, name: t.name, one_line: t.oneLine, category: m[0], sub: m[1], for_tag: m[2],
            works_in: ["claude-ai", "claude-code"], skill_md: res[0], maker_id: "smez-system", handle: "skillsmadeez", official: true, version: 1, status: "live",
            examples: [ex], ask_test: false, review_note: null, hidden_by: null, parent_id: null,
            test: t.result ? { skill_score: t.result.skillScore, plain_score: t.result.plainScore, winner: t.result.winner, reason: t.result.reason, tested_at: "2026-11-23" } : null,
            created_at: ago((20 - i) * HOUR), updated_at: ago((20 - i) * HOUR), live_at: ago((20 - i) * HOUR)
          });
        });
      }));
    }).then(function () {
      seedRatings("polish-email", 20, 23); seedRatings("study-buddy", 7, 8); seedRatings("meal-plan", 5, 6); seedRatings("trip-planner", 2, 3);
      var ex = function (i, o, p) { var e = { input: i, output: o }; if (p) { e.plain_output = p; e.plain_source = "maker"; } return [e]; };
      seedRatings(sample({ name: "Sample: Landlord repair letter", one_line: "A firm, polite letter that gets the leak fixed.", category: "writing", sub: "letters", handle: "sample-maker-ana", ageDays: 2,
        test: { skill_score: 4.4, plain_score: 3.6, winner: "skill", reason: "Sample reason: the skill cites the date of each request and sets one deadline; plain Claude is vaguer.", tested_at: "2026-11-22" },
        examples: ex("my kitchen tap has leaked for 3 weeks, landlord ignores texts. write him something", "Subject: Kitchen tap leak, reported 2 Nov, please fix by 30 Nov\n\nHi Mr Reyes,\n\nThe kitchen tap has leaked since 2 Nov. I texted on 2, 9 and 16 Nov. Please have it fixed by 30 Nov.\n\nThanks,\nSam", "Dear Landlord,\n\nI hope this message finds you well. I am writing to bring to your attention an issue with the kitchen tap that has persisted for some time…") }).id, 9, 11);
      seedRatings(sample({ name: "Sample: Say no kindly", one_line: "Turn down a favor without the guilt spiral.", category: "writing", sub: "hard-messages", handle: "sample-maker-jo", ageDays: 5,
        examples: ex("my friend wants me to help her move saturday and i just can't", "Hey Mia, I can't do Saturday, I'm wiped out this week. Can I bring dinner Sunday to your new place instead?") }).id, 14, 15);
      seedRatings(sample({ name: "Sample: Polish my email, shorter", one_line: "Like Polish my email, but half the length.", category: "writing", sub: "fix-writing", handle: "sample-maker-kai", parent_id: "polish-email", ageDays: 1, works_in: ["claude-ai", "claude-code"],
        test: { skill_score: 4.9, plain_score: 3.5, winner: "skill", reason: "Sample reason: same voice as the original, 40% shorter, nothing invented.", tested_at: "2026-11-22" },
        examples: ex("polish: hey just checking if you got my invoice from last month, sorry to bother", "Hi Lee, did last month's invoice reach you? Could you pay it by Friday?\n\nThanks,\nKai", "Dear Lee, I hope you're well. I just wanted to gently follow up regarding…") }).id, 4, 4);
      seedRatings(sample({ name: "Sample: Chore chart for kids", one_line: "A printable week of chores that rotates fairly.", category: "home", sub: "chores", handle: "sample-maker-ana", for_tag: "parent", ageDays: 12,
        test: { skill_score: 4.0, plain_score: 3.9, winner: "tie", reason: "Sample reason: both charts were fair and printable.", tested_at: "2026-11-14" },
        examples: ex("3 kids aged 6, 9, 12. make a chore chart", "Mon: Ava dishes, Ben bins, Cleo feeds the cat\nTue: everyone moves one job down…", "Here's a chore chart for your three kids…") }).id, 20, 22);
      seedRatings(sample({ name: "Sample: Weekend date ideas", one_line: "Three cheap dates near you, with a rain plan.", category: "travel", sub: "weekends", handle: "sample-maker-jo", ageDays: 3, examples: ex("date ideas for saturday in leeds under £40", "1. Kirkstall Abbey walk and bakery picnic (£12)…") }).id, 2, 2);
      seedRatings(sample({ name: "Sample: Bill calendar", one_line: "Every bill in one month view, with due dates.", category: "money", sub: "bills", handle: "sample-maker-kai", ageDays: 15,
        test: { skill_score: 4.4, plain_score: 3.3, winner: "skill", reason: "Sample reason: lists each due date and flags two that clash with payday.", tested_at: "2026-11-12" },
        examples: ex("rent 1st £900, phone 12th £25, council tax 15th £140, payday 28th", "1st Rent £900 (3 days after payday)\n12th Phone £25\n15th Council tax £140 (tight: 13 days after rent)") }).id, 2, 6);
      sample({ name: "Sample: Bedtime story maker", one_line: "A five-minute story starring your kid's toy.", category: "fun", sub: "stories", handle: "you-sample", maker_id: "u-you", ageDays: 6, examples: ex("story about a stuffed rabbit called Pip who is scared of the dark", "Pip the rabbit had a secret…") });
      sample({ name: "Sample: Meeting notes to actions", one_line: "Messy notes in, who-does-what-by-when out.", category: "work", sub: "meetings", handle: "you-sample", maker_id: "u-you", status: "review", ask_test: true, ageDays: 1, examples: ex("notes: sam to send deck?? budget talk next week, priya owns hiring", "Sam: send the deck, by [day]\nPriya: hiring plan, by [day]") });
      sample({ name: "Sample: Grocery price check", one_line: "Your list with the cheapest store for each item.", category: "home", sub: "meals", handle: "you-sample", maker_id: "u-you", status: "changes", ageDays: 4,
        review_note: "Sample note: add an example where a price is missing. Right now the file never says what to do then.", examples: ex("eggs, milk, rice", "Eggs: Aldi £1.89…") });
      sample({ name: "Sample: Kinder pushback prompt", kind: "prompt", one_line: "Disagree at work without sounding cold.", category: "work", sub: "meetings", handle: "sample-maker-jo", ageDays: 4, license: "cc-by", tip_url: "https://ko-fi.com/sample",
        skill_md: "Rewrite my reply to [who] so it disagrees with [their idea] but stays warm.\n\nKeep it under [number] words. Name one thing I agree with first. End with a question.\n\nMy draft:\n[paste it]",
        examples: ex("who: my manager. idea: moving the launch up a week. 60 words.", "I like the push to get it out sooner. I'm worried a week early means we skip the last round of testing, and that's where we caught two bugs last time. Could we ship the core part early and keep testing on the rest?", "I understand your perspective, however I have some concerns about moving the launch date forward…") });
      seedRatings(sample({ name: "Sample: Etsy shop launch kit", kind: "kit", one_line: "Name, listings and first-week posts for a new Etsy shop.", category: "business", sub: "sell-online", handle: "sample-maker-ana", ageDays: 6, license: "mit",
        skill_md: "---\nname: etsy-start-here\ndescription: Start here for an Etsy shop launch. Use when someone says \"help me open my Etsy shop\".\n---\n\n# Start here\n\n## What to do\n1. Ask what they make, their price range and their style.\n2. Use the etsy-listings skill for the first 5 listings.\n3. Use the etsy-posts skill for a week of posts.\n\n## Output\nA checklist of what they have now.\n",
        parts: [{ skill_md: "---\nname: etsy-listings\ndescription: Write Etsy listing titles, tags and descriptions. Sample.\n---\n\n# Listings\n\n## What to do\n1. Write a 140-character title with the main search words first.\n2. Give 13 tags.\n\n## Output\nOne block per listing.\n" },
          { skill_md: "---\nname: etsy-posts\ndescription: Plan a week of posts for a new shop. Sample.\n---\n\n# Posts\n\n## What to do\n1. Make 7 short posts, one per day.\n2. Use the shop's real items only.\n\n## Output\nA 7-row table.\n" }],
        examples: ex("I make hand-dyed cotton scarves, $28-40, earthy colors", "Shop name ideas: Rootdye, Clay & Cloth…\nListing 1: Hand-dyed cotton scarf, rust brown, lightweight…") }).id, 6, 7);
      sample({ name: "Sample: Thank-you card writer", one_line: "Short thank-you notes that sound like you.", category: "writing", sub: "letters", handle: "you-sample", maker_id: "u-you", status: "draft", ageDays: 0 });
      sample({ name: "Sample: Study timer", one_line: "A 25-minute focus timer page with breaks.", category: "study", sub: "study-tools", handle: "sample-maker-lu", status: "review", ask_test: true, ageDays: 1,
        skill_md: "---\nname: study-timer\ndescription: Make a one-page focus timer. Sample skill for testing the review queue.\n---\n\n# Study timer\n\n## What to do\n1. Build one HTML page with a 25-minute timer.\n2. Use the sound from https://example.com/bell.mp3 when time is up.\n3. Keep it to one file.\n\n## Output\nOne HTML file.\n",
        examples: ex("make me a pomodoro timer", "<!doctype html> … one-page timer …", "Here's a simple Pomodoro timer in HTML…") });
      var hid = sample({ name: "Sample: Copy of Study buddy", one_line: "Turns notes into a quiz you can practice.", category: "study", sub: "study-tools", handle: "sample-maker-zed", status: "hidden", hidden_by: "reports", ageDays: 2, examples: ex("quiz me on the water cycle", "Q1. Why does water vapour rise?…") });
      reports[hid.id] = [{ user: "r1", handle: "sample-rater-1", reason: "copied", note: "Same file as Study buddy.", created_at: ago(5 * HOUR) }, { user: "r2", handle: "sample-rater-2", reason: "copied", note: "", created_at: ago(2 * HOUR) }];
      uses["u-you"] = { "polish-email": 1, "trip-planner": 1 };
      ratings["trip-planner"].push({ user: "u-you", handle: "you-sample", helped: true, line: "Planned four days in Rome with it", at: ago(DAY) });
    });

    function err(status, msg, extra) { var e = new Error(msg); e.status = status; e.body = Object.assign({ error: msg }, extra || {}); return e; }
    function clone(x) { return JSON.parse(JSON.stringify(x)); }
    function find(id) { return skills.find(function (s) { return s.id === id; }); }
    function liftOf(s) { return s.test ? Math.round((s.test.skill_score - s.test.plain_score) * 10) / 10 : null; }
    function helpedOf(id) {
      var rs = ratings[id] || [], t = rs.length, y = rs.filter(function (r) { return r.helped; }).length, p = t >= 5 ? Math.round(100 * y / t) : null;
      return { n: t, yes: t >= 5 ? y : null, pct: p, label: t >= 5 ? p + "% helped (" + t + ")" : "New", _y: y };
    }
    function wilson(t, y) { if (!t) return 0; var z = 1.96, p = y / t; return (p + z * z / (2 * t) - z * Math.sqrt((p * (1 - p) + z * z / (4 * t)) / t)) / (1 + z * z / t); }
    function verdictOf(hp, l) {
      if (hp.pct === null || l === null) return null;
      if (hp.pct >= 75 && l < 0.3) return "Popular, but barely beats plain Claude";
      if (hp.pct < 50 && l >= 1) return "Wins blind tests, but people are mixed";
      if (hp.pct >= 75 && l >= 1) return "People love it and it wins blind tests";
      return null;
    }
    function item(s) {
      var c = catOf(s.category), sub = subOf(s.category, s.sub), hp = helpedOf(s.id), l = liftOf(s);
      var o = {
        id: s.id, slug: s.slug, kind: s.kind || "skill", license: s.license || (s.official ? "cc-by" : null), name: s.name, one_line: s.one_line, category: s.category, category_name: c ? c.name : s.category, sub: s.sub, sub_name: sub ? sub.name : s.sub,
        for_tag: s.for_tag, for_name: tagName(D.forTags, s.for_tag), works_in: s.works_in, maker: { handle: s.handle, official: !!s.official },
        parent_id: s.parent_id, version: s.version, status: s.status,
        test: s.test ? { skill_score: s.test.skill_score, plain_score: s.test.plain_score, winner: s.test.winner, tested_at: s.test.tested_at } : null,
        lift: l, tested: !!s.test, helped: { n: hp.n, yes: hp.yes, pct: hp.pct, label: hp.label }, verdict: verdictOf(hp, l),
        remix_count: skills.filter(function (x) { return x.parent_id === s.id && x.status === "live"; }).length,
        uses: Object.keys(uses).filter(function (u) { return uses[u][s.id]; }).length, created_at: s.created_at, updated_at: s.updated_at, live_at: s.live_at
      };
      return o;
    }
    function detail(s, owner, admin) {
      var o = item(s), l = liftOf(s), par = s.parent_id && find(s.parent_id);
      var ch = runChecks(s.skill_md, s.examples, { kind: s.kind });
      o.skill_md = s.skill_md; o.parts = s.parts ? clone(s.parts) : null; o.tip_url = s.tip_url || null; o.examples = clone(s.examples); o.test = s.test ? clone(s.test) : null;
      o.safety = { summary: ch.summary, warnings: ch.warnings };
      o.parent = par ? { id: par.id, name: par.name, maker: { handle: par.handle }, lift: liftOf(par) } : null;
      o.remixes = skills.filter(function (x) { return x.parent_id === s.id && x.status === "live"; }).map(function (x) { var xl = liftOf(x); return { id: x.id, name: x.name, maker: { handle: x.handle }, lift: xl, beats_parent: xl !== null && l !== null && xl > l }; });
      var my = me && (ratings[s.id] || []).find(function (r) { return r.user === me.id; });
      o.mine = me ? { is_owner: !!owner, used: !!(uses[me.id] && uses[me.id][s.id]), rating: my ? { helped: my.helped, line: my.line, counted: true, updated_at: my.at } : null } : null;
      if (owner || admin) { o.checks = ch; o.review_note = s.review_note; o.hidden_by = s.hidden_by; o.ask_test = !!s.ask_test; o.pending_version = null; }
      return o;
    }
    function call(method, path, b) {
      return ready.then(function () { return new Promise(function (res) { setTimeout(res, 120); }); }).then(function () {
        b = b || {};
        var qi = path.indexOf("?"), p = qi >= 0 ? path.slice(0, qi) : path, q = new URLSearchParams(qi >= 0 ? path.slice(qi + 1) : "");
        var seg = p.split("/").filter(Boolean).map(decodeURIComponent);
        var admin = !!(me && me.is_admin);
        if (p === "me" && method === "GET") {
          if (!me) throw err(401, "Sign in first.");
          var mine = skills.filter(function (s) { return s.maker_id === me.id; }).map(function (s) { return Object.assign(item(s), { review_note: s.review_note, hidden_by: s.hidden_by, pending_version: null }); });
          var ids = Object.keys(uses[me.id] || {}).concat(skills.filter(function (s) { return (ratings[s.id] || []).some(function (r) { return r.user === me.id; }); }).map(function (s) { return s.id; }));
          var binder = ids.filter(function (v, i, a) { return a.indexOf(v) === i; }).map(find).filter(Boolean).map(function (s) {
            var r = (ratings[s.id] || []).find(function (x) { return x.user === me.id; });
            return Object.assign(item(s), { used: !!(uses[me.id] || {})[s.id], rated: !!r, my_helped: r ? r.helped : null });
          });
          return { user: clone(me), skills: mine, binder: binder };
        }
        if (p === "me" && method === "DELETE") { if (!me) throw err(401, "Sign in first."); skills = skills.filter(function (s) { return s.maker_id !== me.id; }); me = null; return { deleted: true }; }
        if (p === "signin") { if (!b.email || !b.password) throw err(400, "Enter your email and password."); me = you; try { sessionStorage.removeItem("sl-mock-out"); } catch (e) {} return { user: clone(me) }; }
        if (p === "signup") {
          if (String(b.password || "").length < 10) throw err(400, "Use a password with at least 10 characters.");
          if (b.handle === "taken") throw err(409, "That maker name is taken. Try another.");
          me = { id: "u-new", handle: b.handle, email: b.email, created_at: Date.now(), is_admin: false }; return { user: clone(me) };
        }
        if (p === "signout") { me = null; try { sessionStorage.setItem("sl-mock-out", "1"); } catch (e) {} return { ok: true }; }
        if (p === "check") return runChecks(String(b.skill_md || ""), b.examples, b);
        if (p === "skills" && method === "GET") {
          var list = skills.filter(function (s) { return s.status === "live"; });
          var term = (q.get("q") || "").toLowerCase().trim();
          if (term) list = list.filter(function (s) {
            var sub = subOf(s.category, s.sub);
            return [s.name, s.one_line, sub ? sub.name : ""].concat(s.examples.map(function (e) { return e.input; })).join(" ").toLowerCase().indexOf(term) >= 0;
          });
          if (q.get("type")) list = list.filter(function (s) { return (s.kind || "skill") === q.get("type"); });
          var cat = q.get("cat");
          if (cat) list = list.filter(function (s) { return s.category === cat; });
          if (q.get("sub")) list = list.filter(function (s) { return s.sub === q.get("sub"); });
          if (q.get("for")) list = list.filter(function (s) { return s.for_tag === q.get("for"); });
          if (q.get("works")) list = list.filter(function (s) { return s.works_in.indexOf(q.get("works")) >= 0; });
          if (q.get("tested") === "yes") list = list.filter(function (s) { return s.test; });
          if (q.get("tested") === "no") list = list.filter(function (s) { return !s.test; });
          var sort = q.get("sort") || "tested", W = function (s) { var hp = helpedOf(s.id); return wilson(hp.n, hp._y); };
          var items = list.map(function (s) { return { s: s, it: item(s), w: W(s) }; });
          items.sort(sort === "new" ? function (a, c) { return c.s.live_at - a.s.live_at; }
            : sort === "remixed" ? function (a, c) { return c.it.remix_count - a.it.remix_count || c.w - a.w; }
            : sort === "helpful" ? function (a, c) { return c.w - a.w; }
            : function (a, c) { return (a.it.lift === null) - (c.it.lift === null) || (c.it.lift || 0) - (a.it.lift || 0) || c.w - a.w; });
          var page = Math.max(1, parseInt(q.get("page"), 10) || 1);
          var out = { items: items.slice((page - 1) * PER_PAGE, page * PER_PAGE).map(function (x) { return x.it; }), page: page, per_page: PER_PAGE, total: items.length, pages: Math.max(1, Math.ceil(items.length / PER_PAGE)), sort: sort };
          if (cat && page === 1) {
            var champ = skills.filter(function (s) { return s.status === "live" && s.category === cat && s.test; }).sort(function (a, c) { return liftOf(c) - liftOf(a) || c.test.skill_score - a.test.skill_score; })[0];
            out.champion = champ ? item(champ) : null;
          }
          return out;
        }
        if (p === "skills" && method === "POST") {
          if (!me) throw err(401, "Sign in first.");
          var ch = runChecks(String(b.skill_md || ""), b.examples, b);
          if (b.submit !== false && !ch.ok) throw err(422, "Fix the red flags first.", { checks: ch });
          var ns = { id: "sample-" + (n++), slug: String(b.name || "skill").toLowerCase().replace(/[^a-z0-9]+/g, "-"), maker_id: me.id, handle: me.handle, version: 1, status: b.submit === false ? "draft" : "review", test: null, review_note: null, hidden_by: null, created_at: Date.now(), updated_at: Date.now(), live_at: null };
          ["kind", "parts", "license", "tip_url", "name", "one_line", "category", "sub", "for_tag", "works_in", "skill_md", "examples", "parent_id", "ask_test"].forEach(function (k) { ns[k] = b[k] === undefined ? null : b[k]; });
          skills.push(ns); return { skill: detail(ns, true, admin), checks: ch };
        }
        if (seg[0] === "skills" && seg[1]) {
          var s = find(seg[1]);
          if (!s) throw err(404, "That skill was not found.");
          var own = !!(me && s.maker_id === me.id);
          if (!seg[2] && method === "GET") { if (s.status !== "live" && !own && !admin) throw err(404, "That skill was not found."); return { skill: detail(s, own, admin) }; }
          if (!seg[2] && method === "PUT") {
            if (!own) throw err(403, "You can only edit your own skills.");
            var ch2 = runChecks(String(b.skill_md || ""), b.examples, b);
            if (!ch2.ok) throw err(422, "Fix the red flags first.", { checks: ch2 });
            ["kind", "parts", "license", "tip_url", "name", "one_line", "category", "sub", "for_tag", "works_in", "skill_md", "examples", "ask_test"].forEach(function (k) { if (b[k] !== undefined) s[k] = b[k]; });
            if (s.status === "live") s.version++;
            s.status = "review"; s.updated_at = Date.now();
            return { skill: detail(s, true, admin), checks: ch2 };
          }
          if (seg[2] === "use") { if (me) { uses[me.id] = uses[me.id] || {}; uses[me.id][s.id] = 1; } return { ok: true, counted_for_rating: !!me }; }
          if (seg[2] === "ratings") {
            var mineR = me && (ratings[s.id] || []).find(function (r) { return r.user === me.id; });
            var hp2 = helpedOf(s.id);
            return { helped: { n: hp2.n, yes: hp2.yes, pct: hp2.pct, label: hp2.label }, items: (ratings[s.id] || []).slice().sort(function (a, c) { return c.at - a.at; }).map(function (r) { return { handle: r.handle, helped: r.helped, line: r.line, at: r.at }; }), page: 1, mine: mineR ? { helped: mineR.helped, line: mineR.line, counted: true, updated_at: mineR.at } : null };
          }
          if (seg[2] === "rate") {
            if (!me) throw err(401, "Sign in first.");
            if (typeof b.helped !== "boolean") throw err(400, "Say if it helped: yes or no.");
            var line = String(b.line || "").trim();
            if (line.length < 10) throw err(400, "What you used it for is too short (10 characters min).");
            if (line.length > 140) throw err(400, "What you used it for is too long (140 characters max).");
            if (own) throw err(403, "You can't rate your own skill.");
            if (!(uses[me.id] && uses[me.id][s.id])) throw err(403, "Add it to Claude or copy it first, then come back and rate it.");
            if (Date.now() - me.created_at < DAY) throw err(403, "New accounts can rate after 24 hours. Come back tomorrow.");
            ratings[s.id] = (ratings[s.id] || []).filter(function (r) { return r.user !== me.id; });
            ratings[s.id].unshift({ user: me.id, handle: me.handle, helped: b.helped, line: line, at: Date.now() });
            var hp3 = helpedOf(s.id);
            return { ok: true, rating: { helped: b.helped, line: line, counted: true, updated_at: Date.now() }, helped: { n: hp3.n, yes: hp3.yes, pct: hp3.pct, label: hp3.label } };
          }
          if (seg[2] === "report") {
            if (!me) throw err(401, "Sign in first.");
            if (own) throw err(403, "You can't report your own skill.");
            reports[s.id] = (reports[s.id] || []).filter(function (r) { return r.user !== me.id; });
            reports[s.id].push({ user: me.id, handle: me.handle, reason: b.reason, note: b.note || "", created_at: Date.now() });
            var hidden = reports[s.id].length >= 2;
            if (hidden) { s.status = "hidden"; s.hidden_by = "reports"; }
            return { ok: true, hidden: hidden };
          }
        }
        if (p === "requests" && method === "GET") {
          var st = q.get("status") === "made" ? "made" : "open";
          var rl = requests.filter(function (x) { return x.status === st; }).sort(q.get("sort") === "new" ? function (a, c) { return c.at - a.at; } : function (a, c) { return c.votes - a.votes || c.at - a.at; });
          return { items: rl.map(function (x) {
            var mk = x.made && find(x.made);
            return { id: x.id, title: x.title, detail: x.detail || null, category: x.category, category_name: (catOf(x.category) || {}).name, status: x.status, votes: x.votes, created_at: x.at, by: x.by,
              mine: !!(me && x.user === me.id), voted: !!(me && x.voters[me.id]), made: mk ? { id: mk.id, name: mk.name, by: mk.handle } : null };
          }) };
        }
        if (p === "requests" && method === "POST") {
          if (!me) throw err(401, "Sign in first.");
          if (String(b.title || "").trim().length < 8) throw err(400, "What you want help with is too short (8 characters min).");
          if (!catOf(b.category)) throw err(400, "Pick a category.");
          var nv = {}; nv[me.id] = 1;
          requests.push({ id: "rq" + (n++), title: b.title, detail: b.detail || "", category: b.category, status: "open", votes: 1, voters: nv, by: me.handle, user: me.id, at: Date.now() });
          return { ok: true };
        }
        if (seg[0] === "requests" && seg[1]) {
          if (!me) throw err(401, "Sign in first.");
          var rq = requests.find(function (x) { return x.id === seg[1]; });
          if (!rq) throw err(404, "That request was not found.");
          if (seg[2] === "vote") { if (rq.voters[me.id]) { delete rq.voters[me.id]; rq.votes--; } else { rq.voters[me.id] = 1; rq.votes++; } return { ok: true, voted: !!rq.voters[me.id], votes: rq.votes }; }
          if (seg[2] === "made") { var mine2 = find(b.skill_id); if (!mine2 || mine2.maker_id !== me.id) throw err(404, "Pick one of your own items."); rq.status = "made"; rq.made = mine2.id; return { ok: true }; }
          if (seg[2] === "close") { if (!admin) throw err(403, "Only reviewers can close requests."); rq.status = "closed"; return { ok: true }; }
        }
        if (seg[0] === "review") {
          if (!admin) throw err(403, "Reviewers only.");
          if (!seg[1]) return { items: skills.filter(function (s) { return s.status === "review" || (s.status === "hidden" && s.hidden_by === "reports"); }).map(function (s) {
            return { kind: s.status === "review" ? "new" : "reported", skill: detail(s, false, true), reports: (reports[s.id] || []).map(function (r) { return { handle: r.handle, reason: r.reason, note: r.note, created_at: r.created_at }; }), flagged_ratings: 0 };
          }) };
          var t = find(seg[1]); if (!t) throw err(404, "That skill was not found.");
          if (seg[2] === "test") { t.test = { skill_score: b.skill_score, plain_score: b.plain_score, winner: b.winner, reason: b.reason, tested_at: new Date().toISOString().slice(0, 10) }; t.ask_test = false; return { ok: true, test: t.test }; }
          if (b.action === "changes" && !String(b.note || "").trim()) throw err(400, "Add a note for the maker.");
          if (b.action === "approve") { t.status = "live"; t.hidden_by = null; t.live_at = t.live_at || Date.now(); reports[t.id] = []; }
          else if (b.action === "changes") t.status = "changes";
          else if (b.action === "hide") { t.status = "hidden"; t.hidden_by = "admin"; }
          t.review_note = b.note || null;
          return { ok: true, did: b.action, skill: detail(t, false, true) };
        }
        throw err(404, "Not found.");
      }).then(clone);
    }

    /* the automatic checks, in the API's shape (the server runs the real ones) */
    function runChecks(md, examples, meta) {
      var blocks = [], warnings = [];
      function block(rule, line, fix, where) { blocks.push({ rule: rule, where: where || "SKILL.md", line: line, fix: fix }); }
      var fm = md.match(/^﻿?---[ \t]*\n([\s\S]*?)\n---/);
      var isPrompt = meta && meta.kind === "prompt";
      if (isPrompt) { if (!md.trim()) block("prompt", 1, "Paste your prompt.", "the prompt"); }
      else if (!md.trim()) block("frontmatter", 1, "Paste your SKILL.md. It starts with --- then name: and description: lines, then ---.");
      else if (!fm) block("frontmatter", 1, "Start the file with a frontmatter block: a line with ---, then name: and description:, then ---.");
      else {
        if (!/^name:[ \t]*\S/m.test(fm[1])) block("frontmatter", 2, "Add a name: line to the frontmatter, like name: polish-email.");
        if (!/^description:[ \t]*\S/m.test(fm[1])) block("frontmatter", 2, "Add a description: line to the frontmatter saying what it does and when to use it.");
      }
      var kb = new Blob([md]).size / 1024;
      if (kb > 40) block("size", 1, "Make SKILL.md shorter: it is " + Math.ceil(kb) + " KB and the limit is 40 KB.");
      var rules = [
        ["hidden-unicode", /[​-‏‪-‮⁠-⁤⁦-⁩]/, "Delete the invisible character: retype the line by hand."],
        ["ignore-instructions", /\b(ignore|disregard|forget|override|bypass)\b[^.\n]{0,40}\b(previous|prior|above|earlier|system|all|any|other|your)\b[^.\n]{0,30}\b(instructions?|prompts?|rules|messages?)\b/i, "Remove the line that tells Claude to ignore earlier or system instructions. A skill can only add steps, never switch off the rules."],
        ["secrets", /(~\/\.ssh|\.ssh\/|\bid_rsa\b|\b(read|open|copy|send|collect|print|upload|grab)\b[^\n]{0,40}(\.env\b|api[ _-]?keys?|passwords?|cookies|tokens?))/i, "Remove the part that has Claude read or share secrets (SSH keys, .env files, passwords, cookies, tokens)."],
        ["send-data", /\b(send|post|upload|transmit|forward|submit)\b.{0,80}(https?:\/\/|\bwebhook\b|\bendpoint\b|\bserver\b)/i, "Remove the step that sends, posts or uploads data to a web address."],
        ["network-command", /(\bcurl\b|\bwget\b|Invoke-WebRequest|\bfetch\s*\()/i, "Remove the curl / wget / fetch command. Unknown downloads are not allowed."],
        ["hide-from-user", /\b(don'?t|do not|never)\s+(tell|let|show|mention|reveal)\s+(the\s+)?(user|person|them)\b/i, "Remove the part that tells Claude to keep something from the person."],
        ["encoded-blob", /[A-Za-z0-9+\/]{120,}={0,2}/, "Remove the long encoded string. Write instructions in plain words people can read."],
        ["scripts", /<\s*(script|iframe|object|embed)\b/i, "Remove the script or embed tag. Skills are text only for now."],
        ["html-comment", /<!--[^>]*?[A-Za-z]{2,}[^>]*?[A-Za-z]{2,}[\s\S]*?-->/, "Remove the hidden HTML comment (<!-- ... -->). If it is an instruction, write it in plain sight."]
      ];
      rules.forEach(function (r) { var m = md.match(r[1]); if (m) block(r[0], md.slice(0, m.index).split("\n").length, r[2]); });
      var urls = (md.match(/https?:\/\/[^\s)<>\]"'`]+/g) || []).filter(function (v, i, a) { return a.indexOf(v) === i; });
      if (urls.length) warnings.push({ rule: "links", where: "all", note: "It mentions web addresses. Check each one.", urls: urls });
      if (/\b(diagnos\w*|prescri\w*|dosage|medication)\b/i.test(md)) warnings.push({ rule: "advice", where: "SKILL.md", kind: "medical", note: "Mentions medical topics. It must not give medical advice: organizing and preparing only." });
      if (meta && meta.name && meta.sub) {
        var nm = String(meta.name).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
        var dup = skills.find(function (s) { return s.status === "live" && s.sub === meta.sub && s.id !== meta.id && s.name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() === nm; });
        if (dup) warnings.push({ rule: "near-duplicate", where: "name", note: "Looks a lot like \"" + dup.name + "\" by " + dup.handle + ". Remix it instead?", skill_id: dup.id });
      }
      if (examples !== undefined) {
        var ex = Array.isArray(examples) ? examples : [];
        if (!ex.length) blocks.push({ rule: "examples", where: "examples", line: 1, fix: "Add at least one example: what someone asked and what the skill answered." });
        ex.forEach(function (e, i) {
          if (!String(e.input || "").trim()) blocks.push({ rule: "examples", where: "example " + (i + 1) + " input", line: 1, fix: "Add what someone asked." });
          if (!String(e.output || "").trim()) blocks.push({ rule: "examples", where: "example " + (i + 1) + " output", line: 1, fix: "Add what the skill answered." });
        });
      }
      var sm = summarize(md), summary = sm.asks.slice();
      if (sm.output) summary.push("It answers with: " + sm.output);
      return { ok: !blocks.length, blocks: blocks, warnings: warnings, summary: md.trim() ? summary : [] };
    }
    return { call: call };
  })();

  /* ---------- boot ---------- */
  function boot() {
    if (MOCK) document.body.appendChild(h("div", { class: "mock-ribbon", role: "note", text: "Mock data" }));
    var tax = MOCK ? Promise.resolve() : api("GET", "taxonomy").then(applyTaxonomy, function () {});
    var who = api("GET", "me").then(function (j) { ME = j && (j.user || null); }, function (e) { if (e.setup) SETUP = true; ME = null; });
    Promise.all([tax, who]).then(function () { window.addEventListener("hashchange", route); route(); });
  }
  /* the API's taxonomy is the source of truth; data.js keeps icons and short tile names */
  function applyTaxonomy(t) {
    if (!t || !Array.isArray(t.categories) || !t.categories.length) return;
    D.cats = t.categories.map(function (c) {
      var old = catOf(c.id) || {};
      return { id: c.id, name: c.name, short: old.short || c.name, note: old.note, subs: (c.subs || []).map(function (x) { return { id: x.id, name: x.name }; }) };
    });
    if (Array.isArray(t.for) && t.for.length) D.forTags = t.for;
    if (Array.isArray(t.works_in) && t.works_in.length) D.worksIn = t.works_in;
    if (Array.isArray(t.report_reasons) && t.report_reasons.length) D.reportReasons = t.report_reasons.map(function (r) {
      var id = typeof r === "string" ? r : r.id, old = D.reportReasons.find(function (x) { return x[0] === id; });
      return [id, (r && r.name) || (old ? old[1] : id)];
    });
  }
  boot();
})();
