import React, { useEffect, useState } from "react";

import { router } from "expo-router";

import { View, Linking, Alert } from "react-native";

import { Card, Text, Button } from "react-native-paper";

import { useLocalSearchParams } from "expo-router";

import { doc, getDoc } from "firebase/firestore";

import { db } from "@/src/core/firebase/firebaseConfig";

import { FirebasePostRepo } from "@/features/posts/repositories/FirebasePostRepo";

const postRepo = new FirebasePostRepo();

export const LinkDetailsScreen = () => {
  const params = useLocalSearchParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [link, setLink] = useState<any>(null);

  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    if (typeof id === "string") {
      loadLink();
    }
  }, [id]);

  const loadLink = async () => {
    try {
      const snap = await getDoc(doc(db, "postLinks", id as string));

      if (!snap.exists()) return;

      const linkData: any = {
        id: snap.id,

        ...snap.data(),
      };

      setLink(linkData);

      /* LOAD POST */

      const postData = await postRepo.getById(linkData.postId);

      setPost(postData);
    } catch (e: any) {
      console.log(e);

      Alert.alert("Error", e.message);
    }
  };

  const openLink = async () => {
    try {
      let url = link.url;

      /* AUTO HTTPS */

      if (!url.startsWith("http")) {
        url = `https://${url}`;
      }

      await Linking.openURL(url);
    } catch {
      Alert.alert("Invalid URL");
    }
  };

  if (!link) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
      }}
    >
      <Card>
        <Card.Content>
          <Text variant="titleLarge">{link.label}</Text>

          <Text
            style={{
              marginTop: 8,
            }}
          >
            {link.url}
          </Text>

          {!!post && (
            <>
              <Text
                variant="titleMedium"
                style={{
                  marginTop: 20,
                }}
              >
                Related Post
              </Text>

              <Text>{post.title}</Text>

              <Text>{post.content}</Text>
            </>
          )}
        </Card.Content>

        <Card.Actions>
          <Card.Actions>
            <Button mode="contained" onPress={openLink}>
              Open Link
            </Button>

            <Button onPress={() => router.back()}>Back</Button>
          </Card.Actions>
        </Card.Actions>
      </Card>
    </View>
  );
};
