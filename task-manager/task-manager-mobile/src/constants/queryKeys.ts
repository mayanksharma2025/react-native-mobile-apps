export const queryKeys = {
  me: ["me"] as const,
  tasks: (limit: number, offset: number) =>
    ["tasks", limit, offset] as const,
};
