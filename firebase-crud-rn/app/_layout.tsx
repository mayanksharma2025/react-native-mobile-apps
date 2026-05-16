import "react-native-gesture-handler";

import { Stack } from "expo-router";

import { AuthProvider } from "@/src/core/contexts/AuthContext";

import { ReposProvider } from "@/src/core/contexts/ReposProvider";

import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";

export default function RootLayout() {
  const theme = {
    ...MD3LightTheme,

    colors: {
      ...MD3LightTheme.colors,

      background: "#FFFFFF",

      surface: "#FFFFFF",
    },
  };
  return (
    <ReposProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </AuthProvider>
      </PaperProvider>
    </ReposProvider>
  );
}
