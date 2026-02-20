# Implementation Plan

> For a high-level overview of the app (tech stack, screens, project structure), see [Project_Overview.md](./Project_Overview.md).

---

## Dependencies

### Core
```json
{
  "expo": "~54.0.33",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo-router": "~6.0.23"
}
```

### UI Components
```json
{
  "nativewind": "^4.2.1",
  "expo-blur": "~15.0.8",
  "expo-linear-gradient": "~15.0.8",
  "@react-native-picker/picker": "^2.11.4"
}
```

### Data & File Handling
```json
{
  "papaparse": "^5.5.3",
  "expo-document-picker": "^14.0.8",
  "expo-file-system": "^19.0.21"
}
```

### Web Support
```json
{
  "react-dom": "19.1.0",
  "react-native-web": "~0.21.0"
}
```

---

## How to Run

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go app (iOS/Android) for mobile testing

### Installation
```bash
git clone <repository-url>
cd assortment-plan-app

npm install

npx expo start
```

### Running on Different Platforms

| Platform | Command |
|----------|---------|
| **iOS** | Scan QR code with Expo Go app |
| **Android** | Scan QR code with Expo Go app |
| **Web** | Press `w` in terminal or visit `localhost:8081` |

---

## Design Patterns

### Ghost Picker
Custom filter component that overlays an invisible native `Picker` on top of a styled `View`, achieving:
- 100% Custom UI (Tailwind styling)
- 100% Native Behavior (System picker/dialog)

### Multi-File Upload
`UploadButton` supports selecting multiple CSV files. `DataContext.handleMultiUpload` auto-detects file type by header:
- `Planner Name` header → Planner Progress data
- Any other → Item/Assortment data

### Cross-Page Filter Context
`FilterContext` stores `selectedClass`, `selectedCountry`, `selectedSeason` globally. Home sets these when navigating from a planner row; Dashboard and Items consume them.

### Dynamic Filter Options
All filter dropdowns derive their options from the actual data via `useMemo`, ensuring filters always reflect the uploaded dataset.

---

> **Last Updated**: February 20, 2026
