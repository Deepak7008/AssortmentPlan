# Design Walkthrough

## Overview
This document captures the design iteration process and key decisions made during the development of the Assortment Plan Mobile App.

---

## Design Iterations

### 1. Filter Component Evolution

| Iteration | Approach | Outcome |
|-----------|----------|---------|
| **V1** | Native `Picker` | ❌ Text invisible on Android (dark theme conflict) |
| **V2** | Custom Bottom Sheet Modal | ❌ Rejected: Required two-handed use, scroll issues |
| **V3** | Ghost Picker | ✅ Adopted: Custom UI + Invisible Native Picker |

**Final Decision**: The Ghost Picker pattern provides the best of both worlds—premium custom styling while leveraging reliable native touch handling.

---

### 2. Options Count Layout

| Iteration | Layout | Outcome |
|-----------|--------|---------|
| **V1** | "Assorted & Suggested" with nested counts | ❌ Wasted space, small text |
| **V2** | 3-Column Grid (Approved, Under Review, Suggested) | ✅ Adopted: Better space utilization, larger metrics |

**Final Decision**: Renamed to "Options Count" with prominent, color-coded metrics in a horizontal layout.

---

### 3. Dashboard KPI Display

| Decision | Rationale |
|----------|-----------|
| Format values in K (thousands) | Improves readability for large numbers |
| Use "Sales $" instead of "Sales (Actual)" | Clearer, more concise labeling |
| Flex-based table columns | Eliminates visual gaps, consistent alignment |

---

### 4. Mobile Dark Theme

**Problem**: Native Android Picker defaulted to system theme (light), making text invisible on dark background.

**Solution**: Set `userInterfaceStyle: "dark"` in `app.json` to force dark mode across all native components.

---

### 5. Shared Data Context

**Problem**: CSV data uploaded on Dashboard wasn't available on Items screen.

**Solution**: Implemented `DataContext` using React Context API to provide a single source of truth for CSV data across all screens.

---

### 6. Home Screen & Planner Progress

**Problem**: No visibility into planner-level progress and no way to navigate contextually from planners to their data.

**Solution**: Added a dedicated Home tab with `PlannerProgressTable`, showing per-planner rows with color-coded milestone statuses and progress bars. Tapping a row opens an action sheet to navigate to Dashboard or Items with pre-applied filters.

---

### 7. Cross-Page Filter Synchronization

**Problem**: Selecting a planner on Home and navigating to Dashboard/Items lost the filter context.

**Solution**: Introduced `FilterContext` to manage `selectedClass`, `selectedCountry`, and `selectedSeason` globally. Home sets these values from the planner row before navigation; Dashboard and Items consume them.

---

### 8. Multi-File Upload

**Problem**: Only one CSV (assortment data) could be uploaded. Planner data was hardcoded.

**Solution**: Updated `UploadButton` to support `multiple: true` file selection. `DataContext` auto-detects file type by checking for `Planner Name` header. Both planner and item data are now managed centrally in context.

---

### 9. Dynamic Filters

**Problem**: Filter dropdowns had hardcoded options that didn't match uploaded data.

**Solution**: All filter options (Home: Category, Business Location, Season; Dashboard/Items: Class, Country, Season) are derived dynamically from the actual data using `useMemo`.

---

### 10. Consistent Header Layout

**Problem**: Home had a greeting/date header style while Dashboard and Items showed "Stratos" with icon buttons.

**Solution**: Aligned all pages to use the same header: "Stratos" title + DocsButton + UploadButton + ProfileButton. Moved date display to the Planner Progress section header.

---

## Key Design Principles Applied

1. **User Feedback Driven**: All major UI changes (Filter, Layout) were based on direct user testing feedback.
2. **Platform Consistency**: Used Ghost Picker to ensure identical experience on iOS, Android, and Web.
3. **Progressive Enhancement**: Started with minimal viable features, then added premium polish.
4. **Dark Mode First**: Designed for dark theme with appropriate contrast ratios.
5. **Data-Driven UI**: Filters and visualizations adapt dynamically to uploaded data.

---

## Rejected Approaches

| Feature | Rejected Approach | Reason |
|---------|-------------------|--------|
| Filters | Bottom Sheet Modal | Poor one-handed usability |
| Filters | Raw Native Picker | Inconsistent styling across platforms |
| Data Storage | AsyncStorage | CSV upload is ephemeral per session (intentional) |
| Header | Greeting + Date header on Home | Inconsistent with Dashboard/Items; moved to section-level |

---

> **Last Updated**: February 14, 2026
