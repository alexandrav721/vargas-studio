/* Build Kit engine. Everything stays in this browser. */
(function () {
  const { ROOMS, TRAPS, RULES, LOOP, SIZES, ORDER } = window.KIT;
  const $ = (id) => document.getElementById(id);
  const byId = Object.fromEntries(ROOMS.map((r) => [r.id, r]));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? Math.min(ms, 40) : ms));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const icon = (d) => `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;

  /* ---------- state (per-viewer convenience only) ---------- */
  const KEY = "smez-buildkit-v1";
  const fresh = () => ({ tier: 0, a: {}, done: [], traps: [], rules: [], seen: [] });
  let S = fresh();
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(fresh(), JSON.parse(raw)); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  const rooms = () => ORDER.map((id) => byId[id]).filter((r) => r.tier <= (S.tier || 1));
  const ans = (rid) => (S.a[rid] = S.a[rid] || {});
  const answered = (q, val) => {
    if (q.type === "colors") return !!(val && val.touched);
    if (Array.isArray(val)) return val.filter((x) => String(x).trim()).length > 0;
    return !!(val && String(val).trim());
  };
  const guessTotal = () => rooms().reduce((n, r) => n + r.qs.reduce((m, q) => m + q.w, 0), 0);
  const guessLeft = () => rooms().reduce((n, r) => n + r.qs.reduce((m, q) => m + (answered(q, (S.a[r.id] || {})[q.id]) ? 0 : q.w), 0), 0);
  const roomPct = (r) => { const t = r.qs.reduce((m, q) => m + q.w, 0); const d = r.qs.reduce((m, q) => m + (answered(q, (S.a[r.id] || {})[q.id]) ? q.w : 0), 0); return d / t; };

  /* ---------- sound (Skills Made EZ signature: snap–ding) ---------- */
  let ctx, master, muted = false, noiseBuf;
  try { muted = localStorage.getItem(KEY + "-mute") === "1"; } catch (e) {}
  function audio() { if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)(); const c = ctx.createDynamicsCompressor(); c.threshold.value = -14; c.ratio.value = 4; master = ctx.createGain(); master.gain.value = muted ? 0 : 0.5; master.connect(c).connect(ctx.destination); } if (ctx.state === "suspended") ctx.resume(); return ctx; }
  function noise() { if (!noiseBuf) { noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; } const s = ctx.createBufferSource(); s.buffer = noiseBuf; return s; }
  function env(g, t, p, a, d) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(p, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function thump(t, f = 120, p = 0.9) { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.45, t + 0.14); env(g, t, p, 0.004, 0.16); o.connect(g).connect(master); o.start(t); o.stop(t + 0.22); }
  function hiss(t, dur, f0, f1, p, q = 1.2) { const s = noise(), bp = ctx.createBiquadFilter(), g = ctx.createGain(); bp.type = "bandpass"; bp.Q.value = q; bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + dur); env(g, t, p, Math.min(0.01, dur / 4), dur); s.connect(bp).connect(g).connect(master); s.start(t); s.stop(t + dur + 0.05); }
  function mallet(t, f, p = 0.5, d = 0.7) { [[1, p], [4, p * 0.12], [2.01, p * 0.18]].forEach(([m, pp]) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.value = f * m; env(g, t, pp, 0.003, m === 1 ? d : d * 0.35); o.connect(g).connect(master); o.start(t); o.stop(t + d + 0.1); }); }
  function wood(t, f = 520, p = 0.35) { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "triangle"; o.frequency.setValueAtTime(f * 1.5, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.02); env(g, t, p, 0.002, 0.06); o.connect(g).connect(master); o.start(t); o.stop(t + 0.1); }
  const C5 = 523.25, E5 = 659.25, G5 = 783.99, C6 = 1046.5;
  const SND = {
    sig(t) { hiss(t, 0.04, 3200, 2200, 0.5, 0.8); thump(t, 140, 0.7); mallet(t + 0.09, C5, 0.45); mallet(t + 0.21, G5, 0.5, 0.9); },
    tap(t) { wood(t, 520, 0.3); },
    pop(t) { hiss(t, 0.035, 2400, 5200, 0.35, 2.5); wood(t + 0.01, 1100, 0.14); },   // a guess popping
    bubble(t) { wood(t, 700 + Math.random() * 500, 0.12); },
    stamp(t) { thump(t, 90, 1); hiss(t, 0.05, 1500, 600, 0.25); },
    even(t) { wood(t, 440, 0.28); wood(t + 0.14, 440, 0.28); },
    card(t) { thump(t, 160, 0.6); hiss(t, 0.03, 2600, 1800, 0.35); mallet(t + 0.05, C6, 0.18, 0.4); },
    lift(t) { hiss(t, 1.1, 300, 4200, 0.18, 0.7); [C5, E5, G5, C6].forEach((f, i) => mallet(t + 0.5 + i * 0.12, f, 0.3, 0.8)); },
  };
  const BUZZ = { stamp: [30], card: [20, 60, 30], lift: [20, 70, 40] };
  function play(n) { try { audio(); if (muted) return; SND[n](ctx.currentTime + 0.01); if (BUZZ[n] && navigator.vibrate && navigator.userActivation && navigator.userActivation.hasBeenActive) navigator.vibrate(BUZZ[n]); } catch (e) {} }
  function setMute(m) { muted = m; $("mute").setAttribute("aria-pressed", m); $("mute").setAttribute("aria-label", m ? "Sound off" : "Sound on"); if (master) master.gain.value = m ? 0 : 0.5; try { localStorage.setItem(KEY + "-mute", m ? "1" : "0"); } catch (e) {} }
  $("mute").onclick = () => { setMute(!muted); if (!muted) play("tap"); };
  setMute(muted);

  /* ---------- navigation ---------- */
  let screen = "intro", room = null, qi = 0;
  const NEXT = { intro: "Stop the guessing", size: "Next", idea: "Open my blueprint", plan: "Get my kit", room: "Next", done: null };
  function show(name) {
    screen = name;
    document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("on", s.id === "s-" + name));
    $("back").hidden = name === "intro";
    $("meter").hidden = !(name === "plan" || name === "room");
    $("foot").hidden = !NEXT[name];
    $("next").textContent = NEXT[name] || ""; $("next").disabled = false;
    window.scrollTo({ top: 0, behavior: "instant" });
    ({ intro: drawIntro, size: drawSizes, idea: drawIdea, plan: drawPlan, room: drawQ, done: drawDone }[name])();
    meter(false);
  }
  $("back").onclick = () => { play("tap"); if (screen === "room") { if (qi > 0) { qi--; drawQ(); } else show("plan"); } else if (screen === "plan") show("idea"); else if (screen === "idea") show("size"); else if (screen === "size") show("intro"); else if (screen === "done") show("plan"); };
  $("next").onclick = () => {
    play("tap");
    if (screen === "intro") { if (!S.rules.includes(0)) { S.rules.push(0); save(); } show(S.tier ? (S.a.prd && S.a.prd.name ? "plan" : "idea") : "size"); }
    else if (screen === "size") show("idea");
    else if (screen === "idea") { const a = ans("prd"); a.name = $("ideaName").value.trim(); a.one = $("ideaOne").value.trim(); save(); show("plan"); }
    else if (screen === "plan") show("done");
    else if (screen === "room") nextQ();
  };

  /* ---------- meter ---------- */
  let lastLeft = null;
  function meter(bump = true) {
    const left = guessLeft(), total = guessTotal();
    $("guessN").textContent = left;
    $("meterFill").style.width = (total ? (left / total) * 100 : 0) + "%";
    if (bump && lastLeft !== null && left < lastLeft) { $("meter").classList.remove("bump"); void $("meter").offsetWidth; $("meter").classList.add("bump"); popFx("−" + (lastLeft - left)); play("pop"); }
    lastLeft = left;
  }
  function popFx(txt) {
    const m = $("meter").getBoundingClientRect(); if (!m.width) return;
    const el = document.createElement("span"); el.className = "pop"; el.textContent = txt + " guess" + (txt === "−1" ? "" : "es");
    el.style.left = Math.max(8, m.left) + "px"; el.style.top = m.bottom + 6 + "px"; $("fx").appendChild(el); setTimeout(() => el.remove(), 1000);
  }
  function toast(t) { const el = $("toast"); el.textContent = t; el.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("on"), 1600); }

  /* ---------- intro: the guesses pour out ---------- */
  const GUESSES = ["Who pays?", "Phone or web?", "How do people sign in?", "What color?", "Where's the data kept?", "Can walkers see addresses?", "What if booking fails?", "What's in version 1?", "Chat or no chat?", "Which database?", "Who's an admin?", "What does 'done' mean?"];
  let introRan = false;
  async function drawIntro() {
    if (introRan) return; introRan = true;
    const box = $("bubbles"); box.innerHTML = "";
    const spots = [];
    GUESSES.forEach((g, i) => { const b = document.createElement("span"); b.className = "bubble"; b.textContent = g; b.style.setProperty("--rot", ((i % 3) - 1) * 3 + "deg"); box.appendChild(b); spots.push(b); });
    let n = 0;
    for (const b of spots) { await wait(170); b.classList.add("in"); n++; $("introCount").textContent = `AI is guessing: ${n}…`; play("bubble"); }
    await wait(350); $("introCount").textContent = "…and about 40 more.";
  }

  /* ---------- size ---------- */
  function drawSizes() {
    $("sizes").innerHTML = SIZES.map((z) => `<button class="size press" data-t="${z.tier}" aria-pressed="${S.tier === z.tier}">
      <span class="house" style="grid-template-columns:repeat(${z.tier === 1 ? 2 : z.tier === 2 ? 4 : 6},1fr)">${"<i></i>".repeat(z.rooms)}</span>
      <b>${z.name}</b><span>${z.for}</span><em>${z.rooms} rooms · ${z.time}</em></button>`).join("");
    $("next").disabled = !S.tier;
  }
  $("sizes").onclick = (e) => { const b = e.target.closest(".size"); if (!b) return; S.tier = +b.dataset.t; save(); play("tap"); drawSizes(); };

  /* ---------- idea ---------- */
  function drawIdea() { const a = ans("prd"); $("ideaName").value = a.name || ""; $("ideaOne").value = a.one || ""; }
  $("useSample").onclick = () => { $("ideaName").value = "Walkies (sample)"; $("ideaOne").value = "Book a trusted dog walker who lives in your building."; play("tap"); };

  /* ---------- the blueprint ---------- */
  function drawPlan() {
    const rs = rooms(); const nm = (S.a.prd && S.a.prd.name) || "Your app";
    const sample = / \(sample\)$/.test(nm); $("planTitle").textContent = nm.replace(/ \(sample\)$/, "") + " blueprint";
    const nDone = rs.filter((r) => S.done.includes(r.id)).length;
    $("planSub").textContent = (sample ? "Sample idea. " : "") + (nDone === rs.length ? "Every room planned. Get your kit." : nDone ? `${nDone} of ${rs.length} rooms planned. Keep going.` : "Tap a room. Each answer is one less guess.");
    const nextId = (rs.find((r) => !S.done.includes(r.id)) || {}).id;
    $("blueprint").innerHTML = rs.map((r) => {
      const wide = r.id === "prd" || r.id === "agents";
      return `<button role="listitem" class="room${wide ? " wide" : ""}${S.done.includes(r.id) ? " done" : ""}${r.id === nextId ? " next-up" : ""}" data-r="${r.id}" aria-label="${esc(r.name)}${S.done.includes(r.id) ? ", planned" : ""}">
        <span class="fog"></span>${icon(r.icon)}<span><span class="rn">${esc(r.name)}</span><br><span class="rf">${r.file}</span>
        <span class="rp"><i style="width:${Math.round(roomPct(r) * 100)}%"></i></span></span><span class="ok">PLANNED</span></button>`;
    }).join("");
    $("rulesLabel").textContent = `Rules ${S.rules.length}/${RULES.length}`;
    $("rulesStrip").innerHTML = RULES.map((_, i) => `<i class="${S.rules.includes(i) ? "got" : ""}" title="${S.rules.includes(i) ? esc(RULES[i].t) : "Rule to collect"}"></i>`).join("");
    $("next").textContent = nDone === rs.length ? "Get my kit" : nDone ? `Get my kit (${nDone}/${rs.length} planned)` : "Get my kit";
  }
  $("blueprint").onclick = (e) => { const b = e.target.closest(".room"); if (!b) return; play("tap"); openRoom(b.dataset.r); };

  /* ---------- a room ---------- */
  function openRoom(id) {
    room = byId[id]; const a = ans(id);
    room.qs.forEach((q) => { if (q.dflt !== undefined && a[q.id] === undefined) a[q.id] = Array.isArray(q.dflt) ? q.dflt.slice() : q.dflt; });
    if (id === "design" && !a.colors) a.colors = { main: "#2F6B4F", bg: "#FBF7EF", text: "#1C1B19", touched: false };
    save();
    qi = room.qs.findIndex((q) => !answered(q, a[q.id])); if (qi < 0) qi = 0;
    $("roomIcon").innerHTML = icon(room.icon); $("roomName").textContent = room.name; $("roomFile").textContent = room.file; $("roomWhy").textContent = room.why;
    show("room"); meter(false);
  }
  function drawQ() {
    if (!room) return show("plan");
    const q = room.qs[qi], a = ans(room.id), val = a[q.id];
    $("qdots").innerHTML = room.qs.map((qq, i) => `<i class="${i === qi ? "on" : answered(qq, a[qq.id]) ? "ans" : ""}"></i>`).join("");
    let body = "";
    if (q.type === "text") body = `<input type="text" id="qin" autocomplete="off" placeholder="${esc(q.ph || "")}" value="${esc(val || "")}" aria-label="${esc(q.q)}">`;
    if (q.type === "list") { const arr = (val && val.length ? val : [""]).slice(0, q.max); if (arr.length < q.max && arr[arr.length - 1]) arr.push(""); body = `<div id="qlist">${arr.map((x, i) => `<div class="list-row"><input type="text" data-i="${i}" placeholder="${esc(q.ph || "")}" value="${esc(x)}" aria-label="${esc(q.q)} ${i + 1}">${i < arr.length - 1 || x ? `<button data-del="${i}" aria-label="Remove">×</button>` : ""}</div>`).join("")}</div>`; }
    if (q.type === "chips") body = `<div class="chips" id="qchips">${q.opts.map((o) => `<button class="chip" aria-pressed="${(val || []).includes(o)}">${esc(o)}</button>`).join("")}</div>`;
    if (q.type === "choice") body = `<div class="choice" id="qchoice">${q.opts.map((o) => `<button class="chip" aria-pressed="${val === o}">${esc(o)}</button>`).join("")}</div>`;
    if (q.type === "colors") { const c = val || {}; body = `<div class="colors">${[["main", "Main (buttons)"], ["bg", "Background"], ["text", "Text"]].map(([k, l]) => `<label class="color-row"><input type="color" data-k="${k}" value="${c[k]}"> ${l} <code>${c[k]}</code></label>`).join("")}</div><div class="swatch" id="swatch"></div><div class="contrast" id="contrast"></div>`; }
    $("qcard").innerHTML = `<p class="q" id="qq">${esc(q.q)}</p>${body}${q.hint ? `<p class="hint">${esc(q.hint)}</p>` : ""}${q.sample !== undefined && !answered(q, val) ? `<button class="link example" id="qex">Show me an example</button>` : ""}`;
    $("qcard").style.animation = "none"; void $("qcard").offsetWidth; $("qcard").style.animation = "";
    $("next").textContent = qi === room.qs.length - 1 ? "Finish this room" : "Next";
    $("skipQ").hidden = answered(q, val);
    wireQ(q);
    if (q.type === "colors") swatch();
  }
  function setVal(q, v) { ans(room.id)[q.id] = v; save(); meter(); const d = $("qdots").children[qi]; if (d) d.className = "on"; $("skipQ").hidden = answered(q, v); const ex = $("qex"); if (ex && answered(q, v)) ex.remove(); }
  function wireQ(q) {
    const ex = $("qex"); if (ex) ex.onclick = () => { play("tap"); setVal(q, Array.isArray(q.sample) ? q.sample.slice() : typeof q.sample === "object" ? Object.assign({}, q.sample, { touched: true }) : q.sample); drawQ(); toast("Sample answer: change it to yours"); };
    if (q.type === "text") { const i = $("qin"); i.oninput = () => setVal(q, i.value); i.onkeydown = (e) => { if (e.key === "Enter") $("next").click(); }; }
    if (q.type === "list") {
      const box = $("qlist");
      box.oninput = (e) => { const arr = [...box.querySelectorAll("input")].map((x) => x.value); setVal(q, arr.filter((x) => x.trim())); const last = box.lastElementChild.querySelector("input"); if (last.value && box.children.length < q.max) { const r = document.createElement("div"); r.className = "list-row"; r.innerHTML = `<input type="text" placeholder="${esc(q.ph || "")}" aria-label="${esc(q.q)} ${box.children.length + 1}">`; box.appendChild(r); } };
      box.onclick = (e) => { const d = e.target.closest("[data-del]"); if (!d) return; const arr = (ans(room.id)[q.id] || []).slice(); arr.splice(+d.dataset.del, 1); setVal(q, arr); drawQ(); };
      box.onkeydown = (e) => { if (e.key === "Enter") { const ins = [...box.querySelectorAll("input")]; const i = ins.indexOf(e.target); if (ins[i + 1]) ins[i + 1].focus(); else $("next").click(); } };
    }
    if (q.type === "chips") $("qchips").onclick = (e) => { const b = e.target.closest(".chip"); if (!b) return; play("tap"); let arr = (ans(room.id)[q.id] || []).slice(); const o = b.textContent; if (arr.includes(o)) arr = arr.filter((x) => x !== o); else { if (q.max && arr.length >= q.max) { toast(`Pick up to ${q.max}`); return; } arr.push(o); } b.setAttribute("aria-pressed", arr.includes(o)); setVal(q, arr); };
    if (q.type === "choice") $("qchoice").onclick = (e) => { const b = e.target.closest(".chip"); if (!b) return; play("tap"); [...$("qchoice").children].forEach((c) => c.setAttribute("aria-pressed", c === b)); setVal(q, b.textContent); };
    if (q.type === "colors") $("qcard").oninput = (e) => { const k = e.target.dataset.k; if (!k) return; const c = Object.assign({}, ans(room.id)[q.id], { [k]: e.target.value, touched: true }); e.target.nextElementSibling && (e.target.parentElement.querySelector("code").textContent = e.target.value); setVal(q, c); swatch(); };
  }
  // WCAG contrast
  const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  function swatch() {
    const c = ans("design").colors; if (!c) return;
    $("swatch").style.background = c.bg; $("swatch").style.color = c.text;
    $("swatch").innerHTML = `<span style="font-weight:800">Book a walk</span><span class="sbtn" style="background:${c.main};color:#fff">Book</span>`;
    const r1 = ratio(c.text, c.bg), r2 = ratio("#ffffff", c.main);
    $("contrast").innerHTML = `Text on background ${r1.toFixed(1)}:1 <span class="${r1 >= 4.5 ? "good" : "bad"}">${r1 >= 4.5 ? "passes" : "too faint"}</span> · White on main ${r2.toFixed(1)}:1 <span class="${r2 >= 4.5 ? "good" : "bad"}">${r2 >= 4.5 ? "passes" : "too faint"}</span>`;
  }
  function nextQ() { if (qi < room.qs.length - 1) { qi++; drawQ(); } else finishRoom(); }
  $("skipQ").onclick = () => { play("even"); nextQ(); };
  $("peek").onclick = () => { play("tap"); sheet(room.file + ": what AI reads", `<pre>${esc(mdFor(room))}</pre>`); };

  async function finishRoom() {
    const id = room.id; if (!S.done.includes(id)) S.done.push(id); save();
    show("plan");
    const el = document.querySelector(`.room[data-r="${id}"]`);
    if (el) { el.classList.remove("done"); await wait(260); el.classList.add("done"); play("stamp"); el.scrollIntoView({ block: "center" }); }
    await wait(700);
    const t = TRAPS[id];
    if (t && !S.traps.includes(id)) return trap(id, t);
    afterRoom();
  }
  async function afterRoom() {
    const rs = rooms();
    if (rs.every((r) => S.done.includes(r.id)) && !S.seen.includes("finale" + S.tier)) {
      S.seen.push("finale" + S.tier); if (!S.rules.includes(8)) S.rules.push(8); save();
      $("blueprint").classList.add("cleared"); play("lift"); toast("The fog's gone. AI knows your plan.");
      await wait(1400); show("done");
    }
  }

  /* ---------- traps ---------- */
  function trap(id, t) {
    const opts = Math.random() < 0.5 ? [["bad", t.bad], ["good", t.good]] : [["good", t.good], ["bad", t.bad]];
    sheet("AI did something", `<div class="trap-say">${esc(t.say)}</div><div class="trap-opts" id="trapOpts">${opts.map(([k, l]) => `<button data-k="${k}">${esc(l)}</button>`).join("")}</div><p class="sub" id="trapLesson" style="margin-top:12px" hidden></p><div class="rule-card" id="ruleCard"><small>Rule collected</small><b>${esc(RULES[t.rule].t)}</b>${esc(RULES[t.rule].d)}</div>`, true);
    $("trapOpts").onclick = async (e) => {
      const b = e.target.closest("button"); if (!b || $("trapOpts").dataset.done) return; $("trapOpts").dataset.done = 1;
      const good = b.dataset.k === "good";
      [...$("trapOpts").children].forEach((c) => c.classList.add(c.dataset.k === "good" ? "right" : "wrong"));
      play(good ? "sig" : "even");
      $("trapLesson").hidden = false; $("trapLesson").textContent = (good ? "Exactly. " : "Easy mistake. ") + t.lesson;
      S.traps.push(id); if (!S.rules.includes(t.rule)) S.rules.push(t.rule); save();
      await wait(500); $("ruleCard").classList.add("on"); play("card");
      $("sheetClose").hidden = false; $("sheetClose").textContent = "Keep building";
    };
  }

  /* ---------- sheet ---------- */
  let sheetCb = null;
  function sheet(title, html, locked) {
    $("sheetTitle").textContent = title; $("sheetBody").innerHTML = html; $("sheet").classList.add("on");
    $("sheetClose").hidden = !!locked; $("sheetClose").textContent = "Close"; sheetCb = locked ? afterRoom : null;
    setTimeout(() => ($("sheetClose").hidden ? $("sheetBody").querySelector("button") : $("sheetClose")).focus(), 50);
  }
  function closeSheet() { if ($("sheetClose").hidden) return; $("sheet").classList.remove("on"); drawPlanIfOpen(); const cb = sheetCb; sheetCb = null; if (cb) cb(); }
  function drawPlanIfOpen() { if (screen === "plan") drawPlan(); }
  $("sheetClose").onclick = closeSheet;
  $("sheet").onclick = (e) => { if (e.target === $("sheet")) closeSheet(); };
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $("sheet").classList.contains("on")) closeSheet(); });

  /* ---------- docs ---------- */
  function mdFor(r) { return r.md(S.a[r.id] || {}, S.a, rooms()); }
  function startHere() {
    const n = S.a.prd || {};
    return `# Start here

This is the plan for **${n.name || "your app"}**${n.one ? ": " + n.one : ""}.
Made with Build Kit (Skills Made EZ). Anything marked "Not decided yet" means the AI should ask you, not guess.

## Set up (once)
1. Unzip into the top folder of your project: \`docs/\`, \`AGENTS.md\` and \`CLAUDE.md\` sit next to your code.
2. Most AI coding tools read \`AGENTS.md\` on their own. Claude Code reads \`CLAUDE.md\`, which points to it.
3. Paste the first prompt below.

## The build loop
${LOOP.map((s, i) => `### ${i + 1}. ${s.k}\n${s.d}\n\n\`\`\`\n${s.p(n)}\n\`\`\``).join("\n\n")}

## Rules
${RULES.map((r) => `- **${r.t}:** ${r.d}`).join("\n")}
`;
  }
  async function download() {
    const rs = rooms();
    if (!window.JSZip) { sheet("Copy your plan", `<p class="sub">The download didn't load. Copy everything as one file instead.</p><pre>${esc(rs.map((r) => mdFor(r)).join("\n\n---\n\n"))}</pre>`); return; }
    const z = new JSZip(); const folder = z.folder("docs");
    rs.filter((r) => r.id !== "agents").forEach((r) => folder.file(r.file, mdFor(r)));
    z.file("AGENTS.md", mdFor(byId.agents)); z.file("CLAUDE.md", "Read AGENTS.md and everything in /docs before working on this project.\n"); z.file("START-HERE.md", startHere());
    const blob = await z.generateAsync({ type: "blob" });
    const slug = ((S.a.prd && S.a.prd.name) || "my-app").toLowerCase().replace(/\(sample\)/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "my-app";
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = slug + "-build-kit.zip"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    play("sig"); toast("Kit downloaded");
  }
  async function copy(t, label) { try { await navigator.clipboard.writeText(t); play("sig"); toast(label || "Copied"); } catch (e) { sheet("Copy this", `<pre>${esc(t)}</pre>`); } }

  /* ---------- done ---------- */
  async function drawDone() {
    const rs = rooms(), n = S.a.prd || {}, nDone = rs.filter((r) => S.done.includes(r.id)).length, all = nDone === rs.length;
    $("cardName").textContent = n.name || "Your app"; $("cardOne").textContent = n.one || "";
    $("cRooms").textContent = `${nDone}/${rs.length}`; $("cGuess").textContent = guessTotal() - guessLeft(); $("cRules").textContent = `${S.rules.length}/${RULES.length}`;
    $("miniPlan").innerHTML = rs.map((r) => `<i class="${S.done.includes(r.id) ? "got" : ""}"></i>`).join("");
    const st = $("readyStamp"); st.textContent = all ? "READY TO BUILD" : "IN PROGRESS"; st.classList.toggle("wip", !all); st.classList.remove("on");
    $("loop").innerHTML = LOOP.map((s, i) => `<li><b>${esc(s.k)}</b><p>${esc(s.d)}</p><button class="link" data-i="${i}">Copy prompt</button></li>`).join("");
    $("rulesAll").innerHTML = RULES.map((r, i) => `<div class="rule${S.rules.includes(i) ? " got" : ""}"><b>${S.rules.includes(i) ? esc(r.t) : "Not yet"}</b><span>${S.rules.includes(i) ? esc(r.d) : "Plan more rooms to collect it."}</span></div>`).join("");
    await wait(350); st.classList.add("on"); play(all ? "stamp" : "even");
  }
  $("loop").onclick = (e) => { const b = e.target.closest("[data-i]"); if (b) copy(LOOP[+b.dataset.i].p(S.a.prd || {}), "Prompt copied"); };
  $("download").onclick = () => { play("tap"); download(); };
  $("copyKick").onclick = () => copy(LOOP[0].p(S.a.prd || {}), "First prompt copied");
  $("backToPlan").onclick = () => { play("tap"); show("plan"); };
  $("startOver").onclick = () => { if (!confirm("Start a new plan? This clears your answers on this device.")) return; S = fresh(); save(); introRan = false; lastLeft = null; show("intro"); };

  show("intro");
})();
