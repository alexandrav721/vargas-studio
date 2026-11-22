import { useEffect, useMemo, useState } from "react";
import data from "../content/portfolio.json";

import Deck from "./Deck";
import ProjectPage from "./ProjectPage";
import StudioDesk from "./StudioDesk";
import "./desk.css";
import {
  cellFor,
  cellStateLabel,
  liveCount,
  parseRoute,
  projectCountWord,
  primaryOpen,
  projectHref,
  statusLabel,
  visualsOf,
  type CellState,
  type Route,
  type Status,
} from "./lib";

const MAX_COMPARE = 5;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));

  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (route.view === "deck") return <Deck key={route.slide} start={route.slide} />;
  if (route.view === "desk") return <StudioDesk />;
  return <Studio route={route} />;
}

function Studio({ route }: { route: Route }) {
  const [tocOpen, setTocOpen] = useState(false);
  const [active, setActive] = useState("intro");
  const [openProjectId, setOpenProjectId] = useState<string | null>(
    data.projects[0]?.id ?? null,
  );
  const [compareIds, setCompareIds] = useState<string[]>(() =>
    data.projects.map((p) => p.id).slice(0, MAX_COMPARE),
  );
  const [pendingJump, setPendingJump] = useState<string | null>(null);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section]"),
    );
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [route.view]);

  // Arriving on home from a #section link (e.g. from a project page).
  useEffect(() => {
    if (route.view !== "home") return;
    const id = window.location.hash.slice(1);
    if (!id || id.startsWith("/")) return;
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "auto" }),
    );
  }, [route.view]);

  // A new project page starts at the top.
  const projectId = route.view === "project" ? route.id : null;
  useEffect(() => {
    if (projectId) window.scrollTo({ top: 0 });
    setTocOpen(false);
  }, [projectId]);

  const toc = [
    { id: "intro", label: "Intro" },
    { id: "projects", label: "Projects" },
    { id: "compare", label: "Compare" },
    { id: "craft", label: "Craft" },
  ];

  const jump = (id: string) => {
    setTocOpen(false);
    if (route.view !== "home") {
      // Leave the project page; the effect below scrolls once home mounts.
      window.location.hash = id;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!pendingJump) return;
    const id = pendingJump;
    setPendingJump(null);
    // Wait a frame so hidden project details can mount before scrolling.
    requestAnimationFrame(() => jump(id));
  }, [pendingJump, openProjectId]);

  const openProject = (id: string) => {
    setOpenProjectId(id);
    setPendingJump(`project-${id}`);
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      const selected = new Set(prev);
      if (selected.has(id)) {
        if (selected.size <= 2) return prev;
        selected.delete(id);
      } else {
        if (selected.size >= MAX_COMPARE) return prev;
        selected.add(id);
      }
      return data.projects.map((p) => p.id).filter((pid) => selected.has(pid));
    });
  };

  const comparedProjects = useMemo(
    () => data.projects.filter((p) => compareIds.includes(p.id)),
    [compareIds],
  );

  const latestByProject = useMemo(() => {
    const map = new Map<string, (typeof data.now)[number]>();
    for (const n of data.now) {
      if (!map.has(n.projectId)) map.set(n.projectId, n);
    }
    return map;
  }, []);

  return (
    <div className="shell">
      <div className="atmosphere" aria-hidden="true" />

      <button
        type="button"
        className="toc-toggle"
        aria-expanded={tocOpen}
        onClick={() => setTocOpen((v) => !v)}
      >
        {tocOpen ? "Close" : "Menu"}
      </button>

      <aside className={`toc ${tocOpen ? "open" : ""}`} aria-label="Site menu">
        <a className="toc-brand" href="#/">
          {data.site.brand}
        </a>
        <a className="toc-tour" href="#/tour">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <rect x="1.5" y="3" width="13" height="9" />
            <path d="M6.5 5.5v4l3.5-2z" />
          </svg>
          Take the tour
        </a>
        <nav aria-label="Sections">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={
                route.view === "home" &&
                (active === item.id ||
                  (item.id === "projects" && active.startsWith("project-")))
                  ? "on"
                  : ""
              }
              onClick={(e) => {
                e.preventDefault();
                jump(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <p className="toc-group">Projects</p>
        <nav className="toc-projects" aria-label="Projects">
          {data.projects.map((p) => (
            <a
              key={p.id}
              href={projectHref(p.id)}
              className={projectId === p.id ? "on" : ""}
              aria-current={projectId === p.id ? "page" : undefined}
            >
              {p.name}
            </a>
          ))}
        </nav>
      </aside>

      {projectId ? (
        <main className="main">
          <ProjectPage id={projectId} />
          <footer className="foot">
            <p>
              {data.site.brand} · {data.site.owner}
            </p>
          </footer>
        </main>
      ) : (
      <main className="main">
        <header className="hero" id="intro" data-section>
          <p className="eyebrow">
            {data.site.owner} · {data.site.role}
          </p>
          <h1 className="brand-hero">{data.site.brand}</h1>
          <p className="tagline">{data.site.tagline}</p>
          <p className="lede">{data.site.forWhom}</p>
          <div className="hero-cta">
            <a href="#/tour">Take the tour</a>
            <a
              className="ghost"
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                jump("projects");
              }}
            >
              Browse projects
            </a>
            <a
              className="ghost"
              href="#compare"
              onClick={(e) => {
                e.preventDefault();
                jump("compare");
              }}
            >
              Compare side by side
            </a>
          </div>
        </header>

        <section className="section" id="projects" data-section>
          <p className="section-kicker">Projects</p>
          <h2>{capitalize(projectCountWord)} ideas, one studio</h2>
          <p className="section-lede">
            Scan the index, open one for the story and live links, then use
            Compare when you want the same craft column across projects.
          </p>

          <ol className="project-index" aria-label="Project index">
            {data.projects.map((p, i) => {
              const live = liveCount(p);
              const open = primaryOpen(p);
              const isOpen = openProjectId === p.id;
              return (
                <li key={p.id} className={isOpen ? "is-active" : ""}>
                  <button
                    type="button"
                    className="index-row"
                    aria-expanded={isOpen}
                    aria-controls={`project-${p.id}`}
                    onClick={() => openProject(p.id)}
                  >
                    <span className="index-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="index-main">
                      <span className="index-title">
                        {p.name}
                        {p.aka ? <em> · {p.aka}</em> : null}
                      </span>
                      <span className="index-line">{p.oneLiner}</span>
                    </span>
                    <span className="index-meta">
                      <span className={`badge badge-${p.status}`}>
                        {statusLabel[p.status as Status]}
                      </span>
                      <span className="live-count">
                        {live > 0 ? `${live} live` : "No live yet"}
                      </span>
                    </span>
                  </button>
                  {open ? (
                    <a
                      className="index-open"
                      href={open.cell.url!}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ol>

          {data.projects.map((p) => {
            const visuals = visualsOf(p);
            const open = primaryOpen(p);
            const latest = latestByProject.get(p.id);
            const isOpen = openProjectId === p.id;
            return (
              <article
                key={p.id}
                className={`project-detail ${isOpen ? "is-open" : ""}`}
                id={`project-${p.id}`}
                data-section
                hidden={!isOpen}
              >
                <div className="project-head">
                  <h3>{p.name}</h3>
                  <span className={`badge badge-${p.status}`}>
                    {statusLabel[p.status as Status]}
                  </span>
                </div>
                {p.aka ? <p className="aka">Also known as {p.aka}</p> : null}
                <p className="one-liner">{p.oneLiner}</p>
                <p className="body">{p.summary}</p>

                <div className="detail-actions">
                  {open ? (
                    <a
                      className="action-primary"
                      href={open.cell.url!}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open {open.cell.label}
                    </a>
                  ) : (
                    <span className="fill-in">No live link yet</span>
                  )}
                  <a className="action-ghost" href={projectHref(p.id)}>
                    Deep dive
                  </a>
                  <button
                    type="button"
                    className={`action-ghost ${compareIds.includes(p.id) ? "is-on" : ""}`}
                    onClick={() => toggleCompare(p.id)}
                    disabled={
                      !compareIds.includes(p.id) && compareIds.length >= MAX_COMPARE
                    }
                  >
                    {compareIds.includes(p.id) ? "In compare" : "Add to compare"}
                  </button>
                </div>

                {latest ? (
                  <p className="latest-note">
                    <span className="meta-label">Latest</span>
                    {latest.text}
                  </p>
                ) : null}

                <h4>Visual stack</h4>
                <ul className="stack-list">
                  {data.columns.map((col) => {
                    const cell = visuals[col.id];
                    if (!cell) return null;
                    const state = cell.state as CellState;
                    return (
                      <li key={col.id} className={`stack-row state-${state}`}>
                        <span className="stack-col">{col.name}</span>
                        <span className={`cell-state cell-state-${state}`}>
                          {cellStateLabel[state]}
                        </span>
                        <span className="stack-label">{cell.label}</span>
                        {cell.url ? (
                          <a
                            className="surface-link"
                            href={cell.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open
                          </a>
                        ) : state === "na" ? (
                          <span className="fill-in quiet">—</span>
                        ) : (
                          <span className="fill-in">Fill in</span>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {p.code.length > 0 ? (
                  <>
                    <h4>Code</h4>
                    <ul className="artifact-list">
                      {p.code.map((c) => (
                        <li key={c.url}>
                          <strong>{c.label}</strong>
                          <span>{c.summary}</span>
                          <a
                            className="surface-link"
                            href={c.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Repo
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </article>
            );
          })}
        </section>

        <section className="section compare-section" id="compare" data-section>
          <p className="section-kicker">Compare</p>
          <h2>Same columns, side by side</h2>
          <p className="section-lede">
            Pick up to {MAX_COMPARE} projects. Rows are craft types — scan Live /
            Fill in / N/A, then open anything that ships.
          </p>

          <div className="compare-picker" role="group" aria-label="Projects to compare">
            {data.projects.map((p) => {
              const on = compareIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`pick-chip ${on ? "is-on" : ""}`}
                  aria-pressed={on}
                  onClick={() => toggleCompare(p.id)}
                  disabled={!on && compareIds.length >= MAX_COMPARE}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
          <p className="compare-count">
            Comparing {comparedProjects.length} of {data.projects.length}
            {comparedProjects.length < 2
              ? " — keep at least two selected."
              : null}
          </p>

          <div className="matrix-scroller" tabIndex={0} aria-label="Comparison matrix">
            <table className="matrix">
              <thead>
                <tr>
                  <th scope="col" className="matrix-corner">
                    Column
                  </th>
                  {comparedProjects.map((p) => (
                    <th scope="col" key={p.id}>
                      <span className="matrix-project">{p.name}</span>
                      <span className={`badge badge-${p.status}`}>
                        {statusLabel[p.status as Status]}
                      </span>
                      <button
                        type="button"
                        className="matrix-jump"
                        onClick={() => openProject(p.id)}
                      >
                        View project
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.columns.map((col) => (
                  <tr key={col.id}>
                    <th scope="row">
                      <span className="matrix-col-name">{col.name}</span>
                      <span className="matrix-col-blurb">{col.blurb}</span>
                    </th>
                    {comparedProjects.map((p) => {
                      const cell = cellFor(p, col.id);
                      if (!cell) {
                        return (
                          <td key={`${col.id}-${p.id}`} className="state-na">
                            —
                          </td>
                        );
                      }
                      const state = cell.state as CellState;
                      return (
                        <td key={`${col.id}-${p.id}`} className={`state-${state}`}>
                          <span className={`cell-state cell-state-${state}`}>
                            {cellStateLabel[state]}
                          </span>
                          <strong>{cell.label}</strong>
                          {cell.url ? (
                            <a
                              className="surface-link"
                              href={cell.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open live
                            </a>
                          ) : state === "na" ? null : (
                            <span className="fill-in">Link Fill in</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section" id="craft" data-section>
          <p className="section-kicker">Craft</p>
          <h2>Non-visual work</h2>
          <p className="section-lede">
            Skills, agents, and reusable patterns — kept out of the visual
            columns on purpose.
          </p>

          <h3 className="subhead">Skills</h3>
          <ul className="plain-list">
            {data.general.skills.map((s) => (
              <li key={s.name}>
                <strong>{s.name}</strong>
                <span>{s.detail}</span>
              </li>
            ))}
          </ul>

          <h3 className="subhead">Agents & workflows</h3>
          <ul className="plain-list">
            {data.general.agents.map((a) => (
              <li key={a.name}>
                <strong>
                  {a.name}{" "}
                  <span className={`badge badge-${a.status}`}>
                    {statusLabel[a.status as Status]}
                  </span>
                </strong>
                <span>{a.detail}</span>
              </li>
            ))}
          </ul>

          <h3 className="subhead">Reusable craft</h3>
          <ul className="plain-list">
            {data.general.reusable.map((r) => (
              <li key={r.name}>
                <strong>{r.name}</strong>
                <span>{r.detail}</span>
              </li>
            ))}
          </ul>

        </section>

        <footer className="foot">
          <p>
            {data.site.brand} · {data.site.owner}
          </p>
        </footer>
      </main>
      )}
    </div>
  );
}
