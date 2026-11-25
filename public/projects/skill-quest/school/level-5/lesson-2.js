/* AI Made EZ · Level 5 · Lesson 2 · Build a standard outlet (MCP server design). Terms: transport, stdio, Streamable HTTP, OAuth, scopes, namespacing. */
(function () {
  var L = {
    n: 2, id: "e2", mins: 7, title: "Build a standard outlet.", stamp: "Outlet",
    seen: ["MCP", "MCP server", "Resources"], terms: ["Transport", "stdio", "Streamable HTTP", "OAuth", "Scopes", "Namespacing"],
    teaser: ["STANDARD OUTLET", "for every location", "One plug shape in every kitchen.<br>Build it once, any app plugs in.<br>Label every socket.", "Six words. Seven minutes."],
    lines: [
      ["An MCP server offers three things.", "Tools the model calls, resources the app attaches, prompts the user picks."],
      ["The wiring is called the transport.", "stdio for one computer. Streamable HTTP for a server many people reach."],
      ["Labels matter more than code.", "Claude picks tools by name and description. Few, clear, well named."]
    ],
    guess: { q: "Your MCP server will only ever run on one laptop. Which wiring?", opts: [["stdio: the app starts it as a local program", true], ["Streamable HTTP with a sign-in page", false], ["It makes no difference", false]], reveal: "stdio: the app launches the server on the same computer and talks to it directly. Streamable HTTP is for servers reached over the web." },
    startLabel: "See a spec",
    example: {
      title: "A booking outlet for every location.",
      html:
        '<p class="label">Server design <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>MCP SERVER</span><span>booking</span></div>' +
        'transport: Streamable HTTP (web)<br>sign-in: OAuth, scope “tables:read”<br>' +
        'tools: booking_search_tables (read)<br>booking_create (writes: ask first)<br>' +
        'resources: menu, opening hours<br>prompts: /plan-a-party' +
        '<div class="tf">One server, every location plugs in</div></div>' +
        '<p class="small"><b>OAuth</b>: staff sign in on the booking system’s own page. The server gets a key with limited <b>scopes</b>, like read-only.</p>',
      more: '<p class="small"><b>Namespacing</b>: prefix by service (booking_, crm_) so Claude never mixes up two “search” tools.</p><p class="small">MCP or a plain tool? If one app will ever use it, a plain tool in that app is simpler. MCP pays off when many apps or teams plug in.</p><p class="small">The MCP spec says sign-in is optional. Web servers should use its OAuth flow; local stdio servers read keys from that computer’s environment instead.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Spec an outlet.",
      lead: "Pick a system and who plugs in. Your ticket asks Claude for a one-page MCP server design.",
      state: { sys: "our booking system", who: "just my team" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">The system</p>' + row("sys", ["our booking system", "the company wiki", "our customer list (CRM)", "the inventory spreadsheet"]) +
          '<p class="label">Who plugs in</p>' + row("who", ["just me, on my laptop", "just my team", "every location", "outside partners"]);
      },
      head: "ORDER #E02", right: "outlet spec", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "Design an MCP server for " + s.sys + ". Who will plug in: " + s.who + ". I don't code; a developer will build it.\n" +
          "One page, plain words:\n" +
          "1. MCP server, or a plain tool inside one app? Say why.\n" +
          "2. Tools (name, what it does, read or write), resources and prompts. Few tools, namespaced.\n" +
          "3. Transport (stdio or Streamable HTTP) and sign-in (OAuth scopes), with reasons.\n" +
          "4. Which tools need a person to approve first.\n" +
          "Then offer to write each tool description out in full for the developer.";
      },
      claude: "Open in Claude", done: "Done →"
    },
    game: {
      type: "pick", title: "Claude keeps calling the wrong “search” tool. What do you fix first?",
      options: [
        ["Rename and describe them: booking_search vs crm_search", true],
        ["Add more tools so it has more options", false, "More tools often make picking harder. Anthropic advises a few well-chosen ones."],
        ["Switch the wiring from stdio to Streamable HTTP", false, "The wiring isn’t the problem. Claude chooses by reading the labels."]
      ],
      right: "Yes. Clear names and descriptions are how Claude chooses.",
      wrong: "What does Claude actually read?", hint: "It only sees each tool’s name and description.",
      habitTitle: "Architect habit", habit: "Write each tool description like a note to a new hire: what it does, when not to use it, what each input means."
    },
    breaks: {
      title: "An outlet carries power both ways.",
      lines: [
        ["A server is also a door in.", "Anthropic lists connectors in its Directory but doesn’t security-audit MCP servers. Use trusted ones."],
        ["Sign-in isn’t a lock on actions.", "OAuth proves who you are. Approvals still decide what runs."]
      ],
      where: "A wall outlet doesn’t care what you plug in. An MCP tool’s words land on Claude’s counter, so its labels and results steer the chef."
    },
    quiz: [
      { term: "Transport", q: "What does the transport decide?", a: ["How messages travel between the app and the server", "Which tools the server offers", "Who is allowed to sign in"], ok: 0, why: "Right. stdio or Streamable HTTP: the wiring, not the menu." },
      { term: "Scopes", q: "What are OAuth scopes for?", a: ["Limiting what a sign-in key may do", "Naming tools so Claude can find them", "Choosing between stdio and HTTP"], ok: 0, why: "Right. Ask for the smallest scopes the job needs." },
      { term: "Routing", q: "Recall from Lesson 1: which pattern sorts each input, then sends it to a specialist?", a: ["Routing", "Prompt chaining", "Evaluator-optimizer"], ok: 0, why: "Right. The host seats each guest at the right station." }
    ],
    say: "An MCP server is one standard outlet: few, clearly labeled tools, the right wiring, and the smallest sign-in scopes.",
    keep: "A one-page MCP server spec a developer can build from, and the questions that decide MCP or a plain tool.",
    cardLabel: "Copy my card",
    card: "STANDARD OUTLET (MCP SERVER DESIGN)\nTools = model calls them · Resources = app attaches them · Prompts = user picks them\nTransport = the wiring\nstdio = local, the app starts it\nStreamable HTTP = a web server many reach\nOAuth = sign in on the service’s own page\nScopes = what that key may do (keep small)\nNamespacing = booking_search, crm_search\nOne app only? A plain tool is simpler",
    real: ["Model Context Protocol: Advanced topics", "https://academy.claude.com/courses/model-context-protocol-advanced-topics"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
