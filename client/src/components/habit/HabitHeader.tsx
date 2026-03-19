import { View, Text, Pressable } from "react-native";
import type { Category } from "../../features/habit/habit.types";

const tabs: Category[] = ["spiritual", "mental", "physical"];

export default function HabitHeader({ active, onChange }: { active: Category; onChange: (c: Category) => void }) {
  return (
    <View className="pt-4 pb-4 px-4">
      <View className="bg-[#8C7F6A] rounded-[20px] px-5 py-5 mb-4">
        <Text className="text-white text-[26px] font-bold">Habit Tracker</Text>
        <Text className="text-[#F6F1E7] text-[14px] mt-1">Build momentum one day at a time</Text>
      </View>

      <View className="bg-white rounded-[18px] p-2 border border-[#E5DFD3]">
        <View className="flex-row gap-2">
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => onChange(tab)}
            className={`flex-1 py-2.5 rounded-[14px] border ${
              active === tab ? "bg-[#B5A993] border-[#B5A993]" : "bg-white border-transparent"
            }`}
          >
            <Text className={`capitalize text-center text-[13px] font-semibold ${active === tab ? "text-white" : "text-[#6B645C]"}`}>
              {tab}
            </Text>
          </Pressable>
        ))}
        </View>
      </View>
    </View>
  );
}