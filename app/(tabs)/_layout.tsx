import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppContext } from "../../context/AppContext";

export default function TabLayout() {
  const { themeMode } = useAppContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1f8f57",
        tabBarInactiveTintColor: themeMode === "dark" ? "#a6c6b3" : "#7c9487",
        tabBarStyle: {
          backgroundColor: themeMode === "dark" ? "#16231c" : "#ffffff",
          borderTopColor: themeMode === "dark" ? "#254133" : "#e1ebe4",
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="bubble.left.and.bubble.right.fill"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "My Orders",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="receipt.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
