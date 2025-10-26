// App.js
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
          headerShown: false,
          cardStyle: { backgroundColor: "#FDF2F8" }, // soft pink background
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Messenger" component={Messenger} />
        <Stack.Screen name="Comment" component={Comment} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}