import { View, Text, Pressable } from "react-native";
import { colors } from "../../constants/colors";

const tabs: Category[] = ["spiritual", "mental", "physical"];

export default function HabitHeader({ active, onChange }: { active: Category; onChange: (c: Category) => void }) {
  return (
    <View className="px-4 pt-12">
      <View className="self-start bg-white px-5 py-2 rounded-full mb-4">
        <Text className="font-semibold text-base">Habit Tracker</Text>
      </View>

      <View className="flex-row space-x-3">
        {categories.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => onChange(cat)}
            className="px-4 py-2 rounded-full"
            style={{ backgroundColor: active === cat ? colors.textDark : colors.cream }}
          >
            <Text style={{ color: active === cat ? "#fff" : colors.textMuted }}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
