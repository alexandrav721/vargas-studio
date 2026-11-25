/* AI Made EZ · Level 5 · Lesson 1 · Set menu or free chef? (workflow patterns). Terms: augmented LLM, prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer. */
(function () {
  var L = {
    n: 1, id: "e1", mins: 7, title: "Set menu or free chef?", stamp: "Patterns",
    seen: ["Workflow", "Agent", "Start simple"], terms: ["Augmented LLM", "Prompt chaining", "Routing", "Parallelization", "Orchestrator-workers", "Evaluator-optimizer"],
    teaser: ["SET MENU", "or free chef", "Level 2 split workflows from agents.<br>Now: five set menus, one free chef.<br>At most locations, a set menu wins.", "Six words. Seven minutes."],
    lines: [
      ["A set menu is a workflow.", "Your code fixes the steps ahead. Anthropic names five common ones."],
      ["A free chef is an agent.", "Claude picks its own steps. Worth it when nobody can predict them."],
      ["Every station is an augmented LLM.", "One Claude call plus tools, search and memory. Everything else is built from it."]
    ],
    guess: { q: "A bot sorts emails into billing, tech or sales, then answers each its own way. What is that?", opts: [["Routing, a fixed workflow", true], ["An agent", false], ["A brigade of agents", false]], reveal: "Routing: sort first, then send each kind to its own prompt. Your code sets the steps, so it’s a workflow." },
    startLabel: "See the menus",
    example: {
      title: "Five set menus from Anthropic’s guide.",
      html:
        '<p class="label">Workflow patterns <span class="sample">Simplified</span></p><div class="ticket"><div class="th"><span>SET MENUS</span><span>5 patterns</span></div>' +
        '<b>Prompt chaining</b>: draft, check, polish. Each step uses the last plate.<br>' +
        '<b>Routing</b>: the host sends each guest to the right station.<br>' +
        '<b>Parallelization</b>: cooks work at once, then combine or vote.<br>' +
        '<b>Orchestrator-workers</b>: a head chef splits a job it couldn’t plan ahead.<br>' +
        '<b>Evaluator-optimizer</b>: one cooks, one tastes and sends it back.' +
        '<div class="tf">From “Building effective agents”</div></div>' +
        '<p class="small">An <b>agent</b> is the free chef: no fixed menu. Anthropic says agents cost more and run slower, for better results on open-ended jobs.</p>',
      more: '<p class="small">Anthropic’s rule: find the simplest thing that works. Start with one good call, test it, add a pattern only when the test says so.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Pick the menu.",
      lead: "Pick a project and what matters most. Claude picks a pattern and defends it.",
      state: { job: "answer customer emails", care: "low cost" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">The project</p>' + row("job", ["answer customer emails", "a weekly market report", "flag risky contract clauses", "translate product pages", "fix bugs in our app"]) +
          '<p class="label">What matters most</p>' + row("care", ["low cost", "speed", "accuracy", "predictable results"]);
      },
      head: "ORDER #E01", right: "pattern pick", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "I’m planning an AI project: " + s.job + ". What matters most: " + s.care + ". I don’t code.\n" +
          "1. Which fits best: one Claude call, a workflow (prompt chaining, routing, parallelization, orchestrator-workers or evaluator-optimizer) or an agent? Why, in 3 lines.\n" +
          "2. The steps, as a short numbered list.\n" +
          "3. The simpler option you rejected, and what would make us switch to an agent.\n" +
          "4. One way it could fail, and how we’d notice.";
      },
      claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "match", title: "Match each set menu to its kitchen.", lead: "Tap a pattern, then what it looks like.",
      pairs: [["Prompt chaining", "Draft, check, then polish, in order"], ["Routing", "The host sends each guest to the right station"], ["Parallelization", "Several cooks at once, then combine"], ["Orchestrator-workers", "A head chef splits a job it couldn’t plan ahead"], ["Evaluator-optimizer", "One cooks, one tastes and sends it back"], ["Augmented LLM", "One cook with tools, a pantry and a notebook"]],
      right: "All six. Five set menus, plus the one cook they’re all built from.",
      habitTitle: "Architect habit", habit: "Build the simplest version first. Add a pattern only when a test shows the simple one falls short."
    },
    breaks: {
      title: "Real menus mix and match.",
      lines: [
        ["Patterns combine.", "A router can send the hard cases to an agent. They’re building blocks."],
        ["Ready-made agent kits can hide the recipe.", "Anthropic warns these frameworks can hide the prompts. Know what each call sends."]
      ],
      where: "A free chef is a person you trust. An agent still predicts text, so its mistakes can stack. Test it in a safe kitchen first."
    },
    quiz: [
      { term: "Evaluator-optimizer", q: "Which pattern has one Claude call write and another grade it and send notes back?", a: ["Evaluator-optimizer", "Routing", "Parallelization"], ok: 0, why: "Right. It loops until the grade is good, so the criteria must be clear." },
      { term: "Orchestrator-workers", q: "When does orchestrator-workers beat a fixed chain?", a: ["When you can’t predict the subtasks ahead of time", "When every input gets the same three steps", "When you want the cheapest possible setup"], ok: 0, why: "Right. The head chef decides the pieces once it sees the job." },
      { term: "Workflow", q: "From Level 2: what’s a workflow?", a: ["Steps set ahead by the builder", "Claude picking its own next step", "A list of tools Claude may use"], ok: 0, why: "Right. A set menu: cheaper and more predictable." }
    ],
    say: "We pick the simplest pattern that works. Agents only when steps can’t be planned.",
    keep: "Five pattern names you can sketch on a whiteboard, and a ticket that picks one for a real project.",
    cardLabel: "Copy my card",
    card: "SET MENU OR FREE CHEF (PATTERNS)\nAugmented LLM = one call plus tools, search, memory\nPrompt chaining = steps in a row, each uses the last\nRouting = sort first, send to a specialist\nParallelization = at once, then combine or vote\nOrchestrator-workers = a lead splits an unplannable job\nEvaluator-optimizer = write, grade, revise\nAgent = Claude picks the steps (costs more)",
    real: ["Building with the Claude API", "https://academy.claude.com/courses/building-with-the-claude-api"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
