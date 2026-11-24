// Runs in the page: a fixed set of profiles + signals → buildWeek summary.
async function probe(base) {
  const W = await import(base + "store.js?probe=" + Date.now());
  const today = "2026-11-23";
  const profiles = [
    { goals: ["fit", "people"], zone: "brooklyn", hood: "Williamsburg", minutes: 30, budget: 25, free_days: [1, 3, 4, 5, 6] },
    { goals: ["learn", "network"], learn: { chips: ["Pottery"], text: "" }, zone: "manhattan", hood: "East Village", minutes: 45, budget: 50, free_days: [0, 2, 4, 5] },
    { goals: ["calm"], zone: "brooklyn", hood: "Park Slope", minutes: 15, budget: 0, free_days: [0, 1, 2, 3, 4, 5, 6] },
  ];
  W.resetLocal();
  const S = W.S || null;
  const dates = W.planDates(profiles[0], today);
  const evs = W.catalog(dates, []);
  const out = [];
  for (const [i, p] of profiles.entries()) {
    W.resetLocal();
    // a few fixed signals for the second pass
    const r1 = W.buildWeek(p, evs, today);
    const pick = r1.days.find((d) => d.plan);
    if (pick) { W.signal("loved", pick.plan.ev); W.signal("went", pick.plan.ev); }
    const other = r1.days.find((d) => d.plan && d !== pick);
    if (other) W.skip(other.plan.ev, "pricey");
    const r2 = W.buildWeek(p, evs, today);
    const sum = (r) => r.days.map((d) => d.date + ":" + d.kind + ":" + (d.plan ? d.plan.ev.id + "@" + d.plan.score.toFixed(3) : "") + ":" + d.suggest.map((c) => c.ev.id).join(",")).join("|") + " x=" + r.x + " y=" + r.y;
    out.push(sum(r1), sum(r2));
  }
  W.resetLocal();
  return out;
}
