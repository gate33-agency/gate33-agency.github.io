// Stage 4B-3 QA: the five new case pages on the case template. Usage:
//   npm run build && SLUGS=plutrex,zakharef node scripts/qa-stage4b3.mjs [audit|slices|video|nojs|shots|links|all]
// audit = overflow at 5 widths, console/CSP errors, one h1, one data-slices, image w/h/alt, JSON-LD, image weight at 1440.
// video = poster first, nothing plays before the click, plays on click (mouse and keyboard), reduced motion.
// links = every /en|ar/work/... href on every built page resolves (count of 404s).
// Serves dist/ with the production CSP (public/_headers). Output: qa/stage4b2/.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const DIST = path.resolve('dist'); const OUT = path.resolve(process.env.QA_OUT || 'qa/stage4b3');
await mkdir(OUT, { recursive: true });
const CSP = (await readFile('public/_headers', 'utf8')).match(/Content-Security-Policy: (.*)/)[1];
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.xml': 'application/xml' };
const PORT = 4402;
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

const SLUGS = (process.env.SLUGS || 'plutrex,zakharef,the-point,abdo,coffee-film').split(',');
const PAGES = SLUGS.flatMap((s) => LANGS.map((l) => [s, l]));
const URL = (s, l) => `/${l}/work/${s}/`;

if (which === 'audit' || which === 'all') {
  for (const [s, l] of PAGES) for (const w of [1440, 1280, 1024, 768, 390]) {
    const { ctx, page, errs } = await open(w, URL(s, l) + '?entry=off');
    await wait(700); await scrollThrough(page);
    const r = await page.evaluate(() => ({
      over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelectorAll('h1').length,
      slicesAttr: document.querySelectorAll('[data-slices]').length,
      coverSlices: document.querySelectorAll('.case-cover [data-slices]').length,
      slicesLeft: document.querySelectorAll('.slice').length,
      hidden: [...document.querySelectorAll('.case-frame img, .case-text__head > *, .case-text__body, .case-stats, .case-cap')].filter((e) => getComputedStyle(e).opacity !== '1' || getComputedStyle(e).visibility !== 'visible').length,
      imgsNoSize: [...document.querySelectorAll('main img')].filter((i) => !i.getAttribute('width') || !i.getAttribute('height') || !i.alt).length,
      broken: [...document.querySelectorAll('main img')].filter((i) => i.complete && i.naturalWidth === 0).length,
      ld: (() => { try { return JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'].length; } catch { return 0; } })(),
      next: document.querySelector('.case-next__link')?.getAttribute('href'),
      kb: Math.round(performance.getEntriesByType('resource').filter((e) => e.initiatorType === 'img' && /\/images\/(?!clients|logo)/.test(e.name)).reduce((a, e) => a + (e.encodedBodySize || 0), 0) / 1024),
      todo: /\{\{TODO/.test(document.body.innerText + document.head.innerHTML),
    }));
    const ok = r.over <= 0 && r.h1 === 1 && !errs.length && r.slicesAttr === 1 && r.coverSlices === 1 && !r.slicesLeft && !r.hidden && !r.imgsNoSize && !r.broken && r.ld === 2 && !r.todo && (w !== 1440 || r.kb < 1600);
    log(`${ok ? 'ok  ' : 'FAIL'} audit ${s} ${l} ${w}: overflow ${r.over}px · h1 ${r.h1} · errors ${errs.length} · slices ${r.slicesAttr} (cover ${r.coverSlices}) · bands left ${r.slicesLeft} · hidden ${r.hidden} · img w/h/alt missing ${r.imgsNoSize} · broken ${r.broken} · JSON-LD ${r.ld} · TODO leak ${r.todo} · next ${r.next}${w === 1440 ? ` · case images ${r.kb} KB` : ''}`);
    if (!ok) { fail.push(`audit ${s} ${l} ${w}`); errs.forEach((e) => log('   ' + e.slice(0, 200))); }
    await ctx.close();
  }
}

if (which === 'slices' || which === 'all') {
  for (const [s, l] of PAGES) for (const w of [1440, 390]) {
    const { ctx, page, errs } = await open(w, URL(s, l) + '?entry=off');
    const below = await page.evaluate(() => document.querySelector('[data-slices]').getBoundingClientRect().top > innerHeight * 0.97);
    if (below) await page.evaluate(() => scrollBy(0, 240));
    await wait(450);
    const mid = await page.evaluate(() => document.querySelectorAll('[data-slices] .slice').length);
    await wait(1800);
    const end = await page.evaluate(() => { const f = document.querySelector('[data-slices]'); return { left: f.querySelectorAll('.slice').length, on: f.classList.contains('slices-on'), vis: getComputedStyle(f.querySelector('img')).visibility }; });
    const ok = mid > 0 && end.left === 0 && end.on && end.vis === 'visible' && !errs.length;
    log(`${ok ? 'ok  ' : 'FAIL'} slices ${s} ${l} ${w}${below ? ' (after a short scroll)' : ''}: bands mid ${mid} · after ${end.left} · cover ${end.vis}`);
    if (!ok) fail.push(`slices ${s} ${l} ${w}`);
    await ctx.close();
    const rm = await open(w, URL(s, l), { reducedMotion: 'reduce' }); await wait(500);
    const rs = await rm.page.evaluate(() => { const f = document.querySelector('[data-slices]'); return { bands: f.querySelectorAll('.slice').length, vis: getComputedStyle(f.querySelector('img')).visibility, tr: [...document.querySelectorAll('.case-frame, .case-frame img')].filter((e) => getComputedStyle(e).transform !== 'none').length }; });
    const ok2 = !rs.bands && rs.vis === 'visible' && !rs.tr && !rm.errs.length;
    log(`${ok2 ? 'ok  ' : 'FAIL'} reduced motion ${s} ${l} ${w}: bands ${rs.bands} · cover ${rs.vis} · gallery transforms ${rs.tr}`);
    if (!ok2) fail.push(`reduced ${s} ${l} ${w}`);
    await rm.ctx.close();
  }
}

if (which === 'video' || which === 'all') {
  for (const [s, l] of PAGES) for (const [w, how, rm] of [[1440, 'click', false], [1440, 'keyboard', false], [390, 'tap', false], [1440, 'click', true]]) {
    const { ctx, page, errs } = await open(w, URL(s, l) + '?entry=off', rm ? { reducedMotion: 'reduce' } : {});
    const n = await page.evaluate(() => document.querySelectorAll('[data-video-card]').length);
    if (!n) { await ctx.close(); if (how === 'click' && !rm) log(`--   video ${s} ${l}: no video block`); continue; }
    await wait(600);
    const before = await page.evaluate(() => ({
      videos: document.querySelectorAll('main video').length, playing: [...document.querySelectorAll('video')].filter((v) => !v.paused).length,
      poster: (() => { const i = document.querySelector('[data-video-card] img'); return !!i && i.complete && i.naturalWidth > 0; })(),
      src: document.querySelector('[data-video-card]').dataset.video, label: document.querySelector('[data-video-card] [data-play]').getAttribute('aria-label'),
    }));
    const btn = page.locator('[data-video-card] [data-play]').first();
    await btn.scrollIntoViewIfNeeded(); await wait(300);
    if (how === 'keyboard') { await btn.focus(); await page.keyboard.press('Enter'); } else if (how === 'tap') await btn.tap(); else await btn.click();
    await wait(1500);
    const after = await page.evaluate(() => { const v = document.querySelector('[data-video-card] video'); return v ? { t: +v.currentTime.toFixed(2), paused: v.paused, controls: v.controls, focused: document.activeElement === v, src: v.getAttribute('src'), err: v.error && v.error.code } : null; });
    const ok = !before.videos && !before.playing && before.poster && after && !after.paused && after.t > 0 && after.controls && after.focused && !after.err && !errs.length;
    log(`${ok ? 'ok  ' : 'FAIL'} video ${s} ${l} ${w} ${how}${rm ? ' (reduced motion)' : ''}: before: <video> ${before.videos}, playing ${before.playing}, poster loaded ${before.poster} · after ${how}: ${after ? `plays ${!after.paused} t=${after.t}s controls ${after.controls} focus ${after.focused} src ${after.src}` : 'no video'} · label "${before.label}"`);
    if (!ok) { fail.push(`video ${s} ${l} ${w} ${how}`); errs.forEach((e) => log('   ' + e.slice(0, 200))); }
    if (w === 1440 && how === 'click' && !rm) {
      await page.screenshot({ path: `${OUT}/video-playing-${s}-${l}.png` });
      for (let k = 1; k < n; k++) { // every further film on the page: poster first, plays on click
        const card = page.locator('[data-video-card]').nth(k);
        const pre = await card.evaluate((c) => ({ v: c.querySelectorAll('video').length, src: c.dataset.video }));
        await card.locator('[data-play]').click(); await wait(1500);
        const a2 = await card.evaluate((c) => { const v = c.querySelector('video'); return v ? { t: +v.currentTime.toFixed(2), paused: v.paused, err: v.error && v.error.code } : null; });
        const ok2 = !pre.v && a2 && !a2.paused && a2.t > 0 && !a2.err;
        log(`${ok2 ? 'ok  ' : 'FAIL'} video ${s} ${l} 1440 film ${k + 1}: before <video> ${pre.v} · after click plays ${a2 && !a2.paused} t=${a2 && a2.t}s src ${pre.src}`);
        if (!ok2) fail.push(`video ${s} ${l} film ${k + 1}`);
      }
    }
    await ctx.close();
  }
}

if (which === 'nojs' || which === 'all') {
  for (const [s, l] of PAGES) {
    const n = await open(1440, URL(s, l), { javaScriptEnabled: false });
    const ns = await n.page.evaluate(() => ({ imgs: [...document.querySelectorAll('.case-frame img, [data-slices] img, .case-video img')].filter((i) => getComputedStyle(i).visibility === 'visible' && getComputedStyle(i).opacity === '1').length, all: document.querySelectorAll('.case-frame img, [data-slices] img, .case-video img').length }));
    log(`${ns.imgs === ns.all ? 'ok  ' : 'FAIL'} no-JS ${s} ${l}: images visible ${ns.imgs}/${ns.all}`);
    if (ns.imgs !== ns.all) fail.push(`nojs ${s} ${l}`);
    await n.ctx.close();
  }
}

if (which === 'shots' || which === 'all') {
  for (const [s, l] of PAGES) for (const w of [1440, 390]) {
    const r = await open(w, URL(s, l), { reducedMotion: 'reduce' }); await wait(500);
    await scrollThrough(r.page); await r.page.evaluate(() => scrollTo(0, 0)); await wait(600); // load the lazy images first
    await r.page.screenshot({ path: `${OUT}/${s}-${l}-${w}.png`, fullPage: true });
    await r.ctx.close();
  }
}

if (which === 'links' || which === 'all') {
  const { readdir } = await import('node:fs/promises');
  const walk = async (d) => (await Promise.all((await readdir(d, { withFileTypes: true })).map((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]))).flat();
  const htmls = (await walk(DIST)).filter((f) => f.endsWith('.html'));
  const hrefs = new Map();
  for (const f of htmls) for (const m of (await readFile(f, 'utf8')).matchAll(/href="(\/(?:en|ar)\/work\/[^"#?]*)/g)) hrefs.set(m[1], (hrefs.get(m[1]) || 0) + 1);
  let missing = 0;
  for (const h of hrefs.keys()) { const p = path.join(DIST, h.endsWith('/') ? h + 'index.html' : h); try { await readFile(p); } catch { missing++; log(`FAIL link 404: ${h} (${hrefs.get(h)} links)`); } }
  const all = [...hrefs.values()].reduce((a, b) => a + b, 0);
  log(`${missing ? 'FAIL' : 'ok  '} links: ${htmls.length} pages · ${hrefs.size} distinct /work/ URLs (${all} links) · 404s ${missing}`);
  if (missing) fail.push('links');
}

await writeFile(`${OUT}/report.txt`, out.join('\n') + `\n\n${fail.length ? 'FAILURES: ' + fail.join(', ') : 'All checks passed.'}\n`);
console.log(fail.length ? `\n${fail.length} failure(s)` : '\nAll checks passed.');
await browser.close(); server.close();
