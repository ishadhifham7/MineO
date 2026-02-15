import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  onLogin?: () => void;
  onSignup?: () => void;
};

const HomeScreen: React.FC<Props> = ({ onLogin, onSignup }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>

            <TouchableOpacity style={styles.button} onPress={onLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.secondary]}
                onPress={onSignup}
            >
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 40,
    },
    button: {
        width: "70%",
        height: 48,
        borderRadius: 8,
        backgroundColor: "#4f46e5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    secondary: {
        backgroundColor: "#22c55e",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});


