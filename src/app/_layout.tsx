import React from "react";
import { Tabs } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { PT } from "../constants/patiotuerca";

const qc = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={qc}>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: PT.colors.primary,
          tabBarInactiveTintColor: PT.colors.textMuted,
          tabBarStyle: {
            backgroundColor: PT.colors.surface,
            borderTopColor: PT.colors.border,
            borderTopWidth: 1,
            height: 62,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inventario",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "car-sport" : "car-sport-outline"}
                size={size ?? 22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explorar",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "search" : "search-outline"}
                size={size ?? 22}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </QueryClientProvider>
  );
}
