import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import { connectDB } from "../src/config/db";
import mongoose from "mongoose";
import { createApolloServer } from "../src/app";

let apolloServer: any;

beforeAll(async () => {
    await connectDB(process.env.MONGO_URI_TEST);
    apolloServer = await createApolloServer();
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    if (apolloServer && apolloServer.stop) await apolloServer.stop(); // ✅ close Apollo
    console.log("🧹 Cleaned up everything!");
});