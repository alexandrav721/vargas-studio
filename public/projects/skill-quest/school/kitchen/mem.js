/* Builder's Kitchen word memory (this device only, local dates). A word is "known" after first-try right answers on 2 different days, and stops counting after a later miss until answered right again.
   Review is due 1, 3 and 7 days after the last practice, then about monthly, and right away after a miss. */
(function () {
  var KEY = "smez-builders-words";
  function today() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function days(a, b) { return Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 864e5); }
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } }
  function write(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  var GAPS = [1, 3, 7];
  var M = {
    record: function (term, ok) {
      var s = read(), w = s[term] || { okDays: [], miss: 0, last: null }, d = today();
      if (ok) { if (w.okDays.indexOf(d) < 0) w.okDays.push(d); } else { w.miss++; w.missed = d; }
      w.res = ok ? "ok" : "miss";
      w.last = d; s[term] = w; write(s); return M.known(term);
    },
    touch: function (terms) { var s = read(), d = today(), ch = 0; terms.forEach(function (t) { if (!s[t]) { s[t] = { okDays: [], miss: 0, last: d, res: "new" }; ch = 1; } }); if (ch) write(s); },
    lastDay: function () { var s = read(), mx = ""; Object.keys(s).forEach(function (k) { if (s[k].last && s[k].last > mx) mx = s[k].last; }); return mx; },
    today: today,
    known: function (term) { var w = read()[term]; return !!(w && w.okDays.length >= 2 && w.res !== "miss"); },
    seen: function (term) { return !!read()[term]; },
    knownCount: function (terms) { return terms.filter(M.known).length; },
    due: function (terms) {
      var s = read(), d = today();
      return terms.filter(function (t) {
        var w = s[t]; if (!w) return false;
        if (w.res === "miss") return true;
        if (w.okDays.length >= 4) return w.last && days(w.last, d) >= 30; /* a monthly check, never retired */
        var gap = GAPS[Math.min(w.okDays.length - 1, GAPS.length - 1)] || 1;
        return w.last && days(w.last, d) >= gap;
      });
    },
    streak: function () {
      var s = read(), set = {}; Object.keys(s).forEach(function (k) { (s[k].okDays || []).forEach(function (d) { set[d] = 1; }); if (s[k].missed) set[s[k].missed] = 1; if (s[k].last) set[s[k].last] = 1; });
      var d = new Date(), n = 0, f = function (x) { return x.getFullYear() + "-" + ("0" + (x.getMonth() + 1)).slice(-2) + "-" + ("0" + x.getDate()).slice(-2); };
      if (!set[f(d)]) d.setDate(d.getDate() - 1);
      while (set[f(d)]) { n++; d.setDate(d.getDate() - 1); }
      return n;
    },
    all: read
  };
  window.BKM = M;
})();
