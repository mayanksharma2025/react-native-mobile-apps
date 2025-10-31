import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";
import { authMiddleware } from "./middleware/auth";
import { formatError } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(authMiddleware);
app.use(requestLogger);

export const createApolloServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError,
        introspection: true,
        context: ({ req }) => ({ req }),
    });

    await server.start();
    server.applyMiddleware({ app, path: "/graphql" } as any);
    return server;
};

