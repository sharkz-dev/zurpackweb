import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log('Intento de login para usuario:', username);
      
      // Buscar admin por username
      const admin = await Admin.findOne({ username });
      console.log('Admin encontrado:', admin ? 'Sí' : 'No');
      
      if (!admin) {
        console.log('Admin no encontrado');
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
  
      // Verificar contraseña
      const isMatch = await admin.matchPassword(password);
      console.log('Contraseña coincide:', isMatch ? 'Sí' : 'No');
  
      if (!isMatch) {
        console.log('Contraseña incorrecta');
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
  
      // Generar token
      const token = jwt.sign(
        { id: admin._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      
      console.log('Login exitoso, enviando respuesta');
      
      res.json({
        _id: admin._id,
        username: admin.username,
        token
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ message: error.message });
    }
  });

export default router;