import { View, Text } from "react-native";
import { RadarChart } from "react-native-gifted-charts";

export default function HabitRadarChart({
  values,
}: {
  values: number[];
}) {
  const [spiritual, mental, physical] = values;

  return (
    <View className="mx-4 mt-6 mb-4">
      <View className="bg-white rounded-[28px] p-6 shadow-sm border border-black/5 items-center">
        <View className="bg-[#2E2A26] px-4 py-1.5 rounded-full mb-6">
          <Text className="text-white text-xs font-black uppercase tracking-wider">
            Weekly Growth Tracker
          </Text>
        </View>

        {/* Radar Chart */}
        <View className="items-center mb-6">
          <RadarChart
            data={values}
            maxValue={100}
          />
        </View>

        {/* Legend with percentages */}
        <View className="flex-row justify-around w-full px-4">
          <View className="items-center">
            <View className="w-3 h-3 rounded-full bg-[#9C88FF] mb-1" />
            <Text className="text-[9px] font-bold text-gray-600 uppercase">Spiritual</Text>
            <Text className="text-xs font-black text-[#2E2A26] mt-0.5">{spiritual}%</Text>
          </View>
          <View className="items-center">
            <View className="w-3 h-3 rounded-full bg-[#4B56FF] mb-1" />
            <Text className="text-[9px] font-bold text-gray-600 uppercase">Mental</Text>
            <Text className="text-xs font-black text-[#2E2A26] mt-0.5">{mental}%</Text>
          </View>
          <View className="items-center">
            <View className="w-3 h-3 rounded-full bg-[#FF8A65] mb-1" />
            <Text className="text-[9px] font-bold text-gray-600 uppercase">Physical</Text>
            <Text className="text-xs font-black text-[#2E2A26] mt-0.5">{physical}%</Text>
          </View>
        </View>

        {/* Info text */}
        <Text className="text-[8px] text-gray-500 mt-4 text-center italic">
          Based on 7-day average • Green: 1pt • Blue: 0.5pt
        </Text>
      </View>
    </View>
  );
}