import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import { colors } from "@/theme";
import { View } from "react-native";
import MenuScreen from "./Menu";
import ProfileScreen from "./Profile";

const Tab = createBottomTabNavigator();
const HomeScreen = () => <View style={{ flex: 1, backgroundColor: "#fafafa" }} />;
const OrderScreen = () => <View style={{ flex: 1, backgroundColor: "#eee" }} />;
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.white, paddingBottom: 4, height: 60 },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Главная") iconName = "home-outline";
          else if (route.name === "Меню") iconName = "restaurant-outline";
          else if (route.name === "Заказы") iconName = "cart-outline";
          else if (route.name === "Профиль") iconName = "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Главная" component={HomeScreen} />
      <Tab.Screen name="Меню" component={MenuScreen} />
      <Tab.Screen name="Заказы" component={OrderScreen} />
      <Tab.Screen name="Профиль" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
