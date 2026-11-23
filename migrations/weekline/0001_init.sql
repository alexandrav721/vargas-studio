-- Weekline v2 (Cloudflare D1, binding WL, database "weekline").
-- Times are Unix epoch milliseconds. Passwords: PBKDF2-SHA256, 100,000 iterations, random salt.
-- Session tokens are stored only as SHA-256 hashes.

CREATE TABLE IF NOT EXISTS users (
  id         TEXT PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  name       TEXT NOT NULL,
  pw_hash    TEXT NOT NULL,
  pw_salt    TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expires ON sessions(expires_at);

-- data JSON: goals, learn, zone, hood, minutes, budget, free_days, crew, locks
CREATE TABLE IF NOT EXISTS profiles (
  user_id    TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  data       TEXT NOT NULL DEFAULT '{}',
  updated_at INTEGER NOT NULL
);

-- kind: went | loved | lock | unlock | skip | ics | rsvp
CREATE TABLE IF NOT EXISTS signals (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  kind     TEXT NOT NULL,
  reason   TEXT,
  tags     TEXT,
  at       INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS signals_user_at ON signals(user_id, at);

-- Live .ics subscribe URL: /api/wl/ics/<token>.ics
CREATE TABLE IF NOT EXISTS feeds (
  token      TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS feeds_user ON feeds(user_id);

-- event JSON snapshot: title, when, start, end, place, source, url, goal. owner_id is NULL for guests.
CREATE TABLE IF NOT EXISTS invites (
  token      TEXT PRIMARY KEY,
  owner_id   TEXT REFERENCES users(id) ON DELETE CASCADE,
  event      TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS invites_owner ON invites(owner_id);

-- status: in | maybe. device is "u:<user id>" for signed-in people, so one person counts once.
CREATE TABLE IF NOT EXISTS rsvps (
  invite_token TEXT NOT NULL REFERENCES invites(token) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  status       TEXT NOT NULL CHECK (status IN ('in', 'maybe')),
  device       TEXT NOT NULL,
  user_id      TEXT REFERENCES users(id) ON DELETE CASCADE,
  at           INTEGER NOT NULL,
  PRIMARY KEY (invite_token, device)
);
CREATE INDEX IF NOT EXISTS rsvps_user ON rsvps(user_id);
CREATE INDEX IF NOT EXISTS rsvps_status ON rsvps(invite_token, status, at);

-- options JSON: ["Tue", "Wed", "Thu"] (2 or 3)
CREATE TABLE IF NOT EXISTS polls (
  token      TEXT PRIMARY KEY,
  owner_id   TEXT REFERENCES users(id) ON DELETE CASCADE,
  question   TEXT NOT NULL,
  options    TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS polls_owner ON polls(owner_id);

-- One vote per person/device. user_id is set for signed-in voters so DELETE me can remove it.
CREATE TABLE IF NOT EXISTS votes (
  poll_token TEXT NOT NULL REFERENCES polls(token) ON DELETE CASCADE,
  device     TEXT NOT NULL,
  option     INTEGER NOT NULL,
  user_id    TEXT REFERENCES users(id) ON DELETE CASCADE,
  at         INTEGER NOT NULL,
  PRIMARY KEY (poll_token, device)
);
CREATE INDEX IF NOT EXISTS votes_user ON votes(user_id);
