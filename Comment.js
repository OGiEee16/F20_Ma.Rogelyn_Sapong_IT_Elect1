import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  Image,
  Alert,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Comment() {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const flatListRef = useRef(null);
  const translateY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  // Keyboard handling
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const subShow = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(translateY, {
        toValue: -e.endCoordinates.height,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150);
    });

    const subHide = Keyboard.addListener(hideEvent, () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, [translateY]);

  const sendComment = () => {
    if (!input.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      text: input,
      profile: require("./assets/rogelyn.jpg"),
    };
    setComments((prev) => [...prev, newComment]);
    setInput("");
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const deleteComment = (id) => {
    Alert.alert("Delete Comment", "Are you sure you want to delete this comment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setComments((prev) => prev.filter((c) => c.id !== id)),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2563EB" barStyle="light-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Comments</Text>
          </View>

          {/* Comments */}
          <FlatList
            ref={flatListRef}
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentRow}>
                <Image source={item.profile} style={styles.profilePic} />
                <View style={styles.commentBox}>
                  <View style={styles.commentContent}>
                    <Text style={styles.commentText}>{item.text}</Text>
                    <TouchableOpacity onPress={() => deleteComment(item.id)}>
                      <Ionicons name="trash-outline" size={16} color="#888" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            contentContainerStyle={styles.commentsList}
            keyboardShouldPersistTaps="handled"
          />

          {/* Input */}
          <Animated.View style={[styles.inputWrapper, { transform: [{ translateY }] }]}>
            <View style={styles.inputContainer}>
              <TouchableOpacity>
                <Ionicons name="happy-outline" size={22} color="#2563EB" />
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Write a comment..."
                placeholderTextColor="#999"
                value={input}
                onChangeText={setInput}
                returnKeyType="send"
                onSubmitEditing={sendComment}
              />

              <TouchableOpacity style={styles.sendButton} onPress={sendComment}>
                <Ionicons name="send" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 12, // ✅ fixes the top issue
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  commentsList: {
    padding: 10,
    paddingBottom: 80,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  commentBox: {
    backgroundColor: "#F0F2F5",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  commentContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentText: {
    fontSize: 15,
    color: "#111",
    flexShrink: 1,
  },
  inputWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 8 : 5,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: "#2563EB",
    padding: 8,
    borderRadius: 25,
  },
});