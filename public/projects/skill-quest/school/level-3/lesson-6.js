/* AI Made EZ · Level 3 · Lesson 6 · Hand off a whole task (Cowork task loop, approvals, checking). Terms: connected folder, approval mode, manual mode, auto mode, steering, scheduled task. */
(function () {
  var L = {
    n: 6, id: "c6", mins: 7, title: "Hand off the whole task.", stamp: "Handoff",
    terms: ["Connected folder", "Approval mode", "Manual mode", "Auto mode", "Steering", "Scheduled task"],
    teaser: ["HANDOFF", "Cowork tasks", "“Sort these receipts by month.”<br>Claude plans, works, and checks in.<br>You taste before it goes out.", "Six words. Seven minutes."],
    lines: [
      ["Describe the task. Read the plan. Steer.", "Level 2’s agent loop, with you at the pass. Change course mid-task."],
      ["It works on folders you connect.", "In the desktop app, Claude reads and writes files only in those folders."],
      ["You choose how often it asks.", "Auto, the default on most plans, runs with a safety check. Manual asks first."]
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
        '<p class="small">Your note mid-task is <b>steering</b>. <b>Approval mode</b>, in the message box: <b>Auto</b> (the default on most plans) or <b>Manual</b> (you Allow or Deny).</p>' +
        '<p class="small">Every week? Type /schedule.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Write a handoff ticket.",
      lead: "Pick a task and a mode. This hands Cowork the job, the rules, and how to report back.",
      state: { task: "turn a folder of receipts into an expense sheet by month", mode: "Manual" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">The task</p>' + row("task", ["turn a folder of receipts into an expense sheet by month", "rename the files in a folder by date and client", "turn a folder of meeting notes into one action list", "research 5 suppliers and build a comparison sheet"]) +
          '<p class="label">Approval mode</p>' + row("mode", ["Manual", "Auto"]);
      },
      head: "ORDER #C06", right: "handoff", foot: "Paste it into Cowork, or any chat in the newer Claude",
      text: function (s) {
        return "Task: " + s.task + ". I’m using " + s.mode + " mode.\n" +
          "First show your plan in 5 steps or fewer; wait for my OK.\n" +
          "Rules: never delete or move my originals. Save new files in a folder called “Claude output”. Ask before anything that sends, shares, buys or deletes.\n" +
          "When done: 1. What you did, in 5 lines. 2. What you skipped or doubted. 3. Five items to spot-check.";
      },
      claude: "Open in Claude", done: "Done →",
      after: "In Claude, choose Cowork in the message box (paid plans). No Chat or Cowork switch? You have the newer Claude: paste it into any chat. Local folders need the desktop app open. On the Free plan, paste it into a chat and ask Claude to explain the plan."
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
      habitTitle: "Work habit", habit: "Most new chats start in Auto. For a new kind of task, switch to Manual in the message box. Go back to Auto once you’ve checked it a few times."
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
      { term: "Manual mode", q: "In Manual mode, what happens before an action that needs approval?", a: ["Claude asks you: Allow or Deny", "It runs and tells you later", "It skips the action"], ok: 0, why: "Right. Tools you set to Always allow still run without asking." },
      { term: "Scheduled task", q: "You want the same report built every Monday. What do you set up?", a: ["A scheduled task (/schedule)", "A new chat every Monday", "A longer prompt"], ok: 0, why: "Right. Scheduled tasks run in the cloud on a timetable." },
      { term: "Private by default", q: "Recall from Lesson 3: Cowork made you a new artifact. Who can see it?", a: ["Only you, until you share it", "Your whole team", "Anyone with the link"], ok: 0, why: "Right. Nothing is shared until you click Share." }
    ],
    say: "I’ll hand it to Cowork in Manual mode and spot-check five rows before it goes out.",
    keep: "A handoff ticket with rules, a plan check and a report-back list.",
    cardLabel: "Copy my card",
    card: "HAND OFF THE WHOLE TASK\nDescribe › read the plan › steer › check\nConnected folder = the only files it touches\nAuto = the default: runs, with a safety check (skipped for Always allow tools)\nManual = you Allow or Deny each action that needs approval\nRules: keep originals, new folder, ask before send/share/buy/delete\n“Done” is a claim: spot-check a few\n/schedule = repeat it on a timetable",
    real: ["Introduction to Claude Cowork", "https://academy.claude.com/courses/introduction-to-claude-cowork"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
