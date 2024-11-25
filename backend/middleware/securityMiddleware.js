import rateLimit from 'express-rate-limit';

// Rate limiter general
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de solicitudes por ventana
  message: {
    status: 429,
    message: 'Demasiadas solicitudes, por favor intente más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de API Key y origen
export const validateRequest = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  const origin = req.get('origin');
  const referer = req.get('referer');

  // Lista de orígenes permitidos
  const allowedOrigins = [
    'https://zurpackweb.vercel.app',
    'http://localhost:5173' // Solo para desarrollo
  ];

  // Verificar si el origen está permitido
  const isValidOrigin = allowedOrigins.some(allowed => 
    origin?.includes(allowed) || referer?.includes(allowed)
  );

  // Si es un origen permitido, continuar
  if (isValidOrigin) {
    return next();
  }

  // Si no es un origen permitido, verificar API Key
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({
      status: 'error',
      message: 'Acceso no autorizado'
    });
  }

  next();
};

// Bloquear acceso directo desde navegador
export const blockDirectAccess = (req, res, next) => {
  const acceptHeader = req.get('accept');
  
  if (acceptHeader?.includes('text/html')) {
    return res.status(403).send(`
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
  }
  
  next();
};

// Middleware de seguridad general
export const securityHeaders = (req, res, next) => {
  // Headers de seguridad básicos
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Si estás usando HTTPS
  if (req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
};