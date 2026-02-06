import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Canvas } from "../../../src/components/journal/Canvas";
import { TextBlock } from "../../../src/components/journal/blocks/TextBlock";
import { ContextMenu } from "../../../src/components/journal/ContextMenu";

type TextBlockModel = {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
};

export default function JournalScreen() {
  const [blocks, setBlocks] = useState<TextBlockModel[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const addTextBlock = () => {
    const id = Date.now().toString();
    setBlocks((prev) => {
      const maxZ = prev.length > 0 ? Math.max(...prev.map((b) => b.zIndex)) : 0;
      return [
        ...prev,
        {
          id,
          text: "New thought ✨",
          x: 2000,
          y: 2000,
          width: 200,
          height: 80,
          rotation: 0,
          zIndex: maxZ + 1,
        },
      ];
    });
    setSelectedBlockId(id);
  };

  const moveBlock = (id: string, x: number, y: number) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, x, y } : b)));
  };

  const changeText = (id: string, text: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, text } : b)));
  };

  const resizeBlock = (
    id: string,
    width: number,
    height: number,
    x: number,
    y: number,
  ) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, width, height, x, y } : b)),
    );
  };

  const rotateBlock = (id: string, rotation: number) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, rotation } : b)),
    );
  };

  const selectBlock = (id: string) => {
    setSelectedBlockId(id);

    setBlocks((prev) => {
      if (prev.length === 0) return prev;
      const maxZ = Math.max(...prev.map((b) => b.zIndex));
      return prev.map((b) => (b.id === id ? { ...b, zIndex: maxZ + 1 } : b));
    });
  };

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    blockId: string | null;
    x: number;
    y: number;
  }>({
    visible: false,
    blockId: null,
    x: 0,
    y: 0,
  });

  const [copiedBlock, setCopiedBlock] = useState<TextBlockModel | null>(null);

  const openContextMenu = (id: string, x: number, y: number) => {
    setContextMenu({
      visible: true,
      blockId: id,
      x,
      y,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({
      visible: false,
      blockId: null,
      x: 0,
      y: 0,
    });
  };

  const handleCopy = () => {
    const block = blocks.find((b) => b.id === contextMenu.blockId);
    if (block) setCopiedBlock(block);
    closeContextMenu();
  };

  const handlePaste = () => {
    if (!copiedBlock) return;

    const newId = Date.now().toString();
    setBlocks((prev) => [
      ...prev,
      {
        ...copiedBlock,
        id: newId,
        x: copiedBlock.x + 30,
        y: copiedBlock.y + 30,
      },
    ]);

    setSelectedBlockId(newId);
    closeContextMenu();
  };

  const handleDelete = () => {
    setBlocks((prev) => prev.filter((b) => b.id !== contextMenu.blockId));
    setSelectedBlockId(null);
    closeContextMenu();
  };

  //const handleLongPress = (id: string, x: number, y: number) => {
  //console.log("Long pressed block:", id, x, y);
  //};

  // Sort blocks by zIndex so the highest appears on top
  const sortedBlocks = [...blocks].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Canvas>
          {sortedBlocks.map((block) => (
            <TextBlock
              key={block.id}
              {...block}
              isSelected={block.id === selectedBlockId}
              onSelect={selectBlock}
              onMove={moveBlock}
              onTextChange={changeText}
              onResize={resizeBlock}
              onRotate={rotateBlock}
              onLongPress={openContextMenu}
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

        {contextMenu.visible && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onDelete={handleDelete}
            onClose={closeContextMenu}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
