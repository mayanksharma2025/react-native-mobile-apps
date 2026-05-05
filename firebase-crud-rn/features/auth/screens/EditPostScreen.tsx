import React, { useEffect, useState } from "react";
import { View, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { usePosts } from "../hooks/usePosts";
import { useAuth } from "@/src/core/contexts/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";

type Params = {
  postId?: string | string[];
};

export const EditPostScreen: React.FC = () => {
  const router = useRouter();

  const { postId } = useLocalSearchParams<Params>();
  const id = Array.isArray(postId) ? postId[0] : postId;

  const { user } = useAuth();
  const { getById, createPost, updatePost } = usePosts();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Load post if editing
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const p = await getById(id);
        if (p) {
          setTitle(p.title);
          setContent(p.content);
          setIsPublic(p.isPublic ?? true);
        }
      } catch (e: any) {
        Alert.alert("Error", e.message || "Failed to load post");
      }
    })();
  }, [id]);

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert("Not signed in");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Validation", "Title is required");
      return;
    }

    try {
      setSaving(true);

      if (id) {
        await updatePost(id, {
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

      router.back(); // ✅ FIX: replaces navigation.goBack()
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
          onPress={() => setIsPublic((prev) => !prev)}
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
          {id ? "Update Post" : "Create Post"}
        </Button>

        <Button onPress={() => router.back()} style={{ marginTop: 8 }}>
          Cancel
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};