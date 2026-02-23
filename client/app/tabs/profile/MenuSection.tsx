import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function MenuSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 14, marginHorizontal: 16 },
  title: { fontSize: 12, fontWeight: "800", color: "#9ca3af", letterSpacing: 0.6, marginBottom: 10 },
  card: { backgroundColor: "#fff", borderRadius: 18, overflow: "hidden" },
});