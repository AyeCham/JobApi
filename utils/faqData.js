// utils/faqData.js
const path = require('path');
const fs   = require('fs');

const faqPath = path.join(__dirname, '../data/legal_faq.json');
let faq;

try {
  faq = JSON.parse(fs.readFileSync(faqPath, 'utf8'));
} catch (err) {
  console.error('⚠️  Cannot load FAQ data', err);
  faq = [];
}

/**
 * Very simple keyword match.
 * Later you can upgrade to Fuse.js fuzzy search or a vector DB.
 */
exports.getAnswer = (userText) => {
  userText = userText.toLowerCase();
  const hit = faq.find(({ q }) => userText.includes(q.toLowerCase()));
  return hit ? hit.a : null;
};
