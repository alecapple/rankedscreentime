import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  Dimensions,
  StyleSheet,
  Animated,
} from "react-native";
import LoginLogo from "@/assets/logos/loginLogo.svg";
import ShadowPillButton from "@/assets/login/ShadowPillButton";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter, useRootNavigationState } from "expo-router";
import { useAuth } from "@/firebase/context/AuthContext";
import * as Haptics from "expo-haptics";

// Dimensions and pattern setup
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const TILE_WIDTH = 200;
const TILE_HEIGHT = 50;
const NUM_ROWS = Math.ceil(screenHeight / TILE_HEIGHT);
const NUM_COLS = Math.ceil(screenWidth / TILE_WIDTH) + 1;

const BackgroundPattern = () => (
  <View style={StyleSheet.absoluteFill}>
    {Array.from({ length: NUM_ROWS }).map((_, rowIndex) => (
      <View key={rowIndex} style={{ flexDirection: "row", height: TILE_HEIGHT }}>
        {Array.from({ length: NUM_COLS }).map((_, colIndex) => (
          <Image
            key={colIndex}
            source={require("@/assets/logos/whiteLogo.png")}
            style={{ width: TILE_WIDTH, height: TILE_HEIGHT, opacity: 0.06 }}
            resizeMode="contain"
          />
        ))}
      </View>
    ))}
  </View>
);

export default function Index() {
  const [screen, setScreen] = useState<"landing" | "signin" | "signup">("landing");

  return (
    <View style={styles.container}>
      <BackgroundPattern />
      {screen === "landing" && (
        <LandingScreen
          onLogin={() => setScreen("signin")}
          onSignUp={() => setScreen("signup")}
        />
      )}
      {screen === "signin" && <SignInForm />}
      {screen === "signup" && <SignUpForm />}
    </View>
  );
}

const LandingScreen = ({ onLogin, onSignUp }: { onLogin: () => void; onSignUp: () => void }) => (
  <View style={styles.content}>
    <LoginLogo width={289} height={303} />
    <View style={styles.buttonGroup}>
      <ShadowPillButton
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onLogin();
        }}
        backgroundColor="#9ce8d5"
        borderColor="#9ce8d5"
        width={341}
        height={50}
      >
        <Text style={styles.loginText}>LOG IN</Text>
      </ShadowPillButton>

      <ShadowPillButton
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onSignUp();
        }}
        backgroundColor="#35466f"
        borderColor="#9ce8d5"
        width={341}
        height={50}
        style={{ marginTop: 20 }}
      >
        <Text style={styles.signupText}>SIGN UP</Text>
      </ShadowPillButton>
    </View>
  </View>
);

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key) return;
    if (user) {
      router.replace("/tabs");
    }
  }, [user, rootNavigationState]);

  const handleSignIn = async () => {
    if (!email || !password) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to sign in";
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Authentication Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.formWrapper}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        placeholderTextColor="#000000"
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholderTextColor="#000000"
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <ShadowPillButton
          onPress={handleSignIn}
          width={391}
          height={50}
          backgroundColor="#9ce8d5"
          borderColor="#9ce8d5"
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
          <Text style={styles.loginText}>{isLoading ? "SIGNING IN..." : "SIGN IN"}</Text>
        </ShadowPillButton>
      </View>
    </View>
  );
};

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        router.replace("/tabs");
      });
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : "Signup failed";
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Signup Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.formWrapper}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholderTextColor="#000000"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholderTextColor="#000000"
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        placeholderTextColor="#000000" 
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <ShadowPillButton
          onPress={handleSignUp}
          width={391}
          height={50}
          backgroundColor="#35466f"
          borderColor="#9ce8d5"
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
          <Text style={styles.signupText}>
            {isLoading ? "SIGNING UP..." : "SIGN UP"}
          </Text>
        </ShadowPillButton>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111824",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 151,
    zIndex: 1,
  },
  buttonGroup: {
    marginTop: 100,
    alignItems: "center",
  },
  loginText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000000",
  },
  signupText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#ffffff",
  },
  formWrapper: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#ffffff",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
  },
  buttonContainer: {
    marginVertical: 10,
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    color: "#9ce8d5",
    marginVertical: 5,
  },
});
