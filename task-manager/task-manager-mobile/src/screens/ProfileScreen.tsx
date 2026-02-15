import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { updateUser, deleteUser, changeUserRole } from "../api/auth.api";
import { AuthContext } from "../context/AuthContext";
import AdminUserList from "../component/AdminUserList";

const ProfileScreen: React.FC = () => {
  const { user, saveUser, logout, isAdmin } = useContext(AuthContext);

  const [name, setName] = useState<string>(user?.name ?? "");
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [password, setPassword] = useState<string>("");

  if (!user) return null;

  const handleUpdate = async () => {
    try {
      const updated = await updateUser({
        name,
        email,
        password: password || undefined,
      });

      await saveUser(updated);
      Alert.alert("Success", "Profile updated successfully");
      setPassword("");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleDelete = async () => {
    try {
      if (confirm("Are you sure you want to delete this task?")) {
        await deleteUser(user.id);
        await logout();
      }
    } catch {
      Alert.alert("Error", "Failed to delete account");
    }
    // Alert.alert("Delete Account", "Are you sure?", [
    //   { text: "Cancel", style: "cancel" },
    //   {
    //     text: "Delete",
    //     style: "destructive",
    //     onPress: async () => {
    //       try {
    //         await deleteUser(user.id);
    //         await logout();
    //       } catch {
    //         Alert.alert("Error", "Failed to delete account");
    //       }
    //     },
    //   },
    // ]);
  };

  const handleRoleChange = async () => {
    if (!isAdmin) return;

    try {
      const newRole = user.role === "admin" ? "user" : "admin";

      const updated = await changeUserRole(user.id, newRole);
      await saveUser(updated);

      Alert.alert("Success", `Role changed to ${newRole}`);
    } catch {
      Alert.alert("Error", "Failed to change role");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.title}>Profile</Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name"
        />

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="New Password"
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>

        {isAdmin && (
          <TouchableOpacity
            style={[styles.button, styles.adminButton]}
            onPress={handleRoleChange}
          >
            <Text style={styles.buttonText}>Toggle Role</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>

        {isAdmin && <AdminUserList />}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  adminButton: {
    backgroundColor: "#2563EB",
  },
  deleteButton: {
    backgroundColor: "#DC2626",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
