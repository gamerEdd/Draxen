import {createCustomOrder,listCustomOrders,getCustomOrder,editCustomOrder,orderImage} from '../controllers/customOrderController.js';
import {orderLimit} from '../middleware/limits.js';
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
router.post('/', authMiddleware, orderLimit,createCustomOrder);
router.put('/:id',authMiddleware,orderLimit,editCustomOrder);
router.get('/:id/imagen',authMiddleware,orderImage);
router.get('/usuario/mis-pedidos', authMiddleware, listCustomOrders);
router.get('/:id', authMiddleware, getCustomOrder);

// Rutas admin
router.get('/', authMiddleware, adminMiddleware, getAllPedidos);
router.put('/:id/estado', authMiddleware, adminMiddleware, updateEstadoPedido);
router.get('/admin/dashboard', authMiddleware, adminMiddleware, getDashboard);

export default router;
