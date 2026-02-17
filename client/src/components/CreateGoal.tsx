import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

type Props = {
  onContinue: (goal: string) => void;
  onBack: () => void;
};

const CreateGoal: React.FC<Props> = ({ onContinue, onBack }) => {
  const [goal, setGoal] = useState("");
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 24 }}>What do you want to work towards?</Text>
      <TextInput
        value={goal}
        onChangeText={setGoal}
        placeholder="E.g. Build a consistent morning routine"
        style={{
          width: "100%",
          minHeight: 48,
          borderColor: "#63D1E6",
          borderWidth: 2,
          borderRadius: 14,
          padding: 12,
          fontSize: 16,
          marginBottom: 24,
        }}
        autoFocus
      />
      <Pressable
        onPress={() => goal.trim() && onContinue(goal.trim())}
        style={({ pressed }) => [{
          backgroundColor: goal.trim() ? "#63D1E6" : "#BFE8F3",
          paddingVertical: 14,
          paddingHorizontal: 32,
          borderRadius: 14,
          opacity: pressed ? 0.85 : 1,
        }]}
        disabled={!goal.trim()}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Continue</Text>
      </Pressable>
      <Text onPress={onBack} style={{ color: 'blue', marginTop: 32 }}>Back</Text>
    </View>
  );
};

export default CreateGoal;
