/* Lesson 3 · Make it like this. Describe vs show → your email in your voice → pick the best example → where the kitchen idea breaks → 2 quick checks → stamp.
   Nothing is sent anywhere: the order is copied, or opened in the learner's own Claude. */
(function () {
  "use strict";
  var app = document.getElementById("app");
  var STEPS = 6, step = 0;
  var JOBS = ["ask for a day off", "follow up on an unpaid invoice", "say no to a favor", "move a meeting"];
  var VOICES = {
    "short and warm": "Hi Jo! Quick one: can we push Thursday to 3? Thanks so much. A.",
    "upbeat": "Hey team!! Huge thanks for today, you all crushed it. Pizza on me Friday!",
    "calm and direct": "Hi Sam, I can't take this on this month. I can help in March if that works."
  };
  var order = { job: "ask for a day off", to: "", voice: "short and warm", mine: "" };
  function play(n, x) { if (window.SQSound) window.SQSound.play(n, x); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function prog() { return '<div class="prog"><span>Lesson 3 · ' + (step + 1) + " of " + STEPS + '</span><span class="bar"><i style="width:' + Math.round((step + 1) / STEPS * 100) + '%"></i></span></div>'; }
  function show(html) { app.innerHTML = prog() + '<section class="step">' + html + "</section>"; window.scrollTo(0, 0); try { app.focus({ preventScroll: true }); } catch (e) {} }
  function next() { step++; render(); play("pick"); }
  function example() { return order.mine.trim() || VOICES[order.voice]; }
  function prompt() {
    return "Write an email to " + (order.to.trim() || "my manager") + " to " + order.job + ".\n" +
      "Match the way I write in this example. Copy the tone and length, not the facts:\n" +
      "\"" + example() + "\"\n" +
      "Keep it short. Give me a subject line too.\n" +
      "Ask me anything you need before you write.";
  }
  function copy(text, done) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () { School.toast(done || "Copied"); }, function () { School.toast("Select the text and copy it"); });
  }

  var render = function () {
    if (step === 0) return show(
      '<p class="label">Lesson 3 · about 10 minutes</p>' +
      "<h1>Make it like this.</h1>" +
      '<div class="teaser" aria-hidden="true"><div class="ticket"><div class="th"><span>ORDER #005</span><span>to: the chef</span></div>Write my email like this one I sent last week ↓<div class="tf">Show, don’t describe.</div></div></div>' +
      '<ul class="lines">' +
      "<li><b>“Friendly but professional” means a hundred things.</b>One example means one.</li>" +
      "<li><b>Show the chef a dish you like.</b>Paste something you wrote. It copies the flavor, not the words.</li>" +
      "<li><b>Your example is your style.</b>Your emails start sounding like you, not like a robot.</li></ul>" +
      '<div class="btns"><button class="btn" data-next type="button">See it work</button></div>' +
      '<p class="small">Doing this with someone? Tap "Bigger text" at the top.</p>');

    if (step === 1) return show(
      "<h2>Describe it, or show it.</h2>" +
      '<div class="pair">' +
      '<div><p class="label">Described <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>ORDER A</span><span>described</span></div>Email my manager asking for Friday off. Friendly but professional.<div class="tf">No example</div></div>' +
      '<div class="reply"><p class="who">The chef replies</p>Dear Manager, I hope this message finds you well. I am writing to formally request a day of leave on Friday…</div></div>' +
      '<div><p class="label">Shown <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>ORDER B</span><span>one example</span></div>Email my manager asking for Friday off. Write it like this: “Hi Jo! Quick one: can we push Thursday to 3? Thanks so much. A.”<div class="tf">One real example</div></div>' +
      '<div class="reply"><p class="who">The chef replies</p>Hi Jo! Quick one: could I take Friday off? Everything for Monday is done. Thanks so much. A.</div></div>' +
      "</div>" +
      '<p style="margin-top:14px">Same request. One line you really wrote made the second email sound like a person.</p>' +
      '<div class="btns"><button class="btn" data-next type="button">Now you try</button></div>');

    if (step === 2) {
      show(
        "<h2>Your turn. What email do you need?</h2>" +
        '<div class="fridge" role="group" aria-label="The email">' + JOBS.map(function (j) { return '<button type="button" class="chip" aria-pressed="' + (order.job === j) + '" data-job="' + esc(j) + '">' + esc(j) + "</button>"; }).join("") + "</div>" +
        '<div class="row"><label for="to">Who is it to?</label></div><input type="text" id="to" maxlength="40" placeholder="my manager, Jo" value="' + esc(order.to) + '">' +
        '<p class="label" style="margin-top:14px">How do you usually write?</p>' +
        '<div class="fridge" role="group" aria-label="Pick a voice">' + Object.keys(VOICES).map(function (v) { return '<button type="button" class="chip" aria-pressed="' + (!order.mine.trim() && order.voice === v) + '" data-voice="' + esc(v) + '">' + esc(v) + "</button>"; }).join("") + "</div>" +
        '<div class="row"><label for="mine">Or paste a short thing you really wrote (best)</label></div><textarea id="mine" maxlength="400" placeholder="A text or email you sent. Take out names and numbers first.">' + esc(order.mine) + "</textarea>" +
        '<p class="label">Your order</p><div class="ticket" id="ticket"></div>' +
        '<div class="btns"><a class="btn" id="open" target="_blank" rel="noopener">Open Claude with my order</a><button class="btn ghost" id="copy" type="button">Copy my order</button></div>' +
        '<p class="small">Read it before you send it. You’re still the one hitting send.</p>' +
        '<div class="btns"><button class="btn ghost" data-next type="button">I got my email →</button></div>');
      function drawTicket(added) {
        var t = document.getElementById("ticket");
        var body = esc(prompt()).replace(/\n/g, "<br>");
        if (added) body = body.replace(esc(added), '<span class="add">' + esc(added) + "</span>");
        t.innerHTML = '<div class="th"><span>ORDER #006</span><span>email</span></div>' + body + '<div class="tf">Your order, in your voice</div>';
        document.getElementById("open").href = "https://claude.ai/new?q=" + encodeURIComponent(prompt());
      }
      drawTicket();
      app.querySelectorAll("[data-job]").forEach(function (b) {
        b.onclick = function () {
          order.job = b.dataset.job;
          app.querySelectorAll("[data-job]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          play("tick", 1); drawTicket(order.job);
        };
      });
      app.querySelectorAll("[data-voice]").forEach(function (b) {
        b.onclick = function () {
          order.voice = b.dataset.voice; order.mine = ""; document.getElementById("mine").value = "";
          app.querySelectorAll("[data-voice]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          play("tick", 2); drawTicket(VOICES[order.voice]);
        };
      });
      document.getElementById("to").oninput = function (e) { order.to = e.target.value; drawTicket(); };
      document.getElementById("mine").oninput = function (e) {
        order.mine = e.target.value;
        app.querySelectorAll("[data-voice]").forEach(function (x) { x.setAttribute("aria-pressed", String(!order.mine.trim() && x.dataset.voice === order.voice)); });
        drawTicket();
      };
      document.getElementById("copy").onclick = function () { copy(prompt(), "Order copied. Paste it into Claude."); };
      document.getElementById("open").addEventListener("click", function () { play("share"); });
      return;
    }

    if (step === 3) {
      show(
        "<h2>Which example makes the email sound most like you?</h2>" +
        '<ul class="claims">' +
        '<li><button type="button" data-c="0">An email from a famous CEO you admire</button></li>' +
        '<li><button type="button" data-c="1">A short email you really sent last month</button></li>' +
        '<li><button type="button" data-c="0">No example, just “make it sound like me”</button></li>' +
        '<li><button type="button" data-c="0">A long paragraph describing your personality</button></li></ul>' +
        '<div id="fb"></div>');
      var tries = 0;
      app.querySelectorAll("[data-c]").forEach(function (b) {
        b.onclick = function () {
          var fb = document.getElementById("fb");
          if (b.dataset.c === "1") {
            b.classList.add("right"); play("win");
            fb.innerHTML = '<p class="fb good">Yes. Something you really wrote is the best recipe for “like me”. The chef has never met you; it has only seen your example.</p>' +
              '<div class="breaks"><b>Your new habit</b>Keep 2 or 3 short things you wrote and liked. Paste one in: <q>Write it like this.</q></div>' +
              '<div class="btns"><button class="btn" data-next type="button">Next</button></div>';
            fb.querySelector("[data-next]").onclick = next;
          } else {
            tries++; b.classList.add("wrong"); play("pick");
            fb.innerHTML = '<p class="fb try">' + (tries < 2 ? "That would sound like someone, just not you. Try another." : "Hint: the chef can only copy what it can see.") + "</p>";
          }
        };
      });
      return;
    }

    if (step === 4) return show(
      "<h2>The chef copies everything in your example.</h2>" +
      '<ul class="lines">' +
      "<li><b>Even the parts you didn’t mean.</b>A name, a price, a typo: it may show up in the new email.</li>" +
      "<li><b>So clean it first.</b>Take out names, numbers and anything private. Then say: <q>Copy the tone, not the facts.</q></li></ul>" +
      '<div class="breaks"><b>Where the kitchen idea breaks</b>A real chef tastes your dish and gets the idea. This one can repeat the exact ingredients, including someone else’s phone number. Clean the example before you paste it.</div>' +
      '<div class="btns"><button class="btn" data-next type="button">Two quick questions</button></div>');

    if (step === 5) {
      var Q = [
        { q: "Your example email has a client’s phone number in it. What first?", a: ["Take the number out, then paste it", "Leave it, Claude won’t use it"], ok: 0, why: "Right. Clean the example first. The chef can copy anything it sees." },
        { q: "Best way to get “sounds like me”?", a: ["Describe your style in a paragraph", "Paste a short thing you really wrote"], ok: 1, why: "Right. Show, don’t describe." }
      ], got = 0;
      show("<h2>Two quick questions.</h2>" + Q.map(function (x, i) {
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
            if (got === Q.length) document.getElementById("qdone").innerHTML = '<div class="btns"><button class="btn" id="finish" type="button">Get my stamp</button></div>';
            var f = document.getElementById("finish"); if (f) f.onclick = function () { step = 6; render(); };
          } else { b.classList.add("wrong"); play("pick"); document.getElementById("q" + i).innerHTML = '<p class="fb try">Not quite. Try the other one.</p>'; }
        };
      });
      return;
    }

    /* step 6: the stamp moment */
    var first = School.mark("l3");
    app.innerHTML = '<section class="step">' +
      '<div class="stamp-wrap"><div class="stamp land" aria-hidden="true">' + School.stampSvg("Like this", 3, true) + "</div></div>" +
      '<h1 style="text-align:center">Lesson 3, stamped.</h1>' +
      '<p class="muted" style="text-align:center">' + (first ? "Three stamps in your Chef’s passport." : "You already had this stamp. Nice refresher.") + "</p>" +
      '<div class="kept"><p><b>You leave with:</b> an email ready to send, in your own voice.</p>' +
      '<p><b>Your new habits:</b> paste one real example and say "Write it like this." Clean out names and numbers first.</p></div>' +
      '<div class="btns"><button class="btn" id="save" type="button">Copy my "like this" card</button><a class="btn ghost" href="./">See my Chef’s passport</a><button class="btn ghost" id="send" type="button">Send this lesson to someone</button></div>' +
      '<div class="btns"><a class="btn ghost" href="lesson-4.html">Lesson 4: Taste before you serve →</a></div></section>';
    window.scrollTo(0, 0);
    setTimeout(function () { play("stamp"); }, 260);
    document.getElementById("save").onclick = function () { copy("LIKE THIS CARD\nWhat do I need? (the job)\nWho is it to?\nPaste one short thing I really wrote.\nSay: Copy the tone and length, not the facts.\nClean out names and numbers first.\nRead it before I send it.", "Card copied"); };
    document.getElementById("send").onclick = function () {
      var url = location.href.split("#")[0];
      if (navigator.share) navigator.share({ title: "Make it like this", text: "A 10-minute lesson on getting AI to write in your own voice.", url: url }).catch(function () {});
      else copy(url, "Link copied");
      play("share");
    };
  };
  app.addEventListener("click", function (e) { if (e.target.closest("[data-next]") && e.target.closest(".step") && !e.target.closest("#fb")) next(); });
  document.addEventListener("DOMContentLoaded", render);
})();
