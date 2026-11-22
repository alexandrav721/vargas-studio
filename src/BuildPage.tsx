import { useEffect } from "react";
import data from "../content/portfolio.json";
import SiteBar from "./SiteBar";
import { projectHref } from "./lib";
import { META } from "./meta";

/* "How I build them": one short list of the 8 ideas. Each row opens its project page. */
export default function BuildPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "How I build them · Vargas Studio";
  }, []);

  return (
    <div className="lad">
      <SiteBar backHref="#/" backLabel="Home" />
      <main className="lad-main">
        <header className="lad-head">
          <h1>How I build them</h1>
          <p>Each idea, taken all the way: app, ads, deck, print.</p>
        </header>

        <ul className="build-list">
          {data.projects.map((p) => {
            const m = META[p.id];
            return (
              <li key={p.id}>
                <a className="build-row" href={projectHref(p.id)}>
                  <img src={m?.pic} alt="" width={600} height={640} loading="lazy" decoding="async" />
                  <span className="build-text">
                    <strong>{m?.name ?? p.name}</strong>
                    <span>{m?.line ?? p.oneLiner}</span>
                  </span>
                  <span className="build-go" aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <a className="lad-more" href="#/all">
          See every detail →
        </a>

        <details className="lad-craft">
          <summary>Tools I use</summary>
          <ul>
            {[...data.general.skills, ...data.general.agents, ...data.general.reusable].map((c) => (
              <li key={c.name}>
                <strong>{c.name}</strong> <span>{c.detail}</span>
              </li>
            ))}
          </ul>
        </details>
      </main>
    </div>
  );
}
