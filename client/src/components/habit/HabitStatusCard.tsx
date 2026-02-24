import { View, Text, Pressable } from "react-native";

export default function HabitStatusCard({ title, onSelect }: { title: string; onSelect: (value: number) => void }) {
  const options = [
    { label: "Good", val: 1, color: "bg-[#87FF65]", textColor: "text-green-800" },
    { label: "Average", val: 0.5, color: "bg-[#4B56FF]", textColor: "text-blue-800" },
    { label: "Bad", val: 0, color: "bg-[#FF3B30]", textColor: "text-red-800" },
  ];

  return (
    <View className="bg-white rounded-[35px] p-2 shadow-sm border border-black/5">
      <Text className="font-black text-center text-base mb-2 uppercase tracking-tight text-[#2E2A26]">{title}</Text>
      <View className="flex-row justify-around px-1">
        {options.map((opt) => (
          <Pressable key={opt.label} onPress={() => onSelect(opt.val)} className="items-center active:opacity-50">
            <View className={`w-11 h-11 rounded-full ${opt.color} border-2 border-black/10 mb-1 shadow-inner`} />
            <Text className={`text-[9px] font-black uppercase italic ${opt.textColor}`}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}