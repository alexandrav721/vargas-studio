/* DRAFTS, not posted: launch posts for AI Made EZ Levels 3-5 plus Templates and Keep up (25 Nov 2026). Shown only on approve-levels.html. */
import { FOLLOW } from "./posts.js";
const rows = (items) => `<ul class="ez-rows">${items.map(([b, s]) => `<li><b>${b}</b><span>${s}</span></li>`).join("")}</ul>`;
export const DRAFTS = [
  {
    id: "guide-level-3", before: null, label: "NO GATEKEEPING", formula: "Your stakes", image: "Real photo: laptop at home (CC BY 2.0)",
    slides: [
      { t: "card", label: "No gatekeeping", head: "You already have Claude at work. 8 free lessons show what it can actually do for you", img: "/projects/skill-quest/img/need.jpg" },
      { t: "inner", label: "Level 3 · Claude at work", title: "8 short lessons.", html: rows([["Stations", "chat, research, hand-offs"], ["Standing orders", "set it up once"], ["Files", "real sheets and slides"], ["Research", "with sources"], ["Storeroom", "connect your apps safely"], ["Hand-offs", "whole tasks, checked"], ["Recipe cards", "skills for your team"], ["Safe kitchen", "what never to paste"]]) },
      { t: "offer" },
    ],
    caption: [
      "Level 3 of AI Made EZ is live: 8 short lessons on using Claude at work, from picking the right mode to handing off a whole task.",
      "Each lesson ends with something you keep: your standing instructions, a real spreadsheet, a research brief with sources, a skill your team can share.",
      "Every lesson also has a free-plan path, so you can follow along on your phone.",
      "However, some features (Research, Cowork, Claude in Chrome) need a paid plan. The lessons say which, up front.",
      "In plain words: it's a kitchen shift. Pick the station, set the standing orders, and check the plate before it goes out.",
      FOLLOW,
      "Source: AI Made EZ Level 3 (free). Photo: Microbiz Mag, CC BY 2.0, via Wikimedia Commons",
    ],
  },
  {
    id: "guide-level-4", before: null, label: "NO GATEKEEPING", formula: "Pain-point feature", image: "Real photo: plate served to a judge (public domain)",
    slides: [
      { t: "card", label: "No gatekeeping", head: "Your shop or app can call Claude directly. 8 free lessons show how, no coding needed", img: "/projects/skill-quest/img/guess.jpg" },
      { t: "inner", label: "Level 4 · Build with Claude", title: "8 short lessons.", html: rows([["First order", "your first API call"], ["Pick the chef", "the right model"], ["Same plate", "structured answers"], ["Appliances", "the tool loop"], ["Prep once", "caching and batches"], ["Recipe library", "your own documents"], ["Taste tests", "check it works"], ["Opening night", "launch safely"]]) },
      { t: "offer" },
    ],
    caption: [
      "Level 4 of AI Made EZ is live: 8 lessons on building with the Claude API, for people who will build or brief a developer.",
      "Pick “Explain it to me” and every lesson works in a free chat and ends with a sheet you can hand a developer. Pick “Write the code” and Claude writes it with you.",
      "You'll learn what makes apps cheaper (caching, batches), steadier (structured answers) and safer (tests, spend limits).",
      "However, trying the API itself needs a small prepaid credit. A chat plan doesn't cover it.",
      "In plain words: Levels 1 to 3 ordered from the window. Level 4 opens your own restaurant.",
      FOLLOW,
      "Source: AI Made EZ Level 4 (free). Photo: U.S. Marine Corps, public domain, via Wikimedia Commons",
    ],
  },
  {
    id: "guide-level-5", before: null, label: "NO GATEKEEPING", formula: "Your stakes", image: "Real photo: computer chips (CC0)",
    slides: [
      { t: "card", label: "No gatekeeping", head: "Planning an AI pilot at work? 8 free lessons to plan it, price it and keep it safe", img: "/projects/skill-quest/img/layers.jpg" },
      { t: "inner", label: "Level 5 · Design AI systems", title: "8 short lessons.", html: rows([["Set menu?", "workflow or agent"], ["Outlets", "connect your systems"], ["The system", "how agents run"], ["Brigade", "teams of agents"], ["Long shifts", "long tasks"], ["Locks", "security"], ["Checks", "oversight and safety"], ["Floor plan", "your one-page design"]]) },
      { t: "offer" },
    ],
    caption: [
      "Level 5 of AI Made EZ is live: 8 lessons on designing an AI system you can defend, no coding needed.",
      "You'll decide between a simple workflow and an agent, plan who approves what, price it, and end with a design doc and a 6-week pilot plan.",
      "Every ticket works in a free chat. Builders can also ask for a starter file or build it with Claude Code.",
      "However, a plan isn't a pilot. Start small, measure weekly, and set your go/no-go rule before you begin.",
      "In plain words: Level 5 is running a restaurant group. Same recipes, more kitchens, and somebody checks each one.",
      FOLLOW,
      "Source: AI Made EZ Level 5 (free). Photo: Fritzchens Fritz, CC0, via Wikimedia Commons",
    ],
  },
  {
    id: "templates-two-ways", before: null, label: "NO GATEKEEPING", formula: "Number first + proof", image: "Real photo: kitchen (licensed)",
    slides: [
      { t: "card", label: "No gatekeeping", head: "Same email, asked two ways. A blind judge scored one 2.8 and the other 5.0", img: "/projects/skill-quest/img/kitchen.jpg" },
      { t: "inner", label: "The test", title: "Same job, two asks.", html: rows([["Plain ask", "2.8 out of 5"], ["Six-box template", "5.0 out of 5"], ["Judge", "a separate Claude, blind"], ["7 jobs tested", "template won 6, tied 1"]]) },
      { t: "inner", label: "Why", title: "It can't read your mind.", html: rows([["Plain ask", "Claude guesses the facts"], ["Template", "you give the facts"], ["The trick", "there isn't one"]]) },
      { t: "offer" },
    ],
    caption: [
      "We asked Claude to reply to the same email twice: once the way most people type it, once with a six-box template.",
      "A separate Claude judged both answers without knowing which was which. The plain ask scored 2.8 out of 5. The template scored 5.0.",
      "We ran 7 everyday jobs this way. The template won 6 and tied 1. Every answer is on the page, the tie included.",
      "However, the template didn't make Claude smarter. It just made you say what you needed.",
      "In plain words: a chef can't cook your order if you only say “something nice”.",
      FOLLOW,
      "Source: AI Made EZ Templates, blind tests run 25 Nov 2026 (free).",
    ],
  },
  {
    id: "templates-six-boxes", before: null, label: "NO GATEKEEPING", formula: "Free thing, whole thing", image: "Type-only card",
    slides: [
      { t: "card", label: "No gatekeeping", head: "Nobody needs to DM you a prompt. Here's the whole template, 6 boxes", img: "/projects/skill-quest/img/order.jpg" },
      { t: "inner", label: "The 6 boxes", title: "Copy. Fill in. Send.", html: rows([["Goal", "what you want, one line"], ["Who it's for", "who reads it"], ["Context", "facts Claude can't know"], ["Example", "one sample of good"], ["Format", "length and shape"], ["Rules", "what to avoid"]]) },
      { t: "offer" },
    ],
    caption: [
      "Influencers sell “the prompt”. Here it is, free: six boxes you fill in and paste into Claude or ChatGPT.",
      "Goal, who it's for, context, one example, format, rules. Leave a box out if it doesn't apply.",
      "There are 10 ready templates on the page (emails, summaries, meeting notes, plans, posts) and a one-page cheat sheet you can print.",
      "However, a template only works with your real facts in it. Brackets left empty get guessed.",
      "In plain words: it's an order slip. Fill it in and the kitchen stops guessing.",
      FOLLOW,
      "Source: AI Made EZ Templates (free).",
    ],
  },
  {
    id: "keep-up-friday", before: null, label: "AI NEWS, MADE EZ", formula: "Your stakes", image: "Real photo: words (licensed)",
    slides: [
      { t: "card", label: "AI news, made EZ", head: "You don't need 40 AI newsletters. Every Friday: what changed, in plain words, with the source", img: "/projects/skill-quest/img/words.jpg" },
      { t: "inner", label: "How we keep up", title: "Every Friday.", html: rows([["Read", "official pages only"], ["Cut", "the hype"], ["Say", "what it means for you"], ["Link", "the source, always"]]) },
      { t: "offer" },
    ],
    caption: [
      "AI news feels like a full-time job. It isn't, if someone reads the official pages and tells you what matters.",
      "Every Friday we post what changed that week, what it means for you, and a link to the source so you can check it.",
      "No “this changes everything”. If it doesn't change anything for you, we say so.",
      "However, we skip rumors and leaks. If there's no official source, it waits.",
      "In plain words: we read the supplier notes so you can just cook.",
      FOLLOW,
      "Source: AI Made EZ Keep up (free, new every Friday).",
    ],
  },
  {
    id: "kit-first-website", before: null, label: "NO GATEKEEPING", formula: "Number first + proof", image: "Real screenshot: the site the kit built",
    slides: [
      { t: "card", label: "No gatekeeping", head: "Your first website, free, in about an hour. Every prompt is in the post", img: "/projects/skill-quest/kits/img/first-website-template.jpg" },
      { t: "inner", label: "The test", title: "Same ask, two ways.", html: rows([["“Make me a website for my bakery”", "1.5 out of 5"], ["The free kit", "5.0 out of 5"], ["Why", "the plain ask made up a bakery"], ["Judge", "a separate Claude, blind"]]) },
      { t: "inner", label: "The kit", title: "5 steps.", html: rows([["1", "fill in the site sheet"], ["2", "paste it into a free builder"], ["3", "fix the words"], ["4", "check it on a phone"], ["5", "publish, text the link"]]) },
      { t: "offer" },
    ],
    caption: [
      "A website builder can make you a site from one sentence. It just makes the rest up: the name, the prices, the hours, even the reviews.",
      "Our free kit has you fill in a short sheet first. In a blind test, the plain ask scored 1.5 out of 5. The kit scored 5.0.",
      "Free path: Lovable or Google AI Studio. No code, and you end with a real link.",
      "However, free plans have daily limits. The kit tells you what to do when you hit one.",
      "In plain words: a chef can't cook your order if you only say “something nice”.",
      FOLLOW,
      "Source: AI Made EZ Kits, blind tests run 25 Nov 2026 (free). Sample bakery is made up.",
    ],
  },
  {
    id: "kit-automate", before: null, label: "AI MADE EZ GUIDES", formula: "Your stakes", image: "Real photo: laptop at home (CC BY 2.0)",
    slides: [
      { t: "card", label: "AI Made EZ guides", head: "Automate one boring task this week. Free, two steps, no code", img: "/projects/skill-quest/img/need.jpg" },
      { t: "inner", label: "The kit", title: "Start small.", html: rows([["Pick", "a task you repeat every week"], ["Plan", "AI writes the steps for you"], ["Build", "Zapier Free, one trigger, one action"], ["Test", "one real example"], ["Rule", "it drafts, you send"]]) },
      { t: "offer" },
    ],
    caption: [
      "Automation sounds technical. It's mostly two sentences: when this happens, do that.",
      "Our free kit has AI pick the task, write the plan and the exact request to paste into Zapier's free plan.",
      "In a blind test, the kit's plan scored 4.0 out of 5 and a plain ask scored 2.3. The judge also flagged one weak spot in ours, and the page shows it.",
      "However, start with automations that draft, not send. You stay the last click.",
      "In plain words: it's a kitchen timer. You set it once, and it rings without you.",
      FOLLOW,
      "Source: AI Made EZ Kits, blind tests run 25 Nov 2026 (free). Photo: Microbiz Mag, CC BY 2.0, via Wikimedia Commons",
    ],
  },
];
