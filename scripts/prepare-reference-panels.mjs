// Reference preprocessing for inspection and AI input only. Never published as artwork.
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../frontend/package.json',import.meta.url));
const sharp=require('sharp');
const root=new URL('../docs/imported-artwork/',import.meta.url);
const review=JSON.parse(await fs.readFile(new URL('review.json',root),'utf8'));
const inventory=JSON.parse(await fs.readFile(new URL('inventory.json',root),'utf8'));
await fs.mkdir(new URL('reference-panels/',root),{recursive:true});
for(const record of review.filter(r=>r.kind==='front-back')){
 const source=inventory.find(r=>r.index===record.index);
 const width=source.width;const half=Math.floor(source.height/2);
 for(const side of ['front','back']){
  await sharp(fileURLToPath(new URL('originals/'+source.file,root))).extract({left:0,top:side==='front'?0:half,width,height:half}).png().toFile(fileURLToPath(new URL('reference-panels/'+String(record.index).padStart(3,'0')+'-'+side+'.png',root)));
 }
}
console.log('Paneles de referencia separados, sin modificar los originales.');
