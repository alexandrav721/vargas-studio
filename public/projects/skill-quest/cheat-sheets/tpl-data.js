/* AI Made EZ project templates (kits merged in). Built by all-nighter kits/gen.py from templates_data.py + kits_data.py. */
window.EZ_TPL = {
"sample": "Sample, made up for testing. Mira and her bakery are fictional.",
"checked": "25 Nov 2026",
"base": "https://vargas-studio.pages.dev/projects/skill-quest/cheat-sheets/",
"templates": [
{
"id": "website",
"name": "Your website",
"icon": "web",
"promise": "How you build a one-page website with a real link.",
"covers": [
[
"who",
"Who it’s for"
],
[
"words",
"Your words"
],
[
"contact",
"Hours and contact"
],
[
"photos",
"Photos"
],
[
"look",
"Look"
],
[
"pages",
"Pages"
],
[
"publish",
"Publish"
]
],
"fields": [
{
"key": "biz",
"label": "Your business name",
"hint": "What’s on the sign.",
"ex": "Mira’s Bakery",
"covers": "who",
"multi": false
},
{
"key": "action",
"label": "The one thing visitors should do",
"hint": "Order, book, call or come in.",
"ex": "come in on Saturday or order a custom cake",
"covers": "who",
"multi": false
},
{
"key": "who",
"label": "Who visits, and what they want fast",
"hint": "Picture one real person.",
"ex": "Neighbors who walk by on the way to work, and parents planning birthdays. They want hours, prices and how to order, fast.",
"covers": "who",
"multi": true
},
{
"key": "headline",
"label": "Your headline",
"hint": "What you sell, in under 8 words.",
"ex": "Bread and buns, baked at 6, gone by noon.",
"covers": "words",
"multi": false
},
{
"key": "offer",
"label": "What you sell, with prices",
"hint": "Real prices only.",
"ex": "sourdough $8, rye loaf $7, cardamom buns $4.50 (Saturdays only), custom cakes from $48 (3 days’ notice).",
"covers": "words",
"multi": true
},
{
"key": "about",
"label": "About you, in 2 sentences",
"hint": "Who’s behind it.",
"ex": "I’m Mira. I bake everything here, using my grandmother’s Swedish recipes.",
"covers": "words",
"multi": true
},
{
"key": "hours",
"label": "Hours and address",
"hint": "",
"ex": "Tue–Sat 7am–2pm. 14 Elm Street.",
"covers": "contact",
"multi": false
},
{
"key": "contact",
"label": "Your main button",
"hint": "What it says and where it goes.",
"ex": "Order a cake (opens email to orders@example.com).",
"covers": "contact",
"multi": false
},
{
"key": "photos",
"label": "Your photos",
"hint": "No photos yet? Say “leave photo boxes”.",
"ex": "leave clearly marked photo boxes, I’ll add mine.",
"covers": "photos",
"multi": false
},
{
"key": "look",
"label": "The feel you want",
"hint": "Pick 3 words, or name a shop you like.",
"ex": "warm, lots of space, big photos, like a neighborhood shop.",
"covers": "look",
"multi": false
},
{
"key": "pages",
"label": "How many pages",
"hint": "One page is best for version 1.",
"ex": "One page",
"covers": "pages",
"multi": false
},
{
"key": "tool",
"label": "Where you’ll build it",
"hint": "Bolt gives a free public link.",
"ex": "Bolt (bolt.new)",
"covers": "publish",
"multi": false
}
],
"brief": [
[
"goal",
"Build a one-page website for {biz}. Visitors should {action}."
],
[
"who_its_for",
"{who}"
],
[
"context",
"Sections, in this order: 1) Headline: {headline} 2) What we sell: {offer} 3) About: {about} 4) Hours: {hours} 5) Contact button: {contact} Photos: {photos}"
],
[
"example",
"The feel I want: {look}"
],
[
"format",
"{pages}. Designed for a phone first. One big button for the main action. Easy-to-read text."
],
[
"rules",
"Use only the facts I gave. No made-up reviews, prices or awards. No stock photos of people. Ask me before adding pages."
]
],
"kit": "first-website",
"tools": [
[
"Bolt (bolt.new)",
"Free",
"Start here. Sign up free, paste the sheet into the chat box. Publish gives a free public link. A free allowance that refills daily."
],
[
"Google AI Studio",
"Free",
"Personal Google accounts can publish up to 2 apps free (not work or school accounts)."
],
[
"Lovable",
"Free",
"5 build credits a day. Free sites are invite-only: up to 10 people by email."
],
[
"Claude or ChatGPT",
"Paid for a link",
"Both can build it on Free. A public link needs Claude Pro, or ChatGPT Plus (build it as a Site, Deploy, Share)."
]
],
"stuck": [
[
"It broke after a change",
"Stop clicking Fix (each try uses up your free allowance). Go back to the last version that worked, describe what you see in plain words, and add “Explain what went wrong first. Don’t change anything yet.”"
],
[
"I ran out of free credits",
"They come back daily, up to a monthly cap. Come back tomorrow, or switch to Google AI Studio."
],
[
"I want my own .com",
"Custom domains are on paid plans. You don’t need one for version 1."
],
[
"It made up reviews or prices",
"Say “Delete anything I didn’t give you.” This is why the rules box exists."
]
],
"privacy": "Don’t paste private customer details into any builder. Lovable says Free and Pro content may train its models unless you turn that off.",
"time": "45–60 min",
"cost": "Free",
"steps": [
{
"t": "Paste it into Bolt",
"d": "Go to bolt.new, sign up free, and paste the whole brief into the chat box. (Any tool from the list works.)",
"ok": "You see a page with your headline and your prices."
},
{
"t": "Fix the words",
"d": "Read it as a stranger. Then paste:",
"p": "Change only the words. Make the headline say what I sell in under 8 words. Remove anything I didn’t tell you.",
"ok": "Every sentence is true about your business."
},
{
"t": "Check it on a phone",
"d": "Paste:",
"p": "Check the page at phone size. Make the button big and easy to tap, and make sure nothing runs off the side.",
"ok": "Use your tool’s preview at phone size, or open it on your phone."
},
{
"t": "Add your photos and publish",
"d": "Attach a photo in the chat and say “Put this in photo box 1.” Repeat. Then click Publish.",
"ok": "Open the link on your phone. Text it to one person."
}
],
"where": "tool",
"proof": {
"kitScore": 5.0,
"plainScore": 1.5,
"winner": "template",
"reason": "The template answer uses Mira's exact facts, prices, hours, address and email order button with clear photo placeholders and nothing invented, while the plain answer had none of them, so it built a different bakery (Golden Crumb) with made-up products, prices, hours, address, phone and story.",
"plainAsk": "Make me a website for my bakery.",
"plainImg": "../kits/img/first-website-plain.jpg",
"kitImg": "../kits/img/first-website-template.jpg"
},
"lead": null,
"sample": "Sample, made up for testing. Mira and her bakery are fictional.",
"pdf": "../summaries/kit-first-website.html"
},
{
"id": "app",
"name": "Your app",
"icon": "app",
"promise": "How you plan a small app, room by room.",
"href": "../build-kit/"
},
{
"id": "month-of-posts",
"name": "A month of posts",
"icon": "posts",
"promise": "How you write a month of posts in your voice.",
"covers": [
[
"when",
"Platform and dates"
],
[
"who",
"Who follows you"
],
[
"voice",
"Your voice"
],
[
"news",
"This month"
],
[
"best",
"Posts that worked"
],
[
"limits",
"Length and no-go words"
]
],
"fields": [
{
"key": "platform",
"label": "Where you post",
"hint": "",
"ex": "Instagram",
"covers": "when",
"multi": false
},
{
"key": "month",
"label": "Which month",
"hint": "",
"ex": "March",
"covers": "when",
"multi": false
},
{
"key": "cadence",
"label": "How often",
"hint": "3 a week is plenty.",
"ex": "3 a week (Tue, Thu, Sat)",
"covers": "when",
"multi": false
},
{
"key": "who",
"label": "Who follows you",
"hint": "And why they follow.",
"ex": "Locals who stop by on the way to work, and parents planning birthdays.",
"covers": "who",
"multi": true
},
{
"key": "voice",
"label": "How you sound",
"hint": "Paste your Sounds like me profile, or describe it.",
"ex": "short, warm, plain words, a little dry; I say “See you at 7” and “gone by noon”; no emojis.",
"covers": "voice",
"multi": true
},
{
"key": "news",
"label": "What’s happening this month",
"hint": "Dates, new things, prices, closures.",
"ex": "cardamom buns every Saturday ($4.50, sell out by 11); new hot cross buns from March 17 ($3.75, until Easter); closed Tuesday March 3 for an oven repair; custom cakes need 3 days’ notice, from $48.",
"covers": "news",
"multi": true
},
{
"key": "best",
"label": "Two posts that did well",
"hint": "Paste them.",
"ex": "“Rye loaves are back. Crusty outside, soft inside, gone by noon. See you at 7.” and “We’re out of flour dust and into spring. Open 7am.”",
"covers": "best",
"multi": true
},
{
"key": "length",
"label": "Words per post, at most",
"hint": "",
"ex": "40",
"covers": "limits",
"multi": false
},
{
"key": "avoid",
"label": "What never to write",
"hint": "Words, emojis, hashtags.",
"ex": "No hashtags. No emojis. Don’t say “indulge”, “mouthwatering” or “treat yourself”.",
"covers": "limits",
"multi": false
}
],
"brief": [
[
"goal",
"Write 12 {platform} posts for {month}: {cadence}."
],
[
"who_its_for",
"{who}"
],
[
"context",
"My voice: {voice} This month: {news} Two posts that did well: {best}"
],
[
"format",
"A table: date, post, photo idea. Each post under {length} words."
],
[
"rules",
"Use only my facts and dates. {avoid}"
]
],
"kit": "month-of-posts",
"tools": [
[
"Claude, ChatGPT or Gemini",
"Free",
"Any of them. The prompt is the same."
]
],
"stuck": [
[
"They all sound the same",
"Say “Mix it up: 4 news, 4 behind the scenes, 4 questions to followers.”"
],
[
"It invented an event",
"Say “Remove anything not on my list.”"
]
],
"privacy": "Take out names, phone numbers and anything private before you paste.",
"time": "30–45 min",
"cost": "Free",
"steps": [
{
"t": "Paste your brief",
"d": "Open Claude, ChatGPT or Gemini. Paste the whole brief as your first message and send.",
"ok": "You get the whole thing back in one answer."
},
{
"t": "Cut the weak ones",
"d": "Paste:",
"p": "Mark the 3 weakest posts and rewrite them more like the two that did well.",
"ok": "You’d post all 12."
},
{
"t": "Put them in a calendar",
"d": "Copy the table into a sheet or your scheduler.",
"ok": "12 rows, 12 dates."
}
],
"where": null,
"proof": {
"kitScore": 4.3,
"plainScore": 1.5,
"winner": "template",
"reason": "The template answer gives the 12 short dated Tue/Thu/Sat posts in a table with photo ideas and Mira's real facts, with a few small invented details like the 7am opening time, while the plain answer had no facts to use, so it gave a generic 20-post plan that has emojis, hashtags and placeholders.",
"plainAsk": "Write a month of Instagram posts for my bakery.",
"plainOut": "# A Month of Instagram Posts for Your Bakery\n\nI don't know your bakery's name, specialties or location, so I wrote this to work for most bakeries. Swap in your own items in the [brackets]. The plan is 4 weeks with 5 posts a week, which makes 20 posts. Stories are optional extras.\n\n**Weekly rhythm**\n- **Mon:** Behind the scenes\n- **Tue:** Product spotlight\n- **Wed:** Tip, story or education\n- **Thu:** Community and customers\n- **Fri/Sat:** Weekend special or call to action\n\n---\n\n## Week 1: Meet the Bakery\n\n**Day 1 (Mon): Behind the scenes (Reel)**\nCaption: 4 a.m. and the ovens are already warm. Here's what happens before you wake up. What time do you think we start? 👇\nVisual: Time-lapse of dough being shaped, or the first tray coming out.\nHashtags: #[YourTown]Bakery #BehindTheScenes #BakersOfInstagram #FreshBaked\n\n**Day 2 (Tue): Product spotlight (Photo)**\nCaption: Meet our [signature item]. [One sentence on what makes it special: the butter, the recipe, the slow rise.] It's the one people come back for. Have you tried it?\nVisual: Close-up in natural light, with a bite taken or a cross-section.\n\n**Day 3 (Wed): Our story (Carousel)**\nCaption: Why we started [Bakery Name]. Swipe to see how it began. [Two or three honest sentences about your why.]\nSlides: 1) Old photo or the first day. 2) The first recipe. 3) The team today. 4) \"Come say hi.\"\n\n**Day 4 (Thu): Community (Photo)**\nCaption: Our regulars are the best part of this job. Tag your favorite coffee-and-pastry order and we'll feature a few this week.\nVisual: Your counter, a happy customer (with permission), or a full pastry case.\n\n**Day 5 (Sat): Weekend special (Photo)**\nCaption: This weekend only: [special item]. Limited batch, so come early. Open [hours].\nVisual: Hero shot of the special on a tray.\n\n---\n\n## Week 2: Taste and Craft\n\n**Day 6 (Mon): Process (Reel)**\nCaption: Watch a croissant get its layers. Yes, it takes three days. No, we won't rush it.\nVisual: Laminating, folding, cutting, baking. Add trending or soft kitchen audio.\n\n**Day 7 (Tue): Poll (Story or feed)**\nCaption: Settle this: sweet or savory breakfast? Vote below. Winner gets a special on Friday.\nVisual: Split image with a pastry on each side.\n\n**Day 8 (Wed): Tip (Carousel)**\nCaption: 5 ways to keep bread fresh longer. Save this for later.\nSlides: 1) Don't refrigerate it. 2) Store it cut-side down. 3) Freeze slices. 4) Revive in the oven. 5) Use stale bread for toast or croutons.\n\n**Day 9 (Thu): Meet the team (Photo)**\nCaption: This is [Name]. They've been shaping loaves here for [X] years. Their favorite thing on the menu? [Item]. Ask them about it next time you visit.\nVisual: Portrait in the kitchen, flour on the apron.\n\n**Day 10 (Fri): Pre-order push (Photo)**\nCaption: Weekend orders are open. Cakes, boxes and brunch trays. Message us or use the link in bio by [day].\nVisual: A beautiful box or cake.\n\n---\n\n## Week 3: Seasonal and Social Proof\n\n**Day 11 (Mon): Seasonal launch (Reel)**\nCaption: It's here. Our [seasonal item: pumpkin loaf, peppermint cookies, etc.]. Available through [date].\nVisual: Reveal with a smooth pan across the display.\n\n**Day 12 (Tue): Customer review (Graphic)**\nCaption: \"[Real review quote]\" - [First name]. Thank you. Messages like this make the 4 a.m. mornings worth it.\nVisual: Quote on a brand-colored background beside a product photo.\n\n**Day 13 (Wed): Ingredient story (Photo)**\nCaption: Where our [flour/butter/fruit] comes from. We care about it because it shows up in every bite. [Local supplier name, if you have one.]\nVisual: The ingredient, or a photo of the supplier or farm.\n\n**Day 14 (Thu): Q&A (Story or Reel)**\nCaption: Ask us anything: recipes, wholesale, custom cakes, dietary options. We'll answer a few in a Reel this weekend.\n\n**Day 15 (Sat): Weekend special (Photo)**\nCaption: Saturday treat: buy [X], get [a small bonus]. Show this post at the counter. While supplies last.\n\n---\n\n## Week 4: Celebrate and Convert\n\n**Day 16 (Mon): Before and after (Reel)**\nCaption: Plain cake to showstopper in 30 seconds. Custom orders open for [upcoming holiday or event].\nVisual: Fast decorating time-lapse.\n\n**Day 17 (Tue): Menu guide (Carousel)**\nCaption: First time here? Here's what to order. Our top 5 for first-timers.\nSlides: One item per slide, with a one-line description.\n\n**Day 18 (Wed): Fun and relatable (Photo or Reel)**\nCaption: Me: \"I'm just popping in for bread.\" Also me, leaving with a bag of cookies. 🍪 Tell us your most \"I only came for…\" moment.\n\n**Day 19 (Thu): Gratitude (Photo)**\nCaption: A month of sharing our work with you. Thank you for the support, the shares and the tags. What do you want to see more of next month?\nVisual: Team photo or a full display case.\n\n**Day 20 (Fri/Sat): Holiday or giveaway (Photo)**\nCaption: GIVEAWAY: win a box of [item] for you and a friend. To enter: 1) follow us, 2) like this post, 3) tag a friend. Ends [date].\n\n---\n\n## Quick Tips\n- **Post times:** Early morning (7 to 9 a.m.) and late afternoon (3 to 5 p.m.) tend to work well for food.\n- **Use natural light.** Shoot near a window and skip the flash.\n- **Reply to every comment** within the first hour.\n- **Location tag:** Always tag your bakery and neighborhood.\n- **Stories:** Post daily when you can. Show the display case, a fresh tray or a sold-out sign.\n- **Repurpose:** Turn each Reel into a TikTok or Facebook post.\n\n---\n\nIf you tell me your bakery's name, location, top 3 items, tone (cozy, modern, playful) and any events this month, I'll rewrite every caption in your voice and add a content calendar with exact dates.",
"kitOut": "| Date | Post | Photo idea |\n|---|---|---|\n| Tue, Mar 3 | Closed today for an oven repair. Back Thursday, open at 7. | The dark oven with the door open, a tool bag on the floor. |\n| Thu, Mar 5 | We're open at 7. Cardamom buns are back on Saturday, $4.50, gone by 11. See you then. | A tray of cardamom buns, flour on the counter. |\n| Sat, Mar 7 | Cardamom buns today. $4.50 each. They sell out by 11, so come early. See you at 7. | Close-up of a cardamom bun, split open. |\n| Tue, Mar 10 | Birthday coming up? Custom cakes need 3 days' notice and start at $48. Ask us on your way to work. | A finished custom cake on the counter. |\n| Thu, Mar 12 | Hot cross buns start Tuesday, March 17. $3.75, until Easter. Cardamom buns this Saturday, $4.50. | A hand-written \"Tuesday\" sign next to the empty bun tray. |\n| Sat, Mar 14 | Cardamom buns today, $4.50. Gone by 11. Hot cross buns come Tuesday. See you at 7. | A line at the door early in the morning. |\n| Tue, Mar 17 | Hot cross buns are here. $3.75 each, until Easter. Warm, spiced, and gone by noon. Open 7am. | A tray of hot cross buns straight from the oven. |\n| Thu, Mar 19 | Cake for Sunday? Custom cakes need 3 days' notice, so today is the day to ask. From $48. | A baker piping the edge of a cake. |\n| Sat, Mar 21 | Two buns today. Cardamom, $4.50, gone by 11. Hot cross, $3.75, until Easter. See you at 7. | Both buns side by side on one tray. |\n| Tue, Mar 24 | Hot cross buns, $3.75. One for the walk to work, a few for later. Open 7am. | A paper bag of hot cross buns on the counter. |\n| Thu, Mar 26 | Planning a birthday for next week? Custom cakes start at $48 and need 3 days' notice. Ask us today. | A cake with a hand-lettered name on top. |\n| Sat, Mar 28 | Last cardamom Saturday of March. $4.50, gone by 11. Hot cross buns until Easter. See you at 7. | The last bun on an almost empty tray. |\n\nNotes: March has 13 Tuesdays, Thursdays and Saturdays, so I left out Tuesday, March 31 to keep it at 3 a week. I used the 2026 calendar, where March 3 is a Tuesday. Check \"back Thursday\" in the first post against your real plans."
},
"lead": "Claude, ChatGPT or Gemini",
"sample": "Sample, made up for testing. Mira and her bakery are fictional.",
"pdf": "../summaries/kit-month-of-posts.html"
},
{
"id": "sounds-like-me",
"name": "Sounds like me",
"icon": "voice",
"promise": "How you get AI to write like you, plus 3 ready replies.",
"covers": [
[
"msgs",
"Your real messages"
],
[
"asked",
"Questions you get most"
],
[
"answers",
"Your real answers"
],
[
"never",
"Never say"
],
[
"save",
"Where you’ll save it"
]
],
"fields": [
{
"key": "messages",
"label": "3 to 5 messages you wrote",
"hint": "Texts, emails or posts. Take out names and numbers.",
"ex": "1) To a customer: \"Hi Jen! Yes, we can do the lemon cake for Saturday. 8 inch, serves 12, $48. Pick up after 10. See you then!\"\n2) To a supplier: \"Hey Tom, can we bump the flour order to 6 bags this week? Holiday rush. Thanks!\"\n3) To a customer: \"So sorry, we're sold out of cardamom buns today. They're back Saturday from 8. Come early, they go fast.\"\n4) Instagram: \"Rye loaves are back. Crusty outside, soft inside, gone by noon. See you at 7.\"",
"covers": "msgs",
"multi": true
},
{
"key": "top3",
"label": "The 3 messages you answer most",
"hint": "",
"ex": "1) “Can I order a custom cake?” 2) “Are you open on holidays?” 3) “Do you have gluten-free options?”",
"covers": "asked",
"multi": true
},
{
"key": "answers",
"label": "What you usually say back",
"hint": "The real facts.",
"ex": "custom cakes need 3 days’ notice, from $48; closed Christmas and New Year’s Day; no gluten-free, our kitchen uses wheat all day.",
"covers": "answers",
"multi": true
},
{
"key": "never",
"label": "Things you’d never write",
"hint": "",
"ex": "No emojis. Never “Dear valued customer”.",
"covers": "never",
"multi": false
},
{
"key": "tool",
"label": "Where you’ll save it",
"hint": "A Claude Project, or ChatGPT custom instructions.",
"ex": "A Claude Project",
"covers": "save",
"multi": false
}
],
"brief": [
[
"goal",
"Write a voice profile of how I write, then 3 reply templates in that voice."
],
[
"context",
"My real messages:\n{messages}\nThe 3 messages I answer most: {top3} (Answers: {answers})"
],
[
"format",
"Voice profile under 150 words (Tone, Words I use, Length, How I start, How I end, Never). Then the 3 templates, under 60 words each, with [brackets] for the parts that change."
],
[
"rules",
"Only describe what you can see in my messages. Quote my real phrases. Don’t make me sound fancier than I am. {never}"
]
],
"kit": "sounds-like-me",
"tools": [
[
"Claude",
"Free",
"Make a Project (Free includes up to 5), then Set project instructions, paste, Save."
],
[
"ChatGPT",
"Free",
"Save it in Settings → Personalization → Custom instructions."
],
[
"Gemini",
"Free",
"Customize → Skills → Create → Create manually. (Gems closed to new ones on 17 Nov 2026.)"
]
],
"stuck": [
[
"It sounds too formal",
"Paste 2 more casual messages and say “Match these.”"
],
[
"It forgets my voice in new chats",
"It only remembers if you saved it (step 2)."
],
[
"It copies my messages word for word",
"Say “Use my style, not my sentences.”"
]
],
"privacy": "Take out names, phone numbers and anything private before you paste.",
"time": "20–30 min",
"cost": "Free",
"steps": [
{
"t": "Paste your brief",
"d": "Open Claude, ChatGPT or Gemini. Paste the whole brief as your first message and send.",
"ok": "You get the whole thing back in one answer."
},
{
"t": "Save it",
"d": "Copy the profile into the place your app keeps instructions.",
"ok": "Open a new chat (in Claude, inside your Project) and ask “What do you know about how I write?”"
}
],
"where": null,
"proof": {
"kitScore": 4.8,
"plainScore": 2.3,
"winner": "template",
"reason": "The template answer gives a voice profile and short templates that use the real facts (3 days' notice from $48, holiday closures, no gluten-free because of wheat), while the plain answer is generic and long and leaves out those facts.",
"plainAsk": "Write 3 reply templates for my bakery customers.",
"plainOut": "Here are 3 reply templates you can copy and adjust. Swap the [brackets] for your details.\n\n## 1. Custom order inquiry\n\nHi [Name]! Thank you so much for thinking of us for your [birthday/wedding/event]. \n\nWe'd love to help. To put together a quote, could you tell me:\n- The date you need it by\n- How many people you're serving\n- Any flavor, design, or dietary needs (allergies, vegan, gluten-free, etc.)\n\nCustom orders need at least [X days] notice, and we ask for a [50%] deposit to hold your date. Once I have the details, I'll send you a quote within [24 hours].\n\nWarmly,\n[Your name]\n[Bakery name]\n\n## 2. Order confirmation and pickup details\n\nHi [Name]! Your order is confirmed. Here are the details:\n\n- Order: [items]\n- Pickup: [day, date, time]\n- Location: [address]\n- Total: [$ amount] ([paid / due at pickup])\n\nPlease bring this message or your name when you come by. If anything changes, let us know at least [24 hours] ahead. \n\nThank you for supporting a small bakery. We can't wait for you to try it!\n\n[Your name]\n[Bakery name]\n\n## 3. Complaint or issue response\n\nHi [Name], thank you for telling us, and I'm so sorry your [order/item] wasn't what you expected. \n\nWe want to make this right. Would you prefer [a replacement / a refund / a credit toward your next order]? If you can share a quick photo and a note about what happened, it helps us fix it on our end.\n\nWe appreciate your honesty, and we hope to earn another chance to treat you.\n\nSincerely,\n[Your name]\n[Bakery name]\n\n---\n\nWant me to adapt these? I can match your bakery's voice (cozy, playful, upscale), and I can add templates for out-of-stock items, wholesale requests, or \"we're sold out\" replies. Tell me your bakery's name and what you sell, and I'll tailor them.",
"kitOut": "## Voice profile\n\n- **Tone:** Warm, direct, friendly. Plain talk, no frills.\n- **Words I use:** \"Yes, we can,\" \"So sorry,\" \"Come early,\" \"See you then,\" \"Thanks!\" Short facts: \"8 inch, serves 12, $48.\"\n- **Length:** 1 to 3 short sentences. Often fragments.\n- **How I start:** A greeting with a name (\"Hi Jen!\", \"Hey Tom,\") or the answer right away (\"Yes, we can...\", \"So sorry, ...\").\n- **How I end:** A short send-off: \"See you then!\", \"Thanks!\", \"See you at 7.\" Or a quick tip: \"Come early, they go fast.\"\n- **Never:** Long intros, formal phrases, or filler. No hedging.\n\n## Templates\n\n**1) Custom cake**\n\nHi [name]! Yes, we can do a custom cake. We need 3 days' notice, and prices start from $48. Tell me the flavor, size and day you want. Pick up after [time]. See you then!\n\n**2) Holidays**\n\nHi [name]! We're closed Christmas and New Year's Day. [Other holiday: open / hours]. Come early, they go fast. See you then!\n\n**3) Gluten-free**\n\nHi [name]! So sorry, we don't have gluten-free options. Our kitchen uses wheat all day. [Optional: Our [item] is back [day]. See you then!]"
},
"lead": "Claude, ChatGPT or Gemini",
"sample": "Sample, made up for testing. Mira and her bakery are fictional.",
"pdf": "../summaries/kit-sounds-like-me.html"
},
{
"id": "memo-to-handbook",
"name": "Voice memo → handbook",
"icon": "memo",
"promise": "How you turn “let me explain” into a checklist anyone can follow.",
"covers": [
[
"task",
"The task"
],
[
"who",
"Who’ll use it"
],
[
"memo",
"Your memo"
],
[
"must",
"Must not miss"
],
[
"where",
"Where it lives"
]
],
"fields": [
{
"key": "task",
"label": "The task",
"hint": "One job, start to finish.",
"ex": "opening the bakery",
"covers": "task",
"multi": false
},
{
"key": "who",
"label": "Who will follow it",
"hint": "",
"ex": "A new weekend helper who has never opened the bakery.",
"covers": "who",
"multi": false
},
{
"key": "memo",
"label": "Explain it out loud",
"hint": "Tap Talk and ramble. Messy is fine.",
"ex": "ok so opening. um first thing you get in at six, lights, then the ovens, both ovens to 220 they take like 20 minutes. while thats heating you pull the dough from the walk-in, the buns proof on the left rack not the right one the right one is for loaves. oh and check the walk-in temp its on the door should be under 4 if its not text me. then coffee machine, flush it first. cash float is in the safe, 150 in the drawer, count it. at like 6:45 buns go in, 18 minutes, rotate at 9. sign goes out at 7 not before. wipe the counter with the blue spray not the green, green is for floors. if Tom's delivery comes sign for it and check the flour count. thats basically it",
"covers": "memo",
"multi": true
},
{
"key": "must",
"label": "The one thing they must not miss",
"hint": "",
"ex": "If the walk-in is over 4, text me.",
"covers": "must",
"multi": false
},
{
"key": "where",
"label": "Where it will live",
"hint": "",
"ex": "printed and taped inside the back door",
"covers": "where",
"multi": false
}
],
"brief": [
[
"goal",
"Turn my rambling explanation of {task} into a checklist and a short how-to guide a new person can follow."
],
[
"who_its_for",
"{who}"
],
[
"context",
"My transcript:\n{memo}"
],
[
"format",
"1) A numbered checklist with times. 2) A short guide: why each step matters. 3) Questions I didn’t answer. It will be {where}."
],
[
"rules",
"Keep every number, time and warning I said. Don’t add steps I didn’t say; put guesses under Questions. Never leave out: {must}"
]
],
"kit": "memo-to-handbook",
"tools": [
[
"Your phone",
"Free",
"Record a voice memo. Many phones show a transcript; or speak into the chat app’s microphone."
],
[
"Claude, ChatGPT or Gemini",
"Free",
"Paste the transcript."
]
],
"stuck": [
[
"It added steps I never said",
"Say “Remove anything not in my transcript; list it as a question instead.”"
],
[
"The transcript is a mess",
"That’s fine. AI is good at messy. Just fix names it misheard."
]
],
"privacy": "Take out names, phone numbers and anything private before you paste.",
"time": "20–30 min",
"cost": "Free",
"steps": [
{
"t": "Paste your brief",
"d": "Open Claude, ChatGPT or Gemini. Paste the whole brief as your first message and send.",
"ok": "You get the whole thing back in one answer."
},
{
"t": "Answer the questions",
"d": "Reply with answers to its questions, then ask for the final version to print.",
"ok": "A new person could do it without calling you."
}
],
"where": null,
"proof": {
"kitScore": 4.3,
"plainScore": 4.0,
"winner": "tie",
"reason": "The template answer keeps every detail and asks the useful open questions (safe code, 220 units, short delivery), but it adds a padded 'why' section and drops Mira's name. The plain answer is cleaner and grouped by time, but it drops Mira's name too, and it asks only two questions, missing the safe code and the 220 units.",
"plainAsk": "Turn this into a checklist:",
"plainOut": "# Opening Checklist\n\n## 6:00 AM: Arrive\n- [ ] Turn on the lights\n- [ ] Turn on both ovens and set them to 220 (they take about 20 minutes)\n- [ ] Check the walk-in temperature on the door. It should be under 4. If it isn't, text me.\n- [ ] Pull the dough from the walk-in\n  - [ ] Proof the buns on the **left** rack\n  - [ ] The right rack is for loaves only\n- [ ] Flush the coffee machine, then start the coffee\n- [ ] Get the cash float from the safe\n  - [ ] Put 150 in the drawer\n  - [ ] Count it\n\n## 6:45 AM: Baking\n- [ ] Put the buns in the oven for 18 minutes\n- [ ] Rotate them at 9 minutes\n\n## 7:00 AM: Open up\n- [ ] Put the sign out (not before 7)\n\n## Anytime\n- [ ] Wipe the counter with the **blue** spray (green is for floors only)\n- [ ] If Tom's delivery arrives, sign for it and check the flour count\n\n## Notes\n- \"Rotate at 9\" is read as 9 minutes into the bake. Please confirm.\n- The memo doesn't say whether the 150 is counted before or after it goes in the drawer. I put it in the order given.",
"kitOut": "# Bakery Opening: Weekend Helper Guide\n\n## 1) Opening checklist\n\n- [ ] **6:00** Arrive. Turn on the lights.\n- [ ] **6:00** Turn on both ovens and set them to **220**. They take about 20 minutes.\n- [ ] While the ovens heat, take the dough out of the walk-in.\n- [ ] Put the **buns** on the **left** rack to proof. **Not the right rack.** The right rack is for loaves.\n- [ ] Check the walk-in temperature on the door. It should be **under 4**. If it isn't, **text the owner**.\n- [ ] Flush the coffee machine first, then make the coffee.\n- [ ] Get the cash float from the safe. Put **150** in the drawer and **count it**.\n- [ ] Wipe the counter with the **blue** spray. **Not the green.** Green is for floors.\n- [ ] **6:45** Put the buns in the oven. Bake **18 minutes**.\n- [ ] **Rotate at 9.**\n- [ ] **7:00** Put the sign out. **Not before 7.**\n- [ ] If Tom's delivery comes, sign for it and check the flour count.\n\n## 2) Short guide: why each step matters\n\n- **Lights, then ovens at 220 at 6:00.** The ovens need about 20 minutes to heat. Starting them first means they are ready for the buns at 6:45.\n- **Dough out of the walk-in while the ovens heat.** This uses the heating time.\n- **Buns on the left rack, loaves on the right.** The racks are split by product. Putting buns on the right rack mixes them up with the loaves.\n- **Walk-in under 4.** Above 4 is a problem, so you text the owner. Don't wait to see if it fixes itself.\n- **Flush the coffee machine first.** Do this before making any coffee.\n- **Count the 150 float.** Counting it confirms the drawer starts correct.\n- **Blue spray on the counter, green on floors.** The two sprays are for different surfaces. Use the right one.\n- **Buns in at 6:45 for 18 minutes, rotate at 9.** Stick to the times so the buns are baked on schedule.\n- **Sign out at 7, not before.** 7:00 is the opening time for the sign.\n- **Tom's delivery.** Signing for it and checking the flour count records what arrived.\n\n## 3) Questions I didn't answer\n\nThese were not in your transcript, so I did not add them as steps.\n\n1. Is 220 in Celsius or Fahrenheit?\n2. What is \"rotate at 9\"? Is it 9 minutes into the bake, or 9:00 am? (Buns go in at 6:45 and bake 18 minutes, so 9:00 am looks too late. I'm guessing it means 9 minutes.)\n3. Rotate what? The trays?\n4. What is the combination or key for the safe? Who gives it to a new helper?\n5. Is the 150 in dollars? What do you do if the count doesn't match?\n6. What phone number should the helper text about the walk-in? What should they do with the dough or food if it's over 4?\n7. How long does the buns' proofing take, and how do they know the buns are ready for the oven?\n8. Which dough goes in the walk-in? Is there a loaf dough that also needs handling?\n9. When do loaves go in the oven?\n10. What does \"flush\" the coffee machine involve? Is there a button or a cycle?\n11. When should the doors open to customers? Is it at 7 when the sign goes out?\n12. What is the expected flour count, and who do I tell if it's wrong?\n13. What time does Tom's delivery usually arrive, and what else comes with it?\n14. Where are the blue and green sprays kept?\n15. What happens after opening? Are there any closing tasks?"
},
"lead": "Claude, ChatGPT or Gemini",
"sample": "Sample, made up for testing. Mira and her bakery are fictional.",
"pdf": "../summaries/kit-memo-to-handbook.html"
},
{
"id": "automate-task",
"name": "Automate a task",
"icon": "auto",
"promise": "How you get one boring task to run on its own.",
"covers": [
[
"tasks",
"Your weekly tasks"
],
[
"apps",
"Your apps"
],
[
"plan",
"Your plan"
],
[
"already",
"What apps already do"
],
[
"safe",
"Safe limits"
]
],
"fields": [
{
"key": "tasks",
"label": "What you do every week",
"hint": "Include how long each takes.",
"ex": "answering cake order requests from my website’s Google Form (about 10 a week, 15 minutes each: I copy the details into my order sheet and email back to confirm), ordering flour every Monday, posting on Instagram.",
"covers": "tasks",
"multi": true
},
{
"key": "apps",
"label": "The apps you use",
"hint": "",
"ex": "Gmail, Google Sheets, Google Forms",
"covers": "apps",
"multi": false
},
{
"key": "plan",
"label": "Your automation plan",
"hint": "Zapier Free works.",
"ex": "Zapier Free: one trigger and one action, 100 tasks a month",
"covers": "plan",
"multi": false
},
{
"key": "already",
"label": "What your apps already do",
"hint": "So it doesn’t build it twice.",
"ex": "Google Forms already saves answers to a sheet.",
"covers": "already",
"multi": false
},
{
"key": "safe",
"label": "What it may never do alone",
"hint": "",
"ex": "It may only read or write drafts (like a Gmail draft I check). Never send, pay or delete on its own.",
"covers": "safe",
"multi": false
}
],
"brief": [
[
"goal",
"Help me automate one boring task, starting small."
],
[
"context",
"My weekly tasks: {tasks} My apps: {apps}. I’m on {plan}."
],
[
"format",
"1) The best task to start with, and why. 2) “When this happens” → “do this”, in plain words. 3) The exact request to paste into Zapier Copilot. 4) How to test it."
],
[
"rules",
"{safe} Skip anything my apps already do by themselves: {already} If it needs more than 2 steps, give me the 2-step version."
]
],
"kit": "automate-task",
"tools": [
[
"Zapier Free",
"Free",
"Use this one. A Zap is “when this happens” + “do this”. Copilot is Zapier’s chat box: type what you want and it builds the Zap. 100 tasks (runs) a month, checks every 15 minutes."
],
[
"Zapier’s 14-day trial",
"Free 14 days",
"Starts on its own when you sign up, no card. Allows extra steps, which stop when it ends."
],
[
"Claude Cowork",
"Paid",
"Does it from plain words on a schedule. Start with tasks that only read and draft."
]
],
"stuck": [
[
"Connecting my account fails",
"Allow pop-ups for zapier.com, then try again."
],
[
"The test finds no data",
"Send one real example first (fill in the form once), then test again."
],
[
"It says I need more steps",
"Use the 2-step version from step 1. (A new account’s 14-day trial allows more, until it ends.)"
],
[
"Nothing happened",
"Wait 15 minutes. Then open Zap history (Zapier’s list of every run) and look for errors."
]
],
"privacy": "Start with automations that draft, not send. Check what you connect: only the accounts this task needs.",
"time": "45–60 min",
"cost": "Free",
"steps": [
{
"t": "Paste your brief",
"d": "Open Claude, ChatGPT or Gemini (free is fine). Paste the whole brief as your first message and send.",
"ok": "You get the whole thing back in one answer."
},
{
"t": "Build it with Copilot",
"d": "Sign in to Zapier, paste the Copilot request from step 1, and follow its steps to connect your apps.",
"ok": "Zapier shows your trigger and your action."
},
{
"t": "Test with one real example",
"d": "Send one real test (fill in your form once, or send yourself the email).",
"ok": "Zapier’s test shows your data. Then click Publish."
},
{
"t": "Watch the first run",
"d": "Do the real thing once and wait. Free plans check every 15 minutes.",
"ok": "The draft, row or note appears on its own. Screenshot it: that’s your proof."
}
],
"where": null,
"proof": {
"kitScore": 4.8,
"plainScore": 2.3,
"winner": "template",
"reason": "The template answer gives the specific Zapier Free plan the person needed (form response to Gmail draft, a paste-ready Copilot request, a real test) while the plain answer is a generic multi-step bakery automation guide that ignores the one-trigger, one-action free limit.",
"plainAsk": "How do I automate my bakery cake orders with AI?",
"plainOut": "# Automating bakery cake orders with AI\n\nCake orders usually follow the same loop: a customer asks, you reply with details and a price, they pay a deposit, you remember the date, and you bake. AI can take over most of the typing and tracking. Here is a practical way to set it up.\n\n## 1. Map your current process first\n\nWrite down what happens from the first message to pickup:\n\n1. Customer asks (Instagram DM, text, email, website form, phone)\n2. You collect details: date, size or servings, flavor, design, allergies, pickup or delivery\n3. You quote a price\n4. They pay a deposit\n5. You schedule the bake and decoration\n6. You send a reminder, then they pick up\n\nMark the steps where you repeat yourself. Those are the ones to automate.\n\n## 2. Put every request into one intake form\n\nMessy DMs are the biggest time sink. Send everyone to a single order form (Google Forms, Jotform, Tally, or Shopify, Square or Wix if you have a site). Ask for:\n\n- Name, phone, email\n- Event date and pickup or delivery\n- Servings or size\n- Flavor, filling and frosting (use dropdowns)\n- Design notes and a reference photo upload\n- Allergies or dietary needs\n- Message on the cake\n\nPut the link in your Instagram bio, Facebook page, Google Business profile and your auto-replies. Dropdowns keep orders consistent, and the form tells you which details are missing before you start.\n\n## 3. Use AI to answer and quote\n\n- **Auto-replies:** Set up an Instagram or Facebook auto-response (Meta Business Suite has this built in). It sends the form link and your lead time.\n- **Reply drafts:** Give an AI assistant (Claude or ChatGPT) your menu, pricing rules, lead times, delivery area and policies. Paste in a customer message and it drafts the reply. You review it and send.\n- **Quote calculator:** Write your pricing rules out, for example \"6-inch serves 8-10, $55 base, fondant +$20, custom topper +$15, delivery $X per mile\". AI can turn a form entry into a quote. Or build the same math in a spreadsheet.\n- **Photo reference:** AI can describe a customer's inspiration photo, which helps you judge how complex it is and how long it will take.\n\n## 4. Connect the pieces with an automation tool\n\nZapier, Make or Airtable Automations can link the form to the rest of your workflow with no code. A typical chain:\n\n1. A new form entry is added to an Airtable or Google Sheets order tracker\n2. An AI step reads the entry and drafts a quote and confirmation email\n3. A deposit link (Stripe, Square or PayPal invoice) is sent\n4. When the deposit is paid, the order is marked \"Confirmed\" and a calendar event is created on the event date\n5. A reminder goes out one week and one day before pickup\n6. A thank-you and review request goes out after pickup\n\n## 5. Protect your capacity\n\nLimit orders so you don't overbook:\n\n- Set a maximum number of cakes per day in your calendar or form tool, and block dates automatically when you reach it\n- Set a minimum lead time (for example 7 days for custom cakes)\n- Flag rush or large orders so they come to you for manual approval\n\n## 6. Automate the baking-side admin\n\n- **Production list:** Have the tracker produce a weekly view sorted by date, with flavors, sizes and allergies.\n- **Ingredient and shopping lists:** Give AI your recipes and the week's orders, and it can total the flour, butter, eggs and so on.\n- **Labels and tickets:** Generate a printable order ticket for each cake.\n\n## What to keep human\n\n- Final pricing on complex designs\n- Allergy confirmation (always double-check this yourself)\n- Anything emotional, such as weddings, memorials or complaints\n- Reviewing AI drafts before they go out, at least at first\n\n## A simple starter plan\n\n**Week 1:** Build the order form and put it everywhere. Create a tracker spreadsheet.\n**Week 2:** Write your pricing rules and FAQ. Use an AI assistant to draft replies. Turn on auto-replies.\n**Week 3:** Add deposit links and calendar events using Zapier or Make.\n**Week 4:** Add reminders, review requests and the weekly production list.\n\n## Tools to consider\n\n- Forms: Google Forms, Tally, Jotform\n- Tracker: Airtable, Google Sheets, Notion\n- Automation: Zapier, Make\n- Payments: Square, Stripe, PayPal\n- All-in-one bakery options: Square Online, Shopify, or bakery software such as Bakesmart or Cakesmart. Check current pricing.\n- AI: Claude or ChatGPT for drafting and quotes\n\n## Tips\n\n- Start small. A form plus a tracker already saves hours.\n- Always take a deposit to cut down no-shows.\n- Keep a written policy page (cancellations, allergens, pickup) and link to it in every confirmation.\n\nIf you tell me where most of your orders come from (Instagram, phone, website), how many cakes you do per week, and which tools you already use, I can suggest a specific setup. I can also help write your pricing rules, the AI reply prompt, or the order form questions.",
"kitOut": "## 1) Best task to start with\n\n**Confirming cake order requests.** It's your biggest time cost: about 10 a week at 15 minutes each, which is roughly 2.5 hours a week. It's the same steps every time. It also fits your free plan, because 10 orders a week is about 40 tasks a month, well under the 100 limit.\n\nI'd skip the other two for now:\n- **Flour:** it's only one task a week, and ordering means paying, which this setup can't do.\n- **Instagram:** it needs your creative input each time.\n\n## 2) \"When this happens\" → \"do this\"\n\n**When this happens:** a new answer arrives in your cake order Google Form. (Zapier watches the form's response sheet in Google Sheets, so the trigger is \"New Spreadsheet Row\" in Google Sheets.)\n\n**Do this:** create a **Gmail draft** to that customer. It confirms their order using the details they entered, and it waits in your Drafts folder for you to check and send.\n\nYou don't need a step that copies details into your order sheet. Google Forms already saves each answer to a sheet, so you can use that sheet as your order sheet. Zapier never sends the email. You read each draft, fix anything, and press Send yourself. That takes about 1 minute instead of 15.\n\n## 3) Paste this into Zapier Copilot\n\n> When a new row is added in my Google Sheet \"Cake Orders (Form responses 1)\", create a draft in Gmail. Do not send it. Address the draft to the email in the customer's email column. Use the subject \"Your cake order request: [cake type/date]\". The body should say: \"Hi [name], thanks for your order request! Here is what I have: [cake type], [flavor], [servings], [pickup/delivery date], [notes]. I'll confirm the price and availability shortly. Thank you! [My name]\". Use the matching columns from the sheet for each bracket.\n\nBefore you paste it, change the sheet name and the bracket labels to match your form's real column headings. Also swap in your own name and wording.\n\n## 4) How to test it\n\n1. In Zapier, turn the Zap on only after the test step below works.\n2. Submit your own cake form with your own email address and made-up details, such as \"Test Cake, vanilla, 12 servings\".\n3. Open the Zap's trigger step and click **Test trigger**. Zapier should find your test row. If it doesn't, wait a minute and try again.\n4. Click **Test action** on the Gmail step. Then open Gmail → **Drafts**. You should see a draft addressed to you with all the details filled in correctly.\n5. Check that nothing was sent. The message should still be a draft, and your Sent folder should be unchanged.\n6. If a detail is blank or in the wrong place, edit the draft template in the Zap so the field matches the right column. Then run the test again.\n7. Delete the test row and the test draft by hand, then turn the Zap on.\n8. For the first week, read every draft before you send it. Zapier Free may check for new rows only every 15 minutes, so a draft can show up a bit late. That's normal.\n\n**Later, if it works well:** you could add a second step that tags the row as \"confirmed\". On the Free plan, though, you only get one action, so stay with the draft for now.",
"note": "Our first version scored 4.0: it picked a step Google Forms already does. We fixed the prompt and tested again."
},
"lead": "Claude, ChatGPT or Gemini (free is fine)",
"sample": "Sample, made up for testing. Mira and her bakery are fictional.",
"pdf": "../summaries/kit-automate-task.html"
},
{
"id": "reply-emails",
"name": "Reply to emails",
"icon": "mail",
"promise": "How you answer a tricky email in 5 minutes, in your voice.",
"covers": [
[
"from",
"Who it’s from"
],
[
"asked",
"What they asked"
],
[
"answer",
"Your answer"
],
[
"tone",
"Your tone"
],
[
"length",
"Length"
],
[
"avoid",
"Don’t say"
]
],
"fields": [
{
"key": "name",
"label": "Who it’s from",
"hint": "",
"ex": "Dana",
"covers": "from",
"multi": false
},
{
"key": "relation",
"label": "Who they are to you",
"hint": "",
"ex": "a client I like and want to keep",
"covers": "from",
"multi": false
},
{
"key": "email",
"label": "Paste their email",
"hint": "",
"ex": "Hi! Our launch got moved, so we need to push the photoshoot from this Thursday to next week. Also, since it’s a shorter day now, can you lower the price? Thanks, Dana",
"covers": "asked",
"multi": true
},
{
"key": "answer",
"label": "Your answer, in one line",
"hint": "Yes, no, or yes but.",
"ex": "Agree to move the shoot, but keep the price.",
"covers": "answer",
"multi": false
},
{
"key": "facts",
"label": "Facts they don’t know",
"hint": "Dates, prices, reasons.",
"ex": "I’m a freelance photographer. Prep is already done, so the price stays the same. I’m free next Tuesday or Wednesday.",
"covers": "answer",
"multi": true
},
{
"key": "tone",
"label": "A line in your usual tone",
"hint": "Copy it from an email you sent.",
"ex": "Hi Sam, happy to help! Quick note on timing…",
"covers": "tone",
"multi": false
},
{
"key": "length",
"label": "How long",
"hint": "",
"ex": "Under 100 words. Ready to send.",
"covers": "length",
"multi": false
},
{
"key": "avoid",
"label": "What not to say or offer",
"hint": "",
"ex": "Don’t apologize. Don’t offer a discount.",
"covers": "avoid",
"multi": false
}
],
"brief": [
[
"goal",
"Reply to {name}. {answer}"
],
[
"who_its_for",
"{name}, {relation}."
],
[
"context",
"{facts} Their email:\n{email}"
],
[
"example",
"My usual tone: “{tone}”"
],
[
"format",
"{length}"
],
[
"rules",
"{avoid}"
]
],
"kit": null,
"tools": [
[
"Claude",
"Free",
"Paste the brief into a new chat."
],
[
"ChatGPT",
"Free",
"Same brief, same result."
],
[
"Gemini",
"Free",
"Same brief, same result."
]
],
"stuck": [
[
"It sounds like a robot",
"Paste 2 real emails you sent and say “Match these.”"
],
[
"It promised something I can’t do",
"Say “Remove anything I didn’t tell you.” Then check every fact."
]
],
"privacy": "Take out phone numbers, addresses and anything private before you paste.",
"time": "5 min",
"cost": "Free",
"steps": [
{
"t": "Paste your brief",
"d": "Open Claude, ChatGPT or Gemini. Paste the whole brief as your first message and send.",
"ok": "You get the whole thing back in one answer."
},
{
"t": "Fix it in one line",
"d": "Not quite right? Send one line:",
"p": "Shorter, and more like my tone line. Keep every fact.",
"ok": "It sounds like you."
},
{
"t": "Send it yourself",
"d": "Copy the reply into your email. Read it once and send.",
"ok": "Every fact in it is true."
}
],
"where": null,
"proof": {
"kitScore": 5.0,
"plainScore": 2.8,
"winner": "template",
"reason": "The template answer agrees to move the shoot, offers Tuesday or Wednesday and holds the price as the person needed, while the plain answer offers to reduce the price, leaves placeholders and adds extra notes.",
"plainAsk": "Reply to this email:",
"plainOut": "Subject: Re: Photoshoot date and pricing\n\nHi Dana,\n\nThanks for the heads-up, and congrats on getting closer to launch. Moving the shoot to next week works for me. Which days are you free? I can do [day/time] or [day/time]. Once you pick one, I'll send a confirmation.\n\nOn price, I'm happy to adjust for a shorter day. My rate is based on the time booked, so I'll resend the quote for the new length. If you tell me the hours you have in mind, I'll send the updated number today. A shorter day may mean fewer setups or looks, so we can also confirm the shot list to make sure we cover your priorities in the time you have.\n\nLet me know the new date and the hours, and I'll take it from there.\n\nBest,\n[Your name]\n\n---\n\nNotes for you, not part of the email:\n- I didn't know your rates or whether you have a rescheduling policy, so I left the price open instead of promising a figure. Fill in a number if you'd like to reply in one step. For example, \"the half-day rate is $X.\"\n- If you want to hold your rate, replace the second paragraph with: \"I can't lower the price, because the work and prep are the same. I can fit a shorter shoot into the same fee, or keep a full day to give you more content.\"\n- If the new date means you'll turn down other work, you can add a short rescheduling note.",
"kitOut": "Subject: Re: Photoshoot timing\n\nHi Dana,\n\nHappy to move it! I'm free next Tuesday or Wednesday, so pick whichever suits your new launch date.\n\nOn the price, I'll keep it as quoted. Prep is already done, and the shoot itself will be the same full scope and quality you're expecting.\n\nLet me know which day works, and I'll lock it in.\n\nBest,\n[Your name]",
"note": "Tested with the same made-up email as the example above."
},
"lead": "Claude, ChatGPT or Gemini",
"sample": "Sample, made up for testing. Dana and the photoshoot are fictional.",
"pdf": null
}
]
};
