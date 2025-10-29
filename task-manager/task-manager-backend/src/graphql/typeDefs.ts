import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: String!
    priority: String!
    banner: String
    createdBy: User!
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type PaginatedTasks {
    tasks: [Task!]!
    totalCount: Int!
    hasMore: Boolean!
  }

  input TaskInput {
    title: String!
    description: String
    status: String
    priority: String
    banner: String
  }

  type Query {
    me: User
    tasks(
      search: String
      status: String
      priority: String
      limit: Int!
      offset: Int!
    ): PaginatedTasks!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createTask(input: TaskInput!): Task!
    updateTask(id: ID!, input: TaskInput!): Task!
    deleteTask(id: ID!): Boolean!
    adminDeleteTask(id: ID!): Boolean!
  }
`;
