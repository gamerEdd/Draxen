import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { validateSolicitud, saveSolicitud, SolicitudValidationError } from './solicitudService.js';

const valid = () => ({ contact: { name: 'Ana', email: 'ana@example.com' }, items: [{ garmentId: 'tee-women', designId: 'luffy', size: 'M', color: 'negro', quantity: 2 }] });

test('recalculates prices and drops untrusted extra fields', () => {
  const body = valid();
  body.items[0].unitPriceCents = 1;
  body.items.push({ ...body.items[0], garmentId: 'hoodie-men', quantity: 1, designId: 'rock' });
  const result = validateSolicitud(body);
  assert.equal(result.totalCents, 4798);
  assert.equal(result.subtotalCents, 4997);
  assert.equal(result.discountCents, 199);
  assert.equal(result.items[0].unitPriceCents, 1499);
  assert.equal(result.items[0].placement, 'front');
  assert.equal(result.items[0].printScale, 100);
});

test('rejects empty contact, unsupported variants and invalid quantities', () => {
  for (const mutate of [
    b => { b.contact = { name: 'Ana' }; },
    b => { b.contact.email = 'not-email'; },
    b => { b.items = []; },
    b => { b.items[0].garmentId = '../../secret'; },
    b => { b.items[0].garmentId = '__proto__'; },
    b => { b.items[0].quantity = -1; },
    b => { b.items[0].quantity = 1.5; },
    b => { b.items[0].designId = 'unknown'; },
    b => { b.items[0].printScale = NaN; },
    b => { b.notes = 'x'.repeat(1001); }
  ]) {
    const body = valid();
    mutate(body);
    assert.throws(() => validateSolicitud(body), SolicitudValidationError);
  }
});

test('concurrent requests persist as separate complete private records', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'draxen-request-test-'));
  try {
    const results = await Promise.all(Array.from({ length: 8 }, () => saveSolicitud(valid(), directory)));
    assert.equal(new Set(results.map(r => r.id)).size, 8);
    const files = await readdir(directory);
    assert.equal(files.length, 8);
    assert.ok(files.every(file => /^[\da-f-]+\.json$/.test(file)));
    for (const result of results) {
      const record = JSON.parse(await readFile(path.join(directory, `${result.id}.json`), 'utf8'));
      assert.equal(record.contact.email, 'ana@example.com');
      assert.equal(record.totalCents, 2799);
      assert.equal(record.subtotalCents, 2998);
      assert.equal(record.discountCents, 199);
      assert.equal(result.pricing.totalCents, record.totalCents);
      assert.equal(record.status, 'RECIBIDA');
      assert.deepEqual(Object.keys(result).sort(), ['createdAt', 'id', 'pricing', 'status']);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
