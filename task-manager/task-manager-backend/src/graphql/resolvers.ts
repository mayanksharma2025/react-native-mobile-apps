import bcrypt from "bcryptjs";
import User from "../models/User";
import Task from "../models/Task";
import { generateToken } from "../utils/generateToken";
import { AuthRequest } from "../middleware/auth";

export const resolvers = {
    Query: {
        me: async (_: any, __: any, { req }: { req: AuthRequest }) => {
            if (!req.user) throw new Error("Not authenticated");
            return await User.findById(req.user.id);
        },

        tasks: async (
            _: any,
            { search, status, priority, limit, offset }: any,
            { req }: { req: AuthRequest }
        ) => {
            if (!req.user) throw new Error("Not authenticated");

            const filter: any = {};
            if (status) filter.status = status;
            if (priority) filter.priority = priority;
            if (search) filter.title = { $regex: search, $options: "i" };

            const totalCount = await Task.countDocuments(filter);
            const tasks = await Task.find(filter)
                .skip(offset)
                .limit(limit)
                .populate("createdBy");

            return {
                tasks,
                totalCount,
                hasMore: offset + limit < totalCount
            };
        }
    },

    Mutation: {
        register: async (_: any, { name, email, password }: any) => {
            const existing = await User.findOne({ email });
            if (existing) throw new Error("Email already in use");
            const hashed = await bcrypt.hash(password, 10);
            const user = await User.create({ name, email, password: hashed });
            const token = generateToken(user);
            return { token, user };
        },

        login: async (_: any, { email, password }: any) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error("Invalid credentials");
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new Error("Invalid credentials");
            const token = generateToken(user);
            return { token, user };
        },

        createTask: async (_: any, { input }: any, { req }: { req: AuthRequest }) => {
            if (!req.user) throw new Error("Not authenticated");
            const task = await Task.create({ ...input, createdBy: req.user.id });
            return task.populate("createdBy");
        },

        updateTask: async (_: any, { id, input }: any, { req }: { req: AuthRequest }) => {
            if (!req.user) throw new Error("Not authenticated");
            const task = await Task.findById(id);
            if (!task) throw new Error("Task not found");
            if (req.user.id !== task.createdBy.toString() && req.user.role !== "admin")
                throw new Error("Unauthorized");
            Object.assign(task, input);
            await task.save();
            return task.populate("createdBy");
        },

        deleteTask: async (_: any, { id }: any, { req }: { req: AuthRequest }) => {
            if (!req.user) throw new Error("Not authenticated");
            const task = await Task.findById(id);
            if (!task) throw new Error("Task not found");
            if (req.user.id !== task.createdBy.toString())
                throw new Error("Unauthorized");
            await task.deleteOne();
            return true;
        },

        adminDeleteTask: async (_: any, { id }: any, { req }: { req: AuthRequest }) => {
            if (!req.user || req.user.role !== "admin")
                throw new Error("Admin only");
            await Task.findByIdAndDelete(id);
            return true;
        }
    }
};
