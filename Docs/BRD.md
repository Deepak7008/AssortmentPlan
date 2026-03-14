# Assortment Plan Mobile App

## About This Application

The **Assortment Plan Mobile App (Stratos)** is a premium, visually stunning mobile-first application designed for Planners and Executives to review and track the progress of daily assortment planning activities. The app processes data exported from desktop planning tools (CSV format) and presents engaging visualizations to help users ensure planning goals are met.

---

## Key Features

### 🏠 Home (Planner Progress)
- **Team Progress**: Animated gradient progress bar with overall completion percentage.
- **Planner Table**: Per-planner rows showing Class, Country, progress bars, and milestone dates with color-coded status indicators.
- **Contextual Navigation**: Tap any planner row → action sheet → navigate to Dashboard or Items with filters pre-applied (Class, Country, Season).
- **Date Display**: Current date shown alongside the Planner Progress section header.

### 📊 Dashboard
- **KPI Summary**: Real-time metrics including Total Sales Budget, Sales %, and Margin %.
- **Progress Tracking**: Animated gradient progress bars showing budget utilization.
- **Heatmap Visualization**: Dynamic Class vs Region performance matrix with color-coded cells.
- **Last Season Performance**: Quick comparison KPIs (Sales, Margin, ROI, Sell Thru).

### 📦 Item Explorer
- **Options Count**: 3-column layout displaying Approved, Under Review, and Suggested counts.
- **Attribute Distribution**: Breakdown by Material, Fit, and Color (Top 3 each).
- **Visual Item Grid**: Image-dominant cards with status badges and pricing.
- **Item Detail Modal**: Full specifications, metrics, and store distribution.

### 🎛️ Smart Filtering
- **Home Filters**: Category, Business Location, Season — derived dynamically from planner data.
- **Dashboard/Items Filters**: Class, Country, Season — derived dynamically from item data.
- **Cross-Page Sync**: FilterContext ensures selections propagate when navigating between pages.
- **Chip Filter Bar**: Sleek horizontal scrollable pills with active blue state and leading filter funnel icon.
- **Pull-to-Refresh**: Native pull-to-refresh gestures implemented across all screens.
- **Sticky Headers**: Filters remain accessible while scrolling.

### 📤 Multi-File Upload
- **Batch Upload**: Select multiple CSV files in a single action.
- **Auto-Detection**: Files with `Planner Name` header → Planner Progress data; all others → Item Data.
- **Load Summary**: Alert displays file names with intersection counts after upload.
- **Demo Data**: Reset to built-in demo data via the upload menu.

---

## User Personas

| Persona | Primary Use Case |
|---------|------------------|
| **The Planner** | End-of-day review: "Did I finish everything?", "Am I within budget?", visual item validation |
| **The Manager/Executive** | High-level view: "How is the team doing?", "Are we hitting targets?", category performance |

---

## Data Source

The app reads **two types of CSV files**:

### Planner Progress CSV
- `Planner Name`, `Class`, `Country`, `Season`, `Progress`
- `Option Plan Date`, `Line Plan Date`, `Buy Plan Date`
- `Category`, `Business Location`

### Item Data CSV
- `className`, `country`, `season`, `status`
- `name`, `storeCount`, `region`
- `cost`, `sellingPrice`, `margin`, `marginPercent`, `roi`
- `ros`, `plannedUnits`, `assortedUnits`, `suggested`
- `material`, `fit`, `color`, `imageUrl`
- `lastYearSales`, `lastYearPlan`, `lastYearMarginPercent`, `lastYearROI`
- `sellThru`, `sellThruPlan`

---

## Design Philosophy

- **Theme**: "Future Dark" - Deep blues/blacks with neon gradients (Cyan/Purple)
- **Glassmorphism**: Extensive use of blur effects and semi-transparent backgrounds
- **Floating Tab Bar**: Pill-shaped custom bottom navigation bar with fluid animations
- **Premium Feel**: Smooth animations, gradient accents, and rich shadows
- **Consistent Header**: "Stratos" branding with Docs, Upload, and Profile buttons across all pages

---

> **Version**: 2.1
> **Last Updated**: March 14, 2026
