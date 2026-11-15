// Client logo strip assets (Stage 3). Source is read-only; output: public/images/clients/
// Each logo -> <slug>-color.webp (official artwork, transparent, trimmed) + <slug>-ink.webp (one-colour ink silhouette
// for the default monochrome state; near-white parts become transparent so detail like inner lines survives).
// Safety: Coordinate is cropped to mark + "COORDINATE" (the sub-line and phone number are removed; the Hebrew page is
// never used). Olla uses the logo-only page (no address/phone). Abdo uses page 1 only (Arabic/English lock-up).
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = process.env.G33_SRC || '/mnt/user-data/uploads/Gate 33';
const WM = `${SRC}/Web Media`;
const OUT = path.resolve('public/images/clients');
const TMP = '/tmp/g33-clients';
mkdirSync(OUT, { recursive: true }); mkdirSync(TMP, { recursive: true });
const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'ignore', 'inherit'] });

const pdf = (file, page) => ({ kind: 'pdf', file, page });
const LOGOS = {
  cyrin: { kind: 'png', file: `${WM}/Cyrin - Branding Project/Logo Files/PNGs/Logo Files-01.png` },
  plutrex: { kind: 'png', file: `${WM}/Plutrex - Branding Project/Logo files/PNGs/Plutrex-01.png` },
  zakharef: { kind: 'svg', file: `${WM}/زخارف/Logo-File/RGB/Full Lockup/Horizontal Logo/SVG/Horizontal-Standard-Color.svg` },
  'the-point-en': { kind: 'svg', file: `${WM}/the point/The Point - LogoFiles/04 Wordmark/01 Digital/01 Full-Colour/Full-Colour-E_1.svg` },
  'the-point-ar': { kind: 'svg', file: `${WM}/the point/The Point - LogoFiles/04 Wordmark/01 Digital/01 Full-Colour/Full-Colour-A_1.svg` },
  abdo: { ...pdf(`${WM}/abdo logo/abdo logo.pdf`, 1), inkOnly: true }, // black logo on a light plate -> plate removed
  nilam: pdf(`${WM}/nilam logo/nilam logo.pdf`, 1),
  eureka: pdf(`${WM}/logo/logo.pdf`, 1),
  shehade: pdf(`${WM}/shehade-logo/shehade-logo.pdf`, 1),
  'marah-saadi': pdf(`${WM}/logo 2/logo.pdf`, 1), // p1 = correct "PHOTOGRAPHY" spelling
  fairuz: pdf(`${WM}/fairuz-logo/fairuz-logo.pdf`, 1),
  'lina-board': pdf(`${WM}/lina-logo/lina-logo.pdf`, 1),
  'yara-amara': pdf(`${WM}/f-yara-logo/f-yara-logo.pdf`, 1),
  olla: pdf(`${WM}/olla esmeir Branding Project/Logo Files/Logo Files.pdf`, 5),
  coordinate: { ...pdf(`${WM}/coordinate-logo-n/coordinate-logo-n.pdf`, 3), keepBands: 2 },
};

async function load(slug, l) {
  const png = `${TMP}/${slug}.png`;
  if (l.kind === 'pdf') run('pdftocairo', ['-q', '-f', String(l.page), '-l', String(l.page), '-png', '-transp', '-singlefile', '-scale-to', '1600', l.file, png.replace(/\.png$/, '')]);
  else if (l.kind === 'svg') run('rsvg-convert', ['-w', '1600', l.file, '-o', png]);
  else return sharp(l.file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

// ink: rgb -> black; alpha scaled by darkness so white/near-white areas drop out.
function toInk(data) {
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    const L = (0.2126 * out[i] + 0.7152 * out[i + 1] + 0.0722 * out[i + 2]) / 255;
    const k = Math.max(0, Math.min(1, (0.93 - L) / 0.18));
    out[i] = out[i + 1] = out[i + 2] = 15; out[i + 3] = Math.round(out[i + 3] * k);
  }
  return out;
}

// horizontal bands of visible rows (for cropping sub-lines off a lock-up)
function bands(data, w, h) {
  const res = []; let start = -1;
  for (let y = 0; y < h; y++) {
    let any = false;
    for (let x = 0; x < w; x++) if (data[(y * w + x) * 4 + 3] > 24) { any = true; break; }
    if (any && start < 0) start = y;
    if (!any && start >= 0) { res.push([start, y]); start = -1; }
  }
  if (start >= 0) res.push([start, h]);
  return res.filter(([a, b]) => b - a > 3);
}

async function save(buf, info, name) {
  const img = sharp(buf, { raw: { width: info.width, height: info.height, channels: 4 } });
  const trimmed = await img.png().toBuffer().then((b) => sharp(b).trim({ threshold: 1 }).png().toBuffer());
  await sharp(trimmed).resize({ width: 640, height: 280, fit: 'inside', withoutEnlargement: true }).webp({ quality: 90, alphaQuality: 100 }).toFile(`${OUT}/${name}.webp`);
  const m = await sharp(`${OUT}/${name}.webp`).metadata();
  return [m.width, m.height];
}

const sizes = {};
for (const [slug, l] of Object.entries(LOGOS)) {
  let { data, info } = await load(slug, l);
  if (l.inkOnly) data = toInk(data);
  if (l.keepBands) {
    const b = bands(data, info.width, info.height);
    const cut = b[l.keepBands - 1][1] + 2; // keep the first N bands, drop the rest (sub-line, phone)
    data = data.subarray(0, cut * info.width * 4); info = { ...info, height: cut };
    console.log(slug, 'bands', b, '-> cut at', cut);
  }
  sizes[slug] = await save(l.inkOnly ? data : Buffer.from(data), info, `${slug}-color`);
  await save(toInk(data), info, `${slug}-ink`);
}
console.log(JSON.stringify(sizes));
