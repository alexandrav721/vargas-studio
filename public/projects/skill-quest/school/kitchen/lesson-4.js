/* Builder's Kitchen · Lesson 4 · Appliances (tool use). Terms: tool use, tool definition, tool result, web search, code execution, computer use. */
(function () {
  var L = {
    n: 4, id: "b4", mins: 6, title: "Appliances.", stamp: "Tools",
    seen: ["Computer use"], terms: ["Tool use", "Tool definition", "Tool call", "Tool result", "Web search", "Code execution"],
    teaser: ["APPLIANCES", "tool use", "The chef can’t count the walk-in.<br>But it can ask the app<br>to check the stock.", "Six words. Six minutes."],
    lines: [
      ["Tools are appliances.", "A model can only write text. Tools let it look things up, calculate or act."],
      ["The chef asks; the app runs it.", "Claude fills in a form."],
      ["Each appliance has a label.", "Claude reads the tool definition to choose."]
    ],
    guess: { q: "With no tools, what can Claude do?", opts: [["Read and write, and reason", true], ["Check today’s prices online", false], ["Send an email for you", false]], reveal: "On its own, Claude only reads and writes. Anything else needs a tool."},
    startLabel: "Watch it work",
    example: {
      title: "A guest asks: “Is the salmon special still on?”",
      html:
        '<p class="label">1. The label <span class="sample">Simplified</span></p><div class="ticket"><div class="th"><span>TOOL</span><span>definition</span></div>name: check_stock<br>does: how many portions are left<br>needs: dish<div class="tf">From your ordering app</div></div>' +
        '<p class="label" style="margin-top:14px">2. Claude asks (tool call)</p><div class="reply"><p class="who">assistant</p>use check_stock · dish: “salmon special”</div>' +
        '<p class="label" style="margin-top:14px">3. The app runs it (tool result)</p><div class="reply"><p class="who">the app (your ordering system)</p>4 portions left</div>' +
        '<p class="label" style="margin-top:14px">4. Claude answers</p><div class="reply"><p class="who">assistant</p>Yes, 4 left tonight. Want one?</div>' +
        '<p class="small">Anthropic runs <b>web search</b> (fresh news), web fetch (one page) and <b>code execution</b> (exact math). <b>Computer use</b>: Claude reads screenshots and asks the app to click and type.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Design an appliance.",
      lead: "Pick an app and a tool it needs. Your ticket asks Claude to write the label and walk the 4 steps.",
      state: { app: "a restaurant ordering app", tool: "check what’s in stock" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">Your app</p>' + row("app", ["a restaurant ordering app", "a shop helper", "a social media planner", "a homework helper"]) +
          '<p class="label">The tool it needs</p>' + row("tool", ["check what’s in stock", "look up an order", "check last week’s post stats", "do the math exactly"]);
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
      type: "pick", title: "Claude says “use check_stock for the salmon.” Who actually checks the stock?",
      options: [
        ["The app runs the tool and sends back the result", true],
        ["Claude goes online by itself", false, "Not here. check_stock is the app’s own tool, so the app runs it. Claude only asks."],
        ["Claude remembers last night’s count", false, "It doesn’t know tonight’s stock. That’s why it needs the tool."]
      ],
      right: "Yes. Claude picks the appliance and the settings. The app, like a waiter, presses the button and brings back the result.",
      wrong: "Who owns the appliance?", hint: "Claude can only write text. Something else has to act.",
      habitTitle: "Builder habit", habit: "Good tool labels matter more than clever prompts. A clear name and description is how Claude knows when to use it."
    },
    breaks: {
      title: "Appliances can burn the kitchen.",
      lines: [
        ["A tool can do real things.", "Email, delete, spend. Ask a person before anything that can’t be undone."],
        ["Claude can pick the wrong appliance.", "Or the wrong setting. Check tool calls before they act."]
      ],
      where: "A cook knows every station by sight. Claude knows a tool only by its label. Vague label, confused chef."
    },
    quiz: [
      { term: "Tool result", q: "What is a tool result?", a: ["What the app sends back after running the tool", "Claude’s final answer, shown to the person who asked", "The label that tells Claude what the tool can do"], ok: 0, why: "Right. Result goes back to Claude, then Claude plates the answer." },
      { term: "System prompt", q: "Recall from Lesson 3: where should a rule that must never break live?", a: ["Built into the app", "In the system prompt only", "In the user’s first message"], ok: 0, why: "Right. Prompts steer; the app enforces." },
      {q: "From Lesson 1: what’s an LLM?", a: ["AI that writes by predicting the next piece of text", "A huge database of facts that Claude looks things up in", "A special API key that unlocks writing features"], ok: 0, why: "Right. It predicts the next piece, very well.", term: "LLM"}
    ],
    say: "With tool use, Claude asks for an action and the app actually runs it.",
    keep: "Questions about AI that takes actions, and a ticket that drafts a tool label.",
    cardLabel: "Copy my card",
    card: "APPLIANCES (TOOL USE)\nTool = an appliance Claude can ask for\nTool definition = the label: name, what it does, inputs\nTool call = Claude asks to use it\nTool result = what the app sends back\nThe app runs your tools; Claude only asks\nRun by Anthropic: web search · code execution\nComputer use: the app supplies the computer",
    real: ["Tool use with the Messages API", "https://academy.claude.com/courses/tool-use-with-the-messages-api"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
