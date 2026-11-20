import { useEffect, useMemo, useRef, useState } from "react";
import data from "../content/portfolio.json";
import {
  MEASURE_FIELDS,
  type BodyMeasurements,
  type ClosetProject,
  type Recipe,
  type Skill,
  analyzeOntoCanvas,
  describeGarment,
  loadCloset,
  loadMeasurements,
  paintDataUrl,
  recipesFor,
  saveCloset,
  saveMeasurements,
  stepsFor,
  type ImageStats,
  type GarmentRead,
} from "./flip-engine";

const project = data.projects.find((item) => item.id === "restitch");
const plan = project && "plan" in project ? project.plan : null;

const SKILLS: { id: Skill; label: string; hint: string }[] = [
  {
    id: "beginner",
    label: "Beginner",
    hint: "No-sew and plain hand stitches. Short steps.",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    hint: "Hand work plus a straight machine seam.",
  },
  {
    id: "advanced",
    label: "Advanced",
    hint: "Fitting, pressing, and machine shaping. Finer steps.",
  },
];

const METHOD_LABEL = {
  "no-sew": "No-sew",
  hand: "Hand",
  machine: "Machine",
} as const;

type Session = {
  fileName: string;
  previewDataUrl: string;
  stats: ImageStats;
  read: GarmentRead;
};

export default function PlanThisMake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [measurements, setMeasurements] = useState<BodyMeasurements>(() =>
    loadMeasurements(),
  );
  const [skill, setSkill] = useState<Skill>("beginner");
  const [session, setSession] = useState<Session | null>(null);
  const [closet, setCloset] = useState<ClosetProject[]>(() => loadCloset());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [savedNote, setSavedNote] = useState("");

  useEffect(() => {
    saveMeasurements(measurements);
  }, [measurements]);

  useEffect(() => {
    const latest = loadCloset()[0];
    const canvas = canvasRef.current;
    if (!latest || !canvas) return;
    let cancelled = false;
    void paintDataUrl(canvas, latest.previewDataUrl).then(() => {
      if (cancelled) return;
      setSkill(latest.skill);
      setSession({
        fileName: latest.fileName,
        previewDataUrl: latest.previewDataUrl,
        stats: latest.stats,
        read: latest.read,
      });
      setSelectedId(latest.recipeId);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const recipes = useMemo(
    () => (session ? recipesFor(session.stats, skill) : []),
    [session, skill],
  );

  useEffect(() => {
    if (!recipes.length) {
      setSelectedId(null);
      return;
    }
    setSelectedId((current) =>
      current && recipes.some((recipe) => recipe.id === current)
        ? current
        : recipes[0].id,
    );
  }, [recipes]);

  if (!project || !plan) {
    return (
      <main className="main plan-page">
        <p>Restitch is missing from the portfolio content.</p>
      </main>
    );
  }

  async function onFile(file: File | undefined) {
    const canvas = canvasRef.current;
    if (!file || !canvas) return;
    setError("");
    setSavedNote("");
    try {
      const stats = await analyzeOntoCanvas(file, canvas);
      const previewDataUrl = canvas.toDataURL("image/jpeg", 0.72);
      setSession({
        fileName: file.name,
        previewDataUrl,
        stats,
        read: describeGarment(stats),
      });
    } catch (caught) {
      setSession(null);
      setError(caught instanceof Error ? caught.message : "Could not read that file.");
    }
  }

  function onMeasure(id: keyof BodyMeasurements, value: string) {
    setMeasurements((current) => ({ ...current, [id]: value }));
  }

  async function openProject(item: ClosetProject) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setError("");
    setSavedNote("");
    await paintDataUrl(canvas, item.previewDataUrl);
    setSkill(item.skill);
    setMeasurements(item.measurements);
    setSession({
      fileName: item.fileName,
      previewDataUrl: item.previewDataUrl,
      stats: item.stats,
      read: item.read,
    });
    setSelectedId(item.recipeId);
  }

  function saveProject() {
    if (!session) return;
    const recipe = recipes.find((item) => item.id === selectedId) ?? recipes[0];
    if (!recipe) return;
    const entry: ClosetProject = {
      id: `${Date.now()}`,
      savedAt: new Date().toISOString(),
      fileName: session.fileName,
      previewDataUrl: session.previewDataUrl,
      stats: session.stats,
      read: session.read,
      skill,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      measurements: { ...measurements },
    };
    const next = [entry, ...closet].slice(0, 12);
    setCloset(next);
    saveCloset(next);
    setSavedNote("Saved in this browser. Reload and it is still in the closet.");
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
          <section className="stand-in" aria-labelledby="before-label">
            <div className="column-cell-head">
              <h2 id="before-label" className="measure-label">
                Before
              </h2>
              <span className="badge badge-real">Your file</span>
            </div>
            <label className="file-btn">
              Choose a photo
              <input
                data-testid="file-input"
                type="file"
                accept="image/*"
                onChange={(event) => void onFile(event.target.files?.[0])}
              />
            </label>
            <canvas
              ref={canvasRef}
              className="preview-canvas"
              data-testid="preview-canvas"
              aria-label={
                session
                  ? `Before photo, ${session.fileName}`
                  : "Before photo appears here after you choose a file"
              }
            />
            <p className="cell-detail" data-testid="file-name">
              {session
                ? session.fileName
                : "The photo you choose is drawn on the canvas above. Color, brightness, and aspect come from those pixels."}
            </p>
            {error ? (
              <p className="cell-detail" role="alert">
                {error}
              </p>
            ) : null}
          </section>

          <form className="measure-card" aria-labelledby="tape-label">
            <div className="column-cell-head">
              <h2 id="tape-label" className="measure-label">
                Your tape
              </h2>
              <span className="badge badge-real">Typed</span>
            </div>
            <p className="cell-detail">
              Numbers you type, saved in this browser. The photo never fills these in, and nothing here is a cut-ready centimeter.
            </p>
            <div className="tape-fields">
              {MEASURE_FIELDS.map((field) => (
                <label key={field.id} htmlFor={`tape-${field.id}`}>
                  {field.label}
                  <input
                    id={`tape-${field.id}`}
                    data-testid={`measure-${field.id}`}
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="Your unit"
                    value={measurements[field.id]}
                    onChange={(event) => onMeasure(field.id, event.target.value)}
                  />
                </label>
              ))}
            </div>
          </form>
        </div>

        <section className="section plan-block" aria-labelledby="skill-label">
          <div className="plan-step-head">
            <h2 id="skill-label">Skill</h2>
          </div>
          <div className="skill-switch" role="group" aria-label="Sewing skill">
            {SKILLS.map((item) => (
              <button
                key={item.id}
                type="button"
                data-testid={`skill-${item.id}`}
                aria-pressed={skill === item.id}
                onClick={() => setSkill(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="cell-detail skill-hint">
            {SKILLS.find((item) => item.id === skill)?.hint}
          </p>
        </section>

        {session ? (
          <>
            <section className="section plan-block" aria-labelledby="read-title">
              <div className="plan-step-head">
                <h2 id="read-title">Read</h2>
                <span className="badge badge-mocked">Visual guess</span>
              </div>
              <div className="chip-row">
                <span className="badge" data-testid="read-hex">
                  <i className="swatch" style={{ background: session.stats.hex }} />
                  {session.stats.hex}
                </span>
                <span className="badge" data-testid="read-brightness">
                  Brightness {Math.round(session.stats.brightness * 100)}%
                </span>
                <span className="badge" data-testid="read-aspect">
                  Aspect {session.stats.aspectUsed.toFixed(2)}
                </span>
                <span className="badge">{session.read.hue}</span>
              </div>
              <p className="body" data-testid="read-summary">
                {session.read.headline} {session.read.detail}
              </p>
              <p className="cell-detail">{session.read.clothGuess}</p>
              <p className="cell-detail">
                Silhouette is a visual guess from the aspect of this file.
              </p>
            </section>

            <section className="section plan-block" aria-labelledby="recipes-title">
              <div className="plan-step-head">
                <h2 id="recipes-title">Flips for this read</h2>
                <span className="badge badge-real">{skill}</span>
              </div>
              <p className="section-lede">
                No pattern PDF. Steps stay on this page. A link leaves for a public technique page.
              </p>
              <div className="column-grid">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    skill={skill}
                    selected={recipe.id === selectedId}
                    measurements={measurements}
                    onSelect={() => setSelectedId(recipe.id)}
                  />
                ))}
              </div>
              <button
                type="button"
                className="save-btn"
                data-testid="save-closet"
                onClick={saveProject}
              >
                Save this flip to the closet
              </button>
              {savedNote ? (
                <p className="cell-detail" data-testid="saved-note">
                  {savedNote}
                </p>
              ) : null}
            </section>
          </>
        ) : (
          <section className="section plan-block">
            <p className="body">
              Choose a photo to get a read. A second photo is a different garment: different color, different aspect, different flips.
            </p>
          </section>
        )}

        <section className="section plan-block" aria-labelledby="closet-title">
          <div className="plan-step-head">
            <h2 id="closet-title">Closet</h2>
            <span className="badge badge-real">This browser</span>
          </div>
          <p className="section-lede tight">
            Saved in this browser. Reload keeps every card.
          </p>
          {closet.length === 0 ? (
            <p className="cell-detail">Nothing saved yet.</p>
          ) : (
            <ul className="closet-list" data-testid="closet-list">
              {closet.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => void openProject(item)}>
                    <img src={item.previewDataUrl} alt="" />
                    <span>
                      <strong>{item.recipeTitle}</strong>
                      <span className="cell-detail">
                        {item.fileName} · {item.skill} · {item.stats.hex} · aspect{" "}
                        {item.stats.aspectUsed.toFixed(2)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <blockquote className="disclaimer">
          <p>{plan.disclaimer}</p>
        </blockquote>

        <footer className="foot">
          <p>
            {data.site.brand} · {data.site.owner}
          </p>
        </footer>
      </main>
    </div>
  );
}

function RecipeCard({
  recipe,
  skill,
  selected,
  measurements,
  onSelect,
}: {
  recipe: Recipe;
  skill: Skill;
  selected: boolean;
  measurements: BodyMeasurements;
  onSelect: () => void;
}) {
  const steps = stepsFor(recipe, skill);
  return (
    <article
      className={`column-cell recipe-card${selected ? " is-selected" : ""}`}
      data-testid="recipe-card"
      data-recipe-id={recipe.id}
    >
      <div className="column-cell-head">
        <span className="kind-chip">{METHOD_LABEL[recipe.method]}</span>
        <span className="badge">{recipe.difficulty}</span>
      </div>
      <h3 data-testid="recipe-title">{recipe.title}</h3>
      <p className="meta-label">Notions</p>
      <ul className="plain-list">
        {recipe.notions.map((notion) => (
          <li key={notion}>{notion}</li>
        ))}
      </ul>
      <p className="meta-label">Measure for this flip</p>
      <ul className="plain-list" data-testid="checklist">
        {recipe.checklist.map((item) => {
          const typed = item.measureId ? measurements[item.measureId].trim() : "";
          return (
            <li key={item.label}>
              {item.label}
              {item.measureId ? (
                typed ? (
                  <span className="typed-value"> You typed {typed}.</span>
                ) : (
                  <span className="typed-value"> Not typed yet.</span>
                )
              ) : (
                <span className="typed-value"> Measure it yourself. Not from the photo.</span>
              )}
            </li>
          );
        })}
      </ul>
      <p className="meta-label">Steps</p>
      <ol className="make-steps" data-testid="steps">
        {steps.map((step) => (
          <li key={step.text}>
            {step.text}{" "}
            {step.href && step.linkLabel ? (
              <a href={step.href} target="_blank" rel="noreferrer">
                {step.linkLabel}
              </a>
            ) : null}
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="text-btn"
        aria-pressed={selected}
        onClick={onSelect}
      >
        {selected ? "Using this flip" : "Use this flip"}
      </button>
    </article>
  );
}
