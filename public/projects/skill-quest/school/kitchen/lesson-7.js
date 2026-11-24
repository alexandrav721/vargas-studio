/* Builder's Kitchen · Lesson 7 · The head chef (agents). Terms: agent, agent loop, workflow, subagent, orchestrator, human in the loop. */
(function () {
  var L = {
    n: 7, id: "b7", mins: 9, title: "The head chef.", stamp: "Agents",
    terms: ["Agent", "Agent loop", "Workflow", "Subagent", "Orchestrator", "Human in the loop"],
    teaser: ["HEAD CHEF", "agents", "Not one plate. A whole dinner.<br>It decides the next step,<br>checks the pot, and keeps going.", "Six words. Nine minutes."],
    lines: [
      ["An agent is a chef running the whole dinner.", "Claude picks its own next step and uses tools, again and again, until the job is done."],
      ["A workflow is a fixed recipe.", "Your code sets the steps: first this, then that. Cheaper and more predictable."],
      ["Anthropic’s advice: start simple.", "One good request beats a workflow. A workflow beats an agent. Use an agent only when the steps can’t be known ahead."]
    ],
    startLabel: "Watch the loop",
    example: {
      title: "“Find a free evening and book a table for 4.”",
      html:
        '<p class="label">The agent loop <span class="sample">Sample</span></p>' +
        '<div class="reply"><p class="who">think</p>I need everyone’s free nights.</div>' +
        '<div class="reply"><p class="who">tool</p>calendar → Thu and Sat are free</div>' +
        '<div class="reply"><p class="who">think</p>Check tables for Thursday.</div>' +
        '<div class="reply"><p class="who">tool</p>restaurant → Thu 7:30 open</div>' +
        '<div class="reply"><p class="who">ask you</p>Book Thu 7:30 for 4? <b>Yes / No</b></div>' +
        '<p class="small">Think → use a tool → look at the result → decide again. That’s the <b>agent loop</b>. Each round costs tokens.</p>' +
        '<p style="margin-top:14px">Big jobs can split: an <b>orchestrator</b> (head chef) hands pieces to <b>subagents</b> (sous-chefs), each with its own counter, who report back a short summary.</p>',
      next: "Agent or recipe?"
    },
    build: {
      title: "Your turn. Agent or fixed recipe?",
      lead: "Pick a job. Your ticket asks Claude which setup fits, and where a person must say yes.",
      state: { job: "reply to every customer email" },
      controls: function (s, esc) {
        var jobs = ["reply to every customer email", "plan a 5-day trip", "turn receipts into a spreadsheet", "research 10 competitors", "fix a bug in my app"];
        return '<p class="label">The job</p><div class="fridge">' + jobs.map(function (v) { return '<button type="button" class="chip" data-set="job" data-v="' + esc(v) + '" aria-pressed="' + (s.job === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>";
      },
      head: "ORDER #B07", right: "agent check", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "I'm learning about AI agents. The job: " + s.job + ".\n" +
          "1. Would you build this as one request, a fixed workflow, or an agent? Why, in 2 lines.\n" +
          "2. Draw the steps as a short list (think / tool / check).\n" +
          "3. Where must a human approve before it acts? 4. Would subagents help? One line.";
      },
      claude: "Open Claude with my ticket", done: "I checked my job →"
    },
    game: {
      type: "tapall", title: "Which jobs really need an agent?", lead: "Tap all {n}. The rest are fine as a fixed recipe.",
      options: [
        ["Research a question across many websites", true], ["Fix a bug you haven’t found yet", true],
        ["Turn every receipt into the same 5 columns", false, "Same steps every time. A fixed workflow is cheaper."],
        ["Translate a menu into Spanish", false, "One request does it."]
      ],
      right: "Yes. Agents earn their cost when the next step depends on what they find.",
      wrong: "Could you write the steps down in advance? Then it’s a recipe.",
      habitTitle: "Builder habit", habit: "Before you build an agent, ask: could I write these steps down? If yes, write a workflow."
    },
    breaks: {
      title: "A chef alone can wreck a kitchen.",
      lines: [
        ["Agents make mistakes that stack.", "One wrong step early leads to ten wrong steps later. Give it limits and checkpoints."],
        ["Agents cost more.", "Many loops, many tokens. Multi-agent research at Anthropic used about 15x the tokens of a chat."],
        ["Human in the loop.", "A person approves anything that sends, spends, books or deletes."]
      ],
      where: "A head chef feels when a dish is off. An agent only knows what its tools report. If the tool says “done,” it believes it."
    },
    quiz: [
      { q: "What’s the agent loop?", a: ["Think, use a tool, check the result, repeat", "Asking the same question twice"], ok: 0, why: "Right. It keeps going until the job is done or it hits a limit." },
      { q: "Recall from Lesson 4: what does an agent use to act?", a: ["Tools", "A bigger context window"], ok: 0, why: "Right. No tools, no actions. Agents are tools in a loop." }
    ],
    keep: "a clear call on one real job: request, recipe or agent, with the approval points marked.",
    cardLabel: "Copy my head-chef card",
    card: "THE HEAD CHEF (AGENTS)\nAgent = Claude picks its own steps and tools until done\nAgent loop = think → tool → check → repeat\nWorkflow = fixed steps set by your code\nOrchestrator = head chef splitting the job\nSubagent = sous-chef with its own counter, reports a summary\nHuman in the loop = a person approves risky actions\nStart simple: request → workflow → agent",
    real: ["Introduction to subagents", "https://anthropic.skilljar.com/introduction-to-subagents"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
