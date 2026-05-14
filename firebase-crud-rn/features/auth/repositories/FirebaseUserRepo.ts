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

    if (displayName) {
      await updateProfile(cred.user, {
        displayName,
      });
    }

    const user: User = {
      id: cred.user.uid,
      email: cred.user.email || "",
      displayName: displayName || "",
    };

    await setDoc(doc(db, "users", user.id), user);

    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    const userRef = doc(db, "users", cred.user.uid);

    const snap = await getDoc(userRef);

    if (snap.exists()) {
      return snap.data() as User;
    }

    return {
      id: cred.user.uid,
      email: cred.user.email || "",
      displayName: cred.user.displayName || "",
    };
  }

  async signOut(): Promise<void> {
    await signOut(auth);
  }

  async getCurrentUser(): Promise<User | null> {
    const currentUser = auth.currentUser;

    if (!currentUser) return null;

    const userRef = doc(db, "users", currentUser.uid);

    const snap = await getDoc(userRef);

    if (snap.exists()) {
      return snap.data() as User;
    }

    return {
      id: currentUser.uid,
      email: currentUser.email || "",
      displayName: currentUser.displayName || "",
    };
  }
}
