/* AI Made EZ · Level 5 · Lesson 6 · Locks and keys (security for agents). Terms: least privilege, untrusted content, lethal trifecta, network allowlist, vault, approval gate. */
(function () {
  var L = {
    n: 6, id: "e6", mins: 7, title: "Locks and keys.", stamp: "Locks",
    seen: ["Prompt injection", "Human in the loop"], terms: ["Least privilege", "Untrusted content", "Lethal trifecta", "Network allowlist", "Vault", "Approval gate"],
    teaser: ["LOCKS & KEYS", "agent security", "Level 3 spotted hidden instructions.<br>Now fit the locks: each cook gets<br>one key. Nobody gets the safe.", "Six words. Seven minutes."],
    lines: [
      ["Least privilege: only the keys the job needs.", "Fewer tools, fewer websites, read-only wherever you can."],
      ["Anything Claude reads can carry orders.", "Emails, web pages, files. That’s how prompt injection gets in."],
      ["Lock the doors that can’t be undone.", "Sends, payments and deletes wait for a person: an approval gate."]
    ],
    guess: { q: "An agent reads customer emails and can also send email. What’s the risk?", opts: [["An email tells it to forward private data", true], ["It replies too politely", false], ["It reads too slowly", false]], reveal: "Text inside an email can act like an order. If the agent can also send, private data can walk out the door." },
    startLabel: "Check the locks",
    example: {
      title: "The lethal trifecta.",
      html:
        '<p class="label">Three legs <span class="sample">Simplified</span></p><div class="fridge"><span class="tag">Private data</span><span class="tag">Untrusted content</span><span class="tag">A way to send out</span></div>' +
        '<p class="small">Developer Simon Willison named it in June 2025. With all three, one poisoned page can leak your data. Remove any leg.</p>' +
        '<p class="label" style="margin-top:14px">Locks Anthropic recommends for Managed Agents</p><div class="ticket"><div class="th"><span>LOCKS</span><span>5 settings</span></div>' +
        'Network: limited, only the hosts it needs<br>Secrets: in a vault, sandbox sees a placeholder<br>Tools: built-ins on, web search and fetch off till needed<br>Can’t undo it? Ask first (always_ask)<br>A spend cap on every session' +
        '<div class="tf">From “Secure your Managed Agents deployment”</div></div>',
      more: '<p class="small">Claude Code can sandbox its Bash commands at the operating-system level, so the walls hold whatever command the model chose to run.</p><p class="small">A prompt that says “ignore bad instructions” steers. It isn’t a lock.</p>',
      next: "Your turn →"
    },
    build: {
      title: "Your turn. Lock the doors.",
      lead: "Pick an agent and what it touches. Get a lock list with an owner on each.",
      state: { agent: "an inbox assistant", touch: ["Reads email", "Can send email"], out: "Plan only" },
      controls: function (s, esc) {
        var agents = ["an inbox assistant", "a web research agent", "a coding agent", "a finance helper"];
        var touch = ["Reads email", "Can send email", "Browses the web", "Sees customer data", "Can spend money", "Can delete files"];
        return '<p class="label">The agent</p><div class="fridge">' + agents.map(function (v) { return '<button type="button" class="chip" data-set="agent" data-v="' + esc(v) + '" aria-pressed="' + (s.agent === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>" +
          '<p class="label">What it touches (tap any)</p><div class="fridge">' + touch.map(function (v) { return '<button type="button" class="chip" data-set="touch" data-multi="1" data-v="' + esc(v) + '" aria-pressed="' + (s.touch.indexOf(v) >= 0) + '">' + esc(v) + "</button>"; }).join("") + "</div>" +
          '<p class="label">What you get</p><div class="fridge">' + ["Plan only", "Plan + starter file"].map(function (v) { return '<button type="button" class="chip" data-set="out" data-v="' + esc(v) + '" aria-pressed="' + (s.out === v) + '">' + esc(v) + "</button>"; }).join("") + "</div>";
      },
      head: "ORDER #E06", right: "lock check", foot: "Paste it into Claude, or open it there",
      text: function (s) {
        var starter = s.out === "Plan + starter file" ? "\nThen a starter permission policy as JSON for my developer: each tool on or off, runs alone or asks first. Mark it a draft." : "";
        return "Security review for " + s.agent + ". It touches: " + (s.touch.join(", ") || "help me list it") + ". I don’t code.\n" +
          "1. Lethal trifecta (private data, untrusted content, a way out): which leg can we cut?\n" +
          "2. Least privilege: only tools and sites it needs.\n" +
          "3. Where secrets live, out of its sight.\n" +
          "4. What waits for a person.\n" +
          "5. What we log; how we stop it fast.\n" +
          "For each: the lock, why, owner. Unsure a setting exists? Say so." + starter;
      },
      claude: "Open in Claude", done: "Done →",
      after: "Give each owner their line today. A lock nobody owns stays open."
    },
    game: {
      type: "pick", title: "Your research agent reads the web and can email anyone. Best first fix?",
      options: [
        ["Let it email only your team, after a person approves", true],
        ["Tell it in the prompt to ignore bad instructions", false, "Prompts steer. They aren’t locks. Injected text can talk around them."],
        ["Switch to a bigger model", false, "Smarter models still read injected text. Remove a leg of the trifecta."]
      ],
      right: "Yes. The way out is now narrow and gated. Cutting it fully (no send) is safer still.",
      wrong: "Which leg of the trifecta can you cut?", hint: "Look at the way out.",
      habitTitle: "Architect habit", habit: "For every tool, ask: what’s the worst it could do if the agent were tricked? Gate that."
    },
    breaks: {
      title: "No lock is perfect.",
      lines: [
        ["Every defense lowers risk. None ends it.", "Claude Code’s own docs say no system is immune to every attack."],
        ["Too many approvals wear thin.", "People start clicking yes. Gate what can’t be undone, not everything."]
      ],
      where: "A real thief has to break in. Here the thief can be one sentence in a document the chef was asked to read."
    },
    quiz: [
      { term: "Lethal trifecta", q: "What are the three legs of the lethal trifecta?", a: ["Private data, untrusted content, a way to send out", "Tools, resources and prompts", "Cost, speed and accuracy"], ok: 0, why: "Right. Cut any one leg and the attack can’t finish." },
      { term: "Vault", q: "Why keep an API key in a Managed Agents vault?", a: ["The sandbox only sees a placeholder, not the key", "It makes the agent run faster", "So the agent can share it with users"], ok: 0, why: "Right. The real key is added on the way out, only to allowed hosts." },
      { term: "Permission policy", q: "Recall from Lesson 3: what does a tool set to always_ask do?", a: ["Pauses until a person approves", "Runs without asking", "Asks Claude to double-check itself"], ok: 0, why: "Right. That’s an approval gate in settings." }
    ],
    say: "Fewest keys, everything it reads is untrusted, and a gate on what can’t be undone.",
    keep: "The trifecta test for any agent pitch, and a lock-by-lock checklist with owners.",
    cardLabel: "Copy my card",
    card: "LOCKS AND KEYS (AGENT SECURITY)\nLeast privilege = only the keys the job needs\nUntrusted content = anything Claude reads can carry orders\nLethal trifecta = data + untrusted content + a way out; cut one\nNetwork allowlist = only listed hosts\nVault = secrets the sandbox never sees\nApproval gate = a person says yes first\nPrompts steer; settings lock",
    real: ["Claude Code in action (permission modes and hooks)", "https://academy.claude.com/courses/claude-code-in-action"]
  };
  document.addEventListener("DOMContentLoaded", function () { BK.run(L); });
})();
