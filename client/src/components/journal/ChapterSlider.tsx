import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
} from "react-native";
import { BlurView } from "expo-blur";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SLIDER_HEIGHT = SCREEN_HEIGHT * 0.2;

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave?: (metadata: { title: string; isPinnedToTimeline: boolean }) => void;
};

export function ChapterSlider({ visible, onClose, onSave }: Props) {
  const translateY = useRef(new Animated.Value(SLIDER_HEIGHT)).current;

  const [subject, setSubject] = useState("");

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

  const handleSave = async () => {
    if (onSave) {
      await onSave({
        title: subject,
        isPinnedToTimeline: false,
      });
    }
    onClose();
  };

  /* ---------------- render ---------------- */

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        {/* Full-screen subtle blur/tint backdrop */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <BlurView
            intensity={16}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.backdropTint} />
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
            placeholderTextColor="#7A7267"
          />

          {/* Save button */}
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

/* ---------------- styles ---------------- */

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdropTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(46, 42, 38, 0.14)",
  },
  slider: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SLIDER_HEIGHT,
    backgroundColor: "#F6F1E7",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2E2A26",
    marginBottom: 6,
  },

  input: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#EFE7DA",
    color: "#2E2A26",
    marginBottom: 18,
  },

  saveButton: {
    height: 46,
    borderRadius: 12,
    backgroundColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
