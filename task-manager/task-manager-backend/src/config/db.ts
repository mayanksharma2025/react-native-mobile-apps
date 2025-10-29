import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("DB connection error", error);
        process.exit(1);
    }
};
