import { View, Text } from "react-native";
import { RadarChart } from "react-native-gifted-charts";
import { RadarData } from "../../features/habit/habit.types";

export default function HabitRadarChart({ data }: { data: RadarData }) {
  return (
    <View className="mt-10 items-center">
      <Text className="font-semibold mb-4">Habit Tracker Spider Graph</Text>
      <RadarChart
        data={data.values}
        labels={data.labels}
        maxValue={100}
      />
    </View>
  );
}
