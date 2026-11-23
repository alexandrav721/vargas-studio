-- Weekline v2: Google Calendar busy times (scope calendar.freebusy only).
-- The refresh token is encrypted at rest with AES-GCM (key: secret WL_TOKEN_KEY, base64 of 32 bytes;
-- the user id is bound in as additional data). iv is base64. Access tokens live only in KV, encrypted, until they expire.
-- Event names are never requested or stored: Weekline reads busy/free blocks only.

CREATE TABLE IF NOT EXISTS google_tokens (
  user_id      TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  enc_refresh  TEXT NOT NULL,
  iv           TEXT NOT NULL,
  scope        TEXT NOT NULL,
  connected_at INTEGER NOT NULL
);
