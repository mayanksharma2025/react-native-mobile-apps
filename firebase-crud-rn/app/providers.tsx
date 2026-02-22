// src/app/providers.tsx
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { AuthProvider } from "@/src/core/contexts/AuthContext";
import { AppNavigator } from "./AppNavigator";

export const AppProviders = () => (
  <PaperProvider>
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  </PaperProvider>
);
