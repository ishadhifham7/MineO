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
const SLIDER_HEIGHT = SCREEN_HEIGHT * 0.55;

type Chapter = {
  id: string;
  title: string;
};

type Props = {
  visible: boolean;
  chapters: Chapter[];
  onClose: () => void;
};

export function ChapterSlider({ visible, chapters, onClose }: Props) {
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

  /* ---------------- render ---------------- */

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Background Blur */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
      </Pressable>

      {/* Slider */}
      <Animated.View style={[styles.slider, { transform: [{ translateY }] }]}>
        {/* Subject Input */}
        <TextInput
          placeholder="Subject"
          value={subject}
          onChangeText={setSubject}
          style={styles.input}
          placeholderTextColor="#999"
        />

        {/* Add to timeline */}
        <View style={styles.checkboxRow}>
          <Checkbox value={addToTimeline} onValueChange={setAddToTimeline} />
          <Text style={styles.checkboxText}>Add to timeline</Text>
        </View>

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
    backgroundColor: "#111",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
  },

  input: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#1c1c1e",
    color: "#fff",
    marginBottom: 14,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  checkboxText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 14,
  },

  chapterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  disabledGrid: {
    opacity: 0.35,
  },

  chapterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#2a2a2c",
  },

  chapterSelected: {
    backgroundColor: "#4A90E2",
  },

  chapterText: {
    color: "#ccc",
    fontSize: 13,
  },

  chapterTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
});
