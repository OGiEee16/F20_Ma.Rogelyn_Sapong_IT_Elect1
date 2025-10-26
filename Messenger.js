import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Messenger() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollViewRef = useRef();
  const navigation = useNavigation();

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = { id: Date.now().toString(), text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0078FF" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // ✅ keeps input above keyboard
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // adjust offset for iOS
      >
        {/* 🔵 HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>

          <Image source={require("./assets/rogelyn.jpg")} style={styles.profilePic} />
          <Text style={styles.name}>Ma. Rogelyn Sapong</Text>

          <View style={styles.headerIcons}>
            <Ionicons name="call-outline" size={22} color="white" style={styles.icon} />
            <Ionicons name="videocam-outline" size={22} color="white" style={styles.icon} />
            <Ionicons name="information-circle-outline" size={22} color="white" />
          </View>
        </View>

        {/* ⚪ MESSAGES */}
        <ScrollView
          style={styles.messagesArea}
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={styles.messageBubble}>
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* 💬 INPUT AREA (STAYS ABOVE KEYBOARD) */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0078FF",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // 🔵 HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0078FF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 8,
    paddingBottom: 10,
    paddingHorizontal: 12,
  },
  profilePic: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: 10,
  },
  name: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 10,
    flex: 1,
  },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: 15 },

  // ⚪ MESSAGES
  messagesArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  messageBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#0078FF",
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  messageText: { color: "#fff", fontSize: 15 },

  // 💬 INPUT
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 42,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sendButton: {
    backgroundColor: "#0078FF",
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
  },
});