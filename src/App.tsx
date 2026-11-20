import { useEffect, useState } from "react";
import data from "../content/portfolio.json";

type Status = "hot" | "active" | "quiet" | "seed";
type CellState = "live" | "fill-in" | "na";

const statusLabel: Record<Status, string> = {
  hot: "Hot now",
  active: "In flight",
  quiet: "Quieter",
  seed: "Seed / fill in",
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

function projectName(id: string) {
  return data.projects.find((p) => p.id === id)?.name ?? id;
}

function cellFor(projectId: string, columnId: string): VisualCell | null {
  const project = data.projects.find((p) => p.id === projectId);
  if (!project) return null;
  const visuals = project.visuals as Record<string, VisualCell>;
  return visuals[columnId] ?? null;
}

export default function App() {
  const [tocOpen, setTocOpen] = useState(false);
  const [active, setActive] = useState("intro");

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
    { id: "now", label: "Now" },
    {
      id: "projects",
      label: "Projects",
      children: data.projects.map((p) => ({
        id: `project-${p.id}`,
        label: p.name,
      })),
    },
    {
      id: "compare",
      label: "Compare",
      children: data.columns.map((c) => ({
        id: `column-${c.id}`,
        label: c.name,
      })),
    },
    { id: "general", label: "General" },
    { id: "how-to-update", label: "Update" },
  ];

  const jump = (id: string) => {
    setTocOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="shell">
      <div className="atmosphere" aria-hidden="true" />

      <button
        type="button"
        className="toc-toggle"
        aria-expanded={tocOpen}
        onClick={() => setTocOpen((v) => !v)}
      >
        {tocOpen ? "Close" : "Contents"}
      </button>

      <aside className={`toc ${tocOpen ? "open" : ""}`} aria-label="Table of contents">
        <p className="toc-brand">{data.site.brand}</p>
        <nav>
          {toc.map((item) => (
            <div key={item.id} className="toc-group">
              <a
                href={`#${item.id}`}
                className={active === item.id ? "on" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  jump(item.id);
                }}
              >
                {item.label}
              </a>
              {"children" in item && item.children
                ? item.children.map((c) => (
                    <a
                      key={c.id}
                      href={`#${c.id}`}
                      className={`toc-child ${active === c.id ? "on" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        jump(c.id);
                      }}
                    >
                      {c.label}
                    </a>
                  ))
                : null}
            </div>
          ))}
        </nav>
      </aside>

      <main className="main">
        <header className="hero" id="intro" data-section>
          <p className="eyebrow">
            {data.site.owner} · {data.site.role}
          </p>
          <h1 className="brand-hero">{data.site.brand}</h1>
          <p className="tagline">{data.site.tagline}</p>
          <p className="lede">{data.site.forWhom}</p>
          <p className="support">{data.site.intro}</p>
          <p className="support muted">{data.site.howToNav}</p>
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
              Compare columns
            </a>
          </div>
        </header>

        <section className="section now" id="now" data-section>
          <p className="section-kicker">Now</p>
          <h2>Newest without digging</h2>
          <ol className="now-list">
            {data.now.map((n) => (
              <li key={`${n.date}-${n.projectId}`}>
                <time dateTime={n.date}>{n.date}</time>
                <div>
                  <a href={`#project-${n.projectId}`}>{projectName(n.projectId)}</a>
                  <p>{n.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="section" id="projects" data-section>
          <p className="section-kicker">Projects</p>
          <h2>Each idea, same columns</h2>
          <p className="section-lede">
            Concept first. Then Website → Landing → Funnel → Meta ads → Product
            UI → Deck → Print → Social.
          </p>

          {data.projects.map((p) => {
            const visuals = p.visuals as Record<string, VisualCell>;
            return (
              <article
                key={p.id}
                className="project"
                id={`project-${p.id}`}
                data-section
              >
                <div className="project-head">
                  <h3>{p.name}</h3>
                  <span className={`badge badge-${p.status}`}>
                    {statusLabel[p.status as Status]}
                  </span>
                </div>
                {p.aka ? <p className="aka">Also known as {p.aka}</p> : null}
                <p className="one-liner">{p.oneLiner}</p>

                <h4>Business concept</h4>
                <p className="body">{p.summary}</p>
                <div className="meta-row">
                  <p>
                    <span className="meta-label">Latest</span>
                    {p.latest}
                  </p>
                  <p>
                    <span className="meta-label">Updated</span>
                    {p.updated}
                  </p>
                </div>

                <h4>Visual columns</h4>
                <div className="column-grid">
                  {data.columns.map((col) => {
                    const cell = visuals[col.id];
                    if (!cell) return null;
                    const state = cell.state as CellState;
                    return (
                      <div
                        key={`${p.id}-${col.id}`}
                        className={`column-cell state-${state}`}
                      >
                        <div className="column-cell-head">
                          <span className="kind-chip">{col.name}</span>
                          <span className={`cell-state cell-state-${state}`}>
                            {cellStateLabel[state]}
                          </span>
                        </div>
                        <strong>{cell.label}</strong>
                        <span className="cell-detail">{cell.detail}</span>
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
                      </div>
                    );
                  })}
                </div>

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

        <section className="section" id="compare" data-section>
          <p className="section-kicker">Compare</p>
          <h2>One column, every project</h2>
          <p className="section-lede">
            Same artifact type side-by-side — update once in JSON, it shows here.
          </p>

          {data.columns.map((col) => (
            <div
              key={col.id}
              className="lens"
              id={`column-${col.id}`}
              data-section
            >
              <h3>{col.name}</h3>
              <p className="section-lede tight">{col.blurb}</p>
              <div className="lens-grid">
                {data.projects.map((p) => {
                  const cell = cellFor(p.id, col.id);
                  if (!cell) return null;
                  const state = cell.state as CellState;
                  const inner = (
                    <>
                      <span className={`badge badge-${p.status}`}>
                        {p.name}
                      </span>
                      <span className={`cell-state cell-state-${state}`}>
                        {cellStateLabel[state]}
                      </span>
                      <strong>{cell.label}</strong>
                      <span>{cell.detail}</span>
                    </>
                  );
                  if (cell.url) {
                    return (
                      <a
                        key={`${col.id}-${p.id}`}
                        className={`lens-item state-${state}`}
                        href={cell.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {inner}
                      </a>
                    );
                  }
                  return (
                    <div
                      key={`${col.id}-${p.id}`}
                      className={`lens-item state-${state} inert`}
                    >
                      {inner}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <section className="section" id="general" data-section>
          <p className="section-kicker">General</p>
          <h2>Non-visual craft</h2>
          <p className="section-lede">
            Skills, agents, and reusable patterns — not in the visual columns.
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

        <section className="section last" id="how-to-update" data-section>
          <p className="section-kicker">For Alexandra</p>
          <h2>Keep it current</h2>
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
