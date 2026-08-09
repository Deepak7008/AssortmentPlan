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
| Framework | React Native (Expo SDK 54) |
| Styling | NativeWind (Tailwind CSS) |
| Routing | Expo Router |
| State | React Context (AuthContext, DataContext, FilterContext) |
| Deployment | Static web build (`expo export --platform web`) — works on any device via a link |

## Quick Start

```bash
npm install
npm run web        # development server (press w / open the printed URL)
```

## Deploy & Use (Web-First)

The app is a **static website** — no Expo Go, no app install needed. The same link
works on desktop, tablet, and mobile browsers.

```bash
npm run web:build    # exports the static site to ./dist
npm run web:preview  # serves it locally at http://localhost:3000
```

For other devices on the same network, open `http://<your-PC-IP>:3000` in any
browser (or deploy the `dist/` folder to Vercel / Netlify / GitHub Pages for a
public URL). Native iOS/Android builds remain possible via EAS if ever required.

## Data Upload

The app supports uploading **multiple CSV files** simultaneously:
- **Planner Progress CSV** — detected by `Planner Name` header column
- **Item Data CSV** — any other CSV is treated as assortment/item data

Tap the upload button (cloud icon) on any page → select one or more CSV files → data loads automatically.

## Documentation

See the [Docs](./Docs/) folder for detailed documentation:
- [Project_Overview.md](./Docs/Project_Overview.md) - Project Overview
- [BRD.md](./Docs/BRD.md) - Business Requirements
- [Implementation_Plan.md](./Docs/Implementation_Plan.md) - Tech Stack & Setup
- [UI_UX.md](./Docs/UI_UX.md) - Design System
- [Metrics.md](./Docs/Metrics.md) - Metric Formulas & Data Dictionary
- [Walkthrough.md](./Docs/Walkthrough.md) - Design Decisions
- [Task_Plan.md](./Docs/Task_Plan.md) - Changelog

---

> **Last Updated**: February 14, 2026
