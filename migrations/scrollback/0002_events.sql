-- Scrollback anonymous game counts (Cloudflare D1, binding SB, database "scrollback").
-- One row per UTC day and step, holding a number. Nothing about any person: no names, emails, picks or IPs.
-- Steps: start · join · finish · share · save · group_share · print_open

CREATE TABLE IF NOT EXISTS events (
  day  TEXT NOT NULL,              -- YYYY-MM-DD (UTC)
  step TEXT NOT NULL,
  n    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, step),
  CHECK (step IN ('start', 'join', 'finish', 'share', 'save', 'group_share', 'print_open'))
);
