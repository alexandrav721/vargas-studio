import data from "../content/portfolio.json";
import thumbs from "./thumbs.json";

export type Status = "hot" | "active" | "quiet" | "seed";
export type CellState = "live" | "fill-in" | "na";

export type VisualCell = {
  label: string;
  detail: string;
  url: string | null;
  state: string;
};

export type Project = (typeof data.projects)[number];

export const statusLabel: Record<Status, string> = {
  hot: "Hot now",
  active: "In flight",
  quiet: "Quieter",
  seed: "Seed",
};

export const cellStateLabel: Record<CellState, string> = {
  live: "Live",
  "fill-in": "Fill in",
  na: "N/A",
};

const OPEN_PRIORITY = [
  "product-ui",
  "website",
  "landing",
  "funnel",
  "social",
  "deck",
  "meta-ads",
  "print",
] as const;

export function visualsOf(project: Project) {
  return project.visuals as Record<string, VisualCell>;
}

export function cellFor(project: Project, columnId: string): VisualCell | null {
  return visualsOf(project)[columnId] ?? null;
}

export function liveCount(project: Project) {
  return Object.values(visualsOf(project)).filter((c) => c.state === "live")
    .length;
}

export function primaryOpen(
  project: Project,
): { columnId: string; cell: VisualCell } | null {
  const visuals = visualsOf(project);
  for (const id of OPEN_PRIORITY) {
    const cell = visuals[id];
    if (cell?.state === "live" && cell.url) return { columnId: id, cell };
  }
  return null;
}

const thumbMap = thumbs as Record<string, string>;

export function thumbFor(url: string | null | undefined): string | null {
  if (!url) return null;
  return thumbMap[url] ?? null;
}

/** Best screenshot for a project, in the order a visitor should meet it. */
export function heroThumb(project: Project): string | null {
  const v = visualsOf(project);
  for (const id of ["website", "product-ui", "landing", "deck"]) {
    const t = thumbFor(v[id]?.url);
    if (t) return t;
  }
  return null;
}

/** Up to n distinct screenshots that aren't the hero, for a filmstrip. */
export function supportingThumbs(project: Project, n: number) {
  const v = visualsOf(project);
  const hero = heroThumb(project);
  const seen = new Set<string>(hero ? [hero] : []);
  const out: { id: string; src: string; label: string; url: string }[] = [];
  for (const id of ["landing", "meta-ads", "print", "social", "deck", "product-ui", "funnel"]) {
    const cell = v[id];
    const src = thumbFor(cell?.url);
    if (!cell || !src || seen.has(src)) continue;
    seen.add(src);
    const col = data.columns.find((c) => c.id === id);
    out.push({ id, src, label: col?.name ?? id, url: cell.url! });
    if (out.length === n) break;
  }
  return out;
}

export type Route =
  | { view: "desk" }
  | { view: "all" }
  | { view: "home" }
  | { view: "deck"; slide: number }
  | { view: "project"; id: string };

export function parseRoute(hash: string): Route {
  if (hash === "" || hash === "#" || hash === "#/") return { view: "desk" };
  if (hash === "#/all") return { view: "all" };
  // old in-page bookmarks of the detailed view (#compare, #projects, #weekline …)
  if (/^#[a-z][\w-]*$/i.test(hash)) return { view: "all" };
  const deck = hash.match(/^#\/tour(?:\/(\d+))?$/);
  if (deck) return { view: "deck", slide: Math.max(0, Number(deck[1] ?? 1) - 1) };
  const proj = hash.match(/^#\/p\/([\w-]+)$/);
  if (proj && data.projects.some((p) => p.id === proj[1])) {
    return { view: "project", id: proj[1] };
  }
  return { view: "home" };
}

export const projectHref = (id: string) => `#/p/${id}`;
export const tourHref = (slide = 1) => (slide <= 1 ? "#/tour" : `#/tour/${slide}`);

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
/** "eight" for 8 projects; digits past twelve. */
export const projectCountWord = WORDS[data.projects.length] ?? String(data.projects.length);
