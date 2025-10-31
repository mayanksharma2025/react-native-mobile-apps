import mongoose from "mongoose";
import request from "supertest";
import { createApolloServer, app } from "../src/app";
import { connectDB, disconnectDB } from "../src/config/db";

jest.setTimeout(120000); // 2 min timeout

let server: any;
let token: string;

beforeAll(async () => {
  process.env.MONGO_URI_TEST = "mongodb://127.0.0.1:27017/task_manager_test";
  process.env.JWT_SECRET = "yourSecretKey";

  console.log("✅ Connecting to test database...");
  await connectDB(process.env.MONGO_URI_TEST);

  server = await createApolloServer();
  console.log("✅ Test server started");
});

afterAll(async () => {
  console.log("🧹 Cleaning up...");
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase();
      console.log("🧹 Test DB dropped");
    }
    if (server?.stop) await server.stop();
    await disconnectDB();
    console.log("✅ Cleanup completed");
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
  }
});

describe("🧑‍💻 User API Tests", () => {
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

    token = res.body.data.register.token;
  });

  it("fails to register with existing email", async () => {
    const res = await request(app)
      .post("/graphql")
      .send({
        query: `
          mutation {
            register(name: "Jane Doe", email: "john@example.com", password: "password123") {
              token
              user {
                email
              }
            }
          }
        `,
      });

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toMatch(/email already in use/i);
  });

  it("logs in a user successfully", async () => {
    const res = await request(app)
      .post("/graphql")
      .send({
        query: `
          mutation {
            login(email: "john@example.com", password: "password123") {
              token
              user {
                email
              }
            }
          }
        `,
      });

    console.log("Login response:", JSON.stringify(res.body, null, 2)); // 👈 add this

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.login.user.email).toBe("john@example.com");
    token = res.body.data.login.token;
  });

  it("fetches current user info when authenticated", async () => {
    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: `
          query {
            me {
              email
              name
            }
          }
        `,
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.me.email).toBe("john@example.com");
  });
});
