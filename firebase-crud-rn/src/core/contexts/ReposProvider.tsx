// src/core/contexts/ReposProvider.tsx
import React, { createContext, useContext } from "react";
import { FirebaseUserRepo } from "@/app/features/auth/repositories/FirebaseUserRepo";
import { FirebasePostRepo } from "@/app/features/posts/repositories/FirebasePostRepo";
import type { IUserRepo } from "@/app/features/auth/repositories/IUserRepo";
import type { IPostRepo } from "@/app/features/posts/repositories/IPostRepo";

type ReposContextType = {
  userRepo: IUserRepo;
  postRepo: IPostRepo;
};

const defaultRepos: ReposContextType = {
  userRepo: new FirebaseUserRepo(),
  postRepo: new FirebasePostRepo(),
};

const ReposContext = createContext<ReposContextType>(defaultRepos);

export const ReposProvider: React.FC<{
  children: React.ReactNode;
  repos?: Partial<ReposContextType>;
}> = ({ children, repos = {} }) => {
  const value = {
    userRepo: repos.userRepo ?? defaultRepos.userRepo,
    postRepo: repos.postRepo ?? defaultRepos.postRepo,
  };
  return (
    <ReposContext.Provider value={value}>{children}</ReposContext.Provider>
  );
};

export const useRepos = () => useContext(ReposContext);
