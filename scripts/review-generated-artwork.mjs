import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../frontend/package.json',import.meta.url));
const sharp=require('sharp');
const directory=new URL('../docs/imported-artwork/completed/',import.meta.url);
const pending=process.argv.includes('--pending');
const output=new URL('../docs/imported-artwork/'+(pending?'pending-review/':'generated-review/'),import.meta.url);
await fs.mkdir(output,{recursive:true});
const records=[];
for(const filename of (await fs.readdir(directory)).filter(n=>n.endsWith('.json')).sort()){
 const record=JSON.parse((await fs.readFile(new URL(filename,directory),'utf8')).replace(/^\uFEFF/,''));
 if(!pending||record.status!=='approved')records.push(record);
}
await fs.writeFile(new URL('manifest.json',output),JSON.stringify(records.map(r=>({id:r.id,name:r.name,group:r.group,status:r.status})),null,2)+'\n');
for(let offset=0;offset<records.length;offset+=16){
 const group=records.slice(offset,offset+16);const layers=[];
 for(let i=0;i<group.length;i++){
  const record=group[i];const image=fileURLToPath(new URL('../frontend/public'+record.src,import.meta.url));
  const thumb=await sharp(image).resize(300,340,{fit:'contain',background:'#c8c7bd'}).flatten({background:'#c8c7bd'}).png().toBuffer();
  layers.push({input:thumb,left:i%4*300,top:Math.floor(i/4)*380+40});
  layers.push({input:Buffer.from(`<svg width="300" height="40"><rect width="300" height="40" fill="white"/><text x="8" y="26" font-size="20">${record.id}</text></svg>`),left:i%4*300,top:Math.floor(i/4)*380});
 }
 await sharp({create:{width:1200,height:Math.ceil(group.length/4)*380,channels:3,background:'white'}}).composite(layers).jpeg({quality:90}).toFile(fileURLToPath(new URL('sheet-'+String(offset/16+1).padStart(2,'0')+'.jpg',output)));
}
console.log(JSON.stringify({records:records.length,sheets:Math.ceil(records.length/16),ids:records.map(r=>r.id)}));
