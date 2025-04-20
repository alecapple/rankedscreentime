import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Challenge() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>challenge</Text>
      <Text style={styles.subtitle}>This is a placeholder screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
  },
});
