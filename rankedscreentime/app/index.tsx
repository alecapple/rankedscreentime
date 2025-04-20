import React from "react";
import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import LoginLogo from "@/assets/logos/loginLogo.svg";
import ShadowPillButton from "@/assets/login/ShadowPillButton";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const TILE_WIDTH = 200;
const TILE_HEIGHT = 50;
const NUM_ROWS = Math.ceil(screenHeight / TILE_HEIGHT);
const NUM_COLS = Math.ceil(screenWidth / TILE_WIDTH) + 1;

const BackgroundPattern = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      {Array.from({ length: NUM_ROWS }).map((_, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            flexDirection: "row",
            height: TILE_HEIGHT,
            // transform: [
            //   {
            //     translateX: rowIndex % 2 === 0 ? 0 : TILE_WIDTH / 2, // stagger
            //   },
            // ],
          }}
        >
          {Array.from({ length: NUM_COLS }).map((_, colIndex) => (
            <Image
              key={colIndex}
              source={require("@/assets/logos/whiteLogo.png")}
              style={{
                width: TILE_WIDTH,
                height: TILE_HEIGHT,
                opacity: 0.06, // slightly bolder than before
              }}
              resizeMode="contain"
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export default function Index() {
  return (
    <View style={styles.container}>
      {/* Dark background */}
      <View style={StyleSheet.absoluteFill} />

      {/* Pattern overlay */}
      <BackgroundPattern />

      {/* Foreground content */}
      <View style={styles.content}>
        <LoginLogo width={289} height={303} />

        <View style={styles.buttonGroup}>
          <ShadowPillButton
            onPress={() => console.log("Login pressed")}
            backgroundColor="#9ce8d5"
            borderColor="#9ce8d5"
            width={341}
            height={50}
          >
            <Text style={styles.loginText}>LOG IN</Text>
          </ShadowPillButton>

          <ShadowPillButton
            onPress={() => console.log("Sign Up pressed")}
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
    </View>
  );
}

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
});
