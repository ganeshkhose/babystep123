import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import productRoutes from './routes/productRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());

// Serve static product assets
app.use('/products', express.static(path.join(process.cwd(), 'public', 'products')));

// Root welcome endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Baby Step API',
    status: 'online',
    message: 'Welcome to the Baby Step API Server 🌸',
    endpoints: {
      health: '/health',
      products: '/api/products',
    },
    storeFrontend: 'https://babystep123-1.onrender.com',
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

// Centralized error handling
app.use(errorHandler);

export default app;
