import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {validateOrder,canEditOrder} from './orderValidation.js';
const user={id:1,nombre:'Cliente verificado',email:'cliente@example.com'};
const valid=()=>({requestId:randomUUID(),contact:{name:'Nombre falso',email:'otro@example.com'},items:[{garmentId:'tee-men',designId:'luffy',size:'M',color:'negro',quantity:1,placement:'back-mini'}],image:'data:image/jpeg;base64,/9j/2Q=='});
test('uses account identity, catalog prices and preserves miniature placement',()=>{
 const body=valid();body.totalCents=1;const {config}=validateOrder(body,user);
 assert.equal(config.contact.name,user.nombre);assert.equal(config.contact.email,user.email);
 assert.equal(config.totalCents,1499);assert.equal(config.items[0].placement,'back-mini');
});
test('rejects invalid request IDs and disguised, oversized or missing images',()=>{
 for(const change of [b=>b.requestId='invalid',b=>b.image='',b=>b.image='data:image/jpeg;base64,YWJj',b=>b.image='data:image/svg+xml;base64,PHN2Zz4=',b=>b.image='data:image/jpeg;base64,'+'A'.repeat(2800001)]){
  const body=valid();change(body);assert.throws(()=>validateOrder(body,user));
 }
});
test('only the owner can edit a pending order',()=>{
 assert.equal(canEditOrder({usuario_id:1,estado:'PENDIENTE'},user),true);
 assert.equal(canEditOrder({usuario_id:2,estado:'PENDIENTE'},user),false);
 for(const estado of ['CONFIRMADO','ENVIADO','ENTREGADO','CANCELADO'])assert.equal(canEditOrder({usuario_id:1,estado},user),false);
});
