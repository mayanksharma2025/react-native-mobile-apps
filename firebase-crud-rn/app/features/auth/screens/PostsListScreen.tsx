// src/features/posts/screens/PostsListScreen.tsx
import React, { useEffect } from "react";
import { View, FlatList, Alert } from "react-native";
import {
  FAB,
  Card,
  Title,
  Paragraph,
  Button,
  IconButton,
  Text,
} from "react-native-paper";
import { useAuth } from "@/src/core/contexts/AuthContext";
import { usePosts } from "../hooks/usePosts";
import { useIsFocused } from "@react-navigation/native";
import { ProfileScreen } from "./ProfileScreen";

export const PostsListScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { posts, loading, error, loadByAuthor, deletePost } = usePosts();
  const focused = useIsFocused();

  useEffect(() => {
    if (user?.id && focused) loadByAuthor(user.id);
  }, [user?.id, loadByAuthor, focused]);

  const confirmDelete = (id?: string) => {
    if (!id) return;
    Alert.alert("Delete post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost(id);
          } catch (e: any) {
            Alert.alert("Error", e.message || "Failed to delete");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: any) => (
    <Card style={{ margin: 8 }}>
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph numberOfLines={2}>{item.content}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button
          onPress={() => navigation.navigate("EditPost", { postId: item.id })}
        >
          Edit
        </Button>
        <Button onPress={() => confirmDelete(item.id)} color="red">
          Delete
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={{ flex: 1 }}>
      <ProfileScreen />

      {error ? (
        <Text style={{ color: "red", padding: 16 }}>{error}</Text>
      ) : null}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id!}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={() => user?.id && loadByAuthor(user.id)}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={<ProfileScreen />}
        ListEmptyComponent={
          !loading ? (
            <View style={{ padding: 24, alignItems: "center" }}>
              <Text>No posts yet — create one!</Text>
            </View>
          ) : null
        }
      />
      <FAB
        icon="plus"
        onPress={() => navigation.navigate("EditPost", { postId: null })}
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
        }}
      />
    </View>
  );
};
