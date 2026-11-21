import {validateSolicitud,SolicitudValidationError} from './solicitudService.js';
export const orderError=(message,status=400)=>Object.assign(new Error(message),{status});
export function validateOrder(body,user) {
 let config;
 try {config=validateSolicitud({...body,contact:{...body.contact,name:user.nombre,email:user.email}});}
 catch(error){if(error instanceof SolicitudValidationError)throw orderError(error.message);throw error;}
 if(typeof body.requestId!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.requestId))throw orderError('Identificador de pedido inválido.');
 if(typeof body.image!=='string'||body.image.length>2800000||!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(body.image))throw orderError('Adjunta una imagen JPEG del pedido (máximo 2 MB).');
 const image=Buffer.from(body.image.split(',')[1],'base64');
 if(image.length>2*1024*1024||image.length<4||image[0]!==255||image[1]!==216||image.at(-2)!==255||image.at(-1)!==217)throw orderError('Imagen JPEG inválida.');
 return {config,image};
}
export function canEditOrder(order,user){return Number(order.usuario_id)===Number(user.id)&&order.estado==='PENDIENTE';}
