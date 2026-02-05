import { useState } from "react";
import { View, Text, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Canvas } from "../../../src/components/journal/Canvas";
import { TextBlock } from "../../../src/components/journal/blocks/TextBlock";

type TextBlockModel = {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function JournalScreen() {
  const [blocks, setBlocks] = useState<TextBlockModel[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const addTextBlock = () => {
    const id = Date.now().toString();

    setBlocks((prev) => [
      ...prev,
      {
        id,
        text: "New thought ✨",
        x: 2000,
        y: 2000,
        width: 200,
        height: 80,
      },
    ]);

    setSelectedBlockId(id);
  };

  const moveBlock = (id: string, x: number, y: number) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, x, y } : b))
    );
  };

  const changeText = (id: string, text: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, text } : b))
    );
  };

  const resizeBlock = (id: string, width: number, height: number, x: number, y: number) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, width, height, x, y } : b))
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            padding: 16,
            backgroundColor: "#f8f9fa",
            borderBottomWidth: 1,
            borderBottomColor: "#e9ecef",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#212529" }}>
            Journal
          </Text>
          <Text style={{ fontSize: 14, color: "#6c757d", marginTop: 4 }}>
            Tap + to add • Drag to move • Double tap to edit
          </Text>
        </View>

        {/* Canvas */}
        <Canvas>
          {blocks.map((block) => (
            <TextBlock
              key={block.id}
              id={block.id}
              text={block.text}
              x={block.x}
              y={block.y}
              width={block.width}
              height={block.height}
              isSelected={block.id === selectedBlockId}
              onSelect={setSelectedBlockId}
              onMove={moveBlock}
              onTextChange={changeText}
              onResize={resizeBlock}
            />
          ))}
        </Canvas>

        {/* Add Block Button */}
        <Pressable
          onPress={addTextBlock}
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#000",
            alignItems: "center",
            justifyContent: "center",
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 28 }}>+</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
