/* AI Made EZ · Level 5 · Lesson 7 · Head-office checks (governance and safety). Terms: observability, trace, audit log, Responsible Scaling Policy, AI Safety Level, Constitutional AI. */
(function () {
  var L = {
    n: 7, id: "e7", mins: 7, title: "Head-office checks.", stamp: "Inspect",
    seen: ["Eval", "Human in the loop"], terms: ["Observability", "Trace", "Audit log", "Responsible Scaling Policy", "AI Safety Level", "Constitutional AI"],
    teaser: ["HEAD OFFICE", "governance and safety", "Level 2 taste-tested before opening.<br>Head office checks every location<br>after opening, too.", "Six words. Seven minutes."],
    lines: [
      ["You can’t inspect what you didn’t record.", "Observability: a trace of every call, tool and cost, kept searchable."],
      ["Audit logs answer “who changed that?”", "Claude Enterprise logs user actions, system events and data access."],
      ["A person stays on the floor.", "Someone reviews samples each week and can switch the agent off fast."]
    ],
    guess: { q: "A customer says your agent refunded the wrong order last Tuesday. What do you need?", opts: [["A trace of that session: each step, tool and result", true], ["A better system prompt", false], ["A bigger model", false]], reveal: "Without a record you’re guessing. A trace shows what the agent saw and did, step by step." },
    startLabel: "See the clipboard",
    example: {
      title: "What head office checks.",
      html:
        '<p class="label">Every location <span class="sample">Simplified</span></p><div class="ticket"><div class="th"><span>CLIPBOARD</span><span>3 checks</span></div>' +
        '<b>Traces</b>: each run, step by step. Developers can send them to tools IT may already use, like Datadog (beta).<br>' +
        '<b>Audit logs</b>: who did what, and when. Ask how long yours are kept.<br>' +
        '<b>Human oversight</b>: who reviews samples and can switch it off.' +
        '<div class="tf">Decide all three before launch</div></div>' +
        '<p class="small">Anthropic’s own rulebook, the <b>Responsible Scaling Policy</b> (RSP), adds stronger safeguards as its models grow more capable. It names those safeguard sets by <b>AI Safety Level</b>, like ASL-3. It’s voluntary, so read the current version.</p>',
      more: '<p class="small">Anthropic’s Enterprise course names five admin decisions: Structure and Identity, Access, Governance, Spend, Visibility.</p><p class="small">RSP version 3.0 (February 2026) separated Anthropic’s own plans from what it recommends for the whole industry, and added a public Frontier Safety Roadmap and Risk Reports every 3 to 6 months. Version 3.4 took effect in July 2026.</p><p class="small">ASL-3 safeguards switched on for some models in May 2025. Since version 3.0, the RSP no longer lists fixed controls for future levels.</p><p class="small"><b>Constitutional AI</b> (2022): Claude is trained against a written set of principles. It critiques and revises its own answers, then learns from AI feedback. Claude’s January 2026 constitution ranks its priorities: broadly safe, broadly ethical, following Anthropic’s guidelines, genuinely helpful.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Write the inspection plan.",
      lead: "Pick a project and who signs off. Get the checks head office would run.",
      state: { proj: "a customer support agent", who: "our team lead" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">The project</p>' + row("proj", ["a customer support agent", "an HR policy assistant", "a sales email agent", "a coding agent"]) +
          '<p class="label">Final sign-off</p>' + row("who", ["our team lead", "legal and compliance", "IT security", "the leadership team"]);
      },
      head: "ORDER #E07", right: "inspection plan", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "Write a governance plan for " + s.proj + ". Final sign-off: " + s.who + ". I don’t code.\n" +
          "1. Traces: what we record per run, and who sees it.\n" +
          "2. Audit logs: which user and admin actions we keep.\n" +
          "3. Human oversight: who reviews samples, how often, and who can switch it off.\n" +
          "4. Evals: which real cases we re-test after each change.\n" +
          "5. An 8-item monthly checklist.\n" +
          "Flag anything that needs legal advice.";
      },
      claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "match", title: "Match each word to the check.", lead: "Tap a word, then its kitchen.",
      pairs: [["Observability", "Cameras on every station"], ["Trace", "The step-by-step record of one order"], ["Audit log", "The sign-in sheet: who did what, when"], ["Eval", "The taste test, repeated after every change"], ["Responsible Scaling Policy", "Stronger safety rules as the chefs get more capable"], ["Constitutional AI", "A chef trained against a written code"]],
      right: "All six. That’s head office’s whole clipboard.",
      habitTitle: "Architect habit", habit: "Decide what you’ll log on day one. You can’t go back and record last Tuesday."
    },
    breaks: {
      title: "A check is a snapshot.",
      lines: [
        ["Passing once isn’t safe forever.", "Models, prompts and tools change. Re-run evals after every change."],
        ["Anthropic’s policies are its own promises.", "The RSP is voluntary and has changed often. Read the current version yourself."]
      ],
      where: "A restaurant group sends its own inspectors to every location. For your AI system, the inspector is you."
    },
    quiz: [
      { term: "Audit log", q: "What is an audit log for?", a: ["A record of who did what, and when", "A list of the agent’s tools", "A short summary of the chat"], ok: 0, why: "Right. It answers “who changed that?” months later." },
      { term: "AI Safety Level", q: "What is an AI Safety Level, like ASL-3?", a: ["Anthropic’s name for a set of safeguards on its models", "A safety score Anthropic gives your app", "A law that limits AI companies"], ok: 0, why: "Right. It describes Anthropic’s protections, not your system." },
      { term: "Context rot", q: "Recall from Lesson 5: why do long agent runs get sloppy?", a: ["Recall slips as the context fills up", "The model gets tired", "It runs out of tools"], ok: 0, why: "Right. Traces help you spot it." }
    ],
    say: "We trace every run, log who did what, and someone can switch it off.",
    keep: "A governance plan with owners, and plain answers about Anthropic’s own safety rules.",
    cardLabel: "Copy my card",
    card: "HEAD-OFFICE CHECKS (GOVERNANCE)\nObservability = you can see what happened\nTrace = the step-by-step record of one run\nAudit log = who did what, when\nHuman oversight = someone reviews, and can switch it off\nRSP = Anthropic’s voluntary safety rulebook\nAI Safety Levels = names for Anthropic’s safeguard sets (ASL-3 now)\nConstitutional AI = trained against written principles",
    real: ["Deploying Claude Enterprise with confidence", "https://academy.claude.com/courses/deploying-claude-enterprise-with-confidence"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
