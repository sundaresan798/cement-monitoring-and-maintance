/**
 * Authentication Controller (authController)
 * 
 * Handles user registration, login, token generation, and profile retrieval.
 * Security features:
 * - bcrypt password verification
 * - JWT token signing with configurable expiration
 * - Prevention of public admin registration
 * - Generic error messages to prevent user enumeration
 */

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository, UserRole } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'cement_plant_scada_secure_jwt_secret_key_college_demo_2026';
const JWT_EXPIRES_IN = '24h';

// Helper to generate signed JWT token
const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token + user details
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
      return;
    }

    // Lookup user by email
    const record = await UserRepository.findByEmail(email);
    if (!record) {
      // Generic error message for security (prevents account discovery)
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Verify password with bcrypt
    const isMatch = await record.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    const { user } = record;
    const userId = user.id || user._id?.toString();

    // Generate JWT token
    const token = generateToken(userId, user.role);

    // Return sanitized response (Never include password!)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again later.'
    });
  }
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new plant manager or operator
 * @access  Public (Admin role registration is blocked publicly)
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password)'
      });
      return;
    }

    // 2. Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
      return;
    }

    // 3. Validate password strength & confirmation
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
      return;
    }

    // 4. Security Check: Do not allow public registration as Admin!
    const requestedRole: UserRole = role || 'operator';
    if (requestedRole === 'admin') {
      res.status(403).json({
        success: false,
        message: 'Security Policy: Administrator accounts cannot be created via public registration. Contact your plant IT director.'
      });
      return;
    }

    // Validate permitted public roles
    if (!['plant_manager', 'operator'].includes(requestedRole)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role selected. Allowed public roles are: plant_manager, operator'
      });
      return;
    }

    // 5. Prevent duplicate email registration
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
      return;
    }

    // 6. Create user in repository (password is hashed with bcrypt inside repository/Mongoose)
    const newUser = await UserRepository.create({
      name,
      email,
      password,
      role: requestedRole
    });

    const token = generateToken(newUser.id, newUser.role);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.'
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user details
 * @access  Private (authMiddleware)
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user profile'
    });
  }
};

/**
 * @route   GET /api/users
 * @desc    List all users (Admin only)
 * @access  Private (Admin role)
 */
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await UserRepository.findAll();
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users list'
    });
  }
};
