import React, { useState } from "react";
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
} from "react-native";
import { router } from "expo-router";
import { useGoal, DraftGoal } from "../../../src/features/goal/goal.context";
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
  const { setDraftGoal } = useGoal();

  const [conversation, setConversation] = useState<Message[]>([
    {
      id: "1",
      text: "Hi 👋 Let’s design your next big goal. What are you working toward?",
      sender: "ai",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

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
      const { message: aiText, draftGoal: newDraft } = await sendMessageToAI(
        [...conversation, userMessage].map((msg) => ({
          sender: msg.sender,
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
        userMessage.text,
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: "ai",
      };

      setConversation((prev) => [...prev, aiMessage]);

      // ✅ If backend explicitly returns draftGoal, store it and navigate
      if (newDraft) {
        setDraftGoal(newDraft);
        router.push("/src/features/goal/screens/GoalRoadmapScreen");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to get AI response. Try again.");
    } finally {
      setLoading(false);
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
        <Text style={styles.headerTitle}>Create New Goal</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Chat */}
      <FlatList
        data={conversation}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
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
          style={[styles.sendButton, loading && { opacity: 0.7 }]}
          onPress={handleSend}
          disabled={loading}
        >
          <Text style={styles.sendText}>{loading ? "Sending..." : "Send"}</Text>
        </Pressable>
      </View>
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
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendText: { color: "#FFFFFF", fontWeight: "600" },
});
