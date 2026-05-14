import React, { useEffect, useState } from "react";

import { ScrollView } from "react-native";

import { Checkbox, Text, Card, Button } from "react-native-paper";

import * as Linking from "expo-linking";
import { FirebasePostRepo } from "@/features/posts/repositories/FirebasePostRepo";
import { FirebaseLinkRepo } from "@/features/links/repositories/FirebaseLinkRepo";

const postRepo = new FirebasePostRepo();

const linkRepo = new FirebaseLinkRepo();

export const LinksScreen = () => {
  const [posts, setPosts] = useState<any[]>([]);

  const [selected, setSelected] = useState<string[]>([]);

  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const data = await postRepo.list();

    setPosts(data);
  };

  const togglePost = async (id: string) => {
    let updated = [...selected];

    if (updated.includes(id)) {
      updated = updated.filter((x) => x !== id);
    } else {
      updated.push(id);
    }

    setSelected(updated);

    const data = await linkRepo.getByPosts(updated);

    setLinks(data);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        gap: 12,
      }}
    >
      <Text variant="titleLarge">Select Posts</Text>

      {posts.map((post) => (
        <Checkbox.Item
          key={post.id}
          label={post.title}
          status={selected.includes(post.id) ? "checked" : "unchecked"}
          onPress={() => togglePost(post.id)}
        />
      ))}

      <Text variant="titleLarge">Links</Text>

      {links.map((link) => (
        <Card key={link.id}>
          <Card.Title title={link.label} subtitle={link.url} />

          <Card.Actions>
            <Button onPress={() => Linking.openURL(link.url)}>Open</Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
};
