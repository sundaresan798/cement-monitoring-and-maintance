import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { MOCK_HOURLY_TREND, MOCK_DAILY_7DAYS } from '../../data/mockData';
import { TrendingUp, Calendar, Clock } from 'lucide-react';

interface ProductionChartProps {
  className?: string;
}

export const ProductionChart: React.FC<ProductionChartProps> = ({ className = '' }) => {
  const [viewMode, setViewMode] = useState<'hourly' | 'daily'>('hourly');

  const hourlyData = MOCK_HOURLY_TREND;
  const dailyData = MOCK_DAILY_7DAYS;

  return (
    <div className={`p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm ${className}`}>
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Production Trend vs Target
            </h3>
            <p className="text-xs text-slate-400">
              {viewMode === 'hourly'
                ? 'Hourly clinker output (metric tons/hour) against 210 t/h operational target'
                : 'Last 7 days daily production against 5,000 t/day standard target'}
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('hourly')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'hourly'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3 h-3" />
            Hourly Shift
          </button>
          <button
            onClick={() => setViewMode('daily')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'daily'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3 h-3" />
            7-Day History
          </button>
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="h-64 sm:h-72 mt-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'hourly' ? (
            <ComposedChart
              data={hourlyData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="prodColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                domain={[150, 240]}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const actual = payload.find((p) => p.dataKey === 'actualProduction')?.value;
                    const target = payload.find((p) => p.dataKey === 'targetProduction')?.value;
                    return (
                      <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                        <div className="font-semibold text-slate-200">{label} Hours</div>
                        <div className="flex items-center justify-between gap-4 text-amber-400">
                          <span>Actual Output:</span>
                          <span className="font-mono font-bold">{actual} tons/h</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-slate-400">
                          <span>Nominal Target:</span>
                          <span className="font-mono">{target} tons/h</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                formatter={(value) => (
                  <span className="text-slate-300">
                    {value === 'actualProduction' ? 'Actual Production (t/h)' : 'Target Capacity (210 t/h)'}
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="actualProduction"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#prodColor)"
              />
              <Line
                type="monotone"
                dataKey="targetProduction"
                stroke="#38bdf8"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </ComposedChart>
          ) : (
            <ComposedChart
              data={dailyData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                domain={[4400, 5300]}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const actual = payload.find((p) => p.dataKey === 'actual')?.value;
                    const target = payload.find((p) => p.dataKey === 'target')?.value;
                    return (
                      <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                        <div className="font-semibold text-slate-200">{label}</div>
                        <div className="flex items-center justify-between gap-4 text-emerald-400">
                          <span>Actual Output:</span>
                          <span className="font-mono font-bold">{actual} tons</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-slate-400">
                          <span>Target Output:</span>
                          <span className="font-mono">{target} tons</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                formatter={(value) => (
                  <span className="text-slate-300">
                    {value === 'actual' ? 'Actual Output (tons/day)' : 'Target Capacity (5,000 t)'}
                  </span>
                )}
              />
              <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={36} />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
