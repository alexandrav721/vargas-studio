/* Lesson 6 · Take-home containers. No container vs a named container → your order with a container → pick the right container → where the kitchen idea breaks → 2 quick checks → stamp.
   Nothing is sent anywhere: the order is copied, or opened in the learner's own Claude. */
(function () {
  "use strict";
  var app = document.getElementById("app");
  var STEPS = 6, step = 0;
  var JOBS = { "a packing list": "a packing list for a 4-day beach trip with 2 kids", "weekly chores": "a weekly chore plan for a family of 4", "moving day": "everything to do the week before we move", "a party": "what to do and buy for a backyard birthday party for 20 people" };
  var BOXES = {
    "a checklist with boxes": "a checklist with ☐ boxes, grouped by section, one item per line",
    "a table": "a table with columns: what, who, when",
    "a text I can send": "a short text message I can paste into our family group chat, under 60 words",
    "a day-by-day list": "a list split by day, Monday to Sunday"
  };
  var order = { job: "a packing list", box: "a checklist with boxes", who: "" };
  function play(n, x) { if (window.SQSound) window.SQSound.play(n, x); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function prog() { return '<div class="prog"><span>Lesson 6 · ' + (step + 1) + " of " + STEPS + '</span><span class="bar"><i style="width:' + Math.round((step + 1) / STEPS * 100) + '%"></i></span></div>'; }
  function show(html) { app.innerHTML = prog() + '<section class="step">' + html + "</section>"; window.scrollTo(0, 0); try { app.focus({ preventScroll: true }); } catch (e) {} }
  function next() { step++; render(); play("pick"); }
  function prompt() {
    return "Make " + JOBS[order.job] + ".\n" +
      (order.who.trim() ? "It's for: " + order.who.trim() + ".\n" : "") +
      "Give it to me as " + BOXES[order.box] + ".\n" +
      "No intro and no closing line. Just the " + order.box.replace(/^a /, "") + ".";
  }
  function copy(text, done) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () { School.toast(done || "Copied"); }, function () { School.toast("Select the text and copy it"); });
  }
  function chips(obj, key, label) {
    return '<div class="fridge" role="group" aria-label="' + label + '">' + Object.keys(obj).map(function (v) {
      return '<button type="button" class="chip" aria-pressed="' + (order[key] === v) + '" data-k="' + key + '" data-v="' + esc(v) + '">' + esc(v) + "</button>";
    }).join("") + "</div>";
  }

  var render = function () {
    if (step === 0) return show(
      '<p class="label">Lesson 6 · about 10 minutes</p>' +
      "<h1>Take-home containers.</h1>" +
      '<div class="teaser" aria-hidden="true"><div class="ticket"><div class="th"><span>TO GO</span><span>packing list</span></div>☐ sunscreen<br>☐ 2 hats<br>☐ snacks for the car<div class="tf">Name the container.</div></div></div>' +
      '<ul class="lines">' +
      "<li><b>Food you can’t carry home is no use.</b>Same with a long answer you can’t print, paste or send.</li>" +
      "<li><b>Name the container.</b>A checklist, a table, a short text, a day-by-day list.</li>" +
      "<li><b>Say what to leave out.</b>“No intro, no closing line” gets you just the useful part.</li></ul>" +
      '<div class="btns"><button class="btn" data-next type="button">See the difference</button></div>' +
      '<p class="small">Doing this with someone? Tap "Bigger text" at the top.</p>');

    if (step === 1) return show(
      "<h2>Same order. With and without a container.</h2>" +
      '<div class="pair">' +
      '<div><p class="label">No container <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>ORDER A</span><span>no container</span></div>What should we pack for a beach trip?<div class="tf">Shape not named</div></div>' +
      '<div class="reply"><p class="who">The chef replies</p>Great question! A beach trip is a wonderful way to relax. First, you’ll want to think about sun protection, which is very important…</div></div>' +
      '<div><p class="label">Named container <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>ORDER B</span><span>checklist</span></div>Packing list for a 4-day beach trip with 2 kids. A checklist with boxes, by section. No intro.<div class="tf">Shape named</div></div>' +
      '<div class="reply"><p class="who">The chef replies</p><b>Sun</b><br>☐ sunscreen ☐ 2 kids’ hats ☐ rash guards<br><b>Car</b><br>☐ snacks ☐ wipes ☐ chargers</div></div>' +
      "</div>" +
      '<p style="margin-top:14px">Order B came back ready to print or paste into Notes. Naming the container did that.</p>' +
      '<div class="btns"><button class="btn" data-next type="button">Now you order</button></div>');

    if (step === 2) {
      show(
        "<h2>Your turn. What do you need, in what shape?</h2>" +
        '<p class="label">The job</p>' + chips(JOBS, "job", "The job") +
        '<div class="row"><label for="who">Who is it for? (optional)</label></div><input type="text" id="who" maxlength="50" placeholder="me, my partner and 2 kids" value="' + esc(order.who) + '">' +
        '<p class="label" style="margin-top:14px">The container</p>' + chips(BOXES, "box", "The container") +
        '<p class="label">Your order</p><div class="ticket" id="ticket"></div>' +
        '<div class="btns"><a class="btn" id="open" target="_blank" rel="noopener">Open Claude with my order</a><button class="btn ghost" id="copy" type="button">Copy my order</button></div>' +
        '<p class="small">Want a file? Add: “Make it a document I can download.” Claude can often do that.</p>' +
        '<div class="btns"><button class="btn ghost" data-next type="button">I got my list →</button></div>');
      function drawTicket(added) {
        var t = document.getElementById("ticket");
        var body = esc(prompt()).replace(/\n/g, "<br>");
        if (added) body = body.replace(esc(added), '<span class="add">' + esc(added) + "</span>");
        t.innerHTML = '<div class="th"><span>ORDER #010</span><span>to go</span></div>' + body + '<div class="tf">Your order, in a container</div>';
        document.getElementById("open").href = "https://claude.ai/new?q=" + encodeURIComponent(prompt());
      }
      drawTicket();
      app.querySelectorAll("[data-k]").forEach(function (b) {
        b.onclick = function () {
          var k = b.dataset.k; order[k] = b.dataset.v;
          app.querySelectorAll('[data-k="' + k + '"]').forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          play("tick", 1); drawTicket(k === "job" ? JOBS[order.job] : BOXES[order.box]);
        };
      });
      document.getElementById("who").oninput = function (e) { order.who = e.target.value; drawTicket(); };
      document.getElementById("copy").onclick = function () { copy(prompt(), "Order copied. Paste it into Claude."); };
      document.getElementById("open").addEventListener("click", function () { play("share"); });
      return;
    }

    if (step === 3) {
      var R = [
        { s: "You want the chores on the fridge, one box to tick per job.", a: ["a table", "a checklist with boxes", "a long explanation"], ok: 1 },
        { s: "You want to tell the family group chat the plan for Saturday.", a: ["a short text I can send", "a table", "a 5-page document"], ok: 0 },
        { s: "You want to see who does what, and when.", a: ["a short text", "a table with who and when", "a poem"], ok: 1 }
      ], got = 0;
      show("<h2>Pick the right container.</h2>" + R.map(function (x, i) {
        return '<div style="margin:16px 0"><p><b>' + (i + 1) + ". " + x.s + '</b></p><ul class="claims">' + x.a.map(function (a, j) { return '<li><button type="button" data-r="' + i + '" data-a="' + j + '">' + a + "</button></li>"; }).join("") + '</ul><div id="r' + i + '"></div></div>';
      }).join("") + '<div id="fb"></div>');
      var done = {};
      app.querySelectorAll("[data-r]").forEach(function (b) {
        b.onclick = function () {
          var i = +b.dataset.r, x = R[i];
          if (done[i]) return;
          if (+b.dataset.a === x.ok) {
            done[i] = 1; got++; b.classList.add("right"); play("tick", got);
            document.getElementById("r" + i).innerHTML = '<p class="fb good">Yes.</p>';
            if (got === R.length) {
              play("win");
              var fb = document.getElementById("fb");
              fb.innerHTML = '<div class="breaks"><b>Your new habit</b>End every order with the container: <q>as a checklist</q>, <q>as a table</q>, <q>as a text I can send</q>.</div><div class="btns"><button class="btn" data-next type="button">Next</button></div>';
              fb.querySelector("[data-next]").onclick = next;
            }
          } else { b.classList.add("wrong"); play("pick"); document.getElementById("r" + i).innerHTML = '<p class="fb try">Think about where it’s going: the fridge, a chat, a plan.</p>'; }
        };
      });
      return;
    }

    if (step === 4) return show(
      "<h2>Some containers leak on the way home.</h2>" +
      '<ul class="lines">' +
      "<li><b>Tables and boxes can break when you paste.</b>If a table turns into a mess in your Notes app, ask for “plain text, one item per line”.</li>" +
      "<li><b>Read it before you share it.</b>A neat checklist can still have a wrong item. Taste it (Lesson 4).</li></ul>" +
      '<div class="breaks"><b>Where the kitchen idea breaks</b>A real container fits any food. Here, the shape has to fit where it’s going: the fridge, a group chat, a spreadsheet. Name the place, and the chef picks a shape that travels.</div>' +
      '<div class="btns"><button class="btn" data-next type="button">Two quick questions</button></div>');

    if (step === 5) {
      var Q = [
        { q: "Your table looks like a mess after you paste it. What do you ask?", a: ["“Give it to me as plain text, one item per line”", "“Try harder”"], ok: 0, why: "Right. Name a simpler container that travels." },
        { q: "Which order comes back ready to use?", a: ["“Help me plan the party”", "“Party plan as a checklist by day, no intro”"], ok: 1, why: "Right. The job, the container, and what to leave out." }
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
    var first = School.mark("l6");
    app.innerHTML = '<section class="step">' +
      '<div class="stamp-wrap"><div class="stamp land" aria-hidden="true">' + School.stampSvg("Take-home", 6, true) + "</div></div>" +
      '<h1 style="text-align:center">Lesson 6, stamped.</h1>' +
      '<p class="muted" style="text-align:center">' + (first ? "Six stamps. Two to go." : "You already had this stamp. Nice refresher.") + "</p>" +
      '<div class="kept"><p><b>You leave with:</b> a checklist you can print, paste or send to your people.</p>' +
      '<p><b>Your new habit:</b> end every order with the container and “no intro”.</p></div>' +
      '<div class="btns"><button class="btn" id="save" type="button">Copy my container list</button><a class="btn ghost" href="lesson-7.html">Lesson 7: Pantry and meal kits →</a><a class="btn ghost" href="./">See my Chef’s passport</a><button class="btn ghost" id="send" type="button">Send this lesson to someone</button></div></section>';
    window.scrollTo(0, 0);
    setTimeout(function () { play("stamp"); }, 260);
    document.getElementById("save").onclick = function () { copy("TAKE-HOME CONTAINERS\nFor the fridge: a checklist with boxes\nFor a group chat: a short text under 60 words\nFor who-does-what: a table (who, what, when)\nFor a week: a day-by-day list\nAlways add: No intro, no closing line.\nPaste breaks it? Ask for plain text, one item per line.", "Container list copied"); };
    document.getElementById("send").onclick = function () {
      var url = location.href.split("#")[0];
      if (navigator.share) navigator.share({ title: "Take-home containers", text: "A 10-minute lesson on getting AI answers in a shape you can actually use.", url: url }).catch(function () {});
      else copy(url, "Link copied");
      play("share");
    };
  };
  app.addEventListener("click", function (e) { if (e.target.closest("[data-next]") && e.target.closest(".step") && !e.target.closest("#fb")) next(); });
  document.addEventListener("DOMContentLoaded", render);
})();
