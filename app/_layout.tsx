import { useEffect, useState, useCallback } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { DataProvider } from "../context/DataContext";
import { FilterProvider } from "../context/FilterContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
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
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <LoginScreen />
      </View>
    );
  }

  return (
    <DataProvider>
      <FilterProvider>
        <View className="flex-1 bg-slate-950" onLayout={onLayoutRootView}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: "#020617",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              contentStyle: {
                backgroundColor: "#020617",
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal", headerShown: false }} />
            <Stack.Screen name="docs" options={{ presentation: "modal", headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
          </Stack>
        </View>
      </FilterProvider>
    </DataProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
