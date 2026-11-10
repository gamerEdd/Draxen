import { GARMENT_PRICES } from './pricing';
// Diseños independientes: una misma ilustración sirve para todos los cortes.
import { DESIGNS as designs } from '../../../shared/designs.mjs';
export { designs };

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = [{ name: 'Negro', value: '#252525' }, { name: 'Hueso', value: '#e8e3d5' }, { name: 'Lavanda', value: '#b7a6c6' }];
export const garments = [
  { id: 'tee-men', name: 'Camiseta oversized', type: 'camiseta', gender: 'hombre', price: GARMENT_PRICES['tee-men']/100, position: '0% 0%', src: '/assets/garments/garment-sheet.png', sizes, colors },
  { id: 'tee-women', name: 'Camiseta relaxed crop', type: 'camiseta', gender: 'mujer', price: GARMENT_PRICES['tee-women']/100, position: '100% 0%', src: '/assets/garments/garment-sheet.png', sizes, colors },
  { id: 'hoodie-men', name: 'Buzo oversized', type: 'buzo', gender: 'hombre', price: GARMENT_PRICES['hoodie-men']/100, position: '0% 100%', src: '/assets/garments/garment-sheet.png', sizes, colors },
  { id: 'hoodie-women', name: 'Buzo relaxed crop', type: 'buzo', gender: 'mujer', price: GARMENT_PRICES['hoodie-women']/100, position: '100% 100%', src: '/assets/garments/garment-sheet.png', sizes, colors },
];

// Catálogo de muestra: la disponibilidad final se confirma en la solicitud.
export const products = designs.flatMap((design, di) => garments.map((garment, gi) => ({
  id: `${garment.id}-${design.id}`,
  nombre: `${garment.type === 'buzo' ? 'Buzo' : 'Camiseta'} ${design.name}`,
  precio: garment.price,
  garmentId: garment.id,
  designId: design.id,
  gender: garment.gender,
  type: garment.type,
  category: design.collection,
  categoria_nombre: design.collection,
  descripcion: `${garment.name} con estampado ${design.name}. Elige tu talla y color, o lleva este diseño a otro modelo en el estudio. Confección y disponibilidad por confirmar al tramitar tu solicitud.`,
  tallas: garment.sizes.map((talla, id) => ({ id: id + 1, talla, stock: null })),
  imagen_principal: garment.src,
  featured: design.priority !== undefined || di < 3,
  priority: design.priority ?? 2,
  order: ((di * garments.length + gi) * 17) % (designs.length * garments.length),
}))).sort((a, b) => a.priority - b.priority || a.order - b.order);

export const money = value => new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);
