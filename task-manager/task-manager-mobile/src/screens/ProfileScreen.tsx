import React, { useContext, useState } from "react";
import { View, FlatList, Alert, ScrollView } from "react-native";
import {
  Text,
  Input,
  Button,
  Card,
  ListItem,
  Avatar,
  Divider,
} from "@rneui/themed";
import { AuthContext } from "../context/AuthContext";
import {
  useUsers,
  useUpdateProfile,
  useDeleteUser,
  useChangeUserRole,
} from "../hooks/useUsers";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen: React.FC = () => {
  const { user, saveUser, logout, isAdmin } = useContext(AuthContext);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");

  const { data: users, isLoading } = useUsers();
  const updateMutation = useUpdateProfile();
  const deleteMutation = useDeleteUser();
  const roleMutation = useChangeUserRole();

  if (!user) return null;

  const handleUpdate = async () => {
    try {
      const updated = await updateMutation.mutateAsync({
        name,
        email,
        password: password || undefined,
      } as { password: string; name: string; email: string });

      await saveUser(updated);
      Alert.alert("Success", "Profile updated successfully");
      setPassword("");
    } catch {
      Alert.alert("Error", "Update failed");
    }
  };

  const handleDeleteSelf = async () => {
    Alert.alert("Delete Account", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteMutation.mutateAsync(user.id);
          await logout();
        },
      },
    ]);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      if (confirm("Are you sure you want to delete this task?")) {
        await deleteMutation.mutateAsync(id);
      }
    } catch {
      Alert.alert("Error", "Failed to delete account");
    }
    // Alert.alert("Delete User", "Are you sure?", [
    //   { text: "Cancel", style: "cancel" },
    //   {
    //     text: "Delete",
    //     style: "destructive",
    //     onPress: () => deleteMutation.mutate(id),
    //   },
    // ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={isAdmin ? users : []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListHeaderComponent={
          <>
            {/* ---------- PROFILE CARD ---------- */}
            <Card containerStyle={{ borderRadius: 12 }}>
              <Card.Title>Profile</Card.Title>
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
                title="Update Profile"
                onPress={handleUpdate}
                loading={updateMutation.isPending}
                containerStyle={{ marginBottom: 10 }}
              />

              <Button
                title="Delete Account"
                onPress={handleDeleteSelf}
                color="error"
              />
            </Card>

            {/* ---------- ADMIN HEADER ---------- */}
            {isAdmin && (
              <Text h4 style={{ marginVertical: 12, marginLeft: 8 }}>
                All Users
              </Text>
            )}
          </>
        }
        renderItem={({ item }) =>
          isAdmin ? (
            <Card
              containerStyle={{
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <ListItem>
                <Avatar rounded title={item.name[0].toUpperCase()} />

                <ListItem.Content>
                  <ListItem.Title>{item.name}</ListItem.Title>
                  <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
                  <Text>Role: {item.role}</Text>
                </ListItem.Content>
              </ListItem>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <Button
                  title="Toggle Role"
                  type="outline"
                  onPress={() =>
                    roleMutation.mutate({
                      id: item.id,
                      role: item.role === "admin" ? "user" : "admin",
                    })
                  }
                  containerStyle={{ flex: 1, marginRight: 8 }}
                />

                <Button
                  title="Delete"
                  color="error"
                  onPress={() => handleDeleteUser(item.id)}
                  containerStyle={{ flex: 1 }}
                />
              </View>
            </Card>
          ) : null
        }
        ListEmptyComponent={
          isAdmin && !isLoading ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No users found
            </Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
