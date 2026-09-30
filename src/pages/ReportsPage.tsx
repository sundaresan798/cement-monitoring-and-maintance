import React, { useState } from 'react';
import { ProductionKPI, EnergyData, RawMaterial, MaintenanceRecord, KilnData } from '../types';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Factory,
  Zap,
  Boxes,
  Wrench,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { formatNumber, formatTons, formatEnergy, formatTemp, formatCurrency } from '../utils/calculations';

interface ReportsPageProps {
  productionKpi: ProductionKPI;
  energyData: EnergyData;
  rawMaterials: RawMaterial[];
  maintenanceList: MaintenanceRecord[];
  kilnData: KilnData;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  productionKpi,
  energyData,
  rawMaterials,
  maintenanceList,
  kilnData
}) => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Print Actions (hidden in print) */}
      <div className="print:hidden p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              Audit & Compliance
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Centralized Shift & Executive Reports
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Generate formal operational audit logs covering clinker output, thermal energy, raw material mass balances, and maintenance schedules.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Report Duration Select */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setReportType('daily')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                reportType === 'daily'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Daily Shift
            </button>
            <button
              onClick={() => setReportType('weekly')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                reportType === 'weekly'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Weekly Summary
            </button>
            <button
              onClick={() => setReportType('monthly')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                reportType === 'monthly'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly Audit
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/10"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 shadow-xl print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="border-b border-slate-800 print:border-black pb-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-amber-400 print:text-gray-700">
                Ultratech Works · Cement Manufacturing Plant #1
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-white print:text-black mt-1">
                Centralized {reportType === 'daily' ? 'Daily Shift' : reportType === 'weekly' ? 'Weekly Aggregate' : 'Monthly Comprehensive'} Operations Report
              </h1>
              <div className="text-xs text-slate-400 print:text-gray-600 mt-1 font-mono">
                Report Date: {productionKpi.date} · Generated at: 20:45:00 UTC · System: Central SCADA ERP
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="inline-block px-3 py-1 rounded bg-slate-800 print:bg-gray-100 text-xs font-mono font-semibold text-slate-300 print:text-black border border-slate-700 print:border-gray-300">
                Document: DOC-CCR-{productionKpi.date.replace(/-/g, '')}-01
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Executive KPI Summary */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-amber-400 print:text-black uppercase tracking-wider mb-3 flex items-center gap-2">
            <Factory className="w-4 h-4" />
            1. Production Performance & Efficiency
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 print:bg-gray-50 border border-slate-800 print:border-gray-200">
              <span className="text-slate-400 print:text-gray-600 block text-[11px]">Actual Production</span>
              <span className="text-base font-bold font-mono text-white print:text-black mt-1 block">
                {formatNumber(reportType === 'monthly' ? productionKpi.monthlyProductionTons : productionKpi.actualProductionTons)} t
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 print:bg-gray-50 border border-slate-800 print:border-gray-200">
              <span className="text-slate-400 print:text-gray-600 block text-[11px]">Production Target</span>
              <span className="text-base font-bold font-mono text-white print:text-black mt-1 block">
                {formatNumber(reportType === 'monthly' ? 150000 : productionKpi.targetProductionTons)} t
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 print:bg-gray-50 border border-slate-800 print:border-gray-200">
              <span className="text-slate-400 print:text-gray-600 block text-[11px]">Target Efficiency</span>
              <span className="text-base font-bold font-mono text-emerald-400 print:text-emerald-700 mt-1 block">
                {productionKpi.productionEfficiencyPercent}%
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 print:bg-gray-50 border border-slate-800 print:border-gray-200">
              <span className="text-slate-400 print:text-gray-600 block text-[11px]">Production Variance</span>
              <span className="text-base font-bold font-mono text-rose-400 print:text-rose-700 mt-1 block">
                {productionKpi.productionVarianceTons} t
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Energy & Fuel Consumption */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-yellow-400 print:text-black uppercase tracking-wider mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            2. Energy & Utility Consumption Audit
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 print:bg-gray-50 border border-slate-800 print:border-gray-200">
              <span className="text-slate-400 print:text-gray-600 block text-[11px]">Electrical Energy</span>
              <span className="text-base font-bold font-mono text-white print:text-black mt-1 block">
                {formatEnergy(energyData.dailyElectricityKwh)}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 print:bg-gray-50 border border-slate-800 print:border-gray-200">
              <span className="text-slate-400 print:text-gray-600 block text-[11px]">Specific SEC</span>
              <span className="text-base font-bold font-mono text-yellow-400 print:text-amber-800 mt-1 block">
                {energyData.energyConsumedPerTon} kWh/t
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 print:bg-gray-50 border border-slate-800 print:border-gray-200">
              <span className="text-slate-400 print:text-gray-600 block text-[11px]">Pulverized Coal Burned</span>
              <span className="text-base font-bold font-mono text-white print:text-black mt-1 block">
                {energyData.fuelConsumptionTons} tons
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 print:bg-gray-50 border border-slate-800 print:border-gray-200">
              <span className="text-slate-400 print:text-gray-600 block text-[11px]">Estimated Power Cost</span>
              <span className="text-base font-bold font-mono text-white print:text-black mt-1 block">
                {formatCurrency(energyData.estimatedCostUsd)}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Raw Materials Inventory Status */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-emerald-400 print:text-black uppercase tracking-wider mb-3 flex items-center gap-2">
            <Boxes className="w-4 h-4" />
            3. Raw Material Stock & Daily Consumption Breakdown
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 print:bg-gray-100 text-slate-400 print:text-gray-700 font-semibold border-b border-slate-800 print:border-gray-300">
                <tr>
                  <th className="py-2.5 px-3">Feed Material</th>
                  <th className="py-2.5 px-3">Storage Location</th>
                  <th className="py-2.5 px-3">Current Stock</th>
                  <th className="py-2.5 px-3">Daily Burn/Usage</th>
                  <th className="py-2.5 px-3">Reorder Point</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 print:divide-gray-200 font-mono">
                {rawMaterials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-slate-950/40 print:hover:bg-transparent">
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-200 print:text-black">
                      {mat.materialName}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-400 print:text-gray-600">
                      {mat.storageSilo}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white print:text-black">
                      {formatNumber(mat.currentStockTons)} t
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 print:text-black">
                      {formatNumber(mat.dailyUsageTons)} t/d
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 print:text-gray-600">
                      {formatNumber(mat.reorderLevelTons)} t
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          mat.stockStatus === 'AVAILABLE'
                            ? 'text-emerald-400 print:text-emerald-700'
                            : 'text-amber-400 print:text-amber-700'
                        }`}
                      >
                        {mat.stockStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Equipment & Maintenance Operations */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-orange-400 print:text-black uppercase tracking-wider mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            4. Machinery Maintenance & Unplanned Stoppage Log
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 print:bg-gray-100 text-slate-400 print:text-gray-700 font-semibold border-b border-slate-800 print:border-gray-300">
                <tr>
                  <th className="py-2.5 px-3">Equipment Unit</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Next Schedule</th>
                  <th className="py-2.5 px-3">Assigned Lead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 print:divide-gray-200">
                {maintenanceList.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-3 font-semibold text-slate-200 print:text-black">
                      {item.equipmentName}{' '}
                      <span className="font-mono text-slate-400 print:text-gray-500 font-normal">
                        ({item.equipmentTag})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium">
                      <span
                        className={
                          item.currentStatus === 'OPERATIONAL'
                            ? 'text-emerald-400 print:text-emerald-700'
                            : item.currentStatus === 'MAINTENANCE DUE'
                            ? 'text-amber-400 print:text-amber-700'
                            : 'text-rose-400 print:text-rose-700'
                        }
                      >
                        {item.currentStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 print:text-black">
                      {item.maintenanceType}
                    </td>
                    <td className="py-2.5 px-3 font-mono">{item.priority}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400 print:text-gray-600">
                      {item.nextMaintenanceDate}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 print:text-gray-600">
                      {item.assignedTechnician}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Document Footer Signatures */}
        <div className="mt-8 pt-6 border-t border-slate-800 print:border-black grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-400 print:text-gray-700">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-500 print:text-gray-500 mb-4">
              Prepared By (Shift Engineer):
            </span>
            <div className="border-b border-slate-700 print:border-black pb-1 font-mono text-slate-200 print:text-black">
              Marcus Brody (CCR Operator)
            </div>
          </div>

          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-500 print:text-gray-500 mb-4">
              Reviewed By (Plant Manager):
            </span>
            <div className="border-b border-slate-700 print:border-black pb-1 font-mono text-slate-200 print:text-black">
              Rajesh Sharma (P.E., Operations)
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="block text-[10px] uppercase tracking-wider text-slate-500 print:text-gray-500 mb-4">
              Approved By (General Manager):
            </span>
            <div className="border-b border-slate-700 print:border-black pb-1 font-mono text-slate-200 print:text-black">
              Sarah Chen (Plant Director)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
