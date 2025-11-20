// screens/LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSQLiteContext } from "expo-sqlite";

export default function LoginScreen({ navigation }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const db = useSQLiteContext();

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    try {
      const user = await db.getFirstAsync(
        "SELECT id, username FROM users WHERE username = ? AND password = ?",
        [form.username.trim(), form.password]
      );
      if (user) {
        navigation.replace("Dashboard", { currentUser: user });
      } else {
        Alert.alert("Error", "Invalid username or password");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 100}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={form.username}
          onChangeText={(t) => setForm({ ...form, username: t })}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={(t) => setForm({ ...form, password: t })}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 30, color: "#000" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    color: "#000"
  },
  button: {
    backgroundColor: "#000",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { color: "#555", marginTop: 20, fontSize: 14 }
});
