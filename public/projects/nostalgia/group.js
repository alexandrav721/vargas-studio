/* Scrollback group: up to 9 players, all in the link. Nothing is stored on a server.
 *
 * ?y=2004&p=Maya.t.1a.2b&p=Jo.f2006.3c&via=group
 *   y   the group's year ("our 2004")
 *   p   one per player, in the order they played:
 *       name . persona key (+ their year when it differs) . item ids (base 36)
 *   Persona keys: t tech, y toy, f fashion, m music/media, x a mix.
 * Old links (?year=2006&had=a.b.c) read as a group of one, with no name. Pure: no DOM, so it tests in node. */

export const MAX_PLAYERS = 9;
export const NAME_MAX = 12;
export const KEYS = ["t", "y", "f", "m", "x"];

/** First names only: letters, digits, space, ' and -, at most 12 characters. */
export function cleanName(raw) {
  const s = String(raw ?? "")
    .normalize("NFC")
    .replace(/[^\p{L}\p{M}\p{N} '\-]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  return [...s].slice(0, NAME_MAX).join("").trim();
}

/** "Maya", or "Friend 2" for a blank name; a group of one unnamed friend is "Your friend". */
export function displayName(player, index, total) {
  if (player.name) return player.name;
  return total === 1 ? "Your friend" : `Friend ${index + 1}`;
}

function clampYear(y, first, last) {
  const n = Number(y);
  if (!Number.isFinite(n)) return null;
  return Math.min(last, Math.max(first, Math.round(n)));
}

/** Read a group from a query string. itemNames maps id → item name (the catalog order). */
export function decodeGroup(search, itemNames, { first = 1995, last = 2016 } = {}) {
  const q = new URLSearchParams(search);
  const byId = (x) => {
    const n = parseInt(x, 36);
    return /^[0-9a-z]{1,3}$/.test(x) && n >= 0 && n < itemNames.length ? itemNames[n] : null;
  };
  const ps = q.getAll("p");
  if (ps.length) {
    const year = clampYear(q.get("y"), first, last) ?? 2004;
    const players = ps.slice(0, MAX_PLAYERS).map((raw) => {
      const [name = "", kp = "", ...ids] = raw.split(".");
      const m = /^([tyfmx])?(\d{4})?$/.exec(kp) || [];
      const had = [...new Set(ids.map(byId).filter(Boolean))];
      return { name: cleanName(name), key: m[1] || null, year: clampYear(m[2], first, last) ?? year, had };
    });
    return { year, players, legacy: false };
  }
  if (q.get("year") && q.get("had")) {
    const year = clampYear(q.get("year"), first, last) ?? 2004;
    const had = [...new Set(q.get("had").split(".").map(byId).filter(Boolean))];
    if (!had.length) return null;
    return { year, players: [{ name: "", key: null, year, had }], legacy: true };
  }
  return null;
}

/** Build the query string for a group (always the new format). */
export function encodeGroup(year, players, itemNames) {
  const q = new URLSearchParams();
  q.set("y", String(year));
  players.slice(0, MAX_PLAYERS).forEach((p) => {
    const ids = p.had.map((n) => itemNames.indexOf(n)).filter((n) => n >= 0).map((n) => n.toString(36));
    const key = KEYS.includes(p.key) ? p.key : "x";
    const kp = key + (p.year && p.year !== year ? String(p.year) : "");
    q.append("p", [cleanName(p.name), kp, ...ids].join("."));
  });
  q.set("via", "group");
  return `?${q.toString()}`;
}

/** Who in the group had each item: Map(name → [player index]). */
export function whoHad(players) {
  const map = new Map();
  players.forEach((p, k) => p.had.forEach((n) => map.set(n, [...(map.get(n) || []), k])));
  return map;
}

/** Items at least two people had, most shared first. */
export function inCommon(players) {
  return [...whoHad(players).entries()]
    .filter(([, ks]) => ks.length >= 2)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([name, ks]) => ({ name, count: ks.length, who: ks }));
}

/** One fun line, computed only from what people ticked. names[k] is how to call player k; meIndex is you (or -1). */
export function funLine(players, names, meIndex, label = (n) => n) {
  const n = players.length;
  if (n < 2) return "";
  const map = whoHad(players);
  const everyone = [...map.entries()].filter(([, ks]) => ks.length === n).map(([nm]) => nm);
  if (n >= 3 && everyone.length) return `All ${n} of you had ${label(everyone[0])}.`;
  if (meIndex >= 0) {
    const mine = [...map.entries()].filter(([, ks]) => ks.length === 1 && ks[0] === meIndex).map(([nm]) => nm);
    if (mine.length) return `Only you ticked ${label(mine[0])}.`;
  }
  const solo = [...map.entries()].filter(([, ks]) => ks.length === 1);
  if (solo.length) {
    const [nm, [k]] = solo[0];
    return `Only ${names[k]} ticked ${label(nm)}.`;
  }
  if (n === 2 && everyone.length) return `You both had ${label(everyone[0])}.`;
  const most = players.map((p, k) => [k, p.had.length]).sort((a, b) => b[1] - a[1]);
  if (most[0][1] > (most[1]?.[1] ?? 0)) return `${names[most[0][0]]} had the most: ${most[0][1]} things.`;
  return "";
}
