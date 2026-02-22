// src/features/posts/repositories/FirebasePostRepo.ts
import { IPostRepo, Post } from "./IPostRepo";
import { db } from "@/src/core/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

const POSTS_COLL = "posts";

export class FirebasePostRepo implements IPostRepo {
  async create(
    post: Omit<Post, "id" | "createdAt" | "updatedAt">,
  ): Promise<Post> {
    const payload: any = {
      ...post,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPublic: post.isPublic ?? true,
    };
    const ref = await addDoc(collection(db, POSTS_COLL), payload);
    return { id: ref.id, ...payload } as Post;
  }

  async getById(id: string): Promise<Post | null> {
    const ref = doc(db, POSTS_COLL, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as any;
    return { id: snap.id, ...data } as Post;
  }

  async update(id: string, data: Partial<Post>): Promise<Post> {
    const ref = doc(db, POSTS_COLL, id);
    const payload: any = {
      ...data,
      updatedAt: Date.now(),
    };
    await updateDoc(ref, payload);
    const snap = await getDoc(ref);
    return { id: snap.id, ...(snap.data() as any) } as Post;
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, POSTS_COLL, id));
  }

  async listByAuthor(authorId: string): Promise<Post[]> {
    const q = query(
      collection(db, POSTS_COLL),
      where("authorId", "==", authorId),
      orderBy("createdAt", "desc"),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => ({ id: d.id, ...(d.data() as any) }) as Post);
  }

  async listAllPublic(): Promise<Post[]> {
    const q = query(
      collection(db, POSTS_COLL),
      where("isPublic", "==", true),
      orderBy("createdAt", "desc"),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => ({ id: d.id, ...(d.data() as any) }) as Post);
  }
}
