// Lenis checks (desktop): nav anchor lands under the header, hash kept; wheel is paused while a sheet is open; keyboard scroll works; header turns solid.
import { chromium } from 'playwright';
import { createServer } from 'node:http'; import { readFile } from 'node:fs/promises'; import path from 'node:path';
const DIST = path.resolve('dist');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.mp4': 'video/mp4' };
const srv = createServer(async (q, r) => { let p = q.url.split('?')[0]; if (p.endsWith('/')) p += 'index.html'; try { const b = await readFile(path.join(DIST, p)); r.writeHead(200, { 'content-type': T[path.extname(p)] || 'application/octet-stream' }); r.end(b); } catch { r.writeHead(404); r.end(); } }).listen(4396);
const b = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
for (const lang of ['en', 'ar']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto(`http://localhost:4396/${lang}/`, { waitUntil: 'load' }); await p.waitForTimeout(2000);
  const lenis = await p.evaluate(() => document.documentElement.classList.contains('lenis'));
  await p.click('.header__nav a[href="#work"]'); await p.waitForTimeout(1800);
  const anchor = await p.evaluate(() => ({ hash: location.hash, top: Math.round(document.getElementById('work').getBoundingClientRect().top), solid: document.querySelector('[data-header]').classList.contains('is-solid') }));
  await p.click('.header .ask-btn'); await p.waitForTimeout(600);
  const y0 = await p.evaluate(() => scrollY); await p.mouse.move(300, 500); await p.mouse.wheel(0, 900); await p.waitForTimeout(900);
  const yLocked = await p.evaluate(() => scrollY);
  await p.keyboard.press('Escape'); await p.waitForTimeout(600);
  await p.mouse.wheel(0, 900); await p.waitForTimeout(1200); const yWheel = await p.evaluate(() => scrollY);
  await p.keyboard.press('PageDown'); await p.waitForTimeout(1000); const yKey = await p.evaluate(() => scrollY);
  console.log(lang, JSON.stringify({ lenis, anchor, wheelWhileSheetOpen: yLocked - y0, wheelAfterClose: yWheel - yLocked, pageDown: yKey - yWheel }), errs.length ? errs : 'no errors');
  await p.close();
}
await b.close(); srv.close();
