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
| `text-rose-500` | `#f43f5e` | Error/Overdue states |
| Cyan→Purple gradient | `#0ea5e9` → `#a855f7` | Progress bars |

---

## Typography

| Style | Class | Usage |
|-------|-------|-------|
| **Page Title** | `text-xl font-bold text-white` | Screen headers ("Stratos") |
| **Section Header** | `text-xs font-bold uppercase tracking-widest text-slate-400` | Section titles |
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

### 2. GradientCard
Gradient background container using `expo-linear-gradient`.
- **Colors**: Configurable start/end colors
- **Usage**: Hero sections, KPI highlights, team progress

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

### 6. PlannerProgressTable
Per-planner row display with milestone tracking.
- **Columns**: Name, Filter (Class/Country), Progress bar, milestone dates
- **Status Indicators**: Color-coded circles (green=done, yellow=today, red=overdue, gray=future)
- **Interaction**: Tappable rows → action sheet for contextual navigation

### 7. UploadButton
Multi-file CSV upload with auto-detection.
- **Web**: HTML file input with `multiple` attribute
- **Mobile**: Document picker with "Load Demo Data" option
- **Detection**: Routes files to planner or item data by header content

---

## Page Header Pattern

Consistent across all pages:
```tsx
<GlassView className="px-5 py-4 flex-row justify-between items-center border-b border-glass-border">
  <Text className="text-white text-xl font-bold">Stratos</Text>
  <View className="flex-row items-center">
    <DocsButton />
    <UploadButton />
    <ProfileButton />
  </View>
</GlassView>
```

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

### Action Sheet (Modal)
```tsx
<Modal transparent animationType="fade">
  <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
    <LinearGradient colors={[...]} style={{ borderRadius: 20 }}>
      {/* Action items */}
    </LinearGradient>
  </Pressable>
</Modal>
```

---

## Interaction States

| State | Visual Feedback |
|-------|-----------------|
| **Hover** (Web) | Scale 1.05x, subtle shadow |
| **Press** | Opacity reduction (0.7) |
| **Selected** | Blue accent color, checkmark icon |
| **Loading** | ActivityIndicator spinner |
| **Empty** | Italic placeholder text |
| **Row Tap** | Action sheet with navigation options |

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

> **Last Updated**: February 14, 2026
