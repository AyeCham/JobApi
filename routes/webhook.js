// routes/webhook.js
const express     = require('express');
const line        = require('@line/bot-sdk');
const { getAnswer } = require('../utils/faqData');
const { getJobCards } = require('../utils/jobScraper');
const path        = require('path');
const fs          = require('fs');

module.exports = (config) => {
  const router = express.Router();
  const client = new line.Client(config);

  // LINE middleware parses signature + body
  router.post('/', line.middleware(config), async (req, res) => {
    try {
      const results = await Promise.all(
        req.body.events.map((ev) => handleEvent(ev, client))
      );
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).end();
    }
  });

  return router;
};

async function handleEvent(event, client) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return null;
  }

  const text = event.message.text.trim().toLowerCase();

  // ── Command routing ───────────────────────────────────
  if (text.startsWith('job')) {
    const jobs = await getJobCards(5); // top 5 jobs
    return client.replyMessage(event.replyToken, jobs);
  }

  if (text.startsWith('report')) {
    await logIncident(event);
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '📝 Thank you. Your report is saved anonymously.',
    });
  }

  // Fallback to FAQ search
  const answer = getAnswer(text);
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: answer || '👵 Ask Aunty: type "job", "visa", or "report".',
  });
}

// ─── Incident logger ─────────────────────────────────────────
function logIncident(event) {
  const row = [
    new Date().toISOString(),
    event.source.userId,
    event.message.text.replace(/^report\s*/i, ''),
  ].join(',') + '\n';

  fs.appendFileSync(
    path.join(__dirname, '../logs/incidents.csv'),
    row,
    'utf8'
  );
}
