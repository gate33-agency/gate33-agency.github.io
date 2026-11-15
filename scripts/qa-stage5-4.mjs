// Stage 5-4 QA: legal pages. Overflow at 3 widths, one h1, console/CSP errors, TOC anchors by keyboard, mobile contents fold,
// consent links, noindex, sitemap, internal link check over the whole build (dist), screenshots into qa/stage5-4/.
import { chromium } from 'playwright';
import fs from 'node:fs'; import path from 'node:path';
const base = process.argv[2] || 'http://localhost:8812';
const pages = ['/en/privacy/', '/ar/privacy/', '/en/terms/', '/ar/terms/'];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
let bad = 0; const log = (ok, m) => { if (!ok) bad++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${m}`); };
for (const url of pages) {
  for (const [w, h] of [[1440, 900], [1024, 768], [390, 844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = []; p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.text()); }); p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto(`${base}${url}?entry=off`, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
    const r = await p.evaluate(() => ({ ov: document.documentElement.scrollWidth - document.documentElement.clientWidth, h1: document.querySelectorAll('h1').length, robots: document.querySelector('meta[name=robots]')?.content, secs: document.querySelectorAll('.lg-sec').length, updatedShown: !!document.querySelector('.lg-updated'), notice: document.querySelector('.lg-notice')?.innerText }));
    log(r.ov <= 0 && r.h1 === 1 && !errs.length, `${url} @${w}: overflow ${r.ov}, h1 ${r.h1}, errors ${errs.length}${errs.length ? ' ' + errs.join(' | ') : ''}`);
    if (w === 1440) { log(/noindex/.test(r.robots) && !r.updatedShown && r.secs >= 8, `${url} robots="${r.robots}", sections ${r.secs}, updated hidden ${!r.updatedShown}, notice "${r.notice?.replace(/\n/g, ' ')}"`); }
    if (w !== 1024) { await p.screenshot({ path: `qa/stage5-4/${url.slice(1, 3)}-${url.slice(4, -1)}-${w}.png`, fullPage: true }); }
    // TOC keyboard
    if (w === 1440 || w === 390) {
      if (w === 390) { await p.click('[data-toc-fold] summary'); }
      const sel = w === 390 ? '[data-toc-fold] a[data-toc-link]' : '.lg-toc--side a[data-toc-link]';
      const link = (await p.$$(sel))[3]; await link.focus(); const href = await link.getAttribute('href'); await p.keyboard.press('Enter'); await p.waitForTimeout(900);
      const top = await p.evaluate((id) => Math.round(document.getElementById(id).getBoundingClientRect().top), href.slice(1));
      const hash = await p.evaluate(() => location.hash);
      const folded = w === 390 ? await p.evaluate(() => document.querySelector('[data-toc-fold]').open) : false;
      log(hash === href && top >= 0 && top < 200 && !folded, `${url} @${w} TOC keyboard: ${href} section top ${top}px, fold closed ${!folded}`);
    }
    await p.close();
  }
}
// consent links
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
for (const l of ['en', 'ar']) {
  await p.goto(`${base}/${l}/checkout/brand-starter/?entry=off`, { waitUntil: 'networkidle' }).catch(() => {});
  const h = await p.$$eval('a[href*="/privacy/"], a[href*="/terms/"]', (as) => as.map((a) => a.getAttribute('href')));
  await p.goto(`${base}/${l}/contact/?entry=off`, { waitUntil: 'networkidle' });
  const h2 = await p.$$eval('a[href*="/privacy/"], a[href*="/terms/"]', (as) => as.map((a) => a.getAttribute('href')));
  log(h.some((x) => x === `/${l}/terms/`) && h.some((x) => x === `/${l}/privacy/`) && h2.includes(`/${l}/privacy/`) && h2.every((x) => x.startsWith(`/${l}/`)), `${l} consent + footer links: checkout ${[...new Set(h)]} contact ${[...new Set(h2)]}`);
}
await b.close();
// sitemap
const sm = await (await fetch(`${base}/sitemap.xml`)).text(); log(!/privacy|terms/.test(sm), 'sitemap has no privacy/terms');
// link check over dist
const dist = 'dist'; const files = []; (function walk(d) { for (const f of fs.readdirSync(d)) { const q = path.join(d, f); fs.statSync(q).isDirectory() ? walk(q) : f.endsWith('.html') && files.push(q); } })(dist);
let missing = 0, total = 0;
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
    const u = decodeURIComponent(m[1]); total++;
    const ok = [u, u + '/index.html', path.join(u, 'index.html')].some((c) => fs.existsSync(path.join(dist, c)) && fs.statSync(path.join(dist, c)).isFile());
    if (!ok) { missing++; console.log('  404:', f, '->', u); }
  }
}
log(missing === 0, `link check: ${files.length} pages, ${total} internal links, ${missing} missing`);
process.exit(bad ? 1 : 0);
