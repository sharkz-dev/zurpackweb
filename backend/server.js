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

// Configurar CORS correctamente
app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend
  credentials: true
}));

// Middlewares
app.use(express.json());

// Log para debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Conectar a MongoDB
connectDB();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/send-quotation', quotationRoutes);
app.use('/api/advertisements', advertisementRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});