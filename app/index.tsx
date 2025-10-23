// index.tsx
import { AuthProvider } from '@/auth/context/AuthContext';
import LoginScreen from '@/screens/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator();

const App = () => (
  <AuthProvider>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  </AuthProvider>
);

export default App;
