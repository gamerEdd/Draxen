import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { DESIGNS } from './designs.mjs';
import { validateSolicitud } from '../backend/src/services/solicitudService.js';

test('all registered designs have unique local PNG artwork and valid image dimensions', async () => {
  assert.equal(new Set(DESIGNS.map(d=>d.id)).size, DESIGNS.length);
  const hashes = new Set();
  for (const design of DESIGNS) {
    assert.match(design.src, /^\/assets\/designs\/[a-z0-9-]+\.png$/);
    const file = await readFile(new URL(`../frontend/public${design.src}`, import.meta.url));
    assert.equal(file.subarray(0,8).toString('hex'), '89504e470d0a1a0a', design.id);
    assert.ok([4,6].includes(file[25]) || file.includes(Buffer.from('tRNS')), `Missing alpha channel: ${design.id}`);
    assert.ok(file.readUInt32BE(16) >= 512 && file.readUInt32BE(20) >= 512, design.id);
    const hash = createHash('sha256').update(file).digest('hex');
    assert.ok(!hashes.has(hash), `Duplicate image: ${design.id}`);
    hashes.add(hash);
  }
});

test('every registered illustration can be submitted on each garment model', () => {
  for (const design of DESIGNS) {
    for (const garmentId of ['tee-men','tee-women','hoodie-men','hoodie-women']) {
      const result = validateSolicitud({contact:{name:'Test',email:'test@example.com'},items:[{
        garmentId,designId:design.id,size:'M',color:'negro',quantity:1,
      }]});
      assert.equal(result.items[0].designId, design.id);
      assert.equal(result.totalCents, garmentId.startsWith('tee-') ? 1499 : 1999);
    }
  }
});

test('expansion adds exactly ten unique illustrations per requested category', async () => {
  const manifest = JSON.parse(await readFile(new URL('../docs/design-expansion/manifest.json',import.meta.url),'utf8'));
  assert.equal(manifest.length,30);
  assert.equal(new Set(manifest.map(d=>d.id)).size,30);
  for(const group of ['Anime','Rock','Memes']) assert.equal(manifest.filter(d=>d.group===group).length,10);
  for(const entry of manifest) assert.ok(DESIGNS.some(d=>d.id===entry.id),entry.id);
  assert.ok(DESIGNS.length >= 38);
});

test('both Imu illustrations are registered as One Piece designs', () => {
  for (const id of ['imu-elbaf', 'imu-crimson']) {
    const imu = DESIGNS.find(design => design.id === id);
    assert.ok(imu, id);
    assert.equal(imu.collection, 'One Piece');
    assert.equal(imu.group, 'Anime');
  }
});
