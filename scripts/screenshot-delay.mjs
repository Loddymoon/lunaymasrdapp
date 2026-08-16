// Captura una screenshot a un delay especifico tras cargar la pagina (para ver un
// momento intermedio de una animacion), usando el Chrome del sistema via playwright-core.
// Uso: node scripts/screenshot-delay.mjs <url> <salida.png> <delayMs>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const [, , url, out, delayMsArg] = process.argv;
const delayMs = Number(delayMsArg || '1200');
if (!url || !out) {
  console.error('Uso: node scripts/screenshot-delay.mjs <url> <salida.png> <delayMs>');
  process.exit(1);
}

const CHROME_PATHS = [
  path.join('C:', 'Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
];
const executablePath = CHROME_PATHS.find((p) => fs.existsSync(p));

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(delayMs);
await page.screenshot({ path: out, timeout: 15000 });
await browser.close();
console.log(`OK -> ${out} (delay ${delayMs}ms)`);
