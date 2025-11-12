// screens/DashboardScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Dashboard = ({ navigation, route = {} }) => {
  const currentUser = route?.params?.currentUser || null;

  // If no user data, redirect to login
  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#666", marginBottom: 20 }}>
          Session expired. Please login again.
        </Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.logoutText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {currentUser.username}!</Text>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("ProfileScreen", { currentUser })}
        >
          <Text style={styles.optionText}>👤 Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("ChatScreen", { currentUser })}
        >
          <Text style={styles.optionText}>💬 Messenger</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("Komento", { currentUser })}
        >
          <Text style={styles.optionText}>💭 Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fce4ec",
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#880e4f",
  },
  logoutButton: {
    backgroundColor: "#f48fb1",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 40,
  },
  logoutText: { color: "#fff", fontWeight: "bold" },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "90%",
  },
  optionButton: {
    backgroundColor: "#ce93d8",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    margin: 8,
    minWidth: 120,
    alignItems: "center",
  },
  optionText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default Dashboard;