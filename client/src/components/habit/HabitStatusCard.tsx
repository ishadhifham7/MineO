import { View, Text, Pressable } from "react-native";

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
    <View className="bg-white rounded-[16px] p-4 border border-black/5" style={{shadowColor: "#000", shadowOffset: {width: 0, height: 7}, shadowOpacity: 0.1, shadowRadius: 14, elevation: 5}}>
      <Text className="font-black text-center text-base mb-2 uppercase tracking-tight text-[#2E2A26]">{title}</Text>
      <View className="flex-row justify-around px-2">
        {options.map((opt) => {
          const isSelected = selectedValue === opt.val;
          return (
            <Pressable 
              key={opt.label} 
              onPress={() => onSelect(opt.val)} 
              className="items-center active:opacity-70 px-3 py-1"
            >
              <View className={`w-12 h-12 rounded-full ${opt.color} border-2 ${isSelected ? 'border-black' : 'border-black/10'} mb-1 shadow-inner`} style={{ opacity: isSelected ? 1 : 0.5 }} />
              <Text className={`text-[9px] font-black uppercase italic ${opt.textColor}`} style={{ opacity: isSelected ? 1 : 0.6 }}>{opt.label}</Text>
              {isSelected && <Text className="text-[8px] mt-0.5">✓</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}