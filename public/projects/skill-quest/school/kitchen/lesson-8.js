/* Builder's Kitchen · Lesson 8 · Your own kitchen (Claude Code). Terms: Claude Code, CLAUDE.md, skill, slash command, hook, plugin, git. */
(function () {
  var L = {
    n: 8, id: "b8", mins: 9, title: "The chef in your own kitchen.", stamp: "Code",
    terms: ["Claude Code", "CLAUDE.md", "Skill", "Slash command", "Hook", "Plugin"],
    teaser: ["YOUR KITCHEN", "Claude Code", "Claude chat: you order at its restaurant.<br>Claude Code: it cooks in yours,<br>with your files and your tools.", "Six words. Nine minutes."],
    lines: [
      ["Claude Code works inside your project.", "It reads your files, writes code and runs commands. It’s an agent, in your kitchen."],
      ["CLAUDE.md is the note on your fridge.", "Your rules and how-tos. Claude Code reads it at the start of every session."],
      ["Skills are recipe cards.", "Claude sees each card’s title, and pulls the full card only when the job needs it."]
    ],
    startLabel: "Look around the kitchen",
    example: {
      title: "What lives in a Claude Code kitchen.",
      html:
        '<p class="label">The fridge note <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>CLAUDE.md</span><span>read every session</span></div>Run tests with: npm test<br>Never touch the .env file<br>Use plain words in the app<div class="tf">Requests, not guarantees</div></div>' +
        '<p class="label" style="margin-top:14px">The rest of the kitchen</p>' +
        '<div class="fridge"><span class="chip">Skill: a recipe card (SKILL.md)</span><span class="chip">/command: a shortcut you type</span><span class="chip">Hook: a timer that always fires</span><span class="chip">Plugin: a boxed kit of all of these</span></div>' +
        '<p class="small">A <b>hook</b> runs automatically at set moments, like after every edit. It’s the only one that guarantees a rule. Custom slash commands are now skills you run with /name.</p>' +
        '<p style="margin-top:14px">Claude Code runs in the terminal, VS Code and JetBrains, the desktop app and the web. It can change real files, so use <b>git</b>: a save point you can roll back to.</p>',
      next: "Write your fridge note"
    },
    build: {
      title: "Your turn. Write your fridge note.",
      lead: "Pick a project and your rules. Your ticket asks Claude to turn them into a real CLAUDE.md.",
      state: { proj: "a small website", rules: ["Explain changes in plain words", "Ask before deleting anything"] },
      controls: function (s, esc) {
        var proj = ["a small website", "a phone app", "a spreadsheet script", "a school project"];
        var rules = ["Explain changes in plain words", "Ask before deleting anything", "Run the tests after every change", "Keep pages under 40 words", "Never touch passwords or keys"];
        return '<p class="label">The project</p><div class="fridge">' + proj.map(function (v) { return '<button type="button" class="chip" data-set="proj" data-v="' + esc(v) + '" aria-pressed="' + (s.proj === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>" +
          '<p class="label">Rules for the fridge (tap any)</p><div class="fridge">' + rules.map(function (v) { return '<button type="button" class="chip" data-set="rules" data-multi="1" data-v="' + esc(v) + '" aria-pressed="' + (s.rules.indexOf(v) >= 0) + '">' + esc(v) + "</button>"; }).join("") + "</div>";
      },
      head: "ORDER #B08", right: "CLAUDE.md", foot: "Paste it into Claude Code, or open Claude",
      text: function (s) {
        return "Write a short CLAUDE.md for " + s.proj + ", under 20 lines, with these rules:\n" +
          (s.rules.length ? s.rules.map(function (r) { return "- " + r; }).join("\n") : "- (add your rules)") +
          "\nThen tell me: which of these should be a hook instead (because it must always happen), and one skill this project could use.";
      },
      claude: "Open Claude with my ticket", done: "I wrote my fridge note →"
    },
    game: {
      type: "match", title: "Match the kitchen to the Claude Code word.", lead: "Tap a word, then its kitchen.",
      pairs: [["CLAUDE.md", "The note on the fridge"], ["Skill", "A recipe card pulled by title"], ["Hook", "A timer that always fires"], ["Plugin", "A boxed kit of cards, timers and outlets"], ["Git", "A save point you can roll back to"]],
      right: "All five. That’s the whole Claude Code kitchen.",
      habitTitle: "Builder habit", habit: "If a rule must always happen, make it a hook. If it’s a how-to, make it a skill. If it’s context, put it on the fridge."
    },
    breaks: {
      title: "It cooks with real knives.",
      lines: [
        ["It changes real files and runs real commands.", "Read what it plans before you say yes, and commit to git first."],
        ["Fridge notes are requests.", "Claude Code tries hard to follow CLAUDE.md, but only a hook guarantees a rule."],
        ["Skills and plugins can run code.", "Install them like apps: only from people you trust."]
      ],
      where: "A cook in your home knows not to throw out your grandma’s recipe. Claude Code only knows what your notes and save points protect."
    },
    quiz: [
      { q: "Where do you put a rule that must ALWAYS happen in Claude Code?", a: ["A hook", "CLAUDE.md"], ok: 0, why: "Right. CLAUDE.md guides; hooks guarantee." },
      { q: "Recall from Lesson 7: is Claude Code an agent?", a: ["Yes, it loops: read, act, check", "No, it just chats"], ok: 0, why: "Right. It’s an agent with your files as its tools." }
    ],
    keep: "a real CLAUDE.md for your project, and a rule you’ll make a hook.",
    cardLabel: "Copy my kitchen-tools card",
    card: "YOUR OWN KITCHEN (CLAUDE CODE)\nClaude Code = an agent that works in your project files\nCLAUDE.md = the fridge note, read every session (requests)\nSkill = recipe card (SKILL.md), pulled when needed\n/command = a shortcut you type; custom ones are skills now\nHook = always fires at set moments (the only guarantee)\nPlugin = a boxed kit of skills, hooks and outlets\nGit = save points. Commit before big changes.",
    real: ["Claude Code in Action", "https://anthropic.skilljar.com/claude-code-in-action"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
