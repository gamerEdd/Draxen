import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { DESIGNS } from '../shared/designs.mjs';
const root = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(new URL('../frontend/package.json', import.meta.url));
const sharp = require('sharp');
const errors = [];
let checked = 0;
for (const design of DESIGNS) {
  const filename = path.join(root, 'frontend/public', design.src);
  try {
    const metadata = await sharp(filename, {failOn: 'warning'}).metadata();
    // Decode the entire image: metadata alone does not detect truncated data.
    const stats = await sharp(filename, {failOn: 'warning'}).stats();
    if (!metadata.hasAlpha || stats.isOpaque) throw new Error('Falta transparencia real');
    if (metadata.width < 512 || metadata.height < 512) throw new Error('Resolución inferior a 512 px');
    checked++;
  } catch (error) { errors.push({id: design.id, error: error.message}); }
}
const report = {checked, total: DESIGNS.length, errors};
await fs.mkdir(path.join(root, 'docs/metal-slug'), {recursive: true});
await fs.writeFile(path.join(root, 'docs/metal-slug/image-audit.json'), JSON.stringify(report, null, 2)+'\n');
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
