/* AI Made EZ: the stamp card. A 1080x1080 picture of the stamp you just earned, drawn in the browser.
   Nothing is uploaded. Share sheet when the phone can share pictures; otherwise the picture downloads and the link is copied.
   Usage: EZStamp.share({ title, level, lesson, url, label }). EZStamp.draw(o) returns the canvas. (25 Nov 2026) */
(function () {
  "use strict";
  var INK = "#151411", RED = "#C7391F", PAPER = "#fff", SOFT = "#FFF6EF", MUTED = "#5d5952";
  var D = '"Bricolage Grotesque", system-ui, sans-serif', T = '"Schibsted Grotesk", system-ui, sans-serif';
  var SHORT = "vargas-studio.pages.dev/projects/skill-quest";

  function rr(x, px, py, w, h, r) { x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath(); }
  /* text around a circle: top arc reads left to right, bottom arc too */
  function arcText(x, text, R, bottom) {
    var sp = 6, chars = text.split(""), widths = chars.map(function (c) { return x.measureText(c).width + sp; });
    var total = widths.reduce(function (a, b) { return a + b; }, 0) - sp, a = (bottom ? Math.PI / 2 + total / R / 2 : -Math.PI / 2 - total / R / 2);
    chars.forEach(function (c, i) {
      var half = (widths[i] - sp) / 2 / R, mid = bottom ? a - half : a + half;
      x.save(); x.translate(Math.cos(mid) * R, Math.sin(mid) * R); x.rotate(bottom ? mid - Math.PI / 2 : mid + Math.PI / 2);
      x.fillText(c, 0, 0); x.restore();
      a = bottom ? a - widths[i] / R : a + widths[i] / R;
    });
  }
  function wrap(x, text, max) {
    var words = String(text).split(" "), lines = [], line = "";
    words.forEach(function (w) { var t = line ? line + " " + w : w; if (line && x.measureText(t).width > max) { lines.push(line); line = w; } else line = t; });
    if (line) lines.push(line);
    return lines;
  }

  function draw(o) {
    o = o || {};
    var W = 1080, c = document.createElement("canvas"); c.width = W; c.height = W;
    var x = c.getContext("2d");
    x.fillStyle = "#FBFAF7"; x.fillRect(0, 0, W, W);
    rr(x, 56, 56, 968, 968, 40); x.fillStyle = INK; x.fill();                 /* offset shadow */
    rr(x, 40, 40, 968, 968, 40); x.fillStyle = PAPER; x.fill(); x.lineWidth = 6; x.strokeStyle = INK; x.stroke();

    x.textBaseline = "alphabetic";
    x.fillStyle = INK; x.font = "700 30px " + T; x.textAlign = "left"; x.fillText("AI MADE EZ", 100, 128);
    x.fillStyle = RED; x.textAlign = "right"; x.fillText(("Level " + (o.level || 1) + " · Lesson " + (o.lesson || 1)).toUpperCase(), 948, 128);

    /* the stamp */
    x.save(); x.translate(540, 370); x.rotate(-0.14);
    x.beginPath(); x.arc(0, 0, 190, 0, Math.PI * 2); x.fillStyle = SOFT; x.fill(); x.lineWidth = 12; x.strokeStyle = RED; x.stroke();
    x.beginPath(); x.arc(0, 0, 122, 0, Math.PI * 2); x.lineWidth = 5; x.stroke();
    x.fillStyle = RED; x.textAlign = "center"; x.textBaseline = "middle";
    var lab = String(o.label || o.title || "").toUpperCase(); x.font = "700 30px " + T;
    while (lab.length > 4 && x.measureText(lab).width > 520) lab = lab.slice(0, -2).trim() + "…";
    arcText(x, lab, 150, false);
    arcText(x, "AI MADE EZ", 150, true);
    x.font = "800 150px " + D; x.fillText(String(o.lesson || 1), 0, 8);
    x.restore();

    /* the words */
    x.textAlign = "center"; x.textBaseline = "alphabetic";
    var size = 84, lines;
    do { x.font = "800 " + size + "px " + D; lines = wrap(x, o.title || "", 860); size -= 6; } while ((lines.length > 2 || lines.some(function (l) { return x.measureText(l).width > 880; })) && size > 44);
    size += 6;
    var two = lines.length > 1;
    x.fillStyle = MUTED; x.font = "600 44px " + T; x.fillText("I got my AI stamp:", 540, two ? 640 : 680);
    x.fillStyle = INK; x.font = "800 " + size + "px " + D;
    lines.slice(0, 2).forEach(function (l, i) { x.fillText(l, 540, (two ? 728 : 770) + i * (size * 1.05)); });

    x.fillStyle = RED; x.fillRect(100, 880, 880, 4);
    x.fillStyle = INK; x.font = "800 44px " + D; x.textAlign = "left"; x.fillText("AI Made EZ · free", 100, 948);
    x.fillStyle = MUTED; x.font = "600 25px " + T; x.fillText(SHORT, 100, 984);
    return c;
  }

  var CSS = ".ezs{position:fixed;inset:0;z-index:60;background:rgba(21,20,17,.55);display:flex;align-items:flex-end;justify-content:center}" +
    ".ezs>div{background:#fff;color:#151411;width:100%;max-width:480px;border-radius:18px 18px 0 0;padding:18px 16px 22px;box-sizing:border-box}" +
    ".ezs img{display:block;width:100%;height:auto;border-radius:12px;border:1px solid #E4E0D7}" +
    ".ezs .btns{margin-top:14px}@media (min-width:600px){.ezs{align-items:center}.ezs>div{border-radius:18px}}";
  function sheet(url, file, d) {
    if (!document.getElementById("ezs-css")) { var st = document.createElement("style"); st.id = "ezs-css"; st.textContent = CSS; document.head.appendChild(st); }
    var old = document.querySelector(".ezs"); if (old) old.remove();
    var el = document.createElement("div"); el.className = "ezs"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Your stamp card");
    var can = file && navigator.canShare && navigator.canShare({ files: [file] });
    el.innerHTML = '<div><img alt="Your stamp card: ' + String(d.title || "").replace(/"/g, "") + '" src="' + url + '">' +
      '<div class="btns">' + (can ? '<button class="btn" type="button" data-ezs="share">Share</button>' : "") +
      '<a class="btn' + (can ? " ghost" : "") + '" download="ai-made-ez-stamp.png" href="' + url + '">Save picture</a>' +
      '<button class="btn ghost" type="button" data-ezs="close">Close</button></div></div>';
    document.body.appendChild(el);
    el.onclick = function (e) {
      if (e.target === el || e.target.closest('[data-ezs="close"]')) el.remove();
      else if (e.target.closest('[data-ezs="share"]')) navigator.share({ files: [file], text: d.text, url: d.url }).catch(function () {});
    };
  }
  function toast(t) { if (window.School && School.toast) School.toast(t); }
  function copyLink(u) { if (navigator.clipboard) navigator.clipboard.writeText(u).then(function () {}, function () {}); }

  function share(o) {
    o = o || {};
    var d = { title: o.title || "", url: o.url || location.href.split(/[?#]/)[0] + "?from=stamp" };
    d.text = "I got my AI stamp: " + d.title + ". Free lessons at AI Made EZ.";
    var go = function () {
      draw(o).toBlob(function (blob) {
        if (!blob) { toast("Could not make the picture"); return; }
        var url = URL.createObjectURL(blob), file = null;
        try { file = new File([blob], "ai-made-ez-stamp.png", { type: "image/png" }); } catch (e) {}
        if (file && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], text: d.text, url: d.url }).catch(function (err) {
            /* the tap can expire while the picture is drawn: show it with its own Share button */
            if (!err || err.name !== "AbortError") sheet(url, file, d);
          });
        } else {
          var a = document.createElement("a"); a.href = url; a.download = "ai-made-ez-stamp.png"; document.body.appendChild(a); a.click(); a.remove();
          copyLink(d.url); sheet(url, null, d);
          toast("Picture saved. Link copied.");
        }
      }, "image/png");
    };
    var f = document.fonts && document.fonts.load ? Promise.all([document.fonts.load('800 80px "Bricolage Grotesque"'), document.fonts.load('700 30px "Schibsted Grotesk"'), document.fonts.load('600 40px "Schibsted Grotesk"')]).catch(function () {}) : Promise.resolve();
    f.then(go, go);
  }

  window.EZStamp = { draw: draw, share: share };
})();
