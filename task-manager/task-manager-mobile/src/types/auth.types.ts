export interface AuthPayload {
  token: string;
  user: IUser;
}

export type UserRole = "user" | "admin";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface UpdateUserInput {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}
