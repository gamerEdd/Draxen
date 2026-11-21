import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {SOLO_LEVELING_MONARCH_DESIGNS} from '../shared/soloLevelingMonarch.mjs';
const require=createRequire(new URL('../frontend/package.json',import.meta.url));
const sharp=require('sharp');
const origin='https://sigue-me.com';
const html=await (await fetch(origin+'/',{cache:'no-store'})).text();
const bundle=html.match(/src="([^" ]+\.js)"/)?.[1];
if(!bundle)throw Error('Missing site bundle');
const js=await (await fetch(new URL(bundle,origin))).text();
const version=js.match(/\.webp\?v=([a-f0-9]{12})/)?.[1];
if(!version)throw Error('Missing artwork version');
const results=[];
for(const design of SOLO_LEVELING_MONARCH_DESIGNS){
 if(!js.includes(design.id))throw Error('Design absent from published catalog: '+design.id);
 for(const extension of ['.png','.webp','.thumb.webp']){
  const url=origin+design.src.replace(/\.png$/,extension)+'?v='+version;
  const response=await fetch(url,{signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw Error(url+': HTTP '+response.status);
  const buffer=Buffer.from(await response.arrayBuffer());
  const metadata=await sharp(buffer,{failOn:'warning'}).metadata();
  const stats=await sharp(buffer,{failOn:'warning'}).stats();
  if(!metadata.hasAlpha||stats.isOpaque||stats.channels[3].max<200||stats.channels[3].mean<8)throw Error('Invalid transparency or empty image: '+url);
  results.push({id:design.id,extension,url,width:metadata.width,height:metadata.height,valid:true});
 }
}
await fs.writeFile(new URL('../docs/solo-leveling-monarch/public-validation.json',import.meta.url),JSON.stringify({origin,version,checked:results.length,results},null,2)+'\n');
console.log(JSON.stringify({origin,designs:SOLO_LEVELING_MONARCH_DESIGNS.length,checked:results.length,passed:results.length}));
