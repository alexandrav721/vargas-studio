# Scrollback

Millennial nostalgia by year — pick your generation and years, then explore **websites**, **items**, and **style** from that stretch of time.

## Run locally

```bash
cd nostalgia
npm start
# or: python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765

## Verify

```bash
npm start                      # http://127.0.0.1:8765
npm run verify                 # static catalog + UX gates
npm run e2e                    # headless Chrome three-lens smoke (needs Chrome + npm i)
node scripts/verify.mjs <url>  # published app URL
node scripts/e2e-smoke.mjs <url>
```

## Scope (v1)

- Generation: Millennials (1981–1996)
- Catalog window: 1995–2012 in four eras (Dial-up, Y2K, Profile Peak, Feed Years)
- Researched depth: **52 websites · 53 objects · 4 style systems**
- Lenses: websites · physical items · visual/fashion style
- Research notes: `SOURCES.md`, `docs/`, `src/data/`
