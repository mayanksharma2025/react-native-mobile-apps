// src/features/auth/repositories/IUserRepo.ts
export type User = {
  id: string;
  email: string;
  displayName?: string;
};

export interface IUserRepo {
  signUp(email: string, password: string, displayName?: string): Promise<User>;
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
