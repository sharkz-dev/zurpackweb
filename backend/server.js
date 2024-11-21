import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import quotationRoutes from './routes/quotation.js';
import advertisementRoutes from './routes/advertisements.js';
import contactRoutes from './routes/contact.js';

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Lista de orígenes permitidos
const allowedOrigins = [
  'http://localhost:5173',
  'https://zurpackweb.vercel.app',
  'https://zurpack.vercel.app'
];

// Configuración de CORS detallada
const corsOptions = {
  origin: function(origin, callback) {
    // Permitir solicitudes sin origin (como Postman o solicitudes locales)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging para desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);
    next();
  });
}

// Conectar a MongoDB
connectDB();

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/send-quotation', quotationRoutes);
app.use('/api/advertisements', advertisementRoutes);
app.use('/api/send-contact', contactRoutes);

// Ruta de healthcheck
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Manejador de errores CORS
app.use((err, req, res, next) => {
  if (err.message === 'No permitido por CORS') {
    res.status(403).json({
      error: 'CORS Error',
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
    error: 'Not Found',
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      'GET /api/health',
      'POST /api/auth/login',
      'GET /api/products',
      'POST /api/products',
      'GET /api/products/:id',
      'PUT /api/products/:id',
      'DELETE /api/products/:id',
      'POST /api/send-quotation',
      'GET /api/advertisements',
      'POST /api/advertisements',
      'PUT /api/advertisements/:id',
      'DELETE /api/advertisements/:id',
      'POST /api/send-contact'
    ]
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  
  const errorResponse = {
    error: err.name || 'Error',
    message: err.message || 'Ha ocurrido un error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err
    })
  };

  res.status(err.status || 500).json(errorResponse);
});

// Configuración del puerto
const PORT = process.env.PORT || 5000;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`
    🚀 Servidor corriendo en puerto ${PORT}
    🌍 Modo: ${process.env.NODE_ENV}
    📅 ${new Date().toLocaleString()}
  `);
});

// Manejo de errores de servidor
server.on('error', (error) => {
  console.error('Error del servidor:', error);
  process.exit(1);
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('Recibida señal SIGTERM. Cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Recibida señal SIGINT. Cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado.');
    process.exit(0);
  });
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
  server.close(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
  server.close(() => {
    process.exit(1);
  });
});

export default app;