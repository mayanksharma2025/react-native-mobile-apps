import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAL__A4eDT3q3_vno3Z9nGeG6sUUFXvAsI",
  authDomain: "mobile-crud-auth.firebaseapp.com",
  projectId: "mobile-crud-auth",
  storageBucket: "mobile-crud-auth.firebasestorage.app",
  messagingSenderId: "1009008895684",
  appId: "1:1009008895684:web:581902064d109b6fc48b91",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
