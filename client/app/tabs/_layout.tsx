import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: "Roboto_500Medium",
          fontSize: 12,
        },
        tabBarStyle: {
          backgroundColor: "#0f0f0f",
          borderTopColor: "#1f1f1f",
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#666666",
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
            <Ionicons name="repeat-outline" size={size} color={color} />
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
    </Tabs>
  );
}
