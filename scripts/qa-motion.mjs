// Motion QA (Stage 3.5 A). Usage: npm run build && npm run qa:motion   -> qa/stage3-5a/
// Uses Playwright's fake clock so frames are taken at exact times of the intro (rAF and timers only advance when told).
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const DIST = path.resolve('dist'); const OUT = path.resolve(process.env.QA_OUT || 'qa/stage3-5a');
await mkdir(OUT, { recursive: true });
const CSP = (await readFile('public/_headers', 'utf8')).match(/Content-Security-Policy: (.*)/)[1]; // serve with the production CSP
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  try { const b = await readFile(path.join(DIST, p)); res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream', 'content-security-policy': CSP }); res.end(b); }
  catch { res.writeHead(404); res.end('nf'); }
}).listen(4398);
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
const DESK = { viewport: { width: 1440, height: 900 } };
const MOB = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const log = (...a) => console.log(...a);

async function open(opts, url, { clock = true, ...ctx } = {}) {
  const c = await browser.newContext({ ...opts, ...ctx });
  const page = await c.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(String(e))); page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  if (clock) { await page.clock.install({ time: new Date('2026-11-08T10:00:00') }); await page.clock.pauseAt(new Date('2026-11-08T10:00:00.050')); }
  await page.goto(`http://localhost:4398${url}`, { waitUntil: 'load' });
  return { c, page, errors };
}
// The intro starts when fonts are ready (or a 700ms cap); advance in small steps until the module has started it.
async function toIntroStart(page) {
  for (let i = 0; i < 60; i++) {
    if (await page.evaluate(() => !document.documentElement.classList.contains('motion-intro'))) return;
    await page.clock.runFor(16);
  }
}

async function heroFrames(prefix, opts, url) {
  const { c, page, errors } = await open(opts, url);
  await toIntroStart(page);
  const times = [0, 300, 600, 1000, 1600]; let t = 0;
  for (const at of times) { await page.clock.runFor(at - t); t = at; await page.screenshot({ path: `${OUT}/${prefix}-intro-${String(at).padStart(4, '0')}ms.png` }); }
  const state = await page.evaluate(() => ({
    split: !!document.querySelector('.hero__title .g-line'),
    h1h: +document.querySelector('.hero__title').getBoundingClientRect().height.toFixed(1), rowTop: +document.querySelector('.hero__row').getBoundingClientRect().top.toFixed(1), titleTop: +document.querySelector('.hero__title').getBoundingClientRect().top.toFixed(1),
    headerOpacity: getComputedStyle(document.querySelector('[data-header]')).opacity,
  }));
  await page.clock.runFor(1000);
  const h1After = await page.evaluate(() => ({ split: !!document.querySelector('.hero__title .g-line'), h1h: +document.querySelector('.hero__title').getBoundingClientRect().height.toFixed(1), rowTop: +document.querySelector('.hero__row').getBoundingClientRect().top.toFixed(1), titleTop: +document.querySelector('.hero__title').getBoundingClientRect().top.toFixed(1) }));
  log(prefix, 'after 2.6s', JSON.stringify(h1After));
  log(prefix, 'after 1.6s', JSON.stringify(state), errors.length ? errors : 'no errors');
  await c.close();
}

async function headingMid(name, opts, url, sel, at = 380) {
  // Real time here (ScrollTrigger + scroll events are more faithful without the fake clock): wait for the intro, scroll, catch the split, shoot mid-rise.
  const { c, page, errors } = await open(opts, url, { clock: false });
  await page.waitForTimeout(2200);
  await page.evaluate((s) => { const el = document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.45); }, sel);
  await page.waitForFunction((s) => document.querySelector(s).querySelector('.g-line, .g-word'), sel, { timeout: 3000, polling: 'raf' }).catch(() => {});
  const during = await page.evaluate((s) => { const el = document.querySelector(s); return { h: +el.getBoundingClientRect().height.toFixed(1), lines: el.querySelectorAll('.g-line').length, words: el.querySelectorAll('.g-word').length, ariaLabel: el.getAttribute('aria-label') }; }, sel);
  await page.waitForTimeout(at);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  await page.waitForTimeout(2200);
  const after = await page.evaluate((s) => { const el = document.querySelector(s); return { h: +el.getBoundingClientRect().height.toFixed(1), reverted: !el.querySelector('.g-line, .g-word'), ariaLabel: el.getAttribute('aria-label'), opacity: getComputedStyle(el).opacity }; }, sel);
  await page.screenshot({ path: `${OUT}/${name}-settled.png` });
  log(name, 'during', JSON.stringify(during), 'after', JSON.stringify(after), errors.length ? errors : 'no errors');
  await c.close();
}

// Scroll the whole page (real time) and confirm nothing is left hidden.
async function allVisible(name, opts, url, ctx = {}) {
  const { c, page, errors } = await open(opts, url, { clock: false, ...ctx });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } });
  await page.waitForTimeout(1800);
  const hidden = await page.evaluate(() => [...document.querySelectorAll('main *')].filter((e) => e.offsetParent && parseFloat(getComputedStyle(e).opacity) < 0.99 && !e.closest('.hero, .client__color, .client__cap')).map((e) => e.className || e.tagName).slice(0, 10));
  const cls = await page.evaluate(() => document.documentElement.className);
  log(name, 'html.class=', cls, 'hidden(<0.99, outside hero):', JSON.stringify(hidden), errors.length ? errors : 'no errors');
  await c.close();
}

async function still(name, opts, url, ctx) {
  const { c, page, errors } = await open(opts, url, { clock: false, ...ctx });
  await page.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; }));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  const hidden = await page.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => e.offsetParent && getComputedStyle(e).opacity === '0' && !e.closest('.sheet,.scrim,.hero__video,.client__color,.client__cap,.launcher,.header__logo')).map((e) => e.className || e.tagName).slice(0, 10));
  log(name, 'opacity:0 elements:', JSON.stringify(hidden), errors.length ? errors : 'no errors');
  await c.close();
}

const only = process.argv[2];
const run = (k, f) => (!only || k.includes(only)) && f();
await run('hero-en', () => heroFrames('en-desktop', DESK, '/en/'));
await run('hero-ar', () => heroFrames('ar-mobile', MOB, '/ar/'));
await run('heading-en', () => headingMid('en-heading-mid', DESK, '/en/', '#work-title', 90));
await run('heading-ar', () => headingMid('ar-heading-mid', DESK, '/ar/', '#work-title', 90));
await run('statement-ar', () => headingMid('ar-statement-mid', MOB, '/ar/', '.statement', 120));
await run('visible', () => allVisible('en-desktop-scrolled', DESK, '/en/'));
await run('visible', () => allVisible('ar-mobile-scrolled', MOB, '/ar/'));
await run('reduced', () => still('en-reduced-motion', DESK, '/en/', { reducedMotion: 'reduce' }));
await run('reduced', () => still('ar-reduced-motion-mobile', MOB, '/ar/', { reducedMotion: 'reduce' }));
await run('nojs', () => still('en-no-js', DESK, '/en/', { javaScriptEnabled: false }));
await run('nojs', () => still('ar-no-js-mobile', MOB, '/ar/', { javaScriptEnabled: false }));
await browser.close(); server.close();
