/* Shared bits for the kits pages: icons, escaping, copy buttons, the optional email box. */
(function () {
  var ICON = {
    voice: '<path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    web: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>',
    app: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4M9 7h6M9 11h6"/>',
    auto: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>',
    posts: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4M7 13h3M14 13h3M7 17h3"/>',
    memo: '<path d="M6 2h9l5 5v15H6z"/><path d="M15 2v5h5M9 12h8M9 16h8"/>'
  };
  function icon(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON[n] || "") + "</svg>"; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function hl(s) { return esc(s).replace(/&lt;(\/?)([a-z_]+)&gt;/g, '<span class="t">&lt;$1$2&gt;</span>'); }
  var COPY = {};
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]"); if (!b) return;
    var t = COPY[b.dataset.copy], lbl = b.textContent;
    function ok() { b.textContent = "Copied"; b.classList.add("done"); setTimeout(function () { b.textContent = lbl; b.classList.remove("done"); }, 1600); }
    function fail() { b.textContent = "Press and hold the text to copy"; setTimeout(function () { b.textContent = lbl; }, 2600); }
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok, fail); else fail();
  });
  function post(path, body) {
    return fetch("/api/kits/" + path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j._status = r.status; return j; }); });
  }
  /* Optional "Email me this kit". Never blocks the kit. */
  function mailBox(kit) {
    return '<section class="mail" id="mail"><b class="h">Want a copy in your inbox?</b><p>Optional. The whole kit is already here, free.</p>' +
      '<form id="mailform" novalidate><label class="hp" aria-hidden="true">Leave empty <input name="website" tabindex="-1" autocomplete="off"></label>' +
      '<input type="email" name="email" required autocomplete="email" placeholder="you@example.com" aria-label="Your email">' +
      '<label class="cb"><input type="checkbox" name="news"> Also email me when a new kit comes out. (You can stop any time.)</label>' +
      '<button type="submit">Email me this kit</button><p class="msg" id="mailmsg" role="status" aria-live="polite"></p>' +
      '<p class="fine">We keep your email and which kit you asked for, nothing else. We don’t sell or share it. <a href="index.html#forget">Privacy and delete</a></p></form></section>';
  }
  function wireMail(kit) {
    var f = document.getElementById("mailform"), m = document.getElementById("mailmsg");
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = f.email.value.trim();
      if (!/^\S+@\S+\.\S+$/.test(email)) { m.textContent = "Enter a real email."; return; }
      m.textContent = "Saving…";
      post("signup", { email: email, kit: kit, news: f.news.checked, website: f.website.value }).then(function (j) {
        if (j._status === 201) m.textContent = j.sent ? "Sent. Check your inbox." : "Saved. Email sending opens soon; we’ll send your copy then.";
        else if (j._status === 503 || j._status === 404) m.textContent = "Email copies aren’t open yet. The kit is all here on this page.";
        else m.textContent = j.error || "Something went wrong. The kit is still all here.";
      }, function () { m.textContent = "Couldn’t reach us. The kit is still all here."; });
    });
  }
  function wireForget() {
    var f = document.getElementById("forgetform"), m = document.getElementById("forgetmsg");
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      post("forget", { email: f.email.value.trim() }).then(function (j) {
        m.textContent = j._status === 200 ? "Done. That email is deleted from our list." : (j._status === 503 || j._status === 404) ? "Nothing is stored yet." : (j.error || "Something went wrong.");
      }, function () { m.textContent = "Couldn’t reach us. Try again."; });
    });
  }
  window.KITUI = { icon: icon, esc: esc, hl: hl, COPY: COPY, mailBox: mailBox, wireMail: wireMail, wireForget: wireForget };
})();
