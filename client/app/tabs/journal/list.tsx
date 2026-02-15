import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface JournalEntry {
  id: string;
  title: string;
  date: string;
  mood: string;
  preview: string;
  blocks: number;
}

export default function JournalListScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      title: "Reflection on Progress",
      date: "Today - 10:30 AM",
      mood: "happy",
      preview: "Had an amazing day today. Completed my workout and read for an hour. Feeling accomplished...",
      blocks: 5,
    },
    {
      id: "2",
      title: "Daily Thoughts",
      date: "Yesterday - 8:15 PM",
      mood: "thoughtful",
      preview: "Reflecting on my goals and what I want to achieve. Need to focus more on consistency...",
      blocks: 3,
    },
    {
      id: "3",
      title: "Weekend Adventure",
      date: "2 days ago - 3:45 PM",
      mood: "excited",
      preview: "Went hiking this morning. The views were incredible. Met some amazing people on the trail...",
      blocks: 7,
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

  const getMoodColor = (mood: string) => {
    const colorMap: { [key: string]: string } = {
      happy: "bg-yellow-100",
      excited: "bg-pink-100",
      thoughtful: "bg-blue-100",
      sad: "bg-purple-100",
      calm: "bg-green-100",
    };
    return colorMap[mood] || "bg-gray-100";
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-3xl font-bold text-gray-900">Journal</Text>
          <Text className="text-gray-600">Your personal reflection space</Text>
        </View>
        <TouchableOpacity
          className="bg-blue-500 w-12 h-12 rounded-full items-center justify-center"
          onPress={() => router.push("/tabs/journal/single-page")}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Entries List */}
      <ScrollView className="flex-1 px-6 pb-6">
        {entries.length === 0 ? (
          <View className="flex-1 items-center justify-center py-12">
            <Ionicons name="book" size={48} color="#ccc" />
            <Text className="text-gray-500 text-center mt-4">No journal entries yet.{"\n"}Start writing to capture your thoughts!</Text>
            <TouchableOpacity
              className="mt-6 bg-blue-500 px-6 py-3 rounded-lg"
              onPress={() => router.push("/tabs/journal/single-page")}
            >
              <Text className="text-white font-semibold">Create First Entry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          entries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              className="bg-white rounded-lg p-4 mb-4 shadow-sm"
              activeOpacity={0.7}
              onPress={() => router.push(`/tabs/journal/single-page?id=${entry.id}`)}
            >
              {/* Top Row with Mood and Delete */}
              <View className="flex-row items-start justify-between mb-3">
                <View className={`${getMoodColor(entry.mood)} w-10 h-10 rounded-lg items-center justify-center`}>
                  <Text className="text-lg">{getMoodEmoji(entry.mood)}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteEntry(entry.id)}
                  className="p-2"
                >
                  <Ionicons name="trash" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>

              {/* Title */}
              <Text className="text-lg font-bold text-gray-900 mb-1">{entry.title}</Text>

              {/* Date */}
              <Text className="text-xs text-gray-500 mb-3">{entry.date}</Text>

              {/* Preview */}
              <Text className="text-sm text-gray-600 mb-3 leading-5" numberOfLines={2}>
                {entry.preview}
              </Text>

              {/* Footer with Block Count */}
              <View className="flex-row items-center justify-between pt-3 border-t border-gray-200">
                <View className="flex-row items-center">
                  <Ionicons name="layers" size={14} color="#999" />
                  <Text className="text-xs text-gray-500 ml-1">{entry.blocks} blocks</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
