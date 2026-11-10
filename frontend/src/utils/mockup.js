import { garments, designs, money } from '../data/catalog';

const loadImage = src => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error('No se pudo cargar la imagen del diseño. Inténtalo de nuevo.'));
  image.src = src;
});

// Todos los recursos son locales: el lienzo puede exportarse sin un servidor externo.
export async function downloadMockup(config) {
  const garment = garments.find(g => g.id === config.garmentId);
  const design = designs.find(d => d.id === config.designId);
  if (!garment || !design) throw new Error('Selecciona una prenda y un diseño válidos.');
  const colorSuffix = ['hueso', 'lavanda'].includes(config.color) ? `-${config.color}` : '';
  const [base, print, logo] = await Promise.all([
    loadImage(`/assets/garments/garment-${config.placement === 'back' ? 'back-' : ''}sheet${colorSuffix}.png`),
    loadImage(design.src),
    loadImage('/assets/brand/logo-source.png'),
  ]);
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1320;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Tu navegador no permite exportar la vista previa.');
  const index = garments.indexOf(garment);
  const sw = base.naturalWidth / 2, sh = base.naturalHeight / 2;
  ctx.fillStyle = '#f3f1e9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(base, (index % 2) * sw, Math.floor(index / 2) * sh, sw, sh, 0, 0, 1200, 1200);
  ctx.filter = 'none';
  const width = 1200 * (garment.type === 'buzo' ? 0.24 : 0.28) * (config.printScale || 100) / 100;
  const height = Math.min(width * print.naturalHeight / print.naturalWidth, 1200 * .39);
  const fittedWidth = height * print.naturalWidth / print.naturalHeight;
  ctx.drawImage(print, (1200 - fittedWidth) / 2, 1200 * (garment.type === 'buzo' ? .34 : .31), fittedWidth, height);
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
  ctx.fillText(`${garment.name} · ${config.size} · ${config.color} · ${config.placement === 'back' ? 'Espalda' : 'Frente'} · ${money(garment.price)}`, 36, 1275);
  ctx.font = '16px Arial, sans-serif';
  ctx.fillText('Mockup orientativo. Medidas, color y producción por confirmar.', 36, 1305);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('No se pudo exportar el mockup.');
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `draxen-${garment.id}-${design.id}-${config.size}.png`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
