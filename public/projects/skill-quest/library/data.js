/* Community library: the taxonomy, tags and drawn icons. Static and trusted (no user text here). */
(function () {
  "use strict";
  var cats = [
    { id: "writing", name: "Writing & email", short: "Writing help", subs: [
      ["fix-writing", "Fix my writing"], ["hard-messages", "Hard messages"], ["social-posts", "Social posts"], ["letters", "Letters & cards"]] },
    { id: "work", name: "Work & career", short: "Work life", subs: [
      ["job-hunt", "Job hunt"], ["meetings", "Meetings"], ["getting-ahead", "Getting ahead"], ["docs", "Spreadsheets & docs"]] },
    { id: "study", name: "Study & learning", short: "Study help", subs: [
      ["study-tools", "Study tools"], ["explain", "Explain it"], ["languages", "Languages"], ["homework", "Kids' homework help"]] },
    { id: "money", name: "Money", short: "Money basics", note: "Organizing only. No investment advice.", subs: [
      ["budgets", "Budgets"], ["bills", "Bills"], ["saving", "Saving"], ["paperwork", "Paperwork"]] },
    { id: "home", name: "Home & family", short: "Home life", subs: [
      ["meals", "Meals"], ["chores", "Chores"], ["kids", "Kids"], ["pets", "Pets"], ["fix-it", "Fix-it"]] },
    { id: "health", name: "Health & fitness", short: "Health habits", note: "Not medical advice.", subs: [
      ["workouts", "Workouts"], ["habits", "Habits"], ["doctor", "Doctor visits prep"], ["calm", "Calm"]] },
    { id: "travel", name: "Travel & going out", short: "Going out", subs: [
      ["trips", "Trips"], ["weekends", "Weekends & dates"], ["events", "Events"]] },
    { id: "build", name: "Make a website or app", short: "Sites & apps", subs: [
      ["personal-site", "Personal site"], ["small-apps", "Small apps"], ["fix-change", "Fix or change"], ["games", "Games"]] },
    { id: "business", name: "Business & selling", short: "Small business", subs: [
      ["start", "Start"], ["sell-online", "Sell online"], ["customers", "Customers"], ["marketing", "Marketing"]] },
    { id: "fun", name: "Fun & creative", short: "Just fun", subs: [
      ["stories", "Stories"], ["games-puzzles", "Games & puzzles"], ["art-design", "Art & design"], ["hobbies", "Hobbies"]] }
  ].map(function (c) {
    c.subs = c.subs.map(function (s) { return { id: s[0], name: s[1] }; });
    return c;
  });

  /* 24×24 line icons, one stroke weight (2), drawn for this page. Inner SVG markup only. */
  var icons = {
    writing: '<path d="M3 6.5h12.5v11H3z"/><path d="M3 6.5l6.25 5 6.25-5"/><path d="M14.5 17.5l6-6 2 2-6 6h-2z"/>',
    work: '<rect x="3.5" y="7.5" width="17" height="12" rx="1.5"/><path d="M9 7.5V5h6v2.5M3.5 12.5h17M11 12.5v2h2v-2"/>',
    study: '<path d="M3 5.5c3.2-1 6-.6 9 1.5v13c-3-2-5.8-2.5-9-1.5z"/><path d="M21 5.5c-3.2-1-6-.6-9 1.5v13c3-2 5.8-2.5 9-1.5z"/>',
    money: '<rect x="3" y="7" width="17" height="12" rx="1.5"/><path d="M3 7l11-3.5V7"/><path d="M14.5 11h6.5v4.5h-6.5z"/><circle cx="17" cy="13.25" r=".6"/>',
    home: '<path d="M3 11.5l9-7.5 9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>',
    health: '<path d="M12 20.5s-8-5-8-11a4.5 4.5 0 0 1 8-2.7 4.5 4.5 0 0 1 8 2.7c0 6-8 11-8 11z"/><path d="M6.5 12h3l1.5-2.5 2 4.5 1.5-2h3"/>',
    travel: '<path d="M12 21s-6.5-6-6.5-11.5a6.5 6.5 0 0 1 13 0C18.5 15 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/>',
    build: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 8.5h18M10 12.5l-2.2 2.2 2.2 2.2M14 12.5l2.2 2.2-2.2 2.2"/>',
    business: '<path d="M4.5 10.5V20h15v-9.5"/><path d="M3 4.5h18l-1.2 6H4.2z"/><path d="M9.5 20v-5h5v5"/>',
    fun: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="8.5" cy="8.5" r="1.1"/><circle cx="15.5" cy="15.5" r="1.1"/><circle cx="12" cy="12" r="1.1"/><circle cx="15.5" cy="8.5" r="1.1"/><circle cx="8.5" cy="15.5" r="1.1"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>',
    check: '<path d="M4.5 12.5l5 5 10-11"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    alert: '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 9.5v5M12 17.2v.3"/>',
    flag: '<path d="M5 21V4M5 4.5h12l-2.5 4 2.5 4H5"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M4.5 19.5h15"/>',
    copy: '<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="1.5"/><path d="M15.5 8.5V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9.5a1 1 0 0 0 1 1h3.5"/>',
    flip: '<path d="M4 9a8 8 0 0 1 14-3l2 2"/><path d="M20 4v4h-4"/><path d="M20 15a8 8 0 0 1-14 3l-2-2"/><path d="M4 20v-4h4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    remix: '<circle cx="6" cy="5.5" r="2"/><circle cx="6" cy="18.5" r="2"/><circle cx="18" cy="9" r="2"/><path d="M6 7.5v9M18 11c0 4-6 3-11 6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.2-4.2 4.2-6.5 8-6.5s6.8 2.3 8 6.5"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
    back: '<path d="M20 12H5M11 6l-6 6 6 6"/>',
    thumbUp: '<path d="M7 10.5v9.5H4v-9.5zM7 10.5l4-7c1.5 0 2.5 1 2.2 2.6l-.7 3.4h6a1.7 1.7 0 0 1 1.6 2.1l-1.7 6.6a2 2 0 0 1-2 1.3H7"/>',
    thumbDown: '<path d="M7 13.5V4H4v9.5zM7 13.5l4 7c1.5 0 2.5-1 2.2-2.6l-.7-3.4h6a1.7 1.7 0 0 0 1.6-2.1l-1.7-6.6A2 2 0 0 0 16.2 4H7"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20.5h7M9.5 17h5v3.5h-5z"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
    slot: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M12 9v6M9 12h6"/>'
  };

  window.SL_DATA = {
    cats: cats,
    /* ids match the API; GET /api/sl/taxonomy replaces these when it answers */
    forTags: [{ id: "anyone", name: "Anyone" }, { id: "student", name: "Student" }, { id: "parent", name: "Parent" }, { id: "small-business", name: "Small business" }, { id: "job-seeker", name: "Job seeker" }, { id: "creator", name: "Creator" }],
    worksIn: [{ id: "claude-ai", name: "Claude.ai" }, { id: "claude-code", name: "Claude Code" }],
    reportReasons: [["unsafe", "Unsafe"], ["broken", "Doesn't work"], ["copied", "Copied from someone"], ["spam", "Spam"]],
    statuses: { draft: "Draft", review: "In review", live: "Live", changes: "Needs changes", hidden: "Hidden" },
    icons: icons,
    /* the 8 tested ready-made skills and where they live in the library */
    seedMap: {
      "polish-email": ["writing", "fix-writing", "anyone"],
      "resume-tailor": ["work", "job-hunt", "job-seeker"],
      "study-buddy": ["study", "study-tools", "student"],
      "habit-tracker": ["health", "habits", "anyone"],
      "meal-plan": ["home", "meals", "parent"],
      "trip-planner": ["travel", "trips", "anyone"],
      "one-page-site": ["build", "personal-site", "creator"],
      "business-landing": ["business", "start", "small-business"]
    }
  };
})();
