import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  updateUser,
  deleteUser,
  changeUserRole,
} from "../api/auth.api";
import { IUser, UserRole } from "../types/auth.types";

const USERS_KEY = ["users"];

// --- Fetch all users (admin only) ---
export const useUsers = () => {
  return useQuery<IUser[], Error>({
    queryKey: USERS_KEY,
    queryFn: fetchUsers,
    staleTime: 1000 * 60,
  });
};

// --- Update profile ---
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<IUser, Error, Partial<IUser>>({
    mutationFn: (input) => updateUser(input),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
};

// --- Delete user ---
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: USERS_KEY });

      const previousUsers = queryClient.getQueryData<IUser[]>(USERS_KEY);

      queryClient.setQueryData<IUser[]>(USERS_KEY, (old) =>
        old ? old.filter((user) => user.id !== deletedId) : old,
      );

      return { previousUsers };
    },

    onError: (_err, _id, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(USERS_KEY, context.previousUsers);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
};

// --- Change role ---
export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation<IUser, Error, { id: string; role: UserRole }>({
    mutationFn: ({ id, role }) => changeUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
};

// export const useAdminUpdateUser = () => {
//   const queryClient = useQueryClient();

//   return useMutation<IUser, Error, { id: string; data: Partial<IUser> }>({
//     mutationFn: ({ id, data }) => updateUser({ id, ...data }),

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: USERS_KEY });
//     },
//   });
// };

export const useAdminUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<IUser, Error, { id: string; data: Partial<IUser> }>({
    mutationFn: ({ id, data }) => updateUser({ id, ...data }),

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: USERS_KEY });

      const previousUsers = queryClient.getQueryData<IUser[]>(USERS_KEY);

      if (previousUsers) {
        queryClient.setQueryData<IUser[]>(
          USERS_KEY,
          (old) =>
            old?.map((user) =>
              user.id === id ? { ...user, ...data } : user,
            ) ?? [],
        );
      }

      return { previousUsers };
    },

    // 🔁 ROLLBACK IF ERROR
    onError: (_err, _variables, context: any) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(USERS_KEY, context.previousUsers);
      }
    },

    // 🔄 ENSURE SERVER STATE SYNC
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
};
