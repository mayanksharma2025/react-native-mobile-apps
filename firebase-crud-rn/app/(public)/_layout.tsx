// app/(public)/_layout.tsx
import { Tabs, Redirect } from "expo-router";
import { useAuth } from "@/src/core/contexts/AuthContext";

export default function PublicLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Redirect href="./(protected)/(tabs)" />;
  }

  return <Tabs />;
}