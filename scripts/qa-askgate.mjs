// Ask Gate QA (Stage 3.6). Usage: npm run build && node scripts/qa-askgate.mjs -> qa/stage3-6/
// Served with the production CSP. EN + AR desktop and mobile: launcher states, teaser, opening frames, greeting, chip reply,
// typed reply, reduced motion, keyboard (Tab / Esc) check.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const DIST = path.resolve('dist'); const OUT = path.resolve('qa/stage3-6');
await mkdir(OUT, { recursive: true });
const CSP = (await readFile('public/_headers', 'utf8')).match(/Content-Security-Policy: (.*)/)[1];
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  try { const b = await readFile(path.join(DIST, p)); res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream', 'content-security-policy': CSP }); res.end(b); }
  catch { res.writeHead(404); res.end('nf'); }
}).listen(4398);
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const DESK = { viewport: { width: 1440, height: 900 } };
const MOB = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const Q = { en: 'Do you design logos for restaurants?', ar: 'هل تصممون شعارات للمطاعم؟' };
const Q2 = { en: 'Can you help with my visa?', ar: 'هل يمكنكم مساعدتي في التأشيرة؟' };

async function run(lang, kind, ctx = {}) {
  const c = await browser.newContext({ ...(kind === 'mob' ? MOB : DESK), ...ctx }); const page = await c.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(String(e))); page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(`http://localhost:4398/${lang}/`, { waitUntil: 'load' }); await wait(1800);
  const tag = `${lang}-${kind}${ctx.reducedMotion ? '-rm' : ''}`;
  const shot = (n) => page.screenshot({ path: `${OUT}/${tag}-${n}.png` });
  const state = () => page.evaluate(() => { const l = document.querySelector('[data-ag-launcher]'); const r = l.getBoundingClientRect(); return { in: l.classList.contains('is-in'), x: Math.round(r.right), y: Math.round(r.bottom), vw: innerWidth }; });
  const log = [];
  await shot('1-top'); log.push(['top', await state()]);
  const hh = await page.evaluate(() => document.querySelector('[data-hero]').offsetHeight);
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(hh * 0.55)); await wait(1500);
  await shot('2-emerged-teaser'); log.push(['emerged', await state()]);
  await page.evaluate(() => window.scrollTo(0, 0)); await wait(700); log.push(['back-top', await state()]);
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(hh * 0.6)); await wait(900);
  await page.click('[data-ag-launcher]');
  if (!ctx.reducedMotion) { await wait(110); await shot('3-open-a'); await wait(130); await shot('3-open-b'); await wait(170); await shot('3-open-c'); }
  await wait(650); await shot('4-greeting-typing');
  await wait(1800); await shot('5-greeting-done');
  const focus1 = await page.evaluate(() => document.activeElement && (document.activeElement.id || document.activeElement.className));
  await page.click('.ag-chip[data-intent="packages"]'); await wait(ctx.reducedMotion ? 400 : 700); await shot('6-chip-typing');
  await wait(3200); await shot('7-chip-reply-package');
  await page.fill('#ag-q', Q[lang]); await shot('8-typed');
  await page.keyboard.press('Enter'); await wait(4200); await shot('9-typed-reply');
  await page.click('.ag-chip[data-intent="work"]'); await wait(4200); await shot('10-work-reply');
  await page.fill('#ag-q', Q2[lang]); await page.keyboard.press('Enter'); await wait(4200); await shot('11-fallback');
  // keyboard: Tab cycles inside, Esc closes and returns focus to the launcher
  const tabs = []; for (let i = 0; i < 30; i++) { await page.keyboard.press('Tab'); tabs.push(await page.evaluate(() => !!document.activeElement.closest('[data-ag]'))); }
  await page.keyboard.press('Escape'); await wait(ctx.reducedMotion ? 100 : 160); if (!ctx.reducedMotion) await shot('12-closing');
  await wait(700); await shot('13-closed');
  const after = await page.evaluate(() => ({ focus: document.activeElement.className, hidden: document.querySelector('[data-ag-panel]').hidden, inert: document.querySelectorAll('[inert]').length }));
  // header Ask Gate button opens the same window (desktop) / services card opens with the package intent
  let hdr = null;
  if (kind === 'desk') { await page.evaluate(() => window.scrollTo(0, 0)); await wait(600); await page.click('.header .ask-btn'); await wait(1400); await shot('14-from-header'); hdr = await page.evaluate(() => !document.querySelector('[data-ag-panel]').hidden); }
  console.log(tag, JSON.stringify({ log, focus1, trapped: tabs.every(Boolean), after, hdr }), errors.length ? errors : 'no errors');
  await c.close();
}
for (const lang of ['en', 'ar']) {
  await run(lang, 'desk');
  await run(lang, 'mob');
}
await run('en', 'desk', { reducedMotion: 'reduce' });
await run('ar', 'mob', { reducedMotion: 'reduce' });
await browser.close(); server.close();
