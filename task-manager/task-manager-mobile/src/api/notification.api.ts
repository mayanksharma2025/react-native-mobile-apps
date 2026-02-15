import { gql } from "graphql-request";
import { getGraphQLClient } from "./graphqlClient";

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  type: "task" | "project" | "system";
  createdAt: string;
}

const NOTIFICATIONS_QUERY = gql`
  query Notifications {
    notifications {
      id
      message
      read
      type
      createdAt
    }
  }
`;

export const fetchNotifications = async (): Promise<Notification[]> => {
  const client = await getGraphQLClient();
  const response = await client.request<{ notifications: Notification[] }>(
    NOTIFICATIONS_QUERY
  );
  return response.notifications;
};
