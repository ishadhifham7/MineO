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
import { colors } from "../../constants/colors";

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

const GoalChatScreen = ({ onBack }: { onBack: () => void }) => {
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
        <Pressable onPress={onBack}>
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
    backgroundColor: colors.background,
  },

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

  backText: {
    color: colors.warmTan,
    fontSize: 16,
    fontWeight: "600",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.light,
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

  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.text.primary,
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
