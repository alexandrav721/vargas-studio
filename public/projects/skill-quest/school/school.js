/* AI Made EZ: shared lesson list, the Chef's passport (lesson stamps, this device only), big-text mode, toast. */
(function () {
  "use strict";
  var KEY = "smez-school-v1", MAKER = "smez-passport-v1";
  var LESSONS = [
    { n: 1, id: "l1", short: "Meet the chef", name: "Meet the chef", leave: "A week of dinners", href: "lesson-1.html" },
    { n: 2, id: "l2", short: "Your order", name: "Placing your order", leave: "A birthday message", href: "lesson-2.html" },
    { n: 3, id: "l3", short: "Like this", name: "“Make it like this”", leave: "An email ready to send", href: "lesson-3.html" },
    { n: 4, id: "l4", short: "Taste test", name: "Taste before you serve", leave: "A safe-kitchen card", href: "lesson-4.html" },
    { n: 5, id: "l5", short: "Your station", name: "Your own station", leave: "A family-trip project", href: "lesson-5.html" },
    { n: 6, id: "l6", short: "Take-home", name: "Take-home containers", leave: "A checklist to share", href: "lesson-6.html" },
    { n: 7, id: "l7", short: "Pantry", name: "Pantry and meal kits", leave: "Your “always ask” settings", href: "lesson-7.html" },
    { n: 8, id: "l8", short: "Recipe card", name: "Write your recipe card", leave: "Your own tested skill", href: "lesson-8.html" }
  ];
  var EXTRAS = [
    { id: "spot", name: "Spotted a skill", href: "../play.html" },
    { id: "open", name: "Opened a house recipe", href: "../templates/" },
    { id: "home", name: "Took a recipe home", href: "../templates/" },
    { id: "own", name: "Made my own recipe", href: "../prototype/v2.html" },
    { id: "plan", name: "Planned an app", href: "../build-kit/" },
    { id: "kit", name: "Got my app kit", href: "../build-kit/" }
  ];
  function read(k) { try { return JSON.parse(localStorage.getItem(k) || "{}") || {}; } catch (e) { return {}; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* a round rubber stamp, drawn; got = inked red, not yet = dashed grey */
  function stamp(label, n, got, size) {
    var ink = got ? "#C7391F" : "#B5ADA1", id = "c" + Math.random().toString(36).slice(2, 8);
    return '<svg viewBox="0 0 120 120" aria-hidden="true"' + (size ? ' width="' + size + '" height="' + size + '"' : "") + '>' +
      '<defs><path id="' + id + '" d="M60 60 m-41 0 a41 41 0 1 1 82 0 a41 41 0 1 1 -82 0"/></defs>' +
      '<g transform="rotate(' + (got ? -8 : 0) + ' 60 60)" opacity="' + (got ? 0.95 : 1) + '">' +
      '<circle cx="60" cy="60" r="55" fill="' + (got ? "#FFF6EF" : "none") + '" stroke="' + ink + '" stroke-width="4"' + (got ? "" : ' stroke-dasharray="7 6"') + '/>' +
      '<circle cx="60" cy="60" r="33" fill="none" stroke="' + ink + '" stroke-width="2"/>' +
      '<text font-family="Schibsted Grotesk,system-ui" font-weight="700" font-size="10.5" letter-spacing="1.6" fill="' + ink + '"><textPath href="#' + id + '" startOffset="25%" text-anchor="middle">' + label.toUpperCase() + '</textPath></text>' +
      '<text x="60" y="71" text-anchor="middle" font-family="Bricolage Grotesque,system-ui" font-weight="800" font-size="34" fill="' + ink + '">' + n + '</text></g></svg>';
  }
  function toast(t) { var el = document.getElementById("toast"); if (!el) return; el.textContent = t; el.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove("on"); }, 2200); }
  function big() {
    var on = false; try { on = localStorage.getItem("smez-big") === "1"; } catch (e) {}
    document.body.classList.toggle("big", on);
    var b = document.getElementById("big"); if (!b) return;
    b.setAttribute("aria-pressed", String(on));
    b.onclick = function () { on = !on; try { localStorage.setItem("smez-big", on ? "1" : "0"); } catch (e) {} document.body.classList.toggle("big", on); b.setAttribute("aria-pressed", String(on)); };
  }
  window.School = {
    LESSONS: LESSONS, EXTRAS: EXTRAS, stampSvg: stamp, toast: toast,
    done: function () { return read(KEY); }, maker: function () { return read(MAKER); },
    mark: function (id) { var s = read(KEY); var first = !s[id]; if (first) { s[id] = new Date().toISOString().slice(0, 10); write(KEY, s); } return first; }
  };
  document.addEventListener("DOMContentLoaded", big);
})();
/* Level switch: show the current level in view on small screens (24 Nov 2026) */
document.addEventListener("DOMContentLoaded", function () {
  var cur = document.querySelector(".lvl5 [aria-current]");
  if (cur && cur.parentNode.scrollWidth > cur.parentNode.clientWidth) cur.parentNode.scrollLeft = Math.max(0, cur.offsetLeft - cur.parentNode.offsetLeft - 16);
});
