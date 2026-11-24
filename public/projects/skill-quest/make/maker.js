/* AI Made EZ makers, in the lesson style: guess → three ideas + worked example → your turn (live ticket, the real thing)
   → a game → where the metaphor breaks → 2 quick questions → stamp, and you leave with the file.
   A maker is data (window.MAKER). Uses school.js for the stamp drawing and toast. Saves your answers on this device only. */
(function () {
  "use strict";
  var KEY = "aimez-makers-v1";
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } }
  function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  function play(n, x) { if (window.SQSound) window.SQSound.play(n, x); }
  function toast(t) { if (window.School) School.toast(t); }
  function copy(text, done) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () { toast(done || "Copied"); }, function () { toast("Select the text and copy it"); });
  }
  function download(name, text) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/markdown" }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
  }
  function ticket(head, right, body, foot) {
    return '<div class="ticket"><div class="th"><span>' + esc(head) + "</span><span>" + esc(right || "") + "</span></div>" + body + (foot ? '<div class="tf">' + esc(foot) + "</div>" : "") + "</div>";
  }
  function shuffle(a) { return a.map(function (x) { return [Math.random(), x]; }).sort(function (p, q) { return p[0] - q[0]; }).map(function (x) { return x[1]; }); }

  window.Maker = {
    run: function (M) {
      var app = document.getElementById("app"), STEPS = 6, step = 0, guessed = null;
      var all = load(), state = all[M.id] || JSON.parse(JSON.stringify(M.build.start));
      var opts = shuffle(M.guess.opts);
      function keep() { all[M.id] = state; save(all); }
      function prog() { return '<div class="prog"><span>' + esc(M.name) + " · " + (step + 1) + " of " + STEPS + '</span><span class="bar"><i style="width:' + Math.round((step + 1) / STEPS * 100) + '%"></i></span></div>'; }
      function show(html) { app.innerHTML = prog() + '<section class="step">' + html + "</section>"; window.scrollTo(0, 0); try { app.focus({ preventScroll: true }); } catch (e) {} }
      function nextBtn(label, ghost) { return '<div class="btns"><button class="btn' + (ghost ? " ghost" : "") + '" data-next type="button">' + esc(label) + "</button></div>"; }
      function lines(list) { return '<ul class="lines">' + list.map(function (x) { return "<li><b>" + x[0] + "</b>" + x[1] + "</li>"; }).join("") + "</ul>"; }

      function render() {
        /* 1 · a quick guess, then the first idea */
        if (step === 0 && guessed === null) {
          show('<p class="label">' + esc(M.name) + " · about " + M.mins + " minutes</p><h1>" + esc(M.title) + "</h1>" +
            '<p class="label" style="margin-top:14px">Quick guess.</p><p><b>' + M.guess.q + '</b></p><ul class="claims">' +
            opts.map(function (o, j) { return '<li><button type="button" data-g="' + j + '">' + o[0] + "</button></li>"; }).join("") + "</ul>");
          app.querySelectorAll("[data-g]").forEach(function (b) { b.onclick = function () { guessed = +b.dataset.g; play(opts[guessed][1] ? "tick" : "pick", 1); render(); }; });
          return;
        }
        if (step === 0) return show('<p class="label">' + esc(M.name) + " · about " + M.mins + " minutes</p><h1>" + esc(M.title) + "</h1>" +
          '<p class="fb ' + (opts[guessed][1] ? 'good">Good guess. ' : 'try">Not quite. ') + M.guess.reveal + "</p>" +
          lines(M.lines) + '<p class="label" style="margin-top:16px">You leave with</p><p>' + M.leave + "</p>" + nextBtn("Show me an example"));

        /* 2 · a worked example */
        if (step === 1) return show("<h2>" + esc(M.example.title) + "</h2>" + M.example.html + nextBtn("Your turn →"));

        /* 3 · your turn: the live ticket is the real file */
        if (step === 2) {
          var B = M.build;
          show("<h2>" + esc(B.title) + '</h2><p class="muted">' + B.lead + "</p>" + '<div id="ctl">' + B.controls(state, esc) + "</div>" +
            '<p class="label">' + esc(B.fileLabel) + ' <span class="muted">(builds as you go)</span></p><div id="ticket"></div>' +
            '<div class="btns"><button class="btn" id="dl" type="button">' + esc(B.downloadLabel) + '</button><button class="btn ghost" id="copy" type="button">Copy it</button></div>' +
            '<p class="small">' + B.how + "</p>" + nextBtn("Done →", true).replace('class="btns"', 'class="btns done-row"'));
          var draw = function (added) {
            var body = esc(B.file(state)).replace(/\n/g, "<br>");
            if (added) body = body.replace(esc(added), '<span class="add">' + esc(added) + "</span>");
            document.getElementById("ticket").innerHTML = ticket(B.head, B.right, body, B.foot);
            keep();
          };
          draw();
          app.querySelectorAll("[data-set]").forEach(function (b) {
            b.onclick = function () {
              var k = b.dataset.set, v = b.dataset.v;
              if (b.dataset.multi) { var arr = state[k], i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); b.setAttribute("aria-pressed", String(i < 0)); draw(i < 0 ? v : null); }
              else { state[k] = v; app.querySelectorAll('[data-set="' + k + '"]').forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); if (B.onSet) B.onSet(k, state); draw(v); if (B.redraw && B.redraw.indexOf(k) >= 0) { var c = document.getElementById("ctl"); c.innerHTML = B.controls(state, esc); wire(); } }
              play("tick", 1);
            };
          });
          var wire = function () {
            app.querySelectorAll("[data-in]").forEach(function (inp) { inp.oninput = function () { state[inp.dataset.in] = inp.value; draw(); }; });
          };
          wire();
          document.getElementById("dl").onclick = function () { download(B.fileName(state), B.file(state)); play("share"); toast("Saved " + B.fileName(state)); };
          document.getElementById("copy").onclick = function () { copy(B.file(state), "Copied"); play("share"); };
          return;
        }

        /* 4 · a game */
        if (step === 3) {
          var G = M.game, need = G.options.filter(function (o) { return o[1]; }).length, found = 0, list = G._o || (G._o = shuffle(G.options));
          show("<h2>" + esc(G.title) + '</h2><p class="muted">' + G.lead + '</p><ul class="claims">' + list.map(function (o, i) { return '<li><button type="button" data-o="' + i + '">' + o[0] + "</button></li>"; }).join("") + '</ul><div id="fb"></div>');
          app.querySelectorAll("[data-o]").forEach(function (b) {
            b.onclick = function () {
              var o = list[+b.dataset.o], fb = document.getElementById("fb");
              if (b.disabled) return;
              b.disabled = true;
              if (o[1]) { b.classList.add("right"); found++; play("tick", found); fb.innerHTML = '<p class="fb good">' + o[2] + "</p>"; }
              else { b.classList.add("wrong"); play("pick"); fb.innerHTML = '<p class="fb try">' + o[2] + "</p>"; }
              if (found === need) fb.innerHTML += '<p class="fb good"><b>' + G.right + "</b></p>" + nextBtn("Next →");
            };
          });
          return;
        }

        /* 5 · where the metaphor breaks */
        if (step === 4) return show("<h2>" + esc(M.breaks.title) + "</h2>" + lines(M.breaks.lines) + '<p class="label" style="margin-top:12px">Where the kitchen stops</p><p>' + M.breaks.where + "</p>" + nextBtn("Two quick questions"));

        /* 6 · two quick questions */
        if (step === 5) {
          var qi = 0;
          var ask = function () {
            var x = M.quiz[qi], order = shuffle(x.a.map(function (a, i) { return [a, i === x.ok]; }));
            show('<p class="label">Question ' + (qi + 1) + " of " + M.quiz.length + "</p><h2>" + x.q + '</h2><ul class="claims">' + order.map(function (a, i) { return '<li><button type="button" data-q="' + i + '">' + a[0] + "</button></li>"; }).join("") + '</ul><div id="fb"></div>');
            app.querySelectorAll("[data-q]").forEach(function (b) {
              b.onclick = function () {
                var fb = document.getElementById("fb");
                if (order[+b.dataset.q][1]) {
                  b.classList.add("right"); play("tick", qi + 1);
                  app.querySelectorAll("[data-q]").forEach(function (z) { z.disabled = true; });
                  fb.innerHTML = '<p class="fb good">' + x.why + '</p><div class="btns"><button class="btn" id="qn" type="button">' + (qi === M.quiz.length - 1 ? "Get my stamp" : "Next question") + "</button></div>";
                  document.getElementById("qn").onclick = function () { if (qi === M.quiz.length - 1) { step = 6; render(); } else { qi++; ask(); } };
                } else { b.classList.add("wrong"); b.disabled = true; play("pick"); fb.innerHTML = '<p class="fb try">Not quite. Try another.</p>'; }
              };
            });
          };
          ask();
          return;
        }

        /* 7 · the stamp, and the file */
        var B2 = M.build, done = all.stamps || (all.stamps = {}), first = !done[M.id];
        if (first) { done[M.id] = new Date().toISOString().slice(0, 10); save(all); }
        app.innerHTML = '<section class="step"><div class="stamp-wrap"><div class="stamp land" aria-hidden="true">' + School.stampSvg(M.stamp, M.stampN, true) + "</div></div>" +
          '<h1 style="text-align:center">' + esc(M.doneTitle) + "</h1>" +
          '<div class="kept"><p><b>You leave with:</b> ' + M.leave + "</p><p><b>Next:</b> " + B2.how + "</p></div>" +
          '<div class="btns"><button class="btn" id="dl2" type="button">' + esc(B2.downloadLabel) + "</button>" +
          '<button class="btn ghost" id="edit" type="button">Change my answers</button>' +
          (M.more ? '<a class="btn ghost" href="' + M.more[1] + '">' + esc(M.more[0]) + "</a>" : "") +
          '<a class="btn ghost" href="../start/">Back to Start here</a></div>' +
          (M.other ? '<p class="small" style="text-align:center">Next maker: <a href="' + M.other[1] + '">' + esc(M.other[0]) + "</a></p>" : "") + "</section>";
        window.scrollTo(0, 0);
        setTimeout(function () { play("stamp"); }, 260);
        document.getElementById("dl2").onclick = function () { download(B2.fileName(state), B2.file(state)); toast("Saved " + B2.fileName(state)); };
        document.getElementById("edit").onclick = function () { step = 2; render(); };
      }
      app.addEventListener("click", function (e) { if (e.target.closest("[data-next]") && e.target.closest(".step")) { step++; render(); play("pick"); } });
      render();
    }
  };
})();
