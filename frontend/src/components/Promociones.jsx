import { Link } from 'react-router-dom';
import { GARMENT_PRICES, PROMOTIONS } from '../data/pricing';
import { money } from '../data/catalog';
import Icon from './Icon';
import './promotions.css';

export default function Promociones({ compact = false }) {
  if (compact) return <div className="promo-reminder"><Icon name="spark" size={18}/><p>Combina dos prendas y ahorra <strong>{money(1.99)}</strong>. Se aplica automáticamente en tu bolsa. <Link to="/#promociones">Ver combos ↗</Link></p></div>;
  return <section className="shell promotions-section" id="promociones" aria-labelledby="promotions-title">
    <div className="section-heading"><div><span className="eyebrow">MÁS ESTILO, MEJOR PRECIO</span><h2 id="promotions-title">Tu próximo dúo favorito.</h2></div><span className="promo-auto">DESCUENTO AUTOMÁTICO</span></div>
    <div className="promotions-grid">{PROMOTIONS.map((promo, index) => <article key={promo.id} className={`promotion-card ${index === 0 ? 'promotion-featured' : ''}`}>
      <span className="eyebrow">{index === 0 ? 'EL COMBO DE LA CASA' : 'COMBINA A TU MANERA'}</span>
      <h3>{promo.label}</h3><div className="promotion-price"><strong>{money(promo.priceCents / 100)}</strong><del>{money((promo.tees * GARMENT_PRICES['tee-men'] + promo.hoodies * GARMENT_PRICES['hoodie-men']) / 100)}</del></div>
      <p>Ahorra {money(promo.savingCents / 100)} · estampados incluidos.</p><Link to="/#catalogo">Elegir mis prendas <Icon name="arrow" size={18}/></Link>
    </article>)}</div>
    <p className="promotions-terms">Elige cualquier diseño, talla, color o corte. Los combos se calculan por parejas en la bolsa; cada prenda participa en un solo combo. Sin descuentos acumulables. Envío por confirmar.</p>
  </section>;
}
