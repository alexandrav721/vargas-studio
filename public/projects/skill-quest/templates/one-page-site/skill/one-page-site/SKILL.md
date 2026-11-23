---
name: one-page-site
description: Makes a one-page personal website (portfolio, about-me page or link-in-bio) as a single ready-to-share HTML file that looks designed by a person, not generated. The page is built around the person's real work, with a typeface and colors from their world, their own facts and numbers, and an obvious way to reach them. Use when someone says "make me a website", "personal website", "portfolio site", "a page to show my work", "about me page", "link in bio page", "one-page site", "site for my art / photos / music / writing / freelance work", or "I need somewhere to send people".
---

# My one-page website

Plain AI makes the same personal site every time: a centered hero with "Hi, I'm X" and two buttons, three icon cards for "services", a purple gradient, Inter, and copy like "Passionate creative crafting meaningful experiences". Nobody remembers it. Your page must look like a designer met this person and built it around what they actually make.

## 1. Get the facts (at most 3 questions, once)

You need three things. Ask only for what is missing, all in one short message, then wait:
1. Who you are and what you do (name, what you make or do, where, for how long).
2. Three things you've done or made (a name, a year, a number, who it was for, a link or photo if they have one).
3. How people should reach you (email, and any links: shop, Instagram, booking).

If they already gave most of it, or say "just make it", do not ask. Build with what you have. Never invent facts: a missing detail becomes a short, clearly marked slot like `[year]` inside the caption, listed in your reply.

## 2. Pick one look

Read `references/looks.md` and choose ONE direction from the "Pick it when" lines, based on what the person makes, not at random and not by default. Use its palette, fonts, layout and signature detail exactly. If their answers name colors from their world (a glaze, a band's album, a uniform), swap the accent for that color only if it keeps the listed contrast. Say which look you picked and why in one line of your reply.

## 3. Plan the page around the work

The work is the page. Build in this order and add nothing else:
1. **Masthead.** Their name as the h1, then one line saying what they do in plain words with one specific (place, medium, years, a client). A small contact link sits in the top corner from the first screen. No two-button hero, no "Hi, I'm", no tagline that any other person could use.
2. **The work.** The three things, laid out the way the look says. Make one of them the lead (bigger, first). Each gets a real caption: what it is, when, and one concrete fact (a number, a place, who it was for, what happened). This section takes more space than everything else together.
3. **About.** 40 to 80 words, first person, their voice. Include one opinion or one thing they don't do ("I don't do logos." "No digital prints, only the real paper."). Facts from their answers only.
4. **Contact.** The email written out as visible text and as a `mailto:` link, a "Copy email" button, and their other links as plain text links with the site named ("Instagram, @handle"). One line saying what to get in touch about and any real timing they gave ("Commissions open from March").
5. **Footer.** One line: name, city, year. Nothing more.

Never add: a services grid, skills bars or percentages, a stats row, testimonials, client logos, a newsletter box, a blog teaser, "Let's work together!" banners, a dark-mode toggle, or a nav menu (a one-page site with five short parts needs none; the corner contact link is enough).

**Link-in-bio** requests (mostly links, little work to show): use the Link card look and turn each link into a large row with the site name and one line on why to tap it. Same rules otherwise.

## 4. Pictures

- If they gave image links, use them with `alt` text that describes the actual piece ("Wide celadon bowl with a dark iron rim, about 30 cm across").
- If not, never use stock photos, AI-drawn people, or emoji, and never leave big empty boxes (a wall of blank frames looks unfinished). Fill each frame (fixed `aspect-ratio`, the look's frame color) with a stand-in that carries information, and make the three stand-ins different from each other:
  - the lead piece: a simple drawn SVG of the real thing in the accent (a pot's profile, a book's spread, a floor plan, a waveform), one stroke weight, `aria-hidden="true"`, filling about 80% of the frame;
  - the others: their key number set huge in the display face and the accent ("120" with "plates, five months" under it), or a short real quote from the person.
  - no visible "photo coming" or "placeholder" text anywhere: the stand-in must look finished on its own, as if it were the intended design. Put only an HTML comment above each frame: `<!-- Swap in your photo: <img src="your-photo.jpg" alt="..."> -->`.
  Do not repeat the caption's title inside the frame. The caption under it is still full and real.

## 5. Write the words

Read `references/copy.md` and follow it. The short version: their facts and numbers beat adjectives, one point of view, sentence case, short sentences, no AI words, almost no em dashes. Total page copy under 300 words.

## 6. Build it (exact output)

One complete HTML file, delivered as a single artifact or code block, nothing else needed to open it:
- `<!doctype html>`, `<html lang="en">`, `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, a `<title>` of "Name, what they do" and a one-sentence `<meta name="description">`.
- Fonts: the look's Google Fonts `<link>` (only the weights you use, `display=swap`) with a fallback stack. No other external files, scripts, frameworks, icon fonts or images you made up.
- All CSS in one `<style>`, colors as custom properties named after the look's roles (`--bg`, `--ink`, `--muted`, `--accent`, ...). Only use the text/background pairs listed in the look; they are already checked for 4.5:1 contrast.
- Semantic HTML: `header`, `main`, one `h1`, `section`s with `h2`s, `footer`. Real `<a href>` for links and `<button>` for the copy button. Tap targets at least 44 px tall.
- Spacing: the width wrapper sets only `padding-inline`, sections set only `padding-block` (a `padding: 56px 0` shorthand on a section silently wipes the side gutters). Put dividing rules on the section, not on a full-bleed element.
- Mobile first. At 375 px wide: no sideways scrolling, the name fits (use `clamp()` and `overflow-wrap: anywhere` on long names), work stacks in one column. From 760 px: the look's desktop layout. Max content width as the look says.
- Craft details: links underlined with `text-underline-offset: .2em`, `:focus-visible` outline in the accent, `::selection` in the look's colors, `font-variant-numeric: tabular-nums` on years and numbers, `text-wrap: balance` on headings.
- Motion: only the look's one motion moment, inside `@media (prefers-reduced-motion: no-preference)`. Content is visible without it.
- JS: only the copy-email button (under 15 lines, `navigator.clipboard.writeText`, then the button says "Copied" for 2 seconds; if clipboard fails, select the email text). Nothing else.

## 7. Hard rules

- Banned looks: centered hero with two buttons, three same-size icon cards, purple or indigo, gradients of any kind on text or backgrounds, glass or blur, glow, blobs, floating tilted mockups, hard offset shadows, every corner the same big radius.
- Banned type: Inter, Roboto, Arial, Helvetica, Poppins, Montserrat, Open Sans, Space Grotesk, system-ui as the display face.
- Banned labels: no small uppercase "eyebrow" text above headings, no 01/02/03 section numbers, no emoji anywhere.
- Banned content: invented clients, numbers, quotes, awards or logos; lorem ipsum; "[Your Name]" style placeholders left unmarked.

## 8. Self-check before you answer
- Breathing room: any box with a border, outline or colored background has at least 12px of space between its text and its edge (16px on desktop).

Look at the page as a designer would at 375 px and at desktop. Fix anything that fails, then check again:
1. Could another person paste the masthead line onto their own site unchanged? It must be no.
2. Is the first screen about this person's work, not a generic welcome? On a 1280 x 800 screen the top of the lead piece must show.
3. Is the typeface the look's pair, not a default? Is the palette the look's, with no purple and no gradient?
4. Is there one clear lead piece, not equal cards?
5. Are there no glass, glow, blobs, eyebrow labels, emoji or section numbers?
6. Are all pictures real (theirs) or honest frames, with no stock or AI people?
7. Does every caption hold at least one real fact from their answers?
8. Can you find and copy the email in under 5 seconds on a phone?
9. Would a designer believe a person made this? If it looks like a template, change the layout of the work section first.

## 9. Your reply

Keep it short: the HTML file, then at most 4 lines: the look you picked and why; anything you marked as a slot to fill (like `[year]`); how to swap in photos ("search the file for `Swap in your photo` and replace the drawing with your image"); and that they can publish it as an artifact or upload the file to any host.
