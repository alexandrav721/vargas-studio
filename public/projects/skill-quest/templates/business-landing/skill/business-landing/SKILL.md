---
name: business-landing
description: Makes a one-page website for a small local or online business (bakery, café, dog walker, cleaner, tutor, yoga or art studio, salon, repair shop, handmade shop) as a single ready-to-share HTML file that looks designed by a person and is built to get bookings. It puts what you get, prices, how to book and your hours in the order customers need them, repeats one clear booking button, and never invents reviews or logos. Use when someone says "make a website for my business", "landing page for my bakery / dog walking / tutoring / studio", "page for my small business", "I need a site so people can book me", "website for my side hustle", or "a page with my prices and hours".
---

# Small business page

Plain AI makes the same business page every time: a centered hero saying "Welcome to X, where quality meets passion", three icon cards ("Quality", "Trust", "Care"), invented five-star testimonials from "Sarah M.", a purple gradient, Inter, and a "Contact us" form that goes nowhere. Customers can't find the price or how to book. Your page must look like a local designer made it for this business, and a stranger on a phone must know within 10 seconds what they get, what it costs and how to book.

## 1. Get the facts (at most 3 questions, once)

You need three things. Ask only for what is missing, all in one short message, then wait:
1. What you sell, to whom, and where (business name, your name, the area or the online shop).
2. Prices and hours (even rough: "from $24", "Mon to Fri 9 to 5").
3. How people book or buy (text, call, email, a booking link, walk in, a shop link).

If they gave most of it, or say "just make it", do not ask. Never invent facts. A missing detail becomes a short, clearly marked slot like `[price]` and goes in your reply's list.

## 2. Pick one look

Read `references/looks.md` and choose ONE direction from its "Pick it when" lines, based on the kind of business, not at random. Use its palette, fonts, layout and signature detail exactly. If the owner names their colors, swap the accent only if it keeps the listed contrast. Say which look and why in one line of your reply.

## 3. Choose the one call to action

Pick the single action a new customer should take, from what they told you: "Text Dani to book", "Order a cake", "Book a free trial lesson", "See this week's classes". Write it as a verb plus the real thing, 2 to 5 words. Use the exact same words on every button. Link it to the real thing: `sms:` or `tel:` with their number, `mailto:` with a subject and a short body template that asks for what they need to know (use `%0A` for new lines), or their booking or shop URL. If they gave nothing, link to the `#book` section.

## 4. Sections, in this order (skip any you have nothing real for)

1. **Top.** Business name, then one line saying what you get, for whom, and where, in plain words ("Small-group dog walks in Jamaica Plain, weekdays and Saturday mornings"). The call-to-action button. Under it, one line of key facts: starting price, area or address, days open. Left-aligned, with the look's signature visual beside or behind it. No slogan, no welcome.
2. **What you get.** The offer made concrete: what actually happens or what's in the box, in their words and numbers ("Max 4 dogs per group. A GPS map and a photo after every walk."). A short list or the look's menu layout, never three icon cards.
3. **Prices.** Every price they gave, in a menu or price-list layout with tabular figures and dotted leaders or rules. Use "from $X" if prices vary. Add-ons on their own lines. If no prices were given, one line: "Prices on request" plus the call to action.
4. **Who it's for.** Two or three lines from their answers, including who it is not for or a real limit ("Dogs over 1 year. Puppies get their own drop-in visits."). Skip if nothing real.
5. **Proof.** Only real proof they gave: certifications, insurance, years running, number of customers, a press mention, real reviews with the name they gave. Never invent a review, star rating, customer count, logo or "as seen in". If they have no reviews, add two clearly marked empty spots in the look's placeholder style: a dashed-border box saying "Your first review goes here. Ask a regular for two sentences and their first name." These are honest and they are meant to be filled.
6. **How to book.** The real steps, numbered only because order matters (2 to 4 steps, e.g. "Text 617-555-0143", "Free meet-and-greet", "First walk"). The call-to-action button again.
7. **Where and when.** Hours as a real table (`<table>` or `<dl>`) with days and times, the area served or the address with a plain "Open in Maps" link (`https://www.google.com/maps/search/?api=1&query=` plus the encoded address), and any notice they gave (holidays, booking lead time).
8. **FAQ, only if useful.** 2 to 4 questions a customer would really ask, answered only from their facts (rain, cancellations, allergies, parking, what to bring). Use `<details>`/`<summary>`. If you'd have to invent answers, leave the FAQ out.
9. **Footer.** The call-to-action one last time as a sentence with the link, name, area, and the phone or email written out.

On phones add a slim bar fixed to the bottom with the same call-to-action button. It appears after the top section scrolls away (IntersectionObserver), and the page has enough bottom padding that it never covers content.

Never add: a contact form (it can't send anything from a single file), "Why choose us" icon cards, a mission statement, a team section they didn't ask for, a newsletter box, social icons as emoji, client logos, a stats row with big numbers.

## 5. Write the words

Read `references/copy.md` and follow it. Their numbers and names beat adjectives, one voice (theirs), sentence case, short lines, no AI words. Total copy under 400 words.

## 6. Build it (exact output)

One complete HTML file, delivered as one artifact or code block:
- `<!doctype html>`, `<html lang="en">`, charset, `<meta name="viewport" content="width=device-width, initial-scale=1">`, `<title>` "Business name, what it is, area", one-sentence `<meta name="description">`.
- A `<script type="application/ld+json">` LocalBusiness block with only the real facts (name, phone, email, area or address, hours, price range).
- Fonts: the look's Google Fonts `<link>` only, with a fallback stack. No other external files, scripts, frameworks, icon fonts, or stock images.
- All CSS in one `<style>`, colors as custom properties named by role. Only use the text/background pairs listed in the look (checked for 4.5:1).
- Semantic HTML: `header`, `main`, one `h1`, `section`s with `h2`s, `footer`. Real `<a href>` for every call to action, `<button>` only for in-page actions. Tap targets at least 44 px.
- Spacing: the width wrapper sets only `padding-inline`, sections set only `padding-block` (a `padding: 56px 0` shorthand on a section silently wipes the side gutters). Put dividing rules on the section, not on a full-bleed element.
- Mobile first: at 375 px no sideways scroll, prices and hours stay readable, the call to action is visible on the first screen. From 760 px, the look's desktop layout. Content max width 1120 px.
- Craft details: `:focus-visible` outline in the accent, `::selection` in the look's colors, `text-underline-offset: .2em`, `font-variant-numeric: tabular-nums` on prices and times, `text-wrap: balance` on headings, `scroll-behavior: smooth` only under `prefers-reduced-motion: no-preference`.
- Motion: only the look's one motion moment, inside `@media (prefers-reduced-motion: no-preference)`. Everything is visible without it.
- Pictures: if they gave image links, use them with alt text describing the real thing. Otherwise use the look's drawn SVG (simple, one stroke weight, `aria-hidden`) and, where a photo belongs, a fixed aspect-ratio frame labeled "Photo of [the real thing] goes here" with an HTML comment showing how to swap in an `<img>`.

## 7. Hard rules

- Banned looks: centered hero with two buttons, three same-size icon cards, purple or indigo, decorative gradients, glass or blur, glow, blobs, hard offset shadows, every corner the same big radius.
- Banned type: Inter, Roboto, Arial, Helvetica, Poppins, Montserrat, Open Sans, Space Grotesk, or system-ui as the display face.
- Banned labels: no small uppercase eyebrow text above headings, no 01/02/03 section numbers (booking steps may be numbered), no emoji anywhere.
- Banned content: fake testimonials, star ratings, customer counts, logos, awards or "trusted by"; lorem ipsum; unmarked placeholders; a second competing call to action ("Learn more", "Contact us" next to "Book").

## 8. Self-check before you answer
- Breathing room: any box with a border, outline or colored background has at least 12px of space between its text and its edge (16px on desktop).

Look at it at 375 px and desktop as a customer, then as a designer. Fix and re-check:
1. Could a competitor paste the top line onto their site unchanged? It must be no.
2. In 10 seconds on a phone, can you tell what you get, the starting price and how to book?
3. Is there one call to action, with the same words everywhere, linked to something real?
4. Is the type the look's pair, the palette the look's, with no purple and no gradient?
5. One clear main idea at the top, not equal cards? No glass, glow, blobs, eyebrows, emoji?
6. Is every review, number and logo real, and every empty spot clearly marked?
7. Are the hours and prices in real tables or lists with tabular numbers?
8. Would a designer believe a person made this for this business? If it looks like a template, rework the top section and the price list first.

## 9. Your reply

The HTML file, then at most 5 lines: the look and why; the call to action you chose; the slots left to fill (like `[price]` or the review spots); how to swap in photos; and that they can publish it as an artifact or upload the file to any host.
