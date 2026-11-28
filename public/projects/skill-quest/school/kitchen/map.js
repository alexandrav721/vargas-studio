/* The AI kitchen map: 48 core words in 8 stations, shared by the cheat sheet infographic and The Pass (words game).
   Word details come from words.js (window.BK_WORDS: [term, kitchen picture, plain meaning, not the same as, lesson, example, level]).
   Progress comes from mem.js (window.BKM), the same memory the Plain words dictionary uses. */
(function () {
  var Z = [
    { id: "order", name: "Your order", sub: "What you send", hue: "#C7391F",
      icon: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
      words: ["Prompt", "System prompt", "Examples", "XML tags", "Prompt engineering", "Jailbreak", "Prompt injection"] },
    { id: "counter", name: "The counter", sub: "What the chef can see", hue: "#B8741A",
      icon: '<path d="M3 10h18v3H3z"/><path d="M5 13v8M19 13v8M7 10V6h4v4M13 10V7h4v3"/>',
      words: ["Context window", "Token", "Compaction", "Project", "Memory", "Prompt caching"] },
    { id: "chef", name: "The chef", sub: "The model doing the work", hue: "#151411",
      icon: '<path d="M7 11a4 4 0 1 1 3-6.6A4 4 0 1 1 17 11v3H7z"/><path d="M7 14h10v6H7z"/>',
      words: ["Model", "LLM", "Model family", "Weights", "Inference", "Training cutoff", "Thinking", "Temperature", "Hallucination"] },
    { id: "tools", name: "Tools rack", sub: "What it can use", hue: "#1F7A6B",
      icon: '<path d="M4 4h16M7 4v6l-2 3h4l-2-3M12 4v9M17 4v4a2 2 0 0 1-4 0"/><path d="M4 20h16"/>',
      words: ["Tool use", "Tool call", "Web search", "Code execution", "Computer use", "MCP", "Connector"] },
    { id: "pantry", name: "The pantry", sub: "What it can look up", hue: "#6B5B95",
      icon: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 9h16M4 15h16M9 6h2M13 12h2M8 18h3"/>',
      words: ["RAG", "Chunking", "Embeddings", "Citations", "Fine-tuning"] },
    { id: "brigade", name: "The brigade", sub: "AI that works in steps", hue: "#2F5D9E",
      icon: '<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M3 20a5 5 0 0 1 10 0M11 20a5 5 0 0 1 10 0"/>',
      words: ["Agent", "Agent loop", "Workflow", "Subagent", "Orchestrator", "Human in the loop", "Skill"] },
    { id: "door", name: "Front door", sub: "Where you reach it", hue: "#8A6D3B",
      icon: '<path d="M6 21V4h12v17M3 21h18"/><circle cx="14.5" cy="12.5" r="1"/>',
      words: ["API", "API key", "Streaming", "Rate limits", "Artifact", "Claude Code"] },
    { id: "inspector", name: "The inspector", sub: "Checking the food", hue: "#5D5952",
      icon: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v3h6V3M8.5 12l2 2 4-4M9 17h6"/>',
      words: ["Eval", "Grader", "Benchmark", "Guardrails", "Success criteria"] }
  ];
  /* How one reply gets made, left to right. */
  var FLOW = [["You", "type a request"], ["Your order", "the prompt"], ["The counter", "everything it can see"], ["The chef", "the model writes"], ["The plate", "the answer you check"]];
  var BY = {};
  function words() { return window.BK_WORDS || []; }
  function get(term) {
    if (!BY[term]) words().forEach(function (w) { BY[w[0]] = w; });
    return BY[term] || null;
  }
  function zoneOf(term) { for (var i = 0; i < Z.length; i++) if (Z[i].words.indexOf(term) >= 0) return Z[i]; return null; }
  function all() { return Z.reduce(function (a, z) { return a.concat(z.words); }, []).filter(get); }
  /* 0 new, 1 seen or learning, 2 known */
  function state(term) { var M = window.BKM; if (!M) return 0; return M.known(term) ? 2 : M.seen(term) ? 1 : 0; }
  window.EZMAP = { zones: Z, flow: FLOW, get: get, zoneOf: zoneOf, all: all, state: state };
})();
