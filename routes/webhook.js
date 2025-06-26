const { sendToDiscord } = require('../utils/discordNotify');

if (text.startsWith("report")) {
  const report = text.replace(/^report\s*/i, '').trim();
  await logIncident(event);
  await sendToDiscord(`🛑 New report from LINE user:\n${report}`);
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: '✅ Thank you. Your report has been submitted anonymously.'
  });
}
