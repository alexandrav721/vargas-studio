/* The Builder's Kitchen (AI Made EZ · Level 2): one engine for every lesson.
   A lesson is data (window.BK_LESSON). Steps: intro → example → build (live ticket) → game → breaks → quiz → stamp.
   Uses school.js for the stamp drawing and toast; keeps its own passport (this device only). */
(function () {
  "use strict";
  var KEY = "smez-builders-v1";
  var TRACK = [
    { n: 1, id: "b1", short: "The kitchen", name: "How AI kitchens work", href: "lesson-1.html", use: "someone says “we hit the token limit”" },
    { n: 2, id: "b2", short: "Order window", name: "The order window (API)", href: "lesson-2.html", use: "a vendor says “we just call the API”" },
    { n: 3, id: "b3", short: "House rules", name: "House rules (prompting)", href: "lesson-3.html", use: "you set up a bot’s instructions" },
    { n: 4, id: "b4", short: "Appliances", name: "The chef’s appliances (tools)", href: "lesson-4.html", use: "someone says “it can use tools”" },
    { n: 5, id: "b5", short: "Outlets", name: "Standard outlets (MCP)", href: "lesson-5.html", use: "IT asks which connectors to turn on" },
    { n: 6, id: "b6", short: "Recipe binder", name: "The recipe binder (RAG)", href: "lesson-6.html", use: "someone says “we’ll train it on our docs”" },
    { n: 7, id: "b7", short: "Head chef", name: "The head chef (agents)", href: "lesson-7.html", use: "everyone is pitching “agents”" },
    { n: 8, id: "b8", short: "Your kitchen", name: "A chef in your kitchen (Claude Code)", href: "lesson-8.html", use: "a developer mentions Claude Code or skills" },
    { n: 9, id: "b9", short: "Taste tests", name: "Taste tests at scale (evals)", href: "lesson-9.html", use: "someone asks “is the new version better?”" },
    { n: 10, id: "b10", short: "Graduation", name: "Plan your own kitchen", href: "lesson-10.html", use: "you plan your own AI project" }
  ];
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } }
  function write(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function play(n, x) { if (window.SQSound) window.SQSound.play(n, x); }
  function copy(text, done) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () { School.toast(done || "Copied"); }, function () { School.toast("Select the text and copy it"); });
  }
  function ticket(head, right, body, foot, id) {
    return '<div class="ticket"' + (id ? ' id="' + id + '"' : "") + '><div class="th"><span>' + esc(head) + "</span><span>" + esc(right || "") + "</span></div>" + body + (foot ? '<div class="tf">' + esc(foot) + "</div>" : "") + "</div>";
  }
  function termChips(terms) {
    return '<div class="terms">' + terms.map(function (t) { return '<a class="term" href="glossary.html#' + esc(t.toLowerCase().replace(/[^a-z0-9]+/g, "-")) + '">' + esc(t) + "</a>"; }).join("") + "</div>";
  }

  window.BK = {
    TRACK: TRACK, KEY: KEY, done: read, esc: esc, ticket: ticket, termChips: termChips,
    mark: function (id) { var s = read(); var first = !s[id]; if (first) { s[id] = new Date().toISOString().slice(0, 10); write(s); } return first; },
    run: function (L) {
      var app = document.getElementById("app");
      var STEPS = 6, step = 0, guessed = null, _g = L.guess && (L.guess.opts = L.guess.opts.map(function (o) { return [Math.random(), o]; }).sort(function (a, b) { return a[0] - b[0]; }).map(function (x) { return x[1]; })), state = JSON.parse(JSON.stringify(L.build.state || {}));
      function prog() { return '<div class="prog"><span>Lesson ' + L.n + " · " + (step + 1) + " of " + STEPS + '</span><span class="bar"><i style="width:' + Math.round((step + 1) / STEPS * 100) + '%"></i></span></div>'; }
      function show(html) { app.innerHTML = prog() + '<section class="step">' + html + "</section>"; window.scrollTo(0, 0); try { app.focus({ preventScroll: true }); } catch (e) {} }
      function next() { step++; render(); play("pick"); }
      function nextBtn(label, ghost) { return '<div class="btns"><button class="btn' + (ghost ? " ghost" : "") + '" data-next type="button">' + esc(label) + "</button></div>"; }

      /* games: "pick" (one right), "tapall" (find every right one), "match" (term → kitchen meaning) */
      function game(G) {
        if (G.options && !G._shuffled) { G.options = G.options.map(function (o) { return [Math.random(), o]; }).sort(function (a, b) { return a[0] - b[0]; }).map(function (x) { return x[1]; }); G._shuffled = 1; }
        var fbDone = function (fb) {
          play("win");
          fb.insertAdjacentHTML("beforeend", (G.habit ? '<div class="breaks"><b>' + esc(G.habitTitle || "Remember") + "</b>" + G.habit + "</div>" : "") + '<div class="btns"><button class="btn" id="gnext" type="button">Next</button></div>');
          document.getElementById("gnext").onclick = next;
        };
        if (G.type === "pick") {
          show("<h2>" + esc(G.title) + "</h2>" + (G.lead ? '<p class="muted">' + G.lead + "</p>" : "") +
            '<ul class="claims">' + G.options.map(function (o, i) { return '<li><button type="button" data-o="' + i + '">' + o[0] + "</button></li>"; }).join("") + '</ul><div id="fb" role="status" aria-live="polite"></div>');
          var tries = 0;
          app.querySelectorAll("[data-o]").forEach(function (b) {
            b.onclick = function () {
              var o = G.options[+b.dataset.o], fb = document.getElementById("fb");
              if (document.getElementById("gnext")) return;
              if (o[1]) { b.classList.add("right"); fb.innerHTML = '<p class="fb good">' + G.right + "</p>"; fbDone(fb); }
              else { tries++; b.classList.add("wrong"); play("pick"); fb.innerHTML = '<p class="fb try">' + (o[2] || (tries < 2 ? G.wrong : G.hint)) + "</p>"; }
            };
          });
          return;
        }
        if (G.type === "tapall") {
          var need = G.options.filter(function (o) { return o[1]; }).length, found = 0;
          show("<h2>" + esc(G.title) + "</h2>" + '<p class="muted">' + G.lead.replace("{n}", need) + "</p>" +
            '<ul class="claims">' + G.options.map(function (o, i) { return '<li><button type="button" data-o="' + i + '">' + o[0] + "</button></li>"; }).join("") + '</ul><div id="fb" role="status" aria-live="polite"></div>');
          app.querySelectorAll("[data-o]").forEach(function (b) {
            b.onclick = function () {
              var o = G.options[+b.dataset.o], fb = document.getElementById("fb");
              if (b.classList.contains("right") || document.getElementById("gnext")) return;
              if (o[1]) {
                b.classList.add("right"); found++; play("tick", found);
                if (found === need) { fb.innerHTML = '<p class="fb good">' + G.right + "</p>"; fbDone(fb); }
                else fb.innerHTML = '<p class="fb good">Yes. ' + (need - found) + " more.</p>";
              } else { b.classList.add("wrong"); play("pick"); fb.innerHTML = '<p class="fb try">' + (o[2] || G.wrong) + "</p>"; }
            };
          });
          return;
        }
        if (G.type === "match") {
          var order = G.pairs.map(function (p, i) { return i; }).sort(function (a, b) { return ((a * 7 + 3) % G.pairs.length) - ((b * 7 + 3) % G.pairs.length); });
          var pickedTerm = null, matched = 0;
          show("<h2>" + esc(G.title) + "</h2>" + '<p class="muted">' + G.lead + "</p>" +
            '<div class="match"><div class="col" aria-label="Terms">' + G.pairs.map(function (p, i) { return '<button type="button" class="mt" data-t="' + i + '">' + esc(p[0]) + "</button>"; }).join("") + "</div>" +
            '<div class="col" aria-label="Kitchen meanings">' + order.map(function (i) { return '<button type="button" class="mm" data-m="' + i + '">' + esc(G.pairs[i][1]) + "</button>"; }).join("") + "</div></div>" +
            '<div id="fb" role="status" aria-live="polite"><p class="fb try" style="visibility:hidden">.</p></div>');
          app.querySelectorAll("[data-t]").forEach(function (b) {
            b.onclick = function () {
              if (b.classList.contains("right")) return;
              app.querySelectorAll("[data-t]").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
              b.setAttribute("aria-pressed", "true"); pickedTerm = +b.dataset.t; play("pick");
            };
          });
          app.querySelectorAll("[data-m]").forEach(function (b) {
            b.onclick = function () {
              var fb = document.getElementById("fb");
              if (b.classList.contains("right")) return;
              if (pickedTerm === null) { fb.innerHTML = '<p class="fb try">Tap a term on the left first.</p>'; return; }
              if (+b.dataset.m === pickedTerm) {
                b.classList.add("right"); var t = app.querySelector('[data-t="' + pickedTerm + '"]'); t.classList.add("right"); t.setAttribute("aria-pressed", "false");
                matched++; pickedTerm = null; play("tick", matched);
                if (matched === G.pairs.length) { fb.innerHTML = '<p class="fb good">' + G.right + "</p>"; fbDone(fb); }
                else fb.innerHTML = '<p class="fb good">Match. ' + (G.pairs.length - matched) + " to go.</p>";
              } else { b.classList.add("wrong"); setTimeout(function () { b.classList.remove("wrong"); }, 600); play("pick"); fb.innerHTML = '<p class="fb try">Not that one. Try another.</p>'; }
            };
          });
        }
      }

      var render = function () {
        if (step === 0 && L.guess && guessed === null) {
          show('<p class="label">Lesson ' + L.n + " · about " + L.mins + " minutes</p>" + "<h1>" + esc(L.title) + "</h1>" +
            '<p class="label" style="margin-top:14px">Quick guess.</p><p><b>' + L.guess.q + '</b></p><ul class="claims">' +
            L.guess.opts.map(function (o, j) { return '<li><button type="button" data-g="' + j + '">' + o[0] + "</button></li>"; }).join("") + "</ul>");
          app.querySelectorAll("[data-g]").forEach(function (b) { b.onclick = function () { guessed = +b.dataset.g; play(L.guess.opts[guessed][1] ? "tick" : "pick", 1); render(); }; });
          return;
        }
        if (step === 0) return show(
          '<p class="label">Lesson ' + L.n + " · about " + L.mins + " minutes</p>" +
          "<h1>" + esc(L.title) + "</h1>" +
          (L.guess ? '<p class="fb ' + (L.guess.opts[guessed][1] ? "good\">Good guess. " : "try\">Not quite. ") + L.guess.reveal + "</p>" : "") +
          ((window.BK_DIAGRAMS && window.BK_DIAGRAMS[L.n]) || '<div class="teaser" aria-hidden="true">' + ticket(L.teaser[0], L.teaser[1], L.teaser[2], L.teaser[3]) + "</div>") +
          '<ul class="lines">' + L.lines.slice(0, 2).map(function (x) { return "<li><b>" + x[0] + "</b>" + x[1] + "</li>"; }).join("") + "</ul>" +
          '<p class="label" style="margin-top:16px">Words you’ll know by the end</p>' + termChips(L.terms) +
          nextBtn(L.startLabel || "Show me") +
          '<p class="small">Doing this with someone? Tap "Bigger text" at the top.</p>');

        if (step === 1) return show("<h2>" + esc(L.example.title) + "</h2>" + (L.lines[2] ? '<ul class="lines"><li><b>' + L.lines[2][0] + "</b>" + L.lines[2][1] + "</li></ul>" : "") + L.example.html + nextBtn(L.example.next || "Now you try"));

        if (step === 2) {
          var B = L.build;
          if (B.vendor && !state.mode) { state.mode = "make"; state.aud = "business"; }
          var VQ = window.BK_VENDOR && window.BK_VENDOR[L.n];
          var vqList = function (s) { return VQ ? VQ.q.concat(s.aud === "school" && VQ.school ? [VQ.school] : []) : []; };
          var vqText = function (s) { return "Questions for the vendor (" + B.vendor[0] + ")\n\n" + vqList(s).map(function (x, i) { return (i + 1) + ". " + x[0] + "\n   Good answer: " + x[1] + "\n   Red flag: " + x[2]; }).join("\n") + "\n\nFrom AI Made EZ, Builder’s Kitchen"; };
          var T = function (s) {
            if (s.mode !== "vendor") return B.text(s);
            return "A vendor is pitching me a product that uses " + B.vendor[0] + ". I don't code.\n" +
              "Write 5 short questions I should ask them, in plain words. For each: what a good answer sounds like, and a red-flag answer.\n" +
              "Make sure the questions cover: " + B.vendor[1] + "." + (s.aud === "school" ? "\nWe're a school district: include student data and privacy." : "");
          };
          var modes = B.vendor ? '<div class="fridge" role="group" aria-label="Ticket type"><button type="button" class="chip" data-set="mode" data-v="make" aria-pressed="' + (state.mode !== "vendor") + '">Try it in Claude</button><button type="button" class="chip" data-set="mode" data-v="vendor" aria-pressed="' + (state.mode === "vendor") + '">Vendor questions</button></div>' : "";
          show("<h2>" + esc(B.title) + "</h2>" + (B.lead ? '<p class="muted">' + B.lead + "</p>" : "") + modes + '<div id="ctl"' + (state.mode === "vendor" ? " hidden" : "") + ">" + B.controls(state, esc) + "</div>" +
            (VQ ? '<div id="vq" hidden><div class="fridge" role="group" aria-label="Who you are"><button type="button" class="chip" data-set="aud" data-v="business" aria-pressed="true">A business</button><button type="button" class="chip" data-set="aud" data-v="school" aria-pressed="false">A school</button></div><ol class="vq" id="vqol"></ol><p class="small">A starting list, not legal advice. Schools: check with your privacy lead.</p><p class="label">Want them tailored? Your ticket for Claude:</p></div>' : "") +
            '<p class="label">' + esc(B.ticketLabel || "Your ticket") + '</p><div id="ticket"></div>' +
            '<div class="btns">' + (B.claude ? '<a class="btn" id="open" target="_blank" rel="noopener">' + esc(B.claude) + "</a>" : "") + '<button class="btn ' + (B.claude ? "ghost" : "") + '" id="copy" type="button">' + esc(B.copyLabel || "Copy my ticket") + "</button></div>" +
            (B.after ? '<p class="small">' + B.after + "</p>" : "") +
            nextBtn(B.done || "Done →", true));
          var draw = function (added) {
            var text = T(state), vend = state.mode === "vendor"; var h2 = app.querySelector(".step h2"), ld = app.querySelector(".step > p.muted"); if (h2) h2.textContent = vend ? "Your turn. Questions to ask a vendor." : B.title; if (ld) ld.hidden = vend; var c = document.getElementById("ctl"); if (c) c.hidden = vend;
            var vq = document.getElementById("vq"); if (vq) { vq.hidden = !vend; document.getElementById("vqol").innerHTML = vqList(state).map(function (x) { return "<li><b>" + esc(x[0]) + '</b><span class="good">Good: ' + esc(x[1]) + '</span><span class="red">Red flag: ' + esc(x[2]) + "</span></li>"; }).join(""); }
            var cp = document.getElementById("copy"); if (cp) cp.textContent = vend && VQ ? "Copy the questions" : (B.copyLabel || "Copy my ticket");
            var body = esc(text).replace(/\n/g, "<br>");
            if (added) body = body.replace(esc(added), '<span class="add">' + esc(added) + "</span>");
            document.getElementById("ticket").innerHTML = ticket(B.head, B.right, body, B.foot);
            var o = document.getElementById("open"); if (o) o.href = (B.claudeUrl || "https://claude.ai/new?q=") + encodeURIComponent(B.claudeText && state.mode !== "vendor" ? B.claudeText(state) : text);
          };
          draw();
          app.querySelectorAll("[data-set]").forEach(function (b) {
            b.onclick = function () {
              var k = b.dataset.set, v = b.dataset.v;
              if (b.dataset.multi) { var arr = state[k], i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); b.setAttribute("aria-pressed", String(i < 0)); draw(i < 0 ? v : null); }
              else { state[k] = v; app.querySelectorAll('[data-set="' + k + '"]').forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); draw(v); }
              play("tick", 1);
            };
          });
          app.querySelectorAll("[data-in]").forEach(function (inp) { inp.oninput = function () { state[inp.dataset.in] = inp.value; draw(); }; });
          document.getElementById("copy").onclick = function () { if (state.mode === "vendor" && VQ) copy(vqText(state), "Questions copied"); else copy(T(state), B.copied || "Copied"); play("share"); };
          var o = document.getElementById("open"); if (o) o.addEventListener("click", function () { play("share"); });
          return;
        }

        if (step === 3) return game(L.game);

        if (step === 4) return show("<h2>" + esc(L.breaks.title) + "</h2>" +
          '<ul class="lines">' + L.breaks.lines.map(function (x) { return "<li><b>" + x[0] + "</b>" + x[1] + "</li>"; }).join("") + "</ul>" +
          '<div class="breaks"><b>Where the kitchen idea breaks</b>' + L.breaks.where + "</div>" + nextBtn("Take the quiz"));

        if (step === 5) {
          var Q = L.quiz.map(function (x) { var idx = x.a.map(function (_, j) { return j; }); if (Math.random() < 0.5) idx.reverse(); return { q: x.q, why: x.why, a: idx.map(function (j) { return x.a[j]; }), ok: idx.indexOf(x.ok) }; }), got = 0, answered = {};
          show("<h2>Two quick questions.</h2>" + Q.map(function (x, i) {
            return '<div style="margin:18px 0"><p><b>' + (i + 1) + ". " + x.q + '</b></p><ul class="claims">' + x.a.map(function (a, j) { return '<li><button type="button" data-q="' + i + '" data-a="' + j + '">' + a + "</button></li>"; }).join("") + '</ul><div id="q' + i + '" role="status" aria-live="polite"></div></div>';
          }).join("") + '<div id="qdone"></div>');
          app.querySelectorAll("[data-q]").forEach(function (b) {
            b.onclick = function () {
              var i = +b.dataset.q, x = Q[i];
              if (answered[i]) return;
              if (+b.dataset.a === x.ok) {
                answered[i] = 1; got++; b.classList.add("right"); play("tick", got);
                document.getElementById("q" + i).innerHTML = '<p class="fb good">' + x.why + "</p>";
                if (got === Q.length) { document.getElementById("qdone").innerHTML = '<div class="btns"><button class="btn" id="finish" type="button">Get my stamp</button></div>'; document.getElementById("finish").onclick = function () { step = 6; render(); }; }
              } else { b.classList.add("wrong"); play("pick"); document.getElementById("q" + i).innerHTML = '<p class="fb try">Not quite. Try the other one.</p>'; }
            };
          });
          return;
        }

        /* the stamp */
        var first = BK.mark(L.id), have = read(), count = TRACK.filter(function (t) { return have[t.id]; }).length, nxt = TRACK[L.n];
        var all = count === TRACK.length;
        app.innerHTML = '<section class="step">' +
          '<div class="stamp-wrap"><div class="stamp land" aria-hidden="true">' + School.stampSvg(L.stamp, L.n, true) + "</div></div>" +
          '<h1 style="text-align:center">' + (all ? "Builder’s passport complete." : "Lesson " + L.n + ", stamped.") + "</h1>" +
          '<p class="muted" style="text-align:center">' + (all ? "All " + TRACK.length + " stamps. You can follow a builder conversation now." : (first ? count + " of " + TRACK.length + " Builder’s Kitchen stamps." : "You already had this stamp. Nice refresher.")) + "</p>" +
          '<div class="kept"><p><b>Words you now know:</b></p>' + termChips(L.terms) +
          "<p><b>You leave with:</b> " + L.keep + "</p></div>" +
          '<div class="btns"><button class="btn" id="save" type="button">' + esc(L.cardLabel || "Copy my card") + "</button>" +
          (nxt ? '<a class="btn ghost" href="' + nxt.href + '">Next lesson →</a>' : "") +
          '<a class="btn ghost" href="./">My passport</a><button class="btn ghost" id="send" type="button">Send this lesson</button></div>' +
          (L.real ? '<p class="small">Go deeper: <a href="' + L.real[1] + '" target="_blank" rel="noopener">' + esc(L.real[0]) + "</a> (Anthropic’s own course).</p>" : "") + "</section>";
        window.scrollTo(0, 0);
        setTimeout(function () { play(all ? "win" : "stamp"); }, 260);
        document.getElementById("save").onclick = function () { copy(L.card, "Card copied"); };
        document.getElementById("send").onclick = function () {
          var d = { title: "AI Made EZ · " + L.title, text: "A short lesson that made this make sense:", url: location.href };
          if (navigator.share) navigator.share(d).catch(function () {}); else copy(d.text + " " + d.url, "Link copied");
        };
      };
      app.addEventListener("click", function (e) { if (e.target.closest("[data-next]") && e.target.closest(".step")) next(); });
      render();
    }
  };
})();
