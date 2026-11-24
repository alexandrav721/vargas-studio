/* Builder's Kitchen · Lesson 1 · How AI kitchens work. Terms: model, LLM, prompt, token, context window, model family. */
(function () {
  var L = {
    n: 1, id: "b1", mins: 8, title: "How AI kitchens work.", stamp: "Kitchen",
    terms: ["Model", "LLM", "Prompt", "Token", "Context window", "Model family"],
    teaser: ["THE KITCHEN", "how it works", "You place the order (prompt).<br>The chef cooks it (model).<br>The counter holds it all (context window).", "Six words. Eight minutes."],
    lines: [
      ["Claude is a model.", "A model is the chef. It learned from a huge library of text, and now it writes on request."],
      ["It’s an LLM: a large language model.", "Large because it’s a huge program, trained on a huge library of text."],
      ["Your order is a prompt.", "Everything the chef can see sits on one counter: the context window."]
    ],
    guess: { q: "How does Claude write an answer?", opts: [["It predicts the next piece of text, again and again", true], ["It looks the answer up in a giant database", false], ["A person types it behind the scenes", false]], reveal: "It predicts the next piece of text. That’s what a large language model does." },
    startLabel: "Look inside",
    example: {
      title: "One order, seen from the kitchen.",
      html:
        '<p class="label">Your order <span class="sample">Sample</span></p>' +
        '<div class="ticket"><div class="th"><span>PROMPT</span><span>your order</span></div>Summarize this recipe in 3 steps.<div class="tf">What you send is the prompt</div></div>' +
        '<p class="label" style="margin-top:14px">The chef counts in pieces <span class="sample">Example split</span></p>' +
        '<div class="fridge" aria-label="A word split into tokens"><span class="tag">un</span><span class="tag">believ</span><span class="tag">able</span></div>' +
        '<p class="small">Those pieces are <b>tokens</b>. A token is often a short word or part of one. Prices and limits are counted in tokens.</p>' +
        '<p class="label" style="margin-top:14px">The counter</p>' +
        '<div class="reply"><p class="who">On the counter right now</p>Your order · anything you pasted · the chef’s reply so far</div>' +
        '<p class="small">That counter is the <b>context window</b>. On current Claude models it holds about 1 million tokens, roughly 555,000 words. Huge, but the chef still only sees what’s on it.</p>' +
        '<p style="margin-top:14px">Claude comes in a <b>model family</b>: <b>Haiku</b> (fastest, cheapest), <b>Sonnet</b> (balanced), <b>Opus</b> (Anthropic’s usual first pick) and <b>Fable</b> (the hardest, longest tasks). Same kitchen, different chefs.</p>',
      next: "Pick your chef"
    },
    build: {
      title: "Your turn. Pick a chef for your job.",
      lead: "Tap a job and a chef. Your ticket makes a cheat sheet for your work.",
      state: { job: "writing emails", chef: "Sonnet" },
      controls: function (s, esc) {
        var jobs = ["writing emails", "planning meals", "running a small shop", "my small business", "marketing campaigns"];
        var chefs = [["Haiku", "fast and cheap"], ["Sonnet", "balanced"], ["Opus", "usual first pick"], ["Fable", "hardest tasks"]];
        return '<p class="label">Your job</p><div class="fridge">' + jobs.map(function (j) { return '<button type="button" class="chip" data-set="job" data-v="' + esc(j) + '" aria-pressed="' + (s.job === j) + '">' + esc(j) + "</button>"; }).join("") + "</div>" +
          '<p class="label">Your chef</p><div class="fridge">' + chefs.map(function (c) { return '<button type="button" class="chip" data-set="chef" data-v="' + c[0] + '" aria-pressed="' + (s.chef === c[0]) + '">' + c[0] + " · " + c[1] + "</button>"; }).join("") + "</div>";
      },
      head: "ORDER #B01", right: "to: the chef", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        var others = ["Haiku", "Sonnet", "Opus", "Fable"].filter(function (c) { return c !== s.chef; }).join(", ");
        return "I work on " + s.job + ". Give me a one-page cheat sheet I can keep:\n" +
          "1. One real task from my work, and roughly how many tokens it would use (mark it as an estimate).\n" +
          "2. When my chat gets long enough to start a fresh one, in one line.\n" +
          "3. Is " + s.chef + " the right Claude model for this? One line each comparing it to " + others + ".";
      },
      vendor: ["Claude or another AI model", "which model it uses and why, what happens in very long chats, and who pays when usage grows"], claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "match", title: "Match each word to its meaning.", lead: "Tap a word, then what it means.",
      pairs: [["Model", "The AI program itself, like Claude"], ["Prompt", "Your order: what you type plus anything you attach"], ["Token", "A small piece of text it counts and charges by"], ["Context window", "How much fits on the counter at once"], ["LLM", "AI that writes by predicting the next piece of text"], ["Model family", "Sizes of Claude: faster and cheaper, or more capable"]],
      right: "All six. You just used the words every AI builder uses.",
      habitTitle: "Say it in one line", habit: "A model is the chef, the prompt is your order, and the context window is the counter."
    },
    breaks: {
      title: "The counter gets wiped every shift.",
      lines: [
        ["A new chat starts with an empty counter.", "The chef doesn’t remember yesterday unless you put it back on the counter."],
        ["A crowded counter blurs things.", "In very long chats the chef pays less attention to early details, and apps may summarize them. Start fresh, or let the app compact it (squeeze it into a summary), then paste back key facts."],
        ["The cookbook stopped printing on a date.", "That’s the training cutoff. For anything newer, paste it in or let Claude search the web."],
        ["Bigger chefs cost more per token.", "Pick the smallest chef that does the job well."]
      ],
      where: "A real chef remembers and tastes. This one predicts the next piece of text from what’s on the counter. It doesn’t know when it’s wrong, so it can sound sure and still be wrong."
    },
    quiz: [
      { q: "What’s a token?", a: ["A small piece of text the model counts and charges by", "One full word"], ok: 0, why: "Right. Tokens are the pieces. Limits and prices are counted in them." },
      { q: "A very long chat starts missing early details. Why?", a: ["The counter (context window) is crowded, so early details get less attention", "The model learned something new mid-chat"], ok: 0, why: "Right. A crowded counter blurs early details. Start a fresh chat with the key facts." }
    ],
    keep: "a clear picture of the AI kitchen, and a chef you picked for your job.",
    cardLabel: "Copy my card",
    card: "THE AI KITCHEN\nModel = the chef (Claude)\nLLM = a chef that predicts the next piece of text\nPrompt = your order\nToken = the pieces it counts and charges by\nContext window = the counter: all it can see\nModel family = Haiku (fast) · Sonnet (balanced) · Opus (usual start) · Fable (hardest jobs)",
    real: ["AI Capabilities and Limitations", "https://academy.claude.com/courses/ai-capabilities-and-limitations"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
