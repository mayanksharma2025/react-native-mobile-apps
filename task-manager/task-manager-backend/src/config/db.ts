import mongoose from "mongoose";

/**
 * Connect to MongoDB
 * @param uri Optional connection string (mainly used for tests)
 */
export const connectDB = async (uri?: string): Promise<void> => {
    const mongoURI =
        uri || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task_manager";

    try {
        await mongoose.connect(mongoURI);
        console.log("✅ MongoDB connected:", mongoURI);
    } catch (error) {
        console.error("❌ MongoDB connection failed:", (error as Error).message);
        // Only exit in production, not in test
        if (process.env.NODE_ENV !== "test") {
            process.exit(1);
        }
    }
};

/**
 * Gracefully disconnect from MongoDB
 * (Useful for Jest teardown)
 */
export const disconnectDB = async (): Promise<void> => {
    try {
        await mongoose.connection.close();
        console.log("🧹 Disconnected from MongoDB");
    } catch (error) {
        console.error("❌ Error disconnecting from MongoDB:", (error as Error).message);
    }
};
