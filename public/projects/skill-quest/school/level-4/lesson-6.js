/* AI Made EZ · Level 4 · Lesson 6 · The recipe library, built (files, PDFs, citations, RAG). Terms: Files API, Document block, Voyage AI, BM25, Reranker, Contextual retrieval. */
(function () {
  var L = {
    n: 6, id: "d6", mins: 7, title: "The recipe library, built.", stamp: "Library",
    seen: ["RAG", "Chunking", "Embeddings", "Vector database", "Citations"],
    terms: ["Files API", "Document block", "Voyage AI", "BM25", "Reranker", "Contextual retrieval"],
    teaser: ["THE LIBRARY", "files · RAG", "Level 2 showed you the recipe binder.<br>Now you build it: upload, chunk,<br>index, fetch, cite.", "Six words. Seven minutes."],
    lines: [
      ["Small library? Hand Claude the whole book.", "Send PDFs as document blocks: up to 600 pages a request."],
      ["Big library? Fetch only the right pages.", "Chunk, embed, store, then retrieve the best matches."],
      ["Make every answer show its page.", "Turn on citations. Claude points to the exact passage."]
    ],
    guess: { q: "Your café has a 20-page allergy guide. Simplest way to answer questions from it?", opts: [["Send the whole PDF with each question", true], ["Build a vector database first", false], ["Train a model on the guide", false]], reveal: "Send it. 20 pages fit easily. Build retrieval when the library outgrows the counter, or the bill." },
    startLabel: "Build the library",
    example: {
      title: "Upload once, cite every time.",
      html:
        '<p class="label">1. Upload once (Files API)</p><div class="reply"><p class="who">your code</p>upload allergy-guide.pdf → file_id: file_011…</div>' +
        '<p class="label" style="margin-top:14px">2. Point to it in a document block <span class="sample">Simplified</span></p><div class="ticket"><div class="th"><span>DOCUMENT</span><span>block</span></div>source: { type: "file", file_id }<br>citations: { enabled: true }<div class="tf">Each PDF page is read as text and as an image</div></div>' +
        '<p class="label" style="margin-top:14px">3. The answer, with receipts <span class="sample">Sample</span></p><div class="reply"><p class="who">assistant</p>The pesto has pine nuts. <span class="small">[cited: “Pesto: basil, pine nuts…”]</span></div>' +
        '<p class="small">Too big to send whole? A search step fetches only the matching pages. A developer builds it with <b>Voyage AI</b>, a second service with its own account.</p>',
      more: '<p class="small">Voyage AI makes the embeddings (Anthropic has no embedding model). <b>BM25</b> adds keyword search; a <b>reranker</b> sorts the finalists. <b>Contextual retrieval</b>: before indexing, Claude writes a 50 to 100 token note placing each chunk in its document. In Anthropic’s tests that cut failed retrievals by 35%, by 49% with BM25, and by 67% with reranking too. The 600-page limit drops to 100 when the context window is under 1M tokens.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Build the library.",
      lead: "Pick your documents and their size. Get a build plan in plain words, or the script.",
      state: { mode: "Explain it to me", lang: "Python", docs: "a staff handbook", size: "under 100 pages" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">How you want help</p>' + row("mode", ["Explain it to me", "Write the code (for a developer)"]) +
          '<p class="label">Language (for code)</p>' + row("lang", ["Python", "TypeScript"]) +
          '<p class="label">Your documents</p>' + row("docs", ["a staff handbook", "product manuals", "past support tickets", "a menu and allergy guide"]) +
          '<p class="label">How big</p>' + row("size", ["under 100 pages", "thousands of pages"]);
      },
      head: "ORDER #D06", right: "the library", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        var small = s.size === "under 100 pages";
        if (s.mode === "Explain it to me") {
          return "I want the Claude API to answer questions from " + s.docs + " (" + s.size + "). I don’t code yet.\n" +
            "1. Whole documents or retrieval, for my size? Why?\n" +
            "2. If retrieval, each step in plain words: chunk, embed, store, search, rerank, answer with citations.\n" +
            "End with a document-prep checklist I can tick (gather, clean up, leave out), then 5 test questions, each with the page its answer is on, plus one the documents can’t answer.";
        }
        return "Write a small " + s.lang + " script with the official Claude SDK that answers a question from " + s.docs + ".\n" +
          "- Model claude-opus-5-5. Key from ANTHROPIC_API_KEY.\n" +
          (small
            ? "- Upload a PDF once with the Files API as the current SDK does (no beta header; name the SDK version you assume), then send it as a document block with citations enabled.\n- Print the answer, then each citation’s cited text.\n"
            : "- Split my text files into chunks of a few hundred tokens.\n- Embed the chunks with Voyage AI (model voyage-4, input_type \"document\" for chunks and \"query\" for the question), key from VOYAGE_API_KEY.\n- Retrieve the top 5 chunks by similarity, send them to Claude as plain-text document blocks with citations enabled, and print the answer with its sources.\n") +
          "Then tell me the install commands, where my files go, how to run it, and how to tell a good answer from a lucky one.";
      },
      claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "pick", title: "Your library bot quoted the wrong policy page. What do you check first?",
      options: [
        ["Which chunks the retrieval step handed Claude", true],
        ["The wording of Claude’s system prompt", false, "Claude can only cook with what it was handed. Check the fetch first."],
        ["Switch to a bigger chef", false, "A bigger chef with the wrong page still gives the wrong answer."]
      ],
      right: "Yes. Check what it was handed before you blame the cook.",
      wrong: "What did Claude actually see?", hint: "Look one step before the answer.",
      habitTitle: "Builder habit", habit: "Log the retrieved chunks with every answer. Then a wrong answer shows you where it went wrong."
    },
    breaks: {
      title: "A library can hand over the wrong book.",
      lines: [
        ["Retrieval can miss the right chunk.", "Test with real questions, and log what it fetched."],
        ["A citation shows where, not whether.", "A quoted page can still be misread. Spot-check."]
      ],
      where: "A librarian understands your question. Embeddings match meaning as numbers, so odd wording can miss the shelf."
    },
    quiz: [
      { term: "Contextual retrieval", q: "What does contextual retrieval add?", a: ["A short note on each chunk saying where it fits in its document", "A second model that writes the final answer", "A bigger context window for long documents"], ok: 0, why: "Right. Chunks stop being orphans." },
      { term: "Document block", q: "Your guide is 20 pages. What do you build first?", a: ["Nothing extra: send the whole PDF as a document block", "A vector database", "A reranker"], ok: 0, why: "Right. Build retrieval only when the library outgrows the counter." },
      { term: "Citations", q: "From Level 2: what do citations give you?", a: ["The exact passage behind a claim", "A cheaper reply", "A longer answer"], ok: 0, why: "Right. Receipts you can check." }
    ],
    say: "Small libraries go in whole with citations. Big ones get retrieval: embeddings plus BM25, reranked, cited.",
    keep: "A document Q&A for your own files, planned or coded.",
    cardLabel: "Copy my card",
    card: "THE RECIPE LIBRARY, BUILT\nFiles API = upload once, reuse by file_id\nDocument block = hand Claude a PDF or text\nSmall library: send it whole\nBig library: chunk, embed, retrieve, cite\nVoyage AI = embeddings (Anthropic has none)\nBM25 = keyword search; reranker sorts finalists\nContextual retrieval = a note on every chunk",
    real: ["Building with the Claude API", "https://academy.claude.com/courses/building-with-the-claude-api"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
