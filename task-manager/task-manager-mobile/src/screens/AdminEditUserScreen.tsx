import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { Card, Input, Button, Text, Divider } from "@rneui/themed";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useUsers, useAdminUpdateUser } from "../hooks/useUsers";
import { SafeAreaView } from "react-native-safe-area-context";

const AdminEditUserScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();

  const { userId } = route.params;

  const { data: users } = useUsers();
  const updateMutation = useAdminUpdateUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Populate form
  useEffect(() => {
    if (!users) return;

    const user = users.find((u) => u.id === userId);
    if (!user) return;

    setName(user.name);
    setEmail(user.email);
  }, [users, userId]);

  const handleUpdate = async () => {
    try {
      await updateMutation.mutateAsync({
        id: userId,
        data: {
          name,
          email,
          password: password || undefined,
        } as any,
      });

      Alert.alert("Success", "User updated successfully");
      navigation.goBack();
    } catch {
      Alert.alert("Error", "Failed to update user");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Card containerStyle={{ borderRadius: 12 }}>
        <Card.Title>Edit User</Card.Title>
        <Divider style={{ marginBottom: 15 }} />

        <Input label="Name" value={name} onChangeText={setName} />

        <Input label="Email" value={email} onChangeText={setEmail} />

        <Input
          label="New Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title="Update User"
          onPress={handleUpdate}
          loading={updateMutation.isPending}
          containerStyle={{ marginBottom: 10 }}
        />

        <Button
          title="Back"
          type="outline"
          onPress={() => navigation.goBack()}
        />
      </Card>
    </SafeAreaView>
  );
};

export default AdminEditUserScreen;
