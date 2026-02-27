import { Tabs, Slot, usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, View, Text, Pressable, StyleSheet } from "react-native";

// ---- Sidebar item definition ----
const NAV_ITEMS = [
  { route: "/tabs/home",    label: "Home",    icon: "home-outline"    as const },
  { route: "/tabs/journal", label: "Journal", icon: "book-outline"    as const },
  { route: "/tabs/journey", label: "Journey", icon: "map-outline"     as const },
  { route: "/tabs/goal",    label: "Goals",   icon: "flag-outline"    as const },
  { route: "/tabs/habit",   label: "Habits",  icon: "repeat-outline"  as const },
] as const;

// ---- Web Sidebar Layout ----
function WebTabsLayout() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.webRoot}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarBrand}>
          <Text style={styles.brandText}>MineO</Text>
          <Text style={styles.brandSub}>Your Growth App</Text>
        </View>
        <View style={styles.navList}>
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.route.replace("/tabs", ""));
            return (
              <Pressable
                key={item.route}
                style={[styles.navItem, active && styles.navItemActive]}
                onPress={() => router.push(item.route as any)}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={active ? "#fff" : "#94a3b8"}
                />
                <Text style={[styles.navLabel, active && styles.navLabelActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      {/* Content */}
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

// ---- Root Export ----
export default function TabsLayout() {
  if (Platform.OS === "web") {
    return <WebTabsLayout />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
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
      <Tabs.Screen name="goals" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  webRoot: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f8fafc",
  },
  sidebar: {
    width: 220,
    backgroundColor: "#0f172a",
    paddingTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sidebarBrand: {
    marginBottom: 36,
    paddingHorizontal: 8,
  },
  brandText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 1,
  },
  brandSub: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  navList: {
    gap: 6,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  navItemActive: {
    backgroundColor: "#1e40af",
  },
  navLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#94a3b8",
  },
  navLabelActive: {
    color: "#ffffff",
  },
  content: {
    flex: 1,
    overflow: "hidden" as const,
  },
});
