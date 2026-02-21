import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
const LinearGradient = ExpoLinearGradient as unknown as React.ComponentType<any>;

type Props = { size?: number };

export default function GradientSparkle({ size = 54 }: Props) {
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <LinearGradient
        colors={["#7C4DFF", "#3B82F6", "#22C55E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.star, { width: size, height: size }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  star: {
    transform: [{ rotate: "45deg" }],
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
  },
});
