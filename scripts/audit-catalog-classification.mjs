import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const corrections=JSON.parse(await fs.readFile(new URL('docs/catalog-audit/corrections.json',root),'utf8'));
// Preserve the catalogue IDs, paths and image bytes; correct only audited metadata.
const {IMPORTED_DESIGNS}=await import('../shared/importedDesigns.mjs');
const updated=IMPORTED_DESIGNS.map(design=>{
 const correction=corrections[design.id];if(!correction)return design;
 const {reason,...fields}=correction;
 return {...design,...fields,classificationStatus:fields.classificationStatus||'reviewed'};
});
for(const design of updated){
 const correction=corrections[design.id];if(!correction)continue;
 const file=new URL(`docs/imported-artwork/completed/${design.id}.json`,root);
 const record=JSON.parse(await fs.readFile(file,'utf8'));
 const {reason,...fields}=correction;
 record.classificationReview={date:'2026-11-14',status:fields.classificationStatus||'reviewed',reason,previous:record.classificationReview?.previous||{name:record.name,collection:record.collection,group:record.group}};
 Object.assign(record,fields);
 await fs.writeFile(file,JSON.stringify(record,null,2)+'\n');
}
await fs.writeFile(new URL('shared/importedDesigns.mjs',root),'// Recreaciones del ZIP; clasificación contrastada con las imágenes en docs/catalog-audit/.\nexport const IMPORTED_DESIGNS = '+JSON.stringify(updated,null,2)+';\n');
// Import only after saving the corrected source in a fresh module instance.
const {DESIGNS}=await import('../shared/designs.mjs?audit='+Date.now());
const {classifyDesign}=await import('../shared/designCategories.mjs');
const byId=new Map(updated.map(d=>[d.id,d]));
const rows=[];
for(const raw of DESIGNS){
 const design=classifyDesign(byId.get(raw.id)||raw);
 const bytes=await fs.readFile(new URL('frontend/public'+design.src,root));
 rows.push({id:design.id,src:design.src,name:design.name,category:design.group,subcategory:design.subcategory,status:design.classificationStatus||'reviewed',sha256:createHash('sha256').update(bytes).digest('hex'),method:'Revisión visual en hoja de contacto; ampliación de discrepancias.',note:corrections[design.id]?.reason||'Sin discrepancia de categoría apreciable en la revisión visual.'});
}
await fs.writeFile(new URL('docs/catalog-audit/review.json',root),JSON.stringify({date:'2026-11-14',count:rows.length,corrections:Object.keys(corrections).length,designs:rows},null,2)+'\n');
console.log(`Clasificación revisada: ${rows.length} diseños; ${Object.keys(corrections).length} correcciones documentadas.`);
