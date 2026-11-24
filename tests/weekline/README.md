# Weekline local tests

Run against a local `wrangler pages dev` with test-only settings (never production):

```
wrangler d1 execute weekline --local --persist-to <dir> --file migrations/weekline/000X.sql   # 0001–0004
python3 -m http.server 8793 --bind 127.0.0.1 --directory tests/weekline/feeds
wrangler pages dev dist --port 8792 --ip 127.0.0.1 --persist-to <dir> \
  --binding OWNER_EMAILS=owner@test.local --binding FEEDS_MOCK=1 --binding TM_MOCK=1 \
  --binding WL_TOKEN_KEY=$(openssl rand -base64 32)
./tests/weekline/test-hq.sh      # team console: roles, proposals, approvals, restore (23 checks)
./tests/weekline/test-feeds.sh   # calendar links: validation, iCal reading, privacy (15 checks)
```

`week-probe.js` records `buildWeek` output for three test profiles, to prove an algorithm version change
picks the same nights (paste into the browser console on the app page).
Sign-up and link limits are per hour: repeated runs hit them (that's the limit working).
