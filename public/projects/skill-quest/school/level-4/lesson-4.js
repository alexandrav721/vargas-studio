/* AI Made EZ · Level 4 · Lesson 4 · Wire the appliances (the tool loop). Terms: tool_use block, tool_result block, tool_choice, Parallel tool calls, Server tool, Tool Runner. */
(function () {
  var L = {
    n: 4, id: "d4", mins: 7, title: "Wire the appliances.", stamp: "Wiring",
    seen: ["Tool use", "Tool definition", "Tool call", "Tool result", "Web search"],
    terms: ["tool_use block", "tool_result block", "tool_choice", "Parallel tool calls", "Server tool", "Tool Runner"],
    teaser: ["WIRE IT UP", "the tool loop", "Level 2 named the appliances.<br>Now you wire them in:<br>Claude asks, your code runs, repeat.", "Six words. Seven minutes."],
    lines: [
      ["The loop: ask, run, return, repeat.", "Keep going until stop_reason says end_turn."],
      ["stop_reason “tool_use” means your move.", "Run each tool_use block. Send back a tool_result with its id."],
      ["Some appliances Anthropic runs for you.", "Server tools, like web search, need no code from you."]
    ],
    guess: { q: "Claude replies with stop_reason: \"tool_use\". What does your code do?", opts: [["Run the tool and send the result back", true], ["Show that reply to the user", false], ["Start a fresh conversation", false]], reveal: "Run it and send back a tool_result. Claude is waiting on your kitchen." },
    startLabel: "Watch the loop",
    example: {
      title: "One question, two appliances at once.",
      html:
        '<p class="label">1. Your tools array <span class="sample">Simplified</span></p><div class="ticket"><div class="th"><span>TOOLS</span><span>in the request</span></div>check_stock · get_price<div class="tf">Each has a name, a description and an input_schema</div></div>' +
        '<p class="label" style="margin-top:14px">2. Claude asks for both (parallel tool calls)</p><div class="reply"><p class="who">assistant</p>tool_use · check_stock {dish: “salmon”} · id toolu_01<br>tool_use · get_price {dish: “salmon”} · id toolu_02<br><span class="small">stop_reason: tool_use</span></div>' +
        '<p class="label" style="margin-top:14px">3. Your code answers both, in one user message</p><div class="reply"><p class="who">your code</p>tool_result for toolu_01: 4 left<br>tool_result for toolu_02: $24</div>' +
        '<p class="label" style="margin-top:14px">4. Claude plates it</p><div class="reply"><p class="who">assistant</p>4 left tonight, $24. Want one?</div>' +
        '<p class="small">Web search is a <b>server tool</b>: Anthropic runs it. $10 per 1,000 searches, plus tokens.</p>',
      more: '<p class="small"><b>tool_choice</b> is auto by default; none turns tools off. Forcing a tool (any or tool) returns an error on Opus 5.5, Sonnet 5.5 and Fable 5.2, so name the tool in your prompt instead. The SDK’s <b>Tool Runner</b> (beta) runs this loop for you.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Wire one appliance.",
      lead: "Pick an app and its tool. Your ticket explains the loop, or writes it.",
      state: { mode: "Explain it to me", lang: "Python", app: "a café ordering bot", tool: "check what’s in stock", web: "no web search" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">How you want help</p>' + row("mode", ["Explain it to me", "Write the code"]) +
          '<p class="label">Language (for code)</p>' + row("lang", ["Python", "TypeScript"]) +
          '<p class="label">Your app</p>' + row("app", ["a café ordering bot", "a shop helper", "a booking assistant", "a homework helper"]) +
          '<p class="label">The tool it needs</p>' + row("tool", ["check what’s in stock", "look up an order", "check open time slots", "do the math exactly"]) +
          '<p class="label">Server tool</p>' + row("web", ["no web search", "add web search"]);
      },
      head: "ORDER #D04", right: "tool loop", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        var web = s.web === "add web search";
        if (s.mode === "Explain it to me") {
          return "I'm planning " + s.app + " that uses the Claude API with one tool: \"" + s.tool + "\"" + (web ? ", plus Anthropic's web search tool" : "") + ". I don't code yet.\n" +
            "1. Write the tool definition (name, a description that says when to use it, input_schema) and explain each part.\n" +
            "2. Walk one example through the loop: request, tool_use block, my code runs it, tool_result, final answer. Show where stop_reason changes.\n" +
            "3. Explain parallel tool calls, tool_choice (auto and none), and which tools Anthropic runs versus which my code runs.\n" +
            "4. Name one action this tool should never take without a person saying yes.";
        }
        return "Write a small " + s.lang + " program with the official Claude SDK for " + s.app + " with one tool: \"" + s.tool + "\" (fake the data with a small lookup table)" + (web ? ", plus Anthropic's web search server tool" : "") + ".\n" +
          "- Model claude-opus-5-5. Key from ANTHROPIC_API_KEY.\n" +
          "- Write the manual loop: while stop_reason is \"tool_use\", run every tool_use block and send all the tool_result blocks back in one user message, each with its tool_use_id.\n" +
          "- Return tool failures as a tool_result with is_error: true. Cap the loop at 10 turns.\n" +
          "- Leave tool_choice on auto (forcing a tool errors on this model).\n" +
          (web ? "- Handle stop_reason \"pause_turn\" by sending the assistant turn back unchanged.\n" : "") +
          "- Then show the same program with the SDK's Tool Runner (beta) in a few lines.\n" +
          "Then tell me what to do with it: how to run it, a test question to try, and where I'd plug in my real system.";
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
      { term: "tool_result block", q: "Claude asked for two tools in one reply. How do you answer?", a: ["Both tool_result blocks in one user message", "One message per result, sent one at a time", "Only the first result; Claude asks again"], ok: 0, why: "Right. Each result carries its tool_use_id." },
      { term: "Server tool", q: "Who runs a server tool like web search?", a: ["Anthropic, on its own servers", "Your code, on your server", "The user’s browser"], ok: 0, why: "Right. You add it to tools; Anthropic does the rest." },
      { term: "Strict tool use", q: "Recall from Lesson 3: how do you make tool inputs match your schema?", a: ["Set strict: true on the tool", "Write a longer tool description", "Set tool_choice to any"], ok: 0, why: "Right. And forcing tool_choice errors on Opus 5.5 anyway." }
    ],
    say: "Our code runs the tool loop: Claude sends tool_use, we run it and send back tool_result, until end_turn.",
    keep: "A ticket that explains or writes a working tool loop.",
    cardLabel: "Copy my card",
    card: "WIRE THE APPLIANCES\ntools = name · description · input_schema\nstop_reason tool_use = your code’s turn\ntool_use block = Claude’s order, with an id\ntool_result block = your answer, same id\nParallel calls = answer all, in one message\ntool_choice = auto (default) or none\nServer tools (web search) run at Anthropic\nTool Runner = the SDK runs the loop for you",
    real: ["Tool use with the Messages API", "https://academy.claude.com/courses/tool-use-with-the-messages-api"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
