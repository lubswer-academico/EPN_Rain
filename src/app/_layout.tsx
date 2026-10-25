import React from "react";
import { Tabs } from "expo-router";
import { StatusBar, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import {
  queryClient,
  asyncStoragePersister,
  MAX_AGE_PERSISTENCIA,
} from "../config/queryClient";
import { configurarOnlineManager } from "../config/onlineManager";
import { Theme } from "../constants/theme";

configurarOnlineManager();

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: MAX_AGE_PERSISTENCIA,
      }}
      onSuccess={() => {
        queryClient.resumePausedMutations();
      }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Theme.colors.primary,
          tabBarInactiveTintColor: Theme.colors.textMuted,
          tabBarStyle: {
            backgroundColor: Theme.colors.surface,
            borderTopColor: Theme.colors.border,
            borderTopWidth: 1,
            height: 60,
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
            title: "Clima",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "partly-sunny" : "partly-sunny-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="ubicaciones"
          options={{
            title: "Mis Ubicaciones",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "location" : "location-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </PersistQueryClientProvider>
  );
}
