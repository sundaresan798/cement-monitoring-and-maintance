/**
 * Authentication Context (AuthContext)
 * 
 * Provides global authentication state throughout the React component hierarchy:
 * - currentUser: User | null
 * - token: string | null
 * - isAuthenticated: boolean
 * - isLoading: boolean
 * - login(email, password, rememberMe): Promise<{ success: boolean; message: string }>
 * - register(userData): Promise<{ success: boolean; message: string }>
 * - logout(): void
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    role: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(authService.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate stored session on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = authService.getToken();
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setCurrentUser(res.user);
            setToken(storedToken);
          } else {
            // Token expired or invalid
            authService.clearToken();
            setToken(null);
            setCurrentUser(null);
          }
        } catch (err) {
          authService.clearToken();
          setToken(null);
          setCurrentUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      if (res.success && res.token && res.user) {
        authService.setToken(res.token, rememberMe);
        setToken(res.token);
        setCurrentUser(res.user);
        setIsLoading(false);
        return { success: true, message: res.message || 'Login successful' };
      } else {
        setIsLoading(false);
        return { success: false, message: res.message || 'Invalid credentials' };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err.message || 'Network error occurred' };
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    role: string;
  }): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      if (res.success && res.token && res.user) {
        authService.setToken(res.token, true);
        setToken(res.token);
        setCurrentUser(res.user);
        setIsLoading(false);
        return { success: true, message: res.message || 'Registration successful' };
      } else {
        setIsLoading(false);
        return { success: false, message: res.message || 'Registration failed' };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err.message || 'Network error occurred' };
    }
  };

  const logout = () => {
    authService.clearToken();
    setToken(null);
    setCurrentUser(null);
  };

  const refreshUser = async () => {
    const res = await authService.getMe();
    if (res.success && res.user) {
      setCurrentUser(res.user);
    }
  };

  const value: AuthContextType = {
    currentUser,
    token,
    isAuthenticated: !!currentUser && !!token,
    isLoading,
    login,
    register,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
