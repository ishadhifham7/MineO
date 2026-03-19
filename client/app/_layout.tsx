import "../src/styles/global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../src/providers/AuthProvider";
import { JourneyProvider } from "../src/providers/JourneyProvider";
import { GoalProvider } from "../src/features/goal/goal.context";
import { ProfileProvider } from "../src/providers/ProfileProvider";
import { AppThemeProvider, useAppTheme } from "../src/design-system";
import { useFonts } from "expo-font";
import {
  DancingScript_400Regular,
  DancingScript_700Bold,
} from "@expo-google-fonts/dancing-script";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { View, ActivityIndicator, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function AppShell({ horizontalPadding }: { horizontalPadding: number }) {
  const { theme } = useAppTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["top", "left", "right"]}
    >
      <AuthProvider>
        <JourneyProvider>
          <ProfileProvider>
            <GoalProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: theme.colors.background,
                    paddingHorizontal: horizontalPadding,
                  },
                }}
              />
            </GoalProvider>
          </ProfileProvider>
        </JourneyProvider>
      </AuthProvider>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 430 ? 20 : 14;

  const [fontsLoaded] = useFonts({
    DancingScript_400Regular,
    DancingScript_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
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
        <AppThemeProvider>
          <AppShell horizontalPadding={horizontalPadding} />
        </AppThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
