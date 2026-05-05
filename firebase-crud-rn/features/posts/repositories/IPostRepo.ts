// src/features/posts/repositories/IPostRepo.ts
export type Post = {
  id?: string;
  authorId: string;
  title: string;
  content: string;
  createdAt?: number; // unix ms
  updatedAt?: number;
  isPublic?: boolean;
};

export interface IPostRepo {
  create(post: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post>;
  getById(id: string): Promise<Post | null>;
  update(id: string, data: Partial<Post>): Promise<Post>;
  delete(id: string): Promise<void>;
  listByAuthor(authorId: string): Promise<Post[]>;
  listAllPublic(): Promise<Post[]>;
}
