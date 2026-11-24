/* Builder's Kitchen · Lesson 6 · The recipe binder (RAG). Terms: RAG, chunking, embeddings, vector database, citations, prompt caching. */
(function () {
  var L = {
    n: 6, id: "b6", mins: 9, title: "The recipe binder.", stamp: "RAG",
    terms: ["RAG", "Chunking", "Embeddings", "Vector database", "Citations", "Prompt caching"],
    teaser: ["RECIPE BINDER", "RAG", "The chef never memorized your recipes.<br>Someone pulls the right pages<br>and lays them on the counter.", "Six words. Nine minutes."],
    lines: [
      ["RAG: look it up, then cook.", "Retrieval-augmented generation. Find the right pages of your documents, put them on the counter, then Claude answers from them."],
      ["Nothing gets trained.", "Your documents are just placed in each request. Change a page, and the next answer uses the new one."],
      ["The binder is indexed by meaning.", "Embeddings turn text into numbers, so “refund” can find a page that says “money back.”"]
    ],
    guess: { q: "A help bot answers from a shop’s policy pages. Was Claude trained on them?", opts: [["No, the right page is looked up and pasted in", true], ["Yes, the shop trained it overnight", false], ["Claude already knew the policy", false]], reveal: "No training. The right page is fetched and placed in front of Claude. That’s RAG." },
    startLabel: "Watch a lookup",
    example: {
      title: "“Can I return shoes after 40 days?”",
      html:
        '<p class="label">1. Chunking: the binder is cut into pages <span class="sample">Sample</span></p>' +
        '<div class="fridge"><span class="tag">Shipping</span><span class="tag">Returns: 30 days</span><span class="tag">Gift cards</span><span class="tag">Sizes</span></div>' +
        '<p class="label" style="margin-top:14px">2. Search by meaning (embeddings + a vector database)</p><div class="reply"><p class="who">search</p>Closest page: “Returns: unworn items within 30 days.”</div>' +
        '<p class="label" style="margin-top:14px">3. Claude answers from that page</p><div class="reply"><p class="who">assistant</p>Sorry, returns are 30 days. <span class="small">[Source: Returns policy]</span></div>' +
        '<p class="small"><b>Citations</b> point to the page used, so people can check. Anthropic doesn’t make its own embeddings; builders use a separate provider (Anthropic’s docs suggest Voyage AI).</p>' +
        '<p style="margin-top:14px"><b>Small binder?</b> Skip the search. Under roughly 500 pages, Anthropic suggests putting it all on the counter and using <b>prompt caching</b>: prep it once, and reuse it cheaply while orders keep coming (it stays fresh 5 minutes after each use).</p>',
      next: "Plan your binder"
    },
    build: {
      title: "Your turn. What goes in your binder?",
      lead: "Pick a job and your documents. Your ticket asks Claude whether you need RAG, and how.",
      state: { job: "answer customer questions", docs: "a 10-page FAQ" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">The job</p>' + row("job", ["answer customer questions", "help new staff", "use our brand guidelines", "answer from class readings"]) +
          '<p class="label">Your documents</p>' + row("docs", ["a 10-page FAQ", "a 300-page handbook", "5,000 help articles", "years of notes"]);
      },
      head: "ORDER #B06", right: "binder plan", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "Make me a setup plan: I want Claude to " + s.job + " using " + s.docs + ".\n" +
          "1. Do I need RAG, or can it all go in the prompt with prompt caching? Say why in 2 lines.\n" +
          "2. If RAG: explain chunking, embeddings and a vector database for my case, one line each.\n" +
          "3. How do I make answers cite the page they used, and what should it do when no page fits?";
      },
      claude: "Open in Claude", done: "I planned my binder →"
    },
    game: {
      type: "pick", title: "A shop has a 6-page policy doc. What’s the simplest good setup?",
      options: [
        ["Put all 6 pages in the prompt, with caching", true],
        ["Build embeddings and a vector database", false, "That works, but it’s a lot of kitchen for 6 pages."],
        ["Train Claude on the 6 pages", false, "Claude’s API doesn’t offer training, and you don’t need it."]
      ],
      right: "Yes. Small binder, lay it all on the counter. RAG is for when it won’t fit or gets too costly.",
      wrong: "Think smaller.", hint: "The counter holds a lot. Does 6 pages need a search?",
      habitTitle: "Builder habit", habit: "Start with the simplest thing: paste it in. Add search only when the binder outgrows the counter."
    },
    breaks: {
      title: "The wrong page gives a wrong plate.",
      lines: [
        ["If search pulls the wrong page, Claude answers from it.", "When a RAG bot is wrong, check the search first."],
        ["Pages cut too small lose their meaning.", "“Grew 3%”: which company, which year? Good chunks keep their context."],
        ["Caching stores the prep, not the answer.", "Each answer is still cooked fresh."]
      ],
      where: "A real binder sits on a shelf and the chef flips through it. Claude never sees the binder, only the pages someone hands it."
    },
    quiz: [
      { q: "Does RAG train the model on your documents?", a: ["No, it places the right pages in each request", "Yes, a little each time it reads them"], ok: 0, why: "Right. Nothing is trained. It’s looked up each time." },
      { q: "Recall from Lesson 5: what’s an MCP server?", a: ["The appliance that wraps one service", "A faster Claude"], ok: 0, why: "Right. A Drive or Notion server is one way to fetch pages for the binder." }
    ],
    keep: "a plan for your own documents: paste it in, or build a binder.",
    cardLabel: "Copy my binder card",
    card: "THE RECIPE BINDER (RAG)\nRAG = find the right pages, then Claude answers from them\nChunking = cutting documents into findable pages\nEmbeddings = text turned into numbers by meaning\nVector database = finds the closest-meaning pages\nCitations = which page the answer came from\nPrompt caching = prep once, reuse cheaply (5 min after each use)\nSmall binder? Paste it all in.",
    real: ["Building with the Claude API (RAG module)", "https://academy.claude.com/courses/building-with-the-claude-api"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
