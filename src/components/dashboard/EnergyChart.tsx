import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { MOCK_DAILY_7DAYS } from '../../data/mockData';
import { Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface EnergyChartProps {
  className?: string;
}

export const EnergyChart: React.FC<EnergyChartProps> = ({ className = '' }) => {
  const data = MOCK_DAILY_7DAYS;
  const targetKwhTon = 92.0; // Industry standard benchmark target

  return (
    <div className={`p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Specific Energy Consumption (SEC)
            </h3>
            <p className="text-xs text-slate-400">
              Electrical energy consumed per ton of cement (Benchmark Target: {targetKwhTon} kWh/ton)
            </p>
          </div>
        </div>

        {/* Target Status Warning Tag */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Today: 96.0 kWh/t (+4.3% over target)</span>
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-64 sm:h-72 mt-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              domain={[80, 105]}
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = Number(payload[0].value);
                  const isHigh = val > targetKwhTon;
                  const diff = (val - targetKwhTon).toFixed(1);

                  return (
                    <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                      <div className="font-semibold text-slate-200">{label}</div>
                      <div className="flex items-center justify-between gap-4 text-yellow-400">
                        <span>Energy per Ton:</span>
                        <span className="font-mono font-bold">{val} kWh/t</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-slate-400">
                        <span>Benchmark Target:</span>
                        <span className="font-mono">{targetKwhTon} kWh/t</span>
                      </div>
                      <div
                        className={`text-[11px] font-medium pt-1 border-t border-slate-800 ${
                          isHigh ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {isHigh ? `⚠ Exceeds target by +${diff} kWh/t` : `✓ Optimal (-${Math.abs(Number(diff))} kWh/t)`}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              formatter={() => (
                <span className="text-slate-300">
                  Daily Specific Energy Consumption (kWh / ton)
                </span>
              )}
            />
            {/* Target benchmark reference line */}
            <ReferenceLine
              y={targetKwhTon}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Target: ${targetKwhTon} kWh/t`,
                position: 'insideTopRight',
                fill: '#f59e0b',
                fontSize: 10
              }}
            />
            <Bar
              dataKey="energyKwhTon"
              fill="#eab308"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
