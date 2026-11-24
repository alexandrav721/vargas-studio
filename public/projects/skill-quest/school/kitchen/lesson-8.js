/* Builder's Kitchen · Lesson 8 · Your own kitchen (Claude Code). Terms: Claude Code, CLAUDE.md, skill, slash command, hook, plugin, git. */
(function () {
  var L = {
    n: 8, id: "b8", mins: 6, title: "The chef in your own kitchen.", stamp: "Code",
    seen: ["Git"], terms: ["Claude Code", "CLAUDE.md", "Skill", "Slash command", "Hook", "Plugin"],
    teaser: ["YOUR KITCHEN", "Claude Code", "Claude chat: you order at its restaurant.<br>Claude Code: it cooks in your project,<br>with your files and your tools.", "Six words. Six minutes."],
    lines: [
      ["Claude Code works inside your project.", "It reads your files, writes code and runs commands (typed instructions to the computer). It’s an agent, like Lesson 7’s chef."],
      ["CLAUDE.md is the note on your fridge.", "Your rules and how-tos, read every session."],
      ["Skills are recipe cards.", "Claude pulls a card when its description fits the job."]
    ],
    guess: { q: "How is Claude Code different from chat?", opts: [["It works in your project files", true], ["It’s a smarter model", false], ["It only answers in code", false]], reveal: "Claude Code works inside your project: it reads files, makes changes and runs commands." },
    startLabel: "Look around",
    example: {
      title: "What lives in a Claude Code kitchen.",
      html:
        '<p class="label">The fridge note <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>CLAUDE.md</span><span>read every session</span></div>This is our bakery’s website<br>Never touch passwords or keys<br>Explain every change in plain words<div class="tf">Claude tries to follow these</div></div>' +
        '<p class="label" style="margin-top:14px">More pieces</p>' +
        '<div class="fridge"><span class="tag">Skill: a recipe card (SKILL.md)</span><span class="tag">/command: a shortcut you type</span><span class="tag">Hook: a bell at set moments</span><span class="tag">Plugin: a kit of all these</span></div>' +
        '<p class="small">A <b>hook</b> always fires; one set before an action can stop it. CLAUDE.md is only a request.</p>',
      more: '<p class="small">A <b>/command</b> is a shortcut like /help; to make your own, write a skill.</p><p class="small">In <b>plan mode</b> it reads you the plan before touching anything. <b>Permission modes</b> set what it may do without asking.</p><p style="margin-top:14px">Claude Code runs in the Claude desktop app, on the web, and in the tools developers use. It has its own undo (/rewind); <b>git</b> save points are yours to make.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Write your fridge note.",
      lead: "Pick a project and your rules. Your ticket has Claude Code write a real CLAUDE.md and a small skill.",
      state: { proj: "my small business website", rules: ["Explain changes in plain words", "Ask before deleting anything"] },
      controls: function (s, esc) {
        var proj = ["my small business website", "a phone app", "a spreadsheet script", "a school project"];
        var rules = ["Explain changes in plain words", "Ask before deleting anything", "Run the tests after every change", "Keep pages under 40 words", "Never touch passwords or keys"];
        return '<p class="label">The project</p><div class="fridge">' + proj.map(function (v) { return '<button type="button" class="chip" data-set="proj" data-v="' + esc(v) + '" aria-pressed="' + (s.proj === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>" +
          '<p class="label">Rules for the fridge (tap any)</p><div class="fridge">' + rules.map(function (v) { return '<button type="button" class="chip" data-set="rules" data-multi="1" data-v="' + esc(v) + '" aria-pressed="' + (s.rules.indexOf(v) >= 0) + '">' + esc(v) + "</button>"; }).join("") + "</div>";
      },
      head: "ORDER #B08", right: "CLAUDE.md", foot: "Paste it into Claude Code, or open Claude",
      text: function (s) {
        return "(Paste this into Claude Code, in an empty practice folder. If you only have the Claude app, paste it there and it will show you the files instead.)\n\n" +
          "Set up " + s.proj + " for working with you:\n" +
          "1. Create CLAUDE.md (under 20 lines) with these rules:\n" +
          (s.rules.length ? s.rules.map(function (r) { return "   - " + r; }).join("\n") : "   - (add your rules)") +
          "\n2. Create one small skill at .claude/skills/plain-words/SKILL.md that rewrites any text in plain words (name and one-line description at the top).\n" +
          "3. Show me both files, then tell me which rule should be a hook or a permission rule instead, because it must always hold.";
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
        ["It changes real files and runs commands.", "Read its plan first, and make a git save point."],
        ["Fridge notes are requests.", "Hooks and permission settings are enforced."],
        ["Skills and plugins can run code.", "Install only from people you trust."]
      ],
      where: "A home cook knows to keep grandma’s recipe. Claude Code only knows what your notes and save points protect."
    },
    quiz: [
      { term: "Hook", q: "Where do you put a rule that must ALWAYS hold in Claude Code?", a: ["A hook or a permission rule", "In CLAUDE.md, written in capital letters", "In a skill that Claude loads when it fits"], ok: 0, why: "Right. CLAUDE.md guides; hooks and permissions are enforced." },
      { term: "Claude Code", q: "Recall from Lesson 7: is Claude Code an agent?", a: ["Yes, it loops: read, act, check", "No, it only chats about code you paste in", "Only when it runs on the web version"], ok: 0, why: "Right. It’s an agent with your files as its tools." },
      {q: "From Lesson 5: what’s prompt injection?", a: ["Hidden orders inside content Claude reads", "A longer system prompt written by the builder", "A user typing many messages very fast"], ok: 0, why: "Right. Treat content as information, keep a person on risky actions.", term: "Prompt injection"}
    ],
    say: "Claude Code works inside a project. CLAUDE.md is a request; hooks and permission rules are enforced.",
    keep: "Questions to ask whoever builds your site with AI, and a ticket that drafts a CLAUDE.md.",
    cardLabel: "Copy my card",
    card: "YOUR OWN KITCHEN (CLAUDE CODE)\nClaude Code = an agent that works in your project files\nCLAUDE.md = the fridge note, read every session (requests)\nSkill = recipe card (SKILL.md), picked by its description\n/command = a shortcut you type; your own ones are made as skills\nHook = a bell that rings at set moments (enforced, like permissions)\nPlugin = a boxed kit of skills, hooks and outlets\nGit = save points. Commit before big changes.",
    real: ["Claude Code 101", "https://academy.claude.com/courses/claude-code-101"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
