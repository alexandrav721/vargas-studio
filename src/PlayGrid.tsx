import { useEffect, useState } from "react";
import data from "../content/portfolio.json";
import { playDesk, setSound, soundOn, type DeskSound } from "./desk-sound";
import { META } from "./meta";

/* The Play section: every idea's game, one tap away. Picture = the game's own first screen. */
const SOUND: Record<string, DeskSound> = {
  nostalgia: "dialup", "skill-quest": "snap", weekline: "tear", restitch: "snip",
  "planner-book": "page", scrolll: "coin", "habit-game": "punch", loop: "keys",
};
const ORDER = ["nostalgia", "skill-quest", "weekline", "restitch", "planner-book", "scrolll", "habit-game", "loop"];

export default function PlayGrid() {
  const [lifted, setLifted] = useState<string | null>(null);
  const [sound, setSoundState] = useState(soundOn());
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const onShow = () => setLifted(null);
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  function open(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const m = META[id];
    playDesk(SOUND[id]);
    if (m.external || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setLifted(id);
    window.setTimeout(() => window.location.assign(m.play), reduce ? 40 : 360);
  }

  return (
    <>
      <ul className="play-grid">
        {ORDER.filter((id) => data.projects.some((p) => p.id === id)).map((id) => {
          const m = META[id];
          return (
            <li key={id}>
              <a
                className={`play-tile${lifted === id ? " is-lifted" : ""}`}
                href={m.play}
                target={m.external ? "_blank" : undefined}
                rel={m.external ? "noopener" : undefined}
                onClick={(e) => open(e, id)}
              >
                <img src={m.pic} alt="" width={600} height={640} loading="lazy" decoding="async" />
                <span className="play-name">{m.name}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className="play-sound"
        aria-pressed={!sound}
        onClick={() => {
          setSound(!sound);
          setSoundState(!sound);
        }}
      >
        {sound ? "Sound on" : "Muted"}
      </button>
    </>
  );
}
