import { AuthContext, AuthProvider } from "@/context/AuthContext";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import CreateProfileScreen from "./screens/CreateProfile";
import LoginScreen from "./screens/Login";
import ProfileScreen from "./screens/Profile";
import RegisterScreen from "./screens/Register";


const Stack = createStackNavigator();

const App = () => {
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
      initialRouteName={token ? "Profile" : "Login"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

