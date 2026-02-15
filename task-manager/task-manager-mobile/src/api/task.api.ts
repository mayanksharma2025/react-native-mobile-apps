import { getGraphQLClient } from "./graphqlClient";
import { ITask } from "../types/task.types";

// --- Fetch tasks ---
export const fetchTasks = async (
  limit: number,
  offset: number,
  userId?: string,
): Promise<ITask[]> => {
  const client = await getGraphQLClient();

  const query = `
    query Tasks($limit: Int!, $offset: Int!, $createdBy: [ID!]) {
      tasks(limit: $limit, offset: $offset, createdBy: $createdBy) {
        tasks {
          id
          title
          description
          status
          priority
          createdBy {
            id
            name
            email
            role
          }
          createdAt
          updatedAt
        }
      }
    }
  `;

  const variables = {
    limit,
    offset,
    createdBy: [userId],
  };

  const data = await client.request<{
    tasks: { tasks: ITask[] };
  }>(query, variables);

  return data.tasks.tasks;
};

// --- Create task ---
export const createTask = async (input: {
  title: string;
  description?: string;
}): Promise<ITask> => {
  const client = await getGraphQLClient();
  const mutation = `
    mutation CreateTask($input: TaskInput!) {
      createTask(input: $input) {
        id
        title
        description
        status
        priority
        createdBy {
          id
          name
          email
          role
        }
        createdAt
        updatedAt
      }
    }
  `;
  const variables = { input };
  const data = await client.request<{ createTask: ITask }>(mutation, variables);
  return data.createTask;
};

// --- Update task ---
export const updateTask = async (
  id: string,
  input: Partial<ITask>,
): Promise<ITask> => {
  const client = await getGraphQLClient();
  const mutation = `
    mutation UpdateTask($id: ID!, $input: TaskInput!) {
      updateTask(id: $id, input: $input) {
        id
        title
        description
        status
        priority
        createdBy {
          id
          name
          email
          role
        }
        createdAt
        updatedAt
      }
    }
  `;
  const variables = { id, input };
  const data = await client.request<{ updateTask: ITask }>(mutation, variables);
  return data.updateTask;
};

// --- Delete task ---
export const deleteTask = async (id: string): Promise<boolean> => {
  const client = await getGraphQLClient();
  const mutation = `
    mutation DeleteTask($id: ID!) {
      deleteTask(id: $id)
    }
  `;
  const variables = { id };
  const data = await client.request<{ deleteTask: boolean }>(
    mutation,
    variables,
  );
  return data.deleteTask;
};
