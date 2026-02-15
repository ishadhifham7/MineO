import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface Habit {
  id: string;
  name: string;
  frequency: string;
  streak: number;
  completed: boolean;
  icon: string;
  color: string;
}

export default function HabitScreen() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", name: "Morning Exercise", frequency: "Daily", streak: 12, completed: true, icon: "fitness", color: "bg-orange-500" },
    { id: "2", name: "Meditation", frequency: "Daily", streak: 8, completed: true, icon: "brain", color: "bg-purple-500" },
    { id: "3", name: "Read", frequency: "Daily", streak: 5, completed: false, icon: "book", color: "bg-blue-500" },
    { id: "4", name: "Drink Water", frequency: "Daily", streak: 20, completed: true, icon: "water", color: "bg-cyan-500" },
  ]);

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed, streak: habit.completed ? habit.streak : habit.streak + 1 } : habit
    ));
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 pt-6 pb-4">
        <Text className="text-3xl font-bold text-gray-900 mb-1">Habits</Text>
        <Text className="text-gray-600">Track your daily habits</Text>
      </View>

      <View className="px-6 mb-6">
        <Text className="text-sm font-semibold text-gray-700 mb-3">This Week</Text>
        <View className="flex-row justify-between bg-white rounded-lg p-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
            <View key={day} className="items-center">
              <Text className="text-xs text-gray-500 mb-2">{day}</Text>
              <View className={`w-10 h-10 rounded-full items-center justify-center ${idx < 5 ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Text className={`font-semibold ${idx < 5 ? 'text-green-500' : 'text-gray-400'}`}>{idx + 1}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="px-6 pb-6">
        <Text className="text-sm font-semibold text-gray-700 mb-3">Today's Habits</Text>
        {habits.map((habit) => (
          <TouchableOpacity
            key={habit.id}
            onPress={() => toggleHabit(habit.id)}
            className={`flex-row items-center p-4 rounded-lg mb-3 ${habit.completed ? 'bg-green-50' : 'bg-white'}`}
            activeOpacity={0.7}
          >
            <View className={`${habit.color} w-12 h-12 rounded-lg items-center justify-center mr-3`}>
              <Ionicons name={habit.icon as any} size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">{habit.name}</Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="flame" size={14} color="#ff6b35" />
                <Text className="text-sm text-gray-600 ml-1">{habit.streak} day streak</Text>
              </View>
            </View>
            <View
              className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                habit.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
              }`}
            >
              {habit.completed && <Ionicons name="checkmark" size={14} color="white" />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
