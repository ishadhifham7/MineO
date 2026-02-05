import { useState } from "react";
import { View, Text, Pressable } from "react-native";
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
  rotation: number;
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
        rotation: 0,
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

  const resizeBlock = (
    id: string,
    width: number,
    height: number,
    x: number,
    y: number
  ) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, width, height, x, y } : b
      )
    );
  };

  const rotateBlock = (id: string, rotation: number) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, rotation } : b
      )
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          }}
        >
          <Text style={{ color: "#fff", fontSize: 28 }}>+</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
