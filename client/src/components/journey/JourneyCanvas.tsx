import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

type JourneyCanvasProps = {
  children: React.ReactNode;
  contentHeight: number;
};

export const JourneyCanvas: React.FC<JourneyCanvasProps> = ({
  children,
  contentHeight,
}) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { height: contentHeight },
      ]}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={styles.inner}>
        {children}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    width: SCREEN_WIDTH,
  },
  inner: {
    flex: 1,
    position: "relative", // IMPORTANT: enables absolute positioning
  },
});