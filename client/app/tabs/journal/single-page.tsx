import { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Canvas } from "../../../src/components/journal/Canvas";
import { TextBlock } from "../../../src/components/journal/blocks/TextBlock";

type TextBlockModel = {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export default function JournalEntryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState(id ? "Journal Entry" : "");
  const [mood, setMood] = useState("happy");
  const [blocks, setBlocks] = useState<TextBlockModel[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);

  const moods = ["happy", "excited", "thoughtful", "calm", "sad"];
  const moodEmojis: { [key: string]: string } = {
    happy: "😊",
    excited: "🤩",
    thoughtful: "🤔",
    calm: "😌",
    sad: "😢",
  };

  const addTextBlock = () => {
    const newId = Date.now().toString();
    setBlocks((prev) => [
      ...prev,
      {
        id: newId,
        text: "New thought ✨",
        x: 2000,
        y: 2000,
        width: 200,
        height: 80,
        rotation: 0,
      },
    ]);
    setSelectedBlockId(newId);
  };

  const moveBlock = (id: string, x: number, y: number) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, x, y } : b)));
  };

  const changeText = (id: string, text: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, text } : b)));
  };

  const resizeBlock = (id: string, width: number, height: number, x: number, y: number) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, width, height, x, y } : b)));
  };

  const rotateBlock = (id: string, rotation: number) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, rotation } : b)));
  };

  const deleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const handleSave = () => {
    // TODO: Save journal entry to backend
    alert("Journal entry saved!");
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header with Title and Mood */}
      <SafeAreaView style={{ backgroundColor: "#fff" }}>
        <View className="px-6 py-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-blue-500 px-4 py-2 rounded-lg"
              onPress={handleSave}
            >
              <Text className="text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2"
            placeholder="Journal Entry Title"
            value={title}
            onChangeText={setTitle}
          />

          {/* Mood Selector */}
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-gray-700">How are you feeling?</Text>
            <View className="flex-row gap-2">
              {moods.map((m) => (
                <TouchableOpacity
                  key={m}
                  className={`w-10 h-10 rounded-lg items-center justify-center ${
                    mood === m ? "bg-blue-200 border-2 border-blue-500" : "bg-gray-100"
                  }`}
                  onPress={() => setMood(m)}
                >
                  <Text className="text-lg">{moodEmojis[m]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Canvas */}
      <View style={{ flex: 1 }}>
        <Canvas>
          {blocks.map((block) => (
            <TextBlock
              key={block.id}
              {...block}
              isSelected={block.id === selectedBlockId}
              onSelect={setSelectedBlockId}
              onMove={moveBlock}
              onTextChange={changeText}
              onResize={resizeBlock}
              onRotate={rotateBlock}
            />
          ))}
        </Canvas>

        {/* Floating Action Buttons */}
        <View style={{ position: "absolute", bottom: 24, right: 24, gap: 12 }}>
          {selectedBlockId && (
            <Pressable
              onPress={() => deleteBlock(selectedBlockId)}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#ef4444",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="trash" size={24} color="white" />
            </Pressable>
          )}

          <Pressable
            onPress={addTextBlock}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#3b82f6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 28 }}>+</Text>
          </Pressable>
        </View>

        {/* Block Count */}
        <View style={{
          position: "absolute",
          bottom: 24,
          left: 24,
          backgroundColor: "rgba(0,0,0,0.7)",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
        }}>
          <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>
            {blocks.length} blocks
          </Text>
        </View>
      </View>
    </View>
  );
}
