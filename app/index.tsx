import { AuthContext, AuthProvider } from "@/context/AuthContext";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext } from "react";
import { ActivityIndicator, View } from "react-native";

import CreateProfileScreen from "./screens/CreateProfile";
import LoginScreen from "./screens/Login";
import MainTabs from "./screens/MainTabs";
import RegisterScreen from "./screens/Register";
const Stack = createStackNavigator();

// ---------- Основная логика ----------
const AppNavigator = () => {
  const { token, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={token ? "MainTabs" : "Login"}
      screenOptions={{ headerShown: false }}
    >
      {/* Экраны без табов */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />

      {/* Таббар появляется только когда пользователь на ProfileScreen */}
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
};


// ---------- App ----------
export default function App() {
  return (
    <AuthProvider>
        <AppNavigator />
    </AuthProvider>
  );
}
