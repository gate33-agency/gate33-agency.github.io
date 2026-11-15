// join images side by side at a common height: node scripts/qa-join.mjs out.jpg height a.png b.png ...
import sharp from 'sharp';
const [out, h, ...files] = process.argv.slice(2); const parts = []; let x = 0;
for (const f of files) { const b = await sharp(f).resize({ height: +h }).png().toBuffer(); const m = await sharp(b).metadata(); parts.push({ input: b, left: x, top: 0 }); x += m.width + 8; }
await sharp({ create: { width: x, height: +h, channels: 3, background: '#ff00ff' } }).composite(parts).jpeg({ quality: 82 }).toFile(out);
