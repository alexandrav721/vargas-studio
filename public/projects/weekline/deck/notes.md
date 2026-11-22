# Weekline: deck notes and sources

Deck: `../deck.html` (12 slides, 1280×720, arrow keys, `?slide=N`). Written 21 Nov 2026 from Weekline's brief, marketing, revenue and research notes. Every external number on a slide is listed under Sources with its URL and year. Anything not sourced is marked `assumption`, `projection`, `target` or `[TODO]` on the slide.

## Speaker notes (about 20 seconds each)

1. **Title.** Weekline turns NYC's noisy calendar into a week you can live. It's a week planner for Manhattan and Brooklyn locals, 25 to 40. The sheet on the right is a real week the private MVP built today. [TODO founder intro, date and city of pitch.]
2. **Problem.** There's always something on, and most weeks still end with "idk you pick." Feeds and newsletters give lists, not a week. Goals like "get fit" never reach the calendar. The person on the slide is a composite from the target customer profile, not a quote. About 1.17M people aged 25–39 live in Manhattan and Brooklyn.
3. **Solution.** Two rituals, one plan layer. Crew week fills the nights you want: crew, zone, radius, budget, then a Monday-to-Sunday Sheet. Seeking schedules who you're becoming: a life goal becomes a dated week with a reason on each row. Every row says where it came from, and thin weeks stay thin.
4. **Product.** These are screenshots of the private MVP. The crew week has four live NYC Parks rows, one sample row and two nights left open on purpose. The Seeking week has two live rows and says "empty on purpose" for the rest. We don't pad.
5. **Why now.** NYC grew by 87,000 people in a year. The city publishes 553 Parks events in a free 14-day feed. Money is going to ticketing (Fever raised $250M; Eventbrite's ads grew 83% while paid tickets fell). That money sells one ticket at a time; the week is still unplanned.
6. **Market.** Bottom-up: 1.17M residents aged 25–39 times $16 a year is about $18.7M. If 30% plan weekly, that's about $5.6M reachable. The year-3 base case is 10,000 weekly planners, about $160K. All of the per-planner and share numbers are assumptions. NYC is the beachhead; venture scale needs about 100K planners or a second city.
7. **Traction.** Honest: built and working, not yet tested with people. Zero counted users, zero waitlist, zero revenue. The next step is a soft invite to 30–50 NYC locals with keep-going targets set in advance.
8. **Business model.** Free planning now, and free events stay free forever. At about 200 weekly planners, a "Get tickets" affiliate link on paid rows. Once people come back weekly, a Plus plan ($4–6 a month, to test). At about 1,000, one labeled promoted row per sheet. We never sell job or love intent data. All unit economics are assumptions.
9. **Competition.** Feeds own browsing, ticket desks own checkout. Weekline plans the week above them and sends people to their checkout. The real competitor is the group chat full of screenshots, so the Sheet is built to be sent there.
10. **Go-to-market.** Show the Sheet in three seconds. A $240, two-week Instagram test on three angles, plus soft invites through Brooklyn creators, run clubs and NYC subreddits. Nothing has run yet.
11. **Team.** Alexandra Vargas, designer, built the MVP herself. [TODO] years, past work, why NYC weeks; co-founder, community partner and advisors are open.
12. **Ask.** [TODO amount, round, use of funds, runway.] The money proves the Sunday ritual in four milestones: soft invite, ticket handoff at ~200 weekly planners, partner rows for Seeking, promoted rows at ~1,000.

## Top 15 investor questions

1. **How many users do you have?** None counted. It's a private MVP; the soft invite is the next step.
2. **Isn't this just Eventbrite or Fever?** They sell tickets one event at a time. Weekline builds the whole week, including free and community rows, and hands paid rows to their checkout.
3. **Where does the inventory come from?** Today only NYC Parks is live, from NYC Open Data. Other rows are labeled Sample or Editorial. Meetup, Luma and library feeds are not wired yet.
4. **What if a week is empty?** It says so. Thin weeks stay thin; that honesty is part of the product.
5. **Why Manhattan and Brooklyn only?** Density of events and of the 25–40 customer (about 1.17M people aged 25–39). Other boroughs come after the ritual works.
6. **What's the difference between Crew and Seeking?** Crew fills nights you want with people; Seeking schedules a life goal (fitness, friends, network, job, love). Same brand, two rituals, never merged.
7. **Does it learn?** Only lock and skip today (v0). A full learning loop is not built, so we don't claim it.
8. **Google Calendar?** .ics export works. Calendar sync is a scaffold, not live.
9. **How do you make money if events are free?** Affiliate links on paid rows, then Plus, then labeled promoted rows. Free events are never paywalled.
10. **Will you sell data?** No. Job and love intent data are never sold.
11. **What's the affiliate rate?** Unknown for us. A third party lists Fever's at 1.6–12% by category; Fever doesn't publish it. The model uses 4–8% as an assumption.
12. **Is $16 a year per planner realistic?** It's an assumption, blended from affiliate, Plus and promoted rows. The soft invite and fake-door tests will replace it.
13. **Why will people come back weekly?** That's the bet: the Sunday ritual. The soft-invite target is 25% returning within 14 days.
14. **What does it cost to acquire a planner?** Unknown. The $240 Instagram test sets the first number; keep an angle at ≤ $3 per invite request.
15. **What's the 18-month plan?** The four milestones on slide 12, each with a threshold set before the test.

## Three weakest points (fix before pitching)

1. **No people yet.** Run the 30–50 person soft invite and count builds, locks, shares and 14-day returns.
2. **Supply is one feed.** Wire one partner source (Meetup or Luma) for Seeking's friends and network goals, or gate those goals.
3. **The money is all assumption.** Run the fake-door "Get tickets" and Plus buttons and replace the $16-a-year blend with measured numbers.

## Sources

| Figure | Slide | Source (URL, year) |
|---|---|---|
| Brooklyn 672,163 and Manhattan 493,255 residents aged 25–39 (≈1.17M) | 2, 6 | U.S. Census Bureau, ACS 2024 1-year, table B01001, via Census Reporter: https://censusreporter.org/data/table/?table=B01001&geo_ids=05000US36047,05000US36061 (2025) |
| NYC +87,000 residents mid-2023 → mid-2024; Manhattan +1.7% | 5 | NYC Dept. of City Planning, *Population Estimates and Trends*, May 2025: https://s-media.nyc.gov/agencies/dcp/assets/files/pdf/data-tools/population/population-estimates/new-york-city-population-estimates-and-trends_may-2025.pdf (2025) |
| 553 NYC Parks events in the 14-day feed (citywide, queried 21 Nov 2026) | 5 | NYC Open Data, dataset w3wp-dpdi: https://data.cityofnewyork.us/resource/w3wp-dpdi.json?$select=count(*) (2026) |
| Fever raised $250M, Sept 2026 | 5, 9 | Music Business Worldwide: https://musicbusinessworldwide.com/dice-owner-fever-raises-250m-led-by-eqt-in-what-it-calls-the-largest-ever-round-for-a-live-entertainment-tech-company (2026) |
| Eventbrite FY2024 net revenue $325.1M; paid tickets −10%; Eventbrite Ads +83% | 5, 9 | Eventbrite Q4 2024 shareholder letter, SEC: https://www.sec.gov/Archives/edgar/data/1475115/000147511525000025/q4shareholderletterfinal.htm (2025) |
| Luma: 5% fee on paid tickets on the free plan, or Plus $59/mo (annual) | 9 | https://luma.com/pricing (2026) |
| Untapped New York: 58,000+ newsletter subscribers | 9 | https://www.untappedcities.com/advertise (2026) |
| DoNYC: $1,000 dedicated email per 6.5K sends (promoted-row anchor) | 8 | https://donyc.com/p/partner-with-us (2026) |
| Fever affiliate 1.6–12% by category (third party; Fever doesn't publish it) | 8 | https://www.flexoffers.com/affiliate-programs/fever-up-affiliate-program (2026) |
| Tyra, NYCPlanit, The Skint, Time Out | 9 | Named in Weekline's pitch site; not re-verified, no numbers used |

## Assumptions (all labeled on slides)

- $16 per planner per year, blended from affiliate, Plus and promoted rows.
- 30% of residents aged 25–39 plan going out weekly.
- 10,000 weekly active planners in year 3 (base case).
- Plus at $4–6 a month; promoted row about $250 a weekly slot; affiliate 4–8%.
- Cost to serve under $0.05 per planner per month; about $10 to acquire an activated planner; about 8 months payback.
- Test budget $240; soft-invite and ad thresholds are targets set before the test.

## Cold email draft (founder sends; never sent by Claude)

Subject: Weekline: a week planner for NYC, private MVP

Hi [name], I'm Alexandra Vargas, a designer who codes. I built Weekline, a private MVP that turns what's on in Manhattan and Brooklyn into a Mon–Sun Sheet you can send, plus a Seeking calendar for goals like getting fit. Only NYC Parks events are live today, and every row says where it came from. No users yet: I'm running a 30–50 person soft invite next. Could I send the 12-slide deck? [TODO contact]
