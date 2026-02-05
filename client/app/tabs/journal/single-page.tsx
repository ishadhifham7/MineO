import { View, StyleSheet } from "react-native";
import { Canvas } from "../../../src/components/journal/Canvas";

export default function JournalEntryScreen() {
  return (
    <View style={styles.container}>
      <Canvas />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
