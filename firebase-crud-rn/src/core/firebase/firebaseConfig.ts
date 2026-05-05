import { initializeApp, getApps } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

let auth;

try {
  const { getReactNativePersistence } = require("firebase/auth");

  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);