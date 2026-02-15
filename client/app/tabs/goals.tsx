import { View, Text, ScrollView, TouchableOpacity, FlatList, TextInput } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface Goal {
  id: string;
  title: string;
  category: string;
  progress: number;
  color: string;
  icon: string;
}

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([
    { id: "1", title: "Lose 10 lbs", category: "Health", progress: 40, color: "bg-red-500", icon: "fitness" },
    { id: "2", title: "Read 12 books", category: "Learning", progress: 25, color: "bg-blue-500", icon: "book" },
    { id: "3", title: "Save $5000", category: "Finance", progress: 60, color: "bg-green-500", icon: "cash" },
    { id: "4", title: "Run a marathon", category: "Fitness", progress: 15, color: "bg-orange-500", icon: "walk" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState("");

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, {
        id: Date.now().toString(),
        title: newGoal,
        category: "Personal",
        progress: 0,
        color: "bg-indigo-500",
        icon: "flag",
      }]);
      setNewGoal("");
      setShowForm(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 pt-6 pb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-gray-900">Goals</Text>
            <Text className="text-gray-600">4 goals in progress</Text>
          </View>
          <TouchableOpacity
            className="bg-blue-500 w-12 h-12 rounded-full items-center justify-center"
            onPress={() => setShowForm(!showForm)}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {showForm && (
        <View className="px-6 mb-4">
          <View className="bg-white rounded-lg p-4 border border-gray-200">
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 mb-3"
              placeholder="What's your goal?"
              value={newGoal}
              onChangeText={setNewGoal}
            />
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-lg py-2 items-center"
                onPress={handleAddGoal}
              >
                <Text className="text-white font-semibold">Add Goal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-gray-300 rounded-lg py-2 items-center"
                onPress={() => setShowForm(false)}
              >
                <Text className="text-gray-800 font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View className="px-6 pb-6">
        {goals.map((goal) => (
          <TouchableOpacity key={goal.id} className="bg-white rounded-lg p-4 mb-3 shadow-sm" activeOpacity={0.7}>
            <View className="flex-row items-start mb-3">
              <View className={`${goal.color} w-10 h-10 rounded-lg items-center justify-center mr-3`}>
                <Ionicons name={goal.icon as any} size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">{goal.title}</Text>
                <Text className="text-sm text-gray-500">{goal.category}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
            <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
              <View
                className={`${goal.color} h-full`}
                style={{ width: `${goal.progress}%` }}
              />
            </View>
            <Text className="text-xs text-gray-500 mt-2">{goal.progress}% complete</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
