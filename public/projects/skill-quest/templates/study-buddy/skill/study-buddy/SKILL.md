---
name: study-buddy
description: Turns someone's study notes (or a topic) into a playable quiz and flashcard app in one HTML file. Questions test understanding with mixed formats, explain every answer, and bring missed questions back until they stick. Use when someone says "quiz me on my notes", "make flashcards from this", "help me study", "turn my notes into a quiz", "make a practice test", "I have an exam on...", or pastes class notes and wants to revise.
---

# Study buddy

You build one HTML file: a quiz and flashcard app made from the user's notes. A tested starter app is in `assets/study-buddy.html`. Your job is the questions. The app already does the rest (mixed formats, feedback, missed ones come back, simple spaced repetition across visits, score, finish screen, sound toggle, keyboard keys, saving with a fallback when storage is blocked).

## 1. Get the material (ask at most 2 quick questions)

- **Notes pasted:** start building. Don't ask anything.
- **Only a topic** (for example "the French Revolution"): ask once, "Can you paste your notes or the page you're studying? Then every question matches what your teacher covers." If they say no or just want to go, write a short notes summary (10 to 20 plain bullet points, the level they mention or high school if unsure), show it to them first, and build only from that summary.
- If they mention a test date, a level, or a focus, use it. Don't ask for these.

## 2. Write the questions

Read the notes twice. Make a list of the facts and ideas the notes actually state. Then write:

- **Questions:** 1 per idea worth knowing, usually 10 to 15 (fewer for short notes, never more than 20). Mix the formats: about half multiple choice, a quarter fill in, a quarter true or false.
- **Flashcards:** 6 to 15 key terms, names or dates with a short back (under 20 words).

Make questions test understanding, not just memory. In every set include:
- at least 3 "why" or "what causes" questions,
- at least 2 "what would happen if" or "which example fits" questions that apply an idea to a new case,
- at least 1 question that compares or orders two things from the notes.
Plain recall ("In what year...") is fine for at most a third of the set.

Format rules:
- **Multiple choice:** 4 options, one clearly right. Wrong options are real mix-ups a student would make (a nearby date, the other person, the cause swapped with the effect), never jokes or "all of the above". Keep all 4 about the same length so the answer doesn't stand out.
- **Fill in:** the blank is one word or a short name. Put `___` where it goes. Add common spellings and short forms to `accept` (for example "Robespierre", "Maximilien Robespierre").
- **True or false:** the false ones change one real detail; the `why` says what is actually true.
- **`why`:** one or two short sentences that teach, written to a friend. Not "Correct!" and not a repeat of the question.
- **`from`:** a short quote or close paraphrase from the notes (under 20 words) that backs the answer.

## 3. Hard rules about facts

- Every fact comes only from the notes (or the summary they saw). Don't add outside facts, even true ones.
- If a note is unclear, contradicts itself, or could be read two ways, skip it. Don't guess.
- If the notes have a clear mistake, don't quiz it. Mention it in one line in your reply.
- No trick questions. No questions about the notes themselves ("What is the third bullet?").

## 4. Build the file

1. Open `assets/study-buddy.html`. Copy it exactly.
2. Replace only the JSON inside `<script id="deck" type="application/json">`. Keep every other line as it is.
3. Fill it like this (valid JSON: double quotes, no trailing commas, escape any `"` inside text as `\"`):

```json
{
  "title": "The French Revolution",
  "subtitle": "From your history notes",
  "questions": [
    {"type": "mc", "q": "...", "options": ["...", "...", "...", "..."], "answer": "exact text of the right option", "why": "...", "from": "..."},
    {"type": "fill", "q": "The ___ was stormed on 14 July 1789.", "answer": "Bastille", "accept": ["the Bastille"], "why": "...", "from": "..."},
    {"type": "tf", "q": "a statement", "answer": false, "why": "...", "from": "..."}
  ],
  "cards": [{"front": "Estates-General", "back": "..."}]
}
```

- `title`: the topic in 1 to 4 words. `subtitle`: "From your ___ notes".
- `answer` for multiple choice must match one option exactly, character for character.
- Don't number the questions; the app shuffles them.
- Output the whole file as one HTML artifact (or a file named `<topic>-study-buddy.html` if you can create files). Never send only the JSON or a "rest stays the same" snippet.

If the starter file can't be read, build the same app from scratch: same features, one file, no outside scripts, a Google Fonts link at most.

## 5. Check before you answer

- Every `answer` in multiple choice is one of its `options`. Every fill-in `q` has `___`. True or false `answer` is `true` or `false`, not a string.
- Count the mix: understanding questions are at least two thirds.
- Pick 3 questions at random and find the fact in the notes. If you can't, delete the question.
- The JSON parses (no stray quotes, no comments, no trailing commas).
- Picture it at 375 px wide: long options wrap, no word is wider than the screen (break very long terms with a space or a hyphen if needed).
- Nothing outside the deck block changed. Storage code still sits inside try/catch.

## 6. Your reply

Keep it short:
- One line: what's in it (for example "14 questions and 10 flashcards from your notes").
- One line on how to use it: "Press Quiz me. Keys 1 to 4 pick an answer, T or F for true or false, Enter for next. Anything you miss comes back."
- If you skipped unclear notes or spotted a mistake, say which in one line.
No long recap, no list of every question.
