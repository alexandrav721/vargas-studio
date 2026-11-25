/* DRAFTS, not posted: launch posts for AI Made EZ Levels 3-5 (all-nighter 25 Nov 2026). Shown only on approve-levels.html. */
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
];
