/* AI Made EZ · Level 4 · Lesson 7 · Taste tests in code (evals). Terms: Code grader, Rubric, Pairwise comparison, Baseline, Pass rate. */
(function () {
  var L = {
    n: 7, id: "d7", mins: 7, title: "Taste tests in code.", stamp: "Tests",
    seen: ["Eval", "Test set", "Grader", "LLM-as-judge", "Regression"],
    terms: ["Code grader", "Rubric", "Pairwise comparison", "Baseline", "Pass rate"],
    teaser: ["TASTE TESTS", "in code", "Level 2 wrote the scorecard.<br>Now a script tastes every dish,<br>keeps the bill and times the plate.", "Five words. Seven minutes."],
    lines: [
      ["An eval has three parts.", "Test inputs, a way to run your app, a way to grade."],
      ["Use the cheapest grader that measures the real thing.", "Code first. A Claude judge only where it takes judgment."],
      ["Score cost and speed too.", "A better answer at triple the price may still lose."]
    ],
    guess: { q: "Your app labels emails “urgent” or “not urgent”. How do you grade it?", opts: [["Code compares each label to the right answer", true], ["Ask Claude to rate each label from 1 to 10", false], ["Read a few and decide", false]], reveal: "Code. When the answer comes from a fixed list, an exact match is free, fast and never moody." },
    startLabel: "See a test run",
    example: {
      title: "A run, a score, a bill.",
      html:
        '<p class="label">One test case <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>CASE 07</span><span>tag: refund</span></div>input: “Box arrived crushed, I want my money back”<br>expected: urgent<div class="tf">15 to 100 cases is a good first set</div></div>' +
        '<p class="label" style="margin-top:14px">The report: baseline vs. new prompt <span class="sample">Sample</span></p><div class="fridge"><span class="tag">Baseline: 41 of 50</span><span class="tag">New: 46 of 50</span></div>' +
        '<div class="reply"><p class="who">per case</p>pass · $0.004 · 1.8 s · stop_reason end_turn</div>' +
        '<p class="small">Fuzzy outputs, like customer replies? A <b>pairwise comparison</b>: a judge picks the better of two answers. Or a judge scores one answer against a <b>rubric</b>. Check the judge against your own grades.</p>',
      more: '<p class="small">Anthropic’s eval advice: report absolute numbers first (seconds, dollars), then percentages. On a rate-limit error (429, next lesson), wait a random, growing time, retry, and record the retry. That is not a fail. If your script re-runs a case that failed its grade, score the first try: a case that passed only on a re-run counts as a fail.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Write the taste test.",
      lead: "Pick a feature and its output. You get an eval plan, or the script that runs it.",
      state: { mode: "Explain it to me", lang: "Python", feat: "an email sorter", out: "a label from a list" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">How you want help</p>' + row("mode", ["Explain it to me", "Write the code"]) +
          '<p class="label">Language (for code)</p>' + row("lang", ["Python", "TypeScript"]) +
          '<p class="label">The feature</p>' + row("feat", ["an email sorter", "a reply writer", "a receipt extractor", "a FAQ bot"]) +
          '<p class="label">Its output</p>' + row("out", ["a label from a list", "JSON fields", "free text for people"]);
      },
      head: "ORDER #D07", right: "taste test", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        if (s.mode === "Explain it to me") {
          return "Plan a test for " + s.feat + " on the Claude API. Its output: " + s.out + ". I don’t code yet.\n" +
            "1. Recommend a grader: code check, pairwise comparison, rubric judge or a person.\n" +
            "2. 10 test cases with expected answers: 3 tricky, 1 to flag.\n" +
            "3. What to record per case; how to rerun it before every change.\n" +
            "End with one Console playground request to try (model, system, message), and what to check.";
        }
        var grade = s.out === "free text for people" ? "a pairwise judge call (claude-opus-5-5) that compares each answer to a saved baseline answer, shows the two in random order, and saves the judge’s pick and reasons. On the first run, save the answers as the baseline instead of grading" : "code: an exact match for labels, a schema check for JSON";
        return "Write a small " + s.lang + " eval script with the official Claude SDK for " + s.feat + " (output: " + s.out + ").\n" +
          "- A cases file with 10 inputs and expected answers (make them up and label them samples).\n" +
          "- Run each case on claude-opus-5-5, with my prompt in one place I can edit. Key from ANTHROPIC_API_KEY.\n" +
          "- Grade with " + grade + ".\n" +
          "- Record per case: pass or fail, input and output tokens, cost from an editable price table, seconds, stop_reason.\n" +
          "- Print the failing cases (input, expected, got), the pass rate, total cost and median seconds, and save results to a file the next run can compare against.\n" +
          "Then tell me what to do with it: how to run it, how to add cases, and how to compare two runs.";
      },
      claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "tapall", title: "Which belong in your eval results?", lead: "Tap all {n}.",
      options: [
        ["Pass or fail for every case", true], ["Cost per case", true], ["Seconds per case", true],
        ["Only the cases that failed", false, "Keep the passes. A pass that turns into a fail is a regression."],
        ["The judge’s score with no reasons", false, "Save the reasons. That’s how you catch a bad judge."]
      ],
      right: "Yes. Quality, cost and time, for every case.",
      wrong: "Would you miss that next time?",
      habitTitle: "Builder habit", habit: "Run the eval before and after every change. Same cases, same grader, compared to the baseline."
    },
    breaks: {
      title: "A test only tastes what you serve it.",
      lines: [
        ["Made-up cases flatter you.", "Use real inputs, and add every new failure."],
        ["A judge can drift.", "Grade a sample by hand. If you disagree, fix the rubric."]
      ],
      where: "A taster has a tongue. A code grader checks only what you wrote down, and a judge only what its rubric says."
    },
    quiz: [
      { term: "Pairwise comparison", q: "What is a pairwise comparison?", a: ["A judge picks the better of two answers", "Running each test twice to rule out luck", "Comparing two prices for the same model"], ok: 0, why: "Right. Usually the new version against your saved baseline." },
      { term: "Baseline", q: "What’s a baseline?", a: ["The current version’s results, saved to compare against", "The cheapest model you could switch to", "The first test case in your set"], ok: 0, why: "Right. Every change gets measured against it." },
      { term: "Regression", q: "From Level 2: a fix broke a case that used to pass. What’s that?", a: ["A regression", "A refusal", "A cache miss"], ok: 0, why: "Right. The eval catches it before customers do." }
    ],
    say: "Every change reruns the same cases against the baseline, logging cost and time.",
    keep: "An eval plan with 10 cases, a grader and a baseline.",
    cardLabel: "Copy my card",
    card: "TASTE TESTS IN CODE\nEval = cases + a way to run + a way to grade\nCode grader = exact match, schema check: free\nPairwise comparison = judge picks the better of two\nRubric = what a judge scores one answer on\nBaseline = today’s results, saved · Pass rate = share that pass\nLog cost, seconds, stop_reason on every case\nCheck the judge against your own grades",
    real: ["Introduction to evals", "https://academy.claude.com/courses/introduction-to-evals"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
