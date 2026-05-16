import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { db, storage } from "@/src/core/firebase/firebaseConfig";

import { Report } from "../types";

const REPORTS_COLL = "reports";

export class FirebaseReportRepo {
  async uploadFile(uri: string, path: string): Promise<string> {
    const response = await fetch(uri);

    const blob = await response.blob();

    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, blob);

    return await getDownloadURL(storageRef);
  }

  async create(data: Omit<Report, "id">) {
    const payload = {
      ...data,

      createdAt: Date.now(),

      updatedAt: Date.now(),
    };

    const ref = await addDoc(collection(db, REPORTS_COLL), payload);

    return ref.id;
  }

  async getById(id: string) {
    const snap = await getDoc(doc(db, REPORTS_COLL, id));

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...(snap.data() as any),
    };
  }

  async update(id: string, data: Partial<Report>) {
    await updateDoc(doc(db, REPORTS_COLL, id), {
      ...data,

      updatedAt: Date.now(),
    });
  }

  async listByUser(userId: string): Promise<Report[]> {
    const q = query(
      collection(db, REPORTS_COLL),

      where("userId", "==", userId),

      orderBy("createdAt", "desc"),
    );

    const snaps = await getDocs(q);

    return snaps.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    })) as Report[];
  }
}
