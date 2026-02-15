import { useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, registerUser } from "../api/auth.api";
import { IUser } from "../types/auth.types";

export interface AuthPayload {
  token: string;
  user: IUser;
}

export const useAuth = () => {
  const queryClient = useQueryClient();

  // --- LOGIN ---
  const loginMutation = useMutation<AuthPayload, Error, { email: string; password: string }>({
    mutationFn: async (variables) => {
      const data = await loginUser(variables.email, variables.password);
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(["me"], data.user);
      return data;
    },
  });

  // --- REGISTER ---
  const registerMutation = useMutation<AuthPayload, Error, { name: string; email: string; password: string }>({
    mutationFn: async (variables) => {
      const data = await registerUser(variables.name, variables.email, variables.password);
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(["me"], data.user);
      return data;
    },
  });

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    queryClient.clear();
  };

  return { loginMutation, registerMutation, logout };
};
