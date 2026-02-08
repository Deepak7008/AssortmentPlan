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

## Key Design Principles Applied

1. **User Feedback Driven**: All major UI changes (Filter, Layout) were based on direct user testing feedback.
2. **Platform Consistency**: Used Ghost Picker to ensure identical experience on iOS, Android, and Web.
3. **Progressive Enhancement**: Started with minimal viable features, then added premium polish.
4. **Dark Mode First**: Designed for dark theme with appropriate contrast ratios.

---

## Rejected Approaches

| Feature | Rejected Approach | Reason |
|---------|-------------------|--------|
| Filters | Bottom Sheet Modal | Poor one-handed usability |
| Filters | Raw Native Picker | Inconsistent styling across platforms |
| Data Storage | AsyncStorage | CSV upload is ephemeral per session (intentional) |

---

> **Last Updated**: February 8, 2026
