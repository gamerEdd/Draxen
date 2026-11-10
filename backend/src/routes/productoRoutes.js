import express from 'express';
import {
  getAllProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
  addImagen,
  uploadImagen,
  deleteImagen,
  updateStock
} from '../controllers/productoController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllProductos);
router.get('/:id', getProducto);

// Rutas protegidas (admin)
router.post('/', authMiddleware, adminMiddleware, createProducto);
router.put('/:id', authMiddleware, adminMiddleware, updateProducto);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProducto);

// Imágenes
router.post('/:producto_id/imagenes', authMiddleware, adminMiddleware, addImagen);
router.post('/:producto_id/imagenes/upload', authMiddleware, adminMiddleware, upload.single('imagen'), uploadImagen);
router.delete('/imagenes/:id', authMiddleware, adminMiddleware, deleteImagen);

// Stock
router.put('/:producto_id/tallas/:talla_id/stock', authMiddleware, adminMiddleware, updateStock);

export default router;
