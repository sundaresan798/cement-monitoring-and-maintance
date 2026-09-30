import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  target?: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string | number;
    label: string;
    isPositiveGood?: boolean; // If true, positive is green, negative is red. For energy/downtime, negative is green!
    direction?: 'up' | 'down';
  };
  status?: 'normal' | 'warning' | 'critical' | 'success';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  target,
  subtitle,
  icon: Icon,
  trend,
  status = 'normal',
  onClick
}) => {
  const statusBorder = {
    normal: 'border-slate-800 hover:border-slate-700',
    success: 'border-emerald-800/60 bg-emerald-950/20',
    warning: 'border-amber-800/60 bg-amber-950/20',
    critical: 'border-rose-800/60 bg-rose-950/20'
  }[status];

  const getTrendColor = () => {
    if (!trend) return 'text-slate-400';
    const isUp = trend.direction === 'up';
    const isGood = trend.isPositiveGood !== undefined 
      ? (isUp ? trend.isPositiveGood : !trend.isPositiveGood)
      : isUp;

    return isGood ? 'text-emerald-400' : 'text-rose-400';
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-4 md:p-5 rounded-xl bg-slate-900/90 border transition-all duration-200 shadow-sm ${statusBorder} ${
        onClick ? 'cursor-pointer hover:bg-slate-850' : ''
      }`}
    >
      {/* Header with Title and Icon */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">
          {title}
        </span>
        <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 shrink-0">
          <Icon className="w-4 h-4 text-amber-400" />
        </div>
      </div>

      {/* Primary Value */}
      <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
        <span className="text-2xl md:text-3xl font-bold tracking-tight text-white font-mono">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-slate-400 font-mono">
            {unit}
          </span>
        )}
      </div>

      {/* Target & Trend Information */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs gap-2">
        {target !== undefined ? (
          <span className="text-slate-400 truncate">
            Target: <strong className="text-slate-200 font-mono font-semibold">{target}</strong>
          </span>
        ) : subtitle ? (
          <span className="text-slate-400 truncate">{subtitle}</span>
        ) : (
          <span />
        )}

        {trend && (
          <div className={`flex items-center gap-0.5 font-medium shrink-0 text-[11px] ${getTrendColor()}`}>
            {trend.direction === 'up' ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : trend.direction === 'down' ? (
              <ArrowDownRight className="w-3.5 h-3.5" />
            ) : null}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
};
