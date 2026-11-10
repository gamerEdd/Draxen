import './brand.css';

// El archivo original se conserva íntegro. El encuadre elimina solo el margen
// de presentación; los modos de mezcla adaptan el blanco/negro al fondo.
export default function BrandLogo({ tone = 'ink', className = '', decorative = false }) {
  return <span className={`brand-logo brand-logo--${tone} ${className}`}>
    <img src="/assets/brand/logo-source.png" alt={decorative ? '' : 'DRAXEN'} width="1536" height="1024" decoding="async" />
  </span>;
}
