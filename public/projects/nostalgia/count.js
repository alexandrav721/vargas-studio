/* Anonymous counts for Scrollback: how many games start, finish, get shared or saved,
 * how many friends join a group, how many open the print page.
 * Sends only the step name. No names, emails, picks, years or IPs are sent or stored.
 * Off until the server's database is switched on (the server answers 503 and we ignore it).
 * Skipped when the browser asks not to be tracked. */
const STEPS = new Set(["start", "join", "finish", "share", "save", "group_share", "print_open"]);

export function count(step) {
  try {
    if (!STEPS.has(step)) return;
    if (navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl) return;
    fetch("/api/sb/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ step }),
      keepalive: true,
    }).catch(() => {});
  } catch (e) {
    /* counting never breaks the game */
  }
}
