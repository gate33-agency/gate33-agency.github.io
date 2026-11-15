// Reproducible asset pipeline: PDFs -> WebP, fonts -> woff2, video -> mp4.
// Source (read-only): /mnt/user-data/uploads/Gate 33/   Output: public/
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync, readdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import wawoff from 'wawoff2';

const SRC = process.env.G33_SRC || '/mnt/user-data/uploads/Gate 33';
const WM = `${SRC}/Web Media`;
const OUT = path.resolve('public');
const TMP = '/tmp/g33-render';
mkdirSync(TMP, { recursive: true });
const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'ignore', 'inherit'] });

// slug -> [pdf, [pages]]. Pages chosen from contact sheets; Hebrew / +972 pages excluded.
const PDFS = {
  cyrin: [`${WM}/Cyrin - Branding Project/Presenation/CYRIN - logo Design.pdf`, [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]],
  // Plutrex pp. 1, 31-33, 38, 55 show personal data (address, named person, ID) -> never rendered
  // Case page (4B-3) adds 12 logo on dark, 13 icon, 19-20 colour, 35 website, 36 app icon, 47 keychain, 48 building, 54 packaging
  plutrex: [`${WM}/Plutrex - Branding Project/Plutrex - Brand Guidelines/Plutrex - Brand Guidelines.pdf`, [11, 12, 13, 19, 20, 26, 27, 35, 36, 43, 47, 48, 53, 54]],
  // Case page (4B-3) adds 3 concept, 4 construction, 5 lock-ups, 6 colour, 8 type. Not used: 2 (brief text), 11-12 (web address, social handle)
  zakharef: [`${WM}/زخارف/زخارف - Presentation.pdf`, [1, 3, 4, 5, 6, 7, 8, 12, 13, 14, 15]],
  // The Point (4B-3): Important details.pdf p.2 colour, p.3 typeface. p.1 is a file-format guide. "Cover Facebook.jpg" is never used (phone numbers).
  'the-point': [`${WM}/the point/The Point - LogoFiles/Important details.pdf`, [2, 3]],
  // Abdo: slides 5, 6, 7 contain Hebrew text -> never rendered
  abdo: [`${WM}/abdo logo/abdo logo.pdf`, [1, 2, 3, 4, 8, 9, 10, 11]],
};
const WIDTHS = [480, 800, 1200, 1600];
// G33_ONLY=plutrex,zakharef renders only those PDF slugs (and that slug's extra step below) and skips fonts, logos and
// video, so adding pages to one case does not re-encode everything. Unset = full rebuild.
const ONLY = process.env.G33_ONLY ? process.env.G33_ONLY.split(',') : null;
const want = (k) => !ONLY || ONLY.includes(k);

async function toWebp(input, slug, name, widths = WIDTHS, extra = {}) {
  const dir = `${OUT}/images/${slug}`; mkdirSync(dir, { recursive: true });
  const meta = await sharp(input).metadata();
  for (const w of widths) {
    if (w > meta.width && w !== widths[0]) continue;
    let img = sharp(input);
    if (extra.trim) img = img.trim({ threshold: 12 });
    await img.resize({ width: Math.min(w, meta.width) }).webp({ quality: 82 }).toFile(`${dir}/${name}-${w}.webp`);
  }
}

// 1) PDF pages
for (const [slug, [pdf, pages]] of Object.entries(PDFS)) {
  if (!want(slug)) continue;
  for (const p of pages) {
    const base = `${TMP}/${slug}-${p}`;
    run('pdftoppm', ['-f', String(p), '-l', String(p), '-scale-to', '1700', '-png', '-singlefile', pdf, base]);
    await toWebp(`${base}.png`, slug, `p${String(p).padStart(2, '0')}`);
  }
}
// The Point cover (4B-3): one frame of the logo animation at 2.0 s (the winged stroke flying into the P; the same frame in
// both language versions, no lettering yet), 1920x1080 source.
if (want('the-point')) {
  run('ffmpeg', ['-v', 'error', '-y', '-ss', '2', '-i', `${WM}/the point/logo-gif/The point English.mp4`, '-frames:v', '1', `${TMP}/the-point-cover.png`]);
  await toWebp(`${TMP}/the-point-cover.png`, 'the-point', 'cover');
}
// Coffee film page stills (4B-3): single frames from the source film, letterbox cropped like the film. Chosen at 19.5 s
// (founder portrait, no shirt logo), 31 s (hand raking beans in the roaster), 44 s (beans in the air), 47 s (espresso
// tamper). Never from 0:38-0:42 (landmark), never frames with the shirt logo, street signage or the second landmark (~1:02).
if (want('coffee-film')) {
  const SRC_FILM = `${WM}/מכון היצוא-20261108T061833Z-1-001/מכון היצוא/VIDEO-2023-11-01-13-37-43.mp4`;
  for (const [ss, n] of [['19.5', 'founder'], ['31', 'raking'], ['44', 'beans'], ['47', 'tamper']]) {
    if (+ss >= 38 && +ss <= 42) throw new Error('coffee film 0:38-0:42 is excluded');
    run('ffmpeg', ['-v', 'error', '-y', '-ss', ss, '-i', SRC_FILM, '-vf', 'crop=1280:544:0:88', '-frames:v', '1', `${TMP}/coffee-${n}.png`]);
    await toWebp(`${TMP}/coffee-${n}.png`, 'coffee-film', n, [480, 800, 1200]);
  }
}
if (ONLY) { console.log('assets done (only: ' + ONLY.join(', ') + ')'); process.exit(0); }
// zakharef mockup photos
for (const [f, n] of [['flag.jpg', 'flag'], ['Paper-Bag-.jpg', 'paper-bag']]) {
  await toWebp(`${WM}/زخارف/Mockup - Social/Mockup/${f}`, 'zakharef', n);
}
// 2) client logos: see scripts/build-client-logos.mjs (npm run logos) -> public/images/clients
// 3) Blender renders
for (const n of ['01', '03', '05']) await toWebp(`${SRC}/Blender/${n}.png`, 'brand', `hex-${n}`, [800, 1600]);

// 4) fonts -> woff2
mkdirSync(`${OUT}/fonts`, { recursive: true });
for (const f of readdirSync(`${SRC}/Fonts`)) {
  const out = `${OUT}/fonts/${f.replace(/\.(ttf|otf)$/i, '').toLowerCase()}.woff2`;
  writeFileSync(out, Buffer.from(await wawoff.compress(readFileSync(`${SRC}/Fonts/${f}`))));
}
// 5) logos (official, unmodified copies)
mkdirSync(`${OUT}/images/logo`, { recursive: true });
for (const f of ['primary', 'black', 'white']) run('cp', [`${SRC}/Claude outputs/gate33-logo-${f}.svg`, `${OUT}/images/logo/gate33-logo-${f}.svg`]);
run('cp', [`${SRC}/Claude outputs/gate33-icon-purple.svg`, `${OUT}/images/logo/gate33-icon-purple.svg`]);

// 6) video
mkdirSync(`${OUT}/video`, { recursive: true });
const COFFEE = `${WM}/מכון היצוא-20261108T061833Z-1-001/מכון היצוא/VIDEO-2023-11-01-13-37-43.mp4`;
// start after the opening (Hebrew shop sign in the first shots); stop before street shots with signage.
// Letterbox bars removed (crop 1280x544). Source is 1280x720 so output stays at native resolution (no upscaling).
// Film = source 8-15s + 18-25s (beans, roaster, founder portraits). Skipped: 0-8s (Hebrew shop sign, shop interior),
// 15-18s (wide roastery shot with small unreadable label), 26s+ (street shots with signage, a flag).
const CROP = 'crop=1280:544:0:88';
const enc = ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an'];
run('ffmpeg', ['-v', 'error', '-y', '-i', COFFEE, '-filter_complex',
  `[0:v]trim=8:15,setpts=PTS-STARTPTS,${CROP}[a];[0:v]trim=18:25,setpts=PTS-STARTPTS,${CROP}[b];[a][b]concat=n=2:v=1:a=0[v]`,
  '-map', '[v]', ...enc, `${OUT}/video/coffee-film.mp4`]);
run('ffmpeg', ['-v', 'error', '-y', '-ss', '8', '-t', '7', '-i', COFFEE, '-vf', CROP, ...enc, `${OUT}/video/coffee-loop.mp4`]);
run('ffmpeg', ['-v', 'error', '-y', '-ss', '10', '-i', COFFEE, '-vf', CROP, '-frames:v', '1', `${TMP}/coffee-poster.png`]);
await toWebp(`${TMP}/coffee-poster.png`, 'video', 'coffee-poster', [800, 1280]);
const PT = `${WM}/the point/logo-gif`;
for (const [l, n] of [['English', 'the-point-en'], ['Arabic', 'the-point-ar']]) {
  run('ffmpeg', ['-v', 'error', '-y', '-i', `${PT}/The point ${l}.mp4`, ...enc, `${OUT}/video/${n}.mp4`]);
  run('ffmpeg', ['-v', 'error', '-y', '-sseof', '-0.3', '-i', `${PT}/The point ${l}.mp4`, '-frames:v', '1', '-update', '1', `${TMP}/${n}.png`]);
  await toWebp(`${TMP}/${n}.png`, 'video', `${n}-poster`, [800, 1280]);
}
console.log('assets done');
