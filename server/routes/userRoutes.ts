/**
 * User Management Routes
 * 
 * Endpoints for viewing users. Protected for 'admin' role only.
 */

import { Router } from 'express';
import { getAllUsers } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

// GET /api/users - Admin only
router.get('/', authMiddleware as any, authorizeRoles('admin') as any, getAllUsers as any);

export default router;
