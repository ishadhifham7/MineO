import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
  x: number;
  y: number;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onClose: () => void;
  /** When true (long-press on empty canvas), only Paste is active;
   *  Copy and Delete are shown but visually disabled. */
  pasteOnly?: boolean;
};

export function ContextMenu({
  x,
  y,
  onCopy,
  onPaste,
  onDelete,
  onClose,
  pasteOnly = false,
}: Props) {
  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <View style={[styles.menu, { top: y + 10, left: x - 80 }]}>
        {/* Copy */}
        <Pressable
          style={[styles.item, pasteOnly && styles.itemDisabled]}
          onPress={pasteOnly ? undefined : onCopy}
        >
          <Text style={[styles.text, pasteOnly && styles.textDisabled]}>
            Copy
          </Text>
        </Pressable>

        {/* Paste */}
        <Pressable style={styles.item} onPress={onPaste}>
          <Text style={styles.text}>Paste</Text>
        </Pressable>

        {/* Delete */}
        <Pressable
          style={[styles.item, pasteOnly && styles.itemDisabled]}
          onPress={pasteOnly ? undefined : onDelete}
        >
          <Text
            style={[
              styles.text,
              { color: "#ff3b30" },
              pasteOnly && styles.textDisabled,
            ]}
          >
            Delete
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  menu: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 6,
    width: 160,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  itemDisabled: {
    opacity: 0.3,
  },
  text: {
    fontSize: 16,
    color: "#111",
  },
  textDisabled: {
    color: "#aaa",
  },
});
