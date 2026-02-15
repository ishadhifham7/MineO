import React, { useState } from 'react';


import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
SafeAreaView,
Alert,
} from "react-native";

type Props = {
  onBack: () => void;
};

const LoginScreen: React.FC<Props> = ({ onBack }) => {
const [email, setEmail] = useState<string>("");
const [password, setPassword] = useState<string>("");




return(
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <View style={styles.card}>

            <TouchableOpacity onPress={onBack}>
                <Text style={styles.backText}>← Go Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to your account</Text>
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

            <TouchableOpacity style={styles.button} onPress={onBack}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>


            <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot your password?</Text>
            </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
);
};
export default LoginScreen;


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