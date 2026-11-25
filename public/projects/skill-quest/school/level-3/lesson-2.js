/* AI Made EZ · Level 3 · Lesson 2 · Standing orders (account instructions, project instructions, project knowledge, memory, chat search). */
(function () {
  var L = {
    n: 2, id: "c2", mins: 6, title: "Standing orders.", stamp: "Orders",
    terms: ["Instructions for Claude", "Project instructions", "Project knowledge", "Memory", "Chat search"],
    teaser: ["STANDING ORDERS", "set once, used every shift", "House order on every ticket.<br>Station orders for one job.<br>A crew that remembers you.", "Five words. Six minutes."],
    lines: [
      ["Standing orders come in layers.", "Some apply to every chat. Some only to one project."],
      ["Instructions for Claude go on every ticket.", "How you like answers, for all your work. Set them once in Settings."],
      ["Project instructions are for one job.", "The weekly report, the client account. Only chats in that project use them."]
    ],
    guess: { q: "You want your weekly report in one fixed layout, every week. Where does that go?", opts: [["Project instructions in a “Weekly report” project", true], ["Your account-wide instructions", false], ["Retype it every Monday", false]], reveal: "One job, one project. Account-wide instructions are for things true of every chat." },
    startLabel: "See the layers",
    example: {
      title: "Three layers, one work setup.",
      html:
        '<p class="label">1. Every chat <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>INSTRUCTIONS</span><span>Settings › Your Claude</span></div>I’m an office manager. Plain words.<br>Short answers. Ask when unclear.<div class="tf">Applies everywhere</div></div>' +
        '<p class="label" style="margin-top:14px">2. One project: “Weekly report”</p><div class="ticket"><div class="th"><span>PROJECT</span><span>instructions + knowledge</span></div>Use the template file. Five bullets max.<br>Flag anything late in bold.<div class="tf">Files: template.docx, last report</div></div>' +
        '<p class="label" style="margin-top:14px">3. Memory</p><div class="reply"><p class="who">claude remembers</p>Works at a dental office. Reports go out Fridays.</div>' +
        '<p class="small">See and edit <b>memory</b> in Settings › Your Claude, “Manage” next to “Your memory.” Each project keeps its own memory. <b>Chat search</b> (“Search and reference chats”) lets Claude look back at old chats; paid plans.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Write your standing orders.",
      lead: "Pick your role, one job that repeats, and a tone. Your ticket writes both layers, ready to paste.",
      state: { role: "an office manager", job: "a weekly status report", tone: "plain and short" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">Your role</p>' + row("role", ["an office manager", "a teacher", "a nurse", "a sales rep", "a freelancer"]) +
          '<p class="label">A job that repeats</p>' + row("job", ["a weekly status report", "customer email replies", "meeting notes", "lesson plans", "client proposals"]) +
          '<p class="label">Tone</p>' + row("tone", ["plain and short", "warm and friendly", "formal and careful"]);
      },
      head: "ORDER #C02", right: "standing orders", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "Help me set up Claude for work. I’m " + s.role + ". Tone: " + s.tone + ". Ask me up to 3 short questions first.\n" +
          "1. Write my account-wide Instructions for Claude (under 100 words), only things true for every chat.\n" +
          "2. Write Project instructions for a project called “" + s.job + "”: the goal, who reads it, the format, what to always check, what never to do.\n" +
          "3. List 5 files to add as project knowledge, and what to remove first (names, account numbers).\n" +
          "4. Tell me exactly where to paste each part.";
      },
      claude: "Open in Claude", done: "Done →",
      after: "Account instructions: Settings › Your Claude › Instructions. Project instructions: open the project and edit its instructions."
    },
    game: {
      type: "match", title: "Match each standing order to its kitchen.", lead: "Tap a word, then its kitchen.",
      pairs: [["Instructions for Claude", "The house order on every ticket"], ["Project instructions", "The order for one station"], ["Project knowledge", "The binder kept at that station"], ["Memory", "What the crew remembers about you"], ["Chat search", "Flipping back through old tickets"]],
      right: "All five. Every-chat rules go in Settings; one-job rules go in the project.",
      habitTitle: "Work habit", habit: "If you type the same request twice, it’s a standing order. Move it to instructions or a project."
    },
    breaks: {
      title: "The crew can remember wrong.",
      lines: [
        ["Memory is a summary Claude writes.", "It can be stale or wrong. Read it now and then, and delete what’s off."],
        ["Incognito chats skip memory.", "Click the ghost icon in a new chat. It isn’t saved to history or memory."]
      ],
      where: "A line cook remembers you or forgets you. Claude’s memory is a written note you can open, edit and erase."
    },
    quiz: [
      { term: "Project instructions", q: "Rules only for your client proposals go where?", a: ["Project instructions in a proposals project", "Your account-wide instructions", "Claude’s memory"], ok: 0, why: "Right. Project instructions apply only to chats in that project." },
      { term: "Memory", q: "How do you see what Claude remembers about you?", a: ["Settings › Your Claude, then “Manage” next to “Your memory”", "Ask a coworker to check your account", "You can’t see it"], ok: 0, why: "Right. You can read, edit or delete each memory." },
      { term: "Cowork", q: "From Lesson 1: which station works on folders on your computer?", a: ["Cowork, in the desktop app", "Research", "Chat on your phone"], ok: 0, why: "Right. It reads and writes files in folders you connect." }
    ],
    say: "Let’s put that in the project instructions so nobody retypes it.",
    keep: "Your account instructions and a ready project setup for one job that repeats.",
    cardLabel: "Copy my card",
    card: "STANDING ORDERS\nInstructions for Claude = every chat (Settings › Your Claude)\nProject instructions = one job only\nProject knowledge = the files that job uses\nMemory = what Claude remembers; read and edit it in Settings\nEach project has its own memory\nChat search = Claude can look back at old chats (paid)\nIncognito (ghost icon) = no history, no memory",
    real: ["Introduction to Claude Cowork", "https://academy.claude.com/courses/introduction-to-claude-cowork"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
