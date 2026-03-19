import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Mood = "good" | "okay" | "nope";

export default function DailyCheckIn() {
  // Replace this with your real goals from store/db
  const goals = useMemo(
    () => [
      { id: "1", title: "dsaASd", sub: "Foundation & Awareness" },
      { id: "2", title: "Gym", sub: "Fitness & Health" },
      { id: "3", title: "Reading", sub: "Knowledge & Growth" },
    ],
    []
  );

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [note, setNote] = useState("");

  const selectedGoal = goals.find((g) => g.id === selectedGoalId);

  const canSubmit = Boolean(selectedGoalId) && Boolean(mood);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backFab}>
            <Ionicons name="arrow-back" size={20} color="#111" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.hTitle}>Daily Check-in</Text>
            <Text style={styles.hSub}>How are you showing up today?</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* STEP 1: Choose goal (always visible) */}
          <Text style={styles.sectionLabel}>Which goal did you work on?</Text>

          {goals.map((g) => {
            const active = g.id === selectedGoalId;
            return (
              <Pressable
                key={g.id}
                onPress={() => {
                  setSelectedGoalId(g.id);
                  setMood(null); // reset mood when changing goal
                }}
                style={({ pressed }) => [
                  styles.goalItem,
                  active && styles.goalItemActive,
                  pressed && { opacity: 0.96 },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.goalTitle}>{g.title}</Text>
                  <Text style={styles.goalSub}>{g.sub}</Text>
                </View>

                {active ? (
                  <Ionicons name="checkmark-circle" size={22} color="#49B7D0" />
                ) : (
                  <Ionicons name="chevron-forward" size={18} color="#9A9A9A" />
                )}
              </Pressable>
            );
          })}

          {/* STEP 2: Reactions (ONLY after goal selected) */}
          {selectedGoalId && (
            <>
              <Text style={[styles.sectionLabel, { marginTop: 18 }]}>
                How did it go?
              </Text>

              <View style={styles.moodRow}>
                <MoodCard
                  emoji="😊"
                  label="Good"
                  active={mood === "good"}
                  onPress={() => setMood("good")}
                />
                <MoodCard
                  emoji="😌"
                  label="Okay"
                  active={mood === "okay"}
                  onPress={() => setMood("okay")}
                />
                <MoodCard
                  emoji="💭"
                  label="Didn't happen"
                  active={mood === "nope"}
                  onPress={() => setMood("nope")}
                />
              </View>

              <Text style={[styles.sectionLabel, { marginTop: 18 }]}>
                Anything you want to note?{" "}
                <Text style={styles.optional}>(optional)</Text>
              </Text>

              <View style={styles.noteWrap}>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder={`E.g., "Had more energy today" or "Felt challenging but good"`}
                  placeholderTextColor="#9A9A9A"
                  style={styles.noteInput}
                  multiline
                />
              </View>

              <View style={styles.messagePill}>
                <Text style={styles.messageText}>
                  Amazing work! You're building momentum.
                </Text>
              </View>
            </>
          )}

          {/* Little spacer so content doesn't hide behind button */}
          <View style={{ height: 90 }} />
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottomBar}>
          <Pressable
            disabled={!canSubmit}
            onPress={() => {
              console.log("Check-in:", {
                goal: selectedGoal,
                mood,
                note,
              });
              router.back();
            }}
            style={({ pressed }) => [
              styles.cta,
              pressed && { opacity: 0.92 },
              !canSubmit && { opacity: 0.5 },
            ]}
          >
            <Ionicons name="heart-outline" size={18} color="#fff" />
            <Text style={styles.ctaText}>Complete Check-in</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MoodCard({
  emoji,
  label,
  active,
  onPress,
}: {
  emoji: string;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.moodCard,
        active && styles.moodCardActive,
        pressed && { opacity: 0.95 },
      ]}
    >
      <Text style={styles.moodEmoji}>{emoji}</Text>
      <Text style={[styles.moodLabel, active && { color: "#fff" }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B1220" },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 14,
    paddingHorizontal: 18,
  },

  backFab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F3F7FF",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  headerText: { marginLeft: 14, paddingTop: 2 },

  hTitle: { fontSize: 26, fontWeight: "800", color: "#F3F7FF" },
  hSub: { marginTop: 6, fontSize: 14, color: "#6B6B6B" },

  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },

  sectionLabel: {
    fontSize: 13,
    color: "#6B6B6B",
    fontWeight: "800",
    marginBottom: 10,
  },

  optional: { fontWeight: "700", color: "#8A8A8A" },

  goalItem: {
    backgroundColor: "#0F172A",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#F3F7FF",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  goalItemActive: {
    borderWidth: 1,
    borderColor: "#BFE8F3",
    backgroundColor: "#111A2E",
  },

  goalTitle: { fontSize: 16, fontWeight: "900", color: "#F3F7FF" },
  goalSub: { marginTop: 4, fontSize: 12, color: "#6B6B6B", fontWeight: "600" },

  moodRow: { flexDirection: "row", gap: 12 },

  moodCard: {
    flex: 1,
    height: 84,
    backgroundColor: "#0F172A",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F3F7FF",
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    paddingTop: 6,
  },

  moodCardActive: { backgroundColor: "#8DD7A1" },

  moodEmoji: { fontSize: 28, marginBottom: 8 },
  moodLabel: { fontSize: 12, fontWeight: "900", color: "#DCE6F6" },

  noteWrap: {
    backgroundColor: "#0F172A",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#F3F7FF",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  noteInput: {
    minHeight: 54,
    fontSize: 13,
    color: "#F3F7FF",
    fontWeight: "600",
    lineHeight: 18,
  },

  messagePill: {
    marginTop: 16,
    backgroundColor: "#111A2E",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#CFE9D7",
  },

  messageText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "800",
    color: "#2F6B3C",
  },

  bottomBar: {
    paddingHorizontal: 18,
    paddingBottom: Platform.OS === "ios" ? 24 : 18,
    paddingTop: 10,
    backgroundColor: "transparent",
  },

  cta: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#63D1E6",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    shadowColor: "#F3F7FF",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 9 },
    elevation: 7,
  },

  ctaText: { fontSize: 16, fontWeight: "900", color: "#FFFFFF" },
});


