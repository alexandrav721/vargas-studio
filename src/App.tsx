import { useEffect, useMemo, useState } from "react";
import data from "../content/portfolio.json";

type Status = "hot" | "active" | "quiet" | "seed";
type CellState = "live" | "fill-in" | "na";

const statusLabel: Record<Status, string> = {
  hot: "Hot now",
  active: "In flight",
  quiet: "Quieter",
  seed: "Seed",
};

const cellStateLabel: Record<CellState, string> = {
  live: "Live",
  "fill-in": "Fill in",
  na: "N/A",
};

type VisualCell = {
  label: string;
  detail: string;
  url: string | null;
  state: string;
};

type Project = (typeof data.projects)[number];

const OPEN_PRIORITY = [
  "product-ui",
  "website",
  "landing",
  "funnel",
  "social",
  "deck",
  "meta-ads",
  "print",
] as const;

function visualsOf(project: Project) {
  return project.visuals as Record<string, VisualCell>;
}

function cellFor(project: Project, columnId: string): VisualCell | null {
  return visualsOf(project)[columnId] ?? null;
}

function liveCount(project: Project) {
  return Object.values(visualsOf(project)).filter((c) => c.state === "live")
    .length;
}

function primaryOpen(project: Project): { columnId: string; cell: VisualCell } | null {
  const visuals = visualsOf(project);
  for (const id of OPEN_PRIORITY) {
    const cell = visuals[id];
    if (cell?.state === "live" && cell.url) {
      return { columnId: id, cell };
    }
  }
  return null;
}

const MAX_COMPARE = 5;

export default function App() {
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
  }, []);

  const toc = [
    { id: "intro", label: "Intro" },
    { id: "projects", label: "Projects" },
    { id: "compare", label: "Compare" },
    { id: "craft", label: "Craft" },
  ];

  const jump = (id: string) => {
    setTocOpen(false);
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
        <p className="toc-brand">{data.site.brand}</p>
        <nav>
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={
                active === item.id ||
                (item.id === "projects" && active.startsWith("project-"))
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
        <p className="toc-hint">
          Browse ideas, then compare the same craft columns across them.
        </p>
      </aside>

      <main className="main">
        <header className="hero" id="intro" data-section>
          <p className="eyebrow">
            {data.site.owner} · {data.site.role}
          </p>
          <h1 className="brand-hero">{data.site.brand}</h1>
          <p className="tagline">{data.site.tagline}</p>
          <p className="lede">{data.site.forWhom}</p>
          <div className="hero-cta">
            <a
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
          <h2>Five ideas, one studio</h2>
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

          <div className="update-block">
            <h3 className="subhead">Keep it current</h3>
            <p className="body">{data.updateHint}</p>
            <ul className="plain-list house-list">
              <li>
                <strong>Visuals</strong>
                <span>{data.housekeeping.visualsHome}</span>
              </li>
              <li>
                <strong>Code & non-visual</strong>
                <span>{data.housekeeping.nonVisualHome}</span>
              </li>
              <li>
                <strong>Retire old stuff</strong>
                <span>{data.housekeeping.retireOld}</span>
              </li>
            </ul>
          </div>
        </section>

        <footer className="foot">
          <p>
            {data.site.brand} · {data.site.owner}
          </p>
        </footer>
      </main>
    </div>
  );
}
