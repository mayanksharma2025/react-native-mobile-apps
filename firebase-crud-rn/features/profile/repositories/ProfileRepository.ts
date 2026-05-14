import { doc, setDoc, getDoc } from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { db, storage } from "@/src/core/firebase/firebaseConfig";
import { UserProfile } from "../types";

export class ProfileRepository {
  async uploadProfilePhoto(uri: string, uid: string) {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `profiles/${uid}`);

    await uploadBytes(storageRef, blob);

    return await getDownloadURL(storageRef);
  }

  async saveProfile(profile: UserProfile) {
    await setDoc(doc(db, "profiles", profile.id), profile);
  }

  async getProfile(uid: string) {
    const snapshot = await getDoc(doc(db, "profiles", uid));

    if (!snapshot.exists()) return null;

    return snapshot.data() as UserProfile;
  }
}
