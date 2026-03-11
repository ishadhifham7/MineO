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
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useGoal, DraftGoal } from "../../../src/features/goal/goal.context";
import { generateGoalApi } from "../../../src/features/goal/goal.api";
import httpClient from "../../../src/lib/http";
import { colors } from "../../constants/colors";

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
    console.log('📡 Sending message to AI:', message.substring(0, 50) + '...');
    
    const response = await httpClient.post("/ai/chat", {
      conversation: conversation.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      message,
    });

    console.log('✅ AI response received');
    return {
      message: response.data.message,
      draftGoal: response.data.draftGoal ?? null,
    };
  } catch (error: any) {
    console.error("❌ AI chat error:", error.message || error);
    
    // Better error messages based on error type
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      console.error('Server error:', status, data);
      
      if (status === 503) {
        throw new Error('AI service is not configured. Please set up GROQ_API_KEY on the server.');
      } else if (status === 401) {
        throw new Error('Please login to use the AI assistant.');
      } else if (status === 400) {
        throw new Error(data.message || 'Invalid request to AI service.');
      } else {
        throw new Error(data.message || `Server error: ${status}`);
      }
    } else if (error.request) {
      console.error('No response from server');
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    } else {
      console.error('Request setup error:', error.message);
      throw new Error(error.message || 'Failed to send message to AI.');
    }
  }
};

// ================= Chat Screen =================
const GoalChatScreen = () => {
  const { setDraftGoal, setCurrentGoal, setGoals } = useGoal();

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
      const { message: aiText, draftGoal: newDraft } = await sendMessageToAI(
        [...conversation, userMessage].map((msg) => ({
          sender: msg.sender,
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
        userMessage.text,
      );

      console.log("=== Frontend Response Debug ===");
      console.log("AI Message:", aiText);
      console.log("DraftGoal received:", newDraft);
      console.log("DraftGoal is null?", newDraft === null);
      console.log("DraftGoal is undefined?", newDraft === undefined);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: "ai",
      };

      setConversation((prev) => [...prev, aiMessage]);

      // If backend returns a draftGoal, store it (but don't navigate yet)
      if (newDraft) {
        console.log("✅ Setting currentDraft:", newDraft);
        setCurrentDraft(newDraft);
        setDraftGoal(newDraft);
      } else {
        console.log("ℹ️ No draftGoal in this response (conversational message)");
      }
    } catch (error: any) {
      console.error('❌ Error in handleSend:', error.message || error);
      
      const errorMessage = error.message || "Failed to get AI response. Try again.";
      
      Alert.alert(
        "AI Error", 
        errorMessage,
        [{ text: "OK" }]
      );
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
            data={conversation}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
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
              style={[styles.sendButton, loading && { opacity: 0.5 }]}
              onPress={handleSend}
              disabled={loading}
            >
              <Text style={styles.sendText}>{loading ? "..." : "Send"}</Text>
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
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.wood.dark,
    borderBottomWidth: 2,
    borderBottomColor: colors.wood.medium,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backText: { color: colors.warmTan, fontSize: 16, fontWeight: "600" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.text.light },
  messageRow: { marginBottom: 14, flexDirection: "row" },
  userRow: { justifyContent: "flex-end" },
  aiRow: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "80%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: { 
    backgroundColor: colors.wood.dark, 
    borderBottomRightRadius: 6,
  },
  aiBubble: { 
    backgroundColor: colors.card, 
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  messageText: { fontSize: 15, lineHeight: 20, color: colors.text.primary },

  // Full-screen goal plan styles
  fullScreenPlanContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  fullScreenScrollView: {
    flex: 1,
  },
  fullScreenScrollContent: {
    paddingBottom: 16,
  },
  planContainer: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.wood.medium,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.wood.dark,
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  stagesHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.wood.darkest,
    marginBottom: 12,
    marginTop: 8,
  },
  stageItem: {
    flexDirection: "row",
    marginBottom: 14,
    paddingLeft: 8,
    paddingVertical: 8,
    paddingRight: 8,
    backgroundColor: colors.cardAlt,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.wood.medium,
  },
  stageNumber: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.wood.dark,
    marginRight: 12,
    width: 24,
  },
  stageTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  stageDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: colors.wood.dark,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    marginTop: 16,
    marginHorizontal: 0,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: colors.text.light,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: colors.card,
    borderTopWidth: 2,
    borderTopColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    flex: 1,
    backgroundColor: colors.softBeige,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    marginRight: 10,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sendButton: {
    backgroundColor: colors.wood.dark,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  sendText: { 
    color: colors.text.light, 
    fontWeight: "700",
    fontSize: 15,
  },
});
