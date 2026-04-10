import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import providersRoutes from './routes/providersRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import { requireAuth } from './middleware/requireAuth.js';
import { requireAdmin } from './middleware/requireAdmin.js';

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', requireAuth, requireAdmin, usersRoutes);
app.use('/api/products', requireAuth, productsRoutes);
app.use('/api/providers', requireAuth, providersRoutes);
app.use('/api/inventory', requireAuth, inventoryRoutes);
app.use('/api/sales', requireAuth, salesRoutes);

export default app;
