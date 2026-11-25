/* AI Made EZ · Level 5 · Lesson 3 · The kitchen system (agent harness). Terms: agent harness, Managed Agents, session, sandbox, permission policy, session budget. */
(function () {
  var L = {
    n: 3, id: "e3", mins: 7, title: "The kitchen system.", stamp: "Harness",
    seen: ["Agent SDK", "Agent loop", "Hook"], terms: ["Agent harness", "Managed Agents", "Session", "Sandbox", "Permission policy", "Session budget"],
    teaser: ["KITCHEN SYSTEM", "the agent harness", "Level 4 wired the tool loop by hand.<br>The harness is that loop, built for you,<br>the same at every location.", "Six words. Seven minutes."],
    lines: [
      ["The harness is everything around the model.", "The loop, the tools, the permissions, the logs. The model only decides."],
      ["Build it, or rent it.", "Agent SDK: a code kit with Claude Code’s harness. Managed Agents: Anthropic hosts it."],
      ["Tools run in a sandbox.", "A walled-off computer, so a bad command can’t reach anything else."]
    ],
    guess: { q: "In an agent, who actually runs the commands?", opts: [["The harness, often inside a sandbox", true], ["The model, on its own", false], ["Whoever is reading the chat", false]], reveal: "The model only asks. The harness runs each tool, usually in a walled-off sandbox, and hands back the result." },
    startLabel: "See the systems",
    example: {
      title: "Three ways to run the same kitchen.",
      html:
        '<p class="label">Who hosts the harness <span class="sample">Simplified</span></p>' +
        '<div class="reply"><p class="who">Agent SDK · you host it</p>Claude Code’s tools, loop and context handling, in Python or TypeScript.</div>' +
        '<div class="reply"><p class="who">Managed Agents · Anthropic hosts it (beta)</p>Set up the agent once. Each run is a <b>session</b> in its own sandbox.</div>' +
        '<div class="reply"><p class="who">Messages API · you build it</p>You write the loop yourself. Most control, most work.</div>' +
        '<p class="small">A <b>permission policy</b> says which tool calls run alone and which wait for a yes. A <b>session budget</b> caps spend: at the cap, the session pauses.</p>',
      more: '<p class="small">Managed Agents bills tokens plus $0.08 per session-hour, counted only while it’s running.</p><p class="small">Level 2 met hooks in Claude Code. In the Agent SDK, <b>hooks</b> also run your own code at set moments, like just before a tool runs. A hook can block the call.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Spec the kitchen system.",
      lead: "Pick a job and who hosts it. You get a harness plan to hand a developer.",
      state: { job: "a weekly competitor report", run: "Anthropic hosts it (Managed Agents)", out: "Plan only" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">The job</p>' + row("job", ["a weekly competitor report", "sort support tickets", "clean up messy spreadsheets", "review code changes"]) +
          '<p class="label">Who hosts it</p>' + row("run", ["Anthropic hosts it (Managed Agents)", "we host it (Agent SDK)", "not sure, help me pick"]) +
          '<p class="label">What you get</p>' + row("out", ["Plan only", "Plan + starter file"]);
      },
      head: "ORDER #E03", right: "harness plan", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        var starter = s.out === "Plan + starter file" ? "5. A starter permission policy as JSON for my developer: each tool on or off, runs alone or asks first, plus a session budget. Mark it a draft.\n" : "";
        return "Plan the agent harness for: " + s.job + ". Hosting: " + s.run + ". I don’t code.\n" +
          "1. Is that hosting right for this job, or would a scheduled workflow do? Why?\n" +
          "2. Tools it needs, which run alone, which wait for a yes, which built-ins go off.\n" +
          "3. What the sandbox can and can’t reach.\n" +
          "4. A spend cap and a quick stop.\n" + starter +
          "Unsure a feature exists? Say so; name the page (platform.claude.com/docs).";
      },
      claude: "Open in Claude", done: "Done →",
      after: "Save the plan next to the job’s notes. Before anything runs, check the spend cap and the stop with your developer."
    },
    game: {
      type: "tapall", title: "Which jobs belong to the harness, not the model?", lead: "Tap the {n} the harness does.",
      options: [
        ["Run the command it was asked to run", true], ["Pause the run when it hits the spend cap", true], ["Keep the session’s history", true],
        ["Decide which tool to try next", false, "That’s the model’s call. The harness carries it out."],
        ["Write the final summary", false, "The model writes it. The harness delivers it."]
      ],
      right: "Yes. The model decides. The harness does, checks and remembers.",
      wrong: "Who carries the plate, and who chooses the dish?",
      habitTitle: "Architect habit", habit: "When an agent misbehaves, check the harness first: a tool left on, a missing approval, no spend cap."
    },
    breaks: {
      title: "A system is only as safe as its settings.",
      lines: [
        ["Defaults can be wide open.", "Leave Managed Agents’ tools unpicked: all eight switch on and run without asking."],
        ["Beta means change.", "Each session stays on one agent version. Re-test before moving to a newer one."]
      ],
      where: "A kitchen’s walls are fixed. A sandbox has walls too, but you choose where the doors go."
    },
    quiz: [
      { term: "Sandbox", q: "What is a sandbox for?", a: ["A walled-off computer where tools run safely", "A practice chat with no tools", "A folder of example prompts"], ok: 0, why: "Right. A bad command stays inside the walls." },
      { term: "Session budget", q: "A Managed Agents session hits its budget. What happens?", a: ["It pauses; raise or remove the cap to resume", "It deletes itself and its files", "It keeps running and bills you later"], ok: 0, why: "Right. History and files are kept. Nothing is lost." },
      { term: "Streamable HTTP", q: "Recall from Lesson 2: which wiring lets many people reach one MCP server?", a: ["Streamable HTTP", "stdio", "A system prompt"], ok: 0, why: "Right. stdio is for one computer." }
    ],
    say: "The model decides. The harness runs tools in a sandbox, asks first and caps spend.",
    keep: "The build-or-rent choice in plain words, and a harness plan a developer can start from.",
    cardLabel: "Copy my card",
    card: "THE KITCHEN SYSTEM (AGENT HARNESS)\nHarness = loop, tools, permissions, logs around the model\nAgent SDK = Claude Code’s harness in your app\nManaged Agents = Anthropic hosts it (beta)\nSession = one run, in its own sandbox\nSandbox = walled-off computer where tools run\nPermission policy = runs alone, or waits for a yes\nSession budget = spend cap; it pauses at the cap",
    real: ["Claude Platform 101", "https://academy.claude.com/courses/claude-platform-101"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
