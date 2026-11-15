// Stage R review QA. Usage: npm run build && node scripts/qa-review.mjs [audit|shots|links|seo|weights|nojs|keys] [tag]
// Serves dist/ with the production CSP. Output: qa/review/.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
const DIST = path.resolve('dist'); const OUT = path.resolve('qa/review'); await mkdir(OUT, { recursive: true });
const CSP = (await readFile('public/_headers', 'utf8')).match(/Content-Security-Policy: (.*)/)[1];
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain' };
const PORT = 4411;
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  try { const b = await readFile(path.join(DIST, p)); res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream', 'content-security-policy': CSP, 'content-length': b.length }); res.end(b); }
  catch { res.writeHead(404); res.end('nf'); }
}).listen(PORT);
const base = `http://localhost:${PORT}`;
const SLUGS = ['ai-search-visibility', 'branding-creative-design', 'creative-production', 'web-apps-business-systems', 'digital-marketing-growth', 'product-development-sourcing', 'events-brand-experiences'];
const PAGES = (process.env.PAGES ? process.env.PAGES.split(',') : null) || ['en', 'ar'].flatMap((l) => [`/${l}/`, `/${l}/services/`, ...SLUGS.map((s) => `/${l}/services/${s}/`)]);
const mode = process.argv[2] || 'audit'; const tag = process.argv[3] || 'after';
const browser = mode === 'links' ? null : await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function htmlFiles(dir) { const out = []; for (const e of await readdir(dir, { withFileTypes: true })) { const f = path.join(dir, e.name); if (e.isDirectory()) out.push(...await htmlFiles(f)); else if (f.endsWith('.html')) out.push(f); } return out; }

if (mode === 'audit') {
  const WIDTHS = [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [390, 844]];
  for (const url of PAGES) for (const [w, h] of WIDTHS) {
    const mob = w <= 768;
    const c = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce', isMobile: mob, hasTouch: mob });
    const p = await c.newPage(); const errs = [];
    p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    await p.goto(base + url, { waitUntil: 'load' }); await wait(250);
    const r = await p.evaluate((mob) => {
      const out = {}; const vw = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth > vw + 1) out.overflow = document.documentElement.scrollWidth - vw;
      const vis = (el) => { const s = getComputedStyle(el); const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.01; };
      const off = [];
      for (const el of document.querySelectorAll('main *, header *, footer *')) { if (!vis(el)) continue; const b = el.getBoundingClientRect(); if (b.right > vw + 2 || b.left < -2) { let a = el.parentElement, scroll = false; while (a && a !== document.body) { const s = getComputedStyle(a); if (/(auto|scroll|hidden|clip)/.test(s.overflowX)) { scroll = true; break; } a = a.parentElement; } if (!scroll) off.push((el.className && String(el.className).split(' ')[0]) || el.tagName); } }
      if (off.length) out.offscreen = [...new Set(off)].slice(0, 6);
      const h1 = document.querySelectorAll('h1').length; if (h1 !== 1) out.h1 = h1;
      let last = 0; const skips = []; for (const h of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) { const n = +h.tagName[1]; if (last && n > last + 1) skips.push(`${last}->${n}:${h.textContent.trim().slice(0, 24)}`); last = n; } if (skips.length) out.headingSkips = skips.slice(0, 4);
      const hov = [...document.querySelectorAll('main h1, main h2, main h3, main h4, .pkg .tag, .tag')].filter((h) => vis(h) && (h.scrollWidth > h.clientWidth + 2 || (h.closest('.pkg, .scope__card, .stack__card, .custom') && h.getBoundingClientRect().right > h.closest('.pkg, .scope__card, .stack__card, .custom').getBoundingClientRect().right + 1))).map((h) => h.textContent.trim().slice(0, 24)); if (hov.length) out.textOverflow = hov.slice(0, 4);
      const noalt = [...document.querySelectorAll('img:not([alt])')].length; if (noalt) out.noalt = noalt;
      if (mob) { const small = []; for (const el of document.querySelectorAll('a[href], button, input, select, textarea, summary, [role=button]')) { if (!vis(el)) continue; if (el.closest('[inert], [hidden], [aria-hidden=true]')) continue; const b = el.getBoundingClientRect(); if (b.height < 43.5 || b.width < 43.5) { const s = getComputedStyle(el); if (s.display === 'inline') { const pb = el.parentElement.getBoundingClientRect(); if (el.closest('p') && pb.height > 60) continue; } small.push(`${(String(el.className).split(' ')[0]) || el.tagName}[${Math.round(b.width)}x${Math.round(b.height)}]`); } } if (small.length) out.smallTap = [...new Set(small)].slice(0, 10); }
      const unnamed = [...document.querySelectorAll('a[href], button')].filter((el) => !(el.textContent.trim() || el.getAttribute('aria-label') || el.querySelector('img[alt]:not([alt=""])') || el.getAttribute('aria-hidden') === 'true')).length; if (unnamed) out.unnamed = unnamed;
      const ids = [...document.querySelectorAll('[id]')].map((e) => e.id); const dup = ids.filter((x, i) => ids.indexOf(x) !== i); if (dup.length) out.dupIds = [...new Set(dup)].slice(0, 5);
      const lm = ['main', 'header', 'footer', 'nav'].filter((t) => !document.querySelector(t)); if (lm.length) out.missingLandmarks = lm;
      return out;
    }, mob);
    if (errs.length) r.errors = errs.slice(0, 3);
    if (Object.keys(r).length) console.log(`${url} @${w}`, JSON.stringify(r));
    await c.close();
  }
  // Motion on: scroll through at 1440 and 390, collect errors and stuck-hidden content at the end
  for (const url of PAGES) for (const [w, h] of [[1440, 900], [390, 844]]) {
    const mob = w < 768; const c = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mob, hasTouch: mob });
    const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    await p.goto(base + url, { waitUntil: 'load' }); await wait(1200);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += Math.round(h * 0.6)) { await p.evaluate((y) => window.scrollTo(0, y), y); await wait(260); }
    await wait(1200);
    const r = await p.evaluate(() => { const vw = document.documentElement.clientWidth; const out = {}; if (document.documentElement.scrollWidth > vw + 1) out.overflow = document.documentElement.scrollWidth - vw;
      const hid = []; for (const el of document.querySelectorAll('main h1, main h2, main h3, main p, main li, main img, main a.btn, main button')) { if (el.closest('[hidden],[inert],.visually-hidden,[aria-hidden=true]')) continue; let o = 1, a = el; while (a && a !== document.body) { o *= +getComputedStyle(a).opacity; a = a.parentElement; } const b = el.getBoundingClientRect(); if (o < 0.5 && b.width > 0 && b.bottom + scrollY < scrollY - 200) hid.push(((String(el.className).split(' ')[0]) || el.tagName) + ':' + o.toFixed(2)); } if (hid.length) out.stuckHidden = [...new Set(hid)].slice(0, 8); return out; });
    if (errs.length) r.errors = errs.slice(0, 3);
    if (Object.keys(r).length) console.log(`MOTION ${url} @${w}`, JSON.stringify(r));
    await c.close();
  }
}
if (mode === 'shots') {
  const list = (process.env.SHOTS || '/en/,/ar/,/en/services/,/ar/services/,/en/services/branding-creative-design/,/ar/services/branding-creative-design/,/en/services/creative-production/,/ar/services/creative-production/').split(',');
  for (const url of list) for (const [w, h] of [[1440, 900], [390, 844]]) {
    const mob = w < 768; const c = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce', isMobile: mob, hasTouch: mob, deviceScaleFactor: 1 });
    const p = await c.newPage(); await p.goto(base + url, { waitUntil: 'load' }); await wait(500);
    const H = await p.evaluate(() => document.documentElement.scrollHeight); for (let y = 0; y < H; y += h) { await p.evaluate((y) => window.scrollTo(0, y), y); await wait(120); } await p.evaluate(() => window.scrollTo(0, 0)); await wait(300);
    const name = url.replace(/^\/|\/$/g, '').replace(/\//g, '_').replace('services_', 'svc-') || 'root';
    await p.screenshot({ path: path.join(OUT, `${tag}-${name}-${w}.png`), fullPage: true }); await c.close();
  }
}
if (mode === 'links') {
  const files = await htmlFiles(DIST); const missing = new Map(); let n = 0;
  for (const f of files) { const html = await readFile(f, 'utf8'); const refs = new Set(); for (const m of html.matchAll(/(?:href|src|poster|data-video|data-src)="([^"]+)"/g)) refs.add(m[1]); for (const m of html.matchAll(/srcset="([^"]+)"/g)) m[1].split(',').forEach((s) => refs.add(s.trim().split(' ')[0])); for (const m of html.matchAll(/data-cycle="([^"]+)"/g)) m[1].split(',').forEach((s) => refs.add(s));
    for (let r of refs) { if (!r.startsWith('/') || r.startsWith('//')) { if (/^https?:/.test(r) && !r.startsWith('https://gate-33.com')) missing.set('EXTERNAL ' + r, f); continue; } n++; r = r.split('#')[0].split('?')[0]; let t = path.join(DIST, r); if (r.endsWith('/')) t = path.join(t, 'index.html'); try { await stat(t); } catch { const k = r; missing.set(k, (missing.get(k) || 0) + 1); } } }
  console.log('checked', n, 'refs in', files.length, 'files'); for (const [k, v] of missing) console.log('MISSING', k, v);
  // anchors
  for (const f of files) { const html = await readFile(f, 'utf8'); const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])); for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!ids.has(m[1])) console.log('DEAD ANCHOR', path.relative(DIST, f), '#' + m[1]); }
}
if (mode === 'seo') {
  const files = (await htmlFiles(DIST)).filter((f) => /\/(en|ar)\//.test(f)); const titles = new Map(), descs = new Map();
  for (const f of files) { const h = await readFile(f, 'utf8'); const g = (re) => (h.match(re) || [])[1]; const rel = '/' + path.relative(DIST, f).replace('index.html', '');
    const t = g(/<title>([^<]*)<\/title>/), d = g(/name="description" content="([^"]*)"/), can = g(/rel="canonical" href="([^"]*)"/), og = (h.match(/property="og:/g) || []).length, tw = (h.match(/name="twitter:/g) || []).length;
    const hl = [...h.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => m[1]).join(',');
    const flags = []; if (!t) flags.push('no title'); if (titles.has(t)) flags.push('dup title ' + titles.get(t)); titles.set(t, rel); if (!d) flags.push('no desc'); if (descs.has(d)) flags.push('dup desc'); descs.set(d, rel);
    if (can !== 'https://gate-33.com' + rel) flags.push('canonical ' + can); if (og < 4) flags.push('og=' + og); if (!tw) flags.push('no twitter');
    console.log(rel, `| t${t.length} d${(d || '').length} hl[${hl}]`, flags.join('; ')); }
  for (const f of ['robots.txt', 'sitemap.xml', 'sitemap-index.xml', '404.html']) { try { await stat(path.join(DIST, f)); console.log(f, 'present'); } catch { console.log(f, 'ABSENT'); } }
}
if (mode === 'weights') {
  for (const url of ['/en/', '/ar/', '/en/services/', '/en/services/branding-creative-design/', '/en/services/creative-production/', '/ar/services/creative-production/']) for (const [w, h] of [[1440, 900], [390, 844]]) {
    const mob = w < 768; const c = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mob, hasTouch: mob, deviceScaleFactor: mob ? 3 : 1 }); const p = await c.newPage();
    const by = {}; let total = 0; p.on('response', async (r) => { try { const len = +(r.headers()['content-length'] || 0); const t = r.request().resourceType(); by[t] = (by[t] || 0) + len; total += len; } catch {} });
    await p.goto(base + url, { waitUntil: 'networkidle' }); await wait(1500);
    const cls = await p.evaluate(() => new Promise((res) => { let v = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) v += e.value; }).observe({ type: 'layout-shift', buffered: true }); setTimeout(() => res(+v.toFixed(4)), 300); }));
    console.log(url, '@' + w, 'initial KB', Math.round(total / 1024), JSON.stringify(Object.fromEntries(Object.entries(by).map(([k, v]) => [k, Math.round(v / 1024)]))), 'CLS', cls); await c.close();
  }
}
if (mode === 'nojs') {
  for (const url of ['/en/', '/ar/services/', '/en/services/creative-production/']) for (const cfg of [{ javaScriptEnabled: false }, { reducedMotion: 'reduce' }]) {
    const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...cfg }); const p = await c.newPage(); await p.goto(base + url, { waitUntil: 'load' }); await wait(600);
    const r = await p.evaluate(() => { const hid = []; for (const el of document.querySelectorAll('main h1, main h2, main h3, main p, main li, main img, main .btn, header a')) { if (el.closest('[hidden],.visually-hidden,[aria-hidden=true]')) continue; let o = 1, a = el, vh = false; while (a && a !== document.documentElement) { const s = getComputedStyle(a); o *= +s.opacity; if (s.visibility === 'hidden' || s.display === 'none') vh = true; a = a.parentElement; } if (o < 0.9 || vh) hid.push(((String(el.className).split(' ')[0]) || el.tagName) + ':' + o.toFixed(2) + (vh ? ':hidden' : '')); } return [...new Set(hid)].slice(0, 12); });
    console.log(url, JSON.stringify(cfg), r.length ? 'HIDDEN ' + JSON.stringify(r) : 'all visible');
    const name = url.replace(/^\/|\/$/g, '').replace(/\//g, '_').replace('services_', 'svc-'); await p.screenshot({ path: path.join(OUT, `${cfg.reducedMotion ? 'rm' : 'nojs'}-${name}.png`), fullPage: true }); await c.close();
  }
}
if (mode === 'el') { // node scripts/qa-review.mjs el <tag> <url> <width> <selector> [rm|motion]
  const [, , , , url, w, sel, mm] = process.argv; const mob = +w < 768;
  const c = await browser.newContext({ viewport: { width: +w, height: mob ? 844 : 900 }, reducedMotion: mm === 'motion' ? 'no-preference' : 'reduce', isMobile: mob, hasTouch: mob }); const p = await c.newPage(); await p.goto(base + url, { waitUntil: 'load' }); await wait(400);
  const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await wait(mm === 'motion' ? 1800 : 300);
  await el.screenshot({ path: `/tmp/sheets/el-${tag}.png` }); console.log('ok', await el.boundingBox()); await c.close();
}
if (mode === 'func') {
  const log = (...a) => console.log(...a);
  // 1 language switch keeps the equivalent page
  { const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const p = await c.newPage(); let bad = 0;
    for (const url of PAGES) { await p.goto(base + url, { waitUntil: 'domcontentloaded' }); const href = await p.getAttribute('.header .lang-switch', 'href'); const want = url.startsWith('/en/') ? url.replace('/en/', '/ar/') : url.replace('/ar/', '/en/'); if (href !== want) { bad++; log('LANG SWITCH', url, '->', href); } }
    log('lang switch mismatches:', bad); await c.close(); }
  // 2 drawer preselects the service; focus trap; Esc returns focus; shots
  for (const [url, w] of [['/en/services/creative-production/', 1440], ['/ar/services/web-apps-business-systems/', 390], ['/en/', 1440]]) {
    const mob = w < 768; const c = await browser.newContext({ viewport: { width: w, height: mob ? 844 : 900 }, isMobile: mob, hasTouch: mob }); const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto(base + url, { waitUntil: 'load' }); await wait(2200);
    await p.locator('main [data-open-drawer]').first().click(); await wait(900);
    const st = await p.evaluate(() => { const d = document.querySelector('#proposal-drawer'); const sel = d.querySelector('[data-service-select]'); return { open: d.classList.contains('is-open'), service: sel.value, focusIn: d.contains(document.activeElement), active: document.activeElement.tagName + '.' + document.activeElement.className, inertMain: document.querySelector('main').hasAttribute('inert'), fields: d.querySelectorAll('input,select,textarea').length }; });
    log('DRAWER', url, w, JSON.stringify(st), errs);
    await p.screenshot({ path: `/tmp/sheets/func-drawer-${w}-${url.includes('/ar/') ? 'ar' : 'en'}${url.endsWith('/en/') ? '-home' : ''}.png` });
    for (let i = 0; i < 40; i++) await p.keyboard.press('Tab'); const still = await p.evaluate(() => document.querySelector('#proposal-drawer').contains(document.activeElement)); await p.keyboard.press('Escape'); await wait(600);
    const after = await p.evaluate(() => ({ open: document.querySelector('#proposal-drawer').classList.contains('is-open'), focus: document.activeElement.className, inert: document.querySelectorAll('[inert]').length })); log('  trap holds:', still, 'after Esc', JSON.stringify(after));
    await c.close(); }
  // 3 Home package button preselects? + mobile nav
  { const c = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const p = await c.newPage(); await p.goto(base + '/ar/services/', { waitUntil: 'load' }); await wait(1500);
    await p.locator('[data-open-nav]').click(); await wait(800); await p.screenshot({ path: '/tmp/sheets/func-nav-ar.png' });
    const st = await p.evaluate(() => { const n = document.querySelector('#nav-drawer'); const r = n.getBoundingClientRect(); return { open: n.classList.contains('is-open'), left: r.left, right: r.right, focusIn: n.contains(document.activeElement), links: n.querySelectorAll('a').length, hasLang: !!n.querySelector('.lang-switch,[hreflang]') }; }); log('NAV ar 390', JSON.stringify(st)); await c.close(); }
  // 4 Ask Gate: open, ask each chip, check links resolve; keyboard
  for (const [url, w] of [['/en/', 1440], ['/ar/services/branding-creative-design/', 390]]) {
    const mob = w < 768; const c = await browser.newContext({ viewport: { width: w, height: mob ? 844 : 900 }, isMobile: mob, hasTouch: mob }); const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    await p.goto(base + url, { waitUntil: 'load' }); await wait(1500); await p.evaluate(() => window.scrollTo(0, 1400)); await wait(1200);
    const lr = await p.evaluate(() => { const l = document.querySelector('[data-ag-launcher]'); const r = l.getBoundingClientRect(); return { in: l.classList.contains('is-in'), right: innerWidth - r.right, bottom: innerHeight - r.bottom, w: r.width }; }); log('AG launcher', url, w, JSON.stringify(lr));
    await p.locator('[data-ag-launcher]').click(); await wait(1600);
    const chips = await p.locator('[data-ag-chips] .ag-chip').count();
    for (let i = 0; i < chips; i++) { const ch = p.locator('[data-ag-chips] .ag-chip:not([hidden])').first(); if (!(await ch.count()) || !(await ch.isVisible())) break; await ch.click(); await wait(3800); }
    const fi = p.locator('#ag-q'); await fi.fill(url.includes('/ar/') ? 'كم سعر الهوية؟' : 'How much is a website?'); await p.keyboard.press('Enter'); await wait(4000);
    const st = await p.evaluate(() => { const pn = document.querySelector('#ag-panel'); const links = [...pn.querySelectorAll('.ag-log a[href]')].map((a) => a.getAttribute('href')); return { modal: pn.getAttribute('aria-modal'), msgs: pn.querySelectorAll('.ag-msg').length, links: [...new Set(links)], mainInert: document.querySelector('main').hasAttribute('inert'), expanded: document.querySelector('[data-ag-launcher]').getAttribute('aria-expanded') }; });
    log('AG', JSON.stringify(st), errs); await p.screenshot({ path: `/tmp/sheets/func-ag-${w}.png` });
    await p.keyboard.press('Escape'); await wait(900); log('  closed:', await p.evaluate(() => document.querySelector('#ag-panel').hidden), 'focus:', await p.evaluate(() => document.activeElement.className)); await c.close(); }
  // 5 FAQ keyboard
  { const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const p = await c.newPage(); await p.goto(base + '/en/services/ai-search-visibility/', { waitUntil: 'load' }); await wait(500);
    await p.locator('[data-faq-btn]').first().focus(); await p.keyboard.press('Enter'); await wait(200); const a = await p.evaluate(() => [...document.querySelectorAll('[data-faq-btn]')].map((b) => b.getAttribute('aria-expanded')).join(',')); await p.locator('[data-faq-btn]').nth(1).focus(); await p.keyboard.press('Space'); await wait(200); const b2 = await p.evaluate(() => [...document.querySelectorAll('[data-faq-btn]')].map((b) => b.getAttribute('aria-expanded')).join(',')); log('FAQ', a, '|', b2); await c.close(); }
}
if (mode === 'contrast') {
  for (const url of ['/en/', '/ar/', '/en/services/', '/en/services/branding-creative-design/', '/ar/services/creative-production/', '/en/services/ai-search-visibility/']) {
    const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const p = await c.newPage(); await p.goto(base + url, { waitUntil: 'load' }); await wait(400);
    const r = await p.evaluate(() => {
      const parse = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const a = m[1].split(/[, /]+/).map(Number); return { r: a[0], g: a[1], b: a[2], a: a[3] === undefined ? 1 : a[3] }; };
      const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
      const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
      const bgOf = (el) => { const st = []; let a = el; let img = false; while (a && a.nodeType === 1) { const s = getComputedStyle(a); const c = parse(s.backgroundColor); if (s.backgroundImage !== 'none' || a.matches('.hero, .work__frame, .svc-visual__frame')) img = true; if (c && c.a > 0) { st.push(c); if (c.a === 1) break; } a = a.parentElement; } let b = { r: 240, g: 237, b: 244, a: 1 }; for (let i = st.length - 1; i >= 0; i--) b = over(st[i], b); return { b, img }; };
      const out = new Map(); const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) { if (!n.nodeValue.trim()) continue; const el = n.parentElement; if (!el || el.closest('script,style,[hidden],.visually-hidden,.sheet,.ag,.hero,[aria-hidden=true]')) continue; const s = getComputedStyle(el); if (s.visibility === 'hidden' || s.display === 'none') continue; const { b, img } = bgOf(el); if (img) continue; let f = parse(s.color); if (!f) continue; let op = 1, a = el; while (a && a.nodeType === 1) { op *= +getComputedStyle(a).opacity; a = a.parentElement; } f = over({ ...f, a: f.a * op }, b); const L1 = lum(f), L2 = lum(b); const cr = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05); const size = parseFloat(s.fontSize), bold = +s.fontWeight >= 700; const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5; if (cr < need - 0.05) { const k = (String(el.className).split(' ')[0] || el.tagName) + ` ${size}px`; if (!out.has(k)) out.set(k, cr.toFixed(2) + ' "' + n.nodeValue.trim().slice(0, 22) + '"'); } }
      return [...out];
    });
    console.log(url, r.length ? JSON.stringify(r) : 'contrast ok'); await c.close();
  }
}
if (browser) await browser.close(); server.close();
