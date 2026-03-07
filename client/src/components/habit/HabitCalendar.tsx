import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/colors";

const backgrounds = {
  spiritual: ["#8B5CF6", "#6366F1"] as const,
  mental: ["#3B82F6", "#06B6D4"] as const,
  physical: ["#F59E0B", "#EF4444"] as const,
};

export default function HabitCalendar({
  category,
  data,
}: {
  category: "spiritual" | "mental" | "physical";
  data: Record<string, number | undefined>;
}) {
  return (
    <View className="px-4 mt-4">
      <LinearGradient
        colors={
          backgrounds[category as keyof typeof backgrounds] ||
          backgrounds.spiritual
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 20, padding: 16 }}
      >
        <Text className="text-white mb-3 font-semibold">February 2026</Text>

        <View className="flex-row flex-wrap gap-3">
          {Object.entries(data).map(([date, score]) => {
            let color =
              score === 1
                ? colors.good
                : score === 0.5
                  ? colors.average
                  : colors.bad;

            return (
              <View
                key={date}
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: color }}
              >
                <Text className="text-white text-xs">{date.split("-")[2]}</Text>
              </View>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
}