# Metrics Reference

How every metric in the app is calculated from the uploaded data files.

---

## Data Sources

### ItemData.csv (Assortment Data)

| Column | Type | Description |
|--------|------|-------------|
| `id` | string | Unique item identifier |
| `className` | string | Product class (Dress, Pants, Formal, etc.) |
| `country` | string | Market country |
| `season` | string | Season code (e.g. SS26) |
| `name` | string | Item name |
| `cost` | number | Cost price per unit |
| `sellingPrice` | number | Retail selling price per unit |
| `margin` | number | `sellingPrice - cost` |
| `marginPercent` | string | `(margin / sellingPrice) * 100` as percentage string |
| `roi` | number | Return on investment ratio |
| `plannedUnits` | int | Units originally planned |
| `assortedUnits` | int | Units actually assorted |
| `status` | string | `Approved`, `Under Review`, or `Draft` |
| `lifecycle` | string | `New`, `Carryover`, or `Exit` |
| `ros` | number | Rate of sale (units/store/week) |
| `storeCount` | int | Number of stores carrying the item |
| `imageUrl` | string | Product image URL |
| `region` | string | Geographic region (North, South, East) |
| `material` | string | Fabric/material type |
| `fit` | string | Fit type (Regular, Slim, Relaxed, etc.) |
| `color` | string | Primary color |
| `lastYearSales` | number | Last year actual sales in $ |
| `lastYearPlan` | number | Last year planned sales in $ |
| `lastYearMarginPercent` | number | Last year actual margin % |
| `lastYearMarginPlan` | number | Last year planned margin % |
| `lastYearROI` | number | Last year actual ROI |
| `lastYearROIPlan` | number | Last year planned ROI |
| `sellThru` | number | Sell-through rate % |
| `sellThruPlan` | number | Planned sell-through rate % |
| `suggested` | int | Number of AI/system suggestions |
| `budget` | number | Budget allocation in $ for this item |

### planner_progress.csv (Planner Data)

| Column | Type | Description |
|--------|------|-------------|
| `Planner Name` | string | Planner's full name |
| `Class` | string | Product class assigned |
| `Country` | string | Market country assigned |
| `Season` | string | Season code |
| `Progress` | int | Completion percentage (0-100) |
| `Option Plan Date` | date | Option plan milestone deadline |
| `Line Plan Date` | date | Line plan milestone deadline |
| `Buy Plan Date` | date | Buy plan milestone deadline |
| `Category` | string | Business category |
| `Business Location` | string | Business region (NA, EMEA, etc.) |

---

## Home Screen Metrics

> **Filter scope**: Planner data filtered by Category, Business Location, Season.

### Overall Team Progress
```
average(filteredPlanners.progress)
```
Mean of `progress` field across all filtered planner rows, displayed as percentage with gradient progress bar.

### Planner Progress Table

| Column | Calculation |
|--------|-------------|
| **Name** | `plannerName` (abbreviated: first name + last initial) |
| **Filter** | `class, country` |
| **Progress** | `progress` field shown as mini gradient bar + percentage |
| **Option Plan** | Deadline status indicator for `optionPlanDate` |
| **Line Plan** | Deadline status indicator for `linePlanDate` |
| **Buy Plan** | Deadline status indicator for `buyPlanDate` |

### Deadline Status Colors
```
if (deadlineDate - currentDate < 0 days)  → RED (overdue)
if (deadlineDate - currentDate <= 7 days) → ORANGE (due soon)
if (deadlineDate - currentDate > 7 days)  → GREEN (on track)
```

---

## Dashboard Metrics

> **Filter scope**: Item data filtered by Class, Country, Season.
> **Important**: Most KPIs use only **Approved** items from the filtered set.

### Current Season Section

| Metric | Formula | Display |
|--------|---------|---------|
| **Total Sales Budget** | `SUM(approvedItems.budget)` | Formatted as `$XXXk` |
| **vs LY %** | `((totalSales - totalLastYearSales) / totalLastYearSales) * 100` | Green if ≥ 0, red if negative |
| **Sales %** | `(totalSales / budget) * 100` | Progress bar (green gradient) |
| **Margin %** | `(totalMarginVal / totalSales) * 100` | Progress bar (amber gradient) |

Where:
```
totalSales     = SUM(item.sellingPrice × item.ros × item.storeCount)
totalMarginVal = SUM(item.margin × item.ros × item.storeCount)
budget         = SUM(item.budget)
```

### Last Season Performance (KPI Cards)

| KPI | Value | vs Plan |
|-----|-------|---------|
| **Sales $** | `SUM(lastYearSales)` formatted as `$XXXk` | `((salesActual - salesPlan) / salesPlan) * 100` |
| **Margin %** | `AVG(lastYearMarginPercent)` | `marginPercent - marginPlan` (absolute difference) |
| **ROI** | `AVG(lastYearROI)` | `((roi - roiPlan) / roiPlan) * 100` |
| **Sell Thru** | `AVG(sellThru)` | `sellThru - sellThruPlan` (absolute difference) |

### Class Performance Table

| Column | Formula |
|--------|---------|
| **Class** | Distinct `className` values from approved items |
| **Sales** | `SUM(item.sellingPrice × item.ros × item.storeCount)` per class, formatted as `$XXXk` |
| **Margin** | `AVG(item.marginPercent)` per class |
| **ROI** | `AVG(item.roi)` per class |
| **Sales Change %** | ⚠️ Currently randomized (`Math.random()`) — not data-driven |
| **Margin Change %** | ⚠️ Currently randomized (`Math.random()`) — not data-driven |

### Regional Heatmap

| Cell | Formula |
|------|---------|
| **Value** | `SUM(item.sellingPrice × item.ros × item.storeCount)` for items matching both the region AND class |
| **Color intensity** | `cellSales / maxSales` → mapped to opacity (0.1 to 0.95) |

> ⚠️ Regions and classes are currently hardcoded to `['North', 'South', 'East']` and `['Shirts', 'Trousers', 'Jackets']`. These should be made dynamic.

---

## Items Screen Metrics

> **Filter scope**: Item data filtered by Class, Country, Season (all statuses included for counts).

### Options Count

| Metric | Formula |
|--------|---------|
| **Approved** | `COUNT(filteredItems WHERE status = 'Approved')` |
| **Under Review** | `COUNT(filteredItems WHERE status = 'Under Review')` |
| **Suggested** | `SUM(filteredItems.suggested)` |

### Attribute Distribution

Top 3 values by frequency for each attribute, using only **Approved** items:

```
For each attribute (material, fit, color):
  1. Count occurrences of each distinct value
  2. Sort descending by count
  3. Take top 3
  4. percent = (count / totalApprovedItems) * 100
```

### Item Detail Modal

| Metric | Formula |
|--------|---------|
| **Selling Price** | `item.sellingPrice` |
| **Cost Price** | `item.cost` |
| **ROS** | `item.ros` |
| **Sales $** | `item.sellingPrice × item.ros × item.storeCount` |
| **Margin $** | `item.margin × item.ros × item.storeCount` |
| **Store Count** | `item.storeCount` |

---

## Key Formula: Sales Dollar Value

Used consistently across Dashboard, Class Performance, Regional Heatmap, and Item Detail:

```
Sales $ = sellingPrice × ros × storeCount
```

This represents estimated total revenue: price per unit × rate of sale × number of stores.

---

## Known Issues

| Issue | Location | Notes |
|-------|----------|-------|
| `salesChange` / `marginChange` are randomized | Dashboard → Class Performance | Should be computed from last year data |
| `plannedUnits` / `assortedUnits` unused | `AssortmentItem` interface | Parsed from CSV but never displayed or calculated anywhere |

---

> **Last Updated**: February 19, 2026
