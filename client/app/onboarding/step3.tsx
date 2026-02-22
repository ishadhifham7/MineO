import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function OnboardingStep3() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Onboarding — Step 3</Text>
      <Pressable
        className="mt-6 px-4 py-2 bg-green-500 rounded"
        onPress={() => router.push("/onboarding/step4")}
      >
        <Text className="text-white">Next</Text>
      </Pressable>
    </View>
  );
}
