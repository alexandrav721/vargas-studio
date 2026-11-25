/* AI Made EZ · Level 5 · Lesson 3 · The kitchen system (agent harness). Terms: agent harness, Managed Agents, session, sandbox, permission policy, session budget. */
(function () {
  var L = {
    n: 3, id: "e3", mins: 7, title: "The kitchen system.", stamp: "Harness",
    seen: ["Agent SDK", "Agent loop", "Hook"], terms: ["Agent harness", "Managed Agents", "Session", "Sandbox", "Permission policy", "Session budget"],
    teaser: ["KITCHEN SYSTEM", "the agent harness", "The chef is the model.<br>The harness is the kitchen:<br>stations, rules, doors that lock.", "Six words. Seven minutes."],
    lines: [
      ["The harness is everything around the model.", "The loop, the tools, the permissions, the logs. The model only decides."],
      ["Build it, or rent it.", "Agent SDK: Claude Code’s harness inside your app. Managed Agents: Anthropic hosts it."],
      ["Tools run in a sandbox.", "A walled-off computer, so a bad command can’t reach anything else."]
    ],
    guess: { q: "In an agent, who actually runs the commands?", opts: [["The harness, inside a sandbox", true], ["The model, on its own", false], ["Whoever is reading the chat", false]], reveal: "The model only asks. The harness runs each tool, usually in a walled-off sandbox, and hands back the result." },
    startLabel: "See the systems",
    example: {
      title: "Three ways to run the same kitchen.",
      html:
        '<p class="label">Who hosts the harness <span class="sample">Simplified</span></p>' +
        '<div class="reply"><p class="who">Agent SDK · you host it</p>Claude Code’s tools, loop and context handling, in Python or TypeScript.</div>' +
        '<div class="reply"><p class="who">Managed Agents · Anthropic hosts it (beta)</p>Set up the agent once. Each run is a <b>session</b> in its own container.</div>' +
        '<div class="reply"><p class="who">Messages API · you build it</p>You write the loop yourself. Most control, most work.</div>' +
        '<p class="small">A <b>permission policy</b> says which tool calls run alone and which wait for a yes. A <b>session budget</b> caps spend: at the cap, the session pauses.</p>',
      more: '<p class="small">Managed Agents bills tokens plus $0.08 per session-hour, counted only while it’s running.</p><p class="small">In the Agent SDK, <b>hooks</b> run your own code at set moments, like just before a tool runs. A hook can block the call.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Spec the kitchen system.",
      lead: "Pick a job and who hosts it. Your ticket asks Claude for a harness plan to hand a developer.",
      state: { job: "a weekly competitor report", run: "Anthropic hosts it (Managed Agents)" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">The job</p>' + row("job", ["a weekly competitor report", "sort support tickets", "clean up messy spreadsheets", "review code changes"]) +
          '<p class="label">Who hosts it</p>' + row("run", ["Anthropic hosts it (Managed Agents)", "we host it (Agent SDK)", "not sure, help me pick"]);
      },
      head: "ORDER #E03", right: "harness plan", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "Plan the agent harness for this job: " + s.job + ". Hosting: " + s.run + ". I don't code.\n" +
          "One page:\n" +
          "1. Agent SDK, Managed Agents, or a simple workflow instead? Why, in 3 lines.\n" +
          "2. The tools it needs, and which built-in tools we switch off.\n" +
          "3. Permissions: which tools run on their own, which wait for a person.\n" +
          "4. Sandbox and network: what it can reach, and what it can't.\n" +
          "5. A spend cap per run, and how we stop it mid-run.\n" +
          "End with 3 questions I should ask the developer.";
      },
      claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "tapall", title: "Which jobs belong to the harness, not the model?", lead: "Tap the {n} the harness does.",
      options: [
        ["Run the command it was asked to run", true], ["Pause and ask a person before a delete", true], ["Keep the session’s history", true],
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
        ["Defaults can be wide open.", "Turn on Managed Agents’ toolset without choosing, and all eight built-in tools switch on."],
        ["Beta means change.", "Managed Agents is in beta. Sessions pin an agent version; re-test before moving up."]
      ],
      where: "A kitchen’s walls are fixed. A sandbox has walls too, but you choose where the doors go."
    },
    quiz: [
      { term: "Sandbox", q: "What is a sandbox for?", a: ["A walled-off computer where tools run safely", "A practice chat with no tools", "A folder of example prompts"], ok: 0, why: "Right. A bad command stays inside the walls." },
      { term: "Session budget", q: "A Managed Agents session hits its budget. What happens?", a: ["It pauses; raise or remove the cap to resume", "It deletes itself and its files", "It keeps running and bills you later"], ok: 0, why: "Right. History and files are kept. Nothing is lost." },
      { term: "Streamable HTTP", q: "Recall from Lesson 2: which wiring lets many people reach one MCP server?", a: ["Streamable HTTP", "stdio", "A system prompt"], ok: 0, why: "Right. stdio is for one computer." }
    ],
    say: "The model decides; the harness runs tools in a sandbox, asks for approvals and caps the spend.",
    keep: "The build-or-rent choice in plain words, and a harness plan a developer can start from.",
    cardLabel: "Copy my card",
    card: "THE KITCHEN SYSTEM (AGENT HARNESS)\nHarness = loop, tools, permissions, logs around the model\nAgent SDK = Claude Code’s harness in your app\nManaged Agents = Anthropic hosts it (beta)\nSession = one run, in its own container\nSandbox = walled-off computer where tools run\nPermission policy = runs alone, or waits for a yes\nSession budget = spend cap; it pauses at the cap",
    real: ["Claude Platform 101", "https://academy.claude.com/courses/claude-platform-101"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
