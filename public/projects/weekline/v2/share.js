// Weekline v2: the two posters people post. Drawn on canvas, nothing leaves the device until they tap Share.
const SERIF = '"Bodoni Moda", Didot, serif';
const SANS = '"Jost", Futura, sans-serif';
const SUN = "#EFA937";

export async function fontsReady() {
  try {
    await Promise.all([
      document.fonts.load(`italic 400 200px ${SERIF}`), document.fonts.load(`400 60px ${SERIF}`),
      document.fonts.load(`700 80px ${SERIF}`), document.fonts.load(`400 40px ${SANS}`), document.fonts.load(`500 40px ${SANS}`),
    ]);
  } catch (e) { /* draw with fallbacks */ }
}
export function loadImage(src) {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img); img.onerror = () => res(null);
    img.src = src;
  });
}
function cover(ctx, img, x, y, w, h, px = 0.5, py = 0.5) {
  if (!img) return;
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = w / s, sh = h / s;
  const sx = (img.naturalWidth - sw) * px, sy = (img.naturalHeight - sh) * py;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}
function spacing(ctx, px) { if ("letterSpacing" in ctx) ctx.letterSpacing = px + "px"; }
function fit(ctx, text, max) {
  if (ctx.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + "…").width > max) t = t.slice(0, -1);
  return t.trimEnd() + "…";
}
function wordmark(ctx, x, y, size) {
  ctx.font = `400 ${size}px ${SERIF}`; spacing(ctx, -size * 0.01); ctx.fillStyle = "#fff"; ctx.textAlign = "left";
  ctx.fillText("Weekline", x, y);
  const w = ctx.measureText("Weekline").width;
  ctx.fillStyle = SUN; ctx.beginPath(); ctx.arc(x + w + size * 0.22, y - size * 0.22, size * 0.16, 0, Math.PI * 2); ctx.fill();
}
function sampleTag(ctx, right, y, size) {
  ctx.font = `400 ${size}px ${SANS}`; spacing(ctx, size * 0.14); ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.textAlign = "right";
  ctx.fillText("SAMPLE", right, y); ctx.textAlign = "left";
}

/* 1080 × 1920 "My week" story */
export function drawStory(cv, d) {
  cv.width = 1080; cv.height = 1920;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#120D09"; ctx.fillRect(0, 0, 1080, 1920);
  const PH = 1056;
  cover(ctx, d.img, 0, 0, 1080, PH, d.own ? 0.5 : 0.58, 0.5);
  const g = ctx.createLinearGradient(0, 0, 0, PH);
  g.addColorStop(0, "rgba(18,13,9,.55)"); g.addColorStop(0.16, "rgba(18,13,9,0)"); g.addColorStop(0.55, "rgba(18,13,9,0)");
  g.addColorStop(0.8, "rgba(18,13,9,.78)"); g.addColorStop(1, "#120D09");
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, PH + 2);

  wordmark(ctx, 60, 110, 56);
  if (d.sample) sampleTag(ctx, 1020, 104, 30);

  ctx.fillStyle = "#fff"; ctx.font = `italic 400 222px ${SERIF}`; spacing(ctx, -7.5);
  ctx.fillText(d.title || "My week", 50, 952);
  ctx.font = `400 36px ${SANS}`; spacing(ctx, 5.8); ctx.fillStyle = "rgba(255,255,255,.92)";
  ctx.fillText(fit(ctx, d.subline.toUpperCase(), 960), 62, 1064);

  let y = 1110;
  const rows = d.rows.slice(0, 6);
  for (const r of rows) {
    ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(60, y, 960, 2);
    ctx.font = `italic 400 52px ${SERIF}`; spacing(ctx, -0.5); ctx.fillStyle = SUN; ctx.fillText(r.day, 60, y + 64);
    if (r.free) {
      ctx.font = `italic 400 47px ${SERIF}`; ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.fillText(fit(ctx, r.title, 840), 196, y + 62);
    } else {
      ctx.font = `400 42px ${SANS}`; spacing(ctx, 0); ctx.fillStyle = "#fff";
      const t = fit(ctx, r.title, r.with ? 620 : 820);
      ctx.fillText(t, 196, y + 62);
      if (r.with) {
        const w = ctx.measureText(t).width;
        ctx.font = `400 36px ${SANS}`; ctx.fillStyle = "rgba(255,255,255,.72)";
        ctx.fillText(fit(ctx, " with " + r.with, 820 - w), 196 + w, y + 62);
      }
    }
    y += 92;
  }
  if (!rows.length) {
    ctx.font = `italic 400 52px ${SERIF}`; ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fillText("A week kept open, on purpose.", 60, y + 70);
  }

  const by = 1700;
  ctx.fillStyle = "rgba(255,255,255,.32)"; ctx.fillRect(60, by, 960, 2);
  ctx.font = `400 42px ${SERIF}`; spacing(ctx, 0); ctx.fillStyle = "#fff"; ctx.textAlign = "left";
  ctx.fillText("Starring you,", 60, by + 62);
  if (d.friends && d.friends.length) {
    const names = d.friends.slice(0, 3);
    let x = 60; ctx.fillText("with ", x, by + 114); x += ctx.measureText("with ").width;
    names.forEach((n, i) => {
      ctx.font = `italic 400 42px ${SERIF}`; ctx.fillStyle = SUN; ctx.fillText(n, x, by + 114); x += ctx.measureText(n).width;
      ctx.font = `400 42px ${SERIF}`; ctx.fillStyle = "#fff";
      const sep = i === names.length - 1 ? "" : i === names.length - 2 ? " and " : ", ";
      ctx.fillText(sep, x, by + 114); x += ctx.measureText(sep).width;
    });
  } else {
    ctx.fillText("and this city.", 60, by + 114);
  }
  ctx.textAlign = "right"; ctx.font = `400 31px ${SANS}`; spacing(ctx, 4.3); ctx.fillStyle = "rgba(255,255,255,.82)";
  if (d.score) ctx.fillText(d.score.toUpperCase(), 1020, by + 60);
  ctx.fillText("MADE WITH WEEKLINE", 1020, by + 108);
  ctx.textAlign = "left"; spacing(ctx, 0);
  if (d.credit) { ctx.font = `400 26px ${SANS}`; ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fillText(fit(ctx, "Photo: " + d.credit, 960), 60, 1876); }
}

/* 1080 × 1350 month recap */
export function drawRecap(cv, d) {
  cv.width = 1080; cv.height = 1350;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#16120E"; ctx.fillRect(0, 0, 1080, 1350);
  const PH = 640;
  cover(ctx, d.img, 0, 0, 1080, PH, d.own ? 0.5 : 0.72, 0.4);
  const g = ctx.createLinearGradient(0, 0, 0, PH);
  g.addColorStop(0, "rgba(22,18,14,.45)"); g.addColorStop(0.35, "rgba(22,18,14,0)"); g.addColorStop(0.58, "rgba(22,18,14,.05)"); g.addColorStop(1, "#16120E");
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, PH + 2);
  wordmark(ctx, 54, 92, 50);
  if (d.sample) sampleTag(ctx, 1026, 88, 28);

  ctx.fillStyle = "#fff"; ctx.font = `italic 400 228px ${SERIF}`; spacing(ctx, -9);
  ctx.fillText(fit(ctx, d.month, 1000), 44, 640);

  // rich line: gold bold numbers inside a serif sentence, wrapped
  spacing(ctx, -1.2);
  const parts = d.line; // [{t, n?}]
  const words = [];
  parts.forEach((p) => String(p.t).split(/(\s+)/).forEach((w) => { if (w) words.push({ w, n: !!p.n }); }));
  let x = 54, y = 760; const max = 1026, lh = 88;
  for (const t of words) {
    ctx.font = t.n ? `700 81px ${SERIF}` : `400 81px ${SERIF}`;
    const w = ctx.measureText(t.w).width;
    if (/^\s+$/.test(t.w)) { if (x > 54) x += w; continue; }
    if (x + w > max && x > 54) { x = 54; y += lh; }
    ctx.fillStyle = t.n ? SUN : "#F4EEE5"; ctx.fillText(t.w, x, y); x += w;
  }

  // one column per day of the month
  const top = 1040, H = 150, L = 54, W = 972, n = d.days.length;
  const cw = W / n;
  ctx.fillStyle = "rgba(244,238,229,.28)"; ctx.fillRect(L, top + H, W, 2);
  d.days.forEach((day, i) => {
    const cx = L + cw * i + cw / 2;
    let base = top + H - 8;
    if (day.run) { ctx.fillStyle = "#F4EEE5"; ctx.beginPath(); ctx.arc(cx, base - 6, 8, 0, Math.PI * 2); ctx.fill(); base -= 24; }
    if (day.night) { ctx.fillStyle = SUN; ctx.fillRect(cx - cw * 0.36, base - 90, cw * 0.72, 90); base -= 98; }
    if (day.cls) { ctx.strokeStyle = SUN; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, base - 10, 10, 0, Math.PI * 2); ctx.stroke(); base -= 28; }
    if (!day.run && !day.night && !day.cls) { ctx.fillStyle = "rgba(244,238,229,.3)"; ctx.fillRect(cx - 1, top + H - 18, 2, 18); }
  });
  ctx.font = `400 30px ${SANS}`; spacing(ctx, 0); ctx.fillStyle = "rgba(244,238,229,.72)";
  [1, 8, 15, 22, n].forEach((dd) => { const cx = L + cw * (dd - 1) + cw / 2; ctx.textAlign = dd === 1 ? "left" : dd === n ? "right" : "center"; ctx.fillText(String(dd), dd === 1 ? L : dd === n ? L + W : cx, top + H + 44); });
  ctx.textAlign = "left";

  // legend + footer
  const fy = 1300;
  ctx.font = `400 30px ${SANS}`; ctx.fillStyle = "rgba(244,238,229,.78)";
  let lx = 54;
  ctx.fillStyle = SUN; ctx.fillRect(lx, fy - 26, 22, 28); lx += 34; ctx.fillStyle = "rgba(244,238,229,.78)"; ctx.fillText("Night out", lx, fy); lx += ctx.measureText("Night out").width + 30;
  ctx.fillStyle = "#F4EEE5"; ctx.beginPath(); ctx.arc(lx + 8, fy - 11, 8, 0, Math.PI * 2); ctx.fill(); lx += 26; ctx.fillStyle = "rgba(244,238,229,.78)"; ctx.fillText("Workout", lx, fy); lx += ctx.measureText("Workout").width + 30;
  ctx.strokeStyle = SUN; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(lx + 9, fy - 11, 9, 0, Math.PI * 2); ctx.stroke(); lx += 28; ctx.fillText("Class", lx, fy);
  ctx.textAlign = "right"; ctx.fillText(`${d.zone} · Made with Weekline`, 1026, fy); ctx.textAlign = "left";
  if (d.credit) { ctx.font = `400 24px ${SANS}`; ctx.fillStyle = "rgba(244,238,229,.58)"; ctx.fillText(fit(ctx, "Photo: " + d.credit, 972), 54, 1338); }
}

export function canvasBlob(cv) { return new Promise((res) => cv.toBlob(res, "image/png")); }
export async function saveCanvas(cv, name) {
  const blob = await canvasBlob(cv);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
export async function shareCanvas(cv, name, text) {
  const blob = await canvasBlob(cv);
  const file = new File([blob], name, { type: "image/png" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text }); return "shared"; }
  await saveCanvas(cv, name); return "saved";
}
