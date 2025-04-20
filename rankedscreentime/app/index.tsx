import React, { useState, useEffect } from "react";
import { View, Button, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useRouter, useRootNavigationState } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useAuth } from "@/firebase/context/AuthContext";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuth();
    const router = useRouter();
    const rootNavigationState = useRootNavigationState();

    // Redirect if user is already authenticated
    useEffect(() => {
        if (!rootNavigationState?.key) return;

        if (user) {
            router.replace("/home");
        }
    }, [user, rootNavigationState]);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        try {
            setIsLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            // No need to navigate here as the useEffect will handle redirection
            // once the user state is updated by AuthContext
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to sign in";
            Alert.alert("Authentication Error", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                testID="email-input"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                testID="password-input"
            />

            <View style={styles.buttonContainer}>
                <Button
                    title={isLoading ? "Signing in..." : "Sign In"}
                    onPress={handleSignIn}
                    disabled={isLoading}
                    testID="sign-in-button"
                />
            </View>

            <View style={styles.linkContainer}>
                <Text
                    style={styles.link}
                    onPress={() => router.push("/sign-up")}
                >
                    Don't have an account? Sign Up
                </Text>

                <Text
                    style={styles.link}
                    onPress={() => router.push("/forgot-password")}
                >
                    Forgot Password?
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
    },
    buttonContainer: {
        marginVertical: 10,
    },
    linkContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    link: {
        color: "#0066cc",
        marginVertical: 5,
    }
});