/* Lesson 1 · Meet the chef. Worked example → your order (first win) → spot the made-up line → the chef forgets → 2 quick checks → stamp.
   Nothing is sent anywhere: the order is copied, or opened in the learner's own Claude. */
(function () {
  "use strict";
  var app = document.getElementById("app");
  var STEPS = 6, step = 0;
  var order = { items: [], people: 2, never: "", quick: true };
  var FRIDGE = ["eggs", "spinach", "rice", "chicken", "tortillas", "cheese", "black beans", "tomatoes", "pasta", "onions", "yogurt", "frozen peas"];
  function play(n) { if (window.SQSound) window.SQSound.play(n); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function prog() { return '<div class="prog"><span>Lesson 1 · ' + (step + 1) + " of " + STEPS + '</span><span class="bar"><i style="width:' + Math.round((step + 1) / STEPS * 100) + '%"></i></span></div>'; }
  function show(html) { app.innerHTML = prog() + '<section class="step">' + html + "</section>"; window.scrollTo(0, 0); try { app.focus({ preventScroll: true }); } catch (e) {} }
  function next() { step++; render(); play("pick"); }
  function prompt() {
    var items = order.items.length ? order.items.join(", ") : "whatever I have";
    return "Plan 5 dinners for this week for " + order.people + (order.people === 1 ? " person" : " people") + ".\n" +
      "What's in my fridge: " + items + ".\n" +
      (order.never.trim() ? "Never use: " + order.never.trim() + ".\n" : "") +
      (order.quick ? "Each dinner should take 30 minutes or less.\n" : "") +
      "Use mostly what I have, and list anything I'd need to buy.\nThen tell me which facts in your answer I should double-check.";
  }
  function copy(text, done) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () { School.toast(done || "Copied"); }, function () { School.toast("Select the text and copy it"); });
  }

  var render = function () {
    if (step === 0) return show(
      '<p class="label">Lesson 1 · about 8 minutes</p>' +
      "<h1>Meet the chef.</h1>" +
      '<div class="teaser" aria-hidden="true"><div class="ticket"><div class="th"><span>ORDER #001</span><span>to: the chef</span></div>Plan 5 dinners from what\'s in my fridge.<div class="tf">You order. Claude cooks.</div></div></div>' +
      '<ul class="lines">' +
      "<li><b>Claude is your chef.</b>It has read millions of recipes and cooks anything you order, fast.</li>" +
      "<li><b>It has never tasted food.</b>It cooks from memory of what recipes usually look like.</li>" +
      "<li><b>So once in a while, it invents a dish.</b>And serves it just as proudly as a real one.</li></ul>" +
      '<div class="btns"><button class="btn" data-next type="button">Watch one order</button></div>' +
      '<p class="small">Doing this with your mom or a friend? Tap "Bigger text" at the top.</p>');

    if (step === 1) return show(
      "<h2>Here's an order, and what the chef sends back.</h2>" +
      '<p class="label">The order <span class="sample">Sample</span></p>' +
      '<div class="ticket" aria-label="Sample order"><div class="th"><span>ORDER #001</span><span>2 people</span></div>' +
      "Plan 5 dinners for this week.<br>Fridge: eggs, spinach, rice, cheese.<br>Never use: mushrooms.<br>30 minutes or less." +
      '<div class="tf">Who · what you have · what you hate · how fast</div></div>' +
      '<div class="reply"><p class="who">The chef replies <span class="sample">Sample</span></p><ol>' +
      "<li>Spinach and cheese omelette</li><li>Egg fried rice with spinach</li><li>Cheesy rice bake</li><li>Shakshuka-style eggs (buy tomatoes)</li><li>Spinach quesadillas (buy tortillas)</li></ol></div>" +
      '<p style="margin-top:14px">Four details made that order work: <b>who</b>, <b>what you have</b>, <b>what you hate</b>, <b>how fast</b>.</p>' +
      '<div class="btns"><button class="btn" data-next type="button">Now you order</button></div>');

    if (step === 2) {
      show(
        "<h2>Your turn. What's in your fridge?</h2>" +
        '<p class="muted">Tap what you have. Your order writes itself.</p>' +
        '<div class="fridge" role="group" aria-label="What\'s in your fridge">' +
        FRIDGE.map(function (f) { return '<button type="button" class="chip" aria-pressed="' + (order.items.indexOf(f) >= 0) + '" data-item="' + esc(f) + '">' + esc(f) + "</button>"; }).join("") + "</div>" +
        '<div class="row"><span>How many people?</span><span class="stepper"><button type="button" data-p="-1" aria-label="Fewer people">−</button><output id="ppl">' + order.people + '</output><button type="button" data-p="1" aria-label="More people">+</button></span></div>' +
        '<div class="row"><label for="never">Anything you never eat?</label></div><input type="text" id="never" maxlength="60" placeholder="mushrooms, olives…" value="' + esc(order.never) + '">' +
        '<div class="row"><button type="button" class="chip" id="quick" aria-pressed="' + order.quick + '">30 minutes or less</button></div>' +
        '<p class="label">Your order</p><div class="ticket" id="ticket"></div>' +
        '<div class="btns"><a class="btn" id="open" target="_blank" rel="noopener">Open Claude with my order</a><button class="btn ghost" id="copy" type="button">Copy my order</button></div>' +
        '<p class="small">No Claude account yet? It\'s free at claude.ai. Make one, then come back and tap the button again.</p>' +
        '<div class="btns"><button class="btn ghost" data-next type="button">I got my week →</button></div>');
      function drawTicket(added) {
        var t = document.getElementById("ticket");
        t.innerHTML = '<div class="th"><span>ORDER #002</span><span>' + order.people + (order.people === 1 ? " person" : " people") + "</span></div>" +
          esc(prompt()).replace(/\n/g, "<br>").replace(esc(added || "\u0000"), '<span class="add">' + esc(added || "") + "</span>") +
          '<div class="tf">Your order, ready for the chef</div>';
        document.getElementById("open").href = "https://claude.ai/new?q=" + encodeURIComponent(prompt());
      }
      drawTicket();
      app.querySelectorAll("[data-item]").forEach(function (b) {
        b.onclick = function () {
          var f = b.dataset.item, i = order.items.indexOf(f);
          if (i >= 0) order.items.splice(i, 1); else order.items.push(f);
          b.setAttribute("aria-pressed", String(i < 0)); play("tick", Math.min(order.items.length, 3)); drawTicket(i < 0 ? f : null);
        };
      });
      app.querySelectorAll("[data-p]").forEach(function (b) {
        b.onclick = function () { order.people = Math.max(1, Math.min(8, order.people + Number(b.dataset.p))); document.getElementById("ppl").textContent = order.people; play("pick"); drawTicket(); };
      });
      document.getElementById("never").oninput = function (e) { order.never = e.target.value; drawTicket(); };
      document.getElementById("quick").onclick = function (e) { order.quick = !order.quick; e.target.setAttribute("aria-pressed", String(order.quick)); drawTicket(); };
      document.getElementById("copy").onclick = function () { copy(prompt(), "Order copied. Paste it into Claude."); };
      document.getElementById("open").addEventListener("click", function () { play("share"); });
      return;
    }

    if (step === 3) {
      show(
        "<h2>One of these lines is made up. Which one?</h2>" +
        '<p class="muted">From a chef\'s reply <span class="sample">Sample</span>. Tap the one you wouldn\'t trust.</p>' +
        '<ul class="claims">' +
        '<li><button type="button" data-c="0">Cook the rice: 1 cup rice, 2 cups water, about 18 minutes.</button></li>' +
        '<li><button type="button" data-c="1">This is Grandma Rosa\'s famous Tuesday Rice Bowl, from the 1961 cookbook <i>Kitchen Classics</i>.</button></li>' +
        '<li><button type="button" data-c="0">Wilt the spinach in the hot pan for about a minute.</button></li>' +
        '<li><button type="button" data-c="0">Leftovers keep 3 to 4 days in the fridge.</button></li></ul>' +
        '<div id="fb"></div>');
      var tries = 0;
      app.querySelectorAll("[data-c]").forEach(function (b) {
        b.onclick = function () {
          var fb = document.getElementById("fb");
          if (b.dataset.c === "1") {
            b.classList.add("right"); play("win");
            fb.innerHTML = '<p class="fb good">Yes. "Grandma Rosa" and that cookbook don\'t exist. The chef made them up, and wrote them just as confidently as the true lines.</p>' +
              '<div class="breaks"><b>Your new habit</b>After any answer, ask: <q>Which facts here should I double-check?</q> It will tell you.</div>' +
              '<div class="btns"><button class="btn" data-next type="button">Next</button><button class="btn ghost" id="cq" type="button">Copy that question</button></div>';
            fb.querySelector("[data-next]").onclick = next;
            document.getElementById("cq").onclick = function () { copy("Which facts in your answer should I double-check?"); };
          } else {
            tries++; b.classList.add("wrong"); play("pick");
            fb.innerHTML = '<p class="fb try">' + (tries < 2 ? "That one's true. Try another. Look for something that sounds specific but you couldn't check." : "Hint: a famous name and a book, with a date. Sounds real, right?") + "</p>";
          }
        };
      });
      return;
    }

    if (step === 4) return show(
      "<h2>The chef forgets you after every shift.</h2>" +
      '<ul class="lines">' +
      "<li><b>A new chat starts fresh.</b>Claude only sees what's in this chat: your order, what you pasted, what you said.</li>" +
      "<li><b>Want it to remember you?</b>Claude has a memory setting you can turn on, read and erase. That's Lesson 5.</li></ul>" +
      '<div class="breaks"><b>Where the kitchen idea breaks</b>A real chef knows which dishes are real. This one doesn\'t, and it can\'t taste its own mistakes. That\'s why you taste before you serve.</div>' +
      '<div class="btns"><button class="btn" data-next type="button">Two quick questions</button></div>');

    if (step === 5) {
      var Q = [
        { q: "You start a new chat. Does Claude remember last week's dinner plan?", a: ["Yes, always", "No, not unless memory is on"], ok: 1, why: "Right. A new chat starts fresh unless you turned memory on." },
        { q: "The chef names a famous recipe, its author and a year. What do you do?", a: ["Check it before you share it", "Trust it, it sounds sure"], ok: 0, why: "Right. Sounding sure isn't proof. Ask what to double-check." }
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
    var first = School.mark("l1");
    app.innerHTML = '<section class="step">' +
      '<div class="stamp-wrap"><div class="stamp land" aria-hidden="true">' + School.stampSvg("Meet the chef", 1, true) + "</div></div>" +
      '<h1 style="text-align:center">Lesson 1, stamped.</h1>' +
      '<p class="muted" style="text-align:center">' + (first ? "Your first stamp in the Chef's passport." : "You already had this stamp. Nice refresher.") + "</p>" +
      '<div class="kept"><p><b>You leave with:</b> a week of dinners from your own fridge, and the four-part order: who, what you have, what you hate, how fast.</p>' +
      '<p><b>Your new habit:</b> ask "Which facts should I double-check?"</p></div>' +
      '<div class="btns"><button class="btn" id="save" type="button">Copy my order card</button><a class="btn ghost" href="./">See my Chef\'s passport</a><button class="btn ghost" id="send" type="button">Send this lesson to someone</button></div>' +
      '<div class="btns"><a class="btn ghost" href="lesson-2.html">Lesson 2: Placing your order →</a></div></section>';
    window.scrollTo(0, 0);
    setTimeout(function () { play("stamp"); }, 260);
    document.getElementById("save").onclick = function () { copy("ORDER CARD\nWho is it for?\nWhat do I have?\nWhat do I never want?\nHow fast / how big?\nThen ask: Which facts should I double-check?", "Order card copied"); };
    document.getElementById("send").onclick = function () {
      var url = location.href.split("#")[0];
      if (navigator.share) navigator.share({ title: "Meet the chef", text: "An 8-minute lesson on using AI, like ordering from a chef.", url: url }).catch(function () {});
      else copy(url, "Link copied");
      play("share");
    };
  };
  app.addEventListener("click", function (e) { if (e.target.closest("[data-next]") && e.target.closest(".step") && !e.target.closest("#fb")) next(); });
  document.addEventListener("DOMContentLoaded", render);
})();
