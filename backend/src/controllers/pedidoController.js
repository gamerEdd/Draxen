import { Pedido } from '../models/Pedido.js';
import { ProductoTalla } from '../models/ProductoTalla.js';
import { Producto } from '../models/Producto.js';
import pool from '../config/database.js';
import { asyncHandler } from '../utils/errors.js';

export const createPedido = asyncHandler(async (req, res) => {
  const { carrito, direccion_envio } = req.body;

  if (!carrito || carrito.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Carrito vacío' 
    });
  }

  if (!direccion_envio) {
    return res.status(400).json({ 
      success: false, 
      message: 'Dirección de envío requerida' 
    });
  }

  // Calcular totales
  let subtotal = 0;
  for (const item of carrito) {
    const producto = await Producto.findById(item.producto_id);
    subtotal += producto.precio * item.cantidad;
  }

  const impuestos = subtotal * 0.21; // IVA 21%
  const total = subtotal + impuestos;

  // Crear pedido
  const { id: pedidoId, numero_pedido } = await Pedido.create(
    req.user.id,
    subtotal,
    impuestos,
    total,
    direccion_envio
  );

  // Agregar items del pedido
  for (const item of carrito) {
    const producto = await Producto.findById(item.producto_id);
    await Pedido.addDetalle(
      pedidoId,
      item.producto_id,
      item.talla_id,
      item.cantidad,
      producto.precio
    );

    // Actualizar stock
    await ProductoTalla.updateStock(
      item.producto_id,
      item.talla_id,
      item.cantidad
    );
  }

  res.status(201).json({
    success: true,
    message: 'Pedido creado exitosamente',
    pedido: {
      id: pedidoId,
      numero_pedido,
      subtotal,
      impuestos,
      total
    }
  });
});

export const getPedido = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const pedido = await Pedido.findById(id);

  if (!pedido) {
    return res.status(404).json({ 
      success: false, 
      message: 'Pedido no encontrado' 
    });
  }

  // Verificar que el usuario sea dueño del pedido o admin
  if (pedido.usuario_id !== req.user.id && req.user.rol !== 'ADMIN') {
    return res.status(403).json({ 
      success: false, 
      message: 'No tienes permiso' 
    });
  }

  res.json({
    success: true,
    pedido
  });
});

export const getPedidosUsuario = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const pedidos = await Pedido.getByUsuario(req.user.id, limit, offset);

  res.json({
    success: true,
    pedidos,
    page,
    limit
  });
});

export const getAllPedidos = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const pedidos = await Pedido.getAll(limit, offset);

  res.json({
    success: true,
    pedidos,
    page,
    limit
  });
});

export const updateEstadoPedido = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const estadosValidos = ['PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Estado inválido' 
    });
  }

  const pedido = await Pedido.findById(id);
  if (!pedido) {
    return res.status(404).json({ 
      success: false, 
      message: 'Pedido no encontrado' 
    });
  }

  await Pedido.updateEstado(id, estado);

  res.json({
    success: true,
    message: 'Estado del pedido actualizado'
  });
});

export const getDashboard = asyncHandler(async (req, res) => {
  // Total de pedidos
  const [[{ totalPedidos }]] = await pool.query(
    'SELECT COUNT(*) as totalPedidos FROM pedidos'
  );

  // Total de ingresos
  const [[{ totalIngresos }]] = await pool.query(
    'SELECT SUM(total) as totalIngresos FROM pedidos WHERE estado IN ("CONFIRMADO", "ENVIADO", "ENTREGADO")'
  );

  // Pedidos por estado
  const [pedidosPorEstado] = await pool.query(
    'SELECT estado, COUNT(*) as cantidad FROM pedidos GROUP BY estado'
  );

  // Total de usuarios
  const [[{ totalUsuarios }]] = await pool.query(
    'SELECT COUNT(*) as totalUsuarios FROM usuarios WHERE rol = "CLIENTE"'
  );

  // Productos más vendidos
  const [productosVendidos] = await pool.query(
    `SELECT p.id, p.nombre, SUM(dp.cantidad) as vendidos
     FROM detalle_pedido dp
     JOIN productos p ON dp.producto_id = p.id
     GROUP BY p.id
     ORDER BY vendidos DESC
     LIMIT 5`
  );

  res.json({
    success: true,
    dashboard: {
      totalPedidos,
      totalIngresos: totalIngresos || 0,
      totalUsuarios,
      pedidosPorEstado,
      productosVendidos
    }
  });
});
