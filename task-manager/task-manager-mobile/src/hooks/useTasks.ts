import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/task.api";
import { ITask } from "../types/task.types";
import { queryKeys } from "../constants/queryKeys";

// --- Fetch tasks ---
export const useTasks = (limit: number, offset: number, userId: string) => {
  return useQuery<ITask[], Error>({
    queryKey: queryKeys.tasks(limit, offset, userId),
    queryFn: () => fetchTasks(limit, offset, userId),
    keepPreviousData: true,
    staleTime: 1000 * 60,
  } as any);
};

export const useTasksInfinite = (limit: number, userId: string) => {
  return useInfiniteQuery<ITask[], Error>({
    queryKey: ["tasks", limit, userId],
    queryFn: ({ pageParam = 0 }) =>
      fetchTasks(limit, pageParam as number, userId),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length * limit;
    },
    staleTime: 1000 * 60,
    initialPageParam: 0,
  });
};

// --- Create task ---
export const useCreateTask = (
  limit: number,
  offset: number,
  userId: string,
) => {
  const queryClient = useQueryClient();
  const key = queryKeys.tasks(limit, offset, userId);

  return useMutation<
    ITask,
    Error,
    {
      title: string;
      description?: string;
      status: "pending" | "in-progress" | "completed";
      priority: "low" | "medium" | "high";
      banner?: string;
      createdBy: string;
    },
    { previous?: ITask[] }
  >({
    mutationFn: (input) => createTask(input),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<ITask[]>(key) ?? [];

      const optimisticTask: ITask = {
        id: `temp-${Date.now()}`,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        banner: newTask.banner,
        createdBy: {
          id: newTask.createdBy,
          name: "",
          email: "",
          role: "user",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<ITask[]>(key, [...previous, optimisticTask]);

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.invalidateQueries({ queryKey: ["tasks", limit, userId] });
    },
  });
};

// --- Update task ---
export const useUpdateTask = (
  limit: number,
  offset: number,
  userId: string,
) => {
  const queryClient = useQueryClient();
  const key = queryKeys.tasks(limit, offset, userId);

  return useMutation<
    ITask,
    Error,
    { id: string; input: Partial<ITask> },
    { previous?: ITask[] }
  >({
    mutationFn: ({ id, input }) => updateTask(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<ITask[]>(key);

      if (previous) {
        queryClient.setQueryData<ITask[]>(
          key,
          previous.map((task) =>
            task.id === id ? { ...task, ...input } : task,
          ),
        );
      }

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.invalidateQueries({ queryKey: ["tasks", limit, userId] });
    },
  });
};

// --- Delete task ---
export const useDeleteTask = (
  limit: number,
  offset: number,
  userId: string,
) => {
  const queryClient = useQueryClient();
  const key = queryKeys.tasks(limit, offset, userId);

  return useMutation<boolean, Error, string, { previous?: ITask[] }>({
    mutationFn: (id) => deleteTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<ITask[]>(key);

      if (previous) {
        queryClient.setQueryData<ITask[]>(
          key,
          previous.filter((t) => t.id !== id),
        );
      }

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.invalidateQueries({ queryKey: ["tasks", limit, userId] });
    },
  });
};
