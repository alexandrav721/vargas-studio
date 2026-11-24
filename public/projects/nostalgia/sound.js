/* Scrollback sounds: all synthesized here with Web Audio (no recordings, no samples).
   Nothing plays until the player taps (the audio context is made on the first tap).
   One toggle mutes sound and the buzz together, and it is remembered. */

const MUTE_KEY = "scrollback.mute.v1";
let muted = false;
try { muted = localStorage.getItem(MUTE_KEY) === "1"; } catch { /* private mode: this visit only */ }

let ctx = null;
let master = null;

function audio() {
  if (muted) return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, start, dur, { type = "sine", vol = 0.2, attack = 0.005, to = null } = {}) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + start;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(start, dur, { vol = 0.1, freq = 2000, q = 1, type = "bandpass", sweepTo = null } = {}) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + start;
  const len = Math.max(1, Math.floor(a.sampleRate * dur));
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i += 1) d[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter();
  f.type = type;
  f.frequency.setValueAtTime(freq, t);
  if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
  f.Q.value = q;
  const g = a.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t);
  src.stop(t + dur + 0.02);
}

/* ~1.6 s modem moment: a few keypad tones, a steady answer tone, then a warbling handshake. */
export function dialUp() {
  if (!audio()) return;
  const keys = [[697, 1336], [770, 1209], [852, 1477], [697, 1209], [941, 1336]];
  keys.forEach(([lo, hi], k) => {
    tone(lo, k * 0.11, 0.08, { vol: 0.06 });
    tone(hi, k * 0.11, 0.08, { vol: 0.06 });
  });
  tone(2100, 0.62, 0.32, { vol: 0.05 });
  for (let k = 0; k < 6; k += 1) tone(1200 + (k % 2) * 1000, 0.98 + k * 0.07, 0.07, { type: "square", vol: 0.025 });
  noise(0.98, 0.55, { vol: 0.07, freq: 1800, q: 3, sweepTo: 3200 });
}

/* Nope: a soft dry click, like a mouse button. */
export function click() {
  noise(0, 0.035, { vol: 0.25, freq: 3500, q: 0.8, type: "highpass" });
  tone(180, 0, 0.04, { type: "triangle", vol: 0.06 });
}

/* Wanted it: a small rising blip. */
export function blip() {
  tone(520, 0, 0.12, { type: "triangle", vol: 0.12, to: 780 });
}

/* Had it: a bright two-note chime, and a short buzz on phones that support it (Android). */
export function chime() {
  tone(1318.5, 0, 0.35, { vol: 0.14 });
  tone(1975.5, 0.07, 0.5, { vol: 0.1 });
  tone(2637, 0.07, 0.25, { vol: 0.03 });
  buzz(28);
}

/* The reveal: a tiny four-note fanfare. */
export function fanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, k) => tone(f, k * 0.11, k === 3 ? 0.7 : 0.16, { type: "triangle", vol: 0.13 }));
  tone(1318.5, 0.33, 0.6, { vol: 0.05 });
  buzz([20, 60, 20, 60, 40]);
}

export function buzz(pattern) {
  if (muted) return;
  try { navigator.vibrate?.(pattern); } catch { /* not supported (iOS) */ }
}

export function isMuted() {
  return muted;
}

export function setMuted(next) {
  muted = Boolean(next);
  try { localStorage.setItem(MUTE_KEY, muted ? "1" : "0"); } catch { /* this visit only */ }
  if (muted && ctx) ctx.suspend().catch(() => {});
}

/* Wire a button: aria-pressed="true" means sound is on. */
export function bindMute(btn) {
  if (!btn) return;
  const paint = () => {
    btn.setAttribute("aria-pressed", muted ? "false" : "true");
    btn.setAttribute("aria-label", muted ? "Sound off. Turn sound on" : "Sound on. Turn sound off");
    btn.dataset.muted = muted ? "1" : "0";
  };
  paint();
  btn.addEventListener("click", () => {
    setMuted(!muted);
    paint();
    if (!muted) click();
  });
}
