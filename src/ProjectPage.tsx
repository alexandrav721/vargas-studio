import { useEffect, useState } from "react";
import data from "../content/portfolio.json";
import Lightbox, { type Shot } from "./Lightbox";
import SiteBar from "./SiteBar";
import { projectHref, thumbFor, visualsOf } from "./lib";
import { META, PLAIN } from "./meta";

/* A project, picture first: its game, one line, Play; then everything made for it as pictures. */
export default function ProjectPage({ id }: { id: string }) {
  const index = data.projects.findIndex((p) => p.id === id);
  const p = data.projects[index];
  const m = META[p.id];
  const visuals = visualsOf(p);
  const [viewer, setViewer] = useState<number | null>(null);
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
  // the pictures the viewer can swipe through (tiles that have a screenshot)
  const shots: Shot[] = tiles.flatMap((t) => {
    const src = thumbFor(t.url);
    return src ? [{ src, label: t.labels.join(" · "), url: t.url }] : [];
  });

  return (
    <div className="lad">
      <SiteBar backHref="#ideas" backLabel="All ideas" />
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

          <h2 className="proj-sub">Everything I made for it</h2>
          <ul className="proj-grid">
            {tiles.map((t) => {
              const src = thumbFor(t.url);
              return (
                <li key={t.url}>
                  <a
                    className="proj-tile"
                    href={t.url}
                    onClick={(e) => {
                      const at = shots.findIndex((x) => x.url === t.url);
                      if (at < 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                      e.preventDefault();
                      setViewer(at);
                    }}
                  >
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

          <nav className="proj-pager" aria-label="Other ideas">
            <a href={projectHref(prev.id)}>← {META[prev.id]?.name ?? prev.name}</a>
            <a href={projectHref(next.id)}>{META[next.id]?.name ?? next.name} →</a>
          </nav>
        </article>
      </main>
      {viewer !== null ? <Lightbox title={m.name} shots={shots} start={viewer} onClose={() => setViewer(null)} /> : null}
    </div>
  );
}
