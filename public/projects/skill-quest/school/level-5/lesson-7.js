/* AI Made EZ · Level 5 · Lesson 7 · Health inspections (governance and safety). Terms: observability, trace, audit log, Responsible Scaling Policy, AI Safety Level, Constitutional AI. */
(function () {
  var L = {
    n: 7, id: "e7", mins: 7, title: "Health inspections.", stamp: "Inspect",
    seen: ["Eval", "Human in the loop"], terms: ["Observability", "Trace", "Audit log", "Responsible Scaling Policy", "AI Safety Level", "Constitutional AI"],
    teaser: ["INSPECTION", "governance and safety", "Who cooked it, with what,<br>and was it safe?<br>Write it down before they ask.", "Six words. Seven minutes."],
    lines: [
      ["You can’t inspect what you didn’t record.", "Observability: a trace of every call, tool and cost, kept searchable."],
      ["Keep tasting after opening night.", "Turn real cases into evals. Re-run them whenever anything changes."],
      ["Anthropic inspects its own kitchen too.", "Its Responsible Scaling Policy ties stronger safeguards to more capable models."]
    ],
    guess: { q: "A customer says your agent refunded the wrong order last Tuesday. What do you need?", opts: [["A trace of that session: each step, tool and result", true], ["A better system prompt", false], ["A bigger model", false]], reveal: "Without a record you’re guessing. A trace shows what the agent saw and did, step by step." },
    startLabel: "See the clipboard",
    example: {
      title: "The inspector’s clipboard.",
      html:
        '<p class="label">Your kitchen <span class="sample">Simplified</span></p><div class="ticket"><div class="th"><span>CLIPBOARD</span><span>3 checks</span></div>' +
        '<b>Traces</b>: the Claude SDKs and API can send them to tools like Datadog or Grafana (OpenTelemetry, beta).<br>' +
        '<b>Audit logs</b>: Claude Enterprise keeps them: user actions, system events, data access.<br>' +
        '<b>Admin choices</b>: Anthropic’s Enterprise course names five: Structure and Identity, Access, Governance, Spend, Visibility.' +
        '<div class="tf">Decide these before launch</div></div>' +
        '<p class="small">Anthropic’s kitchen: the <b>RSP</b> is its own voluntary rulebook. Earlier versions tied each set of safeguards to an <b>AI Safety Level</b>. ASL-3 safeguards switched on for some models in May 2025.</p>',
      more: '<p class="small">RSP version 3.0 (February 2026) added a public Frontier Safety Roadmap and Risk Reports every 3 to 6 months. Version 3.4 took effect in July 2026.</p><p class="small"><b>Constitutional AI</b> (2022): Claude is trained against a written set of principles. It critiques and revises its own answers, then learns from AI feedback.</p><p class="small">Claude’s January 2026 constitution ranks its priorities: broadly safe, broadly ethical, following Anthropic’s guidelines, genuinely helpful.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Write the inspection plan.",
      lead: "Pick a project and who signs off. Your ticket asks Claude for a governance plan.",
      state: { proj: "a customer support agent", who: "our team lead" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">The project</p>' + row("proj", ["a customer support agent", "an HR policy assistant", "a sales email agent", "a coding agent"]) +
          '<p class="label">Final sign-off</p>' + row("who", ["our team lead", "legal and compliance", "IT security", "the leadership team"]);
      },
      head: "ORDER #E07", right: "inspection plan", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "Write a one-page governance plan for " + s.proj + ". Final sign-off: " + s.who + ". I don't code.\n" +
          "1. What we record (traces, costs, approvals) and who can see it.\n" +
          "2. Evals in production: which real cases we re-test, how often, and the score that blocks a release.\n" +
          "3. Human oversight: what a person reviews, and how fast we can switch it off.\n" +
          "4. Admin controls: who gets access, spend limits, data rules.\n" +
          "5. A monthly inspection checklist of 8 items.\n" +
          "Keep it plain, and flag anything that needs legal advice.";
      },
      claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "match", title: "Match each word to the inspection.", lead: "Tap a word, then its kitchen.",
      pairs: [["Observability", "Cameras on every station"], ["Trace", "The step-by-step record of one order"], ["Audit log", "The sign-in sheet: who did what, when"], ["Eval", "The taste test, repeated after every change"], ["Responsible Scaling Policy", "Stronger safety rules as the chefs get more capable"], ["Constitutional AI", "A chef trained against a written code"]],
      right: "All six. That’s the inspector’s whole clipboard.",
      habitTitle: "Architect habit", habit: "Decide what you’ll log on day one. You can’t go back and record last Tuesday."
    },
    breaks: {
      title: "An inspection is a snapshot.",
      lines: [
        ["Passing once isn’t safe forever.", "Models, prompts and tools change. Re-run evals after every change."],
        ["Anthropic’s policies are its own promises.", "The RSP is voluntary and has changed often. Read the current version yourself."]
      ],
      where: "Health inspectors are outside officials. For your AI system, most of the inspecting is up to you."
    },
    quiz: [
      { term: "Audit log", q: "What is an audit log for?", a: ["A record of who did what, and when", "A list of the agent’s tools", "A short summary of the chat"], ok: 0, why: "Right. It answers “who changed that?” months later." },
      { term: "Constitutional AI", q: "What is Constitutional AI?", a: ["Training Claude against a written set of principles", "A law that governs AI companies", "A filter added after Claude replies"], ok: 0, why: "Right. The principles shape training itself." },
      { term: "Approval gate", q: "Recall from Lesson 6: which actions go behind an approval gate?", a: ["Ones you can’t undo: send, pay, delete", "Every single read", "Only the first message of the day"], ok: 0, why: "Right. Gate the irreversible, so people keep paying attention." }
    ],
    say: "We record every run, keep re-running evals on real cases, and a person can review or switch it off.",
    keep: "A governance plan with owners, and plain answers about Anthropic’s own safety rules.",
    cardLabel: "Copy my card",
    card: "HEALTH INSPECTIONS (GOVERNANCE)\nObservability = you can see what happened\nTrace = the step-by-step record of one run\nAudit log = who did what, when\nEvals in production = re-test real cases\nRSP = Anthropic’s voluntary safety commitments\nAI Safety Levels = how earlier RSPs graded safeguards\nConstitutional AI = trained against written principles\nRead the current RSP; it changes",
    real: ["Deploying Claude Enterprise with confidence", "https://academy.claude.com/courses/deploying-claude-enterprise-with-confidence"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
