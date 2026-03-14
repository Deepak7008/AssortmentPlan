# Stratos — UX Audit & Improvement Proposals

After a thorough code review of all screens and components, here's my assessment of the current UX pain points and actionable proposals to make the app truly **appealing and premium**.

---

## 🔴 Critical UX Issues

### 1. Information Overload — No Progressive Disclosure
Every screen dumps all data at once. The Home screen shows a massive horizontal-scroll table, the Dashboard packs KPIs + performance table + heatmap into one scroll, and Items shows stats + distribution + grid all at once.

**Proposal:** Use card-based progressive disclosure — show summary KPIs up top with expandable detail sections. Add animated transitions when expanding/collapsing.

---

### 2. Filter Bar Takes Too Much Space (5 dropdowns, 2 rows)
~~The `FilterBar` occupies ~100px of vertical space on every screen — on mobile, that's ~15% of the viewport. The "Ghost Picker" pattern, while clever technically, doesn't feel premium on mobile.~~
**[RESOLVED]:** Replaced with a single-row horizontal scrollable chip/pill style filter. Selected filters glow with accent colors. Tapping opens a custom bottom sheet modal.

---

### 3. No Animations or Transitions
Zero animations anywhere. No entry animations for cards, no page transitions, no number count-up effects for KPIs, no skeleton loading states. The app feels static — data just "appears."

**Proposal:**
- Add `react-native-reanimated` entering/exiting animations on cards
- KPI numbers should count up on mount
- Smooth accordion animations for collapsible sections
- Skeleton loading placeholders instead of a bare `ActivityIndicator`

---

### 4. Planner Table: Horizontal Scroll is Hostile
The `PlannerProgressTable` requires horizontal scrolling to see all columns. On mobile, users can't see the full picture at a glance. The fixed column widths (90px, 100px, 80px×4) don't adapt.

**Proposal:** Redesign as **stacked cards** on mobile (name on top, progress bar, milestone pills below). Keep table layout on larger screens with responsive column widths.

---

### 5. Item Cards are Too Small (3-column grid, ~100px images)
At `CARD_WIDTH = (screenWidth - 40) / 3`, items are ~110px wide with 100px tall images. Text is 8-10px — barely readable. The cards feel cramped.

**Proposal:** Default to a **2-column grid** on mobile with larger cards (~170px wide, 140px images). Add subtle shadow and rounded corners with hover/press animation. Consider a "view mode" toggle (grid/list).

---

## 🟡 Medium-Priority UX Issues

### 6. Header is Generic
The `AppHeader` is just "Stratos" text + 3 icon buttons. No context about which page you're on, no breadcrumbs, no active filter indicators.

**Proposal:** Add a subtitle showing the current page name or active filter count (e.g. "Dashboard • 2 filters active"). Consider adding the Stratos logo image alongside the text.

---

### 7. Tab Bar Lacks Visual Polish
~~Basic tab bar with outline icons, no badge for alerts/notifications, no gradient or glass effect on the active tab.~~
**[RESOLVED]:** Replaced with a custom Floating Tab Bar using a pill-shaped glassmorphism effect, subtle shadow, text labels, and dynamic scaling animations via `reanimated`. Added a dedicated Favorites tab route to balance the generic UI.

---

### 8. No Empty States
When filters return no data, the screens just render nothing — blank space. No friendly message, no illustration, no call to action.

**Proposal:** Design illustrated empty states with contextual messages like "No planners match your filters — try adjusting the selection."

---

### 9. Inconsistent Styling Between Screens
~~`home.tsx` uses inline styles extensively while `index.tsx` / `items.tsx` use NativeWind classes. The `home.tsx` background is `#0f172a` (slate-900) while others use `bg-slate-950` (#020617). This creates a subtle but noticeable color shift when switching tabs.~~
**[RESOLVED]:** All screens correctly use `bg-slate-950` natively.

---

### 10. Regional Heatmap Could Be More Visual
~~The heatmap uses variable-opacity `rgba(56, 189, 248, ...)` rectangles. It works but feels flat. No tooltips, no legend, no color scale indicator.~~
**[RESOLVED]:** Built out with RGB interpolation, floating tooltips, and a dynamic color scale.

---

## 🟢 Quick Polish Wins

| Area | Current | Proposed |
|------|---------|----------|
| **Typography** | System font only | Add Inter/Outfit via `expo-font` for premium feel |
| **Loading** | Plain spinner | Skeleton shimmer placeholders |
| **Button Feedback** | Opacity 0.7 on press | Scale-down + haptic feedback |
| **Section Headers** | Static divider line | Subtle fade-in animation on scroll |
| **Pull-to-Refresh** | Not implemented | ✅ Added on all data screens |
| **Scroll-to-Top** | Not implemented | ✅ Floating button after scrolling |

---

## Current Priority Progress Tracker

| Priority | Change | Impact | Effort |
|----------|--------|--------|--------|
| **P0** | ✅ Fix background inconsistency | Hygiene | Low |
| **P0** | ❌ ~~2-column item grid + bigger cards~~ | High | Low |
| **P1** | ✅ Chip-style filter bar | High | Medium |
| **P1** | ❌ ~~Card-based planner rows (mobile)~~ | High | Medium |
| **P1** | ❌ ~~Entry animations + KPI count-up~~ | High | Medium |
| **P2** | Skeleton loading states | Medium | Low |
| **P2** | Empty states | Medium | Low |
| **P2** | Custom typography (Inter/Outfit) | Medium | Low |
| **P2** | ✅ Tab bar polish | Medium | Low |
| **P3** | ✅ Enhanced heatmap | Medium | Medium |
| **P3** | ✅ Pull-to-refresh + scroll-to-top | Low | Low |
| **P3** | Header context subtitle | Low | Low |

> **Last Updated**: March 14, 2026
