import bcrypt from 'bcryptjs';
import { Usuario } from '../models/Usuario.js';
import { generateToken } from '../config/jwt.js';
import { asyncHandler } from '../utils/errors.js';

export const register = asyncHandler(async (req, res) => {
  const { nombre, email, password } = req.body;

  // Validar
  if (!nombre || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Faltan campos requeridos' 
    });
  }

  // Verificar si el usuario existe
  const usuarioExistente = await Usuario.findByEmail(email);
  if (usuarioExistente) {
    return res.status(400).json({ 
      success: false, 
      message: 'El email ya está registrado' 
    });
  }

  // Hashear contraseña
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  // Crear usuario
  const usuarioId = await Usuario.create({
    nombre,
    email,
    password_hash,
    rol: 'CLIENTE'
  });

  const token = generateToken(usuarioId, 'CLIENTE');

  res.status(201).json({
    success: true,
    message: 'Usuario registrado exitosamente',
    token,
    usuario: {
      id: usuarioId,
      nombre,
      email,
      rol: 'CLIENTE'
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validar
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email y contraseña requeridos' 
    });
  }

  // Buscar usuario
  const usuario = await Usuario.findByEmail(email);
  if (!usuario) {
    return res.status(401).json({ 
      success: false, 
      message: 'Email o contraseña incorrectos' 
    });
  }

  // Validar contraseña
  const passwordValida = await bcrypt.compare(password, usuario.password_hash);
  if (!passwordValida) {
    return res.status(401).json({ 
      success: false, 
      message: 'Email o contraseña incorrectos' 
    });
  }

  const token = generateToken(usuario.id, usuario.rol);

  res.json({
    success: true,
    message: 'Login exitoso',
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    }
  });
});

export const getPerfil = asyncHandler(async (req, res) => {
  const usuario = await Usuario.findById(req.user.id);
  
  if (!usuario) {
    return res.status(404).json({ 
      success: false, 
      message: 'Usuario no encontrado' 
    });
  }

  res.json({
    success: true,
    usuario
  });
});

export const updatePerfil = asyncHandler(async (req, res) => {
  const { nombre, telefono, direccion, ciudad, pais, codigo_postal } = req.body;

  const usuario = await Usuario.update(req.user.id, {
    nombre,
    telefono,
    direccion,
    ciudad,
    pais,
    codigo_postal
  });

  res.json({
    success: true,
    message: 'Perfil actualizado',
    usuario
  });
});

export const getUsuarios = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const usuarios = await Usuario.getAll(limit, offset);

  res.json({
    success: true,
    usuarios,
    page,
    limit
  });
});
