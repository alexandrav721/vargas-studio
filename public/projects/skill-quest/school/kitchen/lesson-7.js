/* Builder's Kitchen · Lesson 7 · The head chef (agents). Terms: agent, agent loop, workflow, subagent, orchestrator, human in the loop. */
(function () {
  var L = {
    n: 7, id: "b7", mins: 6, title: "The head chef.", stamp: "Agents",
    terms: ["Agent", "Agent loop", "Workflow", "Subagent", "Orchestrator", "Human in the loop"],
    teaser: ["HEAD CHEF", "agents", "The whole dinner, start to finish.<br>It decides the next step,<br>checks the pot, and keeps going.", "Six words. Six minutes."],
    lines: [
      ["An agent is a chef running the whole dinner.", "Claude picks its own next step and uses tools, again and again, until the job is done."],
      ["A workflow is a prep checklist.", "The steps are set ahead. Cheaper and more predictable."],
      ["Anthropic’s advice: start simple.", "Try one request, then a workflow. Agents only when steps can’t be planned."]
    ],
    guess: { q: "“Book me a table for Friday.” What makes this an agent job?", opts: [["Claude picks its own next steps until it’s done", true], ["It uses a bigger, more expensive Claude model", false], ["The message is longer than a normal question", false]], reveal: "An agent decides its own steps and uses tools in a loop until the job is done." },
    startLabel: "Watch the loop",
    example: {
      title: "“Find a free evening and book a table for 4.”",
      html:
        '<p class="label">The agent loop <span class="sample">Sample</span></p>' +
        '<div class="reply"><p class="who">think</p>I need free nights.</div>' +
        '<div class="reply"><p class="who">tool</p>calendar → Thu, Sat free</div>' +
        '<div class="reply"><p class="who">think</p>Check Thursday tables.</div>' +
        '<div class="reply"><p class="who">tool</p>restaurant → Thu 7:30 open</div>' +
        '<div class="reply"><p class="who">ask you</p>Book Thu 7:30 for 4? <b>Yes / No</b></div>' +
        '<p class="small">Think → tool → look → decide again: the <b>agent loop</b>. Each round costs tokens.</p>' +
        '<p style="margin-top:14px">Big jobs can split: a head chef (<b>orchestrator</b>) hands pieces to <b>subagents</b>: fresh counter, summary back.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Agent or prep checklist?",
      lead: "Pick a job. Your ticket asks Claude which setup fits, and where a person must say yes.",
      state: { job: "reply to every customer email" },
      controls: function (s, esc) {
        var jobs = ["reply to every customer email", "a weekly roundup of competitor ads", "turn receipts into a spreadsheet", "turn a brief into 10 ad ideas", "schedule staff shifts"];
        return '<p class="label">The job</p><div class="fridge">' + jobs.map(function (v) { return '<button type="button" class="chip" data-set="job" data-v="' + esc(v) + '" aria-pressed="' + (s.job === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>";
      },
      head: "ORDER #B07", right: "agent check", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "Make me a one-screen plan for this job: " + s.job + ".\n" +
          "1. Would you build this as one request, a fixed workflow, or an agent? Why, in 2 lines.\n" +
          "2. Draw the steps as a short list (think / tool / check).\n" +
          "3. Where must a human approve before it acts? 4. Would subagents help? One line.";
      },
      vendor: ["an AI agent", "which steps it takes on its own, where a person approves, what it costs per task, and how we stop it"], claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "tapall", title: "Which jobs really need an agent?", lead: "Tap the {n} that do. The rest are fine as a prep checklist.",
      options: [
        ["Research a question across many websites", true], ["Find out why online orders stopped coming in", true],
        ["Turn every receipt into the same 5 columns", false, "Same steps every time. A fixed workflow is cheaper."],
        ["Translate a menu into Spanish", false, "One request does it."]
      ],
      right: "Yes. Agents earn their cost when the next step depends on what they find.",
      wrong: "Could you write the steps down in advance? Then it’s a checklist.",
      habitTitle: "Builder habit", habit: "Before you build an agent, ask: could I write these steps down? If yes, make it a workflow."
    },
    breaks: {
      title: "A chef alone can wreck a kitchen.",
      lines: [
        ["Agents make mistakes that stack.", "One wrong step early leads to ten more. Add checkpoints."],
        ["Agents cost more.", "Anthropic’s multi-agent research used about 15x a chat’s tokens."],
        ["Human in the loop.", "A person approves anything that sends, spends, books or deletes."]
      ],
      where: "A head chef tastes. An agent trusts its tools, even a wrong “done.”"
    },
    quiz: [
      { term: "Agent loop", q: "What’s the agent loop?", a: ["Think, use a tool, check the result, repeat", "Running the same fixed steps every time", "Asking the same question twice"], ok: 0, why: "Right. It keeps going until the job is done or it hits a limit." },
      { term: "Tool use", q: "Recall from Lesson 4: what does an agent use to act?", a: ["Tools", "A bigger context window", "Its system prompt alone"], ok: 0, why: "Right. No tools, no actions. Agents are tools in a loop." },
      {q: "From Lesson 4: what’s a tool definition?", a: ["The label: name, what it does, what it needs", "The tool’s result", "A list of every app Claude can use"], ok: 0, why: "Right. Claude reads the label to choose.", term: "Tool definition"},
      { term: "Human in the loop", q: "Your agent drafted 40 emails to customers. What should happen next?", a: ["A person checks and approves before they send", "Send them all, since agents check their own work", "Let a second agent read them, then send them all"], ok: 0, why: "Right. Anything that sends, spends, books or deletes gets a person first." }
    ],
    say: "An agent picks its own steps in a loop. Start with one request, and keep a person on risky actions.",
    keep: "6 questions to ask anyone selling an agent, and a ticket that sorts a real job.",
    cardLabel: "Copy my card",
    card: "THE HEAD CHEF (AGENTS)\nAgent = Claude picks its own steps and tools until done\nAgent loop = think → tool → check → repeat\nWorkflow = a prep checklist: fixed steps set by the builder\nOrchestrator = head chef splitting the job\nSubagent = sous-chef with its own counter, reports a summary\nHuman in the loop = a person approves risky actions\nStart simple: one request, then a workflow, then an agent",
    real: ["Introduction to subagents", "https://academy.claude.com/courses/introduction-to-subagents"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
