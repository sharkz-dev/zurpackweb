import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const admin = await Admin.findById(decoded.id).select('-password');
      
      if (!admin) {
        throw new Error('No autorizado');
      }
      
      req.admin = admin;
      next();
    } else {
      res.status(401).json({ message: 'No autorizado, token no encontrado' });
    }
  } catch (error) {
    res.status(401).json({ message: 'No autorizado' });
  }
};

// Middleware para verificar si es admin
export const admin = (req, res, next) => {
  if (req.admin) {
    next();
  } else {
    res.status(401).json({ message: 'No autorizado como administrador' });
  }
};