# Lumen print: Season streak card + Stuck games pocket cards

Files: `streak-card.html` (print source, US Letter, 2 pages, `?page=1|2` for a single sheet), `streak-card.pdf`, `streak-card-p1.png`, `streak-card-p2.png`. On-screen page: `../print.html`.

Distinct from the Planner project: no weekly pages, no journaling, no book. Page 1 is one fridge card for one season goal; page 2 is six cut-out wallet cards.

## What each element rests on (and how modest the paper claim is)

| On paper | Research | What we did NOT claim |
|---|---|---|
| "My if-then: When ___ I will ___" | Gollwitzer & Sheeran (2006), meta-analysis of 94 tests, if-then plans added a medium-to-large effect (d = .65) over goal intentions alone. *Advances in Experimental Social Psychology* 38, 69–119. https://doi.org/10.1016/S0065-2601(06)38002-1 · summary: https://www.socmot.uni-konstanz.de/publications/implementation-intentions-and-goal-achievement-meta-analysis-effects-and-processes | No effect size on the card. |
| 91 boxes (13 weeks), the gold "66" box, "People ranged from 18 to 254 days" | Lally, van Jaarsveld, Potts & Wardle (2010), 96 people, one daily cue-linked behaviour for 84 days; median 66 days to plateau automaticity, range 18–254 (upper end extrapolated). *European Journal of Social Psychology* 40, 998–1009. https://doi.org/10.1002/ejsp.674 · UCL summary: https://www.ucl.ac.uk/news/2009/aug/how-long-does-it-take-form-habit | We say "the median in one habit study", not "habits take 66 days". |
| Return tickets: "One miss: punch a ticket" | Lally et al. (2010): missing one opportunity did not materially affect habit formation; very inconsistent people did not form habits. | Hence the 2-misses rule, not unlimited skips. |
| "A streak that forgives" / ticket keeps the streak | Silverman & Barasch (2023), 7 studies: a broken logged streak lowers later engagement vs an intact one; the effect is weaker when people can "repair" the streak. *Journal of Consumer Research* 49(6), 1095–1117. https://doi.org/10.1093/jcr/ucac029 · https://www.colorado.edu/business/faculty-research/2023/04/19/or-track-how-broken-streaks-affect-consumer-decisions | Not claimed on paper as a stat; used in the social carousel with citation. |
| Exactly 3 tickets per season (limited, slightly costly) | Sharif & Shu (2017), goals with a small "emergency reserve" of skips (that cost something to use) were preferred and led to better persistence than rigid or easy goals. *Journal of Marketing Research* 54(3), 495–509. https://doi.org/10.1509/jmr.15.0231 · https://anderson-review.ucla.edu/emergency-reserves/ | "3" is a design choice (`assumption`), not a research number. |
| "Start day" + "start any day" | Dai, Milkman & Riis (2014), fresh-start effect: more goal pursuit after temporal landmarks (new week, month, birthday). *Management Science* 60(10), 2563–2582. https://doi.org/10.1287/mnsc.2014.1901 | Not printed; just why the card is undated. |
| "Stuck? Name the fog" → play a game | Mental contrasting with implementation intentions (WOOP): name the obstacle, then plan the response. Wang, Wang & Gai (2021) meta-analysis, 21 studies, small-to-medium effect g = 0.336; likely smaller after publication bias. *Frontiers in Psychology* 11:565202. https://doi.org/10.3389/fpsyg.2021.565202 | Footer says only "comes from research on". The six obstacle names are Lumen's own (from the Season Chapter page). |

Not research-backed and therefore not claimed as such: "two minutes is a check-in" (a popular rule of thumb, used as a house rule), the individual game mechanics (design ideas), and 13 weeks as a "season" (calendar quarter).

## Print checks
- `@page { size: letter; margin: 0 }`, sheet padding 0.5–0.55 in; PDF via headless Chrome is 2 pages.
- Ink: paper `#faf8f3`, text `#12151c`; gold text darkened to `#7a5f10` and sage to `#3f6650` so both clear 4.5:1 on the paper (brand gold `#c9a227` is too light for text on white).
- Cards are 3.6 × 2.62 in, dashed cut lines, single-sided.
