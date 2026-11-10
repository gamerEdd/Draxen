import pool from '../config/database.js';

export class Producto {
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT p.*, c.nombre as categoria_nombre 
       FROM productos p 
       LEFT JOIN categorias c ON p.categoria_id = c.id 
       WHERE p.id = ? AND p.activo = true`,
      [id]
    );
    
    if (rows.length === 0) return null;

    const producto = rows[0];
    
    // Obtener imágenes
    const [imagenes] = await pool.query(
      'SELECT id, url, orden FROM imagenes WHERE producto_id = ? ORDER BY orden',
      [id]
    );
    producto.imagenes = imagenes;

    // Obtener tallas y stock
    const [tallas] = await pool.query(
      `SELECT t.id, t.talla, pt.stock 
       FROM producto_tallas pt 
       JOIN tallas t ON pt.talla_id = t.id 
       WHERE pt.producto_id = ?`,
      [id]
    );
    producto.tallas = tallas;

    return producto;
  }

  static async getAll(limit = 20, offset = 0, categoria_id = null, search = null) {
    let query = `SELECT p.id, p.nombre, p.precio, p.categoria_id, c.nombre as categoria_nombre
                 FROM productos p
                 LEFT JOIN categorias c ON p.categoria_id = c.id
                 WHERE p.activo = true`;
    let params = [];

    if (categoria_id) {
      query += ' AND p.categoria_id = ?';
      params.push(categoria_id);
    }

    if (search) {
      query += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);

    // Obtener primera imagen de cada producto
    for (let p of rows) {
      const [imagenes] = await pool.query(
        'SELECT url FROM imagenes WHERE producto_id = ? ORDER BY orden LIMIT 1',
        [p.id]
      );
      p.imagen_principal = imagenes[0]?.url || null;
    }

    return rows;
  }

  static async create(data) {
    const { nombre, descripcion, precio, categoria_id, creado_por } = data;
    const [result] = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, categoria_id, creado_por, activo) VALUES (?, ?, ?, ?, ?, true)',
      [nombre, descripcion, precio, categoria_id, creado_por]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { nombre, descripcion, precio, categoria_id } = data;
    await pool.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ? WHERE id = ?',
      [nombre, descripcion, precio, categoria_id, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.query('UPDATE productos SET activo = false WHERE id = ?', [id]);
  }
}
