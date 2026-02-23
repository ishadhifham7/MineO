import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Achievement } from "../../../src/types/user";

function iconFor(type: Achievement["icon"]) {
  switch (type) {
    case "trophy":
      return "🏆";
    case "star":
      return "⭐";
    case "award":
      return "🏅";
    case "target":
      return "🎯";
  }
}

export function AchievementsRow({
  achievements,
  onViewAll,
}: {
  achievements: Achievement[];
  onViewAll?: () => void;
}) {
  return (
    <View style={styles.block}>
      <View style={styles.header}>
        <Text style={styles.title}>BADGES & ACHIEVEMENTS</Text>
        <Pressable onPress={onViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        {achievements.slice(0, 4).map((a) => (
          <View key={a.id} style={styles.badge}>
            <View style={[styles.badgeIcon, !a.earned && styles.badgeIconOff]}>
              <Text style={styles.badgeEmoji}>{iconFor(a.icon)}</Text>
            </View>
            <Text style={styles.badgeText}>{a.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginTop: 14, marginHorizontal: 16 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  title: { fontSize: 12, fontWeight: "800", color: "#9ca3af", letterSpacing: 0.6 },
  viewAll: { fontSize: 12, fontWeight: "700", color: "#2f80ed" },

  row: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  badge: { width: "24%", alignItems: "center" },
  badgeIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#fff7d6",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeIconOff: { backgroundColor: "#f1f5f9" },
  badgeEmoji: { fontSize: 18 },
  badgeText: { marginTop: 8, fontSize: 11, fontWeight: "700", color: "#6b7280", textAlign: "center" },
});