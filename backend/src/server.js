import express from 'express';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';


dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// cloudflared connects locally; never trust forwarding headers from LAN clients.
app.set('trust proxy', 'loopback');
app.disable('x-powered-by');
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Middlewares
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(cors());
app.use(compression());
// Requests have their own small JSON limit and do not require MySQL.
app.use('/api/solicitudes',(req,res)=>res.status(410).json({success:false,message:'Inicia sesión y crea tu pedido desde la bolsa.'}));
app.use('/api/pedidos',express.json({limit:'3mb'}));
app.use(express.json({limit:'32kb'}));
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes y logos)
app.use('/fotos', express.static(path.join(__dirname, '../../fotos')));
app.use('/logos', express.static(path.join(__dirname, '../../logos')));
app.use('/images', express.static(path.join(__dirname, '../fotos')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('API error:', err.code || err.status || 'INTERNAL_ERROR');
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    success: false,
    message: status >= 500 && process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message || 'Error interno del servidor'
  });
});

// La API conserva errores JSON; las rutas de React usan el mismo servidor.
app.use('/api', (req, res) => res.status(404).json({ success: false, message: 'Ruta no encontrada' }));
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist, {
    maxAge: '1h',
    setHeaders(res, file) {
      if (/[-][A-Za-z0-9_-]{8,}\.(js|css)$/.test(file)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (file.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));
  app.get('*', (req, res, next) => {
    if (path.extname(req.path)) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// 404 handler
app.use((req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

export const server=app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
