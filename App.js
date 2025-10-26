import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import Messenger from "./Messenger";
import Comment from "./Comment";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // ✅ hide default headers
          cardStyle: { backgroundColor: "#F9FAFB" },
        }}
      >
        {/* 🏠 Home */}
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* 💬 Messenger */}
        <Stack.Screen name="Messenger" component={Messenger} />

        {/* 🗨️ Comment */}
        <Stack.Screen name="Comment" component={Comment} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}