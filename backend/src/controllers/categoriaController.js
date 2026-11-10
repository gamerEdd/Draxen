import { Categoria } from '../models/Categoria.js';
import { asyncHandler } from '../utils/errors.js';

export const getCategorias = asyncHandler(async (req, res) => {
  const categorias = await Categoria.getAll();

  res.json({
    success: true,
    categorias
  });
});

export const getCategoria = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id);

  if (!categoria) {
    return res.status(404).json({ 
      success: false, 
      message: 'Categoría no encontrada' 
    });
  }

  res.json({
    success: true,
    categoria
  });
});

export const createCategoria = asyncHandler(async (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre) {
    return res.status(400).json({ 
      success: false, 
      message: 'El nombre es requerido' 
    });
  }

  const categoriaId = await Categoria.create({ nombre, descripcion });

  res.status(201).json({
    success: true,
    message: 'Categoría creada',
    categoriaId
  });
});

export const updateCategoria = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  const categoria = await Categoria.findById(id);
  if (!categoria) {
    return res.status(404).json({ 
      success: false, 
      message: 'Categoría no encontrada' 
    });
  }

  const categoriaActualizada = await Categoria.update(id, { nombre, descripcion });

  res.json({
    success: true,
    message: 'Categoría actualizada',
    categoria: categoriaActualizada
  });
});

export const deleteCategoria = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id);
  if (!categoria) {
    return res.status(404).json({ 
      success: false, 
      message: 'Categoría no encontrada' 
    });
  }

  await Categoria.delete(id);

  res.json({
    success: true,
    message: 'Categoría eliminada'
  });
});
