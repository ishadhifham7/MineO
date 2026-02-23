import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  followers: number;
  following: number;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
};

function Stat({ value, label, onPress }: { value: number; label: string; onPress?: () => void }) {
  return (
    <Pressable style={styles.stat} onPress={onPress}>
      <Text style={styles.value}>{value.toLocaleString()}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

export function SocialStatsRow({ followers, following, onFollowersPress, onFollowingPress }: Props) {
  return (
    <View style={styles.wrap}>
      <Stat value={followers} label="FOLLOWERS" onPress={onFollowersPress} />
      <View style={styles.divider} />
      <Stat value={following} label="FOLLOWING" onPress={onFollowingPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 1,
  },
  stat: { flex: 1, alignItems: "center" },
  value: { fontSize: 20, fontWeight: "800", color: "#111" },
  label: { fontSize: 11, fontWeight: "700", color: "#9ca3af", marginTop: 4, letterSpacing: 0.6 },
  divider: { width: StyleSheet.hairlineWidth, height: 42, backgroundColor: "rgba(0,0,0,0.10)" },
});