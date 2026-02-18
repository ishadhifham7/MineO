import React, { useState } from "react";
import { useRouter } from "expo-router";
import { signupUser } from "../../../src/services/auth.service";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
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

        router.replace("/login");


      }catch (error: any){
        Alert.alert("Signup Failed", error.message);
      }
    
    };


  return(
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backText}>← Go Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>


            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              />


            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              />


            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              />


            <TextInput
              style={styles.input}
              placeholder="Date of Birth (YYYY-MM-DD)"
              placeholderTextColor="#999"
              value={dob}
              onChangeText={setDob}
              />


            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>

    );
};
export default SignupScreen;

const styles = StyleSheet.create({

safeArea: {
  flex: 1,
},
container: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f2f2f2",
},
card: {
  marginHorizontal: 24,
  padding: 24,
  borderRadius: 12,
  backgroundColor: "#ffffff",
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 5,
},
title: {
  fontSize: 26,
  fontWeight: "700",
  marginBottom: 6,
  color: "#222",
  textAlign: "center",
},
subtitle: {
  fontSize: 14,
  color: "#666",
  marginBottom: 24,
  textAlign: "center",
},
input: {
  height: 48,
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  paddingHorizontal: 12,
  marginBottom: 16,
  color: "#000",
},
button: {
  height: 48,
  borderRadius: 8,
  backgroundColor: "#4f46e5",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 8,
},
buttonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
},
forgotText: {
  marginTop: 16,
  textAlign: "center",
  color: "#4f46e5",
  fontSize: 14,
},
backText: {
  color: "#4f46e5",
  marginBottom: 12,
  fontSize: 14,
},
});