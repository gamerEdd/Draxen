import {isDualPlacement,isMiniSide,placementLabel} from './placement';
import { garments, designs, money } from '../data/catalog';

const loadImage = src => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error('No se pudo cargar la imagen del diseño. Inténtalo de nuevo.'));
  image.src = src;
});

// Todos los recursos son locales: el lienzo puede exportarse sin un servidor externo.
export async function renderMockup(config) {
  const garment = garments.find(g => g.id === config.garmentId);
  const design = designs.find(d => d.id === config.designId);
  if (!garment || !design) throw new Error('Selecciona una prenda y un diseño válidos.');
  const colorSuffix = ['hueso', 'lavanda'].includes(config.color) ? `-${config.color}` : '';
  const [base, print, logo, back] = await Promise.all([
    loadImage(`/assets/garments/garment-${config.placement === 'back' ? 'back-' : ''}sheet${colorSuffix}.png`),
    loadImage(design.src),
    loadImage('/assets/brand/logo-source.png'),
    isDualPlacement(config.placement) ? loadImage(`/assets/garments/garment-back-sheet${colorSuffix}.png`) : Promise.resolve(null),
  ]);
  const canvas = document.createElement('canvas');
  canvas.width = isDualPlacement(config.placement) ? 2400 : 1200;
  canvas.height = 1320;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Tu navegador no permite exportar la vista previa.');
  const index = garments.indexOf(garment);
  const sw = base.naturalWidth / 2, sh = base.naturalHeight / 2;
  ctx.fillStyle = '#f3f1e9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (const [panel, image] of (back ? [base, back] : [base]).entries()) {
    ctx.save();
    ctx.translate(panel * 1200, 0);
    ctx.drawImage(image, (index % 2) * sw, Math.floor(index / 2) * sh, sw, sh, 0, 0, 1200, 1200);
    const mini = isMiniSide(config.placement, panel === 0 ? 'front' : 'back');
    const position = mini ? (panel === 0 ? 'chest' : 'mini-back') : config.printPosition || 'center';
    const width = 1200 * (mini ? .11 : position === 'chest' ? .15 : position === 'lower' ? .24 : garment.type === 'buzo' ? .23 : .28);
    const maxHeight = 1200 * (mini ? .14 : position === 'chest' ? .20 : position === 'lower' ? .25 : garment.type === 'buzo' ? .27 : .35);
    const height = Math.min(width * print.naturalHeight / print.naturalWidth, maxHeight);
    const fittedWidth = height * print.naturalWidth / print.naturalHeight;
    const scale = mini ? 1 : (config.printScale || 100) / 100;
    const center = 1200 * (position === 'chest' ? .59 : .5);
    const top = 1200 * (mini ? .30 : position === 'chest' ? .30 : position === 'lower' ? .49 : garment.type === 'buzo' ? .35 : .315);
    ctx.drawImage(print, center - fittedWidth * scale / 2, top, fittedWidth * scale, height * scale);
    ctx.restore();
  }
  // Encadre del logo original, sin redibujar ni deformar la marca.
  ctx.save();
  ctx.filter = 'invert(1)';
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(logo, 110, 275, 1248, 460, 36, 32, 240, 240 * 460 / 1248);
  ctx.restore();
  ctx.fillStyle = '#171915';
  ctx.font = 'bold 28px Arial, sans-serif';
  ctx.fillText(`DRAXEN / ${design.name}`, 36, 1240);
  ctx.font = '20px Arial, sans-serif';
  ctx.fillText(`${garment.name} · ${config.size} · ${config.color} · ${placementLabel(config.placement)} · ${money(garment.price)}`, 36, 1275);
  ctx.font = '16px Arial, sans-serif';
  ctx.fillText('Mockup orientativo. Medidas, color y producción por confirmar.', 36, 1305);
  return canvas;
}
export async function downloadMockup(config) {
  const canvas=await renderMockup(config);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('No se pudo exportar el mockup.');
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `draxen-${config.garmentId}-${config.designId}-${config.size}.png`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
