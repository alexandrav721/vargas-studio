---
name: meal-plan
description: Makes a week of dinners (and lunches if asked) plus one merged grocery list grouped by store aisle, as a phone-friendly page with tick boxes. Reuses ingredients to cut waste and cost, plans leftovers, keeps weeknights to 30 minutes and follows every allergy and diet strictly. Use when someone says "meal plan", "what should we eat this week", "dinner ideas for the week", "grocery list", "shopping list for meals", "cheap family dinners", "meal prep", or lists who they feed, a budget and food limits.
---

# Meal plan + grocery list

Make a week of meals a tired person can actually cook, and a grocery list they can shop from in one pass. The result is one HTML page built from `assets/meal-plan.html`.

## 1. Get the basics (ask at most 2 questions)

You need: how many people (and ages of kids), allergies and diet limits, budget, time on weeknights, what they like or hate.

- Allergies are the one thing you never guess. If they mention kids or a family but say nothing about allergies, ask: "Any allergies or foods to avoid?" If they give a budget and people, ask nothing else.
- Ask at most 2 questions in one message, then wait.
- Otherwise use these defaults and list them in `assumptions`: 7 dinners, no lunches, 2 adults, a mid budget for their country, 30 minutes on weeknights, one longer cook on Sunday, a normal supermarket, the user's local currency and units.

## 2. Plan the week (the rules that make this better)

- **Allergies and diets are absolute.** Not one ingredient, garnish, sauce or swap may break them. Watch the hidden ones: peanut in satay, some curry pastes and baked goods; tree nuts in pesto; gluten in soy sauce, stock cubes and breadcrumbs; dairy in bread and margarine; fish in Worcestershire and Caesar dressing; gelatin and rennet for vegetarians. List each rule in `safety.rules` in plain words ("No peanuts or peanut oil in any recipe") and list the store-bought items that need a label check in `safety.labels`.
- **Reuse ingredients.** Build the week around 3 to 5 core ingredients that each appear in 2 or more meals (a pack of chicken thighs over two dinners, one bunch of cilantro in three). Avoid buying an item for a single small use; if you must, use the rest elsewhere.
- **Cook once, eat twice.** At least 2 meals make extra on purpose (`"type": "double"`, with a `note` saying where the extra goes) and later meals use it (`"type": "leftover"`, 10 minutes or less). A leftover can be the same dish or a new one ("Sunday's roast chicken in Tuesday's tacos"). Keep cooked leftovers within 3 days and say to reheat until hot all the way through.
- **Time.** Monday to Friday meals take 30 minutes or less, start to table. One weekend meal can take longer. Use the Sunday prep to cut weeknight time.
- **Taste and family.** Use what they like at least 4 times in the week. If kids are named, keep heat mild with a spicy option for adults on the side.
- **Budget.** Estimate each grocery item's price for where they live, in their currency. The total must fit the budget. If it can't, say so and cut cost (beans, eggs, frozen veg, cheaper cuts) rather than pretending.
- **Fresh food first.** Use the most perishable things (fish, soft herbs, salad leaves) early in the week and the sturdy ones (roots, cabbage, canned and frozen) later.
- Use common dishes and real cooking methods. Keep each recipe to 3 to 6 short steps.

## 3. No health claims

Don't say a meal is healthy, balanced, high in protein, good for weight loss, or anything about calories or nutrients, unless the user asks; even then, give no medical advice. The page already says it is a cooking plan, not medical advice. For a serious allergy, the page tells them to read labels; don't promise anything is "safe".

## 4. Build the page

1. Read `assets/meal-plan.html` in this skill's folder.
2. Copy it exactly. Change only the JSON inside `<script type="application/json" id="plan">`. Don't edit the CSS or JavaScript; they build the week view, the "buy once, use all week" strip, saved ticks, budget total, the copy-list button and print layout.
3. Output the full file as one HTML artifact (in Claude.ai) or save it as `meal-plan.html` (in Claude Code or other file tools).
4. If you can't read the asset, build one self-contained HTML page with the same sections, in the same order, following the same rules.

### Data fields

- `lang`, `title` (like "Dinners for 4, peanut-free"), `subtitle` (people, diet, budget, time), `currency` (ISO code), `budget` (number or null), `assumptions` (1 to 4 lines).
- `safety.rules`: one line per allergy or diet. `safety.labels`: store-bought items in this plan to check (tortillas, stock, sauces, bread, chocolate). If there are no limits, write one rule: "No allergies or diets given."
- `meals[]` in eating order: `day` ("Mon"), `meal` ("Dinner" or "Lunch"), `name`, `minutes` (total, start to table), `serves`, `type` ("cook", "double" or "leftover"), optional `note`, `uses`, `ingredients`, `steps`.
- `uses`: the main grocery items in this meal, spelled exactly as in `groceries` (the page matches them to show reuse). Skip pantry items.
- `ingredients`: amounts for this meal ("600 g chicken thighs"). `steps`: short, with times.
- `prep[]`: `task`, `minutes`. 3 to 6 Sunday tasks totaling 60 to 90 minutes (cook grains, chop onions, marinate, make a sauce, wash greens). Each task must save time on a named weeknight.
- `groceries[]`: `aisle` and `items` with `name`, `qty` (a buyable amount: "2 cans", "1 kg pack", "1 bunch"), `est` (number). One line per item for the whole week, quantities added up. Aisles in store-walk order: Produce, Meat and fish, Dairy and eggs, Bakery, Canned and dry, Spices and sauces, Frozen, Other.
- `pantry`: staples the recipes need that most homes have (oil, salt, pepper, flour, sugar, common dried spices, soy sauce). These are not on the grocery list.
- `estNote`: one sentence saying prices are estimates.

Keep JSON valid: double quotes, no trailing commas, no line breaks inside strings, never the text `</script>`.

## 5. Write like a person

Short, plain words. No "delicious", "vibrant", "flavor-packed", "wholesome", "guilt-free", "elevate", "hearty" or "family favorite". No em dashes. Dish names say what it is: "Chicken and black bean tacos", not "Fiesta Taco Night".

## 6. In the chat

Before the artifact: one line saying what you made and any default you assumed, plus the allergy rule you followed ("Every recipe is peanut-free"). After it: one line inviting a swap ("Want to swap a meal or change the budget?"). Nothing else.

## 7. Check before you send

- [ ] Re-read every ingredient, sauce and garnish against each allergy and diet. Zero exceptions.
- [ ] Every risky store-bought item is in `safety.labels`.
- [ ] At least 3 grocery items are used in 2 or more meals, and `uses` names match `groceries` exactly.
- [ ] At least 2 "double" meals, each feeding a later "leftover" meal within 3 days.
- [ ] Every Monday to Friday meal is 30 minutes or less.
- [ ] The grocery list covers every ingredient not in `pantry`, merged with totals, and the estimate fits the budget (or the chat says it doesn't).
- [ ] No health, nutrition or calorie claims.
- [ ] The JSON is valid and the rest of the template is untouched.
- [ ] None of the banned words, no em dashes.
