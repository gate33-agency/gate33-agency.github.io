// Flags headings whose lines end with a short word, or whose last line is a single word (orphan).
import { chromium } from 'playwright';
const EN = /^(a|an|the|to|of|in|on|at|by|for|and|or|&|with|from|your|our|its|is|as|we|one)$/i;
const AR = /^(في|من|على|إلى|عن|مع|أو|ثم|قد|لا|ما|كل|بين|حتى|منذ|و)$/;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
// Usage: node scripts/qa-linebreaks.mjs [base] [path ...]   e.g. ... http://localhost:4398 /en/services/ /ar/services/creative-production/
// Paths default to the two Home pages; the language comes from the path (/en/ or /ar/).
const base = process.argv[2] || 'http://localhost:8812';
const paths = process.argv.length > 3 ? process.argv.slice(3) : ['/en/', '/ar/'];
let total = 0;
for (const url of paths) for (const [w, h] of [[1440, 900], [1024, 768], [390, 844]]) {
  const lang = url.startsWith('/ar/') ? 'ar' : 'en';
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  await p.goto(`${base}${url}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
  const issues = await p.evaluate(({ en, ar, lang }) => {
    const re = new RegExp(lang === 'en' ? en : ar, lang === 'en' ? 'i' : '');
    const out = [];
    const els = [...document.querySelectorAll('h1,h2,h3,h4,.display,.h2,.h3,.statement,.lede,.srow__name,.pager__name,.quote__text p')].filter((e) => e.offsetParent && e.innerText.trim());
    for (const el of els) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); const words = [];
      while (walker.nextNode()) { const n = walker.currentNode; const rx = /\S+/g; let m; while ((m = rx.exec(n.data))) { const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length); const rect = r.getClientRects()[0]; if (rect) words.push({ t: m[0], top: Math.round(rect.top) }); } }
      if (!words.length) continue;
      const lines = []; for (const wd of words) { const L = lines[lines.length - 1]; if (L && Math.abs(L.top - wd.top) < 6) L.w.push(wd.t); else lines.push({ top: wd.top, w: [wd.t] }); }
      if (lines.length < 2) continue;
      lines.forEach((L, i) => { const last = L.w[L.w.length - 1].replace(/[.,،:;!?؟]$/, ''); if (i < lines.length - 1 && re.test(last)) out.push(`ends with "${last}": ${el.innerText.slice(0, 70)}`); });
      const lastLine = lines[lines.length - 1]; if (lastLine.w.length === 1 && lines.length > 1 && !el.matches('.lede,.statement') ) out.push(`orphan "${lastLine.w[0]}": ${el.innerText.slice(0, 70)}`);
    }
    return out;
  }, { en: EN.source, ar: AR.source, lang });
  total += issues.length;
  if (issues.length || w === 1440) console.log(`${url} ${w}px — ${issues.length}`); issues.forEach((i) => console.log('  ' + i.replace(/\n/g, ' / ')));
  await p.close();
}
await b.close(); console.log('\nTOTAL', total);
