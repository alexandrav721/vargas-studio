// Weekline's matching algorithm, as settings. Version 1 = the numbers the app shipped with (24 Nov 2026).
// The live version comes from the server (GET /api/wl/algo), changed only through an owner-approved proposal
// in the team console. If the server can't be reached, this copy is used.
export const ALGO_V1 = {
  version: 1,
  learn: {
    halfLifeDays: 56,                                            // older choices fade: half the weight after 8 weeks
    weights: { went: 5, loved: 2, lock: 3, unlock: -3, ics: 3, rsvp: 2, up: 2, down: -2 },
    skip: { notme: -1, busy: -1, missed: -2 },                   // what each skip reason does to tags or time slots
  },
  fit: {
    goal: 3,                                                     // goal fit ×3
    learnMatch: 1.5, learnMiss: 0.4,                             // "Learn something": matches your chips or not
    tagMin: -4, tagMax: 6, tasteCap: 8,                          // how far taste can move one event
    friends: 2,                                                  // each friend going
    novelty: 0.5,                                                // a little bonus for something new
    minutesPerPoint: 5,                                          // 1 point off for every 5 minutes past your limit
    farStep: 5, minTolerance: 10, tooFarSlack: 25,               // "too far" skips shrink your limit by 5 minutes
    priceDecay: 0.8, pricePerPoint: 10,                          // "too pricey" skips shrink your budget by 20%
  },
  week: { goalQuotaPenalty: 4, minScore: -2, suggestions: 3 },
};
