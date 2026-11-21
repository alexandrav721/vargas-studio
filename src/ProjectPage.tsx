import data from "../content/portfolio.json";
import {
  liveCount,
  primaryOpen,
  projectHref,
  statusLabel,
  thumbFor,
  tourHref,
  visualsOf,
  type Status,
} from "./lib";

export default function ProjectPage({ id }: { id: string }) {
  const index = data.projects.findIndex((p) => p.id === id);
  const p = data.projects[index];
  const visuals = visualsOf(p);
  const open = primaryOpen(p);
  const prev = data.projects[(index - 1 + data.projects.length) % data.projects.length];
  const next = data.projects[(index + 1) % data.projects.length];

  // Sections that point at the same page share one tile.
  const tiles: { url: string; cols: string[]; label: string; detail: string }[] = [];
  for (const col of data.columns) {
    const cell = visuals[col.id];
    if (!cell || cell.state !== "live" || !cell.url) continue;
    const same = tiles.find((t) => t.url === cell.url);
    if (same) same.cols.push(col.name);
    else tiles.push({ url: cell.url, cols: [col.name], label: cell.label, detail: cell.detail });
  }

  return (
    <article className="pp" aria-labelledby="pp-title">
      <header className="pp-head">
        <p className="pp-status">
          <span className={`badge badge-${p.status}`}>
            {statusLabel[p.status as Status]}
          </span>
          <span>{liveCount(p)} of 8 pieces live</span>
          {p.aka ? <span>Also called {p.aka}</span> : null}
        </p>
        <h1 id="pp-title">{p.name}</h1>
        <p className="pp-line">{p.oneLiner}</p>

        <dl className="sp-facts pp-facts">
          <div>
            <dt>For</dt>
            <dd>{p.audience}</dd>
          </div>
          <div>
            <dt>Who pays</dt>
            <dd>{p.pays}</dd>
          </div>
          <div>
            <dt>Latest</dt>
            <dd>{p.latest}</dd>
          </div>
        </dl>

        <p className="body pp-summary">{p.summary}</p>

        <div className="detail-actions">
          {open ? (
            <a className="action-primary" href={open.cell.url!} target="_blank" rel="noreferrer">
              Open {open.cell.label}
            </a>
          ) : null}
          <a className="action-ghost" href={tourHref(index + 3)}>
            See it as a slide
          </a>
        </div>
      </header>

      <section className="pp-work" aria-labelledby="pp-work-title">
        <h2 id="pp-work-title">Everything built</h2>
        <ul className="pp-grid">
          {tiles.map((tile) => {
            const src = thumbFor(tile.url);
            return (
              <li key={tile.url}>
                <a className="pp-tile" href={tile.url} target="_blank" rel="noreferrer">
                  <span className="pp-shot">
                    {src ? (
                      <img src={src} alt="" loading="lazy" />
                    ) : (
                      <span className="pp-noshot">{tile.cols[0]}</span>
                    )}
                  </span>
                  <span className="pp-col">{tile.cols.join(" · ")}</span>
                  <span className="pp-label">{tile.label}</span>
                  <span className="pp-detail">{tile.detail}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      {p.code.length > 0 ? (
        <section className="pp-code" aria-labelledby="pp-code-title">
          <h2 id="pp-code-title">Code</h2>
          <ul className="artifact-list">
            {p.code.map((c) => (
              <li key={c.url}>
                <strong>{c.label}</strong>
                <span>{c.summary}</span>
                <a className="surface-link" href={c.url} target="_blank" rel="noreferrer">
                  Repo
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <nav className="pp-pager" aria-label="Other projects">
        <a href={projectHref(prev.id)}>
          <span>Previous</span>
          {prev.name}
        </a>
        <a href={projectHref(next.id)}>
          <span>Next</span>
          {next.name}
        </a>
      </nav>
    </article>
  );
}
