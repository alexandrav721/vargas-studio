/* Build Kit content: rooms, questions, traps, rules, prompts.
   Ideas from "The Vibe Coding Blueprint" (The Automation Guy); all wording here is our own. */
(function () {
  const ASK = "_Not decided yet. Ask me; don't assume._";
  const v = (x) => (Array.isArray(x) ? (x.length ? x : null) : (x && String(x).trim() ? String(x).trim() : null));
  const line = (x) => v(x) || ASK;
  const bullets = (x, fallback) => { const a = v(x); return a ? a.map((s) => "- " + s).join("\n") : (fallback || "- " + ASK); };

  const FONTS = {
    "Friendly & round": { head: "Nunito", body: "Nunito" },
    "Clean & modern": { head: "Inter", body: "Inter" },
    "Classic & editorial": { head: "Fraunces", body: "Source Serif 4" },
    "Techy": { head: "Space Grotesk", body: "Inter" },
  };
  const RADIUS = { Sharp: "2px", Soft: "8px", Round: "16px (buttons: pill)" };

  const ROOMS = [
    {
      id: "prd", file: "PRD.md", name: "What & who", tier: 1, icon: "M6 26V12l10-7 10 7v14H6zM13 26v-8h6v8",
      why: "What you're building, for whom, and what it won't do yet.",
      qs: [
        { id: "name", q: "What's it called?", type: "text", ph: "Walkies", sample: "Walkies", w: 1 },
        { id: "one", q: "Say it in one sentence.", type: "text", ph: "Book a trusted dog walker in your building.", sample: "Book a trusted dog walker who lives in your building.", w: 3 },
        { id: "kind", q: "What kind of thing is it?", type: "choice", opts: ["Website", "Phone app", "Both", "Tool for my team"], sample: "Phone app", w: 2 },
        { id: "who", q: "Who is it for?", type: "text", ph: "Busy dog owners in apartment buildings", sample: "Busy dog owners in big apartment buildings", w: 3 },
        { id: "pain", q: "What's annoying them today?", type: "text", ph: "Walkers are strangers, booking takes texts", sample: "Walker apps send strangers; booking a neighbor takes 10 texts.", w: 3 },
        { id: "must", q: "The 3 things version 1 must do", type: "list", max: 3, ph: "e.g. Book a walk", sample: ["Owners book a walk in 3 taps", "Walkers in the building set their free times", "Both sides get a reminder"], w: 4 },
        { id: "not", q: "What it will NOT do yet", type: "list", max: 4, ph: "e.g. Chat", sample: ["Chat", "Payments in the app", "Cats"], w: 3, hint: "This stops AI from adding features you never asked for." },
        { id: "win", q: "How will you know it's working?", type: "text", ph: "20 walks booked in week 1", sample: "20 walks booked in the first 2 weeks, 5 repeat owners", w: 2 },
      ],
      md: (a) => `# What we're building (PRD)

## In one sentence
**${line(a.name)}**: ${line(a.one)}

- Kind: ${line(a.kind)}
- For: ${line(a.who)}

## The problem
${line(a.pain)}

## Version 1 must
${bullets(a.must)}

## Not in version 1 (don't add these)
${bullets(a.not, "- Nothing listed yet. Ask before adding any feature that isn't in \"Version 1 must\".")}

## Working means
${line(a.win)}

## Done means
- Every "must" works end to end on a phone
- The tests in TESTING.md pass and the build succeeds
- The docs still match the app
`,
    },
    {
      id: "flows", file: "UX_FLOWS.md", name: "The path", tier: 2, icon: "M5 24c6 0 4-8 11-8s5-8 11-8M24 5l3 3-3 3",
      why: "What people actually do, step by step, including when things go wrong.",
      qs: [
        { id: "first", q: "What does someone do in their first minute?", type: "text", ph: "Sees walkers in their building, books one", sample: "Opens the app, sees 3 walkers from their building, books one.", w: 3 },
        { id: "steps", q: "The main path, step by step", type: "list", max: 6, ph: "e.g. Pick a time", sample: ["Open the app", "Pick a day and time", "Pick a walker", "Confirm", "Get a reminder", "See 'Walk done' with a photo"], w: 4 },
        { id: "empty", q: "When there's nothing yet, show…", type: "text", ph: "No walkers yet: invite a neighbor", sample: "No walkers in your building yet. Invite a neighbor.", w: 2 },
        { id: "error", q: "When something fails, say…", type: "text", ph: "Couldn't book that. Try another time.", sample: "That time just got taken. Here are 2 others.", w: 2 },
      ],
      md: (a) => `# User flows

## First minute
${line(a.first)}

## Main path
${v(a.steps) ? a.steps.map((s, i) => `${i + 1}. ${s}`).join("\n") : ASK}

## States every screen needs
- **Loading:** show the layout with soft placeholders, never a blank page
- **Empty:** ${line(a.empty)}
- **Error:** ${line(a.error)} (plain words, no codes, always a next step)
- **Success:** confirm what happened and what's next
`,
    },
    {
      id: "design", file: "DESIGN_SYSTEM.md", name: "Look & feel", tier: 1, icon: "M16 5a11 11 0 1 0 0 22c2 0 2-2 1-3s0-3 2-3h3a5 5 0 0 0 5-5c0-6-5-11-11-11zM10 14h.1M14 9h.1M20 9h.1",
      why: "One look, so every screen matches.",
      qs: [
        { id: "vibe", q: "Pick up to 3 words for the feel", type: "chips", max: 3, opts: ["Calm", "Playful", "Premium", "Bold", "Cozy", "Minimal", "Techy", "Warm"], sample: ["Cozy", "Playful", "Calm"], w: 3 },
        { id: "colors", q: "Your 3 main colors", type: "colors", sample: { main: "#2F6B4F", bg: "#FBF7EF", text: "#1C1B19" }, w: 3 },
        { id: "font", q: "Lettering", type: "choice", opts: Object.keys(FONTS), sample: "Friendly & round", w: 2 },
        { id: "corners", q: "Corners", type: "choice", opts: Object.keys(RADIUS), sample: "Round", w: 1 },
        { id: "love", q: "An app whose look you love", type: "text", ph: "e.g. Airbnb", sample: "Airbnb, but warmer", w: 1 },
      ],
      md: (a) => {
        const c = a.colors || {}; const f = FONTS[a.font];
        return `# Look & feel (design system)

## Feel
${v(a.vibe) ? a.vibe.join(", ") : ASK}${v(a.love) ? `\nInspired by: ${a.love} (borrow the quality, never copy the look)` : ""}

## Colors
- Main (buttons, links): ${c.main || ASK}
- Background: ${c.bg || ASK}
- Text: ${c.text || ASK}
- Use only these plus a red for errors and a green for success. Text must pass 4.5:1 contrast.

## Lettering
${f ? `- Headings: ${f.head}\n- Body: ${f.body} (16px minimum on phones)` : ASK}

## Shapes
- Corners: ${a.corners ? RADIUS[a.corners] : ASK}
- Spacing: steps of 4px (4, 8, 12, 16, 24, 32, 48)

## Every screen
- Reuse the same buttons, inputs and cards. Make a new one only when nothing existing fits.
- Phone first. Works with a keyboard, has visible focus, and never says something by color alone.
`;
      },
    },
    {
      id: "arch", file: "ARCHITECTURE.md", name: "How it works", tier: 1, icon: "M6 6h20v6H6zM6 20h8v6H6zM18 20h8v6h-8zM16 12v4M10 16h12v4M10 16v4",
      why: "The tools it's built with and where everything goes.",
      qs: [
        { id: "stack", q: "What will you build it with?", type: "choice", opts: ["Not sure: suggest one, ask me first", "Next.js + Supabase", "Expo (phone) + Supabase", "Simple website (HTML)", "Lovable / Bolt / Replit"], sample: "Expo (phone) + Supabase", w: 4 },
        { id: "login", q: "How do people sign in?", type: "choice", opts: ["No sign-in", "Email link", "Email + password", "Google / Apple"], sample: "Email link", w: 3 },
        { id: "pay", q: "Does money change hands?", type: "choice", opts: ["No", "One-time payment", "Subscription", "Between users"], sample: "No", w: 3 },
        { id: "host", q: "Where will it live?", type: "choice", opts: ["Not sure", "Vercel", "Cloudflare", "Netlify", "App Store + Google Play"], sample: "App Store + Google Play", w: 2 },
        { id: "rules", q: "Rules for where code goes", type: "chips", opts: ["Screens never talk to the database directly", "One place for each kind of thing", "Keep files small", "Ask before adding a new service"], sample: ["Screens never talk to the database directly", "Ask before adding a new service"], dflt: ["Screens never talk to the database directly", "Ask before adding a new service"], w: 2 },
      ],
      md: (a) => `# How it works (architecture)

## Built with
- Stack: ${line(a.stack)}
- Sign-in: ${line(a.login)}
- Money: ${line(a.pay)}${a.pay && a.pay !== "No" ? " (use Stripe unless DECISIONS.md says otherwise)" : ""}
- Lives on: ${line(a.host)}

## The shape
Person → screens → app logic → data
Each layer only talks to the one next to it.

## Rules
${bullets(a.rules)}

## If something fails
- Data unreachable or slow: show a friendly message and keep what the person typed
- A service (email, payments) fails: retry once, then tell the person and log it
`,
    },
    {
      id: "data", file: "DATABASE.md", name: "What it remembers", tier: 2, icon: "M6 8c0-2 4-3 10-3s10 1 10 3-4 3-10 3S6 10 6 8zM6 8v16c0 2 4 3 10 3s10-1 10-3V8M6 16c0 2 4 3 10 3s10-1 10-3",
      why: "The things it stores and how they connect, so AI never invents tables.",
      qs: [
        { id: "things", q: "What does it keep track of?", type: "list", max: 6, ph: "e.g. Dogs", sample: ["People (owners and walkers)", "Dogs", "Free times", "Walks"], w: 4 },
        { id: "links", q: "How are they connected?", type: "text", ph: "One owner has many dogs; a walk has one walker", sample: "One owner has many dogs. A walk has one dog, one walker and one time.", w: 3 },
        { id: "private", q: "Which private info does it hold?", type: "chips", opts: ["Emails", "Phone numbers", "Home addresses", "Payments", "Health info", "Kids' info", "Location", "None"], sample: ["Emails", "Home addresses", "Phone numbers"], w: 3 },
        { id: "del", q: "When someone deletes something…", type: "choice", opts: ["It's gone for good", "It's hidden (can undo)"], sample: "It's hidden (can undo)", w: 2 },
      ],
      md: (a) => `# What it remembers (data)

## Things we store
${bullets(a.things)}
Names: lowercase, plural, with underscores (e.g. \`walk_times\`). Every table has \`id\`, \`created_at\`, \`updated_at\`.

## How they connect
${line(a.links)}

## Private info
${v(a.private) ? a.private.map((p) => "- " + p).join("\n") + "\nOnly the owner (and people they choose) can read these. Never log them." : ASK}

## Deleting
${a.del === "It's gone for good" ? "Deleting removes the data for good. Ask \"Are you sure?\" first." : a.del ? "Deleting hides it (a `deleted_at` date); it can be restored." : ASK}

## Changing the data
Every change gets a migration, is written here first, and must not break existing data.
`,
    },
    {
      id: "api", file: "API.md", name: "How parts talk", tier: 2, icon: "M8 10h14l-4-4M24 22H10l4 4",
      why: "The requests the app sends, so both sides agree.",
      qs: [
        { id: "acts", q: "What does the app ask the server to do?", type: "list", max: 6, ph: "e.g. Book a walk", sample: ["List walkers in my building", "Book a walk", "Cancel a walk", "Set my free times"], w: 3 },
        { id: "who", q: "Which of those need sign-in?", type: "choice", opts: ["All of them", "All except browsing", "None"], sample: "All of them", w: 2 },
      ],
      md: (a) => `# How parts talk (API)

## Requests
${v(a.acts) ? a.acts.map((s) => `- **${s}**: sign-in ${a.who === "None" ? "not needed" : a.who === "All except browsing" && /list|browse|see|view/i.test(s) ? "not needed" : "required"}; check the person may do this`).join("\n") : ASK}

## Every response looks the same
Success: \`{ "data": { … }, "error": null }\`
Problem: \`{ "data": null, "error": { "code": "WALK_TAKEN", "message": "That time was just booked." } }\`

## Rules
- Check every input on the server
- Check sign-in and permission on the server, every time
- Never send back passwords, keys or other people's private info
`,
    },
    {
      id: "security", file: "SECURITY.md", name: "Locks & keys", tier: 2, icon: "M10 14V10a6 6 0 0 1 12 0v4M7 14h18v12H7zM16 19v3",
      why: "Who can see what, and where secrets live.",
      qs: [
        { id: "roles", q: "Kinds of people using it", type: "chips", opts: ["Owner", "Member", "Admin", "Guest", "Walker", "Customer", "Staff"], sample: ["Owner", "Walker", "Admin"], w: 3 },
        { id: "see", q: "Who can see whose stuff?", type: "text", ph: "Walkers see only the dogs they walk", sample: "Owners see their own dogs and walks. Walkers see only the walks booked with them, never home addresses until booked.", w: 4 },
        { id: "uploads", q: "Can people upload files?", type: "choice", opts: ["No", "Photos", "Any files"], sample: "Photos", w: 2 },
      ],
      md: (a) => `# Locks & keys (security)

## People
${bullets(a.roles)}

## Who sees what
${line(a.see)}
Enforce this on the server (database rules), not just by hiding buttons.

## Secrets
- Keys and passwords live in secret settings (environment variables), never in the code or the page
- Never commit real secrets; keep a \`.env.example\` with names only

## Uploads
${a.uploads === "No" ? "No uploads." : a.uploads ? `${a.uploads}: check type and size on the server (max 10 MB), store privately, strip location data from photos.` : ASK}

## Never log
Passwords, keys, tokens, private info.
`,
    },
    {
      id: "code", file: "CODE_STYLE.md", name: "House rules", tier: 2, icon: "M11 9l-6 7 6 7M21 9l6 7-6 7",
      why: "How AI should write code so it stays tidy.",
      qs: [
        { id: "do", q: "Rules for the code (we picked the usual ones)", type: "chips", opts: ["Reuse before creating", "Small, focused changes", "No new packages without asking", "Don't touch unrelated files", "Clear names over clever code", "Comments explain why, not what", "Remove dead code"], dflt: ["Reuse before creating", "Small, focused changes", "No new packages without asking", "Don't touch unrelated files"], sample: ["Reuse before creating", "Small, focused changes", "No new packages without asking", "Don't touch unrelated files", "Clear names over clever code"], w: 3 },
      ],
      md: (a) => `# House rules (code style)

${bullets(a.do)}
- Follow the patterns already in the project before inventing new ones
- Use the project's formatter and linter; fix what they flag
`,
    },
    {
      id: "testing", file: "TESTING.md", name: "Proof it works", tier: 2, icon: "M6 17l6 6L26 9",
      why: "What must never break, and what 'done' means.",
      qs: [
        { id: "never", q: "3 things that must never break", type: "list", max: 3, ph: "e.g. Booking a walk", sample: ["Signing in", "Booking a walk", "Seeing only your own dogs"], w: 4 },
        { id: "done", q: "'Done' means…", type: "chips", opts: ["Tests pass", "Build passes", "I tried it on my phone", "Checked on slow internet", "Checked with a screen reader"], dflt: ["Tests pass", "Build passes", "I tried it on my phone"], sample: ["Tests pass", "Build passes", "I tried it on my phone"], w: 2 },
      ],
      md: (a) => `# Proof it works (testing)

## Must never break
${bullets(a.never)}
Each of these gets an automatic test that runs before every release.

## Done means
${bullets(a.done)}

"The page loaded" is not done.
`,
    },
    {
      id: "agents", file: "AGENTS.md", name: "AI's job", tier: 1, icon: "M9 12h14v12H9zM13 17h.1M19 17h.1M14 21h4M16 8v4M12 8h8",
      why: "How the AI should behave. Most AI coding tools read this file.",
      qs: [
        { id: "ask", q: "AI must ask before…", type: "chips", opts: ["Adding a package", "Changing the data", "Deleting files", "Changing the look", "Adding a feature", "Touching sign-in or payments"], dflt: ["Adding a package", "Changing the data", "Deleting files", "Adding a feature"], sample: ["Adding a package", "Changing the data", "Deleting files", "Adding a feature", "Touching sign-in or payments"], w: 3 },
        { id: "talk", q: "Explain things to me like…", type: "choice", opts: ["I'm new to code", "I'm a coworker", "Just show the code"], sample: "I'm new to code", w: 1 },
        { id: "plan", q: "Before big changes…", type: "choice", opts: ["Show me a plan first", "Just build it"], dflt: "Show me a plan first", sample: "Show me a plan first", w: 2 },
      ],
      md: (a, all, rooms) => `# Instructions for the AI

## Read first
Before changing anything, read the files in \`/docs\`:
${rooms.filter((r) => r.id !== "agents").map((r) => "- " + r.file).join("\n")}
They are the source of truth. If something you need isn't there, **ask; don't guess**. If two docs disagree, point it out.

## Ask before
${bullets(a.ask)}

## How to work
${a.plan === "Just build it" ? "- Small changes: just build them. Big ones: say what you'll change first." : "- For anything bigger than a small fix: read the docs and code, then show a short plan (what changes, which files, data or security changes, what to test). Wait for my OK."}
- Make the smallest change that works. Reuse what exists. Don't touch unrelated files.
- After: run the tests, lint, type check and build; review your own changes; tell me what's left.
- If the change makes a doc wrong, update that doc.

## Talking to me
${a.talk === "Just show the code" ? "Be brief: show the change and one line on why." : a.talk === "I'm a coworker" ? "Plain and direct, like a teammate." : a.talk ? "Plain words, no jargon. Explain what you did and what I should check, in a few lines." : ASK}
`,
    },
    {
      id: "env", file: "ENVIRONMENT.md", name: "Keys list", tier: 3, icon: "M20 12a4 4 0 1 0-4 4l-8 8v2h3v-2h2v-2h2l3-3",
      why: "Every secret setting it needs, by name only.",
      qs: [
        { id: "svc", q: "Which outside apps does it use?", why: "Like payments or email. Each one needs a secret key.", opt: true, type: "chips", opts: ["Supabase", "Stripe", "Anthropic / OpenAI", "Email (Resend…)", "Maps", "Analytics", "None"], sample: ["Supabase", "Email (Resend…)"], w: 2 },
      ],
      md: (a) => {
        const M = { "Supabase": ["SUPABASE_URL (public)", "SUPABASE_ANON_KEY (public)", "SUPABASE_SERVICE_ROLE_KEY (secret, server only)"], "Stripe": ["STRIPE_PUBLISHABLE_KEY (public)", "STRIPE_SECRET_KEY (secret)", "STRIPE_WEBHOOK_SECRET (secret)"], "Anthropic / OpenAI": ["AI_API_KEY (secret, server only)"], "Email (Resend…)": ["EMAIL_API_KEY (secret)"], "Maps": ["MAPS_KEY (public, locked to your domain)"], "Analytics": ["ANALYTICS_ID (public)"] };
        const rows = (a.svc || []).flatMap((s) => M[s] || []);
        return `# Keys list (environment)

${rows.length ? rows.map((r) => "- `" + r.replace(" (", "` (")).join("\n") : v(a.svc) ? "No keys needed." : ASK}

## Rules
- Names live in \`.env.example\`; real values never get committed
- Secret keys never reach the browser or the app bundle
- Separate values for testing and live
`;
      },
    },
    {
      id: "errors", file: "ERROR_HANDLING.md", name: "When things break", tier: 3, icon: "M16 5l12 21H4zM16 13v6M16 22h.1",
      why: "What people see when something goes wrong.",
      qs: [
        { id: "tone", q: "Error messages should sound…", type: "choice", opts: ["Calm and kind", "Short and direct", "A little playful"], sample: "Calm and kind", w: 2 },
        { id: "retry", q: "If the internet drops…", type: "choice", opts: ["Retry quietly, then tell them", "Tell them right away"], sample: "Retry quietly, then tell them", w: 1 },
      ],
      md: (a) => `# When things break

## Voice
${line(a.tone)}. Say what happened, that their work is safe (if it is), and one thing to do next. Never show codes or stack traces.

## Cases
- Not signed in → take them to sign-in, then back where they were
- Not allowed → "You don't have access to this." with a way back
- Not found → "We can't find that." with a way back
- Too many tries → "Give it a minute and try again."
- Our fault → "Something broke on our side. We're on it."
- Internet drops → ${line(a.retry)}
`,
    },
    {
      id: "watch", file: "OBSERVABILITY.md", name: "Keep an eye on it", tier: 3, icon: "M3 16s5-8 13-8 13 8 13 8-5 8-13 8S3 16 3 16zM16 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
      why: "What you want to be told about once it's live.",
      qs: [
        { id: "tell", q: "Tell me when…", type: "chips", opts: ["Errors spike", "Someone signs up", "A payment fails", "Pages get slow", "It goes down"], sample: ["Errors spike", "It goes down", "Someone signs up"], w: 2 },
      ],
      md: (a) => `# Keep an eye on it

## Alert me when
${bullets(a.tell)}

## Log
Errors, sign-ins, and key actions (${"e.g. bookings"}). Never passwords, keys, tokens or private info.
`,
    },
    {
      id: "deploy", file: "DEPLOYMENT.md", name: "Going live", tier: 3, icon: "M16 4c5 3 7 9 6 15l-6 4-6-4c-1-6 1-12 6-15zM13 26l3 3 3-3",
      why: "The steps to release, and how to undo a bad one.",
      qs: [
        { id: "stage", q: "Try it on a test version first?", type: "choice", opts: ["Yes, always", "No, straight to live"], sample: "Yes, always", w: 2 },
        { id: "undo", q: "If a release goes wrong…", type: "choice", opts: ["Roll back to the last good version", "Fix it forward"], sample: "Roll back to the last good version", w: 2 },
      ],
      md: (a) => `# Going live

## Every release
1. Tests, lint and build pass
2. ${a.stage === "No, straight to live" ? "Release to live" : "Release to the test version and click through the main path"}
3. ${a.stage === "No, straight to live" ? "Click through the main path on live" : "Release to live"}
4. Check errors for 15 minutes

## If it goes wrong
${line(a.undo)}
`,
    },
    {
      id: "decisions", file: "DECISIONS.md", name: "Why we chose", tier: 3, icon: "M8 5h16v22l-8-5-8 5z",
      why: "Big choices written once, so nobody re-argues them.",
      qs: [
        { id: "one", q: "One decision you never want to re-argue", type: "text", ph: "We use Supabase, not Firebase", sample: "We use Supabase for data and sign-in (not Firebase), because it's what we know and it has database rules.", w: 2 },
      ],
      md: (a, all) => `# Decisions

## 001: How it's built
- Decided: ${all.arch && all.arch.stack ? all.arch.stack : ASK}
- Why: ${ASK}

## 002
${line(a.one)}

_Add a new numbered entry for every big choice: what, why, what else we considered, the tradeoff._
`,
    },
    {
      id: "roadmap", file: "ROADMAP.md", name: "Now, next, later", tier: 3, icon: "M5 8h6M5 16h12M5 24h18",
      why: "What's now, what's later, and what's not planned, so AI stops suggesting extras.",
      qs: [
        { id: "next", q: "What comes after version 1?", type: "list", max: 4, ph: "e.g. Payments", sample: ["Pay in the app", "Walk photos"], w: 2 },
      ],
      md: (a, all) => `# Roadmap

## Now (version 1)
${bullets(all.prd && all.prd.must)}

## Next
${bullets(a.next)}

## Not planned
${bullets(all.prd && all.prd.not, "- Ask before adding anything not listed here")}
`,
    },
    {
      id: "changelog", file: "CHANGELOG.md", name: "What changed", tier: 3, icon: "M16 9v7l4 3M16 28a12 12 0 1 0 0-24 12 12 0 0 0 0 24z",
      why: "A running list of what changed in each release.",
      qs: [
        { id: "ok", q: "We'll start it for you. Add a line each release.", type: "choice", opts: ["Sounds good"], sample: "Sounds good", w: 1 },
      ],
      md: () => `# What changed

## 0.1.0 (${new Date().toISOString().slice(0, 10)})
### Added
- The plan: everything in /docs

_Each release: Added / Changed / Fixed / Removed._
`,
    },
  ];

  const TRAPS = {
    prd: { say: "AI: \"Done! I also added a chat feature.\"", bad: "Nice, keep it", good: "It's on my NOT list", rule: 1, lesson: "Your \"not yet\" list is what stops surprise features." },
    design: { say: "Your new page has rounder buttons and a different blue.", bad: "Redesign every page to match", good: "Tell AI: follow Look & feel", rule: 2, lesson: "One written look keeps every screen the same." },
    arch: { say: "AI wants to add a second database \"to make it easier\".", bad: "Sure, go ahead", good: "Check How it works first", rule: 3, lesson: "Decide once, write it down, stop re-deciding." },
    data: { say: "AI created a table called users2.", bad: "Ship it", good: "Stop: match What it remembers", rule: 4, lesson: "AI follows your data map instead of inventing tables." },
    security: { say: "AI put your payment key in the page code.", bad: "Fine for now", good: "Move it to a secret setting", rule: 5, lesson: "Anyone can read page code. Keys stay secret." },
    testing: { say: "AI: \"Finished! The page loads.\"", bad: "Great, ship it", good: "Test the 3 things that can't break", rule: 6, lesson: "\"It loaded\" isn't done. Proof is." },
    agents: { say: "You asked for one button. AI changed 30 files.", bad: "Must be needed", good: "Ask for a plan, then small changes", rule: 7, lesson: "Plan first, then the smallest change that works." },
  };

  const RULES = [
    { t: "Context first", d: "Tell AI everything before it types anything." },
    { t: "Say what it won't do", d: "A \"not yet\" list stops surprise features." },
    { t: "One look", d: "Point AI to your look & feel every time." },
    { t: "Decide once", d: "Write big choices down so nobody re-decides them." },
    { t: "Data has a map", d: "AI follows your map, never invents tables." },
    { t: "Secrets stay secret", d: "Keys live in secret settings, never in the page." },
    { t: "Prove it", d: "Test what must never break before you call it done." },
    { t: "Small steps", d: "Plan, check the plan, then focused changes." },
    { t: "Keep it fresh", d: "When the app changes, update the plan." },
  ];

  const LOOP = [
    { k: "Context", d: "AI reads the plan and tells you what it understood.", p: (n) => `I'm building ${n.name || "an app"}${n.one ? ": " + n.one : ""}. The full plan is in /docs.\n\nBefore writing any code: read every file in /docs, tell me in 5 bullets what you understood, and list anything missing or contradicting. If something isn't in the docs, ask me instead of guessing. Don't write code until I say the plan is right.` },
    { k: "Plan", d: "For each feature, a short plan before any code.", p: () => `I want to add: [describe the feature].\n\nDon't change anything yet. Read the docs and the code this touches, then give me a short plan: what will change, which files, any data, API or security changes, what you'll test, and what could go wrong.` },
    { k: "Check the plan", d: "You read it. Push back. This is where you stay in charge.", p: () => `Before you build: does this plan follow /docs? Is anything in it on the "not in version 1" list? Is there a smaller way to do it?` },
    { k: "Build", d: "The smallest change that works.", p: () => `The plan is approved. Make the smallest change that does it. Follow /docs, reuse what already exists, and don't add packages or touch unrelated files without asking.` },
    { k: "Check the work", d: "Tests, build, and AI reviews itself like a strict senior.", p: () => `Now check your work: run the tests, lint, type check and build. Then review your own changes like a strict senior engineer, against /docs: missing loading/empty/error states, security, data, phone layout, accessibility, anything you changed by accident. List the problems by how serious they are before fixing anything.` },
    { k: "Update the plan", d: "If the app changed, the docs change too.", p: () => `Did this change make anything in /docs out of date (features, look, data, security, rules)? If yes, update those files and tell me what you changed.` },
  ];

  const SIZES = [
    { tier: 1, name: "Quick plan", rooms: 4, time: "about 10 min", for: "A small project or a first try" },
    { tier: 2, name: "Real app", rooms: 10, time: "about 25 min", for: "Sign-in, data, other people using it" },
    { tier: 3, name: "Launch-ready", rooms: 17, time: "about 40 min", for: "Going live with real users" },
  ];

  const ORDER = ["prd", "flows", "design", "arch", "data", "api", "security", "code", "testing", "agents", "env", "errors", "watch", "deploy", "decisions", "roadmap", "changelog"];

  window.KIT = { ROOMS, TRAPS, RULES, LOOP, SIZES, ORDER, FONTS };
})();
