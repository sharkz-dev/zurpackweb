import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import quotationRoutes from './routes/quotation.js';
import advertisementRoutes from './routes/advertisements.js';
import contactRoutes from './routes/contact.js';
import rateLimit from 'express-rate-limit';

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 solicitudes por ventana
});

// Middleware de seguridad básico
const securityMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const origin = req.headers.origin || req.headers.referer;

  // Lista de orígenes permitidos
  const allowedOrigins = [
    'https://zurpackweb.vercel.app',
    'http://localhost:5173'
  ];

  // Si la solicitud viene de un origen permitido o tiene la API key correcta
  if (allowedOrigins.includes(origin) || apiKey === process.env.API_KEY) {
    next();
  } else {
    // Si es una solicitud desde el navegador, mostrar página de error
    if (req.headers.accept?.includes('text/html')) {
      res.status(403).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Acceso Denegado</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f5f5f5;
              }
              .container {
                text-align: center;
                padding: 2rem;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              h1 { color: #e53e3e; }
              p { color: #4a5568; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Acceso Denegado</h1>
              <p>No se permite el acceso directo a esta API.</p>
            </div>
          </body>
        </html>
      `);
    } else {
      // Si es una solicitud de API, devolver error JSON
      res.status(403).json({
        error: 'Acceso denegado',
        message: 'No está autorizado para acceder a esta API'
      });
    }
  }
};

// Headers de seguridad
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  if (req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
};

// Configuración de CORS
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://zurpackweb.vercel.app',
      'http://localhost:5173'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(securityHeaders);
app.use(limiter);

// Conectar a MongoDB
connectDB();

// Middleware de logging para desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    next();
  });
}

// Aplicar middleware de seguridad a todas las rutas excepto /api/health y /api/auth
app.use('/api', (req, res, next) => {
  if (req.path === '/health' || req.path.startsWith('/auth')) {
    return next();
  }
  securityMiddleware(req, res, next);
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/advertisements', advertisementRoutes);
app.use('/api/send-quotation', quotationRoutes);
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
      message: 'Origen no permitido',
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
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
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

// Configuración del puerto y inicio del servidor
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
    🚀 Servidor corriendo en puerto ${PORT}
    🌍 Modo: ${process.env.NODE_ENV}
    📅 ${new Date().toLocaleString()}
  `);
});

// Manejo de errores del servidor
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

export default app;