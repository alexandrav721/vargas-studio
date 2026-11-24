/* Builder's Kitchen: questions to ask a vendor, per lesson. [question, a good answer sounds like, a red flag sounds like]. "school" adds one question for schools and districts. */
window.BK_VENDOR = {
  1: { q: [
    ["Which AI model does it use?", "“Claude Sonnet 5.5, and here’s why it fits this job.”", "“Our own secret AI.” They can’t or won’t name it."],
    ["What happens in very long conversations?", "“We summarize or start fresh, and here’s how you keep key facts.”", "“It remembers everything forever.”"],
    ["How does it handle things after its training cutoff?", "“It searches the web or uses your documents for anything new.”", "“It always knows the latest.”"],
    ["How do you price it as we use more?", "A clear per-seat or per-use price, with a cap you can set.", "“It depends.” No cap, no estimate."],
    ["How often is it wrong, and how do we spot it?", "“It can be wrong. We show sources and tell users to check.”", "“It doesn’t make mistakes.”"]],
    school: ["Is our data used to train the model?", "“No. Student and staff data is never used for training, and it’s in the contract.”", "“We may use it to improve our service.”"] },
  2: { q: [
    ["Whose API account does it run on?", "“Ours, with our key, billed to us,” or “yours, and here’s how we protect your key.”", "They ask you to email them your API key."],
    ["Are our chats stored? For how long?", "A clear answer in days, where, and how to delete them.", "“We keep everything to improve the product.”"],
    ["What does one typical request cost?", "A number per request or per month, with an example.", "No idea what a request costs."],
    ["What happens if the AI service is down or slow?", "“We retry, show a message, and here’s our uptime history.”", "“That never happens.”"],
    ["Can we see usage reports?", "A dashboard or monthly report of usage and cost.", "“We don’t track that.”"]],
    school: ["Where is student data stored, and who can see it?", "A named region, a short list of who has access, and a signed data agreement.", "“Somewhere in the cloud.”"] },
  3: { q: [
    ["What instructions does the assistant follow?", "“Here’s a summary of its rules, and you can change them.”", "“It just knows what to do.”"],
    ["What does it do when it doesn’t know?", "“It says so and points to a person or a source.”", "“It always has an answer.”"],
    ["How do you stop it making things up?", "“It answers from your facts and shows where each answer came from.”", "“Our AI is 100% accurate.”"],
    ["What if someone tries to talk it out of its rules?", "“We tested for that, and anything risky needs a person.”", "“Users can’t do that.”"],
    ["Can we test it with our own tricky questions first?", "“Yes, here’s a trial with your questions.”", "Demo only, no trial."]],
    school: ["Is it built for students’ ages?", "“Yes. Age-appropriate rules, tested with students in mind.”", "“It’s the same as the adult version.”"] },
  4: { q: [
    ["What actions can it take on its own?", "A short, specific list, like “look up an order.”", "“Anything you need.”"],
    ["What needs a person to approve first?", "“Anything that sends, spends, books or deletes.”", "“Nothing. It’s fully automatic.”"],
    ["What happens when it picks the wrong action?", "“It’s logged, can be undone, and here’s how.”", "“It doesn’t pick wrong.”"],
    ["Can we see a log of what it did?", "A log of every action with time and result.", "No log."],
    ["Can we turn actions off and keep just answers?", "“Yes, per action.”", "All or nothing."]],
    school: ["Can it contact students or families on its own?", "“No. Every message to families needs staff approval.”", "“Yes, that’s the time saver.”"] },
  5: { q: [
    ["Which of our apps does it connect to?", "A named list, like Google Drive and Calendar.", "“All of them.”"],
    ["Can it change things, or only read?", "Clear per app: “reads Drive, can’t delete.”", "“It needs full access to work.”"],
    ["Who built each connector?", "“The app maker, or us, and here’s our review.”", "“We found it online.”"],
    ["How do we turn a connection off?", "One switch, and it stops right away.", "“Contact support.”"],
    ["What stops a bad email or page from giving it orders?", "“It treats content as information, and actions need approval.”", "“That can’t happen.”"]],
    school: ["Can it reach student records or grades?", "“Only if you connect them, read-only, with district approval.”", "“It connects to your student system automatically.”"] },
  6: { q: [
    ["Do you train the AI on our documents?", "“No. We look up the right pages each time.”", "“Yes, it learns your business.” (Check what they mean.)"],
    ["Does it show which document each answer came from?", "“Yes, every answer links its source.”", "“Just trust it.”"],
    ["What does it say when no document fits?", "“It says it can’t find it and suggests who to ask.”", "It makes up an answer."],
    ["How fast do updates to our documents show up?", "“Within minutes or a day.”", "“We re-train once a year.”"],
    ["Who can see which documents?", "It follows your existing sharing permissions.", "“Everyone sees everything.”"]],
    school: ["Can a student see documents meant only for staff?", "“No. It follows your access rules for every answer.”", "“We don’t separate them.”"] },
  7: { q: [
    ["Which steps does it take on its own?", "A clear list, and where it stops to ask.", "“It figures everything out.”"],
    ["Where does a person approve?", "Before sending, spending, booking or deleting.", "“No approvals needed.”"],
    ["What does one task cost?", "An average per task, and a limit you can set.", "No estimate."],
    ["How do we stop it mid-task?", "A stop button, and nothing half-finished is left behind.", "“You can’t, but it’s fast.”"],
    ["Is this really an agent, or a fixed set of steps?", "An honest answer. Fixed steps are fine and cheaper.", "“Everything we make is an agent.”"]],
    school: ["Who is responsible if it gets something wrong for a student?", "A named staff role reviews it, and the contract says who’s accountable.", "“The AI is responsible.”"] },
  8: { q: [
    ["How are AI changes reviewed before going live?", "“A person reviews every change before it’s published.”", "“It ships straight to the live site.”"],
    ["How do we undo a bad change?", "“Every change is saved. We can roll back in minutes.”", "“We’d have to rebuild it.”"],
    ["What is it allowed to touch?", "“Only the website files, never passwords or payments.”", "“Everything, so it can move fast.”"],
    ["Who owns the code it writes?", "“You do, and it’s in your account.”", "“It stays on our platform.”"],
    ["What rules does it follow for our project?", "“A written rules file you can read and edit.”", "“It just knows.”"]],
    school: ["Does the finished site meet accessibility rules?", "“Yes, and here’s how we test it.”", "“AI handles that.”"] },
  9: { q: [
    ["How do you test that it works well?", "“A fixed set of real questions, scored every update.”", "“We tried it and it looked good.”"],
    ["How many real examples is that test?", "A real number, like 200, from real use.", "“A few.”"],
    ["How do you catch an update that breaks something?", "“We re-run the full test before every release.”", "“Customers tell us.”"],
    ["Can we add our own test questions?", "“Yes, send us yours and we’ll include them.”", "“Our tests are confidential.”"],
    ["What’s your score on questions like ours?", "A number, plus the questions it still misses.", "“It’s the best on the market.”"]],
    school: ["Was it tested with students and teachers?", "“Yes, with real classroom questions, and here’s what we changed.”", "“It was tested on general users.”"] },
  10: { q: [
    ["What’s inside: which model, tools and data?", "A one-page diagram in plain words.", "“It’s proprietary.”"],
    ["What does it cost per month at our size?", "A number for your volume, with a cap.", "“Let’s talk after you sign.”"],
    ["What guardrails stop risky actions?", "Approvals, limits and logs, named one by one.", "“It’s safe.” Nothing specific."],
    ["What’s the simplest version we could start with?", "A small pilot with one job and a clear success measure.", "“You need the full package.”"],
    ["What happens to our data if we leave?", "“You can export it, and we delete ours.”", "“It stays with us.”"]],
    school: ["Does it follow student privacy laws like FERPA and COPPA?", "“Yes, here’s our signed data agreement and who audits it.”", "“We’re working on it.”"] }
};
