import React, { useEffect } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useAuth } from "@/firebase/context/AuthContext";

// Handles redirect after auth session
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "1022454839735-icuh3dfc9s5rg2ejcln6a70ip3f1thm0.apps.googleusercontent.com",
    iosClientId: "1022454839735-9dtoo1irt4p86lovsmods30gp625m0lq.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@sixtychris/zenith",
});
  
  // Redirect if already signed in
  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);

// Firebase login with Google ID token
useEffect(() => {
  if (response?.type === "success") {
    console.log("✅ Google sign-in response received:", response);

    const { idToken } = response.authentication!;
    console.log("🔑 Extracted ID Token:", idToken);

    const credential = GoogleAuthProvider.credential(idToken);

    signInWithCredential(auth, credential)
      .then((userCredential) => {
        console.log("✅ Firebase sign-in successful!");
        console.log("👤 Firebase User:", userCredential.user);
      })
      .catch((error) => {
        console.error("❌ Firebase sign-in failed:", error);
      });
  } else if (response?.type === "error") {
    console.error("❌ Google sign-in error:", response.error);
  }
}, [response]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Zenith</Text>
      <Button
        title="Sign in with Google"
        disabled={!request}
        onPress={() => promptAsync()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
