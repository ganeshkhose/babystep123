import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());

// Root welcome endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Baby Step API',
    status: 'online',
    message: 'Welcome to the Baby Step API Server 🌸',
    endpoints: {
      health: '/health',
      products: '/api/products',
      orders: '/api/orders',
    },
    storeFrontend: 'https://baby-step-client.onrender.com',
  });
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Baby Step API',
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Centralized error handling
app.use(errorHandler);

export default app;
