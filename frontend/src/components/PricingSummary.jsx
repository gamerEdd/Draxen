import { money } from '../data/catalog';
export default function PricingSummary({ pricing }) {
  return <div className="pricing-breakdown" aria-live="polite">
    <div className="summary-line"><span>Prendas + estampados</span><span>{money(pricing.subtotalCents / 100)}</span></div>
    {pricing.appliedPromotions.map(promo => <div className="summary-line promo-discount" key={promo.id}><span>{promo.label}{promo.quantity > 1 ? ` × ${promo.quantity}` : ''}</span><span>−{money(promo.savingsCents / 100)}</span></div>)}
    {pricing.discountCents > 0 && <p className="promo-saved">Ahorras {money(pricing.discountCents / 100)} con tus combos.</p>}
    <div className="summary-line muted"><span>Envío</span><span>Por confirmar</span></div>
    <div className="summary-total"><span>Total estimado</span><strong>{money(pricing.totalCents / 100)}</strong></div>
  </div>;
}
