/* Everything in Skills Made EZ, one list. Powers the "Start here" page and the search on every page.
   t = title, y = type chip, d = one plain line, u = link, g = where it lives (learn | ready | make | play | proof | community | behind | about), k = extra words people might type. */
window.SMEZ_INDEX = [
  /* learn */
  { t: "AI Made EZ", y: "Course", g: "learn", u: "/projects/skill-quest/school/", d: "Learn AI the way you learned to cook. 8 short lessons and a Chef's passport.", k: "course class lessons learn beginner basics teach mom passport stamps" },
  { t: "Lesson 1: Meet the chef", y: "Lesson", g: "learn", u: "/projects/skill-quest/school/lesson-1.html", d: "What AI is and isn't, in 8 minutes. Leave with a week of dinners.", k: "lesson one start first beginner what is ai chef fridge dinners made up hallucination" },
  { t: "One-tap planners", y: "Tool", g: "learn", u: "/projects/skill-quest/ez/", d: "Talk, and watch your plan appear: meals, your week, a party, a trip.", k: "planner plan meals meal plan grocery list week schedule organize party holiday birthday trip travel itinerary voice talk mic one tap" },
  { t: "Builder's Kitchen", y: "Course", g: "learn", u: "/projects/skill-quest/school/kitchen/", d: "How AI products are built: API, prompts, tools, MCP, RAG, agents, Claude Code, evals. 10 lessons.", k: "level 2 builder developer architect api mcp agents rag evals claude code course anthropic" },
  { t: "Buying AI? What to ask", y: "Checklist", g: "learn", u: "/projects/skill-quest/school/kitchen/ask.html", d: "Questions for AI vendors, with good answers and red flags. Business, school, clinic, finance.", k: "vendor buy buying procurement questions checklist red flags due diligence rfp school hospital finance" },
  { t: "Kitchen dictionary", y: "Glossary", g: "learn", u: "/projects/skill-quest/school/kitchen/glossary.html", d: "Every AI builder word in plain words, with a kitchen picture.", k: "glossary dictionary terms words definitions vocabulary jargon token context window" },
  { t: "Builder lesson 1: How AI kitchens work", y: "Lesson", g: "learn", u: "/projects/skill-quest/school/kitchen/lesson-1.html", d: "Builder’s Kitchen lesson 1.", k: "model llm token context window haiku sonnet opus fable" },
  { t: "Builder lesson 2: The order window (API)", y: "Lesson", g: "learn", u: "/projects/skill-quest/school/kitchen/lesson-2.html", d: "Builder’s Kitchen lesson 2.", k: "api key request response streaming cost" },
  { t: "Builder lesson 3: House rules (prompting)", y: "Lesson", g: "learn", u: "/projects/skill-quest/school/kitchen/lesson-3.html", d: "Builder’s Kitchen lesson 3.", k: "system prompt prompt engineering xml examples hallucination thinking temperature" },
  { t: "Builder lesson 4: Appliances (tool use)", y: "Lesson", g: "learn", u: "/projects/skill-quest/school/kitchen/lesson-4.html", d: "Builder’s Kitchen lesson 4.", k: "tool use function calling tools web search code execution" },
  { t: "Builder lesson 5: Standard outlets (MCP)", y: "Lesson", g: "learn", u: "/projects/skill-quest/school/kitchen/lesson-5.html", d: "Builder’s Kitchen lesson 5.", k: "mcp model context protocol server client connector" },
  { t: "Builder lesson 6: The recipe binder (RAG)", y: "Lesson", g: "learn", u: "/projects/skill-quest/school/kitchen/lesson-6.html", d: "Builder’s Kitchen lesson 6.", k: "rag retrieval embeddings vector database chunking caching" },
  { t: "Builder lesson 7: The head chef (agents)", y: "Lesson", g: "learn", u: "/projects/skill-quest/school/kitchen/lesson-7.html", d: "Builder’s Kitchen lesson 7.", k: "agent agents loop subagent orchestrator workflow" },
  { t: "Builder lesson 8: Your own kitchen (Claude Code)", y: "Lesson", g: "learn", u: "/projects/skill-quest/school/kitchen/lesson-8.html", d: "Builder’s Kitchen lesson 8.", k: "claude code claude.md skill hook plugin slash command git" },
  { t: "Builder lesson 9: Taste tests (evals)", y: "Lesson", g: "learn", u: "/projects/skill-quest/school/kitchen/lesson-9.html", d: "Builder’s Kitchen lesson 9.", k: "evals eval test set grader judge regression" },
  { t: "Builder lesson 10: Plan your own kitchen", y: "Lesson", g: "learn", u: "/projects/skill-quest/school/kitchen/lesson-10.html", d: "Builder’s Kitchen lesson 10.", k: "architect architecture plan cost latency guardrails" },
  { t: "Chef's passport", y: "Your stamps", g: "learn", u: "/projects/skill-quest/school/", d: "A stamp for every lesson, plus your Maker stamps.", k: "passport stamps progress badges collect" },
  { t: "Prompt = your order", y: "Idea", g: "learn", u: "/projects/skill-quest/school/lesson-1.html", d: "What you ask Claude for. More detail gets a better dish.", k: "prompt order ask question request" },
  { t: "Skill = a recipe card", y: "Idea", g: "learn", u: "/projects/skill-quest/templates/", d: "Instructions Claude pulls out when your request matches its title.", k: "skill recipe card skill.md instructions what is a skill" },
  { t: "Kit = a meal kit", y: "Idea", g: "learn", u: "/projects/skill-quest/library/#/?type=kit", d: "A few skills that do one big job, in one upload.", k: "kit plugin bundle meal kit" },
  { t: "Connector = the pantry door", y: "Idea", g: "learn", u: "/projects/skill-quest/school/", d: "Lets Claude reach your calendar or email (MCP). Set it to \"always ask\".", k: "connector mcp pantry gmail calendar drive apps integration" },
  { t: "Made-up facts", y: "Idea", g: "learn", u: "/projects/skill-quest/school/lesson-1.html", d: "Claude can invent things and sound sure. Ask what to double-check.", k: "hallucination wrong made up check facts trust" },

  /* ready-made */
  { t: "Ready-made skills", y: "Tool", g: "ready", u: "/projects/skill-quest/templates/", d: "8 skills for what people ask AI most. All 8 beat plain Claude in blind tests.", k: "templates ready made house recipes download free gallery" },
  { t: "Polish my email", y: "Skill", g: "ready", u: "/projects/skill-quest/templates/#polish-email", d: "Your rough draft, shorter and clearer, still you. 4.8 vs 3.5.", k: "email writing rewrite polish message" },
  { t: "Study buddy", y: "Skill", g: "ready", u: "/projects/skill-quest/templates/#study-buddy", d: "Your notes become a quiz you can play. 4.5 vs 4.0.", k: "study quiz school notes flashcards student" },
  { t: "Habit tracker", y: "Skill", g: "ready", u: "/projects/skill-quest/templates/#habit-tracker", d: "Tap once a day. Watch your streak grow. 5.0 vs 3.0.", k: "habit streak tracker daily" },
  { t: "My one-page website", y: "Skill", g: "ready", u: "/projects/skill-quest/templates/#one-page-site", d: "A personal site built around your real work. 4.5 vs 3.8.", k: "website site portfolio page personal" },
  { t: "Trip planner", y: "Skill", g: "ready", u: "/projects/skill-quest/templates/#trip-planner", d: "A day-by-day trip plan you can actually follow. 4.5 vs 3.5.", k: "trip travel vacation itinerary plan" },
  { t: "Meal plan + grocery list", y: "Skill", g: "ready", u: "/projects/skill-quest/templates/#meal-plan", d: "A week of dinners and one list to shop. 4.8 vs 3.5.", k: "meal plan dinner groceries food cooking recipes" },
  { t: "Resume tailor", y: "Skill", g: "ready", u: "/projects/skill-quest/templates/#resume-tailor", d: "Your resume fitted to one job, plus cover letter. 4.5 vs 3.8.", k: "resume cv job cover letter career" },
  { t: "Small business page", y: "Skill", g: "ready", u: "/projects/skill-quest/templates/#business-landing", d: "A page that turns visitors into bookings. 4.5 vs 4.0.", k: "business landing page bookings website small business" },

  /* community */
  { t: "Community library", y: "Tool", g: "community", u: "/projects/skill-quest/library/", d: "Skills, prompts and kits people made, rated, and tested against plain Claude.", k: "library community browse search marketplace people made ratings" },
  { t: "Prompts", y: "Library", g: "community", u: "/projects/skill-quest/library/#/?type=prompt", d: "Copy, fill in the [blanks], send. Nothing to install.", k: "prompts copy paste orders" },
  { t: "Kits", y: "Library", g: "community", u: "/projects/skill-quest/library/#/?type=kit", d: "A few skills that do one big job together.", k: "kits plugins bundles meal kits" },
  { t: "Requests", y: "Library", g: "community", u: "/projects/skill-quest/library/#/requests", d: "Ask for something you wish existed, and vote.", k: "request ask wish vote idea board" },
  { t: "Share yours", y: "Library", g: "community", u: "/projects/skill-quest/library/#/submit", d: "Share a skill, prompt or kit. A person checks it first.", k: "share submit upload publish my skill" },

  /* make */
  { t: "Make your own skill", y: "Tool", g: "make", u: "/projects/skill-quest/prototype/v2.html", d: "Answer a few questions. Get a skill for something you do every week.", k: "make create build write my own skill diy recipe" },
  { t: "Build Kit", y: "Tool", g: "make", u: "/projects/skill-quest/build-kit/", d: "Plan an app room by room, so AI stops guessing. 8 starter plans.", k: "build kit app planner plan website app idea starter" },

  /* play */
  { t: "Spot the skill", y: "Game", g: "play", u: "/projects/skill-quest/play.html", d: "Three real answers. Guess which one used a skill.", k: "game play spot guess quiz fun" },
  { t: "Maker passport and Maker card", y: "Your stamps", g: "play", u: "/projects/skill-quest/templates/#passport", d: "Collect 6 stamps across the site. Get a card to share.", k: "maker passport card stamps badge share" },

  /* proof */
  { t: "How we test", y: "Proof", g: "proof", u: "/projects/skill-quest/library/#/how", d: "The blind test, step by step, and every result, ties included.", k: "test blind judge method results proof score" },
  { t: "How we review", y: "Proof", g: "proof", u: "/projects/skill-quest/library/#/rules", d: "What gets approved, how reviews work, licenses.", k: "review rules policy safety license moderation" },
  { t: "A real skill card", y: "Proof", g: "proof", u: "/projects/skill-quest/cards/", d: "idea-innovate, scored Epic 81. Won 1, tied 1, lost 1.", k: "card real score epic rarity report" },
  { t: "Real card report", y: "Proof", g: "proof", u: "/projects/skill-quest/cards/idea-innovate-report.html", d: "The full report behind that card: tasks, judge notes, what to fix.", k: "report card details judge" },

  /* about + behind the scenes */
  { t: "About Skills Made EZ", y: "Page", g: "about", u: "/projects/skill-quest/landing/", d: "What it is, the game, and the waitlist.", k: "about home landing waitlist join pricing pro" },
  { t: "Privacy", y: "Page", g: "about", u: "/projects/skill-quest/landing/privacy.html", d: "What we keep and what we don't.", k: "privacy data email" },
  { t: "Pitch deck", y: "Behind the scenes", g: "behind", u: "/projects/skill-quest/deck/deck.html", d: "The business in 12 slides.", k: "deck pitch investors slides business plan" },
  { t: "Explainer graphic", y: "Behind the scenes", g: "behind", u: "/projects/skill-quest/graphic/explainer.html", d: "Skills Made EZ in one picture.", k: "explainer graphic picture diagram" },
  { t: "Ads", y: "Behind the scenes", g: "behind", u: "/projects/skill-quest/ads/", d: "The ad frames we test with.", k: "ads ad meta instagram creative" },
  { t: "Print and sponsor kit", y: "Behind the scenes", g: "behind", u: "/projects/skill-quest/print/", d: "Printable pages and the sponsor kit.", k: "print sponsor kit pdf flyer" },
  { t: "The first prototype", y: "Behind the scenes", g: "behind", u: "/projects/skill-quest/prototype/prototype.html", d: "Where it started: scoring a skill like a game.", k: "prototype first version v1 original" }
];
window.SMEZ_POPULAR = ["Meal plan", "Make your own skill", "Lesson 1", "Polish my email", "Spot the skill"];
