import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ActivityStatus } from "../../../src/types/user";

export function ActivityStatusRow({
  status,
  onPress,
}: {
  status: ActivityStatus;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.left}>
        <View style={styles.dotRing}>
          <View style={styles.dotCenter} />
        </View>
        <Text style={styles.label}>Activity Status</Text>
      </View>

      <View style={styles.right}>
        <View style={styles.greenDot} />
        <Text style={styles.status}>{status}</Text>
        <Text style={styles.chev}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: { flexDirection: "row", alignItems: "center" },
  dotRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  dotCenter: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#111827" },
  label: { fontSize: 14, fontWeight: "700", color: "#111" },
  right: { flexDirection: "row", alignItems: "center" },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#22c55e", marginRight: 8 },
  status: { fontSize: 13, fontWeight: "700", color: "#6b7280" },
  chev: { marginLeft: 10, fontSize: 18, color: "#9ca3af" },
});