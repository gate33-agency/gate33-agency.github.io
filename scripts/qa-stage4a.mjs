// Stage 4A QA: services index + service pages. Usage: npm run build && node scripts/qa-stage4a.mjs [shots|heroes|links|rm|all]
// Serves dist/ with the production CSP (public/_headers). Output: qa/stage4a/.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
const DIST = path.resolve('dist'); const OUT = path.resolve(process.env.QA_OUT || 'qa/stage4a');
await mkdir(OUT, { recursive: true });
const CSP = (await readFile('public/_headers', 'utf8')).match(/Content-Security-Policy: (.*)/)[1];
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.jpg': 'image/jpeg' };
const PORT = 4398;
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  try { const b = await readFile(path.join(DIST, p)); res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream', 'content-security-policy': CSP }); res.end(b); }
  catch { res.writeHead(404); res.end('nf'); }
}).listen(PORT);
const base = `http://localhost:${PORT}`;
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const DESK = { viewport: { width: 1440, height: 900 } };
const MOB = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const which = process.argv[2] || 'all';
const SLUGS = ['ai-search-visibility', 'branding-creative-design', 'creative-production', 'web-apps-business-systems', 'digital-marketing-growth', 'product-development-sourcing', 'events-brand-experiences'];
const errors = [];

async function open(opts, url, ctx = {}) {
  const c = await browser.newContext({ ...opts, ...ctx }); const page = await c.newPage();
  page.on('pageerror', (e) => errors.push(`${url}: ${e}`)); page.on('console', (m) => m.type() === 'error' && errors.push(`${url}: ${m.text()}`));
  await page.goto(base + url, { waitUntil: 'load' });
  return { c, page };
}
const to = (page, y) => page.evaluate((y) => window.scrollTo(0, y), y);
const topOf = (page, sel) => page.evaluate((s) => { const el = document.querySelector(s); return el ? el.getBoundingClientRect().top + window.scrollY : null; }, sel);
// scroll through the page so every once-only reveal has played, then back to the top for the full-page capture
async function walk(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) { await to(page, y); await wait(140); }
  await to(page, h); await wait(1600); await to(page, 0); await wait(900);
}

async function pageShots(name, url, opts, tag, frames) {
  const { c, page } = await open(opts, url);
  await wait(250); await page.screenshot({ path: `${OUT}/${name}-${tag}-0-hero-mid.png` });
  await wait(1800); await page.screenshot({ path: `${OUT}/${name}-${tag}-1-hero.png` });
  const vh = opts.viewport.height;
  for (const [label, sel, ms] of frames) {
    const y = await topOf(page, sel); if (y == null) continue;
    await to(page, Math.max(0, y - vh * 0.25)); await wait(ms);
    await page.screenshot({ path: `${OUT}/${name}-${tag}-${label}.png` });
  }
  await c.close();
  const f = await open(opts, url); await wait(2200); await walk(f.page);
  await f.page.screenshot({ path: `${OUT}/${name}-${tag}-full.png`, fullPage: true }); await f.c.close();
}

const IDX_FRAMES = [['2-rows-mid', '[data-srows]', 450], ['3-rows', '[data-srows]', 1600], ['4-ask-mid', '[data-ask-block]', 500], ['5-ask', '[data-ask-block]', 1600], ['6-packages', '.pteaser', 1900], ['7-cta', '.cta-sec', 1400]];
const SVC_FRAMES = [['2-scope-mid', '[data-scope]', 450], ['3-scope', '[data-scope]', 1500], ['4-process', '[data-stack]', 1200], ['5-work', '[data-drift]', 1200], ['6-offer', '.offer-sec', 1900], ['7-quote', '.quote', 1500], ['8-faq', '[data-faq]', 1500], ['9-cta', '.cta-sec', 1400]];

if (which === 'all' || which === 'shots') {
  for (const lang of ['en', 'ar']) {
    await pageShots(`index-${lang}`, `/${lang}/services/`, DESK, 'desk', IDX_FRAMES);
    await pageShots(`index-${lang}`, `/${lang}/services/`, MOB, 'mob', IDX_FRAMES.filter(([l]) => !l.includes('mid')));
    for (const slug of ['branding-creative-design', 'creative-production']) {
      const short = slug.split('-')[0];
      await pageShots(`${short}-${lang}`, `/${lang}/services/${slug}/`, DESK, 'desk', SVC_FRAMES);
      await pageShots(`${short}-${lang}`, `/${lang}/services/${slug}/`, MOB, 'mob', SVC_FRAMES.filter(([l]) => !l.includes('mid')));
    }
    // drawer with the pre-selected service + its questions
    const { c, page } = await open(DESK, `/${lang}/services/creative-production/`); await wait(2000);
    await page.click('.page-hero__actions [data-open-drawer]'); await wait(800);
    await page.screenshot({ path: `${OUT}/creative-${lang}-desk-drawer.png` });
    const sel = await page.$eval('[data-service-select]', (s) => s.value); console.log(`drawer ${lang} preselected:`, sel);
    await c.close();
    // FAQ open
    const f = await open(DESK, `/${lang}/services/branding-creative-design/`); await wait(1500);
    const fy = await topOf(f.page, '[data-faq]'); await to(f.page, fy - 200); await wait(1500);
    await f.page.click('[data-faq-btn]'); await wait(700);
    await f.page.screenshot({ path: `${OUT}/branding-${lang}-desk-faq-open.png` });
    await f.c.close();
  }
}

if (which === 'all' || which === 'heroes') {
  for (const lang of ['en', 'ar']) for (const slug of SLUGS.filter((s) => !['branding-creative-design', 'creative-production'].includes(s))) {
    const { c, page } = await open(DESK, `/${lang}/services/${slug}/`); await wait(2300);
    await page.screenshot({ path: `${OUT}/hero-${slug}-${lang}.png` }); await c.close();
  }
}

if (which === 'all' || which === 'links') {
  const urls = ['/en/services/', '/ar/services/', ...['en', 'ar'].flatMap((l) => SLUGS.map((s) => `/${l}/services/${s}/`))];
  const report = []; const pending = new Set(); const broken = new Set();
  const exists = async (p) => { let f = p.split('#')[0]; if (f.endsWith('/')) f += 'index.html'; try { await access(path.join(DIST, f)); return true; } catch { return false; } };
  for (const u of urls) {
    const r = await fetch(base + u); report.push(`${r.status} ${u}`);
    const html = await r.text();
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]).filter((h) => h.startsWith('/') && !h.startsWith('//'));
    for (const h of new Set(hrefs)) {
      if (/^\/(en|ar)\/work\//.test(h)) { pending.add(h); continue; }
      if (/\.(css|svg|woff2|js|webp|png|jpg|mp4)$/.test(h.split('#')[0])) { if (!(await exists(h))) broken.add(`${u} -> ${h}`); continue; }
      if (!(await exists(h))) broken.add(`${u} -> ${h}`);
      const hash = h.split('#')[1];
      if (hash) { const target = await readFile(path.join(DIST, h.split('#')[0], 'index.html'), 'utf8').catch(() => ''); if (!target.includes(`id="${hash}"`)) broken.add(`${u} -> ${h} (no #${hash})`); }
    }
  }
  const txt = ['STATUS', ...report, '', `BROKEN (${broken.size})`, ...broken, '', `PENDING /work/ pages (Stage 4B) (${pending.size})`, ...[...pending].sort()].join('\n');
  await writeFile(`${OUT}/links.txt`, txt); console.log(txt);
}

if (which === 'all' || which === 'rm') {
  const url = '/en/services/branding-creative-design/';
  const a = await open(DESK, url, { reducedMotion: 'reduce' }); await wait(800);
  await a.page.screenshot({ path: `${OUT}/rm-branding-en-full.png`, fullPage: true });
  console.log('reduced motion: motion-on =', await a.page.evaluate(() => document.documentElement.classList.contains('motion-on')));
  await a.c.close();
  const b = await open(DESK, url, { javaScriptEnabled: false }); await wait(500);
  await b.page.screenshot({ path: `${OUT}/nojs-branding-en-full.png`, fullPage: true });
  const hidden = await b.page.evaluate(() => [...document.querySelectorAll('main *')].filter((e) => getComputedStyle(e).opacity === '0' && e.offsetParent).length);
  console.log('no-JS: elements with opacity 0 =', hidden); await b.c.close();
  const r = await open(DESK, '/ar/services/creative-production/', { javaScriptEnabled: false }); await wait(500);
  await r.page.screenshot({ path: `${OUT}/nojs-creative-ar-full.png`, fullPage: true }); await r.c.close();
}

console.log(errors.length ? `\nCONSOLE/PAGE ERRORS (${errors.length}):\n` + errors.join('\n') : '\nNo console or page errors.');
await browser.close(); server.close();
