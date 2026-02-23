import { useEffect } from "react";
import { View, Text } from "react-native";
import { useJournal } from "../../../src/features/journal/journal.context";
import { useNavigation, useLocalSearchParams } from "expo-router"; // if you want param parsing

export default function JournalScreen() {
  const params = useLocalSearchParams<{ date: string }>();
  const date = params.date;
  const { loadJournal, blocks, isLoading, title } = useJournal();

  useEffect(() => {
    if (date) {
      loadJournal(date);
    }
  }, [date]);

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>{title || "New Journal"}</Text>
      {/* Render your Canvas using blocks */}
    </View>
  );
}
