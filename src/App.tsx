/**
 * Cement Plant Centralized Monitoring and Production Management System
 * 
 * 3rd-Year Information Technology College Project
 * Main Frontend Application Coordinator with Full Authentication Integration
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { UsersPage } from './pages/UsersPage';
import { NavigationTab, Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { KilnMonitoringPage } from './pages/KilnMonitoringPage';
import { EnergyMonitoringPage } from './pages/EnergyMonitoringPage';
import { RawMaterialsPage } from './pages/RawMaterialsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { ProductionKPIPage } from './pages/ProductionKPIPage';
import { ReportsPage } from './pages/ReportsPage';
import {
  MOCK_KILN_DATA,
  MOCK_PRODUCTION_KPI,
  MOCK_ENERGY_DATA,
  MOCK_RAW_MATERIALS,
  MOCK_MAINTENANCE_LIST,
  MOCK_ALERTS
} from './data/mockData';
import {
  KilnData,
  ProductionKPI,
  EnergyData,
  RawMaterial,
  MaintenanceRecord,
  PlantAlert
} from './types';
import { calculateEfficiency, calculateVariance, calculateEnergyPerTon } from './utils/calculations';
import { Loader2, Factory, ShieldAlert } from 'lucide-react';

function AppContent() {
  const { currentUser, isAuthenticated, isLoading } = useAuth();

  // Authentication View state (when not logged in)
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // Navigation & Layout State
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Core Industrial Operational State (Simulated)
  const [kilnData, setKilnData] = useState<KilnData>(MOCK_KILN_DATA);
  const [productionKpi, setProductionKpi] = useState<ProductionKPI>(MOCK_PRODUCTION_KPI);
  const [energyData, setEnergyData] = useState<EnergyData>(MOCK_ENERGY_DATA);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(MOCK_RAW_MATERIALS);
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceRecord[]>(MOCK_MAINTENANCE_LIST);
  const [alerts, setAlerts] = useState<PlantAlert[]>(MOCK_ALERTS);

  // Unread alerts count
  const unreadAlertCount = alerts.filter((a) => !a.acknowledged).length;

  // Enforce role-based tab restriction:
  // If an Operator tries to access Maintenance, Production, Reports, or Users, redirect to Dashboard.
  useEffect(() => {
    if (!currentUser) return;
    const role = currentUser.role?.toLowerCase();

    if (role === 'operator') {
      const allowedTabs: NavigationTab[] = ['dashboard', 'kiln', 'energy', 'materials'];
      if (!allowedTabs.includes(activeTab)) {
        setActiveTab('dashboard');
      }
    } else if (role === 'plant_manager') {
      const allowedTabs: NavigationTab[] = ['dashboard', 'kiln', 'energy', 'materials', 'maintenance', 'production', 'reports'];
      if (!allowedTabs.includes(activeTab)) {
        setActiveTab('dashboard');
      }
    }
  }, [currentUser, activeTab]);

  /**
   * Simulate SCADA Telemetry Cycle
   * Increments clinker output by 15 tons, consumes raw meal & energy,
   * and recalculates KPIs dynamically for viva evaluations!
   */
  const handleSimulateCycle = () => {
    const addedTons = 15;
    const newActual = productionKpi.actualProductionTons + addedTons;
    const newEfficiency = calculateEfficiency(newActual, productionKpi.targetProductionTons);
    const newVariance = calculateVariance(newActual, productionKpi.targetProductionTons);

    const newElectricity = energyData.dailyElectricityKwh + 1420;
    const newEnergyPerTon = calculateEnergyPerTon(newElectricity, newActual);

    const tempDelta = Math.floor(Math.random() * 7) - 3;
    const newTemp = Math.min(1490, Math.max(1440, kilnData.temperature + tempDelta));

    setProductionKpi({
      ...productionKpi,
      actualProductionTons: newActual,
      dailyProductionTons: newActual,
      monthlyProductionTons: productionKpi.monthlyProductionTons + addedTons,
      productionEfficiencyPercent: newEfficiency,
      productionVarianceTons: newVariance,
      energyPerTonKwh: newEnergyPerTon
    });

    setEnergyData({
      ...energyData,
      dailyElectricityKwh: newElectricity,
      energyConsumedPerTon: newEnergyPerTon,
      isExceeded: newEnergyPerTon > energyData.targetEnergyPerTon
    });

    setKilnData({
      ...kilnData,
      temperature: newTemp,
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false })
    });
  };

  const handleUpdateKiln = (updated: Partial<KilnData>) => {
    setKilnData((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateMaterial = (updatedMat: RawMaterial) => {
    setRawMaterials((prev) =>
      prev.map((m) => (m.id === updatedMat.id ? updatedMat : m))
    );
  };

  const handleAddMaterial = (newMat: RawMaterial) => {
    setRawMaterials((prev) => [...prev, newMat]);
  };

  const handleUpdateMaintenance = (updatedRec: MaintenanceRecord) => {
    setMaintenanceList((prev) =>
      prev.map((m) => (m.id === updatedRec.id ? updatedRec : m))
    );
  };

  const handleAddMaintenance = (newRec: MaintenanceRecord) => {
    setMaintenanceList((prev) => [newRec, ...prev]);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  // Header Title mapping
  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Main Operations Dashboard',
          subtitle: 'Centralized plant overview, KPIs & live status'
        };
      case 'kiln':
        return {
          title: 'Rotary Kiln Monitoring',
          subtitle: 'Pyroprocessing thermal regulation & firing rate'
        };
      case 'energy':
        return {
          title: 'Energy & Utility Monitoring',
          subtitle: 'Electricity, fuel consumption & specific energy consumption'
        };
      case 'materials':
        return {
          title: 'Raw Material Inventory',
          subtitle: 'Limestone, Clay, Gypsum, Coal stockpiles & silos'
        };
      case 'maintenance':
        return {
          title: 'Equipment Maintenance Management',
          subtitle: 'Work orders, downtime prevention & equipment health'
        };
      case 'production':
        return {
          title: 'Production Performance & KPIs',
          subtitle: 'Target vs actual variance, efficiency & capacity utilization'
        };
      case 'reports':
        return {
          title: 'Operational Reports & Audits',
          subtitle: 'Shift logs, weekly aggregates & printable executive summaries'
        };
      case 'users':
        return {
          title: 'User Management & Personnel',
          subtitle: 'System administration, RBAC & personnel authorization'
        };
    }
  };

  // 1. Initial Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 animate-pulse">
          <Factory className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          <span>Verifying SCADA Security Token...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: Render Login or Register
  if (!isAuthenticated || !currentUser) {
    if (authView === 'register') {
      return (
        <Register
          onSwitchToLogin={() => setAuthView('login')}
          onRegisterSuccess={() => setActiveTab('dashboard')}
        />
      );
    }
    return (
      <Login
        onSwitchToRegister={() => setAuthView('register')}
        onLoginSuccess={() => setActiveTab('dashboard')}
      />
    );
  }

  // 3. Authenticated: Render Main Application Layout
  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        unreadAlertCount={unreadAlertCount}
        userRole={currentUser.role}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Header with User Name, Role & Logout */}
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          unreadAlertCount={unreadAlertCount}
          onOpenAlerts={() => setActiveTab('dashboard')}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              currentUser={currentUser}
              kilnData={kilnData}
              productionKpi={productionKpi}
              energyData={energyData}
              rawMaterials={rawMaterials}
              maintenanceList={maintenanceList}
              alerts={alerts}
              onNavigateTab={setActiveTab}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onSimulateTick={handleSimulateCycle}
            />
          )}

          {activeTab === 'kiln' && (
            <KilnMonitoringPage
              kilnData={kilnData}
              onUpdateKiln={handleUpdateKiln}
            />
          )}

          {activeTab === 'energy' && (
            <EnergyMonitoringPage
              energyData={energyData}
            />
          )}

          {activeTab === 'materials' && (
            <RawMaterialsPage
              materials={rawMaterials}
              onUpdateMaterial={handleUpdateMaterial}
              onAddMaterial={handleAddMaterial}
            />
          )}

          {activeTab === 'maintenance' && (
            <MaintenancePage
              maintenanceList={maintenanceList}
              onUpdateRecord={handleUpdateMaintenance}
              onAddRecord={handleAddMaintenance}
            />
          )}

          {activeTab === 'production' && (
            <ProductionKPIPage
              kpi={productionKpi}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsPage
              productionKpi={productionKpi}
              energyData={energyData}
              rawMaterials={rawMaterials}
              maintenanceList={maintenanceList}
              kilnData={kilnData}
            />
          )}

          {activeTab === 'users' && currentUser.role?.toLowerCase() === 'admin' && (
            <UsersPage />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
