import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

interface DailyWin {
  id: string;
  emoji: string;
  title: string;
  icon?: string;
}

interface WinCategory {
  name: string;
  percentage: number;
  color: string;
  emoji: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(15);
  const currentMonth = "December 2024";

  const dailyWins: DailyWin[] = [
    { id: "1", emoji: "😊", title: "Gratitude" },
    { id: "2", emoji: "💗", title: "Morning ex..." },
    { id: "3", emoji: "📚", title: "Read book" },
  ];

  const winCategories: WinCategory[] = [
    { name: "Mental", percentage: 35, color: "bg-blue-400", emoji: "🧠" },
    { name: "Physical", percentage: 40, color: "bg-green-400", emoji: "💪" },
    { name: "Spiritual", percentage: 25, color: "bg-orange-400", emoji: "✨" },
  ];

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const totalWins = 24;

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Enhanced Greeting Header */}
      <View className="px-6 pt-8 pb-6">
        <View className="bg-gradient-to-b from-blue-50 via-blue-50 to-green-50 rounded-3xl p-8 items-center border border-blue-100">
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-3xl">👋</Text>
            <Text className="text-3xl font-bold text-gray-800">Hello</Text>
          </View>
          <Text className="text-2xl font-bold text-blue-600 mb-1">Nice to Meet You!</Text>
          <Text className="text-sm text-gray-600 mb-4">Today is a great day to grow</Text>
          <View className="flex-row justify-center gap-6">
            <Text className="text-5xl">🦕</Text>
            <Text className="text-5xl">🦖</Text>
          </View>
          <View className="flex-row gap-4 mt-6 w-full">
            <View className="flex-1 bg-white rounded-2xl py-3 px-4 items-center shadow-sm">
              <Text className="text-2xl font-bold text-blue-600">24</Text>
              <Text className="text-xs text-gray-600 font-medium">Wins</Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl py-3 px-4 items-center shadow-sm">
              <View className="flex-row items-center gap-1">
                <Text className="text-lg">🔥</Text>
                <Text className="text-2xl font-bold text-orange-500">7</Text>
              </View>
              <Text className="text-xs text-gray-600 font-medium">Day Streak</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Calendar */}
      <View className="px-6 mb-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity>
              <Ionicons name="chevron-back" size={24} color="#3b82f6" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-700">{currentMonth}</Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          {/* Day headers */}
          <View className="flex-row justify-between mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Text key={day} className="text-xs font-semibold text-gray-500 w-10 text-center">
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View className="flex-row flex-wrap justify-between">
            {daysInMonth.map((day) => (
              <TouchableOpacity
                key={day}
                onPress={() => setSelectedDate(day)}
                className={`w-10 h-10 items-center justify-center rounded-lg mb-2 ${
                  selectedDate === day
                    ? "bg-blue-500"
                    : "bg-white"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selectedDate === day ? "text-white" : "text-gray-700"
                  }`}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Life Moments & Daily Wins Row */}
      <View className="px-6 flex-row gap-4 mb-6">
        {/* Life Moments */}
        <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-800">Life</Text>
            <TouchableOpacity className="p-1">
              <Ionicons name="search" size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          <Text className="text-lg font-bold text-gray-800">Moments</Text>
          <Text className="text-xs text-gray-500 mt-3 leading-relaxed">
            Capture small moments of joy
          </Text>
        </View>

        {/* Daily Wins */}
        <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-800 mb-4">Daily Wins</Text>
          {dailyWins.map((win) => (
            <View key={win.id} className="flex-row items-center gap-3 mb-3">
              <Text className="text-2xl">{win.emoji}</Text>
              <Text className="text-sm font-medium text-gray-700">{win.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Enhanced Win Tracker */}
      <View className="px-6 mb-6">
        <View className="bg-gradient-to-b from-slate-50 to-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-lg font-bold text-gray-800">Win Tracker</Text>
            <View className="bg-blue-100 rounded-full px-3 py-1">
              <Text className="text-xs font-semibold text-blue-600">{totalWins} Total</Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-6">
            {/* Donut Chart */}
            <View className="w-32 h-32 relative items-center justify-center">
              <View className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-orange-400 items-center justify-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                }}
              >
                <View className="w-20 h-20 rounded-full bg-white items-center justify-center">
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-gray-800">{totalWins}</Text>
                    <Text className="text-xs text-gray-600 font-medium">wins</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View className="flex-1 ml-6 gap-3">
              {winCategories.map((category) => (
                <View key={category.name}>
                  <View className="flex-row items-center justify-between mb-1">
                    <View className="flex-row items-center gap-2 flex-1">
                      <Text className="text-lg">{category.emoji}</Text>
                      <Text className="text-sm font-semibold text-gray-700">{category.name}</Text>
                    </View>
                    <Text className="text-sm font-bold text-gray-800">{category.percentage}%</Text>
                  </View>
                  <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className={`h-full ${category.color}`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Enhanced Goal Path */}
      <View className="px-6 mb-20">
        <View className="bg-gradient-to-b from-slate-50 to-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between mb-8">
            <Text className="text-lg font-bold text-gray-800">Goal Path</Text>
            <View className="bg-green-100 rounded-full px-3 py-1">
              <Text className="text-xs font-semibold text-green-600">3/5 Complete</Text>
            </View>
          </View>

          {/* Progress Line */}
          <View className="flex-row items-center justify-between relative mb-8">
            {/* Connecting Line */}
            <View className="absolute h-1 bg-gradient-to-r from-green-400 via-green-400 to-gray-200 top-6 left-6 right-6 -z-10" />

            {/* Milestone Steps */}
            {[0, 1, 2, 3, 4].map((index) => (
              <View key={index} className="items-center">
                <View
                  className={`w-14 h-14 rounded-full items-center justify-center mb-3 border-4 ${
                    index < 3
                      ? "bg-green-400 border-green-400 shadow-md"
                      : index === 3
                        ? "bg-blue-100 border-blue-300"
                        : "bg-gray-100 border-gray-200"
                  }`}
                  style={{
                    shadowColor: index < 3 ? "#22c55e" : "transparent",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                  }}
                >
                  {index < 3 ? (
                    <Text className="text-2xl">✓</Text>
                  ) : index === 3 ? (
                    <Ionicons name="checkmark" size={24} color="#3b82f6" />
                  ) : (
                    <Text className="text-lg text-gray-400">→</Text>
                  )}
                </View>
                <Text className={`text-xs font-semibold text-center w-12 ${
                  index < 3 ? "text-green-600" : index === 3 ? "text-blue-600" : "text-gray-500"
                }`}>
                  Week {index + 1}
                </Text>
              </View>
            ))}
          </View>

          {/* Progress Info */}
          <View className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-lg">🎯</Text>
              <Text className="text-sm font-semibold text-blue-900">Keep Up the Momentum!</Text>
            </View>
            <Text className="text-xs text-blue-700">You're on track! Just 2 more weeks to complete your goal.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Greeting Header */}
      <View className="px-6 pt-8 pb-6">
        <View className="bg-gradient-to-b from-blue-50 to-green-50 rounded-2xl p-6 items-center">
          <Text className="text-2xl font-bold text-gray-800">Hello</Text>
          <Text className="text-xl font-semibold text-blue-600 mt-1">Nice to Meet You!</Text>
          <View className="flex-row justify-center mt-4 gap-8">
            <Text className="text-4xl">🦕</Text>
            <Text className="text-4xl">🦖</Text>
          </View>
        </View>
      </View>

      {/* Calendar */}
      <View className="px-6 mb-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity>
              <Ionicons name="chevron-back" size={24} color="#3b82f6" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-700">{currentMonth}</Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          {/* Day headers */}
          <View className="flex-row justify-between mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Text key={day} className="text-xs font-semibold text-gray-500 w-10 text-center">
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View className="flex-row flex-wrap justify-between">
            {daysInMonth.map((day) => (
              <TouchableOpacity
                key={day}
                onPress={() => setSelectedDate(day)}
                className={`w-10 h-10 items-center justify-center rounded-lg mb-2 ${
                  selectedDate === day
                    ? "bg-blue-500"
                    : "bg-white"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selectedDate === day ? "text-white" : "text-gray-700"
                  }`}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Life Moments & Daily Wins Row */}
      <View className="px-6 flex-row gap-4 mb-6">
        {/* Life Moments */}
        <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-800">Life</Text>
            <TouchableOpacity className="p-1">
              <Ionicons name="search" size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          <Text className="text-lg font-bold text-gray-800">Moments</Text>
          <Text className="text-xs text-gray-500 mt-3 leading-relaxed">
            Capture small moments of joy
          </Text>
        </View>

        {/* Daily Wins */}
        <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-800 mb-4">Daily Wins</Text>
          {dailyWins.map((win) => (
            <View key={win.id} className="flex-row items-center gap-3 mb-3">
              <Text className="text-2xl">{win.emoji}</Text>
              <Text className="text-sm font-medium text-gray-700">{win.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Win Tracker */}
      <View className="px-6 mb-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-800 mb-4">Win Tracker</Text>
          <View className="flex-row items-center justify-center">
            <View className="w-40 h-40 relative items-center justify-center">
              {/* Simple pie chart representation */}
              <View className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-300 via-green-300 to-orange-300 items-center justify-center opacity-80">
                <View className="w-24 h-24 rounded-full bg-white"></View>
              </View>
            </View>
          </View>
          <View className="mt-4 gap-2">
            <View className="flex-row items-center gap-2">
              <View className="w-3 h-3 rounded-full bg-blue-400"></View>
              <Text className="text-sm text-gray-700">Mental</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-3 h-3 rounded-full bg-green-400"></View>
              <Text className="text-sm text-gray-700">Physical</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-3 h-3 rounded-full bg-orange-300"></View>
              <Text className="text-sm text-gray-700">Spiritual</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Goal Path */}
      <View className="px-6 mb-20">
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-800 mb-6">Goal Path</Text>
          <View className="flex-row items-center justify-between">
            {[0, 1, 2, 3, 4].map((index) => (
              <View key={index} className="items-center">
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${
                    index < 3
                      ? "bg-green-400"
                      : index === 3
                        ? "bg-blue-200"
                        : "bg-gray-200"
                  }`}
                >
                  {index < 3 && <Text className="text-lg">✓</Text>}
                </View>
                {index === 4 && <Text className="text-xs text-gray-500 mt-1 text-center">Soon</Text>}
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
