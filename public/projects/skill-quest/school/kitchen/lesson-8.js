/* Builder's Kitchen · Lesson 8 · Your own kitchen (Claude Code). Terms: Claude Code, CLAUDE.md, skill, slash command, hook, plugin, git. */
(function () {
  var L = {
    n: 8, id: "b8", mins: 9, title: "The chef in your own kitchen.", stamp: "Code",
    terms: ["Claude Code", "CLAUDE.md", "Skill", "Slash command", "Hook", "Plugin"],
    teaser: ["YOUR KITCHEN", "Claude Code", "Claude chat: you order at its restaurant.<br>Claude Code: it cooks in your project,<br>with your files and your tools.", "Six words. Nine minutes."],
    lines: [
      ["Claude Code works inside your project.", "It reads your files, writes code and runs commands. It’s an agent working in your project."],
      ["CLAUDE.md is the note on your fridge.", "Your rules and how-tos. Claude Code reads it at the start of every session."],
      ["Skills are recipe cards.", "Claude always sees each card’s name and one-line description, and pulls the full card when the description fits the job."]
    ],
    guess: { q: "What’s different about Claude Code compared with chatting with Claude?", opts: [["It works directly in your project files", true], ["It’s a smarter model", false], ["It only writes in code", false]], reveal: "Claude Code works inside your project: it reads files, makes changes and runs commands." },
    startLabel: "Look around",
    example: {
      title: "What lives in a Claude Code kitchen.",
      html:
        '<p class="label">The fridge note <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>CLAUDE.md</span><span>read every session</span></div>This is our bakery’s website<br>Never touch passwords or keys<br>Explain every change in plain words<div class="tf">Claude tries to follow these</div></div>' +
        '<p class="label" style="margin-top:14px">The rest of the kitchen</p>' +
        '<div class="fridge"><span class="tag">Skill: a recipe card (SKILL.md)</span><span class="tag">/command: a shortcut you type</span><span class="tag">Hook: a bell that rings at set moments</span><span class="tag">Plugin: a boxed kit of all of these</span></div>' +
        '<p class="small">A <b>hook</b> runs automatically at set moments, like right before or after every edit. Hooks always run at their moment, and one that runs before an action can block it. CLAUDE.md is a request. Your own /shortcuts are now made as skills.</p>' +
        '<p class="small">In <b>plan mode</b> it reads you the plan before touching anything. <b>Permission modes</b> set what it may do without asking.</p><p style="margin-top:14px">Claude Code runs in the Claude desktop app, on the web, and in the tools developers use. It changes real files, so it keeps <b>git</b> save points you can roll back to.</p>',
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
          "\nThen tell me: which of these should be a hook or a permission setting instead (because it must always hold), and one skill this project could use.";
      },
      vendor: ["Claude Code to build our website or app", "how changes are reviewed and saved, what it's allowed to touch, and how we undo a bad change"], claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "match", title: "Match the kitchen to the Claude Code word.", lead: "Tap a word, then its kitchen.",
      pairs: [["CLAUDE.md", "The note on the fridge"], ["Skill", "A recipe card picked by its description"], ["Hook", "A bell that rings at set moments"], ["Plugin", "A boxed kit of recipe cards, bells and outlets"], ["Git", "A save point you can roll back to"]],
      right: "All five. Those are the main Claude Code pieces.",
      habitTitle: "Builder habit", habit: "If a rule must always hold, use a hook or a permission setting. If it’s a how-to, make it a skill. If it’s context, put it on the fridge."
    },
    breaks: {
      title: "It cooks with real knives.",
      lines: [
        ["It changes real files and runs real commands.", "Read what it plans before you say yes, and make a save point (git) first."],
        ["Fridge notes are requests.", "Claude Code tries hard to follow CLAUDE.md. Hooks and permission settings are what it enforces."],
        ["Skills and plugins can run code.", "Install them like apps: only from people you trust."]
      ],
      where: "A cook in your home knows not to throw out your grandma’s recipe. Claude Code only knows what your notes and save points protect."
    },
    quiz: [
      { q: "Where do you put a rule that must ALWAYS hold in Claude Code?", a: ["A hook or a permission mode", "CLAUDE.md"], ok: 0, why: "Right. CLAUDE.md guides; hooks and permissions are enforced." },
      { q: "Recall from Lesson 7: is Claude Code an agent?", a: ["Yes, it loops: read, act, check", "No, it just chats"], ok: 0, why: "Right. It’s an agent with your files as its tools." }
    ],
    keep: "a real CLAUDE.md for your project, and a rule you’ll enforce.",
    cardLabel: "Copy my card",
    card: "YOUR OWN KITCHEN (CLAUDE CODE)\nClaude Code = an agent that works in your project files\nCLAUDE.md = the fridge note, read every session (requests)\nSkill = recipe card (SKILL.md), picked by its description\n/command = a shortcut you type; your own ones are made as skills\nHook = a bell that rings at set moments (enforced, like permissions)\nPlugin = a boxed kit of skills, hooks and outlets\nGit = save points. Commit before big changes.",
    real: ["Claude Code 101", "https://academy.claude.com/courses/claude-code-101"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
