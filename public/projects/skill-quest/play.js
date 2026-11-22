/* Spot the Skill: three real rounds → your judge record → the real card → your blank card → share.
   Every round below is copied from the saved scorer run of idea-innovate (21 Nov 2026,
   ~/Claude/skill-quest/runs/idea-innovate-20261121): task, answer facts, judge scores,
   judge's call and which slot used the skill. Nothing here is invented. */
(function () {
  "use strict";

  var ROUNDS = [
    {
      task: "Snack box from around the world. Good idea?",
      full: "I have a business idea: a subscription box of snacks from different countries. Is this a good idea?",
      A: { facts: ["6 ideas, unscored"], title: "Brief: International Snack Subscription Box",
           text: "Start with a single-niche or diaspora box (options 1 and 2), sold with prepaid gift plans." },
      B: { facts: ["8 ideas, each scored"], title: "Taste of Home Box (working name)",
           text: "As stated, no. It is a crowded, high-churn, thin-margin business with nothing to defend it." },
      judge: "B", score: { A: 3.8, B: 4.5 }, skill: "B",
      why: "B scores 8 variations and says how each one fails…"
    },
    {
      task: "Dog walking. $500, no car.",
      full: "I want to start a business around dog walking in my city. I'm a college student with about $500, 15 hours a week, and no car.",
      A: { facts: ["Real income math"], title: "Dog Walking Business: Angles, Pressure Test, and Brief",
           text: "Trust is the product. Dog owners hand over house keys. An app doesn't create trust; a known face does." },
      B: { facts: ["Clean number scores"], title: "Puppy Midday (working name)",
           text: "Puppy Midday helps new puppy owners with full-time jobs get a reliable midday potty-and-play visit…" },
      judge: "tie", score: { A: 4.5, B: 4.3 }, skill: "B",
      why: "A has more realistic income math… B gives clean numeric scoring…"
    },
    {
      task: "Meeting-notes startup is stuck. Pivot it.",
      full: "Help me pivot. My startup is a B2B SaaS that auto-generates meeting summaries for sales teams. 40 paying customers, 9% monthly churn.",
      A: { facts: ["Scores options 1 to 5"], title: "brief.md: CRM Autopilot",
           text: "CRM Autopilot helps sales teams of 5 to 30 reps keep the CRM complete and current…" },
      B: { facts: ["12-month money model"], title: "brief.md: Pivot decision",
           text: "Stop selling summaries. Sell the CRM write-back: \"your CRM updates itself after every sales call, from any recorder.\"" },
      judge: "B", score: { A: 4.0, B: 4.5 }, skill: "A",
      why: "B builds the comparison on the supplied numbers…"
    }
  ];

  var CARD = {
    name: "idea-innovate", number: "#87FE", rarity: "EPIC", total: 81,
    desc: "Turn a rough business idea into its strongest version.",
    weak: "Plain Claude did about as well. Add what Claude doesn't know: your rules, examples, templates.",
    stats: [["Power", 85, "p"], ["Lift", 50, "l"], ["Clarity", 100, "c"], ["Speed", 90, "s"], ["Finds it", 100, "l"]],
    record: "won 1 · tied 1 · lost 1", date: "2026-11-21"
  };

  var TITLES = ["Free Thinker", "Wild Card", "Sharp Eye", "Blind Judge"];
  var CALLS = { A: "a", B: "b", tie: "t" };
  var FROM = { a: "A", b: "B", t: "tie" };

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, reduced ? Math.min(ms, 80) : ms); }); };
  var esc = function (v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var label = function (c) { return c === "tie" ? "Too close" : c; };
  var sfx = function (name, n) { if (window.SQSound) window.SQSound.play(name, n); };
  function load(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* this visit only */ } }

  /* A friend's calls arrive in the link: ?p=btb */
  var params = new URLSearchParams(location.search);
  var friend = (params.get("p") || "").toLowerCase().split("").map(function (x) { return FROM[x]; });
  if (friend.length !== 3 || friend.some(function (x) { return !x; })) friend = null;

  var picks = [];
  var r = 0;

  function show(id) {
    $$(".beat").forEach(function (b) { b.classList.toggle("is-on", b.id === id); });
    window.scrollTo(0, 0);
    var h = document.querySelector("#" + id + " h1, #" + id + " h2, #" + id + " label");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }

  /* ---------- 1. Arrive ---------- */
  if (friend) $("#friend-line").hidden = false;
  $("#go").addEventListener("click", function () { r = 0; picks = []; paintRound(); show("beat-round"); sfx("deal"); });

  /* ---------- 2. Rounds ---------- */
  function answerCard(slot, row) {
    var a = row[slot];
    return '<article class="ans" data-slot="' + slot + '">' +
      '<div class="ans-head"><span class="ans-slot">' + slot + '</span></div>' +
      '<div class="ans-page" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
      '<p class="ans-who" hidden></p>' +
      '<ul class="ans-facts">' + a.facts.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" +
      '<button class="ans-peek" type="button" data-peek="' + slot + '" aria-label="Read answer ' + slot + '">Read</button>' +
      "</article>";
  }

  function paintRound() {
    var row = ROUNDS[r];
    $("#round-count").textContent = "Round " + (r + 1) + " of 3";
    $("#pips").innerHTML = ROUNDS.map(function (_, k) {
      return '<i class="' + (k < r ? "done" : k === r ? "now" : "") + '"></i>';
    }).join("");
    $("#round-task").textContent = row.task;
    $("#pair").innerHTML = answerCard("A", row) + answerCard("B", row);
    $("#calls").hidden = false;
    $("#verdict").hidden = true;
    $("#verdict").innerHTML = "";
    $$("[data-peek]").forEach(function (b) { b.addEventListener("click", function () { peek(b.dataset.peek); }); });
  }

  function peek(slot) {
    var row = ROUNDS[r];
    $("#peek-kicker").textContent = "Answer " + slot;
    $("#peek-title").textContent = row[slot].title;
    $("#peek-text").textContent = row[slot].text;
    var d = $("#peek");
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
  }
  $("#peek-close").addEventListener("click", function () { var d = $("#peek"); if (d.close) d.close(); else d.removeAttribute("open"); });
  $("#peek").addEventListener("click", function (e) { if (e.target === e.currentTarget && e.currentTarget.close) e.currentTarget.close(); });

  var busy = false;
  async function call(c) {
    if (busy || !$("#beat-round").classList.contains("is-on") || !$("#verdict").hidden) return;
    busy = true;
    var row = ROUNDS[r];
    picks[r] = c;
    sfx("pick");
    $("#calls").hidden = true;
    $$(".ans").forEach(function (el) { el.classList.toggle("is-mine", el.dataset.slot === c); });
    var v = $("#verdict");
    v.hidden = false;
    v.innerHTML = '<p class="v-wait">The blind judge says…</p>';
    await wait(900);
    sfx("stamp");
    var same = c === row.judge;
    v.innerHTML =
      '<p class="v-call"><span class="stamp">Judge: ' + esc(label(row.judge)) + "</span>" +
      '<span class="v-you ' + (same ? "yes" : "no") + '">You: ' + esc(label(c)) + (same ? " ✓" : "") + "</span></p>" +
      '<p class="v-why">“' + esc(row.why) + "”</p>";
    await wait(700);
    // the flip: who wrote which
    $$(".ans").forEach(function (el) {
      var s = el.dataset.slot;
      var isSkill = s === row.skill;
      el.classList.add("is-flipped", isSkill ? "is-skill" : "is-plain");
      var who = el.querySelector(".ans-who");
      who.hidden = false;
      who.innerHTML = '<b>' + row.score[s].toFixed(1) + '</b><span>' + (isSkill ? "Skill" : "Plain Claude") + "</span>";
    });
    var outcome = row.judge === "tie" ? "A tie." : row.judge === row.skill ? "The skill won." : "Plain Claude won.";
    sfx(row.judge === row.skill ? "win" : "even");
    var f = friend ? '<span class="v-friend">Friend: ' + esc(label(friend[r])) + "</span>" : "";
    v.insertAdjacentHTML("beforeend",
      '<p class="v-out">' + outcome + "</p>" + f +
      '<button class="btn btn--go" type="button" id="next">' + (r < 2 ? "Next" : "See the card") + "</button>");
    $("#next").addEventListener("click", next);
    $("#next").focus({ preventScroll: true });
    busy = false;
  }
  $$("[data-call]").forEach(function (b) { b.addEventListener("click", function () { call(b.dataset.call); }); });
  document.addEventListener("keydown", function (e) {
    if (!$("#beat-round").classList.contains("is-on") || $("#peek").open) return;
    var k = e.key.toLowerCase();
    if (k === "a" || e.key === "ArrowLeft") call("A");
    if (k === "b" || e.key === "ArrowRight") call("B");
    if (k === "t" || e.key === "ArrowDown") call("tie");
  });

  function next() {
    r += 1;
    if (r < ROUNDS.length) { paintRound(); show("beat-round"); sfx("deal"); }
    else reveal();
  }

  /* ---------- 3. Payoff ---------- */
  function matched() { return picks.filter(function (p, k) { return p === ROUNDS[k].judge; }).length; }

  function cardHtml() {
    return '<div class="rc">' +
      '<div class="rc-top"><span class="rc-rar">' + CARD.rarity + '</span><span class="rc-no">' + CARD.number + "</span></div>" +
      '<p class="rc-name">' + CARD.name + "</p>" +
      '<p class="rc-desc">' + esc(CARD.desc) + "</p>" +
      '<div class="rc-stats">' + CARD.stats.map(function (s) {
        return '<div class="rc-stat"><span>' + s[0] + '</span><span class="rc-bar"><b class="k-' + s[2] + '" style="--w:' + s[1] + '%"></b></span><span class="rc-n">' + s[1] + "</span></div>";
      }).join("") + "</div>" +
      '<div class="rc-foot"><span>vs plain Claude: ' + CARD.record + '</span><span class="rc-total" id="rc-total">' + CARD.total + "</span></div>" +
      '<p class="rc-date">scored ' + CARD.date + " · real run</p>" +
      "</div>";
  }

  async function reveal() {
    var m = matched();
    show("beat-reveal");
    $("#reveal-score").textContent = "";
    $("#reveal-title").textContent = "";
    $("#reveal-title").classList.remove("is-in");
    $("#flip").classList.remove("is-open");
    $("#real-card").innerHTML = cardHtml();
    $("#to-yours").classList.remove("is-in");
    var rf = $("#reveal-friend");
    rf.hidden = !friend;
    if (friend) {
      var same = picks.filter(function (p, k) { return p === friend[k]; }).length;
      rf.textContent = "You and your friend agreed on " + same + " of 3.";
    }
    for (var n = 0; n <= m; n += 1) {
      $("#reveal-score").textContent = n + " of 3";
      sfx("tick", n);
      await wait(260);
    }
    await wait(300);
    $("#reveal-title").textContent = TITLES[m];
    void $("#reveal-title").offsetWidth;
    $("#reveal-title").classList.add("is-in");
    sfx("sticker");
    await wait(900);
    $("#flip").classList.add("is-open");
    sfx("win");
    await wait(reduced ? 0 : 1500);
    $("#to-yours").classList.add("is-in");
  }
  $("#to-yours").addEventListener("click", function () { paintBlank(); show("beat-yours"); });

  /* ---------- 4. Yours ---------- */
  function slug(s) {
    return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32) || "my-skill";
  }
  function skillName() { return slug($("#chore").value || $("#chore").placeholder); }

  function paintBlank() {
    var name = skillName();
    $("#blank-card").innerHTML =
      '<div class="bc-top"><span class="bc-rar">UNSCORED</span></div>' +
      '<p class="bc-name">' + esc(name) + "</p>" +
      '<div class="bc-stats">' + ["Power", "Lift", "Clarity", "Speed", "Finds it"].map(function (s) {
        return '<span class="bc-stat">' + s + " <b>?</b></span>";
      }).join("") + "</div>";
    $("#cmd").textContent = "/skill-quest:score " + name;
  }
  $("#chore").value = load("sq.chore", "");
  $("#chore").addEventListener("input", function (e) { save("sq.chore", e.target.value.slice(0, 40)); paintBlank(); });

  $("#copy").addEventListener("click", async function () {
    try { await navigator.clipboard.writeText($("#cmd").textContent); $("#copy").textContent = "Copied"; }
    catch (e) { $("#copy").textContent = "Select it"; }
    setTimeout(function () { $("#copy").textContent = "Copy"; }, 1600);
  });
  $("#again").addEventListener("click", function () { r = 0; picks = []; paintRound(); show("beat-round"); sfx("deal"); });

  function shareLink() {
    var u = new URL(location.href);
    u.search = "";
    u.hash = "";
    u.searchParams.set("p", picks.map(function (p) { return CALLS[p]; }).join(""));
    u.searchParams.set("from", "card");
    return u.href;
  }

  /* The share card: a 1080×1350 PNG drawn on canvas. */
  async function makeCard() {
    try { await document.fonts.ready; } catch (e) { /* system fonts */ }
    var W = 1080, H = 1350;
    var c = document.createElement("canvas");
    c.width = W; c.height = H;
    var x = c.getContext("2d");
    var D = '"Bricolage Grotesque", system-ui, sans-serif', M = '"JetBrains Mono", ui-monospace, monospace';
    var INK = "#161412", PAPER = "#F6F1E7", SUN = "#F5B82E", TOM = "#C7391F", TEAL = "#1F7A6B";
    function rr(px, py, w, h, rad, fill, shadow) {
      if (shadow) { x.fillStyle = INK; rrPath(px + 12, py + 12, w, h, rad); x.fill(); }
      x.fillStyle = fill; rrPath(px, py, w, h, rad); x.fill();
      x.lineWidth = 6; x.strokeStyle = INK; x.stroke();
    }
    function rrPath(px, py, w, h, rad) {
      x.beginPath(); x.moveTo(px + rad, py); x.arcTo(px + w, py, px + w, py + h, rad);
      x.arcTo(px + w, py + h, px, py + h, rad); x.arcTo(px, py + h, px, py, rad); x.arcTo(px, py, px + w, py, rad); x.closePath();
    }
    x.fillStyle = SUN; x.fillRect(0, 0, W, H);
    x.fillStyle = INK; x.font = "700 34px " + M; x.fillText("I JUDGED A REAL SKILL TEST, BLIND", 80, 120);
    x.font = "800 128px " + D; x.fillText(TITLES[matched()], 76, 260);
    x.font = "700 52px " + D; x.fillText("Matched the judge " + matched() + " of 3", 80, 340);
    // the three rounds
    ROUNDS.forEach(function (row, k) {
      var px = 80 + k * 312, py = 390;
      rr(px, py, 288, 150, 22, "#fff", false);
      var ok = picks[k] === row.judge;
      x.fillStyle = INK; x.font = "700 26px " + M; x.fillText("ROUND " + (k + 1), px + 24, py + 46);
      x.font = "800 40px " + D; x.fillText("Me: " + (picks[k] === "tie" ? "tie" : picks[k]), px + 24, py + 98);
      x.fillStyle = ok ? TEAL : TOM; x.font = "700 26px " + M; x.fillText(ok ? "= JUDGE" : "≠ JUDGE", px + 24, py + 132);
    });
    // the real card, mini
    var cx = 80, cy = 580, cw = 920, ch = 500;
    rr(cx, cy, cw, ch, 30, "#fff", true);
    rr(cx + 44, cy + 40, 150, 58, 12, TEAL, false);
    x.fillStyle = "#fff"; x.font = "700 32px " + M; x.fillText("EPIC", cx + 82, cy + 81);
    x.fillStyle = INK; x.font = "700 30px " + M; x.fillText(CARD.number, cx + cw - 150, cy + 80);
    x.font = "800 84px " + D; x.fillText(CARD.name, cx + 44, cy + 190);
    var bars = CARD.stats, cols = [TOM, TEAL, INK, "#8A5A00", TEAL];
    bars.forEach(function (s, k) {
      var by = cy + 232 + k * 38;
      x.font = "700 22px " + M; x.fillStyle = INK; x.fillText(s[0].toUpperCase(), cx + 44, by + 16);
      x.fillStyle = "#EDE5D4"; rrPath(cx + 230, by, 520, 16, 8); x.fill();
      x.fillStyle = cols[k]; rrPath(cx + 230, by, 520 * s[1] / 100, 16, 8); x.fill();
      x.fillStyle = INK; x.fillText(String(s[1]), cx + 780, by + 16);
    });
    x.fillStyle = INK; x.fillRect(cx + 44, cy + 428, cw - 88, 4);
    x.font = "800 80px " + D; x.fillText(String(CARD.total), cx + cw - 150, cy + ch - 18);
    x.font = "700 30px " + D; x.fillText("vs plain Claude: " + CARD.record, cx + 44, cy + ch - 26);
    // yours
    x.fillStyle = INK; x.font = "700 30px " + M; x.fillText("NEXT, MINE:", 80, 1140);
    x.font = "800 56px " + D; x.fillText(skillName(), 80, 1202);
    x.font = "700 28px " + M; x.fillText("unscored", 80, 1244);
    x.fillStyle = INK; x.fillRect(0, H - 80, W, 80);
    x.fillStyle = PAPER; x.font = "700 30px " + M; x.fillText("Can you spot the skill? · Skill Quest (working name)", 80, H - 30);
    return new Promise(function (res) { c.toBlob(res, "image/png"); });
  }
  function download(blob) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "spot-the-skill.png";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }
  $("#save").addEventListener("click", async function () { sfx("share"); var b = await makeCard(); if (b) download(b); });
  $("#send").addEventListener("click", async function () {
    var btn = $("#send");
    sfx("share");
    btn.disabled = true;
    var blob = await makeCard();
    btn.disabled = false;
    var link = shareLink();
    var text = "I matched a blind AI judge " + matched() + " of 3. Can you spot the skill?";
    try {
      var file = blob && new File([blob], "spot-the-skill.png", { type: "image/png" });
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text: text + " " + link }); return; }
      if (navigator.share) { await navigator.share({ text: text, url: link }); return; }
    } catch (e) { return; /* closed the share sheet */ }
    try {
      await navigator.clipboard.writeText(text + " " + link);
      btn.textContent = "Link copied";
      setTimeout(function () { btn.textContent = "Challenge a friend"; }, 1800);
    } catch (e) { /* no clipboard */ }
  });
})();
