-- Phase 1 (23 Nov 2026): item types (skill | prompt | kit), a license per item, a "Thank the maker" tip link,
-- kit parts, and the "Request a skill" board with upvotes.
-- kind: skill (SKILL.md) | prompt (text with [slots]; stored in skill_md) | kit (start-here SKILL.md + parts).
-- license: cc-by | mit | all-rights | NULL (maker hasn't picked one yet; shown as "Ask the maker").
-- parts: JSON [{ "skill_md": "..." }] for kits (1-5 extra skills), NULL otherwise.
-- tip_url: https link to the maker's own tip page on an allowed host (checked in the API).

ALTER TABLE skills ADD COLUMN kind TEXT NOT NULL DEFAULT 'skill';
ALTER TABLE skills ADD COLUMN license TEXT;
ALTER TABLE skills ADD COLUMN tip_url TEXT;
ALTER TABLE skills ADD COLUMN parts TEXT;

ALTER TABLE skill_versions ADD COLUMN kind TEXT NOT NULL DEFAULT 'skill';
ALTER TABLE skill_versions ADD COLUMN license TEXT;
ALTER TABLE skill_versions ADD COLUMN tip_url TEXT;
ALTER TABLE skill_versions ADD COLUMN parts TEXT;

CREATE INDEX IF NOT EXISTS sl_skills_kind ON skills(status, kind);

-- Our own ready-made skills are free to share with credit.
UPDATE skills SET license = 'cc-by' WHERE maker_id IN (SELECT id FROM users WHERE is_system = 1);

-- status: open | made | closed. made_id: the live item that answers it.
CREATE TABLE IF NOT EXISTS requests (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  detail     TEXT,
  category   TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'open',
  made_id    TEXT REFERENCES skills(id) ON DELETE SET NULL,
  made_by    TEXT REFERENCES users(id) ON DELETE SET NULL,
  votes      INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sl_requests_status ON requests(status, votes);
CREATE INDEX IF NOT EXISTS sl_requests_user ON requests(user_id);

CREATE TABLE IF NOT EXISTS request_votes (
  request_id TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  at         INTEGER NOT NULL,
  PRIMARY KEY (request_id, user_id)
);
CREATE INDEX IF NOT EXISTS sl_request_votes_user ON request_votes(user_id);
