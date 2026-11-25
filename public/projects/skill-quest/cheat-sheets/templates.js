/* AI Made EZ Templates: data + real blind-judged results (built by gen.py, 25 Nov 2026). */
window.EZ_T = {
"sample": "Sample, made up for testing. The people and details are fictional.",
"boxes": [
[
"goal",
"What you want, in one line.",
"Reply to Dana. Agree to move the shoot, but keep the price."
],
[
"who_its_for",
"Who reads it, and what they care about.",
"Dana, a client I like and want to keep."
],
[
"context",
"What Claude can’t know: facts, limits, anything to read.",
"I’m a freelance photographer. Prep is done, so the price stays. I’m free next Tuesday or Wednesday."
],
[
"example",
"One sample of what good looks like.",
"My tone: “Hi Sam, happy to help! Quick note on timing…”"
],
[
"format",
"Length and shape.",
"Under 100 words. Ready to send."
],
[
"rules",
"What to avoid.",
"Don’t apologize. Don’t offer a discount."
]
],
"blank6": "<goal>[what you want, in one line]</goal>\n<who_its_for>[who reads it, and what they care about]</who_its_for>\n<context>[what claude can’t know: facts, limits, anything to read]</context>\n<example>[one sample of what good looks like]</example>\n<format>[length and shape]</format>\n<rules>[what to avoid]</rules>",
"jobs": [
{
"id": "reply-email",
"name": "Reply to an email",
"blank": "<goal>[what you want the reply to do]</goal>\n<who_its_for>[who they are to you]</who_its_for>\n<context>[facts they don’t know + paste their email]</context>\n<example>[a line in your usual tone]</example>\n<format>[length, ready to send?]</format>\n<rules>[what not to say or offer]</rules>",
"filled": "<goal>Reply to Dana. Agree to move the shoot, but keep the price.</goal>\n<who_its_for>Dana, a client I like and want to keep.</who_its_for>\n<context>I’m a freelance photographer. Prep is already done, so the price stays the same. I’m free next Tuesday or Wednesday. Her email:\nHi! Our launch got moved, so we need to push the photoshoot from this Thursday to next week. Also, since it’s a shorter day now, can you lower the price? Thanks, Dana</context>\n<example>My usual tone: “Hi Sam, happy to help! Quick note on timing…”</example>\n<format>Under 100 words. Ready to send.</format>\n<rules>Don’t apologize. Don’t offer a discount.</rules>",
"material": "Hi! Our launch got moved, so we need to push the photoshoot from this Thursday to next week. Also, since it’s a shorter day now, can you lower the price? Thanks, Dana",
"result": {
"templateScore": 5.0,
"plainScore": 2.8,
"template": {
"correct": 5,
"complete": 5,
"useful": 5,
"clear": 5,
"overall": 5.0
},
"plain": {
"correct": 2,
"complete": 3,
"useful": 3,
"clear": 3,
"overall": 2.8
},
"winner": "template",
"reason": "The boxes answer agrees to move the shoot, offers Tuesday or Wednesday and holds the price as the person needed, while the plain answer offers to reduce the price, leaves placeholders and adds extra notes.",
"plainAsk": "Reply to this email:\n\nHi! Our launch got moved, so we need to push the photoshoot from this Thursday to next week. Also, since it’s a shorter day now, can you lower the price? Thanks, Dana",
"plainOut": "Subject: Re: Photoshoot date and pricing\n\nHi Dana,\n\nThanks for the heads-up, and congrats on getting closer to launch. Moving the shoot to next week works for me. Which days are you free? I can do [day/time] or [day/time]. Once you pick one, I'll send a confirmation.\n\nOn price, I'm happy to adjust for a shorter day. My rate is based on the time booked, so I'll resend the quote for the new length. If you tell me the hours you have in mind, I'll send the updated number today. A shorter day may mean fewer setups or looks, so we can also confirm the shot list to make sure we cover your priorities in the time you have.\n\nLet me know the new date and the hours, and I'll take it from there.\n\nBest,\n[Your name]\n\n---\n\nNotes for you, not part of the email:\n- I didn't know your rates or whether you have a rescheduling policy, so I left the price open instead of promising a figure. Fill in a number if you'd like to reply in one step. For example, \"the half-day rate is $X.\"\n- If you want to hold your rate, replace the second paragraph with: \"I can't lower the price, because the work and prep are the same. I can fit a shorter shoot into the same fee, or keep a full day to give you more content.\"\n- If the new date means you'll turn down other work, you can add a short rescheduling note.",
"templateOut": "Subject: Re: Photoshoot timing\n\nHi Dana,\n\nHappy to move it! I'm free next Tuesday or Wednesday, so pick whichever suits your new launch date.\n\nOn the price, I'll keep it as quoted. Prep is already done, and the shoot itself will be the same full scope and quality you're expecting.\n\nLet me know which day works, and I'll lock it in.\n\nBest,\n[Your name]"
}
},
{
"id": "summarize",
"name": "Summarize a long document",
"blank": "<goal>[what you need to know from it]</goal>\n<who_its_for>[you: your role or situation]</who_its_for>\n<context>[paste the document]</context>\n<format>[bullets? how many?]</format>\n<rules>[quote dates and numbers exactly; say “not stated” if missing]</rules>",
"filled": "<goal>Tell me what changes for me and what I have to do.</goal>\n<who_its_for>Me: part-time (24 hours a week), I live 12 miles away, I usually drive.</who_its_for>\n<context>NEW HYBRID WORK POLICY (effective March 2, 2027)\nAll full-time staff will work in the office Tuesday, Wednesday and Thursday. Mondays and Fridays are optional remote days. Part-time staff (under 30 hours a week) must be in the office on at least two of the three core days, chosen with their manager by February 15, 2027. Desk booking moves to the Spaces app; bookings open 7 days ahead and unclaimed desks are released at 10:00 a.m. The parking stipend rises from $40 to $65 a month for staff who come in three or more days a week. Staff who live more than 50 miles away may apply for an exception through HR by February 1, 2027. Home-office equipment purchased under the old policy stays with the employee. The monthly internet allowance of $30 ends for full-time staff but continues for part-time staff. Managers will review attendance quarterly; the first review is in June 2027. Questions go to hr@example.com.</context>\n<format>5 bullets max, then “What I must do, by when”.</format>\n<rules>Quote dates and dollar amounts exactly. Say “not stated” if something isn’t in the policy.</rules>",
"material": "NEW HYBRID WORK POLICY (effective March 2, 2027)\nAll full-time staff will work in the office Tuesday, Wednesday and Thursday. Mondays and Fridays are optional remote days. Part-time staff (under 30 hours a week) must be in the office on at least two of the three core days, chosen with their manager by February 15, 2027. Desk booking moves to the Spaces app; bookings open 7 days ahead and unclaimed desks are released at 10:00 a.m. The parking stipend rises from $40 to $65 a month for staff who come in three or more days a week. Staff who live more than 50 miles away may apply for an exception through HR by February 1, 2027. Home-office equipment purchased under the old policy stays with the employee. The monthly internet allowance of $30 ends for full-time staff but continues for part-time staff. Managers will review attendance quarterly; the first review is in June 2027. Questions go to hr@example.com.",
"result": {
"templateScore": 4.8,
"plainScore": 3.5,
"template": {
"correct": 5,
"complete": 5,
"useful": 5,
"clear": 4,
"overall": 4.8
},
"plain": {
"correct": 5,
"complete": 3,
"useful": 2,
"clear": 4,
"overall": 3.5
},
"winner": "template",
"reason": "The boxes answer is tailored to the part-time employee (2 days, parking only at 3+ days, internet allowance kept, Feb 15 action) with an action list, while the plain answer is a generic summary that leaves the reader to work out what applies.",
"plainAsk": "Summarize this:\n\nNEW HYBRID WORK POLICY (effective March 2, 2027)\nAll full-time staff will work in the office Tuesday, Wednesday and Thursday. Mondays and Fridays are optional remote days. Part-time staff (under 30 hours a week) must be in the office on at least two of the three core days, chosen with their manager by February 15, 2027. Desk booking moves to the Spaces app; bookings open 7 days ahead and unclaimed desks are released at 10:00 a.m. The parking stipend rises from $40 to $65 a month for staff who come in three or more days a week. Staff who live more than 50 miles away may apply for an exception through HR by February 1, 2027. Home-office equipment purchased under the old policy stays with the employee. The monthly internet allowance of $30 ends for full-time staff but continues for part-time staff. Managers will review attendance quarterly; the first review is in June 2027. Questions go to hr@example.com.",
"plainOut": "**Summary: New hybrid work policy (effective March 2, 2027)**\n\n**Schedule**\n- Full-time staff: in the office Tuesday, Wednesday and Thursday. Monday and Friday are optional remote days.\n- Part-time staff (under 30 hours a week): in the office at least two of the three core days. They choose the days with their manager by **February 15, 2027**.\n\n**Desks and perks**\n- Desk booking moves to the Spaces app. Bookings open 7 days ahead, and unclaimed desks are released at 10:00 a.m.\n- The parking stipend rises from $40 to $65 a month for staff who come in three or more days a week.\n- The $30 monthly internet allowance ends for full-time staff. Part-time staff keep it.\n- Home-office equipment bought under the old policy stays with the employee.\n\n**Exceptions and review**\n- Staff who live more than 50 miles away can apply to HR for an exception by **February 1, 2027**.\n- Managers will review attendance quarterly. The first review is in June 2027.\n\n**Questions:** hr@example.com\n\n**Key dates:** Feb 1 (exception deadline), Feb 15 (part-time day selection), Mar 2 (policy starts), June 2027 (first attendance review).",
"templateOut": "**What changes for you**\n\n- **Office days:** You must be in the office at least two of the three core days (Tuesday, Wednesday, Thursday). You choose which two with your manager. The policy takes effect March 2, 2027. Mondays and Fridays are optional remote days.\n- **Desk booking:** Desks are booked in the Spaces app. Bookings open 7 days ahead, and unclaimed desks are released at 10:00 a.m. The policy doesn't say whether part-time staff get a fixed desk (not stated).\n- **Parking:** The stipend rises from $40 to $65 a month, but only for staff who come in three or more days a week. If you're in just your two minimum days, the policy doesn't say you'd get any stipend (not stated). You'd need to come in all three core days to qualify for $65.\n- **Internet allowance:** The $30 monthly allowance ends for full-time staff but continues for part-time staff, so you keep it. Home-office equipment bought under the old policy also stays with you.\n- **Not relevant to you, with one new check:** The distance exception is for staff who live more than 50 miles away, and you live 12 miles away. Managers will review attendance quarterly, and the first review is in June 2027.\n\n**What I must do, by when**\n\n- **By February 15, 2027:** Agree with your manager which two (or three) of Tuesday, Wednesday and Thursday you'll be in the office. If you want the $65 parking stipend, pick all three.\n- **Before March 2, 2027:** Get set up on the Spaces app so you can book desks from your first office day.\n- **By February 1, 2027:** Nothing. The exception deadline doesn't apply to you.\n- **Questions:** Email hr@example.com. Ask them what the policy leaves unstated: whether you get the parking stipend on two days, and whether part-time staff get fixed desks."
}
},
{
"id": "meeting-actions",
"name": "Meeting notes into actions",
"blank": "<goal>Turn my notes into a to-do list.</goal>\n<context>[paste your notes]</context>\n<format>A table: task, owner, due date.</format>\n<rules>Flag any task with no owner or no date. Don’t invent either.</rules>",
"filled": "<goal>Turn my notes into a to-do list we can share.</goal>\n<context>mtg w/ Priya, Leo, Sam re: spring fundraiser\n- venue: Leo calling church hall + library, need answer before we print anything\n- flyers - Sam designs, print by mar 1?\n- budget cap 800\n- Priya emails last yr donors (list in drive)\n- need someone for food permits?? nobody took it\n- next mtg thurs</context>\n<format>A table: task, owner, due date. Then one line for the next meeting.</format>\n<rules>Flag any task with no owner or no date. Don’t invent owners or dates.</rules>",
"material": "mtg w/ Priya, Leo, Sam re: spring fundraiser\n- venue: Leo calling church hall + library, need answer before we print anything\n- flyers - Sam designs, print by mar 1?\n- budget cap 800\n- Priya emails last yr donors (list in drive)\n- need someone for food permits?? nobody took it\n- next mtg thurs",
"result": {
"templateScore": 4.3,
"plainScore": 4.3,
"template": {
"correct": 3,
"complete": 5,
"useful": 4,
"clear": 5,
"overall": 4.3
},
"plain": {
"correct": 5,
"complete": 4,
"useful": 4,
"clear": 4,
"overall": 4.3
},
"winner": "tie",
"reason": "The boxes answer has the task/owner/due table with flags but invents a separate unowned print task, while the plain answer matches the notes (Sam owns flyers, print Mar 1) but has no due column.",
"plainAsk": "Clean up these meeting notes:\n\nmtg w/ Priya, Leo, Sam re: spring fundraiser\n- venue: Leo calling church hall + library, need answer before we print anything\n- flyers - Sam designs, print by mar 1?\n- budget cap 800\n- Priya emails last yr donors (list in drive)\n- need someone for food permits?? nobody took it\n- next mtg thurs",
"plainOut": "# Spring Fundraiser Planning Meeting\n\n**Attendees:** Priya, Leo, Sam\n**Next meeting:** Thursday\n\n## Decisions\n- Budget cap: $800\n\n## Action items\n| Owner | Task | Notes |\n|---|---|---|\n| Leo | Call the church hall and the library about the venue | We need an answer before anything is printed |\n| Sam | Design the flyers | Target print date: March 1 (to be confirmed) |\n| Priya | Email last year's donors | The list is in the Drive |\n| **Unassigned** | Food permits | Nobody took this one. Please assign it at Thursday's meeting, or sooner. |\n\n## Open questions\n- Which venue will we use? Leo's answer decides this, and the flyers depend on it.\n- Is March 1 the right print date? It needs to be confirmed, and it depends on the venue.\n- Who will handle food permits?",
"templateOut": "# Spring Fundraiser: To-Do List\n\nMeeting with Priya, Leo, and Sam\n\n| Task | Owner | Due date |\n|---|---|---|\n| Call the church hall and the library about the venue. We need an answer before anything is printed. | Leo | **No date set.** It has to come before printing. |\n| Design the flyers | Sam | **No date set** |\n| Print the flyers | **No owner** (Sam is designing, but nobody said who prints) | Mar 1 (Sam's note had a question mark, so confirm it) |\n| Email last year's donors (list is in the Drive) | Priya | **No date set** |\n| Get the food permits | **No owner.** Nobody took it. | **No date set** |\n| Stay within the $800 budget cap | **Whole team.** This is a limit, not a task. | n/a |\n\n**Flags**\n- **No owner:** printing the flyers, and the food permits.\n- **No date:** the venue calls, flyer design, the donor email, and the food permits.\n- **Dependency:** the venue answer comes first. Flyers shouldn't be printed until Leo hears back, so the Mar 1 print date depends on it.\n\n**Next meeting:** Thursday (no time or place was noted)."
}
},
{
"id": "plan-week",
"name": "Plan a week or project",
"blank": "<goal>[what the week or project must achieve]</goal>\n<context>[fixed commitments, deadlines, energy, help you have]</context>\n<format>[a day-by-day table? a checklist?]</format>\n<rules>[limits: hours, budget, what to skip]</rules>",
"filled": "<goal>Plan my week so I finish the grant report by Friday 5pm and don’t work evenings.</goal>\n<context>Work 9–5 Mon–Fri. Fixed: team meeting Mon 10–11, dentist Wed 2–3, kid pickup 4:30 daily. Grant report needs about 8 hours: draft, numbers from Jo (she sends Tue), final review. I focus best in mornings.</context>\n<format>A day-by-day table: time block and task. Then 3 risks.</format>\n<rules>No work after 5. Put the hardest work in mornings.</rules>",
"material": "",
"result": {
"templateScore": 4.8,
"plainScore": 2.5,
"template": {
"correct": 4,
"complete": 5,
"useful": 5,
"clear": 5,
"overall": 4.8
},
"plain": {
"correct": 3,
"complete": 1,
"useful": 2,
"clear": 4,
"overall": 2.5
},
"winner": "template",
"reason": "The boxes answer delivers a concrete Mon-Fri plan with the fixed commitments, Jo's Tuesday numbers, a Friday finish and risks, while the plain answer only asks for information and gives no plan.",
"plainAsk": "Help me plan my week. I have a lot going on.",
"plainOut": "Happy to help. I can't see your calendar or to-do list, so I need a few things from you first. Answer whatever you can in a line or two, and a messy brain-dump is fine.\n\n1. **What's on your plate?** List everything: work tasks, appointments, errands, social plans, deadlines. Don't sort it yet.\n2. **What's fixed?** Meetings, classes, pickups and anything else with a set time or date.\n3. **What's the most important thing this week?** If only one or two things get done, which ones?\n4. **What are your limits?** Think work hours, energy levels (mornings or evenings?), sleep, and any days that are already packed.\n5. **What do you want to protect?** Exercise, rest, time with people, or a hobby.\n\n## What I'll do with your answers\n\n- Sort everything into **must do**, **should do** and **nice to do**.\n- Put the fixed commitments on the calendar first, then fit the rest around them.\n- Give your hardest tasks your best hours, and group small errands together.\n- Leave buffer time, because plans nearly always run over.\n- Hand you a day-by-day plan, plus a short list of things to drop or move if the week gets too full.\n\n## If you'd rather start now\n\nPaste your list in this format, and I'll build the plan right away:\n\n```\nFixed: Mon 10am dentist, Wed 2pm team meeting...\nTo do: finish report (due Fri), grocery run, call mom...\nWant to protect: gym 3x, Sunday evening off\n```\n\nWhat's on your plate?",
"templateOut": "# Week plan: grant report due Fri 5pm\n\n**Assumption:** pickup is at 4:30, so your real workday is 9:00 to 4:30. Nothing is scheduled after 5. The report takes about 8 hours, and I've left Friday mostly free as a buffer.\n\n| Day | Time block | Task |\n|---|---|---|\n| **Mon** | 9:00–10:00 | Hardest work first. Outline the report and write the sections that don't need Jo's numbers (the argument and narrative). |\n| | 10:00–11:00 | Team meeting |\n| | 11:00–12:30 | Keep drafting. Leave clearly marked placeholders where numbers go. |\n| | 1:00–4:30 | Other work. **Report time: 2.5 hrs** |\n| **Tue** | 9:00–11:00 | Finish the full draft. This is the hardest writing, so it gets the morning. |\n| | 11:00–12:00 | Message Jo to confirm the numbers are coming. Then do other work. |\n| | 1:00–2:00 | When Jo's numbers arrive, put them in the report. |\n| | 2:00–4:30 | Other work. **Report time: 3 hrs (running total 5.5)** |\n| **Wed** | 9:00–10:30 | Revise the draft around the real numbers. Fix any places where the story and the data don't match. |\n| | 10:30–2:00 | Other work |\n| | 2:00–3:00 | Dentist |\n| | 3:00–4:30 | Other work. **Report time: 1.5 hrs (running total 7)** |\n| **Thu** | 9:00–10:00 | Final review. Read it start to finish with fresh eyes, check the numbers and formatting, and list the fixes. |\n| | 10:00–4:30 | Other work. Make the fixes from your list if you need them. **Report time: 1 hr (total 8)** |\n| **Fri** | 9:00–10:00 | Last read-through and fixes. Submit by **noon**. |\n| | 10:00–4:30 | Other work. The afternoon is free buffer, so Friday 5pm isn't your only margin. |\n\nAll report work sits in the morning, apart from the Tuesday number insertion, which depends on when Jo's numbers arrive.\n\n## 3 risks\n\n1. **Jo's numbers come late or change.** The whole schedule leans on Tuesday. Ask her today for a firm time, even \"by noon Tue\". If they slip, the Wed 9:00 block still works, and Thu and Fri can absorb up to a day of delay. Tell Jo what format you need, so you don't have to reformat the numbers when they arrive.\n2. **The numbers change the story.** If the data is weaker or different than you expect, Wednesday's 1.5 hours may not be enough. Protect it by writing the Monday and Tuesday narrative flexibly. Also use the Thursday review and Friday morning as overflow, since they're already in the plan.\n3. **Mornings get eaten.** Mon 10–11 and the Wed dentist break up your best focus time, and unplanned asks can take over the rest. Block your calendar for the report slots now and mark them busy. If a morning slot is lost, move that work to the next morning rather than to the evening. Because of the 4:30 pickup, it's the afternoons, not the evenings, that you can sacrifice."
}
},
{
"id": "social-post",
"name": "Social post in my voice",
"blank": "<goal>[what the post announces or asks]</goal>\n<who_its_for>[your followers: who they are]</who_its_for>\n<context>[the facts: what, when, price]</context>\n<example>[paste one past post you liked]</example>\n<format>[platform, length, hashtags or not]</format>\n<rules>[words or claims to avoid]</rules>",
"filled": "<goal>Announce our new cardamom buns.</goal>\n<who_its_for>Locals who stop by on the way to work.</who_its_for>\n<context>Saturdays only, from 8am, $4.50 each, made with real cardamom from a Swedish recipe my grandmother used. They usually sell out by 11.</context>\n<example>A past post: “Rye loaves are back. Crusty outside, soft inside, gone by noon. See you at 7.”</example>\n<format>Instagram caption, under 40 words, no hashtags.</format>\n<rules>No emojis. Don’t say “indulge”, “mouthwatering” or “treat yourself”.</rules>",
"material": "",
"result": {
"templateScore": 5.0,
"plainScore": 2.3,
"template": {
"correct": 5,
"complete": 5,
"useful": 5,
"clear": 5,
"overall": 5.0
},
"plain": {
"correct": 2,
"complete": 2,
"useful": 2,
"clear": 3,
"overall": 2.3
},
"winner": "template",
"reason": "The boxes answer is a ready-to-post caption of about 30 words with no emoji or hashtags that includes all the required details (Saturdays from 8am, $4.50, grandmother's Swedish recipe, gone by 11), while the plain answer uses emojis and hashtags, runs long, and leaves placeholders for details that were given.",
"plainAsk": "Write an Instagram post for my bakery’s new cardamom buns.",
"plainOut": "Here's an Instagram post you can use. I didn't have your bakery's name, prices or hours, so I left placeholders for them.\n\n---\n\n**Caption:**\n\nCardamom buns are here. 🤎\n\nSoft, buttery dough. Freshly ground cardamom. A sweet, spiced swirl in every bite. They're baked fresh each morning, and they smell as good as they taste.\n\nCome early, because they won't last long.\n\n📍 [Bakery name], [address]\n🕖 [Hours]\n💰 [Price] each, or [price] for a box of 4\n\nTag the friend you'd share one with (or don't, and keep both). 😉\n\n#cardamombuns #freshbaked #localbakery #bakerylove #pastrylover #[yourcity]eats #supportlocal #morningtreat\n\n---\n\n**Photo ideas:**\n- A close-up of a bun being pulled apart, so the swirl shows.\n- A tray of buns fresh out of the oven, with steam or morning light.\n- A hand holding one bun next to a coffee.\n\n**Shorter version (for Stories or a Reel):**\n\nNew at [Bakery name]: cardamom buns. Warm, spiced and baked fresh daily. Come get one before they sell out. 🤎\n\n---\n\nIf you give me your bakery's name, location, price, tone (cozy, playful or upscale) and whether the buns are seasonal, I can tailor this further.",
"templateOut": "Cardamom buns, Saturdays only, from 8am. $4.50 each, made with real cardamom from my grandmother's Swedish recipe. Grab one on your way to work. They're usually gone by 11."
}
},
{
"id": "compare-decide",
"name": "Compare options and decide",
"blank": "<goal>[the decision you need to make]</goal>\n<context>[the options and their facts]</context>\n<rules>[your must-haves, ranked]</rules>\n<format>A table, then one recommendation and why.</format>",
"filled": "<goal>Pick the best apartment for me.</goal>\n<context>Option A: 1-bed, $1,650/mo, 25 min commute by train, in-unit laundry, no parking, 12-month lease.\nOption B: 2-bed, $1,900/mo, 40 min commute by car, laundry in building, 1 parking spot, 12-month lease.\nOption C: studio, $1,350/mo, 10 min walk to work, no laundry (laundromat 2 blocks), no parking, 6-month lease.</context>\n<rules>My must-haves, in order: 1) under $1,700 a month, 2) commute under 30 minutes, 3) laundry at home. I don’t own a car.</rules>\n<format>A table comparing them on my must-haves, then one recommendation and why.</format>",
"material": "Option A: 1-bed, $1,650/mo, 25 min commute by train, in-unit laundry, no parking, 12-month lease.\nOption B: 2-bed, $1,900/mo, 40 min commute by car, laundry in building, 1 parking spot, 12-month lease.\nOption C: studio, $1,350/mo, 10 min walk to work, no laundry (laundromat 2 blocks), no parking, 6-month lease.",
"result": {
"templateScore": 5.0,
"plainScore": 2.5,
"template": {
"correct": 5,
"complete": 5,
"useful": 5,
"clear": 5,
"overall": 5.0
},
"plain": {
"correct": 2,
"complete": 2,
"useful": 3,
"clear": 3,
"overall": 2.5
},
"winner": "template",
"reason": "The boxes answer checks each apartment against the ranked must-haves and clearly recommends Option A without inventing facts, while the plain answer ignores the must-haves, makes up cost estimates, and gives mixed advice (any of the three).",
"plainAsk": "Which of these apartments should I pick?\n\nOption A: 1-bed, $1,650/mo, 25 min commute by train, in-unit laundry, no parking, 12-month lease.\nOption B: 2-bed, $1,900/mo, 40 min commute by car, laundry in building, 1 parking spot, 12-month lease.\nOption C: studio, $1,350/mo, 10 min walk to work, no laundry (laundromat 2 blocks), no parking, 6-month lease.",
"plainOut": "**Short answer: Option A, unless you own a car you can't live without. Then it's B.**\n\nI don't know your budget, whether you have a car, or how long you plan to stay. I've assumed no car and a normal budget. The reasoning below shows where that changes the answer.\n\n## Real monthly cost\n\n| | A | B | C |\n|---|---|---|---|\n| Rent | $1,650 | $1,900 | $1,350 |\n| Laundry | $0 | about $0 to $30 (in building) | about $40 to $60 (laundromat, plus your time) |\n| Commute | train pass (roughly $100 to $200, depending on your city) | gas, parking at work, wear on the car (often $200 or more) | $0 |\n| **Rough total** | **about $1,750 to $1,850** | **about $2,100 or more** | **about $1,400 to $1,410** |\n\nThe commute figures are guesses. Plug in your real train fare and your real parking and gas costs.\n\n## How each one fits\n\n**A: 1-bed, $1,650, 25 min train, in-unit laundry.**\n- You get a separate bedroom, laundry at home, and a commute you can read or relax on.\n- The cost is about $300 a month more than C, and there's no parking.\n- It's the best balance if you don't drive much.\n\n**B: 2-bed, $1,900, 40 min drive, parking.**\n- It only makes sense if you need the second bedroom (roommate, partner, home office, kid) or you must have a car.\n- If you split it with a roommate, your share is about $950 and it becomes the cheapest option by far.\n- If you live alone, you pay the most, have the longest commute, and drive that commute every day.\n\n**C: studio, $1,350, 10 min walk, no laundry, 6-month lease.**\n- It's the cheapest, and it has the best commute. Losing 40 minutes of round-trip commuting each day adds up to about 3 hours a week, compared with A.\n- The downsides are a small space, hauling laundry, and a 6-month lease. The short lease is good if you're unsure about the city or job. It's bad if you hate moving, because the rent may go up at renewal.\n- Over a year, C saves roughly $4,000 or more compared with A.\n\n## How to decide\n\n- **Pick C** if you want to save money, you may move or change jobs within a year, and you can live in one room.\n- **Pick A** if you want a real bedroom and easy laundry, and you're fine paying about $300 a month more than C.\n- **Pick B** only if you need two bedrooms or a car, or you'll split the rent.\n\n## Before you sign, check\n1. Does A or B charge extra for utilities or fees? Do any of them include internet?\n2. What is the actual cost of the monthly train pass?\n3. Is the building for C quiet and safe at night when you walk home from the laundromat?\n4. What does C's rent become after the first 6 months?\n\nIf you tell me your budget, whether you have a car, and whether you'll have a roommate, I can narrow this to one pick.",
"templateOut": "| Must-have (in your order) | A: 1-bed | B: 2-bed | C: Studio |\n|---|---|---|---|\n| 1) Under $1,700/mo | Yes ($1,650) | No ($1,900) | Yes ($1,350) |\n| 2) Commute under 30 min | Yes (25 min train) | No (40 min by car, and you don't own one) | Yes (10 min walk) |\n| 3) Laundry at home | Yes (in-unit) | Partly (in building, not in your unit) | No (laundromat 2 blocks away) |\n| **Must-haves met** | **3 of 3** | **0 of 3** (laundry only partly) | **2 of 3** |\n\nOther differences: B's parking spot is no use to you without a car. C has a 6-month lease, which is flexible but means a possible rent increase or a move sooner. A and B have 12-month leases.\n\n**Recommendation: Option A.**\n\nIt is the only apartment that meets all three must-haves. It costs $1,650, which is $50 under your cap. The 25-minute train commute fits your limit, and the in-unit laundry covers your third requirement. Option B fails your top two must-haves and its main perk, parking, doesn't help you. Option C is cheaper and has the best commute, but it misses laundry, your third must-have.\n\nTwo things to check before you sign:\n- The 25 minutes should be door to door, including the walk to the station and the wait. If it really takes 30 minutes or more, it fails your commute rule.\n- Confirm the exact rent and any fees. A's $50 margin is small, so added fees could push you over $1,700.\n\nIf the commute turns out to be slower than listed, C is the fallback, since it is the best of the other two on your must-haves."
}
},
{
"id": "writing-feedback",
"name": "Feedback on my writing",
"blank": "<goal>[what the writing must do]</goal>\n<who_its_for>[who will read it]</who_its_for>\n<context>[paste your writing]</context>\n<format>[e.g. top 3 fixes, with a rewrite of the worst line]</format>\n<rules>[keep my voice; don’t rewrite the whole thing]</rules>",
"filled": "<goal>Get an interview for a Program Coordinator job.</goal>\n<who_its_for>A hiring manager at a nonprofit reading 100 cover letters.</who_its_for>\n<context>I am writing to apply for the Program Coordinator position. I am a hard worker and a team player who is passionate about helping people. I have worked at Riverside Food Bank for three years, where I did many things including volunteers and events. I think I would be a great fit for your organization and I hope to hear from you soon.\n\nFacts I left out: I scheduled 60 volunteers a month and ran 4 events that raised $18,000.</context>\n<format>My top 3 fixes, most important first. Then rewrite only my weakest sentence.</format>\n<rules>Keep my voice. Don’t rewrite the whole letter. Don’t invent facts.</rules>",
"material": "I am writing to apply for the Program Coordinator position. I am a hard worker and a team player who is passionate about helping people. I have worked at Riverside Food Bank for three years, where I did many things including volunteers and events. I think I would be a great fit for your organization and I hope to hear from you soon.",
"result": {
"templateScore": 5.0,
"plainScore": 3.0,
"template": {
"correct": 5,
"complete": 5,
"useful": 5,
"clear": 5,
"overall": 5.0
},
"plain": {
"correct": 3,
"complete": 3,
"useful": 3,
"clear": 3,
"overall": 3.0
},
"winner": "template",
"reason": "The boxes answer gives exactly three prioritized fixes using the writer's real numbers and rewrites only the weakest sentence without inventing anything, while the plain answer gives five fixes plus extras, misses the real figures, uses placeholder numbers, and rewrites the whole letter.",
"plainAsk": "Can you give me feedback on this?\n\nI am writing to apply for the Program Coordinator position. I am a hard worker and a team player who is passionate about helping people. I have worked at Riverside Food Bank for three years, where I did many things including volunteers and events. I think I would be a great fit for your organization and I hope to hear from you soon.",
"plainOut": "Your draft is clear and polite, but it's generic. Nothing in it would tell a hiring manager why you, specifically, should get the interview. Here's what I'd change.\n\n## What works\n- It's short and easy to read.\n- The tone is professional.\n- You name the role and your three years at Riverside Food Bank. That's your strongest asset, and it's already in there.\n\n## What to fix\n\n**1. Cut the claims everyone makes.**\n\"Hard worker,\" \"team player,\" and \"passionate about helping people\" appear in almost every application, so they don't set you apart. Show these qualities through what you did instead of stating them.\n\n**2. Replace \"many things\" with specifics.**\n\"I did many things including volunteers and events\" is the weakest line. It's vague, and \"did... volunteers\" doesn't read correctly. A coordinator role is about organizing people and logistics, so say exactly what you did:\n- How many volunteers did you recruit, schedule, or manage?\n- What events did you run, and how big were they?\n- What changed because of your work? Think more people served, a smoother process, or money or food raised.\n\nEven rough numbers help: \"coordinated 40+ weekly volunteers\" or \"ran 12 food drives that collected 8,000 lbs.\"\n\n**3. Connect your experience to this job.**\nLook at the posting and pick two or three of its main requirements. Then show that you've done them. Right now the letter could be sent to any organization.\n\n**4. Say why this organization.**\n\"A great fit for your organization\" is a claim with no support. One sentence on what draws you to them, such as their mission, a program, or their community, makes you stand out.\n\n**5. Make the closing more confident.**\n\"I hope to hear from you soon\" is passive. Try: \"I'd welcome the chance to talk about how I can support your programs. I can be reached at [email/phone].\"\n\n## Other small notes\n- Add a greeting (\"Dear [Name],\" or \"Dear Hiring Team,\") and a sign-off.\n- Open with something stronger than \"I am writing to apply for...\" The recruiter already knows that. Start with your best credential.\n- Aim for 3 short paragraphs: why you're a fit (with evidence), why this organization, and a closing.\n\n## Example rewrite\n(Fill in the brackets with your real details. Don't use my numbers unless they're true.)\n\n> Dear [Hiring Manager's Name],\n>\n> For the past three years at Riverside Food Bank, I've [recruited and scheduled about X volunteers each week] and [planned/run X events], including [specific event], which [result: people served, pounds collected, funds raised]. I'd like to bring that experience to the Program Coordinator role at [Organization].\n>\n> I was drawn to [Organization] because [specific reason: a program, mission, or community focus]. Your posting emphasizes [requirement 1] and [requirement 2]. At Riverside, I [concrete example that shows each].\n>\n> I'd welcome the chance to talk about how I can support your programs. Thank you for your time and consideration.\n>\n> Sincerely,\n> [Name]\n\nIf you share the job posting and a few details about what you did at the food bank, I can help you write a tailored version.",
"templateOut": "## Your top 3 fixes, most important first\n\n**1. Put your numbers in. They are your strongest material, and the letter doesn't have them.**\n\"60 volunteers a month\" and \"4 events that raised $18,000\" are exactly what a hiring manager skimming 100 letters will remember. Right now the only evidence is \"I did many things.\" Move the numbers into the body, next to the job they prove: coordinating people and running events.\n\n**2. Replace the claims with proof.**\n\"Hard worker,\" \"team player,\" \"passionate about helping people,\" and \"great fit\" are what nearly every applicant writes, so none of them help you stand out. Don't say you're a team player. Show a moment where you coordinated 60 people. Cut each trait you can't back up with a fact.\n\n**3. Make the opening and the close specific.**\n\"I am writing to apply for the Program Coordinator position\" tells them what they already know. Start with your strongest fact instead. The close, \"I hope to hear from you soon,\" is passive. Ask for the interview and say what you'd bring, for example: \"I'd welcome a conversation about how I could bring the same organization to your programs.\" Also name the organization and one thing about its work. Your draft could go to any nonprofit. (I can't invent that detail for you, so add one real thing you admire about them.)\n\n## Your weakest sentence, rewritten\n\n**Original:**\n> I have worked at Riverside Food Bank for three years, where I did many things including volunteers and events.\n\n**Rewrite:**\n> For three years at Riverside Food Bank, I scheduled 60 volunteers a month and ran 4 events that raised $18,000.\n\nThis keeps your plain, direct voice. It uses only the facts you gave me, and it replaces \"many things\" with what you actually did.\n\nIf you want, send me the next draft and I'll check whether the \"hard worker\" and \"team player\" lines are gone."
}
},
{
"id": "research-brief",
"name": "Research brief with sources",
"blank": "<goal>[the question you need answered]</goal>\n<who_its_for>[who decides, what they care about]</who_its_for>\n<context>[what you already know or have ruled out]</context>\n<format>5 bullets, each with a source link and date. Then “what I couldn’t confirm”.</format>\n<rules>Only sources from the last [12] months. Say when sources disagree.</rules>",
"filled": "<goal>Which online scheduling tools work for a 12-person cleaning company?</goal>\n<who_its_for>The owner. Cares about price per month and a phone app for staff.</who_its_for>\n<context>We tried Google Calendar. Too messy for shift swaps.</context>\n<format>5 bullets, each with a source link and date. Then “what I couldn’t confirm”.</format>\n<rules>Only sources from the last 12 months. Say when sources disagree.</rules>",
"material": "",
"result": null
},
{
"id": "learn-topic",
"name": "Learn a topic fast",
"blank": "<goal>Teach me [topic] well enough to [what you need to do].</goal>\n<who_its_for>Me: [what I already know].</who_its_for>\n<format>5 key ideas in plain words, one everyday example each, then 3 quiz questions.</format>\n<rules>No jargon without a one-line definition. Tell me what to learn next.</rules>",
"filled": "<goal>Teach me cash-flow basics well enough to talk to my accountant.</goal>\n<who_its_for>Me: I run a small Etsy shop. I know sales and costs, not much else.</who_its_for>\n<format>5 key ideas in plain words, one everyday example each, then 3 quiz questions.</format>\n<rules>No jargon without a one-line definition. Tell me what to learn next.</rules>",
"material": "",
"result": null
},
{
"id": "clean-table",
"name": "Clean up a list or table",
"blank": "<goal>Clean up this [list or table].</goal>\n<context>[paste it]</context>\n<format>[columns you want, sort order]</format>\n<rules>Don’t guess missing values. Mark them “missing”. List every change you made.</rules>",
"filled": "<goal>Clean up our volunteer sign-up list.</goal>\n<context>[paste the messy list]</context>\n<format>Columns: name, email, phone, shift. Sort by shift.</format>\n<rules>Don’t guess missing values. Mark them “missing”. Remove exact duplicates and list every change you made.</rules>",
"material": "",
"result": null
}
],
"skillBlank": "---\nname: [short-name-with-dashes]\ndescription: [What it does, and WHEN to use it: “Use when I ask to…”. Claude reads only this line to decide.]\n---\n\n# [Skill name]\n\n## Before you start\n[What to assume. When to ask one question, and when not to.]\n\n## Steps\n1. [First thing to do]\n2. [Next]\n3. [Next]\n\n## Never\n- [Mistakes plain AI makes for this job]\n\n## Output format\n[Exactly what the answer looks like: sections, length.]\n\n## Check before you answer\n- [One check, e.g. “Every number matches the source.”]",
"standing": [
{
"id": "preferences",
"name": "About me (personal preferences)",
"where": "Claude: Settings → Profile → personal preferences",
"blank": "<about_me>[your job, your town, what you use Claude for]</about_me>\n<how_i_like_answers>[short? bullets? plain words?]</how_i_like_answers>\n<never>[things you never want: emojis, long intros…]</never>",
"filled": "<about_me>I run a small dog-grooming shop in Tucson. I use Claude for emails, social posts and planning.</about_me>\n<how_i_like_answers>Short. Plain words. Bullets when there are steps.</how_i_like_answers>\n<never>No emojis. No “I hope this helps”.</never>"
},
{
"id": "project",
"name": "Project instructions",
"where": "Claude: a Project → Instructions",
"blank": "<project_goal>[what every chat in this project is for]</project_goal>\n<always_use>[the files in this project to rely on]</always_use>\n<style>[voice, length, format]</style>\n<rules>[what must always or never happen]</rules>",
"filled": "<project_goal>Customer emails for Sudsy Paws Grooming.</project_goal>\n<always_use>Our price list and policies file.</always_use>\n<style>Warm, short, signed “The Sudsy Paws team”.</style>\n<rules>Never promise a time slot. Always link the booking page.</rules>"
}
],
"followups": [
"Shorter.",
"Ask me 3 questions first, then write it.",
"Give me 3 versions to pick from.",
"What did you assume? List it.",
"Check every number against my text. Flag anything you can’t find."
]
};
