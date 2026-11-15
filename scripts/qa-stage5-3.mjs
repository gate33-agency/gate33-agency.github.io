// Stage 5-3 QA: About + Contact. Usage: npm run build && node scripts/qa-stage5-3.mjs [shots|frames|checks|all]
// Serves dist/ with the production CSP (public/_headers). Output: qa/stage5-3/. ?entry=off skips the gate entry.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const DIST = path.resolve('dist'); const OUT = path.resolve('qa/stage5-3');
await mkdir(OUT, { recursive: true });
const CSP = (await readFile('public/_headers', 'utf8')).match(/Content-Security-Policy: (.*)/)[1];
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.xml': 'application/xml' };
const PORT = 4401;
const requests = []; // every request the server sees (method + url): proves the form data never leaves the page
const server = createServer(async (req, res) => {
  requests.push(`${req.method} ${req.url}`);
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
const url = (lang, pg) => `/${lang}/${pg}/?entry=off`;

async function open(opts, u, ctx = {}) {
  const c = await browser.newContext({ ...opts, ...ctx }); const page = await c.newPage();
  page.on('pageerror', (e) => errors.push(`${u}: ${e}`));
  page.on('console', (m) => (m.type() === 'error' || /Content Security Policy/i.test(m.text())) && errors.push(`${u}: ${m.text()}`));
  page.on('requestfailed', (r) => errors.push(`${u}: failed ${r.url()}`));
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
  for (const pg of ['about', 'contact']) for (const lang of ['en', 'ar']) for (const w of [1440, 390]) {
    const { c, page } = await open(vp(w), url(lang, pg)); await wait(2200); await walk(page);
    await page.screenshot({ path: `${OUT}/${pg}-${lang}-${w}-full.png`, fullPage: true });
    await page.screenshot({ path: `${OUT}/${pg}-${lang}-${w}-hero.png` });
    if (pg === 'contact') { // form states: errors after an empty send, then the preview confirmation
      const y = await topOf(page, '#contact-form'); await to(page, y); await wait(300);
      await page.click('[data-ct-submit]'); await wait(400);
      await to(page, y - 20); await wait(200);
      await page.screenshot({ path: `${OUT}/contact-${lang}-${w}-errors.png` });
      await page.fill('#ct-name', 'QA Tester'); await page.fill('#ct-email', 'qa@example.com');
      await page.selectOption('#ct-topic', 'new-project'); await page.fill('#ct-message', 'QA test message, not sent.');
      await page.check('#ct-consent', { force: true }); await page.click('[data-ct-submit]'); await wait(1500);
      await page.evaluate(() => document.querySelector('[data-ct-done]').scrollIntoView({ block: 'center' })); await wait(300);
      await page.screenshot({ path: `${OUT}/contact-${lang}-${w}-preview-sent.png` });
    }
    await c.close();
  }
}

if (which === 'all' || which === 'frames') {
  // frame strips of the two new motions (5 frames each): About roles merge, Contact routes fan (EN + AR 1440, EN 390)
  const only = process.argv[3];
  for (const [lang, w] of [['en', 1440], ['ar', 1440], ['en', 390]]) {
    for (const [name, pg, sel, off, times] of [['roles', 'about', '[data-merge]', 0.5, [0, 250, 500, 800, 1500]], ['routes', 'contact', '[data-routes]', 0.35, [600, 900, 1150, 1450, 2400]]]) {
      if (only && only !== name) continue;
      const { c, page } = await open(vp(w), url(lang, pg)); await wait(pg === 'contact' ? 0 : 1800);
      if (pg === 'about') { const y = await topOf(page, sel); const vh = vp(w).viewport.height; await to(page, Math.max(0, y - vh * off)); }
      else if (w <= 430) { const y = await topOf(page, sel); await to(page, y - 300); }
      // contact desktop: the routes are in view on arrival, so the fan plays right after the page intro
      let last = 0; const t0 = 0; await wait(t0);
      for (const [k, t] of times.entries()) { await wait(t - last); last = t; await page.screenshot({ path: `${OUT}/motion-${name}-${lang}-${w}-${k + 1}.png` }); }
      await c.close();
    }
  }
}

if (which === 'all' || which === 'checks') {
  for (const pg of ['about', 'contact']) for (const lang of ['en', 'ar']) {
    for (const w of [1440, 1280, 1024, 768, 390]) {
      const { c, page } = await open(vp(w), url(lang, pg)); await wait(1500); await walk(page);
      const r = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth; const bad = [];
        document.querySelectorAll('main *, footer *').forEach((el) => {
          if (el.closest('.visually-hidden')) return;
          const b = el.getBoundingClientRect(); if (b.width && (b.right > vw + 1 || b.left < -1)) bad.push(`${el.tagName}.${el.className}`.slice(0, 60));
        });
        return { doc: document.documentElement.scrollWidth - vw, bad: [...new Set(bad)].slice(0, 6) };
      });
      report.push(`${pg} ${lang} ${w}: page overflow ${r.doc}px${r.bad.length ? ' · outside: ' + r.bad.join(', ') : ''}`);
      await c.close();
    }
    const { c, page } = await open(vp(1440), url(lang, pg)); await wait(1500);
    const facts = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      navCurrent: [...document.querySelectorAll('.header__nav a')].find((a) => a.getAttribute('aria-current') === 'page')?.getAttribute('href'),
      footerLinks: [...document.querySelectorAll('.footer__col a')].map((a) => a.getAttribute('href')).filter((h) => /about|contact/.test(h)),
      sampleTags: document.querySelectorAll('main .sample-mark').length,
      todoText: /\{\{TODO/.test(document.body.innerText), tel: document.querySelectorAll('a[href^="tel:"], a[href*="wa.me"]').length,
      iframes: document.querySelectorAll('iframe').length, formAction: document.querySelector('[data-contact-form]')?.getAttribute('action') ?? null,
    }));
    report.push(`${pg} ${lang} facts: ${JSON.stringify(facts)}`);
    if (pg === 'contact') {
      // keyboard: from the skip link through the routes and the whole form, then send with Enter
      await page.focus('#ct-name'); const order = ['ct-name'];
      for (let i = 0; i < 8; i++) { await page.keyboard.press('Tab'); order.push(await page.evaluate(() => document.activeElement.id || document.activeElement.textContent.trim().slice(0, 20))); }
      report.push(`contact ${lang} tab order from Name: ${order.join(' > ')}`);
      // empty send with the keyboard: errors, alert, focus on the first invalid field
      await page.focus('[data-ct-submit]'); await page.keyboard.press('Enter'); await wait(400);
      report.push(`contact ${lang} empty send: ${JSON.stringify(await page.evaluate(() => ({ alert: document.querySelector('[data-ct-summary]').textContent, invalid: document.querySelectorAll('[aria-invalid="true"]').length, focus: document.activeElement.id, colour: getComputedStyle(document.querySelector('.co-error:not(:empty)')).color })))}`);
      // wrong formats
      await page.fill('#ct-email', 'qa@'); await page.fill('#ct-phone', '12'); await page.focus('[data-ct-submit]'); await page.keyboard.press('Enter'); await wait(300);
      report.push(`contact ${lang} bad formats: ${await page.evaluate(() => [document.querySelector('#ct-email-error').textContent, document.querySelector('#ct-phone-error').textContent].join(' / '))}`);
      // valid, using the keyboard only (Space ticks the consent, Enter sends)
      const before = requests.length;
      await page.fill('#ct-name', 'QA Secret Name'); await page.fill('#ct-email', 'qa-secret@example.com'); await page.fill('#ct-phone', '+971 50 000 0000');
      await page.selectOption('#ct-topic', 'press'); await page.fill('#ct-message', 'QA-SECRET-MESSAGE');
      await page.focus('#ct-consent'); await page.keyboard.press('Space');
      await page.focus('[data-ct-submit]'); await page.keyboard.press('Enter'); await wait(1200);
      const done = await page.evaluate(() => ({ shown: !document.querySelector('[data-ct-done]').hidden, focused: document.activeElement.matches('[data-ct-done]'), text: document.querySelector('.ct-done__title').textContent, url: location.href }));
      const after = requests.slice(before);
      report.push(`contact ${lang} valid send: ${JSON.stringify(done)} · requests after typing: ${after.length} · carrying form data: ${after.filter((r) => /secret|QA/i.test(r) || r.startsWith('POST')).length}`);
      // routes: Ask Gate panel and the proposal sheet open
      await to(page, 0); await wait(300);
      await page.click('.ct-route:nth-child(2) [data-open-panel]'); await wait(900);
      const ag = await page.evaluate(() => !document.querySelector('[data-ag-panel]').hidden);
      await page.keyboard.press('Escape'); await wait(600);
      await page.click('.ct-route:nth-child(3) [data-open-drawer]'); await wait(800);
      const sheet = await page.evaluate(() => document.querySelector('#proposal-drawer').classList.contains('is-open'));
      await page.keyboard.press('Escape'); await wait(500);
      report.push(`contact ${lang} routes: ask gate opens ${ag} · brief sheet opens ${sheet}`);
      await page.focus('#cfaq-q0'); await page.keyboard.press('Enter'); await wait(400);
      report.push(`contact ${lang} faq enter: ${await page.getAttribute('#cfaq-q0', 'aria-expanded')}`);
    }
    await c.close();
    for (const [label, ctx] of [['reduced', { reducedMotion: 'reduce' }], ['nojs', { javaScriptEnabled: false }]]) {
      const o = await open(vp(1440), url(lang, pg), ctx); await wait(800);
      const hid = await o.page.evaluate(() => [...document.querySelectorAll('main h1, main h2, main h3, main p, main li, main dd')].filter((e) => { const s = getComputedStyle(e); return e.offsetParent && (s.opacity === '0' || s.visibility === 'hidden'); }).length);
      let extra = '';
      if (label === 'nojs' && pg === 'contact') extra = ` · send button type ${await o.page.getAttribute('[data-ct-submit]', 'type')}`;
      report.push(`${pg} ${lang} ${label}: hidden elements ${hid}${extra}`);
      await o.c.close();
    }
  }
  const h = await open(vp(1440), '/en/?entry=off'); await wait(800);
  report.push(`home: ${JSON.stringify(await h.page.evaluate(() => ({ how: !!document.getElementById('how'), contact: !!document.getElementById('contact'), nav: [...document.querySelectorAll('.header__nav a')].map((a) => a.getAttribute('href')) })))}`);
  await h.c.close();
  const sm = await readFile('dist/sitemap.xml', 'utf8');
  report.push(`sitemap: about ${(sm.match(/<loc>[^<]*\/about\/<\/loc>/g) || []).length} · contact ${(sm.match(/<loc>[^<]*\/contact\/<\/loc>/g) || []).length}`);
}

const uniq = [...new Set(errors.map((e) => e.replace(/'sha256-[^']+'/g, 'sha').slice(0, 220)))];
report.push(`errors: ${errors.length ? `${errors.length} (${uniq.length} distinct): ` + uniq.slice(0, 8).join(' | ') : 'none'}`);
await writeFile(`${OUT}/report-${which}.txt`, report.join('\n') + '\n');
console.log(report.join('\n'));
await browser.close(); server.close();
