/* Maker passport: six stamps you collect across Skills Made EZ, saved on this device only.
   Pages call SMEZ.stamp("id") when you earn one; any element with data-passport shows the strip. */
(function () {
  "use strict";
  var KEY = "smez-passport-v1";
  var STAMPS = [
    { id: "spot", name: "Spotted a skill", how: "Judge 3 rounds", href: "/projects/skill-quest/play.html" },
    { id: "open", name: "Opened a ready-made skill", how: "Open any skill", href: "/projects/skill-quest/templates/" },
    { id: "home", name: "Took a skill home", how: "Download one", href: "/projects/skill-quest/templates/" },
    { id: "own", name: "Made my own recipe", how: "Start from scratch", href: "/projects/skill-quest/prototype/v2.html" },
    { id: "plan", name: "Planned an app", how: "Finish a Build Kit plan", href: "/projects/skill-quest/build-kit/" },
    { id: "kit", name: "Got my app kit", how: "Download your plan", href: "/projects/skill-quest/build-kit/" }
  ];
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } }
  function store(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  var css = ".pp{margin:18px 0 0}.pp-top{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:8px}" +
    ".pp-top b{font:800 18px/1.1 var(--display,system-ui)}.pp-top span{font:700 12px var(--mono,monospace);opacity:.78}" +
    ".pp-row{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}" +
    "@media (max-width:520px){.pp-row{grid-template-columns:repeat(3,minmax(0,1fr))}}" +
    ".pp-row a{display:flex;flex-direction:column;align-items:center;gap:4px;text-decoration:none;color:inherit;text-align:center}" +
    ".pp-row svg{width:58px;height:58px}.pp-row .nm{font:700 11.5px/1.2 var(--display,system-ui)}.pp-row .hw{font:500 11px/1.2 var(--mono,monospace);opacity:.78}" +
    ".pp-row .got svg{animation:ppIn .5s cubic-bezier(.3,1.5,.5,1)}@keyframes ppIn{from{transform:scale(1.5) rotate(-20deg)}}" +
    "@media (prefers-reduced-motion:reduce){.pp-row .got svg{animation:none}}" +
    ".pp-card{margin-top:14px;display:grid;gap:10px}.pp-lock{font:500 13px/1.4 var(--mono,monospace);opacity:.78;margin:12px 0 0}" +
    ".pp-card label{font:700 14px var(--display,system-ui)}.pp-card input{font:600 17px var(--display,system-ui);padding:11px 12px;border:2.5px solid #161412;border-radius:10px;background:#fff;color:#161412;width:100%;box-sizing:border-box}" +
    ".pp-btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 18px;border:2.5px solid #161412;border-radius:12px;background:#C7391F;color:#fff;font:800 16px var(--display,system-ui);box-shadow:4px 4px 0 #161412;cursor:pointer;text-decoration:none}" +
    ".pp-btn.ghost{background:#F5B82E;color:#161412}.pp-btns{display:flex;gap:10px;flex-wrap:wrap}" +
    ".pp-img{width:100%;max-width:420px;height:auto;border-radius:12px;display:block}";
  function stampSvg(n, got) {
    var ink = got ? "#C7391F" : "#B9AFA2";
    return '<svg viewBox="0 0 64 64" aria-hidden="true"><g transform="rotate(' + (got ? (n % 2 ? -8 : 6) : 0) + ' 32 32)">' +
      '<circle cx="32" cy="32" r="28" fill="' + (got ? "#FFF4E8" : "none") + '" stroke="' + ink + '" stroke-width="3"' + (got ? "" : ' stroke-dasharray="5 5"') + "/>" +
      '<circle cx="32" cy="32" r="21" fill="none" stroke="' + ink + '" stroke-width="1.5"/>' +
      '<text x="32" y="39" text-anchor="middle" font-family="Bricolage Grotesque,system-ui" font-weight="800" font-size="20" fill="' + ink + '">' + (got ? "✓" : n) + "</text></g></svg>";
  }
  function render() {
    var s = load(), els = document.querySelectorAll("[data-passport]");
    if (!els.length) return;
    if (!document.getElementById("pp-css")) { var st = document.createElement("style"); st.id = "pp-css"; st.textContent = css; document.head.appendChild(st); }
    var n = STAMPS.filter(function (x) { return s[x.id]; }).length;
    var html = '<div class="pp"><div class="pp-top"><b>Maker passport</b><span>' + n + " of " + STAMPS.length + " stamps</span></div><ul class=\"pp-row\">" +
      STAMPS.map(function (x, i) {
        var got = !!s[x.id];
        return '<li><a href="' + x.href + '" class="' + (got ? "got" : "") + '" aria-label="' + x.name + (got ? ", stamped" : ", not yet: " + x.how) + '">' +
          stampSvg(i + 1, got) + '<span class="nm">' + x.name + '</span><span class="hw">' + (got ? "Stamped" : x.how) + "</span></a></li>";
      }).join("") + "</ul>" +
      (n === STAMPS.length
        ? '<div class="pp-card"><b style="font:800 20px var(--display,system-ui)">All 6. You\'re a Maker.</b><label for="pp-name">Name on your card (optional)</label>' +
          '<input id="pp-name" maxlength="28" autocomplete="name" placeholder="Your name"><div class="pp-btns"><button class="pp-btn" type="button" data-pp="make">Make my Maker card</button></div><div data-pp-out></div></div>'
        : '<p class="pp-lock">Collect all 6 to get your Maker card.</p>') + "</div>";
    els.forEach(function (el) { el.innerHTML = html; });
  }
  /* the Maker card: a 1080x1350 picture made in the browser, nothing uploaded */
  function drawCard(name) {
    var s = load(), W = 1080, H = 1350, c = document.createElement("canvas"); c.width = W; c.height = H;
    var x = c.getContext("2d"), INK = "#161412", PAPER = "#F6F1E7", RED = "#C7391F", SUN = "#F5B82E", D = '"Bricolage Grotesque", system-ui, sans-serif', M = '"JetBrains Mono", ui-monospace, monospace';
    function rr(px, py, w, h, r) { x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath(); }
    x.fillStyle = PAPER; x.fillRect(0, 0, W, H);
    x.fillStyle = "rgba(22,20,18,.06)"; for (var gx = 6; gx < W; gx += 14) for (var gy = 6; gy < H; gy += 14) x.fillRect(gx, gy, 2, 2);
    rr(96, 96, 900, 1170, 40); x.fillStyle = INK; x.fill();            // offset shadow
    rr(80, 80, 900, 1170, 40); x.fillStyle = "#fff"; x.fill(); x.lineWidth = 8; x.strokeStyle = INK; x.stroke();
    x.fillStyle = INK; x.font = "700 30px " + M; x.fillText("SKILLS MADE EZ", 140, 172);
    x.fillStyle = RED; x.font = "800 190px " + D; x.fillText("Maker", 130, 360);
    var nm = (name || "").trim();
    x.fillStyle = INK; x.font = "800 58px " + D; if (nm) x.fillText(nm, 140, 450);
    x.font = "500 34px " + D; x.fillStyle = "#4A443D"; x.fillText("I build things with Claude.", 140, nm ? 512 : 450);
    var top = nm ? 560 : 500;
    STAMPS.forEach(function (st, i) {
      var cx = 230 + (i % 3) * 300, cy = top + 110 + Math.floor(i / 3) * 280, rot = [-0.14, 0.1, -0.06, 0.12, -0.1, 0.08][i];
      x.save(); x.translate(cx, cy); x.rotate(rot);
      x.beginPath(); x.arc(0, 0, 88, 0, Math.PI * 2); x.fillStyle = "#FFF4E8"; x.fill(); x.lineWidth = 9; x.strokeStyle = RED; x.stroke();
      x.beginPath(); x.arc(0, 0, 66, 0, Math.PI * 2); x.lineWidth = 3; x.stroke();
      x.fillStyle = RED; x.font = "800 56px " + D; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(String(i + 1), 0, -8);
      x.font = "700 19px " + M; x.fillText((s[st.id] || "").slice(5).replace("-", "/"), 0, 38);
      x.restore();
      x.fillStyle = INK; x.font = "700 26px " + D; x.textAlign = "center"; x.textBaseline = "alphabetic";
      var words = st.name.split(" "), line = "", ly = cy + 128;
      words.forEach(function (w) { var t = line ? line + " " + w : w; if (x.measureText(t).width > 250) { x.fillText(line, cx, ly); line = w; ly += 32; } else line = t; });
      x.fillText(line, cx, ly); x.textAlign = "left";
    });
    rr(140, 1130, 780, 70, 35); x.fillStyle = SUN; x.fill(); x.lineWidth = 4; x.strokeStyle = INK; x.stroke();
    x.fillStyle = INK; x.font = "700 27px " + M; x.textAlign = "center"; x.fillText("vargas-studio.pages.dev/projects/skill-quest", 530, 1175); x.textAlign = "left";
    return c;
  }
  function make(root) {
    var input = root.querySelector("#pp-name"), out = root.querySelector("[data-pp-out]"), name = input ? input.value : "";
    var go = function () {
      var c = drawCard(name);
      c.toBlob(function (blob) {
        var url = URL.createObjectURL(blob), file = null;
        try { file = new File([blob], "maker-card.png", { type: "image/png" }); } catch (e) {}
        var canShare = file && navigator.canShare && navigator.canShare({ files: [file] });
        out.innerHTML = '<img class="pp-img" alt="Your Maker card: Maker' + (name ? ", " + name.replace(/"/g, "") : "") + ', 6 of 6 stamps" src="' + url + '">' +
          '<div class="pp-btns">' + (canShare ? '<button class="pp-btn" type="button" data-pp="share">Share</button>' : "") +
          '<a class="pp-btn ghost" download="maker-card.png" href="' + url + '">Save image</a></div>';
        var sh = out.querySelector('[data-pp="share"]');
        if (sh) sh.onclick = function () { navigator.share({ files: [file], title: "My Maker card", text: "I build things with Claude." }).catch(function () {}); };
      }, "image/png");
    };
    (document.fonts && document.fonts.load ? Promise.all([document.fonts.load('800 60px "Bricolage Grotesque"'), document.fonts.load('700 20px "JetBrains Mono"')]).catch(function () {}) : Promise.resolve()).then(go, go);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest('[data-pp="make"]'); if (!b) return;
    make(b.closest(".pp-card"));
  });

  window.SMEZ = window.SMEZ || {};
  window.SMEZ.stamp = function (id) {
    var s = load(); if (s[id]) return false;
    s[id] = new Date().toISOString().slice(0, 10); store(s); render(); return true;
  };
  window.SMEZ.passport = render;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render); else render();
})();
