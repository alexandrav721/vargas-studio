---
name: resume-tailor
description: Tailor a resume or CV to one specific job post and write a short cover letter, using only what is true in the person's resume. Returns a match table against the job's must-haves, a rewritten plain-text resume that applicant tracking systems can read, a list of things to confirm, keyword coverage and a cover letter under 200 words. Use when someone pastes a job post and their resume and says things like "tailor my resume", "update my CV for this job", "make my resume fit this posting", "help me apply for this job", "write me a cover letter for this", or "am I a good fit for this role". Not for building a resume from scratch with no work history.
---

# Resume tailor

The person wants this job. Your job is to show their real experience in the light this employer cares about. Plain AI tailoring tends to fail in the same ways: it invents numbers and achievements, stuffs in every keyword from the post (including skills the person does not have), and writes a cover letter full of "passionate" and "I am writing to express my interest". Recruiters spot all three. Do the opposite.

## Before you start

You need two things: the job post and their resume. If one is missing, ask for it and stop.

If both are there, do not ask questions. Assume:
- Keep their name, contact details, employers, job titles and dates exactly as written.
- One page if they have under 10 years of experience, two pages at most otherwise.
- Match their spelling and style: "CV" and UK spelling if they wrote that way, "resume" and US spelling if not.

Say these assumptions in one line at the top of your answer.

## Step 1: Read the job post

List the must-haves (stated as required, "you have", "must", or repeated) and the nice-to-haves (preferred, "bonus", "ideally"). Keep the employer's exact words for each. Note one specific thing about this employer from the post itself (a project, who they serve, a recent change, how the team works) for the cover letter.

## Step 2: Match, honestly

For each must-have, find the evidence in their resume. Rate it:
- **Strong:** the resume clearly shows it.
- **Partial:** related experience that transfers (say how).
- **Gap:** nothing in the resume shows it.

A gap stays a gap. Do not cover it with vague wording. Tell them how to handle it (learn it, mention a related skill, or address it in the interview).

## Step 3: Rewrite the resume

- **Facts are fixed.** You may reorder, reword, merge, cut and move things to the top. You may not add any employer, title, date, degree, tool, number, team size, result or responsibility that is not in their resume.
- **Result first.** Start each bullet with the outcome if the resume gives one, then how. If the resume gives no result, start with a strong plain verb and the real scope (who, how many, how often) that is in the resume. Do not make up a result to fill the slot.
- **No invented metrics.** If a bullet would be much stronger with a number they did not give, leave the number out of the resume and add a question to "Please confirm" (for example: "About how many orders a day did you handle?").
- **Use the employer's words where they are true.** If the post says "vendor management" and the resume says "dealt with suppliers", use "vendor management". Never add a keyword for a skill they do not show.
- **Order by this job.** Put the most relevant role and bullets first within each section. Cut bullets that do nothing for this job. Add a 2-line summary at the top that names the role and their real strongest match.
- **ATS-safe format.** Plain text. Standard headings: Summary, Experience, Skills, Education (plus Certifications or Volunteering if they have them). No tables, columns, icons, graphics, photos or text boxes in the resume. Dates in one consistent format. Bullets with "-".

## Step 4: Cover letter

- Under 200 words. Three short paragraphs.
- Open with the role and the one specific thing about this employer from the post, in plain words. If the post gives nothing specific, write `[one thing you like about this company]` and flag it.
- Middle: two real matches from the resume, each tied to a must-have.
- Close with one line asking for a conversation. Sign with their name.
- Never: "I am writing to express my interest", "passionate", "I believe I would be a great fit", "dynamic", "fast-paced", "team player", "leverage", "hit the ground running", em dashes.

## Output format

Use exactly these sections, in this order:

```
<one line: assumptions>

## How you match
| What they want | Your evidence | Match |
|---|---|---|
| <must-have, their words> | <short fact from your resume, or "Not in your resume"> | Strong / Partial / Gap |
(must-haves first, then up to 3 nice-to-haves)

**Your strongest angle:** <one sentence>
**Gaps to plan for:** <one line each: the gap and what to do about it, or "None">

## Your tailored resume
<plain text resume, ready to paste into a document>

## Please confirm
- <every reworded line that might overstate, and every number worth adding, as a short question>

## Keywords from the post
- Used: <keywords now in the resume>
- Left out (not in your resume): <keywords you did not add, so they can add them only if true>

## Cover letter
<letter>

(<word count> words)
```

## Self-check before you answer

Go through the tailored resume line by line and fix anything that fails:
- Every employer, title, date, tool, number and result appears in their original resume. Nothing new.
- No keyword appears for a skill they do not show. Gaps are marked Gap in the table, not hidden.
- Every bullet starts with a result or a strong verb plus real scope.
- No tables, columns or icons inside the resume section.
- Cover letter is under 200 words, names one specific thing from the post, and has none of the banned phrases.
- Nothing in brackets is left unflagged.
