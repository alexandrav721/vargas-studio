/* Scrollback poster: "Your Year at 15", drawn on a canvas in an original design.
 * Type, era colours and simple generic shapes only. Item names are plain text.
 * No logos, no product photos, no web screenshots, no brand-styled lettering.
 * Drawn in a 1200 × 1800 unit space (2:3, 12 × 18 in) and scaled, so the preview
 * and the 3600 × 5400 print file are the same picture. Pure canvas: no DOM reads. */

export const LOOK = {
  dialup: { bg0: "#0a0a0a", bg1: "#141220", ink: "#f4f0e6", muted: "#b7ae9a", brand: "#b8ff00", brand2: "#ff00aa", motif: "dial" },
  y2k: { bg0: "#061018", bg1: "#0e2a3c", ink: "#eef7ff", muted: "#9eb6d4", brand: "#7fdbff", brand2: "#ff69b4", motif: "rings" },
  myspace: { bg0: "#14010c", bg1: "#3a0a24", ink: "#fff2fa", muted: "#e8b8d8", brand: "#ff1493", brand2: "#ffd700", motif: "pixels" },
  tumblr: { bg0: "#0d0d0d", bg1: "#1a1416", ink: "#f0ebe6", muted: "#c4a4a4", brand: "#ff2d95", brand2: "#c8ff00", motif: "lights" },
  story: { bg0: "#16110f", bg1: "#2a1f1d", ink: "#fbf3ee", muted: "#d6c1b8", brand: "#f7cac9", brand2: "#92a8d1", motif: "frame" },
};

export const UNIT_W = 1200;
export const UNIT_H = 1800;
const M = 96; // safe margin: 0.96 in at print size
const DISPLAY = "Syne, 'Arial Narrow', sans-serif";
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const BODY = "'IBM Plex Sans', 'Segoe UI', sans-serif";

/** Same seed, same pattern: the poster for 2004 always looks the same. */
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

function fit(g, text, maxW, start, weight, family, min = 20) {
  let size = start;
  g.font = `${weight} ${size}px ${family}`;
  while (g.measureText(text).width > maxW && size > min) {
    size -= 2;
    g.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

function clip(g, text, maxW) {
  let t = text;
  if (g.measureText(t).width <= maxW) return t;
  while (t.length > 3 && g.measureText(`${t}…`).width > maxW) t = t.slice(0, -1).trimEnd();
  return `${t}…`;
}

/* ---------- era motifs: generic shapes, drawn here ---------- */

function motif(g, look, year) {
  const r = rng(year * 7919);
  g.save();
  if (look.motif === "dial") {
    // modem lines: a band of wavering signal lines behind the year
    g.lineWidth = 3;
    for (let k = 0; k < 9; k += 1) {
      g.strokeStyle = k % 3 === 0 ? look.brand2 : look.brand;
      g.globalAlpha = 0.18 + (k % 3) * 0.06;
      g.beginPath();
      const base = 250 + k * 26;
      const freq = 0.012 + r() * 0.03;
      const amp = 6 + r() * 22;
      for (let x = 0; x <= UNIT_W; x += 6) {
        const y = base + Math.sin(x * freq + k) * amp * (0.4 + 0.6 * Math.sin(x * 0.004 + k));
        if (x === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    }
    // scanlines
    g.globalAlpha = 0.16;
    g.fillStyle = "#000";
    for (let y = 0; y < UNIT_H; y += 6) g.fillRect(0, y, UNIT_W, 2);
  } else if (look.motif === "rings") {
    // translucent bubbles and rings off the top right
    g.globalAlpha = 0.22;
    g.fillStyle = look.brand2;
    g.beginPath();
    g.arc(980, 330, 210, 0, Math.PI * 2);
    g.fill();
    g.globalAlpha = 0.5;
    g.strokeStyle = look.brand;
    for (let k = 0; k < 7; k += 1) {
      g.lineWidth = 2 + (k % 2) * 2;
      g.beginPath();
      g.arc(1020, 300, 120 + k * 46, 0, Math.PI * 2);
      g.stroke();
    }
    g.globalAlpha = 0.35;
    g.fillStyle = look.ink;
    for (let k = 0; k < 14; k += 1) {
      g.beginPath();
      g.arc(640 + r() * 560, 80 + r() * 520, 4 + r() * 14, 0, Math.PI * 2);
      g.fill();
    }
  } else if (look.motif === "pixels") {
    // a pixel grid that dissolves to the left, plus four-point sparkles
    const cell = 30;
    for (let cx = 0; cx < 18; cx += 1) {
      for (let cy = 0; cy < 12; cy += 1) {
        const chance = (cx / 18) * 0.9 * (1 - cy / 14);
        if (r() > chance) continue;
        g.globalAlpha = 0.18 + r() * 0.3;
        g.fillStyle = r() > 0.8 ? look.brand2 : look.brand;
        g.fillRect(UNIT_W - 18 * cell + cx * cell, 60 + cy * cell, cell - 4, cell - 4);
      }
    }
    g.fillStyle = look.brand2;
    for (let k = 0; k < 7; k += 1) {
      const x = 600 + r() * 520;
      const y = 70 + r() * 320;
      const s = 8 + r() * 18;
      g.globalAlpha = 0.55;
      g.beginPath();
      g.moveTo(x, y - s);
      g.quadraticCurveTo(x, y, x + s, y);
      g.quadraticCurveTo(x, y, x, y + s);
      g.quadraticCurveTo(x, y, x - s, y);
      g.quadraticCurveTo(x, y, x, y - s);
      g.fill();
    }
  } else if (look.motif === "lights") {
    // dashboard lights: a row of round indicators, some lit
    const n = 9;
    for (let k = 0; k < n; k += 1) {
      const x = M + 18 + k * ((UNIT_W - 2 * M - 36) / (n - 1));
      const lit = r() > 0.45;
      g.globalAlpha = lit ? 0.9 : 0.25;
      g.fillStyle = lit ? (k % 4 === 0 ? look.brand2 : look.brand) : look.muted;
      g.beginPath();
      g.arc(x, 62, 13, 0, Math.PI * 2);
      g.fill();
    }
    // stacked post rules, like a feed seen from far away
    g.globalAlpha = 0.12;
    g.fillStyle = look.ink;
    for (let k = 0; k < 6; k += 1) g.fillRect(UNIT_W - 330, 250 + k * 70, 230 - (k % 3) * 50, 16);
  } else if (look.motif === "frame") {
    // a front-camera frame: corner brackets and a lens dot
    g.globalAlpha = 0.7;
    g.strokeStyle = look.brand;
    g.lineWidth = 5;
    const x0 = 52;
    const y0 = 52;
    const x1 = UNIT_W - 52;
    const y1 = UNIT_H - 52;
    const L = 90;
    [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]].forEach(([x, y, dx, dy]) => {
      g.beginPath();
      g.moveTo(x + dx * L, y);
      g.lineTo(x + dx * 18, y);
      g.quadraticCurveTo(x, y, x, y + dy * 18);
      g.lineTo(x, y + dy * L);
      g.stroke();
    });
    g.globalAlpha = 0.9;
    g.fillStyle = look.brand2;
    g.beginPath();
    g.arc(UNIT_W / 2, 74, 12, 0, Math.PI * 2);
    g.fill();
    g.globalAlpha = 0.2;
    g.fillStyle = look.brand;
    g.beginPath();
    g.arc(980, 380, 240, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}

/**
 * Draw the poster on a canvas of any size with a 2:3 ratio.
 * d: { mode: "solo"|"group", year, era, label, persona, tag, listLabel, items: [text],
 *      away, people: [{ name, persona }], groupLine }
 */
export function drawPoster(canvas, d) {
  const g = canvas.getContext("2d");
  if (!g) return false;
  const S = canvas.width / UNIT_W;
  const look = LOOK[d.era] || LOOK.dialup;
  g.setTransform(S, 0, 0, S, 0, 0);
  g.textBaseline = "alphabetic";
  g.textAlign = "left";

  const grad = g.createLinearGradient(0, 0, 0, UNIT_H);
  grad.addColorStop(0, look.bg1);
  grad.addColorStop(1, look.bg0);
  g.fillStyle = grad;
  g.fillRect(0, 0, UNIT_W, UNIT_H);
  motif(g, look, d.year);

  const W = UNIT_W - 2 * M;
  let y = M + 40;

  // small label, then the big year with a flat offset print in the second colour
  g.fillStyle = look.brand;
  g.font = `500 32px ${MONO}`;
  g.fillText(d.label, M, y);
  const ys = fit(g, String(d.year), W, 470, 800, DISPLAY);
  y += ys * 0.74 + 34;
  g.font = `800 ${ys}px ${DISPLAY}`;
  g.fillStyle = look.brand2;
  g.fillText(String(d.year), M + 12, y + 12);
  g.fillStyle = look.ink;
  g.fillText(String(d.year), M, y);

  if (d.mode === "group") {
    if (d.groupLine) {
      const s = fit(g, d.groupLine, W, 64, 800, DISPLAY);
      y += s + 46;
      g.fillStyle = look.brand;
      g.font = `800 ${s}px ${DISPLAY}`;
      g.fillText(d.groupLine, M, y);
    }
  } else if (d.persona) {
    const types = ["Early Adopter", "Collector", "Trendsetter", "Mixtape Maker", "Main Character"];
    const type = types.find((t) => d.persona.endsWith(t)) || "";
    const l1 = d.persona.slice(0, d.persona.length - type.length).trim();
    const lines = type && l1 ? [l1, type] : [d.persona];
    const s = Math.min(...lines.map((t) => fit(g, t, W, 118, 800, DISPLAY)));
    g.fillStyle = look.brand;
    g.font = `800 ${s}px ${DISPLAY}`;
    y += 36;
    lines.forEach((t) => {
      y += s * 0.98;
      g.fillText(t, M, y);
    });
    if (d.tag) {
      const t = fit(g, d.tag, W, 50, "italic 500", BODY);
      y += t + 22;
      g.fillStyle = look.ink;
      g.font = `italic 500 ${t}px ${BODY}`;
      g.fillText(d.tag, M, y);
    }
  } else if (d.eraName) {
    y += 90;
    g.fillStyle = look.brand;
    g.font = `800 ${fit(g, d.eraName, W, 96, 800, DISPLAY)}px ${DISPLAY}`;
    g.fillText(d.eraName, M, y);
  }

  // footer first, so the lists know where to stop
  const footY = UNIT_H - M;
  g.fillStyle = look.brand;
  g.font = `800 40px ${DISPLAY}`;
  g.fillText("Scrollback", M, footY);
  g.fillStyle = look.muted;
  g.font = `500 21px ${MONO}`;
  g.textAlign = "right";
  g.fillText("Not affiliated with any brand named.", UNIT_W - M, footY - 2);
  g.textAlign = "left";

  let bottom = footY - 74;
  const away = String(d.away || "").trim();
  if (away) {
    const line = `away msg: “${away}”`;
    const s = fit(g, line, W, 42, "italic 500", BODY, 24);
    g.fillStyle = look.ink;
    g.font = `italic 500 ${s}px ${BODY}`;
    g.fillText(clip(g, line, W), M, bottom);
    bottom -= s + 46;
  }

  // a rule, then the list(s)
  y += 58;
  g.globalAlpha = 0.35;
  g.fillStyle = look.ink;
  g.fillRect(M, y, W, 3);
  g.globalAlpha = 1;
  y += 62;

  const list = (label, rows, rowH, draw) => {
    if (!rows.length || y + rowH > bottom) return;
    g.fillStyle = look.muted;
    g.font = `500 28px ${MONO}`;
    g.fillText(label, M, y);
    y += 22;
    const room = Math.floor((bottom - y) / rowH);
    const shown = rows.length > room ? rows.slice(0, Math.max(0, room - 1)) : rows;
    shown.forEach((row, k) => {
      y += rowH;
      draw(row, k);
    });
    if (shown.length < rows.length) {
      y += rowH;
      g.fillStyle = look.brand;
      g.font = `500 34px ${MONO}`;
      g.fillText(`+${rows.length - shown.length} more`, M, y);
    }
    y += 84;
  };

  const thing = (rowH) => (name, k) => {
    const n = String(k + 1).padStart(2, "0");
    g.fillStyle = look.brand;
    g.font = `500 ${Math.round(rowH * 0.62)}px ${MONO}`;
    g.fillText(n, M, y);
    const x = M + g.measureText("00 ").width + 8;
    g.fillStyle = look.ink;
    const s = fit(g, name, UNIT_W - M - x, Math.round(rowH * 0.66), 500, MONO, 22);
    g.font = `500 ${s}px ${MONO}`;
    g.fillText(clip(g, name, UNIT_W - M - x), x, y);
  };

  if (d.mode === "group") {
    const people = d.people || [];
    const ph = people.length > 6 ? 50 : 68;
    list("Who", people, ph, (p) => {
      g.fillStyle = look.ink;
      g.font = `800 ${Math.round(ph * 0.64)}px ${DISPLAY}`;
      const nm = clip(g, p.name, 300);
      g.fillText(nm, M, y);
      g.fillStyle = look.muted;
      const x = M + 320;
      const s = fit(g, p.persona, UNIT_W - M - x, Math.round(ph * 0.5), 500, MONO, 18);
      g.font = `500 ${s}px ${MONO}`;
      g.fillText(clip(g, p.persona, UNIT_W - M - x), x, y);
    });
    const items = d.items || [];
    const ih = Math.round(Math.max(48, Math.min(72, (bottom - y - 110) / Math.max(items.length, 6))));
    list(d.listLabel, items, ih, thing(ih));
  } else {
    // few things: bigger rows, so the list fills the poster
    const items = d.items || [];
    const rh = Math.round(Math.max(56, Math.min(84, (bottom - y - 80) / Math.max(items.length, 6))));
    list(d.listLabel, items, rh, thing(rh));
    if (!items.length && d.hint) {
      g.fillStyle = look.muted;
      g.font = `500 34px ${MONO}`;
      g.fillText(d.hint, M, y + 10);
    }
  }
  return true;
}
