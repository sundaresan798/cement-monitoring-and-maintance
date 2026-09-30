/**
 * Authentication Routes
 * 
 * Endpoints for user login, registration, and active session verification.
 */

import { Router } from 'express';
import { login, register, getMe } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.get('/me', authMiddleware as any, getMe as any);

export default router;
