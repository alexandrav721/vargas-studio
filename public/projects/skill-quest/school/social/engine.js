// AI Made EZ post engine. One fixed frame, like a wire service: 1080 x 1350, a real picture, a black fade,
// a small red label, a white sentence-case headline, the EZ mark top-left. Nothing else on the image.
// Inner slides are black with the mark. Long carousels end on the same offer slide.
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const mark = () => `<div class="ez-mark"><b>AI Made</b><span>EZ</span></div>`;
const swipe = () => `<div class="ez-swipe" aria-hidden="true">→</div>`;

/** The cover: image (or a type-only ground), fade, label, headline. */
export function card(s, opts = {}) {
  const img = s.img ? `<img class="ez-photo" src="${esc(s.img)}" alt="" style="object-position:${esc(s.pos || "50% 30%")}">` : `<div class="ez-ground" aria-hidden="true">${esc(s.ground || "")}</div>`;
  return `<div class="ez-post ez-card${s.img ? "" : " ez-typeonly"}">${img}<div class="ez-fade"></div>${mark()}
    <div class="ez-text"><p class="ez-label">${esc(s.label)}</p><h3 class="ez-head">${esc(s.head)}</h3></div>${opts.carousel ? swipe() : ""}</div>`;
}
/** An inner slide: black, the mark, a label, a title and free HTML. */
export function inner(s) {
  return `<div class="ez-post ez-inner">${mark()}<div class="ez-in"><p class="ez-label">${esc(s.label)}</p>${s.title ? `<h4>${esc(s.title)}</h4>` : ""}${s.html || ""}</div></div>`;
}
/** A guide step: STEP label, the order ticket building up, 2 or 3 short lines. */
export function step(s) {
  const lines = s.ticket.map((l, i) => `<li class="${i >= s.ticket.length - (s.added || 0) ? "added" : ""}">${esc(l)}</li>`).join("");
  return `<div class="ez-post ez-inner ez-step">${mark()}<div class="ez-in"><p class="ez-label">Step ${s.n}</p><h4>${esc(s.title)}</h4>
    <div class="ez-ticket"><div class="th"><span>YOUR ORDER</span><span>to Claude</span></div><ol>${lines}</ol></div>
    ${s.lines.map((l) => `<p class="ez-line">${esc(l)}</p>`).join("")}</div></div>`;
}
/** The offer slide every long carousel ends on: one destination, link in bio. */
export function offer() {
  return `<div class="ez-post ez-inner ez-offer">${mark()}<div class="ez-in"><p class="ez-label">AI Made EZ</p><h4>Free, all of it.</h4>
    <div class="ez-phone"><img src="/projects/skill-quest/school/social/img/start-phone.jpg" alt=""></div>
    <ul class="ez-checks"><li>Short lessons, no coding</li><li>Every AI word in plain words</li><li>A Kit maker for your app idea</li><li>This week in AI, every Friday</li></ul>
    <p class="ez-pill">Link in bio</p></div></div>`;
}
export function slideHTML(s, i, post) {
  if (s.t === "card") return card(s, { carousel: post.slides.length > 1 && i === 0 });
  if (s.t === "step") return step(s);
  if (s.t === "offer") return offer();
  return inner(s);
}
/** Scale every .ez-post inside a .ez-frame to the frame's width. */
export function fit(root = document) {
  root.querySelectorAll(".ez-frame").forEach((f) => { const p = f.firstElementChild; if (p) p.style.transform = `scale(${f.clientWidth / 1080})`; });
}
