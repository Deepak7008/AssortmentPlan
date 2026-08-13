import { useEffect, useState, useCallback } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from "@expo-google-fonts/inter";
import { Fraunces_400Regular, Fraunces_600SemiBold, Fraunces_700Bold } from "@expo-google-fonts/fraunces";
import { DataProvider } from "../context/DataContext";
import { FilterProvider } from "../context/FilterContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import LoginScreen from "./login";
import "../global.css";

// Keep the splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

// Suppress the deprecation warning from React Navigation internals
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
  'Deprecated: SafeAreaView',
]);

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isDark, colors } = useTheme();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading before marking ready
    if (!isLoading) {
      setAppReady(true);
    }
  }, [isLoading]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      // Hide splash screen once the root view has performed layout
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <View className={isDark ? 'dark flex-1' : 'flex-1'} onLayout={onLayoutRootView}>
        <LoginScreen />
      </View>
    );
  }

  return (
    <DataProvider>
      <FilterProvider>
        <View className={isDark ? 'dark flex-1 bg-stone-950' : 'flex-1 bg-stone-50'} onLayout={onLayoutRootView}>
          <StatusBar style={isDark ? "light" : "dark"} />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.headerBg,
              },
              headerTintColor: colors.headerTint,
              headerTitleStyle: {
                fontFamily: "Inter_700Bold",
              },
              contentStyle: {
                backgroundColor: colors.headerBg,
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal", headerShown: false }} />
            <Stack.Screen name="about" options={{ presentation: "modal", headerShown: false }} />
          </Stack>
        </View>
      </FilterProvider>
    </DataProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Fraunces_400Regular,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
