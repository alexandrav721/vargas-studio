/* Builder's Kitchen · Lesson 6 · The recipe binder (RAG). Terms: RAG, chunking, embeddings, vector database, citations, prompt caching. */
(function () {
  var L = {
    n: 6, id: "b6", mins: 6, title: "The recipe binder.", stamp: "RAG",
    terms: ["RAG", "Chunking", "Embeddings", "Vector database", "Citations", "Prompt caching"],
    teaser: ["RECIPE BINDER", "RAG", "The chef never memorized your recipes.<br>Someone pulls the right pages<br>and lays them on the counter.", "Six words. Six minutes."],
    lines: [
      ["RAG: look it up, then cook.", "Retrieval-augmented generation. Find the right pages of your documents, put them on the counter, then Claude answers from them."],
      ["Nothing gets trained.", "The right pages are pasted in each time."],
      ["The binder is indexed by meaning.", "Embeddings: number codes for meaning, so “refund” finds “money back.”"]
    ],
    guess: { q: "A help bot answers from a shop’s policy pages. Was Claude trained on them?", opts: [["No, the right page is looked up and pasted in", true], ["Yes, the shop trained it on the pages overnight", false], ["Claude already knew this shop’s policy from the web", false]], reveal: "No training. The right page is fetched and placed in front of Claude. That’s RAG." },
    startLabel: "Watch a lookup",
    example: {
      title: "“Can I return shoes after 40 days?”",
      html:
        '<p class="label">1. Chunking: cut into pages <span class="sample">Sample</span></p>' +
        '<div class="fridge"><span class="tag">Shipping</span><span class="tag">Returns: 30 days</span><span class="tag">Gift cards</span><span class="tag">Sizes</span></div>' +
        '<p class="label" style="margin-top:14px">2. Search by meaning</p><div class="reply"><p class="who">search</p>Closest page: “Returns: unworn items within 30 days.”</div>' +
        '<p class="label" style="margin-top:14px">3. Claude answers</p><div class="reply"><p class="who">assistant</p>Sorry, returns are 30 days. <span class="small">[Source: Returns policy]</span></div><p class="small">A <b>vector database</b> finds the closest code. <b>Citations</b> show the page used. Small binder? Paste it all in; <b>prompt caching</b> makes repeats cheaper.</p>',
      more: '<p class="small"><b>Citations</b> point to the page used, so people can check. Claude doesn’t make embeddings. App makers get them from another company (Anthropic’s docs suggest Voyage AI).</p><p style="margin-top:14px"><b>Small binder?</b> Skip the search. Under roughly 500 pages, Anthropic suggests putting it all on the counter and using <b>prompt caching</b>: the pages are read in once and stored, so repeat questions cost less. By default the stored copy lasts 5 min after each use.</p>',
      next: "Your turn →"
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
        return "Make me a setup plan: I want Claude to " + s.job + ". My documents: " + s.docs + ".\n" +
          "1. Do I need RAG, or can it all go in the prompt with prompt caching? Say why in 2 lines.\n" +
          "2. If RAG: explain chunking, embeddings and a vector database for my case, one line each.\n" +
          "3. How do I make answers cite the page they used, and what should it do when no page fits?";
      },
      vendor: ["AI that answers from our documents (RAG)", "whether it trains on our documents, how it shows its sources, and what it says when no document fits"], claude: "Open in Claude", done: "Done →"
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
        ["Wrong page in, wrong answer out.", "When a RAG bot is wrong, check the search first."],
        ["Pages cut too small lose meaning.", "“Grew 3%”: which company, which year?"],
        ["Caching stores the prep.", "Each answer is still cooked fresh."]
      ],
      where: "A real chef flips through the binder. Claude sees only the pages it’s handed."
    },
    quiz: [
      { term: "RAG", q: "Does RAG train the model on your documents?", a: ["No, it places the right pages in each request", "Yes, a little each time it reads them", "Only the first time"], ok: 0, why: "Right. Nothing is trained. It’s looked up each time." },
      { term: "MCP server", q: "Recall from Lesson 5: what’s an MCP server?", a: ["The standard plug for one service", "A newer, more powerful Claude model for big jobs", "The app you chat in, like the Claude desktop app"], ok: 0, why: "Right. A Drive or Notion server is one way to fetch pages for the binder." },
      {q: "From Lesson 3: what’s a hallucination?", a: ["A confident wrong answer", "An answer that is much too long to read", "When Claude refuses to answer a request"], ok: 0, why: "Right. Give facts and an honest exit to make it rarer.", term: "Hallucination"}
    ],
    say: "RAG looks up the right pages and hands them to Claude. Nothing gets trained.",
    keep: "5 questions about AI that answers from documents, and a ticket for a setup plan.",
    cardLabel: "Copy my card",
    card: "THE RECIPE BINDER (RAG)\nRAG = find the right pages, then Claude answers from them\nChunking = cutting documents into findable pages\nEmbeddings = number codes for meaning, so similar pages can be found\nVector database = finds the closest-meaning pages\nCitations = which page the answer came from\nPrompt caching = prep once, reuse cheaply (5 min after each use)\nSmall binder? Paste it all in.",
    real: ["Building with the Claude API (RAG module)", "https://academy.claude.com/courses/building-with-the-claude-api"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
