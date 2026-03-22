import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../../src/design-system";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();

  const sharedTabBarStyle = {
    position: "absolute" as const,
    left: 0,
    right: 0,
    bottom: Math.max(insets.bottom, 10),
    height: 58 + Math.max(insets.bottom, 6),
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    paddingTop: 8,
    paddingBottom: Math.max(insets.bottom, 8),
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 8,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: theme.colors.background,
        },
        tabBarHideOnKeyboard: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: "Roboto_500Medium",
          fontSize: 11,
          letterSpacing: 0.2,
          marginTop: 2,
        },
        tabBarStyle: sharedTabBarStyle,
        tabBarItemStyle: {
          borderRadius: 12,
          marginHorizontal: 2,
        },
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="journal"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="journey"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="goal"
        options={{
          popToTopOnBlur: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flag-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="habit"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Hide goals.tsx from tab bar - accessible via navigation only */}
      <Tabs.Screen
        name="goals"
        options={{
          href: null,
        }}
      />

      {/* Hide home-backup.tsx from tab bar */}
      <Tabs.Screen
        name="home-backup"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
