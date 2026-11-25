/* AI Made EZ Level 4 (Build with Claude): one small kitchen diagram per lesson, drawn as inline SVG (theme colors via CSS variables). */
(function () {
  var S = 'stroke="var(--ink)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  var A = 'stroke="var(--accent)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  function svg(label, body) {
    return '<figure class="kd"><svg viewBox="0 0 320 150" role="img" aria-label="' + label + '">' +
      '<defs><marker id="kda" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs>' + body + "</svg></figure>";
  }
  function t(x, y, s, o) { return '<text x="' + x + '" y="' + y + '" font-size="' + ((o && o.size) || 12) + '" font-weight="' + ((o && o.w) || 600) + '" fill="' + ((o && o.c) || "var(--ink)") + '" text-anchor="' + ((o && o.a) || "middle") + '" font-family="Schibsted Grotesk, sans-serif">' + s + "</text>"; }
  function chef(x, y) { // head + hat
    return '<path d="M' + (x - 13) + " " + (y - 18) + "q-6-14 8-14q5-10 10 0q14 0 8 14z\" " + S + ' fill="var(--card)"/><circle cx="' + x + '" cy="' + y + '" r="12" ' + S + ' fill="var(--card)"/><path d="M' + (x - 18) + " " + (y + 30) + "q18-22 36 0\" " + S + "/>";
  }
  function arrow(x1, y1, x2, y2) { return '<path d="M' + x1 + " " + y1 + "L" + x2 + " " + y2 + '" ' + A + ' marker-end="url(#kda)"/>'; }
  function card(x, y, w, h, fill) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="5" ' + S + ' fill="' + (fill || "var(--card)") + '"/>'; }
  function plate(x, y) { // round plate split into compartments
    return '<circle cx="' + x + '" cy="' + y + '" r="32" ' + S + ' fill="var(--card)"/><path d="M' + (x - 32) + " " + y + "h64M" + x + " " + y + "v32" + '" ' + S + ' stroke-width="1.5"/>';
  }

  window.BK_DIAGRAMS = {
    1: svg("Your app sends an order ticket with four fields (model, max_tokens, messages, system) to the chef, and the plate comes back with a usage receipt",
      card(8, 40, 70, 46) + t(43, 68, "your app") +
      card(100, 14, 108, 86) + t(112, 34, "model", { size: 10, a: "start" }) + t(112, 52, "max_tokens", { size: 10, a: "start" }) + t(112, 70, "messages", { size: 10, a: "start" }) + t(112, 88, "system", { size: 10, a: "start", w: 500 }) +
      arrow(80, 56, 96, 56) + arrow(212, 56, 244, 56) + chef(272, 50) +
      card(232, 106, 78, 26, "var(--track)") + t(271, 123, "usage receipt", { size: 10 }) + arrow(228, 124, 46, 96)),
    2: svg("Four chefs with their input price per million tokens: Haiku $0.10, Sonnet $2, Opus $4 (the usual default) and Fable $8",
      [["Haiku $0.10", 40], ["Sonnet $2", 120], ["Opus $4", 200], ["Fable $8", 280]].map(function (p) { return chef(p[1], 54) + t(p[1], 104, p[0], { size: 11 }); }).join("") +
      t(200, 14, "usual default", { size: 10, c: "var(--accent)" }) +
      '<path d="M182 112h36" ' + A + "/>" + t(160, 138, "input price per MTok")),
    3: svg("The schema is the plate diagram; with output_config.format the chef returns a JSON reply in the same shape, and your code still checks it",
      plate(56, 58) + t(56, 110, "schema", { size: 11 }) + arrow(92, 58, 132, 58) + chef(160, 50) + t(160, 100, "output_config.format", { size: 10, c: "var(--accent)" }) +
      arrow(188, 58, 228, 58) + plate(264, 58) + t(264, 110, "JSON reply", { size: 11 }) + t(160, 140, "your code still checks it")),
    4: svg("The tool loop: Claude writes a tool_use order, your code runs it, the tool_result goes back, and it repeats until end_turn",
      chef(60, 56) + card(130, 14, 80, 26) + t(170, 31, "tool_use", { size: 11 }) +
      card(226, 58, 88, 26) + t(270, 75, "your code runs", { size: 11 }) +
      card(130, 104, 80, 26) + t(170, 121, "tool_result", { size: 11 }) +
      arrow(84, 40, 126, 28) + arrow(214, 30, 254, 54) + arrow(254, 88, 214, 114) + arrow(126, 116, 86, 98) +
      t(170, 76, "repeat", { size: 11, c: "var(--accent)" }) + t(60, 140, "end_turn = done", { size: 10 })),
    5: svg("Caching: the same prompt start is prepped once and repeat calls read it cheaply. Batches: many orders at once for half price, most within an hour",
      t(80, 18, "caching", { w: 700 }) + '<path d="M52 34q28 32 56 0z" ' + S + ' fill="var(--card)"/><path d="M48 34h64" ' + S + "/>" + t(80, 74, "same start", { size: 10 }) +
      arrow(80, 80, 44, 94) + arrow(80, 80, 80, 94) + arrow(80, 80, 116, 94) +
      card(28, 98, 28, 18) + card(66, 98, 28, 18) + card(102, 98, 28, 18) + t(80, 136, "read cheaply", { size: 10, c: "var(--accent)" }) +
      '<path d="M160 10v130" ' + S + ' stroke-width="1.5" stroke-dasharray="4 5"/>' +
      t(240, 18, "batches", { w: 700 }) + card(200, 28, 64, 42) + card(208, 36, 64, 42) + card(216, 44, 64, 42) +
      '<path d="M228 58h40M228 68h30" ' + S + ' stroke-width="1.5"/>' + t(240, 112, "half price", { c: "var(--accent)" }) + t(240, 130, "most within an hour", { size: 10, w: 500 })),
    6: svg("A big recipe library is chunked, the best matching pages are fetched for the chef, and the answer cites its page; a small library is sent whole",
      '<rect x="10" y="26" width="50" height="70" rx="6" ' + S + ' fill="var(--card)"/><path d="M20 26v70" ' + S + "/>" + t(35, 112, "library", { size: 11 }) +
      arrow(64, 60, 80, 60) +
      [[84, 30], [106, 30], [128, 30], [84, 52], [106, 52], [128, 52], [84, 74], [106, 74], [128, 74]].map(function (p, i) { return '<rect x="' + p[0] + '" y="' + p[1] + '" width="18" height="16" rx="3" ' + (i === 4 || i === 6 ? A : S) + ' fill="var(--card)"/>'; }).join("") +
      t(117, 112, "best matches", { size: 11, c: "var(--accent)" }) + arrow(152, 60, 180, 60) + chef(206, 52) +
      arrow(228, 60, 244, 60) + card(248, 36, 62, 48) + '<path d="M256 50h46M256 60h46M256 70h28" ' + S + ' stroke-width="1.5"/>' + t(279, 112, "cites its page", { size: 11 }) +
      t(160, 142, "small? send it whole", { size: 10, w: 500 })),
    7: svg("An eval: test inputs run through your app, a grader (code first) scores each dish, and the scorecard tracks pass rate, cost and speed",
      card(6, 26, 88, 34) + t(50, 48, "test inputs", { size: 11 }) + arrow(96, 43, 112, 43) +
      card(116, 26, 88, 34) + t(160, 48, "your app", { size: 11 }) + arrow(206, 43, 222, 43) +
      card(226, 26, 88, 34) + t(270, 42, "grader", { size: 11 }) + t(270, 54, "code first", { size: 10, w: 500 }) +
      arrow(270, 64, 270, 88) +
      '<rect x="40" y="92" width="240" height="32" rx="5" ' + S + ' fill="var(--track)"/><path d="M120 92v32M200 92v32" ' + S + ' stroke-width="1.5"/>' +
      t(80, 113, "pass rate", { size: 11 }) + t(160, 113, "cost", { size: 11 }) + t(240, 113, "speed", { size: 11 }) + t(160, 144, "score all three", { size: 10, c: "var(--accent)" })),
    8: svg("Opening night: busy errors 429 and 529 mean wait longer each time and retry; your errors 400 and 401 mean fix the request; cap the bill with a spend limit",
      card(6, 58, 64, 30) + t(38, 78, "request", { size: 11 }) + arrow(72, 64, 108, 40) + arrow(72, 82, 108, 106) +
      card(112, 22, 96, 28) + t(160, 40, "429 · 529 busy", { size: 11 }) +
      [216, 230, 252, 284].map(function (x) { return '<circle cx="' + x + '" cy="36" r="4" ' + A + "/>"; }).join("") + t(254, 64, "wait longer, retry", { size: 10 }) +
      card(112, 94, 96, 28) + t(160, 112, "400 · 401 yours", { size: 11 }) + arrow(212, 108, 226, 108) + t(230, 112, "fix the request", { size: 10, a: "start" }) +
      t(160, 144, "set a spend limit", { size: 11, c: "var(--accent)" }))
  };
})();
