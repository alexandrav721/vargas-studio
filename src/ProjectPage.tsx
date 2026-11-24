import { useEffect, useState } from "react";
import data from "../content/portfolio.json";
import hqData from "./hq.json";
import Lightbox, { type Shot } from "./Lightbox";
import SiteBar from "./SiteBar";
import { projectHref, thumbFor, visualsOf } from "./lib";
import { GROUPS, META, PLAIN } from "./meta";

/* One HQ per idea, the same five parts in the same order:
   the idea (its pitch deck) · try it · the plan · marketing · status. */
type HQ = {
  who?: string;
  problem?: string;
  money?: string;
  edge?: string;
  hooks?: string[];
  live?: string[];
  next?: string[];
  waiting?: string[];
  social?: { rhythm?: string; page?: string; pillars: { name: string; what: string; posts: string[] }[] };
  learns?: { steps: { name: string; line: string }[]; team?: string };
  connect?: { name: string; status: string; line: string }[];
};
const HQS = hqData as Record<string, HQ>;

// The order you walk through the ideas: the order of the home page.
const ORDER = GROUPS.flatMap((g) => g.ids).filter(
  (id, i, all) => all.indexOf(id) === i && data.projects.some((p) => p.id === id),
);

const PARTS = [
  { id: "idea", label: "The idea" },
  { id: "try", label: "Try it" },
  { id: "plan", label: "The plan" },
  { id: "marketing", label: "Marketing" },
  { id: "social", label: "Social" },
  { id: "status", label: "Status" },
];

// Marketing pieces, in the order a stranger meets them.
const MARKETING = ["landing", "meta-ads", "social", "funnel", "print", "website"];

function useWide() {
  const q = "(min-width: 720px)";
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setWide(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return wide;
}

export default function ProjectPage({ id }: { id: string }) {
  const p = data.projects.find((x) => x.id === id)!;
  const m = META[p.id];
  const hq = HQS[p.id] ?? {};
  const visuals = visualsOf(p);
  const wide = useWide();
  const [viewer, setViewer] = useState<number | null>(null);
  const at = ORDER.indexOf(id);
  const prev = ORDER[(at - 1 + ORDER.length) % ORDER.length];
  const next = ORDER[(at + 1) % ORDER.length];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${m.name} HQ · Vargas Studio`;
  }, [m.name]);

  const deck = visuals.deck?.state === "live" && visuals.deck.url ? visuals.deck.url : null;
  const deckPic = deck ? thumbFor(deck) : null;

  // Marketing tiles; pieces that point at the same page share one tile.
  const tiles: { url: string; labels: string[] }[] = [];
  for (const colId of MARKETING) {
    const cell = visuals[colId];
    if (!cell || cell.state !== "live" || !cell.url) continue;
    if (cell.url === m.play || cell.url === deck) continue;
    const label = PLAIN[colId] ?? colId;
    const same = tiles.find((t) => t.url === cell.url);
    if (same) same.labels.push(label);
    else tiles.push({ url: cell.url, labels: [label] });
  }
  const shots: Shot[] = tiles.flatMap((t) => {
    const src = thumbFor(t.url);
    return src ? [{ src, label: t.labels.join(" · "), url: t.url }] : [];
  });

  const plan = [
    { k: "For", v: hq.who ?? p.audience },
    { k: "The problem", v: hq.problem },
    { k: "How it makes money", v: hq.money ?? p.pays },
    { k: "Why it could win", v: hq.edge },
  ].filter((x) => x.v);

  const status = [
    { k: "Live now", items: hq.live ?? [] },
    { k: "Next", items: hq.next ?? [] },
    { k: "Waiting on Alexandra", items: hq.waiting ?? [] },
  ].filter((x) => x.items.length);

  const ext = m.external ? { target: "_blank", rel: "noopener" } : {};

  return (
    <div className="lad hq">
      <SiteBar backHref="#ideas" backLabel="All ideas" />
      <main className="hq-main">
        <header className="hq-head">
          <img className="hq-icon" src={m.pic} alt="" width={64} height={68} />
          <div>
            <p className="hq-kicker">Idea HQ</p>
            <h1 id="hq-title">{m.name}</h1>
            <p className="proj-line">{m.line}</p>
          </div>
        </header>

        <nav className="hq-parts" aria-label={`${m.name} HQ`}>
          {PARTS.map((x) => (
            <a key={x.id} href={`#/p/${id}`} onClick={(e) => { e.preventDefault(); document.getElementById(`hq-${x.id}`)?.scrollIntoView({ behavior: "smooth" }); }}>
              {x.label}
            </a>
          ))}
        </nav>

        <section id="hq-idea" className="hq-part" aria-labelledby="hq-idea-h">
          <h2 id="hq-idea-h">The idea</h2>
          {deck && wide ? (
            <div className="hq-deck">
              <iframe src={deck} title={`${m.name} pitch deck`} loading="lazy" />
            </div>
          ) : deck ? (
            <a className="hq-deckpic" href={deck}>
              {deckPic ? <img src={deckPic} alt="" loading="lazy" /> : null}
              <span>Open the pitch deck</span>
            </a>
          ) : (
            <p className="hq-empty">Pitch deck coming.</p>
          )}
          {deck && wide ? (
            <a className="lad-more" href={deck} target="_blank" rel="noopener">
              Full screen ↗
            </a>
          ) : null}
        </section>

        <section id="hq-try" className="hq-part" aria-labelledby="hq-try-h">
          <h2 id="hq-try-h">Try it</h2>
          <div className="hq-try">
            <a className="proj-pic" href={m.play} {...ext} tabIndex={-1} aria-hidden="true">
              <img src={m.pic} alt="" width={600} height={640} decoding="async" loading="lazy" />
            </a>
            <div className="hq-trybtns">
              <a className="proj-play" href={m.play} {...ext}>
                {m.playLabel}
              </a>
              {m.extra && (
                <a className="proj-play proj-extra" href={m.extra.href}>
                  {m.extra.label}
                </a>
              )}
              {m.more?.map((x) => (
                <a key={x.href} className="proj-play proj-extra" href={x.href}>
                  {x.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="hq-plan" className="hq-part" aria-labelledby="hq-plan-h">
          <h2 id="hq-plan-h">The plan</h2>
          <dl className="hq-cards">
            {plan.map((x) => (
              <div key={x.k}>
                <dt>{x.k}</dt>
                <dd>{x.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="hq-marketing" className="hq-part" aria-labelledby="hq-marketing-h">
          <h2 id="hq-marketing-h">Marketing</h2>
          {hq.hooks?.length ? (
            <ul className="hq-hooks" aria-label="Hooks">
              {hq.hooks.map((h) => (
                <li key={h}>“{h}”</li>
              ))}
            </ul>
          ) : null}
          {tiles.length ? (
            <ul className="proj-grid">
              {tiles.map((t) => {
                const src = thumbFor(t.url);
                return (
                  <li key={t.url}>
                    <a
                      className="proj-tile"
                      href={t.url}
                      onClick={(e) => {
                        const i = shots.findIndex((x) => x.url === t.url);
                        if (i < 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                        e.preventDefault();
                        setViewer(i);
                      }}
                    >
                      <span className="proj-shot">{src ? <img src={src} alt="" loading="lazy" decoding="async" /> : <span className="proj-noshot">{t.labels[0]}</span>}</span>
                      <span className="proj-label">{t.labels.join(" · ")}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="hq-empty">Ads and posts coming.</p>
          )}
        </section>

        {hq.learns ? (
          <section id="hq-learns" className="hq-part" aria-labelledby="hq-learns-h">
            <h2 id="hq-learns-h">How it learns you</h2>
            <ol className="hq-steps">
              {hq.learns.steps.map((x, i) => (
                <li key={x.name}>
                  <b>
                    {i + 1}. {x.name}
                  </b>
                  <span>{x.line}</span>
                </li>
              ))}
            </ol>
            {hq.learns.team ? (
              <a className="lad-more" href={hq.learns.team}>
                Team console (sign-in) →
              </a>
            ) : null}
          </section>
        ) : null}

        {hq.connect ? (
          <section id="hq-connect" className="hq-part" aria-labelledby="hq-connect-h">
            <h2 id="hq-connect-h">Connections</h2>
            <ul className="hq-connect">
              {hq.connect.map((c) => (
                <li key={c.name}>
                  <b>{c.name}</b>
                  <em data-s={c.status.toLowerCase().replace(/[^a-z]+/g, "-")}>{c.status}</em>
                  <span>{c.line}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {hq.social ? (
          <section id="hq-social" className="hq-part" aria-labelledby="hq-social-h">
            <h2 id="hq-social-h">What we post</h2>
            {hq.social.rhythm ? <p className="hq-rhythm">{hq.social.rhythm}</p> : null}
            <div className="hq-pillars">
              {hq.social.pillars.map((pl) => (
                <div key={pl.name}>
                  <h3>{pl.name}</h3>
                  <p>{pl.what}</p>
                  <ul>
                    {pl.posts.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {hq.social.page ? (
              <a className="proj-play proj-extra" href={hq.social.page}>
                See the posts
              </a>
            ) : null}
          </section>
        ) : null}

        <section id="hq-status" className="hq-part" aria-labelledby="hq-status-h">
          <h2 id="hq-status-h">Status</h2>
          {status.length ? (
            <div className="hq-status">
              {status.map((s) => (
                <div key={s.k}>
                  <h3>{s.k}</h3>
                  <ul>
                    {s.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="hq-empty">{p.latest}</p>
          )}
          <p className="hq-updated">Updated {new Date(p.updated + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </section>

        <nav className="hq-pager" aria-label="Other ideas">
          <a href={projectHref(prev)}>
            <small>Previous idea</small>← {META[prev]?.name}
          </a>
          <a href={projectHref(next)}>
            <small>Next idea</small>
            {META[next]?.name} →
          </a>
        </nav>
      </main>
      {viewer !== null ? <Lightbox title={m.name} shots={shots} start={viewer} onClose={() => setViewer(null)} /> : null}
    </div>
  );
}
