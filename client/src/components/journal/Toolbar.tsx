import { useState, useRef } from "react";
import { View, Pressable, StyleSheet, Text, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

type Align = "left" | "center" | "right";
type SliderType = "fontSize" | "lineHeight" | "letterSpacing" | null;

type ToolbarProps = {
  visible: boolean;

  fontSize: number;
  lineHeight: number;
  letterSpacing: number;

  onToggleBold: () => void;
  onToggleItalic: () => void;
  onToggleUnderline: () => void;
  onChangeColor: (color: string) => void;
  onAlign: (align: Align) => void;

  onChangeFontSize: (v: number) => void;
  onChangeLineHeight: (v: number) => void;
  onChangeLetterSpacing: (v: number) => void;
};

export function Toolbar({
  visible,
  fontSize,
  lineHeight,
  letterSpacing,
  onToggleBold,
  onToggleItalic,
  onToggleUnderline,
  onChangeColor,
  onAlign,
  onChangeFontSize,
  onChangeLineHeight,
  onChangeLetterSpacing,
}: ToolbarProps) {
  if (!visible) return null;

  /* ---------- slider logic ---------- */

  const [activeSlider, setActiveSlider] = useState<SliderType>(null);
  const anim = useRef(new Animated.Value(0)).current;

  const toggleSlider = (type: SliderType) => {
    if (type === activeSlider) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: false,
      }).start(() => setActiveSlider(null));
    } else {
      setActiveSlider(type);
      Animated.timing(anim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: false,
      }).start();
    }
  };

  const height = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 56], // 🔥 reduced
  });

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      {/* MAIN TOOL ROW */}
      <View style={styles.mainRow}>
        <Icon name="format-bold" onPress={onToggleBold} />
        <Icon name="format-italic" onPress={onToggleItalic} />
        <Icon name="format-underline" onPress={onToggleUnderline} />
        <Icon
          name="format-color-text"
          onPress={() => onChangeColor("#4A90E2")}
        />
        <Icon name="format-align-left" onPress={() => onAlign("left")} />
        <Icon name="format-align-center" onPress={() => onAlign("center")} />
        <Icon name="format-align-right" onPress={() => onAlign("right")} />
      </View>

      {/* SLIDER ICONS */}
      <View style={styles.sliderIconRow}>
        <Icon
          name="text-fields"
          active={activeSlider === "fontSize"}
          onPress={() => toggleSlider("fontSize")}
        />
        <Icon
          name="format-line-spacing"
          active={activeSlider === "lineHeight"}
          onPress={() => toggleSlider("lineHeight")}
        />
        <Icon
          name="space-bar"
          active={activeSlider === "letterSpacing"}
          onPress={() => toggleSlider("letterSpacing")}
        />
      </View>

      {/* SLIDER DROPDOWN */}
      {activeSlider && (
        <Animated.View style={[styles.sliderPanel, { height, opacity }]}>
          {activeSlider === "fontSize" && (
            <SliderBlock
              label="Font size"
              value={fontSize}
              min={10}
              max={64}
              step={1}
              onChange={onChangeFontSize}
            />
          )}

          {activeSlider === "lineHeight" && (
            <SliderBlock
              label="Line height"
              value={lineHeight}
              min={14}
              max={90}
              step={1}
              onChange={onChangeLineHeight}
            />
          )}

          {activeSlider === "letterSpacing" && (
            <SliderBlock
              label="Letter spacing"
              value={letterSpacing}
              min={-2}
              max={10}
              step={0.5}
              onChange={onChangeLetterSpacing}
            />
          )}
        </Animated.View>
      )}
    </View>
  );
}

/* ---------- helpers ---------- */

function Icon({
  name,
  onPress,
  active,
}: {
  name: any;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.icon, active && styles.activeIcon]}
    >
      <MaterialIcons
        name={name}
        size={22}
        color={active ? "#4A90E2" : "#111"}
      />
    </Pressable>
  );
}

function SliderBlock({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <View>
      <Text style={styles.sliderLabel}>
        {label}: {value}
      </Text>
      <Slider
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        onValueChange={onChange}
      />
    </View>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 4,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    zIndex: 1000,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sliderIconRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
  },
  icon: {
    padding: 6,
    borderRadius: 6,
  },
  activeIcon: {
    backgroundColor: "#EAF2FD",
  },
  sliderPanel: {
    overflow: "hidden",
    marginTop: 4, // 🔥 reduced gap
  },
  sliderLabel: {
    fontSize: 11,
    color: "#444",
    marginBottom: 2,
  },
});
