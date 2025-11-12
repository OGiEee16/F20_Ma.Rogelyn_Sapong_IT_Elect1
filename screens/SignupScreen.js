// screens/SignupScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSQLiteContext } from "expo-sqlite";

export default function SignupScreen({ navigation }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const db = useSQLiteContext();

  const handleSignup = async () => {
    if (!form.username || !form.password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      await db.runAsync("INSERT INTO users (username, password) VALUES (?, ?)", [form.username.trim(), form.password]);
      Alert.alert("Success", "Account created!", [{ text: "OK", onPress: () => navigation.navigate("Login") }]);
      setForm({ username: "", password: "" });
    } catch (err) {
      if (err.message.includes("UNIQUE")) {
        Alert.alert("Error", "Username already exists");
      } else {
        console.error(err);
        Alert.alert("Error", "Something went wrong");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 100}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 30, color: "#333" },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, fontSize: 16, marginBottom: 15, backgroundColor: "#f9f9f9" },
  button: { backgroundColor: "#D16BA5", width: "100%", paddingVertical: 14, borderRadius: 25, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { color: "#D16BA5", marginTop: 20, fontSize: 14 },
});
