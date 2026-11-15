// Stage 4B-1 QA: work index. Usage: npm run build && node scripts/qa-stage4b1.mjs [audit|filters|slices|shots|all]
// Serves dist/ with the production CSP (public/_headers). Output: qa/stage4b1/.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const DIST = path.resolve('dist'); const OUT = path.resolve(process.env.QA_OUT || 'qa/stage4b1');
await mkdir(OUT, { recursive: true });
const CSP = (await readFile('public/_headers', 'utf8')).match(/Content-Security-Policy: (.*)/)[1];
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.xml': 'application/xml' };
const PORT = 4399;
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

if (which === 'audit' || which === 'all') {
  for (const l of LANGS) for (const w of [1440, 1280, 1024, 768, 390]) {
    const { ctx, page, errs } = await open(w, `/${l}/work/?entry=off`);
    await wait(900); await scrollThrough(page);
    const r = await page.evaluate(() => ({
      over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelectorAll('h1').length,
      hiddenLeft: [...document.querySelectorAll('.windex__item, .arch__logo, .arch__cap, .work__body')].filter((e) => e.offsetParent && getComputedStyle(e).opacity !== '1').length,
      slicesLeft: document.querySelectorAll('.slice').length,
      navWork: [...document.querySelectorAll('.header__nav a')].find((a) => a.getAttribute('aria-current') === 'page')?.getAttribute('href') || null,
      footWork: document.querySelector('.footer__col:nth-child(2) a')?.getAttribute('href'),
    }));
    const ok = r.over <= 0 && r.h1 === 1 && !errs.length && !r.hiddenLeft && !r.slicesLeft;
    log(`${ok ? 'ok  ' : 'FAIL'} audit ${l} ${w}: overflow ${r.over}px · h1 ${r.h1} · errors ${errs.length} · still hidden ${r.hiddenLeft} · slices left ${r.slicesLeft} · nav current ${r.navWork} · footer work ${r.footWork}`);
    if (!ok) { fail.push(`audit ${l} ${w}`); errs.forEach((e) => log('   ' + e.slice(0, 200))); }
    await ctx.close();
  }
}

if (which === 'filters' || which === 'all') {
  for (const l of LANGS) {
    const { ctx, page, errs } = await open(1440, `/${l}/work/?entry=off`);
    await wait(800);
    const state = () => page.evaluate(() => ({
      pressed: [...document.querySelectorAll('[data-filter]')].filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.dataset.filter),
      cards: [...document.querySelectorAll('.windex__item')].filter((li) => !li.hidden).map((li) => li.querySelector('.work__title a').getAttribute('href').split('/')[3]),
      archive: !document.querySelector('[data-archive]').hidden,
      count: document.querySelector('[data-wcount]').textContent,
      url: new URLSearchParams(location.search).get('type') || '', y: Math.round(window.scrollY),
    }));
    // keyboard: Tab to the first chip, arrows to move, Enter / Space to press
    await page.evaluate(() => { const b = document.querySelector('[data-filter="all"]'); b.scrollIntoView({ block: 'center' }); });
    await wait(400);
    await page.focus('[data-filter="all"]');
    const y0 = await page.evaluate(() => Math.round(window.scrollY));
    for (const [keys, id] of [[['ArrowRight', 'Enter'], 'branding'], [['ArrowRight', 'Space'], 'logo'], [['ArrowRight', 'Enter'], 'video'], [['Home', 'Enter'], 'all']]) {
      for (const k of keys) await page.keyboard.press(l === 'ar' && k === 'ArrowRight' ? 'ArrowLeft' : k);
      await wait(600);
      const s = await state();
      const focused = await page.evaluate(() => document.activeElement?.dataset.filter);
      const exp = { all: [6, true], branding: [5, false], logo: [0, true], video: [1, false] }[id];
      const ok = s.pressed.join() === id && focused === id && s.cards.length === exp[0] && s.archive === exp[1] && (id === 'all' ? s.url === '' : s.url === id) && Math.abs(s.y - y0) <= 2;
      log(`${ok ? 'ok  ' : 'FAIL'} filter ${l} ${id}: pressed ${s.pressed} · focus ${focused} · cards ${s.cards.join(',') || '-'} · archive ${s.archive} · "${s.count}" · type=${s.url || '(none)'} · scroll ${y0}->${s.y}`);
      if (!ok) fail.push(`filter ${l} ${id}`);
    }
    if (errs.length) bad(`filter ${l} console: ${errs.join(' | ').slice(0, 200)}`);
    await ctx.close();
    // deep link
    const d = await open(1440, `/${l}/work/?type=logo&entry=off`); await wait(800);
    const ds = await d.page.evaluate(() => ({ grid: document.querySelector('[data-windex]').hidden, archive: !document.querySelector('[data-archive]').hidden, pressed: document.querySelector('[aria-pressed="true"]').dataset.filter }));
    log(`${ds.grid && ds.archive && ds.pressed === 'logo' ? 'ok  ' : 'FAIL'} deep link ${l} ?type=logo: grid hidden ${ds.grid} · archive ${ds.archive} · pressed ${ds.pressed}`);
    await d.ctx.close();
    // no JS: everything shown, no filter bar
    const n = await open(1440, `/${l}/work/?type=video`, { javaScriptEnabled: false });
    const ns = await n.page.evaluate(() => ({ bar: !!document.querySelector('[data-wfilter]').offsetParent, cards: [...document.querySelectorAll('.windex__item')].filter((e) => e.offsetParent).length, logos: [...document.querySelectorAll('.arch')].filter((e) => e.offsetParent).length }));
    log(`${!ns.bar && ns.cards === 6 && ns.logos === 14 ? 'ok  ' : 'FAIL'} no-JS ${l}: bar shown ${ns.bar} · cards ${ns.cards} · logos ${ns.logos}`);
    await n.page.screenshot({ path: `${OUT}/nojs-${l}-1440.png` });
    await n.ctx.close();
  }
}

if (which === 'slices' || which === 'all') {
  for (const l of LANGS) for (const w of [1440, 390]) {
    // motion: watch the bands leave
    const { ctx, page, errs } = await open(w, `/${l}/work/?entry=off`);
    await wait(300);
    await page.evaluate(() => document.querySelector('[data-slices]').scrollIntoView({ block: 'center' }));
    await wait(420);
    const mid = await page.evaluate(() => document.querySelectorAll('[data-slices] .slice').length);
    await page.screenshot({ path: `${OUT}/slices-mid-${l}-${w}.png` });
    await wait(1800);
    const end = await page.evaluate(() => { const f = document.querySelector('[data-slices]'); const img = f.querySelector('img'); return { left: f.querySelectorAll('.slice').length, on: f.classList.contains('slices-on'), vis: getComputedStyle(img).visibility, tr: getComputedStyle(img).transform }; });
    const ok = end.left === 0 && end.on && end.vis === 'visible' && !errs.length;
    log(`${ok ? 'ok  ' : 'FAIL'} slices ${l} ${w}: bands mid ${mid} · after ${end.left} · on ${end.on} · img ${end.vis} ${end.tr}`);
    if (!ok) fail.push(`slices ${l} ${w}`);
    await ctx.close();
    // reduced motion: no bands, image visible at once
    const rm = await open(w, `/${l}/work/`, { reducedMotion: 'reduce' }); await wait(500);
    const rs = await rm.page.evaluate(() => { const f = document.querySelector('[data-slices]'); return { bands: f.querySelectorAll('.slice').length, vis: getComputedStyle(f.querySelector('img')).visibility }; });
    log(`${!rs.bands && rs.vis === 'visible' ? 'ok  ' : 'FAIL'} slices reduced ${l} ${w}: bands ${rs.bands} · img ${rs.vis}`);
    await rm.ctx.close();
    // reload mid-page (scrolled past the frame): shown, no bands
    const rl = await open(w, `/${l}/work/?entry=off`);
    await rl.page.evaluate(() => document.querySelector('[data-archive]').scrollIntoView()); await wait(300);
    await rl.page.reload({ waitUntil: 'networkidle' }); await wait(1200);
    const rr = await rl.page.evaluate(() => { const f = document.querySelector('[data-slices]'); return { y: Math.round(scrollY), bands: f.querySelectorAll('.slice').length, on: f.classList.contains('slices-on'), vis: getComputedStyle(f.querySelector('img')).visibility }; });
    // and scrolling back up shows it intact
    await rl.page.evaluate(() => document.querySelector('[data-slices]').scrollIntoView({ block: 'center' })); await wait(1800);
    const back = await rl.page.evaluate(() => { const f = document.querySelector('[data-slices]'); return { bands: f.querySelectorAll('.slice').length, vis: getComputedStyle(f.querySelector('img')).visibility }; });
    const ok2 = rr.y > 0 && rr.on && !back.bands && back.vis === 'visible';
    log(`${ok2 ? 'ok  ' : 'FAIL'} slices reload mid-page ${l} ${w}: scrollY ${rr.y} · on ${rr.on} · bands ${rr.bands} → back up: bands ${back.bands} · img ${back.vis}`);
    if (!ok2) fail.push(`slices reload ${l} ${w}`);
    await rl.ctx.close();
  }
}

if (which === 'shots' || which === 'all') {
  for (const l of LANGS) for (const w of [1440, 390]) {
    // final state after the motion has played (scrolled through), full page
    const { ctx, page } = await open(w, `/${l}/work/?entry=off`);
    await wait(900); await scrollThrough(page);
    await page.evaluate(() => window.scrollTo(0, 0)); await wait(800);
    await page.screenshot({ path: `${OUT}/work-${l}-${w}.png`, fullPage: true });
    await page.screenshot({ path: `${OUT}/work-${l}-${w}-top.png` });
    await page.evaluate(() => document.querySelector('[data-filter="logo"]').click()); await wait(700);
    await page.screenshot({ path: `${OUT}/work-${l}-${w}-logo-filter.png` });
    await ctx.close();
  }
}

await writeFile(`${OUT}/report.txt`, out.join('\n') + `\n\n${fail.length ? 'FAILURES: ' + fail.join(', ') : 'All checks passed.'}\n`);
console.log(fail.length ? `\n${fail.length} failure(s)` : '\nAll checks passed.');
await browser.close(); server.close();
