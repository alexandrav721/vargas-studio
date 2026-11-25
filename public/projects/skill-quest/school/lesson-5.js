/* Lesson 5 · Your own station. A chat forgets vs a Project remembers → your family-trip instructions → what belongs in a station → memory and where the kitchen idea breaks → 2 quick checks → stamp.
   Nothing is sent anywhere: the instructions are copied, or the learner opens their own Claude. */
(function () {
  "use strict";
  var app = document.getElementById("app");
  var STEPS = 6, step = 0;
  var LIKES = ["beaches", "museums", "easy walks", "food markets", "theme parks", "nature"];
  var PACES = ["relaxed", "a bit of both", "packed"];
  var trip = { where: "", adults: 2, kids: 1, likes: ["easy walks"], budget: "", never: "", pace: "relaxed" };
  function play(n, x) { if (window.SQSound) window.SQSound.play(n, x); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function prog() { return '<div class="prog"><span>Lesson 5 · ' + (step + 1) + " of " + STEPS + '</span><span class="bar"><i style="width:' + Math.round((step + 1) / STEPS * 100) + '%"></i></span></div>'; }
  function show(html) { app.innerHTML = prog() + '<section class="step">' + html + "</section>"; window.scrollTo(0, 0); try { app.focus({ preventScroll: true }); } catch (e) {} }
  function next() { step++; render(); play("pick"); }
  function instructions() {
    var who = trip.adults + (trip.adults === 1 ? " adult" : " adults") + (trip.kids ? " and " + trip.kids + (trip.kids === 1 ? " kid" : " kids") : "");
    return "This project is our family trip" + (trip.where.trim() ? " to " + trip.where.trim() : "") + ".\n" +
      "Who's going: " + who + ".\n" +
      "We like: " + (trip.likes.length ? trip.likes.join(", ") : "a mix of things") + ".\n" +
      (trip.budget.trim() ? "Budget: " + trip.budget.trim() + ".\n" : "") +
      (trip.never.trim() ? "Never suggest: " + trip.never.trim() + ".\n" : "") +
      "Pace: " + trip.pace + ".\n" +
      "Every answer: keep it short, give times and rough prices, and say what I should book ahead.\n" +
      "If something here is out of date, ask me.";
  }
  function copy(text, done) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () { School.toast(done || "Copied"); }, function () { School.toast("Select the text and copy it"); });
  }

  var render = function () {
    if (step === 0) return show(
      '<p class="label">Lesson 5 · about 12 minutes</p>' +
      "<h1>Your own station.</h1>" +
      '<div class="teaser" aria-hidden="true"><div class="ticket"><div class="th"><span>STATION</span><span>family trip</span></div>5 people · one kid, no nuts · relaxed · $3,000<div class="tf">Set it up once. It remembers.</div></div></div>' +
      '<ul class="lines">' +
      "<li><b>A chat forgets.</b>Every new chat, you explain the trip again.</li>" +
      "<li><b>A Project is a station for one job.</b>The family trip, your garden, your shop. In Claude it’s called a Project.</li>" +
      "<li><b>Set it up once.</b>Short instructions and a few files. Every chat inside it starts out knowing them.</li></ul>" +
      '<div class="ba"><div><p class="label">Before</p><div class="ticket"><div class="th"><span>VAGUE ORDER</span></div>Plan day 2 of our trip.<div class="tf">“Where are you going, who’s coming?”</div></div></div><div class="ba-arrow" aria-hidden="true"></div><div><p class="label">After</p><div class="ticket"><div class="th"><span>FULL ORDER</span></div>Family trip station: 5 people, one kid, no nuts, relaxed, $3,000.<br>Then: plan day 2 of our trip.<div class="tf">A relaxed, nut-free day 2.</div></div></div></div>' +
      '<div class="btns"><button class="btn" data-next type="button">See the difference</button></div>' +
      '<p class="small">Doing this with someone? Tap "Bigger text" at the top.</p>');

    if (step === 1) return show(
      "<h2>Same question. With and without a station.</h2>" +
      '<div class="pair">' +
      '<div><p class="label">A plain chat <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>NEW CHAT</span><span>no station</span></div>Plan day 2 of our trip.<div class="tf">It knows nothing</div></div>' +
      '<div class="reply"><p class="who">The chef replies</p>Happy to help! Where are you going, who’s coming, and what do you like to do?</div></div>' +
      '<div><p class="label">Inside the station <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>FAMILY TRIP</span><span>station</span></div>Plan day 2 of our trip.<div class="tf">It already knows the trip</div></div>' +
      '<div class="reply"><p class="who">The chef replies</p>Day 2, relaxed: 9 am beach walk, nut-free lunch at a market, nap break, 4 pm aquarium (book ahead, about $90 for 5).</div></div>' +
      "</div>" +
      '<p style="margin-top:14px">The station knew who’s coming, the nut allergy, the pace and the budget, because you wrote them down once.</p>' +
      '<div class="btns"><button class="btn" data-next type="button">Build your station</button></div>');

    if (step === 2) {
      show(
        "<h2>Your turn. Write your station’s instructions.</h2>" +
        '<div class="row"><label for="where">Where are you going?</label></div><input type="text" id="where" maxlength="40" placeholder="San Diego" value="' + esc(trip.where) + '">' +
        '<div class="row"><span>Adults</span><span class="stepper"><button type="button" data-s="adults" data-d="-1" aria-label="Fewer adults">−</button><output id="adults">' + trip.adults + '</output><button type="button" data-s="adults" data-d="1" aria-label="More adults">+</button></span></div>' +
        '<div class="row"><span>Kids</span><span class="stepper"><button type="button" data-s="kids" data-d="-1" aria-label="Fewer kids">−</button><output id="kids">' + trip.kids + '</output><button type="button" data-s="kids" data-d="1" aria-label="More kids">+</button></span></div>' +
        '<p class="label" style="margin-top:12px">You like</p><div class="fridge" role="group" aria-label="What you like">' + LIKES.map(function (l) { return '<button type="button" class="chip" aria-pressed="' + (trip.likes.indexOf(l) >= 0) + '" data-like="' + esc(l) + '">' + esc(l) + "</button>"; }).join("") + "</div>" +
        '<div class="row"><label for="budget">Budget (optional)</label></div><input type="text" id="budget" maxlength="30" placeholder="$3,000" value="' + esc(trip.budget) + '">' +
        '<div class="row"><label for="never">Never suggest (allergies, things you hate)</label></div><input type="text" id="never" maxlength="60" placeholder="nuts, long drives" value="' + esc(trip.never) + '">' +
        '<p class="label">Pace</p><div class="fridge" role="group" aria-label="Pace">' + PACES.map(function (p) { return '<button type="button" class="chip" aria-pressed="' + (trip.pace === p) + '" data-pace="' + esc(p) + '">' + esc(p) + "</button>"; }).join("") + "</div>" +
        '<p class="label">Your station’s instructions</p><div class="ticket" id="ticket"></div>' +
        '<div class="btns"><button class="btn" id="copy" type="button">Copy my instructions</button><a class="btn ghost" href="https://claude.ai/projects" target="_blank" rel="noopener">Open Claude Projects</a></div>' +
        '<ol class="small" style="margin:10px 0 0 18px;line-height:1.6"><li>In Claude, open <b>Projects</b> and make a new one called “Family trip”.</li><li>Paste these into its instructions.</li><li>Add a file or two, like the hotel email (take out booking numbers).</li><li>Start every trip chat inside it.</li></ol>' +
        '<div class="btns"><button class="btn ghost" data-next type="button">My station is set →</button></div>');
      function drawTicket(added) {
        var t = document.getElementById("ticket");
        var body = esc(instructions()).replace(/\n/g, "<br>");
        if (added) body = body.replace(esc(added), '<span class="add">' + esc(added) + "</span>");
        t.innerHTML = '<div class="th"><span>STATION</span><span>family trip</span></div>' + body + '<div class="tf">Paste once. Every chat inside knows it.</div>';
      }
      drawTicket();
      document.getElementById("where").oninput = function (e) { trip.where = e.target.value; drawTicket(); };
      document.getElementById("budget").oninput = function (e) { trip.budget = e.target.value; drawTicket(); };
      document.getElementById("never").oninput = function (e) { trip.never = e.target.value; drawTicket(); };
      app.querySelectorAll("[data-s]").forEach(function (b) {
        b.onclick = function () {
          var k = b.dataset.s, min = k === "adults" ? 1 : 0;
          trip[k] = Math.max(min, Math.min(9, trip[k] + Number(b.dataset.d)));
          document.getElementById(k).textContent = trip[k]; play("pick"); drawTicket();
        };
      });
      app.querySelectorAll("[data-like]").forEach(function (b) {
        b.onclick = function () {
          var l = b.dataset.like, i = trip.likes.indexOf(l);
          if (i >= 0) trip.likes.splice(i, 1); else trip.likes.push(l);
          b.setAttribute("aria-pressed", String(i < 0)); play("tick", Math.min(trip.likes.length, 3)); drawTicket(i < 0 ? l : null);
        };
      });
      app.querySelectorAll("[data-pace]").forEach(function (b) {
        b.onclick = function () {
          trip.pace = b.dataset.pace;
          app.querySelectorAll("[data-pace]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          play("tick", 1); drawTicket(trip.pace);
        };
      });
      document.getElementById("copy").onclick = function () { copy(instructions(), "Instructions copied. Paste them into your Project."); play("share"); };
      return;
    }

    if (step === 3) {
      show(
        "<h2>What belongs in your station’s instructions?</h2>" +
        '<ul class="claims">' +
        '<li><button type="button" data-c="0">Today’s question: “What should we do Tuesday?”</button></li>' +
        '<li><button type="button" data-c="1">Who’s going, the budget, the pace and the never list</button></li>' +
        '<li><button type="button" data-c="0">Everyone’s passport numbers, so it has them handy</button></li>' +
        '<li><button type="button" data-c="0">Nothing. It will figure it out.</button></li></ul>' +
        '<div id="fb"></div>');
      var tries = 0;
      app.querySelectorAll("[data-c]").forEach(function (b) {
        b.onclick = function () {
          var fb = document.getElementById("fb");
          if (b.dataset.c === "1") {
            b.classList.add("right"); play("win");
            fb.innerHTML = '<p class="fb good">Yes. Instructions hold what stays true for the whole trip. Today’s question goes in a chat inside the station.</p>' +
              '<div class="breaks"><b>Your new habit</b>Anything you keep re-explaining? Put it in a station once.</div>' +
              '<div class="btns"><button class="btn" data-next type="button">Next</button></div>';
            fb.querySelector("[data-next]").onclick = next;
          } else {
            tries++; b.classList.add("wrong"); play("pick");
            fb.innerHTML = '<p class="fb try">' + (b.textContent.indexOf("passport") >= 0 ? "Never. Passport and booking numbers stay out of stations and chats." : tries < 2 ? "Not quite. Think: what stays true for the whole trip?" : "Hint: the people, the money, the pace, the no’s.") + "</p>";
          }
        };
      });
      return;
    }

    if (step === 4) return show(
      "<h2>A station remembers only what’s inside it.</h2>" +
      '<ul class="lines">' +
      "<li><b>Chats outside the station don’t see it.</b>Start trip chats inside the Project.</li>" +
      "<li><b>Things change. Update it.</b>New dates or a new budget? Edit the instructions, or it will plan from the old ones.</li>" +
      "<li><b>There’s also a memory setting.</b>In Claude’s settings you can turn memory on, see what it remembers, and erase it. Check it now and then.</li></ul>" +
      '<div class="breaks"><b>Where the kitchen idea breaks</b>A real kitchen station has your tools whether you mention them or not. This one only knows what you wrote down, and it won’t notice when your plans change.</div>' +
      '<div class="btns"><button class="btn" data-next type="button">Two quick questions</button></div>');

    if (step === 5) {
      var Q = [
        { q: "You start a new chat outside the Project. Does it know about your trip?", a: ["No", "Yes, Claude knows everything"], ok: 0, why: "Right. Only chats inside the station see its instructions." },
        { q: "Your trip dates changed. Best move?", a: ["Edit the station’s instructions", "Hope it figures it out"], ok: 0, why: "Right. Update it once, and every chat after uses the new dates." }
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
    var first = School.mark("l5");
    app.innerHTML = '<section class="step">' +
      '<div class="stamp-wrap"><div class="stamp land" aria-hidden="true">' + School.stampSvg("Your station", 5, true) + "</div></div>" +
      '<h1 style="text-align:center">Lesson 5, stamped.</h1>' +
      '<p class="muted" style="text-align:center">' + (first ? "Five stamps in your Chef’s passport." : "You already had this stamp. Nice refresher.") + "</p>" +
      '<div class="kept"><p><b>You leave with:</b> a family-trip station that already knows who’s going, the budget, the pace and the never list.</p>' +
      '<p><b>Your new habits:</b> anything you keep re-explaining goes in a station. Update it when plans change.</p></div>' +
      '<div class="btns"><button class="btn" id="save" type="button">Copy my station checklist</button><a class="btn ghost" href="./">See my Chef’s passport</a><button class="btn ghost" id="send" type="button">Send this lesson to someone</button></div>' +
      '<div class="btns"><a class="btn ghost" href="lesson-6.html">Lesson 6: Take-home containers →</a></div></section>';
    window.scrollTo(0, 0);
    setTimeout(function () { play("stamp"); }, 260);
    document.getElementById("save").onclick = function () { copy("STATION CHECKLIST\nOne station per job (trip, garden, shop).\nInstructions: who, budget, pace, never list, how answers should look.\nFiles: helpful ones, with booking and ID numbers taken out.\nStart those chats inside the station.\nUpdate it when plans change.\nCheck Claude's memory setting now and then.", "Station checklist copied"); };
    document.getElementById("send").onclick = function () {
      var url = location.href.split("#")[0];
      if (navigator.share) navigator.share({ title: "Your own station", text: "A 12-minute lesson on setting up Claude once so it remembers your project.", url: url }).catch(function () {});
      else copy(url, "Link copied");
      play("share");
    };
  };
  app.addEventListener("click", function (e) { if (e.target.closest("[data-next]") && e.target.closest(".step") && !e.target.closest("#fb")) next(); });
  document.addEventListener("DOMContentLoaded", render);
})();
