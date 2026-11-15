// Stage 4B-2 QA: case-study template (Cyrin). Usage: npm run build && node scripts/qa-stage4b2.mjs [audit|gallery|slices|nojs|shots|all]
// Serves dist/ with the production CSP (public/_headers). Output: qa/stage4b2/.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const DIST = path.resolve('dist'); const OUT = path.resolve(process.env.QA_OUT || 'qa/stage4b2');
await mkdir(OUT, { recursive: true });
const CSP = (await readFile('public/_headers', 'utf8')).match(/Content-Security-Policy: (.*)/)[1];
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.xml': 'application/xml' };
const PORT = 4401;
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  try { const b = await readFile(path.join(DIST, p)); res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream', 'content-security-policy': CSP }); res.end(b); }
  catch { res.writeHead(404); res.end('nf'); }
}).listen(PORT);
const base = `http://localhost:${PORT}`;
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const which = process.argv[2] || 'all';
const LANGS = ['en', 'ar'];
const out = []; const fail = [];
const log = (s) => { out.push(s); console.log(s); };
const bad = (s) => { fail.push(s); log('FAIL ' + s); };
const vp = (w) => (w <= 430 ? { viewport: { width: w, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 } : { viewport: { width: w, height: 900 } });
async function open(w, url, opts = {}) {
  const ctx = await browser.newContext({ ...vp(w), ...opts });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || /Content Security Policy|Refused/.test(m.text())) errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(base + url, { waitUntil: 'networkidle' });
  return { ctx, page, errs };
}
async function scrollThrough(page) {
  await page.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += 300) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); } });
  await wait(1600);
}

const URL = (l) => `/${l}/work/cyrin/`;


if (which === 'audit' || which === 'all') {
  for (const l of LANGS) for (const w of [1440, 1280, 1024, 768, 390]) {
    const { ctx, page, errs } = await open(w, URL(l) + '?entry=off');
    await wait(900); await scrollThrough(page);
    const r = await page.evaluate(() => ({
      over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelectorAll('h1').length,
      slicesAttr: document.querySelectorAll('[data-slices]').length,
      slicesLeft: document.querySelectorAll('.slice').length,
      hidden: [...document.querySelectorAll('.case-frame img, .case-text__head > *, .case-text__body, .case-stats, .case-cap')].filter((e) => getComputedStyle(e).opacity !== '1' || getComputedStyle(e).visibility !== 'visible').length,
      imgsNoSize: [...document.querySelectorAll('main img')].filter((i) => !i.getAttribute('width') || !i.getAttribute('height') || !i.alt).length,
      lazyAbove: [...document.querySelectorAll('main img')].filter((i) => i.loading !== 'lazy' && i.getBoundingClientRect().top > 2000).length,
      crumbs: [...document.querySelectorAll('.crumbs li')].map((li) => li.textContent.trim()).join(' / '),
      next: document.querySelector('.case-next__link')?.getAttribute('href'),
      ld: (() => { try { return JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'].length; } catch { return 0; } })(),
      navCurrent: [...document.querySelectorAll('.header__nav a')].find((a) => a.getAttribute('aria-current') === 'page')?.getAttribute('href') || null,
    }));
    const ok = r.over <= 0 && r.h1 === 1 && !errs.length && r.slicesAttr === 1 && !r.slicesLeft && !r.hidden && !r.imgsNoSize && !r.lazyAbove && r.ld === 2;
    log(`${ok ? 'ok  ' : 'FAIL'} audit ${l} ${w}: overflow ${r.over}px · h1 ${r.h1} · errors ${errs.length} · data-slices ${r.slicesAttr} · bands left ${r.slicesLeft} · still hidden ${r.hidden} · img w/h/alt missing ${r.imgsNoSize} · eager below fold ${r.lazyAbove} · JSON-LD nodes ${r.ld} · crumbs "${r.crumbs}" · next ${r.next} · nav ${r.navCurrent}`);
    if (!ok) { fail.push(`audit ${l} ${w}`); errs.forEach((e) => log('   ' + e.slice(0, 200))); }
    await ctx.close();
  }
}

if (which === 'gallery' || which === 'all') {
  // registration: a pair's second frame starts lower and is in line once the row reaches the middle of the screen
  for (const l of LANGS) {
    const { ctx, page, errs } = await open(1440, URL(l) + '?entry=off'); await wait(900);
    const y = (sel) => page.evaluate((s) => { const f = document.querySelector(s); const fr = f.querySelectorAll('.case-frame'); return Math.round(fr[1].getBoundingClientRect().top - fr[0].getBoundingClientRect().top); }, sel);
    await page.evaluate(() => { const f = document.querySelector('[data-case-fig="pair"]'); scrollTo(0, f.getBoundingClientRect().top + scrollY - innerHeight * 0.8); }); await wait(900);
    const early = await y('[data-case-fig="pair"]');
    await page.screenshot({ path: `${OUT}/gallery-mid-${l}-1440.png` });
    await page.evaluate(() => { const f = document.querySelector('[data-case-fig="pair"]'); scrollTo(0, f.getBoundingClientRect().top + scrollY + f.offsetHeight / 2 - innerHeight * 0.4); }); await wait(900);
    const settled = await y('[data-case-fig="pair"]');
    const sc = await page.evaluate(() => { const f = [...document.querySelectorAll('[data-case-fig="full"]')][1]; f.scrollIntoView({ block: 'center' }); return 0; }); await wait(900);
    const scale = await page.evaluate(() => getComputedStyle([...document.querySelectorAll('[data-case-fig="full"]')][1].querySelector('img')).transform);
    const ok = early > 10 && Math.abs(settled) <= 1 && !errs.length;
    log(`${ok ? 'ok  ' : 'FAIL'} gallery ${l} 1440: pair offset early ${early}px -> at middle ${settled}px · full image transform at centre ${scale}`);
    if (!ok) fail.push(`gallery ${l}`);
    await ctx.close();
  }
}

if (which === 'slices' || which === 'all') {
  for (const l of LANGS) for (const w of [1440, 390]) {
    const { ctx, page, errs } = await open(w, URL(l) + '?entry=off');
    // the cover plays as soon as it shows; if it starts below the fold (AR 1440), scroll it into view like a visitor would
    const below = await page.evaluate(() => document.querySelector('[data-slices]').getBoundingClientRect().top > innerHeight * 0.97);
    if (below) await page.evaluate(() => scrollBy(0, 240));
    await wait(450);
    const mid = await page.evaluate(() => document.querySelectorAll('[data-slices] .slice').length);
    await page.screenshot({ path: `${OUT}/slices-mid-${l}-${w}.png` });
    await wait(1800);
    const end = await page.evaluate(() => { const f = document.querySelector('[data-slices]'); const img = f.querySelector('img'); return { left: f.querySelectorAll('.slice').length, on: f.classList.contains('slices-on'), vis: getComputedStyle(img).visibility, tr: getComputedStyle(img).transform }; });
    const ok = mid > 0 && end.left === 0 && end.on && end.vis === 'visible' && !errs.length;
    log(`${ok ? 'ok  ' : 'FAIL'} slices ${l} ${w}${below ? ' (after a short scroll)' : ' (on load)'}: bands mid ${mid} · after ${end.left} · on ${end.on} · img ${end.vis} ${end.tr}`);
    if (!ok) fail.push(`slices ${l} ${w}`);
    await ctx.close();
    const rm = await open(w, URL(l), { reducedMotion: 'reduce' }); await wait(500);
    const rs = await rm.page.evaluate(() => { const f = document.querySelector('[data-slices]'); return { bands: f.querySelectorAll('.slice').length, vis: getComputedStyle(f.querySelector('img')).visibility, tr: [...document.querySelectorAll('.case-frame, .case-frame img')].filter((e) => getComputedStyle(e).transform !== 'none').length }; });
    log(`${!rs.bands && rs.vis === 'visible' && !rs.tr ? 'ok  ' : 'FAIL'} reduced motion ${l} ${w}: bands ${rs.bands} · cover ${rs.vis} · gallery transforms ${rs.tr}`);
    if (rs.bands || rs.vis !== 'visible' || rs.tr) fail.push(`reduced ${l} ${w}`);
    await rm.page.screenshot({ path: `${OUT}/reduced-${l}-${w}-top.png` });
    await rm.ctx.close();
    const rl = await open(w, URL(l) + '?entry=off');
    await rl.page.evaluate(() => document.querySelector('.case-outcome').scrollIntoView()); await wait(400);
    await rl.page.reload({ waitUntil: 'networkidle' }); await wait(1300);
    const rr = await rl.page.evaluate(() => { const f = document.querySelector('[data-slices]'); return { y: Math.round(scrollY), bands: f.querySelectorAll('.slice').length, on: f.classList.contains('slices-on') }; });
    await rl.page.evaluate(() => scrollTo(0, 0)); await wait(1800);
    const back = await rl.page.evaluate(() => { const f = document.querySelector('[data-slices]'); return { bands: f.querySelectorAll('.slice').length, vis: getComputedStyle(f.querySelector('img')).visibility }; });
    const ok2 = rr.y > 0 && rr.on && !rr.bands && !back.bands && back.vis === 'visible' && !rl.errs.length;
    log(`${ok2 ? 'ok  ' : 'FAIL'} reload mid-page ${l} ${w}: scrollY ${rr.y} · on ${rr.on} · bands ${rr.bands} -> back to top: bands ${back.bands} · cover ${back.vis}`);
    if (!ok2) fail.push(`reload ${l} ${w}`);
    await rl.ctx.close();
  }
}

if (which === 'nojs' || which === 'all') {
  for (const l of LANGS) {
    const n = await open(1440, URL(l), { javaScriptEnabled: false });
    const ns = await n.page.evaluate(() => ({ imgs: [...document.querySelectorAll('.case-frame img, [data-slices] img')].filter((i) => getComputedStyle(i).visibility === 'visible' && getComputedStyle(i).opacity === '1').length, all: document.querySelectorAll('.case-frame img, [data-slices] img').length }));
    log(`${ns.imgs === ns.all ? 'ok  ' : 'FAIL'} no-JS ${l}: images visible ${ns.imgs}/${ns.all}`);
    if (ns.imgs !== ns.all) fail.push(`nojs ${l}`);
    await n.ctx.close();
  }
}

if (which === 'shots' || which === 'all') {
  for (const l of LANGS) for (const w of [1440, 390]) {
    const { ctx, page } = await open(w, URL(l) + '?entry=off');
    await wait(900); await scrollThrough(page);
    await page.evaluate(() => window.scrollTo(0, 0)); await wait(1200);
    await page.screenshot({ path: `${OUT}/cyrin-${l}-${w}-top.png` });
    await ctx.close();
    // full page in the resting layout: the gallery motion is scrubbed, so a full-page capture taken at scrollY 0 would
    // freeze rows below the fold mid-way. Reduced motion = exactly the layout every row settles into.
    const r = await open(w, URL(l), { reducedMotion: 'reduce' }); await wait(800);
    await r.page.screenshot({ path: `${OUT}/cyrin-${l}-${w}.png`, fullPage: true });
    await r.ctx.close();
  }
}

await writeFile(`${OUT}/report.txt`, out.join('\n') + `\n\n${fail.length ? 'FAILURES: ' + fail.join(', ') : 'All checks passed.'}\n`);
console.log(fail.length ? `\n${fail.length} failure(s)` : '\nAll checks passed.');
await browser.close(); server.close();
