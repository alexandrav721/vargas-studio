/* Builder's Kitchen · Lesson 9 · Taste tests (evals). Terms: eval, test set, success criteria, grader, LLM-as-judge, regression. */
(function () {
  var L = {
    n: 9, id: "b9", mins: 6, title: "Taste tests.", stamp: "Evals",
    terms: ["Eval", "Test set", "Success criteria", "Grader", "LLM-as-judge", "Regression"],
    teaser: ["TASTE TEST", "evals", "Tasting one spoon isn’t a test.<br>Twenty dishes, the same scorecard,<br>every time you change the prompt.", "Six words. Eight minutes."],
    lines: [
      ["An eval is a taste test with a scorecard.", "The same set of questions, scored the same way, every time you change a prompt or a model."],
      ["“It looked fine” is a vibe check.", "A change that fixes one dish can quietly ruin three others. Only a test set catches that."],
      ["Graders do the tasting.", "A small program checks exact things, like word count. Another AI model (LLM-as-judge) scores fuzzy things, like tone. People spot-check the judge."]
    ],
    guess: { q: "You change your bot’s prompt. How do you know it got better?", opts: [["Re-run the same test questions and compare scores", true], ["Try one question and see if it looks good", false], ["Ask Claude if it’s better", false]], reveal: "Builders re-run a fixed set of test questions with a scorecard. That’s an eval." },
    startLabel: "Watch a test",
    example: {
      title: "A bakery bot, scored before and after a change.",
      html:
        '<p class="label">Success criteria (the scorecard, like a rubric) <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>SCORECARD</span><span>3 checks</span></div>1. Uses only the bakery’s real facts<br>2. Under 80 words<br>3. Says “I’ll check” when unsure<div class="tf">Specific and measurable</div></div>' +
        '<p class="label" style="margin-top:14px">Test set: 20 real customer questions</p>' +
        '<div class="fridge"><span class="tag">Version A · 15 of 20 pass</span><span class="tag">Version B · 18 of 20 pass</span></div>' +
        '<p class="small">Version B won, but question 7 used to pass and now fails. That’s a <b>regression</b>. You only see it because you kept the same test set.</p>' +
        '<p style="margin-top:14px">Keep some questions aside that you never use while editing the prompt. Otherwise the score only proves you memorized the test.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Write a scorecard.",
      lead: "Pick an AI feature and what “good” means. Your ticket asks Claude to build a mini eval.",
      state: { feat: "a help-desk bot", crit: ["Correct facts", "Short answers"] },
      controls: function (s, esc) {
        var feat = ["a help-desk bot", "an ad copy writer", "a lesson-plan helper", "a homework helper"];
        var crit = ["Correct facts", "Short answers", "Says when unsure", "Friendly tone", "Never gives medical advice"];
        return '<p class="label">The AI feature</p><div class="fridge">' + feat.map(function (v) { return '<button type="button" class="chip" data-set="feat" data-v="' + esc(v) + '" aria-pressed="' + (s.feat === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>" +
          '<p class="label">What “good” means (tap any)</p><div class="fridge">' + crit.map(function (v) { return '<button type="button" class="chip" data-set="crit" data-multi="1" data-v="' + esc(v) + '" aria-pressed="' + (s.crit.indexOf(v) >= 0) + '">' + esc(v) + "</button>"; }).join("") + "</div>";
      },
      head: "ORDER #B09", right: "taste test", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "Help me build a tiny eval for " + s.feat + ". What good means: " + (s.crit.join(", ") || "help me decide") + ".\n" +
          "1. Turn those into 3 specific, measurable checks.\n2. Write 8 test questions, including 2 tricky edge cases.\n" +
          "3. For each check, say if code or an LLM judge should grade it, and write the judge's instructions.";
      },
      vendor: ["AI they say is accurate", "how they test it, on how many real examples, and how they catch a change that breaks something"], claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "pick", title: "You changed your prompt. 3 answers look great. Ready to use it?",
      options: [
        ["Not yet: run the whole test set and compare scores", true],
        ["Yes, 3 good answers is enough", false, "That’s a vibe check. The change may have broken other cases."],
        ["Ask Claude if it’s ready", false, "Claude can help grade, but it needs your scorecard and test set."]
      ],
      right: "Yes. Same test, same scorecard, before you ship.",
      wrong: "What might you not have seen?", hint: "One fix can break another dish.",
      habitTitle: "Builder habit", habit: "Write the scorecard before you change the prompt. Then every change gets a score."
    },
    breaks: {
      title: "The judge can be wrong too.",
      lines: [
        ["An LLM judge has its own blind spots.", "Check its scores against a person’s on a sample first. Anthropic’s docs suggest a different model as judge."],
        ["A test set is only as good as its questions.", "Use real questions from real people, and add every new failure you find."],
              ],
      where: "A food critic can taste anything. An eval only measures what your scorecard asks. If you forgot to check for allergies, it won’t either."
    },
    quiz: [
      { term: "Regression", q: "What’s a regression?", a: ["Something that used to work breaks after a change", "A test question you skip", "A model getting older"], ok: 0, why: "Right. Evals catch them before your users do." },
      { term: "RAG", q: "Recall from Lesson 6: if a RAG bot gives wrong answers, what’s often the problem?", a: ["Search pulled the wrong page", "Claude needs training", "The context window is too big"], ok: 0, why: "Right. An eval on the search step finds it fast." },
      {q: "From Lesson 6: what do embeddings do?", a: ["Turn text into numbers by meaning, so similar ideas can be found", "Train the model on your files", "Shrink long chats"], ok: 0, why: "Right. That’s how “refund” finds “money back”.", term: "Embeddings"}
    ],
    keep: "5 questions that expose “it’s accurate” claims, and a ticket for a mini taste test.",
    cardLabel: "Copy my card",
    card: "TASTE TESTS (EVALS)\nEval = same questions, same scorecard, every change\nSuccess criteria = what good means, measurable\nTest set = the fixed questions (keep some unseen)\nGrader = code for exact checks, LLM-as-judge for fuzzy ones\nRegression = a fix that broke something else\nVibe check ≠ eval",
    real: ["Introduction to evals", "https://academy.claude.com/courses/introduction-to-evals"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
