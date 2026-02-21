import { View, Text, Pressable } from "react-native";
import { colors } from "../../constants/colors";

export default function HabitStatusCard({
  title,
  onSelect,
}: {
  title: string;
  onSelect: (value: number) => void;
}) {
  const options = [
    { label: "Good", value: 1, color: colors.good },
    { label: "Average", value: 0.5, color: colors.average },
    { label: "Bad", value: 0, color: colors.bad },
  ];

  return (
    <View className="bg-white rounded-2xl p-4">
      <Text className="font-semibold mb-3">{title.charAt(0).toUpperCase() + title.slice(1)}</Text>

      <View className="flex-row justify-between">
        {options.map((s) => (
          <Pressable
            key={s.label}
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: s.color }}
            onPress={() => onSelect(s.value)}
          >
            <Text className="text-white text-xs">{s.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
