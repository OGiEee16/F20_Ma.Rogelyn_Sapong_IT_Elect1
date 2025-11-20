// screens/ChatScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";

const ChatScreen = ({ navigation, route }) => {
  const currentUser = route?.params?.currentUser;
  const db = useSQLiteContext();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const flatListRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;

    const loadUsers = async () => {
      try {
        const allUsers = await db.getAllAsync(
          "SELECT id, username, profile_picture FROM users WHERE id != ?",
          [currentUser.id]
        );
        setUsers(allUsers);
      } catch (err) {
        console.log("Error loading users:", err);
      }
    };
    loadUsers();
  }, [currentUser]);

  const loadMessages = async (otherUser) => {
    try {
      const msgs = await db.getAllAsync(
        `SELECT * FROM messages
         WHERE (sender_id = ? AND receiver_id = ?)
            OR (sender_id = ? AND receiver_id = ?)
         ORDER BY timestamp ASC`,
        [currentUser.id, otherUser.id, otherUser.id, currentUser.id]
      );
      setMessages(msgs);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      console.log("Error loading messages:", err);
    }
  };

  useEffect(() => {
    if (!selectedUser) return;
    const interval = setInterval(() => loadMessages(selectedUser), 2000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  const selectUser = (user) => {
    setSelectedUser(user);
    loadMessages(user);
  };

  const backToUserList = () => {
    setSelectedUser(null);
    setMessages([]);
    setText("");
  };

  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    try {
      const result = await db.runAsync(
        "INSERT INTO messages (sender_id, receiver_id, message, isRead) VALUES (?, ?, ?, 0)",
        [currentUser.id, selectedUser.id, text.trim()]
      );

      const newMsg = {
        id: result.lastInsertRowId,
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        message: text,
        timestamp: new Date().toISOString(),
        isRead: 0,
      };

      setMessages((prev) => [...prev, newMsg]);
      setText("");
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      console.log("Error sending message:", err);
    }
  };

  const renderProfilePic = (user, size = 50) => {
    if (user?.profile_picture) {
      return (
        <Image
          source={{ uri: user.profile_picture }}
          style={{ width: size, height: size, borderRadius: size / 2, marginRight: 10 }}
        />
      );
    }
    return (
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: "#000", justifyContent: "center", alignItems: "center", marginRight: 10 }}>
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: size / 2.5 }}>
          {user?.username?.charAt(0).toUpperCase() || "?"}
        </Text>
      </View>
    );
  };

  if (!currentUser) {
    return (
      <View style={styles.center}>
        <Text>User data missing. Go back and try again.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 100}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => selectedUser ? backToUserList() : navigation.goBack()}>
          <Text style={styles.backText}>{selectedUser ? "← Back to Chats" : "← Back to Dashboard"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedUser ? selectedUser.username : "Messenger"}</Text>
      </View>

      {!selectedUser ? (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.userItem} onPress={() => selectUser(item)}>
              {renderProfilePic(item, 60)}
              <Text style={styles.username}>{item.username}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No other users yet.</Text>}
        />
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isMine = item.sender_id === currentUser.id;
              return (
                <View style={{ flexDirection: "row", justifyContent: isMine ? "flex-end" : "flex-start", marginVertical: 5, paddingHorizontal: 10 }}>
                  {!isMine && renderProfilePic(selectedUser, 40)}
                  <View style={[styles.messageBubble, { backgroundColor: isMine ? "#000" : "#eee" }]}>
                    <Text style={{ color: isMine ? "#fff" : "#000", fontWeight: "bold" }}>{isMine ? "You" : selectedUser.username}</Text>
                    <Text style={{ color: isMine ? "#fff" : "#000" }}>{item.message}</Text>
                  </View>
                  {isMine && renderProfilePic(currentUser, 40)}
                </View>
              );
            }}
            contentContainerStyle={{ paddingVertical: 10 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              value={text}
              onChangeText={setText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={[styles.sendButton, { backgroundColor: text.trim() ? "#000" : "#ccc" }]} onPress={sendMessage} disabled={!text.trim()}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: { backgroundColor: "#fff", padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  backText: { color: "#000", marginBottom: 5 },
  headerTitle: { color: "#000", fontSize: 20, fontWeight: "bold" },
  userItem: { flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
  username: { fontWeight: "bold", fontSize: 16 },
  messageBubble: { borderRadius: 15, padding: 10, maxWidth: "70%" },
  inputContainer: { flexDirection: "row", padding: 10, borderTopWidth: 1, borderColor: "#ddd", alignItems: "center", backgroundColor: "#fff" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, backgroundColor: "#f9f9f9" },
  sendButton: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default ChatScreen;
