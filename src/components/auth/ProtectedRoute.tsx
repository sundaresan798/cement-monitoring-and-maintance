/**
 * Protected Route Wrapper
 * 
 * Ensures that child components can only be accessed by authenticated users.
 * If authentication is loading, displays an industrial loading spinner.
 * If unauthenticated, displays the Login screen.
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Factory } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 animate-pulse">
          <Factory className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          <span>Verifying SCADA Security Credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
