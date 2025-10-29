import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";
import { connectDB } from "./config/db";
import { authMiddleware } from "./middleware/auth";
import { formatError } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import logger from "./utils/logger";

const startServer = async () => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(authMiddleware);
    app.use(requestLogger);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError,
        introspection: process.env.NODE_ENV !== "production",
        context: ({ req }) => ({ req }),
    });

    await server.start();
    server.applyMiddleware({ app, path: "/graphql" } as any);

    await connectDB();

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        logger.info(`🚀 Server running at http://localhost:${PORT}/graphql`);
    });

    process.on("SIGINT", async () => {
        await mongoose.connection.close();
        logger.info("🛑 MongoDB connection closed. Exiting...");
        process.exit(0);
    });
};

startServer();
