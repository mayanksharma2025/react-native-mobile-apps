// src/features/posts/hooks/usePosts.ts
import { useCallback, useEffect, useState } from "react";
import { IPostRepo, Post } from "../../posts/repositories/IPostRepo";
import { FirebasePostRepo } from "../../posts/repositories/FirebasePostRepo";

/**
 * Lightweight hook that talks to a post repository.
 * In a larger app you'd use React Query for caching & realtime listeners.
 */

const defaultRepo: IPostRepo = new FirebasePostRepo();

export const usePosts = (repo: IPostRepo = defaultRepo) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadByAuthor = useCallback(
    async (authorId: string) => {
      let isMounted = true;
      setLoading(true);
      setError(null);

      try {
        const data = await repo.listByAuthor(authorId);
        if (isMounted) setPosts(data);
      } catch (e: any) {
        if (isMounted) setError(e.message || "Failed to load posts");
      } finally {
        if (isMounted) setLoading(false);
      }

      return () => {
        isMounted = false;
      };
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
      } catch (e: any) {
        setError(e.message || "Failed to create post");
        throw e;
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
      } catch (e: any) {
        setError(e.message || "Failed to update post");
        throw e;
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
      } catch (e: any) {
        setError(e.message || "Failed to delete post");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [repo],
  );

  const getById = useCallback(
    async (id: string) => {
      try {
        return await repo.getById(id);
      } catch (e: any) {
        setError(e.message || "Failed to get post");
        return null;
      }
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
