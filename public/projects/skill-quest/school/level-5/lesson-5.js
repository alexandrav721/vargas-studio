/* AI Made EZ · Level 5 · Lesson 5 · Double shifts (context engineering for long tasks). Terms: context engineering, context rot, context editing, memory tool, structured notes, tool search. */
(function () {
  var L = {
    n: 5, id: "e5", mins: 7, title: "Double shifts.", stamp: "Shifts",
    seen: ["Compaction", "Context window", "Skill"], terms: ["Context engineering", "Context rot", "Context editing", "Memory tool", "Structured notes", "Tool search"],
    teaser: ["DOUBLE SHIFT", "long tasks", "Level 2 named the context window.<br>Hour nine, and the counter’s full.<br>Leave notes for the next shift.", "Six words. Seven minutes."],
    lines: [
      ["Context engineering is keeping the counter clean.", "Give the model the smallest set of useful tokens, not everything you have."],
      ["A crowded counter blurs.", "It’s called context rot: recall slips as the context grows."],
      ["Long jobs need notes.", "Write progress to files. Each new session reads them first."]
    ],
    guess: { q: "An agent has worked for 6 hours and its answers get sloppy. Likely cause?", opts: [["Its counter is cluttered with old results", true], ["The model got tired", false], ["It ran out of tools", false]], reveal: "Models don’t tire. Old tool results crowd the counter, and recall slips. Clear it or summarize it." },
    startLabel: "Clean the counter",
    example: {
      title: "Four ways to keep the counter clean.",
      html:
        '<p class="label">Long-shift kit <span class="sample">Simplified</span></p><div class="ticket"><div class="th"><span>CLEAN COUNTER</span><span>4 moves</span></div>' +
        'Compaction: near the limit, squeeze the old shift into one summary.<br>' +
        'Context editing: clear old tool results, leave a placeholder. (API beta)<br>' +
        'Memory tool: Claude keeps notes in a memory folder your app stores. They outlast the chat.<br>' +
        'Tool search: 200 tools? Load just the few needed.' +
        '<div class="tf">Claude API features</div></div>' +
        '<p class="small"><b>Structured notes</b>: Anthropic’s long-running coding setup kept a progress file, a feature list and a log of saved changes (git). Each new session read them first.</p>',
      more: '<p class="small">Tool search docs: Claude picks tools less accurately past 30 to 50 tools. Search typically loads just the 3 to 5 it needs.</p><p class="small">Skills work the same way: only a short description sits on the counter until the task needs the full recipe.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Plan the long shift.",
      lead: "Pick a long job. Get a context plan and the note files to keep.",
      state: { job: "move 500 help articles to a new site", len: "a few hours" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">The long job</p>' + row("job", ["move 500 help articles to a new site", "a week-long research project", "clean up a big codebase", "sort a year of support tickets", "a month of donor emails to sort"]) +
          '<p class="label">How long it runs</p>' + row("len", ["a few hours", "all day", "several days"]);
      },
      head: "ORDER #E05", right: "shift plan", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "An AI agent for a long job: " + s.job + ", running " + s.len + ". I don’t code. Write a context plan:\n" +
          "1. What it loads first, what it fetches later.\n" +
          "2. When to compact or clear old tool results; what must never be lost.\n" +
          "3. Its note files, with a short template each.\n" +
          "4. How a fresh session picks up.\n" +
          "Mark API features vs. good habits. Unsure? Say so.";
      },
      claude: "Open in Claude", done: "Done →",
      after: "No developer? Use the notes yourself. Save the progress template as progress.md, then start each long Cowork or Claude Code task with “Read progress.md first, and update it before you stop.”"
    },
    game: {
      type: "tapall", title: "Which moves keep the counter clean?", lead: "Tap the {n} that help.",
      options: [
        ["Clear old tool results", true], ["Write progress to a notes file", true], ["Load only the tools this step needs", true],
        ["Paste every document up front, just in case", false, "More tokens, more rot. Fetch things when they’re needed."],
        ["Use the 1M-token window and never clean up", false, "It fits a lot, but recall still slips as it fills."]
      ],
      right: "All three. Less on the counter, better cooking.",
      wrong: "Does that add clutter or remove it?",
      habitTitle: "Architect habit", habit: "Assume the next shift remembers nothing. Write the note it needs to start in one minute."
    },
    breaks: {
      title: "Notes can go stale.",
      lines: [
        ["A summary drops details.", "Compaction keeps the gist. Put must-keep facts in a file."],
        ["Memory files need care.", "Never store keys or passwords in them. Delete notes nobody uses."]
      ],
      where: "A cook on the next shift can ask what happened. A fresh session only knows what was written down."
    },
    quiz: [
      { term: "Context rot", q: "What is context rot?", a: ["Recall slips as the context fills up", "Old files get deleted automatically", "The model forgets its training"], ok: 0, why: "Right. That’s why a clean counter beats a full one." },
      { term: "Tool search", q: "You have 200 tools. What does tool search do?", a: ["Loads only the few Claude needs, when it needs them", "Runs all 200 at once to save time", "Deletes the tools nobody uses"], ok: 0, why: "Right. Less clutter, better picks." },
      { term: "Context isolation", q: "Recall from Lesson 4: how do helpers keep the lead’s counter clean?", a: ["They read a lot and send back only a summary", "They share one big counter", "They skip the reading"], ok: 0, why: "Right. Sub-agents are a context move too." }
    ],
    say: "We clear old results, compact near the limit, and leave notes for the next shift.",
    keep: "Four moves for long-running agents, and note templates any fresh session can pick up.",
    cardLabel: "Copy my card",
    card: "DOUBLE SHIFTS (CONTEXT ENGINEERING)\nContext engineering = smallest set of useful tokens\nContext rot = recall slips as context grows\nCompaction = summarize the old shift\nContext editing = clear old tool results\nMemory tool = notes in a folder your app stores\nStructured notes = progress log + checklist + git\nTool search = load tools only when needed",
    real: ["Claude Platform 101 (context management lesson)", "https://academy.claude.com/courses/claude-platform-101"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
