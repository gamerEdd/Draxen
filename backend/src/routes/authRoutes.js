import {googleConfig,googleLogin} from '../controllers/googleController.js';
import {authLimit} from '../middleware/limits.js';
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
router.get('/google/config',googleConfig);
router.post('/google',authLimit,googleLogin);
router.post('/register',authLimit, register);
router.post('/login',authLimit, login);

// Rutas protegidas
router.get('/perfil', authMiddleware, getPerfil);
router.put('/perfil', authMiddleware, updatePerfil);
router.get('/usuarios', authMiddleware, adminMiddleware, getUsuarios);

export default router;
