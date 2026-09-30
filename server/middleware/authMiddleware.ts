/**
 * Authentication Middleware (authMiddleware)
 * 
 * Intercepts incoming HTTP requests to protected API endpoints:
 * 1. Extracts the Bearer token from the 'Authorization' header.
 * 2. Verifies token validity and expiration using JWT_SECRET.
 * 3. Fetches user details and attaches to req.user.
 * 4. Returns 401 Unauthorized for missing, invalid, or expired tokens.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'plant_manager' | 'operator';
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication failed: No token provided in Authorization header'
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'cement_plant_scada_secure_jwt_secret_key_college_demo_2026';

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          message: 'Authentication failed: Session token has expired. Please log in again.'
        });
        return;
      }
      res.status(401).json({
        success: false,
        message: 'Authentication failed: Invalid or malformed token.'
      });
      return;
    }

    // Lookup user in repository
    const user = await UserRepository.findById(decoded.id);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Authentication failed: User belonging to this token no longer exists.'
      });
      return;
    }

    // Attach user payload to request
    req.user = {
      id: user.id || user._id?.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication verification'
    });
  }
};
