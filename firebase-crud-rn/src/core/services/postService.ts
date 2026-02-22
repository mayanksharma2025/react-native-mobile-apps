import { addDoc, collection } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";

export const createPost = async (title: string) => {
  const user = auth.currentUser;

  if (!user) throw new Error("Not authenticated");

  await addDoc(collection(db, "posts"), {
    title,
    userId: user.uid,
    createdAt: new Date(),
  });
};
