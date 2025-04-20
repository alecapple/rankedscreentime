import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import WhiteLogo from "@/assets/logos/logoWhite.svg";
const backgroundImage = require("@/assets/images/ChallengeBg.png");

export default function Challenge() {
  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Fixed top-left logo */}
        <View style={styles.logoContainer}>
          <WhiteLogo width={100} height={35}  />
        </View>

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
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logoContainer: {
    position: "absolute",
    top: 83,
    left: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
    marginTop: 150, // ensures it's below the logo visually
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
  },
});
