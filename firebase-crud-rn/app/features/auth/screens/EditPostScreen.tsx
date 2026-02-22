// src/features/posts/screens/EditPostScreen.tsx
import React, { useEffect, useState } from "react";
import { View, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { usePosts } from "../hooks/usePosts";
import { useAuth } from "@/src/core/contexts/AuthContext";

export const EditPostScreen = ({ route, navigation }: any) => {
  const { postId } = route.params ?? {};
  const { user } = useAuth();
  const { getById, createPost, updatePost, loading } = usePosts();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (postId) {
      (async () => {
        const p = await getById(postId);
        if (p) {
          setTitle(p.title);
          setContent(p.content);
          setIsPublic(p.isPublic ?? true);
        }
      })();
    }
  }, [postId, getById]);

  const handleSave = async () => {
    if (!user?.id) return Alert.alert("Not signed in");
    if (!title.trim()) return Alert.alert("Validation", "Title is required");
    try {
      setSaving(true);
      if (postId) {
        await updatePost(postId, {
          title: title.trim(),
          content: content.trim(),
          isPublic,
        });
      } else {
        await createPost({
          authorId: user.id,
          title: title.trim(),
          content: content.trim(),
          isPublic,
        });
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, padding: 16 }}
    >
      <View style={{ flex: 1 }}>
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={{ marginBottom: 12 }}
        />
        <TextInput
          label="Content"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          style={{ marginBottom: 12, minHeight: 120 }}
        />
        <Button
          mode={isPublic ? "contained" : "outlined"}
          onPress={() => setIsPublic((s) => !s)}
          style={{ marginBottom: 12 }}
        >
          {isPublic ? "Public" : "Private"}
        </Button>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
        >
          {postId ? "Update Post" : "Create Post"}
        </Button>
        <Button onPress={() => navigation.goBack()} style={{ marginTop: 8 }}>
          Cancel
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};
