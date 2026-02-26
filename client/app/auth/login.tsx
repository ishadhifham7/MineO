import React, { useState } from 'react';
import { useRouter } from "expo-router";
import { loginUser } from "../../src/services/auth.service";


import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Alert,
} from "react-native";


const LoginScreen: React.FC = () => {
const router = useRouter();
const [email, setEmail] = useState<string>("");
const [password, setPassword] = useState<string>("");

const handleLogin = async () => {

    try {

        if (!email || !password) {
        Alert.alert("Error", "Please enter email and password");
        return;
        }

        await loginUser(email, password);

        Alert.alert("Success", "Logged in successfully");

    // navigate to main app
    router.replace("/tabs/home");

    
    } catch (error: any) {
        Alert.alert("Login Failed", error.message);
    }

    };

    return(
        <View style={styles.container}>
            
            <Text style={styles.title}>Hey,{"\n"}Login Now!</Text>

            
            <Text style={styles.subtitle}>
                I Am A Old User /
                <Text
                    style={styles.createNew}
                    onPress={() => router.push("/auth/signup")}
                    >
                    {" "}Create New
                </Text>
            </Text>

            {/*text area for email */}
            <TextInput
                placeholder="email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            {/*text area for password */}
            <TextInput
                placeholder="Password"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />

            {/* login button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login Now</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#fff",
        justifyContent: "center",
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

export default LoginScreen;