/**
 * Cement Plant Centralized Monitoring and Production Management System
 * Core TypeScript Type Definitions
 * 
 * Note: Designed for 3rd-year IT college project with clear, beginner-friendly
 * data models representing cement manufacturing operational entities.
 */

// User roles in cement plant management
export type UserRole = 
  | 'admin' 
  | 'plant_manager' 
  | 'operator'
  | 'ADMIN' 
  | 'PLANT_MANAGER' 
  | 'OPERATOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  shift?: string;
  createdAt?: string;
}

// Operational status for the rotary kiln
export type KilnStatus = 'RUNNING' | 'STOPPED' | 'WARNING' | 'MAINTENANCE';

export interface KilnData {
  id: string;
  kilnName: string;
  status: KilnStatus;
  temperature: number; // Burning zone temperature in °C (typically 1400°C - 1500°C)
  rpm: number; // Kiln rotational speed (typically 1.5 - 4.5 RPM)
  pressure: number; // Hood / exhaust draft pressure in mbar (-0.5 to -2.5 mbar)
  fuelConsumption: number; // Coal/gas fuel feed rate in tons/hour
  currentLoad: number; // Raw meal feed rate in tons/hour (TPH)
  feedRate: number; // Feed rate in TPH
  inletTemp: number; // Preheater inlet temperature °C
  outletTemp: number; // Clinker discharge temperature °C
  lastUpdated: string;
}

// Energy consumption metrics (electrical & thermal)
export interface EnergyData {
  id: string;
  date: string;
  dailyElectricityKwh: number; // Total plant electrical consumption (kWh)
  monthlyElectricityKwh: number; // Month-to-date electricity (kWh)
  fuelConsumptionTons: number; // Pulverized coal burned (tons)
  energyConsumedPerTon: number; // Specific energy consumption (kWh per ton of cement/clinker)
  targetEnergyPerTon: number; // Efficiency standard target (kWh/ton, usually 85-110 kWh/ton)
  estimatedCostUsd: number; // Cost in USD calculated from industrial tariff
  isExceeded: boolean; // Flag when energy exceeds defined target
}

// Raw materials inventory status
export type MaterialStockStatus = 'AVAILABLE' | 'LOW STOCK' | 'CRITICAL';

export interface RawMaterial {
  id: string;
  materialName: 'Limestone' | 'Clay' | 'Gypsum' | 'Coal/Fuel' | 'Iron Ore' | string;
  currentStockTons: number;
  maxCapacityTons: number;
  dailyUsageTons: number;
  monthlyUsageTons: number;
  reorderLevelTons: number;
  stockStatus: MaterialStockStatus;
  storageSilo: string;
  lastRestockedDate: string;
}

// Equipment maintenance tracking
export type EquipmentStatus = 'OPERATIONAL' | 'MAINTENANCE DUE' | 'UNDER MAINTENANCE';
export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type EquipmentType = 
  | 'Kiln' 
  | 'Crusher' 
  | 'Conveyor' 
  | 'Raw Mill' 
  | 'Cement Mill' 
  | 'Packing Machine';

export interface MaintenanceRecord {
  id: string;
  equipmentName: EquipmentType;
  equipmentTag: string; // Industrial tag e.g. KLN-01, RAW-ML-02
  currentStatus: EquipmentStatus;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  maintenanceType: 'Preventive' | 'Corrective' | 'Inspection' | 'Overhaul';
  priority: MaintenancePriority;
  assignedTechnician: string;
  downtimeHoursEstimate: number;
  notes: string;
}

// Production KPIs & Performance Metrics
export interface ProductionKPI {
  id: string;
  date: string;
  shift: string;
  dailyProductionTons: number; // Cement/clinker produced today (metric tons)
  monthlyProductionTons: number; // Month-to-date total (metric tons)
  targetProductionTons: number; // Planned daily target (metric tons)
  actualProductionTons: number; // Measured output (metric tons)
  productionEfficiencyPercent: number; // (Actual / Target) * 100
  equipmentDowntimeHours: number; // Unplanned stoppage hours
  energyPerTonKwh: number; // Total energy / Total production
  productionVarianceTons: number; // Actual - Target (+ is surplus, - is deficit)
}

// Real-time telemetry alert
export interface PlantAlert {
  id: string;
  timestamp: string;
  equipment: string;
  parameter: string;
  value: string;
  threshold: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  acknowledged: boolean;
}

// Hourly chart telemetry point
export interface HourlyTelemetry {
  time: string;
  actualProduction: number;
  targetProduction: number;
  temperature: number;
  electricityKwh: number;
  fuelRate: number;
  efficiency: number;
}
