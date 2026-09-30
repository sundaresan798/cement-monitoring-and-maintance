import React from 'react';
import { EnergyData } from '../types';
import { Badge } from '../components/common/Badge';
import {
  Zap,
  DollarSign,
  Fuel,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { MOCK_DAILY_7DAYS } from '../data/mockData';
import { formatNumber, formatEnergy, formatCurrency } from '../utils/calculations';

interface EnergyMonitoringPageProps {
  energyData: EnergyData;
}

export const EnergyMonitoringPage: React.FC<EnergyMonitoringPageProps> = ({ energyData }) => {
  const isExceeded = energyData.energyConsumedPerTon > energyData.targetEnergyPerTon;
  const variance = (energyData.energyConsumedPerTon - energyData.targetEnergyPerTon).toFixed(1);

  // Monthly breakdown simulation
  const monthlyEnergyTrend = [
    { month: 'Apr', totalGwh: 14.2, secKwhTon: 93.1, costK: 1278 },
    { month: 'May', totalGwh: 13.9, secKwhTon: 91.5, costK: 1251 },
    { month: 'Jun', totalGwh: 14.5, secKwhTon: 94.0, costK: 1305 },
    { month: 'Jul', totalGwh: 13.7, secKwhTon: 90.8, costK: 1233 },
    { month: 'Aug', totalGwh: 14.1, secKwhTon: 92.4, costK: 1269 },
    { month: 'Sep (MTD)', totalGwh: 13.8, secKwhTon: 96.0, costK: 1242 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              Energy Efficiency & Utilities
            </span>
            <Badge variant={isExceeded ? 'warning' : 'success'}>
              {isExceeded ? 'Target Exceeded (+4.3%)' : 'Optimal Efficiency'}
            </Badge>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Centralized Energy & Electrical Management
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Real-time monitoring of specific electrical energy (kWh/t), pulverized coal consumption, and utility cost estimation.
          </p>
        </div>

        {isExceeded && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs text-amber-200">
              <span className="font-bold block">Energy Audit Warning</span>
              Specific energy is +{variance} kWh/ton above the 92.0 kWh/t benchmark.
            </div>
          </div>
        )}
      </div>

      {/* 4 Stat Cards for Energy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Electricity */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400" />
              Daily Electricity
            </span>
            <span className="font-mono text-slate-400">Today</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold font-mono text-white">
              {formatEnergy(energyData.dailyElectricityKwh)}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {formatNumber(energyData.dailyElectricityKwh)} total kWh logged
          </p>
        </div>

        {/* Monthly Electricity */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-sky-400" />
              Month-to-Date Energy
            </span>
            <span className="font-mono text-slate-400">September</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold font-mono text-white">
              {formatEnergy(energyData.monthlyElectricityKwh)}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Plant monthly consumption across all mills
          </p>
        </div>

        {/* Fuel Consumption */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Fuel className="w-4 h-4 text-orange-400" />
              Coal Fuel Burned
            </span>
            <span className="font-mono text-slate-400">Thermal</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold font-mono text-white">
              {energyData.fuelConsumptionTons}
            </span>
            <span className="text-xs font-mono text-slate-400">tons</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Pulverized coal firing in rotary kiln calciner
          </p>
        </div>

        {/* Estimated Energy Cost */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Estimated Daily Cost
            </span>
            <span className="font-mono text-slate-400">Tariff: $0.09/kWh</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold font-mono text-white">
              {formatCurrency(energyData.estimatedCostUsd)}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Calculated industrial electricity billing
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Specific Energy Chart */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">
                Daily Specific Energy Consumption (kWh/ton)
              </h3>
              <p className="text-xs text-slate-400">
                Formula: Total Electrical Energy (kWh) ÷ Total Clinker Produced (tons)
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-semibold">
              Target: {energyData.targetEnergyPerTon} kWh/t
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DAILY_7DAYS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[80, 105]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-xs space-y-1">
                          <div className="font-semibold text-slate-300">{label}</div>
                          <div className="text-yellow-400 font-mono font-bold">
                            SEC: {payload[0].value} kWh/ton
                          </div>
                          <div className="text-slate-400 font-mono">
                            Target: {energyData.targetEnergyPerTon} kWh/ton
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={energyData.targetEnergyPerTon}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{ value: 'Target: 92 kWh/t', fill: '#f59e0b', fontSize: 10 }}
                />
                <Bar dataKey="energyKwhTon" fill="#eab308" radius={[4, 4, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Energy & Cost Trend */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">
                Monthly Electrical Consumption (GWh)
              </h3>
              <p className="text-xs text-slate-400">
                Six-month historical utility tracking
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              Current: 13.8 GWh
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyEnergyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[12, 16]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-xs space-y-1">
                          <div className="font-semibold text-slate-300">{label}</div>
                          <div className="text-cyan-400 font-mono font-bold">
                            Total Energy: {payload[0].value} GWh
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="totalGwh" fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
