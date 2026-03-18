import "../src/styles/global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../src/providers/AuthProvider";
import { JourneyProvider } from "../src/providers/JourneyProvider";
import { GoalProvider } from "../src/features/goal/goal.context";
import { ProfileProvider } from "../src/providers/ProfileProvider";
import { useFonts } from "expo-font";
import {
  DancingScript_400Regular,
  DancingScript_700Bold,
} from "@expo-google-fonts/dancing-script";
import {
  Roboto_400Regular,
  Roboto_500Medium,
} from "@expo-google-fonts/roboto";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DancingScript_400Regular,
    DancingScript_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F6FA" }} edges={["top", "left", "right"]}>
          <AuthProvider>
            <JourneyProvider>
              <ProfileProvider>
                <GoalProvider>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      animation: "fade_from_bottom",
                      gestureEnabled: true,
                      contentStyle: {
                        backgroundColor: "#F4F6FA",
                      },
                    }}
                  />
                </GoalProvider>
              </ProfileProvider>
            </JourneyProvider>
          </AuthProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
