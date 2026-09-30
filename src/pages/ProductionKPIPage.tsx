import React from 'react';
import { ProductionKPI } from '../types';
import { Badge } from '../components/common/Badge';
import {
  TrendingUp,
  Percent,
  Clock,
  Zap,
  Target,
  Factory,
  Scale,
  Award,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { MOCK_DAILY_7DAYS } from '../data/mockData';
import { formatNumber, formatTons } from '../utils/calculations';

interface ProductionKPIPageProps {
  kpi: ProductionKPI;
}

export const ProductionKPIPage: React.FC<ProductionKPIPageProps> = ({ kpi }) => {
  const isSurplus = kpi.productionVarianceTons >= 0;

  // Monthly clinker trend
  const monthlyProductionHistory = [
    { month: 'Apr', target: 150000, actual: 152400, efficiency: 101.6 },
    { month: 'May', target: 150000, actual: 148900, efficiency: 99.2 },
    { month: 'Jun', target: 150000, actual: 153800, efficiency: 102.5 },
    { month: 'Jul', target: 150000, actual: 146200, efficiency: 97.4 },
    { month: 'Aug', target: 150000, actual: 151100, efficiency: 100.7 },
    { month: 'Sep (MTD)', target: 150000, actual: 142600, efficiency: 95.1 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Operational Performance
            </span>
            <Badge variant={kpi.productionEfficiencyPercent >= 95 ? 'success' : 'warning'}>
              {kpi.productionEfficiencyPercent}% Target Efficiency
            </Badge>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Production & Clinker Manufacturing KPIs
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Real-time output analytics, target vs actual variances, equipment availability, and efficiency tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Cycle: {kpi.date} ({kpi.shift})</span>
        </div>
      </div>

      {/* KPI Formula Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Actual vs Target */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Factory className="w-4 h-4 text-amber-400" />
              Daily Clinker Output
            </span>
            <span className="font-mono text-slate-400">Today</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold font-mono text-white">
              {formatNumber(kpi.actualProductionTons)}
            </span>
            <span className="text-xs font-mono text-slate-400">/ {formatNumber(kpi.targetProductionTons)} t</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Target attainment: <strong>{kpi.productionEfficiencyPercent}%</strong>
          </p>
        </div>

        {/* Production Efficiency */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-emerald-400" />
              Production Efficiency
            </span>
            <span className="font-mono text-emerald-400 text-[11px]">Benchmark: 95%</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold font-mono text-white">
              {kpi.productionEfficiencyPercent}%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Formula: (Actual / Target) × 100
          </p>
        </div>

        {/* Production Variance */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-cyan-400" />
              Production Variance
            </span>
            <span className="font-mono text-slate-400">Actual - Target</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-2xl md:text-3xl font-bold font-mono ${
                isSurplus ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isSurplus ? `+${formatNumber(kpi.productionVarianceTons)}` : formatNumber(kpi.productionVarianceTons)}
            </span>
            <span className="text-xs font-mono text-slate-400">tons</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {isSurplus ? 'Surplus output achieved' : 'Production deficit from scheduled rate'}
          </p>
        </div>

        {/* Equipment Downtime */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-400" />
              Equipment Downtime
            </span>
            <span className="font-mono text-slate-400">Unplanned</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold font-mono text-white">
              {kpi.equipmentDowntimeHours}
            </span>
            <span className="text-xs font-mono text-slate-400">hours</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Overall Equipment Effectiveness (OEE): 96.7%
          </p>
        </div>
      </div>

      {/* Target vs Actual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Target vs Actual */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">
                Daily Output: Target vs Actual (7 Days)
              </h3>
              <p className="text-xs text-slate-400">
                Daily output comparing actual clinker against 5,000 t target
              </p>
            </div>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={MOCK_DAILY_7DAYS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[4400, 5300]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const actual = payload.find((p) => p.dataKey === 'actual')?.value;
                      const target = payload.find((p) => p.dataKey === 'target')?.value;
                      return (
                        <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-xs space-y-1">
                          <div className="font-semibold text-slate-200">{label}</div>
                          <div className="text-emerald-400 font-mono font-bold">
                            Actual: {actual} t
                          </div>
                          <div className="text-slate-400 font-mono">
                            Target: {target} t
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="actual" name="Actual Production" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={38} />
                <Line dataKey="target" name="Target (5,000 t)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Production Trend */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">
                Monthly Production Performance (Tons)
              </h3>
              <p className="text-xs text-slate-400">
                Month-by-month plant capacity utilization
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              MTD: {formatNumber(kpi.monthlyProductionTons)} t
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyProductionHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[140000, 160000]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const actual = payload.find((p) => p.dataKey === 'actual')?.value;
                      const eff = payload.find((p) => p.dataKey === 'actual')?.payload?.efficiency;
                      return (
                        <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-xs space-y-1">
                          <div className="font-semibold text-slate-200">{label}</div>
                          <div className="text-emerald-400 font-mono font-bold">
                            Total Output: {formatNumber(Number(actual))} tons
                          </div>
                          <div className="text-amber-400 font-mono">
                            Efficiency: {eff}%
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="actual" name="Actual Total" fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={38} />
                <Line dataKey="target" name="Monthly Target (150k t)" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
