import {
  GENERATION,
  ERAS,
  STYLES,
  RESEARCH_NOTES,
  formativeRange,
  erasForYears,
  primaryEra,
} from "./data.js";
import { WEBSITES as CATALOG_WEBSITES, ITEMS as CATALOG_ITEMS } from "./catalog-data.js";
import { renderMoments, realYearFor, iconFor } from "./moments.js";
import { ITEM_MEDIA, SITE_MEDIA } from "./media.js";

const state = {
  generation: "millennial",
  mode: "birth",
  birthYear: 1990,
  yearFrom: 2004,
  yearTo: 2007,
  lens: "websites",
};

/** @type {{ WEBSITES: Record<string, any[]>, ITEMS: Record<string, any[]> }} */
let catalog = { WEBSITES: CATALOG_WEBSITES, ITEMS: CATALOG_ITEMS };

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Escape text for safe innerHTML insertion (catalog / labels). */
function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Allow only http(s) archive links in rendered markup. */
function safeUrl(url) {
  try {
    const u = new URL(String(url || ""), location.href);
    if (u.protocol === "http:" || u.protocol === "https:") return u.href;
  } catch {
    /* ignore */
  }
  return "";
}

function currentRange() {
  if (state.mode === "birth") {
    return formativeRange(state.birthYear);
  }
  const a = Math.min(state.yearFrom, state.yearTo);
  const b = Math.max(state.yearFrom, state.yearTo);
  return [a, b];
}

function setEraTheme(eraId) {
  document.body.dataset.era = eraId;
}

function go(stage) {
  $$(".stage").forEach((el) => el.classList.remove("is-active"));
  const target = $(`#stage-${stage}`);
  if (target) target.classList.add("is-active");
  window.scrollTo({ top: 0, behavior: "smooth" });
  syncDocumentTitle(stage);
}

function syncDocumentTitle(stage) {
  const base = "Scrollback — Millennial nostalgia by year";
  if (stage === "results") {
    const [from, to] = currentRange();
    const primary = primaryEra(from, to);
    document.title = `${from}–${to} · ${primary.label} — Scrollback`;
    return;
  }
  if (stage === "years") {
    document.title = `Enter your years — Scrollback`;
    return;
  }
  if (stage === "generation") {
    document.title = `Pick generation — Scrollback`;
    return;
  }
  document.title = base;
}

function renderGenerations() {
  const grid = $("#gen-grid");
  const cards = [
    {
      id: "millennial",
      label: GENERATION.label,
      body: GENERATION.blurb,
      tag: `${GENERATION.birthStart}–${GENERATION.birthEnd}`,
      enabled: true,
    },
    {
      id: "genx",
      label: "Gen X",
      body: "Coming next—cassette-to-web bridge years.",
      tag: "Soon",
      enabled: false,
    },
    {
      id: "genz",
      label: "Gen Z",
      body: "Coming next—app-native nostalgia.",
      tag: "Soon",
      enabled: false,
    },
  ];

  grid.innerHTML = cards
    .map(
      (c) => `
      <button class="gen-card ${state.generation === c.id ? "is-selected" : ""}" type="button"
        data-gen="${c.id}" ${c.enabled ? "" : "disabled"}>
        <h3>${c.label}</h3>
        <p>${c.body}</p>
        <span class="tag">${c.tag}</span>
      </button>`
    )
    .join("");

  $("#continue-years").disabled = !state.generation;

  $$("[data-gen]", grid).forEach((btn) => {
    btn.addEventListener("click", () => {
      state.generation = btn.dataset.gen;
      renderGenerations();
    });
  });
}

function updateYearPreview() {
  const [from, to] = currentRange();
  const eras = erasForYears(from, to);
  const primary = primaryEra(from, to);
  setEraTheme(primary.id);

  $("#birth-label").textContent = String(state.birthYear);
  $("#from-label").textContent = String(state.yearFrom);
  $("#to-label").textContent = String(state.yearTo);

  const birthNote =
    state.mode === "birth"
      ? `Born <code>${state.birthYear}</code> → formative window `
      : `Selected range `;

  $("#year-preview").innerHTML = `${birthNote}<code>${from}–${to}</code>
    · Primary look: <strong>${primary.styleName}</strong>
    ${eras.length > 1 ? ` · Spans ${eras.map((e) => e.label).join(" + ")}` : ""}`;
}

function setMode(mode) {
  state.mode = mode;
  $$("[data-mode]").forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.mode === mode);
  });
  $("#mode-birth").classList.toggle("hidden", mode !== "birth");
  $("#mode-range").classList.toggle("hidden", mode !== "range");
  if (mode === "birth") {
    const [f, t] = formativeRange(state.birthYear);
    state.yearFrom = f;
    state.yearTo = t;
    $("#year-from").value = f;
    $("#year-to").value = t;
  }
  updateYearPreview();
}

/** Parse peak year strings like "2004–2007" or "2001-2005" → [start, end] */
function parsePeakYears(raw) {
  if (!raw) return null;
  const nums = String(raw).match(/19\d{2}|20\d{2}/g);
  if (!nums || !nums.length) return null;
  const years = nums.map(Number);
  return [Math.min(...years), Math.max(...years)];
}

function overlapsRange(peak, from, to) {
  if (!peak) return true; // keep undated rows
  return peak[0] <= to && peak[1] >= from;
}

function mergeCatalog(map, eraIds, from, to) {
  const seen = new Set();
  const out = [];
  const mid = (from + to) / 2;
  for (const id of eraIds) {
    for (const row of map[id] || []) {
      const key = row.name;
      if (seen.has(key)) continue;
      const peak = parsePeakYears(row.years);
      if (!overlapsRange(peak, from, to)) continue;
      const peakMid = peak ? (peak[0] + peak[1]) / 2 : mid;
      // "Peaks in your years" when the peak midpoint lands in the selected range
      // (full containment is too rare on short ranges).
      const peakFit = peak ? peakMid >= from && peakMid <= to : false;
      seen.add(key);
      out.push({
        ...row,
        eraId: id,
        peak,
        peakFit,
        relevance: Math.abs(peakMid - mid),
      });
    }
  }
  out.sort((a, b) => {
    if (a.peakFit !== b.peakFit) return a.peakFit ? -1 : 1;
    return a.relevance - b.relevance;
  });
  return out;
}

function syncUrl() {
  const [from, to] = currentRange();
  const params = new URLSearchParams({
    gen: state.generation || "millennial",
    mode: state.mode,
    from: String(from),
    to: String(to),
    lens: state.lens,
  });
  if (state.mode === "birth") params.set("birth", String(state.birthYear));
  const next = `${location.pathname}?${params.toString()}`;
  history.replaceState(null, "", next);
}

function readUrlState() {
  const params = new URLSearchParams(location.search);
  if (!params.has("from") && !params.has("birth") && !params.has("stage")) {
    return null;
  }
  if (params.get("gen") === "millennial") state.generation = "millennial";
  if (params.get("mode") === "range" || params.get("mode") === "birth") {
    state.mode = params.get("mode");
  }
  if (params.has("birth")) {
    state.birthYear = clamp(Number(params.get("birth")), 1981, 1996);
  }
  if (params.has("from")) state.yearFrom = clamp(Number(params.get("from")), 1995, 2016);
  if (params.has("to")) state.yearTo = clamp(Number(params.get("to")), 1995, 2016);
  if (["websites", "items", "style", "room"].includes(params.get("lens"))) {
    state.lens = params.get("lens");
  }
  return params.get("stage") || (params.has("from") || params.has("birth") ? "results" : null);
}

function clamp(n, min, max) {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function cohortNote(cohort) {
  if (cohort === "early") return "Early millennial lean";
  if (cohort === "late") return "Late millennial lean";
  if (cohort === "both") return "Shared across millennials";
  return "";
}

/** "Game Boy (and Game Boy Color)" -> "Game Boy" for tiles; the full name stays in the detail view. */
function shortName(name) {
  return String(name || "").replace(/\s*\(.*?\)\s*/g, " ").trim();
}

function hostOf(archive) {
  const m = String(archive || "").match(/web\.archive\.org\/web\/[^/]+\/https?:\/\/([^/]+)/i);
  const raw = m ? m[1] : String(archive || "").replace(/^https?:\/\//, "").split("/")[0];
  if (/restorativland/i.test(raw)) return "geocities.com";
  return raw.replace(/^www\./, "");
}

/** A real photo when we have one, else an original drawing of the thing. */
function picture(media, item) {
  if (media?.file) {
    return `<span class="pic"><img src="./${esc(media.file)}" alt="" loading="lazy" decoding="async" /></span>`;
  }
  return `<span class="pic pic--drawn"><svg viewBox="0 0 50 50" aria-hidden="true">${item ? iconFor(item) : ""}</svg></span>`;
}

function sitePicture(site) {
  const media = site ? SITE_MEDIA[site.name] : null;
  if (media?.file) {
    return `<span class="pic pic--shot"><img src="./${esc(media.file)}" alt="" loading="lazy" decoding="async" /></span>`;
  }
  return `<span class="pic pic--shot pic--noshot"><span>${esc(shortName(site?.name || ""))}</span></span>`;
}

/** Prefer Wayback / restoration hosts as “Open archive”; live domains as “Visit site”. */
function archiveLinkLabel(url) {
  const href = String(url || "").toLowerCase();
  if (
    href.includes("web.archive.org") ||
    href.includes("restorativland") ||
    href.includes("archive.org")
  ) {
    return "Open archive";
  }
  return "Visit site";
}

function jumpToLens(lens, query = "") {
  setLens(lens);
  const filter = $("#lens-filter");
  if (filter) {
    filter.value = query;
    applyLensFilter();
    if (query) filter.focus();
  }
}

function tokenDemoMarkup(eraId) {
  const demos = {
    dialup: `
      <div class="demo-row">
        <button type="button" class="demo-bevel">OK</button>
        <span class="demo-counter">000137</span>
        <span class="demo-link">Skip Intro</span>
      </div>
      <div class="demo-wordmark demo-chrome">SCROLLBACK</div>`,
    y2k: `
      <div class="demo-row">
        <button type="button" class="demo-gel">Download</button>
        <span class="demo-orb"></span>
        <span class="demo-ipod"></span>
      </div>
      <div class="demo-wordmark demo-aqua">millennium</div>`,
    myspace: `
      <div class="demo-row">
        <button type="button" class="demo-gloss">Add to Top 8</button>
        <span class="demo-sparkle">✦ sparkle ✦</span>
      </div>
      <div class="demo-wordmark demo-bling">juicy profile</div>`,
    tumblr: `
      <div class="demo-row">
        <span class="demo-polaroid"></span>
        <button type="button" class="demo-neon">reblog</button>
      </div>
      <div class="demo-wordmark demo-soft">dash forever</div>`,
  };
  return demos[eraId] || "";
}

function catalogDepth() {
  const eras = Object.keys(catalog.WEBSITES || {});
  const web = eras.reduce((n, id) => n + (catalog.WEBSITES[id] || []).length, 0);
  const items = Object.values(catalog.ITEMS || {}).reduce((n, list) => n + list.length, 0);
  return { web, items, styles: Object.keys(STYLES).length };
}

function paintHeroMeta() {
  const meta = $("#hero-meta");
  if (!meta) return;
  const { web, items, styles } = catalogDepth();
  meta.innerHTML = `
    <span><i class="dot" aria-hidden="true"></i> Gen locked: Millennials</span>
    <span>Researched: ${web} sites · ${items} objects · ${styles} style systems</span>
    <span>Window: 1995–2016</span>`;
}

function renderResults() {
  const [from, to] = currentRange();
  const eras = erasForYears(from, to);
  const primary = primaryEra(from, to);
  const eraIds = eras.map((e) => e.id);
  setEraTheme(primary.id);

  const sites = mergeCatalog(catalog.WEBSITES, eraIds, from, to);
  const items = mergeCatalog(catalog.ITEMS, eraIds, from, to);

  $("#era-banner").innerHTML = `
    <div class="years">${from}–${to} · ${esc(GENERATION.label)}</div>
    <h2>${esc(primary.label)}</h2>
    <p>${esc(primary.subtitle)}.</p>
  `;

  const peakSite = sites.find((s) => s.peakFit) || sites[0];
  const peakItem = items.find((it) => it.peakFit) || items[0];
  const styleCue = STYLES[primary.id];
  const digest = $("#era-digest");
  if (digest) {
    digest.innerHTML = `
      <div class="digest-grid">
        <button class="digest-card digest-card--pic" type="button" data-digest-lens="items" data-digest-q="${esc(peakItem?.name || "")}">
          ${picture(ITEM_MEDIA[peakItem?.name], peakItem)}
          <strong>${esc(shortName(peakItem?.name || ""))}</strong>
        </button>
        ${peakSite ? `<button class="digest-card digest-card--pic" type="button" data-digest-lens="websites" data-digest-q="${esc(peakSite.name)}">
          ${sitePicture(peakSite)}
          <strong>${esc(shortName(peakSite.name))}</strong>
        </button>` : ""}
        <button class="digest-card digest-card--pic" type="button" data-digest-lens="style" data-digest-q="">
          <span class="pic pic--swatch">${(styleCue?.palette || []).slice(0, 5).map((hex) => `<i style="background:${/^#[0-9a-fA-F]{3,8}$/.test(hex) ? hex : "#000"}"></i>`).join("")}</span>
          <strong>${esc(styleCue?.name || primary.styleName)}</strong>
        </button>
      </div>`;
    $$("[data-digest-lens]", digest).forEach((btn) => {
      btn.addEventListener("click", () => {
        jumpToLens(btn.dataset.digestLens, btn.dataset.digestQ || "");
      });
    });
  }

  $("#lens-websites").innerHTML = `
    <div class="tile-grid tile-grid--sites">
      ${sites
        .map((s) => `
        <button class="item tile tile--site${s.peakFit ? " item--peak" : ""}" type="button" data-real="${esc(s.name)}"
          aria-label="Open ${esc(s.name)} as it looked in ${realYearFor(s)}">
          <span class="browser" aria-hidden="true"><span class="browser-bar"><i></i><i></i><i></i><span>${esc(hostOf(s.archive))}</span></span>${sitePicture(s)}</span>
          <span class="tile-name">${esc(shortName(s.name))}</span>
          <span class="tile-year">${realYearFor(s)}${s.peakFit ? ` <b class="peak-dot">peak</b>` : ""}</span>
          <span class="tile-hidden">${esc(s.vibe)}</span>
        </button>`)
        .join("")}
    </div>`;

  $("#lens-items").innerHTML = `
    <div class="tile-grid tile-grid--items">
      ${items
        .map(
          (it) => `
        <article class="item tile tile--thing${it.peakFit ? " item--peak" : ""}" data-own-item="${esc(it.name)}">
          <button class="tile-open" type="button" data-thing="${esc(it.name)}" aria-label="${esc(it.name)}: more">
            ${picture(ITEM_MEDIA[it.name], it)}
            <span class="tile-name">${esc(shortName(it.name))}</span>
            <span class="tile-year">${esc(it.years)}${it.peakFit ? ` <b class="peak-dot">peak</b>` : ""}</span>
            <span class="tile-hidden">${esc(it.sensory)}</span>
          </button>
          <button type="button" class="had-toggle" data-own="had" aria-pressed="false" aria-label="I had ${esc(it.name)}">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path class="had-plus" d="M10 4v12M4 10h12"/><path class="had-check" d="M4.5 10.5l3.5 3.5 7.5-8"/></svg>
            <span>had it</span>
          </button>
        </article>`
        )
        .join("")}
    </div>`;

  // Primary era's style system first so overlapping ranges don't open on an adjacent lane.
  const styleBlocks = [...eraIds]
    .sort((a, b) => (a === primary.id ? -1 : b === primary.id ? 1 : 0))
    .map((id) => (STYLES[id] ? { id, ...STYLES[id] } : null))
    .filter(Boolean);
  $("#lens-style").innerHTML = styleBlocks
    .map((st, idx) => {
      const swatches = st.palette
        .map((hex) => {
          const safe = /^#[0-9a-fA-F]{3,8}$/.test(hex) ? hex : "#000";
          return `<div class="swatch" style="background:${safe}" title="${esc(safe)}"><span>${esc(safe)}</span></div>`;
        })
        .join("");
      const isPrimary = st.id === primary.id;
      return `
      <div class="style-board${isPrimary ? " style-board--primary" : ""}" style="margin-bottom:1.25rem">
        <article class="item${isPrimary ? " item--peak" : ""}">
          <div class="item-head">
            <h3>${esc(st.name)}${isPrimary ? ` <span class="peak-tag">your primary lane</span>` : ""}</h3>
            <span class="meta">${esc(st.years)}${idx === 0 && styleBlocks.length > 1 ? " · shown first" : ""}</span>
          </div>
          <p>${esc(st.summary)}</p>
          <div class="swatches">${swatches}</div>
          <div class="token-demo token-demo--${esc(st.id)}" aria-hidden="true">
            ${tokenDemoMarkup(st.id)}
          </div>
          <strong style="font-family:var(--display)">Typography cues</strong>
          <ul class="bullet-list">${st.typography.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
          <strong style="font-family:var(--display);display:block;margin-top:0.75rem">Motifs</strong>
          <ul class="bullet-list">${st.motifs.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        </article>
        <article class="item">
          <h3>Fashion & room cues</h3>
          <ul class="bullet-list">${st.fashion.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
          <strong style="font-family:var(--display);display:block;margin-top:0.75rem">UI tokens to steal</strong>
          <ul class="token-list">${st.tokens.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
          <p style="margin-top:0.9rem;color:var(--muted)"><em>${esc(st.musicVisual)}</em></p>
          ${
            st.pairings
              ? `<div class="pairing-row" aria-label="Catalog pairings for this style">
            <span class="pairing-label">See it in the catalog</span>
            ${(st.pairings.websites || [])
              .map(
                (name) =>
                  `<button class="chip pairing-chip" type="button" data-cross-lens="websites" data-cross-q="${esc(name)}">${esc(name)}</button>`
              )
              .join("")}
            ${(st.pairings.items || [])
              .map(
                (name) =>
                  `<button class="chip pairing-chip" type="button" data-cross-lens="items" data-cross-q="${esc(name)}">${esc(name)}</button>`
              )
              .join("")}
          </div>`
              : ""
          }
        </article>
      </div>`;
    })
    .join("");

  $$("[data-cross-lens]", $("#lens-style")).forEach((btn) => {
    btn.addEventListener("click", () => {
      jumpToLens(btn.dataset.crossLens, btn.dataset.crossQ || "");
    });
  });

  $("#research").innerHTML = `
    <details><summary>How we dated all this</summary>
    <div class="note-grid">
      ${RESEARCH_NOTES.map(
        (n) => `<div class="note"><strong>${esc(n.title)}</strong><p>${esc(n.body)}</p></div>`
      ).join("")}
      <div class="note">
        <strong>Active eras in view</strong>
        <p>${eras.map((e) => `${esc(e.label)} (${e.years[0]}–${e.years[1]})`).join(" · ") || "—"}</p>
      </div>
      <div class="note">
        <strong>Catalog depth</strong>
        <p>${sites.length} websites · ${items.length} objects · ${styleBlocks.length} style system${styleBlocks.length === 1 ? "" : "s"} in this range.</p>
      </div>
    </div>
    <p class="credits-line">Photos: Wikimedia Commons contributors (credited on each object). Old pages: Internet Archive Wayback Machine.</p>
    </details>`;

  const filter = $("#lens-filter");
  if (filter) filter.value = "";
  renderMoments({ from, to, sites, items });
  setLens(state.lens);
  syncUrl();
}

function setLens(lens) {
  state.lens = lens;
  $$(".tab").forEach((tab) => {
    const on = tab.dataset.lens === lens;
    tab.classList.toggle("is-active", on);
    tab.setAttribute("aria-selected", on ? "true" : "false");
  });
  $$(".lens").forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === `lens-${lens}`);
  });
  applyLensFilter();
  if ($("#stage-results").classList.contains("is-active")) syncUrl();
}

function applyLensFilter() {
  const input = $("#lens-filter");
  const empty = $("#filter-empty");
  if (!input) return;
  const q = input.value.trim().toLowerCase();
  const panel = $(`#lens-${state.lens}`);
  if (!panel) return;

  const blocks =
    state.lens === "style"
      ? $$(".style-board", panel)
      : $$(".item", panel);

  let visible = 0;
  blocks.forEach((el) => {
    const hit = !q || el.textContent.toLowerCase().includes(q);
    el.classList.toggle("is-filtered-out", !hit);
    if (hit) visible += 1;
  });
  empty.classList.toggle("hidden", !q || visible > 0);
}

function renderEraJumps() {
  const host = $("#era-jumps");
  host.innerHTML = ERAS.map(
    (era) =>
      `<button class="chip" type="button" data-era-jump="${era.id}">${era.label} · ${era.years[0]}–${era.years[1]}</button>`
  ).join("");
  $$("[data-era-jump]", host).forEach((btn) => {
    btn.addEventListener("click", () => {
      const era = ERAS.find((e) => e.id === btn.dataset.eraJump);
      if (!era) return;
      state.mode = "range";
      state.yearFrom = era.years[0];
      state.yearTo = era.years[1];
      $("#year-from").value = era.years[0];
      $("#year-to").value = era.years[1];
      setMode("range");
      $$("[data-era-jump]", host).forEach((b) =>
        b.classList.toggle("is-active", b === btn)
      );
    });
  });
}

function bind() {
  $$("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => {
      go(btn.dataset.go);
      if (btn.dataset.go === "years") updateYearPreview();
    });
  });

  $("#continue-years").addEventListener("click", () => {
    if (!state.generation) return;
    go("years");
    updateYearPreview();
  });

  $$("[data-mode]").forEach((chip) => {
    chip.addEventListener("click", () => setMode(chip.dataset.mode));
  });

  function applyBirthYear(year) {
    state.birthYear = clamp(Number(year), 1981, 1996);
    $("#birth-year").value = state.birthYear;
    const [f, t] = formativeRange(state.birthYear);
    state.yearFrom = f;
    state.yearTo = t;
    $("#year-from").value = f;
    $("#year-to").value = t;
    $$("[data-birth]").forEach((chip) => {
      chip.classList.toggle("is-active", Number(chip.dataset.birth) === state.birthYear);
    });
    updateYearPreview();
  }

  $("#birth-year").addEventListener("input", (e) => {
    applyBirthYear(e.target.value);
  });

  $$("[data-birth]").forEach((chip) => {
    chip.addEventListener("click", () => {
      setMode("birth");
      applyBirthYear(chip.dataset.birth);
    });
  });

  $("#year-from").addEventListener("input", (e) => {
    state.yearFrom = Number(e.target.value);
    updateYearPreview();
  });
  $("#year-to").addEventListener("input", (e) => {
    state.yearTo = Number(e.target.value);
    updateYearPreview();
  });

  $("#open-results").addEventListener("click", () => {
    renderResults();
    go("results");
  });

  $("#surprise-me")?.addEventListener("click", () => {
    // Random millennial birth year → formative range → straight into lenses
    const birth = 1981 + Math.floor(Math.random() * 16);
    state.generation = "millennial";
    state.mode = "birth";
    state.birthYear = birth;
    const [f, t] = formativeRange(birth);
    state.yearFrom = f;
    state.yearTo = t;
    state.lens = ["websites", "items", "style"][Math.floor(Math.random() * 3)];
    $("#birth-year").value = birth;
    $("#year-from").value = f;
    $("#year-to").value = t;
    setMode("birth");
    updateYearPreview();
    document.body.classList.add("is-surprising");
    window.setTimeout(() => {
      document.body.classList.remove("is-surprising");
      renderResults();
      go("results");
    }, 420);
  });

  const lenses = ["websites", "items", "style", "room"];
  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => setLens(tab.dataset.lens));
    tab.addEventListener("keydown", (e) => {
      const i = lenses.indexOf(tab.dataset.lens);
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const next =
          e.key === "ArrowRight"
            ? lenses[(i + 1) % lenses.length]
            : lenses[(i - 1 + lenses.length) % lenses.length];
        setLens(next);
        $(`.tab[data-lens="${next}"]`)?.focus();
      }
    });
  });

  $("#lens-filter").addEventListener("input", applyLensFilter);

  // Escape backs up one stage; 1/2/3 switch lenses on results (skips when typing).
  document.addEventListener("keydown", (e) => {
    const tag = (e.target?.tagName || "").toLowerCase();
    const typing = tag === "input" || tag === "textarea" || e.target?.isContentEditable;
    if (e.key === "Escape") {
      if (typing) return;
      const active = $(".stage.is-active")?.id || "";
      if (active === "stage-results") {
        go("years");
        updateYearPreview();
      } else if (active === "stage-years") {
        go("generation");
      } else if (active === "stage-generation") {
        go("landing");
      }
      return;
    }
    if (typing) return;
    if (!$("#stage-results")?.classList.contains("is-active")) return;
    const lensByKey = { "1": "websites", "2": "items", "3": "style", "4": "room" };
    if (lensByKey[e.key]) {
      e.preventDefault();
      setLens(lensByKey[e.key]);
      $(`.tab[data-lens="${lensByKey[e.key]}"]`)?.focus();
    }
  });

  $("#copy-share").addEventListener("click", async () => {
    syncUrl();
    const btn = $("#copy-share");
    const url = location.href;
    try {
      await navigator.clipboard.writeText(url);
      btn.textContent = "Copied";
    } catch {
      btn.textContent = "Copy failed";
    }
    setTimeout(() => {
      btn.textContent = "Copy link";
    }, 1600);
  });
}

async function boot() {
  // Module import is the primary catalog path (publish-friendly). JSON remains
  // the research source of truth and is used to refresh if the module is stale.
  try {
    const res = await fetch("./src/data/catalog.json");
    if (res.ok) {
      const json = await res.json();
      if (json?.WEBSITES && json?.ITEMS) catalog = json;
    }
  } catch {
    /* keep imported catalog-data.js */
  }

  if (!catalog.WEBSITES || !catalog.ITEMS) {
    throw new Error("catalog missing WEBSITES/ITEMS");
  }

  paintHeroMeta();
  const deepStage = readUrlState();

  renderGenerations();
  renderEraJumps();
  bind();

  $("#birth-year").value = state.birthYear;
  $("#year-from").value = state.yearFrom;
  $("#year-to").value = state.yearTo;
  setMode(state.mode);
  updateYearPreview();

  if (deepStage === "results") {
    renderResults();
    go("results");
  } else if (deepStage === "years") {
    go("years");
  } else {
    setEraTheme("dialup");
  }

  window.__scrollback = { ERAS, state, currentRange, catalog };
}

boot().catch((err) => {
  console.error(err);
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<p style="padding:1rem;color:#ff6b8a;font-family:sans-serif">Scrollback failed to load catalog: ${esc(err.message)}</p>`
  );
});
