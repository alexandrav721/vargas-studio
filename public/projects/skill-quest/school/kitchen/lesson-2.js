/* Builder's Kitchen · Lesson 2 · The order window (API). Terms: API, API key, request, response, messages, SDK, streaming, cost per token. */
(function () {
  var L = {
    n: 2, id: "b2", mins: 8, title: "The order window.", stamp: "API",
    terms: ["API", "API key", "Request", "Response", "Messages", "Streaming", "Cost per token"],
    teaser: ["ORDER WINDOW", "the API", "Apps don’t chat with Claude.<br>They pass a ticket through a window<br>and get a plate back.", "Seven words. Eight minutes."],
    lines: [
      ["The API is the order window.", "Other apps send Claude a written ticket and get a plate back. No chat screen at all."],
      ["The API key is your staff badge.", "It proves the ticket is yours, and the bill goes to your tab. Keep it secret."],
      ["The window remembers nothing.", "Every ticket must carry the whole conversation so far."]
    ],
    startLabel: "Watch one ticket go through",
    example: {
      title: "One ticket, one plate.",
      html:
        '<p class="label">The request (what your app sends) <span class="sample">Simplified</span></p>' +
        '<div class="ticket"><div class="th"><span>REQUEST</span><span>to the API</span></div>model: Sonnet<br>messages:<br>&nbsp;&nbsp;user: “Name 3 soups for a cold night.”<div class="tf">Badge attached: your API key</div></div>' +
        '<p class="label" style="margin-top:14px">The response (what comes back)</p>' +
        '<div class="reply"><p class="who">assistant</p>Minestrone, French onion, chicken noodle.<br><span class="small">Used: 18 tokens in · 9 tokens out</span></div>' +
        '<p class="small">A chat is a list of <b>messages</b>: “user” turns are yours, “assistant” turns are Claude’s. To ask a follow-up, your app sends the whole list again.</p>' +
        '<p style="margin-top:14px"><b>Streaming</b> sends the plate out bite by bite, so words appear as they’re written. <b>Cost per token</b>: you pay for tokens in and tokens out, and out costs more.</p>',
      next: "Write your own ticket"
    },
    build: {
      title: "Your turn. Fill in an order ticket.",
      lead: "Pick what your app would ask. Your ticket asks Claude to show you the real request for it.",
      state: { app: "a recipe app", ask: "suggest a dinner", chef: "Sonnet" },
      controls: function (s, esc) {
        var apps = ["a recipe app", "a shop’s help page", "a study app", "a travel app"];
        var asks = ["suggest a dinner", "answer a question", "summarize a page", "write a reply"];
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">Your app</p>' + row("app", apps) + '<p class="label">It asks Claude to</p>' + row("ask", asks) + '<p class="label">Chef</p>' + row("chef", ["Haiku", "Sonnet", "Opus"]);
      },
      head: "ORDER #B02", right: "to: the API", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "I'm learning how apps use the Claude API. Imagine " + s.app + " that needs Claude to " + s.ask + ", using " + s.chef + ".\n" +
          "1. Show me the request it would send (model, system prompt, messages), with a note on each part in plain words.\n" +
          "2. Show the response that comes back, and point out the token counts.\n" +
          "3. Explain why the app must resend earlier messages for a follow-up.\nNo real API key, use a placeholder.";
      },
      claude: "Open Claude with my ticket", done: "I saw the request →"
    },
    game: {
      type: "pick", title: "The window got a follow-up: “Make it vegetarian.” Claude answers “Make what vegetarian?” Why?",
      options: [
        ["The app sent only the new message, not the earlier ones", true],
        ["The API key ran out", false, "A bad key gets an error, not a confused answer."],
        ["Claude doesn’t like vegetarian food", false, "No. It just can’t see what came before."]
      ],
      right: "Exactly. The window remembers nothing. Send the whole list of messages every time.",
      wrong: "Think about what was on the ticket.", hint: "The API doesn’t remember earlier tickets.",
      habitTitle: "Builder habit", habit: "Every request carries the full conversation. That’s also why long chats cost more: you pay for the history again each turn."
    },
    breaks: {
      title: "A badge that pays the bill.",
      lines: [
        ["Your API key is not your Claude subscription.", "API use is billed separately, per token, to the account the key belongs to."],
        ["Anyone holding the badge can order on your tab.", "Never paste a key into a website, a public repo or a chat. If it leaks, delete it and make a new one."],
        ["Output costs more than input.", "Asking for shorter answers is the easiest way to spend less."]
      ],
      where: "A real order window has a cook who remembers regulars. The API forgets you the moment the plate leaves. Memory is always something your app adds."
    },
    quiz: [
      { q: "What does an API key do?", a: ["Proves the request is yours and bills your account", "Unlocks a smarter model"], ok: 0, why: "Right. It’s a badge and a tab. Keep it secret." },
      { q: "Recall from Lesson 1: what’s the context window?", a: ["The counter: everything the chef can see at once", "The order window"], ok: 0, why: "Right. The window takes orders; the counter is what the chef can see." }
    ],
    keep: "a real request and response you can read, and the habit of keeping keys secret.",
    cardLabel: "Copy my window card",
    card: "THE ORDER WINDOW\nAPI = the window apps use to send Claude tickets\nAPI key = staff badge that bills your tab (keep it secret)\nRequest = the ticket · Response = the plate\nMessages = the list of user and assistant turns\nThe API remembers nothing: resend the conversation\nStreaming = words arrive as they’re written\nCost = tokens in + tokens out (out costs more)",
    real: ["Building with the Claude API", "https://academy.claude.com/courses/building-with-the-claude-api"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
