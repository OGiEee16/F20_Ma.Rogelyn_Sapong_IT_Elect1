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

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) =>
      Animated.timing(translateY, {
        toValue: -e.endCoordinates.height,
        duration: 200,
        useNativeDriver: true,
      }).start()
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

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
    Alert.alert("Delete Comment", "Are you sure?", [
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
      <StatusBar backgroundColor="#C2185B" barStyle="light-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Comment Section</Text>
          </View>

          {/* PROFILE + IMAGE */}
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Image source={require("./assets/rogelyn.jpg")} style={styles.avatar} />
              <View>
                <Text style={styles.postName}>Ma. Rogelyn Sapong</Text>
                <Text style={styles.postTime}>2h ago</Text>
              </View>
            </View>
            <Image source={require("./assets/family.jpeg")} style={styles.postImage} />
          </View>

          {/* COMMENTS LIST */}
          <Text style={styles.commentTitle}>Comments</Text>
          <FlatList
            ref={flatListRef}
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentRow}>
                <Image source={item.profile} style={styles.commentAvatar} />
                <View style={styles.commentBox}>
                  <Text style={styles.commentName}>Ma. Rogelyn Sapong</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                  <View style={styles.commentActions}>
                    <Text style={styles.time}>Just now</Text>
                    <Text style={styles.like}>1 Like</Text>
                    <Text style={styles.reply}>Reply</Text>
                    <TouchableOpacity onPress={() => deleteComment(item.id)}>
                      <Ionicons name="trash" size={16} color="#C2185B" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            contentContainerStyle={styles.commentsList}
          />

          {/* INPUT */}
          <Animated.View style={[styles.inputWrapper, { transform: [{ translateY }] }]}>
            <View style={styles.inputContainer}>
              <Image source={require("./assets/rogelyn.jpg")} style={styles.commentAvatar} />
              <TextInput
                style={styles.input}
                placeholder="Write a comment..."
                placeholderTextColor="#999"
                value={input}
                onChangeText={setInput}
                onSubmitEditing={sendComment}
              />
              <Ionicons name="happy-outline" size={22} color="#9C27B0" />
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
    backgroundColor: "#9C27B0",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 12,
    paddingBottom: 10,
    paddingHorizontal: 12,
  },
  backBtn: { marginRight: 8 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  postContainer: { backgroundColor: "#fff", padding: 10 },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postName: { fontWeight: "bold", fontSize: 16 },
  postTime: { color: "#666", fontSize: 12 },
  postImage: { width: "100%", height: 300, borderRadius: 10, marginTop: 5 },
  commentTitle: { marginLeft: 10, fontWeight: "bold", fontSize: 16, marginTop: 8 },
  commentsList: { paddingHorizontal: 10, paddingBottom: 80 },
  commentRow: { flexDirection: "row", marginVertical: 8 },
  commentAvatar: { width: 34, height: 34, borderRadius: 17, marginRight: 8 },
  commentBox: {
    backgroundColor: "#F3E5F5",
    borderRadius: 15,
    padding: 10,
    flex: 1,
  },
  commentName: { fontWeight: "bold", marginBottom: 2 },
  commentText: { color: "#111" },
  commentActions: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 10 },
  time: { color: "#888", fontSize: 12 },
  like: { fontWeight: "bold", fontSize: 12, color: "#AD1457" },
  reply: { color: "#9C27B0", fontWeight: "bold", fontSize: 12 },
  inputWrapper: { position: "absolute", bottom: 0, left: 0, right: 0 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    padding: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E1BEE7",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 8 : 6,
    marginRight: 8,
  },
});