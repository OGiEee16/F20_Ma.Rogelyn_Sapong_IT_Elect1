import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Messenger from "./Messenger";
import Comment from "./Comment";

export default function App() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.container}>
          {/* Messenger Section (70%) */}
          <View style={styles.messengerSection}>
            <Messenger />
          </View>

          {/* Comment Section (30%) */}
          <View style={styles.commentSection}>
            <Comment />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  messengerSection: {
    flex: 7, // 70%
    borderBottomWidth: 1,
    borderColor: "#CCC",
  },
  commentSection: {
    flex: 3, // 30%
  },
});

const style= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EBF7", // light gradient-like bg
  },
  messengerSection: {
    flex: 7,
    borderBottomWidth: 2,
    borderColor: "#B0BEC5",
    backgroundColor: "#FDFEFF", // clean white for chat
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 4,
  },
  commentSection: {
    flex: 3,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 5,
    elevation: 6,
  },
});



