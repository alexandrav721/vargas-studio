# Five looks for a small business page

Pick ONE from the "Pick it when" line. Use it whole: palette, fonts, layout, signature, motion. The text/background pairs listed are checked at 4.5:1 or better; never put text on any other pair. Content max width 1120 px.

| Look | Pick it when the business... |
|---|---|
| Shop window | sells food or things you pick up: bakery, café, food truck, florist, deli, ice cream, farm stand |
| Route map | comes to you: dog walking, pet sitting, cleaning, lawn care, moving, handyman, mobile car wash |
| Notebook | teaches one-to-one or small groups: tutor, music teacher, language lessons, test prep, coding club |
| Studio calendar | runs classes or appointments in a room: yoga, pilates, dance, pottery classes, salon, barber, massage |
| Workshop ticket | fixes or makes things to order, or sells online: bike repair, tailoring, phone repair, framing, Etsy-style shop |

If two fit, ask: does the customer come to them, do they go to the customer, or does it ship? Room or counter wins over online.

---

## Shop window
A hand-painted shopfront and a chalk menu: warm, generous, hungry-making.
- **Palette:** `--bg #FBF6EC` (flour), `--ink #3A2414` (crust), `--muted #75573F`, `--accent #B3261E` (tomato red awning), `--kraft #E3CFA9` (paper bag, ink text only).
- **Text pairs:** ink on bg 13.5, muted on bg 6.1, accent on bg 6.1, white on accent 6.5, ink on kraft 9.5.
- **Fonts:** Chonburi (display 400) + Work Sans (400, 600). `https://fonts.googleapis.com/css2?family=Chonburi&family=Work+Sans:wght@400;600&display=swap`. Name `clamp(2.6rem, 10vw, 6rem)`, line-height 0.95.
- **Layout:** the top is a shopfront: a striped awning drawn in CSS across the full width (`repeating-linear-gradient` of accent and bg, 48 px stripes, scalloped bottom edge with a radial mask, the one allowed gradient because it depicts an awning), then name, what you get line, call-to-action, facts line. Prices are a menu board on a `--kraft` panel: item left, dotted leader, price right, in tabular figures; group by category in two columns on desktop.
- **Signature:** a "Baked today" or "Fresh this week" list with real times: "Sourdough, out at 7:30", "Cardamom buns, Sat only". If they gave sell-out info, add it in muted italic ("usually gone by 11").
- **Motion:** none on load. The call-to-action button lifts 2 px on hover with a soft shadow (`0 6px 14px rgb(58 36 20 / .18)`).
- **Placeholder style:** dashed 2 px muted border, kraft background, Work Sans italic.
- **Avoid:** cream + terracotta with a script font, cupcake clip art, emoji.

## Route map
A neighborhood map with a walking route: friendly, local, trustworthy.
- **Palette:** `--bg #F3F6F1`, `--ink #15281F`, `--muted #4D5E54`, `--green #1F5C42` (park), `--leash #F5C518` (bright yellow, buttons with ink text only).
- **Text pairs:** ink on bg 14.2, muted on bg 6.3, green on bg 7.2, white on green 7.9, ink on leash 9.5.
- **Fonts:** Gabarito (display 700, 800) + Rethink Sans (400, 600). `https://fonts.googleapis.com/css2?family=Gabarito:wght@700;800&family=Rethink+Sans:wght@400;600&display=swap`.
- **Layout:** top section split on desktop (text left 6 columns, map right 6); on phone the map sits under the button, full width. The map is an inline SVG: soft street grid lines in muted at 25% opacity, one or two green park shapes, and a dashed route path in green (stroke 4, round caps) with small dots for each neighborhood or street they named, labeled in Rethink Sans 600 at 15 px with a white halo (`paint-order: stroke; stroke: #fff; stroke-width: 5px`) so labels stay readable over the route. Keep every label inside the viewBox, use `preserveAspectRatio="xMidYMid meet"` and an `aspect-ratio` box (13/10) so nothing is cropped on phones. Services and prices below as a clean list with rules, one row per service: name, what's included in one line, price on the right.
- **Signature:** the drawn route through their real area names. Use only names they gave; if they gave none, draw the route with no labels.
- **Motion:** on load the route line draws itself once (stroke-dashoffset, 1.4 s ease-out). Dots appear after.
- **Placeholder style:** dashed 2 px green border, white background, muted italic text.
- **Avoid:** paw-print emoji or clip art, cartoon dogs, a real map embed.

## Notebook
An exercise book with a red margin line and teacher's notes: clear, caring, organized.
- **Palette:** `--bg #FFFFFF`, `--ink #1B1F3B`, `--muted #565B78`, `--red #C21F38` (margin line and marking pen), `--rule #CFE0F5` (ruled lines, no text meaning), `--hl #FFF1A8` (highlighter, ink text only).
- **Text pairs:** ink on bg 16.1, muted on bg 6.6, red on bg 5.9, white on ink 16.1, ink on hl 14.1.
- **Fonts:** Alegreya (display 800) + Alegreya Sans (400, 700) + Kalam (400, margin notes only). `https://fonts.googleapis.com/css2?family=Alegreya:wght@800&family=Alegreya+Sans:wght@400;700&family=Kalam&display=swap`.
- **Layout:** the page has a 2 px red vertical margin line 56 px from the left on desktop (24 px on phone) and faint ruled lines behind the top section only (`repeating-linear-gradient`, the one allowed gradient, because it depicts ruled paper). Content sits right of the margin. Lessons and prices as a timetable-style table: lesson type, length, who it's for, price. Booking steps as a short numbered list.
- **Signature:** teacher's margin notes in Kalam, red, slightly rotated (-2deg), in the margin beside two key facts: e.g. "first lesson free" next to the price, "ages 8 to 14" next to who it's for. Use their real facts only. One highlighter swipe (`--hl`) behind the single most important phrase.
- **Motion:** none on load; the highlighter swipe grows left to right once when it scrolls into view (`background-size` 0 to 100%, 700 ms).
- **Placeholder style:** a dashed 2 px muted box with a Kalam note "add a parent's two-line review here".
- **Avoid:** apple or graduation-cap icons, chalkboard textures, Comic Sans.

## Studio calendar
A printed class schedule on the studio wall: calm, precise, easy to plan around.
- **Palette:** `--bg #E6ECE6` (eucalyptus plaster), `--ink #1C2A23`, `--muted #4C5C53`, `--accent #A8432F` (brick, for text and thin rules), `--card #F6F8F5`.
- **Text pairs:** ink on bg 12.5, muted on bg 5.9, accent on bg 5.0, bg on ink 12.5. On `--card` use ink or muted only.
- **Fonts:** Bodoni Moda (display 500 and italic, optical size on) + Karla (400, 600). `https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,500;1,6..96,500&family=Karla:wght@400;600&display=swap`.
- **Layout:** name in Bodoni Moda `clamp(2.6rem, 9vw, 6rem)` with one word in italic. The schedule is the centerpiece: a real week grid on desktop (days as columns, classes as blocks with time in tabular Karla 600, class name in Bodoni, teacher or level in muted), turning into a day-by-day list on phone. Prices as a short list beside it: drop-in, class pack, monthly.
- **Signature:** the weekly timetable built from their real class times, with a thin accent rule marking the next class's day. If they gave spots per class, show "8 spots" in muted.
- **Motion:** none on load; schedule blocks get a 1 px accent outline on hover/focus.
- **Placeholder style:** dashed 1.5 px muted border on `--card`, Karla italic.
- **Avoid:** lotus icons, stock yoga photos, pastel gradients, purple.

## Workshop ticket
A repair tag and a parts counter: honest, quick, no-nonsense.
- **Palette:** `--bg #F4F4EF`, `--ink #222629` (steel), `--muted #5A6066`, `--yel #FFCC00` (hazard yellow, ink text only), `--acc #0B6E4F` (workshop green, links and small text).
- **Text pairs:** ink on bg 13.8, muted on bg 5.8, ink on yel 10.1, acc on bg 5.7, bg on ink 13.8.
- **Fonts:** Barlow Condensed (display 700) + Barlow (400, 600) + IBM Plex Mono (400, for ticket numbers, prices and times only). `https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&family=Barlow:wght@400;600&family=IBM+Plex+Mono&display=swap`.
- **Layout:** name uppercase in Barlow Condensed `clamp(3rem, 12vw, 7.5rem)`, line-height 0.9, on the bg, with a yellow block behind the call to action. Prices are repair tags: each service is a tag-shaped box (1.5 px ink border, a punched hole drawn with a small circle, a perforated top edge with a dotted border) holding the job, turnaround time and price in Plex Mono. Tags sit in an uneven row on desktop (different widths by content), stacked on phone.
- **Signature:** a ticket number and turnaround on every tag, using their real times: `No. 014 · Flat fix · same day · $18`. Number tags in order; they are decoration on a real price, not section numbers.
- **Motion:** tags swing 1.5deg on hover from the hole (transform-origin at the hole, 250 ms).
- **Placeholder style:** a blank tag with a dashed border and "Your first review goes here" in Plex Mono.
- **Avoid:** gear and wrench icon rows, carbon-fiber textures, dark "garage" mode.
