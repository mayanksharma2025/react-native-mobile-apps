import { View, Text } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const MyComponent = () => {
  const { isAdmin, isUser, user } = useContext(AuthContext);

  return { isAdmin: user?.role === "admin", isUser: user?.role === "user" };
};
