// AI Made EZ, week 1 (24 Nov 2026), in a wire-service frame with the AI Made EZ voice.
// Every post: one idea, a known name or a "you" stake early, a hard number when one exists, no emoji, no hashtags.
// Captions: lede, how it works, proof, However, In plain words (the kitchen line), follow line, source.
// Images: set img to a licensed file in img/ (credit in CREDITS.md and the caption); null = a type-only card.
export const FOLLOW = "Follow [@yourhandle] for AI news in plain words.";

const PROMPT = "Plan 5 dinners for this week.\nFridge: eggs, spinach, rice, cheese.\nNever use: mushrooms.\n30 minutes or less.";

export const POSTS = [
  {
    id: "kitchen", before: "kitchen", label: "PLAIN WORDS", formula: "Number first + pain point", image: "Kitchen photo (licensed)",
    slides: [
      { t: "card", label: "Plain words", head: "Claude is just a chef: the 5 AI words people overcomplicate, explained with your kitchen", img: "/projects/skill-quest/school/social/img/kitchen.jpg", ground: "chef" },
      { t: "inner", label: "Plain words", title: "AI is a kitchen.", html: `<ul class="ez-rows"><li><b>Claude</b><span>the chef</span></li><li><b>Your prompt</b><span>your order</span></li><li><b>A skill</b><span>a recipe card</span></li><li><b>A connector</b><span>the pantry door</span></li><li><b>A blind test</b><span>a taste test</span></li></ul>` },
    ],
    caption: [
      "Claude, ChatGPT and Gemini all work the same way: they cook whatever you order, but they have never tasted food.",
      "Your prompt is the order. A skill is a recipe card the chef pulls out when your order matches it. A connector is the pantry door: it lets the chef reach your calendar or email, and you decide if it has to ask first.",
      "Every one of these has a scarier name you've heard in a meeting. None of them needs code.",
      "However, a chef can taste and AI can't. That's why you check the plate before you serve it.",
      "In plain words: you don't need to learn the machine. You need to learn how to order.",
      FOLLOW,
      "Source: AI Made EZ, Lesson 1 (free).",
      "Photo: Paul Keller, CC BY 2.0, via Wikimedia Commons",
    ],
  },
  {
    id: "order", before: "order", label: "PLAIN WORDS", formula: "Multiplier (before and after)", image: "Order tickets (licensed) or type-only",
    slides: [
      { t: "card", label: "Plain words", head: "Your prompt is just an order: 4 lines turn a vague AI answer into this week's dinners", img: "/projects/skill-quest/school/social/img/order.jpg", ground: "order" },
      { t: "inner", label: "Same chef, better order", title: "Vague order, vague dinner.", html: `<div class="ez-vs"><div class="ez-tk bad"><small>ORDER #001</small>Plan dinners.</div><div class="ez-tk"><small>ORDER #002</small>Plan 5 dinners for this week. Fridge: eggs, spinach, rice, cheese. Never use: mushrooms. 30 minutes or less.</div></div><div class="ez-plain"><b>In plain words</b>Say what you have, what you never want, and how much time you've got.</div>` },
    ],
    caption: [
      "Ask Claude or ChatGPT to \"plan dinners\" and you get a generic list. Add 4 lines and you get your week.",
      "The 4 lines: how many meals, what's in your fridge, what you never eat, and your time limit.",
      "Order #002 on slide 2 is the whole prompt. Copy it, swap in your fridge, send it.",
      "However, it can still suggest something you don't have. Read the plan before you shop.",
      "In plain words: same chef, better order.",
      FOLLOW,
      "Source: AI Made EZ, Lesson 2 (free).",
      "Photo: USDA, public domain, via Wikimedia Commons",
    ],
  },
  {
    id: "guess", before: "guess", label: "PLAIN WORDS", formula: "Your stakes", image: "Plate check (licensed) or type-only",
    slides: [
      { t: "card", label: "Plain words", head: "ChatGPT and Claude can sound completely sure and still be wrong. Here's the 1 habit that catches it", img: "/projects/skill-quest/school/social/img/guess.jpg", ground: "check" },
    ],
    caption: [
      "AI tools can state a wrong name, date, price or address with total confidence. The industry calls it a \"hallucination.\"",
      "It happens because the model writes what sounds likely, not what it has checked.",
      "It shows up most in the details you'd be embarrassed to get wrong: quotes, numbers, opening hours, citations.",
      "However, it isn't lying on purpose, and no AI model is free of it yet.",
      "In plain words: a confident wrong plate. Taste before you serve: check names, dates, prices and addresses before you use them.",
      FOLLOW,
      "Source: AI Made EZ, Lesson 4 (free).",
      "Photo: Lance Cpl. Unique B. Roberts, U.S. Marine Corps, public domain, via Wikimedia Commons",
    ],
  },
  {
    id: "prompt", before: "prompt", label: "NO GATEKEEPING", formula: "Irony (no DMs)", image: "Home fridge (licensed) or type-only",
    slides: [
      { t: "card", label: "No gatekeeping", head: "No DMs, no email list: the full 4-line dinner prompt people make you comment for, free", img: "/projects/skill-quest/school/social/img/prompt.jpg", ground: "free" },
      { t: "inner", label: "Copy this", title: "Here it is.", html: `<div class="ez-tk" style="font-size:40px">${PROMPT.replace(/\n/g, "<br>")}</div><div class="ez-plain"><b>In plain words</b>Swap in what's in your fridge. That's the whole secret.</div>` },
    ],
    caption: [
      "Here's the whole prompt. No \"comment PROMPT\", no DM, no email list.",
      PROMPT,
      "Swap in what's actually in your fridge, the one thing you never eat, and your real time limit.",
      "However, check the plan for anything you're allergic to before you cook. AI doesn't know your kitchen unless you tell it.",
      "In plain words: there is no secret prompt. There's a clear order.",
      FOLLOW,
      "Source: AI Made EZ, Lesson 1 (free).",
      "Photo: Lance Cheung, USDA, public domain, via Wikimedia Commons",
    ],
  },
  {
    id: "need", before: "need", label: "NO GATEKEEPING", formula: "Number first", image: "Laptop at a kitchen table (licensed) or type-only",
    slides: [
      { t: "card", label: "No gatekeeping", head: "To use Claude or ChatGPT you need 0 lines of code, $0 and 1 clear order", img: "/projects/skill-quest/school/social/img/need.jpg", ground: "$0" },
    ],
    caption: [
      "Claude and ChatGPT both have free plans, and neither one needs a single line of code.",
      "What makes the answer good is the order: what you want, who it's for, what to avoid.",
      "Courses selling \"secret prompts\" are selling the part you can learn in 10 minutes.",
      "However, free plans have daily limits, and paid plans add more use and newer features.",
      "In plain words: you're not behind. You just haven't been told how to order.",
      FOLLOW,
      "Source: AI Made EZ, free lessons.",
      "Photo: Microbiz Mag (microbizmag.co.uk), CC BY 2.0, via Wikimedia Commons",
    ],
  },
  {
    id: "words", before: "words", label: "PLAIN WORDS", formula: "How to (decode)", image: "Dictionary close-up (licensed) or type-only",
    slides: [
      { t: "card", label: "Plain words", head: "API, MCP, RAG and agents: the 4 words people use to sound fancy, decoded in 1 minute", img: "/projects/skill-quest/school/social/img/words.jpg", ground: "API" },
      { t: "inner", label: "Plain words", title: "What they really mean.", html: `<ul class="ez-rows"><li><b>API</b><span>the order window other apps use</span></li><li><b>MCP</b><span>a standard plug so your apps connect to AI</span></li><li><b>RAG</b><span>the recipe binder: it looks things up first</span></li><li><b>Agent</b><span>a chef running the whole dinner alone</span></li></ul>` },
    ],
    caption: [
      "These 4 words come up in every AI pitch and meeting. None of them is hard.",
      "API: how other apps send orders to the AI. MCP: a standard plug, so your calendar or files can connect to an AI app. RAG: the AI looks up your documents before it answers. Agent: an AI that picks its own steps until a job is done.",
      "Each one has a free 6-minute lesson with a kitchen picture.",
      "However, \"agent\" gets stuck on lots of products that are just a chat window. Ask what it actually does on its own.",
      "In plain words: if someone can't explain it simply, they're selling it.",
      FOLLOW,
      "Source: AI Made EZ, Level 2 (free).",
      "Photo: Till Niermann, CC BY-SA 3.0, via Wikimedia Commons",
    ],
  },
  {
    id: "layers", before: "layers", label: "PLAIN WORDS", formula: "Old problem, new answer (demystify)", image: "Chip or data center (licensed) or type-only",
    slides: [
      { t: "card", label: "Plain words", head: "Many AI apps you pay for run on Claude, GPT or Gemini underneath. Here are all 5 layers", img: "/projects/skill-quest/school/social/img/layers.jpg", ground: "layers" },
      { t: "inner", label: "Plain words", title: "It's all wrappers.", html: `<ul class="ez-rows"><li><b>You</b><span>ask</span></li><li><b>Apps</b><span>wrap a model and add steps</span></li><li><b>Models</b><span>Claude, GPT, Gemini: they write</span></li><li><b>Chips</b><span>turn electricity into math</span></li><li><b>Electricity</b><span>powers it all</span></li></ul>` },
    ],
    caption: [
      "Most AI products are layers on top of other layers, and once you see them, nothing about AI feels magic.",
      "Apps wrap a model like Claude, GPT or Gemini and add their own screens, questions and steps. The models run on chips. The chips run on electricity.",
      "That's why two different apps can give you oddly similar answers.",
      "However, a good wrapper is worth paying for when it adds something real: your data, a better design, or a whole workflow.",
      "In plain words: before you pay for an AI app, ask what it adds on top of the model.",
      FOLLOW,
      "Source: AI Made EZ, Lesson 11 (free).",
      "Photo: Fritzchens Fritz, CC0, via Wikimedia Commons",
    ],
  },
  {
    id: "guide-dinner", before: null, label: "AI MADE EZ GUIDES", formula: "How to", image: "Type-only cover; real prompt on every step",
    slides: [
      { t: "card", label: "AI Made EZ guides", head: "How to plan 5 dinners from what's in your fridge with Claude or ChatGPT in 1 message", img: null, ground: "dinner", typeOk: true },
      { t: "step", n: 1, title: "Open a new chat.", ticket: ["Plan 5 dinners for this week."], added: 1, lines: ["Claude or ChatGPT, free plan is fine.", "Start with how many meals you want."] },
      { t: "step", n: 2, title: "Say what's in your fridge.", ticket: ["Plan 5 dinners for this week.", "Fridge: eggs, spinach, rice, cheese."], added: 1, lines: ["List 4 or 5 things you actually have.", "Now it cooks from your kitchen, not a cookbook."] },
      { t: "step", n: 3, title: "Say what you never eat.", ticket: ["Plan 5 dinners for this week.", "Fridge: eggs, spinach, rice, cheese.", "Never use: mushrooms."], added: 1, lines: ["One line saves five swaps later.", "Allergies go here too."] },
      { t: "step", n: 4, title: "Give it your time limit.", ticket: ["Plan 5 dinners for this week.", "Fridge: eggs, spinach, rice, cheese.", "Never use: mushrooms.", "30 minutes or less."], added: 1, lines: ["Now it's your week, not a generic list.", "Send it."] },
      { t: "step", n: 5, title: "Taste before you serve.", ticket: ["Plan 5 dinners for this week.", "Fridge: eggs, spinach, rice, cheese.", "Never use: mushrooms.", "30 minutes or less.", "Add a shopping list for what's missing."], added: 1, lines: ["Ask for the shopping list in the same chat.", "Read it once: AI can add things you don't have."] },
      { t: "offer" },
    ],
    caption: [
      "Copy this, fill in the [brackets], and send it to Claude or ChatGPT:",
      "Plan [5] dinners for this week.\nFridge: [what you have].\nNever use: [what you won't eat].\n[30] minutes or less.\nAdd a shopping list for what's missing.",
      "Each line does one job: how many, what you have, what to avoid, how long. The last line gets you a shopping list in the same answer.",
      "However, read the plan once before you shop. AI can suggest an ingredient you don't have.",
      "In plain words: you just placed a perfect order. That's the whole skill.",
      "All our lessons are free. Link in bio.",
    ],
  },  {
    id: "news-wallet", before: null, label: "AI NEWS, MADE EZ", formula: "Your stakes", image: "Phone paying at a terminal (CC BY-SA, credited)", checked: true,
    slides: [
      { t: "card", label: "AI news, made EZ", head: "Google's AI Mode can now read your Google Wallet if you opt in, but it can't move your money", img: "/projects/skill-quest/school/social/img/news-wallet.jpg", ground: "wallet" },
      { t: "inner", label: "The receipt · Google, Nov 23", title: "In Google's words:", html: `<p class="ez-quote">“If you choose to connect your Wallet, AI Mode can only read information from your accounts; it can’t move, manage, or invest your money.”</p><p class="ez-src">blog.google · Robby Stein, VP of Product, Google Search · Nov 23, 2026</p><div class="ez-plain"><b>In plain words</b>It's the pantry door again: Google can look inside if you open it. It can't spend.</div>` },
    ],
    caption: [
      "Google started rolling out an opt-in setting on Nov 23 that lets AI Mode in Search use your Google Wallet for more tailored answers.",
      "You turn it on in your Search Personalization settings and pick which apps to connect. Wallet joins Gmail, Calendar and Photos, with Google Drive and the Gemini app coming in the next few weeks.",
      "Google says AI Mode can only read your accounts: it can't move, manage or invest your money. The pitch is help with spending habits and card rewards.",
      "However, it's off unless you opt in, and you can turn each connection off at any time. Think about what you want a search box to know about your money before you switch it on.",
      "In plain words: it's a pantry door. You decide if it opens, and it only lets Google look, not spend.",
      FOLLOW,
      "Source: Google (blog.google), Nov 23, 2026.",
      "Photo: HLundgaard, CC BY-SA 3.0, via Wikimedia Commons",
    ],
  },
  {
    id: "news-health", before: null, label: "AI NEWS, MADE EZ", formula: "Just launched", image: "Phone with the ChatGPT app (CC BY, credited)", checked: true,
    slides: [
      { t: "card", label: "AI news, made EZ", head: "ChatGPT Health now connects to your Android sleep and activity data, even on the free plan", img: "/projects/skill-quest/school/social/img/news-health.jpg", ground: "health" },
      { t: "inner", label: "The receipt · OpenAI, Nov 19", title: "In OpenAI's words:", html: `<p class="ez-quote">“Health is available to Free, Go, Plus, and Pro users in the U.S.”</p><p class="ez-src">ChatGPT release notes · Nov 19, 2026</p><div class="ez-plain"><b>In plain words</b>Like handing a coach your sleep log. Useful, if you choose what you share.</div>` },
    ],
    caption: [
      "OpenAI expanded ChatGPT Health on Nov 19 to Android, the desktop app and more, with support for Android Health Connect.",
      "Update the app and pick Health in the sidebar, or find it in the Explore menu. On Android you can connect Health Connect so ChatGPT can look for patterns in your sleep and activity.",
      "OpenAI says Health is available to Free, Go, Plus and Pro users in the U.S., so you don't need to pay to try it.",
      "However, it's U.S.-only and rolling out gradually, so it may not show up for you yet. And it's your health data: decide what you connect before you connect it.",
      "In plain words: like handing a coach your sleep log. Helpful, as long as you pick what goes in.",
      FOLLOW,
      "Source: OpenAI, ChatGPT release notes, Nov 19, 2026.",
      "Photo: Jernej Furman, CC BY 2.0, via Wikimedia Commons",
    ],
  },
];
