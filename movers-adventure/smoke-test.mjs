// Zero-build-tooling CI smoke test: serves index.html locally, loads it in headless
// Chromium, and fails the build if the page throws or logs a console error.
// Run via CI (see ../.github/workflows/movers-adventure-ci.yml) or locally with:
//   npx --yes -p playwright@1 node smoke-test.mjs
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const port = 4173;

const server = http.createServer((req, res) => {
  const file = req.url === '/' ? '/index.html' : req.url;
  fs.readFile(path.join(dir, file), (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200); res.end(data);
  });
}).listen(port);

const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (msg) => {
  if (msg.type() === 'error' && !msg.text().includes('favicon')) {
    errors.push('console.error: ' + msg.text());
  }
});

await page.goto(`http://localhost:${port}/index.html`);
await page.waitForTimeout(1000);

await browser.close();
server.close();

if (errors.length) {
  console.error('Smoke test failed — errors on page load:\n' + errors.join('\n'));
  process.exit(1);
}
console.log('Smoke test passed — index.html loaded with no console/page errors.');
