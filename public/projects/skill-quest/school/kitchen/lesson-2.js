/* Builder's Kitchen · Lesson 2 · The order window (API). Terms: API, API key, request, response, messages, SDK, streaming, cost per token. */
(function () {
  var L = {
    n: 2, id: "b2", mins: 6, title: "The order window.", stamp: "API",
    terms: ["API", "API key", "Request", "Response", "Messages", "Streaming", "Cost per token"],
    teaser: ["ORDER WINDOW", "the API", "The app is a waiter.<br>It passes a ticket through the window<br>and carries the plate back.", "Seven words. Six minutes."],
    lines: [
      ["The API is the order window.", "An app works like a waiter: it passes Claude a written ticket and carries the plate back."],
      ["The API key is your account card.", "Proves it’s your ticket and bills you. Keep it secret."],
      ["The window remembers nothing.", "Each ticket carries the whole chat."]
    ],
    guess: { q: "How does a shopping app get Claude’s answers?", opts: [["It sends a request to the API", true], ["It copies them from claude.ai", false], ["Claude is installed inside it", false]], reveal: "Apps send a request through the API, a window for other software, and get a reply back." },
    startLabel: "Watch a ticket",
    example: {
      title: "One ticket, one plate.",
      html:
        '<p class="label">The request (what your app sends) <span class="sample">Simplified</span></p>' +
        '<div class="ticket"><div class="th"><span>REQUEST</span><span>to the API</span></div>model: Sonnet<br>messages:<br>&nbsp;&nbsp;user: “Name 3 soups for a cold night.”<div class="tf">Plus your API key</div></div>' +
        '<p class="label" style="margin-top:14px">The response (what comes back)</p>' +
        '<div class="reply"><p class="who">assistant</p>Minestrone, French onion, chicken noodle.<br><span class="small">Used: 18 tokens in · 9 out</span></div>' +
        '<p class="small"><b>Messages</b>: “user” turns are yours, “assistant” turns are Claude’s.</p>' +
        '<p style="margin-top:14px"><b>Streaming</b>: words appear as written. <b>Cost per token</b>: you pay for tokens in and out. Out costs more.</p>',
      more: '<p class="small">Real requests also name the exact model (like claude-sonnet-5-5) and a reply length limit.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Fill in an order ticket.",
      lead: "Pick an app and a job. Your ticket gets the real request, with notes.",
      state: { app: "a marketing tool", ask: "write ad ideas", chef: "Sonnet" },
      controls: function (s, esc) {
        var apps = ["a marketing tool", "a shop’s help page", "a study app", "a travel app"];
        var asks = ["write ad ideas", "answer a question", "summarize a page", "write a reply"];
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">Your app</p>' + row("app", apps) + '<p class="label">It asks Claude to</p>' + row("ask", asks) + '<p class="label">Chef</p>' + row("chef", ["Haiku", "Sonnet", "Opus"]);
      },
      head: "ORDER #B02", right: "to: the API", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "I don't code. In plain words first, explain what " + s.app + " sends to Claude to " + s.ask + ", using " + s.chef + ". Then show the actual request with YOUR_KEY_HERE as the key.\n" +
          "1. Add a plain-words note next to each part (model, messages, reply length).\n" +
          "2. Show the response that comes back, and point out the token counts.\n" +
          "3. Explain why the app must resend earlier messages for a follow-up.\nNo real API key, use a placeholder.";
      },
      vendor: ["the Claude API", "whose API key and account it runs on, what it costs per use, and whether our chats are stored"], claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "pick", title: "The window got a follow-up: “Make it vegetarian.” Claude answers “Make what vegetarian?” Why?",
      options: [
        ["The app sent only the new message, not the earlier ones", true],
        ["The API key ran out of credit halfway through the chat", false, "A bad key gets an error, not a confused answer."],
        ["Claude needs full sentences to understand follow-ups", false, "Short is fine. It just can’t see what came before."]
      ],
      right: "Exactly. The window remembers nothing. Send the whole list of messages every time.",
      wrong: "Think about what was on the ticket.", hint: "The API doesn’t remember earlier tickets.",
      habitTitle: "Builder habit", habit: "Every request carries the full conversation. That’s also why long chats cost more: the history is sent again each turn (apps can mark that repeated opening for prompt caching, so rereads cost far less)."
    },
    breaks: {
      title: "A card that pays the bill.",
      lines: [
        ["Your API key is not your Claude subscription.", "API use is billed per token to the key’s account."],
        ["Anyone holding the card can bill you.", "Never paste it into a site, doc or chat. Leaked? Delete it and make a new one."],
        ["Output costs more than input.", "Ask for shorter answers."]
      ],
      where: "A real cook remembers regulars. A basic API call forgets you, so the app resends the chat."
    },
    quiz: [
      { term: "API key", q: "What does an API key do?", a: ["Proves the request is yours and bills your account", "Gives your app a faster, more private version of Claude", "Saves every chat so Claude remembers you next time"], ok: 0, why: "Right. It’s your account card. Keep it secret." },
      { term: "Context window", q: "Recall from Lesson 1: what’s the context window?", a: ["The counter: everything the chef can see at once", "The window where you type your message in the app", "The list of Claude models your account is allowed to use"], ok: 0, why: "Right. The window takes orders; the counter is what the chef can see." },
      {term: "API key", q: "A vendor asks you to email them your API key. What do you do?", a: ["Say no. Keys are secret, like a password", "Send it, it’s only a code", "Post it in the team chat instead"], ok: 0, why: "Right. Anyone with the key can order on your tab."}
    ],
    say: "Apps talk to Claude through the API. Each request carries the whole chat, because the API remembers nothing.",
    keep: "Questions about how a product reaches Claude, and the habit of keeping keys secret.",
    cardLabel: "Copy my card",
    card: "THE ORDER WINDOW\nAPI = the window apps use to send Claude tickets\nAPI key = your account card: bills your tab (keep it secret)\nThe app = the waiter carrying tickets and plates\nRequest = the ticket · Response = the plate\nMessages = the list of user and assistant turns\nThe API remembers nothing: resend the conversation\nStreaming = words arrive as they’re written\nCost = tokens in + tokens out (out costs more)",
    real: ["Claude Platform 101", "https://academy.claude.com/courses/claude-platform-101"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
