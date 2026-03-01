import { View, Text, Pressable, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback, useRef, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import { getLocalToday } from "../../../src/utils/date";
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
import type {
  JournalBlock,
  TextBlock as TextBlockType,
  ImageBlock as ImageBlockType,
} from "../../../types/journal";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import { API_BASE_URL } from "../../../src/services/api";

/* ---------------- SCREEN ---------------- */

export default function JournalScreen() {
  const {
    blocks,
    selectedBlockId,
    addMenuVisible,
    contextMenu,
    chapterSliderVisible,
    title,
    chapters: savedChapters,
    isPinnedToTimeline,
    isNew,
    isLoading,
    date: loadedDate,
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
    resetJournal,
  } = useJournal();

  const [savedVisible, setSavedVisible] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep a stable ref to loadJournal so the memoised focus-callback
  // always calls the latest version (avoids stale-closure issues).
  const loadJournalRef = useRef(loadJournal);
  useEffect(() => {
    loadJournalRef.current = loadJournal;
  });

  // Always load today's journal on focus (handles tab switches, day changes, etc.)
  useFocusEffect(
    useCallback(() => {
      const today = getLocalToday();
      loadJournalRef.current(today);

      // Check every 30s if midnight has passed while user stays on this screen
      const interval = setInterval(() => {
        const now = getLocalToday();
        if (now !== today) {
          loadJournalRef.current(now);
        }
      }, 30_000);

      return () => clearInterval(interval);
    }, []),
  );

  // Handle save with metadata from ChapterSlider
  const handleSaveWithMetadata = async (metadata: {
    title: string;
    chapters: string[];
    isPinnedToTimeline: boolean;
  }) => {
    await saveJournal(metadata);
    // Show "Saved!" message for 2 seconds
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    setSavedVisible(true);
    savedTimerRef.current = setTimeout(() => setSavedVisible(false), 2000);
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
      Alert.alert("Permission required", "Allow access to your photo library to add images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.8,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return;

    const asset = result.assets[0];

    // ── Upload to server → Firebase Storage ──────────────────────────────────
    setUploadingImage(true);
    try {
      const formData = new FormData();
      const filename = asset.fileName || `image_${Date.now()}.jpg`;
      const mimeType = asset.mimeType || "image/jpeg";

      if (Platform.OS === "web") {
        // On web, {uri, type, name} is treated as a plain field, not a file.
        // We must fetch the blob URI and append an actual File/Blob object.
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        const file = new File([blob], filename, { type: mimeType });
        formData.append("image", file);
      } else {
        // On native (iOS/Android), RN's FormData polyfill handles {uri,type,name}
        formData.append("image", {
          uri: asset.uri,
          type: mimeType,
          name: filename,
        } as any);
      }

      console.log("📸 Uploading image:", filename, "platform:", Platform.OS);
      const uploadRes = await fetch(`${API_BASE_URL}/journal/upload-image`, {
        method: "POST",
        body: formData,
      });

      console.log("📥 Response status:", uploadRes.status);

      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err.message || `Upload failed (${uploadRes.status})`);
      }

      const { url: imageUri } = await uploadRes.json();

      // ── Add block with permanent URL ────────────────────────────────────────
      const id = Date.now().toString();
      const maxZ =
        blocks.length > 0
          ? Math.max(...blocks.map((b: JournalBlock) => b.zIndex))
          : 0;
      const CANVAS_SIZE = 4000;
      const imageWidth = 240;
      const imageHeight = 240;
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
    } catch (err: any) {
      Alert.alert("Upload failed", err.message || "Could not upload image. Try again.");
    } finally {
      setUploadingImage(false);
    }
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

  const today = getLocalToday();
  // If context still has a different date's data (e.g. coming back from [date].tsx),
  // treat it as loading so we never flash stale past-day content
  const isStaleDate = loadedDate !== undefined && loadedDate !== today;

  const sortedBlocks = [...blocks].sort((a, b) => a.zIndex - b.zIndex);

  const handleCanvasPress = () => {
    deselectBlock();
  };

  const selectedBlock = blocks.find(
    (b: JournalBlock) => b.id === selectedBlockId && isTextBlock(b),
  ) as TextBlockType | undefined;

  // Show toolbar only for selected text blocks
  const showToolbar = selectedBlock !== undefined;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading || isStaleDate ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#444" />
        </View>
      ) : (
      <View style={{ flex: 1 }}>
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

        {/* Save Button - Bottom Left */}
        <Pressable
          onPress={() => setChapterSliderVisible(true)}
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            paddingHorizontal: 28,
            height: 44,
            borderRadius: 24,
            backgroundColor: "#000", // green-400
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
            {isNew ? "Save" : "Edit & Save"}
          </Text>
        </Pressable>

        <ChapterSlider
          visible={chapterSliderVisible}
          chapters={chapters}
          onClose={() => setChapterSliderVisible(false)}
          onSave={handleSaveWithMetadata}
          initialTitle={title}
          initialSelectedChapters={savedChapters}
          initialIsPinnedToTimeline={isPinnedToTimeline}
          isExistingEntry={!isNew}
        />

        {/* Uploading image overlay */}
        {uploadingImage && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 60,
              alignSelf: "center",
              backgroundColor: "rgba(0,0,0,0.75)",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 24,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <ActivityIndicator color="#fff" size="small" />
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
              Uploading image…
            </Text>
          </View>
        )}

        {/* Saved toast */}
        {savedVisible && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.78)",
                paddingHorizontal: 32,
                paddingVertical: 14,
                borderRadius: 28,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700" }}>
                ✓ Saved!
              </Text>
            </View>
          </View>
        )}

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
      )}
    </SafeAreaView>
  );
}
