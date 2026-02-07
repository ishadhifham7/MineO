import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Canvas } from "../../../src/components/journal/Canvas";
import { TextBlock as TextBlockComponent } from "../../../src/components/journal/blocks/TextBlock";
import { ImageBlock as ImageBlockComponent } from "../../../src/components/journal/blocks/ImageBlock";
import { ContextMenu } from "../../../src/components/journal/ContextMenu";
import { Toolbar } from "../../../src/components/journal/Toolbar";
import { FloatingAddMenu } from "../../../src/components/journal/FlootingAddMenu";
import type {
  JournalBlock,
  TextBlock as TextBlockType,
  ImageBlock as ImageBlockType,
} from "../../../types/journal";
import * as ImagePicker from "expo-image-picker";

// Type guards for discriminated union
function isTextBlock(block: JournalBlock): block is TextBlockType {
  return block.type === "text";
}
function isImageBlock(block: JournalBlock): block is ImageBlockType {
  return block.type === "image";
}

/* ---------------- SCREEN ---------------- */

export default function JournalScreen() {
  const [blocks, setBlocks] = useState<JournalBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [addMenuVisible, setAddMenuVisible] = useState(false);
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
  const [copiedBlock, setCopiedBlock] = useState<JournalBlock | null>(null);

  // CREATE BLOCK
  const addTextBlock = () => {
    const id = Date.now().toString();
    setBlocks((prev) => {
      const maxZ =
        prev.length > 0
          ? Math.max(...prev.filter(isTextBlock).map((b) => b.zIndex))
          : 0;
      const newBlock: TextBlockType = {
        id,
        type: "text",
        text: "New thought ✨",
        x: 2000,
        y: 2000,
        width: 200,
        height: 80,
        rotation: 0,
        zIndex: maxZ + 1,
        isBold: false,
        isItalic: false,
        isUnderline: false,
        textColor: "#111",
        textAlign: "left",
        fontSize: 16,
        lineHeight: 22,
        letterSpacing: 0,
      };
      return [...prev, newBlock];
    });
    setSelectedBlockId(id);
  };

  const addImageBlock = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // ✅ correct (no crop UI)
      quality: 1,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return;

    const imageUri = result.assets[0].uri;

    const id = Date.now().toString();

    setBlocks((prev) => {
      const maxZ = prev.length > 0 ? Math.max(...prev.map((b) => b.zIndex)) : 0;

      const newBlock: ImageBlockType = {
        id,
        type: "image",
        imageUri,
        x: 200,
        y: 200,
        width: 200,
        height: 200,
        rotation: 0, // ✅ REQUIRED
        zIndex: maxZ + 1, // ✅ REQUIRED
      };

      return [...prev, newBlock];
    });

    setSelectedBlockId(id);
  };

  // BLOCK ACTIONS
  const moveBlock = (id: string, x: number, y: number) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id && isTextBlock(b) ? { ...b, x, y } : b)),
    );
  };
  const changeText = (id: string, text: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id && isTextBlock(b) ? { ...b, text } : b)),
    );
  };
  const resizeBlock = (
    id: string,
    width: number,
    height: number,
    x: number,
    y: number,
  ) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id && isTextBlock(b) ? { ...b, width, height, x, y } : b,
      ),
    );
  };
  const rotateBlock = (id: string, rotation: number) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id && isTextBlock(b) ? { ...b, rotation } : b)),
    );
  };
  const selectBlock = (id: string) => {
    setSelectedBlockId(id);
    setBlocks((prev) => {
      const maxZ =
        prev.length > 0
          ? Math.max(...prev.filter(isTextBlock).map((b) => b.zIndex))
          : 0;
      return prev.map((b) =>
        b.id === id && isTextBlock(b) ? { ...b, zIndex: maxZ + 1 } : b,
      );
    });
  };

  // CONTEXT MENU
  const openContextMenu = (id: string, x: number, y: number) => {
    setContextMenu({ visible: true, blockId: id, x, y });
  };
  const closeContextMenu = () => {
    setContextMenu({ visible: false, blockId: null, x: 0, y: 0 });
  };
  const handleCopy = () => {
    const block = blocks.find((b) => b.id === contextMenu.blockId);
    if (block) setCopiedBlock(block);
    closeContextMenu();
  };
  const handlePaste = () => {
    if (!copiedBlock) return;
    const newId = Date.now().toString();
    if (isTextBlock(copiedBlock)) {
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
    }
    closeContextMenu();
  };
  const handleDelete = () => {
    setBlocks((prev) => prev.filter((b) => b.id !== contextMenu.blockId));
    setSelectedBlockId(null);
    closeContextMenu();
  };

  // TOOLBAR ACTIONS
  const toggleBold = () => {
    if (!selectedBlockId) return;
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === selectedBlockId && isTextBlock(b)
          ? { ...b, isBold: !b.isBold }
          : b,
      ),
    );
  };
  const toggleItalic = () => {
    if (!selectedBlockId) return;
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === selectedBlockId && isTextBlock(b)
          ? { ...b, isItalic: !b.isItalic }
          : b,
      ),
    );
  };
  // (Removed duplicate handler definitions)

  /* ---------- CREATE BLOCK ---------- */

  const toggleUnderline = () => {
    if (!selectedBlockId) return;
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === selectedBlockId && isTextBlock(b)
          ? { ...b, isUnderline: !b.isUnderline }
          : b,
      ),
    );
  };

  const changeColor = (color: string) => {
    if (!selectedBlockId) return;
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === selectedBlockId ? { ...b, textColor: color } : b,
      ),
    );
  };

  const alignText = (align: "left" | "center" | "right") => {
    if (!selectedBlockId) return;
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === selectedBlockId ? { ...b, textAlign: align } : b,
      ),
    );
  };

  const handleChangeFontSize = (size: number) => {
    if (!selectedBlockId) return;
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === selectedBlockId ? { ...b, fontSize: size } : b,
      ),
    );
  };

  const handleChangeLineHeight = (lh: number) => {
    if (!selectedBlockId) return;
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === selectedBlockId ? { ...b, lineHeight: lh } : b,
      ),
    );
  };

  const handleChangeLetterSpacing = (ls: number) => {
    if (!selectedBlockId) return;
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === selectedBlockId ? { ...b, letterSpacing: ls } : b,
      ),
    );
  };

  /* ---------- RENDER ---------- */

  const sortedBlocks = [...blocks].sort((a, b) => {
    if (isTextBlock(a) && isTextBlock(b)) return a.zIndex - b.zIndex;
    if (isTextBlock(a)) return -1;
    if (isTextBlock(b)) return 1;
    return 0;
  });

  const handleCanvasPress = () => {
    setSelectedBlockId(null);
  };

  const selectedBlock = blocks.find(
    (b) => b.id === selectedBlockId && isTextBlock(b),
  ) as TextBlockType | undefined;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Toolbar
          visible={!!selectedBlockId}
          onToggleBold={toggleBold}
          onToggleItalic={toggleItalic}
          onToggleUnderline={toggleUnderline}
          onChangeColor={changeColor}
          onAlign={alignText}
          fontSize={selectedBlock?.fontSize || 16}
          lineHeight={selectedBlock?.lineHeight || 22}
          letterSpacing={selectedBlock?.letterSpacing || 0}
          onChangeFontSize={handleChangeFontSize}
          onChangeLineHeight={handleChangeLineHeight}
          onChangeLetterSpacing={handleChangeLetterSpacing}
        />

        <Canvas onCanvasPress={handleCanvasPress}>
          {sortedBlocks.map((block) => {
            if (isTextBlock(block)) {
              return (
                <TextBlockComponent
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
              );
            }
            if (isImageBlock(block)) {
              return <ImageBlockComponent key={block.id} block={block} />;
            }
            return null;
          })}
        </Canvas>

        <FloatingAddMenu
          visible={addMenuVisible}
          onAddText={() => {
            addTextBlock();
            setAddMenuVisible(false);
          }}
          onAddImage={async () => {
            const selectedBlock = blocks.find(
              (b) => b.id === selectedBlockId && isTextBlock(b),
            ) as TextBlockType | undefined;
            await addImageBlock();
            setAddMenuVisible(false);
          }}
        />

        <Pressable
          onPress={() => setAddMenuVisible((v) => !v)}
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
        {/*
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
        </Pressable>*/}

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
