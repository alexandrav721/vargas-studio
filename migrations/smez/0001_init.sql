-- Skills Made EZ community library (Cloudflare D1, binding SMEZ, database "smez").
-- Times are Unix epoch milliseconds. Passwords: PBKDF2-SHA256, 100,000 iterations, random salt.
-- Session tokens are stored only as SHA-256 hashes. Separate from Weekline (own database, own tables).

CREATE TABLE IF NOT EXISTS users (
  id         TEXT PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  handle     TEXT NOT NULL UNIQUE COLLATE NOCASE,   -- public maker name, 3-24 letters/numbers/-
  pw_hash    TEXT NOT NULL,                         -- '!' for the system maker (can never sign in)
  pw_salt    TEXT NOT NULL,
  is_system  INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sl_sessions_user ON sessions(user_id);

-- status: draft | review | live | changes | hidden
-- works_in, examples, checks, test: JSON text. example_inputs: plain text of every example input (search).
-- hidden_by: 'admin' | 'reports' (auto-hide at 2 distinct reporters) | NULL
-- rate_n / rate_yes / wilson: counted ratings only (recomputed on every rating change).
CREATE TABLE IF NOT EXISTS skills (
  id             TEXT PRIMARY KEY,
  slug           TEXT NOT NULL,
  name           TEXT NOT NULL,
  one_line       TEXT NOT NULL,
  category       TEXT NOT NULL,
  sub            TEXT NOT NULL,
  for_tag        TEXT NOT NULL DEFAULT 'anyone',
  works_in       TEXT NOT NULL DEFAULT '["claude-ai","claude-code"]',
  skill_md       TEXT NOT NULL,
  examples       TEXT NOT NULL DEFAULT '[]',
  example_inputs TEXT NOT NULL DEFAULT '',
  maker_id       TEXT NOT NULL REFERENCES users(id),
  parent_id      TEXT REFERENCES skills(id) ON DELETE SET NULL,
  version        INTEGER NOT NULL DEFAULT 1,
  status         TEXT NOT NULL DEFAULT 'draft',
  review_note    TEXT,
  hidden_by      TEXT,
  checks         TEXT,
  test           TEXT,
  test_skill     REAL,
  test_plain     REAL,
  ask_test       INTEGER NOT NULL DEFAULT 0,
  uses           INTEGER NOT NULL DEFAULT 0,
  rate_n         INTEGER NOT NULL DEFAULT 0,
  rate_yes       INTEGER NOT NULL DEFAULT 0,
  wilson         REAL NOT NULL DEFAULT 0,
  burst_flag     INTEGER NOT NULL DEFAULT 0,
  created_at     INTEGER NOT NULL,
  updated_at     INTEGER NOT NULL,
  live_at        INTEGER
);
CREATE INDEX IF NOT EXISTS sl_skills_status ON skills(status, category, sub);
CREATE INDEX IF NOT EXISTS sl_skills_maker ON skills(maker_id);
CREATE INDEX IF NOT EXISTS sl_skills_parent ON skills(parent_id);

-- A pending edit of a live (or hidden) skill. The live row stays as it is until an admin approves.
-- status: review | changes
CREATE TABLE IF NOT EXISTS skill_versions (
  skill_id       TEXT PRIMARY KEY REFERENCES skills(id) ON DELETE CASCADE,
  version        INTEGER NOT NULL,
  name           TEXT NOT NULL,
  one_line       TEXT NOT NULL,
  category       TEXT NOT NULL,
  sub            TEXT NOT NULL,
  for_tag        TEXT NOT NULL,
  works_in       TEXT NOT NULL,
  slug           TEXT NOT NULL,
  skill_md       TEXT NOT NULL,
  examples       TEXT NOT NULL,
  example_inputs TEXT NOT NULL,
  checks         TEXT,
  ask_test       INTEGER NOT NULL DEFAULT 0,
  status         TEXT NOT NULL DEFAULT 'review',
  review_note    TEXT,
  created_at     INTEGER NOT NULL,
  updated_at     INTEGER NOT NULL
);

-- Downloads / copies by signed-in accounts (unlocks rating). Signed-out uses only bump skills.uses.
CREATE TABLE IF NOT EXISTS uses (
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  user_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind     TEXT NOT NULL,          -- download | copy
  at       INTEGER NOT NULL,
  PRIMARY KEY (skill_id, user_id)
);
CREATE INDEX IF NOT EXISTS sl_uses_user ON uses(user_id);

-- One rating per account per skill, editable. young = account was under 7 days old when it first rated.
-- counted = 0 while a burst flag is under review.
CREATE TABLE IF NOT EXISTS ratings (
  skill_id   TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  helped     INTEGER NOT NULL,     -- 1 yes, 0 no
  line       TEXT NOT NULL,        -- "What did you use it for?" 10-140 chars
  young      INTEGER NOT NULL DEFAULT 0,
  counted    INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (skill_id, user_id)
);
CREATE INDEX IF NOT EXISTS sl_ratings_user ON ratings(user_id);
CREATE INDEX IF NOT EXISTS sl_ratings_skill_time ON ratings(skill_id, created_at);

-- reason: unsafe | broken | copied | spam. resolved = 1 once an admin acted on the skill.
CREATE TABLE IF NOT EXISTS reports (
  skill_id   TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason     TEXT NOT NULL,
  note       TEXT,
  resolved   INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (skill_id, user_id)
);
CREATE INDEX IF NOT EXISTS sl_reports_user ON reports(user_id);
