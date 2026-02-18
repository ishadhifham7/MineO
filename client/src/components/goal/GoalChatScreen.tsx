import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
};

const demoMessages: Message[] = [
  {
    id: "1",
    text: "Hi 👋 Let’s design your next big goal. What are you working toward?",
    sender: "ai",
  },
  {
    id: "2",
    text: "I want to become a cloud engineer.",
    sender: "user",
  },
  {
    id: "3",
    text: "Great choice. Do you already have experience with cloud platforms?",
    sender: "ai",
  },
];

const GoalChatScreen = () => {
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
        data={demoMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Bar */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Type your message..."
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />
        <Pressable style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default GoalChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

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

  backText: {
    color: "#63D1E6",
    fontSize: 16,
    fontWeight: "500",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  messageRow: {
    marginBottom: 14,
    flexDirection: "row",
  },

  userRow: {
    justifyContent: "flex-end",
  },

  aiRow: {
    justifyContent: "flex-start",
  },

  bubble: {
    maxWidth: "80%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
  },

  userBubble: {
    backgroundColor: "#63D1E6",
    borderBottomRightRadius: 6,
  },

  aiBubble: {
    backgroundColor: "#E5E7EB",
    borderBottomLeftRadius: 6,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: "#111827",
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
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },

  sendText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
