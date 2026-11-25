/* Lesson 4 · Taste before you serve. A confident wrong answer → your taste-test order → what never goes in the pot → where the kitchen idea breaks → 2 quick checks → stamp.
   Nothing is sent anywhere: the order is copied, or opened in the learner's own Claude. */
(function () {
  "use strict";
  var app = document.getElementById("app");
  var STEPS = 6, step = 0;
  var TOPICS = {
    "a travel rule": "Do I need a visa to visit Japan for 10 days as a US citizen?",
    "a money question": "How much should I tip a hairdresser in the US?",
    "a fact for school": "When did the first iPhone come out?",
    "a cooking swap": "Can I use Greek yogurt instead of sour cream in baking?"
  };
  var order = { topic: "a travel rule", q: TOPICS["a travel rule"] };
  function play(n, x) { if (window.SQSound) window.SQSound.play(n, x); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function prog() { return '<div class="prog"><span>Lesson 4 · ' + (step + 1) + " of " + STEPS + '</span><span class="bar"><i style="width:' + Math.round((step + 1) / STEPS * 100) + '%"></i></span></div>'; }
  function show(html) { app.innerHTML = prog() + '<section class="step">' + html + "</section>"; window.scrollTo(0, 0); try { app.focus({ preventScroll: true }); } catch (e) {} }
  function next() { step++; render(); play("pick"); }
  function prompt() {
    return (order.q.trim() || "My question") + "\n" +
      "After you answer:\n" +
      "1. Tell me how sure you are.\n" +
      "2. List the facts I should double-check.\n" +
      "3. Tell me where I can check them (official sites, not blogs).\n" +
      "4. Tell me if I should ask a real expert instead.";
  }
  function copy(text, done) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () { School.toast(done || "Copied"); }, function () { School.toast("Select the text and copy it"); });
  }

  var render = function () {
    if (step === 0) return show(
      '<p class="label">Lesson 4 · about 10 minutes</p>' +
      "<h1>Taste before you serve.</h1>" +
      '<div class="teaser" aria-hidden="true"><div class="ticket"><div class="th"><span>TASTE TEST</span><span>before serving</span></div>Does it make sense?<br>Can I check it somewhere real?<br>Would I bet on it?<div class="tf">Three checks. Ten seconds.</div></div></div>' +
      '<ul class="lines">' +
      "<li><b>The chef can be sure and wrong.</b>It serves a mistake as proudly as a real dish.</li>" +
      "<li><b>So taste it first.</b>Three quick checks before you share it, send it or act on it.</li>" +
      "<li><b>Some things never go in the pot.</b>Passwords, card numbers, ID numbers, other people’s private stuff.</li></ul>" +
      '<div class="ba"><div><p class="label">Before</p><div class="ticket"><div class="th"><span>VAGUE ORDER</span></div>How long do cooked leftovers keep in the fridge?<div class="tf">“Up to 2 weeks.” Sure, and wrong.</div></div></div><div class="ba-arrow" aria-hidden="true"></div><div><p class="label">After</p><div class="ticket"><div class="th"><span>FULL ORDER</span></div>How long do cooked leftovers keep in the fridge? Then: how sure are you, what should I double-check, and where?<div class="tf">“3 to 4 days,” plus where to check.</div></div></div></div>' +
      '<div class="btns"><button class="btn" data-next type="button">Watch a taste test</button></div>' +
      '<p class="small">Doing this with someone? Tap "Bigger text" at the top.</p>');

    if (step === 1) return show(
      "<h2>A sure answer that’s wrong.</h2>" +
      '<p class="label">The order <span class="sample">Sample</span></p>' +
      '<div class="ticket"><div class="th"><span>ORDER #007</span><span>a quick fact</span></div>How long do cooked leftovers keep in the fridge?<div class="tf">No taste test asked for</div></div>' +
      '<div class="reply"><p class="who">The chef replies <span class="sample">Sample</span></p>Cooked leftovers keep safely for up to 2 weeks in the fridge.</div>' +
      '<p style="margin-top:14px">Sounds sure. It’s wrong: food-safety agencies say about <b>3 to 4 days</b>.</p>' +
      '<div class="ticket" style="margin-top:12px"><div class="th"><span>ORDER #008</span><span>with a taste test</span></div>Same question. Then: how sure are you, what should I double-check, and where?<div class="tf">The taste test</div></div>' +
      '<div class="reply"><p class="who">The chef replies <span class="sample">Sample</span></p>Usually 3 to 4 days. I’m fairly sure, but check your country’s food-safety site, and throw out anything that smells off.</div>' +
      '<p style="margin-top:14px">Asking for the taste test made the chef slow down and point you to a real source.</p>' +
      '<div class="btns"><button class="btn" data-next type="button">Now you taste</button></div>');

    if (step === 2) {
      show(
        "<h2>Your turn. Ask something you’d act on.</h2>" +
        '<div class="fridge" role="group" aria-label="Pick a kind of question">' + Object.keys(TOPICS).map(function (t) { return '<button type="button" class="chip" aria-pressed="' + (order.topic === t) + '" data-t="' + esc(t) + '">' + esc(t) + "</button>"; }).join("") + "</div>" +
        '<div class="row"><label for="q">Your question</label></div><textarea id="q" maxlength="300">' + esc(order.q) + "</textarea>" +
        '<p class="label">Your order, with the taste test</p><div class="ticket" id="ticket"></div>' +
        '<div class="btns"><a class="btn" id="open" target="_blank" rel="noopener">Open Claude with my order</a><button class="btn ghost" id="copy" type="button">Copy my order</button></div>' +
        '<p class="small">Then check one fact it listed on the site it named. That’s the taste.</p>' +
        '<div class="btns"><button class="btn ghost" data-next type="button">I tasted it →</button></div>');
      function drawTicket(added) {
        var t = document.getElementById("ticket");
        var body = esc(prompt()).replace(/\n/g, "<br>");
        if (added) body = body.replace(esc(added), '<span class="add">' + esc(added) + "</span>");
        t.innerHTML = '<div class="th"><span>ORDER #009</span><span>taste test</span></div>' + body + '<div class="tf">Answer, then show your work</div>';
        document.getElementById("open").href = "https://claude.ai/new?q=" + encodeURIComponent(prompt());
      }
      drawTicket();
      app.querySelectorAll("[data-t]").forEach(function (b) {
        b.onclick = function () {
          order.topic = b.dataset.t; order.q = TOPICS[order.topic]; document.getElementById("q").value = order.q;
          app.querySelectorAll("[data-t]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          play("tick", 1); drawTicket(order.q);
        };
      });
      document.getElementById("q").oninput = function (e) { order.q = e.target.value; drawTicket(); };
      document.getElementById("copy").onclick = function () { copy(prompt(), "Order copied. Paste it into Claude."); };
      document.getElementById("open").addEventListener("click", function () { play("share"); });
      return;
    }

    if (step === 3) {
      var ITEMS = [
        ["A recipe you want to cut in half", 0],
        ["Your bank password", 1],
        ["A draft email with the names taken out", 0],
        ["Your card number, to “check a charge”", 1],
        ["Your friend’s address and phone number", 1],
        ["A paragraph you wrote for work, with no client names", 0]
      ];
      var need = ITEMS.filter(function (x) { return x[1]; }).length, found = 0;
      show(
        "<h2>What never goes in the pot?</h2>" +
        '<p class="muted">Tap every one you would <b>not</b> paste into a chat. There are ' + need + ".</p>" +
        '<ul class="claims">' + ITEMS.map(function (x, i) { return '<li><button type="button" data-i="' + i + '">' + esc(x[0]) + "</button></li>"; }).join("") + "</ul>" +
        '<div id="fb"></div>');
      app.querySelectorAll("[data-i]").forEach(function (b) {
        b.onclick = function () {
          var x = ITEMS[+b.dataset.i], fb = document.getElementById("fb");
          if (b.classList.contains("right")) return;
          if (x[1]) {
            b.classList.add("right"); found++; play("tick", found);
            if (found === need) {
              play("win");
              fb.innerHTML = '<p class="fb good">All three. Passwords, card numbers and other people’s private details stay out of every chat, even a helpful one.</p>' +
                '<div class="breaks"><b>Your new habit</b>Before you paste, take out names, numbers and anything you’d hate to see on a billboard.</div>' +
                '<div class="btns"><button class="btn" data-next type="button">Next</button></div>';
              fb.querySelector("[data-next]").onclick = next;
            } else fb.innerHTML = '<p class="fb good">Yes. ' + (need - found) + " more.</p>";
          } else {
            b.classList.add("wrong"); play("pick");
            fb.innerHTML = '<p class="fb try">That one’s fine to paste: nothing private in it. Keep looking.</p>';
          }
        };
      });
      return;
    }

    if (step === 4) return show(
      "<h2>The chef can’t taste its own food.</h2>" +
      '<ul class="lines">' +
      "<li><b>It doesn’t know when it’s wrong.</b>That’s your job, and it takes ten seconds.</li>" +
      "<li><b>Health, money, legal: it’s a first draft.</b>Use it to prepare your questions, then ask a pharmacist, a doctor, an accountant or a lawyer.</li>" +
      "<li><b>It may not know this week’s news.</b>Unless it searched the web, check anything recent.</li></ul>" +
      '<div class="breaks"><b>Where the kitchen idea breaks</b>A real chef tastes every plate. This one never can. You are the taster.</div>' +
      '<div class="btns"><button class="btn" data-next type="button">Two quick questions</button></div>');

    if (step === 5) {
      var Q = [
        { q: "Claude gives you a medicine dose for your child. What do you do?", a: ["Check it with a pharmacist or doctor", "Use it, it sounded sure"], ok: 0, why: "Right. For health, it’s a draft. A professional makes the call." },
        { q: "Which one is fine to paste?", a: ["A recipe you want to cut in half", "Your card number, to check a charge"], ok: 0, why: "Right. Nothing private in a recipe. Card numbers never go in." }
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
    var first = School.mark("l4");
    app.innerHTML = '<section class="step">' +
      '<div class="stamp-wrap"><div class="stamp land" aria-hidden="true">' + School.stampSvg("Taste test", 4, true) + "</div></div>" +
      '<h1 style="text-align:center">Lesson 4, stamped.</h1>' +
      '<p class="muted" style="text-align:center">' + (first ? "Four stamps. Halfway through your Chef’s passport." : "You already had this stamp. Nice refresher.") + "</p>" +
      '<div class="kept"><p><b>You leave with:</b> a safe-kitchen card for your fridge: three taste checks, and what never goes in the pot.</p>' +
      '<p><b>Your new habit:</b> end important questions with "How sure are you, and where can I check?"</p></div>' +
      '<div class="btns"><button class="btn" id="save" type="button">Copy my safe-kitchen card</button><a class="btn ghost" href="lesson-5.html">Lesson 5: Your own station →</a><a class="btn ghost" href="./">See my Chef’s passport</a><button class="btn ghost" id="send" type="button">Send this lesson to someone</button></div></section>';
    window.scrollTo(0, 0);
    setTimeout(function () { play("stamp"); }, 260);
    document.getElementById("save").onclick = function () { copy("SAFE-KITCHEN CARD\nTaste before you serve:\n1. Does it make sense?\n2. Can I check it somewhere real?\n3. Would I bet on it?\nAsk: How sure are you, and where can I check?\nHealth, money, legal: a first draft, then ask a real expert.\nNever paste: passwords, card numbers, ID numbers, other people's private details.", "Safe-kitchen card copied"); };
    document.getElementById("send").onclick = function () {
      var url = location.href.split("#")[0];
      if (navigator.share) navigator.share({ title: "Taste before you serve", text: "A 10-minute lesson on checking what AI tells you, and keeping private things out.", url: url }).catch(function () {});
      else copy(url, "Link copied");
      play("share");
    };
  };
  app.addEventListener("click", function (e) { if (e.target.closest("[data-next]") && e.target.closest(".step") && !e.target.closest("#fb")) next(); });
  document.addEventListener("DOMContentLoaded", render);
})();
