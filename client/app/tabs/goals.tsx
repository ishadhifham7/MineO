import { View, Text } from "react-native";

export default function GoalsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">Goals Screen</Text>
      <Text className="text-gray-600 mt-2">Track your goals here</Text>
    </View>
  );
}
