import { useEffect, useRef, useState } from "react";
import "./lightbox.css";

/* A big picture viewer: swipe, scroll or use the arrows to move through every piece,
   "Open it ↗" goes to the live page, Esc or ✕ closes. */
export type Shot = { src: string; label: string; url: string };

export default function Lightbox({ title, shots, start, onClose }: { title: string; shots: Shot[]; start: number; onClose: () => void }) {
  const track = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [i, setI] = useState(start);

  const go = (n: number, smooth = true) => {
    const k = Math.max(0, Math.min(shots.length - 1, n));
    const el = track.current?.children[k] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: smooth ? "smooth" : ("instant" as ScrollBehavior), inline: "center", block: "nearest" });
    setI(k);
  };

  // open on the tapped picture, focus the close button, stop the page behind from scrolling
  useEffect(() => {
    go(start, false);
    closeBtn.current?.focus({ preventScroll: true });
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keys belong to the viewer while it's open (the tour behind uses arrows too)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const handled = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Escape", " ", "PageUp", "PageDown", "Home", "End"];
      if (!handled.includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") go(i + 1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") go(i - 1);
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(shots.length - 1);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  });

  // keep the counter right when someone swipes or scrolls
  useEffect(() => {
    const root = track.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setI(Number((e.target as HTMLElement).dataset.k));
      },
      { root, threshold: 0.6 },
    );
    Array.from(root.children).forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  const shot = shots[i];
  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={`${title}: pictures`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="lb-top">
        <p className="lb-title">
          {title} <span>· {i + 1} of {shots.length}</span>
        </p>
        <button ref={closeBtn} type="button" className="lb-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <div className="lb-track" ref={track}>
        {shots.map((s, k) => (
          <figure key={s.src} className="lb-slide" data-k={k}>
            <img src={s.src} alt={`${title}: ${s.label}`} decoding="async" />
          </figure>
        ))}
      </div>

      <div className="lb-bottom">
        <button type="button" className="lb-step" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Previous picture">
          ←
        </button>
        <p className="lb-label" aria-live="polite">
          {shot.label}
          <a href={shot.url} target="_blank" rel="noreferrer">
            Open it ↗
          </a>
        </p>
        <button type="button" className="lb-step" onClick={() => go(i + 1)} disabled={i === shots.length - 1} aria-label="Next picture">
          →
        </button>
      </div>
    </div>
  );
}
