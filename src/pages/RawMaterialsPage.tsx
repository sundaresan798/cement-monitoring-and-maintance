import React, { useState } from 'react';
import { RawMaterial, MaterialStockStatus } from '../types';
import { Badge } from '../components/common/Badge';
import {
  Boxes,
  Plus,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Warehouse,
  X
} from 'lucide-react';
import { formatNumber, formatTons } from '../utils/calculations';

interface RawMaterialsPageProps {
  materials: RawMaterial[];
  onUpdateMaterial: (material: RawMaterial) => void;
  onAddMaterial: (material: RawMaterial) => void;
}

export const RawMaterialsPage: React.FC<RawMaterialsPageProps> = ({
  materials,
  onUpdateMaterial,
  onAddMaterial
}) => {
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<RawMaterial>>({});

  const handleOpenEdit = (material: RawMaterial) => {
    setEditingMaterial(material);
    setFormData(material);
    setIsNew(false);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingMaterial(null);
    setFormData({
      id: `MAT-${Date.now().toString().slice(-4)}`,
      materialName: '',
      currentStockTons: 1000,
      maxCapacityTons: 10000,
      dailyUsageTons: 100,
      monthlyUsageTons: 3000,
      reorderLevelTons: 1500,
      stockStatus: 'AVAILABLE',
      storageSilo: 'Silo Yard C',
      lastRestockedDate: new Date().toISOString().split('T')[0]
    });
    setIsNew(true);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.materialName) return;

    // Determine stock status automatically from reorder level
    const current = Number(formData.currentStockTons || 0);
    const reorder = Number(formData.reorderLevelTons || 0);
    let status: MaterialStockStatus = 'AVAILABLE';
    if (current <= reorder * 0.5) {
      status = 'CRITICAL';
    } else if (current <= reorder) {
      status = 'LOW STOCK';
    }

    const payload: RawMaterial = {
      ...(formData as RawMaterial),
      currentStockTons: current,
      maxCapacityTons: Number(formData.maxCapacityTons || 10000),
      dailyUsageTons: Number(formData.dailyUsageTons || 100),
      monthlyUsageTons: Number(formData.monthlyUsageTons || 3000),
      reorderLevelTons: reorder,
      stockStatus: status
    };

    if (isNew) {
      onAddMaterial(payload);
    } else {
      onUpdateMaterial(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Inventory & Raw Mix
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Raw Material Stockpile & Silo Monitoring
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Track Limestone, Clay, Gypsum, Coal, and additives. Manage reorder thresholds and simulated deliveries.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/10 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Raw Feed
        </button>
      </div>

      {/* Materials Inventory Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((mat) => {
          const fillPercentage = Math.min(
            100,
            Math.round((mat.currentStockTons / mat.maxCapacityTons) * 100)
          );
          const isLow = mat.stockStatus === 'LOW STOCK';
          const isCritical = mat.stockStatus === 'CRITICAL';
          const daysRemaining = Math.round(mat.currentStockTons / (mat.dailyUsageTons || 1));

          return (
            <div
              key={mat.id}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {mat.materialName}
                    </h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Warehouse className="w-3.5 h-3.5 text-slate-500" />
                      {mat.storageSilo}
                    </div>
                  </div>

                  <Badge
                    variant={
                      isCritical ? 'danger' : isLow ? 'warning' : 'success'
                    }
                    pulse={isCritical || isLow}
                  >
                    {mat.stockStatus}
                  </Badge>
                </div>

                {/* Main Stock Amount */}
                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold font-mono text-white">
                      {formatNumber(mat.currentStockTons)}
                    </span>
                    <span className="text-xs text-slate-400 font-mono ml-1">tons</span>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Cap: {formatNumber(mat.maxCapacityTons)} t
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCritical
                        ? 'bg-rose-500'
                        : isLow
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${fillPercentage}%` }}
                  />
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">
                      Daily Usage
                    </span>
                    <span className="text-slate-200 font-semibold">
                      {formatNumber(mat.dailyUsageTons)} t/d
                    </span>
                  </div>

                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">
                      Days Supply
                    </span>
                    <span className={`font-semibold ${daysRemaining < 5 ? 'text-amber-400' : 'text-slate-200'}`}>
                      ~{daysRemaining} days
                    </span>
                  </div>

                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">
                      Reorder Threshold
                    </span>
                    <span className="text-slate-200 font-semibold">
                      {formatNumber(mat.reorderLevelTons)} t
                    </span>
                  </div>

                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">
                      Monthly Total
                    </span>
                    <span className="text-slate-200 font-semibold">
                      {formatNumber(mat.monthlyUsageTons)} t
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Restocked: {mat.lastRestockedDate}
                </span>
                <button
                  onClick={() => handleOpenEdit(mat)}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Update Stock
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {isNew ? 'Register New Raw Material Stock' : `Update ${formData.materialName}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Material Name</label>
                <input
                  type="text"
                  required
                  value={formData.materialName || ''}
                  onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
                  placeholder="e.g. Limestone, Clay, Gypsum, Coal"
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Current Stock (Tons)</label>
                  <input
                    type="number"
                    required
                    value={formData.currentStockTons || 0}
                    onChange={(e) => setFormData({ ...formData, currentStockTons: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Max Silo Capacity (Tons)</label>
                  <input
                    type="number"
                    required
                    value={formData.maxCapacityTons || 0}
                    onChange={(e) => setFormData({ ...formData, maxCapacityTons: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Daily Usage (Tons/Day)</label>
                  <input
                    type="number"
                    required
                    value={formData.dailyUsageTons || 0}
                    onChange={(e) => setFormData({ ...formData, dailyUsageTons: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Reorder Alert Level (Tons)</label>
                  <input
                    type="number"
                    required
                    value={formData.reorderLevelTons || 0}
                    onChange={(e) => setFormData({ ...formData, reorderLevelTons: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Storage Location / Silo Tag</label>
                <input
                  type="text"
                  value={formData.storageSilo || ''}
                  onChange={(e) => setFormData({ ...formData, storageSilo: e.target.value })}
                  placeholder="e.g. Silo Yard A, Hopper Silo #2"
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/10"
                >
                  Save Stock Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
