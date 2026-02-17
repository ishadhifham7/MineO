import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import GradientSparkle from "../../src/components/goal/GradientSparkle";

export default function NewGoal() {
  const [goalText, setGoalText] = useState("");

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>New Goal</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Content with keyboard avoiding */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Sparkle icon */}
        <View style={styles.sparkleWrap}>
          <GradientSparkle size={64} />
        </View>

        {/* Title and subtitle */}
        <Text style={styles.title}>Start Your Journey</Text>
        <Text style={styles.subtitle}>
          Create your first goal and let AI help you break it down into
          achievable steps
        </Text>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Input and button section */}
        <View style={styles.bottomSection}>
          <View style={styles.inputWrap}>
            <Text style={styles.label}>What do you want to work towards?</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g Build a constant study time.."
              placeholderTextColor="#999"
              value={goalText}
              onChangeText={setGoalText}
            />
          </View>

          {/* Submit button (shown only when text is entered) */}
          {goalText.trim().length > 0 && (
            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                pressed && styles.submitBtnPressed,
              ]}
              onPress={() => {
                // TODO: Submit goal to backend
                console.log("Goal submitted:", goalText);
                router.back();
              }}
            >
              <Text style={styles.submitBtnText}>Create Goal</Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },

  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },

  container: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 40,
  },

  sparkleWrap: {
    alignItems: "center",
    marginBottom: 32,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111",
    textAlign: "center",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },

  inputWrap: {
    marginBottom: 12,
  },

  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
    marginBottom: 12,
  },

  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#3B82F6",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111",
  },

  bottomSection: {
    width: "100%",
  },

  submitBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },

  submitBtnPressed: {
    opacity: 0.88,
  },

  submitBtnText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
