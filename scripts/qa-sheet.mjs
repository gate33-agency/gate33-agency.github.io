// contact sheet: split a tall screenshot into columns side by side
import sharp from 'sharp';
const [src, out, colsArg, colW] = process.argv.slice(2);
const img = sharp(src); const m = await img.metadata(); const cols = +colsArg; const ch = Math.ceil(m.height / cols); const cw = +colW; const sc = cw / m.width; const sh = Math.round(ch * sc);
const parts = [];
for (let i = 0; i < cols; i++) { const top = i * ch; const h = Math.min(ch, m.height - top); if (h <= 0) break; parts.push({ input: await sharp(src).extract({ left: 0, top, width: m.width, height: h }).resize({ width: cw }).png().toBuffer(), left: i * (cw + 8), top: 0 }); }
await sharp({ create: { width: cols * (cw + 8), height: sh, channels: 3, background: '#ff00ff' } }).composite(parts).jpeg({ quality: 80 }).toFile(out);
console.log(out, m.width, m.height);
