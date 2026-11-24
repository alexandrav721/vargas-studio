-- Weekline v2: calendar links people paste in (Luma, Partiful, Apple/Google/Outlook private iCal addresses).
-- The link is a secret (anyone with it can read that calendar), so it is encrypted at rest with AES-GCM
-- (key: secret WL_TOKEN_KEY, user id bound in as additional data). We read events and busy times; we never write.

CREATE TABLE IF NOT EXISTS feeds_in (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind        TEXT NOT NULL CHECK (kind IN ('luma', 'partiful', 'calendar')),
  enc_url     TEXT NOT NULL,
  iv          TEXT NOT NULL,
  host        TEXT NOT NULL,          -- shown to the user ("lu.ma"), never the full link
  added_at    INTEGER NOT NULL,
  last_ok     INTEGER,
  last_error  TEXT,
  last_count  INTEGER
);
CREATE INDEX IF NOT EXISTS feeds_in_user ON feeds_in (user_id);
