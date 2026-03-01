import React from "react";
import { StyleSheet, Pressable, View } from "react-native";

type JourneyNodeProps = {
  stage: number; // Keep stage ID for logic/onPress
  status: "locked" | "current" | "completed";
  position: { x: number; y: number };
  onPress?: () => void;
};

export const JourneyNode: React.FC<JourneyNodeProps> = ({
  position,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.nodeContainer,
        {
          top: position.y,
          left: position.x,
        },
      ]}
    >
      {/* The Image Frame seen in the design */}
      <View style={styles.imageFrame}>
        {/* Placeholder View: This is where the Image will go after backend connection */}
        <View style={styles.placeholderFill} />
      </View>
    </Pressable>
  );
};

// Based on the provided design: smaller nodes for better utilization
const NODE_SIZE = 70;

const styles = StyleSheet.create({
  nodeContainer: {
    position: "absolute",
    // Ensures the node is centered on the SVG path coordinates
    transform: [{ translateX: -NODE_SIZE / 4 }, { translateY: -NODE_SIZE / 4 }],
    zIndex: 10,
  },
  imageFrame: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: 18, // Highly rounded corners as per design
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#444", // Dark border seen in image_66beb2.png
    overflow: "hidden",
    // Shadow for the "Polaroid/Card" depth
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  placeholderFill: {
    flex: 1,
    backgroundColor: "#E5E7EB", // Grey placeholder for now
  },
});