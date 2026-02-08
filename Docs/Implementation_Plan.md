# Implementation Plan

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React Native (Expo SDK 52) |
| **Routing** | Expo Router (File-based) |
| **Styling** | NativeWind (Tailwind CSS for RN) |
| **State Management** | React Context API |
| **CSV Parsing** | PapaParse |
| **Icons** | @expo/vector-icons (Ionicons) |

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
│   │   ├── index.tsx      # Dashboard
│   │   └── items.tsx      # Item Explorer
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Core UI (GlassView, GradientCard)
│   ├── FilterBar.tsx     # Ghost Picker filters
│   ├── ItemCard.tsx      # Item grid cards
│   └── ...
├── context/              # React Context providers
│   └── DataContext.tsx   # Shared data state
├── services/             # Data services
│   └── dataService.ts    # CSV parsing & types
├── Docs/                 # Project documentation
└── assets/               # Images & fonts
```

---

## How to Run

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go app (iOS/Android) for mobile testing

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd assortment-plan-app

# Install dependencies
npm install

# Start development server
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

### Shared Data Context
CSV data is uploaded once and shared across all screens via `DataContext`, enabling:
- Single source of truth
- Consistent filtering across Dashboard and Items

---

> **Author**: AI Assistant  
> **Last Updated**: February 8, 2026
