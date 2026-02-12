import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import Checkbox from "expo-checkbox";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SLIDER_HEIGHT = SCREEN_HEIGHT * 0.4;

type Chapter = {
  id: string;
  title: string;
};

type Props = {
  visible: boolean;
  chapters: Chapter[];
  onClose: () => void;
  onSave?: (metadata: { title: string; isPinnedToTimeline: boolean }) => void;
};

export function ChapterSlider({ visible, chapters, onClose, onSave }: Props) {
  const translateY = useRef(new Animated.Value(SLIDER_HEIGHT)).current;

  const [subject, setSubject] = useState("");
  const [addToTimeline, setAddToTimeline] = useState(false);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);

  /* ---------------- animation ---------------- */

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : SLIDER_HEIGHT,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  /* ---------------- logic ---------------- */

  const toggleChapter = (id: string) => {
    setSelectedChapters((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave({
        title: subject,
        isPinnedToTimeline: addToTimeline,
      });
    }
    onClose();
  };

  /* ---------------- render ---------------- */

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Background Blur */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
      </Pressable>

      {/* Slider */}
      <Animated.View style={[styles.slider, { transform: [{ translateY }] }]}>
        {/* Subject label */}
        <Text style={styles.sectionLabel}>Subject</Text>

        {/* Subject Input */}
        <TextInput
          placeholder="Enter subject"
          value={subject}
          onChangeText={setSubject}
          style={styles.input}
          placeholderTextColor="#999"
        />

        {/* Chapters label */}
        <Text style={styles.sectionLabel}>Select chapters</Text>

        {/* Chapters */}
        <View
          style={[styles.chapterGrid, !addToTimeline && styles.disabledGrid]}
          pointerEvents={addToTimeline ? "auto" : "none"}
        >
          {chapters.map((chapter) => {
            const selected = selectedChapters.includes(chapter.id);

            return (
              <Pressable
                key={chapter.id}
                onPress={() => toggleChapter(chapter.id)}
                style={[styles.chapterPill, selected && styles.chapterSelected]}
              >
                <Text
                  style={[
                    styles.chapterText,
                    selected && styles.chapterTextSelected,
                  ]}
                >
                  {chapter.title}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Add to timeline (right aligned) */}
        <View style={styles.checkboxRow}>
          <Text style={styles.checkboxText}>Add to timeline</Text>
          <Checkbox value={addToTimeline} onValueChange={setAddToTimeline} />
        </View>

        {/* Save button */}
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

/* ---------------- styles ---------------- */

const styles = StyleSheet.create({
  slider: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SLIDER_HEIGHT,
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
  },

  input: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f2f2f4",
    color: "#000",
    marginBottom: 18,
  },

  chapterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  disabledGrid: {
    opacity: 0.35,
  },

  chapterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#e6e6ea",
  },

  chapterSelected: {
    backgroundColor: "#4A90E2",
  },

  chapterText: {
    color: "#555",
    fontSize: 13,
  },

  chapterTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },

  checkboxRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },

  checkboxText: {
    color: "#333",
    fontSize: 14,
  },

  saveButton: {
    height: 46,
    borderRadius: 12,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
