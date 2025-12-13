import { AuthProvider } from '@/context/AuthContext';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CreateGoalsScreen from './screens/CreateGoals';
import CreateMeasurementsScreen from './screens/CreateMeasurements';
import CreateProfileScreen from './screens/CreateProfile';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import Tabs from './screens/Tabs';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={'Tabs'} screenOptions={{ headerShown: false }}>
      <Stack.Screen name='CreateProfile' component={CreateProfileScreen} />
      <Stack.Screen name='CreateMeasurements' component={CreateMeasurementsScreen} />
      <Stack.Screen name='CreateGoals' component={CreateGoalsScreen} />
      <Stack.Screen name='Tabs' component={Tabs} />
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Register' component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
