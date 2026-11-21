import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const require=createRequire(new URL('../frontend/package.json',import.meta.url));
const sharp=require('sharp');
const root=new URL('../docs/imported-artwork/',import.meta.url);
const manifest=JSON.parse((await fs.readFile(new URL('source-manifest.json',root),'utf8')).replace(/^\uFEFF/,''));
await fs.mkdir(new URL('inspection/',root),{recursive:true});
for(const entry of manifest){
 const file=new URL('originals/'+entry.file,root); const buffer=await fs.readFile(file);
 const meta=await sharp(buffer).metadata();
 entry.width=meta.width;entry.height=meta.height;entry.alpha=meta.hasAlpha;entry.hash=createHash('sha256').update(buffer).digest('hex');
}
await fs.writeFile(new URL('inventory.json',root),JSON.stringify(manifest,null,2));
for(let offset=0;offset<manifest.length;offset+=16){
 const group=manifest.slice(offset,offset+16);const composites=[];
 for(let i=0;i<group.length;i++){
  const entry=group[i]; const image=await sharp(fileURLToPath(new URL('originals/'+entry.file,root))).resize(360,340,{fit:'contain',background:'#dddddd'}).png().toBuffer();
  composites.push({input:image,left:(i%4)*360,top:Math.floor(i/4)*380+40});
  const label=Buffer.from(`<svg width="360" height="40"><rect width="360" height="40" fill="white"/><text x="12" y="27" font-size="23" fill="black">${entry.index} · ${entry.width}x${entry.height}</text></svg>`);
  composites.push({input:label,left:(i%4)*360,top:Math.floor(i/4)*380});
 }
 await sharp({create:{width:1440,height:Math.ceil(group.length/4)*380,channels:3,background:'#fff'}}).composite(composites).jpeg({quality:88}).toFile(fileURLToPath(new URL('inspection/sheet-'+String(offset/16+1).padStart(2,'0')+'.jpg',root)));
}
console.log(JSON.stringify({total:manifest.length,unique:new Set(manifest.map(e=>e.hash)).size,sheets:Math.ceil(manifest.length/16)}));

