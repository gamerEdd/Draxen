import express from 'express';
import { saveSolicitud, SolicitudValidationError } from '../services/solicitudService.js';

const router = express.Router();
const attempts = new Map();
const windowMs = 15 * 60 * 1000;

router.post('/', express.json({ limit: '32kb' }), async (req, res) => {
  const now = Date.now();
  // Expire inactive clients on requests; no timer keeps the server alive.
  for (const [key, value] of attempts) if (value.expiresAt <= now) attempts.delete(key);
  const key = req.ip;
  const bucket = attempts.get(key) || { count: 0, expiresAt: now + windowMs };
  bucket.count += 1;
  attempts.set(key, bucket);
  if (bucket.count > 10) {
    res.set('Retry-After', String(Math.ceil((bucket.expiresAt - now) / 1000)));
    return res.status(429).json({ success: false, message: 'Has enviado varias solicitudes. Espera unos minutos antes de intentar de nuevo.' });
  }
  try {
    const request = await saveSolicitud(req.body);
    return res.status(201).json({ success: true, request });
  } catch (error) {
    if (error instanceof SolicitudValidationError) return res.status(400).json({ success: false, message: error.message });
    // Do not log contacts, notes, submitted bodies or filesystem paths.
    console.error('No se pudo guardar la solicitud:', error.code || 'STORAGE_ERROR');
    return res.status(503).json({ success: false, message: 'No pudimos guardar tu solicitud. Conserva tu carrito e inténtalo de nuevo.' });
  }
});

router.use((error, req, res, next) => {
  if (error.type === 'entity.too.large') return res.status(413).json({ success: false, message: 'La solicitud supera el tamaño permitido.' });
  if (error.type === 'entity.parse.failed') return res.status(400).json({ success: false, message: 'El formato de la solicitud no es válido.' });
  next(error);
});

export default router;
