/* Builder's Kitchen · Lesson 10 · Graduation: plan your own kitchen (architect). Pulls the whole track together. */
(function () {
  var L = {
    n: 10, id: "b10", mins: 10, title: "Plan your own kitchen.", stamp: "Architect",
    terms: ["Architecture", "Cost", "Latency", "Guardrails", "Prompt injection", "Start simple"],
    teaser: ["GRADUATION", "you’re the architect", "Pick the chef. Hang the rules.<br>Choose appliances and a binder.<br>Plan the taste test.", "Every word. Ten minutes."],
    lines: [
      ["An architect picks the pieces.", "Which chef, which rules, which tools, which documents, how it’s tested. That plan is the architecture."],
      ["Every piece has a price.", "Cost is mostly tokens, plus fees for some tools. Latency is wait time. Bigger chefs and more loops cost more of both."],
      ["Guardrails are the safety rails.", "Rules in code, approvals for risky actions, and watching for prompt injection."]
    ],
    guess: { q: "A friend wants an AI helper for their bakery. What should they build first?", opts: [["The simplest version: one model, clear rules, a quick test", true], ["Five agents working together", false], ["Their own AI model", false]], reveal: "Start simple. Add pieces only when a real need shows up. That’s the architect’s habit." },
    startLabel: "See a plan",
    example: {
      title: "One plan, every word you learned.",
      html:
        '<p class="label">A bakery’s order helper <span class="sample">Sample plan</span></p>' +
        '<div class="ticket"><div class="th"><span>KITCHEN PLAN</span><span>architecture</span></div>' +
        'Chef (model): Sonnet. Fast and good enough<br>Window (API): the website sends each chat<br>House rules (system prompt): bakery voice, under 80 words<br>Appliance (tool): check_order_status<br>Outlet (MCP): Google Calendar for pickups<br>Binder: 8-page menu, pasted in (cached when busy)<br>Head chef? No. A fixed workflow is enough<br>Taste test: 25 real questions, run every change<br>Guardrails: refunds need a person' +
        '<div class="tf">Simplest kitchen that does the job</div></div>',
      next: "Plan yours"
    },
    build: {
      title: "Your turn. Draw your kitchen.",
      lead: "Pick what you’d build and the pieces. Your ticket asks Claude to review your architecture.",
      state: { idea: "a helper for my small business", pieces: ["Tools", "My documents", "Taste tests"] },
      controls: function (s, esc) {
        var ideas = ["a helper for my small business", "a study buddy", "a trip planner", "an inbox sorter", "a content idea machine"];
        var pieces = ["Tools", "MCP connectors", "My documents", "An agent", "Taste tests", "Claude Code to build it"];
        return '<p class="label">What you’d build</p><div class="fridge">' + ideas.map(function (v) { return '<button type="button" class="chip" data-set="idea" data-v="' + esc(v) + '" aria-pressed="' + (s.idea === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>" +
          '<p class="label">Pieces you think it needs (tap any)</p><div class="fridge">' + pieces.map(function (v) { return '<button type="button" class="chip" data-set="pieces" data-multi="1" data-v="' + esc(v) + '" aria-pressed="' + (s.pieces.indexOf(v) >= 0) + '">' + esc(v) + "</button>"; }).join("") + "</div>";
      },
      head: "ORDER #B10", right: "architecture review", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "Be my AI architect. I want to build " + s.idea + ". I think it needs: " + (s.pieces.join(", ") || "not sure") + ".\n" +
          "Give me a one-screen plan with: model, system prompt (3 rules), tools, MCP connectors, documents (paste in or RAG?), workflow or agent, the eval, and guardrails.\n" +
          "Then: which piece I picked that I don't need yet, the simplest version I could build this week, and a rough cost per 100 uses, clearly marked as an estimate.";
      },
      claude: "Open in Claude", done: "I planned my kitchen →"
    },
    game: {
      type: "match", title: "Final round: every station.", lead: "Tap a word, then its kitchen.",
      pairs: [["API", "The order window"], ["System prompt", "House rules on the wall"], ["Tool use", "Appliances"], ["MCP", "Standard outlets"], ["RAG", "The recipe binder"], ["Agent", "The head chef running dinner"], ["Eval", "The taste test"]],
      right: "Every station. You can follow a builder conversation now.",
      habitTitle: "Architect habit", habit: "Start with the smallest kitchen that works: one chef, clear rules, a taste test. Add stations only when a real need shows up."
    },
    breaks: {
      title: "The plan is a guess until you taste.",
      lines: [
        ["Your first plan will be wrong somewhere.", "That’s normal. The taste test tells you where."],
        ["Costs are estimates until you measure.", "Check real token counts on real traffic."],
        ["Prompt injection is the newest kitchen fire.", "Any content Claude reads can carry orders. Keep a person on risky buttons."]
      ],
      where: "A real kitchen is built once. An AI kitchen gets rebuilt every time a better chef arrives. Keep your taste tests, so switching chefs is safe."
    },
    quiz: [
      { q: "A friend wants to start with 5 agents. Your advice?", a: ["Start with one request and a taste test, add pieces only when needed", "More agents means better results"], ok: 0, why: "Right. Start simple. Agents cost more and break in more ways." },
      { q: "Recall from Lesson 1: what decides cost?", a: ["Tokens in and out, and which chef", "How many people use the app at once"], ok: 0, why: "Right. Mostly tokens times the chef’s price, plus fees for some tools." }
    ],
    keep: "a one-screen plan for your own AI product, and every builder word in this course.",
    cardLabel: "Copy my kitchen plan card",
    card: "MY AI KITCHEN PLAN\nChef (model): \nOrder window (API): \nHouse rules (system prompt): \nAppliances (tools): \nOutlets (MCP): \nRecipe binder (RAG or paste in): \nHead chef (agent) or fixed recipe (workflow): \nTaste test (eval): \nGuardrails: \nStart simple. Taste every change.",
    real: ["Claude Platform 101", "https://anthropic.skilljar.com/claude-platform-101"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
