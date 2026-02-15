export const queryKeys = {
  me: ["me"] as const,
  tasks: (limit: number, offset: number, userId?: string) =>
    ["tasks", limit, offset, userId] as const,
};
