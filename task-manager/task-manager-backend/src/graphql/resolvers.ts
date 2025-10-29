import bcrypt from "bcryptjs";
import User from "../models/User";
import Task from "../models/Task";
import Project from "../models/Project";
import Comment from "../models/Comment";
import Notification from "../models/Notification";
import Activity from "../models/Activity";
import { generateToken } from "../utils/generateToken";
import { AuthRequest } from "../middleware/auth";

const baseResolvers = {
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





export const extendedResolvers = {
    Query: {
        projects: async (_: any, { limit = 10, offset = 0 }: any, { req }: any) => {
            if (!req.user) throw new Error("Not authenticated");
            return await Project.find({ members: req.user.id })
                .populate("members")
                .populate("tasks")
                .skip(offset)
                .limit(limit);
        },
        comments: async (_: any, { taskId }: any) => {
            return await Comment.find({ task: taskId }).populate("author");
        },
        notifications: async (_: any, __: any, { req }: any) => {
            if (!req.user) throw new Error("Not authenticated");
            return await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        },
        activities: async (_: any, { limit = 10 }: any) => {
            return await Activity.find().sort({ createdAt: -1 }).limit(limit).populate("user");
        },
        getProject: async (_: any, { id }: any, { req }: any) => {
            if (!req.user) throw new Error("Not authenticated");
            return await Project.findById(id)
                .populate("members")
                .populate("tasks")
                .populate("createdBy");
        },

        getComment: async (_: any, { id }: any) => {
            return await Comment.findById(id).populate(["task", "author"]);
        },

        getNotification: async (_: any, { id }: any, { req }: any) => {
            if (!req.user) throw new Error("Not authenticated");
            return await Notification.findOne({ _id: id, user: req.user.id });
        },

        getActivity: async (_: any, { id }: any) => {
            return await Activity.findById(id).populate("user");
        },
    },

    Mutation: {
        createProject: async (_: any, { name, description }: any, { req }: any) => {
            if (!req.user) throw new Error("Not authenticated");
            const project = await Project.create({
                name,
                description,
                members: [req.user.id],
                createdBy: req.user.id
            });
            await Activity.create({
                action: "CREATE_PROJECT",
                user: req.user.id,
                entityType: "Project",
                entityId: project._id,
                details: `Created project ${name}`
            });
            return project.populate("members");
        },

        addTaskToProject: async (_: any, { projectId, taskId }: any, { req }: any) => {
            if (!req.user) throw new Error("Not authenticated");
            const project = await Project.findById(projectId);
            if (!project) throw new Error("Project not found");
            project.tasks.push(taskId);
            await project.save();
            await Activity.create({
                action: "ADD_TASK",
                user: req.user.id,
                entityType: "Project",
                entityId: projectId,
                details: `Added task ${taskId}`
            });
            return project.populate(["members", "tasks"]);
        },

        addMemberToProject: async (_: any, { projectId, userId }: any, { req }: any) => {
            if (!req.user) throw new Error("Not authenticated");
            const project = await Project.findById(projectId);
            if (!project) throw new Error("Project not found");
            if (!project.members.includes(userId)) project.members.push(userId);
            await project.save();
            await Notification.create({
                user: userId,
                message: `You've been added to project ${project.name}`,
                type: "project"
            });
            return project.populate("members");
        },

        addComment: async (_: any, { taskId, content }: any, { req }: any) => {
            if (!req.user) throw new Error("Not authenticated");
            const comment = await Comment.create({
                task: taskId,
                author: req.user.id,
                content
            });
            await Activity.create({
                action: "ADD_COMMENT",
                user: req.user.id,
                entityType: "Task",
                entityId: taskId,
                details: content.slice(0, 50)
            });
            return comment.populate(["author", "task"]);
        },

        markNotificationRead: async (_: any, { id }: any, { req }: any) => {
            if (!req.user) throw new Error("Not authenticated");
            const notif = await Notification.findOneAndUpdate(
                { _id: id, user: req.user.id },
                { read: true },
                { new: true }
            );
            return notif;
        }
    },

    updateProject: async (_: any, { id, name, description }: any, { req }: any) => {
        if (!req.user) throw new Error("Not authenticated");
        const project = await Project.findById(id);
        if (!project) throw new Error("Project not found");
        if (project.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
            throw new Error("Unauthorized");
        }

        if (name) project.name = name;
        if (description) project.description = description;
        await project.save();

        await Activity.create({
            action: "UPDATE_PROJECT",
            user: req.user.id,
            entityType: "Project",
            entityId: project._id,
            details: `Updated project ${project.name}`,
        });

        return project.populate(["members", "tasks"]);
    },

    deleteProject: async (_: any, { id }: any, { req }: any) => {
        if (!req.user) throw new Error("Not authenticated");
        const project = await Project.findById(id);
        if (!project) throw new Error("Project not found");
        if (project.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
            throw new Error("Unauthorized");
        }

        await project.deleteOne();
        await Activity.create({
            action: "DELETE_PROJECT",
            user: req.user.id,
            entityType: "Project",
            entityId: id,
            details: `Deleted project ${project.name}`,
        });
        return true;
    },

    updateComment: async (_: any, { id, content }: any, { req }: any) => {
        if (!req.user) throw new Error("Not authenticated");
        const comment = await Comment.findById(id);
        if (!comment) throw new Error("Comment not found");
        if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
            throw new Error("Unauthorized");
        }

        comment.content = content;
        await comment.save();

        await Activity.create({
            action: "UPDATE_COMMENT",
            user: req.user.id,
            entityType: "Task",
            entityId: comment.task,
            details: content.slice(0, 50),
        });

        return comment.populate(["task", "author"]);
    },

    deleteComment: async (_: any, { id }: any, { req }: any) => {
        if (!req.user) throw new Error("Not authenticated");
        const comment = await Comment.findById(id);
        if (!comment) throw new Error("Comment not found");
        if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
            throw new Error("Unauthorized");
        }

        await comment.deleteOne();

        await Activity.create({
            action: "DELETE_COMMENT",
            user: req.user.id,
            entityType: "Task",
            entityId: comment.task,
            details: `Deleted comment`,
        });

        return true;
    },

    deleteNotification: async (_: any, { id }: any, { req }: any) => {
        if (!req.user) throw new Error("Not authenticated");
        const notification = await Notification.findOne({
            _id: id,
            user: req.user.id,
        });
        if (!notification) throw new Error("Notification not found");

        await notification.deleteOne();

        return true;
    },

    deleteActivity: async (_: any, { id }: any, { req }: any) => {
        if (!req.user || req.user.role !== "admin")
            throw new Error("Admin only");
        await Activity.findByIdAndDelete(id);
        return true;
    },
};


const resolvers = {
    Query: { ...baseResolvers.Query, ...extendedResolvers.Query },
    Mutation: { ...baseResolvers.Mutation, ...extendedResolvers.Mutation }
};

export { resolvers }