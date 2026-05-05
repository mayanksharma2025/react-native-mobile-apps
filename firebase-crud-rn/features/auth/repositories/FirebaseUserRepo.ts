// src/features/auth/repositories/FirebaseUserRepo.ts
import { IUserRepo, User } from "./IUserRepo";
import { auth, db } from "@/src/core/firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export class FirebaseUserRepo implements IUserRepo {
  async signUp(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<User> {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
    const user: User = { id: cred.user.uid, email, displayName };
    await setDoc(doc(db, "users", user.id), user);
    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, "users", cred.user.uid));
    return (snap.exists() ? snap.data() : { id: cred.user.uid, email }) as User;
  }

  async signOut(): Promise<void> {
    await signOut(auth);
  }

  async getCurrentUser(): Promise<User | null> {
    const u = auth.currentUser;
    if (!u) return null;
    const snap = await getDoc(doc(db, "users", u.uid));
    return snap.exists()
      ? (snap.data() as User)
      : { id: u.uid, email: u.email || "" };
  }
}
