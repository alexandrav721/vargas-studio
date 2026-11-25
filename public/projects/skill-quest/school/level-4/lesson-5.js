/* AI Made EZ · Level 4 · Lesson 5 · Prep once, serve many (caching, batches, token counting). Terms: cache_control, Cache TTL, Cache hit, Token counting, custom_id. */
(function () {
  var L = {
    n: 5, id: "d5", mins: 6, title: "Prep once, serve many.", stamp: "Prep",
    seen: ["Prompt caching", "Token"],
    terms: ["cache_control", "Cache TTL", "Cache hit", "Token counting", "custom_id"],
    teaser: ["PREP AHEAD", "caching · batches", "Level 2 named prompt caching.<br>Now you chop the onions once<br>and cook big orders overnight, half price.", "Five words. Six minutes."],
    lines: [
      ["Caching reuses the same start of your prompt.", "Mark it with cache_control. Repeat calls read it cheaply."],
      ["One changed letter spoils the prep.", "Put the time at the very top and the cache never matches."],
      ["Batches trade speed for half price.", "Send many requests at once. Most finish within an hour."]
    ],
    guess: { q: "Your app sends the same 30-page manual with every question. Cheapest fix?", opts: [["Cache the manual with cache_control", true], ["Shorten every customer question", false], ["Switch to a bigger model", false]], reveal: "Cache it. Reading the cached manual costs a small fraction of normal input, so every repeat question gets cheaper." },
    startLabel: "See the prep",
    example: {
      title: "The prep list, with prices.",
      html:
        '<p class="label">Mark the shared part</p><div class="ticket"><div class="th"><span>REQUEST</span><span>cached</span></div>system: [ the 30-page manual,<br>&nbsp;&nbsp;cache_control: { type: "ephemeral" } ]<br>messages: user “Can I return opened boxes?”<div class="tf">Stable parts first, changing parts after.</div></div>' +
        '<p class="label" style="margin-top:14px">Second call’s receipt <span class="sample">Sample</span></p><div class="reply"><p class="who">usage</p>cache_read_input_tokens: 18,000 <span class="small">(from the prep)</span><br>input_tokens: 12</div>' +
        '<p class="small">Cached reads cost a tenth to a fortieth of normal input, by model. It keeps 5 minutes (its <b>TTL</b>, time to live); an hour costs more.</p>' +
        '<p class="small"><b>Message Batches</b>: half price. Most finish within an hour; unfinished requests expire after 24 hours. Tag each with a <b>custom_id</b>.</p>',
      more: '<p class="small">The prompt is read in order: tools, then system, then messages. Claude won’t cache a prompt shorter than its minimum up to the mark (512 tokens on most current models; some, like Sonnet 5, need 1,024), and no error tells you: cache_creation_input_tokens just reads 0. Check sizes first with token counting (count_tokens, using the same model ID). A batch holds up to 100,000 requests.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Plan the prep.",
      lead: "Pick what repeats and when answers are due. Get the savings in plain words, or the code.",
      state: { mode: "Explain it to me", lang: "Python", rep: "a long product manual", job: "answer questions live" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">How you want help</p>' + row("mode", ["Explain it to me", "Write the code (for a developer)"]) +
          '<p class="label">Language (for code)</p>' + row("lang", ["Python", "TypeScript"]) +
          '<p class="label">What repeats</p>' + row("rep", ["a long product manual", "the same long instructions", "a big set of examples", "a long chat history"]) +
          '<p class="label">The job</p>' + row("job", ["answer questions live", "process 5,000 reviews overnight"]);
      },
      head: "ORDER #D05", right: "prep list", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        var batch = s.job !== "answer questions live";
        if (s.mode === "Explain it to me") {
          return "My app sends " + s.rep + " on every Claude API call, to " + s.job + ". I don’t code yet.\n" +
            "1. Prompt caching, plainly, and 3 things that break it.\n" +
            "2. Do Message Batches fit? (Most finish within an hour; unfinished requests expire after 24 hours.)\n" +
            "End with a cost table for 1,000 requests, cached vs. not, that I can paste into a spreadsheet (say if prices come from memory).";
        }
        return "Write a small " + s.lang + " script with the official Claude SDK. My app sends " + s.rep + " (make me a 2-page placeholder file, at least 600 tokens) and needs to " + s.job + ".\n" +
          "- Model claude-opus-5-5. Key from ANTHROPIC_API_KEY.\n" +
          "- Count the shared part’s tokens first; warn me if it’s under the model’s cache minimum.\n" +
          "- Shared part first with cache_control {type: \"ephemeral\"}, the changing question after it.\n" +
          "- Make two calls; print cache_creation_input_tokens and cache_read_input_tokens for each.\n" +
          (batch ? "- Then run the job as a Message Batch: a custom_id per item, poll until done, print results by custom_id.\n" : "") +
          "Then: how to run it, and which numbers prove the cache works.";
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
    say: "We cache the shared start of each prompt and batch overnight jobs at half price.",
    keep: "A cost sheet for caching and batches on your own app.",
    cardLabel: "Copy my card",
    card: "PREP ONCE, SERVE MANY\ncache_control = mark the end of the shared part\nOrder: tools, system, messages; stable first\nCache TTL = 5 min default, 1 hour costs more\nCached reads = a small fraction of normal input\nCache hit = cache_read_input_tokens above 0\nBatches = half price, most done in an hour, expire at 24 h, tag with custom_id\nToken counting = size it before you send",
    real: ["Building with the Claude API", "https://academy.claude.com/courses/building-with-the-claude-api"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
