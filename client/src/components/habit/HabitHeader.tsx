import { View, Text, Pressable } from "react-native";
import type { Category } from "../../features/habit/habit.types";

const tabs: Category[] = ["spiritual", "mental", "physical"];

export default function HabitHeader({ active, onChange }: { active: Category; onChange: (c: Category) => void }) {
  return (
    <View className="items-center py-8">
      <View className="bg-[#2E2A26] px-12 py-3 rounded-full mb-10 shadow-lg">
        <Text className="text-white font-black text-lg tracking-widest uppercase">Mineo Tracker</Text>
      </View>

      <View className="flex-row gap-4">
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => onChange(tab)}
            className={`px-5 py-2.5 rounded-full border-2 transition-all ${
              active === tab ? "bg-[#2E2A26] border-[#2E2A26]" : "bg-transparent border-[#2E2A26]/20"
            }`}
          >
            <Text className={`capitalize font-bold text-xs ${active === tab ? "text-white" : "text-[#2E2A26]"}`}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}