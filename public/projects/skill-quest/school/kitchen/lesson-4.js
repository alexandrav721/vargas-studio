/* Builder's Kitchen · Lesson 4 · Appliances (tool use). Terms: tool use, tool definition, tool result, web search, code execution, computer use. */
(function () {
  var L = {
    n: 4, id: "b4", mins: 6, title: "Appliances.", stamp: "Tools",
    seen: ["Computer use"], terms: ["Tool use", "Tool definition", "Tool call", "Tool result", "Web search", "Code execution"],
    teaser: ["APPLIANCES", "tool use", "The chef can’t check the weather.<br>But it can ask the kitchen<br>to switch on the weather appliance.", "Six words. Eight minutes."],
    lines: [
      ["Tools are appliances.", "A model can only write text. Tools let it look things up, calculate or act."],
      ["The chef asks; the app runs it.", "Claude fills in a form: tool get_weather, city Paris. The app runs it and hands back the result."],
      ["Each appliance has a label.", "A tool definition: its name, what it does, what it needs. Claude reads the label to choose."]
    ],
    guess: { q: "Can Claude check today’s weather by itself?", opts: [["Only if an app gives it a weather tool", true], ["Yes, Claude is always connected to live weather", false], ["Never, AI can’t use live information at all", false]], reveal: "It needs a tool. Claude asks; the app runs the tool and hands back the result." },
    startLabel: "Watch it work",
    example: {
      title: "“Should I bring an umbrella in Paris?”",
      html:
        '<p class="label">1. The label on the appliance <span class="sample">Simplified</span></p><div class="ticket"><div class="th"><span>TOOL</span><span>definition</span></div>name: get_weather<br>does: today’s forecast for a city<br>needs: city<div class="tf">Your app hands Claude this label</div></div>' +
        '<p class="label" style="margin-top:14px">2. Claude asks (tool call)</p><div class="reply"><p class="who">assistant</p>use get_weather · city: “Paris”</div>' +
        '<p class="label" style="margin-top:14px">3. The app runs it (tool result)</p><div class="reply"><p class="who">the app</p>Rain, 14°C, 80% chance</div>' +
        '<p class="label" style="margin-top:14px">4. Claude plates the answer</p><div class="reply"><p class="who">assistant</p>Yes, bring one. 80% chance of rain.</div>' +
        '<p class="small">Anthropic runs a few appliances itself: <b>web search</b> (finds fresh news online), web fetch (reads one web page) and <b>code execution</b> (runs code to do exact math). With <b>computer use</b>, Claude looks at screenshots and asks the app to click and type.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Design an appliance.",
      lead: "Pick an app and a tool it needs. Your ticket asks Claude to write the label and walk the 4 steps.",
      state: { app: "a meal planner", tool: "check what’s in my pantry" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">Your app</p>' + row("app", ["a meal planner", "a shop helper", "a social media planner", "a homework helper"]) +
          '<p class="label">The tool it needs</p>' + row("tool", ["check what’s in my pantry", "look up an order", "check last week’s post stats", "do the math exactly"]);
      },
      head: "ORDER #B04", right: "new appliance", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "For " + s.app + ", write the tool definition for \"" + s.tool + "\" that I could hand to a developer.\n" +
          "1. Name, what it does, what inputs it needs: in plain words, then as JSON (the format apps read).\n" +
          "2. Walk through one example: user question → tool call → tool result → final answer.\n" +
          "3. Say who actually runs the tool (Claude or my code) and one way it could go wrong.";
      },
      vendor: ["AI that can take actions with tools", "which actions it can take, what needs my approval first, and what happens when it picks the wrong action"], claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "pick", title: "Claude says “use get_weather for Paris.” Who actually checks the weather?",
      options: [
        ["The app runs the tool and sends back the result", true],
        ["Claude goes online by itself", false, "Not here. get_weather is the app’s own tool, so the app runs it. Claude only asks."],
        ["Claude remembers yesterday’s forecast", false, "It doesn’t know today’s weather. That’s why it needs the tool."]
      ],
      right: "Yes. Claude picks the appliance and the settings. The app, like a waiter, presses the button and brings back the result.",
      wrong: "Who owns the appliance?", hint: "Claude can only write text. Something else has to act.",
      habitTitle: "Builder habit", habit: "Good tool labels matter more than clever prompts. A clear name and description is how Claude knows when to use it."
    },
    breaks: {
      title: "Appliances can burn the kitchen.",
      lines: [
        ["A tool can do real things.", "Send an email, delete a file, spend money. Ask a person before anything that can’t be undone."],
        ["Claude can pick the wrong appliance.", "Or fill in the wrong setting. Check tool calls before they act."],
        ["Only some appliances run at Anthropic.", "Web search and code execution run there. Your own tools, and computer use, run in the app."]
      ],
      where: "A real chef knows a toaster by sight. Claude only knows your tool from its label, so a vague label means a confused chef."
    },
    quiz: [
      { term: "Tool result", q: "What is a tool result?", a: ["What the app sends back after running the tool", "Claude’s final answer, shown to the person who asked", "The label that tells Claude what the tool can do"], ok: 0, why: "Right. Result goes back to Claude, then Claude plates the answer." },
      { term: "System prompt", q: "Recall from Lesson 3: where should a rule that must never break live?", a: ["Built into the app", "In the system prompt only", "In the user’s first message"], ok: 0, why: "Right. Prompts steer; the app enforces." },
      {q: "From Lesson 1: what’s an LLM?", a: ["AI that writes by predicting the next piece of text", "A huge database of facts that Claude looks things up in", "A special API key that unlocks writing features"], ok: 0, why: "Right. It predicts the next piece, very well.", term: "LLM"}
    ],
    keep: "5 questions about AI that takes actions, and a ticket that drafts a tool label.",
    cardLabel: "Copy my card",
    card: "APPLIANCES (TOOL USE)\nTool = an appliance Claude can ask for\nTool definition = the label: name, what it does, inputs\nTool call = Claude asks to use it\nTool result = what the app sends back\nThe app runs your tools; Claude only asks\nRun by Anthropic: web search · code execution\nComputer use: the app supplies the computer",
    real: ["Tool use with the Messages API", "https://academy.claude.com/courses/tool-use-with-the-messages-api"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
