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
    deleteUser(id: ID!): String!
    deleteUserAdmin(id: ID!): String!
    changeUserRole(id: ID!, role: String!): User!
    adminDeleteTask(id: ID!): Boolean!
  }

  type Mutation {
    updateUser(id: ID, name: String, email: String, password: String, role: String): User
  }


  type Project {
  id: ID!
  name: String!
  description: String
  members: [User!]
  tasks: [Task!]
  createdBy: User!
  createdAt: String
}

 type Comment {
  id: ID!
  task: Task!
  author: User!
  content: String!
  createdAt: String
}

 type Notification {
  id: ID!
  user: User!
  message: String!
  read: Boolean!
  type: String!
  createdAt: String
}

 type Activity {
  id: ID!
  action: String!
  user: User!
  entityType: String!
  entityId: ID!
  details: String
  createdAt: String
}

 type Query {
  projects(limit: Int, offset: Int): [Project!]
  comments(taskId: ID!): [Comment!]
  notifications: [Notification!]
  activities(limit: Int): [Activity!]
}

 type Mutation {
  createProject(name: String!, description: String): Project!
  addTaskToProject(projectId: ID!, taskId: ID!): Project!
  addMemberToProject(projectId: ID!, userId: ID!): Project!

  addComment(taskId: ID!, content: String!): Comment!
  markNotificationRead(id: ID!): Notification!
}

 type Query {
  getProject(id: ID!): Project
  getComment(id: ID!): Comment
  getNotification(id: ID!): Notification
  getActivity(id: ID!): Activity
}

 type Mutation {
  updateProject(id: ID!, name: String, description: String): Project!
  deleteProject(id: ID!): Boolean!

  updateComment(id: ID!, content: String!): Comment!
  deleteComment(id: ID!): Boolean!

  deleteNotification(id: ID!): Boolean!
  deleteActivity(id: ID!): Boolean!
}

`;



