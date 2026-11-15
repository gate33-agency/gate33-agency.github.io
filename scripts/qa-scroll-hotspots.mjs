// Where do slow frames happen? Native wheel scroll at 4x CPU throttle; reports frames > 33ms per section. Usage: node scripts/qa-scroll-hotspots.mjs <base> <path>
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:8812'; const path = process.argv[3] || '/en/';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const cdp = await p.context().newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await p.goto(`${base}${path}?smooth=off`, { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
await p.evaluate(() => { window.__f = []; let last = performance.now(); const secs = [...document.querySelectorAll('main > section, footer')];
  const tick = (t) => { const d = t - last; last = t; const mid = innerHeight / 2; const s = secs.find((x) => { const r = x.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; }); window.__f.push([d, s ? (s.id || s.className.split(' ').slice(0, 2).join('.')) : '?']); requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
await p.mouse.move(700, 450);
for (let i = 0; i < 460; i++) { await p.mouse.wheel(0, 28); await p.waitForTimeout(8); }
await p.waitForTimeout(800);
const r = await p.evaluate(() => { const o = {}; for (const [d, s] of window.__f.slice(5)) { o[s] = o[s] || { n: 0, slow: 0, max: 0 }; o[s].n++; if (d > 33.4) o[s].slow++; o[s].max = Math.max(o[s].max, Math.round(d)); } return o; });
console.log(path, JSON.stringify(r)); await b.close();
