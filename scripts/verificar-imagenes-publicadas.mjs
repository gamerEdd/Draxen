import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {DESIGNS} from '../shared/designs.mjs';
const require=createRequire(new URL('../frontend/package.json',import.meta.url));
const sharp=require('sharp');
const origin=process.argv[2]||'https://sigue-me.com';
const html=await (await fetch(origin+'/',{cache:'no-store'})).text();
const bundle=html.match(/src="([^" ]+\.js)"/)[1];
const js=await (await fetch(new URL(bundle,origin))).text();
const version=js.match(/\.webp\?v=([a-f0-9]{12})/)[1];
const jobs=DESIGNS.flatMap(d=>['.webp','.thumb.webp'].map(ext=>({id:d.id,url:origin+d.src.replace(/\.png$/,ext)+'?v='+version})));
for(const side of ['','back-']) for(const color of ['','-hueso','-lavanda']) {
  const id=`garment-${side}sheet${color}`;
  jobs.push({id,garment:true,url:origin+`/assets/garments/${id}.webp?v=${version}`});
}
let next=0;
let passed=0;
let bytes=0;
const errors=[];
await Promise.all(Array.from({length:6},async()=>{
  while(next<jobs.length){
    const job=jobs[next++];
    try{
      const response=await fetch(job.url,{signal:AbortSignal.timeout(30000)});
      if(!response.ok||!response.headers.get('content-type')?.includes('image/webp')) throw new Error('HTTP '+response.status+' '+response.headers.get('content-type'));
      const buffer=Buffer.from(await response.arrayBuffer());
      bytes+=buffer.length;
      const meta=await sharp(buffer,{failOn:'warning'}).metadata();
      const stats=await sharp(buffer,{failOn:'warning'}).stats();
      if(!meta.width||!meta.height||(!job.garment&&(!meta.hasAlpha||stats.isOpaque))) throw new Error('Imagen vacía o sin transparencia');
      passed++;
    }catch(error){errors.push({...job,error:error.message});}
  }
}));
const report={origin,version,designs:DESIGNS.length,checked:jobs.length,passed,bytes,errors};
await fs.writeFile(new URL('../docs/metal-slug/public-image-audit.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(errors.length)process.exitCode=1;
