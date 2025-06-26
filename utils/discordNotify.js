const axios = require('axios');

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

const sendToDiscord = async (message) => {
  if (!WEBHOOK_URL) return console.error('❌ Missing Discord webhook URL');
  try {
    await axios.post(WEBHOOK_URL, { content: message });
    console.log('✅ Sent to Discord');
  } catch (err) {
    console.error('❌ Failed to send to Discord:', err.message);
  }
};

module.exports = { sendToDiscord };
