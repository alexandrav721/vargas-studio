/* Lesson 2 · Placing your order. Vague vs detailed order → your order (a birthday message) → send it back → where the kitchen idea breaks → 2 quick checks → stamp.
   Nothing is sent anywhere: the order is copied, or opened in the learner's own Claude. */
(function () {
  "use strict";
  var app = document.getElementById("app");
  var STEPS = 6, step = 0;
  var WHO = ["my mom", "my best friend", "my sister", "my brother", "my partner", "a coworker"];
  var TONES = ["funny", "warm", "short and sweet", "a little sappy"];
  var LENGTHS = ["2 lines", "a short card", "a long text"];
  var order = { who: "my best friend", name: "", age: "", memory: "", tone: "funny", length: "2 lines" };
  function play(n, x) { if (window.SQSound) window.SQSound.play(n, x); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function prog() { return '<div class="prog"><span>Lesson 2 · ' + (step + 1) + " of " + STEPS + '</span><span class="bar"><i style="width:' + Math.round((step + 1) / STEPS * 100) + '%"></i></span></div>'; }
  function show(html) { app.innerHTML = prog() + '<section class="step">' + html + "</section>"; window.scrollTo(0, 0); try { app.focus({ preventScroll: true }); } catch (e) {} }
  function next() { step++; render(); play("pick"); }
  function prompt() {
    var who = order.who + (order.name.trim() ? ", " + order.name.trim() : "");
    return "Write a birthday message for " + who + (order.age.trim() ? ", who is turning " + order.age.trim() : "") + ".\n" +
      (order.memory.trim() ? "Mention this real memory: " + order.memory.trim() + ".\n" : "") +
      "Tone: " + order.tone + ".\n" +
      "Length: " + order.length + ".\n" +
      "Sound like a real person, not a greeting card.\n" +
      "Ask me anything you need before you write.";
  }
  function copy(text, done) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () { School.toast(done || "Copied"); }, function () { School.toast("Select the text and copy it"); });
  }
  function chips(list, key, label) {
    return '<div class="fridge" role="group" aria-label="' + label + '">' + list.map(function (v) {
      return '<button type="button" class="chip" aria-pressed="' + (order[key] === v) + '" data-k="' + key + '" data-v="' + esc(v) + '">' + esc(v) + "</button>";
    }).join("") + "</div>";
  }

  var render = function () {
    if (step === 0) return show(
      '<p class="label">Lesson 2 · about 10 minutes</p>' +
      "<h1>Placing your order.</h1>" +
      '<div class="teaser" aria-hidden="true"><div class="ticket"><div class="th"><span>ORDER #003</span><span>to: the chef</span></div>A birthday message for my sister Ana, turning 40. Funny, not sappy. 3 lines.<div class="tf">Details are flavor.</div></div></div>' +
      '<ul class="lines">' +
      "<li><b>A vague order gets a vague dish.</b>Ask for “a birthday message” and you get one from a gas-station card.</li>" +
      "<li><b>Details are flavor.</b>Who it’s for, one true memory, the tone, how long.</li>" +
      "<li><b>You can send it back.</b>“Make it shorter” is a normal thing to tell this chef.</li></ul>" +
      '<div class="btns"><button class="btn" data-next type="button">Taste the difference</button></div>' +
      '<p class="small">Doing this with someone? Tap "Bigger text" at the top.</p>');

    if (step === 1) return show(
      "<h2>Same chef. Two orders.</h2>" +
      '<div class="pair">' +
      '<div><p class="label">Order A <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>ORDER A</span><span>vague</span></div>Write a birthday message.<div class="tf">No details</div></div>' +
      '<div class="reply"><p class="who">The chef replies</p>Happy birthday! Wishing you a wonderful year filled with joy, laughter and love.</div></div>' +
      '<div><p class="label">Order B <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>ORDER B</span><span>4 details</span></div>Birthday message for my sister Ana, turning 40. Mention the road trip when the car died in Ohio. Funny. 3 lines.<div class="tf">Who · a memory · tone · length</div></div>' +
      '<div class="reply"><p class="who">The chef replies</p>Happy 40th, Ana! Still the only person who could make a broken-down car in Ohio the best day of the trip. Here’s to 40 more years of you getting us lost.</div></div>' +
      "</div>" +
      '<p style="margin-top:14px">Order B won because of four details: <b>who</b>, <b>one true memory</b>, <b>the tone</b>, <b>how long</b>. The memory did the most work.</p>' +
      '<div class="btns"><button class="btn" data-next type="button">Now you order</button></div>');

    if (step === 2) {
      show(
        "<h2>Your turn. Who’s the birthday for?</h2>" +
        '<p class="muted">Tap and type. Your order writes itself.</p>' +
        chips(WHO, "who", "Who it's for") +
        '<div class="row"><label for="nm">Their name (optional)</label></div><input type="text" id="nm" maxlength="30" placeholder="Ana" value="' + esc(order.name) + '">' +
        '<div class="row"><label for="age">Turning (optional)</label></div><input type="text" id="age" maxlength="8" placeholder="40" inputmode="numeric" value="' + esc(order.age) + '">' +
        '<div class="row"><label for="mem">One true memory with them</label></div><input type="text" id="mem" maxlength="100" placeholder="the road trip when the car died" value="' + esc(order.memory) + '">' +
        '<p class="label" style="margin-top:14px">Tone</p>' + chips(TONES, "tone", "Tone") +
        '<p class="label">Length</p>' + chips(LENGTHS, "length", "Length") +
        '<p class="label">Your order</p><div class="ticket" id="ticket"></div>' +
        '<div class="btns"><a class="btn" id="open" target="_blank" rel="noopener">Open Claude with my order</a><button class="btn ghost" id="copy" type="button">Copy my order</button></div>' +
        '<p class="small">Keep private things out of any order: passwords, card numbers, ID numbers.</p>' +
        '<div class="btns"><button class="btn ghost" data-next type="button">I got my message →</button></div>');
      function drawTicket(added) {
        var t = document.getElementById("ticket");
        var body = esc(prompt()).replace(/\n/g, "<br>");
        if (added) body = body.replace(esc(added), '<span class="add">' + esc(added) + "</span>");
        t.innerHTML = '<div class="th"><span>ORDER #004</span><span>birthday</span></div>' + body + '<div class="tf">Your order, ready for the chef</div>';
        document.getElementById("open").href = "https://claude.ai/new?q=" + encodeURIComponent(prompt());
      }
      drawTicket();
      app.querySelectorAll("[data-k]").forEach(function (b) {
        b.onclick = function () {
          var k = b.dataset.k; order[k] = b.dataset.v;
          app.querySelectorAll('[data-k="' + k + '"]').forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          play("tick", 1); drawTicket(order[k]);
        };
      });
      [["nm", "name"], ["age", "age"], ["mem", "memory"]].forEach(function (p) {
        document.getElementById(p[0]).oninput = function (e) { order[p[1]] = e.target.value; drawTicket(); };
      });
      document.getElementById("copy").onclick = function () { copy(prompt(), "Order copied. Paste it into Claude."); };
      document.getElementById("open").addEventListener("click", function () { play("share"); });
      return;
    }

    if (step === 3) {
      show(
        "<h2>The dish came back wrong. Send it back.</h2>" +
        '<div class="reply"><p class="who">The chef replies <span class="sample">Sample</span></p>Dearest friend, on this most special of days, I find myself reflecting upon the countless treasured moments we have shared together throughout the years…</div>' +
        '<p class="muted" style="margin-top:12px">Too long and too stiff. What do you say next, in the same chat?</p>' +
        '<ul class="claims">' +
        '<li><button type="button" data-c="0">“Try again.”</button></li>' +
        '<li><button type="button" data-c="1">“Make it 2 lines, funnier, and mention the road trip.”</button></li>' +
        '<li><button type="button" data-c="0">“This is bad.”</button></li>' +
        '<li><button type="button" data-c="0">Start a new chat and type the whole order again.</button></li></ul>' +
        '<div id="fb"></div>');
      var tries = 0;
      app.querySelectorAll("[data-c]").forEach(function (b) {
        b.onclick = function () {
          var fb = document.getElementById("fb");
          if (b.dataset.c === "1") {
            b.classList.add("right"); play("win");
            fb.innerHTML = '<p class="fb good">Yes. Say exactly what to change: shorter, funnier, one detail. The chef keeps everything else from your order.</p>' +
              '<div class="breaks"><b>Your new habit</b>Send it back with one clear change: <q>Shorter.</q> <q>Warmer.</q> <q>Mention ___.</q></div>' +
              '<div class="btns"><button class="btn" data-next type="button">Next</button></div>';
            fb.querySelector("[data-next]").onclick = next;
          } else {
            tries++; b.classList.add("wrong"); play("pick");
            fb.innerHTML = '<p class="fb try">' + (tries < 2 ? "The chef can’t guess what you didn’t like. Try one that says what to change." : "Hint: the best answer names the length, the tone and a detail.") + "</p>";
          }
        };
      });
      return;
    }

    if (step === 4) return show(
      "<h2>A real chef asks questions. This one usually won’t.</h2>" +
      '<ul class="lines">' +
      "<li><b>Claude fills gaps with guesses.</b>If you leave out the tone, it picks one for you, usually “greeting card”.</li>" +
      "<li><b>So invite questions.</b>End your order with: <q>Ask me anything you need before you write.</q></li></ul>" +
      '<div class="breaks"><b>Where the kitchen idea breaks</b>A real chef would ask “for who?” before cooking. Claude will happily cook first. You have to ask it to ask.</div>' +
      '<div class="btns"><button class="btn" data-next type="button">Two quick questions</button></div>');

    if (step === 5) {
      var Q = [
        { q: "Your message came back too formal. Best move?", a: ["Start a new chat and retype everything", "Say “Make it warmer and shorter” in the same chat"], ok: 1, why: "Right. Send it back in the same chat. The chef remembers your order there." },
        { q: "Which order gets a better birthday message?", a: ["“A birthday message”", "“A funny 3-line message for my sister Ana, who still owes me for the concert tickets”"], ok: 1, why: "Right. Who, one true detail, a tone, a length." }
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
    var first = School.mark("l2");
    app.innerHTML = '<section class="step">' +
      '<div class="stamp-wrap"><div class="stamp land" aria-hidden="true">' + School.stampSvg("Your order", 2, true) + "</div></div>" +
      '<h1 style="text-align:center">Lesson 2, stamped.</h1>' +
      '<p class="muted" style="text-align:center">' + (first ? "Two stamps in your Chef’s passport." : "You already had this stamp. Nice refresher.") + "</p>" +
      '<div class="kept"><p><b>You leave with:</b> a birthday message that sounds like you, and an order with four details: who, one true memory, the tone, how long.</p>' +
      '<p><b>Your new habits:</b> end with "Ask me anything you need first." Send it back with one clear change.</p></div>' +
      '<div class="btns"><button class="btn" id="save" type="button">Copy my order card</button><a class="btn ghost" href="lesson-3.html">Lesson 3: Make it like this →</a><a class="btn ghost" href="./">See my Chef’s passport</a><button class="btn ghost" id="send" type="button">Send this lesson to someone</button></div></section>';
    window.scrollTo(0, 0);
    setTimeout(function () { play("stamp"); }, 260);
    document.getElementById("save").onclick = function () { copy("ORDER CARD, ROUND 2\nWho is it for, and one true detail?\nWhat tone?\nHow long?\nEnd with: Ask me anything you need first.\nThen send it back with one change: shorter / warmer / mention ___.", "Order card copied"); };
    document.getElementById("send").onclick = function () {
      var url = location.href.split("#")[0];
      if (navigator.share) navigator.share({ title: "Placing your order", text: "A 10-minute lesson on getting AI to write what you actually mean.", url: url }).catch(function () {});
      else copy(url, "Link copied");
      play("share");
    };
  };
  app.addEventListener("click", function (e) { if (e.target.closest("[data-next]") && e.target.closest(".step") && !e.target.closest("#fb")) next(); });
  document.addEventListener("DOMContentLoaded", render);
})();
