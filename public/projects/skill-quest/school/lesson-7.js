/* Lesson 7 · Pantry and meal kits. Your pantry = preferences Claude always uses; meal kits = ready-made skills → your "always ask" settings → pantry or order? → where the kitchen idea breaks → 2 quick checks → stamp.
   Nothing is sent anywhere: the settings are copied; the learner pastes them into their own Claude. */
(function () {
  "use strict";
  var app = document.getElementById("app");
  var STEPS = 6, step = 0;
  var ALWAYS = [
    "Ask me questions first when my request is unclear.",
    "Use plain words. No jargon.",
    "Keep answers short unless I ask for more.",
    "Use numbered steps for anything I have to do.",
    "Tell me which facts I should double-check.",
    "Say so when you're not sure."
  ];
  var LENGTHS = ["short", "medium", "detailed"];
  var p = { about: "", always: ALWAYS.slice(0, 3), length: "short", never: "" };
  function play(n, x) { if (window.SQSound) window.SQSound.play(n, x); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function prog() { return '<div class="prog"><span>Lesson 7 · ' + (step + 1) + " of " + STEPS + '</span><span class="bar"><i style="width:' + Math.round((step + 1) / STEPS * 100) + '%"></i></span></div>'; }
  function show(html) { app.innerHTML = prog() + '<section class="step">' + html + "</section>"; window.scrollTo(0, 0); try { app.focus({ preventScroll: true }); } catch (e) {} }
  function next() { step++; render(); play("pick"); }
  function settings() {
    return (p.about.trim() ? "About me: " + p.about.trim() + "\n" : "") +
      "Answer length: " + p.length + " by default.\n" +
      (p.always.length ? "Always:\n" + p.always.map(function (a) { return "- " + a; }).join("\n") + "\n" : "") +
      (p.never.trim() ? "Never: " + p.never.trim() + "\n" : "");
  }
  function copy(text, done) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () { School.toast(done || "Copied"); }, function () { School.toast("Select the text and copy it"); });
  }

  var render = function () {
    if (step === 0) return show(
      '<p class="label">Lesson 7 · about 10 minutes</p>' +
      "<h1>Pantry and meal kits.</h1>" +
      '<div class="teaser" aria-hidden="true"><div class="ticket"><div class="th"><span>MY PANTRY</span><span>always stocked</span></div>Plain words.<br>Short answers.<br>Ask me first when it’s unclear.<div class="tf">Set once. Used every time.</div></div></div>' +
      '<ul class="lines">' +
      "<li><b>Your pantry is what’s always on the shelf.</b>Things that are true for every order: how you like answers, plain words, short.</li>" +
      "<li><b>Claude has a place for it.</b>A personal preferences box in its settings. Every chat uses it.</li>" +
      "<li><b>Meal kits are ready-made skills.</b>Someone already wrote and tested the recipe. You just use it.</li></ul>" +
      '<div class="btns"><button class="btn" data-next type="button">See the difference</button></div>' +
      '<p class="small">Doing this with someone? Tap "Bigger text" at the top.</p>');

    if (step === 1) return show(
      "<h2>Same question. Empty pantry, stocked pantry.</h2>" +
      '<div class="pair">' +
      '<div><p class="label">Empty pantry <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>ORDER</span><span>no preferences</span></div>How do I back up my phone photos?<div class="tf">Nothing stocked</div></div>' +
      '<div class="reply"><p class="who">The chef replies</p>There are several approaches to photo backup, including cloud-based synchronization services, local storage solutions, and hybrid strategies…</div></div>' +
      '<div><p class="label">Stocked pantry <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>ORDER</span><span>with preferences</span></div>How do I back up my phone photos?<div class="tf">Plain words · short · numbered steps</div></div>' +
      '<div class="reply"><p class="who">The chef replies</p>Do you have an iPhone or Android? For iPhone: 1. Open Settings. 2. Tap your name. 3. Tap iCloud, then Photos, and turn it on.</div></div>' +
      "</div>" +
      '<p style="margin-top:14px">Same question, typed the same way. The stocked pantry made it short, plain, and it asked first.</p>' +
      '<div class="btns"><button class="btn" data-next type="button">Stock your pantry</button></div>');

    if (step === 2) {
      show(
        "<h2>Your turn. What should Claude always do?</h2>" +
        '<div class="row"><label for="about">A little about you (optional)</label></div><input type="text" id="about" maxlength="90" placeholder="I’m a nurse, not techy, I read on my phone" value="' + esc(p.about) + '">' +
        '<p class="label" style="margin-top:14px">Always</p><div class="fridge" role="group" aria-label="Always">' + ALWAYS.map(function (a) { return '<button type="button" class="chip" aria-pressed="' + (p.always.indexOf(a) >= 0) + '" data-a="' + esc(a) + '">' + esc(a) + "</button>"; }).join("") + "</div>" +
        '<p class="label" style="margin-top:14px">Answer length</p><div class="fridge" role="group" aria-label="Answer length">' + LENGTHS.map(function (l) { return '<button type="button" class="chip" aria-pressed="' + (p.length === l) + '" data-l="' + l + '">' + l + "</button>"; }).join("") + "</div>" +
        '<div class="row"><label for="never">Never (optional)</label></div><input type="text" id="never" maxlength="80" placeholder="emoji, long intros" value="' + esc(p.never) + '">' +
        '<p class="label">Your pantry</p><div class="ticket" id="ticket"></div>' +
        '<div class="btns"><button class="btn" id="copy" type="button">Copy my pantry</button><a class="btn ghost" href="https://claude.ai/settings" target="_blank" rel="noopener">Open Claude settings</a></div>' +
        '<ol class="small" style="margin:10px 0 0 18px;line-height:1.6"><li>In Claude’s settings, find the box for your personal preferences.</li><li>Paste your pantry and save.</li><li>Start a new chat and ask anything. It uses your pantry.</li></ol>' +
        '<p class="small">Nothing private in the pantry: no addresses, account numbers or health details you wouldn’t want stored.</p>' +
        '<div class="btns"><button class="btn ghost" data-next type="button">My pantry is stocked →</button></div>');
      function drawTicket(added) {
        var t = document.getElementById("ticket");
        var body = esc(settings()).replace(/\n/g, "<br>");
        if (added) body = body.replace(esc(added), '<span class="add">' + esc(added) + "</span>");
        t.innerHTML = '<div class="th"><span>MY PANTRY</span><span>always</span></div>' + body + '<div class="tf">Paste once into your settings</div>';
      }
      drawTicket();
      document.getElementById("about").oninput = function (e) { p.about = e.target.value; drawTicket(); };
      document.getElementById("never").oninput = function (e) { p.never = e.target.value; drawTicket(); };
      app.querySelectorAll("[data-a]").forEach(function (b) {
        b.onclick = function () {
          var a = b.dataset.a, i = p.always.indexOf(a);
          if (i >= 0) p.always.splice(i, 1); else p.always.push(a);
          b.setAttribute("aria-pressed", String(i < 0)); play("tick", Math.min(p.always.length, 3)); drawTicket(i < 0 ? a : null);
        };
      });
      app.querySelectorAll("[data-l]").forEach(function (b) {
        b.onclick = function () {
          p.length = b.dataset.l;
          app.querySelectorAll("[data-l]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          play("tick", 1); drawTicket();
        };
      });
      document.getElementById("copy").onclick = function () { copy(settings(), "Pantry copied. Paste it into your Claude settings."); play("share"); };
      return;
    }

    if (step === 3) {
      var ITEMS = [
        ["Use plain words, no jargon", 1],
        ["Write a thank-you note to Maria for the casserole", 0],
        ["Keep answers short unless I ask for more", 1],
        ["Plan meals for this Saturday’s party", 0],
        ["Tell me what to double-check", 1]
      ], got = 0, need = 3;
      show(
        "<h2>Pantry, or today’s order?</h2>" +
        '<p class="muted">Tap the ones that belong in your pantry: true for <b>every</b> chat. There are 3.</p>' +
        '<ul class="claims">' + ITEMS.map(function (x, i) { return '<li><button type="button" data-i="' + i + '">' + esc(x[0]) + "</button></li>"; }).join("") + "</ul>" +
        '<div id="fb"></div>');
      app.querySelectorAll("[data-i]").forEach(function (b) {
        b.onclick = function () {
          var x = ITEMS[+b.dataset.i], fb = document.getElementById("fb");
          if (b.classList.contains("right")) return;
          if (x[1]) {
            b.classList.add("right"); got++; play("tick", got);
            if (got === need) {
              play("win");
              fb.innerHTML = '<p class="fb good">Yes. The pantry holds how you like every answer. Today’s job goes in today’s order.</p>' +
                '<div class="breaks"><b>Your new habit</b>Typed the same thing three times? Move it to your pantry. And try a meal kit: a ready-made skill for a job you do often.</div>' +
                '<div class="btns"><button class="btn" data-next type="button">Next</button><a class="btn ghost" href="../templates/" target="_blank" rel="noopener">See the meal kits</a></div>';
              fb.querySelector("[data-next]").onclick = next;
            } else fb.innerHTML = '<p class="fb good">Yes. ' + (need - got) + " more.</p>";
          } else {
            b.classList.add("wrong"); play("pick");
            fb.innerHTML = '<p class="fb try">That one’s just for today. It goes in an order, not the pantry.</p>';
          }
        };
      });
      return;
    }

    if (step === 4) return show(
      "<h2>The pantry goes into every dish.</h2>" +
      '<ul class="lines">' +
      "<li><b>So keep it small and true.</b>A one-time thing in the pantry ends up in every answer, even when it doesn’t fit.</li>" +
      "<li><b>Check it now and then.</b>Your needs change. Open your settings every few months and tidy up.</li>" +
      "<li><b>Meal kits still need a taste.</b>A ready-made skill was tested by someone else, on their tasks. Try it on yours.</li></ul>" +
      '<div class="breaks"><b>Where the kitchen idea breaks</b>A real pantry just sits there until you reach for it. This one is added to every order, whether the dish needs it or not.</div>' +
      '<div class="btns"><button class="btn" data-next type="button">Two quick questions</button></div>');

    if (step === 5) {
      var Q = [
        { q: "You always want short answers in plain words. Where does that go?", a: ["Your pantry (personal preferences)", "Retype it in every chat"], ok: 0, why: "Right. Set it once in your preferences." },
        { q: "You need one thank-you note for a neighbor. Where does that go?", a: ["Your pantry", "Today’s order"], ok: 1, why: "Right. One-time jobs go in an order." }
      ], got2 = 0;
      show("<h2>Two quick questions.</h2>" + Q.map(function (x, i) {
        return '<div style="margin:18px 0"><p><b>' + (i + 1) + ". " + x.q + '</b></p><ul class="claims">' + x.a.map(function (a, j) { return '<li><button type="button" data-q="' + i + '" data-a="' + j + '">' + a + "</button></li>"; }).join("") + '</ul><div id="q' + i + '"></div></div>';
      }).join("") + '<div id="qdone"></div>');
      var answered = {};
      app.querySelectorAll("[data-q]").forEach(function (b) {
        b.onclick = function () {
          var i = +b.dataset.q, x = Q[i];
          if (answered[i]) return;
          if (+b.dataset.a === x.ok) {
            answered[i] = 1; got2++; b.classList.add("right"); play("tick", got2);
            document.getElementById("q" + i).innerHTML = '<p class="fb good">' + x.why + "</p>";
            if (got2 === Q.length) document.getElementById("qdone").innerHTML = '<div class="btns"><button class="btn" id="finish" type="button">Get my stamp</button></div>';
            var f = document.getElementById("finish"); if (f) f.onclick = function () { step = 6; render(); };
          } else { b.classList.add("wrong"); play("pick"); document.getElementById("q" + i).innerHTML = '<p class="fb try">Not quite. Try the other one.</p>'; }
        };
      });
      return;
    }

    /* step 6: the stamp moment */
    var first = School.mark("l7");
    app.innerHTML = '<section class="step">' +
      '<div class="stamp-wrap"><div class="stamp land" aria-hidden="true">' + School.stampSvg("Pantry", 7, true) + "</div></div>" +
      '<h1 style="text-align:center">Lesson 7, stamped.</h1>' +
      '<p class="muted" style="text-align:center">' + (first ? "Seven stamps. One to go." : "You already had this stamp. Nice refresher.") + "</p>" +
      '<div class="kept"><p><b>You leave with:</b> your “always ask” settings, stocked once and used in every chat.</p>' +
      '<p><b>Your new habits:</b> repeated three times? Move it to the pantry. Try a meal kit for a job you do often.</p></div>' +
      '<div class="btns"><button class="btn" id="save" type="button">Copy my pantry</button><a class="btn ghost" href="lesson-8.html">Lesson 8: Write your recipe card →</a><a class="btn ghost" href="./">See my Chef’s passport</a><button class="btn ghost" id="send" type="button">Send this lesson to someone</button></div></section>';
    window.scrollTo(0, 0);
    setTimeout(function () { play("stamp"); }, 260);
    document.getElementById("save").onclick = function () { copy(settings(), "Pantry copied"); };
    document.getElementById("send").onclick = function () {
      var url = location.href.split("#")[0];
      if (navigator.share) navigator.share({ title: "Pantry and meal kits", text: "A 10-minute lesson on setting up AI once so every answer fits you.", url: url }).catch(function () {});
      else copy(url, "Link copied");
      play("share");
    };
  };
  app.addEventListener("click", function (e) { if (e.target.closest("[data-next]") && e.target.closest(".step") && !e.target.closest("#fb")) next(); });
  document.addEventListener("DOMContentLoaded", render);
})();
