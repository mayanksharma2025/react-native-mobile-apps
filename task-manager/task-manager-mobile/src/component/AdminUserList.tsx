import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { IUser, UserRole } from "../types/auth.types";
import { fetchUsers, deleteUser, changeUserRole } from "../api/auth.api";

const AdminUserList: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch {
      Alert.alert("Error", "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      if (confirm("Are you sure you want to delete this task?")) {
        await deleteUser(id);
        loadUsers();
      }
    } catch {
      Alert.alert("Error", "Failed to delete account");
    }
    // Alert.alert("Delete User", "Are you sure?", [
    //   { text: "Cancel", style: "cancel" },
    //   {
    //     text: "Delete",
    //     style: "destructive",
    //     onPress: async () => {
    //       await deleteUser(id);
    //       loadUsers();
    //     },
    //   },
    // ]);
  };

  const handleRoleChange = async (user: IUser) => {
    const newRole: UserRole = user.role === "admin" ? "user" : "admin";

    await changeUserRole(user.id, newRole);
    loadUsers();
  };

  if (loading) {
    return <Text style={{ marginTop: 20 }}>Loading users...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Users</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.email}</Text>
            <Text>Role: {item.role}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.roleButton}
                onPress={() => handleRoleChange(item)}
              >
                <Text style={styles.buttonText}>Toggle Role</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default AdminUserList;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  roleButton: {
    backgroundColor: "#2563EB",
    padding: 8,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
  },
});
