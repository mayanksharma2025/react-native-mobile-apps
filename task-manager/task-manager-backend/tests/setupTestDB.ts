import mongoose from "mongoose";

beforeAll(async () => {
    jest.setTimeout(120000); // 2 minutes for setup
    const uri = "mongodb://127.0.0.1:27017/task_manager_test";
    console.log("✅ Connecting to local test database...");
    await mongoose.connect(uri);
    console.log(`✅ Connected to MongoDB: ${uri}`);
});

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
