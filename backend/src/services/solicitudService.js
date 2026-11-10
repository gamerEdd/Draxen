import { randomUUID } from 'node:crypto';
import { mkdir, writeFile, rename, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { DESIGNS } from '../../../shared/designs.mjs';
import { GARMENT_PRICES, calculatePricing } from '../../../shared/pricing.mjs';

const garments = GARMENT_PRICES;
// La validación comparte el catálogo, incluidas las variantes manga y carmesí de Imu.
const designs = new Set(DESIGNS.map(design => design.id));
const sizes = new Set(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
const colors = new Set(['negro', 'hueso', 'lavanda']);
const defaultDirectory = fileURLToPath(new URL('../../data/solicitudes/', import.meta.url));

export class SolicitudValidationError extends Error {}

function invalid(message) { throw new SolicitudValidationError(message); }
function text(value, max, label, required = false) {
  if (value === undefined || value === null) value = '';
  if (typeof value !== 'string') invalid(`${label}: formato inválido.`);
  const result = value.trim();
  if ((required && !result) || result.length > max) invalid(`${label}: revisa el contenido (máximo ${max} caracteres).`);
  return result;
}

export function validateSolicitud(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) invalid('Solicitud inválida.');
  const rawContact = body.contact;
  if (!rawContact || typeof rawContact !== 'object' || Array.isArray(rawContact)) invalid('Agrega tus datos de contacto.');
  const contact = {
    name: text(rawContact.name, 100, 'Nombre', true),
    email: text(rawContact.email, 254, 'Correo'),
    phone: text(rawContact.phone, 30, 'Teléfono')
  };
  if (!contact.email && !contact.phone) invalid('Indica un correo o un teléfono para contactarte.');
  if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) invalid('Ingresa un correo válido.');
  if (contact.phone && !/^[+\d\s().-]{7,30}$/.test(contact.phone)) invalid('Ingresa un teléfono válido.');
  if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 30) invalid('La solicitud debe contener entre 1 y 30 prendas.');
  const items = body.items.map((item, index) => {
    const label = `Prenda ${index + 1}`;
    if (!item || typeof item !== 'object' || Array.isArray(item)) invalid(`${label}: datos inválidos.`);
    if (!Object.hasOwn(garments, item.garmentId)) invalid(`${label}: modelo no disponible.`);
    if (!designs.has(item.designId)) invalid(`${label}: diseño no disponible.`);
    if (!sizes.has(item.size)) invalid(`${label}: talla no disponible.`);
    if (!colors.has(item.color)) invalid(`${label}: color no disponible.`);
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) invalid(`${label}: cantidad entre 1 y 20.`);
    const placement = item.placement ?? 'front';
    const printScale = item.printScale ?? 100;
    if (!['front', 'back'].includes(placement)) invalid(`${label}: ubicación del estampado inválida.`);
    if (typeof printScale !== 'number' || !Number.isFinite(printScale) || printScale < 70 || printScale > 130) invalid(`${label}: tamaño del estampado entre 70 y 130.`);
    return {
      garmentId: item.garmentId, designId: item.designId, size: item.size,
      color: item.color, quantity: item.quantity, placement, printScale,
      unitPriceCents: garments[item.garmentId]
    };
  });
  const pricing = calculatePricing(items);
  return {
    contact, items, notes: text(body.notes, 1000, 'Notas'),
    ...pricing,
    currency: 'USD'
  };
}

// One random filename per request avoids shared-file read/modify/write races.
// The temporary file is renamed only after a complete write.
export async function saveSolicitud(body, directory = defaultDirectory) {
  const validated = validateSolicitud(body);
  const request = { id: randomUUID(), createdAt: new Date().toISOString(), status: 'RECIBIDA', ...validated };
  await mkdir(directory, { recursive: true });
  const destination = path.join(directory, `${request.id}.json`);
  const temporary = `${destination}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, JSON.stringify(request, null, 2), { encoding: 'utf8', flag: 'wx', mode: 0o600 });
    await rename(temporary, destination);
  } catch (error) {
    await unlink(temporary).catch(() => {});
    throw error;
  }
  return { id: request.id, createdAt: request.createdAt, status: request.status,
    pricing: { subtotalCents: request.subtotalCents, discountCents: request.discountCents, totalCents: request.totalCents, appliedPromotions: request.appliedPromotions, currency: request.currency } };
}
