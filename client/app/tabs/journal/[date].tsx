import { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
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

export default function JournalDateView() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();

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
  } = useJournal();

  const [savedVisible, setSavedVisible] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (date) {
      loadJournal(date);
    }
  }, [date]);

  // Re-load whenever the screen regains focus (e.g. coming back from another tab)
  useFocusEffect(
    useCallback(() => {
      if (date) {
        loadJournal(date);
      }
    }, [date]),
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /* ---------- SAVE ---------- */
  const handleSaveWithMetadata = async (metadata: {
    title: string;
    chapters: string[];
    isPinnedToTimeline: boolean;
  }) => {
    await saveJournal(metadata);
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

  /* ---------- ADD BLOCKS ---------- */
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
      Alert.alert(
        "Permission required",
        "Allow access to your photo library to add images.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.8,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return;

    const asset = result.assets[0];

    setUploadingImage(true);
    try {
      const formData = new FormData();
      const filename = asset.fileName || `image_${Date.now()}.jpg`;
      const mimeType = asset.mimeType || "image/jpeg";

      if (Platform.OS === "web") {
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        const file = new File([blob], filename, { type: mimeType });
        formData.append("image", file);
      } else {
        formData.append("image", {
          uri: asset.uri,
          type: mimeType,
          name: filename,
        } as any);
      }

      const uploadRes = await fetch(`${API_BASE_URL}/journal/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err.message || `Upload failed (${uploadRes.status})`);
      }

      const { url: imageUri } = await uploadRes.json();

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
      Alert.alert(
        "Upload failed",
        err.message || "Could not upload image. Try again.",
      );
    } finally {
      setUploadingImage(false);
    }
  };

  /* ---------- BLOCK ACTIONS ---------- */
  const handleMoveBlock = (id: string, x: number, y: number) =>
    moveBlock(id, x, y);
  const handleChangeText = (id: string, text: string) => changeText(id, text);
  const handleResizeBlock = (
    id: string,
    width: number,
    height: number,
    x: number,
    y: number,
  ) => resizeBlock(id, width, height, x, y);
  const handleRotateBlock = (id: string, rotation: number) =>
    rotateBlock(id, rotation);
  const handleSelectBlock = (id: string) => selectBlock(id);

  /* ---------- CONTEXT MENU ---------- */
  const handleOpenContextMenu = (id: string, x: number, y: number) =>
    openContextMenu(id, x, y);
  const handleCloseContextMenu = () => closeContextMenu();
  const handleCopy = () => {
    if (contextMenu.blockId) copyBlock(contextMenu.blockId);
  };
  const handlePaste = () => pasteBlock();
  const handleDelete = () => {
    if (contextMenu.blockId) deleteBlock(contextMenu.blockId);
  };

  /* ---------- TOOLBAR ---------- */
  const handleToggleBold = () => {
    if (selectedBlockId) toggleBold(selectedBlockId);
  };
  const handleToggleItalic = () => {
    if (selectedBlockId) toggleItalic(selectedBlockId);
  };
  const handleToggleUnderline = () => {
    if (selectedBlockId) toggleUnderline(selectedBlockId);
  };
  const handleChangeColor = (color: string) => {
    if (selectedBlockId) changeColor(selectedBlockId, color);
  };
  const handleAlignText = (align: "left" | "center" | "right") => {
    if (selectedBlockId) alignText(selectedBlockId, align);
  };
  const handleChangeFontSize = (size: number) => {
    if (selectedBlockId) changeFontSize(selectedBlockId, size);
  };
  const handleChangeLineHeight = (lh: number) => {
    if (selectedBlockId) changeLineHeight(selectedBlockId, lh);
  };
  const handleChangeLetterSpacing = (ls: number) => {
    if (selectedBlockId) changeLetterSpacing(selectedBlockId, ls);
  };

  /* ---------- RENDER ---------- */
  const sortedBlocks = [...blocks].sort((a, b) => a.zIndex - b.zIndex);
  const handleCanvasPress = () => deselectBlock();

  const selectedBlock = blocks.find(
    (b: JournalBlock) => b.id === selectedBlockId && isTextBlock(b),
  ) as TextBlockType | undefined;
  const showToolbar = selectedBlock !== undefined;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/tabs/journal" as any);
            }
          }}
          style={styles.backBtn}
        >
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerDate} numberOfLines={1}>
            {date ? formatDate(date) : ""}
          </Text>
          {title ? (
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
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

          {blocks.length === 0 && isNew ? (
            /* Empty past day – show prompt to start writing */
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyText}>
                No journal entry for this day
              </Text>
              <Pressable
                onPress={() => {
                  addTextBlock();
                }}
                style={styles.startBtn}
              >
                <Text style={styles.startBtnText}>Start Writing</Text>
              </Pressable>
            </View>
          ) : (
            <Canvas onCanvasPress={handleCanvasPress}>
              {sortedBlocks.map((block: JournalBlock) => {
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
          )}

          {/* Floating + button (show once there are blocks or user has started) */}
          {!(blocks.length === 0 && isNew) && (
            <>
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
                style={styles.fab}
              >
                <Text style={{ color: "#fff", fontSize: 28 }}>+</Text>
              </Pressable>

              {/* Save Button */}
              <Pressable
                onPress={() => setChapterSliderVisible(true)}
                style={styles.saveBtn}
              >
                <Text style={styles.saveBtnText}>
                  {isNew ? "Save" : "Edit & Save"}
                </Text>
              </Pressable>
            </>
          )}

          <ChapterSlider
            visible={chapterSliderVisible}
            onClose={() => setChapterSliderVisible(false)}
            onSave={(metadata) => {
              void handleSaveWithMetadata({
                ...metadata,
                chapters:
                  savedChapters && savedChapters.length > 0
                    ? savedChapters
                    : chapters.map((chapter) => chapter.title),
              });
            }}
          />

          {/* Uploading image overlay */}
          {uploadingImage && (
            <View pointerEvents="none" style={styles.uploadOverlay}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.uploadText}>Uploading image…</Text>
            </View>
          )}

          {/* Saved toast */}
          {savedVisible && (
            <View pointerEvents="none" style={styles.savedOverlay}>
              <View style={styles.savedToast}>
                <Text style={styles.savedToastText}>✓ Saved!</Text>
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FDFAF5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#FDFAF5",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
  },
  backIcon: {
    fontSize: 28,
    color: "#333",
    lineHeight: 30,
    marginRight: 2,
  },
  backLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  headerCenter: {
    flex: 1,
  },
  headerDate: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 16,
    color: "#222",
    fontWeight: "600",
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
  },
  startBtn: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "#000",
  },
  startBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtn: {
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
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  uploadOverlay: {
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
  },
  uploadText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  savedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  savedToast: {
    backgroundColor: "rgba(0,0,0,0.78)",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
  },
  savedToastText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
