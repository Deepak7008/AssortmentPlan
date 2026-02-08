# UI/UX Design System

## Design Theme: "Future Dark"

A premium dark-mode aesthetic with vibrant gradient accents and glassmorphism effects.

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `bg-slate-950` | `#020617` | Primary background |
| `bg-slate-900` | `#0f172a` | Card backgrounds |
| `bg-slate-800` | `#1e293b` | Elevated surfaces |
| `text-sky-400` | `#38bdf8` | Primary accent |
| `text-green-400` | `#4ade80` | Success/Approved |
| `text-yellow-400` | `#facc15` | Warning/Under Review |
| `text-rose-500` | `#f43f5e` | Error states |

---

## Typography

| Style | Class | Usage |
|-------|-------|-------|
| **Page Title** | `text-xl font-bold text-white` | Screen headers |
| **Section Header** | `text-xs font-bold uppercase tracking-widest text-slate-400` | Collapsible titles |
| **Metric Value** | `text-3xl font-bold` | Large KPI numbers |
| **Label** | `text-[10px] uppercase font-bold text-slate-400` | Field labels |
| **Body** | `text-sm text-slate-300` | General content |

---

## Core UI Components

### 1. GlassView
Glassmorphic container with blur effect.
- **Native**: Uses `expo-blur` `<BlurView>`
- **Web**: CSS `backdrop-filter: blur(20px)`
- **Usage**: Headers, modals, floating elements

```tsx
<GlassView intensity={10} className="...">
  {children}
</GlassView>
```

### 2. GradientCard
Gradient background container using `expo-linear-gradient`.
- **Colors**: Configurable start/end colors
- **Usage**: Hero sections, KPI highlights

### 3. Ghost Picker (FilterSelect)
Custom-styled dropdown with native behavior.
- **Visual Layer**: Tailwind-styled `View` with chevron icon
- **Interact Layer**: Invisible native `Picker` (`opacity: 0`)
- **Result**: Premium look + reliable touch handling

### 4. ItemCard
Image-dominant card for item display.
- **Layout**: Image top, details bottom
- **Features**: Status badge overlay, price display
- **Interactions**: Hover scale (web), tap to open modal

### 5. CollapsibleSection
Expandable content wrapper with toggle.
- **Header**: Title + chevron icon
- **State**: Controlled expand/collapse
- **Animation**: Smooth content reveal

---

## Layout Patterns

### Sticky Headers
```tsx
<ScrollView stickyHeaderIndices={[0]}>
  <FilterBar /> {/* Index 0 - Sticky */}
  <Content />
</ScrollView>
```

### 3-Column Metrics
```tsx
<View className="flex-row justify-between">
  <View className="flex-1 items-center">...</View>
  <View className="flex-1 items-center">...</View>
  <View className="flex-1 items-center">...</View>
</View>
```

### Responsive Grid
```tsx
<View className="flex-row flex-wrap">
  <View className="w-1/2 md:w-1/4 p-2">...</View>
</View>
```

---

## Interaction States

| State | Visual Feedback |
|-------|-----------------|
| **Hover** (Web) | Scale 1.05x, subtle shadow |
| **Press** | Opacity reduction (0.7) |
| **Selected** | Blue accent color, checkmark icon |
| **Loading** | Shimmer animation |
| **Empty** | Italic placeholder text |

---

## Spacing System

Uses Tailwind's default spacing scale:
- `p-1` = 4px
- `p-2` = 8px
- `p-3` = 12px
- `p-4` = 16px
- `p-5` = 20px
- `p-6` = 24px

---

> **Last Updated**: February 8, 2026
