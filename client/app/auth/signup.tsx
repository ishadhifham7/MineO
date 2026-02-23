import React, { useState } from "react";
import { useRouter } from "expo-router";
import { signupUser } from "../../src/services/auth.service";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";



const SignupScreen: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [dob, setDob] = useState<string>("");


    const handleSignup = async () => {
      
      try{
        await signupUser({ name, email, password, dob });

        Alert.alert("Success", "Account created. Please login.");

        router.replace("/auth/login");


      }catch (error: any){
        Alert.alert("Signup Failed", error.message);
      }
    
    };


  return(
    <View style={styles.container}>

      {/* Go back button */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>← Go Back</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Create{"\n"}Account</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Already have an account?
        <Text
          style={styles.createNew}
          onPress={() => router.replace("/auth/login")}
        >
          {" "}Login
        </Text>
      </Text>

      {/* text area for user name */}
      <TextInput
        placeholder="Full name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      {/* Email */}
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* Password */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      {/* Signup button */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: "#fff",
      justifyContent: "center",
    },
    backText: {
      marginBottom: 20,
      fontSize: 14,
      color: "#555",
    },
    title: {
      fontSize: 32,
      fontWeight: "600",
      marginBottom: 20,
    },
    subtitle: {
      color: "#777",
      marginBottom: 30,
    },
    createNew: {
      color: "#000",
      fontWeight: "600",
    },
    input: {
      backgroundColor: "#f2f2f2",
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
    },
    button: {
      backgroundColor: "#E6E26A",
      padding: 18,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 30,
    },
    buttonText: {
      fontWeight: "600",
    },
});