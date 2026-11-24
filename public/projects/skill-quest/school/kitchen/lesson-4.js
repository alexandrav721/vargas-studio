/* Builder's Kitchen · Lesson 4 · Appliances (tool use). Terms: tool use, tool definition, tool result, web search, code execution, computer use. */
(function () {
  var L = {
    n: 4, id: "b4", mins: 8, title: "Appliances.", stamp: "Tools",
    terms: ["Tool use", "Tool definition", "Tool call", "Tool result", "Web search", "Code execution"],
    teaser: ["APPLIANCES", "tool use", "The chef can’t check the weather.<br>But it can ask the kitchen<br>to switch on the weather appliance.", "Six words. Eight minutes."],
    lines: [
      ["Tools are appliances.", "A model can only write text. Tools let it look things up, calculate or act."],
      ["The chef asks; your kitchen runs it.", "Claude writes “use the weather tool for Paris.” Your code runs it and hands back the result."],
      ["Each appliance has a label.", "A tool definition: its name, what it does, what it needs. Claude reads the label to choose."]
    ],
    startLabel: "Watch an appliance switch on",
    example: {
      title: "“Should I bring an umbrella in Paris?”",
      html:
        '<p class="label">1. The label on the appliance <span class="sample">Simplified</span></p><div class="ticket"><div class="th"><span>TOOL</span><span>definition</span></div>name: get_weather<br>does: today’s forecast for a city<br>needs: city<div class="tf">Your app hands Claude this label</div></div>' +
        '<p class="label" style="margin-top:14px">2. Claude asks (tool call)</p><div class="reply"><p class="who">assistant</p>use get_weather · city: “Paris”</div>' +
        '<p class="label" style="margin-top:14px">3. Your kitchen runs it (tool result)</p><div class="reply"><p class="who">your code</p>Rain, 14°C, 80% chance</div>' +
        '<p class="label" style="margin-top:14px">4. Claude plates the answer</p><div class="reply"><p class="who">assistant</p>Yes, bring one. 80% chance of rain.</div>' +
        '<p class="small">Some appliances come built in: <b>web search</b>, <b>code execution</b> (it runs code to calculate), and <b>computer use</b> (it clicks a screen).</p>',
      next: "Design an appliance"
    },
    build: {
      title: "Your turn. Design an appliance.",
      lead: "Pick an app and a tool it needs. Your ticket asks Claude to write the label and walk the 4 steps.",
      state: { app: "a meal planner", tool: "check what’s in my pantry" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">Your app</p>' + row("app", ["a meal planner", "a shop helper", "a trip planner", "a homework helper"]) +
          '<p class="label">The tool it needs</p>' + row("tool", ["check what’s in my pantry", "look up an order", "check opening hours", "do the math exactly"]);
      },
      head: "ORDER #B04", right: "new appliance", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "I'm learning Claude tool use. For " + s.app + ", design a tool to \"" + s.tool + "\".\n" +
          "1. Write its definition (name, what it does, what inputs it needs) in plain words, then as a simple JSON schema.\n" +
          "2. Walk through one example: user question → tool call → tool result → final answer.\n" +
          "3. Say who actually runs the tool (Claude or my code) and one way it could go wrong.";
      },
      claude: "Open Claude with my ticket", done: "I designed a tool →"
    },
    game: {
      type: "pick", title: "Claude says “use get_weather for Paris.” Who actually checks the weather?",
      options: [
        ["Your app’s code runs the tool and sends back the result", true],
        ["Claude goes online by itself", false, "Not for your own tools. Claude only asks; your kitchen does it."],
        ["Anthropic phones a weather station", false, "No. The tool belongs to your app."]
      ],
      right: "Yes. Claude picks the appliance and the settings. Your kitchen presses the button.",
      wrong: "Who owns the appliance?", hint: "Claude can only write text. Something else has to act.",
      habitTitle: "Builder habit", habit: "Good tool labels matter more than clever prompts. A clear name and description is how Claude knows when to use it."
    },
    breaks: {
      title: "Appliances can burn the kitchen.",
      lines: [
        ["A tool can do real things.", "Send an email, delete a file, spend money. Ask a person before anything that can’t be undone."],
        ["Claude can pick the wrong appliance.", "Or fill in the wrong setting. Check tool calls before they act."],
        ["Built-in tools run on Anthropic’s side.", "Web search and code execution run there; your own tools run in your code."]
      ],
      where: "A real chef knows a toaster by sight. Claude only knows your tool from its label, so a vague label means a confused chef."
    },
    quiz: [
      { q: "What is a tool result?", a: ["What your code sends back after running the tool", "Claude’s final answer"], ok: 0, why: "Right. Result goes back to Claude, then Claude plates the answer." },
      { q: "Recall from Lesson 3: where should a rule that must never break live?", a: ["In code", "In the system prompt only"], ok: 0, why: "Right. Prompts steer; code enforces." }
    ],
    keep: "a tool you designed, with its label and the 4 steps.",
    cardLabel: "Copy my appliance card",
    card: "APPLIANCES (TOOL USE)\nTool = an appliance Claude can ask for\nTool definition = the label: name, what it does, inputs\nTool call = Claude asks to use it\nTool result = what your code sends back\nYour code runs your tools; Claude only asks\nBuilt in: web search · code execution · computer use",
    real: ["Claude Platform 101", "https://anthropic.skilljar.com/claude-platform-101"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
