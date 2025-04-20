import { View, Text, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import ShadowPillButton from "@/assets/login/ShadowPillButton";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/"); // go back to login screen
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={styles.container} screenOptions={{ headerShown: false }}>
      <Text style={styles.text}>🎉 You’re logged in!</Text>

      <ShadowPillButton
        onPress={handleSignOut}
        backgroundColor="#35466f"
        borderColor="#9ce8d5"
        width={200}
        height={50}
        style={{ marginTop: 40 }}
      >
        <Text style={styles.signOutText}>SIGN OUT</Text>
      </ShadowPillButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111824",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    fontSize: 22,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
  },
  signOutText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#ffffff",
  },
});
