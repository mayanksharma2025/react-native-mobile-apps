export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}
export interface ITask {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  banner?: string;          // add this
  createdBy: IUser;
  createdAt: string;
  updatedAt: string;
}
