/* Plain-word facts the ladder pages need that portfolio.json doesn't hold. Keyed by project id. */
export type Meta = { name: string; pic: string; play: string; playLabel: string; line: string; external?: boolean; extra?: { href: string; label: string }; more?: { href: string; label: string }[] };

export const META: Record<string, Meta> = {
  nostalgia: { name: "Scrollback", pic: "/desk/nostalgia.jpg", play: "/projects/nostalgia/play.html", playLabel: "Play", line: "The internet and stuff of your teens." },
  "skill-quest": { name: "Skills Made EZ", pic: "/desk/skill-quest.jpg", play: "/projects/skill-quest/play.html", playLabel: "Play", line: "A game for building AI skills.", extra: { href: "/projects/skill-quest/templates/", label: "New: 8 ready-made skills, tested against plain Claude" }, more: [{ href: "/projects/skill-quest/start/", label: "Start here: everything in Skills Made EZ, with search" }, { href: "/projects/skill-quest/school/", label: "Cooking school: learn AI like learning to cook" }, { href: "/projects/skill-quest/library/", label: "Community library: skills people made, rated and tested" }, { href: "/projects/skill-quest/build-kit/", label: "Build Kit: plan an app so AI stops guessing" }] },
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
  { href: "https://shelfpaid.pages.dev/", pic: "/desk/new-shelf-paid.jpg", name: "Shelf Paid", line: "Storefront to a week of posts", external: true },
  { href: "/projects/skill-quest/templates/", pic: "/desk/new-templates.jpg", name: "Ready-made skills", line: "8 skills that beat plain Claude" },
  { href: "/projects/skill-quest/build-kit/", pic: "/desk/new-build-kit.jpg", name: "Build Kit", line: "Plan an app so AI stops guessing" },
  { href: "/projects/planner/make/", pic: "/desk/new-make-yours.jpg", name: "Make yours", line: "A planner with your name in it" },
  { href: "/projects/skill-quest/prototype/v2.html", pic: "/desk/new-prototype.jpg", name: "Skills Made EZ prototype", line: "Score a skill like a pro" },
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
