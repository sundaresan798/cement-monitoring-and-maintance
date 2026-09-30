import React, { useState } from 'react';
import { KilnData } from '../types';
import { Badge } from '../components/common/Badge';
import {
  Flame,
  RotateCw,
  Wind,
  Fuel,
  Weight,
  Thermometer,
  AlertTriangle,
  Sliders,
  CheckCircle,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceArea
} from 'recharts';
import { MOCK_HOURLY_TREND } from '../data/mockData';
import { formatTemp } from '../utils/calculations';

interface KilnMonitoringPageProps {
  kilnData: KilnData;
  onUpdateKiln: (updated: Partial<KilnData>) => void;
}

export const KilnMonitoringPage: React.FC<KilnMonitoringPageProps> = ({
  kilnData,
  onUpdateKiln
}) => {
  const [selectedStatus, setSelectedStatus] = useState<KilnData['status']>(kilnData.status);

  const handleStatusChange = (status: KilnData['status']) => {
    setSelectedStatus(status);
    onUpdateKiln({ status });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-orange-500/20 text-orange-400 border border-orange-500/30">
              Pyroprocessing Section
            </span>
            <Badge
              variant={
                kilnData.status === 'RUNNING'
                  ? 'success'
                  : kilnData.status === 'WARNING'
                  ? 'warning'
                  : 'danger'
              }
              pulse={kilnData.status === 'RUNNING'}
            >
              {kilnData.status}
            </Badge>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {kilnData.kilnName}
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Real-time rotary kiln thermal regulation, coal burner firing rate, draft pressure, and drive motor RPM.
          </p>
        </div>

        {/* Status Override / Simulation Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-slate-400 font-medium mr-1">Simulate Status:</span>
          {(['RUNNING', 'WARNING', 'STOPPED', 'MAINTENANCE'] as KilnData['status'][]).map((st) => (
            <button
              key={st}
              onClick={() => handleStatusChange(st)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all ${
                kilnData.status === st
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Parameters 4-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Burning Zone Temp */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-orange-400" />
              Burning Zone Temp
            </span>
            <span className="font-mono text-emerald-400 font-semibold text-[11px]">
              Optimal: 1400-1500°C
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">
              {formatTemp(kilnData.temperature)}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Measured via two-color optical pyrometer at the kiln discharge hood.
          </p>
        </div>

        {/* Rotational Speed */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <RotateCw className="w-4 h-4 text-cyan-400" />
              Rotational Speed
            </span>
            <span className="font-mono text-slate-400 text-[11px]">Normal: 2.0-4.0</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">
              {kilnData.rpm}
            </span>
            <span className="text-xs font-mono text-slate-400">RPM</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Variable frequency drive (VFD) synchronized with kiln feed rate.
          </p>
        </div>

        {/* Hood Draft Pressure */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-sky-400" />
              Hood Draft Pressure
            </span>
            <span className="font-mono text-emerald-400 text-[11px]">Draft Safe</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">
              {kilnData.pressure}
            </span>
            <span className="text-xs font-mono text-slate-400">mbar</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Induced draft fan maintains slight negative pressure to prevent dust puffing.
          </p>
        </div>

        {/* Coal Burner Feed */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Fuel className="w-4 h-4 text-amber-400" />
              Coal Fuel Feed Rate
            </span>
            <span className="font-mono text-slate-400 text-[11px]">Burner Pipe #1</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">
              {kilnData.fuelConsumption}
            </span>
            <span className="text-xs font-mono text-slate-400">t/h</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Pulverized bituminous coal firing into flame envelope.
          </p>
        </div>
      </div>

      {/* Charts: Temperature & Fuel Consumption */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Burning Zone Temperature Profile */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">
                Kiln Burning Zone Temperature (°C)
              </h3>
              <p className="text-xs text-slate-400">
                Hourly optical pyrometer trend across shift
              </p>
            </div>
            <span className="text-xs font-mono text-orange-400 font-semibold">
              Live: {kilnData.temperature}°C
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_HOURLY_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[1400, 1500]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-xs space-y-1">
                          <div className="font-semibold text-slate-300">{label} Hours</div>
                          <div className="text-orange-400 font-mono font-bold">
                            Temperature: {payload[0].value} °C
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  dot={{ fill: '#f97316', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fuel Consumption Rate */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">
                Burner Coal Feed Rate (tons/hr)
              </h3>
              <p className="text-xs text-slate-400">
                Primary and secondary air thermal input rate
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-semibold">
              Rate: {kilnData.fuelConsumption} t/h
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_HOURLY_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[12, 17]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-xs space-y-1">
                          <div className="font-semibold text-slate-300">{label} Hours</div>
                          <div className="text-amber-400 font-mono font-bold">
                            Fuel Rate: {payload[0].value} t/h
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="fuelRate"
                  stroke="#eab308"
                  strokeWidth={2.5}
                  dot={{ fill: '#eab308', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Thermal Clinkerization Guide & Sensor Diagnostics */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-2">
          Rotary Kiln Clinkerization Process Reference
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          In a cement rotary kiln, raw meal (composed primarily of CaCO₃ from limestone, along with silica, alumina, and iron oxide) enters the preheater tower at ~940°C. In the burning zone at 1400°C–1450°C, liquid phase sintering forms the calcium silicate compounds (Alite C₃S and Belite C₂S) necessary for Portland cement clinker.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">
              Calcination & Preheating
            </span>
            <span className="text-amber-400 font-mono font-bold text-sm block mt-1">
              800°C - 950°C
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              CaCO₃ → CaO + CO₂ decarbonation
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">
              Sintering / Burning Zone
            </span>
            <span className="text-orange-400 font-mono font-bold text-sm block mt-1">
              1,400°C - 1,500°C
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Alite (C₃S) clinker crystal formation
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">
              Clinker Cooler Discharge
            </span>
            <span className="text-cyan-400 font-mono font-bold text-sm block mt-1">
              100°C - 150°C
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Grate cooler air recuperation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
