# Planner and Book: notes (ads, deck, social)

Everything here is pre-launch. No ads have run, nothing has sold, and there are no users to report. Prices for the physical planner and the Premium book unlock are **TBD** (no price appears on the existing pages). Any number not cited below is labeled `ASSUMPTION`.

## Sources (opened and checked Nov 2026)

| # | Claim used | Source |
|---|---|---|
| 1 | Papier expects to pass $50M in 2025 sales; planner sales up 20% YoY as of October; Q4 up 30%; ~50% DTC repeat rate; TikTok traffic nearly doubled; "stationerycore" has 57M TikTok posts; CEO links demand to people choosing not to let their lives go fully digital | Modern Retail, "Brands Briefing: Papier's sales swell to $50M this year, fueled by a desire for analog products," 9 Dec 2025. https://www.modernretail.co/marketing/brands-briefing-papiers-sales-swell-to-50m-this-year-fueled-by-a-desire-for-analog-products/ |
| 2 | Hobonichi Techo: 10M+ copies all-time as of Sep 2024; users in 100+ countries and regions | Hobonichi, Techo 2026 "About" page. http://www.1101.com/store/techo/en/2026/pc/about/ |
| 3 | Hobonichi 2024 edition: ~900,000 units, 236 varieties; growth tied to a social community of journal keepers | Good News Network, 17 Jan 2025, citing The Japan Times (10 Jan 2025). https://www.goodnewsnetwork.org/think-kids-are-addicted-to-phones-us-stationery-nerds-are-fueling-a-japanese-notebook-boom/ |
| 4 | 2021 University of Tokyo study: 48 adults; people who wrote a schedule on paper finished faster (~11 min vs ~14 tablet, ~16 phone) and showed more brain activity in language, visualization and hippocampal areas at recall; they scored better only on simple questions | University of Tokyo press release, 19 Mar 2021. https://www.u-tokyo.ac.jp/focus/en/press/z0508_00168.html ; paper: Umejima et al., Frontiers in Behavioral Neuroscience, 2021, doi 10.3389/fnbeh.2021.634158 |
| 5 | Implementation intentions (specific if-then plans) improve goal attainment, d = .65 across 94 studies | Gollwitzer & Sheeran (2006), Advances in Experimental Social Psychology 38:69–119, as summarized by the US National Cancer Institute. https://cancercontrol.cancer.gov/brp/research/constructs/implementation-intentions |
| 6 | Lulu print-on-demand: Planners, 6×9 coil bound, standard color, 60# paper, from $5.80 a copy; coil-bound color workbook 8.5×11 from $7.30 | Lulu, "Print Workbooks & Textbooks." https://www.lulu.com/create/educational-books |
| 7 | Lulu vs KDP vs IngramSpark print cost, 100 pages B&W: 8.5×11 paperback $5.48 / $2.84 / $3.37 | Lulu blog, "Print-on-Demand: Breaking Down the Costs for Authors" (undated, image path suggests Nov 2024). https://blog.lulu.com/print-on-demand-costs-for-authors/ |
| 8 | BestSelf Self Journal: $36 (compare-at $39), 13-week, undated, goal journal | bestself.co product feed, Nov 2026. https://bestself.co/products/self-journal |
| 9 | Passion Planner Weekly Undated: regular $45–$55 (sale $40) | passionplanner.com weekly collection product feed, Nov 2026. https://passionplanner.com/collections/weekly |
| 10 | Erin Condren Undated Vertical LifePlanner: $60.50 regular ($42.35 on sale) | erincondren.com/planners, Nov 2026. https://www.erincondren.com/planners |

**Seen but not used on slides** (search snippets only, not opened, or unreliable):
- Third-party "planner market" sizes for 2025 range from ~$1.1B (Global Growth Insights) to $8.6B (Marketintelo). They disagree by ~7×, so the deck says we don't use them.
- Bloomberg, 7 Apr 2026, "TikTok propels Hobonichi Techo 2026 planner to virality" (paywalled; snippet says 1M+ copies of the 2026 edition).
- Passion Planner Daily Kickstarter, reported $405,375 on a $10,000 goal (BackerKit page returned 403).
- Passion Planner's free PDF downloads (email-gated) — search result from passionplanner.com/free-downloads; page rate-limited when fetched. Used on the business-model slide as a pattern, not a number.
- BestSelf revenue ($2.4M 2016, $7M 2017 per Fox Business) and Erin Condren GMV estimates (ECDB $14M 2025): not company-reported, not used.
- Circana: US office supplies forecast $11.1B in 2026 (−0.1%); no public planner breakout.

## Why people buy paper planners (what the ads lean on)

1. **It sticks when it's handwritten.** Buyers say writing by hand helps them remember. The Tokyo study (#4) backs a modest version: more recall-related brain activity, better only on simple questions. The ad says exactly that, no more.
2. **A missed week shouldn't cost the planner.** Undated editions are a standard paid line at Passion Planner, BestSelf and Erin Condren (#8–10), which shows people pay to avoid dated blanks. Planner and Book's return ticket is the stronger answer.
3. **Choosing less screen.** Papier's CEO ties its growth to people deliberately limiting digital life (#1).
4. **Specific next steps.** If-then plans beat intentions alone (#5); the sheet's "next action" and "obstacle → activity" are that pattern.

## Meta ads (ads.html)

Positioning: for people who want one goal on paper and keep abandoning dated planners, Planner and Book is an undated goal planner with a return ticket and a companion book, unlike decorative or dated planners. Tagline: *Goals on paper, and a way back.*

| Frame | Angle | Headline | CTA | Destination |
|---|---|---|---|---|
| 01 | A · Paper remembers | Write the goal by hand | Download | /projects/planner/print.html |
| 02 | A · Paper remembers | One goal. One next move. | Download | /projects/planner/print.html |
| 03 | B · No backlog debt | Missed a week? Don't redo it. | Download | /projects/planner/print.html |
| 04 | B · No backlog debt | Come back where you are | Download | /projects/planner/print.html |
| 05 | C · Phone down | Goals on paper. A book in hand. | Learn more | /projects/planner/ |
| 06 | C · Phone down | "You have always been bright." | Learn more | /projects/planner/ |

Test: $60 per angle over 14 days, UTM per angle (`utm_campaign=planner&utm_content=a|b|c`). Keep an angle if CTR ≥ 1% and a printable visit costs ≤ $0.80 (`ASSUMPTION`: thresholds chosen in advance, not industry benchmarks). Angle C should wait until the shop's book "Notify me" form actually saves emails; today it is a demo that saves nothing. My bet: **B · No backlog debt**, because it is the one thing comparables don't say.

Before running: the free printable has no email capture today, so downloads can't be counted. Add a real counter or gated download first.

## Deck (deck.html): speaker notes

1. **Title.** Planner and Book is Lumen's paper edition: a goal planner you print or buy, and an illustrated book you unlock.
2. **Problem.** Dated planners turn a missed stretch into empty pages, and people quit. The story is illustrative; the interview stat is a TODO.
3. **Solution.** One goal, a sized next step, an obstacle toolkit, and a return ticket. The book is the deeper companion.
4. **Product.** Two working web demos today: the printable and the shop. (Weekline moved to its own project on 21 Nov 2026.)
5. **Why now.** Papier and Hobonichi show paper planners growing in 2024–2025, driven by social video and a choice to be less digital.
6. **Market.** Comparable brands sell near a million copies or $50M a year. Our year-3 math is deliberately small and fully assumed.
7. **Traction.** None yet. The first test is two weeks of Meta ads to the free printable, then pre-orders.
8. **Business model.** Free sheet, paid planner, Premium book. At an assumed $40 and $12 print cost, ~70% before shipping and ads.
9. **GTM.** Meta ads to the printable plus organic short video of the sheet being filled in.
10. **Competition.** Strong brands exist; most are dated or decorative. Our wedge is the return ticket plus the book.
11. **Team.** TODO.
12. **Ask.** TODO amount; funds go to print setup, book layout, and ad tests.

### Top 15 investor questions
1. *Why paper in 2026?* Papier +20% planner sales and Hobonichi's million-copy editions (#1–3). Paper is growing, not dying.
2. *What's the price?* [TODO] Comparable goal planners sell for $36–$60 (#8–10); we'll set ours from pre-orders.
3. *What's Premium and what does it cost?* Unlocks the full illustrated book, shared with Lumen. Price [TODO].
4. *How many downloads/users today?* [TODO] None counted yet; download tracking is the first fix.
5. *Who is the customer?* People with one meaningful goal who have abandoned a dated planner before. [TODO: validate with 20 interviews.]
6. *CAC?* Unknown until the ad test. Threshold set at ≤ $0.80 per printable visit (`ASSUMPTION`).
7. *Margins?* POD from $5.80/copy at Lulu's smallest planner spec (#6); we assume $12 for a real page count → ~70% before shipping and ads.
8. *Why won't Passion Planner add a return ticket?* They could. Our edge is the method (one goal, sizes, obstacles, return) plus the book and Lumen together.
9. *Is the book written? Who owns the rights?* [TODO]
10. *Why tie to Lumen?* Same psychology, warm audience. [TODO Lumen user count]
11. *Seasonality?* Planner buying peaks in Q4/back-to-school (Papier's best day was Black Friday, #1). Undated pages let us sell all year.
12. *Inventory risk?* Start with print-on-demand; move to offset runs only after pre-orders.
13. *Retail?* Papier reached ~4,300 doors (#1); not before DTC proves out.
14. *Is Weekline part of this?* No. Weekline is a separate project (NYC week plans) with its own page in the studio.
15. *How much are you raising?* [TODO]

### 3 weakest points (fix before pitching)
1. **No traction.** Run the two-week printable test and a pre-order page with a real price.
2. **No problem stat.** Interview 20 lapsed planner buyers; quote the share who quit after a missed stretch.
3. **No price.** Set planner and Premium prices; the market slide's $40 is a placeholder.

### Cold email (draft, don't send)
Subject: Paper goal planner that plans for the missed week
Hi [name], paper planners are growing again (Papier expects $50M+ this year, planner sales up 20%). Most still punish a missed week with dated blanks. Planner and Book is an undated goal planner with a "return ticket" and a companion illustrated book, from the team behind the Lumen habit game. We're running our first demand test now. Could I send the 12-slide deck? [TODO name]

## Social (social.html)

- Explainer headline: *Goals on paper, and a way back.* Shape: how it works (3 steps) + money strip. Prices shown as TBD on purpose.
- 5-second test: show the square PNG for 5 seconds, then ask: What does it do? Who's it for? Who pays? Pass = 4 of 5 friends get 2 of 3 right.
- Carousel: a how-to for the free sheet (value first), ending on the return ticket and "link in bio" to /projects/planner/print.html.
