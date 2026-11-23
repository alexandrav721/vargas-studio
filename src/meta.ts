/* Plain-word facts the ladder pages need that portfolio.json doesn't hold. Keyed by project id. */
export type Meta = { name: string; pic: string; play: string; playLabel: string; line: string; external?: boolean; extra?: { href: string; label: string } };

export const META: Record<string, Meta> = {
  nostalgia: { name: "Scrollback", pic: "/desk/nostalgia.jpg", play: "/projects/nostalgia/play.html", playLabel: "Play", line: "The internet and stuff of your teens." },
  "skill-quest": { name: "Skill Quest", pic: "/desk/skill-quest.jpg", play: "/projects/skill-quest/play.html", playLabel: "Play", line: "A game for building AI skills.", extra: { href: "/projects/skill-quest/build-kit/", label: "New: Build Kit, plan an app so AI stops guessing" } },
  weekline: { name: "Weekline", pic: "/desk/weekline.jpg", play: "/projects/weekline/play.html", playLabel: "Play", line: "Your best New York week, planned." },
  restitch: { name: "Restitch", pic: "/desk/restitch.jpg", play: "/projects/restitch/play.html", playLabel: "Play", line: "Turn a thrift find into a flip." },
  "planner-book": { name: "Planners", pic: "/desk/planner.jpg", play: "/projects/planner/play.html", playLabel: "Play", line: "Printable planners that fit how you work." },
  scrolll: { name: "Get Paid to Scroll", pic: "/desk/scrolll.jpg", play: "/projects/scrolll/play.html", playLabel: "Play", line: "Get paid for your attention." },
  "habit-game": { name: "Lumen", pic: "/desk/lumen.jpg", play: "/projects/lumen/play.html", playLabel: "Play", line: "Small games for big goals." },
  loop: { name: "Loop", pic: "/desk/loop.jpg", play: "https://celebrateloop.com", playLabel: "Visit Loop ↗", line: "Borrow from friends before you buy.", external: true },
};

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
