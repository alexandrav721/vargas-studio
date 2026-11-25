/* AI Made EZ Level 5 "Design AI systems": one small kitchen diagram per lesson, drawn as inline SVG (theme colors via CSS variables). */
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
  function counter(x, y, w) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="10" rx="3" ' + S + ' fill="var(--track)"/>'; }

  window.BK_DIAGRAMS = {
    1: svg("Left, a set menu: three steps in a fixed line, a workflow where your code fixes the steps. Right, a free chef choosing its own steps, an agent where Claude picks the steps.",
      t(80, 24, "set menu", { w: 700 }) +
      [14, 64, 114].map(function (x, i) { return card(x, 46, 32, 28) + t(x + 16, 65, String(i + 1), { size: 12 }); }).join("") +
      arrow(48, 60, 60, 60) + arrow(98, 60, 110, 60) +
      t(80, 106, "workflow", { c: "var(--accent)" }) + t(80, 122, "code fixes the steps", { size: 10, w: 500 }) +
      '<path d="M160 16v118" ' + S + ' stroke-width="1" stroke-dasharray="3 5"/>' +
      t(240, 24, "free chef", { w: 700 }) + chef(200, 70) +
      card(262, 34, 34, 20) + t(279, 48, "?", { size: 11 }) + card(270, 64, 34, 20) + t(287, 78, "?", { size: 11 }) + card(256, 94, 34, 20) + t(273, 108, "?", { size: 11 }) +
      arrow(218, 62, 256, 46) + arrow(220, 72, 264, 74) + arrow(218, 82, 252, 100) +
      t(240, 126, "agent", { c: "var(--accent)" }) + t(240, 142, "Claude picks steps", { size: 10, w: 500 })),
    2: svg("A Claude app plugs into one standard outlet, the MCP server, which offers three sockets: tools, resources and prompts. The wire is the transport, stdio or Streamable HTTP.",
      card(8, 46, 74, 44) + t(45, 66, "Claude", { size: 11 }) + t(45, 80, "app", { size: 11 }) +
      arrow(84, 68, 120, 68) +
      '<rect x="124" y="16" width="188" height="96" rx="8" ' + S + ' fill="var(--track)"/>' + t(218, 34, "MCP server", { w: 700 }) +
      [["tools", 156], ["resources", 218], ["prompts", 280]].map(function (p) { var x = p[1]; return '<rect x="' + (x - 18) + '" y="44" width="36" height="34" rx="6" ' + S + ' fill="var(--card)"/><path d="M' + (x - 6) + " 54v12M" + (x + 6) + ' 54v12" ' + S + "/>" + t(x, 98, p[0], { size: 11 }); }).join("") +
      t(160, 140, "transport: stdio or HTTP", { size: 12, c: "var(--accent)" })),
    3: svg("The harness is the frame around the chef: the model only decides, the harness runs the loop and each tool runs inside a walled-off sandbox.",
      '<rect x="10" y="10" width="300" height="118" rx="8" ' + S + ' stroke-dasharray="5 5"/>' + t(22, 28, "HARNESS", { size: 11, w: 800, a: "start" }) +
      chef(78, 74) + t(78, 120, "model decides", { size: 11 }) +
      '<rect x="196" y="30" width="98" height="78" rx="6" ' + S + ' fill="var(--track)"/>' + t(245, 48, "sandbox", { size: 11, w: 700 }) +
      card(225, 58, 40, 26) + '<circle cx="245" cy="71" r="6" ' + S + "/>" + t(245, 100, "tool runs here", { size: 10, w: 500 }) +
      arrow(106, 60, 190, 60) + arrow(190, 90, 106, 90) +
      t(160, 144, "the harness runs the loop")),
    4: svg("A lead agent sends a brief to three helper chefs, each on its own clean counter, and gets a short summary back. Multi-agent uses about 15 times the tokens of a chat.",
      chef(44, 56) + t(44, 108, "lead agent", { size: 11 }) +
      arrow(72, 46, 138, 46) + t(105, 38, "brief", { size: 10 }) +
      arrow(138, 74, 72, 74) + t(105, 90, "summary", { size: 10 }) +
      [176, 232, 288].map(function (x) { return chef(x, 56) + counter(x - 24, 92, 48); }).join("") +
      t(232, 120, "own clean counter", { size: 10, w: 500 }) +
      t(160, 144, "about 15x chat tokens", { c: "var(--accent)" })),
    5: svg("A crowded counter blurs, called context rot. Progress goes into a notes file, and the next shift reads the notes first on a clean counter.",
      [[14, 66], [30, 58], [48, 70], [64, 56], [80, 68], [94, 60]].map(function (p) { return card(p[0], p[1], 26, 30); }).join("") + counter(8, 96, 116) +
      t(66, 124, "context rot", { c: "var(--accent)" }) + t(66, 138, "full counter blurs", { size: 10, w: 500 }) +
      arrow(126, 72, 138, 72) +
      card(140, 46, 40, 50) + '<path d="M148 60h24M148 70h24M148 80h16" ' + S + ' stroke-width="1.5"/>' + t(160, 112, "notes file", { size: 10 }) +
      arrow(182, 72, 214, 72) +
      chef(262, 54) + counter(216, 96, 92) +
      t(262, 124, "next shift") + t(262, 138, "reads notes first", { size: 10, w: 500 })),
    6: svg("An untrusted email can carry hidden orders. The chef holds only the keys the job needs, and the door to sends, payments and deletes has an approval gate that waits for a person.",
      '<rect x="10" y="40" width="64" height="44" rx="4" ' + S + ' fill="var(--card)"/><path d="M10 44l32 22l32-22" ' + S + "/>" + t(42, 102, "untrusted email", { size: 10 }) +
      arrow(78, 62, 100, 62) +
      chef(132, 52) + '<circle cx="164" cy="88" r="6" ' + A + '/><path d="M170 88h16M182 88v6M178 88v4" ' + A + "/>" +
      t(140, 122, "only keys needed", { size: 11 }) +
      '<rect x="210" y="14" width="100" height="98" rx="4" ' + S + ' fill="var(--track)"/>' +
      '<rect x="250" y="60" width="20" height="16" rx="3" ' + S + ' fill="var(--card)"/><path d="M254 60v-6a6 6 0 0 1 12 0v6" ' + S + "/>" +
      t(260, 32, "sends, payments,", { size: 10 }) + t(260, 46, "deletes", { size: 10 }) +
      arrow(186, 66, 204, 66) +
      t(260, 130, "approval gate", { c: "var(--accent)" }) + t(260, 144, "waits for a person", { size: 10, w: 500 })),
    7: svg("Head office keeps a trace of every call, tool and cost the agent makes, and a person on the floor can switch the agent off fast.",
      chef(42, 58) + arrow(66, 64, 92, 64) +
      card(96, 16, 104, 96) +
      [["call", 40], ["tool", 64], ["cost", 88]].map(function (p) { return '<path d="M108 ' + (p[1] - 4) + 'h6" ' + A + "/>" + t(122, p[1], p[0], { size: 11, a: "start" }) + '<path d="M156 ' + (p[1] - 4) + 'h32" ' + S + ' stroke-width="1.5"/>'; }).join("") +
      t(148, 130, "trace of every step", { size: 11 }) +
      '<rect x="232" y="44" width="64" height="32" rx="16" ' + S + ' fill="var(--track)"/><circle cx="250" cy="60" r="11" ' + A + ' fill="var(--card)"/>' + t(277, 64, "off", { size: 10, a: "middle" }) +
      t(264, 100, "a person can", { size: 11 }) + t(264, 114, "switch it off", { size: 11, c: "var(--accent)" })),
    8: svg("The design doc lists trade-offs, cost, failures and approvals, and plans the blast radius: how far the damage spreads on a bad night.",
      card(16, 10, 140, 124) + t(86, 30, "DESIGN DOC", { size: 11, w: 800 }) +
      [["trade-offs", 54], ["cost", 76], ["failures", 98], ["approvals", 120]].map(function (p) { return '<rect x="30" y="' + (p[1] - 10) + '" width="11" height="11" rx="2" ' + S + ' stroke-width="1.5"/>' + t(50, p[1], p[0], { size: 11, a: "start" }); }).join("") +
      [14, 30, 46].map(function (r) { return '<circle cx="240" cy="64" r="' + r + '" ' + A + ' stroke-dasharray="5 5"/>'; }).join("") +
      '<circle cx="240" cy="64" r="5" fill="var(--accent)"/>' +
      t(240, 130, "blast radius") + t(240, 144, "how far damage spreads", { size: 10, w: 500 }))
  };
})();
