/* AI Made EZ · Level 3 · Lesson 1 · Pick your station (chat, Research, Cowork, Claude in Chrome, Claude Code, model choice). Terms: chat, Cowork, Claude in Chrome, model selector, desktop app. */
(function () {
  var L = {
    n: 1, id: "c1", mins: 6, title: "Pick your station.", stamp: "Station",
    terms: ["Chat", "Cowork", "Claude in Chrome", "Model selector", "Desktop app"],
    teaser: ["YOUR STATION", "where the work happens", "Same chef, five stations.<br>Talk it through, look it up,<br>or hand over the whole job.", "Five words. Six minutes."],
    lines: [
      ["Claude has stations, like a line.", "Chat to talk and make things. Research to look things up. Cowork to do the job."],
      ["Cowork works with your files and apps.", "You describe the task, Claude plans it, you steer. Paid plans."],
      ["Claude in Chrome works in your browser.", "It reads, clicks and types on websites, in a side panel."]
    ],
    guess: { q: "You need 40 receipts in a folder turned into a spreadsheet. Where?", opts: [["Cowork, which works with your files", true], ["A normal chat, one receipt at a time", false], ["Research, since it reads things", false]], reveal: "Cowork works with folders you connect in the desktop app. Chat only sees what you upload." },
    startLabel: "Walk the line",
    example: {
      title: "Monday at work. Five jobs, five stations.",
      html:
        '<p class="label">Which station? <span class="sample">Sample</span></p>' +
        '<div class="reply"><p class="who">chat</p>“Draft a kind no to this meeting invite.”</div>' +
        '<div class="reply"><p class="who">research</p>“Compare 3 payroll tools, with sources.”</div>' +
        '<div class="reply"><p class="who">cowork</p>“Rename and sort the files in my Invoices folder.”</div>' +
        '<div class="reply"><p class="who">claude in chrome</p>“Fill in this supplier form from my order list.”</div>' +
        '<div class="reply"><p class="who">claude code</p>“Fix the broken link on our website.” (Level 2)</div>' +
        '<p class="small">The <b>model selector</b> sits next to the send button. Click the model name to switch. Haiku is fastest, Sonnet is a good daily pick, Opus and Fable take the hardest jobs.</p>' +
        '<p class="small">Cowork with local folders needs the <b>desktop app</b> (Mac, Windows, Linux beta).</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Map your week to stations.",
      lead: "Pick your job and what fills your week. Your ticket asks Claude for a one-screen station cheat sheet.",
      state: { job: "an office manager", tasks: ["emails", "spreadsheets"] },
      controls: function (s, esc) {
        var jobs = ["an office manager", "a teacher", "a nurse", "a sales rep", "a freelancer"];
        var tasks = ["emails", "spreadsheets", "reports", "meeting notes", "looking things up", "web forms"];
        return '<p class="label">Your job</p><div class="fridge">' + jobs.map(function (v) { return '<button type="button" class="chip" data-set="job" data-v="' + esc(v) + '" aria-pressed="' + (s.job === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>" +
          '<p class="label">What fills your week (tap any)</p><div class="fridge">' + tasks.map(function (v) { return '<button type="button" class="chip" data-set="tasks" data-multi="1" data-v="' + esc(v) + '" aria-pressed="' + (s.tasks.indexOf(v) >= 0) + '">' + esc(v) + "</button>"; }).join("") + "</div>";
      },
      head: "ORDER #C01", right: "station map", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "I work as " + s.job + ". My week is mostly: " + (s.tasks.length ? s.tasks.join(", ") : "a mix of things") + ".\n" +
          "Make me a one-screen cheat sheet: a table of 6 real tasks from a week like mine.\n" +
          "For each: the best Claude station (Chat, Research, Cowork, Claude in Chrome or Claude Code), why in one line, and which model size (Haiku, Sonnet or Opus).\n" +
          "Mark which ones need a paid plan or the desktop app. Plain words, no jargon. Ask me one question first if you need to.";
      },
      claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "pick", title: "You need 200 files in a folder on your laptop renamed by date. Which station?",
      options: [
        ["Cowork, with that folder connected", true],
        ["Chat", false, "Chat sees only what you upload. It can’t rename files on your laptop."],
        ["Research", false, "Research reads the web and your connected apps. It doesn’t change your files."]
      ],
      right: "Yes. Cowork reads and writes files in folders you connect, in the desktop app.",
      wrong: "Which station can touch your files?", hint: "Only one of them works on folders on your computer.",
      habitTitle: "Work habit", habit: "Before you start, ask: am I talking, looking up, or handing off? That picks the station."
    },
    breaks: {
      title: "The stations keep moving.",
      lines: [
        ["Some accounts have no Chat or Cowork switch.", "In the newer Claude, any chat can take on a Cowork task."],
        ["Menus change often.", "If a button isn’t where a lesson says, search Claude’s help center."]
      ],
      where: "A real kitchen’s stations stay put for years. Claude’s app rearranges itself every few months."
    },
    quiz: [
      { term: "Cowork", q: "What is Cowork?", a: ["Claude working with your files, folders and apps on a task", "A shared chat room for your whole team", "A faster version of the normal chat"], ok: 0, why: "Right. You describe the task, it plans and works, you steer." },
      { term: "Model selector", q: "Where do you switch models in the Claude app?", a: ["Click the model name next to the send button", "In Settings, under Billing", "You can’t; Claude picks for you"], ok: 0, why: "Right. The change starts with Claude’s next reply." },
      { term: "Agent", q: "From Level 2: Cowork plans, uses tools and keeps going until done. What is that?", a: ["An agent", "A workflow with fixed steps", "A system prompt"], ok: 0, why: "Right. Cowork is an agent you steer." }
    ],
    say: "This one needs my files, so it’s a Cowork job.",
    keep: "A cheat sheet that maps your real week to the right Claude station.",
    cardLabel: "Copy my card",
    card: "PICK YOUR STATION\nChat = talk it through, draft, make things\nResearch = look it up across many sources\nCowork = hand off a task on your files and apps\nClaude in Chrome = work on websites in a side panel\nClaude Code = work on code (Level 2)\nModel selector = click the model name by the send button\nCowork, Research, Chrome: paid plans",
    real: ["Claude 101", "https://academy.claude.com/courses/claude-101"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
