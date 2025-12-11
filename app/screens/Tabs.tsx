import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import React from "react"
import { View } from "react-native"

import { colors } from "@/theme"
import HomeScreen from "./Home"
import MenuScreen from "./Menu"
import ProfileScreen from "./Profile"

const Tab = createBottomTabNavigator()

const OrderScreen = () => <View style={{ flex: 1, backgroundColor: "#eee" }} />

const getTabIcon = (routeName: string, color: string, size: number) => {
  const iconsMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    Главная: "home-outline",
    Меню: "restaurant-outline",
    Заказы: "cart-outline",
    Профиль: "person-outline",
  }

  const iconName = iconsMap[routeName] || "home-outline"
  return <Ionicons name={iconName} size={size} color={color} />
}

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        lazy: false, // все вкладки монтируются сразу
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.white, paddingBottom: 4, height: 60 },
        tabBarIcon: ({ color, size }) => getTabIcon(route.name, color, size),
      })}
    >
      <Tab.Screen name="Главная" component={HomeScreen} />
      <Tab.Screen name="Меню" component={MenuScreen} />
      <Tab.Screen name="Заказы" component={OrderScreen} />
      <Tab.Screen name="Профиль" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default Tabs
