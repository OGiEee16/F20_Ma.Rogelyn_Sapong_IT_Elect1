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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

export default function Comment() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const flatListRef = useRef(null);

  const addComment = () => {
    if (comment.trim() === "") return;

    setComments((prev) => [...prev, comment]);
    setComment("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const deleteComment = (index) => {
    Alert.alert("Delete Comment", "Are you sure you want to delete this comment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setComments((prev) => prev.filter((_, i) => i !== index));
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.header}>Simple Comment App</Text>

          <FlatList
            ref={flatListRef}
            data={comments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onLongPress={() => deleteComment(index)}
                delayLongPress={500}
              >
                <View style={styles.commentBox}>
                  <Text style={styles.commentText}>{item}</Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 10 }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            keyboardShouldPersistTaps="handled" // 👈 important
          />

          {/* Input Row */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Write a comment..."
              value={comment}
              onChangeText={setComment}
              onSubmitEditing={addComment}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.button} onPress={addComment}>
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#FFFFFF" },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#374151",
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
    padding: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 25,
    padding: 10,
    backgroundColor: "#F9FAFB",
  },
  button: {
    marginLeft: 10,
    backgroundColor: "#10B981",
    paddingHorizontal: 22,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  commentBox: {
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 15,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  commentText: { fontSize: 15, color: "#111827" },
});