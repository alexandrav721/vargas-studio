/* Builder's Kitchen · Lesson 5 · Outlets (MCP). Terms: MCP, MCP server, MCP client/host, connector, resources & prompts, prompt injection. */
(function () {
  var L = {
    n: 5, id: "b5", mins: 8, title: "Standard outlets.", stamp: "MCP",
    terms: ["MCP", "MCP server", "MCP client", "Connector", "Resources", "Prompt injection"],
    teaser: ["OUTLETS", "MCP", "One outlet shape.<br>Any appliance plugs in.<br>Any kitchen can use it.", "Six words. Eight minutes."],
    lines: [
      ["MCP is a standard outlet.", "Model Context Protocol: one shared plug shape, so tools work in any AI app that supports it."],
      ["An MCP server is the appliance.", "Someone wraps Google Drive, Slack or a database once, as a server. Then anyone can plug it in."],
      ["The MCP client is the kitchen wall.", "Claude Desktop or Claude Code is the host app; it plugs the server in and offers its tools to Claude."]
    ],
    startLabel: "See why outlets matter",
    example: {
      title: "Before and after the standard outlet.",
      html:
        '<p class="label">Before</p><div class="reply"><p class="who">every app</p>Builds its own Drive tool, Slack tool, calendar tool. Over and over.</div>' +
        '<p class="label" style="margin-top:14px">After MCP</p><div class="reply"><p class="who">once</p>Someone builds a Drive MCP server. Claude Desktop, Claude Code and other apps all plug it in.</div>' +
        '<p class="label" style="margin-top:14px">What a server can offer</p>' +
        '<div class="fridge"><span class="chip">Tools: actions</span><span class="chip">Resources: things to read</span><span class="chip">Prompts: ready-made orders</span></div>' +
        '<p style="margin-top:14px">In the Claude app, plugged-in servers are called <b>connectors</b>. You turn them on in settings and sign in to the service.</p>',
      next: "Plan your outlets"
    },
    build: {
      title: "Your turn. What would you plug in?",
      lead: "Tap the services you use. Your ticket asks Claude what each outlet could do, and the risks.",
      state: { svc: ["Google Calendar", "Gmail"] },
      controls: function (s, esc) {
        var svc = ["Google Calendar", "Gmail", "Google Drive", "Notion", "Slack", "Shopify", "GitHub"];
        return '<p class="label">Services (tap any)</p><div class="fridge">' + svc.map(function (v) { return '<button type="button" class="chip" data-set="svc" data-multi="1" data-v="' + esc(v) + '" aria-pressed="' + (s.svc.indexOf(v) >= 0) + '">' + esc(v) + "</button>"; }).join("") + "</div>";
      },
      head: "ORDER #B05", right: "outlet plan", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "I'm learning MCP (Model Context Protocol). I use: " + (s.svc.join(", ") || "nothing yet") + ".\n" +
          "For each one: 1. What could Claude do if I connected it (one useful example). 2. Is it read-only or can it change things? 3. One safety tip.\n" +
          "Then explain in 3 lines: MCP server vs MCP client vs connector, using a kitchen-outlet comparison.";
      },
      claude: "Open Claude with my ticket", done: "I planned my outlets →"
    },
    game: {
      type: "match", title: "Match the outlet words.", lead: "Tap a word, then its meaning.",
      pairs: [["MCP", "The standard plug shape"], ["MCP server", "The appliance: wraps one service"], ["MCP client", "The app that plugs it in (like Claude Desktop)"], ["Connector", "What the Claude app calls a plugged-in server"], ["Resources", "Things a server lets Claude read"]],
      right: "All five. You can follow any MCP conversation now.",
      habitTitle: "Builder habit", habit: "MCP is plumbing, not magic. It’s still tools underneath: Claude asks, the server acts."
    },
    breaks: {
      title: "Plug in only what you trust.",
      lines: [
        ["Anyone can build an MCP server.", "A bad one can read or change your data. Use ones from the service itself or people you trust."],
        ["Prompt injection hides in content.", "An email or page can contain text like “ignore your rules.” Claude may read it as an order. Keep a person in the loop for actions."],
        ["More outlets, more risk.", "Turn on only what this job needs."]
      ],
      where: "A wall outlet just passes power. An MCP server passes words, and words can carry instructions. That’s a risk kitchens don’t have."
    },
    quiz: [
      { q: "Why does MCP exist?", a: ["So a tool built once works in many AI apps", "To make Claude smarter"], ok: 0, why: "Right. It’s a standard, like one outlet shape." },
      { q: "Recall from Lesson 4: who runs a tool when Claude asks?", a: ["The app or server, not Claude", "Claude itself"], ok: 0, why: "Right. Claude picks; the kitchen presses the button." }
    ],
    keep: "a plan for which services to connect, with a safety note for each.",
    cardLabel: "Copy my outlet card",
    card: "OUTLETS (MCP)\nMCP = Model Context Protocol, a standard plug for tools\nMCP server = the appliance (wraps Drive, Slack, a database…)\nMCP client / host = the app that plugs it in (Claude Desktop, Claude Code)\nConnector = the Claude app’s name for a plugged-in server\nServers offer tools, resources, prompts\nPrompt injection = hidden orders inside content. Plug in only what you trust",
    real: ["Introduction to Model Context Protocol", "https://anthropic.skilljar.com/introduction-to-model-context-protocol"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
