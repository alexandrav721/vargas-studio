/* AI Made EZ · Level 4 · Lesson 2 · Pick the chef by job. Terms: MTok, Adaptive thinking, Time to first token, Model routing, Fast mode. */
(function () {
  var L = {
    n: 2, id: "d2", mins: 6, title: "Pick the chef by job.", stamp: "Chef",
    seen: ["Model family", "Effort", "Latency", "Cost"],
    terms: ["MTok", "Adaptive thinking", "Time to first token", "Model routing", "Fast mode"],
    teaser: ["PICK THE CHEF", "by job", "Four chefs, four prices.<br>The best chef for a salad<br>is rarely the priciest one.", "Five words. Six minutes."],
    lines: [
      ["Start on Opus. Switch when tests say so.", "Opus 5.5 is the usual default. Try cheaper chefs on real tasks."],
      ["Prices are per million tokens.", "Input: Haiku $0.10, Sonnet $2, Opus $4, Fable $8."],
      ["Effort sets how hard it thinks.", "low, medium, high, xhigh, max. Lower is faster and cheaper."]
    ],
    guess: { q: "An app sorts 50,000 emails a day into 5 labels. Which chef?", opts: [["Haiku 5.5, the fast, low-cost one", true], ["Fable 5.2, the most capable one", false], ["Whichever one is newest", false]], reveal: "Haiku. Sorting into fixed labels is simple, high-volume work. Prove it on real emails first." },
    startLabel: "Meet the chefs",
    example: {
      title: "Same order, four chefs.",
      html:
        '<p class="label">Price per million tokens (MTok): in · out <span class="sample">Nov 2026</span></p><div class="ticket"><div class="th"><span>THE CHEFS</span><span>Claude API</span></div>Haiku 5.5 · $0.10 · $0.50 <span class="small">(prompts up to 100K)</span><br>Sonnet 5.5 · $2 · $10<br>Opus 5.5 · $4 · $20 <span class="small">(the default)</span><br>Fable 5.2 · $8 · $40<div class="tf">Output costs 5x input on every chef</div></div>' +
        '<p class="label" style="margin-top:14px">The dial: effort</p><div class="reply"><p class="who">your request</p>output_config: { effort: "low" }</div>' +
        '<p class="small"><b>Adaptive thinking</b>: Claude decides how much to think on each request. On Opus 5.5 it’s always on, and effort sets the depth (default medium).</p>' +
        '<p class="small"><b>Time to first token</b>: how soon the first word shows.</p>',
      more: '<p class="small"><b>Fast mode</b> on Opus 5.5: up to 2.5x faster output at double the price ($8 / $40). <b>Model routing</b>: sort each request first, then send easy ones to a small chef and hard ones to a bigger chef.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Hire a chef for one job.",
      lead: "Pick the job and what matters most. Your ticket plans a cheap test, or writes it.",
      state: { mode: "Explain it to me", lang: "Python", job: "sort support emails into 5 labels", care: "lowest cost" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">How you want help</p>' + row("mode", ["Explain it to me", "Write the code"]) +
          '<p class="label">Language (for code)</p>' + row("lang", ["Python", "TypeScript"]) +
          '<p class="label">The job</p>' + row("job", ["sort support emails into 5 labels", "write product descriptions", "answer questions about a long contract", "plan a multi-step research task"]) +
          '<p class="label">What matters most</p>' + row("care", ["lowest cost", "fastest reply", "best quality"]);
      },
      head: "ORDER #D02", right: "hire a chef", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        if (s.mode === "Explain it to me") {
          return "I'm choosing a Claude model for this job: " + s.job + ". What matters most: " + s.care + ". I don't code yet.\n" +
            "1. Compare Claude Haiku 5.5, Sonnet 5.5, Opus 5.5 and Fable 5.2 for this job in plain words, with current prices per million tokens (look them up, don't guess).\n" +
            "2. Recommend one model and an effort level (low, medium, high, xhigh or max), and say why.\n" +
            "3. Plan a cheap test: 10 real examples, what to measure (quality, cost, time to first token), and what result would make me switch.\nKeep it short.";
        }
        return "Write a small " + s.lang + " script with the official Claude SDK that runs the same 3 sample inputs for this job (" + s.job + ") on claude-haiku-5-5, claude-sonnet-5-5 and claude-opus-5-5.\n" +
          "- Set output_config effort to \"low\" for the first run, in one place I can change.\n" +
          "- Read the key from ANTHROPIC_API_KEY.\n" +
          "- For each model, print the answer, input and output tokens, the cost from a price table I can edit, and how many seconds the call took.\n" +
          "What matters most to me: " + s.care + ".\n" +
          "Then tell me what to do with it: how to run it, how to swap in my own 3 inputs, and how to read the results.";
      },
      claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "pick", title: "Your Opus bot feels slow on quick yes/no questions. What do you try first?",
      options: [
        ["Test lower effort, or Haiku, on the same questions", true],
        ["Move everything to Fable, the most capable chef", false, "Bigger chefs think more. Slower and pricier for a yes or no."],
        ["Raise max_tokens so it has more room", false, "max_tokens is a ceiling on length. It doesn’t speed anything up."]
      ],
      right: "Yes. Turn the dial down and measure. Keep the change only if quality holds.",
      wrong: "Which change makes the chef think less?", hint: "Look for the dial from this lesson.",
      habitTitle: "Builder habit", habit: "Pick by testing on your own tasks. A leaderboard can’t tell you what your customers ask."
    },
    breaks: {
      title: "Chefs aren’t spare parts.",
      lines: [
        ["Switching chefs changes the dish.", "Re-test your prompts after any model change."],
        ["The cheapest call can cost more.", "A weak answer that needs a retry costs twice."]
      ],
      where: "A restaurant hires a chef once. You can swap chefs on every order, so you have to taste on every order too."
    },
    quiz: [
      { term: "Adaptive thinking", q: "What does adaptive thinking mean?", a: ["Claude decides how much to think on each request", "Claude learns from your past requests over time", "Claude picks the cheapest model for you"], ok: 0, why: "Right. Effort sets how deep it may go." },
      { term: "MTok", q: "Opus 5.5 output costs $20 per MTok. What’s an MTok?", a: ["A million tokens", "A thousand tokens", "One message"], ok: 0, why: "Right. So 1,000 output tokens on Opus 5.5 cost 2 cents." },
      { term: "Usage", q: "Recall from Lesson 1: where do you read the token counts for a reply?", a: ["usage", "stop_reason", "system"], ok: 0, why: "Right. usage is the receipt you price with." }
    ],
    say: "We start on Opus 5.5, then test Haiku or Sonnet and lower effort on our real tasks.",
    keep: "A ticket that plans or writes a side-by-side model test.",
    cardLabel: "Copy my card",
    card: "PICK THE CHEF\nHaiku 5.5: fast, cheap, simple high-volume jobs\nSonnet 5.5: balanced\nOpus 5.5: the usual default\nFable 5.2: the hardest, longest work\nMTok = a million tokens; output costs 5x input\nEffort = low · medium · high · xhigh · max\nTime to first token = how soon words appear\nTest on your own tasks before you switch",
    real: ["Claude Platform 101", "https://academy.claude.com/courses/claude-platform-101"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
