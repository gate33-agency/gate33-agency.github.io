// Final review 2 QA (visual / layout / motion coverage). Serves nothing: expects `python3 -m http.server 8812` in dist.
// Usage: node scripts/qa-final2.mjs layout|motion|cls [paths...]   (paths default to every built page)
import { chromium } from 'playwright';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
const BASE = process.env.BASE || 'http://localhost:8812';
const mode = process.argv[2] || 'layout';
function pages(dir = 'dist', out = []) { for (const e of readdirSync(dir)) { const f = path.join(dir, e); if (statSync(f).isDirectory()) pages(f, out); else if (e === 'index.html') out.push('/' + path.relative('dist', dir) + '/'); } return out.filter((p) => p !== '//').sort(); }
const PAGES = process.argv.length > 3 ? process.argv.slice(3) : [...pages(), '/404.html'];
const WIDTHS = (process.env.WIDTHS || '1440,1280,1024,768,390').split(',').map(Number);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (u) => u + (u.includes('?') ? '&' : '?') + 'entry=off';
let issues = 0;

if (mode === 'layout') {
  for (const url of PAGES) for (const w of WIDTHS) {
    const mob = w <= 768; const c = await b.newContext({ viewport: { width: w, height: mob ? 900 : 900 }, reducedMotion: 'reduce', isMobile: w < 768, hasTouch: w < 768 });
    const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    await p.goto(BASE + q(url), { waitUntil: 'load' }); await wait(200);
    const r = await p.evaluate(() => {
      const out = {}; const vw = document.documentElement.clientWidth; const ar = document.documentElement.lang === 'ar';
      if (document.documentElement.scrollWidth > vw + 1) out.overflow = document.documentElement.scrollWidth - vw;
      const vis = (el) => { if (el.closest('[hidden],[inert],[aria-hidden=true],.visually-hidden,dialog:not([open])')) return false; const d = el.closest('details:not([open])'); if (d && !el.closest('summary')) return false; const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none'; };
      const name = (el) => (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : el.tagName.toLowerCase()) + ':' + (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 22);
      // 1. text leaves that overlap each other
      const leaves = [...document.querySelectorAll('main h1,main h2,main h3,main h4,main p,main li,main dt,main dd,main .btn,main .tag,main label,main figcaption,main td,main th,footer p,footer a')].filter(vis).filter((el) => !el.querySelector('p,li,h2,h3,h4,.btn,.tag,td'));
      const R = leaves.map((el) => el.getBoundingClientRect());
      const ov = [];
      for (let i = 0; i < leaves.length; i++) for (let j = i + 1; j < leaves.length; j++) {
        const a = R[i], c2 = R[j]; if (leaves[i].contains(leaves[j]) || leaves[j].contains(leaves[i])) continue;
        const x = Math.min(a.right, c2.right) - Math.max(a.left, c2.left), y = Math.min(a.bottom, c2.bottom) - Math.max(a.top, c2.top);
        if (x > 4 && y > 4) ov.push(name(leaves[i]) + ' X ' + name(leaves[j]));
      }
      if (ov.length) out.overlap = ov.slice(0, 5);
      // 2. headings crowding the next block (gap < 10px below, same column)
      const crowd = [];
      for (const h of document.querySelectorAll('main h1, main h2, main h3')) {
        if (!vis(h)) continue; const hr = h.getBoundingClientRect();
        let n = h.nextElementSibling; while (n && !vis(n)) n = n.nextElementSibling;
        if (!n) continue; const nr = n.getBoundingClientRect();
        const xo = Math.min(hr.right, nr.right) - Math.max(hr.left, nr.left);
        if (xo > 20 && nr.top >= hr.top + hr.height * 0.5 && nr.top - hr.bottom < 8) crowd.push(name(h) + ' gap ' + Math.round(nr.top - hr.bottom));
      }
      if (crowd.length) out.crowd = crowd.slice(0, 5);
      // 3. measure: average characters per line of paragraphs with >= 3 lines
      const longL = [];
      for (const el of document.querySelectorAll('main p, main li')) {
        if (!vis(el) || el.querySelector('p,li')) continue; const t = el.textContent.trim(); if (t.length < 160) continue;
        const rg = document.createRange(); rg.selectNodeContents(el); const tops = new Set([...rg.getClientRects()].map((x) => Math.round(x.top))); const n = tops.size; if (n < 3) continue;
        const cpl = t.length / n; if (cpl > (ar ? 90 : 95)) longL.push(name(el) + ' ' + Math.round(cpl) + 'cpl');
      }
      if (longL.length) out.measure = longL.slice(0, 4);
      // 4. headings: single-word last line (widow) on h1/h2
      const wid = [];
      for (const h of document.querySelectorAll('main h1, main h2')) { if (!vis(h)) continue; const rg = document.createRange(); rg.selectNodeContents(h); const rects = [...rg.getClientRects()]; const lines = new Map(); for (const x of rects) { const k = Math.round(x.bottom / 4); lines.set(k, (lines.get(k) || 0) + x.width); } if (lines.size < 2) continue; const last = [...lines.entries()].sort((a, c2) => a[0] - c2[0]).pop()[1]; const words = h.textContent.trim().split(/\s+/); const lastWord = words[words.length - 1]; if (words.length > 3 && last < h.getBoundingClientRect().width * 0.18 && !/[ ]/.test(h.textContent.slice(-lastWord.length - 1))) wid.push(name(h)); }
      if (wid.length) out.widow = wid.slice(0, 4);
      // 5. anchors: target scroll-margin vs header height
      const hh = (document.querySelector('.header') || {}).offsetHeight || 0; const anc = [];
      for (const a of document.querySelectorAll('a[href^="#"]')) { const id = a.getAttribute('href').slice(1); if (!id) continue; const t = document.getElementById(id); if (!t || t.closest('dialog,[role=dialog]')) continue; const sm = parseFloat(getComputedStyle(t).scrollMarginTop) || 0; if (sm < hh - 2 && getComputedStyle(t).position !== 'fixed') anc.push('#' + id + ' sm' + sm + '<' + hh); }
      if (anc.length) out.anchors = [...new Set(anc)].slice(0, 4);
      // 6. images without intrinsic size attributes
      const noSize = [...document.querySelectorAll('main img, footer img, header img')].filter((i) => !(i.getAttribute('width') && i.getAttribute('height')) && !i.closest('[aria-hidden=true] svg')).map((i) => (i.getAttribute('src') || '').split('/').pop());
      if (noSize.length) out.imgNoSize = noSize.slice(0, 4);
      // 7. tap targets on small screens
      if (vw < 768) { const small = []; for (const el of document.querySelectorAll('a[href], button, input, select, textarea, summary, [role=button]')) { if (!vis(el)) continue; const r = el.getBoundingClientRect(); if (r.height < 43.5 || r.width < 43.5) { const s = getComputedStyle(el); if (s.display === 'inline' && el.closest('p, li, dd')) continue; small.push(name(el) + `[${Math.round(r.width)}x${Math.round(r.height)}]`); } } if (small.length) out.smallTap = [...new Set(small)].slice(0, 8); }
      return out;
    });
    // 8. Ask Gate launcher vs page end (scroll to the bottom with motion off, launcher emerges on scroll)
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await wait(700);
    const lo = await p.evaluate(() => { const l = document.querySelector('[data-ag-launcher]'); if (!l) return null; const lr = l.getBoundingClientRect(); if (lr.width < 2 || getComputedStyle(l).opacity < 0.5) return null; const hit = []; for (const el of document.querySelectorAll('footer a, footer p, footer small, footer span, footer li, main .btn, main a')) { if (el.closest('[aria-hidden=true]')) continue; const r = el.getBoundingClientRect(); if (!r.width) continue; const x = Math.min(r.right, lr.right) - Math.max(r.left, lr.left), y = Math.min(r.bottom, lr.bottom) - Math.max(r.top, lr.top); if (x > 2 && y > 2) hit.push((el.textContent || '').trim().slice(0, 20)); } return hit.length ? hit.slice(0, 3) : null; });
    if (lo) r.launcherOver = lo;
    if (errs.length) r.errors = errs.slice(0, 2);
    if (Object.keys(r).length) { issues++; console.log(`${url} @${w}`, JSON.stringify(r)); }
    await c.close();
  }
}

if (mode === 'motion') {
  // For each top-level block below the fold: is anything in it animated (hidden / moved / clipped, before it enters)?
  for (const url of PAGES) for (const w of [1440, 390]) {
    const c = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 768, hasTouch: w < 768 }); const p = await c.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto(BASE + q(url), { waitUntil: 'load' }); await wait(2600);
    const r = await p.evaluate(() => {
      const blocks = [...document.querySelectorAll('main > section, main > div > section, main > article > section, main > *:not(section) > section, footer')].filter((s, i, a) => !a.some((o) => o !== s && o.contains(s)));
      const none = [];
      for (const s of blocks) {
        const r = s.getBoundingClientRect(); if (r.top < innerHeight || r.height < 40) continue;
        let moved = false;
        for (const el of [s, ...s.querySelectorAll('*')]) { const st = getComputedStyle(el); if (+st.opacity < 0.99 || (st.transform !== 'none' && !/matrix\(1, 0, 0, 1, 0, 0\)/.test(st.transform)) || (st.clipPath && st.clipPath !== 'none')) { if (el.closest('[aria-hidden=true]') && el !== s && !el.matches('.g-line')) { /* decorative still counts */ } moved = true; break; } }
        if (!moved) none.push((s.id || s.className.split(' ')[0] || s.tagName) );
      }
      return none;
    });
    if (r.length || errs.length) console.log(`${url} @${w} no-entrance:`, JSON.stringify(r), errs.length ? JSON.stringify(errs.slice(0, 2)) : '');
    await c.close();
  }
}

if (mode === 'cls') {
  for (const url of PAGES) for (const w of [1440, 390]) {
    const c = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 768 }); const p = await c.newPage();
    await p.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
    await p.goto(BASE + q(url), { waitUntil: 'load' }); await wait(2500);
    const v = await p.evaluate(() => window.__cls); if (v > 0.02) { issues++; console.log(`CLS ${url} @${w}`, v.toFixed(3)); }
    await c.close();
  }
}

if (mode === 'shots') {
  // full-page reduced-motion screenshots, scaled by SCALE and cut into tiles: OUT/<name>-<w>-<n>.png
  const sharp = (await import('sharp')).default; const OUT = process.env.OUT || '/tmp/f2/shots'; const { mkdirSync } = await import('node:fs'); mkdirSync(OUT, { recursive: true });
  const SCALE = +(process.env.SCALE || 0.5), TILE = +(process.env.TILE || 1500);
  for (const url of PAGES) for (const w of WIDTHS) {
    const c = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: process.env.MOTION ? 'no-preference' : 'reduce', isMobile: w < 768, hasTouch: w < 768 }); const p = await c.newPage();
    await p.goto(BASE + q(url), { waitUntil: 'load' }); await wait(300);
    const H = await p.evaluate(() => document.documentElement.scrollHeight); for (let y = 0; y < H; y += 800) { await p.evaluate((y) => window.scrollTo(0, y), y); await wait(60); } await p.evaluate(() => window.scrollTo(0, 0)); await wait(400);
    const buf = await p.screenshot({ fullPage: true }); await c.close();
    const name = (url.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'root').replace('.html', '');
    const img = sharp(buf); const m = await img.metadata(); const sw = Math.round(m.width * SCALE), sh = Math.round(m.height * SCALE);
    const small = await sharp(buf).resize(sw, sh).png().toBuffer();
    for (let i = 0, y = 0; y < sh; i++, y += TILE) await sharp(small).extract({ left: 0, top: y, width: sw, height: Math.min(TILE, sh - y) }).toFile(`${OUT}/${name}-${w}-${i}.png`);
    console.log(name, w, Math.ceil(sh / TILE), 'tiles');
  }
}
console.log('done', mode, 'pages', PAGES.length, 'flagged', issues);
await b.close();
