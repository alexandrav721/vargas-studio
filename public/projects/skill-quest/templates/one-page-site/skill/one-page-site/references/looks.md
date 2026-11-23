# Six looks for a personal site

Pick ONE from the "Pick it when" line. Use it whole: palette, fonts, layout, signature, motion. Text/background pairs listed are checked at 4.5:1 or better; do not put text on any other pair. Max content width 1120 px unless noted.

| Look | Pick it when the person... |
|---|---|
| Kiln shelf | makes physical objects: ceramics, wood, jewelry, glass, textiles, furniture, candles |
| Sketchbook | draws or designs: illustrator, cartoonist, tattoo artist, graphic or textile designer, painter |
| Case file | works with words, ideas or results: writer, editor, consultant, coach, therapist, researcher, marketer |
| Night set | performs or works with light and sound: musician, DJ, photographer, filmmaker, actor, dancer |
| Workbench | builds or fixes systems: developer, engineer, architect, data person, carpenter, electrician |
| Link card | mainly wants a link-in-bio page: creator, small seller, someone with 4+ links and little work to show |

If two fit, pick by the three works: what are they physically? Objects, drawings, words, performances, builds, or links.

---

## Kiln shelf
Like a gallery shelf with museum labels. Quiet, physical, a lot of air.
- **Palette:** `--bg #EAE6DC` (unglazed bisque), `--ink #1F1E1B`, `--muted #5C574E`, `--accent #3F6553` (celadon glaze), `--frame #D8D2C4` (photo frames, no text on it except `--ink`), `--line #1F1E1B` at 15% opacity.
- **Text pairs:** ink on bg 13.4, muted on bg 5.8, accent on bg 5.3, white on accent 6.6, ink on frame (large text only).
- **Fonts:** Gloock (display, 400) + Hanken Grotesk (400, 600). `https://fonts.googleapis.com/css2?family=Gloock&family=Hanken+Grotesk:wght@400;600&display=swap`. Name `clamp(2.6rem, 9vw, 6rem)`, line-height 0.95.
- **Layout:** masthead left-aligned, name huge, the "what I do" line under it in Hanken at 1.15rem, max 34ch. Work is a shelf: on desktop a 12-column grid where the lead piece spans 7 columns and tall (`aspect-ratio: 4/5`, 4/3 on phone), the other two stack in the remaining 5 columns (`aspect-ratio: 3/2`). With no photos, the lead stand-in is a potter's-style profile drawing of the object (outline in accent, rim or detail in ink). A 1 px `--line` rule runs under each row like a shelf edge. On phone, one column, lead first.
- **Signature:** museum-label captions. Under each piece: title in Gloock 1.4rem, then a small facts line in Hanken 600, 0.8rem, letter-spacing 0.06em, uppercase is allowed here only (it's a label, not an eyebrow), e.g. `STONEWARE · 40 PIECES · 2025`, then one sentence in muted. Middle dots separate facts.
- **Motion:** on load the three frames rise 12 px and fade in, staggered 80 ms, 600 ms ease-out. Nothing else moves.
- **Avoid:** rounded corners (use 0 or 2 px), drop shadows on frames, terracotta.

## Sketchbook
A page from a working sketchbook: loose, bold, a little messy on purpose.
- **Palette:** `--bg #FBFAF7` (paper), `--ink #191919`, `--muted #5E5B55`, `--accent #C8361B` (vermilion ink), `--pop #FFD23F` (marker yellow, ink text only), `--frame #EFECE4`.
- **Text pairs:** ink on bg 16.8, muted on bg 6.5, accent on bg 5.0, white on accent 5.3, ink on pop 12.2.
- **Fonts:** Anybody (display, 800, use `font-stretch: 120%` via `font-variation-settings: "wdth" 120`) + Familjen Grotesk (400, 600) + Gochi Hand (annotations only). `https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@50..150,800&family=Familjen+Grotesk:wght@400;600&family=Gochi+Hand&display=swap`.
- **Layout:** name set very large and allowed to run edge to edge at the top (`clamp(3rem, 14vw, 9rem)`, line-height 0.85). Work is a pinned-up collage: on desktop a 6-column grid with pieces at different sizes (lead spans 4 columns, others 2 and 3, offset vertically by 40 to 80 px) and each frame rotated a small, different amount (-1.5deg, 1deg, -0.5deg). On phone, one column, rotation halved.
- **Signature:** handwritten margin notes. Next to the lead piece and the contact, one short note in Gochi Hand 1.3rem in `--accent` with a single hand-drawn SVG arrow (one `path`, stroke 2.5, round caps, `aria-hidden`) pointing at it, e.g. "this one went to print twice". A `--pop` marker highlight behind one phrase in the About (`background: linear-gradient(transparent 55%, var(--pop) 55%)` is the one allowed gradient, because it depicts a highlighter stroke).
- **Motion:** the arrow draws itself once on load (stroke-dashoffset, 900 ms).
- **Avoid:** more than two notes, more than one highlight, neat equal grids.

## Case file
An editorial page, like a well-set magazine profile. Calm, confident, word-led.
- **Palette:** `--bg #EEF0EC` (cool paper), `--ink #14171A`, `--muted #50565C`, `--accent #1F3BC4` (editor's blue pencil), `--rule #14171A`.
- **Text pairs:** ink on bg 15.7, muted on bg 6.5, accent on bg 7.4, white on accent ~8.
- **Fonts:** Newsreader (display 500 and italic 400, optical size on) + Schibsted Grotesk (400, 600). `https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;1,6..72,400&family=Schibsted+Grotesk:wght@400;600&display=swap`.
- **Layout:** masthead is a statement, not a greeting: the "what I do" line set big in Newsreader (`clamp(1.9rem, 5vw, 3.4rem)`, max 22ch) with one key phrase in italic, and the name small above it in Schibsted 600 as the h1 (this is the one look where the name is small; it is not an eyebrow, it is the h1). Work is a ledger: each piece is a full-width row with a 2 px top rule; on desktop three columns inside the row: year (tabular), title + one-line result in Newsreader 1.6rem, and the facts in muted. The lead row gets a pull-quote-size result line ("Cut onboarding time from 9 days to 3").
- **Signature:** the result number in each row set in the accent and Newsreader italic, like a marked-up proof.
- **Motion:** none on load. On hover/focus of a work row, the top rule grows from 2 px to 4 px in accent (200 ms).
- **Avoid:** photos frames unless they gave photos; this look works with type alone.

## Night set
A setlist taped to a dark stage. High contrast, big type, one warm light.
- **Palette:** `--bg #121212`, `--ink #EDEBE6`, `--muted #A3A09A`, `--accent #FFB238` (sodium stage lamp), `--frame #1E1E1E`.
- **Text pairs:** ink on bg 15.7, muted on bg 7.2, accent on bg 10.4, bg-colored text on accent 10.4.
- **Fonts:** Big Shoulders Display (800) + Archivo (400, 600). `https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800&family=Archivo:wght@400;600&display=swap`. Name uppercase, `clamp(3.4rem, 15vw, 10rem)`, line-height 0.85.
- **Layout:** the work is a setlist: three huge rows, each title in Big Shoulders `clamp(2.2rem, 8vw, 5rem)`, with date, venue or client and a number (length, plays, audience) in Archivo on the right on desktop, under it on phone. If they gave photos, the lead row has a wide 16/9 frame under it. Contact is a full-width accent band with the email in Big Shoulders.
- **Signature:** a thin accent line runs down the left edge of the page like a stage tape mark, and each setlist row has its running time or date in tabular figures, e.g. `04:12` or `14 MAR 2026`.
- **Motion:** on hover/focus a row's title shifts 8 px right and turns accent (150 ms). On load, nothing.
- **Avoid:** neon, glow, gradients, purple stage light.

## Workbench
A spec sheet on graph paper. Exact, useful, proud of the details.
- **Palette:** `--bg #F2F5F7`, `--ink #0E2A47` (blueprint navy), `--muted #4A5D70`, `--accent #C2410C` (safety orange), `--grid #0E2A47` at 7% opacity.
- **Text pairs:** ink on bg 13.3, muted on bg 6.2, accent on bg 4.7, white on accent 5.2.
- **Fonts:** IBM Plex Sans Condensed (600, 700) + IBM Plex Mono (400, for measurements, dates, versions only). `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@400;600;700&family=IBM+Plex+Mono&display=swap`.
- **Layout:** background is a 24 px graph-paper grid (`background-image` with two 1 px linear lines, the one allowed gradient use, because it draws grid lines). Masthead left, name in Plex Condensed 700 `clamp(2.6rem, 8vw, 5.5rem)`. Each work is a spec card on desktop in an asymmetric 5/7 then 7/5 split: name, what it does in one sentence, and a small spec table (`<dl>`) of real facts in Plex Mono (stack, size, users, year, status). Cards have a 1.5 px ink border and 0 radius.
- **Signature:** dimension lines. One SVG dimension marker (a line with end ticks and a label in Plex Mono, `aria-hidden`) measures the lead card's width with a real fact as the label, e.g. "2.1M rows a day" between the ticks.
- **Motion:** none on load; spec rows highlight in a 6% accent tint on hover.
- **Avoid:** fake terminal windows, code-rain, dark "hacker" mode.

## Link card
A phone-first card you'd be glad to put in your bio. Warm, direct, quick to tap.
- **Palette:** `--bg #F7F1E8`, `--ink #2A1F1A`, `--muted #6B5D52`, `--accent #8A3B5C` (plum ink; swap for their brand color if it passes 4.5:1 on bg), `--row #FFFFFF`.
- **Text pairs:** ink on bg 14.3, muted on bg 5.7, accent on bg 6.5, bg on ink 14.3.
- **Fonts:** Young Serif (400) + Instrument Sans (400, 600). `https://fonts.googleapis.com/css2?family=Young+Serif&family=Instrument+Sans:wght@400;600&display=swap`.
- **Layout:** single column, max width 520 px, centered on desktop with the page bg around it (the one look where centered is right, because it is a phone page). Name in Young Serif `clamp(2.2rem, 9vw, 3.2rem)`, one line of what they do, then a "Now" line. Then the links as full-width rows (min height 64 px, 1.5 px ink border, 14 px radius): site name in Instrument Sans 600, one muted line of why to tap, a drawn SVG arrow on the right. The single most important link is filled `--ink` with `--bg` text and sits first.
- **Signature:** the "Now" line with a real month: "Now (November 2026): restocking the winter candles, ships Dec 2." Put the month in the accent.
- **Motion:** rows press down 2 px on `:active`; nothing on load.
- **Avoid:** profile photo circles with gradient rings, emoji, follower counts they didn't give you.
