import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💬 Welcome to ChatConnect</Text>
      <Text style={styles.subtitle}>Choose your destination:</Text>

      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={() => navigation.navigate("Messenger")}
      >
        <Text style={styles.buttonText}>Go to Messenger</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate("Comment")}
      >
        <Text style={styles.buttonText}>Go to Comments</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDF2F8",
    padding: 24,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#C026D3", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#6B7280", marginBottom: 30 },
  buttonPrimary: {
    width: "80%",
    backgroundColor: "#C026D3",
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 15,
    elevation: 6,
  },
  buttonSecondary: {
    width: "80%",
    backgroundColor: "#EC4899",
    paddingVertical: 14,
    borderRadius: 25,
    elevation: 6,
  },
  buttonText: { color: "#FFF", textAlign: "center", fontWeight: "bold", fontSize: 16 },
});