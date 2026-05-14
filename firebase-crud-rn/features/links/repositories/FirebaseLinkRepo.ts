import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

import { db } from "@/src/core/firebase/firebaseConfig";
import { PostLink } from "../types";

export class FirebaseLinkRepo {
  async create(data: PostLink) {
    return await addDoc(collection(db, "postLinks"), data);
  }

  async getByPosts(postIds: string[]) {
    if (!postIds.length) return [];

    const q = query(
      collection(db, "postLinks"),
      where("postId", "in", postIds),
    );

    const snap = await getDocs(q);

    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];
  }

  // ✅ NEW: delete all links for a post
  async deleteByPost(postId: string) {
    const q = query(collection(db, "postLinks"), where("postId", "==", postId));

    const snap = await getDocs(q);

    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  }
}
