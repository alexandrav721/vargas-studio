/* Show only the pages kept in the game: ?k=<base36 bitmask>&p=<planner letter>&n=<name> */
(function () {
  var q = new URLSearchParams(location.search);
  var mask = parseInt(q.get("k") || "", 36);
  var letter = (q.get("p") || "").toUpperCase();
  var name = (q.get("n") || "").slice(0, 40);
  var pages = document.querySelectorAll("[data-i]");
  var covers = document.querySelectorAll("[data-cover]");
  var shown = 0;
  var any = !isNaN(mask) && mask > 0;
  pages.forEach(function (el) {
    var on = !any || (mask & (1 << Number(el.dataset.i))) !== 0;
    el.classList.toggle("is-off", !on);
    if (on) shown += 1;
  });
  covers.forEach(function (el) {
    var on = el.dataset.cover === letter;
    el.classList.toggle("is-off", !on);
    if (on && name) {
      var tag = el.querySelector(".name");
      var b = document.createElement("div");
      b.className = "belongs";
      b.textContent = name;
      if (tag) tag.parentNode.insertBefore(b, tag);
    }
  });
  document.getElementById("count").textContent = shown === 1 ? "Your 1 page" : "Your " + shown + " pages";
  document.getElementById("print").addEventListener("click", function () { window.print(); });
  if (name) document.title = name + "'s pages · Planner and Book";
})();
