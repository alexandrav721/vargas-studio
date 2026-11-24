// Weekline HQ: the private team console. Owners approve; admins suggest. Everything checks roles on the server too.
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const when = (ms) => (ms ? new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "");
function toast(t) { const el = $("toast"); el.textContent = t; el.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("on"), 2400); }
async function api(method, path, body) {
  const r = await fetch("/api/wl/" + path, { method, credentials: "same-origin", headers: body ? { "content-type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.error || "Something went wrong."), { status: r.status });
  return j;
}

/* Every setting, in plain words, grouped by the step it belongs to. */
const LABELS = {
  "learn.halfLifeDays": "Days until an old choice counts half",
  "learn.weights.went": "Went to it", "learn.weights.loved": "Loved it", "learn.weights.lock": "Locked it",
  "learn.weights.unlock": "Removed a lock", "learn.weights.ics": "Added to their calendar", "learn.weights.rsvp": "RSVP'd yes",
  "learn.weights.up": "Tapped More like this", "learn.weights.down": "Tapped Less like this",
  "learn.skip.notme": "Skipped: not my thing (per tag)", "learn.skip.busy": "Skipped: busy (that time slot)", "learn.skip.missed": "Said they didn't go (that time slot)",
  "fit.goal": "Matches one of their goals", "fit.learnMatch": "Learn goal: matches their topics", "fit.learnMiss": "Learn goal: other topics",
  "fit.tagMin": "Lowest one taste can go", "fit.tagMax": "Highest one taste can go", "fit.tasteCap": "Limit on all taste together",
  "fit.friends": "Each friend going", "fit.novelty": "Something new for them",
  "fit.minutesPerPoint": "Minutes over their travel limit per point lost", "fit.farStep": "Minutes cut from the limit per 'too far' skip",
  "fit.minTolerance": "Shortest travel limit", "fit.tooFarSlack": "Minutes past the limit before we drop it",
  "fit.priceDecay": "Budget kept per 'too pricey' skip (0.8 = 80%)", "fit.pricePerPoint": "Dollars over budget per point lost",
  "week.goalQuotaPenalty": "Points off once a goal has its nights this week", "week.minScore": "Lowest score we'll still plan", "week.suggestions": "Other ideas shown per night",
};
const STEPS = [
  { n: 1, name: "Listen", badge: "Automatic", q: "What does this person want from their week?", does: "Reads their goals, crew, neighborhood, travel time, budget and free nights.", prefix: null },
  { n: 2, name: "Gather", badge: "Auto, then a person reviews", person: true, q: "What's actually on this week?", does: "Pulls NYC Parks events live, our editorial picks (a person chooses these), and soon their own Luma, Partiful, calendar and ticket emails, plus Ticketmaster.", prefix: null },
  { n: 3, name: "Clean", badge: "Automatic", q: "Is it real, and is it for them?", does: "Removes duplicates and drops kids', cancelled and online-only events. Tags each one: type, cost, time slot, neighborhood.", prefix: null },
  { n: 4, name: "Fit", badge: "Automatic", q: "How well does each event fit this person?", does: "Scores every event: goal fit, their taste, friends going, travel time, price, and a little bonus for something new.", prefix: "fit." },
  { n: 5, name: "Fill the week", badge: "Automatic", q: "Which nights, and which picks?", does: "Plans only their free nights, skips busy ones, and spreads picks across their goals.", prefix: "week." },
  { n: 6, name: "Ask", badge: "The person decides", person: true, q: "Yes or no?", does: "They lock, skip with a reason, say More or Less like this, and later tell us if they went and loved it.", prefix: null },
  { n: 7, name: "Learn", badge: "Automatic", q: "What did that teach us?", does: "Each answer moves their taste. Older answers fade, so it follows who they are now.", prefix: "learn." },
  { n: 8, name: "Explain", badge: "Automatic", q: "Why this pick?", does: "Every pick shows its reasons in plain words, so people trust it and correct it.", prefix: null },
];
const flat = (o, pre = "") => Object.entries(o).flatMap(([k, v]) => (k === "version" ? [] : typeof v === "object" ? flat(v, pre + k + ".") : [[pre + k, v]]));

let ST = null, me = null, tab = "flow";

async function load() {
  me = await api("GET", "hq/me").catch(() => ({ signed_in: false }));
  if (!me.signed_in) return gate("Sign in to Weekline first", "The team console uses your Weekline account.", '<a class="btn" href="../#/you">Sign in</a>');
  if (!me.role) return gate("This is for the Weekline team", "Ask an owner to add you. They need the email on your Weekline account.", '<a class="btn ghost" href="../">Back to Weekline</a>');
  ST = await api("GET", "hq/state");
  $("who").textContent = `${me.name} · ${ST.role}`;
  $("tabs").hidden = false;
  render();
}
function gate(title, line, action) { $("main").innerHTML = `<div class="gate"><h1>${esc(title)}</h1><p class="lede" style="margin:10px auto 18px">${esc(line)}</p>${action}</div>`; }

function render() {
  const waiting = ST.proposals.filter((p) => p.status === "waiting");
  $("waitN").textContent = waiting.length || "";
  document.querySelectorAll("#tabs button").forEach((b) => b.setAttribute("aria-current", b.dataset.tab === tab ? "page" : "false"));
  ({ flow, skills, changes, versions, numbers, connections, team }[tab])();
}

function flow() {
  const live = flat(ST.live);
  $("main").innerHTML = `<h1>How Weekline matches people to events</h1>
    <p class="lede">Eight steps, the same every time. Version ${ST.live.version} is live. Changes go through <a href="#" data-go="changes">Changes</a>, and an owner says yes before anything goes live.</p>
    <ol class="flow">${STEPS.map((s) => {
      const sets = s.prefix ? live.filter(([p]) => p.startsWith(s.prefix)) : [];
      return `<li><span class="n">${s.n}</span><div class="card"><h3>${esc(s.name)} <span class="badge${s.person ? " person" : ""}">${esc(s.badge)}</span></h3>
        <p class="q">${esc(s.q)}</p><p style="margin-top:6px">${esc(s.does)}</p>
        ${sets.length ? `<dl>${sets.slice(0, 6).map(([p, v]) => `<dt>${esc(LABELS[p] || p)}</dt><dd><b>${esc(v)}</b></dd>`).join("")}</dl>${sets.length > 6 ? `<p class="muted" style="margin-top:6px;font-size:14px">${sets.length - 6} more in <a href="#" data-go="skills">Skills</a></p>` : ""}` : ""}
      </div></li>`;
    }).join("")}</ol>`;
}

function skills() {
  const live = flat(ST.live), base = Object.fromEntries(flat(ST.builtin));
  const stepOf = (p) => (p.startsWith("fit.") ? "4 Fit" : p.startsWith("week.") ? "5 Fill the week" : "7 Learn");
  $("main").innerHTML = `<h1>Skills</h1><p class="lede">Every number the algorithm uses, in plain words. "v1" is what the app shipped with.</p>
    <table><thead><tr><th>Step</th><th>Setting</th><th>Name</th><th>Now</th><th>v1</th><th></th></tr></thead><tbody>
    ${live.map(([p, v]) => `<tr><td>${stepOf(p)}</td><td>${esc(LABELS[p] || p)}</td><td><code>${esc(p)}</code></td><td class="num">${esc(v)}</td><td class="muted">${esc(base[p])}</td>
      <td><button class="btn ghost small" data-suggest="${esc(p)}">Suggest</button></td></tr>`).join("")}</tbody></table>`;
}

function changeHTML(p) {
  const diff = p.change ? `<div class="diff">${p.change.map((c) => `<span>${esc(LABELS[c.path] || c.path)}: <s>${esc(c.from)}</s> → <ins>${esc(c.to)}</ins></span>`).join("")}</div>` : "";
  const chip = p.status === "waiting" ? '<span class="chip wait">Waiting for an owner</span>' : p.status === "approved" ? `<span class="chip live">Approved${p.version ? " · v" + p.version : ""}</span>` : '<span class="chip no">Declined</span>';
  const owner = ST.role === "owner" && p.status === "waiting";
  return `<div class="card" style="margin-top:10px"><h3 style="font-size:18px">${esc(p.title)} ${chip}</h3>
    <p class="muted" style="font-size:14px">${p.kind === "algo" ? "Algorithm change" : "Request"} · by ${esc(p.by_name || "someone")} · ${when(p.at)}${p.decided_at ? ` · decided by ${esc(p.decided_name || "an owner")} ${when(p.decided_at)}` : ""}</p>
    ${p.why ? `<p style="margin-top:6px">${esc(p.why)}</p>` : ""}${diff}
    ${p.decision_note ? `<p class="muted" style="margin-top:6px">Note: ${esc(p.decision_note)}</p>` : ""}
    ${owner ? `<div class="row"><button class="btn ok" data-decide="approve" data-id="${esc(p.id)}">Approve${p.kind === "algo" ? " and publish" : ""}</button><button class="btn no" data-decide="decline" data-id="${esc(p.id)}">Decline</button></div>` : ""}</div>`;
}
function changes(prefill) {
  const waiting = ST.proposals.filter((p) => p.status === "waiting"), done = ST.proposals.filter((p) => p.status !== "waiting");
  const paths = flat(ST.live).map(([p]) => p);
  $("main").innerHTML = `<h1>Changes</h1><p class="lede">Anyone on the team can suggest. Only an owner's yes publishes. Every version is kept.</p>
    <h2>Waiting for ${ST.role === "owner" ? "you" : "an owner"}</h2>${waiting.length ? waiting.map(changeHTML).join("") : '<p class="muted">Nothing waiting.</p>'}
    <h2>Suggest a change</h2>
    <form class="suggest" id="sugForm">
      <div class="kind" role="radiogroup" aria-label="Kind"><label style="display:flex;gap:6px;align-items:center"><input type="radio" name="kind" value="algo" ${prefill || true ? "checked" : ""} style="width:auto"> A number in the algorithm</label>
        <label style="display:flex;gap:6px;align-items:center"><input type="radio" name="kind" value="note" style="width:auto"> Something else (wording, picks, feeds)</label></div>
      <div id="algoFields"><label>Setting<select name="path">${paths.map((p) => `<option value="${esc(p)}"${p === prefill ? " selected" : ""}>${esc(LABELS[p] || p)} (now ${esc(flat(ST.live).find(([x]) => x === p)[1])})</option>`).join("")}</select></label>
        <label style="margin-top:10px">New value<input name="to" type="number" step="any" required></label></div>
      <label>Short title<input name="title" maxlength="120" required placeholder="e.g. Friends going should count more"></label>
      <label>Why<textarea name="why" maxlength="600" placeholder="What did you see? User feedback, numbers, a hunch."></textarea></label>
      <div><button class="btn" type="submit">Send for approval</button></div>
    </form>
    <h2>History</h2>${done.length ? done.map(changeHTML).join("") : '<p class="muted">No decisions yet.</p>'}`;
  const f = $("sugForm");
  const sync = () => { const algo = f.kind.value === "algo"; $("algoFields").hidden = !algo; f.to.required = algo; };
  f.querySelectorAll('input[name="kind"]').forEach((r) => (r.onchange = sync)); sync();
  f.onsubmit = async (e) => {
    e.preventDefault();
    const body = { kind: f.kind.value, title: f.title.value, why: f.why.value };
    if (body.kind === "algo") body.change = [{ path: f.path.value, to: Number(f.to.value) }];
    try { ST = await api("POST", "hq/proposals", body); toast("Sent. It waits for an owner's yes."); render(); } catch (err) { toast(err.message); }
  };
}

function versions() {
  const vs = ST.versions.slice();
  if (!vs.some((v) => v.version === 1)) vs.push({ version: 1, note: "Version 1 (built in)", created_at: 0, live: ST.live.version === 1 });
  $("main").innerHTML = `<h1>Versions</h1><p class="lede">Every published version is kept. An owner can bring any one back.</p>
    <table><thead><tr><th>Version</th><th>What changed</th><th>When</th><th></th></tr></thead><tbody>
    ${vs.map((v) => `<tr><td class="num">v${v.version}</td><td>${esc(v.note || "")}</td><td class="muted">${when(v.created_at)}</td>
      <td>${v.live || ST.live.version === v.version ? '<span class="chip live">Live</span>' : ST.role === "owner" ? `<button class="btn ghost small" data-restore="${v.version}">Bring back</button>` : ""}</td></tr>`).join("")}</tbody></table>`;
}

async function numbers() {
  $("main").innerHTML = `<h1>Numbers</h1><p class="muted">Loading…</p>`;
  try {
    const s = await api("GET", "hq/stats");
    const k = Object.fromEntries(s.kinds.map((x) => [x.kind, x.n]));
    const lockRate = k.lock ? Math.round((k.went || 0) / k.lock * 100) : 0;
    $("main").innerHTML = `<h1>Is it working?</h1><p class="lede">Last ${s.days} days. Totals only: no list of what any one person did.</p>
      <div class="stat-grid">
        <div class="stat"><b>${s.users}</b><span>accounts</span></div>
        <div class="stat"><b>${k.lock || 0}</b><span>picks locked</span></div>
        <div class="stat"><b>${lockRate}%</b><span>of locks they went to</span></div>
        <div class="stat"><b>${k.skip || 0}</b><span>skips</span></div>
        <div class="stat"><b>${k.up || 0}</b><span>More like this</span></div>
      </div>
      <h2>Why people skip</h2>${s.reasons.length ? `<table><tbody>${s.reasons.map((r) => `<tr><td>${esc({ far: "Too far", pricey: "Too pricey", notme: "Not my thing", busy: "Busy", missed: "Didn't go" }[r.reason] || r.reason || "No reason")}</td><td class="num">${r.n}</td></tr>`).join("")}</tbody></table>` : '<p class="muted">No skips yet.</p>'}
      <h2>People using it each week</h2>${s.weekly.length ? `<table><tbody>${s.weekly.map((w) => `<tr><td>Week of ${when(w.wk * 604800000)}</td><td class="num">${w.users}</td></tr>`).join("")}</tbody></table>` : '<p class="muted">Not enough weeks yet.</p>'}`;
  } catch (e) { $("main").innerHTML = `<h1>Numbers</h1><p class="muted">${esc(e.message)}</p>`; }
}

function connections() {
  const rows = [
    ["NYC Parks", "Live", "Free events, read every visit."],
    ["Editorial picks", "Live", "Chosen by a person on the team."],
    ["Luma, Partiful, any calendar link", "Building", "People paste their own calendar link; we read their events and busy nights."],
    ["Ticketmaster", "Waiting on a key", "Concerts, sports and theater. An owner sets the API key."],
    ["Google Calendar busy times", "Waiting on Google", "Built. Needs the 3 secrets and Google's app review."],
    ["Forward your tickets (email)", "Needs a yes", "A personal forwarding address for ticket emails. About $15–20 a month."],
    ["Reading Gmail directly", "Not now", "Needs a yearly paid security assessment. Forwarding covers most of it."],
  ];
  $("main").innerHTML = `<h1>Connections</h1><p class="lede">Where events come from, and what's next.</p>
    <table><thead><tr><th>Source</th><th>Status</th><th>Notes</th></tr></thead><tbody>${rows.map((r) => `<tr><td><b>${esc(r[0])}</b></td><td><span class="chip ${r[1] === "Live" ? "live" : ""}">${esc(r[1])}</span></td><td class="muted">${esc(r[2])}</td></tr>`).join("")}</tbody></table>`;
}

function team() {
  $("main").innerHTML = `<h1>Team</h1><p class="lede">Owners approve and publish. Admins see everything and suggest.</p>
    <table><thead><tr><th>Name</th><th>Role</th><th>Since</th><th></th></tr></thead><tbody>
    ${ST.team.map((t) => `<tr><td>${esc(t.name)}${t.email ? `<br><span class="muted" style="font-size:13px">${esc(t.email)}</span>` : ""}</td><td>${esc(t.role)}</td><td class="muted">${when(t.added_at)}</td>
      <td>${ST.role === "owner" && t.role !== "owner" ? `<button class="btn no small" data-remove="${esc(t.user_id)}">Remove</button>` : ""}</td></tr>`).join("")}</tbody></table>
    ${ST.role === "owner" ? `<h2>Add someone</h2><form class="suggest" id="teamForm"><label>Email on their Weekline account<input name="email" type="email" required></label>
      <label>Role<select name="role"><option value="admin">Admin: sees everything, suggests</option><option value="owner">Owner: approves and publishes</option></select></label>
      <div><button class="btn" type="submit">Add</button></div></form>` : ""}`;
  const f = $("teamForm");
  if (f) f.onsubmit = async (e) => { e.preventDefault(); try { ST = await api("POST", "hq/team", { email: f.email.value, role: f.role.value }); toast("Added."); render(); } catch (err) { toast(err.message); } };
}

document.addEventListener("click", async (e) => {
  const t = e.target.closest("button, a"); if (!t) return;
  if (t.dataset.tab) { tab = t.dataset.tab; render(); return; }
  if (t.dataset.go) { e.preventDefault(); tab = t.dataset.go; render(); return; }
  if (t.dataset.suggest) { tab = "changes"; render(); changes(t.dataset.suggest); return; }
  try {
    if (t.dataset.decide) {
      const note = t.dataset.decide === "decline" ? prompt("Why not? (optional, the team sees this)") ?? null : null;
      if (t.dataset.decide === "decline" && note === null) return;
      ST = await api("POST", `hq/proposals/${t.dataset.id}/${t.dataset.decide}`, { note: note || undefined });
      toast(t.dataset.decide === "approve" ? "Approved. It's live." : "Declined."); render();
    }
    if (t.dataset.restore && confirm(`Make version ${t.dataset.restore} live again?`)) { ST = await api("POST", `hq/algo/${t.dataset.restore}/restore`, {}); toast(`Version ${t.dataset.restore} is live.`); render(); }
    if (t.dataset.remove && confirm("Remove this person from the team?")) { ST = await api("POST", `hq/team/${t.dataset.remove}/remove`, {}); toast("Removed."); render(); }
  } catch (err) { toast(err.message); }
});

load();
