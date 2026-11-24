-- Weekline v2: the team console (HQ). Roles, versioned algorithm settings, and proposals that an owner approves.
-- Owners approve and publish. Admins see everything and suggest. Every version is kept.
-- The first owner comes from the OWNER_EMAILS secret (comma-separated), so no email is stored in code.

CREATE TABLE IF NOT EXISTS roles (
  user_id   TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  role      TEXT NOT NULL CHECK (role IN ('owner', 'admin')),
  added_by  TEXT,
  added_at  INTEGER NOT NULL
);

-- Every published version of the algorithm settings. Exactly one row has live = 1 (none = built-in version 1).
CREATE TABLE IF NOT EXISTS algo_versions (
  version     INTEGER PRIMARY KEY,
  settings    TEXT NOT NULL,          -- JSON, same shape as public/projects/weekline/v2/algo.js
  note        TEXT,
  proposal_id TEXT,
  created_by  TEXT,
  created_at  INTEGER NOT NULL,
  live        INTEGER NOT NULL DEFAULT 0
);

-- Suggestions from the team. kind = 'algo' (a settings change, applied on approval) or 'note' (a change request:
-- wording, editorial picks, feeds; approved means "do it").
CREATE TABLE IF NOT EXISTS proposals (
  id            TEXT PRIMARY KEY,
  kind          TEXT NOT NULL CHECK (kind IN ('algo', 'note')),
  title         TEXT NOT NULL,
  why           TEXT,
  change        TEXT,                 -- JSON for 'algo': [{path, from, to}]
  status        TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'approved', 'declined')),
  by_user       TEXT NOT NULL,
  at            INTEGER NOT NULL,
  decided_by    TEXT,
  decided_at    INTEGER,
  decision_note TEXT,
  version       INTEGER                -- the algorithm version an approved 'algo' proposal created
);
CREATE INDEX IF NOT EXISTS proposals_status ON proposals (status, at);
