import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: "Roboto_500Medium",
          fontSize: 11,
          letterSpacing: 0.2,
          marginTop: 2,
        },
        tabBarStyle: {
          position: "absolute",
          left: 12,
          right: 12,
          bottom: Math.max(insets.bottom, 10),
          height: 58 + Math.max(insets.bottom, 6),
          borderTopWidth: 1,
          borderColor: Colors.border,
          borderRadius: 18,
          backgroundColor: Colors.surface,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarItemStyle: {
          borderRadius: 12,
          marginHorizontal: 2,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
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
