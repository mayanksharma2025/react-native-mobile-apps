import React, { useCallback, useEffect } from "react";
import { View, FlatList, Alert } from "react-native";
import {
  FAB,
  Card,
  Title,
  Paragraph,
  Button,
  Text,
} from "react-native-paper";
import { useFocusEffect, useRouter } from "expo-router";

import { useAuth } from "@/src/core/contexts/AuthContext";
import { usePosts } from "../hooks/usePosts";
import { ProfileScreen } from "./ProfileScreen";

export const PostsListScreen = () => {
  const router = useRouter(); // ✅ FIX 1
  const { user } = useAuth();
  const { posts, loading, error, loadByAuthor, deletePost } = usePosts();

  // ✅ FIX 2: removed useIsFocused (React Navigation)
  // useEffect(() => {
  //   if (user?.id) {
  //     loadByAuthor(user.id);
  //   }
  // }, [user?.id]);

  useFocusEffect(
  useCallback(() => {
    if (user?.id) {
      loadByAuthor(user.id);
    }
  }, [user?.id])
);

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
        {/* ✅ FIX 3: correct routing with postId */}
        <Button
          onPress={() =>
            router.push({
              pathname: "/(protected)/edit-post",
              params: { postId: item.id },
            } as any)
          }
        >
          Edit
        </Button>

        <Button onPress={() => confirmDelete(item.id)}>
          Delete
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ FIX 4: removed duplicate ProfileScreen */}

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

        // ✅ keep only one Profile header
        ListHeaderComponent={<ProfileScreen />}

        ListEmptyComponent={
          !loading ? (
            <View style={{ padding: 24, alignItems: "center" }}>
              <Text>No posts yet — create one!</Text>
            </View>
          ) : null
        }
      />

      {/* ✅ FIX 5: removed navigation.navigate */}
      <FAB
        icon="plus"
        onPress={() =>
          router.push({
            pathname: "/edit-post",
            params: { postId: "" },
          } as any)
        }
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
        }}
      />
    </View>
  );
};