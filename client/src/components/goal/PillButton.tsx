import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
};

export default function PillButton({ icon, label, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
      <Ionicons name={icon} size={22} color="#111" style={styles.icon} />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 62,
    borderRadius: 20,
    backgroundColor: "#CFCFCF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginTop: 18,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  pressed: { opacity: 0.88 },
  icon: { marginRight: 12, marginTop: 1 },
  text: { 
    fontSize: 18, 
    color: "#111", 
    fontWeight: "500", 
    fontFamily: "Georgia",
    letterSpacing: 0.2 
  },
});
