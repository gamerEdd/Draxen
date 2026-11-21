import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../frontend/package.json',import.meta.url));
const sharp=require('sharp');
const root=new URL('../docs/imported-artwork/',import.meta.url);
const results=[];
for(const file of (await fs.readdir(new URL('completed/',root))).filter(f=>f.endsWith('.json')).sort()){
 let record;
 try{
  record=JSON.parse((await fs.readFile(new URL('completed/'+file,root),'utf8')).replace(/^\uFEFF/,''));
  const image=fileURLToPath(new URL('../frontend/public'+record.src,import.meta.url));
  const meta=await sharp(image,{failOn:'warning'}).metadata();
  const stats=await sharp(image,{failOn:'warning'}).stats();
  const alpha=stats.channels[3];
  const valid=meta.hasAlpha&&!stats.isOpaque&&alpha?.mean>=8&&alpha?.max>=200&&meta.width>=512&&meta.height>=512;
  results.push({id:record.id,valid,width:meta.width,height:meta.height,alphaMean:alpha?.mean,status:record.status});
 }catch(error){results.push({id:record?.id||file,valid:false,error:error.message});}
}
await fs.writeFile(new URL('validation.json',root),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({checked:results.length,valid:results.filter(r=>r.valid).length,errors:results.filter(r=>!r.valid)}));
