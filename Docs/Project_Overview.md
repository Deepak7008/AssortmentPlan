# Stratos — Project Overview

**Strategic Oversight for the Retail Frontier**

Stratos is a premium, mobile-first application built for Planners and Executives to review and track daily assortment planning activities. It ingests CSV exports from desktop planning tools and presents rich, interactive visualizations to ensure planning goals are met on time and within budget.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React Native (Expo SDK 54) |
| **Routing** | Expo Router (file-based) |
| **Styling** | NativeWind / Tailwind CSS |
| **State** | React Context (AuthContext, DataContext, FilterContext) |
| **CSV Parsing** | PapaParse + custom services |
| **Icons** | Ionicons, Lucide React Native |
| **Platforms** | iOS, Android, Web |

---

## Application Screens

### Home (Planner Progress)
- Overall team progress with animated gradient bar
- Per-planner table: class, country, progress bar, milestone dates (Option Plan / Line Plan / Buy Plan) with color-coded status
- Contextual navigation: tap a planner row → action sheet → jump to Dashboard or Items with filters pre-applied
- Filters: Category, Business Location, Season

### Dashboard
- Current-season KPIs: Total Sales Budget, Sales %, Margin %, vs Last Year %
- Class Performance table with sales, margin, and ROI per class
- Regional Heatmap: Class × Region sales matrix with color intensity
- Last Season Performance cards: Sales $, Margin %, ROI, Sell Thru (actual vs plan)
- Filters: Class, Country, Season

### Item Explorer
- Options Count: Approved, Under Review, Suggested
- Attribute Distribution: Top 3 by Material, Fit, Color
- Visual item grid with image-dominant cards, status badges, and pricing
- Item Detail modal with full specs, metrics, and store distribution
- Filters: Class, Country, Season

### Login
- Branded login screen with "Stratos" logo and tagline

---

## Data Model

The app consumes **two CSV file types**:

### Planner Progress CSV
| Key Columns |
|-------------|
| Planner Name, Class, Country, Season, Progress |
| Option Plan Date, Line Plan Date, Buy Plan Date |
| Category, Business Location |

### Item Data CSV
| Key Columns |
|-------------|
| className, country, season, status, name |
| cost, sellingPrice, margin, marginPercent, roi |
| ros, plannedUnits, assortedUnits, storeCount, region |
| material, fit, color, imageUrl, budget |
| lastYearSales, lastYearPlan, lastYearMarginPercent, lastYearROI |
| sellThru, sellThruPlan, suggested |

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Multi-File Upload** | Select multiple CSVs at once; auto-detected by header content |
| **Cascading Filters** | Cross-page filter sync via FilterContext; options derived dynamically from data |
| **Chip Filter Bar** | Horizontal scrolling pill-style filters replacing bulky dropdowns |
| **Floating Tab Bar** | Custom glassmorphism pill navigation with animated icons |
| **Glassmorphism UI** | Dark theme ("Future Dark") with blur effects, gradients, and rich shadows |
| **Data Interaction** | Pull-to-refresh, smooth scroll-to-top FAB |
| **Sticky Filter Bar** | Filters remain visible while scrolling content |
| **Demo Data** | Built-in sample data; reset via upload menu |

---

## Project Structure

```
assortment-plan-app/
├── app/                    # Expo Router screens
│   ├── (tabs)/             # Tab navigation (Home, Dashboard, Items)
│   ├── _layout.tsx         # Root layout with providers
│   └── login.tsx           # Login screen
├── components/             # Reusable UI components
│   ├── ui/                 # Core primitives (GlassView, GradientCard)
│   ├── FilterBar.tsx       # Horizontal scrolling chip filters
│   ├── FloatingTabBar.tsx  # Custom bottom navigation
│   ├── ItemCard.tsx        # Item grid card
│   ├── PlannerProgressTable.tsx
│   ├── RegionalHeatmap.tsx
│   ├── UploadButton.tsx    # Multi-file CSV upload
│   ├── ScrollToTopFAB.tsx
│   └── ...
├── context/                # React Context providers
│   ├── AuthContext.tsx
│   ├── DataContext.tsx
│   └── FilterContext.tsx
├── services/               # CSV parsing & data logic
│   ├── dataService.ts
│   └── plannerService.ts
├── Docs/                   # Project documentation
├── assets/                 # Images & sample CSVs
└── web-demo/               # Static web demo
```

---

## Quick Start

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android) or press `w` for web.

---

## Documentation Index

| Document | Purpose |
|----------|---------|
| [BRD.md](./BRD.md) | Business requirements & feature descriptions |
| [Implementation_Plan.md](./Implementation_Plan.md) | Tech stack, dependencies, setup instructions |
| [UI_UX.md](./UI_UX.md) | Design system, components, color palette |
| [Metrics.md](./Metrics.md) | Metric formulas & data dictionary |
| [Task_Plan.md](./Task_Plan.md) | Changelog & task tracking |
| [Walkthrough.md](./Walkthrough.md) | Design decisions & implementation notes |
| [UX_Audit.md](./UX_Audit.md) | UX priorities, bugs, and feature completion tracker |

---

## Design Philosophy

- **Theme**: "Future Dark" — deep blues/blacks with cyan-to-purple gradient accents
- **Glassmorphism**: Blur effects and semi-transparent surfaces throughout
- **Premium Feel**: Smooth animations, gradient progress bars, rich shadows
- **Consistent Branding**: "Stratos" header with Docs, Upload, and Profile buttons on every page

---

> **Version**: 1.1
> **Last Updated**: March 14, 2026
