import { View, Text, ImageBackground } from "react-native";
import { colors } from "../../constants/colors";

const backgrounds = {
  spiritual: require("@/assets/calendar-spiritual.png"),
  mental: require("@/assets/calendar-mental.png"),
  physical: require("@/assets/calendar-physical.png"),
};

export default function HabitCalendar({
  category,
  data,
}: {
  category: string;
  data: Record<string, number>;
}) {
  return (
    <View className="px-4 mt-4">
      <ImageBackground
        source={backgrounds[category as keyof typeof backgrounds]}
        imageStyle={{ borderRadius: 20 }}
        className="rounded-2xl p-4"
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
      </ImageBackground>
    </View>
  );
}
