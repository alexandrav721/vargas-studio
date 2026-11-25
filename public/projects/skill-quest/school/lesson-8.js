/* Lesson 8 · Write your recipe card (the finale). A recipe card = a skill → write yours → a blind taste test → how to use and keep it → 2 quick checks → stamp + passport complete.
   Nothing is sent anywhere: the card is copied, or opened in the learner's own Claude. */
(function () {
  "use strict";
  var app = document.getElementById("app");
  var STEPS = 6, step = 0;
  var JOBS = {
    "thank-you notes": { ask: "who it's for and what they did", steps: "1. Thank them for one specific thing.\n2. Say how it helped.\n3. End warm, in one line.", good: "Maria, the lasagna got us through moving day. We ate it standing up between boxes and it was perfect. Thank you!" },
    "a weekly meal plan": { ask: "how many people, what's in the fridge, anything we never eat", steps: "1. Plan 5 dinners, 30 minutes or less.\n2. Use what's in the fridge first.\n3. End with one shopping list.", good: "Mon: egg fried rice. Tue: chicken tacos… Shopping: tortillas, limes, cilantro." },
    "emails to a teacher": { ask: "my kid's name, the teacher's name, and what it's about", steps: "1. Friendly first line.\n2. Say the point in one sentence.\n3. One clear question or ask.\n4. Under 100 words.", good: "Hi Ms. Lee, Sam was sick Tuesday and missed the math quiz. Could he make it up Friday? Thanks so much, Ana" },
    "posts for my shop": { ask: "what I'm selling and who it's for", steps: "1. Hook in the first line.\n2. One real detail about the product.\n3. Price and how to buy.\n4. Under 50 words.", good: "Hand-poured, smells like a Sunday bakery. Our vanilla-oat candle is back: $24, pick up Saturday at the market." }
  };
  var card = { job: "thank-you notes", name: "", steps: JOBS["thank-you notes"].steps, good: JOBS["thank-you notes"].good, never: "" };
  function play(n, x) { if (window.SQSound) window.SQSound.play(n, x); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function prog() { return '<div class="prog"><span>Lesson 8 · ' + (step + 1) + " of " + STEPS + '</span><span class="bar"><i style="width:' + Math.round((step + 1) / STEPS * 100) + '%"></i></span></div>'; }
  function show(html) { app.innerHTML = prog() + '<section class="step">' + html + "</section>"; window.scrollTo(0, 0); try { app.focus({ preventScroll: true }); } catch (e) {} }
  function next() { step++; render(); play("pick"); }
  function recipe() {
    var j = JOBS[card.job], name = card.name.trim() || ("My " + card.job);
    return "RECIPE CARD: " + name + "\n" +
      "Use this card when I need " + card.job + ".\n" +
      "First, ask me: " + j.ask + ".\n" +
      "Then follow these steps:\n" + card.steps.trim() + "\n" +
      (card.good.trim() ? "A great one looks like this (copy the style, not the facts):\n\"" + card.good.trim() + "\"\n" : "") +
      (card.never.trim() ? "Never: " + card.never.trim() + ".\n" : "") +
      "Before you finish, check your answer against these steps.";
  }
  function copy(text, done) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () { School.toast(done || "Copied"); }, function () { School.toast("Select the text and copy it"); });
  }

  var render = function () {
    if (step === 0) return show(
      '<p class="label">Lesson 8 · about 15 minutes · the finale</p>' +
      "<h1>Write your recipe card.</h1>" +
      '<div class="teaser" aria-hidden="true"><div class="ticket"><div class="th"><span>RECIPE CARD</span><span>by you</span></div>Thank-you notes<br>Ask first · 3 steps · one great example<div class="tf">Write it once. Use it forever.</div></div></div>' +
      '<ul class="lines">' +
      "<li><b>A recipe card is a skill.</b>Everything you’ve learned, written down once for a job you do often.</li>" +
      "<li><b>Four parts.</b>When to use it, what to ask first, the steps, one great example.</li>" +
      "<li><b>Then taste-test it.</b>Does it beat Claude without the card? That’s how you know it works.</li></ul>" +
      '<div class="ba"><div><p class="label">Before</p><div class="ticket"><div class="th"><span>VAGUE ORDER</span></div>Write a thank-you note for Maria.<div class="tf">“Thank you for your kindness and generosity.”</div></div></div><div class="ba-arrow" aria-hidden="true"></div><div><p class="label">After</p><div class="ticket"><div class="th"><span>FULL ORDER</span></div>Recipe card: ask who it’s for and what they did.<br>1. One specific thing. 2. How it helped. 3. End warm.<div class="tf">“Maria, the lasagna got us through moving day.”</div></div></div></div>' +
      '<div class="btns"><button class="btn" data-next type="button">See a recipe card</button></div>' +
      '<p class="small">Doing this with someone? Tap "Bigger text" at the top.</p>');

    if (step === 1) return show(
      "<h2>Everything you learned, on one card.</h2>" +
      '<p class="label">A recipe card <span class="sample">Sample</span></p>' +
      '<div class="ticket"><div class="th"><span>RECIPE CARD</span><span>thank-you notes</span></div>' +
      "Use this card when I need a thank-you note.<br>First, ask me: who it’s for and what they did.<br>Steps: 1. One specific thing. 2. How it helped. 3. End warm, in one line.<br>A great one looks like: “Maria, the lasagna got us through moving day…”<br>Before you finish, check your answer against these steps." +
      '<div class="tf">Lessons 2, 3, 4 and 6, on one card</div></div>' +
      '<ul class="lines" style="margin-top:14px">' +
      "<li><b>Ask first</b>is Lesson 2.</li><li><b>One great example</b>is Lesson 3.</li><li><b>Check against the steps</b>is Lesson 4.</li><li><b>Short and in a clear shape</b>is Lesson 6.</li></ul>" +
      '<div class="btns"><button class="btn" data-next type="button">Write yours</button></div>');

    if (step === 2) {
      show(
        "<h2>Your turn. Pick a job you do often.</h2>" +
        '<div class="fridge" role="group" aria-label="The job">' + Object.keys(JOBS).map(function (j) { return '<button type="button" class="chip" aria-pressed="' + (card.job === j) + '" data-job="' + esc(j) + '">' + esc(j) + "</button>"; }).join("") + "</div>" +
        '<div class="row"><label for="nm">Name your card (optional)</label></div><input type="text" id="nm" maxlength="40" placeholder="Ana’s thank-you notes" value="' + esc(card.name) + '">' +
        '<div class="row"><label for="steps">The steps (edit them to your way)</label></div><textarea id="steps" maxlength="500">' + esc(card.steps) + "</textarea>" +
        '<div class="row"><label for="good">One great example (yours is best)</label></div><textarea id="good" maxlength="400">' + esc(card.good) + "</textarea>" +
        '<div class="row"><label for="never">Never (optional)</label></div><input type="text" id="never" maxlength="80" placeholder="emoji, “I hope this finds you well”" value="' + esc(card.never) + '">' +
        '<p class="label">Your recipe card</p><div class="ticket" id="ticket"></div>' +
        '<div class="btns"><button class="btn" id="copy" type="button">Copy my recipe card</button><a class="btn ghost" id="open" target="_blank" rel="noopener">Try it in Claude</a></div>' +
        '<p class="small">To use it: paste it at the start of a chat, or into a station’s instructions (Lesson 5).</p>' +
        '<div class="btns"><button class="btn ghost" data-next type="button">Taste-test my card →</button></div>');
      function drawTicket(added) {
        var t = document.getElementById("ticket");
        var body = esc(recipe()).replace(/\n/g, "<br>");
        if (added) body = body.replace(esc(added), '<span class="add">' + esc(added) + "</span>");
        t.innerHTML = '<div class="th"><span>RECIPE CARD</span><span>by you</span></div>' + body + '<div class="tf">Your own skill</div>';
        document.getElementById("open").href = "https://claude.ai/new?q=" + encodeURIComponent(recipe() + "\n\nUse this card now. Start by asking me your questions.");
      }
      drawTicket();
      app.querySelectorAll("[data-job]").forEach(function (b) {
        b.onclick = function () {
          card.job = b.dataset.job; card.steps = JOBS[card.job].steps; card.good = JOBS[card.job].good;
          document.getElementById("steps").value = card.steps; document.getElementById("good").value = card.good;
          app.querySelectorAll("[data-job]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          play("tick", 1); drawTicket(card.job);
        };
      });
      [["nm", "name"], ["steps", "steps"], ["good", "good"], ["never", "never"]].forEach(function (f) {
        document.getElementById(f[0]).oninput = function (e) { card[f[1]] = e.target.value; drawTicket(); };
      });
      document.getElementById("copy").onclick = function () { copy(recipe(), "Recipe card copied"); play("share"); };
      return;
    }

    if (step === 3) {
      show(
        "<h2>Blind taste test. Which note is better?</h2>" +
        '<p class="muted">Same request: “A thank-you note to Maria for the lasagna.” One used a recipe card. You don’t know which. <span class="sample">Sample</span></p>' +
        '<ul class="claims">' +
        '<li><button type="button" data-c="0"><b>A.</b> Dear Maria, thank you so much for your kindness and generosity. Your thoughtful gesture was truly appreciated. Warm regards.</button></li>' +
        '<li><button type="button" data-c="1"><b>B.</b> Maria, the lasagna got us through moving day. We ate it between boxes and it was perfect. Thank you!</button></li></ul>' +
        '<div id="fb"></div>');
      app.querySelectorAll("[data-c]").forEach(function (b) {
        b.onclick = function () {
          var fb = document.getElementById("fb");
          app.querySelectorAll("[data-c]").forEach(function (x) { x.disabled = true; });
          var pickedCard = b.dataset.c === "1";
          b.classList.add(pickedCard ? "right" : "wrong"); play(pickedCard ? "win" : "pick");
          fb.innerHTML = '<p class="fb ' + (pickedCard ? "good" : "try") + '">' + (pickedCard ? "You picked B. B used the recipe card: one specific thing, how it helped, a warm line." : "You picked A. A was plain Claude, no card. B used the recipe card. That’s why taste tests are blind: you judge the dish, not the name.") + "</p>" +
            '<div class="breaks"><b>That’s a taste test</b>Run your card and plain Claude on the same request, hide which is which, and pick. If your card doesn’t win, fix one step and try again. AI Made EZ does this for you.</div>' +
            '<div class="btns"><button class="btn" data-next type="button">Next</button></div>';
          fb.querySelector("[data-next]").onclick = next;
        };
      });
      return;
    }

    if (step === 4) return show(
      "<h2>A recipe card is only as good as its last taste test.</h2>" +
      '<ul class="lines">' +
      "<li><b>Keep it short.</b>A long card gets skimmed, by people and by Claude. 3 to 5 steps.</li>" +
      "<li><b>Fix it when it fails.</b>Bad result? Change one line on the card, not the whole thing.</li>" +
      "<li><b>Keep it where you’ll use it.</b>Start of a chat, a station (Lesson 5), or saved as a skill in Claude.</li></ul>" +
      '<div class="breaks"><b>Where the kitchen idea breaks</b>A real cook follows a recipe the same way every time. Claude may skip a step or improvise. That’s why the card ends with “check your answer against these steps”, and why you taste-test it.</div>' +
      '<div class="btns"><button class="btn" data-next type="button">Two last questions</button></div>');

    if (step === 5) {
      var Q = [
        { q: "How do you know your recipe card works?", a: ["It sounds smart", "It beats plain Claude in a blind taste test"], ok: 1, why: "Right. The dish decides, not the card." },
        { q: "Your card gave a weird result once. Best move?", a: ["Change one step and test again", "Throw the card away"], ok: 0, why: "Right. Small fixes, then taste again." }
      ], got = 0;
      show("<h2>Two last questions.</h2>" + Q.map(function (x, i) {
        return '<div style="margin:18px 0"><p><b>' + (i + 1) + ". " + x.q + '</b></p><ul class="claims">' + x.a.map(function (a, j) { return '<li><button type="button" data-q="' + i + '" data-a="' + j + '">' + a + "</button></li>"; }).join("") + '</ul><div id="q' + i + '"></div></div>';
      }).join("") + '<div id="qdone"></div>');
      var answered = {};
      app.querySelectorAll("[data-q]").forEach(function (b) {
        b.onclick = function () {
          var i = +b.dataset.q, x = Q[i];
          if (answered[i]) return;
          if (+b.dataset.a === x.ok) {
            answered[i] = 1; got++; b.classList.add("right"); play("tick", got);
            document.getElementById("q" + i).innerHTML = '<p class="fb good">' + x.why + "</p>";
            if (got === Q.length) document.getElementById("qdone").innerHTML = '<div class="btns"><button class="btn" id="finish" type="button">Get my last stamp</button></div>';
            var f = document.getElementById("finish"); if (f) f.onclick = function () { step = 6; render(); };
          } else { b.classList.add("wrong"); play("pick"); document.getElementById("q" + i).innerHTML = '<p class="fb try">Not quite. Try the other one.</p>'; }
        };
      });
      return;
    }

    /* step 6: the last stamp, and the passport */
    var first = School.mark("l8");
    var have = School.done(), count = School.LESSONS.filter(function (l) { return have[l.id]; }).length, all = count === School.LESSONS.length;
    app.innerHTML = '<section class="step">' +
      '<div class="stamp-wrap"><div class="stamp land" aria-hidden="true">' + School.stampSvg("Recipe card", 8, true) + "</div></div>" +
      '<h1 style="text-align:center">' + (all ? "Passport complete." : "Lesson 8, stamped.") + "</h1>" +
      '<p class="muted" style="text-align:center">' + (all ? "All 8 stamps. You don’t just use AI now. You write the recipes." : (first ? count + " of 8 stamps. Go back for the ones you skipped." : "You already had this stamp. Nice refresher.")) + "</p>" +
      '<div class="kept"><p><b>You leave with:</b> your own recipe card for a job you do often, and a way to prove it works.</p>' +
      '<p><b>What you can do now:</b> order with details, show an example, taste before you serve, keep a station and a pantry, and write recipe cards.</p></div>' +
      '<div class="btns"><button class="btn" id="save" type="button">Copy my recipe card</button><a class="btn ghost" href="./">See my Chef’s passport</a><button class="btn ghost" id="send" type="button">Send this course to someone</button></div></section>';
    window.scrollTo(0, 0);
    setTimeout(function () { play(all ? "win" : "stamp"); }, 260);
    document.getElementById("save").onclick = function () { copy(recipe(), "Recipe card copied"); };
    document.getElementById("send").onclick = function () {
      var url = location.href.replace(/lesson-8\.html.*$/, "");
      if (navigator.share) navigator.share({ title: "AI Made EZ", text: "8 short lessons that make AI easy, like learning to cook.", url: url }).catch(function () {});
      else copy(url, "Link copied");
      play("share");
    };
  };
  app.addEventListener("click", function (e) { if (e.target.closest("[data-next]") && e.target.closest(".step") && !e.target.closest("#fb")) next(); });
  document.addEventListener("DOMContentLoaded", render);
})();
