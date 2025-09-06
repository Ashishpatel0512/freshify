import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import './config/db.js';
import authRoutes from './routes/authRoutes.js';
import vegRoutes from './routes/vegRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminExtras from './routes/adminExtras.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/vegetables', vegRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminExtras);

// error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
