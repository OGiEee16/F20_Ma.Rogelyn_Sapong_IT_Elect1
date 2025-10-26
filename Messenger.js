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
      <StatusBar barStyle="light-content" backgroundColor="#C026D3" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backBtn}>
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

        {/* MESSAGES */}
        <ScrollView
          style={styles.messagesArea}
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={styles.messageRow}>
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
              <Image source={require("./assets/rogelyn.jpg")} style={styles.userPic} />
            </View>
          ))}
        </ScrollView>

        {/* INPUT */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
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
  safeArea: { flex: 1, backgroundColor: "#C026D3" }, // purple-pink top
  container: { flex: 1, backgroundColor: "#FFF" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C026D3", // purple-pink header
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 5 : 8,
    paddingBottom: 10,
    paddingHorizontal: 12,
  },
  backBtn: { marginRight: 4 },
  profilePic: { width: 35, height: 35, borderRadius: 50, marginLeft: 10 },
  name: { color: "white", fontSize: 17, fontWeight: "600", marginLeft: 10, flex: 1 },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: 15 },

  messagesArea: { flex: 1, backgroundColor: "#FFF", paddingHorizontal: 10 },
  messageRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  messageBubble: {
    backgroundColor: "#EC4899", // hot pink bubble
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    maxWidth: "75%",
    marginRight: 5,
  },
  messageText: { color: "#FFF", fontSize: 15 },
  userPic: { width: 30, height: 30, borderRadius: 50 },

  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDF2F8", // soft pink
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 42,
    borderWidth: 1,
    borderColor: "#F9A8D4", // light pink border
  },
  sendButton: {
    backgroundColor: "#C026D3",
    borderRadius: 25,
    padding: 10,
    marginLeft: 8,
  },
});