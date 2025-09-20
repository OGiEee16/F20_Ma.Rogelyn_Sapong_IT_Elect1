import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";

export default function Messenger() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const flatListRef = useRef(null);

  const sendMessage = () => {
    if (input.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "me",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const deleteMessage = (id) => {
    Alert.alert("Delete Message", "Do you want to delete this message?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== id)
          );
        },
      },
    ]);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onLongPress={() => deleteMessage(item.id)}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.message,
          item.sender === "me" ? styles.myMessage : styles.otherMessage,
          index === 0 && styles.firstMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            index === 0 && styles.firstMessageText,
          ]}
        >
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No messages yet. Start chatting!</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  chatContainer: { padding: 12, flexGrow: 1 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { fontSize: 16, color: "#999", fontStyle: "italic" },
  message: {
    padding: 12,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: "75%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  myMessage: {
    backgroundColor: "#A7F3D0", // mint green
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#E0E7FF", // soft indigo
    alignSelf: "flex-start",
  },
  messageText: { fontSize: 15, color: "#333" },
  firstMessageText: { fontSize: 18, fontWeight: "bold", color: "#111" },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#6366F1",
    paddingHorizontal: 22,
    justifyContent: "center",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  sendText: { color: "#fff", fontWeight: "bold" },
});