# Scrolll prototype: how the money works (and what's made up)

`app.html` is a clickable demo. People, brands, prices and the split are **samples**. Scrolll's own pages say the split is **TBD, disclosed before you earn**; nothing here changes that.

## The mechanism shown

1. **Only sponsored posts earn.** Regular posts pay $0. Sponsored posts are always labeled.
2. **A view counts at the industry "viewable" bar:** at least half the post on screen for 1 continuous second (pictures) or 2 seconds (video). Scroll away early and the timer resets.
3. **The advertiser's price for that view is split** between the viewer, the creator hosting the feed, and Scrolll. Prototype placeholder: 50 / 20 / 30.
4. **You choose topics and a "never" list**, plus a cap on sponsored posts per hour. Ad-free is a switch; earning stops.
5. **Earnings sit pending ~48 h** (bot and fraud checks), then become payable at a **$5 minimum**, paid monthly.

## Sample numbers used

| Thing | Sample value | Why it's plausible |
|---|---|---|
| Advertiser price per counted picture view | 1.2¢ (= $12 CPM) | assumption, mid-range social CPM |
| Per counted video view | 2.0¢ (= $20 CPM) | assumption, video usually costs more |
| Viewer share | 50% | placeholder; Brave launched at 70% to users |
| Host creator share | 20% | placeholder; Scrolll pages promise creators a "host share" |
| Payout minimum | $5 | similar to Swagbucks PayPal and Mistplay gift-card floors |
| Pending hold | 48 h | Mistplay holds rewards while it verifies activity |

Result: about **$3–4 a month** for a daily scroller (408 ads in 3 weeks). The prototype says so plainly. Small money is the honest story; the pitch is fairness, not riches.

## How real attention-reward products pay

- **Brave Rewards / Brave Ads**: opt-in ads; users pick formats and set a max number of notification ads per hour; ad matching happens on the device. At launch (2019) Brave said users get **70%** of ad revenue from user ads. Today's page says users earn a share "greater than or equal to Brave's share". Payout needs a connected custodial or self-custody account.
  - https://brave.com/brave-rewards/ (opened Nov 2026)
  - https://brave.com/brave-ads-launch/ (2019)
- **Swagbucks**: points worth 1¢ each (100 SB = $1). Gift cards from about $3; PayPal minimum quoted at $5 by most reviews (some say $25). Sources conflict.
  - https://www.finder.com/make-money-online/swagbucks-review
  - https://www.doctorofcredit.com/cash-swagbucks-balance/
- **Mistplay**: units earned at game checkpoints, with a personal multiplier; rates differ by user; rewards can be **held while verified**; redemptions capped at **$550/year**; units expire after 180 days idle. Business model: game developers pay more per player than Mistplay pays out.
  - https://www.mistplay.com/legal/economy-disclosure (opened Nov 2026)
- **What counts as "seen"**: Media Rating Council viewable impression standard: 50% of pixels in view for 1 continuous second (display) or 2 continuous seconds (video); same for mobile in-app.
  - https://www.iab.com/wp-content/uploads/2015/06/MRC-Viewable-Ad-Impression-Measurement-Guideline.pdf (2014/2015)
  - https://mediaratingcouncil.org/sites/default/files/News/Audit-activity/050415_Mobile%20Viewability%20Interim%20Guidance_final.pdf (2015)

## Lessons we took

- Show the per-view cents. Brave and Mistplay users complain when earnings feel opaque; a "why you earned this" sheet answers that.
- Cap and choice up front (Brave's ads-per-hour setting) keeps the feed from feeling like a slot machine.
- Hold + minimum is normal and protects advertisers from bots; say so instead of hiding it.

## Prototype controls

- `app.html?screen=1..6` jumps to a screen (4 opens the why sheet).
- `&scroll=400` with screen 3 pre-scrolls the feed (for screenshots).
- Press **D** (or add `&demo`) for demo mode: the next tap is outlined.

## User-test kit (5 people)

Tasks:
1. "Pick ads about two things you'd actually buy, and block one you never want."
2. "Scroll until you've earned something. How did you know?"
3. "Find out why you earned that, and who else got paid."
4. "How much do you have, and when can you get it out?"
5. "Turn ads off completely."

Questions: What did you expect a sponsored post to pay? What was confusing? Would ~$3–4 a month change how you feel about ads? Who else would use this? What would make you stop?

| Tester | Tasks done (of 5) | Expected pay | Confusing bit | Would use? |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
