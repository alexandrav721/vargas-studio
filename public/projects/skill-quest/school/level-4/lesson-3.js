/* AI Made EZ · Level 4 · Lesson 3 · Same plate every time (structured outputs). Terms: JSON Schema, output_config, Strict tool use, Validation, Refusal. */
(function () {
  var L = {
    n: 3, id: "d3", mins: 6, title: "Same plate every time.", stamp: "Plate",
    seen: ["JSON", "Stop reason"],
    terms: ["JSON Schema", "output_config", "Strict tool use", "Validation", "Refusal"],
    teaser: ["SAME PLATE", "every time", "Lesson 1’s reply was chat.<br>Your app can’t read “Here you go!”<br>It needs the same plate on every order.", "Five words. Six minutes."],
    lines: [
      ["Code needs the same shape every time.", "A schema is the plate diagram: which fields, which types."],
      ["One setting locks the shape.", "output_config.format: the reply comes back as JSON matching your schema."],
      ["Still check the plate.", "Validate in code. A refusal (Claude declines) or a cut-off breaks it."]
    ],
    guess: { q: "Your app saves Claude’s reply into a spreadsheet. Safest way to get clean columns?", opts: [["Give a schema with structured outputs", true], ["Ask nicely: “reply only in JSON”", false], ["Use a bigger model", false]], reveal: "A schema. Structured outputs make the reply match it. Asking nicely works most of the time, and “most” breaks spreadsheets." },
    startLabel: "See the plate",
    example: {
      title: "A receipt, plated the same way every time.",
      html:
        '<p class="label">The schema: your plate diagram <span class="sample">Simplified</span></p><div class="ticket"><div class="th"><span>SCHEMA</span><span>json_schema</span></div>store: text<br>total: number<br>items: list of text<div class="tf">Which fields, and what kind of value each holds</div></div>' +
        '<p class="label" style="margin-top:14px">Where it goes in the request</p><div class="reply"><p class="who">your request</p>output_config: { format: { type: "json_schema", schema: … } }</div>' +
        '<p class="label" style="margin-top:14px">What comes back <span class="sample">Sample</span></p><div class="reply"><p class="who">assistant</p>{"store": "Green Grocer", "total": 23.40, "items": ["kale", "eggs"]}</div>' +
        '<p class="small">Tools or structured outputs? To shape the <b>final answer</b>, use structured outputs. When Claude must <b>call an action</b>, use a tool with <b>strict: true</b> so its inputs match too.</p>',
      more: '<p class="small">Every object in the schema needs additionalProperties: false (no extra fields allowed). Python’s client.messages.parse() checks the reply against a Pydantic model for you; TypeScript has a Zod helper. The API doesn’t enforce limits like minimum or minLength; the Python and TypeScript SDKs check those in code. Structured outputs can’t be combined with citations.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Draw the plate.",
      lead: "Pick what you’re pulling data from. Claude drafts the schema, explained or in code.",
      state: { mode: "Explain it to me", lang: "Python", src: "receipts" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">How you want help</p>' + row("mode", ["Explain it to me", "Write the code"]) +
          '<p class="label">Language (for code)</p>' + row("lang", ["Python", "TypeScript"]) +
          '<p class="label">Pull data from</p>' + row("src", ["receipts", "customer emails", "job applications", "product reviews"]);
      },
      head: "ORDER #D03", right: "same plate", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        if (s.mode === "Explain it to me") {
          return "My app will pull data out of " + s.src + " with the Claude API. I don’t code yet.\n" +
            "1. Suggest 4 to 6 fields and a type for each, in a table.\n" +
            "2. Show the JSON Schema, a note on each line.\n" +
            "3. Structured outputs or a tool with strict: true: which fits, and why?\n" +
            "4. Three ways it can still go wrong (a refusal, a cut-off reply, a wrong value), and how to check each.";
        }
        var how = s.lang === "Python" ? "client.messages.parse() with a Pydantic model" : "client.messages.parse() with the SDK’s zodOutputFormat helper";
        return "Write a small " + s.lang + " script using the official Claude SDK that extracts data from one sample of " + s.src + " (make up the sample and label it).\n" +
          "- Model claude-opus-5-5. Key from ANTHROPIC_API_KEY.\n" +
          "- Use structured outputs: " + how + ", with additionalProperties: false on every object.\n" +
          "- Check stop_reason first: handle \"refusal\" and \"max_tokens\" before reading the data.\n" +
          "- Validate the result and print it.\n" +
          "Then tell me what to do with it: the install command, how to run it, and how to change the fields.";
      },
      claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "tapall", title: "Which jobs want structured outputs?", lead: "Tap all {n}.",
      options: [
        ["Turn receipts into spreadsheet rows", true], ["Sort reviews into one of 5 labels", true], ["Pull names and dates from emails into your app", true],
        ["Write a friendly reply to a customer", false, "That’s prose for a person. Let Claude write."],
        ["Check today’s stock in your ordering system", false, "Claude needs to act there. That’s a tool."]
      ],
      right: "Yes. When code reads the answer, lock the shape.",
      wrong: "Who reads that answer: code or a person?",
      habitTitle: "Builder habit", habit: "If code reads the answer, give it a schema. If a person reads it, let Claude write."
    },
    breaks: {
      title: "Right shape, wrong food.",
      lines: [
        ["A perfect plate can hold a wrong number.", "The schema checks shape. It can’t check truth."],
        ["A refusal skips the plate.", "Check stop_reason before you trust the data."]
      ],
      where: "A plate diagram makes cooks consistent. It can’t make them read the receipt correctly."
    },
    quiz: [
      { term: "Strict tool use", q: "What does strict: true on a tool do?", a: ["Makes the inputs Claude sends match the tool’s schema", "Forces Claude to call that tool on every turn", "Blocks Claude from using any other tool"], ok: 0, why: "Right. Valid arguments, every time it calls." },
      { term: "output_config", q: "Where does the schema for Claude’s final answer go?", a: ["output_config.format", "Inside the system prompt only", "In the max_tokens field"], ok: 0, why: "Right. type json_schema, plus your schema." },
      { term: "Model routing", q: "Recall from Lesson 2: what is model routing?", a: ["Sending easy requests to a small model and hard ones to a bigger one", "Sending the same request to every model at once", "Moving your app to a new server"], ok: 0, why: "Right. Pay for the big chef only when you need it." }
    ],
    say: "When code reads the reply, we give Claude a JSON schema and still validate the result.",
    keep: "A schema for your own data, explained or in code.",
    cardLabel: "Copy my card",
    card: "SAME PLATE EVERY TIME\nJSON Schema = the plate diagram: fields and types\noutput_config.format = lock the final answer’s shape\nadditionalProperties: false on every object\nStrict tool use = tool inputs match the schema\nValidation = still check it in code\nRefusal or max_tokens can break the shape\nCode reads it? Schema. A person reads it? Prose.",
    real: ["Building with the Claude API", "https://academy.claude.com/courses/building-with-the-claude-api"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
