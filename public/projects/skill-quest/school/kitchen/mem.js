/* Builder's Kitchen word memory (this device only). A word is "known" after 2 first-try right answers on 2 different days.
   Review is due 1, 3 and 7 days after the last practice, and right away after a miss. */
(function () {
  var KEY = "smez-builders-words";
  function today() { return new Date().toISOString().slice(0, 10); }
  function days(a, b) { return Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 864e5); }
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } }
  function write(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  var GAPS = [1, 3, 7];
  var M = {
    record: function (term, ok) {
      var s = read(), w = s[term] || { okDays: [], miss: 0, last: null }, d = today();
      if (ok) { if (w.okDays.indexOf(d) < 0) w.okDays.push(d); } else { w.miss++; w.missed = d; }
      w.last = d; s[term] = w; write(s); return M.known(term);
    },
    known: function (term) { var w = read()[term]; return !!(w && w.okDays.length >= 2); },
    seen: function (term) { return !!read()[term]; },
    knownCount: function (terms) { var s = read(); return terms.filter(function (t) { return s[t] && s[t].okDays.length >= 2; }).length; },
    due: function (terms) {
      var s = read(), d = today();
      return terms.filter(function (t) {
        var w = s[t]; if (!w) return false;
        if (w.missed && (!w.okDays.length || w.missed >= w.okDays[w.okDays.length - 1])) return true;
        if (w.okDays.length >= 4) return false;
        var gap = GAPS[Math.min(w.okDays.length - 1, GAPS.length - 1)] || 1;
        return w.last && days(w.last, d) >= gap;
      });
    },
    all: read
  };
  window.BKM = M;
})();
