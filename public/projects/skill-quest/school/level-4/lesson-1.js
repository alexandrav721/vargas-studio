/* AI Made EZ · Level 4 · Lesson 1 · Your first order by code. Terms: Console, Playground, Environment variable, Model ID, Content block, Usage. */
(function () {
  var L = {
    n: 1, id: "d1", mins: 6, title: "Your first order by code.", stamp: "Order",
    seen: ["API key", "Request", "Response", "Messages"],
    terms: ["Console", "Playground", "Environment variable", "Model ID", "Content block", "Usage"],
    teaser: ["FIRST ORDER", "by code", "You watched the order window.<br>Now your shop sends its own:<br>product blurbs, order emails.", "Six words. Six minutes."],
    lines: [
      ["Your own shop or app can call Claude directly.", "Trying it needs a small prepaid API credit; a chat plan doesn’t cover it."],
      ["Four fields do most of the work.", "model (which chef), max_tokens (the reply’s length cap), messages (the chat), system (optional)."],
      ["Every plate comes with a receipt.", "usage counts the tokens in and out."]
    ],
    guess: { q: "An API key is the password your code uses. Where should it live?", opts: [["In an environment variable on your computer or server", true], ["Pasted at the top of your code file", false], ["In the web page your customers load", false]], reveal: "An environment variable: a setting on your computer, outside your code. The SDK (Anthropic’s ready-made code kit) reads it, so it’s never in your files." },
    startLabel: "See the slip",
    example: {
      title: "One slip, one plate, one receipt.",
      html:
        '<p class="label">1. The slip you send <span class="sample">Real fields</span></p><div class="ticket"><div class="th"><span>REQUEST</span><span>messages.create</span></div>model: "claude-opus-5-5"<br>max_tokens: 4096<br>system: "You write short product descriptions."<br>messages: user “Describe our cedar candle.”<div class="tf">Key read from ANTHROPIC_API_KEY</div></div>' +
        '<p class="label" style="margin-top:14px">2. The plate that comes back <span class="sample">Sample</span></p><div class="reply"><p class="who">assistant</p>content: [ text block “Hand-poured cedar soy…” ]<br>stop_reason: end_turn <span class="small">(why it stopped: end_turn means finished)</span><br><span class="small">usage: 21 input tokens · 305 output tokens</span></div>' +
        '<p class="small">It arrives as <b>JSON</b>: plain text with labels, so code can read each part. Try requests first in the <b>Console</b>’s <b>playground</b> (platform.claude.com), then copy the code.</p>',
      more: '<p class="small">Install the SDK: <code>pip install anthropic</code> or <code>npm install @anthropic-ai/sdk</code>. On Opus 5.5 thinking can’t be turned off, and thinking counts toward max_tokens, so leave room. If stop_reason says max_tokens, the reply was cut off. The reply is a list of content blocks: check each block’s type before reading its text. Older guides say Workbench; the playground replaced it.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Send your first order.",
      lead: "Pick a first job for your shop. Never coded? Pick Explain it to me: it works in any free chat.",
      state: { mode: "Explain it to me", lang: "Python", job: "write a product description" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">How you want help</p>' + row("mode", ["Explain it to me", "Write the code (for a developer)"]) +
          '<p class="label">Language (for code)</p>' + row("lang", ["Python", "TypeScript"]) +
          '<p class="label">The first job</p>' + row("job", ["write a product description", "answer an order email", "summarize a review", "write a menu blurb"]);
      },
      head: "ORDER #D01", right: "first call", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        if (s.mode === "Explain it to me") {
          return "I’m learning the Claude API for my business and don’t code yet. Walk me through a first call to " + s.job + ".\n" +
            "1. Plain words: the Console, API keys, environment variables, how keys leak.\n" +
            "2. The request: model, max_tokens, system, messages.\n" +
            "3. A labeled sample reply: content blocks, stop_reason, usage.\n" +
            "4. Then " + s.job + " for me here (ask me for details), as my app would get it back.";
        }
        var sdk = s.lang === "Python" ? "anthropic (pip install anthropic)" : "@anthropic-ai/sdk (npm install @anthropic-ai/sdk)";
        return "Write the smallest correct " + s.lang + " script that calls the Claude API with the official SDK, " + sdk + ", to " + s.job + ".\n" +
          "- Model claude-opus-5-5, max_tokens 4096, a one-line system prompt. If stop_reason is \"max_tokens\", say it was cut off; if \"refusal\", say Claude declined.\n" +
          "- Read the key from the ANTHROPIC_API_KEY environment variable. Never hardcode it.\n" +
          "- Print only the text blocks, then the usage: input and output tokens.\n" +
          "Then tell me what to do with it: the install command, the file name, how to set the key, how to run it, and what I should see.";
      },
      after: "Optional extra, once you have credit: open the Console playground (platform.claude.com/playground), pick the model, paste the system line and the message, and press Run. Max, Ultra and Team plans include some monthly API credit.",
      claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "tapall", title: "Which belong in your first request?", lead: "Tap all {n}.",
      options: [
        ["model: \"claude-opus-5-5\"", true], ["max_tokens: 4096", true], ["messages: the user’s question", true],
        ["temperature: 0.7", false, "Current Claude models reject it. Effort is the dial now (next lesson)."],
        ["Your API key inside the messages", false, "Never. The SDK sends the key separately, from your environment variable."]
      ],
      right: "Yes. Model, length limit, messages. A system prompt is optional.",
      wrong: "That one doesn’t belong on the slip.",
      habitTitle: "Builder habit", habit: "Try a request in the playground first, then copy its code. You debug the order before you debug the program."
    },
    breaks: {
      title: "A slip isn’t a conversation.",
      lines: [
        ["The API forgets every order.", "Send the whole chat each time, or Claude won’t see it."],
        ["A key works like a card number.", "Anyone holding it can order on your bill."]
      ],
      where: "A paper slip sits where you can see it. A key can leak into a screenshot, a shared code folder or a web page without you noticing."
    },
    quiz: [
      { term: "Usage", q: "Where do you see what a reply cost?", a: ["The usage field: input and output tokens", "The stop_reason at the end of the reply", "The model ID you put in the request"], ok: 0, why: "Right. Multiply the tokens by the price per million." },
      { term: "Environment variable", q: "Why keep the key in an environment variable?", a: ["It keeps the secret out of your code and the files you share", "It makes every request faster", "Claude reads it and remembers who you are"], ok: 0, why: "Right. The SDK finds it there by itself." },
      { term: "Messages", q: "From Level 2: what do “user” and “assistant” turns hold?", a: ["Your turns and Claude’s turns, in order", "Two different API keys", "The input price and the output price"], ok: 0, why: "Right. messages is the whole chat, resent each time." }
    ],
    say: "I made my first call: model, max_tokens, messages, and the key stays in an environment variable.",
    keep: "Your first API call, explained line by line or written for you.",
    cardLabel: "Copy my card",
    card: "FIRST ORDER BY CODE\nConsole = where you get keys and try requests\nPlayground = test a request, then copy its code\nKey lives in ANTHROPIC_API_KEY, never in code\nRequest = model · max_tokens · messages · system\nModel ID = the exact name, like claude-opus-5-5\nResponse = a list of content blocks + stop_reason\nUsage = tokens in and out: your receipt",
    real: ["Claude Platform 101", "https://academy.claude.com/courses/claude-platform-101"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
