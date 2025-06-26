// utils/jobScraper.js
const line = require('@line/bot-sdk');

/**
 * Returns an array of LINE Flex messages (or plain texts)
 * representing safe job listings.
 */
exports.getJobCards = async (limit = 5) => {
  // TODO: fetch live data from JobsDB
  const sample = [
    {
      title: "Kitchen Helper",
      loc:   "Bangkok",
      pay:   "฿12,000-15,000",
      url:   "https://th.jobsdb.com/kitchen-helper"
    },
    {
      title: "Factory Worker",
      loc:   "Rayong",
      pay:   "฿13,500",
      url:   "https://th.jobsdb.com/factory"
    }
  ].slice(0, limit);

  // Build LINE Flex carousel
  const bubbles = sample.map(job => ({
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        { type: "text", text: job.title, weight: "bold", size: "lg" },
        { type: "text", text: `${job.loc} • ${job.pay}`, size: "sm", color: "#888888" }
      ]
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: [{
        type: "button",
        action: { type: "uri", label: "Apply", uri: job.url },
        style: "primary"
      }]
    }
  }));

  return [{
    type: "flex",
    altText: "Job listings",
    contents: { type: "carousel", contents: bubbles }
  }];
};
