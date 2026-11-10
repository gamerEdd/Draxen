import { Producto } from '../models/Producto.js';
import { Imagen } from '../models/Imagen.js';
import { ProductoTalla } from '../models/ProductoTalla.js';
import { asyncHandler } from '../utils/errors.js';

export const getAllProductos = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const offset = (page - 1) * limit;
  const categoria_id = req.query.categoria_id;
  const search = req.query.search;

  const productos = await Producto.getAll(limit, offset, categoria_id, search);

  res.json({
    success: true,
    productos,
    page,
    limit
  });
});

export const getProducto = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const producto = await Producto.findById(id);

  if (!producto) {
    return res.status(404).json({ 
      success: false, 
      message: 'Producto no encontrado' 
    });
  }

  res.json({
    success: true,
    producto
  });
});

export const createProducto = asyncHandler(async (req, res) => {
  const { nombre, descripcion, precio, categoria_id, imagenes, tallas } = req.body;

  // Validar
  if (!nombre || !precio || !categoria_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'Faltan campos requeridos' 
    });
  }

  // Crear producto
  const productoId = await Producto.create({
    nombre,
    descripcion,
    precio,
    categoria_id,
    creado_por: req.user.id
  });

  // Agregar imágenes
  if (imagenes && Array.isArray(imagenes)) {
    for (let i = 0; i < imagenes.length; i++) {
      await Imagen.addImagen(productoId, imagenes[i], i + 1);
    }
  }

  // Agregar tallas y stock
  if (tallas && Array.isArray(tallas)) {
    for (const talla of tallas) {
      await ProductoTalla.addStock(productoId, talla.talla_id, talla.stock);
    }
  }

  res.status(201).json({
    success: true,
    message: 'Producto creado exitosamente',
    productoId
  });
});

export const updateProducto = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, categoria_id } = req.body;

  // Validar que el producto existe
  let producto = await Producto.findById(id);
  if (!producto) {
    return res.status(404).json({ 
      success: false, 
      message: 'Producto no encontrado' 
    });
  }

  // Actualizar
  producto = await Producto.update(id, {
    nombre,
    descripcion,
    precio,
    categoria_id
  });

  res.json({
    success: true,
    message: 'Producto actualizado',
    producto
  });
});

export const deleteProducto = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validar que el producto existe
  const producto = await Producto.findById(id);
  if (!producto) {
    return res.status(404).json({ 
      success: false, 
      message: 'Producto no encontrado' 
    });
  }

  await Producto.delete(id);

  res.json({
    success: true,
    message: 'Producto eliminado'
  });
});

export const addImagen = asyncHandler(async (req, res) => {
  const { producto_id } = req.params;
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ 
      success: false, 
      message: 'URL de imagen requerida' 
    });
  }

  const imagenId = await Imagen.addImagen(producto_id, url);

  res.status(201).json({
    success: true,
    message: 'Imagen agregada',
    imagenId
  });
});

export const uploadImagen = asyncHandler(async (req, res) => {
  const { producto_id } = req.params;

  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: 'No se subió archivo' 
    });
  }

  // Guardar ruta relativa en BD
  const imagenUrl = `/images/${req.file.filename}`;
  const imagenId = await Imagen.addImagen(producto_id, imagenUrl);

  res.status(201).json({
    success: true,
    message: 'Imagen subida exitosamente',
    imagenId,
    url: imagenUrl,
    fullUrl: `http://localhost:5000${imagenUrl}`
  });
});

export const deleteImagen = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Imagen.deleteImagen(id);

  res.json({
    success: true,
    message: 'Imagen eliminada'
  });
});

export const updateStock = asyncHandler(async (req, res) => {
  const { producto_id, talla_id } = req.params;
  const { stock } = req.body;

  if (typeof stock !== 'number') {
    return res.status(400).json({ 
      success: false, 
      message: 'Stock debe ser un número' 
    });
  }

  await ProductoTalla.addStock(producto_id, talla_id, stock);

  res.json({
    success: true,
    message: 'Stock actualizado'
  });
});
