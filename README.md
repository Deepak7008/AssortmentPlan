# Stratos

A **premium, mobile-first application** for Planners and Executives to review and track daily assortment planning activities.

---

## Features

- **Home**: Planner Progress tracking with overall team progress, date display, and contextual navigation to Dashboard/Items
- **Dashboard**: KPI Summary, Progress Tracking, Heatmap Visualization with dynamic class/region derivation
- **Item Explorer**: Options Count, Attribute Distribution, Visual Item Grid
- **Smart Filtering**: Dynamic filters derived from uploaded data (Category, Business Location, Season on Home; Class, Country, Season on Dashboard/Items)
- **Multi-File Upload**: Upload multiple CSV files (Planner Progress + Item Data) in a single action with auto-detection
- **Contextual Navigation**: Tap a planner row → action sheet → navigate to Dashboard or Items with pre-applied filters

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native (Expo SDK 52) |
| Styling | NativeWind (Tailwind CSS) |
| Routing | Expo Router |
| State | React Context (AuthContext, DataContext, FilterContext) |

## Quick Start

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android) or press `w` for web.

## Data Upload

The app supports uploading **multiple CSV files** simultaneously:
- **Planner Progress CSV** — detected by `Planner Name` header column
- **Item Data CSV** — any other CSV is treated as assortment/item data

Tap the upload button (cloud icon) on any page → select one or more CSV files → data loads automatically.

## Documentation

See the [Docs](./Docs/) folder for detailed documentation:
- [BRD.md](./Docs/BRD.md) - Business Requirements
- [Implementation_Plan.md](./Docs/Implementation_Plan.md) - Tech Stack & Setup
- [UI_UX.md](./Docs/UI_UX.md) - Design System
- [Walkthrough.md](./Docs/Walkthrough.md) - Design Decisions
- [Task_Plan.md](./Docs/Task_Plan.md) - Changelog

---

> **Last Updated**: February 14, 2026
