/**
 * Sidebar Navigation Component
 * 
 * Enforces Role-Based UI visibility:
 * - Admin: Dashboard, Kiln, Energy, Raw Materials, Maintenance, Production, Reports, Users
 * - Plant Manager: Dashboard, Kiln, Energy, Raw Materials, Maintenance, Production, Reports
 * - Operator: Dashboard, Kiln, Energy, Raw Materials
 */

import React from 'react';
import {
  LayoutDashboard,
  Flame,
  Zap,
  Boxes,
  Wrench,
  TrendingUp,
  FileText,
  Activity,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  HardHat,
  Users
} from 'lucide-react';
import { UserRole } from '../../types';

export type NavigationTab = 
  | 'dashboard' 
  | 'kiln' 
  | 'energy' 
  | 'materials' 
  | 'maintenance' 
  | 'production' 
  | 'reports'
  | 'users';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  unreadAlertCount: number;
  userRole?: UserRole;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  description: string;
  allowedRoles: string[]; // Lowercase roles
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  unreadAlertCount,
  userRole = 'operator'
}) => {
  const normalizedRole = userRole.toLowerCase();

  const allNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Main Dashboard',
      icon: LayoutDashboard,
      description: 'Plant overview & real-time KPIs',
      allowedRoles: ['admin', 'plant_manager', 'operator']
    },
    {
      id: 'kiln',
      label: 'Kiln Monitoring',
      icon: Flame,
      badge: '1,465°C',
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800/40',
      description: 'Pyroprocessing & temperature',
      allowedRoles: ['admin', 'plant_manager', 'operator']
    },
    {
      id: 'energy',
      label: 'Energy Monitoring',
      icon: Zap,
      badge: '96.0 kWh/t',
      badgeColor: 'text-yellow-400 bg-yellow-950/60 border-yellow-800/40',
      description: 'Electrical & thermal consumption',
      allowedRoles: ['admin', 'plant_manager', 'operator']
    },
    {
      id: 'materials',
      label: 'Raw Materials',
      icon: Boxes,
      badge: '2 Low',
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-800/40',
      description: 'Limestone, Clay & Gypsum stock',
      allowedRoles: ['admin', 'plant_manager', 'operator']
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: Wrench,
      badge: '1 Due',
      badgeColor: 'text-orange-400 bg-orange-950/60 border-orange-800/40',
      description: 'Machinery schedules & work orders',
      allowedRoles: ['admin', 'plant_manager']
    },
    {
      id: 'production',
      label: 'Production & KPIs',
      icon: TrendingUp,
      badge: '96.4%',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40',
      description: 'Daily output & efficiency metrics',
      allowedRoles: ['admin', 'plant_manager']
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      description: 'Daily, weekly & printable audits',
      allowedRoles: ['admin', 'plant_manager']
    },
    {
      id: 'users',
      label: 'Users Management',
      icon: Users,
      badge: 'RBAC',
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-800/40',
      description: 'Manage accounts & security roles',
      allowedRoles: ['admin']
    }
  ];

  // Filter items visible to the current role
  const visibleNavItems = allNavItems.filter((item) =>
    item.allowedRoles.includes(normalizedRole)
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand / Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-bold shadow-md shadow-amber-500/10 shrink-0">
              <Activity className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 block leading-tight">
                  Cement Plant
                </span>
                <span className="text-sm font-bold text-white tracking-tight block truncate">
                  Central SCADA
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex items-center justify-center w-7 h-7 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Plant Line & Status Pill */}
        {!collapsed && (
          <div className="px-4 py-3 bg-slate-950/30 border-b border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <HardHat className="w-3.5 h-3.5 text-amber-400" />
                Line 1 (5000 TPD)
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
          </div>
        )}

        {/* Navigation Items (Role-Filtered) */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onCloseMobile();
                }}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-lg transition-all text-left group relative
                  ${collapsed ? 'justify-center p-3' : 'px-3 py-2.5 gap-3'}
                  ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/30 shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white border border-transparent'
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-amber-400 rounded-r-md" />
                )}

                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />

                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                          item.badgeColor || 'text-slate-400 bg-slate-800 border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Security & Role Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          {!collapsed ? (
            <div className="p-2.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-xs text-slate-300 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">
                  Access Level
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                  {userRole}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {visibleNavItems.length} active modules enabled for your role.
              </p>
            </div>
          ) : (
            <div className="flex justify-center" title={`Role: ${userRole}`}>
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
