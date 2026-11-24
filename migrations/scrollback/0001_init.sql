-- Scrollback "Tell me when prints open" list (Cloudflare D1, binding SB, database "scrollback").
-- Only the email, the year they played, and which page they came from. No names, no IPs.
-- Times are Unix epoch milliseconds. One email when prints open, then the rows are deleted.

CREATE TABLE IF NOT EXISTS notify (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT NOT NULL UNIQUE,           -- stored lowercased
  year       INTEGER,                        -- 1995–2016, or NULL
  source     TEXT NOT NULL DEFAULT 'print',  -- print · group · gift
  created_at INTEGER NOT NULL,
  CHECK (email = lower(email)),
  CHECK (year IS NULL OR (year BETWEEN 1995 AND 2016))
);
CREATE INDEX IF NOT EXISTS notify_created ON notify(created_at);
