import express from 'express';
import {
  getCategorias,
  getCategoria,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from '../controllers/categoriaController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', getCategorias);
router.get('/:id', getCategoria);

// Rutas protegidas (admin)
router.post('/', authMiddleware, adminMiddleware, createCategoria);
router.put('/:id', authMiddleware, adminMiddleware, updateCategoria);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategoria);

export default router;
