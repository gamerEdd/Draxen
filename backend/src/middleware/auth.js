import { verifyToken } from '../config/jwt.js';
import { AppError } from '../utils/errors.js';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No token provided' 
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }

  req.user = decoded;
  next();
};

export const adminMiddleware = (req, res, next) => {
  if (req.user?.rol !== 'ADMIN') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  next();
};

export const clienteMiddleware = (req, res, next) => {
  if (req.user?.rol !== 'CLIENTE') {
    return res.status(403).json({ 
      success: false, 
      message: 'Cliente access required' 
    });
  }
  next();
};
