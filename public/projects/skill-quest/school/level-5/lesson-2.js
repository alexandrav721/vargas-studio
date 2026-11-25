/* AI Made EZ · Level 5 · Lesson 2 · Build a standard outlet (MCP server design). Terms: transport, stdio, Streamable HTTP, OAuth, scopes, namespacing. */
(function () {
  var L = {
    n: 2, id: "e2", mins: 7, title: "Build a standard outlet.", stamp: "Outlet",
    seen: ["MCP", "MCP server", "Resources"], terms: ["Transport", "stdio", "Streamable HTTP", "OAuth", "Scopes", "Namespacing"],
    teaser: ["STANDARD OUTLET", "for every location", "Level 2 plugged apps into outlets.<br>Now you design the outlet<br>every location plugs into.", "Six words. Seven minutes."],
    lines: [
      ["An MCP server offers three things.", "Tools Claude uses, resources it reads (files, records), prompts people pick from a menu."],
      ["The wiring is called the transport.", "stdio for one computer. Streamable HTTP for a server many people reach."],
      ["Labels are how Claude picks a tool.", "It reads each name, description and input field. Keep them few and clear."]
    ],
    guess: { q: "Only you will use this MCP server, on your own laptop. How should it connect?", opts: [["Locally: the app starts it on that laptop (stdio)", true], ["Over the web, with a sign-in page (Streamable HTTP)", false], ["It makes no difference", false]], reveal: "Locally. The app starts the server on your laptop and talks to it directly. Streamable HTTP is for servers reached over the web." },
    startLabel: "See a spec",
    example: {
      title: "A booking outlet for every location.",
      html:
        '<p class="label">Server design <span class="sample">Sample</span></p><div class="ticket"><div class="th"><span>MCP SERVER</span><span>booking</span></div>' +
        'transport: Streamable HTTP (web)<br>sign-in: OAuth, scope “tables:read”<br>' +
        'tools: booking_search_tables (read)<br>booking_create (writes)<br>' +
        'resources: menu, opening hours<br>prompts: /plan-a-party' +
        '<div class="tf">One server, every location plugs in</div></div>' +
        '<p class="small"><b>OAuth</b>: staff sign in on the booking system’s own page. The app gets a key with limited <b>scopes</b>, like read-only. The server checks it on every request.</p>',
      more: '<p class="small"><b>Namespacing</b>: prefix by service (booking_, crm_) so Claude never mixes up two “search” tools.</p><p class="small">MCP or a plain tool? If only one app will ever use it, a plain tool in that app is simpler. MCP pays off when many apps or teams plug in.</p><p class="small">The MCP spec says sign-in is optional. Web servers should use its OAuth flow; local stdio servers read keys from that computer’s environment instead.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Spec an outlet.",
      lead: "Pick a system and who plugs in. Claude drafts the MCP spec your developer builds from.",
      state: { sys: "our booking system", who: "just my team" },
      controls: function (s, esc) {
        function row(k, list) { return '<div class="fridge">' + list.map(function (v) { return '<button type="button" class="chip" data-set="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (s[k] === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>"; }
        return '<p class="label">The system</p>' + row("sys", ["our booking system", "the company wiki", "our customer list (CRM)", "the inventory spreadsheet"]) +
          '<p class="label">Who plugs in</p>' + row("who", ["just me, on my laptop", "just my team", "every location", "outside partners"]);
      },
      head: "ORDER #E02", right: "outlet spec", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        return "Design an MCP server for " + s.sys + ". Who plugs in: " + s.who + ". I don’t code; a developer will build it.\n" +
          "1. MCP server, or a plain tool in one app? Why?\n" +
          "2. A few tools (namespaced name, what it does, read or write), plus resources and prompts.\n" +
          "3. Transport (stdio or Streamable HTTP) and sign-in (OAuth scopes), with reasons.\n" +
          "Unsure a feature exists today? Say so, and name the page to check (modelcontextprotocol.io).";
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
      wrong: "What does Claude actually read?", hint: "It reads each tool’s name, description and input fields.",
      habitTitle: "Architect habit", habit: "Write each tool description like a note to a new hire: what it does, when not to use it, what each input means."
    },
    breaks: {
      title: "An outlet carries power both ways.",
      lines: [
        ["A server is also a door in.", "Anthropic lists connectors in its Directory but doesn’t security-audit MCP servers. Use trusted ones."],
        ["A sign-in key isn’t an approval.", "OAuth limits what the key may reach. A person still approves risky actions."]
      ],
      where: "A wall outlet doesn’t care what you plug in. An MCP tool’s words land on Claude’s counter, so its labels and results steer the chef."
    },
    quiz: [
      { term: "Transport", q: "What does the transport decide?", a: ["How messages travel between the app and the server", "Which tools the server offers", "Who is allowed to sign in"], ok: 0, why: "Right. stdio or Streamable HTTP: the wiring, not the menu." },
      { term: "Scopes", q: "What are OAuth scopes for?", a: ["Limiting what a sign-in key may do", "Naming tools so Claude can find them", "Choosing between stdio and HTTP"], ok: 0, why: "Right. Ask for the smallest scopes the job needs." },
      { term: "Routing", q: "Recall from Lesson 1: which pattern sorts each input, then sends it to a specialist?", a: ["Routing", "Prompt chaining", "Evaluator-optimizer"], ok: 0, why: "Right. The host seats each guest at the right station." }
    ],
    say: "An MCP server is a standard outlet: few clear tools, the right wiring, small scopes.",
    keep: "An MCP server spec a developer can build from, and the questions that decide MCP or a plain tool.",
    cardLabel: "Copy my card",
    card: "STANDARD OUTLET (MCP SERVER DESIGN)\nServer offers tools, resources, prompts\nTransport = the wiring\nstdio = local, the app starts it\nStreamable HTTP = a web server many reach\nOAuth = sign in once; the app gets a limited key\nScopes = what that key may do (keep small)\nNamespacing = booking_search, crm_search",
    real: ["Model Context Protocol: Advanced topics", "https://academy.claude.com/courses/model-context-protocol-advanced-topics"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
