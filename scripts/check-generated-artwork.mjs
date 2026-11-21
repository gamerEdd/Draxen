import {createRequire} from 'node:module';
const require=createRequire(new URL('../frontend/package.json',import.meta.url));
const sharp=require('sharp');
const file=process.argv[2];
const metadata=await sharp(file).metadata();
const stats=await sharp(file).stats();
const alpha=stats.channels[3];
if(!metadata.hasAlpha||stats.isOpaque||!alpha||alpha.mean<8||alpha.max<200||metadata.width<512||metadata.height<512)throw Error('Archivo vacío, sin transparencia o resolución insuficiente');
console.log(JSON.stringify({valid:true,width:metadata.width,height:metadata.height,alphaMean:alpha.mean}));
