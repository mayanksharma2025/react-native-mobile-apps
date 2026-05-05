// src/core/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/src/core/firebase/firebaseConfig";
import { FirebaseUserRepo } from "@/features/auth/repositories/FirebaseUserRepo";
import { User } from "@/features/auth/repositories/IUserRepo";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const userRepo = new FirebaseUserRepo();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const data = await userRepo.getCurrentUser();
        setUser(data);
      } else setUser(null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: async (email, pass) =>
          setUser(await userRepo.signIn(email, pass)),
        signUp: async (email, pass, name) =>
          setUser(await userRepo.signUp(email, pass, name)),
        signOut: async () => {
          await userRepo.signOut();
          setUser(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
