// Captura solo el viewport (sin expandir a la altura total) — util para revisar
// rapido el header/hero sin cargar una imagen gigante.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const [, , url, out] = process.argv;
const CHROME_PATHS = [path.join('C:', 'Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe')];
const executablePath = CHROME_PATHS.find((p) => fs.existsSync(p));
const browser = await chromium.launch({ executablePath, headless: true, args: ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 375, height: 700 } });
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(500);
await page.screenshot({ path: out, timeout: 15000 });
await browser.close();
console.log(`OK -> ${out}`);
