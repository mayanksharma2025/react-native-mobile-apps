// src/features/auth/screens/SignUpScreen.tsx
import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuth } from "@/src/core/contexts/AuthContext";
import { useRouter } from "expo-router";

export const SignUpScreen = ({ navigation }: any) => {
  const { signUp } = useAuth();
  const router = useRouter(); // ✅
  const [displayName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    try {
      await signUp(email, password, displayName);
      router.replace("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <Text
        variant="titleLarge"
        style={{ textAlign: "center", marginBottom: 20 }}
      >
        Create Account
      </Text>
      <TextInput
        label="Name"
        value={displayName}
        onChangeText={setName}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPass}
        secureTextEntry
        style={{ marginBottom: 10 }}
      />
      {error ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
      ) : null}
      <Button mode="contained" onPress={handleSignUp}>
        Sign Up
      </Button>
      <Button onPress={() => router.back()}>Back to Sign In</Button>
    </View>
  );
};
