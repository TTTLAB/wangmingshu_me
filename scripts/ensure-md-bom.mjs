// Ensure the Markdown resume sources start with a UTF-8 BOM so browsers
// that receive text/markdown without a charset still decode them as UTF-8.
// Runs automatically before `npm run dev` and `npm run build`.
import fs from 'node:fs';

const files = ['public/bio.md', 'public/bio-en.md'];
const BOM = Buffer.from([0xef, 0xbb, 0xbf]);
let added = 0;

for (const f of files) {
  try {
    const buf = fs.readFileSync(f);
    if (buf.subarray(0, 3).equals(BOM)) {
      continue;
    }
    fs.writeFileSync(f, Buffer.concat([BOM, buf]));
    added++;
    console.log('[ensure-md-bom] BOM added ->', f);
  } catch (err) {
    console.warn('[ensure-md-bom] skipped', f, '-', err.message);
  }
}
console.log('[ensure-md-bom] done; added', added);
