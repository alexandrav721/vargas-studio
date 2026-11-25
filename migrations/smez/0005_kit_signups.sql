-- AI Made EZ kits (25 Nov 2026): optional "Email me this kit". The kit is always free on the page; this only saves a copy request.
-- One row per (email, kit). news = 1 only if the visitor ticked the unticked "send me new kits" box. Deleted on request (/api/kits/forget).
CREATE TABLE IF NOT EXISTS kit_signups (
  email        TEXT NOT NULL,
  kit          TEXT NOT NULL,
  news         INTEGER NOT NULL DEFAULT 0,   -- 1 = asked for new-kit emails
  consent_ver  TEXT NOT NULL,                -- version of the wording shown next to the box
  created_at   INTEGER NOT NULL,             -- ms, UTC
  sent_at      INTEGER,                      -- when the kit email went out (NULL until email sending is switched on)
  PRIMARY KEY (email, kit)
);
CREATE INDEX IF NOT EXISTS kit_signups_news ON kit_signups(news);
