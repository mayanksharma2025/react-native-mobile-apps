// src/features/auth/screens/SignInScreen.tsx
import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuth } from "@/src/core/contexts/AuthContext";
import { useRouter } from "expo-router";

export const SignInScreen = ({ navigation }: any) => {
  const { signIn } = useAuth();
  const router = useRouter(); // ✅

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signIn(email, password);
      router.replace("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <Text
        variant="titleLarge"
        style={{ textAlign: "center", marginBottom: 20 }}
      >
        Welcome Back
      </Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ marginBottom: 10 }}
      />
      {error ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
      ) : null}
      <Button mode="contained" onPress={handleSignIn} loading={loading}>
        Sign In
      </Button>
      <Button onPress={() => router.push("/sign-up")}>Create Account</Button>
    </View>
  );
};
