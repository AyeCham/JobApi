// index.js
require('dotenv').config();
const express = require('express');
const { sendToDiscord } = require('./utils/discordNotify');
const { getAnswer } = require('./utils/faqData');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple form to test
app.get('/', (_, res) => {
  res.send(`
    <h2>Lu Nge (Discord Mode)</h2>
    <form method="POST" action="/ask">
      <input name="msg" placeholder="Type something..." style="width:300px" />
      <button type="submit">Send</button>
    </form>
  `);
});

// Handle form or API post
app.post('/ask', async (req, res) => {
  const userMsg = req.body.msg?.trim().toLowerCase();
  if (!userMsg) return res.send("❌ No message provided.");

  // Check if it's a report
  if (userMsg.startsWith("report")) {
    const report = userMsg.replace(/^report\s*/i, '');
    await sendToDiscord(`📢 Anonymous report:\n${report}`);
    return res.send("✅ Report submitted to Discord.");
  }

  // Else: try FAQ answer
  const answer = getAnswer(userMsg);
  if (answer) {
    await sendToDiscord(`💬 Q: ${userMsg}\n Lu Nge: ${answer}`);
    return res.send(`✅ Answer sent to Discord:\n${answer}`);
  }

  // Fallback
  await sendToDiscord(`💬 Unknown query: ${userMsg}`);
  res.send("🤖 Lu Nge didn't understand, but your message was sent to Discord.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Ask Lu Nge (Discord mode) running at http://localhost:${PORT}`);
});
