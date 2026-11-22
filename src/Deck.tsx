import { useCallback, useEffect, useRef, useState } from "react";
import data from "../content/portfolio.json";
import {
  heroThumb,
  liveCount,
  primaryOpen,
  projectCountWord,
  projectHref,
  statusLabel,
  supportingThumbs,
  tourHref,
  type Status,
} from "./lib";

const projects = data.projects;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const PIPELINE: [string, string][] = [
  ["Innovate", "Find the strongest version of the idea"],
  ["Marketing", "Angles, ad copy, a two-week test"],
  ["Revenue", "Who pays, when, and how much"],
  ["Concept design", "Pick the look before any page"],
  ["Landing page", "A page that tests demand"],
  ["Prototype", "A clickable product"],
  ["Pitch deck", "The story, with sources"],
  ["Explainer graphic", "The business in one picture"],
];
const SUMMARY = 1; // 0-based index of the one-page summary slide
const FIRST_PROJECT = 2;
const TOTAL = FIRST_PROJECT + projects.length + 1;

const slideTitle = (i: number) =>
  i === 0
    ? "Intro"
    : i === SUMMARY
      ? `All ${projectCountWord} on one page`
      : i === TOTAL - 1
        ? "How it gets made"
        : projects[i - FIRST_PROJECT].name;

export default function Deck({ start }: { start: number }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(Math.min(start, TOTAL - 1));

  const go = useCallback((i: number, smooth = true) => {
    const n = Math.max(0, Math.min(TOTAL - 1, i));
    const el = scroller.current?.children[n] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  }, []);

  // Land on the requested slide without animating.
  useEffect(() => {
    go(start, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track which slide is on screen; keep the URL shareable.
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.index);
            setCurrent(i);
            history.replaceState(null, "", tourHref(i + 1));
          }
        }
      },
      // The slide crossing the middle of the screen is the current one,
      // which also works for slides taller than a phone screen.
      { root, rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    Array.from(root.children).forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select")) return;
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go(current + 1);
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        go(0);
      } else if (e.key === "End") {
        e.preventDefault();
        go(TOTAL - 1);
      } else if (e.key === "Escape") {
        window.location.hash = "#/";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, go]);

  return (
    <div className="deck">
      <header className="deck-bar">
        <a className="deck-exit" href="#/">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M10 3 5 8l5 5" />
          </svg>
          Studio
        </a>
        <p className="deck-where" aria-live="polite">
          <span className="deck-count">
            {current + 1} / {TOTAL}
          </span>
          <span className="deck-title">{slideTitle(current)}</span>
        </p>
        <div className="deck-step">
          <button
            type="button"
            onClick={() => go(current - 1)}
            disabled={current === 0}
            aria-label="Previous slide"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 10l5-5 5 5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(current + 1)}
            disabled={current === TOTAL - 1}
            aria-label="Next slide"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 6l5 5 5-5" />
            </svg>
          </button>
        </div>
      </header>

      <nav className="deck-rail" aria-label="Slides">
        {Array.from({ length: TOTAL }, (_, i) => (
          <button
            key={i}
            type="button"
            className={i === current ? "on" : ""}
            aria-label={`Slide ${i + 1}: ${slideTitle(i)}`}
            aria-current={i === current ? "step" : undefined}
            onClick={() => go(i)}
          >
            <span>{slideTitle(i)}</span>
          </button>
        ))}
      </nav>

      <div className="deck-slides" ref={scroller}>
        {/* 1 · Intro */}
        <section className="slide slide-intro" data-index={0} aria-label="Intro">
          <div className="intro-copy">
            <h1>{data.site.brand}</h1>
            <p className="intro-line">
              {cap(projectCountWord)} business ideas, each built out for real: a working product,
              landing pages, ads, a pitch deck, print and social.
            </p>
            <p className="intro-by">by {data.site.owner}</p>
            <div className="slide-actions">
              <button type="button" className="action-primary" onClick={() => go(SUMMARY)}>
                See all {projectCountWord} on one page
              </button>
              <button type="button" className="action-ghost" onClick={() => go(FIRST_PROJECT)}>
                Go one by one
              </button>
            </div>
          </div>
          <ul className="intro-wall" aria-hidden="true">
            {projects.map((p) => {
              const src = heroThumb(p);
              return src ? (
                <li key={p.id}>
                  <img src={src} alt="" />
                </li>
              ) : null;
            })}
          </ul>
          <p className="slide-hint">Scroll, or use the arrow keys</p>
        </section>

        {/* 2 · One-page summary */}
        <section className="slide slide-summary" data-index={1} aria-label={`All ${projectCountWord} on one page`}>
          <h2>All {projectCountWord} on one page</h2>
          <table className="summary">
            <thead>
              <tr>
                <th scope="col">Idea</th>
                <th scope="col">For</th>
                <th scope="col">Who pays</th>
                <th scope="col">
                  <span className="sr-only">Links</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={p.id}>
                  <th scope="row">
                    <button type="button" className="summary-name" onClick={() => go(FIRST_PROJECT + i)}>
                      {p.name}
                    </button>
                    <span className="summary-line">{p.oneLiner}</span>
                  </th>
                  <td>{p.audience}</td>
                  <td>{p.pays}</td>
                  <td className="summary-go">
                    <a href={projectHref(p.id)}>Deep dive</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 3–9 · One slide per project */}
        {projects.map((p, i) => {
          const hero = heroThumb(p);
          const strip = supportingThumbs(p, 3);
          const open = primaryOpen(p);
          return (
            <section
              key={p.id}
              className="slide slide-project"
              data-index={FIRST_PROJECT + i}
              aria-label={p.name}
            >
              <div className="sp-copy">
                <p className="sp-status">
                  <span className={`badge badge-${p.status}`}>
                    {statusLabel[p.status as Status]}
                  </span>
                  <span>{liveCount(p)} of 8 pieces live</span>
                </p>
                <h2>{p.name}</h2>
                <p className="sp-line">{p.oneLiner}</p>
                <dl className="sp-facts">
                  <div>
                    <dt>For</dt>
                    <dd>{p.audience}</dd>
                  </div>
                  <div>
                    <dt>Who pays</dt>
                    <dd>{p.pays}</dd>
                  </div>
                </dl>
                <div className="slide-actions">
                  <a className="action-primary" href={projectHref(p.id)}>
                    Dig deeper
                  </a>
                  {open ? (
                    <a className="action-ghost" href={open.cell.url!} target="_blank" rel="noreferrer">
                      Open {open.cell.label}
                    </a>
                  ) : null}
                </div>
              </div>
              <figure className="sp-visual">
                {hero ? (
                  <img
                    className="sp-hero"
                    src={hero}
                    alt={`${p.name} home page`}
                    loading={i < 2 ? "eager" : "lazy"}
                  />
                ) : null}
                {strip.length ? (
                  <ul className="sp-strip">
                    {strip.map((s) => (
                      <li key={s.id}>
                        <a href={s.url} target="_blank" rel="noreferrer">
                          <img src={s.src} alt="" loading="lazy" />
                          <span>{s.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </figure>
            </section>
          );
        })}

        {/* 10 · Close */}
        <section className="slide slide-close" data-index={TOTAL - 1} aria-label="How it gets made">
          <h2>How it gets made</h2>
          <p className="close-line">
            The newer pieces come from eight reusable skills. Each one writes
            files the next one reads.
          </p>
          <ol className="close-skills">
            {PIPELINE.map(([name, detail]) => (
              <li key={name}>
                <strong>{name}</strong>
                <span>{detail}</span>
              </li>
            ))}
          </ol>
          <div className="slide-actions">
            <a className="action-primary" href="#/">
              Back to the studio
            </a>
            <button type="button" className="action-ghost" onClick={() => go(0)}>
              Start over
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
