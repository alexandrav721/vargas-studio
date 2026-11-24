import { useEffect, useMemo, useState } from "react";
import data from "../content/portfolio.json";

import ProjectPage from "./ProjectPage";
import { LEARN, META } from "./meta";
import {
  cellFor,
  cellStateLabel,
  liveCount,
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

/* Repos friends can't open (private, or the old Cursor host): show the name, no dead link. */
const PRIVATE_REPO = /github\.com\/alexandrav721\/(celebrateloop-site|Loop|ecoinventory2026|loop-waitlist)$|origin\.cursor\.com/;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* Home: the whole studio at a glance. A slim sticky bar shows every section (Play, Ideas, Compare,
   Tools) and highlights where you are; everything is one tap away (see idea-journey step 4). */
export default function Overview() {
  useEffect(() => {
    document.title = "Vargas Studio — Alexandra Vargas";
  }, []);
  return <Studio route={{ view: "home" }} />;
}

function Studio({ route }: { route: Route }) {
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
      document.getElementById(id)?.scrollIntoView({ behavior: "instant" as ScrollBehavior }),
    );
  }, [route.view]);

  // A new project page starts at the top.
  const projectId = route.view === "project" ? route.id : null;
  useEffect(() => {
    if (projectId) window.scrollTo({ top: 0 });
  }, [projectId]);

  const toc = [
    { id: "projects", label: "Ideas" },
    { id: "compare", label: "Compare" },
  ];

  const jump = (id: string) => {
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

      <aside className="toc" aria-label="Site menu">
        <a
          className="toc-brand"
          href="#intro"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
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
          {toc.map((item) => {
            const on = active === item.id || (item.id === "projects" && active.startsWith("project-"));
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={on ? "on" : ""}
                aria-current={on ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  jump(item.id);
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <p className="toc-group">Projects</p>
        <nav className="toc-projects" aria-label="Projects">
          {data.projects.map((p) => (
            <a key={p.id} href={projectHref(p.id)}>
              {META[p.id]?.name ?? p.name}
            </a>
          ))}
        </nav>
      </aside>

      <nav className="ov-bar" aria-label="Sections">
        <a
          className="ov-brand"
          href="#intro"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          {data.site.brand}
        </a>
        <div className="ov-tabs">
          {toc.map((item) => {
            const on = active === item.id || (item.id === "projects" && active.startsWith("project-"));
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={on ? "on" : ""}
                aria-current={on ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  jump(item.id);
                }}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>

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
          <p className="tagline"><a href="#/">← Back to the short home</a></p>
        </header>

        <section className="section" id="new" data-section>
          <h2>Learn AI</h2>
          <ul className="play-grid new-grid">
            {LEARN.map((n) => (
              <li key={n.href}>
                <a
                  className="play-tile new-tile"
                  href={n.href}
                  target={n.external ? "_blank" : undefined}
                  rel={n.external ? "noopener" : undefined}
                >
                  <img src={n.pic} alt="" width={600} height={640} loading="lazy" decoding="async" />
                  <span className="play-name">
                    {n.name}
                    {n.external ? " ↗" : ""}
                  </span>
                  <span className="new-line">{n.line}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="section" id="projects" data-section>
          <h2>{capitalize(projectCountWord)} ideas, one studio</h2>
          <p className="section-lede">
            Tap one for its story, everything built and live links.
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
                      <span className="index-title">{META[p.id]?.name ?? p.name}</span>
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
                  <h3>{META[p.id]?.name ?? p.name}</h3>
                  <span className={`badge badge-${p.status}`}>
                    {statusLabel[p.status as Status]}
                  </span>
                </div>
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
                        <li key={c.label}>
                          <strong>{c.label}</strong>
                          <span>{c.summary}</span>
                          {PRIVATE_REPO.test(c.url) ? (
                            <span className="fill-in quiet">Private</span>
                          ) : (
                            <a
                              className="surface-link"
                              href={c.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Repo
                            </a>
                          )}
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
          <h2>Projects side by side</h2>
          <p className="section-lede">
            Pick up to {MAX_COMPARE} projects. Each row is one kind of piece. Open
            anything marked Live.
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
              ? ". Keep at least two selected."
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
