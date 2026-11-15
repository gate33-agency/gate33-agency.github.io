// Subsets the Montserrat files to the Latin set the site uses (Stage R). Originals live in assets-src/fonts (not published).
// Needs: wawoff2 (devDependency) + Python fontTools (pyftsubset). Usage: node scripts/subset-fonts.mjs
import wawoff2 from 'wawoff2';
import { readFile, writeFile, readdir, mkdtemp } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
const SRC = 'assets-src/fonts', OUT = 'public/fonts';
// Basic Latin, Latin-1, a few Latin Extended letters, typographic punctuation, currency, arrows, minus, trademark.
const UNICODES = 'U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+0160-0161,U+0178,U+017D-017E,U+02C6,U+02DA,U+02DC,U+2010-2015,U+2018-201E,U+2020-2022,U+2026,U+2030,U+2032-2033,U+2039-203A,U+2044,U+20AC,U+2122,U+2190-2193,U+2212,U+2215';
const tmp = await mkdtemp(path.join(tmpdir(), 'g33-fonts-'));
for (const f of (await readdir(SRC)).filter((x) => x.endsWith('.woff2'))) {
  const ttf = path.join(tmp, f.replace('.woff2', '.ttf')), sub = path.join(tmp, f.replace('.woff2', '.sub.ttf'));
  const src = await readFile(path.join(SRC, f));
  await writeFile(ttf, await wawoff2.decompress(src));
  execFileSync('pyftsubset', [ttf, `--unicodes=${UNICODES}`, '--layout-features=*', '--no-hinting', `--output-file=${sub}`]);
  const out = Buffer.from(await wawoff2.compress(await readFile(sub)));
  await writeFile(path.join(OUT, f), out);
  console.log(f, Math.round(src.length / 1024) + ' KB ->', Math.round(out.length / 1024) + ' KB');
}
process.exit(0);
