import { View, Text, Pressable } from "react-native";
import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
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
import {
  HomeStyleScreen,
  SectionCard,
} from "../../../src/components/ui/HomeStyleScreen";

/* ---------------- Add Button with rotation ---------------- */

function AddButton({ open, onPress }: { open: boolean; onPress: () => void }) {
  const rotation = useSharedValue(0);

  if (open) {
    rotation.value = withTiming(1, { duration: 200 });
  } else {
    rotation.value = withTiming(0, { duration: 200 });
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(rotation.value, [0, 1], [0, 45])}deg`,
      },
    ],
  }));

  return (
    <Pressable
      onPress={onPress}
      style={{
        position: "absolute",
        bottom: 110,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View style={animatedStyle}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </Animated.View>
    </Pressable>
  );
}

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

  // If navigated with a ?date= param (e.g. from Journey Map), load that entry;
  // otherwise fall back to today.
  const { date: routeDate } = useLocalSearchParams<{ date?: string }>();

  useEffect(() => {
    const target = routeDate ?? new Date().toISOString().split("T")[0];
    loadJournal(target);
  }, [routeDate]);

  // Handle save with metadata from ChapterSlider
  const handleSaveWithMetadata = async (metadata: {
    title: string;
    isPinnedToTimeline: boolean;
  }) => {
    await saveJournal(metadata);
    await refreshJourneys();
    console.log("✅ Journey map refreshed after journal save");
  };

  const addTextBlock = () => {
    const id = Date.now().toString();
    const maxZ =
      blocks.length > 0
        ? Math.max(...blocks.map((b: JournalBlock) => b.zIndex))
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
      alert("Permission Required");
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

  const handleCanvasLongPress = (x: number, y: number) => {
    // Open context menu on empty canvas — pasteOnly mode (blockId = null)
    openContextMenu(null, x, y);
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
    <HomeStyleScreen
      kicker="Daily Journal"
      title="Journal Canvas"
      subtitle="Write freely, save your story"
      scrollable={false}
      contentContainerStyle={{ flex: 1, paddingBottom: 86 }}
      stats={[
        {
          value: typeof formattedDate === "object" ? formattedDate.weekday : "",
          label: "Day",
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        {/* Date Header + Save Button */}
        <SectionCard style={{ marginHorizontal: 16, marginBottom: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Date (left) */}
            <View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                  color: "#2E2A26",
                  letterSpacing: 0.2,
                }}
              >
                {typeof formattedDate === "object" ? formattedDate.day : ""}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: "#6B645C",
                  marginTop: 2,
                }}
              >
                {typeof formattedDate === "object" ? formattedDate.weekday : ""}
              </Text>
            </View>

            {/* Save button (right) */}
            <Pressable
              onPress={() => setChapterSliderVisible(true)}
              style={{
                paddingHorizontal: 22,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#2E2A26",
                alignItems: "center",
                justifyContent: "center",
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
                  fontSize: 15,
                  fontWeight: "600",
                  letterSpacing: 0.5,
                }}
              >
                Save
              </Text>
            </Pressable>
          </View>
        </SectionCard>

        {/* Canvas container with margins — Toolbar sits inside here */}
        <View
          style={{
            flex: 1,
            marginTop: 2,
            marginBottom: 100,
            marginHorizontal: 16,
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

          <Canvas
            onCanvasPress={handleCanvasPress}
            onCanvasLongPress={handleCanvasLongPress}
          >
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

        {/* Add Block Button — rotates to × when menu is open */}
        <AddButton
          open={addMenuVisible}
          onPress={() => setAddMenuVisible(!addMenuVisible)}
        />

        <ChapterSlider
          visible={chapterSliderVisible}
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
            pasteOnly={!contextMenu.blockId}
          />
        )}
      </View>
    </HomeStyleScreen>
  );
}
