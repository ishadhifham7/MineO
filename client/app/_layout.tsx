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
import {
  View,
  ActivityIndicator,
  useWindowDimensions,
  Text,
  TextInput,
} from "react-native";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

let globalFontApplied = false;

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 430 ? 20 : 14;

  const [fontsLoaded] = useFonts({
    DancingScript_400Regular,
    DancingScript_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  useEffect(() => {
    if (!fontsLoaded || globalFontApplied) return;

    const textDefaultStyle = (Text as any).defaultProps?.style;
    const inputDefaultStyle = (TextInput as any).defaultProps?.style;

    (Text as any).defaultProps = {
      ...((Text as any).defaultProps || {}),
      style: [textDefaultStyle, { fontFamily: "Roboto_400Regular" }],
    };

    (TextInput as any).defaultProps = {
      ...((TextInput as any).defaultProps || {}),
      style: [inputDefaultStyle, { fontFamily: "Roboto_400Regular" }],
    };

    globalFontApplied = true;
  }, [fontsLoaded]);

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
                      contentStyle: {
                        backgroundColor: "#F4F6FA",
                        paddingHorizontal: horizontalPadding,
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
