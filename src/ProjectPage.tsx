import { useEffect } from "react";
import data from "../content/portfolio.json";
import SiteBar from "./SiteBar";
import { projectHref, thumbFor, visualsOf } from "./lib";
import { META, PLAIN } from "./meta";

/* A project, picture first: its game, one line, Play; then everything made for it as pictures. */
export default function ProjectPage({ id }: { id: string }) {
  const index = data.projects.findIndex((p) => p.id === id);
  const p = data.projects[index];
  const m = META[p.id];
  const visuals = visualsOf(p);
  const prev = data.projects[(index - 1 + data.projects.length) % data.projects.length];
  const next = data.projects[(index + 1) % data.projects.length];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${m.name} · Vargas Studio`;
  }, [m.name]);

  // Pieces that point at the same page share one tile.
  const tiles: { url: string; labels: string[] }[] = [];
  for (const col of data.columns) {
    const cell = visuals[col.id];
    if (!cell || cell.state !== "live" || !cell.url) continue;
    const label = PLAIN[col.id] ?? col.name;
    const same = tiles.find((t) => t.url === cell.url);
    if (same) same.labels.push(label);
    else tiles.push({ url: cell.url, labels: [label] });
  }

  return (
    <div className="lad">
      <SiteBar backHref="#/work" backLabel="How I build them" />
      <main className="lad-main">
        <article className="proj" aria-labelledby="proj-title">
          <a className="proj-pic" href={m.play} target={m.external ? "_blank" : undefined} rel={m.external ? "noopener" : undefined} tabIndex={-1} aria-hidden="true">
            <img src={m.pic} alt="" width={600} height={640} decoding="async" />
          </a>
          <h1 id="proj-title">{m.name}</h1>
          <p className="proj-line">{m.line}</p>
          <a className="proj-play" href={m.play} target={m.external ? "_blank" : undefined} rel={m.external ? "noopener" : undefined}>
            {m.playLabel}
          </a>

          <h2 className="proj-sub">Everything I made for it</h2>
          <ul className="proj-grid">
            {tiles.map((t) => {
              const src = thumbFor(t.url);
              return (
                <li key={t.url}>
                  <a className="proj-tile" href={t.url}>
                    <span className="proj-shot">{src ? <img src={src} alt="" loading="lazy" decoding="async" /> : <span className="proj-noshot">{t.labels[0]}</span>}</span>
                    <span className="proj-label">{t.labels.join(" · ")}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <dl className="proj-facts">
            <div>
              <dt>For</dt>
              <dd>{p.audience}</dd>
            </div>
            <div>
              <dt>Who pays</dt>
              <dd>{p.pays}</dd>
            </div>
          </dl>

          <a className="lad-more" href="#/all">
            See every detail →
          </a>

          <nav className="proj-pager" aria-label="Other ideas">
            <a href={projectHref(prev.id)}>← {META[prev.id]?.name ?? prev.name}</a>
            <a href={projectHref(next.id)}>{META[next.id]?.name ?? next.name} →</a>
          </nav>
        </article>
      </main>
    </div>
  );
}
