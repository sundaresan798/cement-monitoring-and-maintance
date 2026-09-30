import React from 'react';
import { MaintenanceRecord, EquipmentStatus, MaintenancePriority } from '../../types';
import { Badge, BadgeVariant } from '../common/Badge';
import { Wrench, ArrowRight, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface EquipmentQuickStatusProps {
  records: MaintenanceRecord[];
  onManageMaintenance?: () => void;
}

export const EquipmentQuickStatus: React.FC<EquipmentQuickStatusProps> = ({
  records,
  onManageMaintenance
}) => {
  const getStatusBadgeVariant = (status: EquipmentStatus): BadgeVariant => {
    switch (status) {
      case 'OPERATIONAL':
        return 'success';
      case 'MAINTENANCE DUE':
        return 'warning';
      case 'UNDER MAINTENANCE':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const getPriorityStyle = (priority: MaintenancePriority) => {
    switch (priority) {
      case 'HIGH':
        return 'text-rose-400 bg-rose-950/60 border-rose-800';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-950/60 border-amber-800';
      case 'LOW':
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  // Summary counts
  const operationalCount = records.filter((r) => r.currentStatus === 'OPERATIONAL').length;
  const maintenanceDueCount = records.filter((r) => r.currentStatus === 'MAINTENANCE DUE').length;
  const underMaintenanceCount = records.filter((r) => r.currentStatus === 'UNDER MAINTENANCE').length;

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Key Machinery & Maintenance Status
              </h3>
              <p className="text-xs text-slate-400">
                Health tracking across 6 critical processing nodes
              </p>
            </div>
          </div>

          {onManageMaintenance && (
            <button
              onClick={onManageMaintenance}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 self-start sm:self-auto transition-colors"
            >
              Maintenance Schedules <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Counter Pills */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-mono">
          <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-center">
            <div className="text-lg font-bold text-emerald-400">{operationalCount}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-sans font-medium">
              Operational
            </div>
          </div>

          <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-800/40 text-center">
            <div className="text-lg font-bold text-amber-400">{maintenanceDueCount}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-sans font-medium">
              Due Soon
            </div>
          </div>

          <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-800/40 text-center">
            <div className="text-lg font-bold text-rose-400">{underMaintenanceCount}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-sans font-medium">
              Offline
            </div>
          </div>
        </div>

        {/* Equipment Table/List */}
        <div className="mt-4 space-y-2.5 overflow-x-auto">
          {records.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/70 hover:border-slate-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center font-mono font-bold text-[11px] text-amber-400 shrink-0">
                  {item.equipmentTag.split('-')[0]}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200 text-sm truncate">
                      {item.equipmentName}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      [{item.equipmentTag}]
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    Type: <strong className="text-slate-300 font-normal">{item.maintenanceType}</strong> · Assigned: {item.assignedTechnician}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${getPriorityStyle(
                    item.priority
                  )}`}
                >
                  {item.priority}
                </span>

                <Badge variant={getStatusBadgeVariant(item.currentStatus)} size="sm">
                  {item.currentStatus}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Preventive maintenance compliance: 91.6%</span>
        <span className="text-slate-300 font-mono">Next Audit: Oct 15</span>
      </div>
    </div>
  );
};
