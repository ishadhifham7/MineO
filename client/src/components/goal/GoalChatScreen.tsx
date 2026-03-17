import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGoal, DraftGoal } from "../../../src/features/goal/goal.context";
import { generateGoalApi } from "../../../src/features/goal/goal.api";
import httpClient from "../../../src/lib/http";

// ================= Types =================
type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
};

type ChatResponse = {
  message: string;
  draftGoal?: DraftGoal | null;
};

// ================= AI Chat API =================
const sendMessageToAI = async (
  conversation: {
    sender: string;
    role: "user" | "assistant";
    content: string;
  }[],
  message: string,
): Promise<ChatResponse> => {
  try {
    const response = await httpClient.post("/ai/chat", {
      conversation: conversation.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      message,
    });

    return {
      message: response.data.message,
      draftGoal: response.data.draftGoal ?? null,
    };
  } catch (error) {
    console.error("AI chat error:", error);
    throw error;
  }
};

// ================= Chat Screen =================
const GoalChatScreen = () => {
  const { setDraftGoal, setCurrentGoal, setGoals } = useGoal();
  const chatListRef = useRef<FlatList<Message> | null>(null);

  const [conversation, setConversation] = useState<Message[]>([
    {
      id: "1",
      text: "Hi 👋 Let's design your next big goal. What are you working toward?",
      sender: "ai",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentDraft, setCurrentDraft] = useState<DraftGoal | null>(null);
  const [savingGoal, setSavingGoal] = useState(false);
  const canSend = inputText.trim().length > 0 && !loading;

  const scrollToLatestMessage = useCallback((animated = true) => {
    requestAnimationFrame(() => {
      chatListRef.current?.scrollToEnd({ animated });
    });
  }, []);

  // Render formatted goal plan
  const renderGoalPlan = (draft: DraftGoal) => {
    return (
      <View style={styles.planContainer}>
        <Text style={styles.planTitle}>📋 {draft.title}</Text>
        <Text style={styles.planDescription}>{draft.description}</Text>

        <Text style={styles.stagesHeader}>Stages:</Text>
        {draft.stages.map((stage, index) => (
          <View key={index} style={styles.stageItem}>
            <Text style={styles.stageNumber}>{stage.order}.</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.stageTitle}>{stage.title}</Text>
              <Text style={styles.stageDescription}>{stage.description}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  // Render chat bubble
  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === "user";

    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
        <View
          style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  // Send message
  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
    };

    setConversation((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      console.log("📤 Sending message to AI...");
      const { message: aiText, draftGoal: newDraft } = await sendMessageToAI(
        [...conversation, userMessage].map((msg) => ({
          sender: msg.sender,
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
        userMessage.text,
      );

      console.log("=== Frontend Response Debug ===");
      console.log("AI Message:", aiText?.substring(0, 100));
      console.log("DraftGoal received:", newDraft ? "YES" : "NO");

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText || "I'm here to help! What would you like to achieve?",
        sender: "ai",
      };

      setConversation((prev) => [...prev, aiMessage]);

      // If backend returns a draftGoal, store it (but don't navigate yet)
      if (newDraft) {
        console.log("✅ Setting currentDraft:", newDraft.title);
        setCurrentDraft(newDraft);
        setDraftGoal(newDraft);
      } else {
        console.log("💬 Conversational response (no goal draft)");
      }
    } catch (error: any) {
      console.error("❌ AI chat error:", error);

      // Show user-friendly error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text:
          error.response?.status === 500
            ? "I'm having trouble connecting right now 😅 Try asking me again, or you can create a goal manually!"
            : error.message?.includes("Network") ||
                error.message?.includes("timeout")
              ? "Can't reach the server. Please check your connection and try again."
              : "Oops! Something went wrong. Please try again.",
        sender: "ai",
      };

      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Save goal and navigate to roadmap
  const handleSendToRoadmap = async () => {
    if (!currentDraft) return;

    setSavingGoal(true);
    try {
      const createdGoal = await generateGoalApi(currentDraft);
      setCurrentGoal(createdGoal);
      setGoals((prev) => [...prev, createdGoal]);
      setDraftGoal(null);
      setCurrentDraft(null);

      Alert.alert("Success", "Goal saved successfully!");
      router.push("/tabs/goal/roadmap");
    } catch (error) {
      console.error("Failed to save goal:", error);
      Alert.alert("Error", "Could not save goal. Please try again.");
    } finally {
      setSavingGoal(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          {currentDraft ? "Review Your Goal" : "Create New Goal"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Show full-screen plan when draft exists */}
      {currentDraft ? (
        <View style={styles.fullScreenPlanContainer}>
          <ScrollView
            style={styles.fullScreenScrollView}
            contentContainerStyle={styles.fullScreenScrollContent}
            showsVerticalScrollIndicator={true}
          >
            {renderGoalPlan(currentDraft)}
          </ScrollView>

          <Pressable
            style={[styles.saveButton, savingGoal && { opacity: 0.7 }]}
            onPress={handleSendToRoadmap}
            disabled={savingGoal}
          >
            {savingGoal ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Plan</Text>
            )}
          </Pressable>
        </View>
      ) : (
        <>
          {/* Chat */}
          <FlatList
            ref={chatListRef}
            data={conversation}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            onLayout={() => scrollToLatestMessage(false)}
            onContentSizeChange={() => scrollToLatestMessage(true)}
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
          />

          {/* Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              editable={!loading}
            />
            <Pressable
              style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!canSend}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="paper-plane" size={20} color="#FFFFFF" />
              )}
            </Pressable>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default GoalChatScreen;

// ================= Styles =================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backText: { color: "#63D1E6", fontSize: 16, fontWeight: "500" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  messageRow: { marginBottom: 14, flexDirection: "row" },
  userRow: { justifyContent: "flex-end" },
  aiRow: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "80%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
  },
  userBubble: { backgroundColor: "#63D1E6", borderBottomRightRadius: 6 },
  aiBubble: { backgroundColor: "#E5E7EB", borderBottomLeftRadius: 6 },
  messageText: { fontSize: 15, lineHeight: 20, color: "#111827" },

  // Full-screen goal plan styles
  fullScreenPlanContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },
  fullScreenScrollView: {
    flex: 1,
  },
  fullScreenScrollContent: {
    paddingBottom: 16,
  },
  planContainer: {
    backgroundColor: "#F0F9FF",
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#63D1E6",
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 16,
    lineHeight: 20,
  },
  stagesHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  stageItem: {
    flexDirection: "row",
    marginBottom: 12,
    paddingLeft: 8,
  },
  stageNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#63D1E6",
    marginRight: 8,
    width: 20,
  },
  stageTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  stageDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: "#63D1E6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    marginTop: 16,
    marginHorizontal: 0,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    marginRight: 10,
    color: "#111827",
  },
  sendButton: {
    backgroundColor: "#63D1E6",
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#63D1E6",
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: "#B3E8F2",
    shadowOpacity: 0,
    elevation: 0,
  },
});
