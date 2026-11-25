/* AI Made EZ · Level 4 · Lesson 8 · Opening night (errors, retries, limits, streaming, logging, keys, spend). Terms: Overloaded error, Exponential backoff, retry-after, Spend limit, Request ID. */
(function () {
  var L = {
    n: 8, id: "d8", mins: 7, title: "Opening night.", stamp: "Opening",
    seen: ["Streaming", "API key"],
    terms: ["Overloaded error", "Exponential backoff", "retry-after", "Spend limit", "Request ID"],
    teaser: ["OPENING NIGHT", "going live", "Seven lessons built the kitchen.<br>Now the doors open.<br>Plan the rush before the first guest.", "Five words. Seven minutes."],
    lines: [
      ["Some errors mean wait. Some mean fix it.", "Busy errors (429, 529): wait, then retry. Your errors (400, 401): fix the request."],
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
      more: '<p class="small">A 429 with no retry-after may be your tier’s monthly spend cap: retrying won’t help. Hitting your <b>own spend limit</b> returns a 400 that says “You have reached your specified API usage limits.” Call the API from your own server only: anyone can read a key in a web page.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Write the launch checklist.",
      lead: "Pick what you’re launching and your biggest worry. Get the checklist, or the safety code.",
      state: { mode: "Explain it to me", lang: "Python", app: "a customer chat bot", worry: "surprise bills" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">How you want help</p>' + row("mode", ["Explain it to me", "Write the code (for a developer)"]) +
          '<p class="label">Language (for code)</p>' + row("lang", ["Python", "TypeScript"]) +
          '<p class="label">You’re launching</p>' + row("app", ["a customer chat bot", "a nightly report job", "a tool for my team"]) +
          '<p class="label">Biggest worry</p>' + row("worry", ["surprise bills", "outages at rush hour", "leaked keys"]);
      },
      head: "ORDER #D08", right: "opening night", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        if (s.mode === "Explain it to me") {
          return "I’m about to launch " + s.app + " on the Claude API. My biggest worry: " + s.worry + ". I don’t code yet.\n" +
            "1. A small table: which errors to retry, which to fix.\n" +
            "2. The 3 checks that matter most for my worry.\n" +
            "End with a plain-words launch checklist (keys, spend limits, retries, streaming, logging, evals) as boxes I can tick, one owner per box.";
        }
        var live = s.app !== "a nightly report job";
        return "Write a small " + s.lang + " wrapper for every Claude API call in " + s.app + " (official SDK).\n" +
          "- Model claude-opus-5-5. Key from ANTHROPIC_API_KEY, server only.\n" +
          "- SDK built-in retries (max_retries) and a timeout. Don’t retry 400, 401, 404, or a 429 with no retry-after (a spend cap): log those and alert me.\n" +
          (live ? "- Stream replies; the SDK won’t retry mid-stream errors, so catch them and show a ready-made message.\n" : "- Consider Message Batches for the nightly job, at half price.\n") +
          "- Log per call: request ID (request-id header, not message ID), model, tokens, seconds; never the key.\n" +
          "My biggest worry: " + s.worry + ".\n" +
          "Then: where it goes, how to fake a failure, which Console settings to set first (spend limit, key expiry).";
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
      where: "A host can see the rush and talk to the line. Your app sees only an error code, and says nothing on its own."
    },
    quiz: [
      { term: "Exponential backoff", q: "What is exponential backoff?", a: ["Waiting longer after each failed try", "Retrying instantly until it works", "Switching to a cheaper model after an error"], ok: 0, why: "Right. 1 second, 2, 4… so a rush can clear." },
      { term: "Spend limit", q: "You set your own spend limit and reach it. What happens?", a: ["Requests fail until you raise it or the month resets", "Claude switches to a cheaper model by itself", "You’re billed double for the rest of the month"], ok: 0, why: "Right. A hard stop, by design. Your own limit returns a 400 that says so; it isn’t a bug in your request." },
      { term: "Time to first token", q: "Recall from Lesson 2: what does time to first token measure?", a: ["How soon the first words appear", "The total price of the reply", "How accurate the answer is"], ok: 0, why: "Right. Streaming shows those first words right away, instead of after the whole reply." }
    ],
    say: "Before launch: a spend limit, keys on the server, retries with backoff, and request IDs logged.",
    keep: "A launch checklist, or the code that keeps your app calm on a busy night.",
    cardLabel: "Copy my card",
    card: "OPENING NIGHT\n429 = slow down; wait retry-after seconds\n429 with no retry-after = maybe the tier spend cap\n400 “specified usage limits” = your own spend limit\n529 overloaded = backoff: longer waits, plus jitter\nOther 400 · 401 · 404 = fix it, don’t retry\nLog request ID, tokens, seconds; never the key\nKeys on the server · spend limit set · evals run",
    real: ["Building with the Claude API", "https://academy.claude.com/courses/building-with-the-claude-api"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
