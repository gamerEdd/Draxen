import express from 'express';
import {
  createPedido,
  getPedido,
  getPedidosUsuario,
  getAllPedidos,
  updateEstadoPedido,
  getDashboard
} from '../controllers/pedidoController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Rutas protegidas
router.post('/', authMiddleware, createPedido);
router.get('/usuario/mis-pedidos', authMiddleware, getPedidosUsuario);
router.get('/:id', authMiddleware, getPedido);

// Rutas admin
router.get('/', authMiddleware, adminMiddleware, getAllPedidos);
router.put('/:id/estado', authMiddleware, adminMiddleware, updateEstadoPedido);
router.get('/admin/dashboard', authMiddleware, adminMiddleware, getDashboard);

export default router;
