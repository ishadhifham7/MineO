import React from "react";
import { View, Text } from "react-native";
import { JourneyCanvas } from "../../src/components/journey/JourneyCanvas";

export default function JourneyScreen() {
  return (
    <View style={{ flex: 1 }}>
      <JourneyCanvas contentHeight={1500}>
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          Journey Timeline (Canvas Step)
        </Text>
      </JourneyCanvas>
    </View>
  );
}