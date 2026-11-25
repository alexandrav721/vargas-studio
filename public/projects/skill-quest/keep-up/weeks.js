/* Keep up: one object per week, NEWEST FIRST. Strict JSON inside (double quotes, no trailing commas) so
   review/keepup_weeks.py can read it and build keep-up/<slug>/index.html for every week.
   Every Friday (about 30 minutes):
   1. Pick 3 items from official sources (release notes, the FTC, attorney-general pages, company newsrooms).
      The top story is the one a normal person can try today.
   2. Write headline (8 words or fewer), what (25 or fewer), you (20 or fewer), a try link to OUR page or null (no button), and cat: Tools, Safety, Money or Rules.
   3. Take our own screenshot for the top story, crop to 1200x630, save keep-up/img/<slug>.jpg, add a line to img/CREDITS.md.
   4. Add the new week at the TOP of this list, run review/keepup_weeks.py, deploy. */
window.EZ_WEEKS = [
  {
    "week": "Week of Nov 17, 2026",
    "slug": "2026-11-17",
    "top": {
      "headline": "ChatGPT now types as you talk",
      "what": "OpenAI rolled out Live Dictation to every ChatGPT plan. Your words appear as you speak, with no 10-minute limit.",
      "you": "Tap the mic to dictate long notes or messages, even on the free plan.",
      "try": { "label": "Try it: Lesson 2", "url": "/projects/skill-quest/school/lesson-2.html" },
      "cat": "Tools",
      "img": "/projects/skill-quest/keep-up/img/2026-11-17.jpg",
      "alt": "The ChatGPT App Store page: three phone screens of the app, two with a mic button next to Ask ChatGPT.",
      "credit": "Our screenshot of the ChatGPT page on Apple's App Store (OpenAI), taken 25 Nov 2026",
      "source": "OpenAI",
      "url": "https://help.openai.com/en/articles/6825453-chatgpt-release-notes",
      "date": "Nov 18"
    },
    "items": [
      {
        "headline": "That panicked grandkid call could be fake",
        "what": "The FTC warned that scammers clone a grandchild's voice or fake a video call, then demand urgent, secret payment.",
        "you": "Hang up and call another relative to check before sending any money or gift cards.",
        "try": null,
        "cat": "Safety",
        "source": "Federal Trade Commission",
        "url": "https://consumer.ftc.gov/consumer-alerts/2026/11/grandpa-i-need-your-help-how-spot-and-avoid-grandkid-scams",
        "date": "Nov 18"
      },
      {
        "headline": "New York sets up an AI watchdog team",
        "what": "New York's attorney general created a unit to enforce a new AI safety law and police AI scams and privacy.",
        "you": "New Yorkers get a place to report AI harms. The law starts January 1, 2027.",
        "try": null,
        "cat": "Rules",
        "source": "New York State Attorney General",
        "url": "https://ag.ny.gov/press-release/2026/attorney-general-james-announces-creation-ai-safety-standards-enforcement-and",
        "date": "Nov 17"
      }
    ]
  }
];
