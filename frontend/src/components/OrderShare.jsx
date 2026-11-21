import {useEffect,useState} from 'react';
import {fetchOrderImage,downloadOrderImage,whatsappLink,whatsappMessage} from '../utils/orders';
export default function OrderShare({order,token}){
 const [blob,setBlob]=useState(null),[url,setUrl]=useState(''),[error,setError]=useState('');
 useEffect(()=>{let active=true,objectUrl;setBlob(null);setUrl('');setError('');fetchOrderImage(order.id,token).then(value=>{if(active){objectUrl=URL.createObjectURL(value);setBlob(value);setUrl(objectUrl);}}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;if(objectUrl)URL.revokeObjectURL(objectUrl);};},[order.id,order.revision,token]);
 async function share(){
  try{const file=new File([blob],`${order.numero_pedido}.jpg`,{type:'image/jpeg'});
   if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:order.numero_pedido,text:whatsappMessage(order)});}
   else{downloadOrderImage(blob,order.numero_pedido);setError('Imagen descargada. Abre WhatsApp y adjúntala al mensaje.');}
  }catch(e){if(e.name!=='AbortError')setError('No se pudo compartir. Descarga la imagen y adjúntala en WhatsApp.');}
 }
 return <section className="order-share" aria-label="Imagen y envío del pedido">{url&&<img src={url} alt={`Diseños del pedido ${order.numero_pedido}`}/>}<p>Envía tu pedido al <strong>0960665245</strong>. Confirma el mensaje en WhatsApp y adjunta la imagen. Al compartir, selecciona este contacto.</p><div className="preview-tools"><a className="button button-dark" href={whatsappLink(order)} target="_blank" rel="noreferrer">Abrir WhatsApp con mi pedido</a><button disabled={!blob} onClick={share}>Compartir imagen y mensaje</button><button disabled={!blob} onClick={()=>downloadOrderImage(blob,order.numero_pedido)}>Descargar imagen</button></div>{error&&<p role="status">{error}</p>}<p className="muted-note">Abrir WhatsApp no confirma el envío ni cambia el estado del pedido.</p></section>;
}
