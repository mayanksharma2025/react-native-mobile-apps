import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "@/src/core/firebase/firebaseConfig";
// import { CreatePostDto } from "./IPostRepo";
import { Post, CreatePostDto, UpdatePostDto } from "./IPostRepo";

export class FirebasePostRepo {
  async create(data: CreatePostDto): Promise<Post> {
    const docRef = await addDoc(collection(db, "posts"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as Post;
  }

  async list(): Promise<Post[]> {
    const snap = await getDocs(collection(db, "posts"));

    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];
  }

  async listByAuthor(authorId: string): Promise<Post[]> {
    const q = query(collection(db, "posts"), where("authorId", "==", authorId));

    const snap = await getDocs(q);

    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];
  }

  async getById(id: string): Promise<Post | null> {
    const ref = doc(db, "posts", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as Post;
  }

  async update(id: string, data: UpdatePostDto): Promise<Post> {
    const ref = doc(db, "posts", id);

    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    const updated = await getDoc(ref);

    return {
      id: updated.id,
      ...updated.data(),
    } as Post;
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "posts", id));
  }

  async listAllPublic(): Promise<Post[]> {
    const q = query(collection(db, "posts"), where("isPublic", "==", true));

    const snap = await getDocs(q);

    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];
  }
}
