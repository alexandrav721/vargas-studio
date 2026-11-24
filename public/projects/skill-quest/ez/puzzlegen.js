/* AI Made EZ puzzle makers: word search, crossword and scramble from a family's own words.
   Pure functions with a seeded random generator, so the same answers always give the same puzzles (until "New puzzles"). */
(function (root) {
  "use strict";
  function rng(seed) { var s = (seed >>> 0) || 1; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  function shuffle(a, r) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var LETTERS = "AAABCDEEEEFGHIIIJKLMNNOOOPQRRSSTTTUUVWXYZ";

  /* word search: dirs = list of [dr, dc]; returns { size, grid, placed: [{word, r, c, dr, dc}], skipped } */
  function wordSearch(words, size, dirs, seed) {
    var r = rng(seed), grid = [], placed = [], skipped = [];
    for (var i = 0; i < size; i++) grid.push(new Array(size).fill(""));
    var list = words.slice().sort(function (a, b) { return b.length - a.length; });
    list.forEach(function (w) {
      if (w.length > size) { skipped.push(w); return; }
      for (var tries = 0; tries < 300; tries++) {
        var d = dirs[Math.floor(r() * dirs.length)], dr = d[0], dc = d[1];
        var r0 = Math.floor(r() * size), c0 = Math.floor(r() * size);
        var r1 = r0 + dr * (w.length - 1), c1 = c0 + dc * (w.length - 1);
        if (r1 < 0 || r1 >= size || c1 < 0 || c1 >= size) continue;
        var ok = true;
        for (var k = 0; k < w.length; k++) { var ch = grid[r0 + dr * k][c0 + dc * k]; if (ch && ch !== w[k]) { ok = false; break; } }
        if (!ok) continue;
        for (k = 0; k < w.length; k++) grid[r0 + dr * k][c0 + dc * k] = w[k];
        placed.push({ word: w, r: r0, c: c0, dr: dr, dc: dc });
        return;
      }
      skipped.push(w);
    });
    for (i = 0; i < size; i++) for (var j = 0; j < size; j++) if (!grid[i][j]) grid[i][j] = LETTERS[Math.floor(r() * LETTERS.length)];
    return { size: size, grid: grid, placed: placed, skipped: skipped };
  }

  /* crossword: entries [{word, clue}]; greedy placement with real crossings; returns cropped grid with numbers */
  function crossword(entries, seed) {
    var best = null;
    for (var t = 0; t < 40; t++) {
      var c = crossOnce(entries, (seed + t * 7919) >>> 0);
      if (!c) continue;
      var n = c.across.length + c.down.length, area = c.rows * c.cols, fit = c.rows <= 15 && c.cols <= 15;
      if (!best || (fit && !best.fit) || (fit === best.fit && (n > best.n || (n === best.n && area < best.area)))) best = { c: c, n: n, area: area, fit: fit };
      if (best.fit && best.n === entries.length) break;
    }
    return best ? best.c : null;
  }
  function crossOnce(entries, seed) {
    var r = rng(seed), N = 31, g = [], i, j;
    for (i = 0; i < N; i++) g.push(new Array(N).fill(""));
    var list = shuffle(entries, r).sort(function (a, b) { return b.word.length - a.word.length; });
    var placed = [], skipped = [];
    function at(y, x) { return y < 0 || x < 0 || y >= N || x >= N ? "" : g[y][x]; }
    function fits(w, y, x, dir) {
      var dy = dir === "d" ? 1 : 0, dx = dir === "a" ? 1 : 0, cross = 0;
      if (y < 0 || x < 0 || y + dy * (w.length - 1) >= N || x + dx * (w.length - 1) >= N) return -1;
      if (at(y - dy, x - dx) || at(y + dy * w.length, x + dx * w.length)) return -1;
      for (var k = 0; k < w.length; k++) {
        var yy = y + dy * k, xx = x + dx * k, ch = g[yy][xx];
        if (ch) { if (ch !== w[k]) return -1; cross++; }
        else if (at(yy + dx, xx + dy) || at(yy - dx, xx - dy)) return -1;
      }
      return cross;
    }
    function put(e, y, x, dir) { var dy = dir === "d" ? 1 : 0, dx = dir === "a" ? 1 : 0; for (var k = 0; k < e.word.length; k++) g[y + dy * k][x + dx * k] = e.word[k]; placed.push({ word: e.word, clue: e.clue, y: y, x: x, dir: dir }); }
    function tryPlace(e) {
      var w = e.word;
      if (w.length > 15) return false;
      if (!placed.length) { put(e, Math.floor(N / 2), Math.floor((N - w.length) / 2), "a"); return true; }
      var best = null;
      placed.forEach(function (p) {
        for (var a = 0; a < p.word.length; a++) for (var b = 0; b < w.length; b++) {
          if (p.word[a] !== w[b]) continue;
          var dir = p.dir === "a" ? "d" : "a";
          var y = p.dir === "a" ? p.y - b : p.y + a, x = p.dir === "a" ? p.x + a : p.x - b;
          var c = fits(w, y, x, dir);
          if (c > 0 && (!best || c > best.c || (c === best.c && r() < 0.3))) best = { y: y, x: x, dir: dir, c: c };
        }
      });
      if (best) { put(e, best.y, best.x, best.dir); return true; }
      return false;
    }
    var left = list, progress = true;
    while (left.length && progress) {
      var next = []; progress = false;
      left.forEach(function (e) { if (tryPlace(e)) progress = true; else next.push(e); });
      left = next;
    }
    skipped = left;
    if (!placed.length) return null;
    var minY = N, minX = N, maxY = 0, maxX = 0;
    for (i = 0; i < N; i++) for (j = 0; j < N; j++) if (g[i][j]) { minY = Math.min(minY, i); maxY = Math.max(maxY, i); minX = Math.min(minX, j); maxX = Math.max(maxX, j); }
    var rows = maxY - minY + 1, cols = maxX - minX + 1, cells = [];
    for (i = 0; i < rows; i++) { cells.push([]); for (j = 0; j < cols; j++) cells[i].push({ ch: g[i + minY][j + minX], n: 0 }); }
    placed.forEach(function (p) { p.y -= minY; p.x -= minX; });
    var num = 0, starts = {};
    for (i = 0; i < rows; i++) for (j = 0; j < cols; j++) {
      var here = placed.filter(function (p) { return p.y === i && p.x === j; });
      if (here.length) { num++; cells[i][j].n = num; here.forEach(function (p) { p.n = num; }); starts[i + "," + j] = num; }
    }
    var across = placed.filter(function (p) { return p.dir === "a"; }).sort(function (a, b) { return a.n - b.n; });
    var down = placed.filter(function (p) { return p.dir === "d"; }).sort(function (a, b) { return a.n - b.n; });
    return { rows: rows, cols: cols, cells: cells, across: across, down: down, skipped: skipped };
  }

  function scramble(word, seed) {
    var r = rng(seed), s = word;
    for (var t = 0; t < 20 && (s === word || s.length < 2); t++) s = shuffle(word.split(""), r).join("");
    return s;
  }
  root.PuzzleGen = { rng: rng, shuffle: shuffle, wordSearch: wordSearch, crossword: crossword, scramble: scramble };
})(typeof window !== "undefined" ? window : globalThis);
