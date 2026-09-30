/**
 * Top Header Component
 * 
 * Displays:
 * - Plant title & responsive hamburger menu
 * - Live digital clock & Shift A indicator
 * - Telemetry alert notification bell
 * - Authenticated User Name, Role, and dedicated Logout button
 */

import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  Clock,
  LogOut,
  User as UserIcon,
  Shield,
  Layers,
  ChevronDown,
  HardHat
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  title: string;
  subtitle?: string;
  unreadAlertCount: number;
  onOpenAlerts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  title,
  subtitle,
  unreadAlertCount,
  onOpenAlerts
}) => {
  const { currentUser, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatRoleLabel = (role?: string) => {
    const norm = role?.toLowerCase();
    switch (norm) {
      case 'admin':
        return 'Administrator';
      case 'plant_manager':
        return 'Plant Manager';
      case 'operator':
        return 'Control Room Operator';
      default:
        return role || 'Personnel';
    }
  };

  const getRoleBadgeStyle = (role?: string) => {
    const norm = role?.toLowerCase();
    switch (norm) {
      case 'admin':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/80';
      case 'plant_manager':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/80';
      case 'operator':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/80';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-sm">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg lg:hidden"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-bold text-white truncate tracking-tight flex items-center gap-2">
            <span>{title}</span>
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-400 truncate hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {/* Live Industrial Clock & Shift Tag */}
        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-amber-300">{currentTime || '--:--:--'}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Shift A (06:00-14:00)</span>
        </div>

        {/* Real-time Alerts Notification Bell */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          title="Active Telemetry Alerts"
        >
          <Bell className="w-5 h-5" />
          {unreadAlertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-900 animate-pulse">
              {unreadAlertCount}
            </span>
          )}
        </button>

        {/* User Profile Card: Name, Role & Logout Button */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
              {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-100 leading-tight truncate max-w-[140px]">
                {currentUser?.name || 'Authorized User'}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold ${getRoleBadgeStyle(
                    currentUser?.role
                  )}`}
                >
                  {formatRoleLabel(currentUser?.role)}
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-800/80 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-all group shadow-xs"
            title="Log out from central terminal"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-400 transition-colors" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
