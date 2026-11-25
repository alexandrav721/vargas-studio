/* AI Made EZ · Level 5 · Lesson 8 · Draw the floor plan (capstone design doc). Terms: design doc, trade-off, cost model, failure mode, blast radius, approval matrix. */
(function () {
  var L = {
    n: 8, id: "e8", mins: 7, title: "Draw the floor plan.", stamp: "Plan",
    seen: ["Architecture", "Start simple"], terms: ["Design doc", "Trade-off", "Cost model", "Failure mode", "Blast radius", "Approval matrix"],
    teaser: ["FLOOR PLAN", "the capstone", "A new location opens Monday.<br>Level 4 priced the chefs.<br>Now show the cost, the risks, the keys.", "Six words. Seven minutes."],
    lines: [
      ["Sketching is done. Now defend it.", "Level 2 listed the pieces. A design doc adds trade-offs, cost, failures and approvals."],
      ["Every choice is a trade-off.", "Write down what you gave up: speed, cost, control or simplicity."],
      ["Plan for the bad night.", "How it fails, how far the damage spreads, who notices first."]
    ],
    guess: { q: "What goes at the top of an AI design doc?", opts: [["The job and how you’ll know it works", true], ["The list of models", false], ["The vendor’s logo", false]], reveal: "Start from the job and the test for success. The parts come after, and each must earn its place." },
    startLabel: "See a floor plan",
    example: {
      title: "A floor plan: the invoice checker.",
      html:
        '<p class="label">Design doc <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>FLOOR PLAN</span><span>invoices</span></div>' +
        'Trade-off: routing, not an agent. Less flexible, same steps every time.<br>' +
        'Cost model: 1,000 invoices a month. Haiku sorts them all: about $0.40. Opus checks the hard 100: about $4. As a half-price overnight batch: about $2.20.<br>' +
        'Failure mode: a wrong match. Blast radius: one bad flag, never a payment.<br>' +
        'Approval matrix: flag = AI alone · email supplier = clerk · pay = finance lead only.' +
        '<div class="tf">Token counts are guesses until the pilot</div></div>',
      more: '<p class="small">The sample assumes Haiku 5.5 reads about 3K tokens and writes 200 per invoice, and Opus 5.5 reads 5K and writes 1K on each hard one. The hard tenth costs ten times the rest.</p><p class="small">Prices per million input / output tokens: Opus 5.5 $4 / $20, Sonnet 5.5 $2 / $10, Haiku 5.5 $0.10 / $0.50 (prompts up to 100K). Check the pricing page before you quote anyone.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Draw your floor plan.",
      lead: "Pick a real use case and your hardest limit. Get a design doc you can defend.",
      state: { use: "answer customer emails", limit: "tight budget" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">The use case</p>' + row("use", ["answer customer emails", "check invoices", "onboard new hires", "weekly market research", "review code changes", "donor thank-you emails", "grant report drafts", "volunteer onboarding"]) +
          '<p class="label">Hardest limit</p>' + row("limit", ["tight budget", "must be accurate", "private data", "launch in 2 weeks"]);
      },
      head: "ORDER #E08", right: "floor plan", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "Use case: " + s.use + ". Hardest limit: " + s.limit + ". I don’t code.\n" +
          "Ask up to 3 questions first; label guesses. Then a design doc:\n" +
          "1. The job and its test.\n" +
          "2. Pattern, the simpler one rejected, trade-offs.\n" +
          "3. Cost: per task × volume, with and without a batch, math shown.\n" +
          "4. Top 3 failures, blast radius, how we’d notice.\n" +
          "5. Who approves what.\n" +
          "6. A 6-week pilot: which team, weekly measures, the go/no-go rule.";
      },
      claude: "Open in Claude", done: "Done →",
      after: "Share the doc with your team today. Ask each person which line worries them most."
    },
    game: {
      type: "tapall", title: "Which belong on the floor plan?", lead: "Tap the {n} that do.",
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
    say: "Here’s the plan: the job, its test, the cost math, what can fail, and who approves.",
    keep: "A design doc template you can defend in any meeting, filled in for your own use case.",
    cardLabel: "Copy my card",
    card: "DRAW THE FLOOR PLAN (DESIGN DOC)\nDesign doc = the plan you defend; job and test first\nTrade-off = what you gave up, written down\nCost model = tokens per task × price × volume\nFailure mode = one way it goes wrong\nBlast radius = how far damage spreads\nApproval matrix = who approves which action",
    real: ["Building with the Claude API", "https://academy.claude.com/courses/building-with-the-claude-api"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
