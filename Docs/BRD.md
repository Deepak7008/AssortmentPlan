# Assortment Plan Mobile App

## About This Application

The **Assortment Plan Mobile App** is a premium, visually stunning mobile-first application designed for Planners and Executives to review and track the progress of daily assortment planning activities. The app processes data exported from desktop planning tools (CSV format) and presents engaging visualizations to help users ensure planning goals are met.

---

## Key Features

### 📊 Dashboard (Home Screen)
- **KPI Summary**: Real-time metrics including Total Sales Budget, Sales %, and Margin %.
- **Progress Tracking**: Animated gradient progress bars showing budget utilization.
- **Heatmap Visualization**: Class vs Country performance matrix with color-coded cells.
- **Last Season Performance**: Quick comparison KPIs (Sales, Margin, ROI, Sell Thru).

### 📦 Item Explorer
- **Options Count**: 3-column layout displaying Approved, Under Review, and Suggested counts.
- **Attribute Distribution**: Breakdown by Material, Fit, and Color (Top 3 each).
- **Visual Item Grid**: Image-dominant cards with status badges and pricing.
- **Item Detail Modal**: Full specifications, metrics, and store distribution.

### 🎛️ Smart Filtering
- **Global Filters**: Class, Season, and Country selectors.
- **Ghost Picker UI**: Premium custom styling with native picker behavior.
- **Sticky Headers**: Filters remain accessible while scrolling.

---

## User Personas

| Persona | Primary Use Case |
|---------|------------------|
| **The Planner** | End-of-day review: "Did I finish everything?", "Am I within budget?", visual item validation |
| **The Manager/Executive** | High-level view: "How is the team doing?", "Are we hitting targets?", category performance |

---

## Data Source

The app reads **CSV files** with the following expected columns:
- `className`, `country`, `season`, `status`
- `itemName`, `storeCount`, `storeName`
- `salesActual`, `salesBudget`, `marginActual`, `marginBudget`
- `cost`, `price`, `ros`, `suggested`
- `material`, `fit`, `color`, `imageUrl`

---

## Design Philosophy

- **Theme**: "Future Dark" - Deep blues/blacks with neon gradients (Cyan/Purple)
- **Glassmorphism**: Extensive use of blur effects and semi-transparent backgrounds
- **Premium Feel**: Smooth animations, gradient accents, and rich shadows

---

> **Version**: 1.0  
> **Last Updated**: February 8, 2026
