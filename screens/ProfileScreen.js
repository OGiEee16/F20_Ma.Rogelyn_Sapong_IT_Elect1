// screens/ProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSQLiteContext } from "expo-sqlite";

export default function ProfileScreen({ navigation, route = {} }) {
  const currentUser = route?.params?.currentUser;
  const db = useSQLiteContext();

  const [profilePic, setProfilePic] = useState(null);
  const [selfies, setSelfies] = useState([]);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    if (!currentUser) return;
    loadUserData();
    loadSelfies();
  }, [currentUser]);

  const loadUserData = async () => {
    try {
      const user = await db.getFirstAsync("SELECT profile_picture FROM users WHERE id = ?", [currentUser.id]);
      if (user?.profile_picture) setProfilePic(user.profile_picture);
    } catch (err) {
      console.log("Error loading user data:", err);
    }
  };

  const loadSelfies = async () => {
    try {
      const posts = await db.getAllAsync(
        "SELECT * FROM selfie_posts WHERE user_id = ? ORDER BY timestamp DESC",
        [currentUser.id]
      );
      setSelfies(posts);
    } catch (err) {
      console.log("Error loading selfies:", err);
    }
  };

  const requestPermission = async (type) => {
    const result = type === "camera"
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (result.status !== "granted") {
      Alert.alert("Permission needed", `Access required to use ${type}`);
      return false;
    }
    return true;
  };

  const pickProfilePicture = async () => {
    const hasPermission = await requestPermission("gallery");
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.5 });
      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        await db.runAsync("UPDATE users SET profile_picture = ? WHERE id = ?", [imageUri, currentUser.id]);
        setProfilePic(imageUri);
        currentUser.profile_picture = imageUri;
        Alert.alert("Success", "Profile picture updated!");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to update profile picture");
    }
  };

  const postSelfie = async (fromCamera = false) => {
    const hasPermission = await requestPermission(fromCamera ? "camera" : "gallery");
    if (!hasPermission) return;

    try {
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.5 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5 });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const textCaption = caption.trim() || (fromCamera ? "Posted a selfie 📸" : "Posted a photo 📷");

        await db.runAsync("INSERT INTO selfie_posts (user_id, username, image_uri, caption) VALUES (?, ?, ?, ?)", [currentUser.id, currentUser.username, imageUri, caption.trim() || null]);
        await db.runAsync("INSERT INTO comments (user_id, username, comment) VALUES (?, ?, ?)", [currentUser.id, currentUser.username, textCaption]);

        setCaption("");
        loadSelfies();
        Alert.alert("Success", "Photo posted to Comment Section!");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to post photo");
    }
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
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#fff" }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickProfilePicture}>
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.profilePic} />
            ) : (
              <View style={styles.placeholderPic}>
                <Text style={styles.placeholderText}>{currentUser.username.charAt(0).toUpperCase()}</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.username}>{currentUser.username}</Text>
          <Text style={styles.infoText}>Appears in Messenger & Comments</Text>
        </View>

        <View style={styles.selfieSection}>
          <TextInput style={styles.captionInput} placeholder="Add a caption (optional)" value={caption} onChangeText={setCaption} multiline />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cameraButton} onPress={() => postSelfie(true)}>
              <Text style={styles.buttonText}>📷 Take Selfie</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.galleryButton} onPress={() => postSelfie(false)}>
              <Text style={styles.buttonText}>🖼️ From Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>My Selfies ({selfies.length})</Text>
          {selfies.length === 0 ? <Text style={styles.emptyText}>No selfies yet.</Text> : (
            <FlatList
              data={selfies}
              scrollEnabled={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.postCard}>
                  <Image source={{ uri: item.image_uri }} style={styles.selfieImage} />
                  {item.caption && <Text style={styles.caption}>{item.caption}</Text>}
                  <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  button: { backgroundColor: "#000", padding: 12, borderRadius: 25 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  profileSection: { alignItems: "center", padding: 20, borderBottomWidth: 1, borderColor: "#eee" },
  profilePic: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  placeholderPic: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#000", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  placeholderText: { color: "#fff", fontWeight: "bold", fontSize: 48 },
  username: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  infoText: { fontSize: 12, color: "#666", fontStyle: "italic" },
  selfieSection: { padding: 20, borderBottomWidth: 1, borderColor: "#eee" },
  captionInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 15, padding: 10, marginBottom: 15, backgroundColor: "#f9f9f9" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  cameraButton: { backgroundColor: "#000", flex: 1, marginRight: 10, padding: 12, borderRadius: 25, alignItems: "center" },
  galleryButton: { backgroundColor: "#555", flex: 1, padding: 12, borderRadius: 25, alignItems: "center" },
  postsSection: { padding: 20 },
  sectionTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  emptyText: { textAlign: "center", color: "#666" },
  postCard: { backgroundColor: "#f0f0f0", borderRadius: 15, padding: 15, marginBottom: 15 },
  selfieImage: { width: "100%", height: 250, borderRadius: 10, marginBottom: 10 },
  caption: { fontSize: 16, color: "#000", marginBottom: 5 },
  timestamp: { fontSize: 12, color: "#666" },
});
