import { useEffect, useState } from "react";
import data from "../content/portfolio.json";

import { GROUPS, MAKE, META, NEW, type Fresh } from "./meta";
import { projectHref } from "./lib";

/* The short home: one line, two doors (Make · Ideas), what is new, then every idea as a picture,
   grouped by who it's for. Every detail (full index, Compare, Tools) lives one tap away at #/all. */
const TABS = [
  { id: "make", label: "Make" },
  { id: "ideas", label: "Ideas" },
];

export default function Home() {
  const [active, setActive] = useState("intro");

  useEffect(() => {
    document.title = "Vargas Studio — Alexandra Vargas";
    const id = window.location.hash.slice(1);
    if (id && !id.startsWith("/")) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "instant" as ScrollBehavior }));
    const obs = new IntersectionObserver(
      (entries) => {
        const v = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (v?.target.id) setActive(v.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] },
    );
    document.querySelectorAll<HTMLElement>("[data-section]").forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const jump = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };
  const tabs = (cls?: string) =>
    TABS.map((t) => (
      <a key={t.id} href={`#${t.id}`} className={active === t.id ? "on" : cls} aria-current={active === t.id ? "location" : undefined} onClick={(e) => jump(e, t.id)}>
        {t.label}
      </a>
    ));

  return (
    <div className="shell home">
      <div className="atmosphere" aria-hidden="true" />

      <aside className="toc" aria-label="Site menu">
        <a className="toc-brand" href="#/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          {data.site.brand}
        </a>
        <a className="toc-tour" href="#/tour">
          <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="3" width="13" height="9" /><path d="M6.5 5.5v4l3.5-2z" /></svg>
          Take the tour
        </a>
        <nav aria-label="Sections">{tabs()}</nav>
        <a className="toc-all" href="#/all">See every detail</a>
        <p className="toc-group">Projects</p>
        <nav className="toc-projects" aria-label="Projects">
          {data.projects.map((p) => (
            <a key={p.id} href={projectHref(p.id)}>{META[p.id]?.name ?? p.name}</a>
          ))}
        </nav>
      </aside>

      <nav className="ov-bar" aria-label="Sections">
        <a className="ov-brand" href="#/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          {data.site.brand}
        </a>
        <div className="ov-tabs">{tabs()}</div>
      </nav>

      <main className="main">
        <header className="hero" id="intro" data-section>
          <p className="eyebrow">{data.site.owner} · built with Claude</p>
          <h1 className="brand-hero">Ideas you can try.</h1>
          <div className="doors">
            <a href="#make" onClick={(e) => jump(e, "make")}><b>Make something</b><span>Invites, letters, puzzles</span></a>
            <a href="#ideas" onClick={(e) => jump(e, "ideas")}><b>See the ideas</b><span>{data.projects.length} so far</span></a>
          </div>
        </header>

        <section className="section" id="new" data-section>
          <h2>Just built</h2>
          <Tiles list={NEW} />
        </section>

        <section className="section" id="make" data-section>
          <h2>Make something</h2>
          <p className="section-lede">Answer a few questions. Pick from 3 versions. Print it.</p>
          <Tiles list={MAKE} />
        </section>

        <section className="section" id="ideas" data-section>
          <h2>The ideas</h2>
          {GROUPS.map((g) => (
            <div key={g.title} className="idea-group">
              <h3 className="group-title">{g.title}</h3>
              <ul className="play-grid">
                {g.ids.filter((id) => META[id] && data.projects.some((p) => p.id === id)).map((id) => (
                  <li key={id}>
                    <a className="play-tile new-tile" href={projectHref(id)}>
                      <img src={META[id].pic} alt="" width={600} height={640} loading="lazy" decoding="async" />
                      <span className="play-name">{META[id].name}</span>
                      <span className="new-line">{META[id].line}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <footer className="foot">
          <p>
            {data.site.brand} · {data.site.owner} · <a href="#/tour">Take the tour</a> · <a href="#/all">See every detail</a>
          </p>
        </footer>
      </main>
    </div>
  );
}

function Tiles({ list }: { list: Fresh[] }) {
  return (
    <ul className="play-grid new-grid">
      {list.map((n) => (
        <li key={n.href + n.name}>
          <a className="play-tile new-tile" href={n.href} target={n.external ? "_blank" : undefined} rel={n.external ? "noopener" : undefined}>
            <img src={n.pic} alt="" width={600} height={640} loading="lazy" decoding="async" />
            <span className="play-name">{n.name}{n.external ? " ↗" : ""}</span>
            <span className="new-line">{n.line}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
