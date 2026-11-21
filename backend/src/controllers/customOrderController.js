import {randomUUID} from 'node:crypto';
import pool from '../config/database.js';
import {Usuario} from '../models/Usuario.js';
import {asyncHandler} from '../utils/errors.js';
import {validateOrder,canEditOrder,orderError} from '../services/orderValidation.js';
import sharp from 'sharp';

async function sanitizeImage(image){
 try{return await sharp(image,{limitInputPixels:20000000}).rotate().jpeg({quality:85}).toBuffer();}
 catch{throw orderError('No se pudo leer la imagen JPEG.');}
}

const parse=value=>typeof value==='string'?JSON.parse(value):value;
const serialize=row=>({...row,total:Number(row.total),configuracion:row.configuracion?parse(row.configuracion):null});
async function authorized(id,user,connection=pool,lock=false){
 const [rows]=await connection.query(`SELECT p.*, d.configuracion, d.revision FROM pedidos p LEFT JOIN pedido_diseno d ON d.pedido_id=p.id WHERE p.id=? ${lock?'FOR UPDATE':''}`,[id]);
 const row=rows[0];
 if(!row||(Number(row.usuario_id)!==Number(user.id)&&user.rol!=='ADMIN'))throw orderError('Pedido no encontrado.',404);
 return row;
}
export const createCustomOrder=asyncHandler(async(req,res)=>{
 const user=await Usuario.findById(req.user.id);
 if(!user)throw orderError('Inicia sesión de nuevo.',401);
 const validated=validateOrder(req.body,user);
 const config=validated.config,image=await sanitizeImage(validated.image);
 const connection=await pool.getConnection();
 let id;
 try{
  await connection.beginTransaction();
  // Serialize creation per account, including retries with the same request ID.
  await connection.query('SELECT id FROM usuarios WHERE id=? FOR UPDATE',[user.id]);
  const [previous]=await connection.query('SELECT pedido_id FROM pedido_diseno WHERE usuario_id=? AND request_id=?',[user.id,req.body.requestId]);
  if(previous.length)id=previous[0].pedido_id;
  else{
   const number=`DR-${randomUUID().replaceAll('-','').slice(0,16).toUpperCase()}`;
   const [result]=await connection.query("INSERT INTO pedidos (usuario_id,numero_pedido,subtotal,impuestos,total,direccion_envio,estado) VALUES (?,?,?,0,?,?,'PENDIENTE')",[user.id,number,config.subtotalCents/100,config.totalCents/100,config.notes]);
   id=result.insertId;
   await connection.query('INSERT INTO pedido_diseno (pedido_id,usuario_id,request_id,configuracion,imagen) VALUES (?,?,?,?,?)',[id,user.id,req.body.requestId,JSON.stringify(config),image]);
   await connection.query("INSERT INTO pedido_historial (pedido_id,estado,nota) VALUES (?,'PENDIENTE','Pedido creado; pendiente de confirmación de producción.')",[id]);
  }
  await connection.commit();
 }catch(error){await connection.rollback();throw error;}finally{connection.release();}
 res.status(201).json({success:true,pedido:serialize(await authorized(id,req.user))});
});
export const listCustomOrders=asyncHandler(async(req,res)=>{
 const [rows]=await pool.query('SELECT p.*,d.configuracion,d.revision FROM pedidos p LEFT JOIN pedido_diseno d ON d.pedido_id=p.id WHERE p.usuario_id=? ORDER BY p.id DESC LIMIT 100',[req.user.id]);
 res.json({success:true,pedidos:rows.map(serialize)});
});
export const getCustomOrder=asyncHandler(async(req,res)=>{
 const row=await authorized(req.params.id,req.user);
 const [historial]=await pool.query('SELECT estado,nota,fecha FROM pedido_historial WHERE pedido_id=? ORDER BY id',[row.id]);
 res.json({success:true,pedido:{...serialize(row),historial}});
});
export const orderImage=asyncHandler(async(req,res)=>{
 await authorized(req.params.id,req.user);
 const [rows]=await pool.query('SELECT imagen FROM pedido_diseno WHERE pedido_id=?',[req.params.id]);
 if(!rows[0])throw orderError('Este pedido no tiene imagen.',404);
 res.set({'Content-Type':'image/jpeg','Cache-Control':'private, no-store','Content-Disposition':'inline; filename="pedido.jpg"'}).send(rows[0].imagen);
});
export const editCustomOrder=asyncHandler(async(req,res)=>{
 const user=await Usuario.findById(req.user.id);
 if(!user)throw orderError('Inicia sesión de nuevo.',401);
 const validated=validateOrder(req.body,user);
 const config=validated.config,image=await sanitizeImage(validated.image);
 const connection=await pool.getConnection();
 try{
  await connection.beginTransaction();
  const row=await authorized(req.params.id,req.user,connection,true);
  if(!canEditOrder(row,req.user)||!row.configuracion)throw orderError('Solo puedes editar tus pedidos personalizados pendientes.',409);
  if(req.body.revision!==row.revision)throw orderError('El pedido cambió. Actualiza la página antes de editar.',409);
  await connection.query('UPDATE pedido_diseno SET configuracion=?,imagen=?,revision=revision+1 WHERE pedido_id=?',[JSON.stringify(config),image,row.id]);
  await connection.query('UPDATE pedidos SET subtotal=?,total=?,direccion_envio=? WHERE id=?',[config.subtotalCents/100,config.totalCents/100,config.notes,row.id]);
  await connection.query("INSERT INTO pedido_historial (pedido_id,estado,nota) VALUES (?,'PENDIENTE','Cliente actualizó el diseño y los datos del pedido.')",[row.id]);
  await connection.commit();
 }catch(error){await connection.rollback();throw error;}finally{connection.release();}
 res.json({success:true,pedido:serialize(await authorized(req.params.id,req.user))});
});
