// Stage 5-2 QA: checkout shell + success / failed. Usage: npm run build && node scripts/qa-stage5-2.mjs [shots|checks|all]
// Serves dist/ with the production CSP (public/_headers). Output: qa/stage5-2/. ?entry=off skips the gate entry.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const DIST = path.resolve('dist'); const OUT = path.resolve('qa/stage5-2');
await mkdir(OUT, { recursive: true });
const CSP = (await readFile('public/_headers', 'utf8')).match(/Content-Security-Policy: (.*)/)[1];
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.xml': 'application/xml' };
const PORT = 4402;
const requests = [];
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
const errors = []; const report = []; const outside = [];
const pages = (lang) => ({
  checkout: `/${lang}/checkout/brand-system/?entry=off`,
  success: `/${lang}/checkout/success/?preview=1&package=brand-system&entry=off`,
  failed: `/${lang}/checkout/failed/?package=ecommerce-launch&preview=1&entry=off`,
});

async function open(opts, u) {
  const c = await browser.newContext({ ...opts }); const page = await c.newPage();
  page.on('pageerror', (e) => errors.push(`${u}: ${e}`));
  page.on('console', (m) => (m.type() === 'error' || /Content Security Policy/i.test(m.text())) && errors.push(`${u}: ${m.text()}`));
  page.on('request', (r) => { if (!r.url().startsWith(base) && !r.url().startsWith('data:')) outside.push(r.url()); });
  await page.goto(base + u, { waitUntil: 'load' });
  return { c, page };
}

if (which === 'all' || which === 'shots') {
  for (const lang of ['en', 'ar']) for (const w of [1440, 390]) {
    const P = pages(lang);
    let { c, page } = await open(vp(w), P.checkout); await wait(1800);
    await page.screenshot({ path: `${OUT}/${lang}-${w}-checkout-empty.png`, fullPage: true });
    await page.click('[data-checkout-submit]'); await wait(400);
    await page.screenshot({ path: `${OUT}/${lang}-${w}-checkout-errors.png`, fullPage: true });
    await page.screenshot({ path: `${OUT}/${lang}-${w}-checkout-errors-view.png` });
    await c.close();
    for (const k of ['success', 'failed']) {
      ({ c, page } = await open(vp(w), P[k])); await wait(2200);
      await page.screenshot({ path: `${OUT}/${lang}-${w}-${k}.png`, fullPage: true });
      await c.close();
    }
  }
  report.push('shots: done');
}

if (which === 'all' || which === 'checks') {
  // 1) overflow + one h1 on every new page, five widths, both languages
  for (const lang of ['en', 'ar']) for (const [k, u] of Object.entries({ ...pages(lang), ...Object.fromEntries(['brand-starter', 'ecommerce-launch', 'content-production'].map((s) => [s, `/${lang}/checkout/${s}/?entry=off`])) })) {
    for (const w of [1440, 1280, 1024, 768, 390]) {
      const { c, page } = await open(vp(w), u); await wait(700);
      const r = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h1: document.querySelectorAll('h1').length, robots: document.querySelector('meta[name=robots]')?.content }));
      if (r.sw > r.cw) report.push(`OVERFLOW ${lang} ${k} ${w}: ${r.sw} > ${r.cw}`);
      if (r.h1 !== 1) report.push(`H1 ${lang} ${k} ${w}: ${r.h1}`);
      if (!/noindex/.test(r.robots || '')) report.push(`ROBOTS ${lang} ${k}: ${r.robots}`);
      await c.close();
    }
  }
  report.push('overflow / h1 / noindex: checked (8 pages x 2 languages x 5 widths)');

  // 2) keyboard-only run through the form (EN 1440, AR 390)
  for (const [lang, w] of [['en', 1440], ['ar', 1440], ['ar', 390]]) {
    const { c, page } = await open(vp(w), pages(lang).checkout); await wait(1500);
    const active = () => page.evaluate(() => document.activeElement && (document.activeElement.id || document.activeElement.className || document.activeElement.tagName));
    let n = 0; while ((await active()) !== 'co-name' && n < 80) { await page.keyboard.press('Tab'); n++; }
    report.push(`kbd ${lang} ${w}: reached the name field after ${n} Tab presses`);
    await page.keyboard.press('Enter'); await wait(300); // implicit submit from the first field, everything empty
    let st = await page.evaluate(() => ({ alert: document.querySelector('[data-co-summary]').textContent, role: document.querySelector('[data-co-summary]').getAttribute('role'), focus: document.activeElement.id,
      invalid: [...document.querySelectorAll('[aria-invalid=true]')].map((e) => e.id), described: document.getElementById('co-name').getAttribute('aria-describedby'), err: document.getElementById('co-name-error').textContent }));
    report.push(`kbd ${lang} ${w}: empty submit -> alert "${st.alert}" (role ${st.role}), focus #${st.focus}, invalid [${st.invalid.join(', ')}], #co-name described by "${st.described}" = "${st.err}"`);
    // fill by keyboard: name, bad email, phone, company, country (arrow keys), bad TRN, notes, consent (space)
    await page.keyboard.type('Sample Person'); await page.keyboard.press('Tab');
    await page.keyboard.type('not-an-email'); await page.keyboard.press('Tab');
    await page.keyboard.type('+971 4 000 0000'); await page.keyboard.press('Tab');
    await page.keyboard.type('Sample Co'); await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Tab');
    await page.keyboard.type('123'); await page.keyboard.press('Tab');
    await page.keyboard.type('Notes'); await page.keyboard.press('Tab');
    // the Terms link sits after the checkbox in DOM order? checkbox comes first
    const onConsent = await active(); if (onConsent === 'co-consent') await page.keyboard.press('Space');
    // tab to the submit button
    let m = 0; while (!(await page.evaluate(() => document.activeElement.matches('[data-checkout-submit]'))) && m < 10) { await page.keyboard.press('Tab'); m++; }
    await page.keyboard.press('Enter'); await wait(300);
    st = await page.evaluate(() => ({ alert: document.querySelector('[data-co-summary]').textContent, focus: document.activeElement.id, invalid: [...document.querySelectorAll('[aria-invalid=true]')].map((e) => e.id), country: document.getElementById('co-country').value, consent: document.getElementById('co-consent').checked }));
    report.push(`kbd ${lang} ${w}: consent focus=${onConsent}; second submit -> "${st.alert}", focus #${st.focus}, invalid [${st.invalid.join(', ')}], country=${st.country}, consent=${st.consent}`);
    if (w === 1440 && lang === 'en') await page.screenshot({ path: `${OUT}/en-1440-checkout-format-errors-view.png` });
    // fix the two fields by keyboard: focus is on email
    await page.keyboard.press('Control+A'); await page.keyboard.type('name@company.com');
    await page.focus('#co-trn'); await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace');
    await page.focus('[data-checkout-submit]'); await page.keyboard.press('Enter');
    await page.waitForURL(/success/, { timeout: 4000 }).catch(() => {});
    report.push(`kbd ${lang} ${w}: valid submit -> ${page.url().replace(base, '')}`);
    await c.close();
  }

  // 3) RTL layout: labels / inputs start on the right; summary on the left of the form at desktop
  for (const [lang, w] of [['ar', 1440], ['ar', 390], ['en', 1440]]) {
    const { c, page } = await open(vp(w), pages(lang).checkout); await wait(1200);
    const r = await page.evaluate(() => {
      const b = (s) => document.querySelector(s).getBoundingClientRect();
      const lab = b('label[for=co-name]'), inp = b('#co-name'), sum = b('.co-sum'), form = b('.co-form'), box = b('.co-check__box'), cl = b('label[for=co-consent]'), em = b('#co-email');
      return { labelRight: Math.round(lab.right), inputRight: Math.round(inp.right), labelLeft: Math.round(lab.left), inputLeft: Math.round(inp.left), sumX: Math.round(sum.left), formX: Math.round(form.left), sumTop: Math.round(sum.top), formTop: Math.round(form.top), boxX: Math.round(box.left), consentX: Math.round(cl.left), nameX: Math.round(inp.left), emailX: Math.round(em.left), emailAlign: getComputedStyle(document.querySelector('#co-email')).textAlign };
    });
    report.push(`layout ${lang} ${w}: ${JSON.stringify(r)}`);
    await c.close();
  }

  // 4) "Request a proposal" opens the sheet preset to the package; the drawer service is preselected
  for (const lang of ['en', 'ar']) {
    const { c, page } = await open(vp(1440), pages(lang).checkout); await wait(1200);
    await page.click('.co-pay__talk [data-open-drawer]'); await wait(700);
    const r = await page.evaluate(() => ({ open: document.querySelector('#proposal-drawer').classList.contains('is-open'), pkg: document.querySelector('[data-package-name]').textContent, svc: document.querySelector('[data-service-select]').value }));
    report.push(`proposal ${lang}: ${JSON.stringify(r)}`);
    await c.close();
  }

  // 5) result pages: package, sample reference, retry link, proposal preset, language switch keeps the query
  for (const lang of ['en', 'ar']) {
    let { c, page } = await open(vp(1440), pages(lang).success); await wait(1500);
    let r = await page.evaluate(() => ({ pkg: [...document.querySelectorAll('[data-pkg-name]')].filter((e) => !e.hidden).map((e) => e.textContent), ref: !document.querySelector('[data-co-ref]').hidden, sw: document.querySelector('.lang-switch').getAttribute('href') }));
    report.push(`success ${lang}: ${JSON.stringify(r)}`);
    await c.close();
    ({ c, page } = await open(vp(1440), `/${lang}/checkout/success/?entry=off`)); await wait(800);
    r = await page.evaluate(() => ({ facts: !document.querySelector('[data-co-facts]').hidden }));
    report.push(`success ${lang} without query: facts shown=${r.facts}`);
    await c.close();
    ({ c, page } = await open(vp(1440), pages(lang).failed)); await wait(1500);
    r = await page.evaluate(() => { const a = document.querySelector('[data-co-retry]'); return { retry: a.getAttribute('href'), label: a.textContent.trim() }; });
    await page.click('[data-co-proposal]'); await wait(700);
    const d = await page.evaluate(() => ({ open: document.querySelector('#proposal-drawer').classList.contains('is-open'), pkg: document.querySelector('[data-package-name]').textContent, svc: document.querySelector('[data-service-select]').value }));
    report.push(`failed ${lang}: ${JSON.stringify({ ...r, ...d })}`);
    await c.close();
  }

  // 6) wiring: packages page cards + compare go to checkout; Home still opens the proposal sheet
  for (const lang of ['en', 'ar']) {
    let { c, page } = await open(vp(1440), `/${lang}/packages/?entry=off`); await wait(800);
    let r = await page.evaluate(() => ({ cards: [...document.querySelectorAll('.pk-card__in > .btn')].map((a) => a.getAttribute('href')), cmp: [...document.querySelectorAll('.cmp__buy')].map((a) => a.getAttribute('href')) }));
    report.push(`packages ${lang}: ${JSON.stringify(r)}`);
    await c.close();
    ({ c, page } = await open(vp(1440), `/${lang}/?entry=off`)); await wait(800);
    r = await page.evaluate(() => [...document.querySelectorAll('.pkg .btn')].map((b) => `${b.tagName}${b.hasAttribute('data-open-drawer') ? ' drawer' : ''} ${b.getAttribute('href') || ''}`));
    report.push(`home ${lang}: ${JSON.stringify(r)}`);
    await c.close();
  }
}

report.push(`requests outside localhost: ${outside.length ? outside.join(', ') : 'none'}`);
report.push(`requests carrying form data: ${requests.filter((q) => /name=|email=|phone=|trn=/.test(q)).join(', ') || 'none'}`);
report.push(`console / CSP / page errors: ${errors.length ? '\n  ' + errors.join('\n  ') : 'none'}`);
await writeFile(`${OUT}/report.txt`, report.join('\n') + '\n');
console.log(report.join('\n'));
await browser.close(); server.close();
