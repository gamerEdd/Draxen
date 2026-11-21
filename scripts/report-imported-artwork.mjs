import fs from 'node:fs/promises';
const root=new URL('../docs/imported-artwork/',import.meta.url);
const read=async path=>JSON.parse((await fs.readFile(new URL(path,root),'utf8')).replace(/^\uFEFF/,''));
const reviews=await read('review.json');
const records=new Map();
for(const name of await fs.readdir(new URL('completed/',root))){
 if(name.endsWith('.json')){const record=await read('completed/'+name);records.set(record.id,record);}
}
const errors=new Map();
for(const name of await fs.readdir(new URL('errors/',root))){
 if(name.endsWith('.json')){const record=await read('errors/'+name);errors.set(record.id,record);}
}
const rows=reviews.flatMap(source=>source.sides.map(side=>{
 const id=`ref-${String(source.index).padStart(3,'0')}-${side}`;
 const record=records.get(id);const error=errors.get(id);
 return {id,source:source.index,side,name:record?.name||source.name,group:record?.group||source.group,
  status:record?.status||(error?'generation-rejected':'pending'),src:record?.src||null,
  note:record?.reviewNote||(error?'El generador rechazó la solicitud; original conservado.':'')};
}));
const counts=rows.reduce((all,row)=>(all[row.status]=(all[row.status]||0)+1,all),{});
const labels={approved:'Aprobado',generated:'Por revisar','needs-revision':'Por corregir','generation-rejected':'Rechazado por el generador',pending:'Pendiente de generar'};
await fs.writeFile(new URL('report.json',root),JSON.stringify({sources:reviews.length,artworks:rows.length,counts,rows},null,2)+'\n');
const cell=text=>String(text).replaceAll('|','/').replaceAll('\n',' ');
await fs.writeFile(new URL('REVISION.md',root),'# Revisión del ZIP de estampados\n\nLos diseños anteriores se conservan. Cada fila corresponde a un frente o espalda de las 261 referencias. Solo los aprobados se incorporan al catálogo.\n\n'+
 Object.entries(counts).map(([key,value])=>`- ${labels[key]||key}: ${value}`).join('\n')+'\n\n| Diseño | Categoría | Estado | Observación |\n|---|---|---|---|\n'+
 rows.map(row=>`| ${row.id} · ${cell(row.name)} | ${cell(row.group)} | ${labels[row.status]||row.status} | ${cell(row.note)} |`).join('\n')+'\n');
console.log(JSON.stringify({sources:reviews.length,artworks:rows.length,counts}));
