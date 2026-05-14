import { useCallback, useState } from "react";
import { IPostRepo, Post } from "../../posts/repositories/IPostRepo";
import { FirebasePostRepo } from "../../posts/repositories/FirebasePostRepo";

const defaultRepo: IPostRepo  = new FirebasePostRepo();

export const usePosts = (repo: IPostRepo = defaultRepo) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadByAuthor = useCallback(
    async (authorId: string) => {
      setLoading(true);
      setError(null);

      try {
        const data = await repo.listByAuthor(authorId);
        setPosts(data);
      } catch (e: any) {
        setError(e.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    },
    [repo],
  );

  const createPost = useCallback(
    async (p: Omit<Post, "id" | "createdAt" | "updatedAt">) => {
      setLoading(true);
      setError(null);

      try {
        const created = await repo.create(p);
        setPosts((prev) => [created, ...prev]);
        return created;
      } finally {
        setLoading(false);
      }
    },
    [repo],
  );

  const updatePost = useCallback(
    async (id: string, data: Partial<Post>) => {
      setLoading(true);
      setError(null);

      try {
        const updated = await repo.update(id, data);
        setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        return updated;
      } finally {
        setLoading(false);
      }
    },
    [repo],
  );

  const deletePost = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        await repo.delete(id);
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } finally {
        setLoading(false);
      }
    },
    [repo],
  );

  const getById = useCallback(
    async (id: string) => {
      return repo.getById(id);
    },
    [repo],
  );

  return {
    posts,
    loading,
    error,
    loadByAuthor,
    createPost,
    updatePost,
    deletePost,
    getById,
  };
};
