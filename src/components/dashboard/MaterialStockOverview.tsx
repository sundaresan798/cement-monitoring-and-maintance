import React from 'react';
import { RawMaterial } from '../../types';
import { Badge } from '../common/Badge';
import { Boxes, AlertCircle, ArrowRight } from 'lucide-react';
import { formatNumber, formatTons } from '../../utils/calculations';

interface MaterialStockOverviewProps {
  materials: RawMaterial[];
  onViewAll?: () => void;
}

export const MaterialStockOverview: React.FC<MaterialStockOverviewProps> = ({
  materials,
  onViewAll
}) => {
  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Raw Material Silo Inventory
              </h3>
              <p className="text-xs text-slate-400">
                Stock vs capacity & reorder warning limits
              </p>
            </div>
          </div>

          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
            >
              Inventory Management <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Materials List */}
        <div className="mt-4 space-y-3.5">
          {materials.map((mat) => {
            const fillPercentage = Math.min(
              100,
              Math.round((mat.currentStockTons / mat.maxCapacityTons) * 100)
            );
            const isLow = mat.stockStatus === 'LOW STOCK';
            const isCritical = mat.stockStatus === 'CRITICAL';

            return (
              <div
                key={mat.id}
                className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200 text-sm">
                      {mat.materialName}
                    </span>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      ({mat.storageSilo})
                    </span>
                  </div>

                  <Badge
                    variant={
                      isCritical ? 'danger' : isLow ? 'warning' : 'success'
                    }
                    size="sm"
                    pulse={isCritical || isLow}
                  >
                    {mat.stockStatus}
                  </Badge>
                </div>

                {/* Quantitative Stats */}
                <div className="flex items-baseline justify-between mt-2 text-xs">
                  <div className="flex items-baseline gap-1.5 font-mono">
                    <span className="text-sm font-bold text-white">
                      {formatNumber(mat.currentStockTons)}
                    </span>
                    <span className="text-slate-400">
                      / {formatNumber(mat.maxCapacityTons)} t
                    </span>
                    <span className="text-amber-400 text-[11px] font-semibold">
                      ({fillPercentage}%)
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">
                    Daily: <span className="text-slate-300">-{formatNumber(mat.dailyUsageTons)} t/d</span>
                  </div>
                </div>

                {/* Stock Level Bar */}
                <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
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

                {/* Reorder limit notice if close */}
                {(isLow || isCritical) && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-300 font-medium">
                    <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>
                      Stock below reorder threshold ({formatTons(mat.reorderLevelTons)}). Order needed.
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Raw material stockpile status</span>
        <span className="text-slate-300 font-mono">5 Feed Streams</span>
      </div>
    </div>
  );
};
