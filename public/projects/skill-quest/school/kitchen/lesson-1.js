/* Builder's Kitchen · Lesson 1 · How AI kitchens work. Terms: model, LLM, prompt, token, context window, model family. */
(function () {
  var L = {
    n: 1, id: "b1", mins: 8, title: "How AI kitchens work.", stamp: "Kitchen",
    terms: ["Model", "LLM", "Prompt", "Token", "Context window", "Model family"],
    teaser: ["THE KITCHEN", "how it works", "You place the order (prompt).<br>The chef cooks it (model).<br>The counter holds it all (context window).", "Six words. Eight minutes."],
    lines: [
      ["Claude is a model.", "A model is the chef. It learned from a huge library of text, and now it writes on request."],
      ["It’s an LLM: a large language model.", "It cooks by predicting the next piece of text, one piece at a time, very well."],
      ["Your order is a prompt.", "Everything the chef can see sits on one counter: the context window."]
    ],
    startLabel: "Look inside the kitchen",
    example: {
      title: "One order, seen from the kitchen.",
      html:
        '<p class="label">Your order <span class="sample">Sample</span></p>' +
        '<div class="ticket"><div class="th"><span>PROMPT</span><span>your order</span></div>Summarize this recipe in 3 steps.<div class="tf">What you type is the prompt</div></div>' +
        '<p class="label" style="margin-top:14px">The chef counts in pieces, not words <span class="sample">Example split</span></p>' +
        '<div class="fridge" aria-label="A word split into tokens"><span class="chip">un</span><span class="chip">believ</span><span class="chip">able</span></div>' +
        '<p class="small">Those pieces are <b>tokens</b>. A token is often a short word or part of one. Prices and limits are counted in tokens.</p>' +
        '<p class="label" style="margin-top:14px">The counter</p>' +
        '<div class="reply"><p class="who">On the counter right now</p>Your order · the recipe you pasted · the chef’s reply so far</div>' +
        '<p class="small">That counter is the <b>context window</b>. On current Claude models it holds about 1 million tokens, roughly 555,000 words. Huge, but the chef still only sees what’s on it.</p>' +
        '<p style="margin-top:14px">Claude comes in a <b>model family</b>: <b>Haiku</b> (fastest, cheapest), <b>Sonnet</b> (balanced), <b>Opus</b> (Anthropic’s suggested start) and <b>Fable</b> (the hardest jobs). Same kitchen, different chefs.</p>',
      next: "Pick your chef"
    },
    build: {
      title: "Your turn. Pick a chef for your job.",
      lead: "Tap a job and a chef. Your ticket asks Claude to explain today’s words using your job.",
      state: { job: "writing emails", chef: "Sonnet" },
      controls: function (s, esc) {
        var jobs = ["writing emails", "planning meals", "running a small shop", "school homework", "making social posts"];
        var chefs = [["Haiku", "fast and cheap"], ["Sonnet", "balanced"], ["Opus", "the usual start"], ["Fable", "hardest jobs"]];
        return '<p class="label">Your job</p><div class="fridge">' + jobs.map(function (j) { return '<button type="button" class="chip" data-set="job" data-v="' + esc(j) + '" aria-pressed="' + (s.job === j) + '">' + esc(j) + "</button>"; }).join("") + "</div>" +
          '<p class="label">Your chef</p><div class="fridge">' + chefs.map(function (c) { return '<button type="button" class="chip" data-set="chef" data-v="' + c[0] + '" aria-pressed="' + (s.chef === c[0]) + '">' + c[0] + " · " + c[1] + "</button>"; }).join("") + "</div>";
      },
      head: "ORDER #B01", right: "to: the chef", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "I'm new to AI. Using my job (" + s.job + ") as the example, explain in plain words:\n" +
          "1. What a token is.\n2. What a context window is, and why long chats start forgetting.\n" +
          "3. Would " + s.chef + " be a good Claude model for " + s.job + "? Compare it to Haiku, Sonnet, Opus and Fable in 4 short lines.";
      },
      claude: "Open Claude with my ticket", done: "I asked the chef →"
    },
    game: {
      type: "match", title: "Match each word to the kitchen.", lead: "Tap a word, then its kitchen meaning.",
      pairs: [["Model", "The chef"], ["Prompt", "Your order ticket"], ["Token", "The pieces it counts and charges by"], ["Context window", "The counter: all the chef can see"], ["LLM", "A chef that cooks by predicting the next piece"]],
      right: "All five. You just used the words every AI builder uses.",
      habitTitle: "Say it in one line", habit: "A model is the chef, the prompt is your order, and the context window is the counter."
    },
    breaks: {
      title: "The counter gets wiped every shift.",
      lines: [
        ["A new chat starts with an empty counter.", "The chef doesn’t remember yesterday unless you put it back on the counter."],
        ["A full counter drops things.", "In very long chats, early details fall off or get summarized. Start fresh and paste the key facts."],
        ["Bigger chefs cost more per token.", "Pick the smallest chef that does the job well."]
      ],
      where: "A real chef remembers and tastes. This one predicts the next piece of text from what’s on the counter. It doesn’t know when it’s wrong, so it can sound sure and still be wrong."
    },
    quiz: [
      { q: "What’s a token?", a: ["A small piece of text the model counts and charges by", "A password for Claude"], ok: 0, why: "Right. Tokens are the pieces. Limits and prices are counted in them." },
      { q: "A very long chat starts missing early details. Why?", a: ["The context window (the counter) is full", "The chef got tired"], ok: 0, why: "Right. The counter has a limit. Start a fresh chat with the key facts." }
    ],
    keep: "a clear picture of the AI kitchen, and a chef you picked for your job.",
    cardLabel: "Copy my kitchen card",
    card: "THE AI KITCHEN\nModel = the chef (Claude)\nLLM = a chef that predicts the next piece of text\nPrompt = your order\nToken = the pieces it counts and charges by\nContext window = the counter: all it can see\nModel family = Haiku (fast) · Sonnet (balanced) · Opus (usual start) · Fable (hardest jobs)",
    real: ["AI Capabilities and Limitations", "https://anthropic.skilljar.com/ai-capabilities-and-limitations"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
