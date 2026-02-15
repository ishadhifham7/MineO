import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface Moment {
  id: string;
  title: string;
  date: string;
  description: string;
  mood: string;
  reflection: string;
}

export default function JourneyScreen() {
  const [moments, setMoments] = useState<Moment[]>([
    {
      id: "1",
      title: "First successful workout",
      date: "Today",
      description: "Completed 30 min run",
      mood: "happy",
      reflection: "Felt great after the run!",
    },
    {
      id: "2",
      title: "Achieved goal milestone",
      date: "Yesterday",
      description: "Hit 50% on reading goal",
      mood: "excited",
      reflection: "Proud of my progress",
    },
    {
      id: "3",
      title: "Challenging day",
      date: "2 days ago",
      description: "Struggled with consistency",
      mood: "thoughtful",
      reflection: "Every day is a fresh start",
    },
  ]);

  const getMoodEmoji = (mood: string) => {
    const moodMap: { [key: string]: string } = {
      happy: "😊",
      excited: "🤩",
      thoughtful: "🤔",
      sad: "😢",
      calm: "😌",
    };
    return moodMap[mood] || "😊";
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 pt-6 pb-4">
        <Text className="text-3xl font-bold text-gray-900 mb-1">Your Journey</Text>
        <Text className="text-gray-600">Celebrate your progress</Text>
      </View>

      <View className="px-6 mb-6">
        <View className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 flex-row items-center">
          <View className="flex-1">
            <Text className="text-white text-sm font-semibold mb-1">Journey Streak</Text>
            <Text className="text-4xl font-bold text-white">42</Text>
            <Text className="text-blue-100 text-xs mt-1">days of consistency</Text>
          </View>
          <Text className="text-5xl">🔥</Text>
        </View>
      </View>

      <View className="px-6 pb-6">
        <Text className="text-sm font-semibold text-gray-700 mb-4">Recent Moments</Text>
        {moments.map((moment, index) => (
          <View key={moment.id} className="mb-4">
            {index < moments.length - 1 && (
              <View className="absolute left-6 top-16 w-0.5 h-12 bg-gradient-to-b from-blue-300 to-transparent" />
            )}
            <TouchableOpacity
              className="flex-row items-start bg-white rounded-lg p-4 shadow-sm"
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4 flex-shrink-0">
                <Text className="text-xl">{getMoodEmoji(moment.mood)}</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-lg font-bold text-gray-900 flex-1">{moment.title}</Text>
                  <Text className="text-xs text-gray-500">{moment.date}</Text>
                </View>
                <Text className="text-sm text-gray-600 mb-2">{moment.description}</Text>
                <View className="bg-gray-50 rounded p-2">
                  <Text className="text-xs text-gray-600 italic">💬 {moment.reflection}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View className="px-6 pb-6">
        <Text className="text-sm font-semibold text-gray-700 mb-3">Unlocked Milestones</Text>
        <View className="flex-row flex-wrap gap-2">
          {['🏃', '📚', '💪', '🧘', '🏆'].map((emoji, idx) => (
            <View key={idx} className="bg-white rounded-lg p-3 shadow-sm">
              <Text className="text-2xl">{emoji}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
