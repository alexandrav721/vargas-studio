/* Shared bits for the Tools pages. */
(function () {
  var P = {
    pic: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/>',
    vid: '<rect x="2" y="5" width="14" height="14" rx="2"/><path d="M16 10l6-3v10l-6-3"/>',
    screen: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 8h18M8 8v13"/>',
    web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    app: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/>',
    doc: '<path d="M6 2h9l5 5v15H6z"/><path d="M15 2v5h5M9 13h7M9 17h7"/>',
    mic: '<path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    slides: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 17v4M8 21h8"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    auto: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>'
  };
  function icon(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || "") + "</svg>"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function dots(n) { var h = '<span class="dots" role="img" aria-label="Beginner-friendly: ' + n + ' of 5">'; for (var i = 1; i <= 5; i++) h += '<i class="' + (i <= n ? "on" : "") + '"></i>'; return h + "</span>"; }
  function freeBadge(t) { return /^(none|no free)/i.test(t.free) ? "Paid" : /^not confirmed/i.test(t.free) ? "Check" : "Free plan"; }
  window.TOOLUI = { icon: icon, esc: esc, dots: dots, freeBadge: freeBadge };
})();
