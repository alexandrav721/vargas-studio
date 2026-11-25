/* AI Made EZ kits: data + real blind-judged results (built by gen.py, 25 Nov 2026). */
window.EZ_K = {
"sample": "Sample, made up for testing. Mira and her bakery are fictional.",
"checked": "25 Nov 2026",
"kits": [
{
"id": "sounds-like-me",
"n": 1,
"name": "Sounds like me",
"icon": "voice",
"result": "A saved voice profile, so AI writes closer to how you talk, plus 3 reply templates.",
"time": "20–30 min",
"cost": "Free",
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
"prep": [
"3 to 5 messages you actually wrote: texts, emails or posts."
],
"steps": [
{
"t": "Paste your messages",
"d": "Copy this into a new chat. Swap in your own messages.",
"p": "<goal>Write a voice profile of how I write, so you can write like me later.</goal>\n<context>My real messages:\n[paste 3 to 5 messages you wrote]</context>\n<format>Under 150 words. Sections: Tone, Words I use, Length, How I start, How I end, Never.</format>\n<rules>Only describe what you can see in my messages. Quote my real phrases. Don’t make me sound fancier than I am.</rules>",
"ok": "It quotes your real words. If it sounds like a stranger, say “Closer to my messages, less polished.”"
},
{
"t": "Save it",
"d": "Copy the profile into the place your app keeps instructions (see the tool list above).",
"ok": "Open a new chat (in Claude, inside your Project) and ask “What do you know about how I write?”"
},
{
"t": "Make 3 reply templates",
"d": "In a new chat with your profile saved, list the 3 messages you answer most and what you usually say back.",
"p": "<goal>Write reply templates for the 3 messages I answer most.</goal>\n<context>Use my voice profile. The 3 messages, and what I usually say back: [1] … [2] … [3] …</context>\n<format>For each: the template with [brackets] for the parts that change. Under 60 words each.</format>\n<rules>Sound like my profile. No apologies unless I’d apologize.</rules>",
"ok": "Read one out loud. If you wouldn’t send it, say what’s off."
}
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
"done": "Keep it handy: the posts kit uses it too.",
"privacy": "Take out names, phone numbers and anything private before you paste.",
"example": {
"prompt": "<goal>Write a voice profile of how I write, then 3 reply templates in that voice.</goal>\n<context>My real messages:\n1) To a customer: \"Hi Jen! Yes, we can do the lemon cake for Saturday. 8 inch, serves 12, $48. Pick up after 10. See you then!\"\n2) To a supplier: \"Hey Tom, can we bump the flour order to 6 bags this week? Holiday rush. Thanks!\"\n3) To a customer: \"So sorry, we're sold out of cardamom buns today. They're back Saturday from 8. Come early, they go fast.\"\n4) Instagram: \"Rye loaves are back. Crusty outside, soft inside, gone by noon. See you at 7.\"\nThe 3 messages I answer most: 1) “Can I order a custom cake?” 2) “Are you open on holidays?” 3) “Do you have gluten-free options?” (Answers: custom cakes need 3 days’ notice, from $48; closed Christmas and New Year’s Day; no gluten-free, our kitchen uses wheat all day.)</context>\n<format>Voice profile under 150 words (Tone, Words I use, Length, How I start, How I end, Never). Then the 3 templates, under 60 words each, with [brackets] for the parts that change.</format>\n<rules>Only describe what you can see in my messages. Quote my real phrases. Don’t make me sound fancier than I am.</rules>",
"html": false
},
"proof": {
"kitScore": 4.8,
"plainScore": 2.3,
"winner": "template",
"reason": "The kit answer gives a voice profile and short templates that use the real facts (3 days' notice from $48, holiday closures, no gluten-free because of wheat), while the plain answer is generic and long and leaves out those facts.",
"plainAsk": "Write 3 reply templates for my bakery customers.",
"plainOut": "Here are 3 reply templates you can copy and adjust. Swap the [brackets] for your details.\n\n## 1. Custom order inquiry\n\nHi [Name]! Thank you so much for thinking of us for your [birthday/wedding/event]. \n\nWe'd love to help. To put together a quote, could you tell me:\n- The date you need it by\n- How many people you're serving\n- Any flavor, design, or dietary needs (allergies, vegan, gluten-free, etc.)\n\nCustom orders need at least [X days] notice, and we ask for a [50%] deposit to hold your date. Once I have the details, I'll send you a quote within [24 hours].\n\nWarmly,\n[Your name]\n[Bakery name]\n\n## 2. Order confirmation and pickup details\n\nHi [Name]! Your order is confirmed. Here are the details:\n\n- Order: [items]\n- Pickup: [day, date, time]\n- Location: [address]\n- Total: [$ amount] ([paid / due at pickup])\n\nPlease bring this message or your name when you come by. If anything changes, let us know at least [24 hours] ahead. \n\nThank you for supporting a small bakery. We can't wait for you to try it!\n\n[Your name]\n[Bakery name]\n\n## 3. Complaint or issue response\n\nHi [Name], thank you for telling us, and I'm so sorry your [order/item] wasn't what you expected. \n\nWe want to make this right. Would you prefer [a replacement / a refund / a credit toward your next order]? If you can share a quick photo and a note about what happened, it helps us fix it on our end.\n\nWe appreciate your honesty, and we hope to earn another chance to treat you.\n\nSincerely,\n[Your name]\n[Bakery name]\n\n---\n\nWant me to adapt these? I can match your bakery's voice (cozy, playful, upscale), and I can add templates for out-of-stock items, wholesale requests, or \"we're sold out\" replies. Tell me your bakery's name and what you sell, and I'll tailor them.",
"kitOut": "## Voice profile\n\n- **Tone:** Warm, direct, friendly. Plain talk, no frills.\n- **Words I use:** \"Yes, we can,\" \"So sorry,\" \"Come early,\" \"See you then,\" \"Thanks!\" Short facts: \"8 inch, serves 12, $48.\"\n- **Length:** 1 to 3 short sentences. Often fragments.\n- **How I start:** A greeting with a name (\"Hi Jen!\", \"Hey Tom,\") or the answer right away (\"Yes, we can...\", \"So sorry, ...\").\n- **How I end:** A short send-off: \"See you then!\", \"Thanks!\", \"See you at 7.\" Or a quick tip: \"Come early, they go fast.\"\n- **Never:** Long intros, formal phrases, or filler. No hedging.\n\n## Templates\n\n**1) Custom cake**\n\nHi [name]! Yes, we can do a custom cake. We need 3 days' notice, and prices start from $48. Tell me the flavor, size and day you want. Pick up after [time]. See you then!\n\n**2) Holidays**\n\nHi [name]! We're closed Christmas and New Year's Day. [Other holiday: open / hours]. Come early, they go fast. See you then!\n\n**3) Gluten-free**\n\nHi [name]! So sorry, we don't have gluten-free options. Our kitchen uses wheat all day. [Optional: Our [item] is back [day]. See you then!]"
}
},
{
"id": "first-website",
"n": 2,
"name": "Your first website",
"icon": "web",
"result": "A one-page website with a real link you can text to a friend.",
"time": "45–60 min",
"cost": "Free",
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
"prep": [
"Who the site is for, and the one thing they should do (order, book, call).",
"Your real words: what you offer, prices, hours, address.",
"2 or 3 real photos. Finding photos is where an hour becomes three.",
"A laptop is easier than a phone for this one."
],
"steps": [
{
"t": "Fill in the site sheet",
"d": "Copy it, fill every [bracket], keep it open.",
"p": "<goal>Build a one-page website for [business]. Visitors should [one action: order / book / call].</goal>\n<who_its_for>[who visits, and what they want to know fast]</who_its_for>\n<context>Sections, in this order: 1) [one-line headline] 2) [what I offer, with prices] 3) [about me, 2 sentences] 4) [hours and address] 5) [contact button]. My real words: [paste]. Photos: leave clearly marked photo boxes, I’ll add mine.</context>\n<example>The feel I want: [for example: warm, lots of space, big photos, like a neighborhood shop]</example>\n<format>One page. Designed for a phone first. One big button for [the action]. Easy-to-read text.</format>\n<rules>Use only the facts I gave. No made-up reviews, prices or awards. No stock photos of people. Ask me before adding pages.</rules>",
"ok": "No empty [brackets] left."
},
{
"t": "Paste it into Bolt",
"d": "Go to bolt.new, sign up free, and paste the whole sheet into the chat box. (Any tool from the list works.)",
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
"done": "You have a live link. Next: the app kit uses the same steps.",
"privacy": "Don’t paste private customer details into any builder. Lovable says Free and Pro content may train its models unless you turn that off.",
"example": {
"prompt": "<goal>Build a one-page website for Mira’s Bakery. Visitors should come in on Saturday or order a custom cake.</goal>\n<who_its_for>Neighbors who walk by on the way to work, and parents planning birthdays. They want hours, prices and how to order, fast.</who_its_for>\n<context>Sections, in this order: 1) Headline: Bread and buns, baked at 6, gone by noon. 2) What we sell: sourdough $8, rye loaf $7, cardamom buns $4.50 (Saturdays only), custom cakes from $48 (3 days’ notice). 3) About: I’m Mira. I bake everything here, using my grandmother’s Swedish recipes. 4) Hours: Tue–Sat 7am–2pm. 14 Elm Street. 5) Contact button: Order a cake (opens email to orders@example.com). Photos: leave clearly marked photo boxes, I’ll add mine.</context>\n<example>The feel I want: warm, lots of space, big photos, like a neighborhood shop.</example>\n<format>One page. Designed for a phone first. One big button for Order a cake. Easy-to-read text.</format>\n<rules>Use only the facts I gave. No made-up reviews, prices or awards. No stock photos of people. Don’t add pages.</rules>",
"html": true
},
"proof": {
"kitScore": 5.0,
"plainScore": 1.5,
"winner": "template",
"reason": "The kit answer uses Mira's exact facts, prices, hours, address and email order button with clear photo placeholders and nothing invented, while the plain answer had none of them, so it built a different bakery (Golden Crumb) with made-up products, prices, hours, address, phone and story.",
"plainAsk": "Make me a website for my bakery.",
"plainImg": "img/first-website-plain.jpg",
"kitImg": "img/first-website-template.jpg"
}
},
{
"id": "first-app",
"n": 3,
"name": "Your first app",
"icon": "app",
"result": "A small working tool, like a price calculator, that saves what you enter and has a link.",
"time": "45–60 min",
"cost": "Free",
"tools": [
[
"Google AI Studio",
"Free",
"Start here: aistudio.google.com, then Build. Your app stays private until you share it."
],
[
"Bolt (bolt.new)",
"Free",
"Free public link. Each “Attempt fix” uses some of your daily allowance."
],
[
"Lovable",
"Free",
"Free apps are invite-only: up to 10 people by email."
],
[
"Claude",
"Paid to save and share",
"Builds small tools on Free. Saving between visits and a public link need Pro."
]
],
"prep": [
"Shrink the idea: one person, one screen, one thing saved.",
"Write what “done” looks like in one sentence."
],
"steps": [
{
"t": "Fill in the app sheet",
"d": "Small wins. Logins and payments are a later kit.",
"p": "<goal>Build a small app that [does one job] for [who].</goal>\n<context>On the screen: [the inputs, with choices]. It shows: [the result, with your real rules or prices]. It saves: [what to keep, for example a list of past quotes].</context>\n<format>One screen, phone first. Big inputs. Show the result as soon as something changes.</format>\n<rules>Use exactly my rules and prices. No logins, no payments. Saved items must still be there after I refresh the page. They can stay on this one device.</rules>",
"ok": "Your real rules and prices are in the sheet."
},
{
"t": "Build the screen",
"d": "Paste the sheet as your first message.",
"ok": "Change an input. Does the result change?"
},
{
"t": "Test the saving",
"d": "Add 3 items, then refresh the page.",
"ok": "Still there? If not, paste: “My items disappear when I refresh. Make them save.”"
},
{
"t": "Try to break it",
"d": "Paste:",
"p": "Test this app like a picky customer: empty boxes, huge numbers, the wrong order of steps. Fix what breaks, and tell me what you changed.",
"ok": "Nothing shows a blank, $0 for a real order, or an error."
},
{
"t": "Share it",
"d": "Click Share or Publish, then send the link to a friend.",
"ok": "Your friend opens it and gets a price. (Saved items stay on each person’s own device.)"
}
],
"stuck": [
[
"My data disappears on refresh",
"Saving isn’t switched on. Ask: “Save the items in this browser so they survive a refresh.”"
],
[
"It works for me but not my friend",
"The app is still private. Click Share or Publish. On Lovable Free, invite them by email."
],
[
"It keeps getting bigger",
"Say “Undo the last change. Keep it to one screen.”"
],
[
"The math is wrong",
"Give it a worked example: “6-inch, 2 layers, delivery should be $43.”"
]
],
"done": "You made a working tool. Next: automate one boring task.",
"privacy": "Never paste passwords or secret keys into a builder. In AI Studio, people using your shared app use up your free allowance.",
"example": {
"prompt": "<goal>Build a small app that prices custom cake orders for Mira’s Bakery, for Mira to use at the counter.</goal>\n<context>On the screen: size (6 inch $36, 8 inch $48, 10 inch $64), layers (1 or 2; 2 layers add $10), flavor (lemon, chocolate, cardamom), delivery (yes adds $15), pickup date. It shows: the total price, and a warning if the date is less than 3 days away (we need 3 days’ notice). It saves: a list of past quotes with customer name, cake and total.</context>\n<format>One screen. Phone first. Big inputs. Show the total as soon as something changes.</format>\n<rules>Use exactly my prices. No logins, no payments. Saved quotes must still be there after I refresh the page.</rules>",
"html": true
},
"proof": {
"kitScore": 5.0,
"plainScore": 1.8,
"winner": "template",
"reason": "The kit answer uses the exact prices, flavors, 3-day notice warning, live total and saved quotes that survive refresh, while the plain answer had no prices to go on, so it made up its own and has no notice warning.",
"plainAsk": "Make me an app for cake orders.",
"plainImg": "img/first-app-plain.jpg",
"kitImg": "img/first-app-template.jpg"
}
},
{
"id": "automate-task",
"n": 4,
"name": "Automate one boring task",
"icon": "auto",
"result": "One small automation running on its own, with AI helping you plan and write it.",
"time": "45–60 min",
"cost": "Free",
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
"prep": [
"A list of what you do every week.",
"Pick one task: 10+ minutes, same steps every time, harmless if it goes wrong.",
"No Google Form yet? forms.google.com → Blank. Add the questions (name, what they need, date). Then Responses → Link to Sheets, and Send to get the link."
],
"steps": [
{
"t": "Let AI pick the task and plan it",
"d": "Paste this into Claude, ChatGPT or Gemini (free is fine).",
"p": "<goal>Help me automate one boring task, starting small.</goal>\n<context>My weekly tasks: [list]. My apps: [for example Gmail, Google Sheets, Google Forms]. I’m on Zapier Free: one trigger and one action, 100 tasks a month.</context>\n<format>1) The best task to start with, and why. 2) “When this happens” → “do this”, in plain words. 3) The exact request to paste into Zapier Copilot. 4) How to test it.</format>\n<rules>It may only read or write drafts (like a Gmail draft I check). Never send, pay or delete on its own. Skip anything my apps already do by themselves (Google Forms already saves answers to a sheet). If it needs more than 2 steps, give me the 2-step version.</rules>",
"ok": "You get one “when this happens” and one “do this”, in plain words."
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
"done": "Something now happens without you. Next: a month of posts.",
"privacy": "Start with automations that draft, not send. Check what you connect: only the accounts this task needs.",
"example": {
"prompt": "<goal>Help me automate one boring task, starting small.</goal>\n<context>My weekly tasks: answering cake order requests from my website’s Google Form (about 10 a week, 15 minutes each: I copy the details into my order sheet and email back to confirm), ordering flour every Monday, posting on Instagram. My apps: Gmail, Google Sheets, Google Forms. I’m on Zapier Free: one trigger and one action, 100 tasks a month.</context>\n<format>1) The best task to start with, and why. 2) “When this happens” → “do this”, in plain words. 3) The exact request to paste into Zapier Copilot. 4) How to test it.</format>\n<rules>It may only read or write drafts (like a Gmail draft I check). Never send, pay or delete on its own. Skip anything my apps already do by themselves (Google Forms already saves answers to a sheet). If it needs more than 2 steps, give me the 2-step version.</rules>",
"html": false
},
"proof": {
"kitScore": 4.8,
"plainScore": 2.3,
"winner": "template",
"reason": "The kit answer gives the specific Zapier Free plan the person needed (form response to Gmail draft, a paste-ready Copilot request, a real test) while the plain answer is a generic multi-step bakery automation guide that ignores the one-trigger, one-action free limit.",
"plainAsk": "How do I automate my bakery cake orders with AI?",
"plainOut": "# Automating bakery cake orders with AI\n\nCake orders usually follow the same loop: a customer asks, you reply with details and a price, they pay a deposit, you remember the date, and you bake. AI can take over most of the typing and tracking. Here is a practical way to set it up.\n\n## 1. Map your current process first\n\nWrite down what happens from the first message to pickup:\n\n1. Customer asks (Instagram DM, text, email, website form, phone)\n2. You collect details: date, size or servings, flavor, design, allergies, pickup or delivery\n3. You quote a price\n4. They pay a deposit\n5. You schedule the bake and decoration\n6. You send a reminder, then they pick up\n\nMark the steps where you repeat yourself. Those are the ones to automate.\n\n## 2. Put every request into one intake form\n\nMessy DMs are the biggest time sink. Send everyone to a single order form (Google Forms, Jotform, Tally, or Shopify, Square or Wix if you have a site). Ask for:\n\n- Name, phone, email\n- Event date and pickup or delivery\n- Servings or size\n- Flavor, filling and frosting (use dropdowns)\n- Design notes and a reference photo upload\n- Allergies or dietary needs\n- Message on the cake\n\nPut the link in your Instagram bio, Facebook page, Google Business profile and your auto-replies. Dropdowns keep orders consistent, and the form tells you which details are missing before you start.\n\n## 3. Use AI to answer and quote\n\n- **Auto-replies:** Set up an Instagram or Facebook auto-response (Meta Business Suite has this built in). It sends the form link and your lead time.\n- **Reply drafts:** Give an AI assistant (Claude or ChatGPT) your menu, pricing rules, lead times, delivery area and policies. Paste in a customer message and it drafts the reply. You review it and send.\n- **Quote calculator:** Write your pricing rules out, for example \"6-inch serves 8-10, $55 base, fondant +$20, custom topper +$15, delivery $X per mile\". AI can turn a form entry into a quote. Or build the same math in a spreadsheet.\n- **Photo reference:** AI can describe a customer's inspiration photo, which helps you judge how complex it is and how long it will take.\n\n## 4. Connect the pieces with an automation tool\n\nZapier, Make or Airtable Automations can link the form to the rest of your workflow with no code. A typical chain:\n\n1. A new form entry is added to an Airtable or Google Sheets order tracker\n2. An AI step reads the entry and drafts a quote and confirmation email\n3. A deposit link (Stripe, Square or PayPal invoice) is sent\n4. When the deposit is paid, the order is marked \"Confirmed\" and a calendar event is created on the event date\n5. A reminder goes out one week and one day before pickup\n6. A thank-you and review request goes out after pickup\n\n## 5. Protect your capacity\n\nLimit orders so you don't overbook:\n\n- Set a maximum number of cakes per day in your calendar or form tool, and block dates automatically when you reach it\n- Set a minimum lead time (for example 7 days for custom cakes)\n- Flag rush or large orders so they come to you for manual approval\n\n## 6. Automate the baking-side admin\n\n- **Production list:** Have the tracker produce a weekly view sorted by date, with flavors, sizes and allergies.\n- **Ingredient and shopping lists:** Give AI your recipes and the week's orders, and it can total the flour, butter, eggs and so on.\n- **Labels and tickets:** Generate a printable order ticket for each cake.\n\n## What to keep human\n\n- Final pricing on complex designs\n- Allergy confirmation (always double-check this yourself)\n- Anything emotional, such as weddings, memorials or complaints\n- Reviewing AI drafts before they go out, at least at first\n\n## A simple starter plan\n\n**Week 1:** Build the order form and put it everywhere. Create a tracker spreadsheet.\n**Week 2:** Write your pricing rules and FAQ. Use an AI assistant to draft replies. Turn on auto-replies.\n**Week 3:** Add deposit links and calendar events using Zapier or Make.\n**Week 4:** Add reminders, review requests and the weekly production list.\n\n## Tools to consider\n\n- Forms: Google Forms, Tally, Jotform\n- Tracker: Airtable, Google Sheets, Notion\n- Automation: Zapier, Make\n- Payments: Square, Stripe, PayPal\n- All-in-one bakery options: Square Online, Shopify, or bakery software such as Bakesmart or Cakesmart. Check current pricing.\n- AI: Claude or ChatGPT for drafting and quotes\n\n## Tips\n\n- Start small. A form plus a tracker already saves hours.\n- Always take a deposit to cut down no-shows.\n- Keep a written policy page (cancellations, allergens, pickup) and link to it in every confirmation.\n\nIf you tell me where most of your orders come from (Instagram, phone, website), how many cakes you do per week, and which tools you already use, I can suggest a specific setup. I can also help write your pricing rules, the AI reply prompt, or the order form questions.",
"kitOut": "## 1) Best task to start with\n\n**Confirming cake order requests.** It's your biggest time cost: about 10 a week at 15 minutes each, which is roughly 2.5 hours a week. It's the same steps every time. It also fits your free plan, because 10 orders a week is about 40 tasks a month, well under the 100 limit.\n\nI'd skip the other two for now:\n- **Flour:** it's only one task a week, and ordering means paying, which this setup can't do.\n- **Instagram:** it needs your creative input each time.\n\n## 2) \"When this happens\" → \"do this\"\n\n**When this happens:** a new answer arrives in your cake order Google Form. (Zapier watches the form's response sheet in Google Sheets, so the trigger is \"New Spreadsheet Row\" in Google Sheets.)\n\n**Do this:** create a **Gmail draft** to that customer. It confirms their order using the details they entered, and it waits in your Drafts folder for you to check and send.\n\nYou don't need a step that copies details into your order sheet. Google Forms already saves each answer to a sheet, so you can use that sheet as your order sheet. Zapier never sends the email. You read each draft, fix anything, and press Send yourself. That takes about 1 minute instead of 15.\n\n## 3) Paste this into Zapier Copilot\n\n> When a new row is added in my Google Sheet \"Cake Orders (Form responses 1)\", create a draft in Gmail. Do not send it. Address the draft to the email in the customer's email column. Use the subject \"Your cake order request: [cake type/date]\". The body should say: \"Hi [name], thanks for your order request! Here is what I have: [cake type], [flavor], [servings], [pickup/delivery date], [notes]. I'll confirm the price and availability shortly. Thank you! [My name]\". Use the matching columns from the sheet for each bracket.\n\nBefore you paste it, change the sheet name and the bracket labels to match your form's real column headings. Also swap in your own name and wording.\n\n## 4) How to test it\n\n1. In Zapier, turn the Zap on only after the test step below works.\n2. Submit your own cake form with your own email address and made-up details, such as \"Test Cake, vanilla, 12 servings\".\n3. Open the Zap's trigger step and click **Test trigger**. Zapier should find your test row. If it doesn't, wait a minute and try again.\n4. Click **Test action** on the Gmail step. Then open Gmail → **Drafts**. You should see a draft addressed to you with all the details filled in correctly.\n5. Check that nothing was sent. The message should still be a draft, and your Sent folder should be unchanged.\n6. If a detail is blank or in the wrong place, edit the draft template in the Zap so the field matches the right column. Then run the test again.\n7. Delete the test row and the test draft by hand, then turn the Zap on.\n8. For the first week, read every draft before you send it. Zapier Free may check for new rows only every 15 minutes, so a draft can show up a bit late. That's normal.\n\n**Later, if it works well:** you could add a second step that tags the row as \"confirmed\". On the Free plan, though, you only get one action, so stay with the draft for now.",
"note": "Our first version scored 4.0: it picked a step Google Forms already does. We fixed the prompt and tested again."
}
},
{
"id": "month-of-posts",
"n": 5,
"name": "A month of posts",
"icon": "posts",
"result": "12 posts in your voice and a simple calendar, ready to schedule.",
"time": "30–45 min",
"cost": "Free",
"tools": [
[
"Claude, ChatGPT or Gemini",
"Free",
"Any of them. The prompt is the same."
]
],
"prep": [
"Your voice profile from kit 1. No profile? Paste 2 captions you wrote instead.",
"What’s happening this month: dates, new things, prices.",
"1 or 2 past posts that did well."
],
"steps": [
{
"t": "Fill in the month sheet",
"d": "Paste into a new chat.",
"p": "<goal>Write 12 posts for [platform] for [month]: 3 a week.</goal>\n<who_its_for>[your followers, and why they follow you]</who_its_for>\n<context>My voice profile: [paste]. This month: [dates, new things, prices, events]. Two posts that did well: [paste].</context>\n<format>A table: date, post, photo idea. Each post under [40] words.</format>\n<rules>Use only my facts and dates. No hashtag walls. No words I’d never say.</rules>",
"ok": "Every date and price matches your list."
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
"done": "12 captions written. The photos are still yours to take. Next: turn a voice memo into a handbook.",
"privacy": "Take out names, phone numbers and anything private before you paste.",
"example": {
"prompt": "<goal>Write 12 Instagram posts for March: 3 a week (Tue, Thu, Sat).</goal>\n<who_its_for>Locals who stop by on the way to work, and parents planning birthdays.</who_its_for>\n<context>My voice: short, warm, plain words, a little dry; I say “See you at 7” and “gone by noon”; no emojis. This month: cardamom buns every Saturday ($4.50, sell out by 11); new hot cross buns from March 17 ($3.75, until Easter); closed Tuesday March 3 for an oven repair; custom cakes need 3 days’ notice, from $48. Two posts that did well: “Rye loaves are back. Crusty outside, soft inside, gone by noon. See you at 7.” and “We’re out of flour dust and into spring. Open 7am.”</context>\n<format>A table: date, post, photo idea. Each post under 40 words.</format>\n<rules>Use only my facts and dates. No hashtags. No emojis. Don’t say “indulge”, “mouthwatering” or “treat yourself”.</rules>",
"html": false
},
"proof": {
"kitScore": 4.3,
"plainScore": 1.5,
"winner": "template",
"reason": "The kit answer gives the 12 short dated Tue/Thu/Sat posts in a table with photo ideas and Mira's real facts, with a few small invented details like the 7am opening time, while the plain answer had no facts to use, so it gave a generic 20-post plan that has emojis, hashtags and placeholders.",
"plainAsk": "Write a month of Instagram posts for my bakery.",
"plainOut": "# A Month of Instagram Posts for Your Bakery\n\nI don't know your bakery's name, specialties or location, so I wrote this to work for most bakeries. Swap in your own items in the [brackets]. The plan is 4 weeks with 5 posts a week, which makes 20 posts. Stories are optional extras.\n\n**Weekly rhythm**\n- **Mon:** Behind the scenes\n- **Tue:** Product spotlight\n- **Wed:** Tip, story or education\n- **Thu:** Community and customers\n- **Fri/Sat:** Weekend special or call to action\n\n---\n\n## Week 1: Meet the Bakery\n\n**Day 1 (Mon): Behind the scenes (Reel)**\nCaption: 4 a.m. and the ovens are already warm. Here's what happens before you wake up. What time do you think we start? 👇\nVisual: Time-lapse of dough being shaped, or the first tray coming out.\nHashtags: #[YourTown]Bakery #BehindTheScenes #BakersOfInstagram #FreshBaked\n\n**Day 2 (Tue): Product spotlight (Photo)**\nCaption: Meet our [signature item]. [One sentence on what makes it special: the butter, the recipe, the slow rise.] It's the one people come back for. Have you tried it?\nVisual: Close-up in natural light, with a bite taken or a cross-section.\n\n**Day 3 (Wed): Our story (Carousel)**\nCaption: Why we started [Bakery Name]. Swipe to see how it began. [Two or three honest sentences about your why.]\nSlides: 1) Old photo or the first day. 2) The first recipe. 3) The team today. 4) \"Come say hi.\"\n\n**Day 4 (Thu): Community (Photo)**\nCaption: Our regulars are the best part of this job. Tag your favorite coffee-and-pastry order and we'll feature a few this week.\nVisual: Your counter, a happy customer (with permission), or a full pastry case.\n\n**Day 5 (Sat): Weekend special (Photo)**\nCaption: This weekend only: [special item]. Limited batch, so come early. Open [hours].\nVisual: Hero shot of the special on a tray.\n\n---\n\n## Week 2: Taste and Craft\n\n**Day 6 (Mon): Process (Reel)**\nCaption: Watch a croissant get its layers. Yes, it takes three days. No, we won't rush it.\nVisual: Laminating, folding, cutting, baking. Add trending or soft kitchen audio.\n\n**Day 7 (Tue): Poll (Story or feed)**\nCaption: Settle this: sweet or savory breakfast? Vote below. Winner gets a special on Friday.\nVisual: Split image with a pastry on each side.\n\n**Day 8 (Wed): Tip (Carousel)**\nCaption: 5 ways to keep bread fresh longer. Save this for later.\nSlides: 1) Don't refrigerate it. 2) Store it cut-side down. 3) Freeze slices. 4) Revive in the oven. 5) Use stale bread for toast or croutons.\n\n**Day 9 (Thu): Meet the team (Photo)**\nCaption: This is [Name]. They've been shaping loaves here for [X] years. Their favorite thing on the menu? [Item]. Ask them about it next time you visit.\nVisual: Portrait in the kitchen, flour on the apron.\n\n**Day 10 (Fri): Pre-order push (Photo)**\nCaption: Weekend orders are open. Cakes, boxes and brunch trays. Message us or use the link in bio by [day].\nVisual: A beautiful box or cake.\n\n---\n\n## Week 3: Seasonal and Social Proof\n\n**Day 11 (Mon): Seasonal launch (Reel)**\nCaption: It's here. Our [seasonal item: pumpkin loaf, peppermint cookies, etc.]. Available through [date].\nVisual: Reveal with a smooth pan across the display.\n\n**Day 12 (Tue): Customer review (Graphic)**\nCaption: \"[Real review quote]\" - [First name]. Thank you. Messages like this make the 4 a.m. mornings worth it.\nVisual: Quote on a brand-colored background beside a product photo.\n\n**Day 13 (Wed): Ingredient story (Photo)**\nCaption: Where our [flour/butter/fruit] comes from. We care about it because it shows up in every bite. [Local supplier name, if you have one.]\nVisual: The ingredient, or a photo of the supplier or farm.\n\n**Day 14 (Thu): Q&A (Story or Reel)**\nCaption: Ask us anything: recipes, wholesale, custom cakes, dietary options. We'll answer a few in a Reel this weekend.\n\n**Day 15 (Sat): Weekend special (Photo)**\nCaption: Saturday treat: buy [X], get [a small bonus]. Show this post at the counter. While supplies last.\n\n---\n\n## Week 4: Celebrate and Convert\n\n**Day 16 (Mon): Before and after (Reel)**\nCaption: Plain cake to showstopper in 30 seconds. Custom orders open for [upcoming holiday or event].\nVisual: Fast decorating time-lapse.\n\n**Day 17 (Tue): Menu guide (Carousel)**\nCaption: First time here? Here's what to order. Our top 5 for first-timers.\nSlides: One item per slide, with a one-line description.\n\n**Day 18 (Wed): Fun and relatable (Photo or Reel)**\nCaption: Me: \"I'm just popping in for bread.\" Also me, leaving with a bag of cookies. 🍪 Tell us your most \"I only came for…\" moment.\n\n**Day 19 (Thu): Gratitude (Photo)**\nCaption: A month of sharing our work with you. Thank you for the support, the shares and the tags. What do you want to see more of next month?\nVisual: Team photo or a full display case.\n\n**Day 20 (Fri/Sat): Holiday or giveaway (Photo)**\nCaption: GIVEAWAY: win a box of [item] for you and a friend. To enter: 1) follow us, 2) like this post, 3) tag a friend. Ends [date].\n\n---\n\n## Quick Tips\n- **Post times:** Early morning (7 to 9 a.m.) and late afternoon (3 to 5 p.m.) tend to work well for food.\n- **Use natural light.** Shoot near a window and skip the flash.\n- **Reply to every comment** within the first hour.\n- **Location tag:** Always tag your bakery and neighborhood.\n- **Stories:** Post daily when you can. Show the display case, a fresh tray or a sold-out sign.\n- **Repurpose:** Turn each Reel into a TikTok or Facebook post.\n\n---\n\nIf you tell me your bakery's name, location, top 3 items, tone (cozy, modern, playful) and any events this month, I'll rewrite every caption in your voice and add a content calendar with exact dates.",
"kitOut": "| Date | Post | Photo idea |\n|---|---|---|\n| Tue, Mar 3 | Closed today for an oven repair. Back Thursday, open at 7. | The dark oven with the door open, a tool bag on the floor. |\n| Thu, Mar 5 | We're open at 7. Cardamom buns are back on Saturday, $4.50, gone by 11. See you then. | A tray of cardamom buns, flour on the counter. |\n| Sat, Mar 7 | Cardamom buns today. $4.50 each. They sell out by 11, so come early. See you at 7. | Close-up of a cardamom bun, split open. |\n| Tue, Mar 10 | Birthday coming up? Custom cakes need 3 days' notice and start at $48. Ask us on your way to work. | A finished custom cake on the counter. |\n| Thu, Mar 12 | Hot cross buns start Tuesday, March 17. $3.75, until Easter. Cardamom buns this Saturday, $4.50. | A hand-written \"Tuesday\" sign next to the empty bun tray. |\n| Sat, Mar 14 | Cardamom buns today, $4.50. Gone by 11. Hot cross buns come Tuesday. See you at 7. | A line at the door early in the morning. |\n| Tue, Mar 17 | Hot cross buns are here. $3.75 each, until Easter. Warm, spiced, and gone by noon. Open 7am. | A tray of hot cross buns straight from the oven. |\n| Thu, Mar 19 | Cake for Sunday? Custom cakes need 3 days' notice, so today is the day to ask. From $48. | A baker piping the edge of a cake. |\n| Sat, Mar 21 | Two buns today. Cardamom, $4.50, gone by 11. Hot cross, $3.75, until Easter. See you at 7. | Both buns side by side on one tray. |\n| Tue, Mar 24 | Hot cross buns, $3.75. One for the walk to work, a few for later. Open 7am. | A paper bag of hot cross buns on the counter. |\n| Thu, Mar 26 | Planning a birthday for next week? Custom cakes start at $48 and need 3 days' notice. Ask us today. | A cake with a hand-lettered name on top. |\n| Sat, Mar 28 | Last cardamom Saturday of March. $4.50, gone by 11. Hot cross buns until Easter. See you at 7. | The last bun on an almost empty tray. |\n\nNotes: March has 13 Tuesdays, Thursdays and Saturdays, so I left out Tuesday, March 31 to keep it at 3 a week. I used the 2026 calendar, where March 3 is a Tuesday. Check \"back Thursday\" in the first post against your real plans."
}
},
{
"id": "memo-to-handbook",
"n": 6,
"name": "Voice memo to handbook",
"icon": "memo",
"result": "A clear checklist and how-to guide for a task you explain out loud, so someone else can do it.",
"time": "20–30 min",
"cost": "Free",
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
"prep": [
"Do the task once while talking through it out loud, or just explain it from memory.",
"Take out names and anything private."
],
"steps": [
{
"t": "Record and get the words",
"d": "Record yourself explaining the task. Copy the transcript, messy is fine.",
"ok": "You have the words as text."
},
{
"t": "Turn it into a handbook",
"d": "Paste into a new chat:",
"p": "<goal>Turn my rambling explanation into a checklist and a short how-to guide a new person can follow.</goal>\n<who_its_for>[who will use it: a new hire, a helper, future me]</who_its_for>\n<context>My transcript:\n[paste]</context>\n<format>1) A numbered checklist with times. 2) A short guide: why each step matters. 3) Questions I didn’t answer.</format>\n<rules>Keep every number, time and warning I said. Don’t add steps I didn’t say; put guesses under Questions.</rules>",
"ok": "Every time and number from your memo is in the checklist."
},
{
"t": "Answer the questions",
"d": "Reply with answers to its questions, then ask for the final version to print.",
"ok": "A new person could do it without calling you."
}
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
"done": "Your know-how is written down. Back to the kits list for the next one.",
"privacy": "Take out names, phone numbers and anything private before you paste.",
"example": {
"prompt": "<goal>Turn my rambling explanation into a checklist and a short how-to guide a new person can follow.</goal>\n<who_its_for>A new weekend helper who has never opened the bakery.</who_its_for>\n<context>My transcript:\nok so opening. um first thing you get in at six, lights, then the ovens, both ovens to 220 they take like 20 minutes. while thats heating you pull the dough from the walk-in, the buns proof on the left rack not the right one the right one is for loaves. oh and check the walk-in temp its on the door should be under 4 if its not text me. then coffee machine, flush it first. cash float is in the safe, 150 in the drawer, count it. at like 6:45 buns go in, 18 minutes, rotate at 9. sign goes out at 7 not before. wipe the counter with the blue spray not the green, green is for floors. if Tom's delivery comes sign for it and check the flour count. thats basically it</context>\n<format>1) A numbered checklist with times. 2) A short guide: why each step matters. 3) Questions I didn’t answer.</format>\n<rules>Keep every number, time and warning I said. Don’t add steps I didn’t say; put guesses under Questions.</rules>",
"html": false
},
"proof": {
"kitScore": 4.3,
"plainScore": 4.0,
"winner": "tie",
"reason": "The kit answer keeps every detail and asks the useful open questions (safe code, 220 units, short delivery), but it adds a padded 'why' section and drops Mira's name. The plain answer is cleaner and grouped by time, but it drops Mira's name too, and it asks only two questions, missing the safe code and the 220 units.",
"plainAsk": "Turn this into a checklist:",
"plainOut": "# Opening Checklist\n\n## 6:00 AM: Arrive\n- [ ] Turn on the lights\n- [ ] Turn on both ovens and set them to 220 (they take about 20 minutes)\n- [ ] Check the walk-in temperature on the door. It should be under 4. If it isn't, text me.\n- [ ] Pull the dough from the walk-in\n  - [ ] Proof the buns on the **left** rack\n  - [ ] The right rack is for loaves only\n- [ ] Flush the coffee machine, then start the coffee\n- [ ] Get the cash float from the safe\n  - [ ] Put 150 in the drawer\n  - [ ] Count it\n\n## 6:45 AM: Baking\n- [ ] Put the buns in the oven for 18 minutes\n- [ ] Rotate them at 9 minutes\n\n## 7:00 AM: Open up\n- [ ] Put the sign out (not before 7)\n\n## Anytime\n- [ ] Wipe the counter with the **blue** spray (green is for floors only)\n- [ ] If Tom's delivery arrives, sign for it and check the flour count\n\n## Notes\n- \"Rotate at 9\" is read as 9 minutes into the bake. Please confirm.\n- The memo doesn't say whether the 150 is counted before or after it goes in the drawer. I put it in the order given.",
"kitOut": "# Bakery Opening: Weekend Helper Guide\n\n## 1) Opening checklist\n\n- [ ] **6:00** Arrive. Turn on the lights.\n- [ ] **6:00** Turn on both ovens and set them to **220**. They take about 20 minutes.\n- [ ] While the ovens heat, take the dough out of the walk-in.\n- [ ] Put the **buns** on the **left** rack to proof. **Not the right rack.** The right rack is for loaves.\n- [ ] Check the walk-in temperature on the door. It should be **under 4**. If it isn't, **text the owner**.\n- [ ] Flush the coffee machine first, then make the coffee.\n- [ ] Get the cash float from the safe. Put **150** in the drawer and **count it**.\n- [ ] Wipe the counter with the **blue** spray. **Not the green.** Green is for floors.\n- [ ] **6:45** Put the buns in the oven. Bake **18 minutes**.\n- [ ] **Rotate at 9.**\n- [ ] **7:00** Put the sign out. **Not before 7.**\n- [ ] If Tom's delivery comes, sign for it and check the flour count.\n\n## 2) Short guide: why each step matters\n\n- **Lights, then ovens at 220 at 6:00.** The ovens need about 20 minutes to heat. Starting them first means they are ready for the buns at 6:45.\n- **Dough out of the walk-in while the ovens heat.** This uses the heating time.\n- **Buns on the left rack, loaves on the right.** The racks are split by product. Putting buns on the right rack mixes them up with the loaves.\n- **Walk-in under 4.** Above 4 is a problem, so you text the owner. Don't wait to see if it fixes itself.\n- **Flush the coffee machine first.** Do this before making any coffee.\n- **Count the 150 float.** Counting it confirms the drawer starts correct.\n- **Blue spray on the counter, green on floors.** The two sprays are for different surfaces. Use the right one.\n- **Buns in at 6:45 for 18 minutes, rotate at 9.** Stick to the times so the buns are baked on schedule.\n- **Sign out at 7, not before.** 7:00 is the opening time for the sign.\n- **Tom's delivery.** Signing for it and checking the flour count records what arrived.\n\n## 3) Questions I didn't answer\n\nThese were not in your transcript, so I did not add them as steps.\n\n1. Is 220 in Celsius or Fahrenheit?\n2. What is \"rotate at 9\"? Is it 9 minutes into the bake, or 9:00 am? (Buns go in at 6:45 and bake 18 minutes, so 9:00 am looks too late. I'm guessing it means 9 minutes.)\n3. Rotate what? The trays?\n4. What is the combination or key for the safe? Who gives it to a new helper?\n5. Is the 150 in dollars? What do you do if the count doesn't match?\n6. What phone number should the helper text about the walk-in? What should they do with the dough or food if it's over 4?\n7. How long does the buns' proofing take, and how do they know the buns are ready for the oven?\n8. Which dough goes in the walk-in? Is there a loaf dough that also needs handling?\n9. When do loaves go in the oven?\n10. What does \"flush\" the coffee machine involve? Is there a button or a cycle?\n11. When should the doors open to customers? Is it at 7 when the sign goes out?\n12. What is the expected flour count, and who do I tell if it's wrong?\n13. What time does Tom's delivery usually arrive, and what else comes with it?\n14. Where are the blue and green sprays kept?\n15. What happens after opening? Are there any closing tasks?"
}
}
]
};
