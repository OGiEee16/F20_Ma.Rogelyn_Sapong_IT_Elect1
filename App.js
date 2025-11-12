// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SQLiteProvider } from "expo-sqlite";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ChatScreen from "./screens/ChatScreen";
import Komento from "./screens/Komento";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SQLiteProvider
      databaseName="chatApp.db"
      onInit={async (db) => {
        try {
          console.log("🗄 Initializing database...");

          // First, check if users table exists and add profile_picture column if missing
          try {
            await db.execAsync(`
              ALTER TABLE users ADD COLUMN profile_picture TEXT;
            `);
            console.log("✅ Added profile_picture column to existing users table");
          } catch (err) {
            // Column might already exist or table doesn't exist yet
            console.log("ℹ️ profile_picture column might already exist");
          }

          // Create users table if not exists (with profile_picture)
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT NOT NULL UNIQUE,
              password TEXT NOT NULL,
              profile_picture TEXT,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
          `);

          // Drop and recreate messages table to ensure correct schema
          await db.execAsync(`
            DROP TABLE IF EXISTS messages;
          `);

          // Create messages table with isRead column
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS messages (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              sender_id INTEGER NOT NULL,
              receiver_id INTEGER NOT NULL,
              message TEXT NOT NULL,
              timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
              isRead INTEGER DEFAULT 0,
              FOREIGN KEY (sender_id) REFERENCES users(id),
              FOREIGN KEY (receiver_id) REFERENCES users(id)
            );
          `);

          // Drop and recreate comments table
          await db.execAsync(`
            DROP TABLE IF EXISTS comments;
          `);

          // Create comments table
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS comments (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER NOT NULL,
              username TEXT NOT NULL,
              comment TEXT NOT NULL,
              timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(id)
            );
          `);

          // Create selfie posts table for Activity 2
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS selfie_posts (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER NOT NULL,
              username TEXT NOT NULL,
              image_uri TEXT NOT NULL,
              caption TEXT,
              timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(id)
            );
          `);

          const tables = await db.getAllAsync(
            "SELECT name FROM sqlite_master WHERE type='table';"
          );
          console.log("✅ Tables in DB:", tables);

          // Verify users table structure
          const userColumns = await db.getAllAsync("PRAGMA table_info(users);");
          console.log("✅ Users table columns:", userColumns);

          await db.execAsync("PRAGMA journal_mode=WAL;");
          console.log("✅ Database initialization complete!");
        } catch (error) {
          console.error("❌ Database init failed:", error);
        }
      }}
      options={{ useNewConnection: false }}
    >
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="Komento" component={Komento} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}