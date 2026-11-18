// Strip any UTF-8 BOM from the Markdown resume sources so /bio.md and
// /bio-en.md begin exactly with their first character (no EF BB BF).
// The host already serves them as `text/markdown; charset=utf-8`
// (see public/_headers), so a BOM is not needed for decoding.
// Runs automatically before `npm run dev` and `npm run build`.
import fs from 'node:fs';

const files = ['public/bio.md', 'public/bio-en.md'];
const BOM = Buffer.from([0xef, 0xbb, 0xbf]);
let stripped = 0;

for (const f of files) {
  try {
    const buf = fs.readFileSync(f);
    if (buf.subarray(0, 3).equals(BOM)) {
      fs.writeFileSync(f, buf.subarray(3));
      stripped++;
      console.log('[ensure-md-bom] BOM stripped ->', f);
    }
  } catch (err) {
    console.warn('[ensure-md-bom] skipped', f, '-', err.message);
  }
}
console.log('[ensure-md-bom] done; stripped', stripped);
