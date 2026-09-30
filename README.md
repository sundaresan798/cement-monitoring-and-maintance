# Cement Plant Centralized Monitoring and Production Management System

> **Academic Level:** 3rd-Year Information Technology College Capstone Project  
> **Target Industry:** Portland Cement Manufacturing (5,000 Metric Tons/Day Pyroprocessing Line)  
> **Operational Paradigm:** Centralized SCADA / DCS Supervisory Dashboard with Simulated Telemetry  

---

## 🏭 1. Project Background & Overview

In cement manufacturing facilities, raw materials (limestone, clay, gypsum, iron ore) are crushed, homogenized into raw meal, and processed inside a high-temperature rotary kiln (~1450°C) to produce cement clinker. Clinker is then finely ground with gypsum in ball or vertical roller mills to produce commercial cement.

Cement manufacturing is energy-intensive and operationally sensitive. Plant managers require centralized telemetry oversight of:
1. **Kiln Operations:** Burning zone temperatures, rotational drive speeds (RPM), draft pressures, and coal burner firing rates.
2. **Energy Efficiency:** Electrical power usage (kWh) and Specific Energy Consumption (SEC) per ton of clinker produced.
3. **Raw Material Inventories:** Real-time silo levels, daily consumption, and automated reorder alerts.
4. **Machinery Maintenance:** Preventive servicing across primary machinery (Kiln, Crusher, Conveyors, Raw Mill, Cement Mill, Packing Plant).
5. **Production KPIs:** Target attainment, daily variance, and plant availability.

> **Important Academic Simulation Note:**  
> This system uses **simulated cement plant telemetry** with industrial engineering values. It is designed for demonstration and does not connect to real physical PLCs or control equipment.

---

## 🛠️ 2. Technology Stack

### Frontend (Implemented in Stage 1):
- **Framework:** React 19 (TypeScript)
- **Styling:** Tailwind CSS (Modern Industrial Dark SCADA Theme)
- **Data Visualization & Charts:** Recharts (Composed Area, Line, Bar, Reference Lines)
- **Icons & UI Telemetry:** Lucide React
- **Build Tool:** Vite 8

### Backend (Scheduled for Stage 2):
- **Runtime:** Node.js
- **Server Framework:** Express.js REST APIs
- **Database:** MongoDB & Mongoose ODM
- **Authentication & Security:** JWT (JSON Web Tokens) & bcrypt password hashing

---

## 📐 3. Cement Manufacturing Engineering Formulas

This project implements the standard chemical and industrial engineering formulas used in modern cement plants:

### 1. Production Efficiency (%)
$$\text{Production Efficiency} = \left(\frac{\text{Actual Production (tons)}}{\text{Target Production (tons)}}\right) \times 100$$
- *Benchmark:* $\ge 95\%$ indicates optimal kiln feed and thermal stability.

### 2. Production Variance (Tons)
$$\text{Production Variance} = \text{Actual Production} - \text{Target Production}$$
- *Positive ($+$):* Clinker surplus output.
- *Negative ($-$):* Production deficit/shortfall requiring operational review.

### 3. Specific Energy Consumption per Ton (kWh/ton)
$$\text{Energy per Ton} = \frac{\text{Total Electrical Energy Consumed (kWh)}}{\text{Total Clinker / Cement Output (tons)}}$$
- *Benchmark:* Modern precalciner kilns target $85 - 95\text{ kWh/ton}$. Values exceeding $92\text{ kWh/ton}$ trigger an energy audit warning badge.

---

## 📂 4. Project File Structure & Created Files

```text
/
├── README.md                                # Project overview, formulas & running guide
├── metadata.json                            # AI Studio applet configuration
├── index.html                               # HTML5 entry with industrial fonts & meta
├── package.json                             # Dependencies (React, Recharts, Lucide, Tailwind)
├── vite.config.ts                           # Vite configuration with Tailwind CSS plugin
├── tsconfig.json                            # TypeScript strict configuration
│
└── src/
    ├── main.tsx                             # React DOM bootstrap entry
    ├── App.tsx                              # Main coordinator: navigation, state, SCADA simulation
    ├── index.css                            # Global Tailwind styles & monospace telemetry fonts
    │
    ├── types/
    │   └── index.ts                         # Complete TypeScript interfaces: User, KilnData,
    │                                        # EnergyData, RawMaterial, MaintenanceRecord,
    │                                        # ProductionKPI, PlantAlert
    │
    ├── utils/
    │   └── calculations.ts                  # Production efficiency, variance, energy/ton,
    │                                        # and formatting helper functions
    │
    ├── data/
    │   └── mockData.ts                      # Realistic simulated cement plant telemetry:
    │                                        # 5000 TPD kiln, 24-hr hourly trend, 7-day stats,
    │                                        # raw material silos, equipment maintenance records
    │
    ├── components/
    │   ├── common/
    │   │   └── Badge.tsx                    # Reusable industrial status pill (success, warning,
    │   │                                    # danger, info) with optional pulsing beacon
    │   ├── layout/
    │   │   ├── Sidebar.tsx                  # Responsive collapsible navigation drawer
    │   │   └── Header.tsx                   # Top bar: live industrial clock, shift tag,
    │   │                                    # telemetry alert counter & demo role switcher
    │   │
    │   └── dashboard/
    │       ├── StatCard.tsx                 # Industrial KPI metric card with trends & benchmarks
    │       ├── ProductionChart.tsx          # Recharts hourly and 7-day production vs target
    │       ├── EnergyChart.tsx              # Recharts specific energy consumption vs target
    │       ├── KilnQuickStatus.tsx          # Live rotary kiln status (Temp, RPM, Pressure, Fuel)
    │       ├── MaterialStockOverview.tsx    # Silo fill levels & reorder alerts (Limestone, Clay, etc.)
    │       ├── EquipmentQuickStatus.tsx     # Health status of 6 key machinery units
    │       ├── ActiveAlerts.tsx             # CCR real-time alarm feed with acknowledgment action
    │       └── DashboardOverview.tsx        # Assembled full dashboard view with simulation trigger
    │
    └── pages/
        ├── KilnMonitoringPage.tsx           # Dedicated pyroprocessing & rotary kiln telemetry
        ├── EnergyMonitoringPage.tsx         # Detailed electricity, fuel rate & utility cost analysis
        ├── RawMaterialsPage.tsx             # Interactive inventory management with Add/Edit modals
        ├── MaintenancePage.tsx              # Equipment work orders & maintenance scheduling
        ├── ProductionKPIPage.tsx            # Comprehensive efficiency & variance analytics
        └── ReportsPage.tsx                  # Daily, weekly & monthly reports with print layout
```

---

## 🚀 5. How to Run the Project

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:3000`.

3. **Build for Production:**
   ```bash
   npm run build
   ```

4. **Verify TypeScript & Linting:**
   ```bash
   npm run lint
   ```

---

## 🎮 6. Interactive Features for Project Demonstration / Viva

- **Simulate SCADA Cycle:** Click the **"Simulate SCADA Cycle"** button on the dashboard. It dynamically increments production by 15 tons, consumes electrical energy, updates kiln thermal status, and immediately recalculates all KPI formulas in real time!
- **Role Switcher in Header:** Click the user profile in the top-right corner to test the 3 user roles:
  - **Admin:** Full plant access and administrative control.
  - **Plant Manager:** Supervisory analytics, maintenance workflows, and executive reports.
  - **Operator:** Central Control Room (CCR) monitoring and shift logging.
- **Raw Material Stock Editor:** Open the **Raw Materials** tab and click **"Update Stock"** or **"Add Raw Feed"** to add or modify simulated inventory with automatic reorder status computation.
- **Maintenance Scheduler:** Open the **Maintenance** tab and click **"Schedule Maintenance"** to create or update work orders.
- **Printable Audit Report:** Open the **Reports** tab and click **"Print Report"** to generate a clean, high-contrast shift audit document.

---

## 🔐 7. Authentication & Security Architecture

### A. Authentication Flow
```text
1. User enters email & password on Login Page (/login)
   ↓
2. Frontend sends POST /api/auth/login request with credentials
   ↓
3. Express server receives request in authController.ts
   ↓
4. User record looked up in MongoDB / Mongoose repository
   ↓
5. bcrypt.compare verifies password hash against stored one-way salt hash
   ↓
6. If valid, jsonwebtoken signs a 24-hour JWT token containing { id, role }
   ↓
7. Response returned: { success: true, token: "JWT...", user: { id, name, email, role } }
   ↓
8. React AuthContext stores JWT token in localStorage/sessionStorage & updates user state
   ↓
9. User is redirected to Main SCADA Dashboard (/dashboard)
   ↓
10. Subsequent API requests pass "Authorization: Bearer <token>"
   ↓
11. authMiddleware verifies token signature & attaches authenticated req.user
   ↓
12. roleMiddleware enforces RBAC (admin, plant_manager, operator)
```

---

## 🔑 8. Demo User Credentials (For College Project Testing)

Three pre-seeded accounts are immediately available for evaluation with different permission levels:

| Role | Email | Password | Permissions & Visible Modules |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@cementplant.com` | `Password@123` | **Full Access:** Dashboard, Kiln, Energy, Materials, Maintenance, Production, Reports, **Users Directory** |
| **Plant Manager** | `manager@cementplant.com` | `Password@123` | **Supervisory Access:** Dashboard, Kiln, Energy, Materials, Maintenance, Production, Reports |
| **Control Room Operator** | `operator@cementplant.com` | `Password@123` | **Floor Telemetry:** Dashboard, Kiln, Energy, Raw Materials *(Maintenance, Production, Reports, Users restricted)* |

*(You can also use the one-click demo role buttons directly on the Login page for instant login!)*

---

## ⚙️ 9. Database & Environment Configuration

### Where to Add `JWT_SECRET`:
The secret is defined in the `.env` file (see `.env.example`):
```bash
JWT_SECRET="cement_plant_scada_secure_jwt_secret_key_college_demo_2026"
```
Never commit real production secrets to public repositories.

### How to Configure MongoDB:
In `.env`:
```bash
# Local MongoDB Daemon:
MONGODB_URI="mongodb://localhost:27017/cement_plant"

# Or MongoDB Atlas Cloud:
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/cement_plant?retryWrites=true&w=majority"
```
*Note: If no external MongoDB instance is running, the backend automatically uses its built-in in-memory Mongoose repository with identical bcrypt hashing and JWT security. This ensures the college evaluation demo never crashes or fails even without a local mongod service installed.*

---

## 🧪 10. Step-by-Step Testing Procedure

1. **Test Operator Login & Role-Based UI:**
   - On the Login page, click **"OPERATOR"** (or enter `operator@cementplant.com` / `Password@123`).
   - Click **"Access SCADA Console"**.
   - Notice the sidebar only displays **Dashboard**, **Kiln Monitoring**, **Energy Monitoring**, and **Raw Materials**.
   - Notice Maintenance, Production, Reports, and Users tabs are hidden to enforce least-privilege security.
   - Click **Logout** in the top header. You are securely returned to `/login`.

2. **Test Plant Manager Login:**
   - Click **"MANAGER"** (or enter `manager@cementplant.com` / `Password@123`).
   - Click **"Access SCADA Console"**.
   - Notice **Maintenance**, **Production & KPIs**, and **Reports** now appear in the sidebar.
   - Verify you can access the Maintenance schedule modal and generate reports.
   - Notice the Admin-only **Users Management** tab is not accessible.
   - Click **Logout**.

3. **Test Administrator Login:**
   - Click **"ADMIN"** (or enter `admin@cementplant.com` / `Password@123`).
   - Notice all tabs are active, including the **"Users Management"** tab.
   - Click **Users Management** to view the live registered personnel directory fetched from `GET /api/users`.

4. **Test New Personnel Registration:**
   - From the Login screen, click **"Register Personnel"**.
   - Fill in your name, a test email (e.g. `technician1@cementplant.com`), and choose role (`Operator` or `Plant Manager`).
   - Verify that trying to select `Admin` is blocked with a security notice.
   - Complete registration and log in with your newly created credentials!
