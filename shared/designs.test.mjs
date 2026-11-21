import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { DESIGNS } from './designs.mjs';
import { matchesDesignCategory } from './designCategories.mjs';
import { validateSolicitud } from '../backend/src/services/solicitudService.js';

test('adding imported artwork preserves every design from the previous catalog', async () => {
  const previous = JSON.parse(await readFile(new URL('../docs/imported-artwork/catalog-before-2026-11-14.json', import.meta.url), 'utf8'));
  for (const old of previous) {
    const current = DESIGNS.find(d=>d.id===old.id);
    assert.ok(current, `Removed existing design: ${old.id}`);
    assert.equal(current.src, old.src, `Replaced existing artwork: ${old.id}`);
  }
});

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

test('Futurama has ten distinct reusable designs', () => {
  const futurama = DESIGNS.filter(design => design.collection === 'Futurama');
  assert.equal(futurama.length, 10);
  assert.equal(new Set(futurama.map(design => design.src)).size, 10);
  for (const design of futurama) {
    assert.equal(design.group, 'Series animadas');
    assert.equal(design.subcategory, 'Futurama');
  }
});

test('Videojuegos contains thirty Metal Slug designs without mixing Anime', () => {
  const games = DESIGNS.filter(d => matchesDesignCategory(d, 'Videojuegos'));
  const metalSlug = games.filter(d=>d.collection==='Metal Slug');
  assert.equal(metalSlug.length, 30);
  for (const design of metalSlug) {
    assert.equal(design.collection, 'Metal Slug');
    assert.equal(matchesDesignCategory(design, 'Anime'), false);
    assert.equal(matchesDesignCategory(design, 'Metal Slug'), true);
  }
  assert.ok(DESIGNS.filter(d => matchesDesignCategory(d, 'Anime')).some(d => d.collection === 'One Piece'));
  assert.equal(matchesDesignCategory({collection:'Rock'}, 'Anime'), false);
  assert.equal(matchesDesignCategory({collection:'Futurama', group:'Futurama'}, 'Videojuegos'), false);
});

test('new drop registers exactly 30 Rick y Morty, 20 One Piece and 50 Rock designs', async () => {
  const manifest = JSON.parse(await readFile(new URL('../docs/drop100/manifest.json', import.meta.url), 'utf8'));
  const completed = JSON.parse(await readFile(new URL('../docs/drop100/completed.json', import.meta.url), 'utf8'));
  assert.equal(manifest.length, 100);
  assert.equal(completed.length, 100);
  assert.equal(new Set(completed.map(d => d.id)).size, 100);
  for (const [collection, count] of [['Rick y Morty', 30], ['One Piece', 20], ['Rock', 50]]) {
    assert.equal(manifest.filter(d => d.collection === collection).length, count);
  }
  for (const entry of manifest) {
    assert.ok(completed.some(d => d.id === entry.id), entry.id);
    assert.ok(DESIGNS.some(d => d.id === entry.id && d.src === entry.src), entry.id);
  }
});
