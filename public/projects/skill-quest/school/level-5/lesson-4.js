/* AI Made EZ · Level 5 · Lesson 4 · A brigade of chefs (multi-agent systems). Terms: multi-agent system, lead agent, delegation, context isolation, cost multiplier, synthesis. */
(function () {
  var L = {
    n: 4, id: "e4", mins: 7, title: "A brigade of chefs.", stamp: "Brigade",
    seen: ["Subagent", "Orchestrator"], terms: ["Multi-agent system", "Lead agent", "Delegation", "Context isolation", "Cost multiplier", "Synthesis"],
    teaser: ["THE BRIGADE", "many chefs", "Level 2 met one subagent.<br>Now staff a brigade: a head chef,<br>three cooks, and a bigger bill.", "Six words. Seven minutes."],
    lines: [
      ["A brigade is a kitchen’s crew, run by a lead agent.", "Each helper gets a brief, a clean counter and only the tools it needs."],
      ["Clean counters are the point.", "Each helper reads a lot, then sends back a short summary."],
      ["A brigade eats tokens.", "Anthropic measured agents at about 4x a chat, multi-agent about 15x."]
    ],
    guess: { q: "When does a team of agents beat one agent?", opts: [["Many independent pieces, like 20 sources to read", true], ["Every step needs the one before it", false], ["A quick one-line answer", false]], reveal: "A brigade wins when the work splits into pieces that don’t need each other. Anthropic says most coding splits less well." },
    startLabel: "Watch the brigade",
    example: {
      title: "“Research 12 competitors by Friday.”",
      html:
        '<p class="label">One run <span class="sample">Sample</span></p>' +
        '<div class="reply"><p class="who">lead agent</p>Split it: 3 helpers, 4 competitors each. Brief: prices, launches, sources.</div>' +
        '<div class="reply"><p class="who">3 helpers, at once</p>Each reads dozens of pages at its own counter. Each sends back a short summary.</div>' +
        '<div class="reply"><p class="who">lead agent</p>Checks the 3 summaries, removes repeats, writes the report.</div>' +
        '<p class="small"><b>Delegation</b> is the handoff; <b>synthesis</b> is the combining. In Anthropic’s 2025 research system, an Opus 4 lead with Sonnet 4 helpers scored 90.2% higher than one Opus 4 agent on Anthropic’s internal research test.</p>',
      more: '<p class="small">Put the helpers’ reading on Haiku, the cheapest model: about a fortieth of Opus’s input price (Level 4 compares prices).</p><p class="small">In Claude Code, a subagent starts fresh: it sees its brief, not your chat. (A fork is the one exception.)</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Staff the brigade.",
      lead: "Pick a job and a team size. Find out if the brigade earns its bill.",
      state: { job: "research 12 competitors", size: "a lead + 3 helpers" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">The job</p>' + row("job", ["research 12 competitors", "review 200 contracts", "plan a product launch", "fix one tricky bug"]) +
          '<p class="label">Proposed team</p>' + row("size", ["1 agent", "a lead + 3 helpers", "a lead + 10 helpers"]);
      },
      head: "ORDER #E04", right: "brigade check", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "Job: " + s.job + ". Proposed team: " + s.size + ". I don’t code.\n" +
          "1. Does it split into independent pieces? Why or why not?\n" +
          "2. If yes: each helper’s brief, tools, model and output.\n" +
          "3. Rough cost, 1 agent vs this team (Anthropic: agents use about 4x a chat’s tokens, multi-agent about 15x).\n" +
          "4. How the lead catches a wrong helper.\n" +
          "Recommend the smallest team that works. Unsure of a number? Say so.";
      },
      claude: "Open in Claude", done: "Done →",
      after: "Try the smallest team first, on two or three items. Grow it only if the lead’s checks pass."
    },
    game: {
      type: "pick", title: "Two helpers report opposite facts. Who settles it?",
      options: [
        ["The lead agent checks both against the sources", true],
        ["Whichever helper finished first", false, "Speed isn’t proof. Someone has to check."],
        ["Average the two answers", false, "Facts don’t average. Go back to the sources."]
      ],
      right: "Yes. Synthesis is the lead’s job: check, remove repeats, combine.",
      wrong: "Who sees all the reports?", hint: "Only the lead gets every summary.",
      habitTitle: "Architect habit", habit: "Write every brief so a stranger could follow it: the goal, the output shape, the tools, and when to stop."
    },
    breaks: {
      title: "A brigade can talk past itself.",
      lines: [
        ["Helpers don’t share a counter.", "Each sees only its brief. Leave something out and it’s gone."],
        ["Live teamwork is still weak.", "Anthropic says agents aren’t yet good at coordinating with each other in real time."]
      ],
      where: "Real cooks shout across the kitchen. Subagents only hear their brief and only hand back a summary."
    },
    quiz: [
      { term: "Context isolation", q: "Why give each helper its own context?", a: ["So its reading doesn’t clutter the lead’s counter", "So it can see the whole conversation", "So the team costs less than one agent"], ok: 0, why: "Right. Only the summary comes back." },
      { term: "Cost multiplier", q: "Anthropic measured multi-agent runs at about how many times a chat’s tokens?", a: ["About 15x", "About 2x", "The same as a chat"], ok: 0, why: "Right. Single agents were about 4x. Only valuable work earns that." },
      { term: "Session budget", q: "Recall from Lesson 3: what is a session budget?", a: ["A hard spend cap on one agent session", "A list of tools it may use", "How long the chat history is kept"], ok: 0, why: "Right. Brigades need caps most of all." }
    ],
    say: "A brigade pays off only when the work splits into pieces the lead can check.",
    keep: "A test for when many agents beat one, and a ticket that sizes the team and its bill.",
    cardLabel: "Copy my card",
    card: "A BRIGADE OF CHEFS (MULTI-AGENT)\nMulti-agent system = a lead plus helper agents\nLead agent = plans, hands out, checks, combines\nDelegation = the handoff, with a clear brief\nContext isolation = each helper has its own counter\nSynthesis = combining reports into one answer\nCost multiplier = agents ~4x a chat, multi-agent ~15x\nGood for independent pieces; weak for tightly linked steps",
    real: ["Introduction to subagents", "https://academy.claude.com/courses/introduction-to-subagents"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
