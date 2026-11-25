/* AI Made EZ · Level 4 · Lesson 4 · Wire the appliances (the tool loop). Terms: tool_use block, tool_result block, tool_choice, Parallel tool calls, Server tool, Tool Runner. */
(function () {
  var L = {
    n: 4, id: "d4", mins: 7, title: "Wire the appliances.", stamp: "Wiring",
    seen: ["Tool use", "Tool definition", "Tool call", "Tool result", "Web search"],
    terms: ["tool_use block", "tool_result block", "tool_choice", "Parallel tool calls", "Server tool", "Tool Runner"],
    teaser: ["WIRE IT UP", "the tool loop", "Level 2 named the appliances.<br>Now you wire them in:<br>Claude asks, your code runs, repeat.", "Six words. Seven minutes."],
    lines: [
      ["The loop: ask, run, return, repeat.", "Keep going while stop_reason says tool_use. end_turn means done."],
      ["stop_reason “tool_use” means your code’s move.", "Claude writes an order. Your code runs it and sends back the result."],
      ["Some appliances Anthropic runs for you.", "Server tools, like web search, need no code from you."]
    ],
    guess: { q: "Claude replies with stop_reason: \"tool_use\". What does your code do?", opts: [["Run the tool and send the result back", true], ["Show that reply to the user", false], ["Start a fresh conversation", false]], reveal: "Run it and send back a tool_result. Claude is waiting on your kitchen." },
    startLabel: "Watch the loop",
    example: {
      title: "One question, two appliances at once.",
      html:
        '<p class="label">1. The tools you offer</p><div class="ticket"><div class="th"><span>TOOLS</span><span>request</span></div>check_stock · get_price<div class="tf">Each has a name, a use and inputs</div></div>' +
        '<p class="label" style="margin-top:14px">2. Claude orders both at once</p><div class="reply"><p class="who">assistant</p>Order 1: stock of salmon<br>Order 2: price of salmon<br><span class="small">stop_reason: tool_use (your code’s turn)</span></div>' +
        '<p class="label" style="margin-top:14px">3. Your code answers both at once</p><div class="reply"><p class="who">your code</p>Order 1: 4 left<br>Order 2: $24<br><span class="small">Then Claude replies: “4 left, $24.”</span></div>' +
        '<p class="small">Claude’s orders are <b>tool_use blocks</b>. Your answers are <b>tool_result blocks</b>. Two orders in one reply are <b>parallel tool calls</b>. <b>Server tools</b>, like web search, run at Anthropic.</p>',
      more: '<p class="small">Your code first adds Claude’s whole reply to the chat unchanged (thinking blocks included), then one user message with every <code>tool_result</code>, each carrying its tool_use_id. <b>tool_choice</b> is auto by default; forcing a tool returns an error on Opus 5.5, Sonnet 5.5 and Fable 5.2, so name it in your prompt instead. The SDK’s <b>Tool Runner</b> (beta) runs the loop for you.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Wire one appliance.",
      lead: "Pick an app and its tool. Claude walks you through the loop, or writes it.",
      state: { mode: "Explain it to me", lang: "Python", app: "a café ordering bot", tool: "check what’s in stock", web: "no web search" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">How you want help</p>' + row("mode", ["Explain it to me", "Write the code (for a developer)"]) +
          '<p class="label">Language (for code)</p>' + row("lang", ["Python", "TypeScript"]) +
          '<p class="label">Your app</p>' + row("app", ["a café ordering bot", "a shop helper", "a booking assistant", "a homework helper"]) +
          '<p class="label">The tool it needs</p>' + row("tool", ["check what’s in stock", "look up an order", "check open time slots", "do the math exactly"]) +
          '<p class="label">Server tool</p>' + row("web", ["no web search", "add web search"]);
      },
      head: "ORDER #D04", right: "tool loop", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        var web = s.web === "add web search";
        if (s.mode === "Explain it to me") {
          return "I’m planning " + s.app + " on the Claude API with one tool: “" + s.tool + "”" + (web ? ", plus Anthropic’s web search tool" : "") + ". I don’t code yet.\n" +
            "1. Write the tool definition and explain each part.\n" +
            "2. Walk one example through the loop, showing where stop_reason changes.\n" +
            "3. Parallel tool calls, and which tools Anthropic runs versus my code.\n" +
            "End with a tool spec to hand a developer: name, when to use it, inputs, output, 3 test questions.";
        }
        return "Write a small " + s.lang + " program with the official Claude SDK for " + s.app + " with one tool: “" + s.tool + "” (fake data in a lookup table)" + (web ? ", plus Anthropic’s web search server tool (web_search_20260209)" : "") + ".\n" +
          "- Model claude-opus-5-5. Key from ANTHROPIC_API_KEY.\n" +
          "- A manual loop: while stop_reason is \"tool_use\", append Claude’s reply unchanged, run every tool_use block, send all tool_result blocks back in one user message.\n" +
          "- Tool failures go back with is_error: true. Cap it at 10 turns. Leave tool_choice on auto.\n" +
          (web ? "- On stop_reason \"pause_turn\", send the assistant turn back unchanged.\n" : "") +
          "- Then a Tool Runner (beta) version.\n" +
          "Then: how to run it, one test question, where my real system plugs in.";
      },
      claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "match", title: "Match the wiring.", lead: "Tap a word, then what it does.",
      pairs: [["tool_use block", "Claude’s order for an appliance, with an id"], ["tool_result block", "What your code sends back, with the same id"], ["stop_reason: tool_use", "Claude is waiting on your kitchen"], ["Server tool", "An appliance Anthropic runs, like web search"], ["Parallel tool calls", "Several appliance orders in one reply"]],
      right: "All five. That’s the whole loop.",
      habitTitle: "Builder habit", habit: "Answer every tool_use id, all in one message. A missing result stalls the order."
    },
    breaks: {
      title: "The wiring can short.",
      lines: [
        ["A loop can run forever.", "Cap the number of turns in your code."],
        ["Tool results come from outside.", "A web page can carry a fake order. Check before acting."]
      ],
      where: "A wired oven can only bake. Your tool runs whatever code sits behind it, so the safety lives in that code."
    },
    quiz: [
      { term: "tool_result block", q: "Who runs your “check stock” tool?", a: ["Your code, on your server", "Anthropic, on its servers", "The customer’s browser"], ok: 0, why: "Right. Claude only asks. Your code runs it and sends back the result." },
      { term: "Server tool", q: "Who runs a server tool like web search?", a: ["Anthropic, on its own servers", "Your code, on your server", "The user’s browser"], ok: 0, why: "Right. You add it to tools; Anthropic does the rest." },
      { term: "Strict tool use", q: "Recall from Lesson 3: how do you make tool inputs match your schema?", a: ["Set strict: true on the tool", "Write a longer tool description", "Set tool_choice to any"], ok: 0, why: "Right. Then every input Claude sends matches the schema." }
    ],
    say: "Our code runs the loop: Claude orders a tool, we run it and send the result.",
    keep: "A working tool loop, walked through in plain words or written.",
    cardLabel: "Copy my card",
    card: "WIRE THE APPLIANCES\ntools = name · description · input_schema\nstop_reason tool_use = your code’s turn\ntool_use block = Claude’s order, with an id\ntool_result block = your answer, same id\nParallel calls = answer all, in one message\nServer tools (web search) run at Anthropic\nTool Runner = the SDK runs the loop for you",
    real: ["Tool use with the Messages API", "https://academy.claude.com/courses/tool-use-with-the-messages-api"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
