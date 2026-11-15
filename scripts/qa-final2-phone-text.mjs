// Final 2: finds text that runs past its box or the screen on phones (390 + 360). Needs dist served on 8812. Usage: node scripts/qa-final2-phone-text.mjs [paths]
import { chromium } from 'playwright';
import { readdirSync, statSync } from 'node:fs'; import path from 'node:path';
function pages(dir, out = []) { for (const e of readdirSync(dir)) { const f = path.join(dir, e); if (statSync(f).isDirectory()) pages(f, out); else if (e === 'index.html') out.push('/' + path.relative('/home/claude/gate33-website/dist', dir) + '/'); } return out; }
const list = process.argv.length > 2 ? process.argv.slice(2) : pages('/home/claude/gate33-website/dist').filter((p) => p !== '//');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const widths = (process.env.WS || '390,360').split(',').map(Number); let n = 0;
for (const w of widths) { const c = await b.newContext({ viewport: { width: w, height: 844 }, reducedMotion: 'reduce' }); const p = await c.newPage();
for (const url of list) { await p.goto('http://localhost:8812' + url + '?entry=off', { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => { const out = []; const vw = document.documentElement.clientWidth;
    for (const el of document.querySelectorAll('h1,h2,h3,h4,.btn,.tag,p,li,dt,dd,label,th,td,figcaption')) { const s = getComputedStyle(el); if (s.display === 'none' || el.closest('[hidden],details:not([open]) > :not(summary)')) continue; const eb = el.getBoundingClientRect(); if (!eb.width) continue; if (el.closest('.visually-hidden,[aria-hidden=true],[inert]')) continue; let a = el.parentElement, skip = false; while (a && a !== document.body) { const st = getComputedStyle(a); if (st.position === 'fixed' || /(auto|scroll|hidden|clip)/.test(st.overflowX)) { skip = true; break; } a = a.parentElement; } if (skip) continue;
      const rg = document.createRange(); rg.selectNodeContents(el); let worst = 0; for (const x of rg.getClientRects()) { worst = Math.max(worst, x.right - Math.min(eb.right, vw), Math.max(eb.left, 0) - x.left); }
      if (worst > 1.5) out.push(`${el.tagName}.${String(el.className).split(' ')[0]} +${Math.round(worst)} "${el.textContent.trim().slice(0, 40).replace(/ /g, '_')}"`); }
    return out; });
  if (r.length) { n += r.length; console.log(w, url, JSON.stringify([...new Set(r)].slice(0, 5))); } }
await c.close(); }
console.log('total', n); await b.close();
