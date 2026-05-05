import { GraphQLClient } from "graphql-request";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const endpoint = "http://localhost:4000/graphql";

// ----------------Check your IPAddress --------------------------
// E:\mobile-apps\react-native-mobile-apps\task-manager\task-manager-mobile>ipconfig
const endpoint = "http://192.168.29.33:4000/graphql";

export const getGraphQLClient = async (): Promise<GraphQLClient> => {
  const token = await AsyncStorage.getItem("token");

  return new GraphQLClient(endpoint, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
