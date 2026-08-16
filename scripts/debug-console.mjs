import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATHS = [
  path.join('C:', 'Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
];
const executablePath = CHROME_PATHS.find((p) => fs.existsSync(p));
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 375, height: 900 } });
page.on('console', (msg) => console.log('CONSOLE:', msg.type(), msg.text()));
page.on('pageerror', (err) => console.log('PAGEERROR:', err.message));
await page.goto(process.argv[2], { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(1000);
const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 500));
console.log('BODY TEXT:', JSON.stringify(bodyText));
await browser.close();
