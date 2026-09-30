import React from 'react';
import { KilnData } from '../../types';
import { Badge } from '../common/Badge';
import { Flame, Gauge, Wind, RotateCw, Fuel, Weight, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatTemp } from '../../utils/calculations';

interface KilnQuickStatusProps {
  data: KilnData;
  onViewDetails?: () => void;
}

export const KilnQuickStatus: React.FC<KilnQuickStatusProps> = ({ data, onViewDetails }) => {
  // Burning zone temperature health assessment
  // Target: 1400°C - 1500°C is standard clinker sintering range
  const isTempOptimal = data.temperature >= 1400 && data.temperature <= 1500;
  const isTempHigh = data.temperature > 1500;

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Rotary Kiln Telemetry
              </h3>
              <p className="text-xs text-slate-400">Pyroprocessing Line 1</p>
            </div>
          </div>

          <Badge
            variant={
              data.status === 'RUNNING'
                ? 'success'
                : data.status === 'WARNING'
                ? 'warning'
                : 'danger'
            }
            pulse={data.status === 'RUNNING'}
          >
            {data.status}
          </Badge>
        </div>

        {/* Temperature Hero Display */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Burning Zone Temperature
            </span>
            <span
              className={`font-mono text-[11px] font-semibold flex items-center gap-1 ${
                isTempOptimal
                  ? 'text-emerald-400'
                  : isTempHigh
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {isTempOptimal ? (
                <>
                  <CheckCircle className="w-3 h-3" /> Optimal (1400-1500°C)
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3" /> Check Air/Fuel
                </>
              )}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div className="text-3xl font-bold font-mono text-white tracking-tight">
              {formatTemp(data.temperature)}
            </div>
            <div className="text-right text-xs font-mono text-slate-400">
              Inlet: <span className="text-slate-200">{formatTemp(data.inletTemp)}</span> | Cooler:{' '}
              <span className="text-slate-200">{formatTemp(data.outletTemp)}</span>
            </div>
          </div>

          {/* Temperature Range Bar */}
          <div className="mt-3 relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(10, ((data.temperature - 1000) / 600) * 100))}%` }}
            />
          </div>
        </div>

        {/* Grid of Kiln Parameters */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          {/* Drive RPM */}
          <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
              Rotational Speed
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-white">
                {data.rpm}
              </span>
              <span className="text-xs text-slate-400 font-mono">RPM</span>
            </div>
            <span className="text-[10px] text-slate-400">Main drive motor #1</span>
          </div>

          {/* Draft Pressure */}
          <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <Wind className="w-3.5 h-3.5 text-sky-400" />
              Hood Draft Pressure
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-white">
                {data.pressure}
              </span>
              <span className="text-xs text-slate-400 font-mono">mbar</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Normal draft</span>
          </div>

          {/* Fuel Consumption */}
          <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <Fuel className="w-3.5 h-3.5 text-amber-400" />
              Fuel Feed Rate
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-white">
                {data.fuelConsumption}
              </span>
              <span className="text-xs text-slate-400 font-mono">t/h</span>
            </div>
            <span className="text-[10px] text-slate-400">Pulverized coal firing</span>
          </div>

          {/* Current Raw Meal Feed */}
          <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <Weight className="w-3.5 h-3.5 text-violet-400" />
              Raw Meal Feed
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-white">
                {data.currentLoad}
              </span>
              <span className="text-xs text-slate-400 font-mono">t/h</span>
            </div>
            <span className="text-[10px] text-slate-400">Preheater feed line</span>
          </div>
        </div>
      </div>

      {/* Footer / View Details */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px] font-mono">
          Last polled: {data.lastUpdated}
        </span>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
          >
            Full Kiln SCADA →
          </button>
        )}
      </div>
    </div>
  );
};
