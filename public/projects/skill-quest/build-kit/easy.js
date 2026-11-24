/* "Made easy" for every room of the Kit maker: [the easy way, what it really means, the best practice].
   The house is the blueprint you're filling in; each room is one file your AI coding tool reads. */
window.KIT_EASY = {
  prd: ["The sign out front: what this place is, and who it's for.", "A product brief (PRD): the goal, the people, what's in version 1 and what isn't.", "Write down what it won't do yet. A short list beats a long essay."],
  flows: ["The hallway: how people get from the front door to what they came for.", "User flows: each step a person takes, including empty screens and errors.", "Plan the first visit and what happens when something fails, not just the happy path."],
  design: ["The paint and furniture, so every room matches.", "A design system: the colors, fonts, spacing and buttons reused on every screen.", "Pick 3 colors and 1 or 2 fonts, and make sure text is easy to read (contrast of 4.5 to 1 or more)."],
  arch: ["The pipes and wiring behind the walls.", "Architecture and tech stack: the tools it's built with, where it's hosted, how sign-in and payments work.", "Choose common, well-known tools. AI writes better code for things it has seen a lot."],
  data: ["The filing cabinet: what gets kept, and in which drawer.", "The data model: the tables, the fields in each, and how they link.", "Keep only what you need. Mark what's private, and plan how someone deletes their data."],
  api: ["The intercom between rooms.", "The API: the requests one part of the app sends another, and the answers it gets back.", "Name each request plainly, and say who's allowed to make it."],
  security: ["Who gets a key to which door.", "Authentication (proving who you are) and permissions (what you're allowed to see and do).", "Give each person only the access they need. Never put secret keys in the app's code."],
  code: ["House rules for the builders.", "Code style: naming, folders and the patterns the AI should follow.", "A few clear rules beat a long list. Ask the AI to copy patterns already in the project."],
  testing: ["The inspection before anyone moves in.", "Tests: automatic checks that the important things still work after every change.", "Write down what must never break, and test that first."],
  agents: ["The note you leave for the contractor.", "Agent instructions (AGENTS.md or CLAUDE.md): how the AI should work on this project.", "Tell it to ask before it guesses, and to build one piece at a time."],
  env: ["The key box by the door: every key labeled, all of them locked.", "Environment variables: secret settings like API keys, kept outside the code.", "List them by name only. Never paste a real key into a chat or into code."],
  errors: ["The exit signs and fire alarms.", "Error handling: what people see when something fails, and what gets written down for you.", "Every error message says what happened and what to do next, in plain words."],
  watch: ["The smoke detector.", "Monitoring (observability): alerts and logs once real people use it.", "Get told about the few things that matter, like failed payments, not every little thing."],
  deploy: ["Moving day, with a way back.", "Deployment: how a new version goes live, and how to roll it back.", "Release small changes often, and always know how to undo one."],
  decisions: ["The binder of why we did it this way.", "Decision records: one short note per big choice and the reason for it.", "Write it down once, so nobody re-argues it in three months."],
  roadmap: ["The renovation list: now, next, later.", "A roadmap: what's in this version, the next one, and someday.", "Keep \"now\" tiny. Everything else goes to next or later."],
  changelog: ["The guest book of changes.", "A changelog: a dated list of what changed in each version.", "Write it for people: what's new and what's fixed."]
};
