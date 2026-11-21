import jwt from 'jsonwebtoken';

export const generateToken = (userId, rol) => {
  return jwt.sign(
    { id: userId, rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d', algorithm:'HS256' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {algorithms:['HS256']});
  } catch (error) {
    return null;
  }
};
