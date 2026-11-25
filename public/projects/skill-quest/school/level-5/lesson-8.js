/* AI Made EZ · Level 5 · Lesson 8 · Draw the floor plan (capstone design doc). Terms: design doc, trade-off, cost model, failure mode, blast radius, approval matrix. */
(function () {
  var L = {
    n: 8, id: "e8", mins: 7, title: "Draw the floor plan.", stamp: "Plan",
    seen: ["Architecture", "Start simple"], terms: ["Design doc", "Trade-off", "Cost model", "Failure mode", "Blast radius", "Approval matrix"],
    teaser: ["FLOOR PLAN", "the capstone", "A new location opens Monday.<br>One page: stations, doors, costs,<br>and who holds which key.", "Six words. Seven minutes."],
    lines: [
      ["A design doc fits on one page.", "The job, the pattern, the parts, the cost, the risks, who approves."],
      ["Every choice is a trade-off.", "Write down what you gave up: speed, cost, control or simplicity."],
      ["Plan for the bad night.", "How it fails, how far the damage spreads, who notices first."]
    ],
    guess: { q: "What goes at the top of an AI design doc?", opts: [["The job and how you’ll know it works", true], ["The list of models", false], ["The vendor’s logo", false]], reveal: "Start from the job and the test for success. The parts come after, and each must earn its place." },
    startLabel: "See a floor plan",
    example: {
      title: "A floor plan: the invoice checker.",
      html:
        '<p class="label">Design doc <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>FLOOR PLAN</span><span>1 page</span></div>' +
        '<b>Job</b>: flag invoices that don’t match orders. Test: 50 past invoices.<br>' +
        '<b>Pattern</b>: routing, not an agent. Steps never change.<br>' +
        '<b>Parts</b>: Haiku 5.5 sorts, Opus 5.5 checks hard ones, read-only MCP server.<br>' +
        '<b>Fails</b>: a wrong match. A person reviews every flag.<br>' +
        '<b>Blast radius</b>: read-only. Worst case: a wrong flag, never a payment.<br>' +
        '<b>Approvals</b>: the finance lead pays. The AI can’t.' +
        '<div class="tf">Trade-off: slower than full automation, far safer</div></div>' +
        '<p class="small"><b>Cost model</b>: tokens per task × price. Anthropic’s example: one hour on Managed Agents with Opus 5.5, 50K tokens in, 15K out: about $0.58.</p>',
      more: '<p class="small">Today’s prices per million input / output tokens: Opus 5.5 $4 / $20, Sonnet 5.5 $2 / $10, Haiku 5.5 $0.10 / $0.50 (prompts up to 100K). Check the pricing page before you quote anyone.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Draw your floor plan.",
      lead: "Pick a real use case and your hardest limit. Your ticket asks Claude for a one-page design doc you can defend.",
      state: { use: "answer customer emails", limit: "tight budget" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">The use case</p>' + row("use", ["answer customer emails", "check invoices", "onboard new hires", "weekly market research", "review code changes"]) +
          '<p class="label">Hardest limit</p>' + row("limit", ["tight budget", "must be accurate", "private data", "launch in 2 weeks"]);
      },
      head: "ORDER #E08", right: "floor plan", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "Act as my AI systems architect. Use case: " + s.use + ". Hardest limit: " + s.limit + ". I don't code.\n" +
          "Ask me up to 3 questions first, then write a one-page design doc with these headings:\n" +
          "1. Job and success test (how we'll measure it).\n" +
          "2. Pattern: one call, workflow or agent, and the simpler option we rejected.\n" +
          "3. Parts: models, tools or MCP servers, where it runs, what it remembers.\n" +
          "4. Cost model: tokens per task × price, math shown. Say which prices I must confirm on Anthropic's pricing page.\n" +
          "5. Failure modes and blast radius: top 3, and how we'd detect each.\n" +
          "6. Approval matrix: who approves which action.\n" +
          "7. Trade-offs we accepted.";
      },
      claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "tapall", title: "Which belong on the one-page floor plan?", lead: "Tap the {n} that do.",
      options: [
        ["How you’ll know it works", true], ["Cost per task, with the math", true], ["Who approves risky actions", true], ["How it fails and who notices", true],
        ["Every prompt, word for word", false, "That’s the recipe binder. The plan names the parts."],
        ["The newest model, because it’s newest", false, "Pick by tests and cost, not release date."]
      ],
      right: "All four. That’s a plan you can defend.",
      wrong: "Would your boss need that to say yes?",
      habitTitle: "Architect habit", habit: "Show the plan to the person most likely to say no. Fix what they find before anyone builds."
    },
    breaks: {
      title: "A floor plan isn’t the restaurant.",
      lines: [
        ["The first cost guess is usually off.", "Run a small pilot, count real tokens, then update the plan."],
        ["Plans drift.", "Reopen the doc when models, prices or tools change."]
      ],
      where: "A restaurant is built once. AI systems get rebuilt every few months, so keep the plan alive."
    },
    quiz: [
      { term: "Blast radius", q: "What is the blast radius of a failure?", a: ["How far the damage can spread", "How fast the agent runs", "How many tools it has"], ok: 0, why: "Right. Read-only tools keep it small." },
      { term: "Approval matrix", q: "What does an approval matrix show?", a: ["Who approves which action", "Which model is cheapest", "The order of the agent’s steps"], ok: 0, why: "Right. No one should wonder who presses the button." },
      { term: "Orchestrator-workers", q: "Recall from Lesson 1: which pattern fits a job whose subtasks you can’t predict?", a: ["Orchestrator-workers", "Prompt chaining", "Routing"], ok: 0, why: "Right. The head chef splits the job once it sees it." }
    ],
    say: "Here’s the one-page plan: the job and its test, the simplest pattern, the cost math, how it fails, and who approves what.",
    keep: "A design doc template you can defend in any meeting, filled in for your own use case.",
    cardLabel: "Copy my card",
    card: "DRAW THE FLOOR PLAN (DESIGN DOC)\nDesign doc = one page you can defend\nJob + success test first\nTrade-off = what you gave up, written down\nCost model = tokens per task × price\nFailure mode = one way it goes wrong\nBlast radius = how far damage spreads\nApproval matrix = who approves which action\nPilot, measure, update",
    real: ["Building effective human-agent teams (beta)", "https://academy.claude.com/courses/building-effective-human-agent-teams"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
