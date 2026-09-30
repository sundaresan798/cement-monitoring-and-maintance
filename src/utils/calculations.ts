/**
 * Cement Plant Centralized Monitoring System
 * Mathematical & KPI Calculation Utilities
 * 
 * Standard cement manufacturing engineering formulas implemented
 * cleanly with comments for 3rd-year college evaluation clarity.
 */

/**
 * Calculate Production Efficiency (%)
 * Formula: (Actual Production / Target Production) × 100
 * A value >= 100% means the shift/day exceeded target.
 */
export function calculateEfficiency(actual: number, target: number): number {
  if (target <= 0) return 0;
  const efficiency = (actual / target) * 100;
  return Number(efficiency.toFixed(1));
}

/**
 * Calculate Production Variance (Tons)
 * Formula: Actual Production - Target Production
 * Positive value = Surplus production over target
 * Negative value = Production shortfall / deficit
 */
export function calculateVariance(actual: number, target: number): number {
  const variance = actual - target;
  return Number(variance.toFixed(1));
}

/**
 * Calculate Specific Energy Consumption per Ton (kWh/ton)
 * Formula: Total Energy Consumption / Total Production
 * In cement plants, lower energy per ton indicates higher thermal/electrical efficiency.
 */
export function calculateEnergyPerTon(totalEnergyKwh: number, totalProductionTons: number): number {
  if (totalProductionTons <= 0) return 0;
  const energyPerTon = totalEnergyKwh / totalProductionTons;
  return Number(energyPerTon.toFixed(2));
}

/**
 * Format number with comma separators (e.g. 12,450)
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

/**
 * Format metric tons with 't' suffix
 */
export function formatTons(tons: number): string {
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(tons)} t`;
}

/**
 * Format energy values in kWh or MWh
 */
export function formatEnergy(kwh: number): string {
  if (kwh >= 1000000) {
    return `${(kwh / 1000000).toFixed(2)} GWh`;
  }
  if (kwh >= 1000) {
    return `${(kwh / 1000).toFixed(1)} MWh`;
  }
  return `${Math.round(kwh)} kWh`;
}

/**
 * Format temperature with °C
 */
export function formatTemp(celsius: number): string {
  return `${Math.round(celsius)} °C`;
}

/**
 * Format currency in USD
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}
