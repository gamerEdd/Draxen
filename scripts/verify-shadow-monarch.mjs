import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {DESIGNS} from '../shared/designs.mjs';
const require=createRequire(new URL('../frontend/package.json',import.meta.url));
const sharp=require('sharp');
const root=new URL('../docs/solo-leveling-monarch/',import.meta.url);
const jobs=JSON.parse(await fs.readFile(new URL('prompts.json',root),'utf8'));
const results=[];const layers=[];
for(let i=0;i<jobs.length;i++){
 const job=jobs[i];const src='/assets/designs/'+job.id+'.png';
 const path=fileURLToPath(new URL('../frontend/public'+src,import.meta.url));
 const meta=await sharp(path,{failOn:'warning'}).metadata();
 const stats=await sharp(path,{failOn:'warning'}).stats();
 const valid=meta.hasAlpha&&!stats.isOpaque&&stats.channels[3].mean>=8&&stats.channels[3].max>=200&&meta.width>=1024&&meta.height>=1024;
 if(!valid)throw Error('Invalid or empty artwork: '+job.id);
 results.push({id:job.id,src,width:meta.width,height:meta.height,alphaMean:stats.channels[3].mean,valid});
 layers.push({input:await sharp(path).resize(400,470,{fit:'contain',background:'#191922'}).flatten({background:'#191922'}).png().toBuffer(),left:i%3*400,top:Math.floor(i/3)*510+40});
 layers.push({input:Buffer.from(`<svg width="400" height="40"><rect width="400" height="40" fill="white"/><text x="8" y="26" font-size="18">${job.id}</text></svg>`),left:i%3*400,top:Math.floor(i/3)*510});
}
await sharp({create:{width:1200,height:1020,channels:3,background:'#191922'}}).composite(layers).jpeg({quality:92}).toFile(fileURLToPath(new URL('preview.jpg',root)));
const previous=JSON.parse(await fs.readFile(new URL('catalog-before.json',root),'utf8'));
for(const old of previous){const current=DESIGNS.find(d=>d.id===old.id);if(!current||current.src!==old.src)throw Error('Previous design changed: '+old.id);}
await fs.writeFile(new URL('validation.json',root),JSON.stringify({previousDesignsPreserved:previous.length,results},null,2)+'\n');
console.log(JSON.stringify({previousDesignsPreserved:previous.length,checked:results.length,valid:results.length}));
