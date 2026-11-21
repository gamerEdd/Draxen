import fs from 'node:fs/promises';
const directory=new URL('../docs/imported-artwork/completed/',import.meta.url);
const entries=[];
for(const file of (await fs.readdir(directory)).filter(f=>f.endsWith('.json')).sort()){
 const record=JSON.parse(await fs.readFile(new URL(file,directory),'utf8'));
 if(record.status!=='approved')continue;
 await fs.access(new URL('../frontend/public'+record.src,import.meta.url));
 entries.push({id:record.id,name:record.name+(record.side==='back'?' · Espalda':''),collection:record.collection,group:record.group,accent:'#c7c497',priority:-7,src:record.src,referenceIndex:record.n,...(record.classificationStatus?{classificationStatus:record.classificationStatus}:{})});
}
await fs.writeFile(new URL('../shared/importedDesigns.mjs',import.meta.url),'// Recreaciones revisadas del ZIP aportado por el usuario.\nexport const IMPORTED_DESIGNS = '+JSON.stringify(entries,null,2)+';\n');
await fs.writeFile(new URL('../docs/imported-artwork/progress.json',import.meta.url),JSON.stringify({sourceImages:261,plannedArtworks:334,approved:entries.length,ids:entries.map(e=>e.id)},null,2)+'\n');
console.log('Estampados aprobados registrados: '+entries.length);
