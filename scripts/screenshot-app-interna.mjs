// Captura las 5 pantallas de la app interna con datos semilla realistas
// (nunca la app vacía — regla 32 del SO): 3 retos completados, racha de 3.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATHS = [path.join('C:', 'Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe')];
const executablePath = CHROME_PATHS.find((p) => fs.existsSync(p));
const browser = await chromium.launch({ executablePath, headless: true, args: ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 375, height: 900 } });

// Primero navega a cualquier página del sitio para poder escribir localStorage
// del origen correcto, luego siembra los datos y navega a cada pantalla real.
await page.goto('http://localhost:3100/app', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const fechaAyer = `${ayer.getFullYear()}-${String(ayer.getMonth() + 1).padStart(2, '0')}-${String(ayer.getDate()).padStart(2, '0')}`;
  const progreso = {
    completados: { a: fechaAyer, e: fechaAyer, i: fechaAyer },
    racha: 3,
    ultimaFecha: fechaAyer,
  };
  localStorage.setItem('hablapronto_progreso', JSON.stringify(progreso));
  sessionStorage.setItem('hablapronto_onboarding', JSON.stringify({ nombre: 'Mateo', edad: '2-3a' }));
});

const pantallas = [
  ['app', 'http://localhost:3100/app'],
  ['app-camino', 'http://localhost:3100/app/camino'],
  ['app-puntuacion', 'http://localhost:3100/app/puntuacion'],
  ['app-perfil', 'http://localhost:3100/app/perfil'],
  ['app-avance', 'http://localhost:3100/app/avance'],
];

for (const [nombre, url] of pantallas) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const out = `docs/revisiones/${nombre}-375.png`;
  await page.screenshot({ path: out });
  console.log(`OK -> ${out}`);
}

await browser.close();
