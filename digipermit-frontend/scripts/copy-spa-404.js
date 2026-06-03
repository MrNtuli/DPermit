/**
 * GitHub Pages has no SPA fallback. Copy index.html → 404.html so deep links
 * (/DPermit/login, /DPermit/admin/dashboard, etc.) load the app instead of 404.
 */
const fs = require('fs');
const path = require('path');

const www = path.join(__dirname, '..', 'www');
const index = path.join(www, 'index.html');
const fallback = path.join(www, '404.html');

if (!fs.existsSync(index)) {
  console.error('copy-spa-404: www/index.html not found — run ng build first.');
  process.exit(1);
}

fs.copyFileSync(index, fallback);
console.log('copy-spa-404: created www/404.html for GitHub Pages deep links');
