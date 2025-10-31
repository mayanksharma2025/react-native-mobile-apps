import mongoose from "mongoose";
import request from "supertest";
import { app, createApolloServer } from "../src/app";
import { connectDB, disconnectDB } from "../src/config/db";

jest.setTimeout(60000); // extend Jest timeout to 60s

let apolloServer: any;

beforeAll(async () => {
  process.env.MONGO_URI_TEST = "mongodb://127.0.0.1:27017/task_manager_test";
  process.env.JWT_SECRET = "yourSecretKey";

  console.log("✅ Connecting to test database...");
  await connectDB(process.env.MONGO_URI_TEST);

  apolloServer = await createApolloServer();
  console.log("✅ Apollo Server started for testing");
});

afterAll(async () => {
  console.log("🧹 Cleaning up test database...");

  try {
    // Drop database if still connected
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      console.log("🧹 Database dropped and connection closed");
    }

    // Stop Apollo server safely
    if (apolloServer && apolloServer.stop) {
      await apolloServer.stop();
      console.log("🧹 Apollo Server stopped");
    }

    // Force process to end cleanly
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    console.error("❌ Cleanup error:", error);
  }
});


describe("User Register API", () => {
  it("registers a new user successfully", async () => {
    const res = await request(app)
      .post("/graphql")
      .send({
        query: `
          mutation {
            register(name: "John Doe", email: "john@example.com", password: "password123") {
              token
              user {
                name
                email
              }
            }
          }
        `,
      });

    console.log("GraphQL response:", res.body);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.register.user.name).toBe("John Doe");
    expect(res.body.data.register.user.email).toBe("john@example.com");
    expect(res.body.data.register.token).toBeDefined();
  });
});
