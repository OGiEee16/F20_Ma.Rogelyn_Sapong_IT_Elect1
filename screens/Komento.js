// screens/Komento.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  FlatList,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";

export default function Komento({ route = {}, navigation }) {
  const currentUser = route?.params?.currentUser;
  const db = useSQLiteContext();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [userProfiles, setUserProfiles] = useState({});

  const loadComments = async () => {
    try {
      const results = await db.getAllAsync(
        "SELECT * FROM comments ORDER BY timestamp ASC",
        []
      );
      setComments(results);

      const userIds = [...new Set(results.map((c) => c.user_id))];
      const profiles = {};
      for (const userId of userIds) {
        const user = await db.getFirstAsync(
          "SELECT id, username, profile_picture FROM users WHERE id = ?",
          [userId]
        );
        if (user) profiles[userId] = user;
      }
      setUserProfiles(profiles);
    } catch (err) {
      console.log("Error loading comments:", err);
    }
  };

  useEffect(() => {
    loadComments();
    const interval = setInterval(loadComments, 3000);
    return () => clearInterval(interval);
  }, []);

  const addComment = async () => {
    if (!text.trim() || !currentUser) return;
    try {
      await db.runAsync(
        "INSERT INTO comments (user_id, username, comment) VALUES (?, ?, ?)",
        [currentUser.id, currentUser.username, text.trim()]
      );
      setText("");
      loadComments();
    } catch (err) {
      console.log("Error adding comment:", err);
    }
  };

  const renderProfilePic = (userId, size = 36) => {
    const user = userProfiles[userId];
    if (user?.profile_picture) {
      return <Image source={{ uri: user.profile_picture }} style={{ width: size, height: size, borderRadius: size / 2, marginRight: 8 }} />;
    }
    return (
      <View style={[styles.placeholderPic, { width: size, height: size, borderRadius: size / 2, marginRight: 8 }]}>
        <Text style={styles.placeholderText}>{user?.username?.charAt(0).toUpperCase() || "?"}</Text>
      </View>
    );
  };

  if (!currentUser) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#666", marginBottom: 20 }}>Session expired. Please login again.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace("Login")}>
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            {renderProfilePic(item.user_id)}
            <View style={styles.commentBubble}>
              <Text style={styles.commentUsername}>{item.username}</Text>
              <Text style={styles.commentTextContent}>{item.comment}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noCommentsText}>No comments yet. Be the first!</Text>}
      />

      <View style={styles.inputContainer}>
        {renderProfilePic(currentUser.id, 36)}
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={[styles.sendButton, { backgroundColor: text.trim() ? "#000" : "#ccc" }]} onPress={addComment} disabled={!text.trim()}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Post</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  commentItem: { flexDirection: "row", marginBottom: 10, alignItems: "flex-start" },
  commentBubble: { backgroundColor: "#f0f0f0", borderRadius: 15, padding: 10, flex: 1 },
  commentUsername: { fontWeight: "bold", marginBottom: 2, color: "#000" },
  commentTextContent: { color: "#000" },
  noCommentsText: { textAlign: "center", color: "#666", marginVertical: 20, fontStyle: "italic" },
  inputContainer: { flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderColor: "#ddd", padding: 10, backgroundColor: "#fff" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 25, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10, backgroundColor: "#f9f9f9" },
  sendButton: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 25, alignItems: "center" },
  placeholderPic: { backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  placeholderText: { color: "#fff", fontWeight: "bold" },
  button: { backgroundColor: "#000", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
