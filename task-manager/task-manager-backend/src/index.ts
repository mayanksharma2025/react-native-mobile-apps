import "dotenv/config";
import mongoose from "mongoose";
import { app, createApolloServer } from "./app";
import { connectDB } from "./config/db";
import logger from "./utils/logger";

const PORT = process.env.PORT || 4000;

(async () => {
    await connectDB();
    await createApolloServer();
    app.listen(PORT, () => logger.info(`🚀 Server running at http://localhost:${PORT}/graphql`));
})();
