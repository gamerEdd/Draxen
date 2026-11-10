import pool from '../config/database.js';

export class Pedido {
  static async generatePedidoNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000);
    return `DR-${year}${month}${day}-${random}`;
  }

  static async create(usuarioId, subtotal, impuestos, total, direccion) {
    const numeroPedido = await this.generatePedidoNumber();
    const [result] = await pool.query(
      `INSERT INTO pedidos (usuario_id, numero_pedido, subtotal, impuestos, total, direccion_envio, estado)
       VALUES (?, ?, ?, ?, ?, ?, 'PENDIENTE')`,
      [usuarioId, numeroPedido, subtotal, impuestos, total, direccion]
    );
    return { id: result.insertId, numero_pedido: numeroPedido };
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM pedidos WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) return null;

    const pedido = rows[0];

    // Obtener detalle del pedido
    const [detalle] = await pool.query(
      `SELECT dp.*, p.nombre, t.talla
       FROM detalle_pedido dp
       JOIN productos p ON dp.producto_id = p.id
       JOIN tallas t ON dp.talla_id = t.id
       WHERE dp.pedido_id = ?`,
      [id]
    );

    pedido.items = detalle;
    return pedido;
  }

  static async getByUsuario(usuarioId, limit = 10, offset = 0) {
    const [rows] = await pool.query(
      'SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY fecha_creacion DESC LIMIT ? OFFSET ?',
      [usuarioId, limit, offset]
    );
    return rows;
  }

  static async getAll(limit = 20, offset = 0) {
    const [rows] = await pool.query(
      'SELECT * FROM pedidos ORDER BY fecha_creacion DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }

  static async updateEstado(id, estado) {
    await pool.query(
      'UPDATE pedidos SET estado = ? WHERE id = ?',
      [estado, id]
    );
  }

  static async addDetalle(pedidoId, productoId, tallaId, cantidad, precioUnitario) {
    const subtotal = cantidad * precioUnitario;
    await pool.query(
      `INSERT INTO detalle_pedido (pedido_id, producto_id, talla_id, cantidad, precio_unitario, subtotal)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [pedidoId, productoId, tallaId, cantidad, precioUnitario, subtotal]
    );
  }
}
