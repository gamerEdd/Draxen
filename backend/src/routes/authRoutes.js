import express from 'express';
import {
  register,
  login,
  getPerfil,
  updatePerfil,
  getUsuarios
} from '../controllers/authController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/perfil', authMiddleware, getPerfil);
router.put('/perfil', authMiddleware, updatePerfil);
router.get('/usuarios', authMiddleware, adminMiddleware, getUsuarios);

export default router;
