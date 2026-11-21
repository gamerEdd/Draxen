import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';

test('authenticated order lifecycle, isolation, retry, image and tracking',{skip:process.env.RUN_DB_TESTS!=='1'},async()=>{
 process.env.PORT='0';process.env.HOST='127.0.0.1';
 const {server}=await import('../server.js');
 const {default:pool}=await import('../config/database.js');
 const {default:sharp}=await import('sharp');
 const {generateToken}=await import('../config/jwt.js');
 if(!server.listening)await new Promise(resolve=>server.once('listening',resolve));
 const base=`http://127.0.0.1:${server.address().port}/api`;
 const users=[],orders=[];
 const call=async(path,{token,body,method='GET'}={})=>{
  const response=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined});
  return {status:response.status,data:await response.json()};
 };
 try{
  const register=async()=>{const result=await call('/auth/register',{method:'POST',body:{nombre:'Prueba temporal',email:`test-${randomUUID()}@example.com`,password:'Test-Password-123'}});assert.equal(result.status,201);users.push(result.data.usuario.id);return result.data;};
  const owner=await register(),other=await register();
  assert.equal((await call('/pedidos/usuario/mis-pedidos')).status,401);
  const image='data:image/jpeg;base64,'+(await sharp({create:{width:40,height:40,channels:3,background:'#ffffff'}}).jpeg().toBuffer()).toString('base64');
  const body={requestId:randomUUID(),image,contact:{phone:'0960665245'},items:[{garmentId:'tee-men',designId:'luffy',size:'M',color:'negro',quantity:1,placement:'front-mini'}]};
  const created=await call('/pedidos',{method:'POST',token:owner.token,body});assert.equal(created.status,201,JSON.stringify(created.data));const id=created.data.pedido.id;orders.push(id);
  assert.equal(created.data.pedido.total,14.99);
  const retry=await call('/pedidos',{method:'POST',token:owner.token,body});assert.equal(retry.data.pedido.id,id);
  assert.equal((await call(`/pedidos/${id}`,{token:other.token})).status,404);
  assert.equal((await fetch(`${base}/pedidos/${id}/imagen`,{headers:{Authorization:`Bearer ${other.token}`}})).status,404);
  const img=await fetch(`${base}/pedidos/${id}/imagen`,{headers:{Authorization:`Bearer ${owner.token}`}});assert.equal(img.status,200);assert.equal(img.headers.get('content-type'),'image/jpeg');assert.ok((await img.arrayBuffer()).byteLength>100);
  const edit={...body,revision:1,items:[{...body.items[0],quantity:2,placement:'back-mini'}]};
  const edited=await call(`/pedidos/${id}`,{method:'PUT',token:owner.token,body:edit});assert.equal(edited.status,200);assert.equal(edited.data.pedido.total,27.99);assert.equal(edited.data.pedido.revision,2);
  assert.equal((await call(`/pedidos/${id}`,{method:'PUT',token:owner.token,body:edit})).status,409);
  assert.equal((await call(`/pedidos/${id}/estado`,{method:'PUT',token:owner.token,body:{estado:'ENVIADO'}})).status,403);
  await pool.query("UPDATE usuarios SET rol='ADMIN' WHERE id=?",[other.usuario.id]);
  const admin=generateToken(other.usuario.id,'ADMIN');
  assert.equal((await call(`/pedidos/${id}/estado`,{method:'PUT',token:admin,body:{estado:'ENVIADO',numero_seguimiento:'GUIA-TEST'}})).status,200);
  assert.equal((await call(`/pedidos/${id}`,{method:'PUT',token:owner.token,body:{...edit,revision:2}})).status,409);
  const detail=await call(`/pedidos/${id}`,{token:owner.token});assert.equal(detail.data.pedido.numero_seguimiento,'GUIA-TEST');assert.equal(detail.data.pedido.historial.length,3);
  const list=await call('/pedidos/usuario/mis-pedidos',{token:owner.token});assert.equal(list.data.pedidos.length,1);assert.equal(list.data.pedidos[0].configuracion.items[0].placement,'back-mini');
 }finally{
  for(const id of orders){await pool.query('DELETE FROM pedido_historial WHERE pedido_id=?',[id]);await pool.query('DELETE FROM pedido_diseno WHERE pedido_id=?',[id]);await pool.query('DELETE FROM pedidos WHERE id=?',[id]);}
  for(const id of users)await pool.query('DELETE FROM usuarios WHERE id=? AND email LIKE ?',[id,'test-%@example.com']);
  await new Promise(resolve=>server.close(resolve));await pool.end();
 }
});
