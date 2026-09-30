import React, { useState } from 'react';
import { PlantAlert } from '../../types';
import { Badge } from '../common/Badge';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCheck } from 'lucide-react';

interface ActiveAlertsProps {
  alerts: PlantAlert[];
  onAcknowledge?: (alertId: string) => void;
  onClearAll?: () => void;
}

export const ActiveAlerts: React.FC<ActiveAlertsProps> = ({
  alerts: initialAlerts,
  onAcknowledge,
  onClearAll
}) => {
  const [filter, setFilter] = useState<'ALL' | 'UNACKNOWLEDGED'>('ALL');

  const filteredAlerts = filter === 'UNACKNOWLEDGED'
    ? initialAlerts.filter((a) => !a.acknowledged)
    : initialAlerts;

  const getAlertIcon = (severity: PlantAlert['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'INFO':
        return <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
  };

  const getBadgeVariant = (severity: PlantAlert['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'danger' as const;
      case 'WARNING':
        return 'warning' as const;
      case 'INFO':
        return 'info' as const;
    }
  };

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Central Control Room (CCR) Telemetry Alerts
            </h3>
            <p className="text-xs text-slate-400">
              Live alarm notifications & threshold exceedance events
            </p>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'ALL'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Logs ({initialAlerts.length})
          </button>
          <button
            onClick={() => setFilter('UNACKNOWLEDGED')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'UNACKNOWLEDGED'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Alarms ({initialAlerts.filter((a) => !a.acknowledged).length})
          </button>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="mt-4 space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            <CheckCheck className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
            All system alarms have been acknowledged.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                alert.acknowledged
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                  : 'bg-slate-950/80 border-slate-700/80'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">{getAlertIcon(alert.severity)}</div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">
                      {alert.equipment}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      @{alert.timestamp}
                    </span>
                    <Badge variant={getBadgeVariant(alert.severity)} size="sm">
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {alert.message}
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Param: <span className="text-amber-400">{alert.parameter}</span> | Reading: <span className="text-white font-semibold">{alert.value}</span> (Threshold: {alert.threshold})
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {!alert.acknowledged && onAcknowledge ? (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-medium transition-colors"
                  >
                    Acknowledge
                  </button>
                ) : (
                  <span className="text-[10px] font-mono text-emerald-400/90 flex items-center gap-1">
                    <CheckCheck className="w-3 h-3" /> Acknowledged
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
