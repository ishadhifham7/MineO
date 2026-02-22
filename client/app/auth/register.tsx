import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();

  // This page is intentionally minimal — after account creation
  // users are sent into the onboarding flow at /onboarding/step1
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-green-500">Register Screen</Text>

      <Pressable
        className="mt-6 px-4 py-2 bg-green-500 rounded"
        onPress={() => router.push("/onboarding/step1")}
      >
        <Text className="text-white">Create account (dev)</Text>
      </Pressable>
    </View>
  );
}
