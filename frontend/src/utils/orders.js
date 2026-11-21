import {API_URL} from './api';
import {renderMockup} from './mockup';
import {designs,garments} from '../data/catalog';
import {placementLabel} from './placement';
export function pendingRequestId(userId,payload){
 const fingerprint=JSON.stringify({userId,items:payload.items,contact:payload.contact,notes:payload.notes});
 try{const pending=JSON.parse(sessionStorage.getItem('draxen-pending-order'));if(pending?.fingerprint===fingerprint)return pending.id;const id=crypto.randomUUID();sessionStorage.setItem('draxen-pending-order',JSON.stringify({fingerprint,id}));return id;}catch{return crypto.randomUUID();}
}
export async function orderRequest(path,token,{method='GET',body}={}){
 const response=await fetch(`${API_URL}/pedidos${path}`,{method,headers:{Authorization:`Bearer ${token}`,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(30000)});
 const data=await response.json();
 if(!response.ok||!data.success)throw new Error(data.message||'No pudimos completar la operación.');
 return data;
}
export async function generateOrderImage(items,name){
 const canvas=document.createElement('canvas');canvas.width=900;canvas.height=100+items.length*520;
 const ctx=canvas.getContext('2d');ctx.fillStyle='#f3f1e9';ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle='#171915';ctx.font='bold 24px Arial';ctx.fillText(`DRAXEN / Pedido de ${name}`,24,40,852);
 ctx.font='16px Arial';ctx.fillText('Diseño orientativo · Producción y envío por confirmar',24,72);
 for(const [index,item] of items.entries()){
  const mockup=await renderMockup(item);const scale=Math.min(852/mockup.width,460/mockup.height);
  ctx.drawImage(mockup,(900-mockup.width*scale)/2,100+index*520,mockup.width*scale,mockup.height*scale);
  ctx.fillStyle='#171915';ctx.font='bold 18px Arial';ctx.fillText(`Prenda ${index+1} · Cantidad: ${item.quantity}`,24,100+index*520+495);
 }
 const result=canvas.toDataURL('image/jpeg',.8);
 if(result.length>2800000)throw new Error('La imagen del pedido es demasiado grande. Divide las prendas en dos pedidos.');
 return result;
}
export function whatsappMessage(order){
 const c=order.configuracion;
 return `Hola Draxen, soy ${c.contact.name}. Mi pedido es ${order.numero_pedido}.\nCorreo: ${c.contact.email}\nTeléfono: ${c.contact.phone||'No indicado'}\n${c.items.map((i,n)=>`${n+1}. ${garments.find(g=>g.id===i.garmentId)?.name||i.garmentId} / ${designs.find(d=>d.id===i.designId)?.name||i.designId} · Talla ${i.size} · ${i.color} · ${i.quantity} unidad(es) · ${placementLabel(i.placement)} · ${i.printScale}% · ${i.printPosition==='chest'?'Pecho izquierdo':i.printPosition==='lower'?'Zona inferior':'Centrado'}`).join('\n')}\nTotal: $${Number(order.total).toFixed(2)}\nNotas: ${c.notes||'Sin notas'}\nAdjunto la imagen de mi pedido para confirmar disponibilidad y producción.`;
}
export const whatsappLink=order=>`https://wa.me/593960665245?text=${encodeURIComponent(whatsappMessage(order))}`;
export async function fetchOrderImage(id,token){
 const response=await fetch(`${API_URL}/pedidos/${id}/imagen`,{headers:{Authorization:`Bearer ${token}`}});
 if(!response.ok)throw new Error('No pudimos cargar la imagen del pedido.');
 return response.blob();
}
export function downloadOrderImage(blob,number){
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${number}.jpg`;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
