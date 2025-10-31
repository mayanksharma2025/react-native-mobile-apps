import request from "supertest";
import mongoose from "mongoose";
import { app } from "../src/app"; // ensure app exports your Express server
import Task from "../src/models/Task";

const ENDPOINT = "/graphql";
let token = "";

beforeAll(async () => {
    jest.setTimeout(120000); // 2 minutes for setup
    const uri = "mongodb://127.0.0.1:27017/task_manager_test";
    console.log("✅ Connecting to local test database...");
    await mongoose.connect(uri);
    console.log(`✅ Connected to MongoDB: ${uri}`);

    // ✅ Register a test user
    const registerMutation = `
    mutation {
      register(name: "Task Tester", email: "tasktester@example.com", password: "password123") {
        token
        user {
          id
          email
        }
      }
    }
  `;

    const res = await request(app).post(ENDPOINT).send({ query: registerMutation });
    console.log("Registration response:", res.body.data);

    if (!res.body.data || !res.body.data.register) {
        throw new Error("❌ Registration failed. Response: " + JSON.stringify(res.body));
    }

    token = res.body.data.register.token;
    console.log("✅ Test user token acquired");
}, 60000);

afterAll(async () => {
    jest.setTimeout(120000);
    try {
        // Drop the DB safely if still connected
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
            console.log("🧹 Cleaned up everything!");
        }
    } catch (err) {
        console.error("❌ Error during teardown:", err);
    } finally {
        // Ensure Jest exits cleanly
        await new Promise((resolve) => setTimeout(resolve, 500));
    }
});


// 🧠 --- TEST 1: Create Task ---
describe("🧠 Task GraphQL Resolvers", () => {
    it("should create a task when authenticated", async () => {
        const mutation = `
      mutation {
        createTask(
          input: {
            title: "Task 1"
            description: "This is a test task"
            priority: "high"
          }
        ) {
          id
          title
          description
          priority
          createdBy {
            id
            email
          }
        }
      }
    `;

        const res = await request(app)
            .post(ENDPOINT)
            .set("Authorization", `Bearer ${token}`)
            .send({ query: mutation })
            .expect(200);

        console.log("Response:", res.body);

        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.createTask.title).toBe("Task 1");

        const count = await Task.countDocuments();
        expect(count).toBe(1);
    }, 60000);

    // 🧠 --- TEST 2: Fetch Tasks ---
    it("should fetch paginated tasks list", async () => {
        const query = `
      query {
        tasks(limit: 10, offset: 0) {
          tasks {
            id
            title
            description
            priority
          }
          totalCount
        }
      }
    `;

        const res = await request(app)
            .post(ENDPOINT)
            .set("Authorization", `Bearer ${token}`)
            .send({ query })
            .expect(200);

        console.log("Response:", res.body);

        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.tasks.tasks.length).toBeGreaterThan(0);
    }, 60000);
});


// 🧠 --- TEST 3: Update Task ---
it("should update a task when authenticated", async () => {
    const createMutation = `
    mutation {
      createTask(
        input: {
          title: "Task to Update"
          description: "Original description"
          priority: "medium"
        }
      ) {
        id
        title
        description
      }
    }
  `;

    const createRes = await request(app)
        .post(ENDPOINT)
        .set("Authorization", `Bearer ${token}`)
        .send({ query: createMutation })
        .expect(200);

    const taskId = createRes.body.data.createTask.id;
    expect(taskId).toBeDefined();

    const updateMutation = `
    mutation {
      updateTask(
        id: "${taskId}",
        input: {
          title: "Updated Task"
          description: "Updated description"
          priority: "low"
        }
      ) {
        id
        title
        description
        priority
      }
    }
  `;

    const res = await request(app)
        .post(ENDPOINT)
        .set("Authorization", `Bearer ${token}`)
        .send({ query: updateMutation })
        .expect(200);

    console.log("Update response:", res.body);

    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.updateTask.title).toBe("Updated Task");
    expect(res.body.data.updateTask.priority).toBe("low");
}, 60000);


// 🧠 --- TEST 4: Delete Task ---
it("should delete a task when authenticated", async () => {
    const createMutation = `
    mutation {
      createTask(
        input: {
          title: "Task to Delete"
          description: "This will be deleted"
          priority: "medium"
        }
      ) {
        id
      }
    }
  `;

    const createRes = await request(app)
        .post(ENDPOINT)
        .set("Authorization", `Bearer ${token}`)
        .send({ query: createMutation })
        .expect(200);

    const taskId = createRes.body.data.createTask.id;

    const deleteMutation = `
    mutation {
      deleteTask(id: "${taskId}")
    }
  `;

    const res = await request(app)
        .post(ENDPOINT)
        .set("Authorization", `Bearer ${token}`)
        .send({ query: deleteMutation })
        .expect(200);

    console.log("Delete response:", res.body);

    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.deleteTask).toBe(true);

    const exists = await Task.findById(taskId);
    expect(exists).toBeNull();
}, 60000);
