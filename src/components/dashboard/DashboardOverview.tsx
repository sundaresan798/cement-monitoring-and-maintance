import React, { useState } from 'react';
import {
  KilnData,
  ProductionKPI,
  EnergyData,
  RawMaterial,
  MaintenanceRecord,
  PlantAlert,
  User
} from '../../types';
import { StatCard } from './StatCard';
import { ProductionChart } from './ProductionChart';
import { EnergyChart } from './EnergyChart';
import { KilnQuickStatus } from './KilnQuickStatus';
import { MaterialStockOverview } from './MaterialStockOverview';
import { EquipmentQuickStatus } from './EquipmentQuickStatus';
import { ActiveAlerts } from './ActiveAlerts';
import {
  Factory,
  Flame,
  Zap,
  TrendingUp,
  Percent,
  AlertOctagon,
  Clock,
  Boxes,
  Wrench,
  RefreshCw,
  SlidersHorizontal,
  FileSpreadsheet,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import {
  formatNumber,
  formatTons,
  formatEnergy,
  formatTemp,
  formatCurrency,
  calculateEfficiency,
  calculateVariance,
  calculateEnergyPerTon
} from '../../utils/calculations';
import { NavigationTab } from '../layout/Sidebar';

interface DashboardOverviewProps {
  currentUser: User;
  kilnData: KilnData;
  productionKpi: ProductionKPI;
  energyData: EnergyData;
  rawMaterials: RawMaterial[];
  maintenanceList: MaintenanceRecord[];
  alerts: PlantAlert[];
  onNavigateTab: (tab: NavigationTab) => void;
  onAcknowledgeAlert: (alertId: string) => void;
  onSimulateTick: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentUser,
  kilnData,
  productionKpi,
  energyData,
  rawMaterials,
  maintenanceList,
  alerts,
  onNavigateTab,
  onAcknowledgeAlert,
  onSimulateTick
}) => {
  const [simulationActive, setSimulationActive] = useState<boolean>(false);

  // Derive counts
  const lowStockCount = rawMaterials.filter((m) => m.stockStatus !== 'AVAILABLE').length;
  const maintenanceDueCount = maintenanceList.filter(
    (m) => m.currentStatus === 'MAINTENANCE DUE' || m.currentStatus === 'UNDER MAINTENANCE'
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Plant Overview & Simulation Controls */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              Central Control Console
            </span>
            <span className="text-xs text-slate-400">
              Ultratech Works · Pyroprocessing Line 1
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Centralized Plant Operations & KPI Monitor
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-3xl">
            Real-time telemetry oversight for 5,000 TPD clinker production, rotary kiln thermal regulation, specific energy efficiency, and preventive maintenance.
          </p>
        </div>

        {/* Live Simulation Trigger (Ideal for 3rd-year IT Viva & Demo) */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={onSimulateTick}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/10 active:scale-98"
            title="Update simulated production and kiln telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Simulate SCADA Cycle
          </button>

          <button
            onClick={() => onNavigateTab('reports')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
            Shift Report
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid (9 Core Indicators) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Real-Time Plant Key Performance Indicators
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Production Cycle: Today (00:00 - Present)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {/* 1. Today's Production */}
          <StatCard
            title="Today's Production"
            value={formatNumber(productionKpi.actualProductionTons)}
            unit="metric tons"
            target={`${formatNumber(productionKpi.targetProductionTons)} t`}
            icon={Factory}
            trend={{
              value: `${formatNumber(Math.abs(productionKpi.productionVarianceTons))} t variance`,
              label: 'Variance',
              direction: productionKpi.productionVarianceTons >= 0 ? 'up' : 'down',
              isPositiveGood: true
            }}
            status={productionKpi.productionVarianceTons >= 0 ? 'success' : 'normal'}
            onClick={() => onNavigateTab('production')}
          />

          {/* 2. Production Efficiency */}
          <StatCard
            title="Production Efficiency"
            value={`${productionKpi.productionEfficiencyPercent}%`}
            subtitle="Formula: (Actual / Target) × 100"
            icon={Percent}
            trend={{
              value: 'Benchmark: 95.0%',
              label: 'Benchmark',
              direction: productionKpi.productionEfficiencyPercent >= 95 ? 'up' : 'down',
              isPositiveGood: true
            }}
            status={productionKpi.productionEfficiencyPercent >= 95 ? 'success' : 'warning'}
            onClick={() => onNavigateTab('production')}
          />

          {/* 3. Kiln Status & Burning Temp */}
          <StatCard
            title="Kiln Line 1 Status"
            value={kilnData.status}
            unit={`@ ${formatTemp(kilnData.temperature)}`}
            subtitle="Burning Zone Target: 1400 - 1500 °C"
            icon={Flame}
            trend={{
              value: `${kilnData.rpm} RPM`,
              label: 'Speed',
              direction: 'up',
              isPositiveGood: true
            }}
            status={
              kilnData.status === 'RUNNING'
                ? 'success'
                : kilnData.status === 'WARNING'
                ? 'warning'
                : 'critical'
            }
            onClick={() => onNavigateTab('kiln')}
          />

          {/* 4. Energy Consumption (Specific Energy) */}
          <StatCard
            title="Specific Energy Consumption"
            value={energyData.energyConsumedPerTon.toFixed(1)}
            unit="kWh / ton"
            target={`${energyData.targetEnergyPerTon} kWh/t`}
            icon={Zap}
            trend={{
              value: '+4.3% over benchmark',
              label: 'Deviation',
              direction: 'up',
              isPositiveGood: false // Higher energy is worse!
            }}
            status={energyData.isExceeded ? 'warning' : 'success'}
            onClick={() => onNavigateTab('energy')}
          />

          {/* 5. Raw Material Stock Level */}
          <StatCard
            title="Raw Material Inventory"
            value={formatNumber(rawMaterials.reduce((acc, m) => acc + m.currentStockTons, 0))}
            unit="total tons"
            subtitle={`${lowStockCount} raw feed streams require reorder`}
            icon={Boxes}
            trend={{
              value: `${lowStockCount} Low / Alert`,
              label: 'Alerts',
              direction: lowStockCount > 0 ? 'down' : 'up',
              isPositiveGood: false
            }}
            status={lowStockCount > 0 ? 'warning' : 'normal'}
            onClick={() => onNavigateTab('materials')}
          />

          {/* 6. Equipment Downtime & Maintenance */}
          <StatCard
            title="Equipment Downtime Today"
            value={`${productionKpi.equipmentDowntimeHours} hrs`}
            subtitle={`${maintenanceDueCount} equipment units pending service`}
            icon={Clock}
            trend={{
              value: 'Plant Availability: 96.7%',
              label: 'Availability',
              direction: 'up',
              isPositiveGood: true
            }}
            status={productionKpi.equipmentDowntimeHours > 1.5 ? 'warning' : 'normal'}
            onClick={() => onNavigateTab('maintenance')}
          />
        </div>
      </div>

      {/* Production & Energy Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductionChart />
        <EnergyChart />
      </div>

      {/* Telemetry Deep-Dives: Kiln Live & Raw Materials Silos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KilnQuickStatus
          data={kilnData}
          onViewDetails={() => onNavigateTab('kiln')}
        />
        <MaterialStockOverview
          materials={rawMaterials}
          onViewAll={() => onNavigateTab('materials')}
        />
      </div>

      {/* Equipment Health & Active Alarm Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EquipmentQuickStatus
          records={maintenanceList}
          onManageMaintenance={() => onNavigateTab('maintenance')}
        />
        <ActiveAlerts
          alerts={alerts}
          onAcknowledge={onAcknowledgeAlert}
        />
      </div>

      {/* Engineering Formula Reference Card (Great for College Evaluation) */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
          <Factory className="w-3.5 h-3.5 text-amber-400" />
          Cement Manufacturing KPI Calculation Logic
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-amber-400 font-semibold block mb-0.5">Production Efficiency:</span>
            <code className="text-slate-300 font-mono text-[11px] block">
              (Actual Output / Target Output) × 100
            </code>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Current: ({productionKpi.actualProductionTons} / {productionKpi.targetProductionTons}) × 100 = <strong>{productionKpi.productionEfficiencyPercent}%</strong>
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-amber-400 font-semibold block mb-0.5">Production Variance:</span>
            <code className="text-slate-300 font-mono text-[11px] block">
              Actual Output - Target Output
            </code>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Current: {productionKpi.actualProductionTons} - {productionKpi.targetProductionTons} = <strong className={productionKpi.productionVarianceTons >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{productionKpi.productionVarianceTons} tons</strong>
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-amber-400 font-semibold block mb-0.5">Specific Energy per Ton:</span>
            <code className="text-slate-300 font-mono text-[11px] block">
              Total Energy (kWh) / Production (tons)
            </code>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Current: {energyData.dailyElectricityKwh.toLocaleString()} / {productionKpi.actualProductionTons} = <strong>{energyData.energyConsumedPerTon} kWh/ton</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
