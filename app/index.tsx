import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CreateFoodIntakesScreen from './screens/CreateFoodIntakes';
import CreateGoalsScreen from './screens/CreateGoals';
import CreateMeasurementsScreen from './screens/CreateMeasurements';
import CreateProfileScreen from './screens/CreateProfile';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import Tabs from './screens/Tabs';

const Stack = createStackNavigator();
const originalWarn = console.warn;

console.warn = (...args) => {
  if (args[0].includes('createAnimatedPropAdapter')) {
    return;
  }
  originalWarn(...args);
};
const AppNavigator = () => {
  const { token } = useAuth();
  return (
    <Stack.Navigator
      initialRouteName={token ? 'Tabs' : 'Login'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='CreateProfile' component={CreateProfileScreen} />
      <Stack.Screen name='CreateMeasurements' component={CreateMeasurementsScreen} />
      <Stack.Screen name='CreateGoals' component={CreateGoalsScreen} />
      <Stack.Screen name='CreateFoodIntakes' component={CreateFoodIntakesScreen} />
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
