import pool from '../config/database.js';

export class Usuario {
  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, rol, telefono, direccion, ciudad, pais, codigo_postal FROM usuarios WHERE id = ? AND activo = true',
      [id]
    );
    return rows[0];
  }

  static async create(usuario) {
    const { nombre, email, password_hash, rol } = usuario;
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, password_hash, rol || 'CLIENTE']
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { nombre, telefono, direccion, ciudad, pais, codigo_postal } = data;
    await pool.query(
      'UPDATE usuarios SET nombre = ?, telefono = ?, direccion = ?, ciudad = ?, pais = ?, codigo_postal = ? WHERE id = ?',
      [nombre, telefono, direccion, ciudad, pais, codigo_postal, id]
    );
    return this.findById(id);
  }

  static async getAll(limit = 10, offset = 0) {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, rol, activo, fecha_creacion FROM usuarios LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }
}
