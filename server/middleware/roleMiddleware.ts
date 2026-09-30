/**
 * Role-Based Authorization Middleware (roleMiddleware)
 * 
 * Enforces Role-Based Access Control (RBAC) on protected endpoints.
 * Verifies that the authenticated user possesses one of the allowed roles.
 * Returns HTTP 403 Forbidden with a clear message if access is denied.
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { UserRole } from '../models/User';

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User authentication required.'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access denied. Your role '${req.user.role}' lacks permission to perform this action.`,
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
      return;
    }

    next();
  };
};
