import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePricing } from './pricing.mjs';
const cart = (tees, hoodies) => [
  ...(tees ? [{ garmentId: 'tee-men', quantity: tees }] : []),
  ...(hoodies ? [{ garmentId: 'hoodie-women', quantity: hoodies }] : []),
];

test('unit prices include the print and empty baskets cost zero', () => {
  assert.equal(calculatePricing([]).totalCents, 0);
  assert.equal(calculatePricing(cart(1, 0)).totalCents, 1499);
  assert.equal(calculatePricing(cart(0, 1)).totalCents, 1999);
});

test('all advertised combos, odd units and repeated combos have exact totals', () => {
  for (const [tees, hoodies, expected] of [
    [2,0,2799], [0,2,3799], [1,1,3299], [3,0,4298], [0,3,5798],
    [2,1,4798], [1,2,5298], [2,2,6598], [3,3,9897], [4,0,5598],
  ]) assert.equal(calculatePricing(cart(tees, hoodies)).totalCents, expected, `${tees} tees/${hoodies} hoodies`);
});

test('combos cross variants and cannot stack or trust submitted discounts', () => {
  const result = calculatePricing([
    {garmentId:'tee-men', quantity:1, priceCents:1},
    {garmentId:'tee-women', quantity:1, discountCents:99999},
    {garmentId:'hoodie-men', quantity:1},
    {garmentId:'hoodie-women', quantity:1},
  ]);
  assert.equal(result.subtotalCents, 6996);
  assert.equal(result.discountCents, 398);
  assert.equal(result.totalCents, 6598);
  assert.equal(result.appliedPromotions.length, 1);
  assert.equal(result.appliedPromotions[0].id, 'mixed');
  assert.equal(result.appliedPromotions[0].quantity, 2);
  assert.throws(()=>calculatePricing([{garmentId:'__proto__',quantity:1}]));
  assert.throws(()=>calculatePricing([{garmentId:'tee-men',quantity:1.5}]));
});
