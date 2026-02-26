import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push("/tabs/profile")}>
          <Ionicons name="person-circle-outline" size={48} color="#111" />
        </Pressable>
      </View> 
      
      <View style={styles.content}>
        <Text style={styles.greeting}>Welcome Back!</Text>
        <Text style={styles.subText}>Tap your profile to manage settings</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: "flex-start",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
});
