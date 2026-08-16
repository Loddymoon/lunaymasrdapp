// Como screenshot.mjs pero para un lienzo de tamaño FIJO (mockups del carrusel),
// sin la logica de medir scrollHeight (que no aplica a un div de 250x542 fijo).
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const [, , url, out, w, h] = process.argv;
const width = Number(w) || 250;
const height = Number(h) || 542;

const CHROME_PATHS = [
  path.join('C:', 'Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  path.join('C:', 'Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe'),
];
const executablePath = CHROME_PATHS.find((p) => fs.existsSync(p));

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(400);
await page.screenshot({ path: out, animations: 'disabled', timeout: 15000 });
await browser.close();
console.log(`OK -> ${out}`);
