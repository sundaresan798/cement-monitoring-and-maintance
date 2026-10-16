/**
 * Cement Plant Centralized Monitoring and Production Management System
 * Node.js + Express.js Full-Stack Application Server
 * 
 * Integrates:
 * - Express REST API routes (/api/auth, /api/users, /api/dashboard, etc.)
 * - JWT authentication & role-based middleware
 * - MongoDB / Mongoose connection with fallback demo seed store
 * - Vite dev server middleware mounted on Port 3000
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './server/config/db';
import { seedInitialUsers } from './server/seed/seedUsers';
import authRoutes from './server/routes/authRoutes';
import userRoutes from './server/routes/userRoutes';
import dataRoutes from './server/routes/dataRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser
app.use(express.json());

// Health check & database connection status (public)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Cement Plant SCADA Monitoring Backend',
    database: getDBStatus(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', dataRoutes);

async function startServer() {
  // 1. Initialize Database connection
  await connectDB();

  // 2. Seed initial demo users with bcrypt passwords
  await seedInitialUsers();

  // 3. Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('[Vite] Development middleware mounted successfully.');
  } else {
    // Production static file serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  // 4. Start Listening on Port 3000
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Cement Plant SCADA System listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error] Failed to start server:', err);
});
