/* Builder's Kitchen: one small kitchen diagram per lesson, drawn as inline SVG (theme colors via CSS variables). */
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

  window.BK_DIAGRAMS = {
    1: svg("The chef (model) at the counter (context window), with your order ticket (prompt) on it",
      chef(160, 46) + '<rect x="30" y="96" width="260" height="14" rx="3" ' + S + ' fill="var(--track)"/>' +
      card(52, 74, 46, 22) + t(75, 89, "order", { size: 10 }) + card(222, 74, 46, 22) + t(245, 89, "reply", { size: 10 }) +
      t(160, 132, "the counter = context window") + t(205, 30, "the chef = model", { a: "start" }) + t(75, 66, "prompt", { c: "var(--accent)" })),
    2: svg("An app sends a request through the order window (API) and gets a response back",
      card(8, 50, 74, 52) + t(45, 74, "the app") + t(45, 90, "(waiter)", { size: 10, w: 500 }) + '<rect x="146" y="34" width="60" height="86" rx="4" ' + S + '/><path d="M146 64h60" ' + S + "/>" + t(176, 54, "API", { w: 700 }) +
      chef(276, 62) + arrow(86, 66, 140, 66) + arrow(140, 92, 86, 92) + t(113, 58, "request", { size: 10 }) + t(113, 110, "response", { size: 10 }) +
      arrow(210, 72, 246, 72) + t(160, 142, "the window remembers nothing")),
    3: svg("House rules (the system prompt) hang on the wall above the chef",
      card(96, 6, 128, 54) + t(160, 22, "HOUSE RULES", { w: 800, size: 11 }) + '<path d="M110 32h88M110 42h100M110 52h70" ' + S + ' stroke-width="1.5"/>' +
      chef(160, 100) + t(160, 146, "system prompt = rules on the wall") + t(262, 100, "every plate", { size: 11, c: "var(--accent)" }) + t(262, 114, "is shaped by them", { size: 11, c: "var(--accent)" })),
    4: svg("The chef asks for an appliance (tool call), your code runs it, and the result comes back",
      chef(40, 66) + card(84, 22, 110, 28) + t(139, 40, "use: weather", { size: 11 }) + arrow(62, 56, 82, 44) +
      '<rect x="236" y="30" width="66" height="56" rx="8" ' + S + ' fill="var(--card)"/><circle cx="269" cy="58" r="12" ' + S + "/>" + t(269, 104, "the app runs it", { size: 11 }) +
      arrow(198, 36, 230, 44) + card(84, 92, 110, 28) + t(139, 110, "result: rain", { size: 11 }) + arrow(232, 80, 198, 100) + arrow(80, 104, 62, 92) + t(160, 144, "Claude asks. The app (waiter) presses the button.")),
    5: svg("A wall of identical outlets (MCP) with Drive, Slack and Calendar plugged in",
      '<rect x="20" y="20" width="280" height="64" rx="6" ' + S + ' fill="var(--track)"/>' +
      [70, 160, 250].map(function (x) { return '<rect x="' + (x - 18) + '" y="34" width="36" height="36" rx="6" ' + S + ' fill="var(--card)"/><path d="M' + (x - 6) + " 46v10M" + (x + 6) + ' 46v10" ' + S + "/>"; }).join("") +
      [["Drive", 70], ["Slack", 160], ["Calendar", 250]].map(function (p) { return '<path d="M' + p[1] + " 72v26\" " + A + "/>" + card(p[1] - 34, 98, 68, 24) + t(p[1], 114, p[0], { size: 11 }); }).join("") +
      t(160, 144, "MCP = one plug shape, any appliance")),
    6: svg("Pages are pulled from the recipe binder and laid on the counter for the chef",
      '<rect x="16" y="30" width="70" height="86" rx="6" ' + S + ' fill="var(--card)"/><path d="M28 30v86" ' + S + "/>" + t(56, 132, "your binder", { size: 11 }) +
      card(118, 44, 40, 50) + '<path d="M126 58h24M126 68h24M126 78h16" ' + S + ' stroke-width="1.5"/>' + t(138, 108, "right page", { size: 10, c: "var(--accent)" }) +
      arrow(90, 70, 114, 70) + arrow(162, 70, 196, 70) + chef(250, 54) + '<rect x="200" y="100" width="104" height="10" rx="3" ' + S + ' fill="var(--track)"/>' + t(230, 146, "RAG: look it up, then cook")),
    7: svg("The agent loop: think, use a tool, check, repeat, with sous-chefs (subagents) helping",
      chef(62, 52) + '<circle cx="206" cy="68" r="36" ' + A + ' stroke-dasharray="6 6"/>' + t(206, 22, "think", { size: 11 }) + t(262, 72, "tool", { size: 11, a: "start" }) + t(206, 124, "check", { size: 11 }) + t(150, 72, "repeat", { size: 11, a: "end" }) +
      arrow(234, 46, 240, 56) + '<circle cx="34" cy="118" r="7" ' + S + '/><circle cx="90" cy="118" r="7" ' + S + "/>" + t(62, 146, "sous-chefs = subagents", { size: 11 }) + t(306, 146, "agent loop", { size: 11, a: "end", c: "var(--accent)" })),
    8: svg("Your own kitchen: the CLAUDE.md note on the fridge, recipe cards (skills) and a bell (hook)",
      '<rect x="22" y="14" width="70" height="116" rx="8" ' + S + ' fill="var(--card)"/><path d="M22 54h70M80 30v14M80 66v20" ' + S + "/>" + card(32, 62, 40, 30, "var(--accent-bg, var(--track))") + t(52, 81, "note", { size: 10 }) + t(57, 146, "CLAUDE.md", { size: 11 }) +
      card(120, 40, 60, 40) + card(128, 48, 60, 40) + t(158, 72, "recipe", { size: 10 }) + t(158, 108, "skills", { size: 11 }) +
      '<path d="M234 82q0-40 22-40t22 40z" ' + S + ' fill="var(--card)"/><path d="M228 82h56" ' + S + '/><circle cx="256" cy="90" r="5" ' + A + '/><path d="M256 42v-8" ' + S + "/>" + t(256, 112, "hook = a bell", { size: 11 }) + t(256, 126, "at set moments", { size: 10, w: 500 })),
    9: svg("A taste test: the same dishes scored each time, two pass and one fails",
      [60, 160, 260].map(function (x, i) { return '<path d="M' + (x - 34) + " 60q34 44 68 0z\" " + S + ' fill="var(--card)"/><path d="M' + (x - 38) + " 60h76\" " + S + "/>" + t(x, 94, i < 2 ? "✓ pass" : "✗ fail", { size: 12, w: 700, c: i < 2 ? "var(--ok)" : "var(--accent)" }); }).join("") +
      t(160, 30, "same 20 dishes, same scorecard", { size: 12 }) + t(160, 132, "eval = a taste test you can repeat")),
    10: svg("The floor plan of an AI kitchen: chef, rules, appliances, outlets, binder and taste test",
      '<rect x="12" y="12" width="296" height="118" rx="8" ' + S + ' stroke-dasharray="4 5"/>' +
      [["chef", 62, 40], ["rules", 160, 40], ["tools", 258, 40], ["outlets", 62, 96], ["binder", 160, 96], ["taste test", 258, 96]].map(function (p) { return card(p[1] - 42, p[2] - 16, 84, 32) + t(p[1], p[2] + 5, p[0], { size: 12 }); }).join("") +
      t(160, 146, "architecture = your kitchen floor plan"))
  };
})();
