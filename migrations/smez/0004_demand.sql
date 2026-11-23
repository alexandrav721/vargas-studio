-- Demand test (24 Nov 2026): two twin pages (marketers kit $39, everyday starter $19).
-- events: one row per page view / pre-order click / reservation. No IPs, no cookies; visitor = random id kept in the browser.
CREATE TABLE IF NOT EXISTS demand_events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  page       TEXT NOT NULL,          -- marketers | everyday
  event      TEXT NOT NULL,          -- view | cta | reserve
  visitor    TEXT NOT NULL,          -- random id from the browser
  source     TEXT,                   -- utm_source (short)
  at         INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS demand_page_event ON demand_events(page, event);
CREATE UNIQUE INDEX IF NOT EXISTS demand_once ON demand_events(page, event, visitor);

-- Reservations: email so we can tell them when it's ready. Deleted on request.
CREATE TABLE IF NOT EXISTS demand_reservations (
  page       TEXT NOT NULL,
  email      TEXT NOT NULL,
  role       TEXT,
  source     TEXT,
  at         INTEGER NOT NULL,
  PRIMARY KEY (page, email)
);
