// Weekline v2: static data. Sample and Editorial rows are labeled as such everywhere they show.
// Ported from weekline-app/src/data/events.ts and lifeGoals.ts (Nov 2026), retagged for v2 goals.

export const GOALS = [
  { id: "fit", label: "Get fit", short: "Get fit", target: 3, unit: "a week", photo: "prospect-park", pos: "30% 60%", tags: ["active", "fitness", "move-pack", "run", "yoga"] },
  { id: "people", label: "Meet people", short: "Meet people", target: 2, unit: "a week", photo: "bbp-sunset", pos: "50% 70%", tags: ["social", "community", "seeking-friends", "meetup"] },
  { id: "learn", label: "Learn something", short: "Learn", target: 1, unit: "a week", photo: "clay-hands", pos: "40% 18%", tags: ["learn", "class"] },
  { id: "network", label: "Grow my network", short: "Network", target: 1, unit: "a week", photo: "manhattan-gold", pos: "60% 40%", tags: ["seeking-network", "talks", "industry"] },
  { id: "out", label: "Go out more", short: "Go out", target: 2, unit: "a week", photo: "domino", pos: "55% 50%", tags: ["music", "nightlife", "comedy", "film", "theater", "art", "culture", "food", "date"] },
  { id: "calm", label: "Feel less busy", short: "Less busy", target: 2, unit: "nights kept free", photo: "gazebo", pos: "50% 46%", tags: ["calm", "outdoors", "walk"] },
];

export const LEARN_CHIPS = ["Pottery", "Spanish", "Photography", "Cooking", "Dance", "Coding"];

export const ZONES = [
  { id: "brooklyn", label: "Brooklyn" },
  { id: "manhattan", label: "Manhattan" },
];

// Rough neighborhood centers, used only to estimate travel minutes (2.2 min a mile + 12 min wait).
export const HOODS = {
  brooklyn: {
    "Williamsburg": [40.7081, -73.9571], "Greenpoint": [40.7304, -73.9515], "Bushwick": [40.6958, -73.9171],
    "Bed-Stuy": [40.6872, -73.9418], "Fort Greene": [40.6892, -73.9742], "Dumbo": [40.7033, -73.9881],
    "Park Slope": [40.6710, -73.9814], "Prospect Heights": [40.6775, -73.9692], "Crown Heights": [40.6694, -73.9422],
    "Sunset Park": [40.6455, -74.0124],
  },
  manhattan: {
    "Lower East Side": [40.7150, -73.9843], "East Village": [40.7265, -73.9815], "West Village": [40.7358, -74.0036],
    "Chelsea": [40.7465, -74.0014], "Midtown": [40.7549, -73.9840], "Upper West Side": [40.7870, -73.9754],
    "Upper East Side": [40.7736, -73.9566], "Harlem": [40.8116, -73.9465], "Financial District": [40.7075, -74.0113],
  },
};
// Extra places that sample rows use (not offered as home picks).
export const PLACES = {
  "Gowanus": [40.6733, -73.9903], "Battery Park": [40.7033, -74.0170], "SoHo": [40.7233, -74.0030],
  "Downtown Brooklyn": [40.6928, -73.9903], "Grand Army Plaza": [40.6743, -73.9701], "Central Park West": [40.7769, -73.9762],
};

export const MINUTES = [15, 30, 45];
export const BUDGETS = [
  { id: 0, label: "$0", sub: "Free only" },
  { id: 25, label: "$25", sub: "a week" },
  { id: 60, label: "$60", sub: "a week" },
  { id: 100, label: "$100+", sub: "a week" },
];
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DAYS_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const MON3 = MONTHS.map((m) => m.slice(0, 3));

export const CREWS = [
  { id: "cheap-thrills", name: "Cheap Thrills", line: "Most of the city, little of the money." },
  { id: "dateline", name: "Dateline", line: "One good night with a plan." },
  { id: "move-pack", name: "Move Pack", line: "Weeks that move." },
  { id: "culture-circuit", name: "Culture Circuit", line: "Shows, screens, rooms with something on." },
  { id: "table-hop", name: "Table Hop", line: "Markets and one-off dinners." },
  { id: "wildcard", name: "Wildcard", line: "One odd night, one free find." },
];

export const SKIP_REASONS = [
  { id: "far", label: "too far" },
  { id: "pricey", label: "too pricey" },
  { id: "notme", label: "not my thing" },
  { id: "busy", label: "busy" },
];

export const PHOTOS = {
  "bridge": { alt: "Brooklyn Bridge at sunset seen from the Brooklyn Bridge Park boardwalk", credit: "“Brooklyn Bridge at sunset from Brooklyn Bridge Park, New York City”, SebastianBlumeArt, CC BY-SA 4.0", short: "SebastianBlumeArt, CC BY-SA 4.0" },
  "prospect-park": { alt: "Autumn trees and a path in Prospect Park", credit: "“Prospect Park New York November 2016 001”, King of Hearts, CC BY-SA 4.0", short: "King of Hearts, CC BY-SA 4.0" },
  "clay-hands": { alt: "Hands shaping clay on a potter's wheel", credit: "“Potter shaping clay on a traditional manual potter’s wheel in India 02”, Gannu03, CC BY-SA 4.0", short: "Gannu03, CC BY-SA 4.0" },
  "bbp-sunset": { alt: "Sunset over the water at Brooklyn Bridge Park, one person at the railing", credit: "“Brooklyn Bridge Park - sunset”, Adjoajo, CC BY-SA 4.0", short: "Adjoajo, CC BY-SA 4.0" },
  "gazebo": { alt: "Rustic gazebo on Prospect Park Lake on an autumn evening", credit: "“Rustic Gazebo Prospect Park Lake Autumn Evening”, Lambertphotos, CC BY-SA 4.0", short: "Lambertphotos, CC BY-SA 4.0" },
  "domino": { alt: "Sun setting behind the Williamsburg Bridge, seen from Domino Park", credit: "“Domino Park, Brooklyn - Early Evening View - Sunset”, Daniel Prostak, CC BY-SA 4.0", short: "Daniel Prostak, CC BY-SA 4.0" },
  "manhattan-gold": { alt: "Midtown Manhattan skyline lit gold at sunset across the Hudson", credit: "“Manhattan Gold”, Phil Dolby, CC BY 2.0", short: "Phil Dolby, CC BY 2.0" },
};
export const photoUrl = (id) => `photos/${id}.jpg`;

// Holidays inside the planning window. Plans go lighter on these days.
export const HOLIDAYS = {
  "2026-11-26": { name: "Thanksgiving", line: "Thanksgiving. Nothing pushed today." },
  "2026-12-24": { name: "Christmas Eve", line: "Christmas Eve. Nothing pushed today." },
  "2026-12-25": { name: "Christmas", line: "Christmas. Nothing pushed today." },
  "2026-12-31": { name: "New Year's Eve", line: "New Year's Eve. Your call." },
  "2027-01-01": { name: "New Year's Day", line: "New Year's Day. Nothing pushed today." },
};

// Year strip themes. These are ideas, not dated listings.
export const YEAR_IDEAS = [
  "Resolutions and indoor classes", "Restaurant Week", "First outdoor runs", "Cherry blossoms",
  "Shape Up season", "Parks summer series", "Shakespeare in the Park", "Outdoor movies",
  "Fall classes start", "Open House New York", "Marathon week", "Holiday markets",
];
// Approximate NYC sunset on the 15th, minutes after noon (4:54 pm in Jan … 4:31 pm in Dec).
export const SUNSET = [294, 332, 425, 458, 489, 509, 508, 477, 427, 377, 278, 271];

// Plain words for what it learns.
export const TAG_WORDS = {
  active: "moving", fitness: "workouts", outdoors: "being outside", run: "runs", yoga: "yoga", walk: "walks",
  social: "group things", community: "community rooms", learn: "classes", class: "classes", talks: "talks",
  music: "live music", nightlife: "late nights", comedy: "comedy", film: "film", theater: "theater", art: "art",
  culture: "culture", food: "food", date: "date nights", market: "markets", parks: "parks", calm: "quiet nights",
  pottery: "pottery", spanish: "Spanish", photography: "photography", cooking: "cooking", dance: "dance", coding: "coding",
  free: "free things", family: "family events", history: "history",
};
export const SLOT_WORDS = {
  morning: "mornings", afternoon: "afternoons", evening: "early evenings", night: "late nights",
};

const PARKS = "https://www.nycgovparks.org/events";

// Weekday templates. kind: "sample" = made-up example row; "editorial" = a real kind of thing to look for,
// written by the Weekline desk, not a confirmed listing.
const T = (id, title, hood, borough, day, time, cost, tags, kind, url, extra = {}) =>
  ({ id, title, hood, borough, day, time, cost, tags, kind, url, ...extra });

// Old app SAMPLE_EVENTS (used only when the live NYC Parks fetch fails).
export const SAMPLE_EVENTS = [
  T("s1", "Sunset jazz on the pier", "Williamsburg", "Brooklyn", "Fri", "6:30 PM", 0, ["music", "outdoors", "date", "free", "food"], "sample", PARKS),
  T("s2", "Chelsea gallery night walk", "Chelsea", "Manhattan", "Thu", "5:00 PM", 0, ["art", "culture", "free"], "sample", "https://www.nyc.gov/events"),
  T("s3", "Sunrise run club and bagels", "Prospect Heights", "Brooklyn", "Sat", "7:00 AM", 8, ["active", "run", "outdoors", "social"], "sample", "https://lu.ma"),
  T("s4", "Underground comedy night", "East Village", "Manhattan", "Wed", "8:00 PM", 15, ["comedy", "nightlife", "date"], "sample", "https://dice.fm"),
  T("s5", "Warehouse pop-up market", "Bushwick", "Brooklyn", "Sun", "12:00 PM", 0, ["market", "food", "free"], "sample", "https://www.nyc.gov/events"),
  T("s6", "Rooftop film: noir classics", "Lower East Side", "Manhattan", "Sat", "8:30 PM", 22, ["film", "date", "culture"], "sample", "https://feverup.com"),
  T("s7", "Community yoga in McCarren Park", "Greenpoint", "Brooklyn", "Tue", "6:00 PM", 0, ["active", "yoga", "outdoors", "free", "parks"], "sample", PARKS),
  T("s8", "Harlem soul brunch", "Harlem", "Manhattan", "Sun", "11:00 AM", 35, ["food", "music", "date"], "sample", "https://www.ticketmaster.com"),
  T("s10", "Silent disco ferry", "Battery Park", "Manhattan", "Fri", "10:00 PM", 28, ["nightlife", "music", "date"], "sample", "https://feverup.com"),
  T("s12", "Climbing gym intro night", "Dumbo", "Brooklyn", "Wed", "6:30 PM", 25, ["active", "social"], "sample", "https://lu.ma"),
  T("s13", "Small-plates tasting walk", "Fort Greene", "Brooklyn", "Fri", "7:00 PM", 45, ["food", "date"], "sample", "https://feverup.com"),
  T("s14", "Bookstore author night", "West Village", "Manhattan", "Tue", "7:30 PM", 0, ["culture", "talks", "free"], "sample", "https://lu.ma"),
  T("s15", "Listening bar, hi-fi night", "Bushwick", "Brooklyn", "Sat", "9:00 PM", 18, ["music", "nightlife"], "sample", "https://dice.fm"),
  T("s16", "Night market dumplings", "Sunset Park", "Brooklyn", "Thu", "6:30 PM", 20, ["food", "market"], "sample", "https://www.nyc.gov/events"),
  T("s17", "Prospect Park run club", "Grand Army Plaza", "Brooklyn", "Sat", "10:00 AM", 0, ["active", "run", "outdoors", "social", "free", "parks"], "sample", PARKS),
  T("s18", "Museum late: free hours and a talk", "Upper East Side", "Manhattan", "Fri", "6:00 PM", 0, ["culture", "art", "talks", "free"], "sample", "https://www.nyc.gov/events"),
  T("s19", "Bodyweight intervals", "Williamsburg", "Brooklyn", "Mon", "6:00 PM", 0, ["active", "fitness", "outdoors", "free", "parks"], "sample", PARKS),
  T("s20", "Hatha flow on the lawn", "Lower East Side", "Manhattan", "Thu", "6:30 PM", 0, ["active", "yoga", "free", "parks"], "sample", PARKS),
  T("s21", "Hudson River evening walk", "Chelsea", "Manhattan", "Mon", "5:30 PM", 0, ["walk", "outdoors", "calm", "free"], "sample", PARKS),
  T("s22", "Pier stretch class", "Dumbo", "Brooklyn", "Sun", "9:30 AM", 0, ["active", "yoga", "outdoors", "free"], "sample", PARKS),
];

// Editorial rows from lifeGoals.ts seeking templates (friends, network) plus quiet nights.
export const EDITORIAL_EVENTS = [
  T("e1", "Board game night at the library", "Park Slope", "Brooklyn", "Wed", "6:30 PM", 0, ["social", "community", "free"], "editorial", "https://www.bklynlibrary.org/calendar"),
  T("e3", "Volunteer park steward morning", "Fort Greene", "Brooklyn", "Sat", "10:00 AM", 0, ["social", "community", "outdoors", "active", "free", "parks"], "editorial", "https://www.nycgovparks.org/opportunities/volunteer"),
  T("e4", "Creative industry mixer", "SoHo", "Manhattan", "Tue", "6:00 PM", 15, ["seeking-network", "industry", "talks", "art"], "editorial", "https://lu.ma/nyc"),
  T("e5", "Nonprofit happy hour", "Lower East Side", "Manhattan", "Thu", "6:30 PM", 0, ["seeking-network", "community", "free"], "editorial", "https://www.nyc.gov/events"),
  T("e6", "Founders office hours, open Q and A", "Dumbo", "Brooklyn", "Wed", "5:30 PM", 0, ["seeking-network", "industry", "talks", "free"], "editorial", "https://www.meetup.com/find/?keywords=founders&location=us--ny--New%20York"),
  T("e7", "Run club social, any pace", "Williamsburg", "Brooklyn", "Thu", "7:00 PM", 0, ["social", "active", "run", "free"], "editorial", "https://www.meetup.com/find/?keywords=run%20club&location=us--ny--New%20York"),
  T("e8", "Library reading room hour", "Midtown", "Manhattan", "Tue", "6:00 PM", 0, ["calm", "free", "culture"], "editorial", "https://www.nypl.org/events/calendar"),
  T("e9", "Sunset walk, Brooklyn Bridge Park", "Dumbo", "Brooklyn", "Sun", "4:00 PM", 0, ["calm", "walk", "outdoors", "free", "parks"], "editorial", PARKS),
];

// Learn-something rows, one or two per chip.
export const LEARN_EVENTS = [
  T("l1", "Intro to wheel throwing", "Greenpoint", "Brooklyn", "Tue", "7:00 PM", 45, ["learn", "class", "pottery", "art"], "sample", "https://www.eventbrite.com/d/ny--brooklyn/pottery/"),
  T("l2", "Hand-building clay drop-in", "Gowanus", "Brooklyn", "Mon", "7:00 PM", 40, ["learn", "class", "pottery", "art", "social"], "sample", "https://lu.ma"),
  T("l3", "Spanish and English language exchange", "Williamsburg", "Brooklyn", "Thu", "7:00 PM", 0, ["learn", "spanish", "social", "free"], "editorial", "https://www.meetup.com/find/?keywords=language%20exchange&location=us--ny--New%20York"),
  T("l4", "Conversational Spanish at the library", "Upper West Side", "Manhattan", "Wed", "6:00 PM", 0, ["learn", "class", "spanish", "free"], "editorial", "https://www.nypl.org/events/calendar"),
  T("l5", "Golden hour photo walk", "Dumbo", "Brooklyn", "Sat", "3:30 PM", 0, ["learn", "photography", "outdoors", "walk", "free"], "sample", "https://www.meetup.com/find/?keywords=photo%20walk&location=us--ny--New%20York"),
  T("l6", "Film camera basics", "East Village", "Manhattan", "Wed", "7:00 PM", 25, ["learn", "class", "photography"], "sample", "https://lu.ma"),
  T("l7", "Knife skills, one night", "Williamsburg", "Brooklyn", "Sun", "4:00 PM", 55, ["learn", "class", "cooking", "food", "social"], "sample", "https://www.eventbrite.com/d/ny--new-york/cooking-class/"),
  T("l8", "Dumpling folding class", "Lower East Side", "Manhattan", "Fri", "6:30 PM", 35, ["learn", "class", "cooking", "food"], "sample", "https://lu.ma"),
  T("l9", "Salsa for beginners, drop in", "East Village", "Manhattan", "Fri", "7:30 PM", 18, ["learn", "dance", "social", "active"], "editorial", "https://www.eventbrite.com/d/ny--new-york/salsa/"),
  T("l10", "Swing dance first-timer night", "Bed-Stuy", "Brooklyn", "Wed", "7:30 PM", 15, ["learn", "dance", "social", "active"], "sample", "https://lu.ma"),
  T("l11", "Free coding class at the library", "Downtown Brooklyn", "Brooklyn", "Mon", "6:00 PM", 0, ["learn", "class", "coding", "free"], "editorial", "https://www.bklynlibrary.org/calendar"),
  T("l12", "Python night for beginners", "Midtown", "Manhattan", "Thu", "6:30 PM", 0, ["learn", "class", "coding", "free"], "editorial", "https://www.nypl.org/events/calendar"),
];

// Dated editorial rows (real, recurring public events).
export const DATED_EVENTS = [
  { id: "d-walk-bk-2026", title: "Walk off dinner: the Prospect Park loop", hood: "Grand Army Plaza", borough: "Brooklyn", date: "2026-11-26", time: "3:30 PM", cost: 0, tags: ["calm", "walk", "outdoors", "free", "parks"], kind: "editorial", url: "https://www.nycgovparks.org/parks/prospect-park" },
  { id: "d-walk-mn-2026", title: "Walk off dinner: Central Park reservoir loop", hood: "Upper East Side", borough: "Manhattan", date: "2026-11-26", time: "3:30 PM", cost: 0, tags: ["calm", "walk", "outdoors", "free", "parks"], kind: "editorial", url: "https://www.nycgovparks.org/parks/central-park" },
  { id: "d-parade-2026", title: "Macy's Thanksgiving Day Parade", hood: "Central Park West", borough: "Manhattan", date: "2026-11-26", time: "8:30 AM", cost: 0, tags: ["culture", "outdoors", "free", "family"], kind: "editorial", url: "https://www.macys.com/social/parade/" },
];

// Which photo to use for an event, by tag.
export function photoFor(tags = []) {
  const has = (t) => tags.includes(t);
  if (has("pottery") || has("class") || has("learn")) return "clay-hands";
  if (has("run") || has("active") || has("fitness") || has("yoga")) return "prospect-park";
  if (has("calm") || has("walk")) return "gazebo";
  if (has("seeking-network") || has("industry")) return "manhattan-gold";
  if (has("music") || has("nightlife") || has("date") || has("film")) return "domino";
  if (has("outdoors")) return "bbp-sunset";
  return "bridge";
}

export function goalsForTags(tags = []) {
  return GOALS.filter((g) => g.tags.some((t) => tags.includes(t))).map((g) => g.id);
}
