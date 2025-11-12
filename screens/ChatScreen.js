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

  // Load other users
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

  // Load messages
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
      // scroll to bottom
      setTimeout(() => {
        if (flatListRef.current && msgs.length > 0) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    } catch (err) {
      console.log("Error loading messages:", err);
    }
  };

  // Auto-refresh messages every 2 sec
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
          style={{ width: size, height: size, borderRadius: size / 2, marginRight: 10, borderWidth: 2, borderColor: "#ce93d8" }}
        />
      );
    }
    return (
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: "#ce93d8", justifyContent: "center", alignItems: "center", marginRight: 10 }}>
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: size / 2.5 }}>
          {user?.username?.charAt(0).toUpperCase() || "?"}
        </Text>
      </View>
    );
  };

  if (!currentUser) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
      <View style={{ backgroundColor: "#ce93d8", padding: 15, paddingTop: 50 }}>
        <TouchableOpacity onPress={() => selectedUser ? backToUserList() : navigation.goBack()}>
          <Text style={{ color: "#fff", fontSize: 14, marginBottom: 5 }}>
            {selectedUser ? "← Back to Chats" : "← Back to Dashboard"}
          </Text>
        </TouchableOpacity>
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
          {selectedUser ? selectedUser.username : "Messenger"}
        </Text>
      </View>

      {!selectedUser ? (
        // User list
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#eee" }} onPress={() => selectUser(item)}>
              {renderProfilePic(item, 60)}
              <View>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.username}</Text>
                <Text style={{ fontSize: 13, color: "#999" }}>Tap to chat</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No other users yet.</Text>}
        />
      ) : (
        // Chat window
        <>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isMine = item.sender_id === currentUser.id;
              return (
                <View style={{ flexDirection: "row", justifyContent: isMine ? "flex-end" : "flex-start", marginVertical: 5, paddingHorizontal: 10 }}>
                  {!isMine && renderProfilePic(selectedUser, 50)}
                  <View style={{
                    backgroundColor: isMine ? "#f8bbd0" : "#fce4ec",
                    padding: 10,
                    borderRadius: 15,
                    maxWidth: "70%"
                  }}>
                    <Text style={{ fontWeight: "bold", color: "#880e4f" }}>{isMine ? "You" : selectedUser.username}</Text>
                    <Text style={{ color: "#333", marginVertical: 2 }}>{item.message}</Text>
                    <Text style={{ fontSize: 10, color: "#666", textAlign: "right" }}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                  {isMine && renderProfilePic(currentUser, 50)}
                </View>
              );
            }}
            contentContainerStyle={{ paddingVertical: 10 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />

          {/* Input */}
          <View style={{ flexDirection: "row", padding: 10, borderTopWidth: 1, borderColor: "#ddd", alignItems: "center", backgroundColor: "#fff" }}>
            <TextInput
              style={{ flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, backgroundColor: "#f9f9f9" }}
              placeholder="Type a message..."
              value={text}
              onChangeText={setText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={{ backgroundColor: text.trim() ? "#ce93d8" : "#ddd", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25 }}
              onPress={sendMessage}
              disabled={!text.trim()}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
