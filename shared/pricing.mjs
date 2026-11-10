// USD en centavos. Fuente única para catálogo, bolsa y servidor.
export const GARMENT_PRICES = Object.freeze({
  'tee-men': 1499, 'tee-women': 1499,
  'hoodie-men': 1999, 'hoodie-women': 1999,
});

export const PROMOTIONS = Object.freeze([
  { id: 'mixed', label: 'Camiseta + buzo', tees: 1, hoodies: 1, priceCents: 3299, savingCents: 199 },
  { id: 'tees', label: '2 camisetas', tees: 2, hoodies: 0, priceCents: 2799, savingCents: 199 },
  { id: 'hoodies', label: '2 buzos', tees: 0, hoodies: 2, priceCents: 3799, savingCents: 199 },
]);

export function calculatePricing(items) {
  let tees = 0, hoodies = 0, subtotalCents = 0;
  for (const item of items) {
    if (!Object.hasOwn(GARMENT_PRICES, item.garmentId) || !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new Error('Prenda o cantidad inválida para calcular el precio.');
    }
    subtotalCents += GARMENT_PRICES[item.garmentId] * item.quantity;
    if (item.garmentId.startsWith('tee-')) tees += item.quantity;
    else hoodies += item.quantity;
  }
  // Todos los combos ahorran $1.99 por pareja. Priorizar mixtos no cambia
  // el ahorro máximo y evita contar una misma unidad en dos promociones.
  const mixed = Math.min(tees, hoodies);
  tees -= mixed;
  hoodies -= mixed;
  const counts = [mixed, Math.floor(tees / 2), Math.floor(hoodies / 2)];
  const appliedPromotions = PROMOTIONS.flatMap((promo, index) => counts[index] ? [{
    id: promo.id, label: promo.label, quantity: counts[index],
    unitPriceCents: promo.priceCents,
    totalCents: promo.priceCents * counts[index],
    savingsCents: promo.savingCents * counts[index],
  }] : []);
  const discountCents = appliedPromotions.reduce((sum, promo) => sum + promo.savingsCents, 0);
  return { subtotalCents, discountCents, totalCents: subtotalCents - discountCents, appliedPromotions };
}
