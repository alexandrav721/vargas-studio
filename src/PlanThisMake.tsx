import data from "../content/portfolio.json";

const project = data.projects.find((item) => item.id === "restitch");
const plan = project && "plan" in project ? project.plan : null;

function FlatLay({ sheetLabel, title }: { sheetLabel: string; title: string }) {
  return (
    <svg viewBox="0 0 720 420" role="img" aria-labelledby="flatlay-title">
      <title id="flatlay-title">{title}</title>
      <rect className="sheet" x="56" y="58" width="200" height="258" />
      <rect className="sheet-rule" x="72" y="74" width="168" height="226" />
      <text className="sheet-label" x="156" y="196" textAnchor="middle">
        {sheetLabel}
      </text>
      <path
        className="garment"
        d="M318 348 L328 196 C350 162 368 124 378 102 L400 88 C424 118 496 118 520 88 L542 102 C552 124 570 162 592 196 L602 348 Z"
      />
    </svg>
  );
}

export default function PlanThisMake() {
  if (!project || !plan) {
    return (
      <main className="main plan-page">
        <p>Restitch sample is missing from the portfolio content.</p>
      </main>
    );
  }

  return (
    <div className="shell">
      <div className="atmosphere" aria-hidden="true" />
      <main className="main plan-page">
        <a className="plan-home" href="index.html">
          {plan.homeLabel}
        </a>

        <header className="plan-header" id="plan">
          <p className="eyebrow">{plan.kicker}</p>
          <h1 className="plan-title">{plan.title}</h1>
          <p className="lede">{plan.lede}</p>
        </header>

        <div className="sample-grid">
          <figure className="stand-in">
            <div className="column-cell-head">
              <span className="kind-chip">{plan.photo.kicker}</span>
              <span className="badge badge-mocked">{plan.photo.badge}</span>
            </div>
            <FlatLay sheetLabel={plan.photo.sheetLabel} title={plan.photo.alt} />
            <figcaption>{plan.photo.caption}</figcaption>
            <p className="second-upload">
              <span className="badge badge-mocked">{plan.measurements.badge}</span>
              {plan.photo.secondUpload}
            </p>
          </figure>

          <section className="measure-card" aria-labelledby="measured-label">
            <div className="column-cell-head">
              <h2 id="measured-label" className="measure-label">
                {plan.measurements.label}
              </h2>
              <span className="badge badge-mocked">{plan.measurements.badge}</span>
            </div>
            <dl className="measure-list">
              {plan.measurements.items.map((item) => (
                <div key={item.name}>
                  <dt>{item.name}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className="cell-detail">{plan.measurements.note}</p>
          </section>
        </div>

        <section className="section plan-block" aria-labelledby="read-title">
          <div className="plan-step-head">
            <h2 id="read-title">{plan.read.title}</h2>
            <span className="badge badge-real">{plan.read.badge}</span>
          </div>
          <div className="chip-row">
            {plan.read.chips.map((chip) => (
              <span key={chip} className="badge">
                {chip}
              </span>
            ))}
          </div>
          <p className="body">{plan.read.body}</p>
        </section>

        <section className="section plan-block" aria-labelledby="measure-next-title">
          <div className="plan-step-head">
            <h2 id="measure-next-title">{plan.measureNext.title}</h2>
            <span className="badge badge-real">{plan.measureNext.badge}</span>
          </div>
          <div className="measure-cols">
            {plan.measureNext.groups.map((group) => (
              <div key={group.label}>
                <p className="meta-label">{group.label}</p>
                <ul className="plain-list">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="body">{plan.measureNext.body}</p>
        </section>

        <section className="section plan-block" aria-labelledby="make-title">
          <div className="plan-step-head">
            <h2 id="make-title">{plan.make.title}</h2>
            <span className="badge badge-real">{plan.make.badge}</span>
          </div>
          <ol className="make-steps">
            {plan.make.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="meta-row">
            {plan.make.notes.map((note) => (
              <p key={note.label}>
                <span className="meta-label">{note.label}</span>
                {note.text}
              </p>
            ))}
          </div>
          <blockquote className="disclaimer">
            <p>{plan.disclaimer}</p>
          </blockquote>
        </section>

        <section className="section plan-block" aria-labelledby="patterns-title">
          <h2 id="patterns-title">{plan.patterns.title}</h2>
          <p className="section-lede">{plan.patterns.intro}</p>
          <div className="column-grid">
            {plan.patterns.cards.map((card) => (
              <article key={card.url} className="column-cell">
                <strong>{card.name}</strong>
                <span className="cell-detail">{card.detail}</span>
                <a
                  className="surface-link"
                  href={card.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {card.linkLabel}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="section plan-block" aria-labelledby="absent-title">
          <h2 id="absent-title">{plan.absent.title}</h2>
          <ul className="plain-list">
            {plan.absent.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="section plan-block" aria-labelledby="ledger-title">
          <h2 id="ledger-title">{plan.ledger.title}</h2>
          <p className="section-lede tight">{plan.ledger.intro}</p>
          <div className="ledger-scroll">
          <table className="ledger">
            <thead>
              <tr>
                {plan.ledger.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plan.ledger.rows.map((row) => (
                <tr key={row.item}>
                  <td>{row.item}</td>
                  <td>
                    <span
                      className={`badge ${row.status === "Real" ? "badge-real" : "badge-mocked"}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>{row.detail}</td>
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
    </div>
  );
}
