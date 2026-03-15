import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import designRoutes from './routes/designRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import usageRoutes from './routes/usageRoutes.js';

export const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/usage', usageRoutes);
