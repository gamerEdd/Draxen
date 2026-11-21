import { readFile, writeFile, access } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('docs/drop100/manifest.json', root), 'utf8'));
if (manifest.length !== 100 || new Set(manifest.map(d => d.id)).size !== 100) throw new Error('El manifiesto debe contener 100 diseños únicos.');
for (const design of manifest) await access(new URL(`frontend/public${design.src}`, root));
const entries = manifest.map(({ id, name, collection, group, accent, priority, src }) => ({ id, name, collection, group, accent, priority, src }));
await writeFile(new URL('shared/drop100.mjs', root), '// Catálogo generado desde docs/drop100/manifest.json.\nexport const DROP100_DESIGNS = ' + JSON.stringify(entries, null, 2) + ';\n');
await writeFile(new URL('docs/drop100/completed.json', root), JSON.stringify(entries.map(({id,src}) => ({id,src})), null, 2) + '\n');
console.log('Registrados 100 estampados locales.');
