import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { LogBox } from 'react-native';
import { DataProvider } from "../context/DataContext";
import "../global.css";

LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
]);

export default function RootLayout() {
  return (
    <DataProvider>
      <View className="flex-1 bg-primary">
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#0f172a",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            contentStyle: {
              backgroundColor: "#0f172a",
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal", headerShown: false }} />
          <Stack.Screen name="docs" options={{ presentation: "modal", headerShown: false }} />
        </Stack>
      </View>
    </DataProvider>
  );
}
