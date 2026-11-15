// Trackpad-like scrolling (many small wheel deltas) through a page; reports frame pacing with and without Lenis.
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:8812';
const path = process.argv[3] || '/en/';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
for (const mode of ['on', 'off']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const cdp = await p.context().newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`${base}${path}?smooth=${mode}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
  await p.evaluate(() => { window.__f = []; let last = performance.now(); const tick = (t) => { window.__f.push(t - last); last = t; requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
  await p.mouse.move(700, 450);
  const t0 = Date.now();
  for (let i = 0; i < 420; i++) { await p.mouse.wheel(0, 28); await p.waitForTimeout(8); } // ~11,700px in small steps
  const elapsed = Date.now() - t0; await p.waitForTimeout(1500);
  const r = await p.evaluate(() => { const f = window.__f.slice(5).sort((a, b) => a - b); const q = (x) => f[Math.floor(f.length * x)]; return { frames: f.length, p50: q(0.5), p95: q(0.95), p99: q(0.99), max: f[f.length - 1], over33: f.filter((x) => x > 33.4).length, y: Math.round(scrollY), lenis: document.documentElement.classList.contains('lenis') }; });
  console.log(`smooth=${mode}`, JSON.stringify({ ...r, p50: +r.p50.toFixed(1), p95: +r.p95.toFixed(1), p99: +r.p99.toFixed(1), max: +r.max.toFixed(0) }), 'input ms', elapsed, errs);
  await p.close();
}
await b.close();
