/**
 * User Management Page (Admin Only)
 * 
 * Displays all registered plant personnel fetched from GET /api/users.
 * Protected by Admin role verification both on frontend and backend.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Badge } from '../components/common/Badge';
import {
  Users,
  ShieldCheck,
  UserCheck,
  Mail,
  Calendar,
  RefreshCw,
  HardHat,
  Lock
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.getAllUsers();
      if (res.success && res.users) {
        setUsers(res.users);
      } else {
        setError(res.message || 'Failed to fetch users list.');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with backend users endpoint.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleBadgeVariant = (role: string) => {
    const normalized = role?.toLowerCase();
    switch (normalized) {
      case 'admin':
        return 'danger' as const;
      case 'plant_manager':
        return 'warning' as const;
      case 'operator':
        return 'info' as const;
      default:
        return 'neutral' as const;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
              System Administration
            </span>
            <span className="text-xs text-slate-400">
              Role-Based Access Control (RBAC)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Registered Plant Users & Roles
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Administrative directory of authenticated personnel authorized to operate central monitoring systems.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors self-start sm:self-auto border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Directory
        </button>
      </div>

      {/* Security Info Card */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200 block mb-0.5">
            Security Enforcement:
          </span>
          Passwords in the database are protected with one-way bcrypt salt-hashing (10 rounds) and never transmitted or stored in plain text. JWT bearer tokens authenticate each API call.
        </div>
      </div>

      {/* Users Table */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Personnel Directory</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Total Users: {users.length}
          </span>
        </div>

        {error ? (
          <div className="py-8 text-center text-rose-400 text-xs">{error}</div>
        ) : loading ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            Loading authorized accounts from MongoDB...
          </div>
        ) : (
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Personnel Name</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3">Assigned Role</th>
                  <th className="py-2.5 px-3">Registered On</th>
                  <th className="py-2.5 px-3">Security Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {users.map((u, idx) => (
                  <tr key={u.id || u._id || idx} className="hover:bg-slate-950/40">
                    <td className="py-3 px-3 font-sans font-semibold text-slate-200 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {u.name?.charAt(0) || 'U'}
                      </div>
                      <span>{u.name}</span>
                      {(u.id === currentUser?.id || u.email === currentUser?.email) && (
                        <span className="text-[10px] text-amber-400 font-normal font-mono">
                          (You)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-300">{u.email}</td>
                    <td className="py-3 px-3 font-sans">
                      <Badge variant={getRoleBadgeVariant(u.role)} size="sm">
                        {u.role?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Initial Seed'}
                    </td>
                    <td className="py-3 px-3 font-sans text-emerald-400 text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Bcrypt Hashed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
