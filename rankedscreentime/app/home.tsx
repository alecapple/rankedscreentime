// app/home.tsx
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { simulateUserMatches } from "@/scripts/simulateUserMatches";
import { auth } from "@/firebase/firebaseConfig";

export default function HomeScreen() {
    const handleSimulation = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            console.error("No user signed in!");
            return;
        }

        const uid = currentUser.uid;
        console.log("Running simulation for:", uid);

        try {
            await simulateUserMatches(uid);
        } catch (err) {
            console.error("Simulation error:", err);
        }
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            console.log("User signed out");
            Alert.alert("Signed Out", "You have been signed out successfully.");
        } catch (err) {
            console.error("Sign out error:", err);
            Alert.alert("Error", "Failed to sign out. Try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Run Simulation" onPress={handleSimulation} />
            <View style={{ height: 20 }} />
            <Button title="Sign Out" onPress={handleSignOut} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 22,
        fontWeight: "600",
    },
});
