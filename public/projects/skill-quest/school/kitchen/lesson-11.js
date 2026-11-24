/* Builder's Kitchen · Lesson 11 (bonus) · Everything is a wrapper. Terms: wrapper, model, thin wrapper.
   The big idea of AI Made EZ: AI is layers. Products are named by layer only; no claims about which model a product runs on. */
(function () {
  var L = {
    n: 11, id: "b11", mins: 6, title: "Everything is a wrapper.", stamp: "Layers",
    terms: ["Wrapper", "Model", "Thin wrapper"],
    teaser: ["LAYERS", "AI", "You → apps → models → chips → electricity.<br>Each layer wraps the one below.", "Three words. Six minutes."],
    lines: [
      ["AI is layers.", "Electricity runs chips. Chips run models. Models sit inside apps. You use the apps."],
      ["A wrapper is a layer on top of someone else’s layer.", "Most AI apps don’t make their own model. They wrap one, and add their own screens, steps and know-how."],
      ["Each layer charges for what it adds.", "That’s the business. Once you see the layers, nothing is magic, and nothing is a secret."]
    ],
    guess: { q: "An app builds whole websites for you from one sentence. What’s doing the writing underneath?", opts: [["An AI model, wrapped in the app’s own screens and steps", true], ["A secret technology nobody else has", false], ["A team of people typing very fast", false]], reveal: "Almost always a model underneath, wrapped by the app. The app’s value is what it adds on top." },
    startLabel: "Show me the layers",
    example: {
      title: "One request, all the way down.",
      html:
        '<div class="reply"><p class="who">you</p>“Make me a booking page for my dog-grooming shop.”</div>' +
        '<p class="label" style="margin-top:14px">Down the layers</p>' +
        '<ol class="fridge" style="display:grid;gap:8px;padding:0;list-style:none">' +
        '<li class="tag"><b>App:</b> asks you good questions, picks a page design, turns your answers into a careful order</li>' +
        '<li class="tag"><b>Model:</b> writes the page from that order (Claude, GPT, Gemini and others)</li>' +
        '<li class="tag"><b>Chips:</b> do the math the model needs, in a data center</li>' +
        '<li class="tag"><b>Electricity:</b> powers the chips</li></ol>' +
        '<p style="margin-top:14px">The app didn’t invent the writing. It added the questions, the design and the steps. That part is real work, and it’s what you pay for.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Look under any AI product.",
      lead: "Pick a kind of product. Your ticket asks Claude to show you its layers.",
      state: { kind: "An AI website builder" },
      controls: function (s, esc) {
        var kinds = ["An AI website builder", "An AI writing app", "An AI photo editor", "An AI note-taker for meetings", "A customer-service chatbot"];
        return '<p class="label">The product</p><div class="fridge">' + kinds.map(function (v) { return '<button type="button" class="chip" data-set="kind" data-v="' + esc(v) + '" aria-pressed="' + (s.kind === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>" +
          '<label class="label" style="display:block;margin-top:12px">Or name a real one<input type="text" data-in="name" placeholder="e.g. the app you’re thinking of paying for" style="display:block;margin-top:6px"></label>';
      },
      head: "ORDER #B11", right: "look under the hood", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        var what = (s.name && s.name.trim()) ? s.name.trim() : s.kind.toLowerCase();
        return "Explain the layers under " + what + " in plain words, for someone who doesn't code.\n" +
          "1. Which layer is it: an app that wraps an AI model, or a model itself? If you don't know for sure, say so.\n" +
          "2. What does it add on top of the model (its questions, design, data, workflow)?\n" +
          "3. What could I do with a general AI chat instead, and what would I lose?\n" +
          "Don't guess facts about the company. Only say what's public, and tell me where to check.";
      },
      claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "match", title: "Match each thing to its layer.", lead: "Tap a thing, then its layer.",
      pairs: [["An NVIDIA chip", "Chips"], ["Claude, GPT, Gemini", "Models"], ["An AI website builder", "Apps (a wrapper)"], ["The power plant", "Electricity"], ["The person asking", "You"]],
      right: "All five layers in place.",
      habitTitle: "Builder habit", habit: "Before you pay for an AI app, ask: what does it add on top of the model?"
    },
    breaks: {
      title: "Not every wrapper is the same.",
      lines: [
        ["A thin wrapper is easy to copy.", "A screen over one prompt can be rebuilt in an afternoon, or given away free by the model maker."],
        ["A good wrapper adds something real.", "Your data, a great design, a whole workflow, or answers checked by people. That’s worth paying for."]
      ],
      where: "A chip doesn’t literally wrap electricity. It turns electricity into math. The layers idea is a way to see what each part adds, not a diagram of the hardware."
    },
    quiz: [
      { term: "Wrapper", q: "What is a wrapper, in AI?", a: ["An app built on top of someone else’s AI model", "A model that wraps text in quotes", "A safety filter that hides answers"], ok: 0, why: "Right. Most AI apps wrap a model and add their own part." },
      { term: "Thin wrapper", q: "Which AI app is easiest to copy?", a: ["One screen over a single prompt", "One with years of your data and a full workflow", "One with answers checked by experts"], ok: 0, why: "Right. The less it adds, the easier it is to copy." },
      { term: "MCP", q: "From Lesson 5: what does MCP let Claude do?", a: ["Connect to your apps, like your calendar or files", "Run faster on your phone", "Learn new facts overnight"], ok: 0, why: "Right. A standard plug for your apps." },
      { term: "Model", q: "From Lesson 1: what is the model?", a: ["The chef: the trained AI that writes", "The app’s logo", "A database of answers"], ok: 0, why: "Right. The chef, in our kitchen." }
    ],
    say: "Most AI apps are wrappers: they sit on a model and add their own part. The question is always what they add.",
    keep: "The layers of AI, a habit for judging any AI app, and a ticket that looks under the hood of any product.",
    cardLabel: "Copy my card",
    card: "LAYERS\nYou → apps → models → chips → electricity\nWrapper = an app built on top of someone else’s model\nModel = the chef: the trained AI that writes (Claude, GPT, Gemini)\nThin wrapper = a screen over one prompt. Easy to copy\nGood wrapper = adds your data, design or workflow\nBefore you pay: what does it add on top of the model?"
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
