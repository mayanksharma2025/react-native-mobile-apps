// src/features/auth/screens/ProfileScreen.tsx
import React from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import { useAuth } from "@/src/core/contexts/AuthContext";

export const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="titleLarge">Hello {user?.displayName || user?.email}</Text>
      <Button mode="contained" onPress={signOut} style={{ marginTop: 16 }}>
        Log Out
      </Button>
    </View>
  );
};
