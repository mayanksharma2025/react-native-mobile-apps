import React, { useEffect, useState } from "react";
import { ScrollView, View, Alert } from "react-native";
import { TextInput, Button, Text, Switch } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useAuth } from "@/src/core/contexts/AuthContext";
import { usePosts } from "../hooks/usePosts";
import { FirebaseLinkRepo } from "@/features/links/repositories/FirebaseLinkRepo";

const linkRepo = new FirebaseLinkRepo();

export const EditPostScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { postId } = useLocalSearchParams<any>();

  const id = typeof postId === "string" ? postId : postId?.[0];
  const isEdit = !!id;

  const { getById, createPost, updatePost } = usePosts();

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [links, setLinks] = useState([{ label: "", url: "" }]);

  // ---------------- LOAD POST ----------------
  useEffect(() => {
    if (!isEdit || !id) return;

    (async () => {
      try {
        const post = await getById(id);

        if (post) {
          setTitle(post.title);
          setContent(post.content);
          setIsPublic(post.isPublic);
        }

        const existingLinks = await linkRepo.getByPosts([id]);

        setLinks(
          existingLinks.length
            ? existingLinks.map((l: any) => ({
                label: l.label ?? "",
                url: l.url ?? "",
              }))
            : [{ label: "", url: "" }],
        );
      } catch (e: any) {
        Alert.alert("Error", e.message);
      }
    })();
  }, [id]);

  // ---------------- SAVE ----------------
  const savePost = async () => {
    try {
      if (!user) return;

      setLoading(true);

      let postId = id;

      // CREATE
      if (!isEdit) {
        const created = await createPost({
          title,
          content,
          authorId: user.id,
          isPublic,
        });

        postId = created.id;

        for (const l of links) {
          if (!l.url.trim()) continue;

          await linkRepo.create({
            postId,
            label: l.label,
            url: l.url,
          });
        }

        Alert.alert("Success", "Post created");
      }

      // UPDATE
      else {
        if (!postId) return;

        await updatePost(postId, {
          title,
          content,
          isPublic,
        });

        // 🔥 IMPORTANT FIX: DELETE OLD LINKS FIRST
        await linkRepo.deleteByPost(postId);

        // THEN RECREATE CLEAN STATE
        for (const l of links) {
          if (!l.url.trim()) continue;

          await linkRepo.create({
            postId,
            label: l.label,
            url: l.url,
          });
        }

        Alert.alert("Success", "Post updated");
      }

      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const updateLink = (i: number, key: "label" | "url", value: string) => {
    const copy = [...links];
    copy[i][key] = value;
    setLinks(copy);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text variant="titleLarge">{isEdit ? "Edit Post" : "Create Post"}</Text>

      <TextInput label="Title" value={title} onChangeText={setTitle} />

      <TextInput
        label="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text>Public</Text>
        <Switch value={isPublic} onValueChange={setIsPublic} />
      </View>

      <Text variant="titleMedium">Links</Text>

      {links.map((l, i) => (
        <View key={i} style={{ gap: 8 }}>
          <TextInput
            label="Label"
            value={l.label}
            onChangeText={(v) => updateLink(i, "label", v)}
          />

          <TextInput
            label="URL"
            value={l.url}
            onChangeText={(v) => updateLink(i, "url", v)}
          />
        </View>
      ))}

      <Button onPress={() => setLinks([...links, { label: "", url: "" }])}>
        Add Link
      </Button>

      <Button mode="contained" loading={loading} onPress={savePost}>
        Save
      </Button>
    </ScrollView>
  );
};
