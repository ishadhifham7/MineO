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
    { label: "Good", val: 1, color: "#4CAF50" },
    { label: "Average", val: 0.5, color: "#2196F3" },
    { label: "Bad", val: 0, color: "#E53935" },
  ];

  return (
    <View
      className="bg-white rounded-[20px] p-4 border border-[#E5DFD3]"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Text className="text-center text-[16px] mb-1 capitalize font-semibold text-[#2E2A26]">{title} Habit</Text>
      {selectedValue === undefined && (
        <Text className="text-center text-[13px] text-[#8C7F6A] mb-3">No status logged today</Text>
      )}
      <View className="flex-row justify-between gap-2">
        {options.map((opt) => {
          const isSelected = selectedValue !== undefined && selectedValue === opt.val;
          const hasValue = selectedValue !== undefined;
          return (
            <Pressable
              key={opt.label}
              onPress={() => onSelect(opt.val)}
              className="flex-1 items-center active:opacity-80 py-2 rounded-[14px] border"
              style={{
                borderColor: isSelected ? opt.color : "#E5DFD3",
                backgroundColor: isSelected ? `${opt.color}18` : "#FFFFFF",
                opacity: hasValue && !isSelected ? 0.6 : 1,
              }}
            >
              <View
                className="w-10 h-10 rounded-full mb-2"
                style={{ backgroundColor: opt.color }}
              />
              <Text
                className="text-[13px] font-semibold"
                style={{ color: isSelected ? "#2E2A26" : "#6B645C" }}
              >
                {opt.label}
              </Text>
              {isSelected && <Text className="text-[12px] text-[#2E2A26] mt-0.5">Selected</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}