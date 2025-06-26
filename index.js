// index.js
require('dotenv').config();
const express  = require('express');
const { middleware } = require('@line/bot-sdk');

// pull LINE keys from .env
const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret:      process.env.LINE_CHANNEL_SECRET,
};

const app = express();

// ─── Mount the webhook router ────────────────────────────────
const webhookRouter = require('./routes/webhook')(config);
app.use('/webhook', webhookRouter);

// health-check route (optional)
app.get('/', (_, res) => res.send('Ask Aunty bot is alive!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀  Server running on ${PORT}`));
