/* AI Made EZ · Level 4 · Lesson 8 · Opening night (errors, retries, limits, streaming, logging, keys, spend). Terms: Overloaded error, Exponential backoff, retry-after, Spend limit, Request ID. */
(function () {
  var L = {
    n: 8, id: "d8", mins: 7, title: "Opening night.", stamp: "Opening",
    seen: ["Streaming", "API key"],
    terms: ["Overloaded error", "Exponential backoff", "retry-after", "Spend limit", "Request ID"],
    teaser: ["OPENING NIGHT", "going live", "Seven lessons built the kitchen.<br>Now the doors open.<br>Plan the rush before the first guest.", "Five words. Seven minutes."],
    lines: [
      ["Some errors mean wait. Some mean fix it.", "429, 529: retry later. 400, 401: fix it, unless it’s your spend limit."],
      ["Wait longer each time you retry.", "The SDK retries twice by default, waiting longer each time."],
      ["Cap the bill before the rush.", "Set a spend limit in the Console. Keep keys on your server."]
    ],
    guess: { q: "Your app gets error 529 at the dinner rush. What is it?", opts: [["Anthropic is overloaded: retry after a wait", true], ["Your API key is wrong", false], ["Your prompt broke a rule", false]], reveal: "529 is overloaded_error: a busy kitchen, not your mistake. Retry with growing waits. A bad key is 401." },
    startLabel: "See the board",
    example: {
      title: "The opening-night board.",
      html:
        '<p class="label">Which errors to retry</p><div class="ticket"><div class="th"><span>ERRORS</span><span>what to do</span></div>429 rate_limit_error · too many: wait retry-after seconds<br>529 overloaded_error · retry with backoff<br>500 api_error · retry with backoff<br>400 · 401 · 404 · fix it, don’t retry<div class="tf">The SDK retries the busy-kitchen errors twice by default</div></div>' +
        '<p class="label" style="margin-top:14px">One log line per call <span class="sample">Sample</span></p><div class="reply"><p class="who">your log</p>req_018Ee… · claude-opus-5-5 · 1,204 in · 310 out · 2.1 s · 1 retry</div>' +
        '<p class="small">Every reply has a <b>request ID</b>. Log it: support asks for it. <b>Streaming</b> shows words as they arrive, so guests don’t stare at a blank screen.</p>',
      more: '<p class="small">A 429 with no retry-after can mean your tier’s monthly spend cap: retrying won’t help until access resumes. Start tier’s cap is $500. Set your own lower <b>spend limit</b> in the Console. Reaching your own limit returns a 400 that says “You have reached your specified API usage limits”. That one is not a bug in your request. Rate limits count requests, input tokens and output tokens per minute. Cached reads don’t count toward the input limit. The SDK retries 408, 409, 429 and 5xx errors. Call the API from your back end (your own server) only: anyone can read a key in a web page.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Write the launch checklist.",
      lead: "Pick what you’re launching and your biggest worry. Get the checklist, or the safety code.",
      state: { mode: "Explain it to me", lang: "Python", app: "a customer chat bot", worry: "surprise bills" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">How you want help</p>' + row("mode", ["Explain it to me", "Write the code"]) +
          '<p class="label">Language (for code)</p>' + row("lang", ["Python", "TypeScript"]) +
          '<p class="label">You’re launching</p>' + row("app", ["a customer chat bot", "a nightly report job", "a tool for my team"]) +
          '<p class="label">Biggest worry</p>' + row("worry", ["surprise bills", "outages at rush hour", "leaked keys"]);
      },
      head: "ORDER #D08", right: "opening night", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        if (s.mode === "Explain it to me") {
          return "I’m about to launch " + s.app + " on the Claude API. My biggest worry: " + s.worry + ". I don’t code yet.\n" +
            "1. A launch checklist in plain words: keys, spend limits, rate limits, retries, streaming, logging, and an eval before every change.\n" +
            "2. A small table: which errors to retry, which to fix.\n" +
            "3. The 3 checks that matter most for my worry, and how to test each before launch.";
        }
        var live = s.app !== "a nightly report job";
        return "Write a small " + s.lang + " module for " + s.app + " that wraps every Claude API call, using the official SDK.\n" +
          "- Model claude-opus-5-5. Key only from ANTHROPIC_API_KEY on the server, never in browser code.\n" +
          "- Use the SDK’s built-in retries (set max_retries) and a timeout. Tell apart: a 429 with retry-after, a 429 tier spend cap (error_code enforced_spend_limit_reached, no retry-after: don’t retry), a 400 whose message starts \"You have reached your specified\" (my own spend limit: don’t retry, alert me), and a 529 overloaded_error.\n" +
          (live ? "- Stream the reply for live users. The SDK doesn’t retry an error that arrives mid-stream, so catch it and show a ready-made message.\n" : "- Consider Message Batches for the nightly job, at half price.\n") +
          "- Log one line per call: request ID, model, input and output tokens, seconds. Never log the key.\n" +
          "My biggest worry: " + s.worry + ".\n" +
          "Then tell me what to do with it: where it goes in my app, how to trigger a failure on purpose to test it, and which Console settings to set before launch (spend limit, key expiry).";
      },
      claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "match", title: "Read the error board.", lead: "Tap an error, then what it means.",
      pairs: [["429 with retry-after", "Too many orders: wait that many seconds"], ["529 overloaded_error", "Anthropic’s kitchen is slammed: retry with backoff"], ["401 authentication_error", "Wrong or expired key: fix it"], ["Spend limit", "Your own monthly cap on the bill"], ["Request ID", "The ticket number support asks for"]],
      right: "All five. You can read the board on a busy night.",
      habitTitle: "Builder habit", habit: "Retry the busy-kitchen errors. Fix the ones that are yours."
    },
    breaks: {
      title: "Opening night still surprises you.",
      lines: [
        ["Retries can pile on.", "Add a little random wait (jitter) so retries don’t arrive together."],
        ["A spend cap stops everything.", "Reach it and the app goes quiet. Watch Usage in the Console."]
      ],
      where: "A restaurant can turn guests away politely. Your app needs a message written ahead of time for when Claude can’t answer."
    },
    quiz: [
      { term: "Exponential backoff", q: "What is exponential backoff?", a: ["Waiting longer after each failed try", "Retrying instantly until it works", "Switching to a cheaper model after an error"], ok: 0, why: "Right. 1 second, 2, 4… so a rush can clear." },
      { term: "Spend limit", q: "You set your own spend limit and reach it. What happens?", a: ["Requests fail until you raise it or the month resets", "Claude switches to a cheaper model by itself", "You’re billed double for the rest of the month"], ok: 0, why: "Right. A hard stop, by design. Your own limit returns a 400 that says so; it isn’t a bug in your request." },
      { term: "Time to first token", q: "Recall from Lesson 2: what does time to first token measure?", a: ["How soon the first words appear", "The total price of the reply", "How accurate the answer is"], ok: 0, why: "Right. Streaming is how you make it shorter." }
    ],
    say: "Before launch: a spend limit, keys on the server, retries with backoff, and request IDs logged.",
    keep: "A launch checklist, or the code that keeps your app calm on a busy night.",
    cardLabel: "Copy my card",
    card: "OPENING NIGHT\n429 = slow down; wait retry-after seconds\n429 with no retry-after = maybe the tier spend cap\n400 “specified usage limits” = your own spend limit\n529 overloaded = backoff: longer waits, plus jitter\nOther 400 · 401 · 404 = fix it, don’t retry\nLog request ID, tokens, seconds; never the key\nKeys on the server · spend limit set · evals run",
    real: ["Building with the Claude API", "https://academy.claude.com/courses/building-with-the-claude-api"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
