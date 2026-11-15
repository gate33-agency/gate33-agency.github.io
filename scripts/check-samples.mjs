// Launch guard for sample data (placeholder policy rule 6).
//   node scripts/check-samples.mjs               -> loud warning listing every sample item while SAMPLE is true (exit 0)
//   node scripts/check-samples.mjs --production  -> FAILS (exit 1) while SAMPLE is true
// Used by `npm run build` and `npm run build:production`. Loads src/data/placeholders.ts with Node's type stripping.
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const prod = process.argv.includes('--production');
const m = await import(pathToFileURL(path.resolve('src/data/placeholders.ts')).href);
const items = m.sampleItems();
const bar = '!'.repeat(78);
if (!m.SAMPLE) { console.log('[samples] SAMPLE = false: no sample data in this build.'); process.exit(0); }
const out = prod ? console.error : console.warn;
out(`\n${bar}\n!! SAMPLE DATA IS ON (src/data/placeholders.ts: SAMPLE = true)\n!! ${items.length} sample items render with a visible "Sample / نموذج تجريبي" marker.\n!! Replace them with Shifaa's real figures, then set SAMPLE = false before launch.\n${bar}`);
items.forEach((i) => out(`   - ${i}`));
out(bar + '\n');
if (prod) { console.error('build:production refused: SAMPLE is true. Nothing was built.\n'); process.exit(1); }
