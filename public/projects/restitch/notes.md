# Restitch: deck notes and sources

Deck: `deck.html` (12 slides, 1280×720, arrow keys, `?slide=N`). Research done 21 Nov 2026. Every external number on a slide is listed under Sources with its URL and year. Anything not sourced is marked `assumption`, `projection` or `[TODO]` on the slide.

## Speaker notes (about 20 seconds each)

1. **Title.** Restitch is a thrift-flip planner. You upload a photo of a garment, pick your skill, and get a no-sew, a hand and a machine flip. The photo names the shape; you bring the tape. [TODO founder intro.]
2. **Problem.** About 60% of Americans bought secondhand last year (ThredUp 2026). The hard part isn't the find, it's the plan: every tutorial is someone else's garment on someone else's body, and many people don't own a machine.
3. **Solution.** Three moves: read the file (color, brightness, aspect, labeled as a guess), match the skill, use your own tape. No pattern PDF, no account.
4. **Product.** This is the live planner, run on a flat drawing of a dress. It read #3F5E85, 35% brightness, aspect 0.38, called it a long column, and returned a hand hem, a walking vent and a one-shoulder drape at Intermediate. A different photo gives a different read.
5. **Why now.** Pinterest says “thrift flip ideas” searches are up 610% (2026 Hobbies report). ThredUp says nearly half of shoppers now discover secondhand on social, and Gen Z and Millennials drive 71% of growth to 2030.
6. **Market.** For context, US secondhand apparel was about $55.5B in 2025. Our slice is bottom-up: ~30M Americans sew (a weak, secondary estimate), assume 20% flip a thrift piece a year, assume $19 a year. That gives a $114M serviceable market and, if 0.5% pay by year 3, about $570k. All of those inputs are assumptions to test.
7. **Traction.** Honest: the planner is built and live, with 29 flip recipes. We have counted zero users because there's no analytics, and the closet stays in the browser by design. The next step is a $150, 14-day Meta test.
8. **Business model.** Free now, since serving costs almost nothing. Charge later for more recipes (creator-written flip packs) and closet sync, priced under ReStitch ($29.99/yr) and Stash Hub ($32.99/yr). In-person flip nights are a later layer.
9. **Go-to-market.** Pinterest for search intent, Reels/TikTok for the before → after format. The honesty is the content hook. [TODO first-1,000 plan.]
10. **Competition.** The closest app, also called ReStitch, promises “smart photo analysis” and costs $12.99 a month. Rethread is a creator-led app in pre-launch. Restitch is free, needs no account, and shows exactly what it read.
11. **Team.** [TODO]
12. **Ask.** [TODO amount.] The money would prove three things: demand (who opens the planner), recipes (creator-tested on real photos) and price (a fake-door Plus at $19/yr).

## Top 15 investor questions

1. **Why would anyone pay if the read is so simple?** They pay for recipes and convenience, not the read. Plus = more creator-tested flips + sync. [TODO validate with fake door.]
2. **Isn't “ReStitch” taken?** Yes. An iOS app named “ReStitch: Fashion upcycling made easy” exists (Natalie Gemmer, 2025). A rename is likely needed before any launch. [TODO]
3. **What stops ReStitch or Rethread from copying the honesty?** Nothing technical. The bet is brand trust plus a recipe library. Weak moat today.
4. **How many users do you have?** Zero counted. No analytics installed.
5. **Why web and not an app?** No install and no account. Cost to serve ≈ $0. Native later only if retention needs it (and then app stores take 15–30%).
6. **How do recipes scale past 29?** Creator-written packs with a revenue share. [TODO terms]
7. **What's retention for a once-per-find tool?** Unknown. Flips are episodic; the closet and new recipe packs are the reasons to return. [TODO measure]
8. **Isn't YouTube free and good enough?** For learning a technique, yes, and Restitch links out to technique pages. YouTube doesn't start from your garment and your numbers.
9. **Does the read ever get it wrong?** It's a pixel average, so a busy background shifts it. It is labeled a visual guess, and the skill and tape do the real work.
10. **Will you add AI?** Not to invent measurements. Any future model would have to stay labeled and keep the tape typed by the user. [TODO decide]
11. **CAC?** Unknown. The ad test sets the first number; keep/kill thresholds are on the ads page.
12. **Why does thrift-flipping keep growing?** Price, uniqueness and sustainability (Good On You; Fortune 2025), plus discovery moving to social (ThredUp 2026).
13. **Any ethical risk?** Critics say flippers buy up scarce plus sizes and gentrify thrift stores. Creative will not show cutting down plus-size pieces.
14. **What would make you stop?** If landing → planner click-through is under 10% across all three angles after 14 days.
15. **What's the 18-month milestone?** [TODO] Proposed: 10k monthly planner users, 3 creator packs, a price test result.

## Three weakest points (fix before pitching)

1. **No usage data.** Install privacy-light analytics (count uploads and saves, never the photo) and run the ad test.
2. **Name collision.** An App Store app already uses “ReStitch.” Check trademark and pick a name before spending on ads.
3. **The market math rests on a weak sewist estimate and two assumptions.** Replace the 30M figure with a primary survey (e.g. Mintel arts & crafts) and test the 20% / $19 assumptions with a survey of ≥100 thrift shoppers.

## Cold email (draft, not sent)

> Subject: Thrift flips, planned from one photo
>
> Hi [name], about 60% of Americans bought secondhand last year, and Pinterest says “thrift flip ideas” searches are up 610%. The hard part is the plan. Restitch reads a garment photo's color and shape, matches your sewing skill, and gives you a no-sew, a hand and a machine flip, using measurements you type yourself. It's live and free: vargas-studio.pages.dev/restitch.html. I'm running a small demand test this month and would value 15 minutes of your read on it. [TODO name]

## Sources

| Figure | Where used | Source (URL, year) |
|---|---|---|
| ~60% of US consumers bought secondhand in 2025; US secondhand apparel $55.5B in 2025, ~14% growth, 12% of $458B apparel spend | Deck 2, 6; cold email | GCN, “About 60% of American consumers bought something secondhand”, citing ThredUp's 14th Resale Report with GlobalData: https://gcn.com/about-60-american-consumers-bought-something/20358/ (Aug 2026). Secondary; ThredUp's own PDF could not be text-extracted. |
| US secondhand to reach $78.8B by 2030; global $393B (~10% of apparel); ~50% discover secondhand via social/creators; Gen Z + Millennials 71% of growth through 2030 | Deck 5, 6; ads page | ThredUp newsroom, 14th Annual Resale Report: https://newsroom.thredup.com/news/thredup-14th-resale-report (Apr 2026) |
| “Thrift flip ideas” +610%, “refashion clothes upcycling” +230%, “repair aesthetic” +167% | Deck 5; ads page; cold email | Pinterest 2026 Hobbies Trend Report: https://newsroom.pinterest.com/news/2026-pinterest-hobbies-trend-report/ (Aug 2026). Comparison window not stated on the page. |
| ~30M people sew in the US | Deck 6 (marked weak) | K-LOVE News citing Customcy (Feb 2025): https://www.klove.com/news/fun-unusual/millions-of-us-are-having-fun-sewing-even-in-the-digital-age-54546 (Apr 2025). Secondary, not a primary survey. |
| 11.3M tons of textiles landfilled in the US in 2018 | Ad frame 5 | US EPA, Textiles: Material-Specific Data: https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/textiles-material-specific-data (latest data year 2018) |
| ReStitch app: Premium $12.99/mo, $29.99/yr; “smart photo analysis”; 101 ratings | Deck 8, 10 | App Store listing: https://apps.apple.com/app/id6749212071 (versions 2025) |
| Rethread: pre-launch iPhone app by Cait Conquers; scan → creator tutorials; first scan free | Deck 10 | https://www.builtbyfoundry.io/rethread (checked Nov 2026) |
| Stash Hub Premium $3.49 and $32.99 (US in-app purchases) | Deck 8, 10 | App Store listing: https://apps.apple.com/us/app/stash-hub/id1610930077 (checked Nov 2026) |
| Depop removed the 10% US seller fee (buyers pay a marketplace fee) | Deck 10 | Depop newsroom: https://news.depop.com/depop-removes-selling-fees-in-the-united-states-evolves-fee-structure/ (2024) |
| Gen Z sewing for money-saving and screen breaks; upcycled fashion market $8.54B (Precedence Research) | Ads page | Fortune / Morning Brew: https://fortune.com/2025/09/22/gen-z-sewing-hobby-get-off-phone-save-money/ (Sep 2025) |
| Thrift-flip video format: before → process → after, low thrift price, “beginner friendly”; gentrification critique | Ads page | Daily Dot: https://www.dailydot.com/culture/thrift-flip-tiktok-trend (Aug 2025) |
| Motives (sustainability, uniqueness) and critiques (plus-size scarcity) | Ads page, Q13 | Good On You: https://goodonyou.eco/thrift-flipping-trend/ (undated, ~2021) |
| App stores take 15–30% of in-app subscriptions | Deck 8 | Revenue model library benchmark (Nov 2026), Apple/Google standard commission tiers |

## Assumptions (all labeled on slides)

- 20% of US sewists flip a thrift piece in a year.
- $19/yr Plus price.
- 0.5% of the serviceable market paying by year 3.
- $150 test budget; keep at ≥25% landing → planner, kill under 10%; fake-door Plus keep at ≥3% click.
