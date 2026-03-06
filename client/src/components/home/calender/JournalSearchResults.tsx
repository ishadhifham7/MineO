import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { JournalEntryWithBlocks } from "../../../features/journal/journal.types";
import type { TextBlock } from "../../../../types/journal";

// ---- helpers ---------------------------------------------------------------

function extractPreview(blocks: JournalEntryWithBlocks["blocks"]): string {
  const textBlock = blocks.find((b): b is TextBlock => b.type === "text");
  if (!textBlock || !textBlock.text?.trim())
    return "No text preview available.";
  const text = textBlock.text.trim();
  return text.length > 50 ? `${text.slice(0, 50)}…` : text;
}

function formatDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ---- types -----------------------------------------------------------------

interface Props {
  query: string;
  journals: JournalEntryWithBlocks[];
  onSelect: (entry: JournalEntryWithBlocks) => void;
}

// ---- component -------------------------------------------------------------

export default function JournalSearchResults({
  query,
  journals,
  onSelect,
}: Props) {
  const trimmed = query.trim();

  const results = useMemo(() => {
    if (!trimmed) return [];
    const lower = trimmed.toLowerCase();
    return journals.filter((j) => {
      // Journals without a title are excluded from search results
      if (!j.title?.trim()) return false;
      return j.title.toLowerCase().includes(lower);
    });
  }, [trimmed, journals]);

  // Hide entirely when there is no query text
  if (!trimmed) return null;

  return (
    <View style={styles.container}>
      {results.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="search-outline" size={20} color="#B5A993" />
          <Text style={styles.emptyText}>No journals match "{trimmed}"</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={styles.list}
        >
          {results.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <View style={styles.separator} />}
              <TouchableOpacity
                style={styles.item}
                activeOpacity={0.75}
                onPress={() => onSelect(item)}
              >
                <View style={styles.iconWrap}>
                  <Ionicons name="book-outline" size={18} color="#7C6F5B" />
                </View>
                <View style={styles.body}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.title!.trim()}
                  </Text>
                  <Text style={styles.preview} numberOfLines={1}>
                    {extractPreview(item.blocks)}
                  </Text>
                  <Text style={styles.date}>{formatDate(item.date)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={15} color="#C4B9AB" />
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// ---- styles ----------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
    maxHeight: 280,
  },
  list: {
    flexGrow: 0,
  },
  emptyWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
  },
  emptyText: {
    fontSize: 13,
    color: "#9CA3AF",
    flexShrink: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F5F0EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  body: {
    flex: 1,
    marginRight: 8,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E2A26",
  },
  preview: {
    fontSize: 12,
    color: "#7C6F5B",
    fontStyle: "italic",
  },
  date: {
    fontSize: 11,
    color: "#B5A993",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#F0EDE8",
    marginLeft: 60,
  },
});
