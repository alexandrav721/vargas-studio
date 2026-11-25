/* AI Made EZ · Level 3 · Lesson 4 · Do the research (Research, web search, sources, limits). Terms: Research, source link, page fetch, usage limit. */
(function () {
  var L = {
    n: 4, id: "c4", mins: 6, title: "Do the research.", stamp: "Research",
    terms: ["Research", "Source link", "Page fetch", "Usage limit"],
    teaser: ["MARKET RUN", "research", "Send a runner to many shops.<br>It comes back with a summary<br>and a receipt for every item.", "Four words. Six minutes."],
    lines: [
      ["Research is the long market run.", "Claude searches many sources, then writes one answer with links. Paid plans."],
      ["Turn it on with the + button.", "Tap +, then Research. Web search must be on too."],
      ["Every claim needs a receipt.", "Answers come with source links. Open the ones you’ll repeat at work."]
    ],
    guess: { q: "Claude’s research says a vendor costs $12 a seat. What do you do before telling your boss?", opts: [["Open the source link and check the vendor’s own page", true], ["Trust it, since it has a link", false], ["Ask Claude if it’s sure", false]], reveal: "A link is only a receipt. Open it, and check the date and who wrote it." },
    startLabel: "Watch a run",
    example: {
      title: "“Which 3 scheduling tools fit a 12-person clinic?”",
      html:
        '<p class="label">Research on <span class="sample">Sample</span></p>' +
        '<div class="reply"><p class="who">claude</p>Searching… reading pricing pages… comparing…</div>' +
        '<div class="reply"><p class="who">claude</p>Tool A: $8 a seat, has text reminders [1]. Tool B: free under 10 staff [2]…</div>' +
        '<p class="small">[1] and [2] are <b>source links</b>. Open them. Is it the company’s own page? Is it dated this year?</p>' +
        '<p class="small">Research also reads connected apps (Gmail, Calendar, Docs) that are on for that chat. On the phone app it searches only the web.</p>' +
        '<p class="small">Paste a web address and Claude reads that one page: a <b>page fetch</b>. Long runs use up your <b>usage limit</b> faster.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Send Claude on a market run.",
      lead: "Pick a work question and how strict to be. Your ticket returns a one-page brief with sources you can check.",
      state: { q: "compare 3 tools for a job my team does", strict: "only official or dated sources" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">The question</p>' + row("q", ["compare 3 tools for a job my team does", "what changed in a rule that affects my work this year", "what customers say about a product we sell", "how other teams handle a problem we have"]) +
          '<p class="label">Sources</p>' + row("strict", ["only official or dated sources", "include news and reviews, labeled"]);
      },
      head: "ORDER #C04", right: "research brief", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "Use Research if it’s on, or web search if not. My question: " + s.q + ". Ask me 2 questions first to make it specific.\n" +
          "Sources: " + s.strict + ".\n" +
          "Give me a one-page brief: 1. The answer in 3 lines. 2. Five key findings, each with its source link and date.\n" +
          "3. Mark which come from the original source (the company, the law, the study). 4. Where sources disagree, and what you couldn’t confirm.\n" +
          "5. Three things I should check myself before I use this at work.";
      },
      claude: "Open in Claude", done: "Done →",
      after: "Research is on paid plans. Tap + at the bottom left, then Research. A blue marker shows it’s on."
    },
    game: {
      type: "tapall", title: "You’ll quote a price to your boss. Which sources pass?", lead: "Tap the {n} that pass.",
      options: [
        ["The vendor’s own pricing page, dated this year", true], ["A link you opened that says the same thing Claude said", true],
        ["Claude’s summary with no link", false, "No receipt. Ask for the source or look it up."],
        ["A blog post from three years ago", false, "Prices change. Old pages go stale."]
      ],
      right: "Yes. The original source, opened by you, and recent.",
      wrong: "Would that hold up if your boss clicked it?",
      habitTitle: "Work habit", habit: "Open every link you’ll repeat to someone else. Read the date and who wrote it."
    },
    breaks: {
      title: "The runner can misread the label.",
      lines: [
        ["A link isn’t a check.", "Claude can cite a real page and still get it wrong. Open it."],
        ["Research can read your connected email and docs.", "Turn off the connectors this question doesn’t need."]
      ],
      where: "A market runner brings back the actual item. Claude brings back a summary of what it read, and summaries can slip."
    },
    quiz: [
      { term: "Research", q: "What must be on for Research to work?", a: ["Web search", "Memory", "File creation"], ok: 0, why: "Right. No web search, no market run." },
      { term: "Page fetch", q: "You paste one web address into a chat with web search on. What does Claude do?", a: ["Reads that page and works with it", "Ignores it", "Saves it for later without reading it"], ok: 0, why: "Right. That’s a page fetch: one page, read on request." },
      { term: "Citations", q: "From Level 2: what are citations?", a: ["Pointers to the source a reply used, so people can check", "Claude’s own opinion of a source", "A list of every site on the web"], ok: 0, why: "Right. Receipts you can open." }
    ],
    say: "I ran it through Research and opened every source I’m quoting.",
    keep: "A one-page research brief with sources, dates and what to check yourself.",
    cardLabel: "Copy my card",
    card: "DO THE RESEARCH\nResearch = many sources, one answer with links (paid)\nTurn on: + › Research (needs web search)\nIt can read connected apps too; switch off what you don’t need\nPhone app: web only\nPaste a URL = Claude reads that page\nOpen every link you’ll repeat; check date and author\nLong runs use up your limit faster",
    real: ["Claude 101", "https://academy.claude.com/courses/claude-101"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
