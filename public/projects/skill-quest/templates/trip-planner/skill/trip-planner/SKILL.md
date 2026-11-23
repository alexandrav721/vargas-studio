---
name: trip-planner
description: Plans a realistic day-by-day trip as one phone-friendly page with Google Maps links, a backup for rain, rough costs in the local currency and a packing checklist you can tick. Use when someone says "plan my trip", "make an itinerary", "what should we do in [city]", "3 days in Rome", "weekend in Chicago with the kids", "honeymoon plan", or gives a destination and dates and wants a plan.
---

# Trip planner

Make a trip plan people can actually follow on their phone: few stops a day, close together, with honest "check before you go" notes instead of made-up facts. The result is one HTML page built from `assets/trip.html`.

## 1. Get the basics (ask at most 2 questions)

You need: where, how many days (or dates), who is going, budget or style, what they like.

- If the destination or the length is missing, ask for it. Ask nothing else unless it changes the plan a lot (for example, "Are kids coming?").
- Ask both questions in one message, then wait.
- For anything else, pick a default and list it in `assumptions`: 2 adults, mid budget, a central hotel, walking plus public transport, arriving the evening before day 1.

## 2. Plan the days (the rules that make this better)

- **Pace.** At most 3 stops a day marked `"kind": "anchor"`, and only 2 if kids, older travelers or a hot month are involved. Meals and the slow morning don't count as anchors.
- **Slow morning.** Every day starts with an unhurried breakfast or coffee stop (`"kind": "slow"`). No sight before about 9:30.
- **One area per day.** Group each day's stops in one neighborhood or two that touch. Name it in `area`. Don't zigzag across the city.
- **Travel time.** Put a `{"move": "..."}` line between stops that are more than a few minutes apart: "15 min walk", "25 min by metro". Keep each move under about 30 minutes. A day trip out of town counts as the whole day.
- **First and last day are light.** Arrival day: one easy stop and dinner. Departure day: breakfast, one stop near the hotel, then leave time to get to the airport or station.
- **Rain plan.** Every day gets one indoor `rain` option in the same area.
- **Kids.** Add a rest or playground stop after lunch and keep moves short.
- **Free time.** Leave at least one afternoon or evening open on trips of 4 days or more ("Free afternoon: wander, nap, shop").
- **Match their taste.** If they said "no museums", use at most one, and only as a rain option.

## 3. Be honest about places

- Use well-known places you are confident exist: major sights, famous markets, named neighborhoods, well-known streets and parks. Never invent a restaurant, shop or venue. For meals, describe the type and area ("dinner in Trastevere, many trattorias") with a map search like `trattoria Trastevere Rome`.
- Never state exact opening hours, prices or that something is open on a given day as fact. When it matters (closed days, timed tickets, reservations, seasonal closures, religious dress codes), add a `check` line: "Often closed on Mondays. Check before you go." or "Timed tickets usually sell out. Book on the official site."
- `map` is a Google Maps search phrase: the place name plus the city, for example `Colosseum Rome`. Never write street addresses.
- Costs are ranges in the local currency (ISO code in `currency`, for example EUR, JPY, MXN). Cover lodging, food, local transport, tickets. They are rough estimates; say so in `costNote`. Don't include flights unless asked.

## 4. Build the page

1. Read `assets/trip.html` in this skill's folder.
2. Copy it exactly. Change only the JSON inside `<script type="application/json" id="trip">`. Don't edit the CSS or JavaScript; they draw the day lines, map links, route links, cost totals, saved ticks and print layout.
3. Output the full file as one HTML artifact (in Claude.ai) or save it as `trip-plan.html` (in Claude Code or other file tools).
4. If you can't read the asset, build one self-contained HTML page with the same sections, in the same order, following the same rules.

### Data fields

- `lang`: page language code ("en", "es"...). Write the plan in the language the user wrote in.
- `title`: short, like "Rome, 4 days with a 9 year old". `subtitle`: dates, who, budget.
- `currency`: ISO code of the destination's currency.
- `assumptions`: 1 to 4 short lines with the defaults you picked.
- `days[]`: `label` ("Day 1"), `date` ("Tue 2 Jun", or leave "" if no dates), `area`, `mode` ("walking", "transit" or "driving", used for the route link), `getting` (how they move that day, one line), `stops[]`, `rain`.
- Each stop: `when` (Morning, Late morning, Lunch, Afternoon, Evening), `kind` ("slow", "anchor", "food" or "free"), `title`, `note` (1 or 2 short sentences: what to do and roughly how long), `map`, optional `check`.
- A move between stops: `{"move": "20 min walk"}`.
- `rain`: `title`, `note`, `map`, optional `check`.
- `warnings`: 3 to 6 trip-wide "check before you go" lines (bookings to make ahead, closing days, holidays, strikes or seasonal things to look up, local transport card, tipping or cash habits). Phrase each as something to check, not a fact.
- `costs[]`: `item`, `for` ("2 people, 4 nights"), `low`, `high` as plain numbers. The page adds the total.
- `costNote`: one sentence saying these are estimates.
- `checklist[]`: groups `{"group": "...", "items": [...]}`. Always "Before you go" (each booking from the plan, travel insurance, documents, bank card abroad, offline map) and "Pack" (fit the season, the walking, the plug type, anything for kids). 6 to 12 items per group.

Keep JSON valid: double quotes, no trailing commas, no line breaks inside strings, never the text `</script>`.

## 5. Write like a person

Short, plain sentences. No "vibrant", "hidden gem", "nestled", "bustling", "must-see", "iconic", "charming", "breathtaking", "immerse", "unforgettable". No em dashes. Say what they will do and see: "Walk the top deck of the bridge for the view", not "Experience the breathtaking views".

## 6. In the chat

Before the artifact: one line saying what you made and the defaults you assumed. After it: one line inviting a change ("Want a slower day, a day trip, or different food?"). Nothing else.

## 7. Check before you send

- [ ] No day has more than 3 anchors (2 with kids or older travelers), and every day has a slow morning, an area and a rain option.
- [ ] Moves are listed and each is under about 30 minutes.
- [ ] Day 1 and the last day are light.
- [ ] Every place is well known and real; meals are areas, not invented restaurants.
- [ ] No exact hours or prices stated as fact; risky things carry a `check` line.
- [ ] Every `map` is "place + city"; no street addresses.
- [ ] Costs are low/high numbers in the local currency, called estimates.
- [ ] The checklist includes every booking the plan relies on.
- [ ] The JSON is valid and the rest of the template is untouched.
- [ ] None of the banned words, no em dashes.
