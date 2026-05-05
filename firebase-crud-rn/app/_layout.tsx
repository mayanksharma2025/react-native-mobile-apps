// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "@/src/core/contexts/AuthContext";
import { ReposProvider } from "@/src/core/contexts/ReposProvider";

export default function RootLayout() {
  return (
    <ReposProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </ReposProvider>
  );
}