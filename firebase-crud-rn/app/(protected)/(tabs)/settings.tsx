import { View, Text, Button } from "react-native";
import { useAuth } from "@/src/core/contexts/AuthContext";

export default function Settings() {
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Settings Screen</Text>
      <Button title="Logout" onPress={signOut} />
    </View>
  );
}