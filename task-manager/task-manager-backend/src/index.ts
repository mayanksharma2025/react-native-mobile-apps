import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";
import { connectDB } from "./config/db";
import { authMiddleware } from "./middleware/auth";

const startServer = async () => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(authMiddleware);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({ req })
    });
    await server.start();
    server.applyMiddleware({ app, path: "/graphql" } as any);

    await connectDB();
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () =>
        console.log(`Server running on http://localhost:${PORT}/graphql`)
    );
};

startServer();
