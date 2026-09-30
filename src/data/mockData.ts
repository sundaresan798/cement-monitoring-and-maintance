/**
 * Cement Plant Centralized Monitoring and Production Management System
 * Simulated Industrial Demo Dataset
 * 
 * NOTE: All operational metrics, sensor readings, and equipment tags are
 * SIMULATED for this 3rd-year IT college project demonstration.
 * No connection exists to physical PLC, SCADA, or factory controllers.
 */

import {
  User,
  KilnData,
  EnergyData,
  RawMaterial,
  MaintenanceRecord,
  ProductionKPI,
  PlantAlert,
  HourlyTelemetry
} from '../types';
import { calculateEfficiency, calculateVariance, calculateEnergyPerTon } from '../utils/calculations';

// Simulated plant users with different roles for testing authentication & permissions
export const DEMO_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Sarah Chen, P.Eng',
    email: 'sarah.chen@cementworks.demo',
    role: 'ADMIN',
    department: 'Plant Operations Directorate',
    shift: 'General Shift (08:00 - 17:00)'
  },
  {
    id: 'USR-002',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@cementworks.demo',
    role: 'PLANT_MANAGER',
    department: 'Production & Quality Control',
    shift: 'Shift A (06:00 - 14:00)'
  },
  {
    id: 'USR-003',
    name: 'Marcus Brody',
    email: 'marcus.brody@cementworks.demo',
    role: 'OPERATOR',
    department: 'Central Control Room (CCR)',
    shift: 'Shift A (06:00 - 14:00)'
  }
];

// Current Rotary Kiln Telemetry (Line 1 - Pyroprocessing Section)
// Normal clinker burning zone target: 1400°C - 1500°C
export const MOCK_KILN_DATA: KilnData = {
  id: 'KLN-LINE-01',
  kilnName: 'Kiln Line 1 (5,000 TPD Rotary Pyroprocessing System)',
  status: 'RUNNING',
  temperature: 1465, // Burning zone optical pyrometer reading (°C)
  rpm: 3.45, // Rotary kiln drive speed (RPM)
  pressure: -1.8, // Kiln hood draft pressure (mbar) - negative draft is safe
  fuelConsumption: 14.8, // Pulverized coal feed rate (tons/hour)
  currentLoad: 215, // Raw meal kiln feed rate (tons/hour)
  feedRate: 215,
  inletTemp: 940, // Cyclone preheater bottom stage temperature (°C)
  outletTemp: 135, // Clinker cooler discharge air temperature (°C)
  lastUpdated: 'Just now (Simulated 5s polling)'
};

// Today's Production KPIs
const todayActualTons = 4820;
const todayTargetTons = 5000;
const todayElectricityKwh = 462720; // 462.7 MWh

export const MOCK_PRODUCTION_KPI: ProductionKPI = {
  id: 'KPI-TODAY',
  date: '2026-09-29',
  shift: 'Shift A / Morning Operational Cycle',
  dailyProductionTons: todayActualTons,
  monthlyProductionTons: 142600,
  targetProductionTons: todayTargetTons,
  actualProductionTons: todayActualTons,
  productionEfficiencyPercent: calculateEfficiency(todayActualTons, todayTargetTons), // 96.4%
  equipmentDowntimeHours: 0.8, // 48 mins due to Crusher #1 inlet chute clearing
  energyPerTonKwh: calculateEnergyPerTon(todayElectricityKwh, todayActualTons), // ~96.0 kWh/t
  productionVarianceTons: calculateVariance(todayActualTons, todayTargetTons) // -180 tons
};

// Energy Monitoring Metrics
export const MOCK_ENERGY_DATA: EnergyData = {
  id: 'ENG-2026-09-29',
  date: '2026-09-29',
  dailyElectricityKwh: todayElectricityKwh,
  monthlyElectricityKwh: 13880000,
  fuelConsumptionTons: 355.2, // Coal burned today
  energyConsumedPerTon: calculateEnergyPerTon(todayElectricityKwh, todayActualTons),
  targetEnergyPerTon: 92.0, // Benchmark industry target for modern 5000 TPD plants
  estimatedCostUsd: 41644, // At ~$0.09 per kWh industrial tariff
  isExceeded: true // 96.0 kWh/ton > 92.0 target threshold (triggers amber badge)
};

// Raw Material Inventory Tracking (5 Essential Cement Ingredients)
export const MOCK_RAW_MATERIALS: RawMaterial[] = [
  {
    id: 'MAT-01',
    materialName: 'Limestone',
    currentStockTons: 42500,
    maxCapacityTons: 60000,
    dailyUsageTons: 6200, // Primary component (~75-80% of raw mix)
    monthlyUsageTons: 186000,
    reorderLevelTons: 15000,
    stockStatus: 'AVAILABLE',
    storageSilo: 'Silo Yard A (Raw Stockpile)',
    lastRestockedDate: '2026-09-27'
  },
  {
    id: 'MAT-02',
    materialName: 'Clay',
    currentStockTons: 13800,
    maxCapacityTons: 25000,
    dailyUsageTons: 1450, // Provides silica, alumina, and iron oxide (~10-15%)
    monthlyUsageTons: 43500,
    reorderLevelTons: 6000,
    stockStatus: 'AVAILABLE',
    storageSilo: 'Covered Shed B',
    lastRestockedDate: '2026-09-25'
  },
  {
    id: 'MAT-03',
    materialName: 'Gypsum',
    currentStockTons: 2150,
    maxCapacityTons: 10000,
    dailyUsageTons: 240, // Retarder added at grinding stage (~4-5%)
    monthlyUsageTons: 7200,
    reorderLevelTons: 2500,
    stockStatus: 'LOW STOCK', // Trigger warning
    storageSilo: 'Gypsum Hopper Silo G1',
    lastRestockedDate: '2026-09-18'
  },
  {
    id: 'MAT-04',
    materialName: 'Coal/Fuel',
    currentStockTons: 8400,
    maxCapacityTons: 20000,
    dailyUsageTons: 580, // High-CV thermal coal for kiln burner
    monthlyUsageTons: 17400,
    reorderLevelTons: 4000,
    stockStatus: 'AVAILABLE',
    storageSilo: 'Coal Yard Bunker 3',
    lastRestockedDate: '2026-09-28'
  },
  {
    id: 'MAT-05',
    materialName: 'Iron Ore',
    currentStockTons: 920,
    maxCapacityTons: 5000,
    dailyUsageTons: 110, // Corrective flux additive (~1-2%)
    monthlyUsageTons: 3300,
    reorderLevelTons: 1000,
    stockStatus: 'LOW STOCK',
    storageSilo: 'Hopper Yard Fe-01',
    lastRestockedDate: '2026-09-19'
  }
];

// Equipment Status and Maintenance Log for 6 Specified Machines
export const MOCK_MAINTENANCE_LIST: MaintenanceRecord[] = [
  {
    id: 'MNT-01',
    equipmentName: 'Kiln',
    equipmentTag: 'KLN-01',
    currentStatus: 'OPERATIONAL',
    lastMaintenanceDate: '2026-09-10',
    nextMaintenanceDate: '2026-10-15',
    maintenanceType: 'Preventive',
    priority: 'LOW',
    assignedTechnician: 'David Miller (Mechanical Lead)',
    downtimeHoursEstimate: 4.0,
    notes: 'Burning zone refractory thickness measured at 180mm. Shell thermal scanner normal.'
  },
  {
    id: 'MNT-02',
    equipmentName: 'Crusher',
    equipmentTag: 'CRSH-01',
    currentStatus: 'OPERATIONAL',
    lastMaintenanceDate: '2026-09-20',
    nextMaintenanceDate: '2026-10-05',
    maintenanceType: 'Inspection',
    priority: 'LOW',
    assignedTechnician: 'Kevin Vance',
    downtimeHoursEstimate: 1.5,
    notes: 'Hammer crusher blow bars checked. 12mm wear remaining before next flip.'
  },
  {
    id: 'MNT-03',
    equipmentName: 'Conveyor',
    equipmentTag: 'CNV-03',
    currentStatus: 'MAINTENANCE DUE',
    lastMaintenanceDate: '2026-08-25',
    nextMaintenanceDate: '2026-09-28', // 1 day overdue
    maintenanceType: 'Preventive',
    priority: 'MEDIUM',
    assignedTechnician: 'Liam Rossi',
    downtimeHoursEstimate: 2.0,
    notes: 'Belt alignment switch #4 showing intermittent sensor lag. Roller lubrication due.'
  },
  {
    id: 'MNT-04',
    equipmentName: 'Raw Mill',
    equipmentTag: 'RM-VRM-01',
    currentStatus: 'OPERATIONAL',
    lastMaintenanceDate: '2026-09-15',
    nextMaintenanceDate: '2026-10-20',
    maintenanceType: 'Inspection',
    priority: 'LOW',
    assignedTechnician: 'Sarah Kowalski',
    downtimeHoursEstimate: 3.0,
    notes: 'Vertical roller mill hydraulic pressure balanced at 145 bar. Grinding table healthy.'
  },
  {
    id: 'MNT-05',
    equipmentName: 'Cement Mill',
    equipmentTag: 'CM-BALL-02',
    currentStatus: 'UNDER MAINTENANCE',
    lastMaintenanceDate: '2026-09-29',
    nextMaintenanceDate: '2026-09-30',
    maintenanceType: 'Overhaul',
    priority: 'HIGH',
    assignedTechnician: 'Team Alpha (Specialist Contractor)',
    downtimeHoursEstimate: 8.5,
    notes: 'Ball mill second chamber diaphragm plates replacement and ball charge top-up in progress.'
  },
  {
    id: 'MNT-06',
    equipmentName: 'Packing Machine',
    equipmentTag: 'PK-ROT-01',
    currentStatus: 'OPERATIONAL',
    lastMaintenanceDate: '2026-09-18',
    nextMaintenanceDate: '2026-10-12',
    maintenanceType: 'Preventive',
    priority: 'LOW',
    assignedTechnician: 'Alex Patel',
    downtimeHoursEstimate: 1.0,
    notes: '8-spout rotary packer calibrated. Bag load cell accuracy ±0.15kg verified.'
  }
];

// Hourly Production and Telemetry Trend (Last 12 hours)
export const MOCK_HOURLY_TREND: HourlyTelemetry[] = [
  { time: '08:00', actualProduction: 205, targetProduction: 210, temperature: 1450, electricityKwh: 19600, fuelRate: 14.5, efficiency: 97.6 },
  { time: '09:00', actualProduction: 212, targetProduction: 210, temperature: 1460, electricityKwh: 19900, fuelRate: 14.7, efficiency: 100.9 },
  { time: '10:00', actualProduction: 218, targetProduction: 210, temperature: 1468, electricityKwh: 20200, fuelRate: 14.9, efficiency: 103.8 },
  { time: '11:00', actualProduction: 180, targetProduction: 210, temperature: 1435, electricityKwh: 17800, fuelRate: 13.9, efficiency: 85.7 }, // Minor feed dip
  { time: '12:00', actualProduction: 210, targetProduction: 210, temperature: 1462, electricityKwh: 19800, fuelRate: 14.6, efficiency: 100.0 },
  { time: '13:00', actualProduction: 214, targetProduction: 210, temperature: 1470, electricityKwh: 20100, fuelRate: 14.8, efficiency: 101.9 },
  { time: '14:00', actualProduction: 216, targetProduction: 210, temperature: 1465, electricityKwh: 20300, fuelRate: 14.7, efficiency: 102.8 },
  { time: '15:00', actualProduction: 208, targetProduction: 210, temperature: 1455, electricityKwh: 19700, fuelRate: 14.6, efficiency: 99.0 },
  { time: '16:00', actualProduction: 215, targetProduction: 210, temperature: 1464, electricityKwh: 20150, fuelRate: 14.8, efficiency: 102.3 },
  { time: '17:00', actualProduction: 211, targetProduction: 210, temperature: 1462, electricityKwh: 19850, fuelRate: 14.7, efficiency: 100.4 },
  { time: '18:00', actualProduction: 219, targetProduction: 210, temperature: 1472, electricityKwh: 20400, fuelRate: 15.0, efficiency: 104.2 },
  { time: '19:00', actualProduction: 213, targetProduction: 210, temperature: 1466, electricityKwh: 20050, fuelRate: 14.8, efficiency: 101.4 }
];

// 7-Day Production & Energy Comparison Data
export const MOCK_DAILY_7DAYS = [
  { day: 'Wed (23)', actual: 4910, target: 5000, efficiency: 98.2, energyKwhTon: 94.2, downtimeHours: 0.5 },
  { day: 'Thu (24)', actual: 5040, target: 5000, efficiency: 100.8, energyKwhTon: 91.8, downtimeHours: 0.0 },
  { day: 'Fri (25)', actual: 5120, target: 5000, efficiency: 102.4, energyKwhTon: 90.9, downtimeHours: 0.0 },
  { day: 'Sat (26)', actual: 4780, target: 5000, efficiency: 95.6, energyKwhTon: 97.4, downtimeHours: 1.6 },
  { day: 'Sun (27)', actual: 4950, target: 5000, efficiency: 99.0, energyKwhTon: 93.5, downtimeHours: 0.2 },
  { day: 'Mon (28)', actual: 5080, target: 5000, efficiency: 101.6, energyKwhTon: 91.2, downtimeHours: 0.0 },
  { day: 'Tue (29)', actual: 4820, target: 5000, efficiency: 96.4, energyKwhTon: 96.0, downtimeHours: 0.8 }
];

// Active Telemetry Alerts & Warning Logs
export const MOCK_ALERTS: PlantAlert[] = [
  {
    id: 'ALT-1092',
    timestamp: '19:14:02',
    equipment: 'Raw Material Yard',
    parameter: 'Gypsum Silo Level',
    value: '2,150 t',
    threshold: '< 2,500 t',
    severity: 'WARNING',
    message: 'Gypsum inventory reached reorder threshold (2,150 tons remaining). Requisition suggested.',
    acknowledged: false
  },
  {
    id: 'ALT-1091',
    timestamp: '18:42:15',
    equipment: 'Conveyor CNV-03',
    parameter: 'Preventive Schedule',
    value: 'Overdue (1 Day)',
    threshold: '2026-09-28',
    severity: 'WARNING',
    message: 'Scheduled conveyor roller inspection is overdue. Assign maintenance technician.',
    acknowledged: false
  },
  {
    id: 'ALT-1090',
    timestamp: '17:05:00',
    equipment: 'Cement Mill CM-02',
    parameter: 'Operational State',
    value: 'OFFLINE',
    threshold: 'Continuous Run',
    severity: 'CRITICAL',
    message: 'Cement Mill #2 stopped for scheduled overhaul & chamber liner plate refitting.',
    acknowledged: true
  },
  {
    id: 'ALT-1089',
    timestamp: '15:20:44',
    equipment: 'Kiln Line 1',
    parameter: 'Burning Zone Temp',
    value: '1472 °C',
    threshold: '1400 - 1500 °C',
    severity: 'INFO',
    message: 'Optimal clinkerization thermal balance restored following fuel rate trimming.',
    acknowledged: true
  }
];
