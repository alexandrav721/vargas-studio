/* Builder's Kitchen · Lesson 3 · House rules (prompting). Terms: system prompt, examples, XML tags, thinking/effort, hallucination, temperature (retired). */
(function () {
  var L = {
    n: 3, id: "b3", mins: 9, title: "House rules on the wall.", stamp: "Rules",
    terms: ["System prompt", "Prompt engineering", "Examples", "XML tags", "Thinking", "Hallucination"],
    teaser: ["HOUSE RULES", "on the wall", "1. Answer like our shop.<br>2. Under 80 words.<br>3. If unsure, say so.", "Six words. Nine minutes."],
    lines: [
      ["The system prompt is the house rules on the wall.", "The builder writes it once. It shapes every plate, whatever the customer orders."],
      ["Prompt engineering is writing clear tickets.", "Say who it’s for, show an example, and ask for the shape you want back."],
      ["Hallucination is a confident wrong plate.", "Rules like “say I don’t know” and “quote the source” make it rarer, never zero."]
    ],
    guess: { q: "Two apps ask Claude the same thing and get very different tones. Why?", opts: [["Each app gave Claude different standing rules", true], ["One paid for a nicer Claude", false], ["Claude was in a different mood", false]], reveal: "Each app hangs its own house rules, called a system prompt." },
    startLabel: "See the rules",
    example: {
      title: "Same order. With and without house rules.",
      html:
        '<p class="label">Order <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>USER</span><span>message</span></div>Do you deliver on Sundays?<div class="tf">Same question both times</div></div>' +
        '<p class="label" style="margin-top:14px">No house rules</p><div class="reply"><p class="who">assistant</p>Many businesses deliver on Sundays! It depends on the shop. You could check their website or call…</div>' +
        '<p class="label" style="margin-top:14px">House rules: “You answer for Rosa’s Bakery. Facts are in &lt;facts&gt;. If it’s not there, say you’ll ask.”</p>' +
        '<div class="reply"><p class="who">assistant</p>Yes, Sundays 9 to 1, within 5 miles.</div>' +
        '<p class="small"><b>XML tags</b> like &lt;facts&gt;…&lt;/facts&gt; are labeled boxes that keep your rules, data and examples apart. <b>Examples</b> show the chef a few finished plates, so it learns the style without copying one.</p>' +
        '<p class="small">Anthropic’s AI Fluency course calls the whole skill the <b>4Ds</b>: what to hand off, how you ask, checking the plate, owning what you serve.</p><p style="margin-top:14px"><b>Thinking</b>: newer Claude models can reason quietly before answering. Builders set an <b>effort</b> level: more thinking for hard jobs, less for quick ones. You pay for thinking like the words it writes.</p>',
      next: "Write rules"
    },
    build: {
      title: "Your turn. Write the rules on the wall.",
      lead: "Pick a business and rules. Your ticket asks Claude to test them on a tricky customer.",
      state: { biz: "a bakery", rules: ["Under 80 words", "If unsure, say so"] },
      controls: function (s, esc) {
        var biz = ["a bakery", "a hair salon", "a marketing agency", "a tutor"];
        var rules = ["Under 80 words", "If unsure, say so", "Friendly, no jargon", "Only use the facts I give", "End with one question"];
        return '<p class="label">The business</p><div class="fridge">' + biz.map(function (v) { return '<button type="button" class="chip" data-set="biz" data-v="' + esc(v) + '" aria-pressed="' + (s.biz === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>" +
          '<p class="label">House rules (tap any)</p><div class="fridge">' + rules.map(function (v) { return '<button type="button" class="chip" data-set="rules" data-multi="1" data-v="' + esc(v) + '" aria-pressed="' + (s.rules.indexOf(v) >= 0) + '">' + esc(v) + "</button>"; }).join("") + "</div>";
      },
      head: "ORDER #B03", right: "rules test", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "Act as the help assistant for " + s.biz + ". Your system prompt (house rules):\n" +
          (s.rules.length ? s.rules.map(function (r) { return "- " + r; }).join("\n") : "- (none yet)") +
          "\n\nThen: 1. Answer a tricky customer question you make up. 2. Show the same answer with no rules. 3. Tell me in 2 lines which rule helped most, and one rule I should add.";
      },
      vendor: ["a custom AI assistant with its own instructions", "what rules it follows, how it avoids making things up, and what it does when it doesn't know"], claude: "Open in Claude", done: "Done →", after: "In a real app these rules go in the system prompt field. In a chat we fake it by pasting them."
    },
    game: {
      type: "tapall", title: "Which of these lower hallucination?", lead: "Tap all {n}.",
      options: [
        ["“If you don’t know, say so”", true], ["“Quote the source first”", true], ["Give it the real facts in the prompt", true],
        ["“Be 100% accurate”", false, "Asking nicely doesn’t create knowledge. Give it facts and an exit."],
        ["Turn the old “temperature” dial to 0", false, "Old advice. It never guaranteed truth, and current Claude models reject the setting."]
      ],
      right: "All three. Facts in, an honest exit, and receipts.",
      wrong: "That one sounds right but doesn’t work.",
      habitTitle: "Builder habit", habit: "Rules on the wall guide the chef strongly, but they aren’t a lock. Anything that must never happen belongs in the app itself, not the prompt."
    },
    breaks: {
      title: "Rules can be talked around.",
      lines: [
        ["A clever customer can talk around the rules.", "That’s a jailbreak. Orders hidden in an email or page are prompt injection (Lesson 5). Real limits are built into the app."],
        ["Old tutorials teach a “temperature” dial.", "It set how adventurous the chef was. Current Claude models reject it; clear rules, examples and effort do the job."],
              ],
      where: "Kitchen staff follow the poster or get fired. Claude usually follows it, with no boss to answer to."
    },
    quiz: [
      { q: "Who usually writes the system prompt?", a: ["The person building the app", "Anthropic, for every app"], ok: 0, why: "Right. The builder hangs the rules; the customer places orders." },
      { q: "Recall from Lesson 2: does the API remember the last chat?", a: ["No, the app resends it each time", "Yes, for 24 hours"], ok: 0, why: "Right. The window forgets. Your app carries the history." }
    ],
    keep: "a tested set of house rules for a real business.",
    cardLabel: "Copy my card",
    card: "HOUSE RULES\nSystem prompt = rules on the wall, written by the builder\nPrompt engineering = clear tickets: who, example, shape\nJailbreak = a user talking around the rules\nExamples = a few finished plates to learn from\nXML tags = labeled boxes: <facts>, <rules>, <example>\nThinking + effort = quiet reasoning, billed as output\nHallucination = confident wrong plate. Give facts + “say I don’t know”",
    real: ["Building with the Claude API (prompt engineering module)", "https://academy.claude.com/courses/building-with-the-claude-api"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
