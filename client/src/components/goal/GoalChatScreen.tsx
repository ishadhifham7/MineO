import React, { useCallback, useEffect, useRef, useState } from "react";
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
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useGoal, DraftGoal } from "../../../src/features/goal/goal.context";
import { generateGoalApi } from "../../../src/features/goal/goal.api";
import httpClient from "../../../src/lib/http";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
};

type ChatResponse = {
  message: string;
  draftGoal?: DraftGoal | null;
};

const sendMessageToAI = async (
  conversation: {
    sender: string;
    role: "user" | "assistant";
    content: string;
  }[],
  message: string,
): Promise<ChatResponse> => {
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
};

const GoalChatScreen = () => {
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const { setDraftGoal, setCurrentGoal, setGoals } = useGoal();
  const chatListRef = useRef<FlatList<Message> | null>(null);

  const [conversation, setConversation] = useState<Message[]>([
    {
      id: "1",
      text: "Let us design your next big goal. What are you working toward?",
      sender: "ai",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentDraft, setCurrentDraft] = useState<DraftGoal | null>(null);
  const [savingGoal, setSavingGoal] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const canSend = inputText.trim().length > 0 && !loading;

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardOpen(true);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardOpen(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    const parent = navigation.getParent();
    if (!parent) {
      return;
    }

    parent.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      parent.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  const scrollToLatestMessage = useCallback((animated = true) => {
    requestAnimationFrame(() => {
      chatListRef.current?.scrollToEnd({ animated });
    });
  }, []);

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

  const renderGoalPlan = (draft: DraftGoal) => {
    return (
      <View style={styles.planContainer}>
        <Text style={styles.planTitle}>{draft.title}</Text>
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

  const handleSend = async () => {
    if (!inputText.trim()) {
      return;
    }

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
        text: aiText || "I am here to help. What would you like to achieve?",
        sender: "ai",
      };

      setConversation((prev) => [...prev, aiMessage]);

      if (newDraft) {
        setCurrentDraft(newDraft);
        setDraftGoal(newDraft);
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text:
          error?.response?.status === 500
            ? "I am having trouble connecting right now. Try asking again in a moment."
            : error?.message?.includes("Network") ||
                error?.message?.includes("timeout")
              ? "Cannot reach the server. Check your connection and try again."
              : "Something went wrong. Please try again.",
        sender: "ai",
      };

      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendToRoadmap = async () => {
    if (!currentDraft) {
      return;
    }

    setSavingGoal(true);
    try {
      const createdGoal = await generateGoalApi(currentDraft);
      setCurrentGoal(createdGoal);
      setGoals((prev) => [...prev, createdGoal]);
      setDraftGoal(null);
      setCurrentDraft(null);

      Alert.alert("Success", "Goal saved successfully!");
      router.push("/tabs/goal/roadmap");
    } catch {
      Alert.alert("Error", "Could not save goal. Please try again.");
    } finally {
      setSavingGoal(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 6 : 0}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={18} color="#2E2A26" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>
              {currentDraft ? "Review Goal Plan" : "Create New Goal"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {currentDraft
                ? "Check your plan before saving"
                : "Chat with AI to generate your roadmap"}
            </Text>
          </View>
        </View>

        {currentDraft ? (
          <View style={styles.fullScreenPlanContainer}>
            <ScrollView
              style={styles.fullScreenScrollView}
              contentContainerStyle={styles.fullScreenScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {renderGoalPlan(currentDraft)}
            </ScrollView>

            <Pressable
              style={styles.saveButton}
              onPress={handleSendToRoadmap}
              disabled={savingGoal}
            >
              {savingGoal ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color="#FFFFFF"
                  />
                  <Text style={styles.saveButtonText}>
                    Save Goal & Open Roadmap
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        ) : (
          <>
            <FlatList
              ref={chatListRef}
              data={conversation}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              onLayout={() => scrollToLatestMessage(false)}
              onContentSizeChange={() => scrollToLatestMessage(true)}
              contentContainerStyle={styles.chatContent}
              showsVerticalScrollIndicator={false}
            />

            <View
              style={[
                styles.inputWrapper,
                {
                  paddingBottom: keyboardOpen
                    ? Math.max(insets.bottom, 8)
                    : Math.max(tabBarHeight - insets.bottom, 12),
                },
              ]}
            >
              <TextInput
                placeholder="Type your message..."
                placeholderTextColor="#8C7F6A"
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                editable={!loading}
              />
              <Pressable
                style={[
                  styles.sendButton,
                  !canSend && styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={!canSend}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
                )}
              </Pressable>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default GoalChatScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F6F1E7",
  },
  container: { flex: 1, backgroundColor: "#F6F1E7" },
  header: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5DFD3",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5DFD3",
    backgroundColor: "#F6F1E7",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  headerTextWrap: {
    flex: 1,
  },
  backText: {
    marginLeft: 2,
    color: "#2E2A26",
    fontSize: 14,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E2A26",
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#8C7F6A",
    fontWeight: "500",
  },
  messageRow: { marginBottom: 14, flexDirection: "row" },
  userRow: { justifyContent: "flex-end" },
  aiRow: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "82%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#8C7F6A",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E5DFD3",
  },
  messageText: { fontSize: 14, lineHeight: 20, color: "#2E2A26" },
  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  fullScreenPlanContainer: {
    flex: 1,
    backgroundColor: "#F6F1E7",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  fullScreenScrollView: {
    flex: 1,
  },
  fullScreenScrollContent: {
    paddingBottom: 12,
  },
  planContainer: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5DFD3",
  },
  planTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E2A26",
    marginBottom: 10,
  },
  planDescription: {
    fontSize: 14,
    color: "#6B645C",
    marginBottom: 16,
    lineHeight: 20,
  },
  stagesHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E2A26",
    marginBottom: 10,
  },
  stageItem: {
    flexDirection: "row",
    marginBottom: 12,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#F6F1E7",
  },
  stageNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8C7F6A",
    marginRight: 8,
    width: 20,
  },
  stageTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E2A26",
    marginBottom: 2,
  },
  stageDescription: {
    fontSize: 13,
    color: "#6B645C",
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: "#2E2A26",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    minHeight: 52,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5DFD3",
  },
  input: {
    flex: 1,
    backgroundColor: "#F6F1E7",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5DFD3",
    paddingHorizontal: 16,
    paddingVertical: 11,
    fontSize: 14,
    marginRight: 10,
    color: "#2E2A26",
  },
  sendButton: {
    backgroundColor: "#111111",
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#111111",
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: "#8E8E8E",
    shadowOpacity: 0,
    elevation: 0,
  },
});
