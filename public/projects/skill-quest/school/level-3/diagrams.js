/* AI Made EZ Level 3 "Claude at work": one small kitchen diagram per lesson, drawn as inline SVG (theme colors via CSS variables). */
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
  function file(x, y, ext) { // page with a folded corner
    return '<path d="M' + x + " " + y + "h24l10 10v32h-34z\" " + S + ' fill="var(--card)"/><path d="M' + (x + 24) + " " + y + "v10h10\" " + S + "/>" + t(x + 17, y + 32, ext, { size: 10 }); }

  window.BK_DIAGRAMS = {
    1: svg("One chef in the middle linked to five stations: chat, research, Cowork, Claude in Chrome and Claude Code. Same chef, five stations.",
      chef(160, 38) +
      [["Chat", 34], ["Research", 97], ["Cowork", 160], ["Chrome", 223], ["Claude Code", 286]].map(function (p) {
        return '<path d="M160 72L' + p[1] + ' 90" ' + A + "/>" + card(p[1] - 30, 90, 60, 30) + (p[0] === "Claude Code" ? t(p[1], 103, "Claude", { size: 10 }) + t(p[1], 115, "Code", { size: 10 }) : t(p[1], 109, p[0], { size: 11 })); }).join("") +
      t(160, 142, "same chef, five stations")),
    2: svg("Three layers of standing orders feed the chef: instructions for every chat, project instructions for one job, and memory that remembers you.",
      card(14, 10, 186, 30) + t(26, 30, "Instructions: every chat", { size: 11, a: "start" }) +
      card(14, 48, 186, 30) + t(26, 68, "Project: one job", { size: 11, a: "start" }) +
      card(14, 86, 186, 30, "var(--track)") + t(26, 106, "Memory: remembers you", { size: 11, a: "start" }) +
      arrow(206, 25, 238, 52) + arrow(206, 63, 238, 63) + arrow(206, 101, 238, 76) + chef(270, 58) +
      t(160, 142, "set once, used every shift")),
    3: svg("The chef plates real files, an Excel sheet, a Word doc, a PowerPoint deck and a PDF, and they stay private until you share them.",
      chef(34, 58) + arrow(58, 58, 74, 58) +
      file(80, 36, "xlsx") + file(122, 36, "docx") + file(164, 36, "pptx") + file(206, 36, "pdf") +
      '<rect x="262" y="52" width="32" height="26" rx="4" ' + S + ' fill="var(--card)"/><path d="M269 52v-8q0-10 9-10t9 10v8" ' + S + '/><circle cx="278" cy="65" r="3" ' + A + "/>" +
      t(278, 98, "private", { size: 11, c: "var(--accent)" }) + t(278, 112, "until you Share", { size: 10, w: 500 }) +
      t(160, 142, "real files you download")),
    4: svg("Research is a market run: the chef visits many sources and comes back with one answer where every claim has a source link.",
      chef(36, 60) +
      [["[1]", 8], ["[2]", 42], ["[3]", 76]].map(function (p) {
        return arrow(60, 60, 112, p[1] + 13) + card(116, p[1], 50, 24) + t(141, p[1] + 17, p[0], { size: 11 }); }).join("") +
      arrow(170, 60, 208, 60) + card(212, 22, 94, 76) + t(259, 40, "one answer", { size: 11 }) +
      '<path d="M224 52h70M224 62h60M224 72h66" ' + S + ' stroke-width="1.5"/>' + t(259, 90, "[1] [2] [3]", { size: 10, c: "var(--accent)" }) +
      t(141, 116, "many sources", { size: 10, w: 500 }) + t(259, 114, "source links", { size: 10, w: 500 }) +
      t(160, 142, "every claim needs a receipt")),
    5: svg("The storeroom has three shelves: reading is set to Always allow, sending, sharing or deleting to Always ask, and what the job never needs to Blocked.",
      chef(36, 60) + '<rect x="84" y="8" width="226" height="112" rx="6" ' + S + ' fill="var(--track)"/><path d="M84 45h226M84 82h226" ' + S + "/>" +
      t(96, 31, "reading", { size: 11, a: "start" }) + card(206, 15, 94, 24) + t(253, 31, "Always allow", { size: 11 }) +
      t(96, 68, "send, share, delete", { size: 11, a: "start" }) + card(206, 52, 94, 24) + '<rect x="206" y="52" width="94" height="24" rx="5" ' + A + "/>" + t(253, 68, "Always ask", { size: 11, c: "var(--accent)" }) +
      t(96, 105, "not needed", { size: 11, a: "start" }) + card(206, 89, 94, 24) + t(253, 105, "Blocked", { size: 11 }) +
      t(160, 142, "you decide which shelves")),
    6: svg("A Cowork handoff: you describe the task, Claude plans and works, you steer mid-task, and you check the result before it goes out.",
      [["describe", 38], ["plan", 119], ["work", 200], ["you check", 281]].map(function (p, i) {
        return card(p[1] - 32, 62, 64, 32, i === 3 ? "var(--track)" : "") + t(p[1], 82, p[0], { size: 11 }) + (i < 3 ? arrow(p[1] + 34, 78, p[1] + 46, 78) : ""); }).join("") +
      t(200, 22, "you steer", { size: 11, c: "var(--accent)" }) + arrow(200, 30, 200, 58) +
      t(160, 132, "taste it before it goes out")),
    7: svg("Your request is matched against the recipe card's description first; if it fits, Claude opens the full card with your team's steps and rules.",
      card(8, 46, 96, 34) + t(56, 67, "“weekly update”", { size: 10 }) + t(56, 98, "your request", { size: 10, w: 500 }) +
      arrow(108, 58, 138, 34) +
      card(144, 12, 166, 108) + '<rect x="144" y="12" width="166" height="36" rx="5" ' + A + ' fill="var(--track)"/>' + t(227, 35, "description", { size: 12, w: 700, c: "var(--accent)" }) +
      t(227, 70, "steps and rules", { size: 11 }) + '<path d="M164 84h126M164 96h110M164 108h118" ' + S + ' stroke-width="1.5"/>' +
      t(160, 142, "Claude reads the description first")),
    8: svg("A safe kitchen at work: no passwords in the pot, the training setting decides who keeps the leftovers, and the org owner holds the keys.",
      '<path d="M30 60h50v26q0 10-10 10h-30q-10 0-10-10z" ' + S + ' fill="var(--card)"/><path d="M24 60h62M30 68h-8M80 68h8" ' + S + "/>" +
      card(40, 22, 30, 20) + t(55, 37, "***", { size: 12 }) + '<path d="M32 46l46-28" ' + A + "/>" +
      '<rect x="135" y="52" width="50" height="40" rx="5" ' + S + ' fill="var(--card)"/><rect x="130" y="44" width="60" height="9" rx="3" ' + S + ' fill="var(--track)"/>' +
      '<circle cx="248" cy="68" r="12" ' + S + ' fill="var(--card)"/><path d="M260 68h32M284 68v9M276 68v6" ' + S + "/>" +
      t(55, 116, "the pot", { size: 11 }) + t(55, 132, "no passwords", { size: 10, c: "var(--accent)" }) +
      t(160, 116, "the leftovers", { size: 11 }) + t(160, 132, "training setting", { size: 10, c: "var(--accent)" }) +
      t(265, 116, "the keys", { size: 11 }) + t(265, 132, "org owner", { size: 10, c: "var(--accent)" }))
  };
})();
