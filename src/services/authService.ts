/**
 * Authentication Service (authService)
 * 
 * Manages HTTP communication with the backend authentication endpoints:
 * - POST /api/auth/login
 * - POST /api/auth/register
 * - GET  /api/auth/me
 * - GET  /api/users (Admin only)
 * 
 * Token management handles secure local or session storage according to
 * the user's "Remember Me" preference.
 */

import { User } from '../types';

const TOKEN_KEY = 'cement_plant_auth_token';
const REMEMBER_KEY = 'cement_plant_remember_me';

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export const authService = {
  // Store authentication token
  setToken(token: string, rememberMe = true): void {
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REMEMBER_KEY, 'true');
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REMEMBER_KEY);
    }
  },

  // Retrieve stored token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  // Remove stored token
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  },

  // Login request
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      return data;
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Unable to connect to authentication server'
      };
    }
  },

  // Register request
  async register(params: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    role: string;
  }): Promise<RegisterResponse> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      const data = await response.json();
      return data;
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Registration request failed'
      };
    }
  },

  // Fetch current user from server using token
  async getMe(): Promise<{ success: boolean; user?: User; message?: string }> {
    const token = this.getToken();
    if (!token) {
      return { success: false, message: 'No token stored' };
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
        }
        return { success: false, message: 'Session expired or invalid' };
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      return { success: false, message: 'Server connection error' };
    }
  },

  // Fetch all registered users (Admin only)
  async getAllUsers(): Promise<{ success: boolean; users?: any[]; message?: string }> {
    const token = this.getToken();
    if (!token) return { success: false, message: 'Not authenticated' };

    try {
      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return await response.json();
    } catch (err: any) {
      return { success: false, message: 'Failed to fetch users list' };
    }
  }
};
