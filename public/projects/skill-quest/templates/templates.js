/* Ready-made skills: builds the shelf from templates.json and opens one skill's sheet. */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var data = [], cur = null, side = "skill", lastFocus = null;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function badge(r) {
    if (!r) return '<span class="badge">Not tested yet</span>';
    if (r.winner === "skill") return '<span class="badge win">Beat plain Claude</span>';
    if (r.winner === "tie") return '<span class="badge tie">Tied plain Claude</span>';
    return '<span class="badge lose">Plain Claude won</span>';
  }
  function toast(t) { var el = $("#toast"); el.textContent = t; el.classList.add("on"); setTimeout(function () { el.classList.remove("on"); }, 1800); }

  function shelf() {
    var wins = data.filter(function (d) { return d.result && d.result.winner === "skill"; }).length;
    var tested = data.filter(function (d) { return d.result; }).length;
    if (tested) $("#introSub").textContent = data.length + " skills for the things people ask AI for most. In blind tests, " + wins + " of " + tested + " beat plain Claude.";
    $("#grid").innerHTML = data.map(function (d, i) {
      var shot = d.thumb ? '<img src="' + esc(d.thumb) + '" alt="" loading="lazy">' : '<div class="txt">' + esc(d.oneLine) + "</div>";
      return '<li><button class="tile" data-i="' + i + '"><span class="shot">' + shot + '</span><span class="meta"><b>' + esc(d.name) + "</b><span>" + esc(d.oneLine) + "</span>" + badge(d.result) + "</span></button></li>";
    }).join("");
  }

  function render() {
    var d = cur, out = d.outputs && d.outputs[side];
    $("#fSkill").setAttribute("aria-pressed", side === "skill");
    $("#fPlain").setAttribute("aria-pressed", side === "plain");
    var r = d.result, sc = $("#score");
    if (r) {
      var mine = side === "skill" ? r.skillScore : r.plainScore;
      sc.innerHTML = '<span class="big">' + mine + '/5</span><span>' + (side === "skill" ? "with the skill" : "plain Claude") + "</span><span>Blind judge: " +
        (r.winner === "skill" ? "the skill won" : r.winner === "tie" ? "a tie" : "plain Claude won") + "</span>";
    } else sc.textContent = "";
    var f = $("#frame");
    if (!out) { f.innerHTML = '<div class="md">Not tested yet.</div>'; return; }
    if (out.type === "html") f.innerHTML = '<iframe title="' + esc(d.name) + ' result" sandbox="allow-scripts allow-forms allow-modals" src="' + esc(out.src) + '"></iframe>';
    else {
      f.innerHTML = '<div class="md">Loading…</div>';
      fetch(out.src).then(function (r) { return r.text(); }).then(function (t) {
        var html = window.marked ? window.marked.parse(t) : "<pre>" + esc(t) + "</pre>";
        f.innerHTML = '<div class="md">' + html.replace(/<script[\s\S]*?<\/script>/gi, "") + "</div>";
      }).catch(function () { f.innerHTML = '<div class="md">Could not load this answer.</div>'; });
    }
  }

  function flipTo(s) {
    if (s === side) return;
    var f = $("#frame"), reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { side = s; render(); return; }
    f.classList.add("turn");
    setTimeout(function () { side = s; render(); f.classList.remove("turn"); }, 230);
  }

  function open(i) {
    cur = data[i]; side = "skill"; lastFocus = document.activeElement;
    $("#dName").textContent = cur.name;
    $("#dLine").textContent = cur.whyBetter;
    $("#dZip").href = cur.zip; $("#dZip").setAttribute("download", cur.slug + ".zip");
    $("#dPrompt").textContent = cur.tryPrompt;
    $("#dOpen").href = "claude://claude.ai/new?q=" + encodeURIComponent(cur.tryPrompt);
    $("#dRead").href = cur.skillFile;
    $("#req").textContent = cur.request || "";
    render();
    $("#sheet").hidden = false; document.body.style.overflow = "hidden";
    $("#close").focus();
    history.replaceState(null, "", "#" + cur.slug);
  }
  function close() {
    $("#sheet").hidden = true; document.body.style.overflow = "";
    history.replaceState(null, "", location.pathname);
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest(".tile"); if (t) return open(+t.dataset.i);
    if (e.target.closest("#close") || e.target.id === "sheet") return close();
    if (e.target.closest("#fSkill")) return flipTo("skill");
    if (e.target.closest("#fPlain")) return flipTo("plain");
    if (e.target.closest("#dCopy")) {
      var txt = cur.tryPrompt;
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { toast("Copied"); }, function () {
        var r = document.createRange(); r.selectNodeContents($("#dPrompt")); var s = getSelection(); s.removeAllRanges(); s.addRange(r); toast("Selected: copy it");
      });
    }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("#sheet").hidden) close(); });

  fetch("templates.json").then(function (r) { return r.json(); }).then(function (j) {
    data = j; shelf();
    var slug = location.hash.slice(1), at = data.findIndex(function (d) { return d.slug === slug; });
    if (at >= 0) open(at);
  });
})();
