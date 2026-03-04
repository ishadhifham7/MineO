import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { Canvas } from "../../../src/components/journal/Canvas";
import { TextBlock as TextBlockComponent } from "../../../src/components/journal/blocks/TextBlock";
import { ImageBlockComponent } from "../../../src/components/journal/blocks/ImageBlock";
import { ContextMenu } from "../../../src/components/journal/ContextMenu";
import { ChapterSlider } from "../../../src/components/journal/ChapterSlider";
import { Toolbar } from "../../../src/components/journal/Toolbar";
import { FloatingAddMenu } from "../../../src/components/journal/FlootingAddMenu";
import {
  useJournal,
  isTextBlock,
  isImageBlock,
} from "../../../src/features/journal/journal.context";
import { useJourney } from "../../../src/providers/JourneyProvider";
import type {
  JournalBlock,
  TextBlock as TextBlockType,
  ImageBlock as ImageBlockType,
} from "../../../types/journal";
import * as ImagePicker from "expo-image-picker";

/* ---------------- SCREEN ---------------- */

export default function JournalScreen() {
  const {
    blocks,
    selectedBlockId,
    addMenuVisible,
    contextMenu,
    chapterSliderVisible,
    addBlock,
    moveBlock,
    changeText,
    resizeBlock,
    rotateBlock,
    selectBlock,
    deselectBlock,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    changeColor,
    alignText,
    changeFontSize,
    changeLineHeight,
    changeLetterSpacing,
    setAddMenuVisible,
    openContextMenu,
    closeContextMenu,
    copyBlock,
    pasteBlock,
    deleteBlock,
    setChapterSliderVisible,
    saveJournal,
    loadJournal,
    date,
  } = useJournal();

  const { refreshJourneys } = useJourney();

  // Initialize today's journal on mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    loadJournal(today);
  }, []);

  // Handle save with metadata from ChapterSlider
  const handleSaveWithMetadata = async (metadata: {
    title: string;
    isPinnedToTimeline: boolean;
  }) => {
    await saveJournal(metadata);
    // Refresh journey map to show the new journal
    await refreshJourneys();
    console.log("✅ Journey map refreshed after journal save");
  };

  const chapters = [
    { id: "1", title: "Life" },
    { id: "2", title: "Health" },
    { id: "3", title: "Mind" },
    { id: "4", title: "Career" },
    { id: "5", title: "Relationships" },
  ];

  // CREATE BLOCK
  const addTextBlock = () => {
    const id = Date.now().toString();
    const maxZ =
      blocks.length > 0
        ? Math.max(
            ...blocks.filter(isTextBlock).map((b: JournalBlock) => b.zIndex),
          )
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
    addBlock(newBlock);
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

    // Center the image in the canvas (4000x4000)
    const maxZ =
      blocks.length > 0
        ? Math.max(...blocks.map((b: JournalBlock) => b.zIndex))
        : 0;
    const CANVAS_SIZE = 4000;
    const imageWidth = 200;
    const imageHeight = 200;
    const newBlock: ImageBlockType = {
      id,
      type: "image",
      imageUri,
      x: Math.round(CANVAS_SIZE / 2 - imageWidth / 2),
      y: Math.round(CANVAS_SIZE / 2 - imageHeight / 2),
      width: imageWidth,
      height: imageHeight,
      rotation: 0,
      zIndex: maxZ + 1,
    };
    addBlock(newBlock);
  };

  // BLOCK ACTIONS
  const handleMoveBlock = (id: string, x: number, y: number) => {
    moveBlock(id, x, y);
  };
  const handleChangeText = (id: string, text: string) => {
    changeText(id, text);
  };
  const handleResizeBlock = (
    id: string,
    width: number,
    height: number,
    x: number,
    y: number,
  ) => {
    resizeBlock(id, width, height, x, y);
  };
  const handleRotateBlock = (id: string, rotation: number) => {
    rotateBlock(id, rotation);
  };
  const handleSelectBlock = (id: string) => {
    selectBlock(id);
  };

  // CONTEXT MENU
  const handleOpenContextMenu = (id: string, x: number, y: number) => {
    openContextMenu(id, x, y);
  };
  const handleCloseContextMenu = () => {
    closeContextMenu();
  };
  const handleCopy = () => {
    if (contextMenu.blockId) {
      copyBlock(contextMenu.blockId);
    }
  };
  const handlePaste = () => {
    pasteBlock();
  };
  const handleDelete = () => {
    if (contextMenu.blockId) {
      deleteBlock(contextMenu.blockId);
    }
  };

  // TOOLBAR ACTIONS
  const handleToggleBold = () => {
    if (!selectedBlockId) return;
    toggleBold(selectedBlockId);
  };
  const handleToggleItalic = () => {
    if (!selectedBlockId) return;
    toggleItalic(selectedBlockId);
  };
  const handleToggleUnderline = () => {
    if (!selectedBlockId) return;
    toggleUnderline(selectedBlockId);
  };

  const handleChangeColor = (color: string) => {
    if (!selectedBlockId) return;
    changeColor(selectedBlockId, color);
  };

  const handleAlignText = (align: "left" | "center" | "right") => {
    if (!selectedBlockId) return;
    alignText(selectedBlockId, align);
  };

  const handleChangeFontSize = (size: number) => {
    if (!selectedBlockId) return;
    changeFontSize(selectedBlockId, size);
  };

  const handleChangeLineHeight = (lh: number) => {
    if (!selectedBlockId) return;
    changeLineHeight(selectedBlockId, lh);
  };

  const handleChangeLetterSpacing = (ls: number) => {
    if (!selectedBlockId) return;
    changeLetterSpacing(selectedBlockId, ls);
  };

  /* ---------- RENDER ---------- */

  const sortedBlocks = [...blocks].sort((a, b) => a.zIndex - b.zIndex);

  const handleCanvasPress = () => {
    deselectBlock();
  };

  const selectedBlock = blocks.find(
    (b: JournalBlock) => b.id === selectedBlockId && isTextBlock(b),
  ) as TextBlockType | undefined;

  // Show toolbar only for selected text blocks
  const showToolbar = selectedBlock !== undefined;

  // Format YYYY-MM-DD → "20th January 2025" and "Saturday"
  const formatJournalDate = (dateStr: string | null) => {
    if (!dateStr) {
      const now = new Date();
      return formatJournalDate(now.toISOString().split("T")[0]);
    }
    const d = new Date(dateStr + "T00:00:00"); // force local time
    const day = d.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";
    const month = d.toLocaleString("en-US", { month: "long" });
    const year = d.getFullYear();
    const weekday = d.toLocaleString("en-US", { weekday: "long" });
    return { day: `${day}${suffix} ${month} ${year}`, weekday };
  };

  const formattedDate = formatJournalDate(date);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Date Header */}
        <View
          style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: "#111",
              letterSpacing: 0.2,
            }}
          >
            {typeof formattedDate === "object" ? formattedDate.day : ""}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: "#888",
              marginTop: 2,
            }}
          >
            {typeof formattedDate === "object" ? formattedDate.weekday : ""}
          </Text>
        </View>

        {/* Canvas container with margins — Toolbar sits inside here */}
        <View
          style={{
            flex: 1,
            marginTop: 30,
            marginBottom: 4,
            marginHorizontal: 12,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <Toolbar
            visible={showToolbar}
            onToggleBold={handleToggleBold}
            onToggleItalic={handleToggleItalic}
            onToggleUnderline={handleToggleUnderline}
            onChangeColor={handleChangeColor}
            onAlign={handleAlignText}
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
                    onSelect={handleSelectBlock}
                    onMove={handleMoveBlock}
                    onTextChange={handleChangeText}
                    onResize={handleResizeBlock}
                    onRotate={handleRotateBlock}
                    onLongPress={handleOpenContextMenu}
                  />
                );
              }

              if (isImageBlock(block)) {
                return (
                  <ImageBlockComponent
                    key={block.id}
                    id={block.id}
                    imageUri={block.imageUri}
                    x={block.x}
                    y={block.y}
                    width={block.width}
                    height={block.height}
                    rotation={block.rotation}
                    zIndex={block.zIndex}
                    isSelected={block.id === selectedBlockId}
                    onSelect={handleSelectBlock}
                    onMove={handleMoveBlock}
                    onResize={handleResizeBlock}
                    onRotate={handleRotateBlock}
                    onLongPress={handleOpenContextMenu}
                  />
                );
              }

              return null;
            })}
          </Canvas>
        </View>

        <FloatingAddMenu
          visible={addMenuVisible}
          onAddText={() => {
            addTextBlock();
            setAddMenuVisible(false);
          }}
          onAddImage={async () => {
            await addImageBlock();
            setAddMenuVisible(false);
          }}
        />

        {/* Add Block Button */}
        <Pressable
          onPress={() => setAddMenuVisible(!addMenuVisible)}
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

        {/* Save Button */}
        <Pressable
          onPress={() => setChapterSliderVisible(true)}
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            paddingHorizontal: 28,
            height: 44,
            borderRadius: 24,
            backgroundColor: "#000",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            Save
          </Text>
        </Pressable>

        <ChapterSlider
          visible={chapterSliderVisible}
          chapters={chapters}
          onClose={() => setChapterSliderVisible(false)}
          onSave={handleSaveWithMetadata}
        />

        {contextMenu.visible && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onDelete={handleDelete}
            onClose={handleCloseContextMenu}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
