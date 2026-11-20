import { useEffect, useState } from "react";
import data from "../content/portfolio.json";

type Status = "hot" | "active" | "quiet" | "seed";

const statusLabel: Record<Status, string> = {
  hot: "Hot now",
  active: "In flight",
  quiet: "Quieter",
  seed: "Seed / fill in",
};

function projectName(id: string) {
  return data.projects.find((p) => p.id === id)?.name ?? id;
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
      id: "lenses",
      label: "Lenses",
      children: data.lenses.map((l) => ({ id: `lens-${l.id}`, label: l.name })),
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
          <p className="eyebrow">{data.site.owner} · {data.site.role}</p>
          <h1 className="brand-hero">{data.site.brand}</h1>
          <p className="tagline">{data.site.tagline}</p>
          <p className="lede">{data.site.forWhom}</p>
          <p className="support">{data.site.intro}</p>
          <p className="support muted">{data.site.howToNav}</p>
          <div className="hero-cta">
            <a href="#now" onClick={(e) => { e.preventDefault(); jump("now"); }}>
              What’s new
            </a>
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
          <h2>Each idea, one scroll</h2>
          <p className="section-lede">
            Real workstreams from her repos — not invented filler.
          </p>

          {data.projects.map((p) => (
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
              <p className="one-liner">{p.oneLiner}</p>
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
              <h4>Key artifacts</h4>
              <ul className="artifact-list">
                {p.artifacts.map((a) => (
                  <li key={a.label}>
                    <strong>{a.label}</strong>
                    <span>{a.detail}</span>
                  </li>
                ))}
              </ul>
              {p.links.length > 0 ? (
                <p className="out-links">
                  {p.links.map((l) => (
                    <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
                      {l.label}
                    </a>
                  ))}
                </p>
              ) : null}
            </article>
          ))}
        </section>

        <section className="section" id="lenses" data-section>
          <p className="section-kicker">Lenses</p>
          <h2>Same shape, side by side</h2>
          <p className="section-lede">
            Compare ads, waitlists, and landings across projects.
          </p>

          {data.lenses.map((lens) => (
            <div
              key={lens.id}
              className="lens"
              id={`lens-${lens.id}`}
              data-section
            >
              <h3>{lens.name}</h3>
              <p className="section-lede tight">{lens.blurb}</p>
              <div className="lens-grid">
                {lens.items.map((item) => (
                  <a
                    key={`${lens.id}-${item.projectId}-${item.title}`}
                    className="lens-item"
                    href={`#project-${item.projectId}`}
                  >
                    <span className={`badge badge-${item.status}`}>
                      {projectName(item.projectId)}
                    </span>
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="section" id="general" data-section>
          <p className="section-kicker">General</p>
          <h2>Outside any one project</h2>

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
          <p className="support muted">
            Working brand name is easy to rename. Gaps labeled “Fill in” are
            honest placeholders — drop media or confirm live URLs when ready.
          </p>
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
