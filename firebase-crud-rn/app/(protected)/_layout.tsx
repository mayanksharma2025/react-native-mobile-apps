import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/src/core/contexts/AuthContext";

export default function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="edit-post"
        options={{ headerShown: true, title: "Edit Post" }}
      />
    </Stack>
  );
}