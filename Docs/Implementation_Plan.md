# Implementation Plan

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React Native (Expo SDK 52) |
| **Routing** | Expo Router (File-based) |
| **Styling** | NativeWind (Tailwind CSS for RN) |
| **State Management** | React Context API (DataContext, FilterContext, AuthContext) |
| **CSV Parsing** | Custom parser (dataService.ts, plannerService.ts) |
| **Icons** | @expo/vector-icons (Ionicons) |
| **File Picker** | expo-document-picker |

---

## Dependencies

### Core
```json
{
  "expo": "~52.0.0",
  "react": "18.3.1",
  "react-native": "0.76.6",
  "expo-router": "~4.0.0"
}
```

### UI Components
```json
{
  "nativewind": "^4.1.23",
  "expo-blur": "~14.0.0",
  "expo-linear-gradient": "~14.0.0",
  "@react-native-picker/picker": "^2.10.2"
}
```

### Data & File Handling
```json
{
  "expo-document-picker": "~13.0.0",
  "expo-file-system": "~18.0.0"
}
```

### Web Support
```json
{
  "react-dom": "18.3.1",
  "react-native-web": "~0.19.13"
}
```

---

## Project Structure

```
assortment-plan-app/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── _layout.tsx    # Tab navigator config
│   │   ├── home.tsx       # Home (Planner Progress)
│   │   ├── index.tsx      # Dashboard
│   │   └── items.tsx      # Item Explorer
│   ├── _layout.tsx        # Root layout (providers)
│   └── login.tsx          # Login screen
├── components/            # Reusable UI components
│   ├── ui/               # Core UI (GlassView, GradientCard)
│   ├── FilterBar.tsx     # Ghost Picker filters
│   ├── ItemCard.tsx      # Item grid cards
│   ├── PlannerProgressTable.tsx  # Planner rows with milestones
│   ├── UploadButton.tsx  # Multi-file CSV upload
│   ├── DocsButton.tsx    # Documentation link
│   └── ProfileButton.tsx # User profile / logout
├── context/              # React Context providers
│   ├── AuthContext.tsx   # Authentication state
│   ├── DataContext.tsx   # Shared data (items + planners)
│   └── FilterContext.tsx # Cross-page filter sync
├── services/             # Data services
│   ├── dataService.ts    # Item CSV parsing & types
│   └── plannerService.ts # Planner CSV parsing & types
├── Docs/                 # Project documentation
└── assets/               # Images, CSVs & fonts
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

> **Author**: AI Assistant
> **Last Updated**: February 14, 2026
