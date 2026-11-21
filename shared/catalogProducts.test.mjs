import test from 'node:test';
import assert from 'node:assert/strict';
import {groupProductsByDesign} from './catalogProducts.mjs';
test('catalogue groups all fits without dropping designs or mutating variants',()=>{
 const variants=[{id:'a-shirt',designId:'a',type:'camiseta',gender:'hombre',precio:15},{id:'a-hoodie',designId:'a',type:'buzo',gender:'mujer',precio:20},{id:'b-hoodie',designId:'b',type:'buzo',gender:'mujer',precio:20}];
 const result=groupProductsByDesign(variants,[{id:'a',name:'Arte A'},{id:'b',name:'Arte B'}]);
 assert.equal(result.length,2);assert.equal(result[0].id,'a-shirt');assert.equal(result[0].displayName,'Arte A');assert.deepEqual(result[0].variantTypes,['camiseta','buzo']);assert.deepEqual(result[0].variantGenders,['hombre','mujer']);assert.equal(variants[0].displayName,undefined);
 assert.equal(groupProductsByDesign(variants.filter(p=>p.type==='buzo'),[])[0].precio,20);
});
