---
name: habit-tracker
description: Builds a working habit tracker app in one HTML file, with one-tap check-ins, forgiving streaks (one missed day is covered by a "return ticket"), a month calendar, gentle stats, edit and delete, and backup to a file. Use when someone says "make me a habit tracker", "track my habits", "I want to drink more water / read more / work out every day", "streak tracker", "daily checklist app", "help me build a routine", or lists things they want to do every day.
---

# Habit tracker

You build one HTML file: a calm habit tracker set up with the user's habits. A tested starter app is in `assets/habit-tracker.html`. Your job is to set it up well. The app already does the rest: one-tap check-ins, streaks with a return ticket, the month grid, stats, add/edit/delete, color picker, export and import, saving with a warning when the browser blocks storage, sound and a tiny buzz on check-in, dark mode, keyboard and screen reader support.

## 1. Read what they want (ask nothing unless you must)

- **They named habits:** build right away. Don't ask questions.
- **They named nothing** ("make me a habit tracker"): build right away with the 3 sample habits already in the starter. Say they can delete them.
- **Only ask** (one short question) if a habit is so vague you can't name it, for example "be better". Even then, offer a guess: "Want me to use 'Write 3 things I'm grateful for'?"

## 2. Turn their words into good habit names

Each habit is a short action you can tick off today. Rules:
- Start with a verb. Keep it under 30 characters. Sentence case.
- Keep their numbers: "read 20 minutes" stays "Read for 20 minutes".
- If they gave no amount, add a small, doable one only when the habit needs it to be checkable: "drink more water" becomes "Drink 8 glasses of water", "exercise" becomes "Move for 20 minutes". "Stretch" can stay "Stretch".
- One habit per idea. Split "read and journal" into two.
- Up to 12 habits. If they list more than 6, build them all, and suggest in one line that starting with 3 works better.
- Habits that aren't daily ("gym 3 times a week") are still daily check-ins here. Mention in one line that the return ticket covers rest days.

## 3. Fill the setup block

1. Open `assets/habit-tracker.html`. Copy it exactly.
2. Replace only the JSON inside `<script id="setup" type="application/json">`. Keep every other line.
3. Fill it (valid JSON, double quotes, no trailing commas):

```json
{
  "title": "My habits",
  "color": "tide",
  "sample": false,
  "habits": [
    {"name": "Drink 8 glasses of water", "color": "tide"},
    {"name": "Read for 20 minutes", "color": "ochre"}
  ]
}
```

- `title`: "My habits", or "Sam's habits" if they gave a name, or their own title if they asked for one. Max 32 characters.
- `color` (their personal color) and each habit `color` must be one of: `moss`, `tide`, `clay`, `ochre`, `rose`, `slate`. If they mention a favorite color, map it (green to moss, blue to tide, orange or red to clay, yellow to ochre, pink to rose, purple or grey to slate). Otherwise pick a color that fits each habit (water = tide, reading = ochre, outdoors or plants = moss, body or movement = clay, sleep = slate, kindness or people = rose) and give every habit a different color when you can.
- `sample`: `false` when the habits came from them, `true` only when you kept the starter's samples.
- Don't invent past check-ins. Every habit starts fresh today.

Output the whole file as one HTML artifact (or a file named `habit-tracker.html` if you can create files). Never send only the JSON or a snippet that says "rest stays the same".

If the starter file can't be read, build the same app from scratch with the same features and rules below.

## 4. Hard rules (if you change or rebuild anything)

- One file. All CSS and JS inline. No outside scripts, images or network calls. A Google Fonts link is the only allowed outside file.
- Every `localStorage` read and write sits in try/catch. If storage is blocked, the app still works and shows the yellow "isn't saving" note.
- Streak rule stays exactly: 1 return ticket at most; it covers one missed day; 7 check-ins after using it earn it back; two misses in a row end the streak; today not done yet never breaks a streak.
- No guilt words: never "failed", "broke", "lost". Missed days are just empty.
- Real buttons with labels, visible focus, text contrast at least 4.5:1, works at 375 px wide, honors reduced motion.
- No purple gradients, glow, glass effects, or emoji as icons.

## 5. Check before you answer

- The setup JSON parses, every color is one of the six names, every name is under 40 characters.
- Picture it at 375 px: each habit name fits on two lines at most.
- Tapping a habit checks it, tapping again unchecks it; the dots menu opens edit with delete; Settings has export, copy, import and start over.
- Nothing outside the setup block changed (unless you had to rebuild).

## 6. Your reply

Short and friendly:
- One line: what you set up ("Your tracker with water, reading and stretching").
- How it works in 3 short lines: tap a habit to check it off; miss one day and your return ticket saves the streak; tap a past day on the calendar if you forgot.
- One line: "Your check-ins stay in this browser. Use Settings, then Export, to back them up."
- If a yellow "isn't saving" note shows where they opened it, they can download the file and open it in their browser instead.
No feature list, no recap of the code.
