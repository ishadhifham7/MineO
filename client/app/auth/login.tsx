import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      // TODO: Call auth service
      setTimeout(() => {
        setLoading(false);
        router.replace("/tabs/home");
      }, 1000);
    } catch (error) {
      setLoading(false);
      alert("Login failed");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-12">
        <View className="mb-8">
          <Text className="text-4xl font-bold text-gray-900 mb-2">MineO</Text>
          <Text className="text-base text-gray-600">Track your goals and habits</Text>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Password</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg bg-gray-50">
            <TextInput
              className="flex-1 px-4 py-3"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity className="px-4" onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className={`py-3 rounded-lg mb-4 ${
            loading ? "bg-blue-300" : "bg-blue-500"
          }`}
        >
          <Text className="text-center text-white font-bold text-base">
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text className="text-center text-gray-600">
            Don't have an account?{" "}
            <Text className="text-blue-500 font-semibold">Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
