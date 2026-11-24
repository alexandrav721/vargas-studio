/* Desk sounds: one short, original sound per object, synthesized with Web Audio (no files, no license).
   Nothing plays before a tap; the Sound on / Muted choice is remembered. */

const KEY = "vs.sound";
let on = true;
try {
  on = localStorage.getItem(KEY) !== "off";
} catch {
  /* default on */
}

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;

function audio(): AudioContext | null {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(comp);
    comp.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noise(c: AudioContext) {
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate * 0.5, c.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const s = c.createBufferSource();
  s.buffer = noiseBuf;
  return s;
}

function env(g: GainNode, t: number, peak: number, a: number, d: number) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
}

function tone(c: AudioContext, t: number, f: number, peak: number, d: number, type: OscillatorType = "sine", f2?: number) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
  env(g, t, peak, 0.004, d);
  o.connect(g);
  g.connect(master!);
  o.start(t);
  o.stop(t + d + 0.05);
}

function hiss(c: AudioContext, t: number, dur: number, f0: number, f1: number, peak: number, q = 1.2) {
  const s = noise(c);
  const bp = c.createBiquadFilter();
  const g = c.createGain();
  bp.type = "bandpass";
  bp.Q.value = q;
  bp.frequency.setValueAtTime(f0, t);
  bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
  env(g, t, peak, Math.min(0.01, dur / 4), dur);
  s.connect(bp);
  bp.connect(g);
  g.connect(master!);
  s.start(t);
  s.stop(t + dur + 0.05);
}

export type DeskSound = "dialup" | "tear" | "snap" | "coin" | "punch" | "snip" | "page" | "keys";

const SOUNDS: Record<DeskSound, (c: AudioContext, t: number) => void> = {
  // an old modem handshake, very short
  dialup: (c, t) => {
    tone(c, t, 1200, 0.18, 0.07, "square");
    tone(c, t + 0.08, 2100, 0.14, 0.07, "square");
    hiss(c, t + 0.16, 0.16, 2400, 1800, 0.18, 0.7);
  },
  // a flyer tab torn off
  tear: (c, t) => {
    for (let i = 0; i < 5; i++) hiss(c, t + i * 0.035, 0.03, 3800 - i * 300, 2600, 0.2, 3);
  },
  // a card snapped down + rising two notes (AI Made EZ's signature)
  snap: (c, t) => {
    hiss(c, t, 0.04, 3200, 2200, 0.4, 0.8);
    tone(c, t, 140, 0.5, 0.15, "sine", 60);
    tone(c, t + 0.09, 523.25, 0.3, 0.45);
    tone(c, t + 0.21, 783.99, 0.32, 0.6);
  },
  // a velvet-rope clink and a coin
  coin: (c, t) => {
    tone(c, t, 1568, 0.22, 0.25);
    tone(c, t + 0.07, 2093, 0.2, 0.4);
  },
  // a ticket punch
  punch: (c, t) => {
    tone(c, t, 180, 0.45, 0.08, "sine", 90);
    hiss(c, t, 0.03, 5000, 3000, 0.25, 2);
  },
  // scissors: two quick snips
  snip: (c, t) => {
    hiss(c, t, 0.05, 6000, 3500, 0.25, 4);
    hiss(c, t + 0.11, 0.05, 6000, 3500, 0.25, 4);
  },
  // a page turned
  page: (c, t) => {
    hiss(c, t, 0.22, 900, 4200, 0.2, 0.8);
  },
  // keys on a ring
  keys: (c, t) => {
    [3150, 4410, 3720, 5200].forEach((f, i) => tone(c, t + i * 0.045, f, 0.08, 0.18, "triangle"));
  },
};

export function playDesk(name: DeskSound) {
  if (!on) return;
  try {
    const c = audio();
    if (!c || !master) return;
    SOUNDS[name](c, c.currentTime + 0.02);
  } catch {
    /* sound is a bonus, never a blocker */
  }
}

export function soundOn() {
  return on;
}

export function setSound(v: boolean) {
  on = v;
  try {
    localStorage.setItem(KEY, v ? "on" : "off");
  } catch {
    /* this visit only */
  }
  if (master) master.gain.value = v ? 0.5 : 0;
}
