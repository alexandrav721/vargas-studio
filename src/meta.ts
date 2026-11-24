/* Plain-word facts the ladder pages need that portfolio.json doesn't hold. Keyed by project id. */
export type Meta = { name: string; pic: string; play: string; playLabel: string; line: string; external?: boolean; extra?: { href: string; label: string }; more?: { href: string; label: string }[] };

export const META: Record<string, Meta> = {
  nostalgia: { name: "Scrollback", pic: "/desk/nostalgia.jpg", play: "/projects/nostalgia/play.html", playLabel: "Play", line: "The internet and stuff of your teens." },
  "skill-quest": { name: "Skills Made EZ", pic: "/desk/skill-quest.jpg", play: "/projects/skill-quest/play.html", playLabel: "Play", line: "A game for building AI skills.", extra: { href: "/projects/skill-quest/templates/", label: "New: 8 ready-made skills, tested against plain Claude" }, more: [{ href: "/projects/skill-quest/start/", label: "Start here: everything in Skills Made EZ, with search" }, { href: "/projects/skill-quest/library/", label: "Community library: skills people made, rated and tested" }, { href: "/projects/skill-quest/build-kit/", label: "Build Kit: plan an app so AI stops guessing" }] },
  "ai-made-ez": { name: "AI Made EZ", pic: "/desk/ai-made-ez.jpg", play: "/projects/skill-quest/ez/", playLabel: "Make something", line: "Everyday AI made easy: answer a few questions, get something to print.", more: [{ href: "/projects/skill-quest/school/", label: "Course, Level 1: learn AI like learning to cook" }, { href: "/projects/skill-quest/school/kitchen/", label: "Course, Level 2: speak AI builder, no coding" }, { href: "/projects/skill-quest/school/kitchen/ask.html", label: "Buying AI? The questions to ask" }] },
  weekline: { name: "Weekline", pic: "/desk/weekline.jpg", play: "/projects/weekline/play.html", playLabel: "Play", line: "Your best New York week, planned." },
  restitch: { name: "Restitch", pic: "/desk/restitch.jpg", play: "/projects/restitch/play.html", playLabel: "Play", line: "Turn a thrift find into a flip." },
  "planner-book": { name: "Planners", pic: "/desk/planner.jpg", play: "/projects/planner/play.html", playLabel: "Play", line: "Printable planners that fit how you work.", extra: { href: "/projects/planner/make/", label: "New: Make yours, a planner with your name in it" } },
  scrolll: { name: "Get Paid to Scroll", pic: "/desk/scrolll.jpg", play: "/projects/scrolll/play.html", playLabel: "Play", line: "Get paid for your attention." },
  "habit-game": { name: "Lumen", pic: "/desk/lumen.jpg", play: "/projects/lumen/play.html", playLabel: "Play", line: "Small games for big goals." },
  "shelf-paid": { name: "Shelf Paid", pic: "/desk/shelf-paid.jpg", play: "https://shelfpaid.pages.dev/", playLabel: "See a sample week ↗", line: "Your Amazon storefront, turned into a week of posts.", external: true },
  loop: { name: "Loop", pic: "/desk/loop.jpg", play: "https://celebrateloop.com", playLabel: "Visit Loop ↗", line: "Borrow from friends before you buy.", external: true },
};

/* The "New" row at the top of home: the latest things built, one tap away. */
export type Fresh = { href: string; pic: string; name: string; line: string; external?: boolean };
export const NEW: Fresh[] = [
  { href: "/projects/skill-quest/ez/puzzle.html", pic: "/desk/new-puzzle.jpg", name: "Family puzzle book", line: "Large-print puzzles of your family" },
  { href: "/projects/skill-quest/ez/letter.html", pic: "/desk/new-letter.jpg", name: "Holiday letter", line: "Your year, on one printed page" },
  { href: "/projects/skill-quest/ez/calendar.html", pic: "/desk/new-calendar.jpg", name: "Birthday calendar", line: "Every family birthday, printed in" },
  { href: "/projects/skill-quest/ez/invites.html", pic: "/desk/new-invites.jpg", name: "Birthday invitations", line: "3 designs, pick your favorite" },
];

/* The "Make" section: AI Made EZ makers, the things people go to AI for, done for them. */
export const MAKE: Fresh[] = [
  { href: "/projects/skill-quest/ez/invites.html", pic: "/desk/new-invites.jpg", name: "Invitations", line: "Birthday party invites" },
  { href: "/projects/skill-quest/ez/letter.html", pic: "/desk/new-letter.jpg", name: "Holiday letter", line: "Your year on one page" },
  { href: "/projects/skill-quest/ez/calendar.html", pic: "/desk/new-calendar.jpg", name: "Birthday calendar", line: "12 months, every birthday" },
  { href: "/projects/skill-quest/ez/puzzle.html", pic: "/desk/new-puzzle.jpg", name: "Family puzzle book", line: "Word searches and a crossword" },
  { href: "/projects/planner/make/", pic: "/desk/new-make-yours.jpg", name: "Your own planner", line: "With your name in it" },
  { href: "/projects/skill-quest/ez/", pic: "/desk/ai-made-ez.jpg", name: "Meals, week, party, trip", line: "Plans that write themselves" },
  { href: "/projects/skill-quest/school/kitchen/", pic: "/desk/new-kitchen.jpg", name: "Learn AI words", line: "Short courses, no coding" },
];

/* Ideas on home, grouped by who they're for. */
export const GROUPS: { title: string; ids: string[] }[] = [
  { title: "For everyone", ids: ["ai-made-ez", "planner-book", "nostalgia", "habit-game"] },
  { title: "Startup ideas", ids: ["loop", "weekline", "restitch", "shelf-paid", "scrolll"] },
  { title: "For AI builders", ids: ["skill-quest"] },
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
