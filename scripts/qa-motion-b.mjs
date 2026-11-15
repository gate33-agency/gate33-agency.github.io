// Motion QA (Stage 3.5 B, section map). Usage: npm run build && node scripts/qa-motion-b.mjs  -> qa/stage3-5b/
// Real time (scrubs + ScrollTrigger); served with the production CSP. Frames per section for EN + AR desktop, mobile full pages,
// reduced motion and no-JS full pages.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const DIST = path.resolve('dist'); const OUT = path.resolve(process.env.QA_OUT || 'qa/stage3-5b');
await mkdir(OUT, { recursive: true });
const CSP = (await readFile('public/_headers', 'utf8')).match(/Content-Security-Policy: (.*)/)[1];
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  try { const b = await readFile(path.join(DIST, p)); res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream', 'content-security-policy': CSP }); res.end(b); }
  catch { res.writeHead(404); res.end('nf'); }
}).listen(4399);
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const DESK = { viewport: { width: 1440, height: 900 } };
const MOB = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const only = process.argv[2]; // optional: run one group (desk|mob|rm|nojs)

async function open(opts, url, ctx = {}) {
  const c = await browser.newContext({ ...opts, ...ctx }); const page = await c.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(String(e))); page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(`http://localhost:4399${url}`, { waitUntil: 'load' }); await wait(2200);
  return { c, page, errors };
}
const to = (page, y) => page.evaluate((y) => window.scrollTo(0, y), y);
// y of an element's top in document space, as the layout is now (pin spacer included)
const topOf = (page, sel) => page.evaluate((s) => { const el = document.querySelector(s); const sp = el.closest('.pin-spacer') || el; return sp.getBoundingClientRect().top + window.scrollY; }, sel);

async function desk(lang) {
  const { c, page, errors } = await open(DESK, `/${lang}/`);
  const vh = 900; const shots = [];
  const shot = async (name, y, ms = 1100) => { await to(page, y); await wait(ms); await page.screenshot({ path: `${OUT}/${lang}-desk-${name}.png` }); shots.push(name); };
  await shot('1-gate-a', 0, 300); await shot('1-gate-b', vh * 0.4); await shot('1-gate-c', vh * 0.8);
  const st = await topOf(page, '.statement');
  await shot('2-fill-a', st - vh * 0.62); await shot('2-fill-b', st - vh * 0.42);
  const cl = await topOf(page, '[data-clients]');
  await shot('3-clients-wave', cl - vh * 0.6, 750);
  const ws = await topOf(page, '.work-sec');
  const D = await page.evaluate(() => { const sp = document.querySelector('.work-sec').closest('.pin-spacer'); return sp ? sp.offsetHeight - window.innerHeight : 0; });
  await shot('4-work-a', ws + D * 0.18, 1400); await shot('4-work-b', ws + D * 0.5, 1400); await shot('4-work-c', ws + D * 0.9, 1400);
  const sv = await topOf(page, '.services-sec');
  await shot('5-services-a', sv - vh * 0.6); await shot('5-services-b', sv - vh * 0.25);
  const pk = await topOf(page, '[data-pkgs]');
  await to(page, pk - vh * 0.85); await wait(600);
  await shot('6-pkgs-a', pk - vh * 0.6, 450); await shot('6-pkgs-b', pk - vh * 0.6, 1400);
  const pr = await topOf(page, '[data-steps]');
  await shot('7-process-a', pr - vh * 0.68); await shot('7-process-b', pr - vh * 0.45);
  const ct = await topOf(page, '.cta-sec');
  await shot('8-cta-a', ct - vh * 0.45); await shot('8-cta-b', ct - vh * 0.3);
  const info = await page.evaluate(() => ({ overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth, pinD: (document.querySelector('.pin-spacer') || {}).offsetHeight }));
  console.log(lang, 'desk', JSON.stringify(info), errors.length ? errors : 'no errors');
  await c.close();
}
async function full(name, opts, url, ctx = {}, sweep = true) {
  const { c, page, errors } = await open(opts, url, ctx);
  if (sweep) { const h = await page.evaluate(() => document.documentElement.scrollHeight); for (let y = 0; y < h; y += 400) { await to(page, y); await wait(120); } await wait(1500); await to(page, 0); await wait(800); }
  const info = await page.evaluate(() => ({ overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    hidden: [...document.querySelectorAll('main *')].filter((e) => e.getBoundingClientRect().height > 0 && getComputedStyle(e).opacity === '0' && !e.closest('.client__cap, .client__color, .work__cyc, .hero__ico-play')).length,
    pinned: !!document.querySelector('.pin-spacer'), gate: getComputedStyle(document.querySelector('.hero__gate')).display, clip: getComputedStyle(document.querySelector('.hero__media')).clipPath }));
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log(name, JSON.stringify(info), errors.length ? errors : 'no errors');
  await c.close();
}
// Mobile viewport frames (full-page captures resize the viewport, so scrubbed states there show the top-of-page values)
async function mobFrames(lang) {
  const { c, page, errors } = await open(MOB, `/${lang}/`); const vh = 844;
  for (const [n, sel, k] of [['statement', '.statement', 0.5], ['work', '.work-sec .works', 0.4], ['services', '.services-sec', 0.2], ['cta', '.cta-sec', 0.55]]) {
    const y = await topOf(page, sel); await to(page, y - vh * k); await wait(1300); await page.screenshot({ path: `${OUT}/${lang}-mobile-${n}.png` });
  }
  console.log(lang, 'mobile frames', errors.length ? errors : 'no errors'); await c.close();
}
for (const lang of ['en', 'ar']) {
  if (!only || only === 'mob') await mobFrames(lang);
  if (!only || only === 'desk') await desk(lang);
  if (!only || only === 'mob') await full(`${lang}-mobile-full`, MOB, `/${lang}/`);
  if (!only || only === 'rm') await full(`${lang}-reduced-motion`, DESK, `/${lang}/`, { reducedMotion: 'reduce' }, false);
  if (!only || only === 'nojs') await full(`${lang}-no-js`, DESK, `/${lang}/`, { javaScriptEnabled: false }, false);
}
await browser.close(); server.close();
