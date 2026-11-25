/* AI Made EZ · Level 4 · Lesson 5 · Prep once, serve many (caching, batches, token counting). Terms: cache_control, Cache TTL, Cache hit, Token counting, custom_id. */
(function () {
  var L = {
    n: 5, id: "d5", mins: 6, title: "Prep once, serve many.", stamp: "Prep",
    seen: ["Prompt caching", "Batch processing", "Token"],
    terms: ["cache_control", "Cache TTL", "Cache hit", "Token counting", "custom_id"],
    teaser: ["PREP AHEAD", "caching · batches", "Chop the onions once.<br>Serve them all night.<br>Cook big orders overnight at half price.", "Five words. Six minutes."],
    lines: [
      ["Caching reuses the same start of your prompt.", "Mark it with cache_control. Repeat calls read it cheaply."],
      ["One changed byte spoils the prep.", "A timestamp at the top means nothing after it caches."],
      ["Batches trade speed for half price.", "Send many requests at once. Most finish within an hour."]
    ],
    guess: { q: "Your app sends the same 30-page manual with every question. Cheapest fix?", opts: [["Cache the manual with cache_control", true], ["Shorten every customer question", false], ["Switch to a bigger model", false]], reveal: "Cache it. Reading cached tokens costs a small fraction of normal input: 5% on Opus 5.5." },
    startLabel: "See the prep",
    example: {
      title: "The prep list, with prices.",
      html:
        '<p class="label">Mark the shared part <span class="sample">Simplified</span></p><div class="ticket"><div class="th"><span>REQUEST</span><span>cached</span></div>system: [ the 30-page manual,<br>&nbsp;&nbsp;cache_control: { type: "ephemeral" } ]<br>messages: user “Can I return opened boxes?”<div class="tf">Stable parts first. Changing parts after the mark.</div></div>' +
        '<p class="label" style="margin-top:14px">The receipt on the second call <span class="sample">Sample</span></p><div class="reply"><p class="who">usage</p>cache_read_input_tokens: 18,000<br>input_tokens: 12</div>' +
        '<p class="small">Writing the cache costs 1.25x for 5 minutes (the default <b>TTL</b>, its time to live) or 2x for 1 hour. Reads cost 0.1x on most models, 0.05x on Opus 5.5.</p>' +
        '<p class="small"><b>Message Batches</b>: up to 100,000 requests, 50% off, done within 24 hours. Tag each request with a <b>custom_id</b>.</p>',
      more: '<p class="small">The prompt is read in order: tools, then system, then messages. Current models won’t cache a part under 512 tokens, and no error tells you. Check sizes first with token counting (count_tokens, using the same model ID).</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Plan the prep.",
      lead: "Pick what repeats and when the answers are needed. Your ticket explains the savings, or writes the code.",
      state: { mode: "Explain it to me", lang: "Python", rep: "a long product manual", job: "answer questions live" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">How you want help</p>' + row("mode", ["Explain it to me", "Write the code"]) +
          '<p class="label">Language (for code)</p>' + row("lang", ["Python", "TypeScript"]) +
          '<p class="label">What repeats</p>' + row("rep", ["a long product manual", "the same long instructions", "a big set of examples", "a long chat history"]) +
          '<p class="label">The job</p>' + row("job", ["answer questions live", "process 5,000 reviews overnight"]);
      },
      head: "ORDER #D05", right: "prep list", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        var batch = s.job !== "answer questions live";
        if (s.mode === "Explain it to me") {
          return "My app sends " + s.rep + " with every Claude API request and needs to " + s.job + ". I don't code yet.\n" +
            "1. Explain prompt caching in plain words: what cache_control marks, why order matters (tools, then system, then messages), and 3 things that silently break a cache.\n" +
            "2. Compare the 5-minute and 1-hour cache lifetimes and when each pays off.\n" +
            "3. Say whether Message Batches (50% off, results within 24 hours) fit my job.\n" +
            "4. Show a rough cost example for 1,000 requests with and without caching. Look up current prices first and label the numbers estimates.";
        }
        return "Write a small " + s.lang + " script with the official Claude SDK. My app sends " + s.rep + " (use a placeholder text file) and needs to " + s.job + ".\n" +
          "- Model claude-opus-5-5. Key from ANTHROPIC_API_KEY.\n" +
          "- First count the shared part's tokens with the token counting endpoint.\n" +
          "- Put the shared part first with cache_control {type: \"ephemeral\"}, and the changing question after it.\n" +
          "- Make two calls and print cache_creation_input_tokens and cache_read_input_tokens, to prove the second call hit the cache.\n" +
          (batch ? "- Then send the job as a Message Batch with a custom_id per item, poll until it ends, and print each result by custom_id.\n" : "") +
          "Then tell me what to do with it: how to run it, and which numbers mean the cache is working.";
      },
      claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "tapall", title: "Which of these break the cache?", lead: "Tap all {n}.",
      options: [
        ["Today’s date and time at the top of the system prompt", true], ["Adding a new tool in the middle of a chat", true], ["Switching models between calls", true],
        ["A different question after the cached part", false, "That’s the plan. Changing parts go after the mark."],
        ["Reading the cache again within 5 minutes", false, "A read refreshes the timer, at no extra cost."]
      ],
      right: "Yes. Anything that changes the start, or the model, starts the prep over.",
      wrong: "Does that change the start of the prompt?",
      habitTitle: "Builder habit", habit: "Stable first, changing last. Then check cache_read_input_tokens after every change to your prompt code."
    },
    breaks: {
      title: "Prep goes stale.",
      lines: [
        ["A cache lives minutes, not days.", "5 minutes by default, 1 hour if you pay more to write it."],
        ["Batches aren’t for a waiting customer.", "Use them for overnight jobs, not live chat."]
      ],
      where: "Chopped onions sit where you can see them. A broken cache is invisible: no error, the bill just goes up."
    },
    quiz: [
      { term: "Cache hit", q: "How do you know the cache worked?", a: ["cache_read_input_tokens is above zero", "The reply came back with no error", "stop_reason says end_turn"], ok: 0, why: "Right. The usage fields are the only proof." },
      { term: "custom_id", q: "What is custom_id for in a batch?", a: ["Matching each result to the request it answers", "Choosing which model runs each request", "Setting the price of the batch"], ok: 0, why: "Right. Results can come back in any order." },
      { term: "tool_result block", q: "Recall from Lesson 4: what must every tool_result carry?", a: ["The matching tool_use_id", "A copy of the system prompt", "The model ID"], ok: 0, why: "Right. That’s how Claude knows which order it answers." }
    ],
    say: "We cache the shared start of the prompt and send overnight jobs as a batch at half price.",
    keep: "A ticket that prices or codes caching and batches for your app.",
    cardLabel: "Copy my card",
    card: "PREP ONCE, SERVE MANY\ncache_control = mark the end of the shared part\nOrder: tools, system, messages; stable first\nCache TTL = 5 min default, 1 hour costs more\nWrites 1.25x (5 min) or 2x (1 h); reads 0.1x\nOpus 5.5 reads: 0.05x\nCache hit = cache_read_input_tokens above 0\nBatches = 50% off, within 24 h, tag with custom_id\nToken counting = size it before you send",
    real: ["Building with the Claude API", "https://academy.claude.com/courses/building-with-the-claude-api"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
