import pool from '../config/database.js';

export class Imagen {
  static async addImagen(productoId, url, orden = 1) {
    const [result] = await pool.query(
      'INSERT INTO imagenes (producto_id, url, orden) VALUES (?, ?, ?)',
      [productoId, url, orden]
    );
    return result.insertId;
  }

  static async deleteImagen(id) {
    await pool.query('DELETE FROM imagenes WHERE id = ?', [id]);
  }

  static async getByProducto(productoId) {
    const [rows] = await pool.query(
      'SELECT id, url, orden FROM imagenes WHERE producto_id = ? ORDER BY orden',
      [productoId]
    );
    return rows;
  }
}
