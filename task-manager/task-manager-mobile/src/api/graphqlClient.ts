import { GraphQLClient } from "graphql-request";
import AsyncStorage from "@react-native-async-storage/async-storage";

const endpoint = "http://localhost:4000/graphql";

export const getGraphQLClient = async (): Promise<GraphQLClient> => {
  const token = await AsyncStorage.getItem("token");

  return new GraphQLClient(endpoint, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
