import pool from '../config/database.js';

export class Categoria {
  static async getAll() {
    const [rows] = await pool.query(
      'SELECT id, nombre, descripcion FROM categorias WHERE activo = true'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, nombre, descripcion FROM categorias WHERE id = ? AND activo = true',
      [id]
    );
    return rows[0];
  }

  static async create(data) {
    const { nombre, descripcion } = data;
    const [result] = await pool.query(
      'INSERT INTO categorias (nombre, descripcion, activo) VALUES (?, ?, true)',
      [nombre, descripcion]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { nombre, descripcion } = data;
    await pool.query(
      'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?',
      [nombre, descripcion, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.query('UPDATE categorias SET activo = false WHERE id = ?', [id]);
  }
}
