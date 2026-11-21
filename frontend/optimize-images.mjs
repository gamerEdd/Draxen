import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
export default function optimizeImages() {
  let output;
  let version;
  return {
    name: 'draxen-webp',
    apply: 'build',
    async configResolved(config) {
      output = path.resolve(config.root, config.build.outDir);
      const hash = createHash('sha256');
      hash.update('draxen-assets-v2-staged-publish');
      async function fingerprint(dir) {
        const entries = (await fs.readdir(dir, {withFileTypes: true})).sort((a,b)=>a.name.localeCompare(b.name));
        for (const entry of entries) {
          const file = path.join(dir, entry.name);
          if (entry.isDirectory()) await fingerprint(file);
          else if (entry.name.endsWith('.png')) { hash.update(file); hash.update(await fs.readFile(file)); }
        }
      }
      await fingerprint(path.join(config.root, 'public/assets'));
      version = hash.digest('hex').slice(0, 12);
    },
    transform(code, id) {
      // The recovery component must retain its literal PNG fallback extension.
      if (!id.includes('node_modules') && !id.endsWith('/DesignImage.jsx') && /\.(jsx?|mjs)$/.test(id)) {
        return code.replace(/\.png(?=['"`])/g, `.webp?v=${version}`);
      }
    },
    async closeBundle() {
      let before = 0, after = 0, count = 0;
      async function walk(dir) {
        for (const entry of await fs.readdir(dir, {withFileTypes: true})) {
          const file = path.join(dir, entry.name);
          if (entry.isDirectory()) { await walk(file); continue; }
          if (!entry.name.endsWith('.png')) continue;
          const width = file.includes(path.sep + 'designs' + path.sep) ? 800 : 1400;
          const result = await sharp(file).rotate().resize({width, withoutEnlargement: true}).webp({quality: 82, alphaQuality: 95}).toFile(file.replace(/\.png$/, '.webp'));
          if (file.includes(path.sep + 'designs' + path.sep)) {
            await sharp(file).rotate().resize({width: 200, height: 200, fit: 'inside', withoutEnlargement: true}).webp({quality: 78, alphaQuality: 100}).toFile(file.replace(/\.png$/, '.thumb.webp'));
          }
          before += (await fs.stat(file)).size; after += result.size; count++;
        }
      }
      await walk(path.join(output, 'assets'));
      console.log('WebP: ' + count + ' images, ' + (before/1048576).toFixed(1) + ' MB -> ' + (after/1048576).toFixed(1) + ' MB');
    }
  };
}
