/* AI Made EZ · Level 3 · Lesson 7 · Recipe cards for the crew (custom skills in the Claude apps, plugins, team sharing). Terms: custom skill, frontmatter, skill description, skill ZIP, shared with you. */
(function () {
  var L = {
    n: 7, id: "c7", mins: 7, title: "Recipe cards for the crew.", stamp: "Cards",
    seen: ["Skill"],
    terms: ["Custom skill", "Frontmatter", "Skill description", "Skill ZIP", "Shared with you"],
    teaser: ["CREW CARDS", "skills at work", "Your team’s way of doing a job,<br>written once, uploaded once,<br>picked up by Claude when it fits.", "Five words. Seven minutes."],
    lines: [
      ["A custom skill is your team’s recipe card.", "Level 2 lesson 8 showed skills. This one holds your team’s steps and rules."],
      ["Claude reads the description first.", "If your request matches it, Claude opens the full card. Make it specific."],
      ["Upload it once, use it anywhere.", "All plans. Customize › Skills, then + (or Add) › Upload a skill."]
    ],
    guess: { q: "Your skill never kicks in. What do you fix first?", opts: [["The description: what it does and when to use it", true], ["Make the steps longer", false], ["Rename the ZIP file", false]], reveal: "Claude decides from the description. Say what it does and the words people use when they need it." },
    startLabel: "See a card",
    example: {
      title: "A skill file for weekly status updates.",
      html:
        '<p class="label">SKILL.md <span class="sample">Simplified</span></p><div class="ticket"><div class="th"><span>FRONTMATTER</span><span>the label</span></div>name: weekly-status<br>description: Writes our Friday status update from notes. Use when someone asks for a weekly update.<div class="tf">name ≤ 64 characters · description ≤ 200</div></div>' +
        '<div class="ticket" style="margin-top:10px"><div class="th"><span>THE CARD</span><span>instructions</span></div>1. Sections: Done, Next, Blocked.<br>2. Five bullets each, max.<br>3. Never name clients.<div class="tf">A plain text file: SKILL.md</div></div>' +
        '<p class="small">Zip its folder into one file (the <b>skill ZIP</b>); your ticket has Claude do it. Upload, then turn it on.</p>' +
        '<p class="small">On Team and Enterprise, shared skills wait in <b>Shared with you</b>, off at first.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Write a card for your crew.",
      lead: "Pick a job your team repeats. Your ticket writes the full skill file and the upload steps.",
      state: { job: "a weekly status update", who: "my team" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">The job</p>' + row("job", ["a weekly status update", "a welcome email for new customers", "meeting notes into action items", "checking an expense report"]) +
          '<p class="label">Who uses it</p>' + row("who", ["just me", "my team"]);
      },
      head: "ORDER #C07", right: "crew card", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "Write a Claude skill for " + s.job + ", used by " + s.who + ". First ask 3 questions about how we do it.\n" +
          "1. A short folder name.\n" +
          "2. The SKILL.md: name (under 64 characters), description (under 200: what and when), steps, one example, never-dos. No passwords or real names.\n" +
          "3. If you can make files, zip the folder.\n" +
          "4. Three test requests that should use it, one that shouldn’t.\n" +
          "5. Upload steps for claude.ai.";
      },
      claude: "Open in Claude", done: "Done →",
      after: "On your phone? Skip the ZIP. Paste the steps into a project’s instructions (Lesson 2). That project will use them today. Upload the skill from a computer later. Upload: Customize › Skills, then + (or Add) › Upload a skill. Choose the ZIP and turn the skill on. Code execution and file creation must be on. Test it with the requests Claude gave you."
    },
    game: {
      type: "pick", title: "Which job wants a skill, not a project?",
      options: [
        ["Writing status updates the same way, in any chat", true],
        ["A six-month client account with its own files", false, "That’s a project: one body of work, its own files and instructions."],
        ["One-off: a birthday card for a coworker", false, "Just ask. A one-time job needs no card."]
      ],
      right: "Yes. A skill is a how-to Claude picks up anywhere. A project is the home for one body of work.",
      wrong: "Is this a how-to you repeat, or a place where one job lives?", hint: "Skills travel. Projects stay put.",
      habitTitle: "Work habit", habit: "If you paste the same steps into different chats, make it a skill. If you keep the same files together, make it a project."
    },
    breaks: {
      title: "Not every card is safe to cook from.",
      lines: [
        ["Skills can include scripts that run.", "Read a downloaded or shared skill before you turn it on."],
        ["A card can go stale.", "When your process changes, update the file and upload it again."]
      ],
      where: "A cook reads the whole card. Claude reads only the label first, so a vague label means the card stays in the drawer."
    },
    quiz: [
      { term: "Skill description", q: "What does Claude use to decide when to use a skill?", a: ["Its description", "Its file size", "The day it was uploaded"], ok: 0, why: "Right. Say what it does and when to use it." },
      { term: "Frontmatter", q: "What is a skill’s frontmatter?", a: ["The label at the top: name and description", "The example at the bottom", "The ZIP file"], ok: 0, why: "Right. It sits at the top of SKILL.md." },
      { term: "Project instructions", q: "Recall from Lesson 2: rules for one body of work with its own files go where?", a: ["A project’s instructions", "A custom skill", "Your memory"], ok: 0, why: "Right. Projects hold one job’s files and rules." }
    ],
    say: "Let’s make that a skill so the whole team writes it the same way.",
    keep: "A real skill file for a job your team repeats, with upload and test steps.",
    cardLabel: "Copy my card",
    card: "RECIPE CARDS FOR THE CREW\nCustom skill = a folder with SKILL.md\nFrontmatter = name (≤64) + description (≤200)\nThe description decides when it’s used\nZip it › Customize › Skills › + or Add › Upload › turn on\nAll plans; code execution and file creation on\nTeam shares show up under Shared with you\nSkill = how-to anywhere; project = one job’s home",
    real: ["Introduction to agent skills", "https://academy.claude.com/courses/introduction-to-agent-skills"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
