import { View, Text, Pressable } from "react-native";
import { colors } from "../../constants/colors";

export default function HabitStatusCard({ 
  title, 
  onSelect, 
  selectedValue 
}: { 
  title: string; 
  onSelect: (value: number) => void;
  selectedValue?: number;
}) {
  const options = [
    { label: "Good", val: 1, color: "bg-[#87FF65]", textColor: "text-green-800" },
    { label: "Average", val: 0.5, color: "bg-[#4B56FF]", textColor: "text-blue-800" },
    { label: "Bad", val: 0, color: "bg-[#FF3B30]", textColor: "text-red-800" },
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
