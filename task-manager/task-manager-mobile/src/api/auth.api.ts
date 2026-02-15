import { getGraphQLClient } from "./graphqlClient";
import { AuthPayload } from "../types/auth.types";
import { IUser, UpdateUserInput, UserRole } from "../types/auth.types";
interface RegisterResponse {
  register: AuthPayload;
}

interface LoginResponse {
  login: AuthPayload;
}

export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthPayload> => {
  const client = await getGraphQLClient();
  const mutation = `
    mutation Register($name: String!, $email: String!, $password: String!) {
      register(name: $name, email: $email, password: $password) {
        token
        user {
          id
          name
          email
          role
        }
      }
    }
  `;

  const variables = { name, email, password };
  const data = await client.request<RegisterResponse>(mutation, variables);
  return data.register;
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthPayload> => {
  const client = await getGraphQLClient();
  const mutation = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          id
          name
          email
          role
        }
      }
    }
  `;

  const variables = { email, password };
  const data = await client.request<LoginResponse>(mutation, variables);
  return data.login;
};

export const updateUser = async (input: UpdateUserInput): Promise<IUser> => {
  const client = await getGraphQLClient();

  const mutation = `
    mutation UpdateUser(
      $id: ID
      $name: String
      $email: String
      $password: String
      $role: String
    ) {
      updateUser(
        id: $id
        name: $name
        email: $email
        password: $password
        role: $role
      ) {
        id
        name
        email
        role
      }
    }
  `;

  const data = await client.request<{ updateUser: IUser }>(mutation, input);

  return data.updateUser;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const client = await getGraphQLClient();

  const mutation = `
    mutation DeleteUser($deleteUserId: ID!) {
      deleteUser(id: $deleteUserId)
    }
  `;

  const variables = {
    deleteUserId: id,
  };

  const data = await client.request<{ deleteUser: boolean }>(
    mutation,
    variables,
  );

  return data.deleteUser;
};

export const changeUserRole = async (
  id: string,
  role: UserRole,
): Promise<IUser> => {
  const client = await getGraphQLClient();

  const mutation = `
    mutation ChangeUserRole($id: ID!, $role: String!) {
      changeUserRole(id: $id, role: $role) {
        id
        name
        email
        role
      }
    }
  `;

  const data = await client.request<{ changeUserRole: IUser }>(mutation, {
    id,
    role,
  });

  return data.changeUserRole;
};

export const fetchUsers = async (): Promise<IUser[]> => {
  const client = await getGraphQLClient();

  const query = `
    query Users {
      users {
        id
        name
        email
        role
      }
    }
  `;

  const data = await client.request<{ users: IUser[] }>(query);

  return data.users;
};
