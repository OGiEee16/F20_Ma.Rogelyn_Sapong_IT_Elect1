// screens/DashboardScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import ProfileScreen from "./ProfileScreen";
import ChatScreen from "./ChatScreen";
import KomentoScreen from "./Komento";

const Dashboard = ({ navigation, route = {} }) => {
  const currentUser = route?.params?.currentUser || null;
  const [activeOption, setActiveOption] = useState("Profile");
  const [collapsed, setCollapsed] = useState(false);

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.sessionText}>
          Session expired. Please login again.
        </Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.logoutText}>Go to Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const menuOptions = [
    { name: "Profile", icon: "👤" },
    { name: "Messenger", icon: "💬" },
    { name: "Comment", icon: "💭" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Sidebar */}
      <View style={[styles.sidebar, collapsed && styles.sidebarCollapsed]}>
        {/* Collapse Button */}
        <TouchableOpacity
          style={styles.collapseButton}
          onPress={() => setCollapsed(!collapsed)}
        >
          <Text style={styles.collapseIcon}>{collapsed ? "➡️" : "⬅️"}</Text>
        </TouchableOpacity>

        {/* Profile */}
        {!collapsed && (
          <View style={styles.profileContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentUser.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.username}>{currentUser.username}</Text>
          </View>
        )}

        {/* Menu */}
        <ScrollView style={styles.menuContainer}>
          {menuOptions.map((option) => (
            <TouchableOpacity
              key={option.name}
              style={[
                styles.menuButton,
                activeOption === option.name && styles.activeMenuButton,
              ]}
              onPress={() => setActiveOption(option.name)}
            >
              <Text style={styles.menuIcon}>{option.icon}</Text>
              {!collapsed && (
                <Text
                  style={[
                    styles.menuText,
                    activeOption === option.name && styles.activeMenuText,
                  ]}
                >
                  {option.name}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {activeOption === "Profile" && (
          <ProfileScreen route={{ params: { currentUser } }} />
        )}
        {activeOption === "Messenger" && (
          <ChatScreen route={{ params: { currentUser } }} />
        )}
        {activeOption === "Comment" && (
          <KomentoScreen route={{ params: { currentUser } }} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  sessionText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  sidebar: {
    width: 220,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#eee",
    paddingVertical: 20,
    justifyContent: "space-between",
    position: "relative",
  },
  sidebarCollapsed: {
    width: 70,
    paddingVertical: 20,
  },
  collapseButton: {
    position: "absolute",
    top: 10,
    right: -15,
    backgroundColor: "#111",
    padding: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  collapseIcon: {
    fontSize: 18,
    color: "#fff",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  menuContainer: {
    flex: 1,
    marginTop: 20,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  activeMenuButton: {
    backgroundColor: "#111",
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  activeMenuText: {
    color: "#fff",
  },
  logoutButton: {
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});

export default Dashboard;
