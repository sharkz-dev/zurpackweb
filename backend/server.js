import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import quotationRoutes from './routes/quotation.js';
import advertisementRoutes from './routes/advertisements.js';

dotenv.config();

const app = express();

// Configuración de CORS actualizada
const allowedOrigins = [
  'http://localhost:5173',
  'https://zurpackweb.vercel.app',
  'https://zurpack.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // Permitir solicitudes sin origin (como Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Para manejar las pre-flight requests
app.options('*', cors());

// Middlewares
app.use(express.json());

// Log para debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Conectar a MongoDB
connectDB();

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/send-quotation', quotationRoutes);
app.use('/api/advertisements', advertisementRoutes);

// Manejador de errores CORS
app.use((err, req, res, next) => {
  if (err.message === 'No permitido por CORS') {
    res.status(403).json({
      message: 'No permitido por CORS',
      origin: req.headers.origin
    });
  } else {
    next(err);
  }
});

// Manejador de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'API route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;