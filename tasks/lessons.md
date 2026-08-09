# Lessons Learned

> Patterns and corrections captured during development to prevent recurring mistakes.

### 1. BlurView inside Modal crashes on Android/Expo Go
**Date:** 2026-03-14  
**Pattern:** Using `expo-blur` `BlurView` directly inside a React Native `Modal` with NativeWind `className` (e.g. `className="absolute inset-0"`) crashes on Android. The `GlassView` wrapper has an Android fallback, but if you bypass it with a direct `BlurView` import, the app crashes.  
**Fix:** Use plain `View` with `backgroundColor: 'rgba(0,0,0,0.85)'` for modal backdrops. Only use `BlurView` through the `GlassView` wrapper, and never inside `Modal` on Android.  
**Root effect:** Since `AuthContext` stores `isAuthenticated` in `useState` (no persistence), any unhandled JS crash resets the entire component tree, sending the user back to the login screen.

### 25. **Auth state must be persisted** — React `useState` resets on every hot-reload, fast-refresh, or JS bundle crash. Always use `AsyncStorage` (or `expo-secure-store`) for auth tokens/session. Without persistence, any reload sends the user back to login.

6. **Native Picker layout on mobile** — Never use `position: absolute, width: 100%, height: 100%` on a native `<Picker>` inside a dynamically-sized parent. It creates Yoga layout loops on Android. Use `pickerRef.focus()` to open the picker programmatically instead of overlaying it.

7. **Horizontal ScrollView blocks pull-to-refresh** — A horizontal `<ScrollView>` at the top of the screen intercepts vertical swipe gestures on mobile, preventing `RefreshControl` from firing. Use `flexWrap` layout instead, or place the horizontal scroll inside the main vertical ScrollView.

### 2. SafeAreaProvider is mandatory for react-native-safe-area-context
**Date:** 2026-03-14  
**Pattern:** Using `SafeAreaView` from `react-native-safe-area-context` without wrapping the app root in `SafeAreaProvider` causes unpredictable behavior and crashes on native. The `SafeAreaView` deprecation warning itself comes from React Navigation / `@react-navigation/elements` internals (not our code), but without the provider, the context resolution fails and can crash.  
**Fix:** Always wrap the outermost layout in `<SafeAreaProvider>` from `react-native-safe-area-context`.
### 8. Stale Google Drive Files (DocumentPicker Cache)
**Date:** 2026-03-14  
**Pattern:** When using `expo-document-picker` with `copyToCacheDirectory: true`, picking the same file from Google Drive (or other cloud providers via the native OS picker) can return a stale, locally cached copy instead of fetching the fresh cloud version.  
**Fix:** Always force-refresh on the file-picker screen by aggressively clearing the entire `DocumentPicker` cache directory (`FileSystem.deleteAsync(FileSystem.cacheDirectory + 'DocumentPicker')`) unconditionally right before opening the picker.
