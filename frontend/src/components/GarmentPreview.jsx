import {isDualPlacement,isMiniSide,miniStyle} from '../utils/placement';
import {designs,garments} from '../data/catalog';
import DesignImage from './DesignImage';
export default function GarmentPreview({garmentId,designId,color='negro',placement='front',printScale=100,printPosition='center',className='',alt='',eager=false,mini=false}){
 if(isDualPlacement(placement))return <div className={`dual-preview ${className}`}>{['front','back'].map(side=><div key={side}><GarmentPreview {...{garmentId,designId,color,printScale,printPosition,eager}} placement={side} mini={isMiniSide(placement,side)}/><span className="dual-label">{side==='front'?'Frente':'Espalda'}{isMiniSide(placement,side)?' · Mini':''}</span></div>)}</div>;
 const garment=garments.find(g=>String(g.id)===String(garmentId))||garments[0]; const design=designs.find(d=>String(d.id)===String(designId))||designs[0];
 const sheets={front:{negro:'/assets/garments/garment-sheet.png',hueso:'/assets/garments/garment-sheet-hueso.png',lavanda:'/assets/garments/garment-sheet-lavanda.png'},back:{negro:'/assets/garments/garment-back-sheet.png',hueso:'/assets/garments/garment-back-sheet-hueso.png',lavanda:'/assets/garments/garment-back-sheet-lavanda.png'}};
 const side=placement==='back'?'back':'front';
 const base=sheets[side][color]||sheets[side].negro;
 const index=garments.indexOf(garment);
 return <div className={`garment-preview ${garment?.type==='buzo'?'is-hoodie':'is-tee'} color-${color} ${className}`}><div className="garment-base garment-photo" key={base}><img src={base} alt={alt||`${garment?.name}, vista de ${side==='back'?'espalda':'frente'}`} style={{left:index%2?'-100%':0,top:index>=2?'-100%':0}} loading={eager?'eager':'lazy'}/></div><DesignImage key={design?.src} className="garment-print" src={design?.src} alt={`Estampado ${design?.name}`} style={{'--print-scale':mini?1:printScale/100,...(mini?miniStyle(side):printPosition==='chest'?{left:'59%',top:'30%',width:'15%',height:'20%'}:printPosition==='lower'?{top:'49%',width:'24%',height:'25%'}:{})}} loading={eager?'eager':'lazy'}/>{placement==='back'&&<span className="preview-side">Vista de espalda</span>}</div>;
}
