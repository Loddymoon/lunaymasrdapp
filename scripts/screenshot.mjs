// Captura screenshots reales a 375px usando el Chrome YA INSTALADO en el sistema
// (playwright-core, sin descargar binarios de navegador — la descarga completa de
// Playwright estaba bloqueada por la red de esta sesion).
// --disable-gpu es OBLIGATORIO: sin el, page.screenshot() se cuelga en Windows headless.
// Uso: node scripts/screenshot.mjs <url> <archivo-salida.png>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const [, , url, out] = process.argv;
if (!url || !out) {
  console.error('Uso: node scripts/screenshot.mjs <url> <salida.png>');
  process.exit(1);
}

const CHROME_PATHS = [
  path.join('C:', 'Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  path.join('C:', 'Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  path.join('C:', 'Program Files (x86)', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
];
const executablePath = CHROME_PATHS.find((p) => fs.existsSync(p));
if (!executablePath) {
  console.error('No se encontro Chrome ni Edge instalado en el sistema. Rutas probadas: ' + CHROME_PATHS.join(' | '));
  process.exit(1);
}

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 375, height: 900 } });
// NOTA: se probó emular prefers-reduced-motion para saltar animaciones de
// entrada, pero useReducedMotion() de Motion resuelve async — en pantallas que
// condicionan initial/animate por completo (spread de props vacío si
// reduceMotion), el remount a mitad de la transición puede dejar el elemento
// atascado en opacity:0. Más robusto: dejar las animaciones correr normales y
// esperar lo suficiente para que terminen (stagger + duración más larga de la
// app son bien menos de 1.5s).
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(600);
const altoReal = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
await page.setViewportSize({ width: 375, height: Math.min(altoReal, 12000) });
await page.waitForTimeout(1500);
await page.screenshot({ path: out, animations: 'disabled', timeout: 15000 });
await browser.close();
console.log(`OK -> ${out} (alto ${altoReal}px)`);
