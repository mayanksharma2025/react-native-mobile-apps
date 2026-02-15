import { getGraphQLClient } from "./graphqlClient";
import { AuthPayload } from "../types/auth.types";

interface RegisterResponse {
  register: AuthPayload;
}

interface LoginResponse {
  login: AuthPayload;
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
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

export const loginUser = async (email: string, password: string): Promise<AuthPayload> => {
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
