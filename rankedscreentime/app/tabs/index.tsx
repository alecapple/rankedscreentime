import { View, Text, StyleSheet, ImageBackground, ScrollView } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import ShadowPillButton from "@/assets/login/ShadowPillButton";
import { useRouter } from "expo-router";
const backgroundImage = require("@/assets/images/HomeBg.png");
import WhiteLogo from "@/assets/logos/logoWhiteFilled.svg";
import Rank from "@/assets/ranks/ZENITH_DOOMSCROLLER_2.svg";
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
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <WhiteLogo width={100} height={35} />
        </View>
        <View>
            <Rank width={300} height={300}  fill="#ffffff" />
        </View>

        {/* Add more content here if needed */}

        {/* Sign out button */}
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
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    position: "absolute",
    top: 83,
    left: 25,
  },
  text: {
    fontSize: 22,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    marginTop: 150, // leave space under the logo
  },
  signOutText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#ffffff",
  },
});
