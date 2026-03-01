import "../src/styles/global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../src/providers/AuthProvider";
import { JourneyProvider } from "../src/providers/JourneyProvider";
import { GoalProvider } from "../src/features/goal/goal.context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <JourneyProvider>
            <GoalProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              />
            </GoalProvider>
          </JourneyProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
