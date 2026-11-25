/* AI Made EZ · Level 3 · Lesson 6 · Hand off a whole task (Cowork task loop, approvals, checking). Terms: connected folder, approval mode, manual mode, auto mode, steering, scheduled task. */
(function () {
  var L = {
    n: 6, id: "c6", mins: 7, title: "Hand off the whole task.", stamp: "Handoff",
    terms: ["Connected folder", "Approval mode", "Manual mode", "Auto mode", "Steering", "Scheduled task"],
    teaser: ["HANDOFF", "Cowork tasks", "“Sort these receipts by month.”<br>Claude plans, works, and checks in.<br>You taste before it goes out.", "Six words. Seven minutes."],
    lines: [
      ["Describe the task. Read the plan. Steer.", "That’s the Cowork loop. You can change course mid-task."],
      ["It works on folders you connect.", "In the desktop app, Claude reads and writes files only in those folders."],
      ["You choose how often it asks.", "Manual asks before actions. Auto runs, with a safety check on each step."]
    ],
    guess: { q: "Cowork says “Done: 60 receipts sorted.” What now?", opts: [["Spot-check a few rows against the real receipts", true], ["Send it to finance right away", false], ["Ask it to say done again", false]], reveal: "“Done” is a claim. Check a sample yourself before anyone else relies on it." },
    startLabel: "Watch a handoff",
    example: {
      title: "“Turn my Receipts folder into an expense sheet.”",
      html:
        '<p class="label">The task loop <span class="sample">Sample</span></p>' +
        '<div class="reply"><p class="who">plan</p>1. Read the 60 files. 2. Pull date, shop, total. 3. Build a sheet by month. 4. Flag blurry ones.</div>' +
        '<div class="reply"><p class="who">you</p>Good. Put the sheet in a new folder. Don’t move the originals.</div>' +
        '<div class="reply"><p class="who">progress</p>Read 41 of 60… 3 receipts unreadable, flagged…</div>' +
        '<div class="reply"><p class="who">done</p>expenses-by-month.xlsx saved. 57 rows, 3 flagged for you.</div>' +
        '<p class="small">Your note mid-task is <b>steering</b>. <b>Approval mode</b>, in the chat box: <b>Manual</b> (you Allow or Deny), <b>Auto</b> (a safety check reviews each step) or Skip.</p>' +
        '<p class="small">Every week? Type /schedule.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Write a handoff ticket.",
      lead: "Pick a task and a mode. Your ticket gives Cowork the job, the rules, and how to report back.",
      state: { task: "turn a folder of receipts into an expense sheet by month", mode: "Manual" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">The task</p>' + row("task", ["turn a folder of receipts into an expense sheet by month", "rename the files in a folder by date and client", "turn a folder of meeting notes into one action list", "research 5 suppliers and build a comparison sheet"]) +
          '<p class="label">Approval mode</p>' + row("mode", ["Manual", "Auto"]);
      },
      head: "ORDER #C06", right: "handoff", foot: "Paste it into Cowork, or into a chat to plan first",
      text: function (s) {
        return "Task: " + s.task + ". I’m using " + s.mode + " mode.\n" +
          "Before you start: show me your plan in 5 steps or fewer and wait for my OK.\n" +
          "Rules: never delete or move my original files. Save everything new in a new folder called “Claude output”. Ask me before anything that sends, shares, buys or deletes.\n" +
          "When done: 1. What you did, in 5 lines. 2. Anything you skipped or weren’t sure about. 3. Five items I should spot-check, and how.";
      },
      claude: "Open in Claude", done: "Done →",
      after: "In Claude, choose Cowork in the message box (paid plans). Local folders need the desktop app open. No Cowork yet? Paste it into a chat and ask Claude to explain the plan."
    },
    game: {
      type: "tapall", title: "Cowork says “done.” What do you check yourself?", lead: "Tap the {n} worth checking.",
      options: [
        ["A few rows against the real receipts", true], ["That the original files are still there", true], ["The items it flagged as unsure", true],
        ["Nothing. It checks its own work", false, "It can be wrong and sound sure. A quick spot-check catches most slips."],
        ["Whether it said “done” politely", false, "Tone tells you nothing about the numbers."]
      ],
      right: "Yes. Sample the output, check the originals, and read what it flagged.",
      wrong: "Would that catch a wrong total?",
      habitTitle: "Work habit", habit: "Start new tasks in Manual mode. Move to Auto only for jobs you’ve checked a few times."
    },
    breaks: {
      title: "A fast cook can make fast mistakes.",
      lines: [
        ["Local tasks need the app open.", "Tasks on your files, browser or computer need the desktop app running."],
        ["Stay close for money, messages and important files.", "Auto’s safety check helps. No check catches everything."]
      ],
      where: "You can watch a new cook at the next station. Cowork works quietly in seconds, so you read the plan and the report."
    },
    quiz: [
      { term: "Manual mode", q: "In Manual mode, what does Cowork do before an action?", a: ["Asks you: Allow or Deny", "Runs it and tells you later", "Skips the action"], ok: 0, why: "Right. You approve each one." },
      { term: "Scheduled task", q: "You want the same report built every Monday. What do you set up?", a: ["A scheduled task (/schedule)", "A new chat every Monday", "A longer prompt"], ok: 0, why: "Right. Scheduled tasks run in the cloud on a timetable." },
      { term: "Human in the loop", q: "From Level 2: who approves anything that sends, spends or deletes?", a: ["A person", "The agent itself", "A second agent"], ok: 0, why: "Right. That’s keeping a human in the loop." }
    ],
    say: "I’ll hand it to Cowork in Manual mode and spot-check five rows before it goes out.",
    keep: "A handoff ticket with rules, a plan check and a report-back list.",
    cardLabel: "Copy my card",
    card: "HAND OFF THE WHOLE TASK\nDescribe › read the plan › steer › check\nConnected folder = the only files it touches\nManual = Allow or Deny each action\nAuto = runs, with a safety check each step\nRules: keep originals, new folder, ask before send/share/buy/delete\n“Done” is a claim: spot-check a few\n/schedule = repeat it on a timetable",
    real: ["Introduction to Claude Cowork", "https://academy.claude.com/courses/introduction-to-claude-cowork"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
