import pool from '../config/database.js';

export class ProductoTalla {
  static async addStock(productoId, tallaId, stock) {
    const [result] = await pool.query(
      'INSERT INTO producto_tallas (producto_id, talla_id, stock) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE stock = ?',
      [productoId, tallaId, stock, stock]
    );
    return result.insertId;
  }

  static async getStock(productoId, tallaId) {
    const [rows] = await pool.query(
      'SELECT stock FROM producto_tallas WHERE producto_id = ? AND talla_id = ?',
      [productoId, tallaId]
    );
    return rows[0]?.stock || 0;
  }

  static async updateStock(productoId, tallaId, cantidad) {
    await pool.query(
      'UPDATE producto_tallas SET stock = stock - ? WHERE producto_id = ? AND talla_id = ? AND stock >= ?',
      [cantidad, productoId, tallaId, cantidad]
    );
  }

  static async incrementStock(productoId, tallaId, cantidad) {
    await pool.query(
      'UPDATE producto_tallas SET stock = stock + ? WHERE producto_id = ? AND talla_id = ?',
      [cantidad, productoId, tallaId]
    );
  }
}
