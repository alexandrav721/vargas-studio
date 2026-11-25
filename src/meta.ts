/* Plain-word facts the ladder pages need that portfolio.json doesn't hold. Keyed by project id. */
export type Meta = { name: string; pic: string; play: string; playLabel: string; line: string; external?: boolean; extra?: { href: string; label: string }; more?: { href: string; label: string }[] };

export const META: Record<string, Meta> = {
  nostalgia: { name: "Scrollback", pic: "/thumbs/nostalgia-website.jpg", play: "/projects/nostalgia/explore.html", playLabel: "Open Scrollback", line: "The internet and stuff of your teens." },
  "skill-quest": { name: "AI Made EZ skill tests", pic: "/thumbs/skill-quest-website.jpg", play: "/projects/skill-quest/templates/", playLabel: "See the tested skills", line: "Skills blind-tested against plain Claude. Now part of AI Made EZ." },
  "ai-made-ez": { name: "AI Made EZ", pic: "/desk/learn-start.jpg", play: "/projects/skill-quest/start/", playLabel: "Open AI Made EZ", line: "AI is layers. Free lessons, plain words, and a Kit maker.", more: [{ href: "/projects/skill-quest/school/", label: "Level 1: Cooking with Claude" }, { href: "/projects/skill-quest/school/kitchen/", label: "Level 2: Speak AI builder" }, { href: "/projects/skill-quest/school/kitchen/glossary.html", label: "Plain words: every AI term" }, { href: "/projects/skill-quest/build-kit/", label: "Kit maker" }, { href: "/projects/skill-quest/keep-up/", label: "This week in AI" }] },
  weekline: { name: "Weekline", pic: "/thumbs/weekline-v2.jpg", play: "/projects/weekline/v2/", playLabel: "Open Weekline", line: "Your best New York week, planned." },
  restitch: { name: "Restitch", pic: "/thumbs/restitch-website.jpg", play: "/restitch.html", playLabel: "Open Restitch", line: "Turn a thrift find into a flip." },
  "planner-book": { name: "Planners", pic: "/thumbs/planner-book-website.jpg", play: "/projects/planner/", playLabel: "Open the planners", line: "Printable planners that fit how you work.", extra: { href: "/projects/planner/make/", label: "New: Make yours, a planner with your name in it" } },
  scrolll: { name: "Get Paid to Scroll", pic: "/thumbs/scrolll-product-ui.jpg", play: "/projects/scrolll/app.html", playLabel: "Try the app", line: "Get paid for your attention." },
  "habit-game": { name: "Lumen", pic: "/thumbs/habit-game-product-ui.jpg", play: "/projects/lumen/product.html", playLabel: "Open Lumen", line: "Keep going on big goals after a bad day." },
  "shelf-paid": { name: "Shelf Paid", pic: "/desk/shelf-paid.jpg", play: "https://shelfpaid.pages.dev/", playLabel: "See a sample week ↗", line: "Your Amazon storefront, turned into a week of posts.", external: true },
  loop: { name: "Loop", pic: "/desk/loop.jpg", play: "https://celebrateloop.com", playLabel: "Visit Loop ↗", line: "Borrow from friends before you buy.", external: true },
};

/* The "Learn" section: AI Made EZ, kept simple (24 Nov 2026): two courses and the Build Kit. */
export type Fresh = { href: string; pic: string; name: string; line: string; external?: boolean };
export const LEARN: Fresh[] = [
  { href: "/projects/skill-quest/school/", pic: "/desk/learn-l1.jpg", name: "Level 1: Cooking with Claude", line: "8 short lessons" },
  { href: "/projects/skill-quest/school/kitchen/", pic: "/desk/learn-l2.jpg", name: "Level 2: Speak AI builder", line: "10 lessons, no coding" },
  { href: "/projects/skill-quest/school/kitchen/glossary.html", pic: "/desk/learn-words.jpg", name: "Plain words", line: "Every AI term, made plain" },
  { href: "/projects/skill-quest/use-ai/", pic: "/desk/learn-useai.jpg", name: "Use AI well", line: "8 habits and 12 tools, made easy" },
  { href: "/projects/skill-quest/build-kit/", pic: "/desk/learn-buildkit.jpg", name: "Kit maker", line: "Plan an app so AI stops guessing" },
  { href: "/projects/skill-quest/keep-up/", pic: "/desk/learn-news.jpg", name: "This week in AI", line: "The news in plain words" },
];

/* Ideas on home, grouped by who they're for. */
export const GROUPS: { title: string; ids: string[] }[] = [
  { title: "For everyone", ids: ["ai-made-ez", "planner-book", "nostalgia", "habit-game"] },
  { title: "Startup ideas", ids: ["loop", "weekline", "restitch", "shelf-paid", "scrolll"] },
];

/* Column ids → plain labels a friend understands. */
export const PLAIN: Record<string, string> = {
  website: "Website",
  landing: "Landing page",
  funnel: "Sign-up page",
  "meta-ads": "Ads",
  "product-ui": "App",
  deck: "Pitch deck",
  print: "Printable",
  social: "Social posts",
};
