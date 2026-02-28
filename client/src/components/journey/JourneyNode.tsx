import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";

type JourneyNodeProps = {
  id: string;
  title: string;
  top: number;
  left: number;
  onPress?: (id: string) => void;
};

export const JourneyNode: React.FC<JourneyNodeProps> = ({
  id,
  title,
  top,
  left,
  onPress,
}) => {
  return (
    <Pressable
      onPress={() => onPress?.(id)}
      style={[
        styles.node,
        {
          top,
          left,
        },
      ]}
    >
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
    </Pressable>
  );
};

const NODE_SIZE = 100;

const styles = StyleSheet.create({
  node: {
    position: "absolute",
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});