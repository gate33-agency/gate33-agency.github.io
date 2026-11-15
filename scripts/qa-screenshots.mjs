// Headless screenshots for visual QA. Usage: npm run build && npm run qa   (OUT dir: qa/stage3)
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const DIST = path.resolve('dist'); const OUT = path.resolve(process.env.QA_OUT || 'qa/stage3');
await mkdir(OUT, { recursive: true });
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  try { const b = await readFile(path.join(DIST, p)); res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream', 'accept-ranges': 'none' }); res.end(b); }
  catch { res.writeHead(404); res.end('nf'); }
}).listen(4399);
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
const only = process.argv[2];
async function shot(name, url, w, h, { full = true, hover, hero, reduced, scrollTo } = {}) {
  if (only && !name.includes(only)) return;
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const errors = []; page.on('console', (m) => m.type() === 'error' && errors.push(m.text())); page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`http://localhost:4399${url}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  if (hero) {
    await page.waitForTimeout(3200);
    const state = await page.evaluate(() => { const v = document.querySelector('[data-hero-video]'); return v ? { paused: v.paused, t: +v.currentTime.toFixed(2), src: v.currentSrc.split('/').pop(), ready: v.classList.contains('is-ready') } : null; });
    console.log(name, 'video', JSON.stringify(state));
  } else {
    await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-visible')));
    await page.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; }));
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } window.scrollTo(0, 0); });
    await page.waitForLoadState('networkidle'); await page.waitForTimeout(700);
  }
  if (scrollTo) { await page.evaluate((sel) => { const el = document.querySelector(sel); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 260); }, scrollTo); await page.waitForTimeout(600); }
  if (hover) { await page.hover(hover); await page.waitForTimeout(450); }
  const opts = { path: `${OUT}/${name}.png`, fullPage: full };
  await page.screenshot(opts);
  console.log(name, errors.length ? errors : 'ok');
  await page.close();
}
await shot('en-desktop-1440', '/en/', 1440, 900);
await shot('en-mobile-390', '/en/', 390, 844);
await shot('ar-desktop-1440', '/ar/', 1440, 900);
await shot('ar-mobile-390', '/ar/', 390, 844);
await shot('en-hero-video-desktop', '/en/', 1440, 900, { full: false, hero: true });
await shot('en-hero-video-mobile', '/en/', 390, 844, { full: false, hero: true });
await shot('ar-hero-video-desktop', '/ar/', 1440, 900, { full: false, hero: true });
await shot('en-hero-reduced-motion', '/en/', 1440, 900, { full: false, hero: true, reduced: true });
await shot('en-clients-hover', '/en/', 1440, 900, { full: false, scrollTo: '.clients', hover: '.client:nth-child(2) .client__in' });
await shot('ar-clients-hover', '/ar/', 1440, 900, { full: false, scrollTo: '.clients', hover: '.client:nth-child(3) .client__in' });
await browser.close(); server.close();
