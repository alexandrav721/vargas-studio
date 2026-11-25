/* AI Made EZ · Level 3 · Lesson 3 · Plates you keep (file creation, artifacts, sharing). Terms: file creation, private by default, share link, access level, save to Drive. */
(function () {
  var L = {
    n: 3, id: "c3", mins: 6, title: "Plates you keep.", stamp: "Files",
    terms: ["File creation", "Private by default", "Share link", "Access level", "Save to Drive"],
    teaser: ["PLATES TO KEEP", "real files", "A spreadsheet, a deck, a doc.<br>Real files you download,<br>change and send.", "Five words. Six minutes."],
    lines: [
      ["Claude can plate real files.", "Level 2’s code execution, put to work: Excel, Word, PowerPoint and PDF."],
      ["Name the file you want.", "Say “make it a spreadsheet with formulas.” Then ask for changes."],
      ["Artifacts start private.", "An artifact is a page, doc or file Claude makes beside the chat."]
    ],
    guess: { q: "You ask Claude for a budget. What do you want back?", opts: [["A real .xlsx file with formulas", true], ["A long text table to copy by hand", false], ["A screenshot of a spreadsheet", false]], reveal: "Claude can create real spreadsheets, decks, docs and PDFs you download or save to Google Drive." },
    startLabel: "Plate a file",
    example: {
      title: "“Make our vacation tracker a spreadsheet.”",
      html:
        '<div class="ticket"><div class="th"><span>ORDER</span><span>a real file</span></div>Make a vacation tracker as an Excel file.<br>Columns: name, dates, days used, days left.<br>Days left uses a formula. 3 sample rows.<div class="tf">Asks for the file type</div></div>' +
        '<div class="reply"><p class="who">claude</p>Done: vacation-tracker.xlsx, ready to download.</div>' +
        '<div class="reply"><p class="who">you</p>Add a column for who approved it.</div>' +
        '<p class="small">No file? Check Settings › Capabilities: “Code execution and file creation” (newer menus say “Create and edit files”).</p>' +
        '<p class="small">Only you see it until you click <b>Share</b> (paid plans) and pick who. <b>Access levels</b>: Can view, Commenter, Can edit.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Order a file you’ll use this week.",
      lead: "Pick the file type and what it’s for. Your ticket gets a real file plus what to check before you share it.",
      state: { kind: "an Excel tracker", topic: "our team’s vacation schedule" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">The file</p>' + row("kind", ["an Excel tracker", "a 5-slide PowerPoint", "a one-page Word memo", "a printable PDF checklist"]) +
          '<p class="label">What it’s for</p>' + row("topic", ["our team’s vacation schedule", "a project status update", "a new hire’s first week", "a monthly supply order"]);
      },
      head: "ORDER #C03", right: "file to keep", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "Create " + s.kind + " for " + s.topic + ", as a real file I can download. Ask up to 3 questions first.\n" +
          "1. Use sample content marked [EXAMPLE]. Use formulas for every total.\n" +
          "2. Add a short “how to use this” note at the top.\n" +
          "3. After the file, list 3 things to check before I share it.\n" +
          "4. Two edits to ask for next.\n" +
          "Can’t make files here? Name the setting to turn on.";
      },
      claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "pick", title: "You made a launch plan artifact on a Pro plan. Who can see it right now?",
      options: [
        ["Only you", true],
        ["Anyone with the link", false, "Only once you click Share and choose “Anyone with the link.”"],
        ["Everyone on Claude", false, "Artifacts are private by default. Nothing is shared until you share it."]
      ],
      right: "Yes. Private by default. You open Share and choose who gets in.",
      wrong: "What happens before you click Share?", hint: "Nothing is shared until you share it.",
      habitTitle: "Work habit", habit: "Pick the smallest audience that works: invite people before you reach for “Anyone with the link.”"
    },
    breaks: {
      title: "A neat plate can still be wrong.",
      lines: [
        ["Files look finished.", "Check numbers, names and dates before you send. Formulas can point at wrong cells."],
        ["A link travels.", "“Anyone with the link” means anyone it gets forwarded to."]
      ],
      where: "A plate leaves the kitchen once. A file or link can be copied and forwarded forever."
    },
    quiz: [
      { term: "Access level", q: "A coworker should leave notes on your artifact but not change it. Which access?", a: ["Commenter", "Can edit", "Anyone with the link"], ok: 0, why: "Right. Commenters can view, comment and download offered files." },
      { term: "File creation", q: "Claude won’t make a spreadsheet file. What do you check first?", a: ["The file creation setting in Settings › Capabilities", "Your memory", "Your account-wide instructions"], ok: 0, why: "Right. “Code execution and file creation” has to be on. On work plans your owner controls it, and incognito chats can’t make files." },
      { term: "Project instructions", q: "Recall from Lesson 2: where do rules for one repeating job go?", a: ["Project instructions", "Every new chat, typed again", "Claude’s memory"], ok: 0, why: "Right. One job, one project." }
    ],
    say: "Claude made the tracker as a real spreadsheet. I’ll check the formulas, then share it.",
    keep: "A real file for this week, with a check-before-sharing list.",
    cardLabel: "Copy my card",
    card: "PLATES YOU KEEP\nAsk for the file type (Excel, Word, PowerPoint, PDF) and formulas\nNo file? Settings › Capabilities › file creation on\nDownload it or save it to Google Drive\nArtifact = what Claude makes beside the chat; private at first\nShare (paid) › pick who › Can view, Commenter or Can edit\nCheck numbers and names before you send",
    real: ["Claude 101", "https://academy.claude.com/courses/claude-101"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
