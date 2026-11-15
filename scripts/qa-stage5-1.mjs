// Stage 5-1 QA: packages page. Usage: npm run build && node scripts/qa-stage5-1.mjs [shots|frames|checks|all]
// Serves dist/ with the production CSP (public/_headers). Output: qa/stage5-1/. ?entry=off skips the gate entry.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const DIST = path.resolve('dist'); const OUT = path.resolve('qa/stage5-1');
await mkdir(OUT, { recursive: true });
const CSP = (await readFile('public/_headers', 'utf8')).match(/Content-Security-Policy: (.*)/)[1];
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.xml': 'application/xml' };
const PORT = 4399;
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (p.endsWith('/')) p += 'index.html';
  try { const b = await readFile(path.join(DIST, p)); res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream', 'content-security-policy': CSP }); res.end(b); }
  catch { res.writeHead(404); res.end('nf'); }
}).listen(PORT);
const base = `http://localhost:${PORT}`;
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const vp = (w, h = 900) => (w <= 430 ? { viewport: { width: w, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 } : { viewport: { width: w, height: h } });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const which = process.argv[2] || 'all';
const errors = []; const report = [];
const url = (lang) => `/${lang}/packages/?entry=off`;

async function open(opts, u, ctx = {}) {
  const c = await browser.newContext({ ...opts, ...ctx }); const page = await c.newPage();
  page.on('pageerror', (e) => errors.push(`${u}: ${e}`));
  page.on('console', (m) => (m.type() === 'error' || /Content Security Policy/i.test(m.text())) && errors.push(`${u}: ${m.text()}`));
  await page.goto(base + u, { waitUntil: 'load' });
  return { c, page };
}
const to = (page, y) => page.evaluate((y) => window.scrollTo(0, y), y);
const topOf = (page, sel) => page.evaluate((s) => { const el = document.querySelector(s); return el ? el.getBoundingClientRect().top + window.scrollY : null; }, sel);
async function walk(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 450) { await to(page, y); await wait(160); }
  await to(page, h); await wait(1600); await to(page, 0); await wait(1000);
}

if (which === 'all' || which === 'shots') {
  for (const lang of ['en', 'ar']) for (const w of [1440, 390]) {
    const { c, page } = await open(vp(w), url(lang)); await wait(2200); await walk(page);
    await page.screenshot({ path: `${OUT}/${lang}-${w}-full.png`, fullPage: true });
    await page.screenshot({ path: `${OUT}/${lang}-${w}-hero.png` });
    const y = await topOf(page, '#compare'); await to(page, y - 80); await wait(500);
    await page.screenshot({ path: `${OUT}/${lang}-${w}-compare.png` });
    if (w === 390) { // table scrolled sideways: sticky first column still in place
      await page.evaluate(() => { const s = document.querySelector('.cmp-scroll'); s.scrollLeft = document.dir === 'rtl' ? -260 : 260; }); await wait(300);
      await page.screenshot({ path: `${OUT}/${lang}-390-compare-scrolled.png` });
    }
    await c.close();
  }
}

if (which === 'all' || which === 'frames') {
  // frame strips of the two new motions (5 frames each), EN 1440 + AR 1440, and the mobile card lift
  for (const [lang, w] of [['en', 1440], ['ar', 1440], ['en', 390]]) {
    for (const [name, sel, off, times] of [['cards', '[data-pk-cards]', 0.55, [0, 250, 500, 800, 1400]], ['compare', '[data-cmp]', 0.3, [0, 250, 550, 850, 1400]]]) {
      const { c, page } = await open(vp(w), url(lang)); await wait(1800);
      const y = await topOf(page, sel); const vh = vp(w).viewport.height;
      await to(page, Math.max(0, y - vh * off));
      let last = 0;
      for (const [k, t] of times.entries()) { await wait(t - last); last = t; await page.screenshot({ path: `${OUT}/motion-${name}-${lang}-${w}-${k + 1}.png` }); }
      await c.close();
    }
  }
}

if (which === 'all' || which === 'checks') {
  for (const lang of ['en', 'ar']) {
    // horizontal overflow at every width (the table scroller is the only deliberate scroll area)
    for (const w of [1440, 1280, 1024, 768, 390]) {
      const { c, page } = await open(vp(w), url(lang)); await wait(1500); await walk(page);
      const r = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth; const bad = [];
        document.querySelectorAll('main *, footer *').forEach((el) => {
          if (el.closest('.cmp-scroll')) return;
          const b = el.getBoundingClientRect(); if (b.width && (b.right > vw + 1 || b.left < -1)) bad.push(`${el.tagName}.${el.className}`.slice(0, 60));
        });
        const sc = document.querySelector('.cmp-scroll');
        return { doc: document.documentElement.scrollWidth - vw, bad: [...new Set(bad)].slice(0, 6), table: sc.scrollWidth - sc.clientWidth };
      });
      report.push(`${lang} ${w}: page overflow ${r.doc}px · table scroll ${r.table}px${r.bad.length ? ' · outside: ' + r.bad.join(', ') : ''}`);
      await c.close();
    }
    const { c, page } = await open(vp(1440), url(lang)); await wait(1500);
    const facts = await page.evaluate(() => {
      const prices = [...document.querySelectorAll('.pk-card__foot')].map((f) => !!f.querySelector('.sample-mark'));
      return {
        h1: document.querySelectorAll('h1').length,
        cardsWithSampleTag: `${prices.filter(Boolean).length}/${prices.length}`,
        tablePriceTag: !!document.querySelector('.cmp__price-h .sample-mark'), tableTag: !!document.querySelector('.cmp__corner .sample-mark'),
        faqSampleTags: document.querySelectorAll('.faq .sample-mark').length,
        navPackages: [...document.querySelectorAll('.header__nav a')].find((a) => a.getAttribute('aria-current') === 'page')?.getAttribute('href'),
        footerPackages: [...document.querySelectorAll('.footer a')].some((a) => /\/packages\/$/.test(a.getAttribute('href'))),
        marks: document.querySelectorAll('.cmp__mark').length, hiddenTexts: document.querySelectorAll('.cmp .visually-hidden').length,
      };
    });
    report.push(`${lang} facts: ${JSON.stringify(facts)}`);
    // keyboard: tab through the page and record where focus goes (cards, table, FAQ)
    await to(page, 0); await page.keyboard.press('Tab');
    const seen = []; for (let i = 0; i < 70; i++) { await page.keyboard.press('Tab'); seen.push(await page.evaluate(() => { const a = document.activeElement; const sec = a.closest('section, header, footer, aside'); return `${sec ? (sec.className.split(' ')[0] || sec.tagName) : a.tagName}:${a.tagName}`; })); }
    const counts = seen.reduce((m, s) => ((m[s] = (m[s] || 0) + 1), m), {});
    report.push(`${lang} keyboard (70 tabs): ${JSON.stringify(counts)}`);
    // card CTA -> proposal sheet preset to the package and service
    await page.locator('.pk-card').nth(2).locator('[data-open-drawer]').click(); await wait(700);
    const sheet = await page.evaluate(() => ({ open: document.querySelector('#proposal-drawer').classList.contains('is-open'), pkg: document.querySelector('[data-package-name]').textContent, note: !document.querySelector('[data-package-note]').hidden, service: document.querySelector('[data-service-select]').value }));
    report.push(`${lang} card CTA sheet: ${JSON.stringify(sheet)}`);
    await page.keyboard.press('Escape'); await wait(500);
    // FAQ keyboard: focus first question, Enter opens it
    await page.focus('#pfaq-q0'); await page.keyboard.press('Enter'); await wait(400);
    report.push(`${lang} faq enter: ${await page.getAttribute('#pfaq-q0', 'aria-expanded')}`);
    // Ask Gate from the "not sure" block (packages chip)
    await page.locator('.ask-block [data-ask-intent="packages"]').click(); await wait(2500);
    report.push(`${lang} ask gate: ${await page.evaluate(() => { const r = document.querySelector('[data-ag]'); return r ? `${r.className.slice(0, 60)} · msgs ${document.querySelectorAll('.ag-msg, .ag-att').length}` : 'none'; })}`);
    await c.close();
    // reduced motion + no JS: everything visible
    for (const [label, ctx] of [['reduced', { reducedMotion: 'reduce' }], ['nojs', { javaScriptEnabled: false }]]) {
      const o = await open(vp(1440), url(lang), ctx); await wait(800);
      const hid = await o.page.evaluate(() => [...document.querySelectorAll('.pk-card, .cmp__mark, .faq__a p, .ask-block, h1')].filter((e) => { const s = getComputedStyle(e); return s.opacity === '0' || s.visibility === 'hidden'; }).length);
      report.push(`${lang} ${label}: hidden elements ${hid}`);
      if (lang === 'en' && label === 'nojs') await o.page.screenshot({ path: `${OUT}/en-1440-nojs.png`, fullPage: true });
      await o.c.close();
    }
  }
  // Home still shows its packages section; nav link points to the new page
  const h = await open(vp(1440), '/en/?entry=off'); await wait(800);
  report.push(`home: ${JSON.stringify(await h.page.evaluate(() => ({ pkgs: document.querySelectorAll('#packages .pkg').length, nav: [...document.querySelectorAll('.header__nav a')].map((a) => a.getAttribute('href')).find((x) => x.includes('packages')) })))}`);
  await h.c.close();
}

report.push(`errors: ${errors.length ? errors.join(' | ') : 'none'}`);
await writeFile(`${OUT}/report.txt`, report.join('\n') + '\n');
console.log(report.join('\n'));
await browser.close(); server.close();
