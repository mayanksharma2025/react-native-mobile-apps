import { useQuery, useMutation, useQueryClient, useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api/task.api";
import { ITask } from "../types/task.types";
import { queryKeys } from "../constants/queryKeys";

// --- Fetch tasks ---
export const useTasks = (limit: number, offset: number) => {
  return useQuery<ITask[], Error>({
    queryKey: queryKeys.tasks(limit, offset),
    queryFn: () => fetchTasks(limit, offset),
    keepPreviousData: true,
    staleTime: 1000 * 60,
  } as any);
};

export const useTasksInfinite = (limit: number) => {
  return useInfiniteQuery<ITask[], Error, ITask[], [string, number]>({
    queryKey: ["tasks", limit],
    queryFn: ({ pageParam = 0 }) => fetchTasks(limit, pageParam as any),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length * limit;
    },
    staleTime: 1000 * 60,
    keepPreviousData: true,
    initialPageParam: 0, // ✅ Required for object syntax
  } as UseInfiniteQueryOptions<ITask[], Error, ITask[], [string, number]>);
};


// --- Create task ---
export const useCreateTask = (limit: number, offset: number) => {
  const queryClient = useQueryClient();
  const key = queryKeys.tasks(limit, offset);

  return useMutation<ITask, Error, { title: string; description?: string }>({
    mutationFn: (input) => createTask(input),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<ITask[]>(key);

      if (previous) {
        queryClient.setQueryData<ITask[]>(key, [
          ...previous,
          {
            ...newTask,
            id: `temp-${Date.now()}`,
            createdBy:
              previous[0]?.createdBy || { id: "", name: "", email: "", role: "" },
            status: "pending",
            priority: "medium",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as any,
        ]);
      }

      return { previous };
    },
    onError: (_err, _newTask, context: any) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};

// --- Update task ---
// --- Update Task ---
export const useUpdateTask = (limit: number, offset: number) => {
  const queryClient = useQueryClient();
  const key = queryKeys.tasks(limit, offset);

  return useMutation<ITask, Error, { id: string; input: Partial<ITask> }>({
    mutationFn: ({ id, input }) => updateTask(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<ITask[]>(key);

      if (previous) {
        queryClient.setQueryData<ITask[]>(
          key,
          previous.map((task : any) => (task._id === id ? { ...task, ...input } : task))
        );
      }

      return { previous };
    },
    onError: (_err, _vars, context: any) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};


// --- Delete Task ---
export const useDeleteTask = (limit: number, offset: number) => {
  const queryClient = useQueryClient();
  const key = queryKeys.tasks(limit, offset);

  return useMutation<boolean, Error, string>({
    mutationFn: (id) => deleteTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<ITask[]>(key);

      if (previous) {
        queryClient.setQueryData<ITask[]>(key, previous.filter((t) => t.id !== id));
      }

      return { previous };
    },
    onError: (_err, _id, context: any) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};
