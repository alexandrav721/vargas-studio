/* Demand test: counts one view, one pre-order click and one reservation per visitor per page.
   No cookies, no IPs; the visitor id is random and kept in this browser only. */
(function () {
  "use strict";
  var page = document.documentElement.dataset.page;
  var src = (new URLSearchParams(location.search).get("utm_source") || "").replace(/[^a-z0-9_.-]/gi, "").slice(0, 40);
  var vid;
  try { vid = localStorage.getItem("try-vid"); } catch (e) {}
  if (!vid) { vid = (Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(0, 24); try { localStorage.setItem("try-vid", vid); } catch (e) {} }
  function send(event, extra) {
    var body = Object.assign({ page: page, event: event, visitor: vid, source: src || undefined }, extra || {});
    return fetch("/api/sl/demand", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), keepalive: true })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || "Something went wrong."); return j; }); });
  }
  send("view").catch(function () {});
  var form = document.getElementById("reserve-form"), err = document.getElementById("err"), thanks = document.getElementById("thanks");
  document.querySelectorAll("[data-cta]").forEach(function (a) {
    a.addEventListener("click", function () { send("cta").catch(function () {}); setTimeout(function () { form.email.focus({ preventScroll: true }); }, 450); });
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault(); err.textContent = "";
    if (!form.email.checkValidity() || !form.email.value.trim()) { err.textContent = "Enter your email."; form.email.focus(); return; }
    var btn = form.querySelector("button"); btn.disabled = true;
    send("cta").catch(function () {});
    send("reserve", { email: form.email.value.trim(), role: form.role.value || undefined }).then(function () {
      form.hidden = true; thanks.hidden = false;
    }).catch(function (x) { err.textContent = x.message; btn.disabled = false; });
  });
})();
