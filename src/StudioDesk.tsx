import { useEffect, useState } from "react";
import { playDesk, setSound, soundOn, type DeskSound } from "./desk-sound";

/* The studio desk: every object is one of Alexandra's ideas, and tapping it opens that idea's
   60-second game. Pictures are the games' own first screens (public/desk/). */

type Thing = {
  id: string;
  name: string;
  ask: string;
  href: string;
  sound: DeskSound;
  kind: "polaroid" | "card" | "flyer" | "taped" | "phone";
  r: number; // resting tilt, degrees
};

const THINGS: Thing[] = [
  { id: "nostalgia", name: "Scrollback", ask: "What year were you 15?", href: "/projects/nostalgia/play.html", sound: "dialup", kind: "polaroid", r: -3 },
  { id: "skill-quest", name: "Skill Quest", ask: "Can you spot the skill?", href: "/projects/skill-quest/play.html", sound: "snap", kind: "card", r: 2.5 },
  { id: "weekline", name: "Weekline", ask: "Which side of the river?", href: "/projects/weekline/play.html", sound: "tear", kind: "flyer", r: 1.5 },
  { id: "restitch", name: "Restitch", ask: "What did you find?", href: "/projects/restitch/play.html", sound: "snip", kind: "taped", r: -2 },
  { id: "planner", name: "Planners", ask: "Which planner are you?", href: "/projects/planner/play.html", sound: "page", kind: "polaroid", r: 2 },
  { id: "scrolll", name: "Get Paid to Scroll", ask: "What's one look at you worth?", href: "/projects/scrolll/play.html", sound: "coin", kind: "card", r: -2.5 },
  { id: "lumen", name: "Lumen", ask: "What's in your way lately?", href: "/projects/lumen/play.html", sound: "punch", kind: "taped", r: 3 },
  { id: "loop", name: "Loop", ask: "Borrow it from a friend first", href: "https://celebrateloop.com", sound: "keys", kind: "phone", r: -1.5 },
];

const PLAYED = "vs.played";
function readPlayed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(PLAYED) || "[]");
  } catch {
    return [];
  }
}

export default function StudioDesk() {
  const [played, setPlayed] = useState<string[]>(readPlayed);
  const [lifted, setLifted] = useState<string | null>(null);
  const [sound, setSoundState] = useState(soundOn());

  useEffect(() => {
    document.title = "Vargas Studio · Ideas you can play";
    // coming back from a game: refresh the stickers
    const onShow = () => {
      setPlayed(readPlayed());
      setLifted(null);
    };
    window.addEventListener("pageshow", onShow);
    return () => {
      window.removeEventListener("pageshow", onShow);
      document.title = "Vargas Studio — Alexandra Vargas";
    };
  }, []);

  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const next = THINGS.find((t) => !played.includes(t.id));

  function open(e: React.MouseEvent<HTMLAnchorElement>, t: Thing) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // new tab: let the browser do it
    e.preventDefault();
    playDesk(t.sound);
    setLifted(t.id);
    const list = Array.from(new Set([...readPlayed(), t.id]));
    try {
      localStorage.setItem(PLAYED, JSON.stringify(list));
    } catch {
      /* this visit only */
    }
    window.setTimeout(() => window.location.assign(t.href), reduce ? 60 : 420);
  }

  return (
    <div className="desk-page">
      <div className="desk-lamp" aria-hidden="true" />
      <button
        className="desk-sound"
        type="button"
        aria-pressed={!sound}
        onClick={() => {
          setSound(!sound);
          setSoundState(!sound);
        }}
      >
        {sound ? "Sound on" : "Muted"}
      </button>

      <header className="desk-head">
        <p className="desk-kicker">Alexandra Vargas</p>
        <h1 className="desk-title">Ideas you can play.</h1>
        <p className="desk-hint">
          {played.length > 0 ? `${Math.min(played.length, THINGS.length)} of ${THINGS.length} played` : "Tap anything."}
        </p>
      </header>

      <main>
        <ul className="desk" aria-label="Ideas to play">
          {THINGS.map((t, i) => {
            const isPlayed = played.includes(t.id);
            return (
              <li key={t.id} className="desk-spot" style={{ ["--r" as string]: `${t.r}deg`, ["--i" as string]: i }}>
                <a
                  href={t.href}
                  className={`thing thing--${t.kind}${lifted === t.id ? " is-lifted" : ""}${next?.id === t.id && played.length > 0 ? " is-next" : ""}`}
                  aria-label={`${t.name}: ${t.ask}${isPlayed ? " (played)" : ""}`}
                  onClick={(e) => open(e, t)}
                >
                  <img src={`/desk/${t.id}.jpg`} alt="" width={600} height={640} loading={i < 4 ? "eager" : "lazy"} decoding="async" />
                  {isPlayed && (
                    <span className="thing-sticker" aria-hidden="true">
                      Played
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </main>

      <footer className="desk-foot">
        <a className="desk-deeper" href="#/work">
          How I build them →
        </a>
        <p className="desk-credit">Thrift photos: Wikimedia Commons</p>
      </footer>
    </div>
  );
}
