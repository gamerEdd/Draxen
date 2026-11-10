import {designs,garments} from '../data/catalog';
export default function GarmentPreview({garmentId,designId,color='negro',placement='front',printScale=100,className='',alt='',eager=false}){
 const garment=garments.find(g=>String(g.id)===String(garmentId))||garments[0]; const design=designs.find(d=>String(d.id)===String(designId))||designs[0];
 const suffix=['hueso','lavanda'].includes(color)?`-${color}`:'';
 const base=`/assets/garments/garment-${placement==='back'?'back-':''}sheet${suffix}.png`;
 return <div className={`garment-preview ${garment?.type==='buzo'?'is-hoodie':'is-tee'} color-${color} ${className}`}><div className="garment-base" role="img" aria-label={alt||`${garment?.name}, vista de ${placement==='back'?'espalda':'frente'}`} style={{backgroundImage:`url(${base})`,backgroundPosition:garment?.position||'0% 0%'}}/><img className="garment-print" src={design?.src} alt={`Estampado ${design?.name}`} style={{'--print-scale':printScale/100}} loading={eager?'eager':'lazy'}/>{placement==='back'&&<span className="preview-side">Vista de espalda</span>}</div>;
}
